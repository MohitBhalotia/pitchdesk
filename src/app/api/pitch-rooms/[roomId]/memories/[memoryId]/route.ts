import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { isPitchRoomsEnabled } from "@/lib/featureFlags";
import { resolveSessionUserId } from "@/lib/services/authGuard";
import { forgetMemory } from "@/lib/services/roomMemory";
import { toErrorResponse } from "@/lib/services/apiErrors";

interface RouteParams {
  params: Promise<{ roomId: string; memoryId: string }>;
}

/** "Forget this session" (Phase 4) -- deletes only the derived memory, never the pitch/transcript. */
export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  if (!isPitchRoomsEnabled()) {
    return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
  }

  await dbConnect();
  const { roomId, memoryId } = await params;
  try {
    const userId = await resolveSessionUserId();
    await forgetMemory(userId, roomId, memoryId);
    return NextResponse.json({ success: true, message: "Memory forgotten" });
  } catch (error) {
    return toErrorResponse(error, "Error forgetting room memory:");
  }
}
