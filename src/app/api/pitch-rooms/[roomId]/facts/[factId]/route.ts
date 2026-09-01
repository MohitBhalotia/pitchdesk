import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { isPitchRoomsEnabled } from "@/lib/featureFlags";
import { resolveSessionUserId } from "@/lib/services/authGuard";
import { confirmFact, disableFact, correctFact } from "@/lib/services/startupFacts";
import { toErrorResponse } from "@/lib/services/apiErrors";

interface RouteParams {
  params: Promise<{ roomId: string; factId: string }>;
}

/**
 * Body: `{ action: "confirm" }` | `{ action: "disable" }` |
 * `{ action: "correct", rawValue, numericValue?, unit?, currency?, period?, valueType? }`
 */
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  if (!isPitchRoomsEnabled()) {
    return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
  }

  await dbConnect();
  const { roomId, factId } = await params;
  try {
    const userId = await resolveSessionUserId();
    const body = await req.json();

    let fact;
    if (body.action === "confirm") {
      fact = await confirmFact(userId, roomId, factId);
    } else if (body.action === "disable") {
      fact = await disableFact(userId, roomId, factId);
    } else if (body.action === "correct") {
      fact = await correctFact(userId, roomId, factId, body);
    } else {
      return NextResponse.json(
        { success: false, message: "Unknown action" },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, data: { fact } });
  } catch (error) {
    return toErrorResponse(error, "Error updating startup fact:");
  }
}
