import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/models/RoomMemoryModel", () => ({
  default: { find: vi.fn(), findOneAndDelete: vi.fn() },
}));
vi.mock("@/models/PitchRoomModel", () => ({
  default: { findByIdAndUpdate: vi.fn() },
}));
vi.mock("./pitchRooms", () => ({
  getOwnedRoom: vi.fn(),
}));
vi.mock("@/lib/queues", () => ({
  enqueueRegenerateRoomMemoryDigest: vi.fn(),
}));

import RoomMemoryModel from "@/models/RoomMemoryModel";
import PitchRoomModel from "@/models/PitchRoomModel";
import { getOwnedRoom } from "./pitchRooms";
import { enqueueRegenerateRoomMemoryDigest } from "@/lib/queues";
import { listMemoriesForRoom, forgetMemory, deleteMemoryForPitch, RoomMemoryError } from "./roomMemory";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const asMock = (fn: unknown) => fn as any;

const VALID_MEMORY_ID = "507f1f77bcf86cd799439011";

describe("listMemoriesForRoom", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns null when the room isn't owned by this user", async () => {
    asMock(getOwnedRoom).mockResolvedValue(null);
    await expect(listMemoriesForRoom("u1", "r1")).resolves.toBeNull();
    expect(RoomMemoryModel.find).not.toHaveBeenCalled();
  });

  it("returns memories sorted newest-first when the room is owned", async () => {
    asMock(getOwnedRoom).mockResolvedValue({ _id: "r1" });
    const sort = vi.fn().mockReturnValue({ lean: () => Promise.resolve([{ _id: "m1" }]) });
    asMock(RoomMemoryModel.find).mockReturnValue({ sort });

    const result = await listMemoriesForRoom("u1", "r1");
    expect(result).toEqual([{ _id: "m1" }]);
    expect(sort).toHaveBeenCalledWith({ createdAt: -1 });
  });
});

describe("forgetMemory", () => {
  beforeEach(() => vi.clearAllMocks());

  it("throws 404 when the room isn't owned", async () => {
    asMock(getOwnedRoom).mockResolvedValue(null);
    await expect(forgetMemory("u1", "r1", VALID_MEMORY_ID)).rejects.toBeInstanceOf(RoomMemoryError);
  });

  it("throws 404 for a malformed memoryId without querying Mongo", async () => {
    asMock(getOwnedRoom).mockResolvedValue({ _id: "r1" });
    await expect(forgetMemory("u1", "r1", "not-an-object-id")).rejects.toMatchObject({ status: 404 });
    expect(RoomMemoryModel.findOneAndDelete).not.toHaveBeenCalled();
  });

  it("throws 404 when no matching memory is found (wrong owner or already gone)", async () => {
    asMock(getOwnedRoom).mockResolvedValue({ _id: "r1" });
    asMock(RoomMemoryModel.findOneAndDelete).mockResolvedValue(null);
    await expect(forgetMemory("u1", "r1", VALID_MEMORY_ID)).rejects.toMatchObject({ status: 404 });
  });

  it("deletes the memory and enqueues a digest rebuild with the bumped version", async () => {
    asMock(getOwnedRoom).mockResolvedValue({ _id: "r1" });
    asMock(RoomMemoryModel.findOneAndDelete).mockResolvedValue({ _id: VALID_MEMORY_ID });
    asMock(PitchRoomModel.findByIdAndUpdate).mockReturnValue({
      select: () => Promise.resolve({ memoryDigestVersion: 3 }),
    });

    await forgetMemory("u1", "r1", VALID_MEMORY_ID);

    expect(enqueueRegenerateRoomMemoryDigest).toHaveBeenCalledWith({ roomId: "r1", version: 3 });
  });
});

describe("deleteMemoryForPitch", () => {
  beforeEach(() => vi.clearAllMocks());

  it("does not enqueue a digest rebuild when the pitch had no memory", async () => {
    asMock(RoomMemoryModel.findOneAndDelete).mockResolvedValue(null);
    await deleteMemoryForPitch("r1", "p1");
    expect(enqueueRegenerateRoomMemoryDigest).not.toHaveBeenCalled();
  });

  it("enqueues a digest rebuild when a memory was actually deleted", async () => {
    asMock(RoomMemoryModel.findOneAndDelete).mockResolvedValue({ _id: "m1" });
    asMock(PitchRoomModel.findByIdAndUpdate).mockReturnValue({
      select: () => Promise.resolve({ memoryDigestVersion: 1 }),
    });

    await deleteMemoryForPitch("r1", "p1");

    expect(enqueueRegenerateRoomMemoryDigest).toHaveBeenCalledWith({ roomId: "r1", version: 1 });
  });
});
