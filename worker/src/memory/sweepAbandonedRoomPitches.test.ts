import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../../src/models/PitchModel", () => ({
  default: { find: vi.fn() },
}));
vi.mock("../../../src/lib/queues", () => ({
  enqueueRecoverAbandonedRoomPitch: vi.fn(),
}));

import PitchModel from "../../../src/models/PitchModel";
import { enqueueRecoverAbandonedRoomPitch } from "../../../src/lib/queues";
import { sweepAbandonedRoomPitches } from "./sweepAbandonedRoomPitches";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const asMock = (fn: unknown) => fn as any;

function mockCandidates(ids: string[]) {
  asMock(PitchModel.find).mockReturnValue({
    select: () => ({ lean: () => Promise.resolve(ids.map((_id) => ({ _id }))) }),
  });
}

describe("sweepAbandonedRoomPitches", () => {
  beforeEach(() => vi.clearAllMocks());

  it("enqueues recovery for every stale candidate and returns the count", async () => {
    mockCandidates(["p1", "p2"]);

    const count = await sweepAbandonedRoomPitches();

    expect(count).toBe(2);
    expect(enqueueRecoverAbandonedRoomPitch).toHaveBeenCalledWith({ pitchId: "p1" });
    expect(enqueueRecoverAbandonedRoomPitch).toHaveBeenCalledWith({ pitchId: "p2" });
  });

  it("queries only room pitches with no endTime and a stale lastUpdated", async () => {
    mockCandidates([]);
    await sweepAbandonedRoomPitches();

    expect(PitchModel.find).toHaveBeenCalledWith(
      expect.objectContaining({
        pitchRoomId: { $ne: null },
        endTime: null,
        lastUpdated: expect.objectContaining({ $lt: expect.any(Date) }),
      })
    );
  });

  it("returns 0 and enqueues nothing when there are no stale pitches", async () => {
    mockCandidates([]);
    await expect(sweepAbandonedRoomPitches()).resolves.toBe(0);
    expect(enqueueRecoverAbandonedRoomPitch).not.toHaveBeenCalled();
  });
});
