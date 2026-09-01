import { describe, it, expect } from "vitest";
import { detectFactConflicts, type FactForConflictCheck } from "./factConflicts";

function fact(overrides: Partial<FactForConflictCheck>): FactForConflictCheck {
  return {
    _id: Math.random().toString(36),
    metric: "ARR",
    period: "2025",
    valueType: "actual",
    numericValue: 100,
    status: "active",
    ...overrides,
  };
}

describe("detectFactConflicts", () => {
  it("returns nothing when there is only one fact for a metric/period", () => {
    expect(detectFactConflicts([fact({})])).toEqual([]);
  });

  it("returns nothing when duplicate facts agree", () => {
    const facts = [fact({ numericValue: 100 }), fact({ numericValue: 101 })];
    expect(detectFactConflicts(facts)).toEqual([]); // <5% difference
  });

  it("flags a real disagreement between two facts for the same metric/period", () => {
    const facts = [fact({ numericValue: 100 }), fact({ numericValue: 150 })];
    const result = detectFactConflicts(facts);

    expect(result).toHaveLength(1);
    expect(result[0].metric).toBe("ARR");
    expect(result[0].period).toBe("2025");
    expect(result[0].factIds).toHaveLength(2);
  });

  it("does not compare facts across different metrics, periods, or value types", () => {
    const facts = [
      fact({ metric: "ARR", numericValue: 100 }),
      fact({ metric: "MRR", numericValue: 100000 }),
      fact({ period: "2024", numericValue: 50 }),
      fact({ valueType: "projected", numericValue: 500 }),
    ];
    expect(detectFactConflicts(facts)).toEqual([]);
  });

  it("ignores disabled facts", () => {
    const facts = [
      fact({ numericValue: 100 }),
      fact({ numericValue: 500, status: "disabled" }),
    ];
    expect(detectFactConflicts(facts)).toEqual([]);
  });

  it("ignores facts with no numeric value", () => {
    const facts = [fact({ numericValue: null }), fact({ numericValue: null })];
    expect(detectFactConflicts(facts)).toEqual([]);
  });
});
