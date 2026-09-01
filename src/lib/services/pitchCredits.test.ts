import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/models/PitchModel", () => ({
  default: { findById: vi.fn() },
}));
vi.mock("@/models/UserPlanModel", () => ({
  userPlanModel: { findOne: vi.fn() },
}));
vi.mock("@/models/Competition", () => ({
  default: { findById: vi.fn() },
}));
vi.mock("@/models/Participant", () => ({
  default: { findOne: vi.fn() },
}));
vi.mock("@/models/IncubationParticipant", () => ({
  default: { findOne: vi.fn() },
}));

import PitchModel from "@/models/PitchModel";
import { userPlanModel } from "@/models/UserPlanModel";
import Competition from "@/models/Competition";
import Participant from "@/models/Participant";
import IncubationParticipant from "@/models/IncubationParticipant";
import { deductPitchCredits } from "./pitchCredits";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const asMock = (fn: unknown) => fn as any;

describe("deductPitchCredits", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("is a no-op when usedMinutes does not exceed recorded creditsUsed", async () => {
    const pitch = { creditsUsed: 5, save: vi.fn() };
    asMock(PitchModel.findById).mockResolvedValue(pitch);

    const result = await deductPitchCredits({ pitchId: "p1", userId: "u1", duration: 250 });

    expect(result).toEqual({ deducted: false, newCreditsUsed: 0 });
    expect(pitch.save).not.toHaveBeenCalled();
  });

  it("deducts from the user's plan for a normal (non-competition, non-incubation) pitch", async () => {
    const pitch = { creditsUsed: 0, save: vi.fn() };
    asMock(PitchModel.findById).mockResolvedValue(pitch);
    const user = { pitchTimeRemaining: 30, save: vi.fn() };
    asMock(userPlanModel.findOne).mockResolvedValue(user);

    const result = await deductPitchCredits({ pitchId: "p1", userId: "u1", duration: 120 });

    expect(result).toEqual({ deducted: true, newCreditsUsed: 2 });
    expect(pitch.creditsUsed).toBe(2);
    expect(pitch.save).toHaveBeenCalledTimes(1);
    expect(user.pitchTimeRemaining).toBe(28);
    expect(user.save).toHaveBeenCalledTimes(1);
  });

  it("throws USER_PLAN_NOT_FOUND when there is no plan for a normal pitch", async () => {
    asMock(PitchModel.findById).mockResolvedValue({ creditsUsed: 0, save: vi.fn() });
    asMock(userPlanModel.findOne).mockResolvedValue(null);

    await expect(
      deductPitchCredits({ pitchId: "p1", userId: "u1", duration: 60 })
    ).rejects.toMatchObject({ code: "USER_PLAN_NOT_FOUND" });
  });

  it("deducts from the founder's plan and marks the participant submitted for a practice competition", async () => {
    const pitch = { creditsUsed: 0, save: vi.fn() };
    asMock(PitchModel.findById).mockResolvedValue(pitch);
    asMock(Competition.findById).mockResolvedValue({ isPractice: true });
    const participant = { pitchSubmitted: false, save: vi.fn() };
    asMock(Participant.findOne).mockResolvedValue(participant);
    const user = { pitchTimeRemaining: 10, save: vi.fn() };
    asMock(userPlanModel.findOne).mockResolvedValue(user);

    const result = await deductPitchCredits({
      pitchId: "p1",
      userId: "u1",
      duration: 60,
      competitionId: "c1",
    });

    expect(result.deducted).toBe(true);
    expect(user.pitchTimeRemaining).toBe(9);
    expect(participant.pitchSubmitted).toBe(true);
    expect(participant.save).toHaveBeenCalledTimes(1);
  });

  it("deducts from the participant's own pitchTime for a non-practice competition", async () => {
    const pitch = { creditsUsed: 0, save: vi.fn() };
    asMock(PitchModel.findById).mockResolvedValue(pitch);
    asMock(Competition.findById).mockResolvedValue({ isPractice: false });
    const participant = { pitchTime: 20, pitchSubmitted: false, save: vi.fn() };
    asMock(Participant.findOne).mockResolvedValue(participant);

    const result = await deductPitchCredits({
      pitchId: "p1",
      userId: "u1",
      duration: 60,
      competitionId: "c1",
    });

    expect(result.deducted).toBe(true);
    expect(participant.pitchTime).toBe(19);
    expect(participant.pitchSubmitted).toBe(true);
    expect(userPlanModel.findOne).not.toHaveBeenCalled();
  });

  it("throws PARTICIPANT_NOT_FOUND for a competition with no registered participant", async () => {
    asMock(PitchModel.findById).mockResolvedValue({ creditsUsed: 0, save: vi.fn() });
    asMock(Competition.findById).mockResolvedValue({ isPractice: false });
    asMock(Participant.findOne).mockResolvedValue(null);

    await expect(
      deductPitchCredits({ pitchId: "p1", userId: "u1", duration: 60, competitionId: "c1" })
    ).rejects.toMatchObject({ code: "PARTICIPANT_NOT_FOUND" });
  });

  it("throws COMPETITION_NOT_FOUND when the competition does not exist", async () => {
    asMock(PitchModel.findById).mockResolvedValue({ creditsUsed: 0, save: vi.fn() });
    asMock(Competition.findById).mockResolvedValue(null);

    await expect(
      deductPitchCredits({ pitchId: "p1", userId: "u1", duration: 60, competitionId: "missing" })
    ).rejects.toMatchObject({ code: "COMPETITION_NOT_FOUND" });
  });

  it("deducts from the incubation participant's pitchTime", async () => {
    const pitch = { creditsUsed: 0, save: vi.fn() };
    asMock(PitchModel.findById).mockResolvedValue(pitch);
    const incubationParticipant = { pitchTime: 15, pitchSubmitted: false, save: vi.fn() };
    asMock(IncubationParticipant.findOne).mockResolvedValue(incubationParticipant);

    const result = await deductPitchCredits({
      pitchId: "p1",
      userId: "u1",
      duration: 60,
      incubationId: "i1",
    });

    expect(result.deducted).toBe(true);
    expect(incubationParticipant.pitchTime).toBe(14);
    expect(incubationParticipant.pitchSubmitted).toBe(true);
  });

  it("throws INCUBATION_PARTICIPANT_NOT_FOUND when there is no registered incubation participant", async () => {
    asMock(PitchModel.findById).mockResolvedValue({ creditsUsed: 0, save: vi.fn() });
    asMock(IncubationParticipant.findOne).mockResolvedValue(null);

    await expect(
      deductPitchCredits({ pitchId: "p1", userId: "u1", duration: 60, incubationId: "i1" })
    ).rejects.toMatchObject({ code: "INCUBATION_PARTICIPANT_NOT_FOUND" });
  });

  it("throws PITCH_NOT_FOUND when the pitch does not exist", async () => {
    asMock(PitchModel.findById).mockResolvedValue(null);

    await expect(
      deductPitchCredits({ pitchId: "missing", userId: "u1", duration: 60 })
    ).rejects.toMatchObject({ code: "PITCH_NOT_FOUND" });
  });
});
