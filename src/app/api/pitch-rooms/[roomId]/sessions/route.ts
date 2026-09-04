import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/db";
import { isPitchRoomsEnabled } from "@/lib/featureFlags";
import { resolveSessionUserId } from "@/lib/services/authGuard";
import { getOwnedRoom } from "@/lib/services/pitchRooms";
import { createPitchForSession } from "@/lib/services/pitchSession";
import { createRoomToolSession } from "@/lib/services/roomToolSession";
import { buildRoomAgentSettings } from "@/lib/voiceConfig/roomAgentSettings.server";
import { toErrorResponse } from "@/lib/services/apiErrors";
import AgentModel from "@/models/AgentModel";
import KnowledgeBaseModel from "@/models/KnowledgeBaseModel";
import { userPlanModel } from "@/models/UserPlanModel";

interface RouteParams {
  params: Promise<{ roomId: string }>;
}

/**
 * Starts a pitch-room voice session (plans/RAG_feature.md Phase 3): validates
 * room ownership, Knowledge Base readiness, and that `agentId` is one of the
 * three fixed room coaches, then returns a fully composed Deepgram Settings
 * payload (including the signed room-session token embedded in each tool
 * endpoint's headers) for the browser to send verbatim -- identical to how
 * the generic flow already sends `defaultStsConfig` once its socket opens.
 * The browser never sees the room's raw data or builds this prompt itself.
 */
export async function POST(req: NextRequest, { params }: RouteParams) {
  if (!isPitchRoomsEnabled()) {
    return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
  }

  await dbConnect();
  const { roomId } = await params;

  try {
    const userId = await resolveSessionUserId();
    const { agentId, clientSessionId } = await req.json();

    const room = await getOwnedRoom(userId, roomId);
    if (!room) {
      return NextResponse.json(
        { success: false, message: "Pitch room not found" },
        { status: 404 }
      );
    }

    if (!agentId || !mongoose.Types.ObjectId.isValid(agentId)) {
      return NextResponse.json(
        { success: false, message: "A valid agentId is required" },
        { status: 400 }
      );
    }
    const agent = await AgentModel.findOne({
      _id: agentId,
      agentKind: "pitch_room",
      isActive: true,
    });
    if (!agent) {
      return NextResponse.json(
        { success: false, message: "This coach is not available in pitch rooms" },
        { status: 400 }
      );
    }

    if (!room.knowledgeBaseId) {
      return NextResponse.json(
        { success: false, message: "Add a knowledge base to this room before starting a session" },
        { status: 400 }
      );
    }
    const knowledgeBase = await KnowledgeBaseModel.findById(room.knowledgeBaseId);
    if (!knowledgeBase || knowledgeBase.status !== "ready") {
      return NextResponse.json(
        { success: false, message: "This room's knowledge base isn't ready yet" },
        { status: 400 }
      );
    }

    // Same practice-pitch time rules as the generic flow (Section 5, Phase 0:
    // rooms reuse the shared credit/timing services, not a parallel copy).
    const userPlan = await userPlanModel.findOne({ userId });
    if (!userPlan) {
      return NextResponse.json(
        { success: false, message: "User plan not found" },
        { status: 404 }
      );
    }
    if (userPlan.pitchTimeRemaining <= 0) {
      return NextResponse.json(
        { success: false, message: "You have no remaining pitch time" },
        { status: 400 }
      );
    }

    const sessionId =
      typeof clientSessionId === "string" && clientSessionId.trim()
        ? clientSessionId.trim()
        : `PitchRoom${Math.ceil(Math.random() * 1_000_000)}`;

    const pitch = await createPitchForSession({
      userId,
      sessionId,
      agentId,
      pitchRoomId: roomId,
      roomName: room.name,
      agentName: agent.name,
    });

    const remainingTimeSeconds = Math.floor(userPlan.pitchTimeRemaining * 60);
    const { token } = await createRoomToolSession({
      userId,
      roomId,
      pitchId: String(pitch._id),
      agentId: String(agent._id),
      knowledgeBaseId: String(knowledgeBase._id),
      knowledgeBaseRevision: knowledgeBase.activeRevision,
      // A grace buffer over the founder's remaining time absorbs client-side
      // rounding/lag around session end without ever letting a stale token
      // meaningfully outlive its pitch (also hard-capped in the service).
      ttlSeconds: remainingTimeSeconds + 5 * 60,
    });

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const voiceSettings = buildRoomAgentSettings({
      agent: {
        name: agent.name,
        voice: agent.voice,
        systemPrompt: agent.systemPrompt,
        firstMessage: agent.firstMessage,
      },
      room: { name: room.name, practiceFocus: room.practiceFocus ?? null },
      knowledgeBase: {
        startupBrief: knowledgeBase.startupBrief ?? null,
        contradictions: knowledgeBase.contradictions ?? [],
      },
      memoryDigest: room.memoryDigest ?? null,
      roomToolSessionToken: token,
      baseUrl,
    });

    return NextResponse.json({
      success: true,
      data: {
        pitch,
        remainingTimeSeconds,
        agent: {
          _id: agent._id,
          name: agent.name,
          image: agent.image,
          voice: agent.voice,
          firstMessage: agent.firstMessage,
        },
        voiceSettings,
      },
    });
  } catch (error) {
    return toErrorResponse(error, "Error starting pitch room session:");
  }
}
