import KnowledgeBaseModel from "@/models/KnowledgeBaseModel";
import { getOwnedRoom } from "./pitchRooms";

/**
 * One lazy, one-to-one Knowledge Base per room (Section 9) — created the
 * moment a room's first source is added, not at room-creation time.
 */
export async function getOrCreateKnowledgeBase(userId: string, roomId: string) {
  const room = await getOwnedRoom(userId, roomId);
  if (!room) return null;

  let kb = await KnowledgeBaseModel.findOne({ roomId });
  if (!kb) {
    kb = await KnowledgeBaseModel.create({ userId, roomId, status: "empty" });
    room.knowledgeBaseId = kb._id;
    await room.save();
  }
  return kb;
}

/**
 * Read-only status lookup for the room page's polling loop. Returns
 * `undefined` when the room itself doesn't exist/isn't owned (caller should
 * 404); returns `null` when the room exists but no source has been added
 * yet, since the KB is only actually created on first source (no
 * side-effecting creation here).
 */
export async function getKnowledgeBaseForRoom(userId: string, roomId: string) {
  const room = await getOwnedRoom(userId, roomId);
  if (!room) return undefined;
  return KnowledgeBaseModel.findOne({ roomId });
}
