import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import Participant from '@/models/Participant';
import Competition from '@/models/Competition';
import dbConnect from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    
    // Check if user is already registered
    const existingParticipant = await Participant.findOne({
      competitionId: body.competitionId,
      userId: body.userId
    });
    
    if (existingParticipant) {
      return NextResponse.json({ error: 'Already registered for this competition' }, { status: 400 });
    }
    
    const participant = await Participant.create(body);
    
    // Update total registered count
    await Competition.findByIdAndUpdate(body.competitionId, {
      $inc: { totalRegistered: 1 }
    });
    
    return NextResponse.json(participant, { status: 201 });
  } catch (error) {
    console.error('Error registering participant:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const competitionId = searchParams.get('competitionId');
    const userId = searchParams.get('userId');
    
    if (competitionId && userId) {
      const participant = await Participant.findOne({
        competitionId,
        userId:userId
      });
      return NextResponse.json(participant);
    }
    
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  } catch (error) {
    console.error('Error fetching participant:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}