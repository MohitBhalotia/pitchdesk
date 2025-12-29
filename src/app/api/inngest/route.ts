import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest/client";
import { updatePitch, sendEmail } from "@/lib/inngest/functions";
import { sendPracticeEmail } from "@/lib/inngest/send-practice-email";
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    updatePitch,
    sendEmail,
    sendPracticeEmail,
  ],
});