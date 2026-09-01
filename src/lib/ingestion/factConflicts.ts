export interface FactForConflictCheck {
  _id: unknown;
  metric: string;
  period?: string | null;
  valueType: StartupFactValueType;
  numericValue: number | null;
  status: StartupFactStatus;
}

const RELATIVE_DIFFERENCE_THRESHOLD = 0.05; // >5% disagreement counts as a real conflict

/**
 * Groups active facts by (metric, period, valueType) and flags groups whose
 * numeric values disagree beyond a small tolerance -- "flag conflicts
 * instead of silently picking one" (plans/RAG_feature.md Section 2).
 */
export function detectFactConflicts(
  facts: FactForConflictCheck[]
): KnowledgeBaseContradiction[] {
  const groups = new Map<string, FactForConflictCheck[]>();

  for (const fact of facts) {
    if (fact.status !== "active") continue;
    if (fact.numericValue === null || fact.numericValue === undefined) continue;

    const key = `${fact.metric}::${fact.period ?? ""}::${fact.valueType}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(fact);
  }

  const contradictions: KnowledgeBaseContradiction[] = [];

  for (const [key, group] of groups) {
    if (group.length < 2) continue;

    const values = group.map((f) => f.numericValue as number);
    const min = Math.min(...values);
    const max = Math.max(...values);
    if (max === 0) continue; // both zero, or degenerate -- nothing to disagree about

    const relativeDifference = (max - min) / Math.abs(max);
    if (relativeDifference <= RELATIVE_DIFFERENCE_THRESHOLD) continue;

    const [metric, period] = key.split("::");
    contradictions.push({
      metric,
      period: period || null,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      factIds: group.map((f) => f._id) as any,
      note: `Found ${group.length} differing values for ${metric}${
        period ? ` (${period})` : ""
      }: ${values.join(", ")}.`,
    });
  }

  return contradictions;
}
