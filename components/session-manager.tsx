"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LogoutDialog } from "@/components/logout-dialog"
import { EmergencyLogoutButton } from "@/components/logout-options"
import { 
  Monitor, 
  Smartphone, 
  Tablet, 
  MapPin, 
  Clock, 
  Shield,
  AlertTriangle,
  CheckCircle2
} from "lucide-react"

interface Session {
  id: string
  device: string
  browser: string
  location: string
  lastActive: string
  current: boolean
  ipAddress?: string
}

export function SessionManager() {
  const { data: session } = useSession()
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock session data - in a real app, this would come from an API
    const mockSessions: Session[] = [
      {
        id: "1",
        device: "Desktop",
        browser: "Chrome 118",
        location: "Mumbai, India",
        lastActive: "Active now",
        current: true,
        ipAddress: "192.168.1.100"
      },
      {
        id: "2",
        device: "Mobile",
        browser: "Safari iOS",
        location: "Mumbai, India", 
        lastActive: "2 hours ago",
        current: false,
        ipAddress: "10.0.0.50"
      }
    ]
    
    // Simulate API call
    setTimeout(() => {
      setSessions(mockSessions)
      setLoading(false)
    }, 1000)
  }, [])

  const getDeviceIcon = (device: string) => {
    switch (device.toLowerCase()) {
      case 'mobile':
        return <Smartphone className="h-5 w-5" />
      case 'tablet':
        return <Tablet className="h-5 w-5" />
      default:
        return <Monitor className="h-5 w-5" />
    }
  }

  if (!session) {
    return null
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Session Management</h2>
        <p className="text-muted-foreground">
          Manage your active sessions and sign out from specific devices
        </p>
      </div>

      {/* Current Session Alert */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <CheckCircle2 className="h-5 w-5" />
            Current Session
          </CardTitle>
          <CardDescription className="text-green-700">
            This is the session you're currently using
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Sessions List */}
      <div className="grid gap-4">
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <div className="animate-pulse space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          sessions.map((sessionItem) => (
            <Card key={sessionItem.id} className={sessionItem.current ? "border-primary" : ""}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getDeviceIcon(sessionItem.device)}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{sessionItem.device}</span>
                        {sessionItem.current && (
                          <Badge variant="default" className="text-xs">
                            Current
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {sessionItem.browser}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {sessionItem.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {sessionItem.lastActive}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {sessionItem.current ? (
                      <LogoutDialog redirectTo="/">
                        <span className="text-destructive">Sign out</span>
                      </LogoutDialog>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // In a real app, this would call an API to terminate the session
                          setSessions(prev => prev.filter(s => s.id !== sessionItem.id))
                        }}
                      >
                        Terminate
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Security Actions */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-700">
            <AlertTriangle className="h-5 w-5" />
            Security Actions
          </CardTitle>
          <CardDescription>
            Use these options if you suspect unauthorized access to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <LogoutDialog 
              redirectTo="/" 
              showConfirmation={true}
              variant="outline"
              size="sm"
            >
              Sign out all devices
            </LogoutDialog>
            
            <EmergencyLogoutButton />
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                // In a real app, this would trigger password reset
                alert("Password reset email would be sent")
              }}
            >
              <Shield className="h-4 w-4 mr-2" />
              Change Password
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground">
            If you don't recognize any of these sessions, sign out all devices immediately and change your password.
          </p>
        </CardContent>
      </Card>

      {/* Session Info */}
      <Card>
        <CardHeader>
          <CardTitle>Session Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Signed in as:</span>
            <span className="font-medium">{session.user?.email}</span>
          </div>
          <div className="flex justify-between">
            <span>Account type:</span>
            <span className="font-medium">
              {session.user?.role === 'admin' ? 'NGO Administrator' : 'Donor'}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Session expires:</span>
            <span className="font-medium">In 30 days</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}