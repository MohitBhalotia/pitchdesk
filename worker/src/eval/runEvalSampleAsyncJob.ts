import EvalSampleModel from "../../../src/models/EvalSampleModel";
import { scoreRetrievalSample } from "../../../src/lib/eval/scoreRetrievalSample";
import { logMetric } from "../../../src/lib/observability/metrics";
import type { EvalSampleAsyncJobData } from "../../../src/lib/queues";

function isDuplicateKeyError(error: unknown): boolean {
  return Boolean(
    error && typeof error === "object" && "code" in error && (error as { code: number }).code === 11000
  );
}

/**
 * `eval-sample-async` (plans/RAG_feature.md Section 7, Phase 5): scores one
 * sampled `search_knowledge_base` query/result pair offline via an
 * LLM-judge, entirely off the live path -- this job is fire-and-forget from
 * the tool-call handler and never blocks or is awaited by it. Stores only
 * the judge's scores, never the sampled query/passages long-term.
 */
export async function runEvalSampleAsyncJob(data: EvalSampleAsyncJobData): Promise<void> {
  const judgment = await scoreRetrievalSample(data.query, data.resultText, data.found);

  try {
    await EvalSampleModel.create({
      callId: data.callId,
      toolName: data.toolName,
      roomId: data.roomId,
      found: data.found,
      relevanceScore: judgment.relevanceScore,
      groundednessScore: judgment.groundednessScore,
      reason: judgment.reason,
    });
  } catch (error) {
    if (isDuplicateKeyError(error)) return; // already scored -- defends against duplicate delivery
    throw error;
  }

  logMetric("eval_sample_scored", {
    toolName: data.toolName,
    roomId: data.roomId,
    relevanceScore: judgment.relevanceScore,
    groundednessScore: judgment.groundednessScore,
  });
}
