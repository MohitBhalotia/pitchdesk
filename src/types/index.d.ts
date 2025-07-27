 import { Document } from 'mongoose';
import { int } from 'zod';
 
 export interface User extends Document {
    fullname: string;
    email: string;
    password: string;
    profileImage?: string;
    isVerified: boolean;
    verificationCode: string | null;
    verificationExpiry: Date | null;
    resetPasswordToken: string | null;
    createdAt: Date;
    updatedAt: Date;
    role: 'founder' | 'vc';
    userPlan: 'free' | 'starter' | 'professional' | 'enterprise';
    company: moongose.Schema.Types.ObjectId | null;
}

export interface Company extends Document {
    companyName: string;
    websiteURL: string;
    createdAt: Date;
    updatedAt: Date;
}
