import PitchModel from "@/models/PitchModel";
import { inngest } from "./client";
import dbConnect from "@/lib/db";
import { userPlanModel } from "@/models/UserPlanModel";
import Competition from "@/models/Competition";
import Participant from "@/models/Participant";

import { EmailEventData } from "./email-types";
import resendInviteTeamMember from "@/lib/resend/resend-invite";
import resendVerify from "@/lib/resend/resend-verification";
import resendForgot from "@/lib/resend/resend-forgot";
import resendContactUs from "@/lib/resend/resend-contactUs";
import resendVCNotification from "@/lib/resend/resend-vc-notification";
import resendApplicationAccepted from "@/lib/resend/resend-application-accepted";
import resendApplicationRejected from "@/lib/resend/resend-application-rejected";
import IncubationParticipant from "@/models/IncubationParticipant";

export const updatePitch = inngest.createFunction(
  {
    id: "update-pitch",
    batchEvents: {
      maxSize: 5,
      timeout: "30s",
      key: "event.data.pitchId", // Optional: batch events by user ID
    },
  },
  { event: "pitch.update" },
  async ({ events, step }) => {
    let duration = 0;
    let transcript: Array<{
      role: string;
      content: string;
      timestamp: string;
    }> = [];
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
          return {
            success: false,
            error: "Invalid event data",
            duration: null,
            transcript: null,
          };
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
          if (!user) {
            return { success: false, error: "User not found" };
          }
          const pitch = await PitchModel.findById(events[0].data.pitchId);
          if (!pitch) {
            return { success: false, error: "Pitch not found" };
          }
          const usedMinutes = Math.ceil(step1?.duration / 60);

          if (usedMinutes > pitch.creditsUsed) {
            const newCreditsUsed = usedMinutes - (pitch.creditsUsed ?? 0);
            pitch.creditsUsed = usedMinutes;
            await pitch.save();
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
                user.pitchTimeRemaining -= newCreditsUsed;
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
                return {
                  success: true,
                  message: "Practice competition pitch updated successfully",
                };
              } else {
                console.log("Normal Competition found");
                const participant = await Participant.findOne({
                  userId: events[0].data.userId,
                  competitionId: events[0].data.competitionId,
                });
                if (!participant) {
                  return { success: false, error: "Participant not found" };
                }
                participant.pitchTime -= newCreditsUsed;
                participant.pitchSubmitted = true;
                await participant.save();
                return {
                  success: true,
                  message: "Normal competition pitch updated successfully",
                };
              }
            } 
            // Handle incubation program pitches
            else if (events[0].data.incubationId) {
              console.log("Incubation ID found");
              const incubationParticipant = await IncubationParticipant.findOne({
                founderId: events[0].data.userId,
                programId: events[0].data.incubationId,
              });
              if (!incubationParticipant) {
                return { success: false, error: "Incubation participant not found" };
              }
              incubationParticipant.pitchTime -= newCreditsUsed;
              incubationParticipant.pitchSubmitted = true;
              await incubationParticipant.save();
              return {
                success: true,
                message: "Incubation pitch updated successfully",
              };
            }
            else {
              user.pitchTimeRemaining -= newCreditsUsed;
              await user.save();
              console.log("user after deduction", user.pitchTimeRemaining);
              return { success: true, message: "Pitch updated successfully" };
            }
          } else {
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

// Resend free plan: 2 requests/second, 100 emails/day, 3000 emails/month
// 1 event = 1 email = 1 function execution
export const sendEmail = inngest.createFunction(
  {
    id: "send-email",
    name: "Send Email",
    concurrency: {
      limit: 1, // Only 1 email processes at a time to respect 2 req/sec limit
    },
    // NO BATCHING - 1 event = 1 email = 1 execution
    rateLimit: {
      limit: 100,
      period: "24h",
    },
    retries: 3,
  },
  { event: "email.send" },
  async ({ event, step }) => {
    const emailData: EmailEventData = event.data;

    const sendEmailStep = await step.run("send-email", async () => {
      try {
        let emailResult: { id: string } | null | undefined;

        switch (emailData.type) {
          case "invite": {
            emailResult = await resendInviteTeamMember(
              emailData.memberName,
              emailData.memberEmail,
              emailData.teamName,
              emailData.leaderName,
              emailData.competitionTitle,
              emailData.inviteLink,
              emailData.teamId
            );
            break;
          }

          case "verification": {
            emailResult = await resendVerify(
              emailData.verificationCode,
              emailData.fullName,
              emailData.email,
              emailData.userId
            );
            break;
          }

          case "forgot": {
            emailResult = await resendForgot(
              emailData.resetPasswordToken,
              emailData.fullName,
              emailData.email
            );
            break;
          }

          case "contact": {
            emailResult = await resendContactUs(
              emailData.name,
              emailData.email,
              emailData.message
            );
            break;
          }

          case "vc_notification": {
            emailResult = await resendVCNotification(
              emailData.vcName,
              emailData.vcEmail
            );
            break;
          }

          case "application_accepted": {
            emailResult = await resendApplicationAccepted(
              emailData.to,
              emailData.founderName,
              emailData.startupName,
              emailData.programName,
              emailData.programUrl,
              emailData.vcName
            );
            break;
          }

          case "application_rejected": {
            emailResult = await resendApplicationRejected(
              emailData.to,
              emailData.founderName,
              emailData.startupName,
              emailData.programName,
              emailData.programUrl,
              emailData.vcName
            );
            break;
          }

          default:
            throw new Error(
              `Unknown email type: ${(emailData as EmailEventData).type}`
            );
        }

        // Resend returns data object with id on success, null/undefined on error
        if (emailResult && emailResult.id) {
          return {
            success: true,
            email: emailData.to,
            type: emailData.type,
            data: emailResult,
          };
        } else {
          return {
            success: false,
            email: emailData.to,
            type: emailData.type,
            error: "Failed to send email - Resend returned no data",
          };
        }
      } catch (error: unknown) {
        const emailAddress = emailData?.to || "unknown";
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        console.error(`Error sending email to ${emailAddress}:`, error);
        return {
          success: false,
          email: emailAddress,
          type: emailData?.type || "unknown",
          error: errorMessage,
        };
      }
    });

    // Sleep 500ms after sending email to respect 2 req/sec limit
    await step.sleep("rate-limit-delay", "500ms");

    return sendEmailStep;
  }
);
