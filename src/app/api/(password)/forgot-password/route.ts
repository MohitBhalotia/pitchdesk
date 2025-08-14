import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import UserModel from "@/models/UserModel";
import resendForgot from "@/lib/resend/resend-forgot";
import {v4 as uuidv4} from "uuid";
import {addMinutes} from "date-fns";
import {z} from "zod";
import forgotPasswordSchema from "@/schemas/forgotPasswordSchema";



export  async function POST(req: NextRequest/*, res: NextResponse*/) {
    try {
        const body = await req.json();
        const validatedData = forgotPasswordSchema.safeParse(body);
        if (!validatedData.success) {
            return NextResponse.json({ error: "Invalid request data", details: z.treeifyError(validatedData.error) }, { status: 400 });
        }

        await dbConnect();

        const user = await UserModel.findOne({ email: validatedData.data.email });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const resetToken = uuidv4();
        const resetTokenExpiry = addMinutes(new Date(), 10);

        user.resetPasswordToken = resetToken;
        user.resetPasswordTokenExpiry = resetTokenExpiry;

        await user.save();

        await resendForgot(resetToken, user.fullName, user.email);

        return NextResponse.json({ message: "Password reset email sent" }, { status: 200 });
    } catch (error) {
        console.error("Error in forgot password route:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
  }

  