"use client"

import { Loader } from "lucide-react"
import { useForm } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"
import { zodResolver } from "@hookform/resolvers/zod"

import { useAuth } from "@/lib/client/hooks/use-auth"
import { type SignIn, signinSchema } from "@/lib/shared/validations/auth"

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function SigninForm() {
  const { signIn } = useAuth();

  const { register, handleSubmit } = useForm<SignIn>({
    resolver: zodResolver(signinSchema),
  });

  const { isPending: loading, mutate: onSubmit } = useMutation({
    mutationFn: signIn,
  });

  return (
    <form onSubmit={handleSubmit(data => onSubmit(data))} className="my-4">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="e.g. johndoe@email.com" {...register("email")} />
      </div>
      <div className="mt-2 mb-4">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" placeholder="*********" {...register("password")} />
      </div>

      <Button className="flex items-center gap-2">
        {loading && <Loader className="w-4 h-4 animate-spin" />}
        {"Login"}
      </Button>
    </form>
  )
}