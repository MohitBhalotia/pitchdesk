import "dotenv/config";
import { Queue, Worker, type Job } from "bullmq";
import dbConnect from "../../src/lib/db";
import { getRedisClient } from "../../src/lib/redis";
import { createQueueConnection } from "../../src/lib/queues/connection";
import { QUEUE_NAMES, type QueueName } from "../../src/lib/queues/queueNames";
import type {
  IngestSourceJobData,
  GenerateRoomMemoryJobData,
  RegenerateRoomMemoryDigestJobData,
  RecoverAbandonedRoomPitchJobData,
  EvalSampleAsyncJobData,
} from "../../src/lib/queues";
import { runIngestSourceJob } from "./ingestion/runIngestSourceJob";
import { runGenerateRoomMemoryJob } from "./memory/runGenerateRoomMemoryJob";
import { runRegenerateRoomMemoryDigestJob } from "./memory/runRegenerateRoomMemoryDigestJob";
import { runRecoverAbandonedRoomPitchJob } from "./memory/runRecoverAbandonedRoomPitchJob";
import { sweepAbandonedRoomPitches } from "./memory/sweepAbandonedRoomPitches";
import { runEvalSampleAsyncJob } from "./eval/runEvalSampleAsyncJob";
import { logMetric } from "../../src/lib/observability/metrics";

/** How often the worker checks for room pitches with a dead heartbeat and no clean End Session. */
const ABANDONED_SWEEP_INTERVAL_MS = 5 * 60 * 1000;
/** How often queue depth is sampled and logged (Section 5: "queue depth, job retry counts"). */
const QUEUE_DEPTH_LOG_INTERVAL_MS = 5 * 60 * 1000;

/**
 * Dedicated worker process (Section 4 of plans/RAG_feature.md): the sole
 * consumer of all new RAG-heavy async work (ingestion, room memory, digest
 * rebuilds, abandoned-session recovery, async eval sampling). It imports
 * Mongoose models straight from `src/models/*` — no schema duplication.
 * All five queues now have real processors.
 */
async function main() {
  await dbConnect();
  console.log("[worker] connected to MongoDB");

  const redis = getRedisClient();
  await redis.ping();
  console.log("[worker] connected to Redis");

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
    new Worker<EvalSampleAsyncJobData>(
      QUEUE_NAMES.EVAL_SAMPLE_ASYNC,
      async (job: Job<EvalSampleAsyncJobData>) => {
        await runEvalSampleAsyncJob(job.data);
      },
      { connection: createQueueConnection() }
    ),
  ];

  // Job-level outcome/retry logging (Section 5: "job retry counts"). Applied
  // uniformly to every queue rather than duplicated per-processor.
  for (const worker of workers) {
    worker.on("completed", (job) => {
      if (job.attemptsMade > 1) {
        logMetric("job_succeeded_after_retry", { queue: worker.name, jobId: job.id, attemptsMade: job.attemptsMade });
      }
    });
    worker.on("failed", (job, error) => {
      logMetric("job_failed", {
        queue: worker.name,
        jobId: job?.id,
        attemptsMade: job?.attemptsMade,
        errorMessage: error instanceof Error ? error.message : "unknown error",
      });
    });
  }

  console.log(`[worker] listening on queues: ${Object.values(QUEUE_NAMES).join(", ")}`);

  const sweepInterval = setInterval(() => {
    sweepAbandonedRoomPitches()
      .then((count) => {
        if (count > 0) console.log(`[worker] abandoned-pitch sweep: recovered ${count} pitch(es)`);
      })
      .catch((error) => console.error("[worker] abandoned-pitch sweep failed:", error));
  }, ABANDONED_SWEEP_INTERVAL_MS);

  // Queue depth (Section 5) -- separate short-lived Queue instances just to
  // read counts; workers themselves don't expose this.
  const depthCheckQueues = Object.values(QUEUE_NAMES).map(
    (name: QueueName) => new Queue(name, { connection: createQueueConnection() })
  );
  const queueDepthInterval = setInterval(() => {
    Promise.all(
      depthCheckQueues.map(async (queue) => {
        const counts = await queue.getJobCounts("waiting", "active", "delayed", "failed");
        logMetric("queue_depth", { queue: queue.name, ...counts });
      })
    ).catch((error) => console.error("[worker] queue depth check failed:", error));
  }, QUEUE_DEPTH_LOG_INTERVAL_MS);

  const shutdown = async () => {
    console.log("[worker] shutting down...");
    clearInterval(sweepInterval);
    clearInterval(queueDepthInterval);
    await Promise.all(workers.map((w) => w.close()));
    await Promise.all(depthCheckQueues.map((q) => q.close()));
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
