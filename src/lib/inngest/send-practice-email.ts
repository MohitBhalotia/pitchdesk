import {
  TransactionalEmailsApi,
  TransactionalEmailsApiApiKeys,
} from "@getbrevo/brevo";
import { inngest, practiceEmailSendEvent } from "./client";
import dbConnect from "../db";
import UserModel from "@/models/UserModel";

export const sendPracticeEmail = inngest.createFunction(
  {
    id: "send-practice-email",
    name: "Send Practice Email",
    triggers: [{ event: practiceEmailSendEvent }],
  },
  async ({ step }) => {
    console.log("Sending practice email");
    const transactionalEmailsApi = new TransactionalEmailsApi();
    transactionalEmailsApi.setApiKey(
      TransactionalEmailsApiApiKeys.apiKey,
      process.env.BREVO_API_KEY
    );

    async function sendTransactionalEmail() {
      try {
        await dbConnect();
        const users = await UserModel.find();
        for (let index = 0; index < users.length; index++) {
          const user = users[index];
          await transactionalEmailsApi.sendTransacEmail({
            to: [{ email: user.email, name: user.fullName }],
            subject: "Extension || PitchSprint Practice Challenge",
            templateId: 3,
            sender: { email: "info@pitchdesk.in", name: "Pitch Desk" },
          });
          console.log("Email sent! Message ID:",index, user.email, user.fullName);
        }
        console.log("All emails sent!");
        return { success: true };
      } catch (error) {
        console.error("Failed to send email:", error);
      }
    }

    return step.run("send-practice-emails", sendTransactionalEmail);
  }
);
