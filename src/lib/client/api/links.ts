import { allLinksSchema, DeleteLink, type NewLink } from "@/lib/shared/validations/links";
import { api } from ".";

export const getUserLinks = async () => {
  const res = await api("/api/links", {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });

  if (!res.ok) {
    console.log("[GET_USER_LINKS]: Failed to get user links.");
    return [];
  }

  return allLinksSchema.parse(await res.json());
};

export async function createLink(data: NewLink) {
  return api("/api/links", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });
}

export async function deleteLink(data: DeleteLink) {
  return api("/api/links", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });
}

