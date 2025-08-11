import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";
import dbConnect from "@/lib/db";
import UserModel from "@/models/UserModel";
import CompanyModel from "@/models/CompanyModel";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    if(!session || !session.user?._id){
        return new Response("Unauthorized", {status: 401})
    }

    const { role, company, websiteUrl } = await req.json()

    await dbConnect()
    const user = await UserModel.findOne({ email: session.user.email });
    
    if (!user) {
    return new Response("User not found", { status: 404 });
    }

    const companyDoc = await CompanyModel.create({
        companyName: company,
        websiteUrl: websiteUrl
    })

    await UserModel.findByIdAndUpdate(user._id, {
    role,
    company:companyDoc._id,
    websiteUrl,
    signupStep2Done: true
    });

    return new Response("updated", { status: 200})
}