import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest/client";
import { updatePitch } from "@/lib/inngest/functions";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    updatePitch, // <-- This is where you'll always add all your functions
  ],
});