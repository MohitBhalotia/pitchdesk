import PitchModel from "../../../src/models/PitchModel";
import { enqueueRecoverAbandonedRoomPitch } from "../../../src/lib/queues";

/** Matches the recovery job's own staleness check in runRecoverAbandonedRoomPitchJob.ts. */
const STALE_THRESHOLD_MS = 5 * 60 * 1000;

/**
 * Scheduled sweep backing `recover-abandoned-room-pitch` (Phase 4). Finds
 * room pitches with no clean End Session whose last heartbeat
 * (`update-pitch`, sent every 10s while a session is live) has gone quiet,
 * and enqueues each for recovery -- deduped by the queue's own
 * `recover:{pitchId}` job key, so re-running this on every tick is safe.
 * Runs on a plain interval inside the worker process (Section 4's job
 * systems are for durable per-item work; this trigger itself is a trivial
 * Mongo query with no need for a separate scheduler).
 */
export async function sweepAbandonedRoomPitches(): Promise<number> {
  const staleBefore = new Date(Date.now() - STALE_THRESHOLD_MS);
  const candidates = await PitchModel.find({
    pitchRoomId: { $ne: null },
    endTime: null,
    lastUpdated: { $lt: staleBefore },
  })
    .select("_id")
    .lean();

  for (const candidate of candidates) {
    await enqueueRecoverAbandonedRoomPitch({ pitchId: String(candidate._id) });
  }

  return candidates.length;
}
