'use client'

import { useEffect, useRef, useState } from 'react'
import { Users, MapPin } from 'lucide-react'

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

interface UserMapProps {
  users: User[]
}

export default function UserMap({ users }: UserMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [mapInstance, setMapInstance] = useState<any>(null)

  // Mock data for demonstration - in real app, this would come from user profiles
  const generateMockLocations = () => {
    const cities = [
      { name: 'New York', lat: 40.7128, lng: -74.0060, country: 'USA' },
      { name: 'London', lat: 51.5074, lng: -0.1278, country: 'UK' },
      { name: 'Tokyo', lat: 35.6762, lng: 139.6503, country: 'Japan' },
      { name: 'Sydney', lat: -33.8688, lng: 151.2093, country: 'Australia' },
      { name: 'Mumbai', lat: 19.0760, lng: 72.8777, country: 'India' },
      { name: 'São Paulo', lat: -23.5505, lng: -46.6333, country: 'Brazil' },
      { name: 'Cairo', lat: 30.0444, lng: 31.2357, country: 'Egypt' },
      { name: 'Cape Town', lat: -33.9249, lng: 18.4241, country: 'South Africa' },
      { name: 'Berlin', lat: 52.5200, lng: 13.4050, country: 'Germany' },
      { name: 'Toronto', lat: 43.6532, lng: -79.3832, country: 'Canada' }
    ]

    return users.map((user, index) => {
      const city = cities[index % cities.length]
      return {
        ...user,
        location: {
          lat: city.lat + (Math.random() - 0.5) * 0.2, // Add some random offset
          lng: city.lng + (Math.random() - 0.5) * 0.2,
          city: city.name,
          country: city.country
        }
      }
    })
  }

  const usersWithLocations = generateMockLocations()

  // Simple fallback map when Google Maps is not available
  const renderFallbackMap = () => {
    const locationStats = usersWithLocations.reduce((acc, user) => {
      const country = user.location?.country || 'Unknown'
      acc[country] = (acc[country] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return (
      <div className="h-96 bg-gradient-to-b from-blue-50 to-blue-100 rounded-lg p-6 flex flex-col items-center justify-center">
        <MapPin className="h-12 w-12 text-blue-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-4">User Distribution</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-2xl">
          {Object.entries(locationStats).map(([country, count]) => (
            <div key={country} className="bg-white rounded-lg p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-blue-600">{count}</div>
              <div className="text-sm text-gray-600">{country}</div>
            </div>
          ))}
        </div>
        <div className="mt-6 text-center">
          <div className="flex items-center justify-center text-sm text-gray-500 mb-2">
            <Users className="h-4 w-4 mr-1" />
            Total Users: {users.length}
          </div>
          <p className="text-xs text-gray-400">
            Geographic distribution of registered users
          </p>
        </div>
      </div>
    )
  }

  // Try to load Google Maps
  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google && window.google.maps) {
        setIsLoaded(true)
        return
      }

      // Check if script already exists
      if (document.querySelector('script[src*="maps.googleapis.com"]')) {
        return
      }

      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}&libraries=geometry`
      script.async = true
      script.defer = true
      
      script.onload = () => {
        setIsLoaded(true)
      }
      
      script.onerror = () => {
        console.warn('Failed to load Google Maps')
        setIsLoaded(false)
      }

      document.head.appendChild(script)
    }

    loadGoogleMaps()
  }, [])

  // Initialize map when Google Maps is loaded
  useEffect(() => {
    if (isLoaded && mapRef.current && window.google && !mapInstance) {
      const map = new window.google.maps.Map(mapRef.current, {
        zoom: 2,
        center: { lat: 20, lng: 0 },
        styles: [
          {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{ color: '#e9e9e9' }, { lightness: 17 }]
          },
          {
            featureType: 'landscape',
            elementType: 'geometry',
            stylers: [{ color: '#f5f5f5' }, { lightness: 20 }]
          }
        ]
      })

      // Add markers for each user
      usersWithLocations.forEach((user) => {
        if (user.location) {
          const marker = new window.google.maps.Marker({
            position: { lat: user.location.lat, lng: user.location.lng },
            map: map,
            title: user.name || user.email,
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: user.role === 'ADMIN' ? '#ef4444' : '#3b82f6',
              fillOpacity: 0.8,
              strokeColor: '#ffffff',
              strokeWeight: 2
            }
          })

          const infoWindow = new window.google.maps.InfoWindow({
            content: `
              <div class="p-2">
                <h4 class="font-semibold">${user.name || 'Anonymous User'}</h4>
                <p class="text-sm text-gray-600">${user.email}</p>
                <p class="text-xs text-gray-500">${user.location.city}, ${user.location.country}</p>
                <p class="text-xs"><span class="inline-block w-2 h-2 rounded-full ${user.role === 'ADMIN' ? 'bg-red-500' : 'bg-blue-500'} mr-1"></span>${user.role}</p>
              </div>
            `
          })

          marker.addListener('click', () => {
            infoWindow.open(map, marker)
          })
        }
      })

      setMapInstance(map)
    }
  }, [isLoaded, usersWithLocations, mapInstance])

  // If Google Maps failed to load or no API key, show fallback
  if (!isLoaded && users.length > 0) {
    return renderFallbackMap()
  }

  if (users.length === 0) {
    return (
      <div className="h-96 bg-gray-50 rounded-lg flex flex-col items-center justify-center">
        <Users className="h-12 w-12 text-gray-400 mb-4" />
        <p className="text-gray-500">No user data available</p>
      </div>
    )
  }

  return (
    <div className="relative">
      <div ref={mapRef} className="h-96 w-full rounded-lg" />
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-md p-3">
        <h4 className="text-sm font-semibold mb-2">Legend</h4>
        <div className="flex items-center mb-1">
          <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
          <span className="text-xs">Donors</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
          <span className="text-xs">Admins</span>
        </div>
      </div>

      {/* Stats overlay */}
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-md p-3">
        <div className="text-sm font-semibold">Total Users</div>
        <div className="text-2xl font-bold text-blue-600">{users.length}</div>
      </div>
    </div>
  )
}