import { NextRequest, NextResponse } from "next/server";
import UserModel from "@/models/UserModel";
import dbConnect from "@/lib/db";
import { z } from "zod";
import bcrypt from "bcryptjs";
import resetPasswordSchema from "@/schemas/resetPasswordSchema";

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: "Missing token or password." },
        { status: 400 }
      );
    }

    const parsed = resetPasswordSchema.safeParse({ password });
    if (!parsed.success) {
      const formatted = z.treeifyError(parsed.error);
      return NextResponse.json(
        { error: "Invalid password input", details: formatted },
        { status: 400 }
      );
    }

    await dbConnect();

    const user = await UserModel.findOne({ resetPasswordToken: token });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired reset token." },
        { status: 400 }
      );
    }

    // Optional: Check if token is expired
    if (user.resetPasswordTokenExpiry && user.resetPasswordTokenExpiry < new Date()) {
      return NextResponse.json(
        { error: "Reset token has expired." },
        { status: 400 }
      );
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(parsed.data.password, 10);

    // Update user password and clear token
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordTokenExpiry = null;

    await user.save();

    return NextResponse.json({ message: "Password reset successful." }, { status: 200 });

  } catch (error) {
    console.error("Error in reset-password API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
