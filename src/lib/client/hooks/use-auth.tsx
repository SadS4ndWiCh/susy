"use client"

import { useRouter } from "next/navigation"

import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

import * as api from "@/lib/client/api/auth"
import { SignIn, SignUp } from "@/lib/shared/validations/auth";

export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const signUp = async (credentials: SignUp) => {
    const res = await api.signUp(credentials);

    if (res.ok) {
      return router.replace("/");
    }

    toast.error("Failed to sign up");
  }

  const signIn = async (credentials: SignIn) => {
    const res = await api.signIn(credentials);

    if (res.ok) {
      return router.replace("/");
    }

    toast.error("Failed to sign in");
  }

  const signOut = async () => {
    const res = await api.signOut();

    if (res.ok) {
      queryClient.clear();
      return router.replace("/signin");
    }

    toast.error("Failed to signout");
  }

  return { signUp, signIn, signOut };
}