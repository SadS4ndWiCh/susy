import { z } from "zod";
import { userAttributesSchema } from "./users";

export const signupSchema = userAttributesSchema
  .extend({ password: z.string().min(6).max(255) });
export type SignUp = z.infer<typeof signupSchema>;

export const signinSchema = signupSchema.omit({ username: true });
export type SignIn = z.infer<typeof signinSchema>;