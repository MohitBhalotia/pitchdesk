import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/models/KnowledgeBaseModel", () => ({
  default: { findOne: vi.fn(), create: vi.fn() },
}));
vi.mock("./pitchRooms", () => ({
  getOwnedRoom: vi.fn(),
}));

import KnowledgeBaseModel from "@/models/KnowledgeBaseModel";
import { getOwnedRoom } from "./pitchRooms";
import { getOrCreateKnowledgeBase, getKnowledgeBaseForRoom } from "./knowledgeBase";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const asMock = (fn: unknown) => fn as any;

describe("getOrCreateKnowledgeBase", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns null when the room isn't owned by this user", async () => {
    asMock(getOwnedRoom).mockResolvedValue(null);
    await expect(getOrCreateKnowledgeBase("u1", "r1")).resolves.toBeNull();
    expect(KnowledgeBaseModel.create).not.toHaveBeenCalled();
  });

  it("returns the existing KB without creating a new one", async () => {
    asMock(getOwnedRoom).mockResolvedValue({ _id: "r1", save: vi.fn() });
    const existingKb = { _id: "kb1" };
    asMock(KnowledgeBaseModel.findOne).mockResolvedValue(existingKb);

    const result = await getOrCreateKnowledgeBase("u1", "r1");

    expect(result).toBe(existingKb);
    expect(KnowledgeBaseModel.create).not.toHaveBeenCalled();
  });

  it("lazily creates a KB and links it onto the room on first source", async () => {
    const room = { _id: "r1", save: vi.fn(), knowledgeBaseId: null as unknown };
    asMock(getOwnedRoom).mockResolvedValue(room);
    asMock(KnowledgeBaseModel.findOne).mockResolvedValue(null);
    const newKb = { _id: "kb2" };
    asMock(KnowledgeBaseModel.create).mockResolvedValue(newKb);

    const result = await getOrCreateKnowledgeBase("u1", "r1");

    expect(result).toBe(newKb);
    expect(room.knowledgeBaseId).toBe("kb2");
    expect(room.save).toHaveBeenCalledTimes(1);
  });
});

describe("getKnowledgeBaseForRoom", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns undefined when the room isn't owned by this user", async () => {
    asMock(getOwnedRoom).mockResolvedValue(null);
    await expect(getKnowledgeBaseForRoom("u1", "r1")).resolves.toBeUndefined();
  });

  it("returns null (not undefined) when the room exists but has no KB yet", async () => {
    asMock(getOwnedRoom).mockResolvedValue({ _id: "r1" });
    asMock(KnowledgeBaseModel.findOne).mockResolvedValue(null);
    await expect(getKnowledgeBaseForRoom("u1", "r1")).resolves.toBeNull();
  });
});
