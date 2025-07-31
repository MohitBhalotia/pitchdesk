import { z } from "zod"

export const verifySchema = z.object({
    code: z.string().length(6, "wrong verification code"),
    id: z.string("Not correct user Id")
})