import { z } from "zod";

 const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export default forgotPasswordSchema;


