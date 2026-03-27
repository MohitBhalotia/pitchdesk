import ContactUsEmail from "emails/contactUsEmail";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY)

const resendContactUs = async (
  name: string,
  email: string,
  message: string
): Promise<{ id: string } | null | undefined> => {
    const { data, error } = await resend.emails.send({
          from: 'PitchDesk Contact <contact@pitchdesk.in>', 
          to: ['info@pitchdesk.in'], 
          subject: `New Contact Form Submission from ${name}`,
          react: ContactUsEmail({ 
            fullName: name, 
            email, 
            message 
          }),
        });
    
        if (error) {
          console.error('Resend error:', error);
        } 

        return data
}

export default resendContactUs