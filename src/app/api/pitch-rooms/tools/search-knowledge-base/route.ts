import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { isPitchRoomsEnabled } from "@/lib/featureFlags";
import { handleRoomTool, NOT_FOUND_RESULT } from "@/lib/rag/toolHandler";
import { searchKnowledgeBase } from "@/lib/rag/retrieval";

/**
 * Deepgram server-side tool: `search_knowledge_base(query)`
 * (plans/RAG_feature.md Section 2 & 3). Called directly by Deepgram's
 * backend, never by the browser -- authorized only via the signed
 * room-session bearer token, never by a client-supplied roomId.
 */
const ArgsSchema = z.object({
  query: z.string().trim().min(1).max(500),
});

export async function POST(req: NextRequest) {
  if (!isPitchRoomsEnabled()) {
    return NextResponse.json(NOT_FOUND_RESULT);
  }

  return handleRoomTool(req, async (scope, rawArgs) => {
    const parsed = ArgsSchema.safeParse(rawArgs);
    if (!parsed.success || !scope.knowledgeBaseId) {
      return NOT_FOUND_RESULT;
    }

    const passages = await searchKnowledgeBase(
      {
        userId: scope.userId,
        roomId: scope.roomId,
        knowledgeBaseId: scope.knowledgeBaseId,
        knowledgeBaseRevision: scope.knowledgeBaseRevision,
      },
      parsed.data.query
    );

    if (passages.length === 0) {
      return { found: false, reason: "no_matching_content" };
    }

    return {
      found: true,
      passages: passages.map((passage) => ({
        text: passage.text,
        locator: passage.locator,
        elementType: passage.elementType,
      })),
    };
  });
}
