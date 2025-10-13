import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import {userPlanModel} from "@/models/UserPlanModel";
import  "@/models/PlanModel";


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
    const userPlan = await userPlanModel.findOne({ userId, isActive: true })
      .populate("planId") // populate the plan details
      .lean();

    if (!userPlan) {
      return NextResponse.json(
        { message: "No active plan found for this user" },
        { status: 404 }
      );
    }
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const plan: any = userPlan.planId;

    // Calculate remaining usage
    const remainingPitches = plan.pitchesNumber - userPlan.usage.pitchNumberUsed;
    const remainingTime = plan.pitchesTime - userPlan.usage.pitchTimeUsed;

    return NextResponse.json({
      planName: plan.name,
      totalPitches: plan.pitchesNumber,
      usedPitches: userPlan.usage.pitchNumberUsed,
      remainingPitches,
      totalTime: plan.pitchesTime,
      usedTime: userPlan.usage.pitchTimeUsed,
      remainingTime,
    });
  } catch (err) {
    console.error("Error fetching user stats:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
