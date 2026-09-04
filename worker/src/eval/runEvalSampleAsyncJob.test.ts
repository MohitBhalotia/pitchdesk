import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../../src/models/EvalSampleModel", () => ({
  default: { create: vi.fn() },
}));
vi.mock("../../../src/lib/eval/scoreRetrievalSample", () => ({
  scoreRetrievalSample: vi.fn(),
}));

import EvalSampleModel from "../../../src/models/EvalSampleModel";
import { scoreRetrievalSample } from "../../../src/lib/eval/scoreRetrievalSample";
import { runEvalSampleAsyncJob } from "./runEvalSampleAsyncJob";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const asMock = (fn: unknown) => fn as any;

const SAMPLE = {
  callId: "call1",
  toolName: "search_knowledge_base",
  roomId: "room1",
  query: "what is our ARR",
  resultText: "ARR is $1.2M as of 2025",
  found: true,
};

describe("runEvalSampleAsyncJob", () => {
  beforeEach(() => vi.clearAllMocks());

  it("scores the sample and stores only the judgment, never the query/passages", async () => {
    asMock(scoreRetrievalSample).mockResolvedValue({
      relevanceScore: 0.9,
      groundednessScore: 0.8,
      reason: "Directly answers the question.",
    });

    await runEvalSampleAsyncJob(SAMPLE);

    expect(EvalSampleModel.create).toHaveBeenCalledWith({
      callId: "call1",
      toolName: "search_knowledge_base",
      roomId: "room1",
      found: true,
      relevanceScore: 0.9,
      groundednessScore: 0.8,
      reason: "Directly answers the question.",
    });
  });

  it("swallows a duplicate-key error from a re-delivered job", async () => {
    asMock(scoreRetrievalSample).mockResolvedValue({ relevanceScore: 0, groundednessScore: 0, reason: "x" });
    asMock(EvalSampleModel.create).mockRejectedValue(Object.assign(new Error("dup"), { code: 11000 }));

    await expect(runEvalSampleAsyncJob(SAMPLE)).resolves.toBeUndefined();
  });

  it("propagates a non-duplicate-key error so BullMQ retries", async () => {
    asMock(scoreRetrievalSample).mockResolvedValue({ relevanceScore: 0, groundednessScore: 0, reason: "x" });
    asMock(EvalSampleModel.create).mockRejectedValue(new Error("mongo is down"));

    await expect(runEvalSampleAsyncJob(SAMPLE)).rejects.toThrow("mongo is down");
  });
});
