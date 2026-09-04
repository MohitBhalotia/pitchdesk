import mongoose from "mongoose";
import RoomMemoryModel from "@/models/RoomMemoryModel";
import PitchRoomModel from "@/models/PitchRoomModel";
import { getOwnedRoom } from "./pitchRooms";
import { enqueueRegenerateRoomMemoryDigest } from "@/lib/queues";

export class RoomMemoryError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "RoomMemoryError";
    this.status = status;
  }
}

export async function listMemoriesForRoom(userId: string, roomId: string) {
  const room = await getOwnedRoom(userId, roomId);
  if (!room) return null;
  return RoomMemoryModel.find({ roomId }).sort({ createdAt: -1 }).lean();
}

async function bumpDigestVersionAndEnqueue(roomId: string): Promise<void> {
  const room = await PitchRoomModel.findByIdAndUpdate(
    roomId,
    { $inc: { memoryDigestVersion: 1 } },
    { new: true }
  ).select("memoryDigestVersion");
  if (room) {
    await enqueueRegenerateRoomMemoryDigest({ roomId, version: room.memoryDigestVersion });
  }
}

/**
 * "Forget this session" (Phase 4): deletes just the derived memory, never
 * the underlying pitch/transcript -- that stays exactly as visible in My
 * Pitches/evaluation as before. Re-enqueues a digest rebuild so future
 * sessions stop recalling what was just forgotten.
 */
export async function forgetMemory(userId: string, roomId: string, memoryId: string) {
  const room = await getOwnedRoom(userId, roomId);
  if (!room) {
    throw new RoomMemoryError("Pitch room not found", 404);
  }
  if (!mongoose.Types.ObjectId.isValid(memoryId)) {
    throw new RoomMemoryError("Memory not found", 404);
  }

  const memory = await RoomMemoryModel.findOneAndDelete({ _id: memoryId, roomId, userId });
  if (!memory) {
    throw new RoomMemoryError("Memory not found", 404);
  }

  await bumpDigestVersionAndEnqueue(roomId);
  return memory;
}

/**
 * Cascade used when a pitch itself is deleted (`/api/my-pitches` DELETE):
 * deleting a pitch deletes its derived memory too (Phase 4 exit condition).
 * A no-op (no digest rebuild enqueued) when the pitch never had a memory.
 */
export async function deleteMemoryForPitch(roomId: string, pitchId: string): Promise<void> {
  const deleted = await RoomMemoryModel.findOneAndDelete({ roomId, pitchId });
  if (deleted) {
    await bumpDigestVersionAndEnqueue(roomId);
  }
}
