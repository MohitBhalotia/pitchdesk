import { z } from "zod";

const signupSchemaStep2=z.object({
    role:z.enum(["founder","vc"],{message:"Invalid role"}),
    company:z.string().min(1,{message:"Company name is required"}),
    websiteUrl:z.string().url({message:"Invalid website URL"}),
});

export default signupSchemaStep2;