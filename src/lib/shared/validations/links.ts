import { z } from "zod";

export const linkSchema = z.object({
  id: z.string(),
  url: z.string().url(),
  susLink: z.string(),
  ownerId: z.string(),
  expiresAt: z.string(),
  createdAt: z.string()
});
export type Link = z.infer<typeof linkSchema>;

export const allLinksSchema = z.array(linkSchema);
export type AllLinks = z.infer<typeof allLinksSchema>;

export const newLinkSchema = linkSchema.pick({ url: true });
export type NewLink = z.infer<typeof newLinkSchema>;

export const deleteLinkSchema = linkSchema.pick({ id: true });
export type DeleteLink = z.infer<typeof deleteLinkSchema>;