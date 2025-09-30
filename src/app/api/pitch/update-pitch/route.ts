import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../lib/db";
import PitchModel from "@/models/PitchModel";

export async function PATCH(req: NextRequest) {
  try {
    await dbConnect();
    const { sessionId } = await req.json();
    if(!sessionId) return NextResponse.json({
      success: false,
      message: "Session ID is required",
    }, { status: 400 });
    await PitchModel.findByIdAndUpdate(sessionId, {
      $set: { lastUpdated: new Date() },
    });

    return NextResponse.json({ message: "Pitch updated successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
