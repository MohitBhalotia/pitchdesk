import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../../src/models/PitchModel", () => ({
  default: { findById: vi.fn() },
}));
vi.mock("../../../src/lib/services/pitchCredits", async () => {
  const actual = await vi.importActual<typeof import("../../../src/lib/services/pitchCredits")>(
    "../../../src/lib/services/pitchCredits"
  );
  return { ...actual, deductPitchCredits: vi.fn() };
});
vi.mock("../../../src/lib/queues", () => ({
  enqueueGenerateRoomMemory: vi.fn(),
}));

import PitchModel from "../../../src/models/PitchModel";
import { deductPitchCredits, PitchCreditError } from "../../../src/lib/services/pitchCredits";
import { enqueueGenerateRoomMemory } from "../../../src/lib/queues";
import { runRecoverAbandonedRoomPitchJob } from "./runRecoverAbandonedRoomPitchJob";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const asMock = (fn: unknown) => fn as any;

const STALE_TIME = new Date(Date.now() - 10 * 60 * 1000);
const RECENT_TIME = new Date(Date.now() - 30 * 1000);

function makePitch(overrides: Record<string, unknown> = {}) {
  return {
    _id: "pitch1",
    userId: "user1",
    pitchRoomId: "room1",
    endTime: null,
    startTime: new Date(Date.now() - 20 * 60 * 1000),
    lastUpdated: STALE_TIME,
    save: vi.fn(),
    ...overrides,
  };
}

describe("runRecoverAbandonedRoomPitchJob", () => {
  beforeEach(() => vi.clearAllMocks());

  it("does nothing if the pitch no longer exists", async () => {
    asMock(PitchModel.findById).mockResolvedValue(null);
    await runRecoverAbandonedRoomPitchJob("pitch1");
    expect(enqueueGenerateRoomMemory).not.toHaveBeenCalled();
  });

  it("does nothing if the pitch already has a clean endTime", async () => {
    asMock(PitchModel.findById).mockResolvedValue(makePitch({ endTime: new Date() }));
    await runRecoverAbandonedRoomPitchJob("pitch1");
    expect(enqueueGenerateRoomMemory).not.toHaveBeenCalled();
  });

  it("does nothing for a generic pitch (no pitchRoomId)", async () => {
    asMock(PitchModel.findById).mockResolvedValue(makePitch({ pitchRoomId: null }));
    await runRecoverAbandonedRoomPitchJob("pitch1");
    expect(enqueueGenerateRoomMemory).not.toHaveBeenCalled();
  });

  it("does nothing if the last heartbeat is still recent (likely a live session)", async () => {
    asMock(PitchModel.findById).mockResolvedValue(makePitch({ lastUpdated: RECENT_TIME }));
    await runRecoverAbandonedRoomPitchJob("pitch1");
    expect(enqueueGenerateRoomMemory).not.toHaveBeenCalled();
  });

  it("finalizes a stale pitch, deducts credits, and enqueues memory generation", async () => {
    const pitch = makePitch();
    asMock(PitchModel.findById).mockResolvedValue(pitch);
    asMock(deductPitchCredits).mockResolvedValue({ deducted: true, newCreditsUsed: 5 });

    await runRecoverAbandonedRoomPitchJob("pitch1");

    expect(pitch.endTime).toBe(STALE_TIME);
    expect(pitch.save).toHaveBeenCalled();
    expect(deductPitchCredits).toHaveBeenCalledWith(
      expect.objectContaining({ pitchId: "pitch1", userId: "user1" })
    );
    expect(enqueueGenerateRoomMemory).toHaveBeenCalledWith({ pitchId: "pitch1" });
  });

  it("still enqueues memory generation when credit deduction fails with a PitchCreditError", async () => {
    asMock(PitchModel.findById).mockResolvedValue(makePitch());
    asMock(deductPitchCredits).mockRejectedValue(new PitchCreditError("no plan", "USER_PLAN_NOT_FOUND"));

    await runRecoverAbandonedRoomPitchJob("pitch1");

    expect(enqueueGenerateRoomMemory).toHaveBeenCalledWith({ pitchId: "pitch1" });
  });

  it("propagates a non-credit error so BullMQ retries", async () => {
    asMock(PitchModel.findById).mockResolvedValue(makePitch());
    asMock(deductPitchCredits).mockRejectedValue(new Error("mongo is down"));

    await expect(runRecoverAbandonedRoomPitchJob("pitch1")).rejects.toThrow("mongo is down");
    expect(enqueueGenerateRoomMemory).not.toHaveBeenCalled();
  });
});
