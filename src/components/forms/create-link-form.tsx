"use client"

import { toast } from "sonner";
import { Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { newLinkSchema, type NewLink } from "@/lib/shared/validations/links";
import { createLink } from "@/lib/client/api/links";

export function CreateLinkForm() {
  const { handleSubmit, register, reset } = useForm<NewLink>({
    resolver: zodResolver(newLinkSchema),
  });

  const queryClient = useQueryClient();
  const { isPending: loading, mutate: onSubmit } = useMutation({
    mutationFn: createLink,
    onSettled: (res) => {
      if (!res || !res.ok) return toast.error("Failed to create link.");

      toast.success("Link successfuly created.");
      queryClient.invalidateQueries({ queryKey: ["links"] });
      reset();
    }
  });

  return (
    <form onSubmit={handleSubmit((data) => onSubmit(data))}>
      <Label htmlFor="url">URL</Label>
      <div className="flex gap-2">
        <Input
          id="url"
          type="url"
          placeholder="e.g. https://google.com"
          {...register("url")}
        />
        <Button className="flex items-center gap-2">
          {loading && <Loader className="w-4 h-4 animate-spin" />}
          {"Create"}
        </Button>
      </div>
    </form>
  )
}