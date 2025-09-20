"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { UserDashboard } from "@/components/user-dashboard"
import { Suspense } from "react"

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  if (status === "loading") {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (status === "unauthenticated") {
    router.push("/")
    return null
  }

  return (
    <Suspense fallback={<div>Loading dashboard...</div>}>
      <UserDashboard />
    </Suspense>
  )
}