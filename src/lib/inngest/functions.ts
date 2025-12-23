import { inngest } from "./client";
import dbConnect from "@/lib/db";

export const updatePitch = inngest.createFunction(
  {
    id: "update-pitch",
    batchEvents: {
      maxSize: 100,
      timeout: "60s",
      key: "event.data.pitchId", // Optional: batch events by user ID
    },
  },
  { event: "pitch.update" },
  async ({ events, step }) => {
    // NOTE: Use the `events` argument, which is an array of event payloads
    console.log("events", events);

    return { success: true,  };
  }
);