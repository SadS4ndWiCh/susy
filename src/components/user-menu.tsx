"use client"

import Link from "next/link";

import { useTheme } from "next-themes";
import { useQuery } from "@tanstack/react-query";
import { Home, Laptop, LogOut, Menu, Moon, Palette, Settings, Sun } from "lucide-react";

import { getUser } from "@/lib/client/api/users";
import { useAuth } from "@/lib/client/hooks/use-auth";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";

export function UserMenu() {
  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: getUser,
    staleTime: Infinity
  });

  const { setTheme } = useTheme();
  const { signOut } = useAuth();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="flex-shrink-0" variant="outline" size="icon">
          <Menu className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        { user && (
          <div className="flex flex-col px-1 pb-2 mb-2 border-b border-border">
            <span className="text-sm font-bold">{user.username}</span>
            <span className="text-xs">{user.email}</span>
          </div>
        ) }

        <Link href="/">
          <DropdownMenuItem>
            <Home className="w-4 h-4 mr-2" />
            <span>Home</span>
          </DropdownMenuItem>
        </Link>

        <Link href="/settings">
          <DropdownMenuItem>
            <Settings className="w-4 h-4 mr-2" />
            <span>Settings</span>
          </DropdownMenuItem>
        </Link>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Palette className="w-4 h-4 mr-2" />
            <span>Theme</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem onSelect={() => setTheme("light")}>
              <Sun className="w-4 h-4 mr-2" />
              <span>Light</span>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setTheme("dark")}>
              <Moon className="w-4 h-4 mr-2" />
              <span>Dark</span>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setTheme("system")}>
              <Laptop className="w-4 h-4 mr-2" />
              <span>System</span>
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuItem
          onSelect={signOut}
          className="text-red-600 bg-red-600/10 focus:bg-red-600/20 focus:text-red-600"
        >
          <LogOut className="w-4 h-4 mr-2" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}