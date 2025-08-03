import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import UserModel from "@/models/UserModel";
import CompanyModel from "@/models/CompanyModel";
import bcrypt from "bcryptjs";
import signupSchema from "@/schemas/signUpSchema";
import { z } from "zod";
import resend from "@/lib/resend/resend-verification";
export async function POST(req: NextRequest){
  await dbConnect();
  try {
    const body = await req.json();
    const validatedData = signupSchema.parse(body);

    // Check if user already exists
    const existingUser = await UserModel.findOne({
      email: validatedData.email,
    });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "User already exists" },
        { status: 400 }
      );
    }

    const companyDoc = await CompanyModel.create({
      companyName: validatedData.company,
      websiteUrl: validatedData.websiteUrl,
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(validatedData.password, salt);
 
    // Create user
    const user = new UserModel({
      fullName: validatedData.fullName,
      email: validatedData.email,
      password: hashedPassword,
      role: validatedData.role,
      userPlan: "free",
      company: companyDoc._id,
      verificationCode: Math.floor(100000 + Math.random() * 900000).toString(),
      verificationExpiry: new Date(Date.now() + 1000 * 60 * 60),
      isVerified: false,
      resetPasswordToken: null,
      provider: "credentials",
      signupStep2Done: true
    });
    await user.save();
    await resend(user.verificationCode,user.fullName,user.email, user._id);

    return NextResponse.json(
      {
        success: true,
        message: "User created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: error.issues.map((e) => e.message).join(", "),
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
