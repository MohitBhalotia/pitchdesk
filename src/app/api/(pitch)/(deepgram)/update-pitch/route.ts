import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../../lib/db";
import PitchModel from "@/models/PitchModel";
import axios from "axios";
import { userPlanModel } from "@/models/UserPlanModel";

export async function PATCH() {
  try {
    await dbConnect();

    const pitches = await PitchModel.find({ duration: null });

    for (const pitch of pitches) {
      const sessionId = pitch.sessionId;
      try {
        const res = await axios.get(
          `https://api.deepgram.com/v1/projects/${process.env.DEEPGRAM_PROJECT_ID}/requests/${sessionId}`,
          {
            headers: {
              Authorization: `Token ${process.env.DEEPGRAM_API_KEY}`,
            },
          }
        );

        const duration = Math.ceil(res?.data?.response?.sts_details?.duration || 0);

        if (duration > 0) {
          await PitchModel.findOneAndUpdate(
            { sessionId },
            {
              $set: {
                duration,
                endTime: new Date(pitch.startTime.getTime() + duration * 1000),
              },
            }
          );
          const user = await userPlanModel.findOne({
            userId: pitch.userId,
          });
          if (!user) {
            continue;
          }
          user.pitchTimeRemaining -= Math.ceil(duration/60);
          await user.save();
        }
      } catch (err) {
        console.error(`Error updating pitch with sessionId ${sessionId}`, err);
        // continue to next pitch
      }
    }

    return NextResponse.json(
      { success: true, message: "Pitches updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating pitches", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
