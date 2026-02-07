import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IIncubationParticipant extends Document {
  programId: mongoose.Types.ObjectId;
  founderId: mongoose.Types.ObjectId;
  registrationDate: Date;
  pitchTime: number; // Dedicated pitch time in seconds for this program
  pitchSubmitted: boolean;
  pitchEvaluated: boolean;
  applicationSubmitted: boolean; // Whether they submitted the application form
  createdAt: Date;
  updatedAt: Date;
}

const IncubationParticipantSchema = new Schema<IIncubationParticipant>({
  programId: { 
    type: Schema.Types.ObjectId, 
    ref: 'IncubationProgram', 
    required: true 
  },
  founderId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  registrationDate: { 
    type: Date, 
    default: Date.now 
  },
  pitchTime: { 
    type: Number, 
    required: true,
    default: 15 // 15 minutes in seconds
  },
  pitchSubmitted: { 
    type: Boolean, 
    default: false 
  },
  pitchEvaluated: { 
    type: Boolean, 
    default: false 
  },
  applicationSubmitted: { 
    type: Boolean, 
    default: false 
  },
}, {
  timestamps: true
});

// One registration per user per program
IncubationParticipantSchema.index({ programId: 1, founderId: 1 }, { unique: true });

const IncubationParticipant: Model<IIncubationParticipant> = mongoose.models.IncubationParticipant || mongoose.model<IIncubationParticipant>('IncubationParticipant', IncubationParticipantSchema);

export default IncubationParticipant;
