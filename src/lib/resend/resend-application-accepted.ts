import ApplicationAcceptedEmail from '../../../emails/applicationAccepted';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const resendApplicationAccepted = async (
  founderEmail: string,
  founderName: string,
  startupName: string,
  programName: string,
  programUrl: string,
  vcName: string
): Promise<{ id: string } | null | undefined> => {
  const { data, error } = await resend.emails.send({
    from: 'PitchDesk <accounts@pitchdesk.in>',
    to: founderEmail,
    subject: `Congratulations! Your application to ${programName} has been accepted`,
    react: ApplicationAcceptedEmail({ founderName, startupName, programName, programUrl, vcName }),
  });

  if (error) {
    console.error("Resend Application Accepted Error:", error);
  }

  return data;
};

export default resendApplicationAccepted;
