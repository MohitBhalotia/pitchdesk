// services/email/resendInviteTeamMember.ts
import InviteTeamMemberEmail from "emails/inviteTeamMemberEmail";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const resendInviteTeamMember = async (
  memberName: string,
  memberEmail: string,
  teamName: string,
  leaderName: string,
  competitionTitle: string,
  inviteLink: string,
  teamId: string
) => {
  const { data, error } = await resend.emails.send({
    from: 'info@pitchdesk.in',
    to: memberEmail,
    subject: `You have been invited to join a team for ${competitionTitle}`,
    react: InviteTeamMemberEmail({ 
      memberName, 
      memberEmail, 
      teamName, 
      leaderName, 
      competitionTitle, 
      inviteLink, 
      teamId 
    }),
  });

  if (error) {
    console.error('Resend Invite Error:', error);
  }

  return data;
};

export default resendInviteTeamMember;