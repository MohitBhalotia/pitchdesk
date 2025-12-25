import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/db';
import Participant from '@/models/Participant';
import Competition from '@/models/Competition';
import User from '@/models/UserModel';
import { Types } from 'mongoose';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const session = await getServerSession();
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { token, action, teamId } = await request.json();
    if (!token || !['accept', 'decline'].includes(action) || !teamId) {
      return NextResponse.json({ error: 'Missing or invalid parameters.' }, { status: 400 });
    }
    // Find participant by id and token
    const participant = await Participant.findOne({
      _id: teamId,
      'teamMembers.inviteToken': token
    });
    if (!participant) {
      return NextResponse.json({ error: 'Invite invalid, expired, or mismatched for this team.' }, { status: 404 });
    }
    // Check if competitionId is present
    const competitionId = participant.competitionId;
    if (!competitionId) {
      return NextResponse.json({ error: 'Bad team/competition reference.' }, { status: 400 });
    }
    // Get user
    const memberEmail = session.user.email;
    // Find the user from your User model by email to get their ID
    const user = await User.findOne({ email: memberEmail });
    if (!user) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    // FIX
    const memberObjectId = new Types.ObjectId(String(user._id));


    // Duplicity check: Block only if user is already a leader or accepted member
    // Allow pending members to accept invites (users can have multiple pending invites)
    const alreadyParticipant = await Participant.findOne({
      competitionId: competitionId,
      $or: [
        { userId: memberObjectId }, // Leader of another team
        { 
          teamMembers: {
            $elemMatch: {
              userId: memberObjectId,
              status: 'accepted' // Explicitly check for accepted status only
            }
          }
        }, // Accepted member of another team
        { 'teamLeader.email': memberEmail }, // Leader by email
      ],
      _id: { $ne: teamId }
    });
    if (alreadyParticipant && action === 'accept') {
      return NextResponse.json({ error: 'You are already part of another team for this competition. You cannot join multiple teams.' }, { status: 409 });
    }
    // Find the member in this participant
    const memberIdx = participant.teamMembers.findIndex(
      (m) => m.inviteToken === token
    );
    if (memberIdx === -1) {
      return NextResponse.json({ error: 'Bad invite.' }, { status: 404 });
    }
    const member = participant.teamMembers[memberIdx];
    if (member.status !== 'pending') {
      return NextResponse.json({ error: 'This invite has already been handled.' }, { status: 409 });
    }
    // Check the email matches user session
    if (memberEmail !== member.email) {
      return NextResponse.json({ error: 'This invite email does not match your PitchDesk account.' }, { status: 403 });
    }
    // Handle accept/decline
    if (action === 'accept') {
      participant.teamMembers[memberIdx].status = 'accepted';
      participant.teamMembers[memberIdx].userId = memberObjectId;
    }
    if (action === 'decline') {
      participant.teamMembers[memberIdx].status = 'declined';
      participant.teamMembers[memberIdx].userId = undefined;
    }
    participant.teamMembers[memberIdx].inviteToken = undefined;
    // Update team status now
    const comp = await Competition.findById(competitionId);
    const minSize = comp?.teamSize?.min || 1;
    const maxSize = comp?.teamSize?.max || 1;
    const acceptedCount = 1 + participant.teamMembers.filter((m) => m.status === 'accepted').length; // +1 for leader
    if (acceptedCount < minSize) participant.teamStatus = 'incomplete';
    else if (acceptedCount > maxSize) participant.teamStatus = 'incomplete'; // can't grow > max, but admin can mark DQ
    else participant.teamStatus = 'validated';
    await participant.save();
    return NextResponse.json({ participant });
  } catch (error) {
    console.error('Error handling invite:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
