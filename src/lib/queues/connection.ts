import IORedis from "ioredis";

/**
 * BullMQ needs its own dedicated Redis connection per Queue/Worker (workers
 * issue blocking commands that would otherwise starve other traffic on a
 * shared connection) — separate from the ioredis instance in
 * `src/lib/redis.ts` used for caching, even though both point at the same
 * Redis server (Section 4: "same instance, separate key namespace").
 */
export function createQueueConnection(): IORedis {
  return new IORedis(process.env.REDIS_URL ?? "redis://localhost:6379", {
    maxRetriesPerRequest: null,
  });
}
