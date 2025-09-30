import mongoose, { Model, Schema } from "mongoose"

const UserPlanSchema = new Schema<IUserPlan>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    planId: { type: Schema.Types.ObjectId, ref: "Plan", required: true },
    isActive: { type: Boolean, default: true },
    usage: {
      pitchNumberUsed: { type: Number, default: 0 },
      pitchTimeUsed: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

export const userPlanModel:Model<IUserPlan> =mongoose.models.UserPlan || mongoose.model<IUserPlan>("UserPlan", UserPlanSchema)
