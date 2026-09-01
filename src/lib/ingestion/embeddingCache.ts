import crypto from "crypto";
import { cacheGet, cacheSet } from "@/lib/redis";
import { EMBEDDING_MODEL, EMBEDDING_MODEL_VERSION } from "./limits";

// Embeddings for identical (text, model, version) never go stale, so a long
// TTL just bounds Redis growth rather than protecting correctness.
const EMBEDDING_CACHE_TTL_SECONDS = 30 * 24 * 60 * 60;

export function buildEmbeddingCacheKey(
  text: string,
  model: string = EMBEDDING_MODEL,
  version: string = EMBEDDING_MODEL_VERSION
): string {
  const hash = crypto.createHash("sha256").update(`${text}:${model}:${version}`).digest("hex");
  return `embedding:${hash}`;
}

export async function getCachedEmbedding(text: string): Promise<number[] | null> {
  const cached = await cacheGet(buildEmbeddingCacheKey(text));
  if (!cached) return null;
  try {
    return JSON.parse(cached) as number[];
  } catch {
    return null;
  }
}

export async function setCachedEmbedding(text: string, embedding: number[]): Promise<void> {
  await cacheSet(
    buildEmbeddingCacheKey(text),
    JSON.stringify(embedding),
    EMBEDDING_CACHE_TTL_SECONDS
  );
}
