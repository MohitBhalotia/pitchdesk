import { z } from "zod";

 const resetPasswordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters long"),
});
    
export default resetPasswordSchema;


