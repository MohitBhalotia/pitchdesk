import { NextRequest, NextResponse } from "next/server";
import { inngest, pitchUpdateEvent } from "@/lib/inngest/client";

export async function POST(req: NextRequest) {
  try {
    const { pitchId, sessionId, competitionId, incubationId, userId, transcript, duration } = await req.json();
    await inngest.send(
      pitchUpdateEvent.create({
        pitchId: pitchId,
        sessionId: sessionId,
        competitionId: competitionId ?? null,
        incubationId: incubationId ?? null,
        userId: userId,
        transcript: transcript,
        duration: duration,
      })
    );
    return NextResponse.json(
      { success: true, message: "Pitch updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating pitch", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
