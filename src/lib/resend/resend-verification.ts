import VerifyEmail from '../../../emails/verificationEmail';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const resendVerify =  async (verificationCode:string,fullName:string,email:string, userId: string) => {
  const { data, error } = await resend.emails.send({
    from: 'info@pitchdesk.in',
    to: email,
    subject: 'Email Verification || Pitch Desk',
    react: VerifyEmail({ verificationCode: verificationCode,fullName:fullName,userId: userId}),
  });

  if (error) {
    console.log(error);
  }

  return data;


};

export default resendVerify