import "dotenv/config";
import { Worker } from "bullmq";
import dbConnect from "../../src/lib/db";
import { getRedisClient } from "../../src/lib/redis";
import { createQueueConnection } from "../../src/lib/queues/connection";
import { QUEUE_NAMES } from "../../src/lib/queues/queueNames";

/**
 * Dedicated worker process (Section 4 of plans/RAG_feature.md): the sole
 * consumer of all new RAG-heavy async work (ingestion, room memory, digest
 * rebuilds, abandoned-session recovery, async eval sampling). It imports
 * Mongoose models straight from `src/models/*` — no schema duplication.
 *
 * Phase 0 scope: boot, connect to Mongo + Redis, and register a listener on
 * every queue so connectivity is provable end-to-end. Real processors land
 * per-queue in Phase 2 (ingest-source) and Phase 4 (the memory queues).
 */
async function main() {
  await dbConnect();
  console.log("[worker] connected to MongoDB");

  const redis = getRedisClient();
  await redis.ping();
  console.log("[worker] connected to Redis");

  const queueNames = Object.values(QUEUE_NAMES);
  const workers = queueNames.map(
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
  );

  console.log(`[worker] listening on queues: ${queueNames.join(", ")}`);

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
