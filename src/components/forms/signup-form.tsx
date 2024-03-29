"use client"

import { useForm } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"
import { zodResolver } from "@hookform/resolvers/zod"

import { useAuth } from "@/lib/client/hooks/use-auth"
import { type SignUp, signupSchema } from "@/lib/shared/validations/auth"

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function SignupForm() {
  const { signUp } = useAuth();

  const { register, handleSubmit } = useForm<SignUp>({
    resolver: zodResolver(signupSchema),
  });

  const { isPending: loading, mutate: onSubmit } = useMutation({
    mutationFn: signUp,
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

      <Button loading={loading}>Create account</Button>
    </form>
  )
}