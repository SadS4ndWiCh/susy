import { userSchema } from "@/lib/shared/validations/users";
import { api } from ".";

export async function getUser() {
  const res = await api.get("/api/users");
  if (!res.ok) return null;

  const body = await res.json();

  const validatedUser = userSchema.safeParse(body);
  if (!validatedUser.success) return null;

  return validatedUser.data;
}