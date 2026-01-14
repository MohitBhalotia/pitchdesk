import { dummyData } from "data/dummy";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const sendDocumentEmail = async (
  email: string,
  documentUrl: string
): Promise<{ id: string } | null> => {
  const { data, error } = await resend.emails.send({
    from: "info@pitchdesk.in",
    to: email,
    subject: "Requested Document",
    text: `Here is your requested document:\n\n${documentUrl}`,
  });

  if (error) {
    console.error(error);
    return null;
  }

  return data;
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { residentId, documentType, email } = body;

    if (!residentId || !documentType || !email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 1️⃣ Find resident
    const resident = dummyData.residents.find(
      (r) => r.residentId === residentId
    );

    if (!resident) {
      return NextResponse.json(
        { error: "Resident not found" },
        { status: 404 }
      );
    }

    // 2️⃣ Find document
    const document = resident.documents.find(
      (doc) => doc.type === documentType
    );

    if (!document) {
      return NextResponse.json(
        { error: "Document not found for this resident" },
        { status: 404 }
      );
    }

    // 3️⃣ Send email
    await sendDocumentEmail(email, document.url);

    return NextResponse.json({
      success: true,
      message: "Document sent successfully",
      documentType,
      email,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
