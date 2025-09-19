"use client"

import type React from "react"
import "./globals.css"
import { Sidebar } from "@/components/sidebar"
import { Inter } from "next/font/google"
import { GlobalFloatingChat } from "@/components/global-floating-chat"
import {
  ClerkProvider,
} from "@clerk/nextjs";
import { usePathname } from "next/navigation";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
   const pathname = usePathname();
  const isAuthPage = pathname.startsWith("/signin") || pathname.startsWith("/signup");
  return (
        <ClerkProvider>
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Chronicle+Display:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
        <body>
          <div className="flex h-screen bg-background">
            {!isAuthPage && <Sidebar />}
            <main className="flex-1 overflow-auto">{children}</main>
          </div>
          <GlobalFloatingChat />
        </body>
    </html>
      </ClerkProvider>
  )
}