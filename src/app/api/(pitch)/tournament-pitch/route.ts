import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import mongoose from 'mongoose';
import PitchModel from '@/models/PitchModel';
import authOptions from '@/lib/auth';
import dbConnect from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?._id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user._id;

    // Get competitionId from query parameters
    const { searchParams } = new URL(request.url);
    const competitionId = searchParams.get('competitionId');

    if (!competitionId) {
      return NextResponse.json(
        { error: "Competition ID is required" },
        { status: 400 }
      );
    }

    // Validate competitionId format
    if (!mongoose.Types.ObjectId.isValid(competitionId)) {
      return NextResponse.json(
        { error: "Invalid competition ID format" },
        { status: 400 }
      );
    }

    // Fetch the most recent pitch for this user and competition
    const pitch = await PitchModel.findOne({
      userId: new mongoose.Types.ObjectId(userId),
      competitionId: new mongoose.Types.ObjectId(competitionId)
    })
      .sort({ createdAt: -1 }) // Get the most recent one
      .lean();

    console.log(`Competition pitch found: ${!!pitch} for user ${userId} in competition ${competitionId}`);

    // Return the pitch (could be null if no pitch found)
    return NextResponse.json({ pitch }, { status: 200 });

  } catch (error) {
    console.error("Error fetching competition pitch:", error);
    return NextResponse.json(
      { error: "Failed to fetch competition pitch" },
      { status: 500 }
    );
  }
}