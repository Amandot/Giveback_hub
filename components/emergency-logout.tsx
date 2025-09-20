"use client"

import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { LogOut, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function EmergencyLogout() {
  const { data: session, status } = useSession()

  if (status !== "authenticated") {
    return null
  }

  const handleEmergencyLogout = async () => {
    try {
      // Clear all storage
      localStorage.clear()
      sessionStorage.clear()
      
      // Force logout
      await signOut({ 
        redirect: true,
        callbackUrl: "/"
      })
    } catch (error) {
      console.error("Emergency logout failed:", error)
      // Force redirect anyway
      window.location.href = "/"
    }
  }

  return (
    <Card className="border-red-200 bg-red-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-800">
          <AlertTriangle className="h-5 w-5" />
          Debug: Emergency Logout
        </CardTitle>
        <CardDescription className="text-red-700">
          If you can't see the regular logout button, use this emergency option
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="text-sm text-red-700">
            <p>Signed in as: <strong>{session?.user?.email}</strong></p>
            <p>Session status: <strong>{status}</strong></p>
          </div>
          <Button 
            onClick={handleEmergencyLogout}
            variant="destructive"
            size="sm"
            className="w-full"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Emergency Sign Out
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Debug component to show session info
export function SessionDebugInfo() {
  const { data: session, status } = useSession()

  return (
    <Card className="border-blue-200 bg-blue-50 mb-4">
      <CardHeader>
        <CardTitle className="text-blue-800 text-sm">Session Debug Info</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-xs text-blue-700 space-y-1">
          <p>Status: <strong>{status}</strong></p>
          <p>User: <strong>{session?.user?.name || "None"}</strong></p>
          <p>Email: <strong>{session?.user?.email || "None"}</strong></p>
          <p>Role: <strong>{session?.user?.role || "None"}</strong></p>
          <p>Session exists: <strong>{session ? "Yes" : "No"}</strong></p>
        </div>
      </CardContent>
    </Card>
  )
}