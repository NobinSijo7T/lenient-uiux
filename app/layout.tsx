import "./global.css";

import { ReactNode } from "react";

export const metadata = {
  title: `Cyberpunk style website \(Community\)`,
};

import NavBar from "../components/nav-bar";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
      <body suppressHydrationWarning>
        <NavBar />
        {children}
      </body>
    </html>
  );
}
