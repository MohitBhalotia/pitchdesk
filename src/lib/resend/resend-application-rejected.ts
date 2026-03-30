import ApplicationRejectedEmail from '../../../emails/applicationRejected';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const resendApplicationRejected = async (
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
    subject: `An update on your application to ${programName}`,
    react: ApplicationRejectedEmail({ founderName, startupName, programName, programUrl, vcName }),
  });

  if (error) {
    console.error("Resend Application Rejected Error:", error);
  }

  return data;
};

export default resendApplicationRejected;
