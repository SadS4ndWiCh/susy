"use client"

import { useRouter } from "next/navigation";

import { toast } from "sonner";
import { LogOut } from "lucide-react";

import { signOut } from "@/lib/api/auth";

import { Button } from "./ui/button";

export function LogoutButton() {
  const router = useRouter();

  const onClick = async () => {
    const res = await signOut();

    if (res.ok) {
      return router.replace("/signin");
    }

    toast.error("Failed to signout");
  }

  return (
    <Button variant="outline" size="icon" onClick={onClick}>
      <LogOut className="w-4 h-4" />
    </Button>
  )
}