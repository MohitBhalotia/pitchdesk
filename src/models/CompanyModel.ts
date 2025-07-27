import mongoose ,{Schema} from "mongoose";
import { Company } from "../types/index";

const companySchema = new Schema<Company>({
    companyName: {
        type: String,
        required: true,
        unique: true,
    },
    websiteURL: {
        type: String,
        required: true,
        unique: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

export const CompanyModel = mongoose.models.Company || mongoose.model<Company>('Company', companySchema);
