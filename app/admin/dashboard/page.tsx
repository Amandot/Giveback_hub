"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  CheckCircle, 
  XCircle, 
  Clock, 
  Package,
  Users,
  MapPin,
  AlertCircle,
  MessageSquare,
  Truck,
  Calendar,
  Navigation
} from 'lucide-react'
import dynamic from 'next/dynamic'

// Dynamic import to prevent SSR issues with maps
const UserMap = dynamic(() => import('@/components/user-map'), {
  ssr: false,
  loading: () => <div className="h-96 bg-gray-100 animate-pulse rounded-lg"></div>
})

interface Donation {
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
  ngoId?: string
  // Pickup service fields
  needsPickup?: boolean
  pickupDate?: string
  pickupTime?: string
  pickupAddress?: string
  pickupNotes?: string
  pickupStatus?: 'NOT_REQUIRED' | 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  user: {
    id: string
    name: string | null
    email: string
  }
  ngo?: {
    id: string
    name: string
  }
}

interface User {
  id: string
  name: string | null
  email: string
  role: string
  createdAt: string
  location?: {
    lat: number
    lng: number
    city?: string
    country?: string
  }
}

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const [donations, setDonations] = useState<Donation[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'donations' | 'pickups' | 'users'>('overview')
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null)
  const [adminNotes, setAdminNotes] = useState('')
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [pickupDialogOpen, setPickupDialogOpen] = useState(false)
  const [selectedPickupStatus, setSelectedPickupStatus] = useState<string>('')

  const fetchDonations = async () => {
    try {
      const response = await fetch('/api/admin/donations')
      if (!response.ok) {
        throw new Error('Failed to fetch donations')
      }
      const data = await response.json()
      // Combine NGO donations and pool donations
      const allDonations = [...(data.donations || []), ...(data.poolDonations || [])]
      
      // Debug logging for pickup service data
      console.log('👀 Admin Dashboard - Fetched donations:', {
        totalDonations: allDonations.length,
        donationsWithPickup: allDonations.filter(d => d.needsPickup === true).length,
        sampleDonation: allDonations[0] ? {
          id: allDonations[0].id,
          needsPickup: allDonations[0].needsPickup,
          pickupDate: allDonations[0].pickupDate,
          pickupAddress: allDonations[0].pickupAddress
        } : 'No donations'
      })
      
      setDonations(allDonations)
    } catch (error) {
      console.error('Error fetching donations:', error)
      setError('Failed to load donations')
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users')
      if (!response.ok) {
        throw new Error('Failed to fetch users')
      }
      const data = await response.json()
      setUsers(data.users)
    } catch (error) {
      console.error('Error fetching users:', error)
      setError('Failed to load users')
    }
  }

  const fetchData = async () => {
    setLoading(true)
    await Promise.all([fetchDonations(), fetchUsers()])
    setLoading(false)
  }

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role === 'ADMIN') {
      fetchData()
    }
  }, [status, session])

  const openApprovalDialog = (donation: Donation, action: 'approve' | 'reject') => {
    setSelectedDonation(donation)
    setActionType(action)
    setAdminNotes('')
    setDialogOpen(true)
  }

  const updateDonationStatus = async () => {
    if (!selectedDonation || !actionType) return
    
    setUpdatingId(selectedDonation.id)
    try {
      const response = await fetch('/api/admin/donations', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          donationId: selectedDonation.id,
          action: actionType,
          adminNotes: adminNotes.trim() || undefined
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update donation status')
      }

      // Refresh the data
      await fetchData()
      setDialogOpen(false)
      
    } catch (error) {
      console.error('Error updating donation:', error)
      setError('Failed to update donation status')
    } finally {
      setUpdatingId(null)
      setSelectedDonation(null)
      setActionType(null)
      setAdminNotes('')
    }
  }

  const openPickupDialog = (donation: Donation) => {
    setSelectedDonation(donation)
    setSelectedPickupStatus(donation.pickupStatus || 'SCHEDULED')
    setPickupDialogOpen(true)
  }

  const updatePickupStatus = async () => {
    if (!selectedDonation || !selectedPickupStatus) return
    
    setUpdatingId(selectedDonation.id)
    try {
      const response = await fetch('/api/admin/donations/pickup', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          donationId: selectedDonation.id,
          pickupStatus: selectedPickupStatus
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update pickup status')
      }

      // Refresh the data
      await fetchData()
      setPickupDialogOpen(false)
      
    } catch (error) {
      console.error('Error updating pickup status:', error)
      setError('Failed to update pickup status')
    } finally {
      setUpdatingId(null)
      setSelectedDonation(null)
      setSelectedPickupStatus('')
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (session?.user?.role !== 'ADMIN') {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Access denied. This page is only available to administrators.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  const stats = {
    totalDonations: donations.length,
    pendingDonations: donations.filter(d => d.status === 'PENDING').length,
    totalUsers: users.length,
    activeUsers: users.filter(u => u.role === 'USER').length,
    pickupRequests: donations.filter(d => d.needsPickup === true).length,
    pendingPickups: donations.filter(d => d.needsPickup === true && (d.pickupStatus === 'SCHEDULED' || d.pickupStatus === 'IN_PROGRESS')).length,
  }

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

  const getPickupStatusBadge = (status: string) => {
    switch (status) {
      case 'NOT_REQUIRED':
        return <Badge variant="outline" className="text-xs">No Pickup</Badge>
      case 'SCHEDULED':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs"><Calendar className="h-3 w-3 mr-1" />Scheduled</Badge>
      case 'IN_PROGRESS':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-xs"><Truck className="h-3 w-3 mr-1" />In Progress</Badge>
      case 'COMPLETED':
        return <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs"><CheckCircle className="h-3 w-3 mr-1" />Completed</Badge>
      case 'CANCELLED':
        return <Badge variant="destructive" className="text-xs"><XCircle className="h-3 w-3 mr-1" />Cancelled</Badge>
      default:
        return <Badge variant="outline" className="text-xs">{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Donors</p>
                <div className="text-2xl font-bold">{stats.activeUsers}</div>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Donations</p>
                <div className="text-2xl font-bold">{stats.totalDonations}</div>
              </div>
              <Package className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Review</p>
                <div className="text-2xl font-bold">{stats.pendingDonations}</div>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">🚚 Pickup Requests</p>
                <div className="text-2xl font-bold text-blue-800">{stats.pickupRequests}</div>
              </div>
              <Truck className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-700">📋 Pending Pickups</p>
                <div className="text-2xl font-bold text-orange-800">{stats.pendingPickups}</div>
              </div>
              <Calendar className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Distribution Map */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            User Distribution Map
          </CardTitle>
          <CardDescription>
            Geographic distribution of registered users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserMap users={users} />
        </CardContent>
      </Card>
    </div>
  )

  const renderDonations = () => (
    <Card>
      <CardHeader>
        <CardTitle>Donation Management</CardTitle>
        <CardDescription>
          Review and manage donation requests
        </CardDescription>
      </CardHeader>
      <CardContent>
        {donations.length === 0 ? (
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No donations found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Donor</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Pickup Service</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {donations.slice(0, 10).map((donation) => (
                  <TableRow key={donation.id}>
                    <TableCell className="font-mono text-sm">
                      {formatDate(donation.createdAt)}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{donation.user.name}</div>
                        <div className="text-sm text-muted-foreground">{donation.user.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={donation.donationType === 'MONEY' ? 'default' : 'secondary'}>
                        {donation.donationType === 'MONEY' ? 'Money' : 'Items'}
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
                    <TableCell className="max-w-xs">
                      <div className="text-sm truncate" title={donation.description}>
                        {donation.description || 'No description'}
                      </div>
                    </TableCell>
                    <TableCell>
                      {donation.needsPickup ? (
                        <div className="space-y-2 p-2 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="flex items-center gap-2">
                            <Truck className="h-4 w-4 text-blue-600" />
                            <Badge variant="secondary" className="bg-blue-100 text-blue-800 font-medium">
                              🚚 PICKUP REQUESTED
                            </Badge>
                          </div>
                          {getPickupStatusBadge(donation.pickupStatus || 'SCHEDULED')}
                          {donation.pickupDate && (
                            <div className="text-xs text-blue-700 flex items-center gap-1 font-medium">
                              <Calendar className="h-3 w-3" />
                              📅 {new Date(donation.pickupDate).toLocaleDateString()}
                              {donation.pickupTime && ` at ${donation.pickupTime}`}
                            </div>
                          )}
                          {donation.pickupAddress && (
                            <div className="text-xs text-blue-700 flex items-center gap-1 max-w-xs font-medium">
                              <Navigation className="h-3 w-3" />
                              📍 <span className="truncate" title={donation.pickupAddress}>{donation.pickupAddress}</span>
                            </div>
                          )}
                          {donation.pickupNotes && (
                            <div className="text-xs text-blue-600 bg-blue-100 p-1 rounded max-w-xs">
                              💬 <span className="font-medium">Notes:</span> {donation.pickupNotes}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-gray-500">
                          <Badge variant="outline" className="text-xs">No Pickup</Badge>
                          <span className="text-xs">Self Drop-off</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(donation.status)}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-2">
                        {donation.status === 'PENDING' ? (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="default"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => openApprovalDialog(donation, 'approve')}
                              disabled={updatingId === donation.id}
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => openApprovalDialog(donation, 'reject')}
                              disabled={updatingId === donation.id}
                            >
                              <XCircle className="h-3 w-3 mr-1" />
                              Reject
                            </Button>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            {donation.status.toLowerCase()}
                          </span>
                        )}
                        {donation.needsPickup && donation.status === 'APPROVED' && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs"
                            onClick={() => openPickupDialog(donation)}
                            disabled={updatingId === donation.id}
                          >
                            <Truck className="h-3 w-3 mr-1" />
                            Manage Pickup
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )

  const renderPickups = () => {
    const pickupDonations = donations.filter(d => d.needsPickup === true)
    
    return (
      <Card className="border-blue-200">
        <CardHeader className="bg-blue-50">
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Truck className="h-5 w-5" />
            🚚 Pickup Service Requests
          </CardTitle>
          <CardDescription className="text-blue-600">
            All donations that have requested pickup service
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pickupDonations.length === 0 ? (
            <div className="text-center py-8">
              <Truck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No pickup requests found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Donor</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Pickup Details</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pickupDonations.map((donation) => (
                    <TableRow key={donation.id} className="bg-blue-50/50">
                      <TableCell className="font-mono text-sm">
                        {formatDate(donation.createdAt)}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{donation.user.name}</div>
                          <div className="text-sm text-muted-foreground">{donation.user.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{donation.itemName}</div>
                          <div className="text-sm text-muted-foreground">Qty: {donation.quantity}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1 max-w-xs">
                          {donation.pickupDate && (
                            <div className="text-sm font-medium text-blue-700 flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              📅 {new Date(donation.pickupDate).toLocaleDateString()}
                              {donation.pickupTime && ` at ${donation.pickupTime}`}
                            </div>
                          )}
                          {donation.pickupAddress && (
                            <div className="text-sm text-blue-600 flex items-center gap-1">
                              <Navigation className="h-3 w-3" />
                              📍 <span className="truncate" title={donation.pickupAddress}>{donation.pickupAddress}</span>
                            </div>
                          )}
                          {donation.pickupNotes && (
                            <div className="text-xs text-blue-500 bg-blue-100 p-1 rounded">
                              💬 {donation.pickupNotes}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {getStatusBadge(donation.status)}
                          {getPickupStatusBadge(donation.pickupStatus || 'SCHEDULED')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-2">
                          {donation.status === 'PENDING' ? (
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="default"
                                className="bg-green-600 hover:bg-green-700 text-xs"
                                onClick={() => openApprovalDialog(donation, 'approve')}
                                disabled={updatingId === donation.id}
                              >
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                className="text-xs"
                                onClick={() => openApprovalDialog(donation, 'reject')}
                                disabled={updatingId === donation.id}
                              >
                                <XCircle className="h-3 w-3 mr-1" />
                                Reject
                              </Button>
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground">
                              {donation.status.toLowerCase()}
                            </span>
                          )}
                          {donation.status === 'APPROVED' && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs bg-blue-50 border-blue-200 hover:bg-blue-100"
                              onClick={() => openPickupDialog(donation)}
                              disabled={updatingId === donation.id}
                            >
                              <Truck className="h-3 w-3 mr-1" />
                              Manage Pickup
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  const renderUsers = () => (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
        <CardDescription>
          Overview of registered users
        </CardDescription>
      </CardHeader>
      <CardContent>
        {users.length === 0 ? (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Location</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.slice(0, 10).map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name || 'N/A'}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(user.createdAt)}</TableCell>
                    <TableCell>
                      {user.location ? `${user.location.city || 'Unknown'}, ${user.location.country || 'Unknown'}` : 'Not set'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage users, donations, and track geographic impact</p>
      </div>

      {error && (
        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      {/* Pickup Service Urgent Alert */}
      {stats.pendingPickups > 0 && (
        <Alert className="mb-6 border-blue-200 bg-blue-50 animate-pulse">
          <Truck className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>🚚 {stats.pendingPickups} Pickup{stats.pendingPickups > 1 ? 's' : ''} Pending!</strong>
            {' '}You have donations waiting for pickup service. 
            <button 
              onClick={() => setActiveTab('pickups')}
              className="underline font-medium hover:text-blue-900 ml-1"
            >
              View Pickup Requests →
            </button>
          </AlertDescription>
        </Alert>
      )}

      {/* Navigation Tabs */}
      <div className="mb-6">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'overview'
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('donations')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'donations'
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Donations
          </button>
          <button
            onClick={() => setActiveTab('pickups')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'pickups'
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Truck className="h-4 w-4" />
            🚚 Pickup Requests
            {stats.pendingPickups > 0 && (
              <Badge variant="destructive" className="h-5 w-5 p-0 text-xs flex items-center justify-center">
                {stats.pendingPickups}
              </Badge>
            )}
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'users'
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Users
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'donations' && renderDonations()}
      {activeTab === 'pickups' && renderPickups()}
      {activeTab === 'users' && renderUsers()}

      {/* Approval Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {actionType === 'approve' ? (
                <><CheckCircle className="h-5 w-5 text-green-600" />Approve Donation</>
              ) : (
                <><XCircle className="h-5 w-5 text-red-600" />Reject Donation</>
              )}
            </DialogTitle>
            <DialogDescription>
              {selectedDonation && (
                <div className="space-y-2 mt-4">
                  <div><strong>Donor:</strong> {selectedDonation.user.name}</div>
                  <div><strong>Item:</strong> {selectedDonation.donationType === 'MONEY' ? `₹${selectedDonation.amount?.toLocaleString('en-IN')}` : selectedDonation.itemName}</div>
                  <div><strong>Description:</strong> {selectedDonation.description || 'No description'}</div>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="admin-notes">
                Message to Donor {actionType === 'approve' ? '(Optional)' : '(Recommended)'}
              </Label>
              <Textarea
                id="admin-notes"
                placeholder={
                  actionType === 'approve' 
                    ? "Thank you for your generous donation! We'll contact you soon with pickup details."
                    : "We currently have sufficient inventory of these items. Please consider donating again next month."
                }
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                This message will be included in the email sent to the donor.
              </p>
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              disabled={updatingId === selectedDonation?.id}
            >
              Cancel
            </Button>
            <Button
              onClick={updateDonationStatus}
              disabled={updatingId === selectedDonation?.id}
              className={actionType === 'approve' ? 'bg-green-600 hover:bg-green-700' : ''}
              variant={actionType === 'reject' ? 'destructive' : 'default'}
            >
              {updatingId === selectedDonation?.id ? (
                'Processing...'
              ) : (
                <>
                  {actionType === 'approve' ? (
                    <><CheckCircle className="h-4 w-4 mr-2" />Approve & Send Email</>
                  ) : (
                    <><XCircle className="h-4 w-4 mr-2" />Reject & Send Email</>
                  )}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Pickup Status Management Dialog */}
      <Dialog open={pickupDialogOpen} onOpenChange={setPickupDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-blue-600" />
              Manage Pickup Service
            </DialogTitle>
            <DialogDescription>
              {selectedDonation && (
                <div className="space-y-2 mt-4">
                  <div><strong>Donor:</strong> {selectedDonation.user.name}</div>
                  <div><strong>Item:</strong> {selectedDonation.itemName}</div>
                  {selectedDonation.pickupDate && (
                    <div><strong>Scheduled:</strong> {new Date(selectedDonation.pickupDate).toLocaleDateString()} at {selectedDonation.pickupTime}</div>
                  )}
                  {selectedDonation.pickupAddress && (
                    <div><strong>Address:</strong> {selectedDonation.pickupAddress}</div>
                  )}
                  {selectedDonation.pickupNotes && (
                    <div><strong>Notes:</strong> {selectedDonation.pickupNotes}</div>
                  )}
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="pickup-status">Update Pickup Status</Label>
              <Select value={selectedPickupStatus} onValueChange={setSelectedPickupStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select pickup status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setPickupDialogOpen(false)}
              disabled={updatingId === selectedDonation?.id}
            >
              Cancel
            </Button>
            <Button
              onClick={updatePickupStatus}
              disabled={updatingId === selectedDonation?.id || !selectedPickupStatus}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {updatingId === selectedDonation?.id ? (
                'Updating...'
              ) : (
                <>
                  <Truck className="h-4 w-4 mr-2" />Update Status
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
