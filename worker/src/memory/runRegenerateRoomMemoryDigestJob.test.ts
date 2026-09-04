import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../../src/models/PitchRoomModel", () => ({
  default: { findById: vi.fn() },
}));
vi.mock("../../../src/models/RoomMemoryModel", () => ({
  default: { find: vi.fn() },
}));
vi.mock("../../../src/lib/memory/buildMemoryDigest", () => ({
  buildMemoryDigest: vi.fn(),
}));

import PitchRoomModel from "../../../src/models/PitchRoomModel";
import RoomMemoryModel from "../../../src/models/RoomMemoryModel";
import { buildMemoryDigest } from "../../../src/lib/memory/buildMemoryDigest";
import { runRegenerateRoomMemoryDigestJob } from "./runRegenerateRoomMemoryDigestJob";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const asMock = (fn: unknown) => fn as any;

function mockMemoriesQuery(memories: unknown[]) {
  asMock(RoomMemoryModel.find).mockReturnValue({
    sort: () => ({
      limit: () => ({
        select: () => ({ lean: () => Promise.resolve(memories) }),
      }),
    }),
  });
}

describe("runRegenerateRoomMemoryDigestJob", () => {
  beforeEach(() => vi.clearAllMocks());

  it("does nothing if the room no longer exists", async () => {
    asMock(PitchRoomModel.findById).mockResolvedValue(null);
    await runRegenerateRoomMemoryDigestJob("room1", 1);
    expect(RoomMemoryModel.find).not.toHaveBeenCalled();
  });

  it("does nothing if the job's version has been superseded by a newer regeneration", async () => {
    asMock(PitchRoomModel.findById).mockResolvedValue({ memoryDigestVersion: 5, save: vi.fn() });
    await runRegenerateRoomMemoryDigestJob("room1", 3);
    expect(RoomMemoryModel.find).not.toHaveBeenCalled();
  });

  it("rebuilds and saves the digest when the version matches", async () => {
    const save = vi.fn();
    const room = { memoryDigestVersion: 2, memoryDigest: null, save };
    asMock(PitchRoomModel.findById).mockResolvedValue(room);
    mockMemoriesQuery([{ summaryText: "s1", createdAt: new Date() }]);
    asMock(buildMemoryDigest).mockResolvedValue("Compact digest text");

    await runRegenerateRoomMemoryDigestJob("room1", 2);

    expect(room.memoryDigest).toBe("Compact digest text");
    expect(save).toHaveBeenCalled();
  });

  it("sets memoryDigest to null when there are no memories left (e.g. all forgotten)", async () => {
    const save = vi.fn();
    const room = { memoryDigestVersion: 1, memoryDigest: "stale digest", save };
    asMock(PitchRoomModel.findById).mockResolvedValue(room);
    mockMemoriesQuery([]);
    asMock(buildMemoryDigest).mockResolvedValue("");

    await runRegenerateRoomMemoryDigestJob("room1", 1);

    expect(room.memoryDigest).toBeNull();
  });
});
