import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { isRoomToolsEnabled } from "@/lib/featureFlags";
import { handleRoomTool, NOT_FOUND_RESULT } from "@/lib/rag/toolHandler";
import { searchPreviousPitchMemory } from "@/lib/rag/memorySearch";

/**
 * Deepgram server-side tool: `search_previous_pitch_memory(query)`
 * (plans/RAG_feature.md Section 2, 3 & Phase 4). Searches the room's
 * `RoomMemory` summaries -- bounded, structured recollections of past
 * pitches -- never raw transcript sentences.
 */
const ArgsSchema = z.object({
  query: z.string().trim().min(1).max(500),
});

export async function POST(req: NextRequest) {
  if (!isRoomToolsEnabled()) {
    return NextResponse.json(NOT_FOUND_RESULT);
  }

  return handleRoomTool(req, "search_previous_pitch_memory", async (scope, rawArgs) => {
    const parsed = ArgsSchema.safeParse(rawArgs);
    if (!parsed.success) {
      return NOT_FOUND_RESULT;
    }

    const memories = await searchPreviousPitchMemory(
      { userId: scope.userId, roomId: scope.roomId },
      parsed.data.query
    );

    if (memories.length === 0) {
      return { found: false, reason: "no_prior_session_memory" };
    }

    return { found: true, memories };
  });
}
