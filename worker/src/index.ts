import "dotenv/config";
import { Worker, type Job } from "bullmq";
import dbConnect from "../../src/lib/db";
import { getRedisClient } from "../../src/lib/redis";
import { createQueueConnection } from "../../src/lib/queues/connection";
import { QUEUE_NAMES } from "../../src/lib/queues/queueNames";
import type {
  IngestSourceJobData,
  GenerateRoomMemoryJobData,
  RegenerateRoomMemoryDigestJobData,
  RecoverAbandonedRoomPitchJobData,
} from "../../src/lib/queues";
import { runIngestSourceJob } from "./ingestion/runIngestSourceJob";
import { runGenerateRoomMemoryJob } from "./memory/runGenerateRoomMemoryJob";
import { runRegenerateRoomMemoryDigestJob } from "./memory/runRegenerateRoomMemoryDigestJob";
import { runRecoverAbandonedRoomPitchJob } from "./memory/runRecoverAbandonedRoomPitchJob";
import { sweepAbandonedRoomPitches } from "./memory/sweepAbandonedRoomPitches";

/** How often the worker checks for room pitches with a dead heartbeat and no clean End Session. */
const ABANDONED_SWEEP_INTERVAL_MS = 5 * 60 * 1000;

/**
 * Dedicated worker process (Section 4 of plans/RAG_feature.md): the sole
 * consumer of all new RAG-heavy async work (ingestion, room memory, digest
 * rebuilds, abandoned-session recovery, async eval sampling). It imports
 * Mongoose models straight from `src/models/*` — no schema duplication.
 *
 * ingest-source (Phase 2) and the three Phase 4 memory queues have real
 * processors; eval-sample-async still logs-and-acknowledges until Phase 5.
 */
async function main() {
  await dbConnect();
  console.log("[worker] connected to MongoDB");

  const redis = getRedisClient();
  await redis.ping();
  console.log("[worker] connected to Redis");

  const implementedQueueNames: string[] = [
    QUEUE_NAMES.INGEST_SOURCE,
    QUEUE_NAMES.GENERATE_ROOM_MEMORY,
    QUEUE_NAMES.REGENERATE_ROOM_MEMORY_DIGEST,
    QUEUE_NAMES.RECOVER_ABANDONED_ROOM_PITCH,
  ];
  const stubQueueNames = Object.values(QUEUE_NAMES).filter(
    (name) => !implementedQueueNames.includes(name)
  );

  const workers = [
    new Worker<IngestSourceJobData>(
      QUEUE_NAMES.INGEST_SOURCE,
      async (job: Job<IngestSourceJobData>) => {
        await runIngestSourceJob(job.data.sourceId, job.data.revision);
      },
      { connection: createQueueConnection() }
    ),
    new Worker<GenerateRoomMemoryJobData>(
      QUEUE_NAMES.GENERATE_ROOM_MEMORY,
      async (job: Job<GenerateRoomMemoryJobData>) => {
        await runGenerateRoomMemoryJob(job.data.pitchId);
      },
      { connection: createQueueConnection() }
    ),
    new Worker<RegenerateRoomMemoryDigestJobData>(
      QUEUE_NAMES.REGENERATE_ROOM_MEMORY_DIGEST,
      async (job: Job<RegenerateRoomMemoryDigestJobData>) => {
        await runRegenerateRoomMemoryDigestJob(job.data.roomId, job.data.version);
      },
      { connection: createQueueConnection() }
    ),
    new Worker<RecoverAbandonedRoomPitchJobData>(
      QUEUE_NAMES.RECOVER_ABANDONED_ROOM_PITCH,
      async (job: Job<RecoverAbandonedRoomPitchJobData>) => {
        await runRecoverAbandonedRoomPitchJob(job.data.pitchId);
      },
      { connection: createQueueConnection() }
    ),
    ...stubQueueNames.map(
      (name) =>
        new Worker(
          name,
          async (job) => {
            console.log(
              `[worker] received job "${job.name}" on queue "${name}" (id=${job.id}) — no processor implemented yet`
            );
          },
          { connection: createQueueConnection() }
        )
    ),
  ];

  console.log(`[worker] listening on queues: ${Object.values(QUEUE_NAMES).join(", ")}`);

  const sweepInterval = setInterval(() => {
    sweepAbandonedRoomPitches()
      .then((count) => {
        if (count > 0) console.log(`[worker] abandoned-pitch sweep: recovered ${count} pitch(es)`);
      })
      .catch((error) => console.error("[worker] abandoned-pitch sweep failed:", error));
  }, ABANDONED_SWEEP_INTERVAL_MS);

  const shutdown = async () => {
    console.log("[worker] shutting down...");
    clearInterval(sweepInterval);
    await Promise.all(workers.map((w) => w.close()));
    await redis.quit();
    process.exit(0);
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

main().catch((error) => {
  console.error("[worker] failed to start:", error);
  process.exit(1);
});
