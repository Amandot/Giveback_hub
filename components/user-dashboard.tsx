"use client"

import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { 
  Heart, 
  Users, 
  Calendar, 
  Settings, 
  TrendingUp, 
  LogOut,
  Package,
  CheckCircle,
  XCircle,
  Clock,
  CreditCard
} from "lucide-react"
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Link from "next/link"
import { SimpleLogoutButton } from "@/components/logout-options"
import { EmergencyLogout, SessionDebugInfo } from "@/components/emergency-logout"
import { useState, useEffect } from "react"

interface UserDonation {
  id: string
  donationType: 'MONEY' | 'ITEMS'
  itemName: string
  quantity: number
  description: string
  amount?: number
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  createdAt: string
  updatedAt: string
  adminNotes?: string
  ngo?: {
    id: string
    name: string
  }
}

export function UserDashboard() {
  const { data: session, status } = useSession()
  const [donations, setDonations] = useState<UserDonation[]>([])
  const [loadingDonations, setLoadingDonations] = useState(true)

  const fetchDonations = async () => {
    try {
      const response = await fetch('/api/donations')
      if (response.ok) {
        const data = await response.json()
        setDonations(data.donations || [])
      }
    } catch (error) {
      console.error('Failed to fetch donations:', error)
    } finally {
      setLoadingDonations(false)
    }
  }

  useEffect(() => {
    if (session?.user) {
      fetchDonations()
    }
  }, [session])

  if (status === "loading") {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (status === "unauthenticated") {
    return null
  }

  const user = session?.user
  const userInitials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>
      case 'APPROVED':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>
      case 'REJECTED':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Calculate user stats
  const totalMoneyDonated = donations
    .filter(d => d.donationType === 'MONEY' && d.status === 'APPROVED')
    .reduce((sum, d) => sum + (d.amount || 0), 0)

  const totalItemsDonated = donations
    .filter(d => d.donationType === 'ITEMS' && d.status === 'APPROVED')
    .reduce((sum, d) => sum + d.quantity, 0)

  const approvedDonations = donations.filter(d => d.status === 'APPROVED').length
  const pendingDonations = donations.filter(d => d.status === 'PENDING').length

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user?.image || ""} alt={user?.name || "User"} />
              <AvatarFallback className="text-lg font-semibold bg-primary text-primary-foreground">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Welcome back, {user?.name?.split(' ')[0] || 'Friend'}! 👋
              </h1>
              <p className="text-muted-foreground">
                Ready to make a difference in your community?
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" asChild>
              <Link href="/profile">
                <Settings className="h-4 w-4 mr-2" />
                Profile
              </Link>
            </Button>
            <SimpleLogoutButton variant="outline" size="sm" showIcon={true} text="Sign Out" />
          </div>
        </div>
        <Badge variant="secondary" className="mb-4">
          <Heart className="h-3 w-3 mr-1" />
          Active Supporter
        </Badge>
      </div>

      {/* Dashboard Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* My Impact */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Impact</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              ₹{totalMoneyDonated.toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-muted-foreground">Total money donated</p>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Approved donations</span>
                <span className="font-medium">{approvedDonations}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Items donated</span>
                <span className="font-medium">{totalItemsDonated}</span>
              </div>
              {pendingDonations > 0 && (
                <div className="flex justify-between text-sm text-yellow-600">
                  <span>Pending review</span>
                  <span className="font-medium">{pendingDonations}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Active Projects */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Projects</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">3</div>
            <p className="text-xs text-muted-foreground">Active projects you're following</p>
            <div className="mt-4">
              <Button variant="outline" size="sm" asChild className="w-full">
                <Link href="/projects">View All Projects</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">2</div>
            <p className="text-xs text-muted-foreground">Upcoming volunteer events</p>
            <div className="mt-4 space-y-1">
              <p className="text-xs font-medium">Beach Cleanup - March 25</p>
              <p className="text-xs font-medium">Food Drive - April 2</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Donation History */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            My Donations
          </CardTitle>
          <CardDescription>
            Track your donation history and approval status
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loadingDonations ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading donations...</p>
            </div>
          ) : donations.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No donations yet</p>
              <Button asChild>
                <Link href="/donate">
                  <Heart className="h-4 w-4 mr-2" />
                  Make your first donation
                </Link>
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>NGO</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {donations.slice(0, 5).map((donation) => (
                    <TableRow key={donation.id}>
                      <TableCell className="font-mono text-sm">
                        {formatDate(donation.createdAt)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={donation.donationType === 'MONEY' ? 'default' : 'secondary'} className="flex items-center gap-1 w-fit">
                          {donation.donationType === 'MONEY' ? (
                            <><CreditCard className="h-3 w-3" />Money</>
                          ) : (
                            <><Package className="h-3 w-3" />Items</>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {donation.donationType === 'MONEY' ? (
                          <div className="font-medium text-green-600">
                            ₹{donation.amount?.toLocaleString('en-IN') || 'N/A'}
                          </div>
                        ) : (
                          <div>
                            <div className="font-medium">{donation.itemName}</div>
                            <div className="text-sm text-muted-foreground">Qty: {donation.quantity}</div>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-sm">
                        {donation.ngo?.name || 'General Pool'}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(donation.status)}
                        {donation.adminNotes && donation.status === 'REJECTED' && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {donation.adminNotes}
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {donations.length > 5 && (
                <div className="text-center mt-4">
                  <Button variant="outline" size="sm">
                    View All Donations ({donations.length})
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            What would you like to do today?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button asChild className="h-24 flex-col space-y-2">
              <Link href="/donate">
                <Heart className="h-6 w-6" />
                <span>Donate Now</span>
              </Link>
            </Button>
            <Button variant="outline" asChild className="h-24 flex-col space-y-2">
              <Link href="/projects">
                <Users className="h-6 w-6" />
                <span>Find Projects</span>
              </Link>
            </Button>
            <Button variant="outline" asChild className="h-24 flex-col space-y-2">
              <Link href="/map">
                <Calendar className="h-6 w-6" />
                <span>Find Events</span>
              </Link>
            </Button>
            <Button variant="outline" asChild className="h-24 flex-col space-y-2">
              <Link href="/profile">
                <Settings className="h-6 w-6" />
                <span>Profile</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Debug Section - Remove in production */}
      <div className="mt-8 space-y-4">
        <SessionDebugInfo />
        <EmergencyLogout />
      </div>
    </div>
  )
}
