import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { isPitchRoomsEnabled } from "@/lib/featureFlags";
import { resolveSessionUserId } from "@/lib/services/authGuard";
import { retrySource } from "@/lib/services/knowledgeSources";
import { toErrorResponse } from "@/lib/services/apiErrors";

interface RouteParams {
  params: Promise<{ roomId: string; sourceId: string }>;
}

export async function POST(_req: NextRequest, { params }: RouteParams) {
  if (!isPitchRoomsEnabled()) {
    return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
  }

  await dbConnect();
  const { roomId, sourceId } = await params;
  try {
    const userId = await resolveSessionUserId();
    const source = await retrySource({ userId, roomId, sourceId });
    return NextResponse.json({ success: true, data: { source } });
  } catch (error) {
    return toErrorResponse(error, "Error retrying knowledge source:");
  }
}
