"use client"

import { toast } from "sonner"
import { formatDistanceToNow } from "date-fns"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Copy, MoreVertical, Trash2 } from "lucide-react"

import { env } from "@/lib/client/env"
import { deleteLink } from "@/lib/client/api/links"
import { useCopy } from "@/lib/client/hooks/use-copy"
import { type Link } from "@/lib/shared/validations/links"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

type LinkItemProps = {
  link: Link
}

export function LinkItem(props: LinkItemProps) {
  const copy = useCopy();

  const queryClient = useQueryClient();
  const { isPending: loading, mutate: deleteLinkItem } = useMutation({
    mutationFn: deleteLink,
    onSettled: (res) => {
      if (!res || !res.ok) return toast.error("Failed to delete the link");

      toast.success("Link successfuly deleted");
      queryClient.invalidateQueries({ queryKey: ["links"] });
    }
  });
  
  const daysRemaing = formatDistanceToNow(props.link.expiresAt);

  return (
    <li
      key={props.link.id}
      className="flex items-center justify-between gap-2 p-4 border border-border rounded-md"
    >
      <div className="flex flex-col">
        <span>{props.link.susLink}</span>

        <div className="flex flex-wrap gap-2 mt-2">
          <span
            title={props.link.url}
            className="max-w-32 text-xs px-2 py-1 bg-muted text-muted-foreground rounded-md truncate"
          >
            {props.link.url}
          </span>

          <span className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded-md">
            {daysRemaing} remaing
          </span>
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="flex-shrink-0">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onSelect={() => {
              copy(`${env.NEXT_PUBLIC_API_BASE_URL}/${props.link.susLink}`);
            }}
          >
            <Copy className="w-4 h-4 mr-2" />
            <span>Copy</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={loading}
            onSelect={() => deleteLinkItem({ id: props.link.id })}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </li>
  )
}