import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import FeedbackModel from '@/models/FeedbackModel';

export async function POST(request: NextRequest) {
  try {
    // Connect to database
    await dbConnect();

    const formData = await request.formData();

    // Extract form data
    const name = formData.get('name') as string || '';
    const email = formData.get('email') as string || '';
    const feedbackType = formData.get('feedbackType') as string;
    const message = formData.get('message') as string;
    const rating = parseInt(formData.get('rating') as string) || 0;
    const contactPreference = formData.get('contactPreference') === 'true';

    // Validate required fields
    if (!feedbackType || !message || rating === 0) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate message length
    if (message.trim().length < 10) {
      return NextResponse.json(
        { success: false, message: 'Message must be at least 10 characters long' },
        { status: 400 }
      );
    }

    // Validate email format if provided
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, message: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Create feedback document
    const feedback = new FeedbackModel({
      name,
      email,
      feedbackType,
      rating,
      message: message.trim(),
      contactPreference,
    });

    // Save to database
    const savedFeedback = await feedback.save();

    // console.log('Feedback saved:', {
    //   id: savedFeedback._id,
    //   feedbackType,
    //   rating,
    //   messageLength: message.length,
    // });

    return NextResponse.json({
      success: true,
      feedbackId: savedFeedback._id,
      message: 'Thank you for your feedback! We appreciate you helping us improve.',
    });
  } catch (error) {
    console.error('Feedback API error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to submit feedback' },
      { status: 500 }
    );
  }
}
