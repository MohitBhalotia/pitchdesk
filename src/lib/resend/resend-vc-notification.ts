import VCRegistrationNotificationEmail from '../../../emails/vcRegistrationNotificationEmail';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const resendVCNotification = async (
  vcName: string,
  vcEmail: string
): Promise<{ id: string } | null | undefined> => {
  const { data, error } = await resend.emails.send({
    from: 'info@pitchdesk.in',
    to: 'info@pitchdesk.in', // Admin email
    subject: 'New VC Registration Alert || Pitch Desk',
    react: VCRegistrationNotificationEmail({ vcName, vcEmail }),
  });

  if (error) {
    console.error("Resend VC Notification Error:", error);
  }

  return data;
};

export default resendVCNotification;
