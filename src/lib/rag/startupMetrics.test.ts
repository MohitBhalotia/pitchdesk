import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/models/StartupFactModel", () => ({
  default: { find: vi.fn() },
}));
vi.mock("@/models/KnowledgeBaseModel", () => ({
  default: { findById: vi.fn() },
}));

import StartupFactModel from "@/models/StartupFactModel";
import KnowledgeBaseModel from "@/models/KnowledgeBaseModel";
import { getStartupMetrics } from "./startupMetrics";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const asMock = (fn: unknown) => fn as any;

const SCOPE = { userId: "u1", roomId: "r1", knowledgeBaseId: "kb1" };

function mockFacts(facts: unknown[]) {
  asMock(StartupFactModel.find).mockReturnValue({
    sort: () => ({ lean: () => Promise.resolve(facts) }),
  });
}

function mockContradictions(contradictions: unknown[] = []) {
  asMock(KnowledgeBaseModel.findById).mockReturnValue({
    select: () => ({ lean: () => Promise.resolve({ contradictions }) }),
  });
}

const baseFact = {
  metric: "ARR",
  rawValue: "$1.2M",
  numericValue: 1_200_000,
  unit: null,
  currency: "USD",
  period: "2025",
  valueType: "actual" as const,
  confidence: 0.9,
};

describe("getStartupMetrics", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns an empty array when no metric names are given", async () => {
    await expect(getStartupMetrics(SCOPE, [])).resolves.toEqual([]);
    expect(StartupFactModel.find).not.toHaveBeenCalled();
  });

  it("matches metric names case-insensitively and by substring", async () => {
    mockFacts([baseFact]);
    mockContradictions();

    const results = await getStartupMetrics(SCOPE, ["arr"]);
    expect(results).toHaveLength(1);
    expect(results[0].metric).toBe("ARR");
  });

  it("prefers an exact period match but falls back to all matches otherwise", async () => {
    mockContradictions();
    mockFacts([baseFact, { ...baseFact, period: "2024", rawValue: "$800K" }]);

    const filtered = await getStartupMetrics(SCOPE, ["ARR"], "2025");
    expect(filtered).toHaveLength(1);
    expect(filtered[0].period).toBe("2025");

    const unmatched = await getStartupMetrics(SCOPE, ["ARR"], "2030");
    expect(unmatched).toHaveLength(2); // no exact match for 2030 -> falls back to all
  });

  it("flags a fact that has a recorded conflict for the same metric/period", async () => {
    mockFacts([baseFact]);
    mockContradictions([{ metric: "ARR", period: "2025", note: "Two conflicting ARR figures found" }]);

    const [result] = await getStartupMetrics(SCOPE, ["ARR"]);
    expect(result.hasConflict).toBe(true);
    expect(result.conflictNote).toMatch(/conflicting/i);
  });

  it("does not flag a conflict for a different period", async () => {
    mockFacts([baseFact]);
    mockContradictions([{ metric: "ARR", period: "2024", note: "n/a" }]);

    const [result] = await getStartupMetrics(SCOPE, ["ARR"]);
    expect(result.hasConflict).toBe(false);
  });
});
