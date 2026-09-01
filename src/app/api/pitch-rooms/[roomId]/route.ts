import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { isPitchRoomsEnabled } from "@/lib/featureFlags";
import { resolveSessionUserId, UnauthorizedError } from "@/lib/services/authGuard";
import {
  getOwnedRoom,
  updateRoom,
  setRoomStatus,
  PitchRoomError,
} from "@/lib/services/pitchRooms";

interface RouteParams {
  params: Promise<{ roomId: string }>;
}

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
    return NextResponse.json({ success: true, data: { room } });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ success: false, message: error.message }, { status: 401 });
    }
    console.error("Error fetching pitch room:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  if (!isPitchRoomsEnabled()) {
    return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
  }

  await dbConnect();
  const { roomId } = await params;
  try {
    const userId = await resolveSessionUserId();
    const body = await req.json();

    let room = null;
    if (body.status === "active" || body.status === "archived") {
      room = await setRoomStatus(userId, roomId, body.status);
    }
    if (body.name !== undefined || body.practiceFocus !== undefined) {
      room = await updateRoom(userId, roomId, {
        name: body.name,
        practiceFocus: body.practiceFocus,
      });
    }
    if (!room) {
      room = await getOwnedRoom(userId, roomId);
    }
    if (!room) {
      return NextResponse.json(
        { success: false, message: "Pitch room not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: { room } });
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
    console.error("Error updating pitch room:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/** Archiving is reversible — this never hard-deletes a room. */
export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  if (!isPitchRoomsEnabled()) {
    return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
  }

  await dbConnect();
  const { roomId } = await params;
  try {
    const userId = await resolveSessionUserId();
    await setRoomStatus(userId, roomId, "archived");
    return NextResponse.json({ success: true, message: "Pitch room archived" });
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
    console.error("Error archiving pitch room:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
