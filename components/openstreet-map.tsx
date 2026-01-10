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

interface OpenStreetMapProps {
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
    L: any
    selectNGO: (ngoId: string) => void
  }
}

export default function OpenStreetMap({ 
  ngos = [], 
  selectedNGO = null, 
  onNGOSelect,
  onMapClick,
  selectedLocation,
  showNGOs = true
}: OpenStreetMapProps) {
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

  // Load Leaflet CSS and JS
  useEffect(() => {
    if (!window.L) {
      // Load Leaflet CSS
      const cssLink = document.createElement("link")
      cssLink.rel = "stylesheet"
      cssLink.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      cssLink.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
      cssLink.crossOrigin = ""
      document.head.appendChild(cssLink)

      // Load Leaflet JS
      const script = document.createElement("script")
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
      script.integrity = "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
      script.crossOrigin = ""
      
      script.onload = () => {
        console.log('✅ Leaflet loaded successfully')
        
        // Fix default markers (this is crucial for Leaflet to work properly)
        if (window.L) {
          delete (window.L.Icon.Default.prototype as any)._getIconUrl
          window.L.Icon.Default.mergeOptions({
            iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
            iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
          })
        }
        
        setIsLoaded(true)
      }

      script.onerror = () => {
        console.error('❌ Failed to load Leaflet')
        setLoadError(true)
        setIsLoaded(false)
      }

      document.head.appendChild(script)
    } else {
      setIsLoaded(true)
    }
  }, [])

  // Initialize map
  useEffect(() => {
    if (isLoaded && mapRef.current && !map && window.L) {
      // Initialize map centered on Mumbai
      const mumbaiCenter = [19.076, 72.8777] as [number, number]

      const newMap = window.L.map(mapRef.current, {
        center: mumbaiCenter,
        zoom: 12,
        zoomControl: true,
      })

      // Add OpenStreetMap tile layer
      window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(newMap)

      // Add click listener for location selection
      if (onMapClick) {
        newMap.on('click', (event: any) => {
          const lat = event.latlng.lat
          const lng = event.latlng.lng
          onMapClick({ lat, lng })
        })
      }

      setMap(newMap)

      // Ensure map renders after container layout settles
      setTimeout(() => {
        try {
          newMap.invalidateSize()
        } catch {}
      }, 100)
    }
  }, [isLoaded, map, onMapClick])

  // Handle NGO markers
  useEffect(() => {
    if (map && showNGOs && loadedNGOs.length > 0 && window.L) {
      // Clear existing markers
      markers.forEach((marker) => map.removeLayer(marker))

      // Create custom icon for NGOs
      const createNGOIcon = (isSelected: boolean) => {
        const color = isSelected ? "#dc2626" : "#059669"
        const size = isSelected ? 40 : 32

        return window.L.divIcon({
          html: `
            <div style="
              width: ${size}px; 
              height: ${size}px; 
              background-color: ${color}; 
              border: 3px solid white; 
              border-radius: 50%; 
              display: flex; 
              align-items: center; 
              justify-content: center;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
              cursor: pointer;
            ">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
            </div>
          `,
          className: "custom-div-icon",
          iconSize: [size, size],
          iconAnchor: [size / 2, size / 2],
        })
      }

      // Create new markers
      const newMarkers = loadedNGOs.map((ngo) => {
        const marker = window.L.marker([Number(ngo.latitude), Number(ngo.longitude)], {
          icon: createNGOIcon(false)
        }).addTo(map)

        // Create popup content
        const popupContent = `
          <div class="p-3 max-w-sm">
            <h3 class="font-semibold text-lg text-emerald-700 mb-2">${ngo.name}</h3>
            <p class="text-sm text-gray-600 mb-2">${ngo.description ?? ''}</p>
            ${ngo.address ? `<p class="text-xs text-gray-500 mb-2 flex items-center gap-1"><span>📍</span>${ngo.address}</p>` : ''}
            <div class="space-y-1 mb-3 text-xs">
              ${ngo.email ? `<div class="flex items-center gap-2 text-gray-600"><span>✉️</span>${ngo.email}</div>` : ''}
              ${ngo.phone ? `<div class="flex items-center gap-2 text-gray-600"><span>📞</span>${ngo.phone}</div>` : ''}
              ${ngo.website ? `<div class="flex items-center gap-2 text-gray-600"><span>🌐</span><a href="${ngo.website}" target="_blank" class="text-blue-600 hover:underline">Website</a></div>` : ''}
            </div>
            <button 
              onclick="window.selectNGO('${ngo.id}')" 
              class="w-full bg-emerald-600 text-white px-3 py-2 rounded text-sm hover:bg-emerald-700 transition-colors"
            >
              Select for Donation
            </button>
          </div>
        `

        marker.bindPopup(popupContent, {
          maxWidth: 300,
          className: "custom-popup",
        })

        marker.on("click", () => {
          if (onNGOSelect) {
            onNGOSelect(ngo)
          }
        })

        marker.ngoData = ngo
        return marker
      })

      setMarkers(newMarkers)

      // Fit map to markers so they are visible
      try {
        if (loadedNGOs.length === 1) {
          map.setView([Number(loadedNGOs[0].latitude), Number(loadedNGOs[0].longitude)], 14)
        } else if (loadedNGOs.length > 1) {
          const group = new window.L.featureGroup(newMarkers)
          map.fitBounds(group.getBounds().pad(0.1))
        }
      } catch {}

      // Add global function to select NGO from popup
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
    if (map && selectedLocation && onMapClick && window.L) {
      // Clear existing selected marker
      if (selectedMarker) {
        map.removeLayer(selectedMarker)
      }

      // Create custom icon for selected location
      const selectedIcon = window.L.divIcon({
        html: `
          <div style="
            width: 40px; 
            height: 40px; 
            background-color: #dc2626; 
            border: 3px solid white; 
            border-radius: 50%; 
            display: flex; 
            align-items: center; 
            justify-content: center;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            cursor: pointer;
          ">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
          </div>
        `,
        className: "custom-div-icon",
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      })

      // Create new selected location marker
      const marker = window.L.marker([selectedLocation.lat, selectedLocation.lng], {
        icon: selectedIcon
      }).addTo(map)

      // Center and zoom map to the selected location
      try {
        map.setView([selectedLocation.lat, selectedLocation.lng], Math.max(map.getZoom(), 14))
      } catch (e) {
        // no-op
      }

      setSelectedMarker(marker)
    }
  }, [map, selectedLocation, onMapClick, selectedMarker])

  // Highlight selected NGO marker
  useEffect(() => {
    if (selectedNGO && markers.length > 0 && window.L) {
      markers.forEach((marker) => {
        const isSelected = marker.ngoData?.id === selectedNGO.id
        const color = isSelected ? "#dc2626" : "#059669"
        const size = isSelected ? 40 : 32

        const newIcon = window.L.divIcon({
          html: `
            <div style="
              width: ${size}px; 
              height: ${size}px; 
              background-color: ${color}; 
              border: 3px solid white; 
              border-radius: 50%; 
              display: flex; 
              align-items: center; 
              justify-content: center;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
              cursor: pointer;
            ">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
            </div>
          `,
          className: "custom-div-icon",
          iconSize: [size, size],
          iconAnchor: [size / 2, size / 2],
        })

        marker.setIcon(newIcon)
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
            <p className="text-yellow-700 text-sm">OpenStreetMap couldn't load. Please use the coordinate inputs below.</p>
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
            <p className="text-muted-foreground">Initializing OpenStreetMap</p>
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
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg z-[1000]">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 bg-emerald-600 rounded-full"></div>
            <span className="font-medium">NGO Locations</span>
          </div>
          <p className="text-xs text-gray-600 mt-1">{loadedNGOs.length} NGOs in Mumbai</p>
        </div>
      )}

      {/* Location Selection Instructions */}
      {onMapClick && !showNGOs && (
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg z-[1000]">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-blue-600" />
            <span className="font-medium">Click to select location</span>
          </div>
          <p className="text-xs text-gray-600 mt-1">Choose your NGO's location</p>
        </div>
      )}

      {/* Selected NGO Quick Info */}
      {selectedNGO && showNGOs && (
        <Card className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm shadow-lg z-[1000]">
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