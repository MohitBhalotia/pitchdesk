import mongoose, { Document, Model, Schema } from "mongoose";

export interface ICompetitionPayment extends Document {
  userId: mongoose.Types.ObjectId;
  competitionId: mongoose.Types.ObjectId;
  type: "registration" | "chance_fee";
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  amount: number;
  currency: string;
  status: "created" | "paid" | "failed";
  pendingRegistrationData?: Record<string, unknown>;
  participantId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CompetitionPaymentSchema = new Schema<ICompetitionPayment>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    competitionId: {
      type: Schema.Types.ObjectId,
      ref: "Competition",
      required: true,
    },
    type: {
      type: String,
      enum: ["registration", "chance_fee"],
      required: true,
    },
    razorpayOrderId: { type: String, required: true },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
    amount: { type: Number, required: true },
    currency: { type: String, default: "USD" },
    status: {
      type: String,
      enum: ["created", "paid", "failed"],
      default: "created",
    },
    pendingRegistrationData: { type: Schema.Types.Mixed },
    participantId: { type: Schema.Types.ObjectId, ref: "Participant" },
  },
  { timestamps: true }
);

CompetitionPaymentSchema.index({ razorpayOrderId: 1 }, { unique: true });
CompetitionPaymentSchema.index({ competitionId: 1, userId: 1 });

export const CompetitionPayment: Model<ICompetitionPayment> =
  mongoose.models.CompetitionPayment ||
  mongoose.model<ICompetitionPayment>(
    "CompetitionPayment",
    CompetitionPaymentSchema
  );
