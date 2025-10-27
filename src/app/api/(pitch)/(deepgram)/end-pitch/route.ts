import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import PitchModel from "@/models/PitchModel";
import pitchSchema from "@/schemas/pitchSchema";
import { userPlanModel } from "@/models/UserPlanModel";
import axios from "axios";
export async function POST(req: Request) {
  await dbConnect();
  try {
    const body = await req.json();
    console.log("body", body);
    const validatedData = pitchSchema.parse(body);
    const pitch = await PitchModel.findOne({
      sessionId: validatedData.sessionId,
    });
    if (!pitch) {
      return NextResponse.json(
        {
          success: false,
          message: "Pitch not found",
        },
        { status: 404 }
      );
    }
    pitch.endTime = new Date();
    const sessionId = pitch.sessionId;
    pitch.conversationHistory = validatedData.conversationHistory
      .filter((message) => message.type === "History")
      .map((message) => ({
        role: message.role,
        content: message.content,
        timestamp: message.timeStamp,
      }));
      const res = await axios.get(
        `https://api.deepgram.com/v1/projects/${process.env.DEEPGRAM_PROJECT_ID}/requests/${sessionId}`,
        {
          headers: {
            Authorization: `Token ${process.env.DEEPGRAM_API_KEY}`,
          },
        }
      );
    const duration = res?.data?.response?.sts_details?.duration;
    if (isNaN(duration)) {
      pitch.duration = validatedData.duration;
    } else {
      pitch.duration = Math.ceil(duration);
    }
    pitch.endTime = new Date();
    await pitch.save();

    const user = await userPlanModel.findOne({
      userId: pitch.userId,
    });
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User plan not found",
        },
        { status: 404 }
      );
    }

    user.pitchTimeRemaining -= Math.ceil(pitch.duration / 60);
    await user.save();

    return NextResponse.json(
      {
        success: true,
        message: "Pitch session stored successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error ending pitch", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error ending pitch",
      },
      { status: 500 }
    );
  }
}
