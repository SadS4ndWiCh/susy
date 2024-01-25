"use client"

import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useMutation } from "@tanstack/react-query"

import { deleteUser } from "@/lib/client/api/users"

import { Button } from "../ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "../ui/dialog"

export function DeleteUserForm() {
  const router = useRouter();

  const { isPending: loading, mutate: deleteUserAccount } = useMutation({
    mutationFn: deleteUser,
    onSettled: (res) => {
      if (!res || !res.ok) return toast.error("Failed to delete your account");

      toast.success("Account successfuly deleted");
      router.refresh();
    }
  });

  return (
    <Card className="border-destructive bg-destructive/10">
      <CardHeader>
        <CardTitle className="text-red-600">Delete Account</CardTitle>
        <CardDescription className="text-red-600/90">
          Delete your account and all your links
        </CardDescription>
      </CardHeader>

      <CardFooter>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive">Delete</Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are your sure?</DialogTitle>
              <DialogDescription>If you confirm, your account will be deleted</DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <Button
                variant="outline"
                loading={loading}
                onClick={() => deleteUserAccount()}
                className="w-full"
              >
                Confirm
              </Button>

              <DialogClose asChild>
                <Button className="w-full">Cancel</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  )
}