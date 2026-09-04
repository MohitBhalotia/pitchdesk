import PitchModel from "../../../src/models/PitchModel";
import { deductPitchCredits, PitchCreditError } from "../../../src/lib/services/pitchCredits";
import { enqueueGenerateRoomMemory } from "../../../src/lib/queues";

/** Matches the sweep's staleness window in sweepAbandonedRoomPitches.ts. */
const ABANDONED_THRESHOLD_MS = 5 * 60 * 1000;

/**
 * `recover-abandoned-room-pitch` (plans/RAG_feature.md Phase 4): catches
 * room pitches with transcript data but no clean End Session (crash, closed
 * tab, network drop) -- finalizes them exactly as a normal `end-pitch` call
 * would (credit deduction, `endTime`), then feeds them into the same memory
 * pipeline as a cleanly-ended pitch.
 */
export async function runRecoverAbandonedRoomPitchJob(pitchId: string): Promise<void> {
  const pitch = await PitchModel.findById(pitchId);
  if (!pitch) return;
  if (pitch.endTime) return; // already ended cleanly, or already recovered
  if (!pitch.pitchRoomId) return; // only room pitches use this recovery path

  const lastActivity = pitch.lastUpdated ?? pitch.startTime;
  if (Date.now() - new Date(lastActivity).getTime() < ABANDONED_THRESHOLD_MS) {
    return; // recent heartbeat -- likely still a live session, not abandoned
  }

  pitch.endTime = lastActivity;
  await pitch.save();

  const durationSeconds = Math.max(
    0,
    (new Date(lastActivity).getTime() - new Date(pitch.startTime).getTime()) / 1000
  );
  try {
    await deductPitchCredits({
      pitchId: String(pitch._id),
      userId: String(pitch.userId),
      duration: durationSeconds,
    });
  } catch (error) {
    // Same tolerance as a normal end-pitch call would need -- a missing user
    // plan shouldn't block finalizing the session or generating its memory.
    if (!(error instanceof PitchCreditError)) throw error;
    console.error(`[worker] recover-abandoned-room-pitch: credit deduction skipped for ${pitchId}:`, error.message);
  }

  await enqueueGenerateRoomMemory({ pitchId: String(pitch._id) });
}
