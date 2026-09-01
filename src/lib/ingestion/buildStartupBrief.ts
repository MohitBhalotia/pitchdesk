import { getOpenAIClient } from "./openaiClient";

const SYSTEM_PROMPT = `You write a concise (150-250 word) startup brief summarizing what this startup does, its stage, market, and key metrics, based only on the material given. Be factual and neutral -- this brief is injected as background context into an AI investor's system prompt before a live pitch session, not shown to the founder as marketing copy. Do not invent details that aren't in the material.`;

// Keeps the prompt bounded regardless of how much source material a room has accumulated.
const MAX_SOURCE_CHARS = 12_000;

export interface BriefFactLine {
  metric: string;
  rawValue: string;
  period?: string | null;
}

/**
 * Summarizes a room's ingested material into the compact "startup brief"
 * injected into the room prompt (Section 3). Runs only during ingestion on
 * the worker, never on the live session path.
 */
export async function buildStartupBrief(
  sourceTexts: string[],
  facts: BriefFactLine[]
): Promise<string> {
  const client = getOpenAIClient();

  const factLines = facts
    .map((f) => `- ${f.metric}: ${f.rawValue}${f.period ? ` (${f.period})` : ""}`)
    .join("\n");
  const combinedText = sourceTexts.join("\n\n").slice(0, MAX_SOURCE_CHARS);

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: `Source material:\n${combinedText}\n\nKnown metrics:\n${
          factLines || "(none extracted)"
        }`,
      },
    ],
  });

  return response.choices[0]?.message?.content?.trim() ?? "";
}
