import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IDetails {
  description: string;
  eligibility: string;
  rules: string[];
  rewards: string[];
}

export interface ICompetition extends Document {
  title: string;
  description: string;
  pitchTime: number;
  vcId: mongoose.Types.ObjectId;
  collegeName: string;
  collegeLogo: string;
  bannerImage1: string;
  bannerImage2: string;
  prizePool: string;
  postedDate: Date;
  registrationDeadline: Date;
  teamSize: {
    min: number;
    max: number;
  };
  stages: Array<{
    name: string;
    description: string;
    startDate: Date;
    endDate: Date;
  }>;
  details: IDetails;
  contacts: Array<{
    name: string;
    email: string;
    phone?: string;
    role: string;
  }>;
  eventInterval?: {
    start: Date;
    end: Date;
  };
  isActive: boolean;
  approved: boolean;
  totalRegistered: number;
  createdAt: Date;
  updatedAt: Date;
  isPractice: boolean;
}

const DetailsSchema = new Schema<IDetails>({
  description: { type: String, required: true },
  eligibility: { type: String, required: true },
  rules: [{ type: String, required: true }],
  rewards: [{ type: String, required: true }]
});

const CompetitionSchema = new Schema<ICompetition>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  pitchTime: { type: Number, required: true },
  vcId: { type: Schema.Types.ObjectId, required: true },
  collegeName: { type: String, required: true },
  collegeLogo: { type: String, required: true },
  bannerImage1: { type: String, required: true },
  bannerImage2: { type: String, required: true },
  prizePool: { type: String, required: true },
  postedDate: { type: Date, required: true },
  registrationDeadline: { type: Date, required: true },
  teamSize: {
    min: { type: Number, required: true, default: 1 },
    max: { type: Number, required: true, default: 1 }
  },
  stages: [{
    name: { type: String, required: true },
    description: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
  }],
  details: { type: DetailsSchema, required: true },
  contacts: [{
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    role: { type: String, required: true }
  }],
  eventInterval: {
    start: { type: Date },
    end: { type: Date }
  },
  isActive: { type: Boolean, default: true },
  approved: { type: Boolean, default: false },
  totalRegistered: { type: Number, default: 0 },
  isPractice: { type: Boolean, default: false }
}, {
  timestamps: true
});

const Competition: Model<ICompetition> = mongoose.models.Competition || mongoose.model<ICompetition>('Competition', CompetitionSchema);

export default Competition;