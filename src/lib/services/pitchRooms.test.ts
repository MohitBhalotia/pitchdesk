import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/models/PitchRoomModel", () => ({
  default: {
    countDocuments: vi.fn(),
    create: vi.fn(),
    findOne: vi.fn(),
  },
}));

import PitchRoomModel from "@/models/PitchRoomModel";
import {
  createRoomForUser,
  getOwnedRoom,
  updateRoom,
  setRoomStatus,
  PitchRoomError,
  MAX_ACTIVE_ROOMS_PER_USER,
} from "./pitchRooms";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const asMock = (fn: unknown) => fn as any;

const VALID_ROOM_ID = "507f1f77bcf86cd799439011";

describe("createRoomForUser", () => {
  beforeEach(() => vi.clearAllMocks());

  it("throws when the name is empty or whitespace", async () => {
    await expect(
      createRoomForUser({ userId: "u1", name: "   " })
    ).rejects.toMatchObject({ status: 400 });
    expect(PitchRoomModel.create).not.toHaveBeenCalled();
  });

  it("throws once the user is at the active-room cap", async () => {
    asMock(PitchRoomModel.countDocuments).mockResolvedValue(MAX_ACTIVE_ROOMS_PER_USER);

    await expect(
      createRoomForUser({ userId: "u1", name: "New room" })
    ).rejects.toBeInstanceOf(PitchRoomError);
    expect(PitchRoomModel.create).not.toHaveBeenCalled();
  });

  it("trims the name and defaults practiceFocus to null", async () => {
    asMock(PitchRoomModel.countDocuments).mockResolvedValue(0);
    asMock(PitchRoomModel.create).mockImplementation((doc: unknown) => Promise.resolve(doc));

    const room = await createRoomForUser({ userId: "u1", name: "  My Room  " });

    expect(room).toMatchObject({ userId: "u1", name: "My Room", practiceFocus: null });
  });
});

describe("getOwnedRoom", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns null without querying the DB for a malformed room id", async () => {
    const result = await getOwnedRoom("u1", "not-an-object-id");
    expect(result).toBeNull();
    expect(PitchRoomModel.findOne).not.toHaveBeenCalled();
  });

  it("scopes the query to both the room id and the owning user", async () => {
    asMock(PitchRoomModel.findOne).mockResolvedValue({ _id: VALID_ROOM_ID });

    await getOwnedRoom("u1", VALID_ROOM_ID);

    expect(PitchRoomModel.findOne).toHaveBeenCalledWith({ _id: VALID_ROOM_ID, userId: "u1" });
  });
});

describe("updateRoom", () => {
  beforeEach(() => vi.clearAllMocks());

  it("throws PitchRoomError(404) when the room isn't owned by this user", async () => {
    asMock(PitchRoomModel.findOne).mockResolvedValue(null);

    await expect(
      updateRoom("u1", VALID_ROOM_ID, { name: "New name" })
    ).rejects.toMatchObject({ status: 404 });
  });

  it("rejects an empty name update", async () => {
    asMock(PitchRoomModel.findOne).mockResolvedValue({ name: "Old", save: vi.fn() });

    await expect(
      updateRoom("u1", VALID_ROOM_ID, { name: "   " })
    ).rejects.toMatchObject({ status: 400 });
  });

  it("updates name and practiceFocus and saves", async () => {
    const room = { name: "Old", practiceFocus: null, save: vi.fn() };
    asMock(PitchRoomModel.findOne).mockResolvedValue(room);

    const result = await updateRoom("u1", VALID_ROOM_ID, {
      name: "  New  ",
      practiceFocus: "  focus on metrics  ",
    });

    expect(result.name).toBe("New");
    expect(result.practiceFocus).toBe("focus on metrics");
    expect(room.save).toHaveBeenCalledTimes(1);
  });
});

describe("setRoomStatus", () => {
  beforeEach(() => vi.clearAllMocks());

  it("throws PitchRoomError(404) when the room isn't owned by this user", async () => {
    asMock(PitchRoomModel.findOne).mockResolvedValue(null);

    await expect(setRoomStatus("u1", VALID_ROOM_ID, "archived")).rejects.toMatchObject({
      status: 404,
    });
  });

  it("archives without checking the active-room cap", async () => {
    const room = { status: "active", save: vi.fn() };
    asMock(PitchRoomModel.findOne).mockResolvedValue(room);

    await setRoomStatus("u1", VALID_ROOM_ID, "archived");

    expect(room.status).toBe("archived");
    expect(PitchRoomModel.countDocuments).not.toHaveBeenCalled();
  });

  it("blocks restoring a room past the active-room cap", async () => {
    const room = { status: "archived", save: vi.fn() };
    asMock(PitchRoomModel.findOne).mockResolvedValue(room);
    asMock(PitchRoomModel.countDocuments).mockResolvedValue(MAX_ACTIVE_ROOMS_PER_USER);

    await expect(setRoomStatus("u1", VALID_ROOM_ID, "active")).rejects.toBeInstanceOf(
      PitchRoomError
    );
    expect(room.status).toBe("archived");
  });

  it("restores a room when under the active-room cap", async () => {
    const room = { status: "archived", save: vi.fn() };
    asMock(PitchRoomModel.findOne).mockResolvedValue(room);
    asMock(PitchRoomModel.countDocuments).mockResolvedValue(0);

    await setRoomStatus("u1", VALID_ROOM_ID, "active");

    expect(room.status).toBe("active");
    expect(room.save).toHaveBeenCalledTimes(1);
  });
});
