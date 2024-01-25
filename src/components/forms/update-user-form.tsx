"use client"

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";

import { getUser, updateUser } from "@/lib/client/api/users";
import { UpdatableAttributes, User, updatableAttributesSchema } from "@/lib/shared/validations/users";

import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";

export function UpdateUserForm() {
  const { isPending: loadingUser, data: user } = useQuery({
    queryKey: ["user"],
    queryFn: getUser,
    staleTime: Infinity
  });

  const { register, handleSubmit } = useForm<UpdatableAttributes>({
    resolver: zodResolver(updatableAttributesSchema),
    values: {
      username: user?.username ?? ""
    }
  });

  const queryClient = useQueryClient();
  const { isPending: loading, mutate: onSubmit } = useMutation({
    mutationFn: updateUser,
    onSettled: (res, _, attributes) => {
      if (!res || !res.ok) return toast.error("Failed to update user");

      toast.success("User successfuly updated");

      const cachedUser = queryClient.getQueryData<User>(["user"]);
      if (!cachedUser) return;

      queryClient.setQueryData(["user"], {
        ...cachedUser,
        ...attributes
      });
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Username</CardTitle>
        <CardDescription>Change your username</CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit(data => onSubmit(data))}>
        <CardContent>
          <Input id="username" disabled={loadingUser} {...register("username")} />

          </CardContent>
        <CardFooter className="pt-6 border-t border-border">
          <Button loading={loading}>Update</Button>
        </CardFooter>
      </form>
    </Card>
  )
}