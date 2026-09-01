import { describe, it, expect } from "vitest";
import { chunkElements } from "./chunkElements";
import type { NormalizedElement } from "./types";

function el(elementType: ChunkElementType, text: string, locator: string | null = null): NormalizedElement {
  return { elementType, text, locator };
}

describe("chunkElements", () => {
  it("merges a heading with the paragraphs that follow into one chunk", () => {
    const chunks = chunkElements([
      el("heading", "Problem"),
      el("paragraph", "Founders struggle to get consistent pitch feedback."),
      el("paragraph", "Practice partners are hard to find on demand."),
    ]);

    expect(chunks).toHaveLength(1);
    expect(chunks[0].text).toContain("Problem");
    expect(chunks[0].text).toContain("Founders struggle");
  });

  it("gives every table its own chunk, never merged with prose", () => {
    const chunks = chunkElements([
      el("paragraph", "Here is our financial summary."),
      el("table", "Q1 | Q2 | Q3\n10k | 20k | 35k"),
      el("paragraph", "Growth has been steady quarter over quarter."),
    ]);

    const tableChunks = chunks.filter((c) => c.elementType === "table");
    expect(tableChunks).toHaveLength(1);
    expect(tableChunks[0].text).toContain("10k | 20k | 35k");
    // The table chunk must not contain the surrounding prose.
    expect(tableChunks[0].text).not.toContain("financial summary");
    expect(tableChunks[0].text).not.toContain("steady quarter");
  });

  it("splits into a new chunk once the token ceiling is reached", () => {
    const longParagraph = "word ".repeat(900); // comfortably over the 800-token ceiling on its own
    const chunks = chunkElements([
      el("heading", "Market"),
      el("paragraph", longParagraph),
      el("paragraph", "A short trailing paragraph."),
    ]);

    expect(chunks.length).toBeGreaterThanOrEqual(2);
    // A single normalized element already over the ceiling is kept whole
    // rather than split mid-element, so allow slack above MAX_TOKENS here.
    for (const chunk of chunks) {
      expect(chunk.tokenCount).toBeLessThanOrEqual(950);
    }
  });

  it("starts a new chunk at a heading once the current chunk is already near target size", () => {
    const mediumParagraph = "word ".repeat(660); // pushes the running chunk past TARGET_TOKENS
    const chunks = chunkElements([
      el("heading", "Section A"),
      el("paragraph", mediumParagraph),
      el("heading", "Section B"),
      el("paragraph", "Short content for section B."),
    ]);

    expect(chunks.length).toBeGreaterThanOrEqual(2);
    const lastChunk = chunks[chunks.length - 1];
    expect(lastChunk.text).toContain("Section B");
    expect(lastChunk.text).not.toContain("Section A");
  });

  it("assigns sequential chunkIndex values starting at 0", () => {
    const chunks = chunkElements([
      el("heading", "A"),
      el("table", "1 | 2"),
      el("paragraph", "B"),
    ]);

    expect(chunks.map((c) => c.chunkIndex)).toEqual(chunks.map((_, i) => i));
  });

  it("carries the element's locator onto its chunk", () => {
    const chunks = chunkElements([el("paragraph", "Some content", "Page 4")]);
    expect(chunks[0].locator).toBe("Page 4");
  });

  it("returns nothing for an empty input", () => {
    expect(chunkElements([])).toEqual([]);
  });
});
