"use client"

import { useQuery } from "@tanstack/react-query"

import { getUser } from "@/lib/client/api/users"

import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

export function UserDetails() {
  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: getUser,
    staleTime: Infinity
  });

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Email</CardTitle>
          <CardDescription>The registered email</CardDescription>
        </CardHeader>

        <CardContent>
          <Input disabled value={user?.email} />
        </CardContent>
      </Card>
    </>
  )
}