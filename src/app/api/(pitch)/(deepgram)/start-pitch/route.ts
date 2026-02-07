import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import PitchModel from "@/models/PitchModel";
import { userPlanModel } from "@/models/UserPlanModel";
import Competition from "@/models/Competition";
import Participant from "@/models/Participant";
import IncubationParticipant from "@/models/IncubationParticipant";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { userId, sessionId, competitionId, incubationId } = await req.json();
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

      const count = await PitchModel.countDocuments({ userId });
      const pitch = await PitchModel.create({
        userId,
        title: `Pitch ${count + 1}`,
        sessionId,
        lastUpdated: Date.now(),
        startTime: Date.now(),
        competitionId: competitionId ?? null,
        incubationId: incubationId ?? null,
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
          const count = await PitchModel.countDocuments({ userId });
          const pitch = await PitchModel.create({
            userId,
            title: `Pitch ${count + 1}`,
            sessionId,
            lastUpdated: Date.now(),
            startTime: Date.now(),
            competitionId: competitionId ?? null,
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
          const count = await PitchModel.countDocuments({ userId });
          const pitch = await PitchModel.create({
            userId,
            title: `Pitch ${count + 1}`,
            sessionId,
            lastUpdated: Date.now(),
            startTime: Date.now(),
            competitionId: competitionId ?? null,
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
      const count = await PitchModel.countDocuments({ userId });
      const pitch = await PitchModel.create({
        userId,
        title: `Pitch ${count + 1}`,
        sessionId,
        lastUpdated: Date.now(),
        startTime: Date.now(),
        competitionId: competitionId ?? null,
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
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
