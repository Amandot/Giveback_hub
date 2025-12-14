"use client"

import { useEffect, useRef, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Heart, Users, Phone, Mail, Globe } from "lucide-react"
import Link from "next/link"

interface NGO {
  id: string
  name: string
  description: string
  email: string
  address: string | null
  phone: string | null
  website: string | null
  latitude: number
  longitude: number
  city: string
  createdAt: string
}

interface GoogleMapProps {
  // For displaying NGOs
  ngos?: NGO[]
  selectedNGO?: NGO | null
  onNGOSelect?: (ngo: NGO) => void
  
  // For location selection (admin signup)
  onMapClick?: (location: { lat: number; lng: number }) => void
  selectedLocation?: { lat: number; lng: number; address?: string } | null
  showNGOs?: boolean
}

declare global {
  interface Window {
    google: any
    initMap: () => void
    selectNGO: (ngoId: string) => void
  }
}

export default function GoogleMap({ 
  ngos = [], 
  selectedNGO = null, 
  onNGOSelect,
  onMapClick,
  selectedLocation,
  showNGOs = true
}: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<any>(null)
  const [markers, setMarkers] = useState<any[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [loadedNGOs, setLoadedNGOs] = useState<NGO[]>([])
  const [selectedMarker, setSelectedMarker] = useState<any>(null)
  const [loadError, setLoadError] = useState(false)

  // Fetch NGOs if not provided and showNGOs is true
  useEffect(() => {
    if (showNGOs && ngos.length === 0) {
      fetch('/api/ngos')
        .then(res => res.json())
        .then(data => {
          setLoadedNGOs(data.ngos || [])
        })
        .catch(err => {
          console.error('Failed to load NGOs:', err)
        })
    } else {
      setLoadedNGOs(ngos)
    }
  }, [ngos, showNGOs])

  useEffect(() => {
    // Load Google Maps script
    if (!window.google) {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
      
      if (!apiKey || apiKey === 'YOUR_API_KEY') {
        console.warn('Google Maps API key not configured. Map functionality will be limited.')
        // Still try to load with a placeholder key for development
      }

      const script = document.createElement("script")
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey || 'AIzaSyBHLett8djBo62dDXj0EjCpF8OK-1iSEhs'}&callback=initMap`
      script.async = true
      script.defer = true

      window.initMap = () => {
        console.log('✅ Google Maps API loaded successfully')
        setIsLoaded(true)
      }

      script.onerror = () => {
        console.error('❌ Failed to load Google Maps API - Check your API key and network connection')
        setLoadError(true)
        setIsLoaded(false)
      }

      document.head.appendChild(script)
    } else {
      setIsLoaded(true)
    }
  }, [])

  useEffect(() => {
    if (isLoaded && mapRef.current && !map) {
      // Initialize map centered on Mumbai
      const mumbaiCenter = { lat: 19.076, lng: 72.8777 }

      const newMap = new window.google.maps.Map(mapRef.current, {
        zoom: 12,
        center: mumbaiCenter,
        styles: [
          {
            featureType: "all",
            elementType: "geometry.fill",
            stylers: [{ color: "#fef7f0" }],
          },
          {
            featureType: "water",
            elementType: "geometry.fill",
            stylers: [{ color: "#e8f4f8" }],
          },
          {
            featureType: "road",
            elementType: "geometry.fill",
            stylers: [{ color: "#ffffff" }],
          },
          {
            featureType: "poi",
            elementType: "geometry.fill",
            stylers: [{ color: "#f0f9ff" }],
          },
        ],
      })

      // Add click listener for location selection
      if (onMapClick) {
        newMap.addListener('click', (event: any) => {
          const lat = event.latLng.lat()
          const lng = event.latLng.lng()
          onMapClick({ lat, lng })
        })
      }

      setMap(newMap)

      // Ensure map renders after container layout settles
      setTimeout(() => {
        try {
          window.google.maps.event.trigger(newMap, 'resize')
          newMap.setCenter(mumbaiCenter)
        } catch {}
      }, 0)
    }
  }, [isLoaded, map, onMapClick])

  // Handle NGO markers
  useEffect(() => {
    if (map && showNGOs && loadedNGOs.length > 0) {
      // Clear existing markers
      markers.forEach((marker) => marker.setMap(null))

      // Create new markers
      const newMarkers = loadedNGOs.map((ngo) => {
        const marker = new window.google.maps.Marker({
          position: { lat: Number(ngo.latitude), lng: Number(ngo.longitude) },
          map: map,
          title: ngo.name,
          icon: {
            url:
              "data:image/svg+xml;charset=UTF-8," +
              encodeURIComponent(`
              <svg width=\"32\" height=\"32\" viewBox=\"0 0 32 32\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">
                <circle cx=\"16\" cy=\"16\" r=\"12\" fill=\"#059669\" stroke=\"#ffffff\" stroke-width=\"2\"/>
                <path d=\"M16 8L16 24M8 16L24 16\" stroke=\"#ffffff\" stroke-width=\"2\" stroke-linecap=\"round\"/>
              </svg>
            `),
            scaledSize: new window.google.maps.Size(32, 32),
            anchor: new window.google.maps.Point(16, 16),
          },
        })

        // Create info window
        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div class=\"p-3 max-w-sm\">
              <h3 class=\"font-semibold text-lg text-emerald-700 mb-2\">${ngo.name}</h3>
              <p class=\"text-sm text-gray-600 mb-2\">${ngo.description ?? ''}</p>
              ${ngo.address ? `<p class=\"text-xs text-gray-500 mb-2 flex items-center gap-1\"><span>📍</span>${ngo.address}</p>` : ''}
              <div class=\"space-y-1 mb-3 text-xs\">
                ${ngo.email ? `<div class=\"flex items-center gap-2 text-gray-600\"><span>✉️</span>${ngo.email}</div>` : ''}
                ${ngo.phone ? `<div class=\"flex items-center gap-2 text-gray-600\"><span>📞</span>${ngo.phone}</div>` : ''}
                ${ngo.website ? `<div class=\"flex items-center gap-2 text-gray-600\"><span>🌐</span><a href=\"${ngo.website}\" target=\"_blank\" class=\"text-blue-600 hover:underline\">Website</a></div>` : ''}
              </div>
              <button 
                onclick=\"window.selectNGO('${ngo.id}')\" 
                class=\"w-full bg-emerald-600 text-white px-3 py-2 rounded text-sm hover:bg-emerald-700 transition-colors\"
              >
                Select for Donation
              </button>
            </div>
          `,
        })

        marker.addListener("click", () => {
          // Close all other info windows
          newMarkers.forEach((m) => m.infoWindow?.close())
          infoWindow.open(map, marker)
          if (onNGOSelect) {
            onNGOSelect(ngo)
          }
        })

        marker.infoWindow = infoWindow
        return marker
      })

      setMarkers(newMarkers)

      // Fit map to markers so they are visible
      try {
        const bounds = new window.google.maps.LatLngBounds()
        loadedNGOs.forEach((ngo) => bounds.extend({ lat: Number(ngo.latitude), lng: Number(ngo.longitude) }))
        if (loadedNGOs.length === 1) {
          map.setCenter({ lat: Number(loadedNGOs[0].latitude), lng: Number(loadedNGOs[0].longitude) })
          map.setZoom(14)
        } else {
          map.fitBounds(bounds)
        }
      } catch {}

      // Add global function to select NGO from info window
      window.selectNGO = (ngoId: string) => {
        const ngo = loadedNGOs.find((n) => n.id === ngoId)
        if (ngo && onNGOSelect) {
          onNGOSelect(ngo)
        }
      }
    }
  }, [map, loadedNGOs, onNGOSelect, showNGOs])

  // Handle selected location marker (for admin signup)
  useEffect(() => {
    if (map && selectedLocation && onMapClick) {
      // Clear existing selected marker
      if (selectedMarker) {
        selectedMarker.setMap(null)
      }

      // Create new selected location marker
      const marker = new window.google.maps.Marker({
        position: { lat: selectedLocation.lat, lng: selectedLocation.lng },
        map: map,
        title: "Selected Location",
        icon: {
          url:
            "data:image/svg+xml;charset=UTF-8," +
            encodeURIComponent(`
            <svg width=\"40\" height=\"40\" viewBox=\"0 0 40 40\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">
              <circle cx=\"20\" cy=\"20\" r=\"16\" fill=\"#dc2626\" stroke=\"#ffffff\" strokeWidth=\"3\"/>
              <path d=\"M20 10L20 30M10 20L30 20\" stroke=\"#ffffff\" strokeWidth=\"2\" strokeLinecap=\"round\"/>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(40, 40),
          anchor: new window.google.maps.Point(20, 20),
        },
      })

      // Center and zoom map to the selected location
      try {
        map.panTo({ lat: selectedLocation.lat, lng: selectedLocation.lng })
        const currentZoom = map.getZoom?.() ?? 12
        if (currentZoom < 14) {
          map.setZoom?.(14)
        }
      } catch (e) {
        // no-op
      }

      setSelectedMarker(marker)
    }
  }, [map, selectedLocation, onMapClick, selectedMarker])

  // Highlight selected NGO marker
  useEffect(() => {
    if (selectedNGO && markers.length > 0) {
      markers.forEach((marker) => {
        const isSelected = marker.getTitle() === selectedNGO.name
        marker.setIcon({
          url:
            "data:image/svg+xml;charset=UTF-8," +
            encodeURIComponent(`
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="16" fill="${isSelected ? "#dc2626" : "#059669"}" stroke="#ffffff" strokeWidth="3"/>
              <path d="M20 8L20 32M8 20L32 20" stroke="#ffffff" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(isSelected ? 40 : 32, isSelected ? 40 : 32),
          anchor: new window.google.maps.Point(isSelected ? 20 : 16, isSelected ? 20 : 16),
        })
      })
    }
  }, [selectedNGO, markers])

  if (loadError) {
    return (
      <div className="h-full min-h-[360px] bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center border-2 border-dashed border-yellow-300 rounded-lg">
        <div className="text-center space-y-4 p-6">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
            <MapPin className="h-8 w-8 text-yellow-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-yellow-800">Map Unavailable</h3>
            <p className="text-yellow-700 text-sm">Google Maps couldn't load. Please use the coordinate inputs below.</p>
            <p className="text-yellow-600 text-xs mt-2">You can still register by entering latitude and longitude manually.</p>
          </div>
        </div>
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <div className="h-full min-h-[360px] bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto animate-pulse">
            <MapPin className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-primary">Loading Map...</h3>
            <p className="text-muted-foreground">Initializing Google Maps</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-full min-h-[360px]">
      <div ref={mapRef} className="absolute inset-0 w-full h-full rounded-lg" />

      {/* Map Controls */}
      {showNGOs && (
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 bg-emerald-600 rounded-full"></div>
            <span className="font-medium">NGO Locations</span>
          </div>
          <p className="text-xs text-gray-600 mt-1">{loadedNGOs.length} NGOs in Mumbai</p>
        </div>
      )}

      {/* Location Selection Instructions */}
      {onMapClick && !showNGOs && (
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-blue-600" />
            <span className="font-medium">Click to select location</span>
          </div>
          <p className="text-xs text-gray-600 mt-1">Choose your NGO's location</p>
        </div>
      )}

      {/* Selected NGO Quick Info */}
      {selectedNGO && showNGOs && (
        <Card className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-semibold text-emerald-700">{selectedNGO.name}</h4>
                <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                  <MapPin className="h-3 w-3" />
                  {selectedNGO.city}
                  {selectedNGO.address && ` • ${selectedNGO.address}`}
                </p>
                <p className="text-sm text-gray-600 mt-1">{selectedNGO.description}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                  {selectedNGO.email && (
                    <span className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {selectedNGO.email}
                    </span>
                  )}
                  {selectedNGO.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {selectedNGO.phone}
                    </span>
                  )}
                </div>
              </div>
              <Button asChild size="sm" className="ml-4 bg-emerald-600 hover:bg-emerald-700">
                <Link href={`/donate?ngo=${selectedNGO.id}`}>
                  <Heart className="h-3 w-3 mr-1" />
                  Donate
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
