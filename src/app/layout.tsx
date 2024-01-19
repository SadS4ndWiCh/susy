import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={cn("text-foreground bg-background antialiased", inter.className)}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
