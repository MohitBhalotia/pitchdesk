import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import PitchModel from "@/models/PitchModel";

export async function POST(req: NextRequest) {
  try{
  await dbConnect();
  const { userId, sessionId } = await req.json();
  if (!userId)
    return NextResponse.json(
      {
        success: false,
        message: "User ID is required",
      },
      { status: 400 }
    );
  const count = await PitchModel.countDocuments({userId})
  const pitch = await PitchModel.create({
    userId,
    title: `Pitch ${count + 1}`,
    sessionId,
    lastUpdated: Date.now(),
    startTime: Date.now(),
  });
  return NextResponse.json({
    success: true,
    message: "Pitch started successfully",
    pitch,
  });
  }catch(error){
    console.error("Error starting pitch", error)
    return NextResponse.json({
      success: false,
      message: "Internal Server Error"
    }, {status: 500})
  }
}
