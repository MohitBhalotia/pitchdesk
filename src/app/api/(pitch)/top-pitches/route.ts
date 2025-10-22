// import { NextRequest, NextResponse } from 'next/server';
// import { getServerSession } from 'next-auth';
// import authOptions from "@/lib/auth";
// import dbConnect from '@/lib/db';
// import PitchModel from '@/models/PitchModel';

// export async function GET(request: NextRequest) {
//   try {
//     const session = await getServerSession(authOptions);
    
//     if (!session) {
//       return NextResponse.json(
//         { error: 'Unauthorized' },
//         { status: 401 }
//       );
//     }
    
//     if (session.user.role !== 'vc') {
//       return NextResponse.json(
//         { error: 'Access denied. VC role required.' },
//         { status: 403 }
//       );
//     }

//     await dbConnect();

//     // Method 1: Find pitches that have evaluations using aggregation (Recommended)
//     const pitchesWithEvaluations = await PitchModel.aggregate([
//       {
//         $lookup: {
//           from: 'PitchEvaluation', 
//           localField: '_id',
//           foreignField: 'pitchId',
//           as: 'evaluations'
//         }
//       },
//       {
//         $match: {
//           'evaluations.0': { $exists: true } // Only pitches that have at least one evaluation
//         }
//       },
//       {
//         $sort: { updatedAt: -1 }
//       },
//       {
//         $limit: 20
//       },
//       {
//         $project: {
//           evaluations: 0 // Remove evaluations array from response
//         }
//       }
//     ]);


//     return NextResponse.json({
//       success: true,
//       pitches: pitchesWithEvaluations,
//       total: pitchesWithEvaluations.length,
//       message: `Found ${pitchesWithEvaluations.length} evaluated pitches for review`
//     });

//   } catch (error) {
//     console.error('Error fetching top pitches:', error);
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }


import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import  authOptions  from "@/lib/auth";
import dbConnect from '@/lib/db';
import PitchModel from '@/models/PitchModel';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    if (session.user.role !== 'vc') {
      return NextResponse.json(
        { error: 'Access denied. VC role required.' },
        { status: 403 }
      );
    }

    await dbConnect();

    const pitches = await PitchModel.find({})
      .sort({ updatedAt: -1 }) 
      .limit(20)
      .lean();

    return NextResponse.json({
      success: true,
      pitches,
      total: pitches.length,
      message: `Found ${pitches.length} pitches for review`
    });

  } catch (error) {
    console.error('Error fetching top pitches:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}