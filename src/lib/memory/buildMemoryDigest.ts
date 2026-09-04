import { getOpenAIClient } from "@/lib/ingestion/openaiClient";
import { MAX_MEMORY_DIGEST_CHARS, MAX_MEMORIES_PER_DIGEST } from "./limits";

const SYSTEM_PROMPT = `You write a compact (100-180 word) memory digest for an AI coach who has met this founder across multiple past pitch sessions in the same practice room. Summarize recurring themes, unresolved weaknesses, notable claims, and material decisions across the sessions below (most recent first). Synthesize into what's actually useful walking into the next conversation -- don't just list session-by-session, and don't invent anything not present below.`;

export interface MemoryDigestInput {
  summaryText: string;
  createdAt: Date;
}

/**
 * Rebuilds a room's compact cross-session digest (Phase 4) from its most
 * recent memories -- this is the ONLY thing injected into future room
 * prompts, keeping prompt size bounded no matter how many past sessions a
 * room accumulates. Runs only on the worker, after `generate-room-memory`.
 */
export async function buildMemoryDigest(memories: MemoryDigestInput[]): Promise<string> {
  if (memories.length === 0) return "";

  const client = getOpenAIClient();
  const recent = memories.slice(0, MAX_MEMORIES_PER_DIGEST);
  const combined = recent
    .map((m, i) => `Session ${i + 1} (${m.createdAt.toISOString().slice(0, 10)}): ${m.summaryText}`)
    .join("\n");

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: combined },
    ],
  });

  const text = response.choices[0]?.message?.content?.trim() ?? "";
  return text.length > MAX_MEMORY_DIGEST_CHARS ? `${text.slice(0, MAX_MEMORY_DIGEST_CHARS)}...` : text;
}
