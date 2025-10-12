import mongoose, { Schema, Document, Model } from "mongoose";

// ---------------------- INTERFACES ----------------------

interface MicroScores {
  [key: string]: number;
  Subtotal?: number;
}

interface SectionScores {
  Introduction: MicroScores;
  PitchContent: MicroScores;
  QandAHandling: MicroScores;
  DeliveryAndStyle: MicroScores;
  BusinessInvestability: MicroScores;
  TotalScore: number;
  BusinessInvestabilityConfidence: number;
}

export interface IPitchEvaluation extends Document {
  userId: mongoose.Types.ObjectId;   // reference to the user
  pitchId: mongoose.Types.ObjectId;  // reference to the pitch
  scores: SectionScores;
  summary: string;
  createdAt: Date;
}

// ---------------------- SCHEMA ----------------------

const MicroScoresSchema = new Schema(
  {},
  { strict: false, _id: false } // flexible micro-parameters
);

const SectionScoresSchema = new Schema<SectionScores>(
  {
    Introduction: { type: MicroScoresSchema, required: true },
    PitchContent: { type: MicroScoresSchema, required: true },
    QandAHandling: { type: MicroScoresSchema, required: true },
    DeliveryAndStyle: { type: MicroScoresSchema, required: true },
    BusinessInvestability: { type: MicroScoresSchema, required: true },
    TotalScore: { type: Number, required: true },
    BusinessInvestabilityConfidence: { type: Number, required: true },
  },
  { _id: false }
);

const PitchEvaluationSchema = new Schema<IPitchEvaluation>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    pitchId: { type: Schema.Types.ObjectId, ref: "Pitch", required: true },
    scores: { type: SectionScoresSchema, required: true },
    summary: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// ---------------------- MODEL ----------------------

export const PitchEval: Model<IPitchEvaluation> =
  mongoose.models.PitchEvaluation ||
  mongoose.model<IPitchEvaluation>("PitchEvaluation", PitchEvaluationSchema);
