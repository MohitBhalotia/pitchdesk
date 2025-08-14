import { z } from "zod"

const signupSchema = z.object({
    fullName:z.string().min(3,{message:"Full name must be at least 3 characters long"}),
    email:z.string().email({message:"Invalid email address"}),
    password:z.string().min(8,{message:"Password must be at least 8 characters long"}),
    confirmPassword:z.string().min(8,{message:"Passwords do not match"}),
    role:z.enum(["founder","vc"],{message:"Invalid role"}),
    company:z.string().min(1,{message:"Company name is required"}),
    websiteUrl:z.string().url({message:"Invalid website URL"}),

})

export default signupSchema