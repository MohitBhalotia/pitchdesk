import mongoose, { Model, Schema } from "mongoose";

/**
 * Scored async production sampling records (plans/RAG_feature.md Section 7,
 * Phase 5) -- feeds a lightweight ongoing-quality view without ever adding
 * latency to the live tool-call path (scoring happens later, on the worker).
 * Deliberately doesn't persist the sampled query/passages, only scores.
 */
const EvalSampleSchema = new Schema<EvalSample>(
  {
    callId: { type: String, required: true, unique: true },
    toolName: { type: String, required: true },
    roomId: { type: Schema.Types.ObjectId, ref: "PitchRoom", required: true },
    found: { type: Boolean, required: true },
    relevanceScore: { type: Number, required: true },
    groundednessScore: { type: Number, required: true },
    reason: { type: String, default: null },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

EvalSampleSchema.index({ toolName: 1, createdAt: -1 });

const EvalSampleModel: Model<EvalSample> =
  mongoose.models.EvalSample || mongoose.model<EvalSample>("EvalSample", EvalSampleSchema);

export default EvalSampleModel;
