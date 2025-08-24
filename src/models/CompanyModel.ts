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
},{timestamps:true});

const CompanyModel = mongoose.model<Company>('Company', companySchema);
export default CompanyModel;