import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IIncubationApplication extends Document {
    programId: mongoose.Types.ObjectId;
    founderId: mongoose.Types.ObjectId;
    pitchId: mongoose.Types.ObjectId;
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
