import mongoose ,{Schema} from "mongoose";

const companySchema = new Schema<Company>({
    companyName: {
        type: String,
        required: true,
    },
    websiteUrl: {
        type: String,
        required: true,
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

const CompanyModel = mongoose.models.Company || mongoose.model<Company>('Company', companySchema);
export default CompanyModel;