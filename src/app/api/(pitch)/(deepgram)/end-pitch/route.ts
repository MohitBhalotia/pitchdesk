import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import PitchModel from "@/models/PitchModel";
import { userPlanModel } from "@/models/UserPlanModel";
import Competition from "@/models/Competition";
import Participant from "@/models/Participant";
import IncubationParticipant from "@/models/IncubationParticipant";

export async function POST(req: Request) {
  await dbConnect();
  try {
    const { pitchId, sessionId, competitionId, incubationId, userId, transcript, duration } = await req.json();

    const pitch = await PitchModel.findById(pitchId);
    if (!pitch) {
      return NextResponse.json(
        { success: false, message: "Pitch not found" },
        { status: 404 }
      );
    }

    pitch.endTime = new Date();
    pitch.conversationHistory = transcript;
    pitch.sessionId = sessionId;
    pitch.competitionId = competitionId ?? null;
    pitch.incubationId = incubationId ?? null;
    pitch.duration = Math.ceil(duration);
    await pitch.save();

    // Same credit deduction logic as Inngest updatePitch
    const usedMinutes = Math.ceil(duration / 60);

    if (usedMinutes > (pitch.creditsUsed ?? 0)) {
      const newCreditsUsed = usedMinutes - (pitch.creditsUsed ?? 0);
      pitch.creditsUsed = usedMinutes;
      await pitch.save();

      if (competitionId) {
        const competition = await Competition.findById(competitionId);
        if (!competition) {
          return NextResponse.json(
            { success: false, message: "Competition not found" },
            { status: 404 }
          );
        }

        const participant = await Participant.findOne({ userId, competitionId });
        if (!participant) {
          return NextResponse.json(
            { success: false, message: "Participant not found" },
            { status: 404 }
          );
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
        if (incubationParticipant) {
          incubationParticipant.pitchTime -= newCreditsUsed;
          incubationParticipant.pitchSubmitted = true;
          await incubationParticipant.save();
        }
      } else {
        const user = await userPlanModel.findOne({ userId });
        if (!user) {
          return NextResponse.json(
            { success: false, message: "User plan not found" },
            { status: 404 }
          );
        }
        user.pitchTimeRemaining -= newCreditsUsed;
        await user.save();
      }
    }

    return NextResponse.json(
      { success: true, message: "Pitch session ended successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error ending pitch", error);
    return NextResponse.json(
      { success: false, message: "Error ending pitch" },
      { status: 500 }
    );
  }
}
