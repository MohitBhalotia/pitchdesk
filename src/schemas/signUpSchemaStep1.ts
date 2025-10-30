import { z } from "zod"

const signupSchemaStep1 = z.object({
    fullName:z.string().min(3,{message:"Full name must be at least 3 characters long"}),
    email:z.string().email({message:"Invalid email address"}),
    password:z.string().min(8,{message:"Password must be at least 8 characters long"}),
    confirmPassword:z.string().min(8,{message:"Passwords do not match"}),
    privacyPolicy:z.boolean().refine((value) => value === true, {
        message: "You must accept the privacy policy",
    }),
})

export default signupSchemaStep1