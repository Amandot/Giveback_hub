"use client"

import { useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Users, Package, CheckCircle, XCircle, Eye, LogOut, Building } from "lucide-react"
import { toast } from "sonner"

interface NGO {
  id: string
  name: string
  email: string
  description: string
  address: string | null
  phone: string | null
  website: string | null
  latitude: number
  longitude: number
  city: string
}

interface Donation {
  id: string
  itemName: string
  quantity: number
  description: string
  status: "PENDING" | "APPROVED" | "REJECTED"
  createdAt: string
  user: {
    id: string
    name: string | null
    email: string
  }
  ngo: {
    id: string
    name: string
  } | null
}

interface DashboardStats {
  totalDonations: number
  pendingDonations: number
  approvedDonations: number
  rejectedDonations: number
  poolDonations: number
}

export default function AdminDashboard() {
  const { data: session } = useSession()
  const [ngo, setNgo] = useState<NGO | null>(null)
  const [donations, setDonations] = useState<Donation[]>([])
  const [poolDonations, setPoolDonations] = useState<Donation[]>([])
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (session?.user?.id) {
      fetchAdminData()
    }
  }, [session])

  const fetchAdminData = async () => {
    try {
      setIsLoading(true)
      
      // Fetch NGO data
      const ngoResponse = await fetch("/api/admin/ngo")
      if (ngoResponse.ok) {
        const ngoData = await ngoResponse.json()
        setNgo(ngoData.ngo)
      }

      // Fetch donations for this NGO
      const donationsResponse = await fetch("/api/admin/donations")
      if (donationsResponse.ok) {
        const donationsData = await donationsResponse.json()
        setDonations(donationsData.donations)
        setPoolDonations(donationsData.poolDonations)
        setStats(donationsData.stats)
      }

    } catch (error) {
      console.error("Error fetching admin data:", error)
      toast.error("Failed to load dashboard data")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDonationAction = async (donationId: string, action: "APPROVED" | "REJECTED") => {
    try {
      const response = await fetch(`/api/donations/${donationId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: action })
      })

      if (!response.ok) {
        throw new Error("Failed to update donation")
      }

      toast.success(`Donation ${action.toLowerCase()} successfully`)
      fetchAdminData() // Refresh data

    } catch (error) {
      console.error("Error updating donation:", error)
      toast.error("Failed to update donation")
    }
  }

  const handleAcceptFromPool = async (donationId: string) => {
    try {
      const response = await fetch(`/api/admin/accept-donation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ donationId })
      })

      if (!response.ok) {
        throw new Error("Failed to accept donation")
      }

      toast.success("Donation accepted from pool")
      fetchAdminData() // Refresh data

    } catch (error) {
      console.error("Error accepting donation:", error)
      toast.error("Failed to accept donation from pool")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Building className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                {ngo && (
                  <p className="text-sm text-gray-600">{ngo.name}</p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{session?.user?.name}</p>
                <p className="text-xs text-gray-600">{session?.user?.email}</p>
              </div>
              <Button
                variant="outline"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* NGO Info Card */}
        {ngo && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                NGO Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Name</p>
                  <p className="text-base text-gray-900">{ngo.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-base text-gray-900">{ngo.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Phone</p>
                  <p className="text-base text-gray-900">{ngo.phone || "Not provided"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Website</p>
                  <p className="text-base text-gray-900">{ngo.website || "Not provided"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Location</p>
                  <p className="text-base text-gray-900 flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {ngo.city}
                  </p>
                </div>
              </div>
              {ngo.description && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-500">Description</p>
                  <p className="text-base text-gray-900">{ngo.description}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalDonations}</p>
                  </div>
                  <Package className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats.pendingDonations}</p>
                  </div>
                  <Eye className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Approved</p>
                    <p className="text-2xl font-bold text-green-600">{stats.approvedDonations}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Rejected</p>
                    <p className="text-2xl font-bold text-red-600">{stats.rejectedDonations}</p>
                  </div>
                  <XCircle className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pool</p>
                    <p className="text-2xl font-bold text-purple-600">{stats.poolDonations}</p>
                  </div>
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Donations Management */}
        <Tabs defaultValue="ngo-donations" className="space-y-4">
          <TabsList>
            <TabsTrigger value="ngo-donations">NGO Donations</TabsTrigger>
            <TabsTrigger value="pool-donations">Pool Donations</TabsTrigger>
          </TabsList>

          <TabsContent value="ngo-donations">
            <Card>
              <CardHeader>
                <CardTitle>Donations for Your NGO</CardTitle>
                <CardDescription>
                  Manage donations specifically made to your NGO
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {donations.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">
                      No donations received yet
                    </p>
                  ) : (
                    donations.map((donation) => (
                      <div key={donation.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">{donation.itemName}</h3>
                            <p className="text-sm text-gray-600">Quantity: {donation.quantity}</p>
                            <p className="text-sm text-gray-600 mt-1">{donation.description}</p>
                            <div className="flex items-center gap-4 mt-2">
                              <p className="text-xs text-gray-500">
                                From: {donation.user.name || donation.user.email}
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(donation.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                donation.status === "APPROVED" ? "default" :
                                donation.status === "REJECTED" ? "destructive" : "secondary"
                              }
                            >
                              {donation.status}
                            </Badge>
                            {donation.status === "PENDING" && (
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => handleDonationAction(donation.id, "APPROVED")}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Accept
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleDonationAction(donation.id, "REJECTED")}
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Reject
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pool-donations">
            <Card>
              <CardHeader>
                <CardTitle>Pool Donations</CardTitle>
                <CardDescription>
                  Donations available in the pool that you can accept for your NGO
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {poolDonations.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">
                      No donations available in the pool
                    </p>
                  ) : (
                    poolDonations.map((donation) => (
                      <div key={donation.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">{donation.itemName}</h3>
                            <p className="text-sm text-gray-600">Quantity: {donation.quantity}</p>
                            <p className="text-sm text-gray-600 mt-1">{donation.description}</p>
                            <div className="flex items-center gap-4 mt-2">
                              <p className="text-xs text-gray-500">
                                From: {donation.user.name || donation.user.email}
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(donation.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">POOL</Badge>
                            <Button
                              size="sm"
                              onClick={() => handleAcceptFromPool(donation.id)}
                              className="bg-purple-600 hover:bg-purple-700"
                            >
                              Accept from Pool
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}