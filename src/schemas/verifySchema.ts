import { z } from "zod"

export const verifySchema = z.object({
    code: z.string().length(6, "wrong verification code"),
    //fullName: z.string("Enter correct fullname"),
    userId: z.string("Not correct user Id")
})