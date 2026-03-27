// Helper functions to send email events to Inngest
import { inngest } from "./client";
import {
  InviteEmailData,
  VerificationEmailData,
  ForgotPasswordEmailData,
  ContactUsEmailData,
  VCAdminNotificationEmailData,
} from "./email-types";


export async function sendVCNotificationEmailEvent(
  vcName: string,
  vcEmail: string
): Promise<void> {
  const emailData: VCAdminNotificationEmailData = {
    type: "vc_notification",
    to: "info@pitchdesk.in", // Send to admin
    vcName,
    vcEmail,
  };

  try {
    await inngest.send({
      name: "email.send",
      data: emailData,
    });
  } catch (error) {
    console.error("Failed to queue VC notification email event to Inngest:", error);
    throw new Error(`Failed to queue VC notification email: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}


export async function sendInviteEmailEvent(
  memberName: string,
  memberEmail: string,
  teamName: string,
  leaderName: string,
  competitionTitle: string,
  inviteLink: string,
  teamId: string
): Promise<void> {
  const emailData: InviteEmailData = {
    type: "invite",
    to: memberEmail,
    memberName,
    memberEmail,
    teamName,
    leaderName,
    competitionTitle,
    inviteLink,
    teamId,
  };

  try {
    await inngest.send({
      name: "email.send",
      data: emailData,
    });
  } catch (error) {
    console.error("Failed to queue invite email event to Inngest:", error);
    // Re-throw to allow caller to handle (e.g., log to database, alert, etc.)
    throw new Error(`Failed to queue invite email for ${memberEmail}: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}


export async function sendVerificationEmailEvent(
  verificationCode: string,
  fullName: string,
  email: string,
  userId: string
): Promise<void> {
  const emailData: VerificationEmailData = {
    type: "verification",
    to: email,
    verificationCode,
    fullName,
    email,
    userId,
  };

  try {
    await inngest.send({
      name: "email.send",
      data: emailData,
    });
  } catch (error) {
    console.error("Failed to queue verification email event to Inngest:", error);
    throw new Error(`Failed to queue verification email for ${email}: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}


export async function sendForgotPasswordEmailEvent(
  resetPasswordToken: string,
  fullName: string,
  email: string
): Promise<void> {
  const emailData: ForgotPasswordEmailData = {
    type: "forgot",
    to: email,
    resetPasswordToken,
    fullName,
    email,
  };

  try {
    await inngest.send({
      name: "email.send",
      data: emailData,
    });
  } catch (error) {
    console.error("Failed to queue forgot password email event to Inngest:", error);
    throw new Error(`Failed to queue forgot password email for ${email}: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

export async function sendContactUsEmailEvent(
  name: string,
  email: string,
  message: string
): Promise<void> {
  const emailData: ContactUsEmailData = {
    type: "contact",
    to: email,
    name,
    email,
    message,
  };

  try {
    await inngest.send({
      name: "email.send",
      data: emailData,
    });
  } catch (error) {
    console.error("Failed to queue contact form email event to Inngest:", error);
    throw new Error(`Failed to queue contact form email: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}


export async function sendBulkEmailEvents(
  emailEvents: Array<
    | InviteEmailData
    | VerificationEmailData
    | ForgotPasswordEmailData
    | ContactUsEmailData
    | VCAdminNotificationEmailData
  >
): Promise<void> {
  try {
    await Promise.all(
      emailEvents.map((emailData) =>
        inngest.send({
          name: "email.send",
          data: emailData,
        })
      )
    );
  } catch (error) {
    console.error("Failed to queue bulk email events to Inngest:", error);
    throw new Error(`Failed to queue bulk email events: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

