import { z } from "zod"

const signupSchema = z.object({
    fullName:z.string().min(3,{message:"Full name must be at least 3 characters long"}),
    email:z.string().email({message:"Invalid email address"}),
    password:z.string().min(8,{message:"Password must be at least 8 characters long"}),
    confirmPassword:z.string().min(8,{message:"Passwords do not match"}),
    role:z.enum(["founder","vc"],{message:"Invalid role"}),
    company:z.string().optional(),
    websiteUrl:z.string().optional(),

})

export default signupSchema