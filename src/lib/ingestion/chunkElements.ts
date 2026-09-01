import { encode, decode } from "gpt-tokenizer";
import type { NormalizedElement, ChunkCandidate } from "./types";

// Section 2: "~500-800 tokens, 80-120 overlap, tables/slide context kept
// intact (never split mid-table)".
const TARGET_TOKENS = 650;
const MAX_TOKENS = 800;
const OVERLAP_TOKENS = 100;

function tokenCount(text: string): number {
  return encode(text).length;
}

/** Trailing ~OVERLAP_TOKENS of a chunk's text, to seed the next chunk. */
function takeOverlap(text: string): string {
  const tokens = encode(text);
  if (tokens.length <= OVERLAP_TOKENS) return text;
  return decode(tokens.slice(-OVERLAP_TOKENS));
}

interface ChunkBuffer {
  elementType: ChunkElementType;
  parts: string[];
  locator: string | null;
}

function bufferText(buffer: ChunkBuffer): string {
  return buffer.parts.join("\n\n").trim();
}

function pushChunk(
  out: ChunkCandidate[],
  elementType: ChunkElementType,
  text: string,
  locator: string | null
) {
  if (!text) return;
  out.push({
    elementType,
    text,
    locator,
    chunkIndex: out.length,
    tokenCount: tokenCount(text),
  });
}

/**
 * Groups normalized elements into chunks per Section 2's targets. A new
 * heading starts a new chunk once the current one has reached a reasonable
 * size; otherwise elements accumulate until the token ceiling, at which
 * point the next chunk is seeded with trailing overlap from this one.
 * Tables always get their own chunk, never merged with surrounding prose.
 */
export function chunkElements(elements: NormalizedElement[]): ChunkCandidate[] {
  const chunks: ChunkCandidate[] = [];
  let buffer: ChunkBuffer | null = null;
  let pendingOverlap = "";

  const closeBuffer = () => {
    if (!buffer) return;
    const text = bufferText(buffer);
    pushChunk(chunks, buffer.elementType, text, buffer.locator);
    pendingOverlap = takeOverlap(text);
    buffer = null;
  };

  const openBuffer = (el: NormalizedElement) => {
    const parts = pendingOverlap ? [pendingOverlap, el.text] : [el.text];
    buffer = { elementType: el.elementType, parts, locator: el.locator };
    pendingOverlap = "";
  };

  for (const el of elements) {
    if (el.elementType === "table") {
      closeBuffer();
      pendingOverlap = ""; // never bleed overlap into/out of a table chunk
      const tableText = el.html ? `${el.text}\n\n${el.html}` : el.text;
      pushChunk(chunks, "table", tableText, el.locator);
      continue;
    }

    if (!buffer) {
      openBuffer(el);
      continue;
    }

    const currentTokens = tokenCount(bufferText(buffer));
    const elTokens = tokenCount(el.text);
    const isNewSection = el.elementType === "heading";
    const wouldExceedCeiling = currentTokens + elTokens > MAX_TOKENS;
    const reachedTarget = currentTokens >= TARGET_TOKENS;

    if (wouldExceedCeiling || (isNewSection && reachedTarget)) {
      closeBuffer();
      openBuffer(el);
      continue;
    }

    buffer.parts.push(el.text);
    if (el.locator && !buffer.locator) {
      buffer.locator = el.locator;
    }
  }

  closeBuffer();
  return chunks;
}
