import { NextRequest, NextResponse } from "next/server";
import PitchModel from "@/models/PitchModel";
import dbConnect from "@/lib/db";

export async function GET(req: NextRequest,context: { params: Promise<{ userId: string }> }) {
  try {
    await dbConnect();
    const {userId: userIdParams} = await context.params;

    const pitches: Pitch[] = await PitchModel.find({
      userIdParams,
    })

    return NextResponse.json(pitches, { status: 200 });
  } catch (error) {
    console.error("Error fetching pitches:", error);
    return NextResponse.json(
      { error: "Failed to fetch pitches" },
      { status: 500 }
    );
  }
}
