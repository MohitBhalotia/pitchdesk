import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import mongoose from 'mongoose';
import PitchModel from '@/models/PitchModel';
import { CompetitionPitchEval } from '@/models/CompetitionPitchEvalModel';
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

    // Fetch ALL pitches for this user and competition, sorted by most recent first
    const pitches = await PitchModel.find({
      userId: new mongoose.Types.ObjectId(userId),
      competitionId: new mongoose.Types.ObjectId(competitionId)
    })
      .sort({ createdAt: -1 })
      .lean();

    // Fetch all evaluations for these pitches
    const pitchIds = pitches.map(p => p._id);
    const evaluations = await CompetitionPitchEval.find({
      pitchId: { $in: pitchIds }
    }).lean();

    // Create a map of pitchId -> evaluation for quick lookup
    const evaluationMap = new Map();
    evaluations.forEach(evaluation => {
      evaluationMap.set(evaluation.pitchId.toString(), evaluation);
    });

    // Attach evaluation status to each pitch
    const pitchesWithStatus = pitches.map(pitch => ({
      ...pitch,
      hasEvaluation: evaluationMap.has(pitch._id.toString()),
      evaluation: evaluationMap.get(pitch._id.toString()) || null
    }));

    console.log(`Found ${pitches.length} competition pitches for user ${userId} in competition ${competitionId}`);

    // Return all pitches with their evaluation status
    return NextResponse.json({ pitches: pitchesWithStatus }, { status: 200 });

  } catch (error) {
    console.error("Error fetching competition pitches:", error);
    return NextResponse.json(
      { error: "Failed to fetch competition pitches" },
      { status: 500 }
    );
  }
}