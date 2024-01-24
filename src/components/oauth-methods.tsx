import Link from "next/link";

import { GitHubLogoIcon } from "@radix-ui/react-icons";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/client/utils";

export function OAuthMethods() {
  return (
    <section className="flex flex-col gap-8">
      <Link
        href="/api/auth/github"
        className={cn(buttonVariants({ variant: "outline" }))}
      >
        <GitHubLogoIcon className="w-4 h-4 mr-2" />
        <span>Continue with GitHub</span>
      </Link>

      <div className="relative">
        <hr className="w-full border-border" />
        <span className="absolute -translate-y-1/2 -translate-x-1/2 left-1/2 px-4 text-center font-bold bg-background">OR</span>
      </div>
    </section>
  )
}