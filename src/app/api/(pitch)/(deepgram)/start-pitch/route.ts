import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import PitchModel from "@/models/PitchModel";
import { userPlanModel } from "@/models/UserPlanModel";
import Competition from "@/models/Competition";
import Participant from "@/models/Participant";
import IncubationParticipant from "@/models/IncubationParticipant";
import UserModel from "@/models/UserModel";
import mongoose from "mongoose";

const DEFAULT_PITCH_TITLE_PATTERN = /^Pitch (\d+)$/;

async function getNextPitchNumber(userId: string) {
  const existingNumberedPitches = await PitchModel.find({
    userId,
    title: { $regex: DEFAULT_PITCH_TITLE_PATTERN },
  })
    .select("title pitchNumber")
    .lean();

  const highestExistingNumber = existingNumberedPitches.reduce((highest, pitch) => {
    const titleMatch = pitch.title?.match(DEFAULT_PITCH_TITLE_PATTERN);
    const numberFromTitle = titleMatch ? Number(titleMatch[1]) : 0;
    return Math.max(highest, pitch.pitchNumber ?? 0, numberFromTitle);
  }, 0);

  // The per-user counter is incremented atomically. For existing users it is
  // first raised to the highest legacy "Pitch N" value, so deleting a pitch
  // never makes a future title collide with or reuse an earlier number.
  const updatedUser = await UserModel.findByIdAndUpdate(
    userId,
    [
      {
        $set: {
          pitchSequence: {
            $add: [
              {
                $max: [
                  { $ifNull: ["$pitchSequence", 0] },
                  highestExistingNumber,
                ],
              },
              1,
            ],
          },
        },
      },
    ],
    { new: true }
  );

  if (!updatedUser) {
    throw new Error("User not found while allocating a pitch title");
  }

  return updatedUser.pitchSequence;
}

async function createNumberedPitch({
  userId,
  sessionId,
  agentId,
  competitionId,
  incubationId,
}: {
  userId: string;
  sessionId: string;
  agentId?: string | null;
  competitionId?: string | null;
  incubationId?: string | null;
}) {
  const pitchNumber = await getNextPitchNumber(userId);
  const storedAgentId =
    agentId && mongoose.Types.ObjectId.isValid(agentId) ? agentId : null;

  return PitchModel.create({
    userId,
    pitchNumber,
    title: `Pitch ${pitchNumber}`,
    sessionId,
    agentId: storedAgentId,
    lastUpdated: Date.now(),
    startTime: Date.now(),
    competitionId: competitionId ?? null,
    incubationId: incubationId ?? null,
  });
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { userId, sessionId, agentId, competitionId, incubationId } = await req.json();
    if (!userId)
      return NextResponse.json(
        {
          success: false,
          message: "User ID is required",
        },
        { status: 400 }
      );

    const user = await userPlanModel.findOne({ userId });

    // If incubation program, use dedicated incubation participant time
    if (incubationId) {
      const incubationParticipant = await IncubationParticipant.findOne({
        founderId: userId,
        programId: incubationId,
      });

      if (!incubationParticipant) {
        return NextResponse.json(
          {
            success: false,
            message: "You are not registered for this investment program. Please register first.",
          },
          { status: 404 }
        );
      }

      if (incubationParticipant.pitchSubmitted) {
        return NextResponse.json(
          {
            success: false,
            message: "You have already submitted your pitch for this program",
          },
          { status: 400 }
        );
      }

      const pitch = await createNumberedPitch({
        userId,
        sessionId,
        agentId,
        competitionId,
        incubationId,
      });

      return NextResponse.json(
        {
          success: true,
          message: "Pitch started successfully",
          data: {
            pitch,
            remainingTime: incubationParticipant.pitchTime,
          },
        },
        { status: 200 }
      );
    }

    // If competition then, check if it is a practice competition and if the user has no pitch time remaining throw error
    if (competitionId) {
      const competition = await Competition.findOne({ _id: competitionId });
      if (!competition) {
        return NextResponse.json(
          {
            success: false,
            message: "Competition not found",
          },
          { status: 404 }
        );
      }
      if (new Date(Date.now()) < competition.eventInterval?.start) {
        return NextResponse.json(
          {
            success: false,
            message: "Competition has not started yet",
          },
          { status: 400 }
        );
      }
      // If practice competition and user has no pitch time remaining throw error
      else if (competition.isPractice) {
        if (user?.pitchTimeRemaining <= 0) {
          return NextResponse.json(
            {
              success: false,
              message: "User has no pitch time remaining",
            },
            { status: 400 }
          );
        } else {
          // If practice competition and user has pitch time remaining, create pitch
          const pitch = await createNumberedPitch({
            userId,
            sessionId,
            agentId,
            competitionId,
          });
          return NextResponse.json(
            {
              success: true,
              message: "Pitch started successfully",
              data: {
                pitch,
                remainingTime: user?.pitchTimeRemaining,
              },
            },
            { status: 200 }
          );
        }
      } else {
        // If not practice check if the pitch is not submitted and fetch remaining time
        const participant = await Participant.findOne({
          userId,
          competitionId,
        });
        if (!participant) {
          return NextResponse.json(
            {
              success: false,
              message: "You are not registered for this competition",
            },
            { status: 404 }
          );
        }
        if (participant?.pitchSubmitted) {
          return NextResponse.json(
            {
              success: false,
              message: "Pitch already submitted",
            },
            { status: 400 }
          );
        } else {
          const pitch = await createNumberedPitch({
            userId,
            sessionId,
            agentId,
            competitionId,
          });
          return NextResponse.json(
            {
              success: true,
              message: "Pitch started successfully",
              data: {
                pitch,
                remainingTime: participant?.pitchTime,
              },
            },
            { status: 200 }
          );
        }
      }
    } else {
      // Normal practice pitch - uses dashboard minutes
      const pitch = await createNumberedPitch({
        userId,
        sessionId,
        agentId,
        competitionId,
      });
      return NextResponse.json(
        {
          success: true,
          message: "Pitch started successfully",
          data: {
            pitch,
            remainingTime: user?.pitchTimeRemaining,
          },
        },
        { status: 200 }
      );
    }
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
