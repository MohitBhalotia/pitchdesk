import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import Competition from '@/models/Competition';
import dbConnect from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const competitionId = searchParams.get('id');

    if (competitionId) {
      const competition = await Competition.findById(competitionId);
      if (!competition) {
        return NextResponse.json({ error: 'Competition not found' }, { status: 404 });
      }
      return NextResponse.json(competition);
    }


    const competitions = await Competition.find({ isActive: true }).sort({ createdAt: -1 });
    

    return NextResponse.json(competitions);
  } catch (error) {
    console.error('Error fetching competitions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const competition = await Competition.create(body);

    return NextResponse.json(competition, { status: 201 });
  } catch (error) {
    console.error('Error creating competition:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}