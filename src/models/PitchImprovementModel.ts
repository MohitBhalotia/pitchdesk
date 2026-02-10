import mongoose, { Schema, Document, Model } from "mongoose";

// Criterion-level feedback structure
interface CriterionFeedback {
    score_received: number;
    max_score: number;
    marks_lost: number;
    reason: string;
    how_to_improve: string;
}

// Section summary structure
interface SectionSummary {
    strengths: string[];
    gaps: string[];
    improvements: string[];
}

// Section improvement structure
interface SectionImprovement {
    criteria_feedback: Record<string, CriterionFeedback>;
    summary: SectionSummary;
}

// Main document interface
export interface IPitchImprovement extends Document {
    userId: mongoose.Types.ObjectId;
    pitchId: mongoose.Types.ObjectId;
    evaluationId: mongoose.Types.ObjectId;
    section_wise_improvements: {
        Introduction?: SectionImprovement;
        "Pitch Content"?: SectionImprovement;
        "Q&A Handling"?: SectionImprovement;
        "Business Investability"?: SectionImprovement;
    };
    createdAt: Date;
}

// Flexible schema for nested objects
const CriterionFeedbackSchema = new Schema(
    {
        score_received: { type: Number, required: true },
        max_score: { type: Number, required: true },
        marks_lost: { type: Number, required: true },
        reason: { type: String, required: true },
        how_to_improve: { type: String, required: true },
    },
    { _id: false }
);

const SectionSummarySchema = new Schema(
    {
        strengths: { type: [String], required: true },
        gaps: { type: [String], required: true },
        improvements: { type: [String], required: true },
    },
    { _id: false }
);

const SectionImprovementSchema = new Schema(
    {
        criteria_feedback: {
            type: Map,
            of: CriterionFeedbackSchema,
            required: true,
        },
        summary: { type: SectionSummarySchema, required: true },
    },
    { _id: false, strict: false }
);

const PitchImprovementSchema = new Schema<IPitchImprovement>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        pitchId: { type: Schema.Types.ObjectId, ref: "Pitch", required: true },
        evaluationId: { type: Schema.Types.ObjectId, ref: "PitchEvaluation", required: true },
        section_wise_improvements: {
            type: Map,
            of: SectionImprovementSchema,
            required: true,
        },
    },
    { timestamps: { createdAt: true, updatedAt: false } }
);

export const PitchImprovement: Model<IPitchImprovement> =
    mongoose.models.PitchImprovement ||
    mongoose.model<IPitchImprovement>("PitchImprovement", PitchImprovementSchema);
