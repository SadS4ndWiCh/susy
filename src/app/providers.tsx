import { type ReactNode } from "react";

import { ReactQueryProvider } from "@/components/react-query-provider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ReactQueryProvider>
      { children }
    </ReactQueryProvider>
  )
}