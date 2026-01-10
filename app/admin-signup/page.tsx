"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Loader2, Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"
import dynamic from "next/dynamic"

// Dynamically import map component to avoid SSR issues
const DynamicMap = dynamic(() => import("@/components/dynamic-map"), {
  ssr: false,
  loading: () => <div className="h-[400px] bg-gray-100 rounded-lg flex items-center justify-center">
    <div className="text-center space-y-2">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      <p className="text-sm text-gray-600">Loading interactive map...</p>
    </div>
  </div>
})

interface NGOLocation {
  lat: number
  lng: number
  address?: string
}

export default function AdminSignupPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<NGOLocation | null>(null)
  // Manual coordinate inputs (kept in sync with map selection)
  const [latInput, setLatInput] = useState<string>("")
  const [lngInput, setLngInput] = useState<string>("")
  const [formData, setFormData] = useState({
    // Admin details
    adminName: "",
    adminEmail: "",
    password: "",
    confirmPassword: "",
    // NGO details
    ngoName: "",
    ngoEmail: "",
    description: "",
    address: "",
    phone: "",
    website: ""
  })
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleMapClick = (location: { lat: number; lng: number }) => {
    setSelectedLocation(location)
    setLatInput(location.lat.toString())
    setLngInput(location.lng.toString())
    
    // Use Nominatim (OpenStreetMap) for reverse geocoding
    reverseGeocode(location.lat, location.lng)
  }

  // Reverse geocoding using Nominatim (free OpenStreetMap service)
  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'Giveback-Hub-App/1.0'
          }
        }
      )
      
      if (response.ok) {
        const data = await response.json()
        if (data.display_name) {
          setSelectedLocation(prev => prev ? {
            ...prev,
            address: data.display_name
          } : { lat, lng, address: data.display_name })
          
          setFormData(prev => ({
            ...prev,
            address: data.display_name
          }))
        }
      }
    } catch (error) {
      console.log('Reverse geocoding failed:', error)
      // Silently fail - not critical functionality
    }
  }

  // Keep manual inputs in sync when map selection changes
  useEffect(() => {
    if (selectedLocation) {
      setLatInput(selectedLocation.lat.toString())
      setLngInput(selectedLocation.lng.toString())
    }
  }, [selectedLocation])

  const applyCoordsFromInput = () => {
    const lat = parseFloat(latInput)
    const lng = parseFloat(lngInput)
    if (!Number.isFinite(lat) || !Number.isFinite(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      toast.error("Enter valid latitude (-90..90) and longitude (-180..180)")
      return
    }
    const loc = { lat, lng }
    setSelectedLocation(loc)

    // Use Nominatim for reverse geocoding
    reverseGeocode(lat, lng)
  }

  const validateForm = () => {
    if (!formData.adminName || !formData.adminEmail || !formData.password) {
      toast.error("Please fill in all admin details")
      return false
    }

    if (!formData.ngoName || !formData.ngoEmail || !formData.description) {
      toast.error("Please fill in all NGO details")
      return false
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match")
      return false
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long")
      return false
    }

    if (!selectedLocation) {
      toast.error("Please select NGO location on the map")
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.adminEmail) || !emailRegex.test(formData.ngoEmail)) {
      toast.error("Please enter valid email addresses")
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)

    try {
      const response = await fetch("/api/admin/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          admin: {
            name: formData.adminName,
            email: formData.adminEmail,
            password: formData.password
          },
          ngo: {
            name: formData.ngoName,
            email: formData.ngoEmail,
            description: formData.description,
            address: formData.address,
            phone: formData.phone,
            website: formData.website,
            latitude: selectedLocation!.lat,
            longitude: selectedLocation!.lng
          }
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Signup failed")
      }

      toast.success("NGO registration successful! Please sign in.")
      
      // Auto sign in after successful registration
      const result = await signIn("credentials", {
        email: formData.adminEmail,
        password: formData.password,
        redirect: false
      })

      if (result?.ok) {
        router.push("/admin")
      } else {
        // If auto sign-in fails, redirect to login page
        router.push("/auth/admin-login")
      }

    } catch (error) {
      console.error("Signup error:", error)
      toast.error(error instanceof Error ? error.message : "Registration failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Register Your NGO</h1>
          <p className="text-lg text-gray-600">Join our platform to connect with donors and manage donations</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Admin Details */}
          <Card>
            <CardHeader>
              <CardTitle>Admin Details</CardTitle>
              <CardDescription>Information about the NGO administrator</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="adminName">Admin Name *</Label>
                  <Input
                    id="adminName"
                    name="adminName"
                    type="text"
                    value={formData.adminName}
                    onChange={handleInputChange}
                    placeholder="Enter admin full name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="adminEmail">Admin Email *</Label>
                  <Input
                    id="adminEmail"
                    name="adminEmail"
                    type="email"
                    value={formData.adminEmail}
                    onChange={handleInputChange}
                    placeholder="admin@example.com"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Min 6 characters"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm password"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* NGO Details */}
          <Card>
            <CardHeader>
              <CardTitle>NGO Information</CardTitle>
              <CardDescription>Details about your organization</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ngoName">NGO Name *</Label>
                  <Input
                    id="ngoName"
                    name="ngoName"
                    type="text"
                    value={formData.ngoName}
                    onChange={handleInputChange}
                    placeholder="Enter NGO name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ngoEmail">NGO Email *</Label>
                  <Input
                    id="ngoEmail"
                    name="ngoEmail"
                    type="email"
                    value={formData.ngoEmail}
                    onChange={handleInputChange}
                    placeholder="contact@ngo.org"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your NGO's mission and activities..."
                  rows={3}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    name="website"
                    type="url"
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder="https://www.ngo.org"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                NGO Location *
              </CardTitle>
              <CardDescription>
                Click on the map to select your NGO's location. If the map doesn't load, use the coordinate inputs below.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="h-[400px] rounded-lg overflow-hidden border relative">
                  <DynamicMap
                    onMapClick={handleMapClick}
                    selectedLocation={selectedLocation}
                    showNGOs={false}
                  />
                  {/* Fallback message overlay */}
                  <div className="absolute top-2 right-2 bg-blue-50 border border-blue-200 rounded-lg p-2 text-xs text-blue-700 max-w-xs">
                    💡 <strong>Tip:</strong> If the map doesn't load, you can manually enter coordinates below
                  </div>
                </div>

                {/* Manual coordinates input (fallback if map not visible) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="latitude">Latitude</Label>
                    <Input
                      id="latitude"
                      name="latitude"
                      type="number"
                      step="any"
                      placeholder="e.g. 19.0760"
                      value={latInput}
                      onChange={(e) => setLatInput(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="longitude">Longitude</Label>
                    <Input
                      id="longitude"
                      name="longitude"
                      type="number"
                      step="any"
                      placeholder="e.g. 72.8777"
                      value={lngInput}
                      onChange={(e) => setLngInput(e.target.value)}
                    />
                  </div>
                  <div className="flex items-end">
                    <Button type="button" className="w-full bg-blue-600 hover:bg-blue-700" onClick={applyCoordsFromInput}>
                      📍 Set Location
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-gray-500">Tip: If the map doesn’t load, you can still enter coordinates above. The location will be saved using these values.</p>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-2">
                  <div className="text-xs text-blue-700 space-y-1">
                    <p>💡 <strong>How to find coordinates:</strong></p>
                    <p>• Use Google Maps: Right-click → "What's here?" → Copy coordinates</p>
                    <p>• Mumbai: 19.0760, 72.8777 | Delhi: 28.6139, 77.2090 | Bangalore: 12.9716, 77.5946</p>
                  </div>
                </div>

                {selectedLocation && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm font-medium text-green-800">Selected Location:</p>
                    <p className="text-sm text-green-600">
                      Lat: {selectedLocation.lat.toFixed(6)}, Lng: {selectedLocation.lng.toFixed(6)}
                    </p>
                    {selectedLocation.address && (
                      <p className="text-sm text-green-600">{selectedLocation.address}</p>
                    )}
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter or auto-fill from map selection..."
                    rows={2}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex justify-center">
            <Button type="submit" className="w-full md:w-auto px-8" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registering NGO...
                </>
              ) : (
                "Register NGO"
              )}
            </Button>
          </div>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Already have an admin account?{" "}
            <Button
              variant="link"
              className="p-0 h-auto text-blue-600"
              onClick={() => router.push("/auth/admin-login")}
            >
              Sign in here
            </Button>
          </p>
        </div>
      </div>
    </div>
  )
}