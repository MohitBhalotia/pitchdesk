// app/api/leaderboard/route.ts
import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { CompetitionPitchEval } from '@/models/CompetitionPitchEvalModel';
import dbConnect from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const competitionId = searchParams.get('competitionId');

    if (!competitionId) {
      return NextResponse.json(
        { error: 'competitionId query parameter is required' },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(competitionId)) {
      return NextResponse.json(
        { error: 'Invalid competition ID' },
        { status: 400 }
      );
    }

    // Fetch leaderboard data with participant information
    const leaderboard = await CompetitionPitchEval.aggregate([
      {
        $match: {
          competitionId: new mongoose.Types.ObjectId(competitionId)
        }
      },
      {
        $lookup: {
          from: 'participants',
          let: { evalUserId: '$userId', evalCompetitionId: '$competitionId' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$userId', '$$evalUserId'] },
                    { $eq: ['$competitionId', '$$evalCompetitionId'] }
                  ]
                }
              }
            }
          ],
          as: 'participant'
        }
      },
      {
        $unwind: '$participant'
      },
      {
        $project: {
          _id: 1,
          totalScore: '$scores.TotalScore',
          userId: '$userId',
          teamName: '$participant.teamName',
          teamLeaderName: '$participant.teamLeader.name',
          teamLeaderEmail: '$participant.teamLeader.email',
          submissionTime: '$createdAt'
        }
      },
      {
        $sort: { totalScore: -1, submissionTime: 1 }
      },
      {
        $limit: 100
      }
    ]);

    // Add rank position
    const rankedLeaderboard = leaderboard.map((entry, index) => ({
      ...entry,
      rank: index + 1
    }));

    return NextResponse.json(rankedLeaderboard);

  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}