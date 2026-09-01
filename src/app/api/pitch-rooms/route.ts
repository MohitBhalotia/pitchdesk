import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { isPitchRoomsEnabled } from "@/lib/featureFlags";
import { resolveSessionUserId, UnauthorizedError } from "@/lib/services/authGuard";
import {
  listRoomsForUser,
  createRoomForUser,
  PitchRoomError,
} from "@/lib/services/pitchRooms";

export async function GET() {
  if (!isPitchRoomsEnabled()) {
    return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
  }

  await dbConnect();
  try {
    const userId = await resolveSessionUserId();
    const rooms = await listRoomsForUser(userId);
    return NextResponse.json({ success: true, data: { rooms } });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ success: false, message: error.message }, { status: 401 });
    }
    console.error("Error listing pitch rooms:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  if (!isPitchRoomsEnabled()) {
    return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
  }

  await dbConnect();
  try {
    const userId = await resolveSessionUserId();
    const { name, practiceFocus } = await req.json();
    const room = await createRoomForUser({ userId, name, practiceFocus });
    return NextResponse.json({ success: true, data: { room } }, { status: 201 });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ success: false, message: error.message }, { status: 401 });
    }
    if (error instanceof PitchRoomError) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: error.status }
      );
    }
    console.error("Error creating pitch room:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
