import { type ReactNode } from "react";

import { ReactQueryProvider } from "@/components/react-query-provider";
import { ThemesProvider } from "@/components/themes-provider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemesProvider>
      <ReactQueryProvider>
        { children }
      </ReactQueryProvider>
    </ThemesProvider>
  )
}