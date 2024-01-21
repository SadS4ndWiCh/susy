import { z } from "zod";

export const signupSchema = z.object({
  username: z.string().min(3).max(64),
  email: z.string().email().max(255),
  password: z.string().min(6).max(255)
});
export type SignUp = z.infer<typeof signupSchema>;

export const signinSchema = signupSchema.omit({ username: true });
export type SignIn = z.infer<typeof signinSchema>;