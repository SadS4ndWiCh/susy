import type { ReactNode } from "react";

import { UserMenu } from "@/components/user-menu";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <header className="flex items-center justify-between gap-4">
        <span className="text-xl font-bold">susy.</span>

        <UserMenu />
      </header>

      <section className="flex-1">
        {children}
      </section>

      <footer className="">
        <small className="text-sm text-muted-foreground">&copy; susy 2024</small>
      </footer>
    </>
  )
}