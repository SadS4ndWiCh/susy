import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="max-w-xl mx-auto">
      { children }
    </div>
  )
}