import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="max-w-xl mx-auto mt-8 px-4">
      { children }
    </div>
  )
}