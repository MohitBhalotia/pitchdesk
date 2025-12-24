import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest/client";
import { updatePitch, sendEmail } from "@/lib/inngest/functions";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    updatePitch,
    sendEmail,
  ],
});