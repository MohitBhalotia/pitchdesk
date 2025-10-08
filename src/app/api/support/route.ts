import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Extract form data
    const name = formData.get('name') as string || '';
    const email = formData.get('email') as string;
    const issueType = formData.get('issueType') as string;
    const subject = formData.get('subject') as string;
    const description = formData.get('description') as string;
    const consent = formData.get('consent') === 'true';

    // Get uploaded files
    const files: File[] = [];
    for (let i = 0; i < 3; i++) {
      const file = formData.get(`file${i}`) as File | null;
      if (file && file.size > 0) {
        files.push(file);
      }
    }

   //////logic abhi likhna he.....

    console.log('Support ticket received:', {
      name,
      email,
      issueType,
      subject,
      description,
      consent,
      fileCount: files.length,
    });

    // Generate ticket ID ....abhi ke liye random
    const ticketId = `PD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json({
      success: true,
      ticketId,
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
