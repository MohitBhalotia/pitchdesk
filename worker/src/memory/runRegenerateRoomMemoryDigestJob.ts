import PitchRoomModel from "../../../src/models/PitchRoomModel";
import RoomMemoryModel from "../../../src/models/RoomMemoryModel";
import { buildMemoryDigest } from "../../../src/lib/memory/buildMemoryDigest";
import { MAX_MEMORIES_PER_DIGEST } from "../../../src/lib/memory/limits";
import { logMetric } from "../../../src/lib/observability/metrics";

/**
 * `regenerate-room-memory-digest` (plans/RAG_feature.md Phase 4): rebuilds
 * the compact digest that's the ONLY thing injected into future room
 * prompts -- prompt size stays bounded no matter how many sessions a room
 * accumulates. Triggered after every `generate-room-memory` completion and
 * after a memory is forgotten/deleted.
 */
export async function runRegenerateRoomMemoryDigestJob(roomId: string, version: number): Promise<void> {
  const startedAt = Date.now();
  const room = await PitchRoomModel.findById(roomId);
  if (!room) return; // room archived/gone
  if (room.memoryDigestVersion !== version) return; // superseded by a newer regeneration

  const memories = await RoomMemoryModel.find({ roomId })
    .sort({ createdAt: -1 })
    .limit(MAX_MEMORIES_PER_DIGEST)
    .select("summaryText createdAt")
    .lean();

  try {
    const digest = await buildMemoryDigest(
      memories.map((m) => ({ summaryText: m.summaryText, createdAt: m.createdAt }))
    );

    room.memoryDigest = digest || null;
    await room.save();

    logMetric("memory_job_completed", {
      jobType: "regenerate-room-memory-digest",
      roomId,
      memoryCount: memories.length,
      durationMs: Date.now() - startedAt,
    });
  } catch (error) {
    logMetric("memory_job_failed", {
      jobType: "regenerate-room-memory-digest",
      roomId,
      durationMs: Date.now() - startedAt,
      errorMessage: error instanceof Error ? error.message : "unknown error",
    });
    throw error;
  }
}
