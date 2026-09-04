import { describe, it, expect } from "vitest";
import { computeRecallAtK, computeMRR, average } from "./scoring";

describe("computeRecallAtK", () => {
  it("returns 1 when the question has no relevant items to miss", () => {
    expect(computeRecallAtK(["a", "b"], [], 5)).toBe(1);
  });

  it("returns 1 when every relevant item is within the top-k", () => {
    expect(computeRecallAtK(["a", "b", "c"], ["b", "c"], 5)).toBe(1);
  });

  it("returns a fraction when only some relevant items are retrieved", () => {
    expect(computeRecallAtK(["a", "b"], ["b", "c"], 5)).toBe(0.5);
  });

  it("returns 0 when no relevant item is retrieved at all", () => {
    expect(computeRecallAtK(["a", "b"], ["z"], 5)).toBe(0);
  });

  it("only counts items within the k cutoff, not the whole retrieved list", () => {
    expect(computeRecallAtK(["a", "b", "c"], ["c"], 2)).toBe(0);
    expect(computeRecallAtK(["a", "b", "c"], ["c"], 3)).toBe(1);
  });
});

describe("computeMRR", () => {
  it("returns 1 when the first result is relevant", () => {
    expect(computeMRR(["a", "b"], ["a"])).toBe(1);
  });

  it("returns 1/rank for the first relevant result found", () => {
    expect(computeMRR(["a", "b", "c"], ["c"])).toBeCloseTo(1 / 3);
  });

  it("returns 0 when nothing relevant was retrieved", () => {
    expect(computeMRR(["a", "b"], ["z"])).toBe(0);
  });
});

describe("average", () => {
  it("returns 0 for an empty list", () => {
    expect(average([])).toBe(0);
  });

  it("averages the given values", () => {
    expect(average([1, 0.5, 0])).toBeCloseTo(0.5);
  });
});
