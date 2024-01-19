import { z } from "zod";

export const linkSchema = z.object({
  id: z.string(),
  url: z.string().url(),
  susLink: z.string(),
  expiresAt: z.string(),
  createdAt: z.string()
});
export type Link = z.infer<typeof linkSchema>;

export const newLinkSchema = linkSchema.pick({ url: true });
export type NewLink = z.infer<typeof newLinkSchema>;