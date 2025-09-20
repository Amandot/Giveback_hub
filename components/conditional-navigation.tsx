"use client"

import { useSession } from "next-auth/react"
import { usePathname } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { DashboardNav } from "@/components/dashboard-nav"

export function ConditionalNavigation() {
  const { data: session, status } = useSession()
  const pathname = usePathname()

  // Debug logging (remove in production)
  console.log('ConditionalNavigation - Status:', status, 'Pathname:', pathname, 'User:', session?.user?.email)

  // Loading state - show a minimal loading nav
  if (status === "loading") {
    return (
      <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="animate-pulse h-8 bg-gray-200 rounded w-32"></div>
            <div className="animate-pulse h-8 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
      </div>
    )
  }

  // Don't show any navigation on the home page if user is not authenticated
  if (pathname === "/" && status === "unauthenticated") {
    return null
  }

  // Show dashboard navigation for authenticated users
  if (status === "authenticated") {
    return <DashboardNav />
  }

  // Show regular navigation for unauthenticated users on other pages
  if (status === "unauthenticated" && pathname !== "/") {
    return <Navigation />
  }

  // Fallback - show regular navigation
  return <Navigation />
}
