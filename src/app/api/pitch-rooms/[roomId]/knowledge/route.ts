import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { isPitchRoomsEnabled } from "@/lib/featureFlags";
import { resolveSessionUserId } from "@/lib/services/authGuard";
import { getKnowledgeBaseForRoom } from "@/lib/services/knowledgeBase";
import { toErrorResponse } from "@/lib/services/apiErrors";

interface RouteParams {
  params: Promise<{ roomId: string }>;
}

/** Polled every ~3s by the room page while a source is processing (Section 5). */
export async function GET(_req: NextRequest, { params }: RouteParams) {
  if (!isPitchRoomsEnabled()) {
    return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
  }

  await dbConnect();
  const { roomId } = await params;
  try {
    const userId = await resolveSessionUserId();
    const knowledgeBase = await getKnowledgeBaseForRoom(userId, roomId);
    if (knowledgeBase === undefined) {
      return NextResponse.json(
        { success: false, message: "Pitch room not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      data: { knowledgeBase: knowledgeBase ?? { status: "empty" } },
    });
  } catch (error) {
    return toErrorResponse(error, "Error fetching knowledge base:");
  }
}
