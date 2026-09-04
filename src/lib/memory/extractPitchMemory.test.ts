import { describe, it, expect } from "vitest";
import { buildMemorySummaryText, type ExtractedPitchMemory } from "./extractPitchMemory";
import { MAX_MEMORY_SUMMARY_CHARS } from "./limits";

function memory(overrides: Partial<ExtractedPitchMemory> = {}): ExtractedPitchMemory {
  return {
    founderClaims: [],
    weaknesses: [],
    decisions: [],
    newFacts: [],
    recurringDifficulties: [],
    ...overrides,
  };
}

describe("buildMemorySummaryText", () => {
  it("returns a fallback sentence when nothing notable was extracted", () => {
    expect(buildMemorySummaryText(memory())).toMatch(/no notable/i);
  });

  it("includes each non-empty category, labeled", () => {
    const text = buildMemorySummaryText(
      memory({
        founderClaims: ["ARR is $1.2M"],
        weaknesses: ["Unclear on CAC payback"],
      })
    );
    expect(text).toContain("Founder claims: ARR is $1.2M");
    expect(text).toContain("Weaknesses/unresolved: Unclear on CAC payback");
    expect(text).not.toContain("Decisions/changes");
  });

  it("joins multiple items within a category with a semicolon", () => {
    const text = buildMemorySummaryText(memory({ decisions: ["Cut burn by 20%", "Delayed hiring"] }));
    expect(text).toContain("Cut burn by 20%; Delayed hiring");
  });

  it("truncates to the summary character budget", () => {
    const longClaim = "x".repeat(MAX_MEMORY_SUMMARY_CHARS + 500);
    const text = buildMemorySummaryText(memory({ founderClaims: [longClaim] }));
    expect(text.length).toBeLessThanOrEqual(MAX_MEMORY_SUMMARY_CHARS + 3);
  });
});
