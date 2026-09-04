import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { isRoomIngestionEnabled } from "@/lib/featureFlags";
import { resolveSessionUserId } from "@/lib/services/authGuard";
import { createUploadIntent } from "@/lib/services/knowledgeSources";
import { toErrorResponse } from "@/lib/services/apiErrors";

interface RouteParams {
  params: Promise<{ roomId: string }>;
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  if (!isRoomIngestionEnabled()) {
    return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
  }

  await dbConnect();
  const { roomId } = await params;
  try {
    const userId = await resolveSessionUserId();
    const { fileName, fileType, fileSize } = await req.json();
    const intent = await createUploadIntent({ userId, roomId, fileName, fileType, fileSize });
    return NextResponse.json({ success: true, data: intent }, { status: 201 });
  } catch (error) {
    return toErrorResponse(error, "Error creating upload intent:");
  }
}
