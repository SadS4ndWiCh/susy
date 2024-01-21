import type { Metadata } from "next";
import { GeistMono } from "geist/font/mono"

import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";

import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://susy.vercel.app"),
  title: {
    template: "%s | Susy",
    default: "Susy"
  },
  description: "Create susy links that scare people",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn("text-foreground bg-background antialiased font-mono", GeistMono.variable)}>
        <Providers>
          {children}
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
