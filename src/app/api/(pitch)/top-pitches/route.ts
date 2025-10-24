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

     // SPECIFIC PITCH IDs 
    const selectedPitchIds = [
      '68f5d18a61cdc67c8a7e0cf9',
      '68f65c48735d8e9e2658fab8', 
      '68f550c2c1757a0264a2cd2c'
    ];

    const pitches = await PitchModel.find({ _id: { $in: selectedPitchIds } })
      .sort({ updatedAt: -1 }) 
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