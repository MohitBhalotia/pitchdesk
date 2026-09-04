import mongoose, { Model, Schema } from "mongoose";

/**
 * One pitch room per founder-created "recurring VC relationship"
 * (plans/RAG_feature.md Section 6). Knowledge and memory attach to the
 * room, not to an individual agent — a founder picks any of the three
 * fixed room agents per session (Phase 3).
 */
const PitchRoomSchema = new Schema<PitchRoom>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    practiceFocus: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["active", "archived"],
      default: "active",
    },
    knowledgeBaseId: {
      type: Schema.Types.ObjectId,
      ref: "KnowledgeBase",
      default: null,
    },
    memoryDigest: {
      type: String,
      default: null,
    },
    memoryDigestVersion: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

PitchRoomSchema.index({ userId: 1, status: 1, updatedAt: -1 });

const PitchRoomModel: Model<PitchRoom> =
  mongoose.models.PitchRoom || mongoose.model<PitchRoom>("PitchRoom", PitchRoomSchema);

export default PitchRoomModel;
