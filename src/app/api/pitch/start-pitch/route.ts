import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import PitchModel from "@/models/PitchModel";

export async function POST(req: NextRequest) {
  await dbConnect();
  const { userId} = await req.json();
  if(!userId) return NextResponse.json({
    success: false,
    message: "User ID is required",
  }, { status: 400 });
  const pitch = await PitchModel.create({ userId,lastUpdated: Date.now(), startTime: Date.now() });
  return NextResponse.json({
    success: true,
    message: "Pitch started successfully",
    pitch,
  });
}