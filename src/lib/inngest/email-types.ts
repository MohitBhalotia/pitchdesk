// Email event types for Inngest

export type EmailType = "invite" | "verification" | "forgot" | "contact" | "vc_notification";

export interface BaseEmailEvent {
  type: EmailType;
  to: string;
}

export interface InviteEmailData extends BaseEmailEvent {
  type: "invite";
  memberName: string;
  memberEmail: string;
  teamName: string;
  leaderName: string;
  competitionTitle: string;
  inviteLink: string;
  teamId: string;
}

export interface VerificationEmailData extends BaseEmailEvent {
  type: "verification";
  verificationCode: string;
  fullName: string;
  email: string;
  userId: string;
}

export interface ForgotPasswordEmailData extends BaseEmailEvent {
  type: "forgot";
  resetPasswordToken: string;
  fullName: string;
  email: string;
}

export interface ContactUsEmailData extends BaseEmailEvent {
  type: "contact";
  name: string;
  email: string;
  message: string;
}

export interface VCAdminNotificationEmailData extends BaseEmailEvent {
  type: "vc_notification";
  vcName: string;
  vcEmail: string;
}

export type EmailEventData =
  | InviteEmailData
  | VerificationEmailData
  | ForgotPasswordEmailData
  | ContactUsEmailData
  | VCAdminNotificationEmailData;
