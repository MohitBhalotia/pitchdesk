import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { isPitchRoomsEnabled } from "@/lib/featureFlags";
import { handleRoomTool, NOT_FOUND_RESULT } from "@/lib/rag/toolHandler";

/**
 * Deepgram server-side tool: `search_previous_pitch_memory(query)`
 * (plans/RAG_feature.md Section 2 & 3). Registered now so the room agent's
 * tool contract is complete and stable from Phase 3 onward, but there is no
 * memory to search until Phase 4 generates `RoomMemory` records after a
 * completed pitch -- until then this always answers "not found" rather than
 * ever inventing a prior session.
 */
const ArgsSchema = z.object({
  query: z.string().trim().min(1).max(500),
});

export async function POST(req: NextRequest) {
  if (!isPitchRoomsEnabled()) {
    return NextResponse.json(NOT_FOUND_RESULT);
  }

  return handleRoomTool(req, async (_scope, rawArgs) => {
    const parsed = ArgsSchema.safeParse(rawArgs);
    if (!parsed.success) {
      return NOT_FOUND_RESULT;
    }
    return { found: false, reason: "no_prior_session_memory" };
  });
}
