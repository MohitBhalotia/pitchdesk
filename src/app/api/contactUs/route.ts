import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { sendContactUsEmailEvent } from '@/lib/inngest/email-helpers';

// Define validation schema with Zod
const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  message: z.string().min(1, "Message is required").max(1000),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the request data
    const validationResult = contactFormSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Invalid form data', 
          details: validationResult.error
        },
        { status: 400 }
      );
    }

    const { name, email, message } = validationResult.data;

    // Send contact form email via Inngest queue
    await sendContactUsEmailEvent(name, email, message);

    console.log("Contact form email queued successfully");

    return NextResponse.json(
      { 
        success: true, 
        message: 'Contact form submitted successfully',
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}