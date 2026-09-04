import PitchModel from "../../../src/models/PitchModel";
import RoomMemoryModel from "../../../src/models/RoomMemoryModel";
import PitchRoomModel from "../../../src/models/PitchRoomModel";
import { extractPitchMemory, buildMemorySummaryText } from "../../../src/lib/memory/extractPitchMemory";
import { embedTexts } from "../../../src/lib/ingestion/embedTexts";
import { EMBEDDING_MODEL, EMBEDDING_MODEL_VERSION } from "../../../src/lib/ingestion/limits";
import { enqueueRegenerateRoomMemoryDigest } from "../../../src/lib/queues";
import { logMetric } from "../../../src/lib/observability/metrics";

function isDuplicateKeyError(error: unknown): boolean {
  return Boolean(
    error && typeof error === "object" && "code" in error && (error as { code: number }).code === 11000
  );
}

/**
 * `generate-room-memory` (plans/RAG_feature.md Phase 4): one concise
 * structured memory per completed room pitch. Never copies/embeds the full
 * transcript -- only the bounded summary this produces. Idempotent via the
 * BullMQ `memory:{pitchId}` job key plus the unique (roomId, pitchId) Mongo
 * index, so a retried delivery can never create a duplicate.
 */
export async function runGenerateRoomMemoryJob(pitchId: string): Promise<void> {
  const startedAt = Date.now();
  const pitch = await PitchModel.findById(pitchId).lean();
  if (!pitch) return; // deleted before the job ran
  if (!pitch.pitchRoomId) return; // generic pitch -- no room memory to generate

  const existing = await RoomMemoryModel.findOne({ pitchId }).select("_id").lean();
  if (existing) return; // already generated -- defends against duplicate delivery

  const transcript = (pitch.conversationHistory ?? []).map((m) => ({
    role: m.role,
    content: m.content,
  }));
  const extracted = await extractPitchMemory(transcript);
  const summaryText = buildMemorySummaryText(extracted);
  const [embedding] = await embedTexts([summaryText]);

  try {
    await RoomMemoryModel.create({
      userId: pitch.userId,
      roomId: pitch.pitchRoomId,
      pitchId: pitch._id,
      ...extracted,
      summaryText,
      embedding,
      embeddingModel: EMBEDDING_MODEL,
      embeddingModelVersion: EMBEDDING_MODEL_VERSION,
    });
  } catch (error) {
    if (isDuplicateKeyError(error)) return; // lost a race with a concurrent/retried delivery
    logMetric("memory_job_failed", {
      jobType: "generate-room-memory",
      pitchId,
      durationMs: Date.now() - startedAt,
      errorMessage: error instanceof Error ? error.message : "unknown error",
    });
    throw error;
  }

  const room = await PitchRoomModel.findByIdAndUpdate(
    pitch.pitchRoomId,
    { $inc: { memoryDigestVersion: 1 } },
    { new: true }
  ).select("memoryDigestVersion");
  if (room) {
    await enqueueRegenerateRoomMemoryDigest({
      roomId: String(pitch.pitchRoomId),
      version: room.memoryDigestVersion,
    });
  }

  logMetric("memory_job_completed", {
    jobType: "generate-room-memory",
    pitchId,
    roomId: String(pitch.pitchRoomId),
    durationMs: Date.now() - startedAt,
  });
}
