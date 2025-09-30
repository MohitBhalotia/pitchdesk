import mongoose, { Model, Schema } from "mongoose"

const PlanSchema = new Schema<IPlan>(
  {
    name: { type: String, enum: ["standard", "pro", "enterprise"], required: true },
    amount: {type: Number, required: true},
    pitchesNumber: { type: Number, required: true },
    pitchesTime: { type: Number, required: true },
    englishVCs: { type: Number, required: true },
    hindiVCs: { type: Number, required: true },
    capatalistConnecction: { type: Boolean, default: false },
    priorityEmailSupport: { type: Boolean, default: false },
    pitchAnalysis: { type: Boolean, default: false },
    pitchImprovement: { type: Boolean, default: false },
    personalisedPitch: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const planModel:Model<IPlan> =mongoose.models.Plan || mongoose.model<IPlan>("Plan", PlanSchema)