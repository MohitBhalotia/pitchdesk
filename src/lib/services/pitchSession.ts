import mongoose from "mongoose";
import PitchModel from "@/models/PitchModel";
import UserModel from "@/models/UserModel";

const DEFAULT_PITCH_TITLE_PATTERN = /^Pitch (\d+)$/;

async function getNextPitchNumber(userId: string): Promise<number> {
  const existingNumberedPitches = await PitchModel.find({
    userId,
    title: { $regex: DEFAULT_PITCH_TITLE_PATTERN },
  })
    .select("title pitchNumber")
    .lean();

  const highestExistingNumber = existingNumberedPitches.reduce((highest, pitch) => {
    const titleMatch = pitch.title?.match(DEFAULT_PITCH_TITLE_PATTERN);
    const numberFromTitle = titleMatch ? Number(titleMatch[1]) : 0;
    return Math.max(highest, pitch.pitchNumber ?? 0, numberFromTitle);
  }, 0);

  // The per-user counter is incremented atomically. For existing users it is
  // first raised to the highest legacy "Pitch N" value, so deleting a pitch
  // never makes a future title collide with or reuse an earlier number.
  const updatedUser = await UserModel.findByIdAndUpdate(
    userId,
    [
      {
        $set: {
          pitchSequence: {
            $add: [
              {
                $max: [
                  { $ifNull: ["$pitchSequence", 0] },
                  highestExistingNumber,
                ],
              },
              1,
            ],
          },
        },
      },
    ],
    { new: true }
  );

  if (!updatedUser) {
    throw new Error("User not found while allocating a pitch title");
  }

  return updatedUser.pitchSequence;
}

export interface CreatePitchForSessionInput {
  userId: string;
  sessionId: string;
  agentId?: string | null;
  competitionId?: string | null;
  incubationId?: string | null;
  // Pitch-room fields (plans/RAG_feature.md Phase 3). `roomName`/`agentName`
  // are snapshots at session-start time -- they never change if the room or
  // agent is renamed later, matching how `pitchNumber`/`title` already work.
  pitchRoomId?: string | null;
  roomName?: string | null;
  agentName?: string | null;
}

/**
 * Creates a numbered pitch document. Shared by the generic start-pitch route
 * and (from Phase 3 onward) the pitch-room session-start route, so both use
 * identical numbering/timing rules.
 */
export async function createPitchForSession({
  userId,
  sessionId,
  agentId,
  competitionId,
  incubationId,
  pitchRoomId,
  roomName,
  agentName,
}: CreatePitchForSessionInput) {
  const pitchNumber = await getNextPitchNumber(userId);
  const storedAgentId =
    agentId && mongoose.Types.ObjectId.isValid(agentId) ? agentId : null;

  return PitchModel.create({
    userId,
    pitchNumber,
    title: `Pitch ${pitchNumber}`,
    sessionId,
    agentId: storedAgentId,
    lastUpdated: Date.now(),
    startTime: Date.now(),
    competitionId: competitionId ?? null,
    incubationId: incubationId ?? null,
    pitchRoomId: pitchRoomId ?? null,
    pitchMode: pitchRoomId ? "room" : "generic",
    roomName: roomName ?? null,
    agentName: agentName ?? null,
  });
}
