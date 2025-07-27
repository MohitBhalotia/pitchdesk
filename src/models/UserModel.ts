import mongoose, { Schema, Document } from 'mongoose';
import { User } from '../types/index';

const userSchema = new Schema<User>({
    fullname: {
        type: String,
        required: true,
        unique: true,
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

    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    role: {
        type: String,
        enum: ['founder', 'vc'],
        required: true,
    },
    userPlan: {
        type: String,
        enum: ['free', 'starter', 'professional', 'enterprise'],
        required: true,
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        default: null,
        required: true,
    },
});

export const UserModel = mongoose.models.User || mongoose.model<User>('User', userSchema);

