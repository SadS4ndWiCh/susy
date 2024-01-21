import type { SignUp, SignIn } from "@/lib/shared/validations/auth";

import { api } from ".";

export async function signUp(credentials: SignUp) {
  return await api("/api/auth/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(credentials)
  });
}

export async function signIn(credentials: SignIn) {
  return await api("/api/auth/signin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(credentials)
  });
}

export async function signOut() {
  return await api("/api/auth/signout", {
    method: "POST"
  });
}