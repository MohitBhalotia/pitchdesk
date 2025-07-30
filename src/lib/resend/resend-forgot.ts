import ForgotPasswordEmail from '../../../emails/forgotPasswordEmail';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async (resetPasswordToken:string,fullName:string,email:string) => {
  const { data, error } = await resend.emails.send({
    from: 'info@pitchdesk.in',
    to: email,
    subject: 'Forgot Password || Pitch Desk',
    react: ForgotPasswordEmail({ resetPasswordToken: resetPasswordToken, fullName: fullName }),
  });

  if (error) {
    console.log(error);
  }

  return data;


};