import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
import { getOpenAIClient } from "@/lib/ingestion/openaiClient";
import {
  MAX_ITEMS_PER_MEMORY_CATEGORY,
  MAX_MEMORY_SUMMARY_CHARS,
  MAX_TRANSCRIPT_CHARS_FOR_EXTRACTION,
} from "./limits";

/**
 * Structured extraction for the `generate-room-memory` worker job
 * (plans/RAG_feature.md Phase 4). Reads the full transcript as input but
 * never stores it -- the output is a small, bounded set of categories that
 * become the searchable memory for future sessions.
 */
const MemorySchema = z.object({
  founderClaims: z.array(z.string()).max(MAX_ITEMS_PER_MEMORY_CATEGORY),
  weaknesses: z.array(z.string()).max(MAX_ITEMS_PER_MEMORY_CATEGORY),
  decisions: z.array(z.string()).max(MAX_ITEMS_PER_MEMORY_CATEGORY),
  newFacts: z.array(z.string()).max(MAX_ITEMS_PER_MEMORY_CATEGORY),
  recurringDifficulties: z.array(z.string()).max(MAX_ITEMS_PER_MEMORY_CATEGORY),
});

export type ExtractedPitchMemory = z.infer<typeof MemorySchema>;

const EMPTY_MEMORY: ExtractedPitchMemory = {
  founderClaims: [],
  weaknesses: [],
  decisions: [],
  newFacts: [],
  recurringDifficulties: [],
};

const SYSTEM_PROMPT = `You review a transcript of one practice pitch session between a founder and an AI investor coach, and extract what a coach would actually want to remember for the founder's NEXT session in this same room. Categorize into:
- founderClaims: specific, concrete claims or answers the founder made (not vague statements)
- weaknesses: gaps, weak answers, or unresolved questions raised during this session
- decisions: any material decision or change in direction the founder mentioned
- newFacts: new quantitative or factual information about the startup mentioned in conversation (not already implied to be in their documents)
- recurringDifficulties: places the founder struggled to answer clearly or seemed unprepared

Keep every item short (one sentence). Only include what's actually notable -- an empty category is fine and expected if nothing fits. Never invent anything not said in the transcript.`;

function formatTranscript(transcript: { role: "user" | "bot"; content: string }[]): string {
  return transcript
    .map((m) => `${m.role === "user" ? "Founder" : "Coach"}: ${m.content}`)
    .join("\n")
    .slice(0, MAX_TRANSCRIPT_CHARS_FOR_EXTRACTION);
}

export async function extractPitchMemory(
  transcript: { role: "user" | "bot"; content: string }[]
): Promise<ExtractedPitchMemory> {
  const transcriptText = formatTranscript(transcript);
  if (!transcriptText.trim()) return EMPTY_MEMORY;

  const client = getOpenAIClient();
  const response = await client.chat.completions.parse({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: transcriptText },
    ],
    response_format: zodResponseFormat(MemorySchema, "pitch_memory"),
  });

  return response.choices[0]?.message?.parsed ?? EMPTY_MEMORY;
}

/**
 * Combines the extracted categories into one bounded, embeddable summary
 * text (Section 2/Phase 4: "one bounded searchable summary", never the raw
 * transcript). Pure and separately testable from the OpenAI call above.
 */
export function buildMemorySummaryText(memory: ExtractedPitchMemory): string {
  const sections: string[] = [];
  if (memory.founderClaims.length) sections.push(`Founder claims: ${memory.founderClaims.join("; ")}`);
  if (memory.weaknesses.length) sections.push(`Weaknesses/unresolved: ${memory.weaknesses.join("; ")}`);
  if (memory.decisions.length) sections.push(`Decisions/changes: ${memory.decisions.join("; ")}`);
  if (memory.newFacts.length) sections.push(`New facts mentioned: ${memory.newFacts.join("; ")}`);
  if (memory.recurringDifficulties.length) {
    sections.push(`Recurring difficulty: ${memory.recurringDifficulties.join("; ")}`);
  }

  const combined = sections.join(" | ") || "No notable claims, weaknesses, or decisions surfaced this session.";
  return combined.length > MAX_MEMORY_SUMMARY_CHARS
    ? `${combined.slice(0, MAX_MEMORY_SUMMARY_CHARS)}...`
    : combined;
}
