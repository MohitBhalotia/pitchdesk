import crypto from "crypto";
import KnowledgeSourceModel from "../../../src/models/KnowledgeSourceModel";
import KnowledgeBaseModel from "../../../src/models/KnowledgeBaseModel";
import KnowledgeChunkModel from "../../../src/models/KnowledgeChunkModel";
import StartupFactModel from "../../../src/models/StartupFactModel";
import { buildAuthenticatedDownloadUrl } from "../../../src/lib/cloudinary";
import { parseDocumentWithUnstructured } from "../../../src/lib/ingestion/unstructuredClient";
import { normalizeElements } from "../../../src/lib/ingestion/normalizeElements";
import { chunkElements } from "../../../src/lib/ingestion/chunkElements";
import { extractStartupFacts } from "../../../src/lib/ingestion/extractStartupFacts";
import { embedTexts } from "../../../src/lib/ingestion/embedTexts";
import { buildStartupBrief } from "../../../src/lib/ingestion/buildStartupBrief";
import { detectFactConflicts } from "../../../src/lib/ingestion/factConflicts";
import {
  EMBEDDING_MODEL,
  EMBEDDING_MODEL_VERSION,
  MAX_PAGES_PER_DOCUMENT,
} from "../../../src/lib/ingestion/limits";
import type { UnstructuredElement } from "../../../src/lib/ingestion/types";

/** A failure that retrying can never fix -- BullMQ should not burn attempts on it. */
class NonRetryableIngestError extends Error {}

const ACTIVE_PROCESSING_STAGES = ["queued", "parsing", "extracting", "embedding"];

async function recomputeKnowledgeBaseStatus(knowledgeBaseId: unknown) {
  const sources = await KnowledgeSourceModel.find({ knowledgeBaseId }).select("stage").lean();
  let status: KnowledgeBaseStatus;
  if (sources.some((s) => ACTIVE_PROCESSING_STAGES.includes(s.stage))) {
    status = "processing";
  } else if (sources.some((s) => s.stage === "ready")) {
    // At least one source is ready -- preserve that even if a later source
    // failed (Section 5 exit condition: don't lose a working Knowledge Base).
    status = "ready";
  } else if (sources.length > 0) {
    status = "failed";
  } else {
    status = "empty";
  }
  await KnowledgeBaseModel.updateOne({ _id: knowledgeBaseId }, { $set: { status } });
}

/**
 * The ingest-source pipeline (plans/RAG_feature.md Phase 2): parse ->
 * normalize -> chunk -> extract facts -> embed -> publish. Runs entirely on
 * the worker, never inline in a Next.js route.
 */
export async function runIngestSourceJob(sourceId: string, revision: number): Promise<void> {
  const source = await KnowledgeSourceModel.findById(sourceId);
  if (!source) return; // deleted after the job was enqueued
  if (source.revision !== revision) return; // superseded by a newer retry
  if (source.stage === "ready") return; // already processed -- defends against duplicate delivery

  try {
    if (source.contentHash) {
      const duplicate = await KnowledgeSourceModel.findOne({
        roomId: source.roomId,
        contentHash: source.contentHash,
        stage: "ready",
        _id: { $ne: source._id },
      });
      if (duplicate) {
        throw new NonRetryableIngestError("This content has already been added to this room");
      }
    }

    let elements: UnstructuredElement[];
    if (source.sourceType === "pasted_text") {
      elements = [{ type: "NarrativeText", text: source.pastedText ?? "" }];
    } else {
      source.stage = "parsing";
      await source.save();

      if (!source.cloudinaryPublicId || !source.cloudinaryResourceType) {
        throw new NonRetryableIngestError("Source has no confirmed upload to parse");
      }

      const downloadUrl = buildAuthenticatedDownloadUrl(
        source.cloudinaryPublicId,
        source.cloudinaryResourceType as "image" | "raw"
      );
      const response = await fetch(downloadUrl);
      if (!response.ok) {
        throw new Error(`Failed to download source from Cloudinary: ${response.status}`);
      }
      const buffer = Buffer.from(await response.arrayBuffer());
      elements = await parseDocumentWithUnstructured(buffer, source.fileName ?? "document");
    }

    const normalized = normalizeElements(elements);
    const pageLocators = new Set(normalized.map((el) => el.locator).filter(Boolean));
    if (pageLocators.size > MAX_PAGES_PER_DOCUMENT) {
      throw new NonRetryableIngestError(
        `Document exceeds the ${MAX_PAGES_PER_DOCUMENT}-page limit (${pageLocators.size} pages found)`
      );
    }
    source.pageCount = pageLocators.size || null;

    const chunkCandidates = chunkElements(normalized);
    if (chunkCandidates.length === 0) {
      throw new NonRetryableIngestError("No extractable content found in this source");
    }

    source.stage = "extracting";
    await source.save();

    // A single bad chunk shouldn't fail the whole source -- extraction is
    // best-effort per chunk.
    const factsByChunk = await Promise.all(
      chunkCandidates.map((chunk) => extractStartupFacts(chunk.text).catch(() => []))
    );

    source.stage = "embedding";
    await source.save();

    const embeddings = await embedTexts(chunkCandidates.map((c) => c.text));

    const kb = await KnowledgeBaseModel.findById(source.knowledgeBaseId);
    if (!kb) {
      throw new Error("Knowledge base not found for source");
    }
    const newRevision = kb.activeRevision + 1;

    const chunkDocs = chunkCandidates.map((chunk, i) => ({
      userId: source.userId,
      roomId: source.roomId,
      knowledgeBaseId: source.knowledgeBaseId,
      knowledgeBaseRevision: newRevision,
      sourceId: source._id,
      sourceType: source.sourceType,
      elementType: chunk.elementType,
      locator: chunk.locator,
      chunkIndex: chunk.chunkIndex,
      tokenCount: chunk.tokenCount,
      text: chunk.text,
      embedding: embeddings[i],
      embeddingModel: EMBEDDING_MODEL,
      embeddingModelVersion: EMBEDDING_MODEL_VERSION,
      contentHash: crypto.createHash("sha256").update(chunk.text).digest("hex"),
    }));
    await KnowledgeChunkModel.insertMany(chunkDocs);

    const factDocs = factsByChunk.flatMap((facts, i) =>
      facts.map((fact) => ({
        userId: source.userId,
        roomId: source.roomId,
        knowledgeBaseId: source.knowledgeBaseId,
        metric: fact.metric,
        rawValue: fact.rawValue,
        numericValue: fact.numericValue,
        unit: fact.unit,
        currency: fact.currency,
        period: fact.period,
        valueType: fact.valueType,
        confidence: fact.confidence,
        provenance: "extracted" as const,
        status: "active" as const,
        sourceId: source._id,
        locator: chunkCandidates[i].locator,
      }))
    );
    if (factDocs.length > 0) {
      await StartupFactModel.insertMany(factDocs);
    }

    const allActiveFacts = await StartupFactModel.find({
      roomId: source.roomId,
      status: "active",
    }).lean();
    const contradictions = detectFactConflicts(allActiveFacts);

    const startupBrief = await buildStartupBrief(
      chunkCandidates.map((c) => c.text),
      allActiveFacts.map((f) => ({ metric: f.metric, rawValue: f.rawValue, period: f.period }))
    ).catch(() => kb.startupBrief ?? "");

    const totalChunks = await KnowledgeChunkModel.countDocuments({
      knowledgeBaseId: kb._id,
    });

    await KnowledgeBaseModel.updateOne(
      { _id: kb._id },
      {
        $set: {
          activeRevision: newRevision,
          startupBrief,
          contradictions,
          chunkCount: totalChunks,
        },
      }
    );

    source.stage = "ready";
    source.errorMessage = null;
    await source.save();

    await recomputeKnowledgeBaseStatus(source.knowledgeBaseId);
  } catch (error) {
    const isNonRetryable = error instanceof NonRetryableIngestError;
    source.stage = "failed";
    source.errorMessage = error instanceof Error ? error.message.slice(0, 500) : "Ingestion failed";
    await source.save();

    await recomputeKnowledgeBaseStatus(source.knowledgeBaseId);

    if (isNonRetryable) return; // don't let BullMQ retry something that can never succeed
    throw error; // let BullMQ retry with backoff
  }
}
