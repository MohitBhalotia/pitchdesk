import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Extract form data
    const name = formData.get('name') as string || '';
    const email = formData.get('email') as string || '';
    const feedbackType = formData.get('feedbackType') as string;
    const message = formData.get('message') as string;
    const rating = parseInt(formData.get('rating') as string) || 0;
    const contactPreference = formData.get('contactPreference') === 'true';

    //////logic abhi likhna he.....

    console.log('Feedback received:', {
      name,
      email,
      feedbackType,
      message,
      rating,
      contactPreference,
    });

    // Generate feedback ID ....abhi ke liye random
    const feedbackId = `FB-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json({
      success: true,
      feedbackId,
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
