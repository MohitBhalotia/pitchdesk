import PitchModel from "@/models/PitchModel";
import { inngest } from "./client";
import dbConnect from "@/lib/db";
import { userPlanModel } from "@/models/UserPlanModel";
import Competition from "@/models/Competition";
import Participant from "@/models/Participant";

export const updatePitch = inngest.createFunction(
  {
    id: "update-pitch",
    batchEvents: {
      maxSize: 10,
      timeout: "60s",
      key: "event.data.pitchId", // Optional: batch events by user ID
    },
  },
  { event: "pitch.update" },
  async ({ events, step }) => {
    let duration = 0;
    let transcript = [];
    const step1 = await step.run("get-details", () => {
      for (const event of events) {
        if (
          event.data.duration &&
          event.data.transcript &&
          event.data.pitchId &&
          event.data.sessionId &&
          event.data.userId
        ) {
          if (event.data.duration > duration) {
            duration = event.data.duration;
          }
          if (event.data.transcript.length > transcript.length) {
            transcript = event.data.transcript;
          }
        } else {
          return { success: false, error: "Invalid event data", duration: null, transcript: null };
        }
      }
      return {
        success: true,
        message: "Pitch synchronized successfully",
        duration,
        transcript,
      };
    });
    if (step1.success) {
      const step2 = await step.run("store-pitch", async () => {
        await dbConnect();

        const pitch = await PitchModel.findById(events[0].data.pitchId);
        if (!pitch) {
          return { success: false, error: "Pitch not found" };
        }
        pitch.sessionId = events[0].data.sessionId;
        pitch.duration = step1?.duration;
        pitch.conversationHistory = step1?.transcript;
        pitch.lastUpdated = new Date();
        await pitch.save();
        return { success: true, message: "Pitch updated successfully" };
      });
      if (step2.success) {
        const step3 = await step.run("deduct-credits", async () => {
          await dbConnect();
          const user = await userPlanModel.findOne({
            userId: events[0].data.userId,
          });
          console.log("user", user);
          if (!user) {
            return { success: false, error: "User not found" };
          }
          if (events[0].data.competitionId) {
            console.log("Competition ID found");
            const competition = await Competition.findById(
              events[0].data.competitionId
            );
            if (!competition) {
              return { success: false, error: "Competition not found" };
            }
            if (competition.isPractice) {
              console.log("Practice competition");
              user.pitchTimeRemaining -= Math.ceil(step1?.duration / 60);
              const participant = await Participant.findOne({
                userId: events[0].data.userId,
                competitionId: events[0].data.competitionId,
              });
              if (!participant) {
                return { success: false, error: "Participant not found" };
              }
              participant.pitchSubmitted = true;
              await participant.save();
              await user.save();
              return { success: true, message: "Practice competition pitch updated successfully" };
            } else {
              console.log("Normal Competition found");
              const participant = await Participant.findOne({
                userId: events[0].data.userId,
                competitionId: events[0].data.competitionId,
              });
              if (!participant) {
                return { success: false, error: "Participant not found" };
              }
              participant.pitchTime -= Math.ceil(step1?.duration / 60);
              participant.pitchSubmitted = true;
              await participant.save();
              return { success: true, message: "Normal competition pitch updated successfully" };
            }
          } else {
            user.pitchTimeRemaining -= Math.ceil(step1?.duration / 60);
            await user.save();
            console.log("user after deduction", user.pitchTimeRemaining);
            return { success: true, message: "Pitch updated successfully" };
          }
        });
        if (step3.success) {
          return { success: true, message: "Credits deducted successfully" };
        } else {
          return { success: false, error: "Credits deduction failed" };
        }
      } else {
        return { success: false, error: "Pitch update failed" };
      }
    } else {
      return { success: false, error: "Pitch synchronization failed" };
    }
  }
);
