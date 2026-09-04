/**
 * Structured metrics logging (plans/RAG_feature.md Phase 5, Section 5):
 * ingestion outcomes, tool latency/result-count/no-result-rate, memory-job
 * outcomes, and cache hit rates. Every call site here must only pass
 * counts/durations/booleans/ids -- never document bodies, retrieved
 * passages, full prompts, or signed tool tokens (Section 5's explicit rule).
 *
 * Uses `console.warn`, not `console.log`: `src/app/layout.tsx` replaces
 * `console.log` with a no-op outside development to cut dev noise from
 * production, which would silently swallow metrics meant to survive in
 * prod. `console.warn` is untouched by that override in both the Next.js
 * process and the separate worker process, so one implementation works
 * identically in both.
 */
export function logMetric(event: string, fields: Record<string, unknown> = {}): void {
  console.warn(JSON.stringify({ event, ...fields, ts: new Date().toISOString() }));
}
