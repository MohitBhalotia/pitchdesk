import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import PitchModel from "@/models/PitchModel";
import pitchSchema from "@/schemas/pitchSchema";
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
    console.log(res.data);

    pitch.duration = Math.ceil(res?.data?.response?.sts_details?.duration);
    pitch.endTime = new Date();
    await pitch.save();
    // TODO: Deduct agent minutes from user
    return NextResponse.json({
      success: true,
      message: "pitch session stored successfully",
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error ending pitch", error);
    if (error.errors) {
      return NextResponse.json(
        {
          error: error.errors,
        },
        {
          status: 400,
        }
      );
    }
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
