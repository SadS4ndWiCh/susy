"use client"

import { useRouter, useSearchParams } from "next/navigation"

import { z } from "zod"
import { toast } from "sonner"
import { SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { signUp } from "@/lib/api/auth"
import { signupSchema } from "@/lib/validations/auth"

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { register, handleSubmit } = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit: SubmitHandler<z.infer<typeof signupSchema>> = async (data) => {
    const res = await signUp(data);

    if (res.ok) {
      return router.replace(searchParams.get("from") ?? "/");
    }

    toast.error("Failed to signup");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="my-4">
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

      <Button>Create account</Button>
    </form>
  )
}