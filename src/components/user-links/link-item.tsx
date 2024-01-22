"use client"

import { toast } from "sonner"
import { useCopyToClipboard } from "usehooks-ts"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Copy, MoreVertical, Trash2 } from "lucide-react"

import { env } from "@/lib/client/env"
import { deleteLink } from "@/lib/client/api/links"
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
  const [_, copy] = useCopyToClipboard();

  const queryClient = useQueryClient();
  const { isPending: loading, mutate: deleteLinkItem } = useMutation({
    mutationFn: deleteLink,
    onSettled: (res) => {
      if (!res || !res.ok) return toast.error("Failed to delete the link");

      toast.success("Link successfuly deleted");
      queryClient.invalidateQueries({ queryKey: ["links"] });
    }
  });

  return (
    <li
      key={props.link.id}
      className="flex items-center justify-between p-4 border border-border rounded-md"
    >
      <div className="flex flex-col">
        <span>{props.link.susLink}</span>

        <div className="space-x-2 mt-2">
          <span className="w-fit text-sm px-2 py-1 bg-muted text-muted-foreground rounded-md">
            {props.link.url}
          </span>

          <span className="w-fit text-sm px-2 py-1 bg-muted text-muted-foreground rounded-md">
            7 days remaing
          </span>
        </div>
      </div>

      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onSelect={() => {
                copy(`${env.NEXT_PUBLIC_API_BASE_URL}/${props.link.susLink}`);
                toast.info(`Copied to clipboard`);
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
      </div>
    </li>
  )
}