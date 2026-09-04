import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/models/KnowledgeChunkModel", () => ({
  default: { aggregate: vi.fn() },
}));
vi.mock("@/lib/ingestion/embedTexts", () => ({
  embedTexts: vi.fn(),
}));
vi.mock("@/lib/redis", () => ({
  cacheGet: vi.fn(),
  cacheSet: vi.fn(),
}));

import KnowledgeChunkModel from "@/models/KnowledgeChunkModel";
import { embedTexts } from "@/lib/ingestion/embedTexts";
import { cacheGet, cacheSet } from "@/lib/redis";
import { searchKnowledgeBase } from "./retrieval";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const asMock = (fn: unknown) => fn as any;

const SCOPE = {
  userId: "507f1f77bcf86cd799439001",
  roomId: "507f1f77bcf86cd799439002",
  knowledgeBaseId: "507f1f77bcf86cd799439003",
  knowledgeBaseRevision: 1,
};

function chunk(id: string, text: string) {
  return { _id: id, text, locator: "p1", elementType: "paragraph", sourceId: "s1" };
}

function mockAggregate(vectorHits: unknown[], textHits: unknown[]) {
  asMock(KnowledgeChunkModel.aggregate).mockImplementation((pipeline: Record<string, unknown>[]) => {
    const isVector = "$vectorSearch" in pipeline[0];
    return Promise.resolve(isVector ? vectorHits : textHits);
  });
}

describe("searchKnowledgeBase", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    asMock(embedTexts).mockResolvedValue([[0.1, 0.2, 0.3]]);
    asMock(cacheGet).mockResolvedValue(null);
  });

  it("returns the cached result without touching Mongo on a cache hit", async () => {
    const cached = [{ chunkId: "c1", text: "cached", locator: null, elementType: "paragraph", sourceId: "s1" }];
    asMock(cacheGet).mockResolvedValue(JSON.stringify(cached));

    const result = await searchKnowledgeBase(SCOPE, "revenue");

    expect(result).toEqual(cached);
    expect(KnowledgeChunkModel.aggregate).not.toHaveBeenCalled();
  });

  it("fuses vector and text hits, ranking a chunk found by both above one found by only one", async () => {
    mockAggregate(
      [chunk("c1", "vector-only"), chunk("c2", "in both")],
      [chunk("c2", "in both"), chunk("c3", "text-only")]
    );

    const result = await searchKnowledgeBase(SCOPE, "revenue");

    expect(result.map((p) => p.chunkId)).toEqual(["c2", "c1", "c3"]);
    expect(cacheSet).toHaveBeenCalled();
  });

  it("degrades to text-only results when vector search fails", async () => {
    asMock(KnowledgeChunkModel.aggregate).mockImplementation((pipeline: Record<string, unknown>[]) => {
      if ("$vectorSearch" in pipeline[0]) return Promise.reject(new Error("index not ready"));
      return Promise.resolve([chunk("c1", "text hit")]);
    });

    const result = await searchKnowledgeBase(SCOPE, "revenue");
    expect(result.map((p) => p.chunkId)).toEqual(["c1"]);
  });

  it("returns an empty array (not a throw) when both searches fail", async () => {
    asMock(KnowledgeChunkModel.aggregate).mockRejectedValue(new Error("boom"));
    await expect(searchKnowledgeBase(SCOPE, "revenue")).resolves.toEqual([]);
  });

  it("caps combined passage text to the ~3,500 character output budget", async () => {
    const longText = "x".repeat(2000);
    mockAggregate(
      [chunk("c1", longText), chunk("c2", longText), chunk("c3", longText)],
      []
    );

    const result = await searchKnowledgeBase(SCOPE, "revenue");
    const totalChars = result.reduce((sum, p) => sum + p.text.length, 0);
    expect(totalChars).toBeLessThanOrEqual(3500 + 3); // "..." suffix on the truncated passage
  });
});
