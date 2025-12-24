import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import Participant from '@/models/Participant';
import Competition from '@/models/Competition';
import dbConnect from '@/lib/db';
import { sendInviteEmailEvent } from '@/lib/inngest/email-helpers';
import crypto from 'crypto';
import mongoose from 'mongoose';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Grab competition to check team size
    const comp = await Competition.findById(body.competitionId);
    if (!comp) {
      return NextResponse.json({ error: 'Competition not found' }, { status: 404 });
    }
    const maxSize = comp.teamSize?.max || 1;
    const minSize = comp.teamSize?.min || 1;

    // Check leader + invited doesn't exceed max
    if ((body.teamMembers?.length || 0) > (maxSize - 1)) {
      return NextResponse.json({ error: `Maximum team size is ${maxSize}.` }, { status: 400 });
    }

    // Check if user is already registered
    const existingParticipant = await Participant.findOne({
      competitionId: body.competitionId,
      userId: body.userId
    });

    if (existingParticipant) {
      return NextResponse.json({ error: 'Already registered for this competition' }, { status: 400 });
    }

    // 1. Handle invite token & setup for invitees
    const inviteBaseUrl = `${process.env.NEXT_PUBLIC_APP_URL}/invite-competition?token=`;
    const teamMembersWithInvite = (body.teamMembers || []).map((member) => {
      const inviteToken = crypto.randomBytes(28).toString('base64url');
      return {
        ...member,
        status: 'pending',
        inviteToken: inviteToken
      };
    });
    const participant = await Participant.create({
      ...body,
      teamMembers: teamMembersWithInvite,
      teamStatus: minSize != 1 ? 'incomplete' : 'validated'
    });
    // 2. Send emails via Inngest queue
    await Promise.all(
      teamMembersWithInvite.map(async (member) => {
        const inviteLink = `${inviteBaseUrl}${encodeURIComponent(member.inviteToken)}`;
        await sendInviteEmailEvent(
          member.name,
          member.email,
          participant.teamName,
          participant.teamLeader.name,
          comp ? comp.title : 'a competition',
          inviteLink,
          (participant._id as mongoose.Types.ObjectId).toString(),
        );
      })
    );

    // Update total registered count
    await Competition.findByIdAndUpdate(body.competitionId, { $inc: { totalRegistered: 1 } });

    return NextResponse.json(participant, { status: 201 });
  } catch (error) {
    console.error('Error registering participant:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// ---- Add member endpoint ----
export async function PUT(request: NextRequest) {
  // /api/competitions/participants/add-member expects { participantId, name, email } in body
  try {
    await dbConnect();
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const body = await request.json();
    const { participantId, name, email } = body;
    if (!participantId || !name || !email) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }
    // Find participant & comp
    const participant = await Participant.findById(participantId);
    if (!participant) {
      return NextResponse.json({ error: 'Team not found.' }, { status: 404 });
    }
    // Only team leader can add
    if (session.user.email !== participant.teamLeader.email) {
      return NextResponse.json({ error: 'Only team leader can add members.' }, { status: 403 });
    }
    const comp = await Competition.findById(participant.competitionId);
    const max = comp?.teamSize?.max || 1;
    // Count (leader + pending + accepted)
    const currentCount = 1 + participant.teamMembers.filter(
      (m) => m.status === 'accepted' || m.status === 'pending'
    ).length;
    if (currentCount >= max) {
      return NextResponse.json({ error: `Team already at maximum size (${max}) including all accepted & pending members.` }, { status: 400 });
    }
    // Don't allow duplicate invite by email
    if (participant.teamMembers.find(m => m.email === email && m.status !== 'declined')) {
      return NextResponse.json({ error: 'This person is already invited.' }, { status: 400 });
    }
    // Generate token and push new member
    const inviteToken = crypto.randomBytes(28).toString('base64url');
    participant.teamMembers.push({ name, email, status: 'pending', inviteToken });
    await participant.save();
    // Send invite via Inngest queue
    const inviteBaseUrl = `${process.env.NEXT_PUBLIC_APP_URL}/invite-competition?token=`;
    const inviteLink = `${inviteBaseUrl}${encodeURIComponent(inviteToken)}`;
    await sendInviteEmailEvent(
      name,
      email,
      participant.teamName,
      participant.teamLeader.name,
      comp ? comp.title : 'a competition',
      inviteLink,
      (participant._id as mongoose.Types.ObjectId).toString(),
    );
    return NextResponse.json({ success: true, participant });
  } catch (error) {
    console.error('Error adding member:', error);
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
        competitionId: competitionId,
        $or: [
          { userId: userId }, // User is team leader
          { 'teamMembers.userId': userId } // User is an accepted team member
        ]
      });
      return NextResponse.json(participant);
    }

    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  } catch (error) {
    console.error('Error fetching participant:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}