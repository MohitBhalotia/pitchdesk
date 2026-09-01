import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
import { getOpenAIClient } from "./openaiClient";

const FactSchema = z.object({
  metric: z.string(),
  rawValue: z.string(),
  numericValue: z.number().nullable(),
  unit: z.string().nullable(),
  currency: z.string().nullable(),
  period: z.string().nullable(),
  valueType: z.enum(["actual", "projected", "historical"]),
  confidence: z.number().min(0).max(1),
});

const ExtractionSchema = z.object({
  facts: z.array(FactSchema),
});

export type ExtractedFact = z.infer<typeof FactSchema>;

const SYSTEM_PROMPT = `You extract quantitative startup metrics (ARR, MRR, revenue, growth rate, CAC, LTV, active users, burn rate, runway, valuation, funding ask, gross margin, churn, and similar) from pitch material.

Only extract facts explicitly stated in the text -- never infer or estimate a number that isn't there. For every fact:
- classify it as "actual" (already achieved), "projected" (forecasted/target), or "historical" (a past period no longer current)
- note the period it applies to if stated (e.g. "2025", "Q3 2025", "current"), otherwise null
- give a confidence score from 0 to 1 based on how explicit and unambiguous the statement is
If the same metric appears more than once with different values (e.g. two different ARR figures), extract each occurrence separately rather than picking one -- conflicting values are resolved by a human later, not by you.
If the text contains no quantitative startup metrics, return an empty facts array.`;

/**
 * Extracts structured startup facts from one chunk of source text via
 * OpenAI Structured Outputs, with evidence locations (Section 2). Never
 * called synchronously on the live tool-call path -- this only runs during
 * ingestion, on the worker.
 */
export async function extractStartupFacts(chunkText: string): Promise<ExtractedFact[]> {
  const client = getOpenAIClient();

  const response = await client.chat.completions.parse({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: chunkText },
    ],
    response_format: zodResponseFormat(ExtractionSchema, "startup_facts"),
  });

  return response.choices[0]?.message?.parsed?.facts ?? [];
}
