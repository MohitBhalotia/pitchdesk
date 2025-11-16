// lib/models/participant.ts
import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IParticipant extends Document {
  competitionId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  teamName: string;
  teamLeader: {
    email: string;
    name: string;
  };
  teamMembers: Array<{
    name: string;
    email: string;
    status: 'pending' | 'accepted' | 'declined';   // new
    userId?: mongoose.Types.ObjectId;             // new: set after accept/signup
    inviteToken?: string;                         // new: used for email invite links
  }>;
  registrationDate: Date;
  // status: 'registered' | 'submitted' | 'disqualified';
  teamStatus: 'disqualified' | 'validated' | 'incomplete'; // new: team overall
  pitchTime: number;
  pitchSubmitted: boolean;
  pitchEvaluated: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ParticipantSchema = new Schema<IParticipant>({
  competitionId: { type: Schema.Types.ObjectId, ref: 'Competition', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  teamName: { type: String, required: true },
  teamLeader: {
    email: { type: String, required: true },
    name: { type: String, required: true }
  },
  teamMembers: [{
    name: { type: String, required: true },
    email: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending','accepted','declined'],
      default: 'pending'
    },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    inviteToken: { type: String },
  }],
  registrationDate: { type: Date, default: Date.now },
  // status: { type: String, enum: ['registered', 'submitted', 'disqualified'], default: 'registered' },
  teamStatus: { type: String, enum: ['validated', 'incomplete','disqualified'], default: 'incomplete' },
  pitchTime: { type: Number, required: true },
  pitchSubmitted: { type: Boolean, default: false },
  pitchEvaluated: { type: Boolean, default: false },
}, {
  timestamps: true
});

// Add to your Participant model
ParticipantSchema.index({ competitionId: 1, userId: 1 }, { unique: true }); // One registration per user per competition

const Participant: Model<IParticipant> = mongoose.models.Participant || mongoose.model<IParticipant>('Participant', ParticipantSchema);

export default Participant;