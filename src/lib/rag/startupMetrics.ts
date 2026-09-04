import StartupFactModel from "@/models/StartupFactModel";
import KnowledgeBaseModel from "@/models/KnowledgeBaseModel";

/**
 * Live lookup backing the `get_startup_metrics` Deepgram tool
 * (plans/RAG_feature.md Section 2). Prefers structured facts over prose for
 * numerical questions -- this never touches KnowledgeChunk text at all.
 * Metric names are free text (extracted by an LLM during ingestion, not a
 * fixed enum -- see src/lib/ingestion/extractStartupFacts.ts), so lookups
 * match case-insensitively and by substring rather than exact equality.
 */

const MAX_RESULTS = 10;

export interface StartupMetricResult {
  metric: string;
  rawValue: string;
  numericValue: number | null;
  unit: string | null;
  currency: string | null;
  period: string | null;
  valueType: "actual" | "projected" | "historical";
  confidence: number;
  hasConflict: boolean;
  conflictNote: string | null;
}

export interface StartupMetricScope {
  userId: string;
  roomId: string;
  knowledgeBaseId: string;
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function getStartupMetrics(
  scope: StartupMetricScope,
  metricNames: string[],
  period?: string | null
): Promise<StartupMetricResult[]> {
  const nameFilters = metricNames
    .map((name) => name.trim())
    .filter(Boolean)
    .map((name) => ({ metric: { $regex: escapeRegex(name), $options: "i" } }));

  if (nameFilters.length === 0) return [];

  const [facts, kb] = await Promise.all([
    StartupFactModel.find({
      userId: scope.userId,
      roomId: scope.roomId,
      knowledgeBaseId: scope.knowledgeBaseId,
      status: "active",
      $or: nameFilters,
    })
      .sort({ confidence: -1, updatedAt: -1 })
      .lean(),
    KnowledgeBaseModel.findById(scope.knowledgeBaseId).select("contradictions").lean(),
  ]);

  let matched = facts;
  if (period?.trim()) {
    const trimmedPeriod = period.trim();
    const periodMatched = facts.filter(
      (fact) => fact.period?.toLowerCase() === trimmedPeriod.toLowerCase()
    );
    // Prefer an exact period match, but don't discard everything if the
    // founder's phrasing doesn't line up with what was extracted -- a
    // partial answer beats a false "not found".
    if (periodMatched.length > 0) matched = periodMatched;
  }

  const contradictions = kb?.contradictions ?? [];

  return matched.slice(0, MAX_RESULTS).map((fact) => {
    const conflict = contradictions.find(
      (c) =>
        c.metric.toLowerCase() === fact.metric.toLowerCase() &&
        (c.period ?? null) === (fact.period ?? null)
    );
    return {
      metric: fact.metric,
      rawValue: fact.rawValue,
      numericValue: fact.numericValue,
      unit: fact.unit ?? null,
      currency: fact.currency ?? null,
      period: fact.period ?? null,
      valueType: fact.valueType,
      confidence: fact.confidence,
      hasConflict: Boolean(conflict),
      conflictNote: conflict?.note ?? null,
    };
  });
}
