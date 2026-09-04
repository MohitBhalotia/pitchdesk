import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { isPitchRoomsEnabled } from "@/lib/featureFlags";
import { resolveSessionUserId } from "@/lib/services/authGuard";
import { listMemoriesForRoom } from "@/lib/services/roomMemory";
import { toErrorResponse } from "@/lib/services/apiErrors";

interface RouteParams {
  params: Promise<{ roomId: string }>;
}

/** Lists a room's memories (Phase 4 Memory view -- inspect summaries, "Forget this session"). */
export async function GET(_req: NextRequest, { params }: RouteParams) {
  if (!isPitchRoomsEnabled()) {
    return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
  }

  await dbConnect();
  const { roomId } = await params;
  try {
    const userId = await resolveSessionUserId();
    const memories = await listMemoriesForRoom(userId, roomId);
    if (memories === null) {
      return NextResponse.json(
        { success: false, message: "Pitch room not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: { memories } });
  } catch (error) {
    return toErrorResponse(error, "Error fetching room memories:");
  }
}
