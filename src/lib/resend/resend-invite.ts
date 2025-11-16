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
  // Add teamId to link
  const urlWithTeam = `${inviteLink}&teamId=${encodeURIComponent(teamId)}`
  const { data, error } = await resend.emails.send({
    from: 'info@pitchdesk.in',
    to: memberEmail,
    subject: `You have been invited to join a team for ${competitionTitle}`,
    html: `<div style='font-family:sans-serif;'>
      <h2>Pitch Desk Competition Team Invite</h2>
      <p>Hi ${memberName},</p>
      <p><b>${leaderName}</b> has added you to a team (<b>${teamName}</b>) for the competition <b>${competitionTitle}</b>.</p>
      <p>Please accept or decline the invitation using the following link:</p>
      <p><a href='${urlWithTeam}' target='_blank' style='color: #2754C5;'>Accept / Decline Invitation</a></p>
      <hr style='margin:12px 0;'>
      <div style='font-size:13px;color:#666'>
        <b>Team ID:</b> ${teamId}<br/>
        This team invite link is unique to you.<br />If you are not registered on Pitch Desk, you will first have to sign up and then proceed to accept or decline.
      </div>
      <small>If you did not expect this, you can ignore this email.</small>
    </div>`
  });
  if (error) {
    console.error('Resend Invite Error:', error);
  }
  return data;
};

export default resendInviteTeamMember;
