import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/models/PitchModel", () => ({
  default: { find: vi.fn(), create: vi.fn() },
}));
vi.mock("@/models/UserModel", () => ({
  default: { findByIdAndUpdate: vi.fn() },
}));

import PitchModel from "@/models/PitchModel";
import UserModel from "@/models/UserModel";
import { createPitchForSession } from "./pitchSession";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const asMock = (fn: unknown) => fn as any;

function mockNoExistingPitches() {
  asMock(PitchModel.find).mockReturnValue({
    select: () => ({ lean: () => Promise.resolve([]) }),
  });
}

describe("createPitchForSession", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("allocates the next sequential pitch number and creates the pitch", async () => {
    mockNoExistingPitches();
    asMock(UserModel.findByIdAndUpdate).mockResolvedValue({ pitchSequence: 3 });
    asMock(PitchModel.create).mockImplementation((doc: unknown) => Promise.resolve(doc));

    const pitch = await createPitchForSession({
      userId: "u1",
      sessionId: "s1",
      agentId: null,
    });

    expect(pitch.pitchNumber).toBe(3);
    expect(pitch.title).toBe("Pitch 3");
    expect(pitch.agentId).toBeNull();
  });

  it("stores a valid-looking ObjectId agentId but drops an invalid one", async () => {
    mockNoExistingPitches();
    asMock(UserModel.findByIdAndUpdate).mockResolvedValue({ pitchSequence: 1 });
    asMock(PitchModel.create).mockImplementation((doc: unknown) => Promise.resolve(doc));

    const pitch = await createPitchForSession({
      userId: "u1",
      sessionId: "s1",
      agentId: "not-a-valid-object-id",
    });

    expect(pitch.agentId).toBeNull();
  });

  it("throws when the user cannot be found while allocating a title", async () => {
    mockNoExistingPitches();
    asMock(UserModel.findByIdAndUpdate).mockResolvedValue(null);

    await expect(
      createPitchForSession({ userId: "missing", sessionId: "s1" })
    ).rejects.toThrow("User not found while allocating a pitch title");
  });
});
