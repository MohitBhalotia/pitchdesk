import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IIncubationApplication extends Document {
    programId: mongoose.Types.ObjectId;
    founderId: mongoose.Types.ObjectId;
    pitchId: mongoose.Types.ObjectId;

    // Registration/Application Data
    registrationData: {
        startupName: string;
        founderName: string;
        email: string;
        phone: string;
        industry: string;
        stage: 'idea' | 'mvp' | 'early_revenue' | 'growth' | 'scaling';
        teamSize: number;
        description: string;
        website?: string;
        linkedin?: string;
        fundingRaised?: string;
        motivation: string;
    };

    status: 'pending' | 'wishlist' | 'hold' | 'rejected' | 'accepted';
    score: number;
    botFeedback: string;
    submittedAt: Date;

    // Communication
    messages: {
        from: 'vc' | 'founder';
        message: string;
        timestamp: Date;
    }[];

    // Tracking
    statusHistory: {
        status: string;
        changedAt: Date;
        changedBy: mongoose.Types.ObjectId;
    }[];
}

const IncubationApplicationSchema = new Schema<IIncubationApplication>({
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
    pitchId: {
        type: Schema.Types.ObjectId,
        ref: 'Pitch',
        required: true
    },
    registrationData: {
        startupName: { type: String, required: true },
        founderName: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        industry: { type: String, required: true },
        stage: {
            type: String,
            enum: ['idea', 'mvp', 'early_revenue', 'growth', 'scaling'],
            required: true
        },
        teamSize: { type: Number, required: true },
        description: { type: String, required: true, maxlength: 500 },
        website: { type: String },
        linkedin: { type: String },
        fundingRaised: { type: String },
        motivation: { type: String, required: true, maxlength: 300 }
    },
    status: {
        type: String,
        enum: ['pending', 'wishlist', 'hold', 'rejected', 'accepted'],
        default: 'pending'
    },
    score: {
        type: Number,
        default: 0
    },
    botFeedback: {
        type: String
    },
    submittedAt: {
        type: Date,
        default: Date.now
    },

    messages: [{
        from: { type: String, enum: ['vc', 'founder'], required: true },
        message: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
    }],

    statusHistory: [{
        status: { type: String, required: true },
        changedAt: { type: Date, default: Date.now },
        changedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    }],
}, {
    timestamps: true
});

const IncubationApplication: Model<IIncubationApplication> = mongoose.models.IncubationApplication || mongoose.model<IIncubationApplication>('IncubationApplication', IncubationApplicationSchema);

export default IncubationApplication;
