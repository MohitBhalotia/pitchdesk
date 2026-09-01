import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { isPitchRoomsEnabled } from "@/lib/featureFlags";
import { resolveSessionUserId } from "@/lib/services/authGuard";
import { deleteSource } from "@/lib/services/knowledgeSources";
import { toErrorResponse } from "@/lib/services/apiErrors";

interface RouteParams {
  params: Promise<{ roomId: string; sourceId: string }>;
}

/** Permanent removal -- unlike room archiving, there is no undo (Section 5). */
export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  if (!isPitchRoomsEnabled()) {
    return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
  }

  await dbConnect();
  const { roomId, sourceId } = await params;
  try {
    const userId = await resolveSessionUserId();
    await deleteSource({ userId, roomId, sourceId });
    return NextResponse.json({ success: true, message: "Knowledge source deleted" });
  } catch (error) {
    return toErrorResponse(error, "Error deleting knowledge source:");
  }
}
