import { Inngest, eventType, staticSchema } from "inngest";
import type { EmailEventData } from "./email-types";

export type PitchUpdateEventData = {
  pitchId: string;
  sessionId: string;
  competitionId?: string | null;
  incubationId?: string | null;
  userId: string;
  transcript: Array<{
    role: string;
    content: string;
    timestamp: string;
  }>;
  duration: number;
};

export const pitchUpdateEvent = eventType("pitch.update", {
  schema: staticSchema<PitchUpdateEventData>(),
});

export const emailSendEvent = eventType("email.send", {
  schema: staticSchema<EmailEventData & Record<string, unknown>>(),
});

export const practiceEmailSendEvent = eventType("practice.email.send");

// Create a client to send and receive events
export const inngest = new Inngest({ id: "PitchDesk" });
