/**
 * Pure scoring functions for the offline gold-set retrieval harness
 * (plans/RAG_feature.md Section 7): recall@k and MRR (mean reciprocal
 * rank), computed against a gold question's known-relevant chunk ids. No
 * DB/LLM dependency -- kept separate from `scripts/eval/run-rag-eval.ts` so
 * the scoring logic itself is unit-testable without a live Atlas cluster.
 */

/** Fraction of a question's relevant items that appear anywhere in the top-k retrieved results. */
export function computeRecallAtK(retrievedIds: string[], relevantIds: string[], k: number): number {
  if (relevantIds.length === 0) return 1; // nothing relevant to miss -- trivially satisfied
  const topK = new Set(retrievedIds.slice(0, k));
  const hits = relevantIds.filter((id) => topK.has(id)).length;
  return hits / relevantIds.length;
}

/** Reciprocal of the rank of the first relevant result (0 if none appear at all). */
export function computeMRR(retrievedIds: string[], relevantIds: string[]): number {
  const relevantSet = new Set(relevantIds);
  for (let i = 0; i < retrievedIds.length; i++) {
    if (relevantSet.has(retrievedIds[i])) return 1 / (i + 1);
  }
  return 0;
}

export function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}
