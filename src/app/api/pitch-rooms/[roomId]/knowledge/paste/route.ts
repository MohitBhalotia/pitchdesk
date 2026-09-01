import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { isPitchRoomsEnabled } from "@/lib/featureFlags";
import { resolveSessionUserId } from "@/lib/services/authGuard";
import { createPastedTextSource } from "@/lib/services/knowledgeSources";
import { toErrorResponse } from "@/lib/services/apiErrors";

interface RouteParams {
  params: Promise<{ roomId: string }>;
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  if (!isPitchRoomsEnabled()) {
    return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
  }

  await dbConnect();
  const { roomId } = await params;
  try {
    const userId = await resolveSessionUserId();
    const { text } = await req.json();
    const source = await createPastedTextSource({ userId, roomId, text });
    return NextResponse.json({ success: true, data: { source } }, { status: 201 });
  } catch (error) {
    return toErrorResponse(error, "Error creating pasted-text source:");
  }
}
