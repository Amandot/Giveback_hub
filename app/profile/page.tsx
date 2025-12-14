"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Mail, Calendar, Heart, Settings, Shield, Globe, LogOut, Monitor } from "lucide-react"
import Link from "next/link"
import { SessionManager } from "@/components/session-manager"
import { LogoutOptions, SimpleLogoutButton } from "@/components/logout-options"

export default function ProfilePage() {
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

  const user = session?.user
  const userInitials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'
  const joinDate = new Date(2024, 0, 15) // Mock join date
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Profile Header */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user?.image || ""} alt={user?.name || "User"} />
              <AvatarFallback className="text-2xl font-semibold bg-primary text-primary-foreground">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                <div>
                  <h1 className="text-3xl font-bold">{user?.name || "User"}</h1>
                  <p className="text-muted-foreground flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {user?.email}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Badge variant="secondary">
                    <Heart className="h-3 w-3 mr-1" />
                    Active Supporter
                  </Badge>
                  <Badge variant="outline">
                    <Shield className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Joined {joinDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>
                <span className="flex items-center gap-1">
                  <Globe className="h-4 w-4" />
                  Global Impact
                </span>
              </div>
            </div>
            
            <Button variant="outline" asChild>
              <Link href="/settings">
                <Settings className="h-4 w-4 mr-2" />
                Account Settings
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Profile Stats */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Impact Summary</CardTitle>
            <CardDescription>Your contribution to the community</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Total Donated</span>
              <span className="font-bold text-primary">$1,250.00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">NGOs Supported</span>
              <span className="font-bold">5</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Lives Impacted</span>
              <span className="font-bold">~127</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Volunteer Hours</span>
              <span className="font-bold">24 hours</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activity</CardTitle>
            <CardDescription>Recent engagement with our platform</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Last Donation</span>
              <span className="text-sm text-muted-foreground">March 15, 2024</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Upcoming Events</span>
              <span className="text-sm text-muted-foreground">2 registered</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Following NGOs</span>
              <span className="text-sm text-muted-foreground">3 organizations</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Member Since</span>
              <span className="text-sm text-muted-foreground">{joinDate.toLocaleDateString()}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security & Sessions */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security & Sessions
          </CardTitle>
          <CardDescription>
            Manage your account security and active sessions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                Logout Options
              </h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium text-sm">Current Session</p>
                    <p className="text-xs text-muted-foreground">Sign out from this device</p>
                  </div>
                  <SimpleLogoutButton variant="outline" size="sm" text="Sign Out" />
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium text-sm">All Sessions</p>
                    <p className="text-xs text-muted-foreground">Sign out from all devices</p>
                  </div>
                  <LogoutOptions>
                    <Monitor className="h-4 w-4 mr-1" />
                    Options
                  </LogoutOptions>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold">Account Security</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Last Login:</span>
                  <span className="text-muted-foreground">Today, 2:30 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Active Sessions:</span>
                  <span className="text-muted-foreground">2 devices</span>
                </div>
                <div className="flex justify-between">
                  <span>Account Status:</span>
                  <Badge variant="default" className="text-xs">Active</Badge>
                </div>
              </div>
              
              <Button variant="outline" size="sm" asChild>
                <Link href="/profile/security">
                  <Shield className="h-3 w-3 mr-1" />
                  Manage Sessions
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest contributions and engagements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 border rounded-lg">
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="font-medium">Donated to Clean Water Initiative</p>
                <p className="text-sm text-muted-foreground">March 15, 2024 • $100</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 border rounded-lg">
              <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="font-medium">Registered for Beach Cleanup Event</p>
                <p className="text-sm text-muted-foreground">March 10, 2024</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 border rounded-lg">
              <div className="h-2 w-2 bg-purple-500 rounded-full"></div>
              <div className="flex-1">
                <p className="font-medium">Started following Food Security Project</p>
                <p className="text-sm text-muted-foreground">March 5, 2024</p>
              </div>
            </div>
          </div>
          
          <Separator className="my-6" />
          
          <div className="text-center">
            <Button variant="outline" asChild>
              <Link href="/dashboard">View Full Dashboard</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}