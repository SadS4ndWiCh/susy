import type { SignUp, SignIn } from "@/lib/shared/validations/auth";

import { api } from ".";

export async function signUp(credentials: SignUp) {
  return await api.post("/api/auth/signup", {
    body: JSON.stringify(credentials)
  });
}

export async function signIn(credentials: SignIn) {
  return await api.post("/api/auth/signin", {
    body: JSON.stringify(credentials)
  });
}

export async function signOut() {
  return await api.post("/api/auth/signout");
}