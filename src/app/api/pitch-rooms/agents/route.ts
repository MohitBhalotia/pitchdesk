import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Agent from "@/models/AgentModel";
import { isPitchRoomsEnabled } from "@/lib/featureFlags";
import { resolveSessionUserId, UnauthorizedError } from "@/lib/services/authGuard";

/**
 * Lists the three fixed room-only coaches for the agent-selection section
 * (plans/RAG_feature.md Phase 1/Section 3). Deliberately excludes
 * systemPrompt from the response — this route is for display, not for
 * building a Deepgram Settings payload.
 */
export async function GET() {
  if (!isPitchRoomsEnabled()) {
    return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
  }

  await dbConnect();
  try {
    await resolveSessionUserId();
    const agents = await Agent.find({ agentKind: "pitch_room", isActive: true })
      .select("name slug description image voice firstMessage")
      .sort({ slug: 1 })
      .lean();
    return NextResponse.json({ success: true, data: { agents } });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ success: false, message: error.message }, { status: 401 });
    }
    console.error("Error fetching room agents:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
