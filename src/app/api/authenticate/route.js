import dbConnect from "@/lib/db";
import { userPlanModel } from "@/models/UserPlanModel";
import { DeepgramError, createClient } from "@deepgram/sdk";
import {  NextResponse } from "next/server";

export async function POST(req) {
  await dbConnect();
  const { userId } = await req.json();
  console.log("userId", userId);
  if (!userId) {
    return NextResponse.json(
      { success: false, message: "User ID is required" },
      { status: 400 }
    );
  }
  const user = await userPlanModel.findOne({ userId});
  if (!user) {
    return NextResponse.json(
      { success: false, message: "User not found" },
      { status: 404 }
    );
  }
  console.log("user", user);
  if (user.pitchTimeRemaining <= 0) {
    return NextResponse.json(
      { success: false, message: "User has no pitch time remaining" },
      { status: 400 }
    );
  }
  // exit early so we don't request 70000000 keys while in devmode
  if (process.env.API_KEY_STRATEGY === "provided") {
    return NextResponse.json(
      process.env.DEEPGRAM_API_KEY
        ? { key: process.env.DEEPGRAM_API_KEY }
        : new DeepgramError(
            "Can't do local development without setting a `DEEPGRAM_API_KEY` environment variable."
          )
    );
  }

  const deepgram = createClient(process.env.DEEPGRAM_API_KEY ?? "");
  let { result: token, error: tokenError } = await deepgram.auth.grantToken();

  if (tokenError) {
    return NextResponse.json(tokenError);
  }

  return NextResponse.json({ ...token });
}
