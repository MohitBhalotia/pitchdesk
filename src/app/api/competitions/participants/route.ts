import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import Participant from '@/models/Participant';
import Competition from '@/models/Competition';
import dbConnect from '@/lib/db';
import resendInviteTeamMember from '@/lib/resend/resend-invite';
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

    // Check if user is already registered as leader or accepted member
    // Allow pending members to create their own team
    const existingParticipant = await Participant.findOne({
      competitionId: body.competitionId,
      $or: [
        { userId: body.userId }, // Already a leader
        { 'teamMembers.userId': body.userId, 'teamMembers.status': 'accepted' } // Accepted member
      ]
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
    // 2. Send emails via Resend to each invited member
    await Promise.all(
      teamMembersWithInvite.map(async (member) => {
        const inviteLink = `${inviteBaseUrl}${encodeURIComponent(member.inviteToken)}`;
        await resendInviteTeamMember(
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
    // Resend invite
    const inviteBaseUrl = `${process.env.NEXT_PUBLIC_APP_URL}/invite-competition?token=`;
    const inviteLink = `${inviteBaseUrl}${encodeURIComponent(inviteToken)}`;
    await resendInviteTeamMember(
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

// ---- Resend invite endpoint ----
export async function PATCH(request: NextRequest) {
  try {
    await dbConnect();
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const body = await request.json();
    const { participantId, memberEmail } = body;
    if (!participantId || !memberEmail) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }
    // Find participant
    const participant = await Participant.findById(participantId);
    if (!participant) {
      return NextResponse.json({ error: 'Team not found.' }, { status: 404 });
    }
    // Only team leader can resend
    if (session.user.email !== participant.teamLeader.email) {
      return NextResponse.json({ error: 'Only team leader can resend invitations.' }, { status: 403 });
    }
    // Find the member
    const member = participant.teamMembers.find(m => m.email === memberEmail);
    if (!member) {
      return NextResponse.json({ error: 'Member not found.' }, { status: 404 });
    }
    // Only allow resending to pending members
    if (member.status !== 'pending') {
      return NextResponse.json({ error: 'Can only resend invitations to pending members.' }, { status: 400 });
    }
    // Generate new token
    const inviteToken = crypto.randomBytes(28).toString('base64url');
    member.inviteToken = inviteToken;
    await participant.save();
    // Send email
    const comp = await Competition.findById(participant.competitionId);
    const inviteBaseUrl = `${process.env.NEXT_PUBLIC_APP_URL}/invite-competition?token=`;
    const inviteLink = `${inviteBaseUrl}${encodeURIComponent(inviteToken)}`;
    await resendInviteTeamMember(
      member.name,
      member.email,
      participant.teamName,
      participant.teamLeader.name,
      comp ? comp.title : 'a competition',
      inviteLink,
      (participant._id as mongoose.Types.ObjectId).toString(),
    );
    return NextResponse.json({ success: true, participant });
  } catch (error) {
    console.error('Error resending invite:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// ---- Remove pending member endpoint ----
export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const body = await request.json();
    const { participantId, memberEmail } = body;
    if (!participantId || !memberEmail) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }
    // Find participant
    const participant = await Participant.findById(participantId);
    if (!participant) {
      return NextResponse.json({ error: 'Team not found.' }, { status: 404 });
    }
    // Only team leader can remove
    if (session.user.email !== participant.teamLeader.email) {
      return NextResponse.json({ error: 'Only team leader can remove members.' }, { status: 403 });
    }
    // Find member index
    const memberIndex = participant.teamMembers.findIndex(m => m.email === memberEmail);
    if (memberIndex === -1) {
      return NextResponse.json({ error: 'Member not found.' }, { status: 404 });
    }
    const member = participant.teamMembers[memberIndex];
    // Only allow removing pending members
    if (member.status !== 'pending') {
      return NextResponse.json({ error: 'Can only remove members with pending invitations.' }, { status: 400 });
    }
    // Remove member
    participant.teamMembers.splice(memberIndex, 1);
    // Update team status if needed
    const comp = await Competition.findById(participant.competitionId);
    const minSize = comp?.teamSize?.min || 1;
    const acceptedCount = 1 + participant.teamMembers.filter(m => m.status === 'accepted').length;
    if (acceptedCount < minSize) {
      participant.teamStatus = 'incomplete';
    }
    await participant.save();
    return NextResponse.json({ success: true, participant });
  } catch (error) {
    console.error('Error removing member:', error);
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