import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Navigation } from "@/components/navigation"
import { DashboardNav } from "@/components/dashboard-nav"
import { Suspense } from "react"
import { PageTransition } from "@/components/page-transition"
import Providers from "./providers"
import { ConditionalNavigation } from "@/components/conditional-navigation"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "GiveBack Hub - Empowering Communities, Changing Lives",
  description:
    "Join us in creating lasting impact through community-driven initiatives that address real needs and build sustainable futures.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable} antialiased`}>
        <Providers>
          <ConditionalNavigation />
          {children}
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}
