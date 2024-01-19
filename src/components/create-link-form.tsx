"use client"

import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalStorage } from "usehooks-ts";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { api } from "@/lib/api";
import { newLinkSchema, type Link, type NewLink } from "@/lib/validations/links";

export function CreateLinkForm() {
  const [links, setLinks] = useLocalStorage<Link[]>("@susy.links", []);
  const { handleSubmit, register } = useForm<NewLink>({
    resolver: zodResolver(newLinkSchema),
  });

  const onSubmit: SubmitHandler<NewLink> = async (data) => {
    const res = await api("/links", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ url: data.url })
    });

    if (!res.ok) return toast.error("Failed to create link.");

    const { link } = await res.json() as { success: boolean, link: Link };
    setLinks([...links, link]);

    toast.success("Link successfuly created.");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Label htmlFor="url">URL</Label>
      <div className="flex gap-2">
        <Input
          id="url"
          type="url"
          placeholder="e.g. https://google.com"
          {...register("url")}
        />
        <Button>Create</Button>
      </div>
    </form>
  )
}