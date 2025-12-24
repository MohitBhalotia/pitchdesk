import ContactUsEmail from "emails/contactUsEmail";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY)

const resendContactUs = async (
  name: string,
  email: string,
  message: string
): Promise<{ id: string } | null | undefined> => {
    const { data, error } = await resend.emails.send({
          from: 'info@pitchdesk.in', 
          to: ['ayushajg88@gmail.com'], 
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