import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../../src/models/PitchModel", () => ({
  default: { findById: vi.fn() },
}));
vi.mock("../../../src/models/RoomMemoryModel", () => ({
  default: { findOne: vi.fn(), create: vi.fn() },
}));
vi.mock("../../../src/models/PitchRoomModel", () => ({
  default: { findByIdAndUpdate: vi.fn() },
}));
vi.mock("../../../src/lib/memory/extractPitchMemory", () => ({
  extractPitchMemory: vi.fn(),
  buildMemorySummaryText: vi.fn(() => "a bounded summary"),
}));
vi.mock("../../../src/lib/ingestion/embedTexts", () => ({
  embedTexts: vi.fn(),
}));
vi.mock("../../../src/lib/queues", () => ({
  enqueueRegenerateRoomMemoryDigest: vi.fn(),
}));

import PitchModel from "../../../src/models/PitchModel";
import RoomMemoryModel from "../../../src/models/RoomMemoryModel";
import PitchRoomModel from "../../../src/models/PitchRoomModel";
import { extractPitchMemory } from "../../../src/lib/memory/extractPitchMemory";
import { embedTexts } from "../../../src/lib/ingestion/embedTexts";
import { enqueueRegenerateRoomMemoryDigest } from "../../../src/lib/queues";
import { runGenerateRoomMemoryJob } from "./runGenerateRoomMemoryJob";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const asMock = (fn: unknown) => fn as any;

function makePitch(overrides: Record<string, unknown> = {}) {
  return {
    _id: "pitch1",
    userId: "user1",
    pitchRoomId: "room1",
    conversationHistory: [{ role: "user", content: "Our ARR is $1M" }],
    ...overrides,
  };
}

describe("runGenerateRoomMemoryJob", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    asMock(PitchModel.findById).mockReturnValue({ lean: () => Promise.resolve(makePitch()) });
    asMock(RoomMemoryModel.findOne).mockReturnValue({
      select: () => ({ lean: () => Promise.resolve(null) }),
    });
    asMock(extractPitchMemory).mockResolvedValue({
      founderClaims: [],
      weaknesses: [],
      decisions: [],
      newFacts: [],
      recurringDifficulties: [],
    });
    asMock(embedTexts).mockResolvedValue([[0.1, 0.2]]);
    asMock(RoomMemoryModel.create).mockResolvedValue({ _id: "mem1" });
    asMock(PitchRoomModel.findByIdAndUpdate).mockReturnValue({
      select: () => Promise.resolve({ memoryDigestVersion: 2 }),
    });
  });

  it("does nothing if the pitch no longer exists", async () => {
    asMock(PitchModel.findById).mockReturnValue({ lean: () => Promise.resolve(null) });
    await runGenerateRoomMemoryJob("pitch1");
    expect(RoomMemoryModel.create).not.toHaveBeenCalled();
  });

  it("does nothing for a generic pitch (no pitchRoomId)", async () => {
    asMock(PitchModel.findById).mockReturnValue({
      lean: () => Promise.resolve(makePitch({ pitchRoomId: null })),
    });
    await runGenerateRoomMemoryJob("pitch1");
    expect(RoomMemoryModel.create).not.toHaveBeenCalled();
  });

  it("does nothing if a memory already exists for this pitch (defends against duplicate delivery)", async () => {
    asMock(RoomMemoryModel.findOne).mockReturnValue({
      select: () => ({ lean: () => Promise.resolve({ _id: "existing" }) }),
    });
    await runGenerateRoomMemoryJob("pitch1");
    expect(RoomMemoryModel.create).not.toHaveBeenCalled();
  });

  it("creates the memory and enqueues a digest rebuild with the bumped version", async () => {
    await runGenerateRoomMemoryJob("pitch1");

    expect(RoomMemoryModel.create).toHaveBeenCalledWith(
      expect.objectContaining({ roomId: "room1", pitchId: "pitch1", summaryText: "a bounded summary" })
    );
    expect(enqueueRegenerateRoomMemoryDigest).toHaveBeenCalledWith({ roomId: "room1", version: 2 });
  });

  it("swallows a duplicate-key error from a lost race and does not enqueue a second digest rebuild", async () => {
    const duplicateError = Object.assign(new Error("duplicate"), { code: 11000 });
    asMock(RoomMemoryModel.create).mockRejectedValue(duplicateError);

    await expect(runGenerateRoomMemoryJob("pitch1")).resolves.toBeUndefined();
    expect(enqueueRegenerateRoomMemoryDigest).not.toHaveBeenCalled();
  });

  it("propagates a non-duplicate-key error so BullMQ retries", async () => {
    asMock(RoomMemoryModel.create).mockRejectedValue(new Error("mongo is down"));
    await expect(runGenerateRoomMemoryJob("pitch1")).rejects.toThrow("mongo is down");
  });
});
