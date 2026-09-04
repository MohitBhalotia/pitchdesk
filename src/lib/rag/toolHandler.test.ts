import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/lib/db", () => ({ default: vi.fn() }));
vi.mock("@/lib/services/roomToolSession", () => ({
  verifyRoomToolSessionToken: vi.fn(),
  getConsecutiveFailures: vi.fn(),
  recordToolCallOutcome: vi.fn(),
  CIRCUIT_BREAKER_THRESHOLD: 3,
}));
vi.mock("@/lib/observability/metrics", () => ({ logMetric: vi.fn() }));
vi.mock("@/lib/queues", () => ({ enqueueEvalSampleAsync: vi.fn() }));

import {
  verifyRoomToolSessionToken,
  getConsecutiveFailures,
  recordToolCallOutcome,
} from "@/lib/services/roomToolSession";
import { logMetric } from "@/lib/observability/metrics";
import { enqueueEvalSampleAsync } from "@/lib/queues";
import { handleRoomTool, NOT_FOUND_RESULT } from "./toolHandler";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const asMock = (fn: unknown) => fn as any;

const SCOPE = {
  sessionId: "s1",
  userId: "u1",
  roomId: "r1",
  pitchId: "p1",
  agentId: "a1",
  knowledgeBaseId: "kb1",
  knowledgeBaseRevision: 1,
  expiresAt: new Date(Date.now() + 60_000),
};

function makeRequest(body: unknown, headers: Record<string, string> = { authorization: "Bearer t" }) {
  return new NextRequest("http://localhost/api/pitch-rooms/tools/search-knowledge-base", {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
}

describe("handleRoomTool", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    asMock(getConsecutiveFailures).mockResolvedValue(0);
  });

  it("returns unauthorized without running the handler when no bearer token is present", async () => {
    const run = vi.fn();
    const req = makeRequest({ query: "x" }, {});

    const res = await handleRoomTool(req, "search_knowledge_base", run);

    expect(await res.json()).toEqual({ found: false, reason: "unauthorized" });
    expect(run).not.toHaveBeenCalled();
    expect(logMetric).toHaveBeenCalledWith("room_tool_call", expect.objectContaining({ outcome: "unauthorized" }));
  });

  it("returns unauthorized when the token fails verification", async () => {
    asMock(verifyRoomToolSessionToken).mockResolvedValue(null);
    const run = vi.fn();

    const res = await handleRoomTool(makeRequest({ query: "x" }), "search_knowledge_base", run);

    expect(await res.json()).toEqual({ found: false, reason: "unauthorized" });
    expect(run).not.toHaveBeenCalled();
  });

  it("short-circuits to not-found when the circuit breaker is open, without running the handler", async () => {
    asMock(verifyRoomToolSessionToken).mockResolvedValue(SCOPE);
    asMock(getConsecutiveFailures).mockResolvedValue(3);
    const run = vi.fn();

    const res = await handleRoomTool(makeRequest({ query: "x" }), "search_knowledge_base", run);

    expect(await res.json()).toEqual(NOT_FOUND_RESULT);
    expect(run).not.toHaveBeenCalled();
    expect(logMetric).toHaveBeenCalledWith(
      "room_tool_call",
      expect.objectContaining({ outcome: "circuit_breaker_open" })
    );
  });

  it("returns the handler's result and records a successful outcome", async () => {
    asMock(verifyRoomToolSessionToken).mockResolvedValue(SCOPE);
    const run = vi.fn().mockResolvedValue({ found: true, passages: [] });

    const res = await handleRoomTool(makeRequest({ query: "x" }), "get_startup_metrics", run);

    expect(await res.json()).toEqual({ found: true, passages: [] });
    expect(recordToolCallOutcome).toHaveBeenCalledWith(SCOPE, true);
    expect(logMetric).toHaveBeenCalledWith(
      "room_tool_call",
      expect.objectContaining({ outcome: "success", found: true })
    );
  });

  it("degrades to not-found and records a failure when the handler throws", async () => {
    asMock(verifyRoomToolSessionToken).mockResolvedValue(SCOPE);
    const run = vi.fn().mockRejectedValue(new Error("dependency down"));

    const res = await handleRoomTool(makeRequest({ query: "x" }), "search_knowledge_base", run);

    expect(await res.json()).toEqual(NOT_FOUND_RESULT);
    expect(recordToolCallOutcome).toHaveBeenCalledWith(SCOPE, false);
    expect(logMetric).toHaveBeenCalledWith("room_tool_call", expect.objectContaining({ outcome: "error" }));
  });

  it("degrades to not-found on a timeout without ever hanging the response", async () => {
    vi.useFakeTimers();
    try {
      asMock(verifyRoomToolSessionToken).mockResolvedValue(SCOPE);
      const run = vi.fn().mockReturnValue(new Promise(() => {})); // never resolves

      const resPromise = handleRoomTool(makeRequest({ query: "x" }), "search_knowledge_base", run);
      await vi.advanceTimersByTimeAsync(2600);
      const res = await resPromise;

      expect(await res.json()).toEqual(NOT_FOUND_RESULT);
      expect(logMetric).toHaveBeenCalledWith("room_tool_call", expect.objectContaining({ outcome: "timeout" }));
    } finally {
      vi.useRealTimers();
    }
  });

  describe("async eval sampling", () => {
    let randomSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
      asMock(verifyRoomToolSessionToken).mockResolvedValue(SCOPE);
      randomSpy = vi.spyOn(Math, "random");
    });

    afterEach(() => randomSpy.mockRestore());

    it("samples a search_knowledge_base call when the roll succeeds", async () => {
      randomSpy.mockReturnValue(0); // always below the 1% threshold
      const run = vi.fn().mockResolvedValue({ found: true, passages: [{ text: "some passage" }] });

      await handleRoomTool(makeRequest({ query: "what is our ARR" }), "search_knowledge_base", run);

      expect(enqueueEvalSampleAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          toolName: "search_knowledge_base",
          roomId: "r1",
          query: "what is our ARR",
          found: true,
        })
      );
    });

    it("never samples a different tool, regardless of the roll", async () => {
      randomSpy.mockReturnValue(0);
      const run = vi.fn().mockResolvedValue({ found: true, metrics: [] });

      await handleRoomTool(makeRequest({ metric_names: ["ARR"] }), "get_startup_metrics", run);

      expect(enqueueEvalSampleAsync).not.toHaveBeenCalled();
    });

    it("does not sample when the roll misses", async () => {
      randomSpy.mockReturnValue(0.5); // above the 1% threshold
      const run = vi.fn().mockResolvedValue({ found: true, passages: [{ text: "x" }] });

      await handleRoomTool(makeRequest({ query: "what is our ARR" }), "search_knowledge_base", run);

      expect(enqueueEvalSampleAsync).not.toHaveBeenCalled();
    });
  });
});
