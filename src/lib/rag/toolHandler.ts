import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import {
  verifyRoomToolSessionToken,
  getConsecutiveFailures,
  recordToolCallOutcome,
  CIRCUIT_BREAKER_THRESHOLD,
  type RoomToolSessionScope,
} from "@/lib/services/roomToolSession";

const TOOL_CALL_TIMEOUT_MS = 2500;

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
 * Shared envelope for every Deepgram server-side room tool
 * (plans/RAG_feature.md Section 2): verifies the bearer room-session token
 * (never trusting tool arguments for identity), applies the per-session
 * circuit breaker, runs the handler under a 2.5s timeout, and always
 * resolves to a 200 JSON body -- Deepgram's agent always gets a coherent
 * function result, and a failing dependency can never hang or break the
 * live voice session.
 */
export async function handleRoomTool(
  req: NextRequest,
  run: (scope: RoomToolSessionScope, args: unknown) => Promise<Record<string, unknown>>
): Promise<NextResponse> {
  await dbConnect();

  const token = extractBearerToken(req);
  if (!token) {
    return NextResponse.json({ found: false, reason: "unauthorized" });
  }

  const scope = await verifyRoomToolSessionToken(token);
  if (!scope) {
    return NextResponse.json({ found: false, reason: "unauthorized" });
  }

  const failures = await getConsecutiveFailures(scope.sessionId);
  if (failures >= CIRCUIT_BREAKER_THRESHOLD) {
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
    return NextResponse.json(result);
  } catch (error) {
    console.error("Room tool call failed:", error);
    await recordToolCallOutcome(scope, false);
    return NextResponse.json(NOT_FOUND_RESULT);
  }
}
