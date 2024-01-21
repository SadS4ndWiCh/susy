"use client"

import { useRouter } from "next/navigation"

import { z } from "zod"
import { toast } from "sonner"
import { Loader } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { signUp } from "@/lib/api/auth"
import { signupSchema } from "@/lib/validations/auth"

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query"

export function SignupForm() {
  const router = useRouter();

  const { register, handleSubmit } = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
  });

  const { isPending: loading, mutate: onSubmit } = useMutation({
    mutationFn: signUp,
    onSettled: (res) => {
      if (!res || !res.ok) return toast.error("Failed to sign up");

      router.replace("/");
    }
  });

  return (
    <form onSubmit={handleSubmit(data => onSubmit(data))} className="my-4">
      <div>
        <Label htmlFor="username">Username</Label>
        <Input id="username" placeholder="e.g. John doe" {...register("username")} />
      </div>
      <div className="mt-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="e.g. johndoe@email.com" {...register("email")} />
      </div>
      <div className="mt-2 mb-4">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" placeholder="*********" {...register("password")} />
      </div>

      <Button className="flex items-center gap-2">
        {loading && <Loader className="w-4 h-4 animate-spin" />}
        {"Create account"}
      </Button>
    </form>
  )
}