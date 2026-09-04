import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import {
  verifyRoomToolSessionToken,
  getConsecutiveFailures,
  recordToolCallOutcome,
  CIRCUIT_BREAKER_THRESHOLD,
  type RoomToolSessionScope,
} from "@/lib/services/roomToolSession";
import { logMetric } from "@/lib/observability/metrics";
import { enqueueEvalSampleAsync } from "@/lib/queues";

const TOOL_CALL_TIMEOUT_MS = 2500;
/** Async production sampling (Section 7) -- ~1% of search_knowledge_base calls, entirely off the live path. */
const EVAL_SAMPLE_RATE = 0.01;

function extractBearerToken(req: NextRequest): string | null {
  const header = req.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) return null;
  return header.slice("Bearer ".length).trim();
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      setTimeout(() => reject(new Error("tool_call_timeout")), ms);
    }),
  ]);
}

export const NOT_FOUND_RESULT = { found: false, reason: "not_found" } as const;

/**
 * Fire-and-forget async production sampling (Section 7). Never awaited by
 * the caller, never adds latency to the live tool-call path. Only samples
 * `search_knowledge_base` -- that's the tool whose offline eval target
 * (recall/groundedness) actually needs sampled query/result pairs; the
 * other two tools are closer to exact-match lookups.
 */
function maybeSampleForEval(
  toolName: string,
  roomId: string,
  args: unknown,
  result: Record<string, unknown>
): void {
  if (toolName !== "search_knowledge_base") return;
  if (Math.random() >= EVAL_SAMPLE_RATE) return;

  const query = typeof (args as { query?: unknown })?.query === "string" ? (args as { query: string }).query : null;
  if (!query) return;

  const passages = Array.isArray((result as { passages?: unknown[] }).passages)
    ? (result as { passages: { text: string }[] }).passages
    : [];
  const resultText = passages
    .map((p) => p.text)
    .join("\n\n")
    .slice(0, 3500);

  enqueueEvalSampleAsync({
    callId: crypto.randomUUID(),
    toolName,
    roomId,
    query,
    resultText,
    found: passages.length > 0,
  }).catch((error) => console.error("Failed to enqueue eval sample:", error));
}

/**
 * Shared envelope for every Deepgram server-side room tool
 * (plans/RAG_feature.md Section 2): verifies the bearer room-session token
 * (never trusting tool arguments for identity), applies the per-session
 * circuit breaker, runs the handler under a 2.5s timeout, and always
 * resolves to a 200 JSON body -- Deepgram's agent always gets a coherent
 * function result, and a failing dependency can never hang or break the
 * live voice session. Also logs latency/outcome metrics (Section 5) -- never
 * the query text, retrieved passages, or the bearer token itself.
 */
export async function handleRoomTool(
  req: NextRequest,
  toolName: string,
  run: (scope: RoomToolSessionScope, args: unknown) => Promise<Record<string, unknown>>
): Promise<NextResponse> {
  const startedAt = Date.now();
  await dbConnect();

  const token = extractBearerToken(req);
  if (!token) {
    logMetric("room_tool_call", { toolName, outcome: "unauthorized", latencyMs: Date.now() - startedAt });
    return NextResponse.json({ found: false, reason: "unauthorized" });
  }

  const scope = await verifyRoomToolSessionToken(token);
  if (!scope) {
    logMetric("room_tool_call", { toolName, outcome: "unauthorized", latencyMs: Date.now() - startedAt });
    return NextResponse.json({ found: false, reason: "unauthorized" });
  }

  const failures = await getConsecutiveFailures(scope.sessionId);
  if (failures >= CIRCUIT_BREAKER_THRESHOLD) {
    logMetric("room_tool_call", {
      toolName,
      roomId: scope.roomId,
      outcome: "circuit_breaker_open",
      latencyMs: Date.now() - startedAt,
    });
    return NextResponse.json(NOT_FOUND_RESULT);
  }

  let args: unknown = {};
  try {
    args = await req.json();
  } catch {
    args = {};
  }

  try {
    const result = await withTimeout(run(scope, args), TOOL_CALL_TIMEOUT_MS);
    await recordToolCallOutcome(scope, true);
    const found = Boolean((result as { found?: boolean }).found);
    logMetric("room_tool_call", {
      toolName,
      roomId: scope.roomId,
      outcome: "success",
      found,
      latencyMs: Date.now() - startedAt,
    });
    maybeSampleForEval(toolName, scope.roomId, args, result);
    return NextResponse.json(result);
  } catch (error) {
    const timedOut = error instanceof Error && error.message === "tool_call_timeout";
    if (!timedOut) console.error("Room tool call failed:", error);
    await recordToolCallOutcome(scope, false);
    logMetric("room_tool_call", {
      toolName,
      roomId: scope.roomId,
      outcome: timedOut ? "timeout" : "error",
      latencyMs: Date.now() - startedAt,
    });
    return NextResponse.json(NOT_FOUND_RESULT);
  }
}
