import { inngest } from "./client";
import PitchModel from "@/models/PitchModel";
import dbConnect from "@/lib/db";
export const helloWorld = inngest.createFunction(
  { id: "update-pitch" },
  { cron: "*/2 * * * *" },
  async () => {
    await dbConnect();
    const pitches = await PitchModel.find({
      $and: [
        { endTime: null },
        { lastUpdated: { $lt: new Date(Date.now() - 0.5 * 60 * 1000) } },
      ],
    });
    for (const pitch of pitches) {
      pitch.lastUpdated = new Date();
      pitch.endTime = new Date();
      pitch.duration =
        (new Date().getTime() - pitch.startTime.getTime()) / 1000;
      await pitch.save();
    }
    return { message: `Pitches updated successfully` };
  }
);
