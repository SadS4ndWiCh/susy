"use client"

import { Link as LinkIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { env } from "@/lib/env/client";
import { getUserLinks } from "@/lib/api/links";

import { CopyButton } from "./copy-button";
import { Skeleton } from "./ui/skeleton";

export function UserLinks() {
  const { isPending: loading, data: links } = useQuery({
    queryKey: ["links"],
    queryFn: getUserLinks
  });

  if (loading) return <UserLinksSkeleton />

  if (!links || links.length === 0) return (
    <div className="flex flex-col items-center mx-auto max-w-sm text-center">
      <div className="w-fit p-4 mb-2 rounded-md bg-fuchsia-50 text-fuchsia-600">
        <LinkIcon className="w-5 h-5" />
      </div>

      <h2 className="text-lg font-bold">No link created</h2>
      <p className="text-balance">It doesn&apos;t seem to have any links yet. Create one and share.</p>
    </div>
  );

  return (
    <ul className="mt-2 space-y-2">
      {links.length > 0 && links.map(link => (
        <li
          key={link.id}
          className="flex items-center justify-between p-4 border border-border rounded-md"
        >
          <div className="flex flex-col">
            <span>{link.susLink}</span>

            <div className="space-x-2 mt-2">
              <span className="w-fit text-sm px-2 py-1 bg-muted text-muted-foreground rounded-md">
                {link.url}
              </span>

              <span className="w-fit text-sm px-2 py-1 bg-muted text-muted-foreground rounded-md">
                7 days remaing
              </span>
            </div>
          </div>

          <div>
            <CopyButton content={`${env.NEXT_PUBLIC_API_BASE_URL}/${link.susLink}`} />
          </div>
        </li>
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