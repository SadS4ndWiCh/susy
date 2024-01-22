"use client"

import { Link as LinkIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { getUserLinks } from "@/lib/client/api/links";

import { Skeleton } from "../ui/skeleton";
import { LinkItem } from "./link-item";

export function UserLinks() {
  const { isPending: loading, data: links } = useQuery({
    queryKey: ["links"],
    queryFn: getUserLinks
  });

  if (loading) return <UserLinksSkeleton />

  if (!links || links.length === 0) return (
    <div className="flex flex-col items-center mx-auto max-w-sm text-center">
      <div className="w-fit p-4 mb-2 rounded-md bg-fuchsia-600/10 text-fuchsia-600">
        <LinkIcon className="w-5 h-5" />
      </div>

      <h2 className="text-lg font-bold">No link created</h2>
      <p className="text-balance">It doesn&apos;t seem to have any links yet. Create one and share.</p>
    </div>
  );

  return (
    <ul className="mt-2 space-y-2">
      {links.length > 0 && links.map(link => (
        <LinkItem key={link.id} link={link} />
      ))}
    </ul>
  )
}

export function UserLinksSkeleton() {
  return (
    <ul className="mt-2 space-y-2">
      {Array.from({ length: 4 }).map((_, idx) => (
        <Skeleton
          key={`uls-${idx}`}
          className="px-4 py-8"
        />
      ))}
    </ul>
  )
}