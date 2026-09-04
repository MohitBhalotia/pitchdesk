import crypto from "crypto";
import mongoose from "mongoose";
import KnowledgeChunkModel from "@/models/KnowledgeChunkModel";
import { embedTexts } from "@/lib/ingestion/embedTexts";
import { cacheGet, cacheSet } from "@/lib/redis";

/**
 * Live retrieval for the `search_knowledge_base` Deepgram tool
 * (plans/RAG_feature.md Section 2). Runs vector search and full-text search
 * in parallel against the Atlas indexes declared in
 * scripts/atlas/indexDefinitions.ts, fuses results in application code
 * (reciprocal rank fusion -- no dependency on Atlas 8-only fusion
 * operators), and returns at most a handful of cited passages capped to a
 * fixed character budget.
 *
 * Every query filters on userId + roomId + knowledgeBaseId as hard
 * predicates -- this is the tenant-isolation mechanism the whole feature
 * depends on. Chunks are never re-tagged when a room's Knowledge Base
 * revision bumps (each source's chunks keep the revision they were created
 * at), so retrieval intentionally does NOT filter on knowledgeBaseRevision;
 * the revision is only used as a retrieval-cache invalidation key.
 */

const VECTOR_INDEX = "knowledge_chunks_vector_index";
const TEXT_INDEX = "knowledge_chunks_text_index";
const CANDIDATE_LIMIT = 20;
const RESULT_LIMIT = 6;
const MAX_OUTPUT_CHARS = 3500;
const RETRIEVAL_CACHE_TTL_SECONDS = 8 * 60;
const RRF_K = 60;

export interface KnowledgeBaseSearchScope {
  userId: string;
  roomId: string;
  knowledgeBaseId: string;
  knowledgeBaseRevision: number;
}

export interface RetrievedPassage {
  chunkId: string;
  text: string;
  locator: string | null;
  elementType: string;
  sourceId: string;
}

interface RawChunkHit {
  _id: mongoose.Types.ObjectId;
  text: string;
  locator: string | null;
  elementType: string;
  sourceId: mongoose.Types.ObjectId;
}

function tenantFilter(scope: KnowledgeBaseSearchScope) {
  return {
    userId: new mongoose.Types.ObjectId(scope.userId),
    roomId: new mongoose.Types.ObjectId(scope.roomId),
    knowledgeBaseId: new mongoose.Types.ObjectId(scope.knowledgeBaseId),
  };
}

async function runVectorSearch(
  scope: KnowledgeBaseSearchScope,
  queryVector: number[]
): Promise<RawChunkHit[]> {
  const filter = tenantFilter(scope);
  return KnowledgeChunkModel.aggregate([
    {
      $vectorSearch: {
        index: VECTOR_INDEX,
        path: "embedding",
        queryVector,
        numCandidates: 150,
        limit: CANDIDATE_LIMIT,
        filter: { $and: [{ userId: filter.userId }, { roomId: filter.roomId }, { knowledgeBaseId: filter.knowledgeBaseId }] },
      },
    },
    { $project: { text: 1, locator: 1, elementType: 1, sourceId: 1 } },
  ]);
}

async function runTextSearch(
  scope: KnowledgeBaseSearchScope,
  query: string
): Promise<RawChunkHit[]> {
  const filter = tenantFilter(scope);
  return KnowledgeChunkModel.aggregate([
    {
      $search: {
        index: TEXT_INDEX,
        compound: {
          must: [{ text: { query, path: "text" } }],
          filter: [
            { equals: { path: "userId", value: filter.userId } },
            { equals: { path: "roomId", value: filter.roomId } },
            { equals: { path: "knowledgeBaseId", value: filter.knowledgeBaseId } },
          ],
        },
      },
    },
    { $limit: CANDIDATE_LIMIT },
    { $project: { text: 1, locator: 1, elementType: 1, sourceId: 1 } },
  ]);
}

/** Reciprocal rank fusion, application-side (Section 2 -- don't rely on Atlas 8 fusion operators). */
function fuseResults(vectorHits: RawChunkHit[], textHits: RawChunkHit[]): RawChunkHit[] {
  const scores = new Map<string, { hit: RawChunkHit; score: number }>();

  const addRanked = (hits: RawChunkHit[]) => {
    hits.forEach((hit, rank) => {
      const id = String(hit._id);
      const contribution = 1 / (RRF_K + rank + 1);
      const existing = scores.get(id);
      if (existing) {
        existing.score += contribution;
      } else {
        scores.set(id, { hit, score: contribution });
      }
    });
  };

  addRanked(vectorHits);
  addRanked(textHits);

  return Array.from(scores.values())
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.hit);
}

function capToCharBudget(hits: RawChunkHit[]): RetrievedPassage[] {
  const passages: RetrievedPassage[] = [];
  let totalChars = 0;

  for (const hit of hits.slice(0, RESULT_LIMIT)) {
    if (totalChars >= MAX_OUTPUT_CHARS) break;
    const remaining = MAX_OUTPUT_CHARS - totalChars;
    const text = hit.text.length > remaining ? `${hit.text.slice(0, remaining)}...` : hit.text;
    passages.push({
      chunkId: String(hit._id),
      text,
      locator: hit.locator ?? null,
      elementType: hit.elementType,
      sourceId: String(hit.sourceId),
    });
    totalChars += text.length;
  }

  return passages;
}

function buildCacheKey(scope: KnowledgeBaseSearchScope, query: string): string {
  const hash = crypto.createHash("sha256").update(query.trim().toLowerCase()).digest("hex");
  return `retrieval:${scope.roomId}:${scope.knowledgeBaseRevision}:${hash}`;
}

/**
 * Searches a room's Knowledge Base for passages relevant to `query`.
 * Never throws -- a failure in either underlying search (e.g. an Atlas
 * index that isn't ready yet) degrades to using just the other, and a
 * failure in both returns an empty array so the caller can respond with a
 * safe "not found" rather than hanging or erroring the voice session.
 */
export async function searchKnowledgeBase(
  scope: KnowledgeBaseSearchScope,
  query: string
): Promise<RetrievedPassage[]> {
  const cacheKey = buildCacheKey(scope, query);
  const cached = await cacheGet(cacheKey);
  if (cached) {
    try {
      return JSON.parse(cached) as RetrievedPassage[];
    } catch {
      // fall through to a live search
    }
  }

  const [queryVector] = await embedTexts([query]);

  const [vectorResult, textResult] = await Promise.allSettled([
    runVectorSearch(scope, queryVector),
    runTextSearch(scope, query),
  ]);

  const vectorHits = vectorResult.status === "fulfilled" ? vectorResult.value : [];
  const textHits = textResult.status === "fulfilled" ? textResult.value : [];

  if (vectorResult.status === "rejected") {
    console.error("Knowledge base vector search failed:", vectorResult.reason);
  }
  if (textResult.status === "rejected") {
    console.error("Knowledge base text search failed:", textResult.reason);
  }

  const fused = fuseResults(vectorHits, textHits);
  const passages = capToCharBudget(fused);

  await cacheSet(cacheKey, JSON.stringify(passages), RETRIEVAL_CACHE_TTL_SECONDS);

  return passages;
}
