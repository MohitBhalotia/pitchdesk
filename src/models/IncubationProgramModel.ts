import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IIncubationProgram extends Document {
    title: string;
    vcId: mongoose.Types.ObjectId;
    botId: mongoose.Types.ObjectId; // The AI Judge (References Agent now)
    description: string;
    eligibility: string;
    stages: string;
    timeline: {
        startDate: Date;
        endDate: Date;
        applicationDeadline: Date;
    };
    fundingAmount?: string;
    equityExpectations?: string;
    cohortSize?: number;
    notes?: string;
    status: 'draft' | 'published' | 'closed';
    createdAt: Date;
    updatedAt: Date;
}

const IncubationProgramSchema = new Schema<IIncubationProgram>({
    title: { type: String, required: true },
    vcId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    botId: { type: Schema.Types.ObjectId, ref: 'Agent', required: true }, // REF UPDATED TO AGENT
    description: { type: String, required: true },
    eligibility: { type: String, required: true },
    stages: { type: String, required: true },
    timeline: {
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        applicationDeadline: { type: Date, required: true },
    },
    fundingAmount: { type: String },
    equityExpectations: { type: String },
    cohortSize: { type: Number },
    notes: { type: String },
    status: {
        type: String,
        enum: ['draft', 'published', 'closed'],
        default: 'draft'
    },
}, {
    timestamps: true
});

const IncubationProgram: Model<IIncubationProgram> = mongoose.models.IncubationProgram || mongoose.model<IIncubationProgram>('IncubationProgram', IncubationProgramSchema);

export default IncubationProgram;
