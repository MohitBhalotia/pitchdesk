import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import SupportTicketModel from '@/models/SupportTicketModel';

export async function POST(request: NextRequest) {
  try {
    // Connect to database
    await dbConnect();

    const formData = await request.formData();

    // Extract form data
    const name = formData.get('name') as string || '';
    const email = formData.get('email') as string;
    const issueType = formData.get('issueType') as string;
    const subject = formData.get('subject') as string;
    const description = formData.get('description') as string;
    const consent = formData.get('consent') === 'true';

    // Validate required fields
    if (!email || !issueType || !subject || !description || !consent) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate description length
    if (description.trim().length < 20) {
      return NextResponse.json(
        { success: false, message: 'Description must be at least 20 characters long' },
        { status: 400 }
      );
    }

   
    // Create support ticket document
    const supportTicket = new SupportTicketModel({
      name,
      email,
      issueType,
      subject: subject.trim(),
      description: description.trim(),
      consent,
    });

    // Save to database
    const savedTicket = await supportTicket.save();

    // console.log('Support ticket created:', {
    //   id: savedTicket._id,
    //   email,
    //   issueType,
    //   subject,
    // });

    return NextResponse.json({
      success: true,
      ticketId: savedTicket._id,
      message: 'Support ticket created successfully',
    });
  } catch (error) {
    console.error('Support API error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create support ticket' },
      { status: 500 }
    );
  }
}
