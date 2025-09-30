import z from "zod";

const messageSchema = z.object({
  type: z.string(),
  role: z.enum(["user", "bot"]),
  content: z.string().min(1, "Message cannot be empty"),
  timeStamp: z.string(),
});
const pitchSchema = z.object({
  userId: z.string(),
  sessionId: z.string(),
  conversationHistory: z.array(messageSchema).default([]),
});

export type pitchSchema = z.infer<typeof pitchSchema>;

export default pitchSchema;
