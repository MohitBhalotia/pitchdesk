import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { userPlanModel } from "@/models/UserPlanModel";
import "@/models/PlanModel";
import PitchModel from "@/models/PitchModel";
import generatedPitchModel from "@/models/generatedPitch";
import {PitchEval} from "@/models/PitchEvalModel";

// GET /api/user-stats?userId=...
export async function GET(req: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId parameter" },
        { status: 400 }
      );
    }

    // Find the user's active plan
    const userPlan = await userPlanModel
      .findOne({ userId, isActive: true })
      .populate("planId") // populate the plan details
      .lean();

    if (!userPlan) {
      return NextResponse.json(
        { message: "No active plan found for this user" },
        { status: 404 }
      );
    }

    const plan = userPlan.planId;

    // Calculate remaining usage
    const remainingTime = userPlan.pitchTimeRemaining;
    
    // Total pitches practiced
    const pitches = await PitchModel.find({ userId: userId });
    const totalPitches = pitches.length;
    
    // Total pitches generated
    const generatedPitches = await generatedPitchModel.find({ userId: userId });
    const totalPitchGenerated = generatedPitches.length;

    //total pitches evaluated
    const evaluatedPitches = await PitchEval.find({ userId: userId });
    const totalPitchEvaluated = evaluatedPitches.length;

    return NextResponse.json({
      planName: plan.name,
      totalPitches: totalPitches,
      totalPitchGenerated: totalPitchGenerated,
      totalTime:plan.pitchesTime,
      remainingTime,
      totalPitchEvaluated,
    });
  } catch (err) {
    console.error("Error fetching user stats:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}