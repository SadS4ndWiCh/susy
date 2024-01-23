import { z } from "zod";

export const userSchema = z.object({
  id: z.string().length(15),
  username: z.string().max(64),
  email: z.string().email().max(255),
  createdAt: z.string(),
});
export type User = z.infer<typeof userSchema>;

export const userAttributesSchema = userSchema.omit({
  id: true,
  createdAt: true
});
export type UserAttributes = z.infer<typeof userAttributesSchema>;