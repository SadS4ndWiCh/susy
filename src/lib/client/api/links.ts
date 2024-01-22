import { allLinksSchema, DeleteLink, type NewLink } from "@/lib/shared/validations/links";
import { api } from ".";

export const getUserLinks = async () => {
  const res = await api.get("/api/links");

  if (!res.ok) {
    console.log("[GET_USER_LINKS]: Failed to get user links.");
    return [];
  }

  const validatedLink = allLinksSchema.safeParse(await res.json());
  if (!validatedLink.success) {
    console.log("[GET_USER_LINKS]: API return wrong all links schema.");
    return [];
  }

  return validatedLink.data;
};

export async function createLink(data: NewLink) {
  return api.post("/api/links", {
    body: JSON.stringify(data)
  });
}

export async function deleteLink(data: DeleteLink) {
  return api.delete("/api/links", {
    body: JSON.stringify(data)
  });
}

