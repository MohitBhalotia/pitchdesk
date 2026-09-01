import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/redis", () => ({
  cacheGet: vi.fn(),
  cacheSet: vi.fn(),
}));

import { cacheGet, cacheSet } from "@/lib/redis";
import { buildEmbeddingCacheKey, getCachedEmbedding, setCachedEmbedding } from "./embeddingCache";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const asMock = (fn: unknown) => fn as any;

describe("buildEmbeddingCacheKey", () => {
  it("is deterministic for the same text/model/version", () => {
    expect(buildEmbeddingCacheKey("hello", "m", "1")).toBe(buildEmbeddingCacheKey("hello", "m", "1"));
  });

  it("differs when the text, model, or version differs", () => {
    const base = buildEmbeddingCacheKey("hello", "m", "1");
    expect(buildEmbeddingCacheKey("goodbye", "m", "1")).not.toBe(base);
    expect(buildEmbeddingCacheKey("hello", "other-model", "1")).not.toBe(base);
    expect(buildEmbeddingCacheKey("hello", "m", "2")).not.toBe(base);
  });
});

describe("getCachedEmbedding / setCachedEmbedding", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns null on a cache miss", async () => {
    asMock(cacheGet).mockResolvedValue(null);
    await expect(getCachedEmbedding("some text")).resolves.toBeNull();
  });

  it("returns null (not a thrown error) for corrupted cached JSON", async () => {
    asMock(cacheGet).mockResolvedValue("not json");
    await expect(getCachedEmbedding("some text")).resolves.toBeNull();
  });

  it("round-trips a stored embedding through JSON", async () => {
    const embedding = [0.1, 0.2, 0.3];
    asMock(cacheGet).mockResolvedValue(JSON.stringify(embedding));
    await expect(getCachedEmbedding("some text")).resolves.toEqual(embedding);
  });

  it("writes with the deterministic key and a TTL", async () => {
    await setCachedEmbedding("some text", [1, 2, 3]);
    expect(cacheSet).toHaveBeenCalledWith(
      buildEmbeddingCacheKey("some text"),
      JSON.stringify([1, 2, 3]),
      expect.any(Number)
    );
  });
});
