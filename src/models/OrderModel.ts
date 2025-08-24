import mongoose, { Schema } from "mongoose"

const OrderSchema = new Schema<IOrder>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    planId: { type: Schema.Types.ObjectId, ref: "Plan", required: true },

    razorpayOrderId: { type: String, required: true },
    razorPaymentId: { type: String },
    razorpaySignature: { type: String },

    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },

    status: {
      type: String,
      enum: ["created", "paid", "failed", "pending"],
      default: "created",
    },
  },
  { timestamps: true }
);

export const orderModel = mongoose.model<IOrder>("Order", OrderSchema)