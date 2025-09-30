import mongoose, { Model, Schema } from "mongoose";
//import { boolean } from "zod";

const userSchema = new Schema<User>(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationCode: {
      type: String,
      default: null,
    },
    verificationExpiry: {
      type: Date,
      default: null,
    },
    resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordTokenExpiry: {
      type: Date,
      default: null,
    },
    role: {
      type: String,
      enum: ["founder", "vc"],
      required: true,
    },
    userPlan: {
      type: String,
      enum: ["free", "starter", "professional", "enterprise"],
      required: true,
    },
    signupStep2Done: {
      type: Boolean,
      default: false,
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      default:null,
      required: false,
    },
  },
  { timestamps: true }
);

const UserModel:Model<User> =mongoose.models.User || mongoose.model<User>("User", userSchema);

export default UserModel;
