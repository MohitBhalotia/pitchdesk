import { inngest } from "./client";
import PitchModel from "@/models/PitchModel";
import dbConnect from "@/lib/db";
import axios from "axios";
import { userPlanModel } from "@/models/UserPlanModel";
export const updatePitch = inngest.createFunction(
  { id: "update-pitch" },
  { cron: "*/30 * * * *" },
  async () => {
    await dbConnect();
    const pitches = await PitchModel.find({
      duration: null,
    });
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
        console.log(res.data);

        pitch.duration = Math.ceil(res?.data?.response?.sts_details?.duration);
        pitch.endTime = new Date(pitch.startTime.getTime() + (pitch.duration || 0) * 1000);
        await pitch.save();
        const user = await userPlanModel.findOne({
          userId: pitch.userId,
        });
        if (!user) {
          continue;
        }
        user.pitchTimeRemaining -= Math.ceil(pitch.duration/60);
        await user.save();
      } catch (error) {
        console.error("Error getting duration", error);
        continue;
      }
    }
    return { message: `Pitches updated successfully` };
  }
);
