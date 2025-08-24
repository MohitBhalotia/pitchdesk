import z from "zod"

const pitchSchema = z.object({
    userId: z.string(),
    recordingUrl: z.string().url(),
    conversationHistory: z.array(
        z.object({
            role: z.enum(["user", "bot"]),
            content: z.string().min(1, "Message cannot be empty"),
            timeStamp: z.coerce.date().optional().default(() => new Date())
        })
    )
})

export type pitchSchema = z.infer<typeof pitchSchema>;

export default pitchSchema