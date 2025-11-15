import mongoose, { Schema, Document, Model } from "mongoose";

interface CompetitionScores {
  ProblemMarketOpportunity: number;        // Direct score: 0-20
  SolutionInnovation: number;              // Direct score: 0-20  
  BusinessModelScalability: number;        // Direct score: 0-15
  TeamExecutionCapability: number;         // Direct score: 0-20
  TractionValidation: number;              // Direct score: 0-15
  PitchQualityCommunication: number;       // Direct score: 0-10
  TotalScore: number;                      // Sum of all above (0-100)
  BusinessInvestabilityConfidence: number; // 0-100
}

export interface ICompetitionPitchEvaluation extends Document {
  userId: mongoose.Types.ObjectId;   
  pitchId: mongoose.Types.ObjectId;  
  competitionId: mongoose.Types.ObjectId;
  scores: CompetitionScores;
  summary: string;
  createdAt: Date;
}

const CompetitionScoresSchema = new Schema<CompetitionScores>(
  {
    ProblemMarketOpportunity: { 
      type: Number, 
      required: true,
      min: 0,
      max: 20
    },
    SolutionInnovation: { 
      type: Number, 
      required: true,
      min: 0,
      max: 20
    },
    BusinessModelScalability: { 
      type: Number, 
      required: true,
      min: 0,
      max: 15
    },
    TeamExecutionCapability: { 
      type: Number, 
      required: true,
      min: 0,
      max: 20
    },
    TractionValidation: { 
      type: Number, 
      required: true,
      min: 0,
      max: 15
    },
    PitchQualityCommunication: { 
      type: Number, 
      required: true,
      min: 0,
      max: 10
    },
    TotalScore: { 
      type: Number, 
      required: true,
      min: 0,
      max: 100
    },
    BusinessInvestabilityConfidence: { 
      type: Number, 
      required: true,
      min: 0,
      max: 100
    }
  },
  { _id: false }
);

const CompetitionPitchEvaluationSchema = new Schema<ICompetitionPitchEvaluation>(
  {
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    pitchId: { 
      type: Schema.Types.ObjectId, 
      ref: "Pitch", 
      required: true 
    },
    competitionId: { 
      type: Schema.Types.ObjectId, 
      ref: "Competition", 
      required: true 
    },
    scores: { 
      type: CompetitionScoresSchema, 
      required: true 
    },
    summary: { 
      type: String, 
      required: true 
    },
  },
  { 
    timestamps: { createdAt: true, updatedAt: false } 
  }
);

// index for efficient leaderboard queries
CompetitionPitchEvaluationSchema.index({ competitionId: 1, 'scores.TotalScore': -1 });
CompetitionPitchEvaluationSchema.index({ pitchId: 1 }, { unique: true }); // One evaluation per pitch
CompetitionPitchEvaluationSchema.index({ competitionId: 1, userId: 1 }); // For the join with participants

export const CompetitionPitchEval: Model<ICompetitionPitchEvaluation> =
  mongoose.models.CompetitionPitchEvaluation ||
  mongoose.model<ICompetitionPitchEvaluation>("CompetitionPitchEvaluation", CompetitionPitchEvaluationSchema);