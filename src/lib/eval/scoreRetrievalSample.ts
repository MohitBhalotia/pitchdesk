import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
import { getOpenAIClient } from "@/lib/ingestion/openaiClient";

/**
 * Async production sampling's offline scorer (plans/RAG_feature.md Section
 * 7): an LLM-judge call, run entirely off the live path by the
 * `eval-sample-async` worker job, never by the tool-call handler itself.
 */
const JudgmentSchema = z.object({
  relevanceScore: z.number().min(0).max(1),
  groundednessScore: z.number().min(0).max(1),
  reason: z.string().max(200),
});

export type RetrievalJudgment = z.infer<typeof JudgmentSchema>;

const SYSTEM_PROMPT = `You grade one retrieval result from a RAG system used by an AI pitch coach. Given a founder's question and the passages retrieved from their knowledge base to answer it, score:
- relevanceScore (0-1): how relevant the retrieved passages are to the question
- groundednessScore (0-1): if an answer were built only from these passages, how well-supported would it be (1 = fully supported, 0 = passages support nothing)
Give a one-sentence reason. Be strict -- an empty, off-topic, or barely-related result should score near 0.`;

const EMPTY_RESULT_JUDGMENT: RetrievalJudgment = {
  relevanceScore: 0,
  groundednessScore: 0,
  reason: "No results were returned for this query.",
};

export async function scoreRetrievalSample(
  query: string,
  resultText: string,
  found: boolean
): Promise<RetrievalJudgment> {
  if (!found || !resultText.trim()) return EMPTY_RESULT_JUDGMENT;

  const client = getOpenAIClient();
  const response = await client.chat.completions.parse({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: `Question: ${query}\n\nRetrieved passages:\n${resultText}` },
    ],
    response_format: zodResponseFormat(JudgmentSchema, "retrieval_judgment"),
  });

  return response.choices[0]?.message?.parsed ?? EMPTY_RESULT_JUDGMENT;
}
