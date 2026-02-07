import mongoose, { Model, Schema, Document } from "mongoose";

export interface IAgent extends Document {
  name: string;
  voice: string;
  firstMessage: string;
  systemPrompt: string;
  image: string;
  tags: string[];

  // VC Bot specific fields
  vcId?: mongoose.Types.ObjectId;
  description?: string;
  isActive?: boolean;
  generatedAvatars?: string[];
  domainFocus?: string;

  // Enhanced VC Info3
  sector?: string[];
  fundSize?: string;
  investmentStage?: string[]; // Seed, Series A, etc.
  geographicFocus?: string;
  userInstructions?: string; // Raw input from VC

  createdAt?: Date;
  updatedAt?: Date;
}

const agentSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  voice: {
    type: String,
    required: true,
  },
  firstMessage: {
    type: String,
    required: true,
  },
  systemPrompt: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  tags: [{
    type: String,
  }],

  // VC Bot Extensions
  vcId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  generatedAvatars: [{
    type: String,
  }],
  domainFocus: {
    type: String,
  },
  sector: [{
    type: String,
  }],
  fundSize: {
    type: String,
  },
  investmentStage: [{
    type: String,
  }],
  geographicFocus: {
    type: String,
  },
  userInstructions: {
    type: String,
  }
}, { timestamps: true });

const Agent: Model<IAgent> = mongoose.models.Agent || mongoose.model<IAgent>("Agent", agentSchema);

export default Agent;
