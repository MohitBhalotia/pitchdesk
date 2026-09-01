import dbConnect from "@/lib/db";
import { userPlanModel } from "@/models/UserPlanModel";
import { DeepgramError, createClient } from "@deepgram/sdk";
import {  NextResponse } from "next/server";
import {
  resolveSessionUserId,
  UnauthorizedError,
  UserMismatchError,
} from "@/lib/services/authGuard";

export async function POST(req) {
  await dbConnect();
  const { userId: bodyUserId } = await req.json();

  let userId;
  try {
    userId = await resolveSessionUserId(bodyUserId);
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 401 }
      );
    }
    if (error instanceof UserMismatchError) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 403 }
      );
    }
    throw error;
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
