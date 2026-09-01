import mongoose, { Model, Schema } from "mongoose";

/**
 * A single extracted (or founder-corrected) startup metric. Corrections
 * never overwrite original source evidence (plans/RAG_feature.md Phase 2)
 * — a correction is a new document with provenance "founder_correction" and
 * `supersedesFactId` pointing at the fact it replaces; the original stays
 * untouched for audit purposes.
 */
const StartupFactSchema = new Schema<StartupFact>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    roomId: { type: Schema.Types.ObjectId, ref: "PitchRoom", required: true },
    knowledgeBaseId: {
      type: Schema.Types.ObjectId,
      ref: "KnowledgeBase",
      required: true,
    },
    metric: { type: String, required: true },
    rawValue: { type: String, required: true },
    numericValue: { type: Number, default: null },
    unit: { type: String, default: null },
    currency: { type: String, default: null },
    period: { type: String, default: null },
    valueType: {
      type: String,
      enum: ["actual", "projected", "historical"],
      required: true,
    },
    confidence: { type: Number, min: 0, max: 1, required: true },
    provenance: {
      type: String,
      enum: ["extracted", "founder_correction"],
      default: "extracted",
    },
    status: { type: String, enum: ["active", "disabled"], default: "active" },
    sourceId: { type: Schema.Types.ObjectId, ref: "KnowledgeSource", default: null },
    locator: { type: String, default: null },
    supersedesFactId: {
      type: Schema.Types.ObjectId,
      ref: "StartupFact",
      default: null,
    },
  },
  { timestamps: true }
);

StartupFactSchema.index({ roomId: 1, metric: 1, period: 1, status: 1 });

const StartupFactModel: Model<StartupFact> =
  mongoose.models.StartupFact ||
  mongoose.model<StartupFact>("StartupFact", StartupFactSchema);

export default StartupFactModel;
