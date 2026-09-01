import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("./embeddingCache", () => ({
  getCachedEmbedding: vi.fn(),
  setCachedEmbedding: vi.fn(),
}));

const createMock = vi.fn();
vi.mock("./openaiClient", () => ({
  getOpenAIClient: () => ({ embeddings: { create: createMock } }),
}));

import { getCachedEmbedding, setCachedEmbedding } from "./embeddingCache";
import { embedTexts } from "./embedTexts";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const asMock = (fn: unknown) => fn as any;

describe("embedTexts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("never calls OpenAI when everything is already cached", async () => {
    asMock(getCachedEmbedding).mockImplementation((text: string) =>
      Promise.resolve(text === "a" ? [1, 1] : [2, 2])
    );

    const result = await embedTexts(["a", "b"]);

    expect(result).toEqual([[1, 1], [2, 2]]);
    expect(createMock).not.toHaveBeenCalled();
  });

  it("only embeds the cache misses and preserves input order", async () => {
    asMock(getCachedEmbedding).mockImplementation((text: string) =>
      Promise.resolve(text === "cached" ? [9, 9] : null)
    );
    createMock.mockResolvedValue({ data: [{ embedding: [5, 5] }] });

    const result = await embedTexts(["cached", "missing"]);

    expect(result).toEqual([[9, 9], [5, 5]]);
    expect(createMock).toHaveBeenCalledTimes(1);
    expect(createMock).toHaveBeenCalledWith(
      expect.objectContaining({ input: ["missing"] })
    );
    expect(setCachedEmbedding).toHaveBeenCalledWith("missing", [5, 5]);
    expect(setCachedEmbedding).not.toHaveBeenCalledWith("cached", expect.anything());
  });

  it("batches more than 100 missing texts into multiple OpenAI calls", async () => {
    asMock(getCachedEmbedding).mockResolvedValue(null);
    createMock.mockImplementation((args: { input: string[] }) =>
      Promise.resolve({ data: args.input.map(() => ({ embedding: [1] })) })
    );

    const texts = Array.from({ length: 150 }, (_, i) => `text-${i}`);
    const result = await embedTexts(texts);

    expect(result).toHaveLength(150);
    expect(createMock).toHaveBeenCalledTimes(2);
    expect(createMock.mock.calls[0][0].input).toHaveLength(100);
    expect(createMock.mock.calls[1][0].input).toHaveLength(50);
  });
});
