import Redis from "ioredis";

/**
 * Shared Redis client for both BullMQ (queue producers in Next.js API
 * routes, the worker as consumer) and the caching layer (Section 4 of
 * plans/RAG_feature.md): embedding cache, RoomToolSession validation cache,
 * retrieval-result cache, room memory digest cache.
 *
 * A single instance is reused across hot-reloads in dev (same pattern as
 * `src/lib/db.ts`'s connection caching) to avoid exhausting connections.
 */
declare global {
  var __pitchdeskRedis: Redis | undefined;
}

export function getRedisClient(): Redis {
  if (!global.__pitchdeskRedis) {
    global.__pitchdeskRedis = new Redis(process.env.REDIS_URL ?? "redis://localhost:6379", {
      maxRetriesPerRequest: null,
      lazyConnect: false,
    });
    global.__pitchdeskRedis.on("error", (err) => {
      console.error("Redis client error:", err.message);
    });
  }
  return global.__pitchdeskRedis;
}

/**
 * Cache is purely an optimization, never a correctness dependency (Section
 * 4). Every helper here swallows Redis errors and falls back to "miss" so
 * callers always have a safe path straight to live Mongo/compute.
 */
export async function cacheGet(key: string): Promise<string | null> {
  try {
    return await getRedisClient().get(key);
  } catch (error) {
    console.error(`Redis GET failed for key "${key}":`, error);
    return null;
  }
}

export async function cacheSet(
  key: string,
  value: string,
  ttlSeconds?: number
): Promise<void> {
  try {
    if (ttlSeconds) {
      await getRedisClient().set(key, value, "EX", ttlSeconds);
    } else {
      await getRedisClient().set(key, value);
    }
  } catch (error) {
    console.error(`Redis SET failed for key "${key}":`, error);
  }
}

export async function cacheDel(key: string): Promise<void> {
  try {
    await getRedisClient().del(key);
  } catch (error) {
    console.error(`Redis DEL failed for key "${key}":`, error);
  }
}
