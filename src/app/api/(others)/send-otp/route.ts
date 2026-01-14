import { NextResponse } from "next/server";
import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);

const resendForgot = async (
    email: string,
    otp: string
  ): Promise<{ id: string } | null | undefined> => {
    const { data, error } = await resend.emails.send({
      from: 'info@pitchdesk.in',
      to: email,
      subject: 'OTP',
      text: `Your OTP is ${otp}`,
    });
  
    if (error) {
      console.log(error);
    }
  
    return data;
  };
export async function POST(request: Request) {
  const body = await request.json();
  const { email,otp } = body;
  if (!email || !otp) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  await resendForgot(email,otp);
  return NextResponse.json({ message: "OTP sent successfully" });
}