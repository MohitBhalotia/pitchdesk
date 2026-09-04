import mongoose, { Model, Schema } from "mongoose";

/**
 * Backing record for a signed, short-lived room-session token
 * (plans/RAG_feature.md Section 4 & 6). Deepgram's server-side tool calls
 * carry only this token -- never a raw userId/roomId/knowledgeBaseId -- and
 * every tool route re-verifies the token's signature/expiry against this
 * record (with a Redis cache in front purely for latency).
 */
const RoomToolSessionSchema = new Schema<RoomToolSession>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    roomId: { type: Schema.Types.ObjectId, ref: "PitchRoom", required: true },
    pitchId: { type: Schema.Types.ObjectId, ref: "Pitch", required: true },
    agentId: { type: Schema.Types.ObjectId, ref: "Agent", required: true },
    knowledgeBaseId: {
      type: Schema.Types.ObjectId,
      ref: "KnowledgeBase",
      default: null,
    },
    knowledgeBaseRevision: { type: Number, default: 0 },
    expiresAt: { type: Date, required: true },
    revoked: { type: Boolean, default: false },
    consecutiveFailures: { type: Number, default: 0 },
    callCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

RoomToolSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 });

const RoomToolSessionModel: Model<RoomToolSession> =
  mongoose.models.RoomToolSession ||
  mongoose.model<RoomToolSession>("RoomToolSession", RoomToolSessionSchema);

export default RoomToolSessionModel;
