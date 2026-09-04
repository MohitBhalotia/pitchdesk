import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { isPitchRoomsEnabled } from "@/lib/featureFlags";
import { resolveSessionUserId } from "@/lib/services/authGuard";
import { getOwnedRoom } from "@/lib/services/pitchRooms";
import { toErrorResponse } from "@/lib/services/apiErrors";
import PitchModel from "@/models/PitchModel";

interface RouteParams {
  params: Promise<{ roomId: string }>;
}

/** Lists this room's pitch history (plans/RAG_feature.md Phase 3 exit condition). */
export async function GET(_req: NextRequest, { params }: RouteParams) {
  if (!isPitchRoomsEnabled()) {
    return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
  }

  await dbConnect();
  const { roomId } = await params;
  try {
    const userId = await resolveSessionUserId();
    const room = await getOwnedRoom(userId, roomId);
    if (!room) {
      return NextResponse.json(
        { success: false, message: "Pitch room not found" },
        { status: 404 }
      );
    }

    const pitches = await PitchModel.find({ userId, pitchRoomId: roomId })
      .select("title agentName duration startTime endTime createdAt")
      .sort({ startTime: -1 })
      .limit(50)
      .lean();

    return NextResponse.json({ success: true, data: { pitches } });
  } catch (error) {
    return toErrorResponse(error, "Error fetching room pitch history:");
  }
}
