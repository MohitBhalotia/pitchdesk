import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";
import dbConnect from "@/lib/db";
import UserModel from "@/models/UserModel";
import CompanyModel from "@/models/CompanyModel";
import { createFreeUserPlan } from "@/lib/razorpayUtils";
import { sendVCNotificationEmailEvent } from "@/lib/inngest/email-helpers";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session || !session.user?._id) {
        return new Response("Unauthorized", { status: 401 })
    }

    const { role, company, websiteUrl } = await req.json()

    await dbConnect()
    const user = await UserModel.findOne({ email: session.user.email });

    if (!user) {
        return new Response("User not found", { status: 404 });
    }

    const companyDoc = await CompanyModel.create({
        companyName: company || "My Company",
        websiteUrl: websiteUrl || ""
    })

    if (role === 'founder') {
        await createFreeUserPlan(user._id.toString());
        await UserModel.findByIdAndUpdate(user._id, {
            role,
            company: companyDoc._id,
            signupStep2Done: true
        });
    }
    else if(role==='vc'){
        await sendVCNotificationEmailEvent(user.fullName, user.email);
        await UserModel.findByIdAndUpdate(user._id, {
            isVerified:false,// for vc, not verified bydefault even for signup via google
            role,
            company: companyDoc._id,
            signupStep2Done: true
        });
    }


    return new Response("updated", { status: 200 })
}