import mongoose from "mongoose";
import PitchRoomModel from "@/models/PitchRoomModel";

/** Section 9 locked default: 5 rooms/user. */
export const MAX_ACTIVE_ROOMS_PER_USER = 5;

export class PitchRoomError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "PitchRoomError";
    this.status = status;
  }
}

export async function listRoomsForUser(userId: string) {
  return PitchRoomModel.find({ userId, status: "active" })
    .sort({ updatedAt: -1 })
    .lean();
}

export interface CreateRoomInput {
  userId: string;
  name: string;
  practiceFocus?: string | null;
}

export async function createRoomForUser({ userId, name, practiceFocus }: CreateRoomInput) {
  const trimmedName = name?.trim();
  if (!trimmedName) {
    throw new PitchRoomError("Room name is required", 400);
  }

  const activeRoomCount = await PitchRoomModel.countDocuments({
    userId,
    status: "active",
  });
  if (activeRoomCount >= MAX_ACTIVE_ROOMS_PER_USER) {
    throw new PitchRoomError(
      `You can have at most ${MAX_ACTIVE_ROOMS_PER_USER} active pitch rooms. Archive one to create a new one.`,
      400
    );
  }

  return PitchRoomModel.create({
    userId,
    name: trimmedName,
    practiceFocus: practiceFocus?.trim() || null,
  });
}

/**
 * Looks up a room the given user owns. Returns null for "doesn't exist" and
 * "belongs to someone else" alike — callers must turn that into a 404, never
 * a 403, so a room ID never reveals whether it belongs to another user
 * (plans/RAG_feature.md Section 6).
 */
export async function getOwnedRoom(userId: string, roomId: string) {
  if (!mongoose.Types.ObjectId.isValid(roomId)) {
    return null;
  }
  return PitchRoomModel.findOne({ _id: roomId, userId });
}

export interface UpdateRoomInput {
  name?: string;
  practiceFocus?: string | null;
}

export async function updateRoom(userId: string, roomId: string, updates: UpdateRoomInput) {
  const room = await getOwnedRoom(userId, roomId);
  if (!room) {
    throw new PitchRoomError("Pitch room not found", 404);
  }

  if (updates.name !== undefined) {
    const trimmedName = updates.name.trim();
    if (!trimmedName) {
      throw new PitchRoomError("Room name is required", 400);
    }
    room.name = trimmedName;
  }

  if (updates.practiceFocus !== undefined) {
    room.practiceFocus = updates.practiceFocus?.trim() || null;
  }

  await room.save();
  return room;
}

/** Archiving is reversible (Section 5, Phase 1 exit condition) — never a hard delete. */
export async function setRoomStatus(
  userId: string,
  roomId: string,
  status: "active" | "archived"
) {
  const room = await getOwnedRoom(userId, roomId);
  if (!room) {
    throw new PitchRoomError("Pitch room not found", 404);
  }

  if (status === "active" && room.status !== "active") {
    const activeRoomCount = await PitchRoomModel.countDocuments({
      userId,
      status: "active",
    });
    if (activeRoomCount >= MAX_ACTIVE_ROOMS_PER_USER) {
      throw new PitchRoomError(
        `You can have at most ${MAX_ACTIVE_ROOMS_PER_USER} active pitch rooms. Archive one before restoring this one.`,
        400
      );
    }
  }

  room.status = status;
  await room.save();
  return room;
}
