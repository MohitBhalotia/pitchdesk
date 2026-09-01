import PitchModel from "@/models/PitchModel";
import { userPlanModel } from "@/models/UserPlanModel";
import Competition from "@/models/Competition";
import Participant from "@/models/Participant";
import IncubationParticipant from "@/models/IncubationParticipant";

export type PitchCreditErrorCode =
  | "PITCH_NOT_FOUND"
  | "COMPETITION_NOT_FOUND"
  | "PARTICIPANT_NOT_FOUND"
  | "INCUBATION_PARTICIPANT_NOT_FOUND"
  | "USER_PLAN_NOT_FOUND";

export class PitchCreditError extends Error {
  code: PitchCreditErrorCode;
  constructor(message: string, code: PitchCreditErrorCode) {
    super(message);
    this.name = "PitchCreditError";
    this.code = code;
  }
}

export interface DeductPitchCreditsInput {
  pitchId: string;
  userId: string;
  duration: number;
  competitionId?: string | null;
  incubationId?: string | null;
}

export interface DeductPitchCreditsResult {
  /** false when usedMinutes did not exceed what was already recorded — a no-op. */
  deducted: boolean;
  newCreditsUsed: number;
}

/**
 * Deducts pitch-time credits for one pitch update/end, applying the same
 * timing rules for a normal practice pitch, a competition pitch (practice or
 * live), or an incubation pitch. Shared by the generic end-pitch route and
 * the Inngest update-pitch job (previously two independently maintained
 * copies of this branching logic) so both — and, from Phase 3 onward, room
 * pitches — follow identical rules.
 */
export async function deductPitchCredits({
  pitchId,
  userId,
  duration,
  competitionId,
  incubationId,
}: DeductPitchCreditsInput): Promise<DeductPitchCreditsResult> {
  const pitch = await PitchModel.findById(pitchId);
  if (!pitch) {
    throw new PitchCreditError("Pitch not found", "PITCH_NOT_FOUND");
  }

  const usedMinutes = Math.ceil(duration / 60);
  if (usedMinutes <= (pitch.creditsUsed ?? 0)) {
    return { deducted: false, newCreditsUsed: 0 };
  }

  const newCreditsUsed = usedMinutes - (pitch.creditsUsed ?? 0);
  pitch.creditsUsed = usedMinutes;
  await pitch.save();

  if (competitionId) {
    const competition = await Competition.findById(competitionId);
    if (!competition) {
      throw new PitchCreditError("Competition not found", "COMPETITION_NOT_FOUND");
    }

    const participant = await Participant.findOne({ userId, competitionId });
    if (!participant) {
      throw new PitchCreditError("Participant not found", "PARTICIPANT_NOT_FOUND");
    }

    if (competition.isPractice) {
      const user = await userPlanModel.findOne({ userId });
      if (user) {
        user.pitchTimeRemaining -= newCreditsUsed;
        await user.save();
      }
      participant.pitchSubmitted = true;
      await participant.save();
    } else {
      participant.pitchTime -= newCreditsUsed;
      participant.pitchSubmitted = true;
      await participant.save();
    }
  } else if (incubationId) {
    const incubationParticipant = await IncubationParticipant.findOne({
      founderId: userId,
      programId: incubationId,
    });
    if (!incubationParticipant) {
      throw new PitchCreditError(
        "Incubation participant not found",
        "INCUBATION_PARTICIPANT_NOT_FOUND"
      );
    }
    incubationParticipant.pitchTime -= newCreditsUsed;
    incubationParticipant.pitchSubmitted = true;
    await incubationParticipant.save();
  } else {
    const user = await userPlanModel.findOne({ userId });
    if (!user) {
      throw new PitchCreditError("User plan not found", "USER_PLAN_NOT_FOUND");
    }
    user.pitchTimeRemaining -= newCreditsUsed;
    await user.save();
  }

  return { deducted: true, newCreditsUsed };
}
