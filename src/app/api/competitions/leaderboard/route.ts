// app/api/leaderboard/route.ts
import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { CompetitionPitchEval } from '@/models/CompetitionPitchEvalModel';
import  Participant  from '@/models/Participant';
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

    //count total teams registered
    const totalRegisteredTeams = await Participant.countDocuments({ 
      competitionId: new mongoose.Types.ObjectId(competitionId)
    });
    
    // Fetch leaderboard data with participant information
    // Group by userId to get the best score per team
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
          submissionTime: '$createdAt',
          evaluationId: '$_id',
          pitchId: '$pitchId'
        }
      },
      // Sort by score descending, then by submission time ascending
      // This ensures we get the best score first, and if tied, the earliest submission
      {
        $sort: { totalScore: -1, submissionTime: 1 }
      },
      // Group by userId to get only the best score per team
      {
        $group: {
          _id: '$userId',
          totalScore: { $first: '$totalScore' },
          evaluationId: { $first: '$evaluationId' },
          submissionTime: { $first: '$submissionTime' },
          // Get team info from the best evaluation
          teamName: { $first: '$teamName' },
          teamLeaderName: { $first: '$teamLeaderName' },
          teamLeaderEmail: { $first: '$teamLeaderEmail' }
        }
      },
      {
        $project: {
          _id: '$evaluationId',
          userId: '$_id',
          totalScore: 1,
          teamName: 1,
          teamLeaderName: 1,
          teamLeaderEmail: 1,
          submissionTime: 1
        }
      },
      // Re-sort by best score
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
      rank: index + 1,
      evaluationDate: entry.submissionTime
    }));

    return NextResponse.json({rankedLeaderboard, totalRegisteredTeams});

  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}