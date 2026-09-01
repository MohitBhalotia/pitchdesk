import "dotenv/config";
import { Worker, type Job } from "bullmq";
import dbConnect from "../../src/lib/db";
import { getRedisClient } from "../../src/lib/redis";
import { createQueueConnection } from "../../src/lib/queues/connection";
import { QUEUE_NAMES } from "../../src/lib/queues/queueNames";
import type { IngestSourceJobData } from "../../src/lib/queues";
import { runIngestSourceJob } from "./ingestion/runIngestSourceJob";

/**
 * Dedicated worker process (Section 4 of plans/RAG_feature.md): the sole
 * consumer of all new RAG-heavy async work (ingestion, room memory, digest
 * rebuilds, abandoned-session recovery, async eval sampling). It imports
 * Mongoose models straight from `src/models/*` — no schema duplication.
 *
 * ingest-source has a real processor (Phase 2); the remaining queues still
 * log-and-acknowledge until their processors land in Phase 4.
 */
async function main() {
  await dbConnect();
  console.log("[worker] connected to MongoDB");

  const redis = getRedisClient();
  await redis.ping();
  console.log("[worker] connected to Redis");

  const stubQueueNames = Object.values(QUEUE_NAMES).filter(
    (name) => name !== QUEUE_NAMES.INGEST_SOURCE
  );

  const workers = [
    new Worker<IngestSourceJobData>(
      QUEUE_NAMES.INGEST_SOURCE,
      async (job: Job<IngestSourceJobData>) => {
        await runIngestSourceJob(job.data.sourceId, job.data.revision);
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

  const shutdown = async () => {
    console.log("[worker] shutting down...");
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
