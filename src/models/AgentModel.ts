import mongoose, { Schema, Document} from "mongoose";

export interface IAgent extends Document {
  name: string;
  voice: string;
  firstMessage: string;
  systemPrompt: string;
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
});

const Agent = mongoose.model<IAgent>("Agent", agentSchema);

export default Agent;

