import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import PitchModel from "@/models/PitchModel";
import { deductPitchCredits, PitchCreditError } from "@/lib/services/pitchCredits";
import { enqueueGenerateRoomMemory } from "@/lib/queues";

const CREDIT_ERROR_STATUS: Record<PitchCreditError["code"], number> = {
  PITCH_NOT_FOUND: 404,
  COMPETITION_NOT_FOUND: 404,
  PARTICIPANT_NOT_FOUND: 404,
  INCUBATION_PARTICIPANT_NOT_FOUND: 404,
  USER_PLAN_NOT_FOUND: 404,
};

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

    try {
      await deductPitchCredits({ pitchId, userId, duration, competitionId, incubationId });
    } catch (error) {
      if (error instanceof PitchCreditError) {
        return NextResponse.json(
          { success: false, message: error.message },
          { status: CREDIT_ERROR_STATUS[error.code] }
        );
      }
      throw error;
    }

    // Fires the Phase 4 memory pipeline for room pitches only -- a generic
    // pitch has no pitchRoomId and nothing to remember it against. Producer
    // side only: this enqueues, the worker does the actual generation.
    if (pitch.pitchRoomId) {
      await enqueueGenerateRoomMemory({ pitchId: String(pitch._id) });
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
