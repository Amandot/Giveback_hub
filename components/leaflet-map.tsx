"use client"

import { useEffect, useRef, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { MapPin, Heart, Users, Phone, Mail, Target } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface NGO {
  id: number
  name: string
  description: string
  category: string
  location: string
  coordinates: { lat: number; lng: number }
  distance: string
  beneficiaries: string
  contact: {
    phone: string
    email: string
  }
  urgentNeeds: string[]
  image: string
}

interface LeafletMapProps {
  ngos: NGO[]
  selectedNGO: NGO | null
  onNGOSelect: (ngo: NGO) => void
}

declare global {
  interface Window {
    L: any
  }
}

export default function LeafletMap({ ngos, selectedNGO, onNGOSelect }: LeafletMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<any>(null)
  const [markers, setMarkers] = useState<any[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [showQuickDonate, setShowQuickDonate] = useState(false)
  const [quickDonateNGO, setQuickDonateNGO] = useState<NGO | null>(null)
  const [selectedDonationAmount, setSelectedDonationAmount] = useState<number | null>(null)

  useEffect(() => {
    if (!window.L) {
      const cssLink = document.createElement("link")
      cssLink.rel = "stylesheet"
      cssLink.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      cssLink.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
      cssLink.crossOrigin = ""
      document.head.appendChild(cssLink)

      const script = document.createElement("script")
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
      script.integrity = "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
      script.crossOrigin = ""
      script.onload = () => {
        setIsLoaded(true)
      }
      document.head.appendChild(script)
    } else {
      setIsLoaded(true)
    }
  }, [])

  useEffect(() => {
    if (isLoaded && mapRef.current && !map && window.L) {
      const mumbaiCenter = [19.076, 72.8777] as [number, number]

      const newMap = window.L.map(mapRef.current, {
        center: mumbaiCenter,
        zoom: 12,
        zoomControl: true,
      })

      window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(newMap)

      setMap(newMap)
    }
  }, [isLoaded, map])

  useEffect(() => {
    if (map && ngos.length > 0 && window.L) {
      markers.forEach((marker) => map.removeLayer(marker))

      const createCustomIcon = (isSelected: boolean) => {
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
              transition: all 0.2s ease;
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

      const newMarkers = ngos.map((ngo) => {
        const marker = window.L.marker([ngo.coordinates.lat, ngo.coordinates.lng], {
          icon: createCustomIcon(false),
        }).addTo(map)

        const popupContent = `
          <div style="max-width: 280px; padding: 12px;">
            <h3 style="color: #059669; font-weight: 600; font-size: 18px; margin: 0 0 8px 0;">${ngo.name}</h3>
            <p style="color: #666; font-size: 14px; margin: 0 0 12px 0; line-height: 1.4;">${ngo.description}</p>
            
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px; font-size: 12px;">
              <span style="background: #f0fdf4; color: #059669; padding: 4px 8px; border-radius: 4px; font-weight: 500;">${ngo.category}</span>
              <span style="color: #666;">${ngo.distance}</span>
            </div>
            
            <div style="display: flex; align-items: center; gap: 4px; color: #666; font-size: 12px; margin-bottom: 12px;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A2.996 2.996 0 0 0 16.5 6.5h-1c-.83 0-1.5.67-1.5 1.5S11 9.17 11 10s.67 1.5 1.5 1.5H16l1.8 5.4L16 18h4zM12.5 11.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S11 9.17 11 10s.67 1.5 1.5 1.5zM5.5 6c1.11 0 2-.89 2-2s-.89-2-2-2-2 .89-2 2zm2 16v-6H10l-2.54-7.63A2.996 2.996 0 0 0 4 6.5H3c-.83 0-1.5.67-1.5 1.5S2.17 9.5 3 9.5h.5L5.8 15 4 18h3.5z"/>
              </svg>
              ${ngo.beneficiaries}
            </div>

            <div style="margin-bottom: 12px;">
              <div style="font-size: 12px; font-weight: 600; color: #059669; margin-bottom: 4px;">Urgent Needs:</div>
              <div style="display: flex; flex-wrap: gap: 4px;">
                ${ngo.urgentNeeds.map((need) => `<span style="background: #fef3c7; color: #d97706; padding: 2px 6px; border-radius: 3px; font-size: 10px;">${need}</span>`).join("")}
              </div>
            </div>

            <div style="display: flex; gap: 6px;">
              <button 
                onclick="window.quickDonateFromMap && window.quickDonateFromMap(${ngo.id})" 
                style="
                  flex: 1;
                  background: #059669; 
                  color: white; 
                  border: none; 
                  padding: 8px 12px; 
                  border-radius: 6px; 
                  font-size: 13px; 
                  font-weight: 500;
                  cursor: pointer;
                  transition: background-color 0.2s;
                "
                onmouseover="this.style.backgroundColor='#047857'"
                onmouseout="this.style.backgroundColor='#059669'"
              >
                💝 Quick Donate
              </button>
              <button 
                onclick="window.selectNGOFromMap && window.selectNGOFromMap(${ngo.id})" 
                style="
                  flex: 1;
                  background: #f3f4f6; 
                  color: #374151; 
                  border: 1px solid #d1d5db; 
                  padding: 8px 12px; 
                  border-radius: 6px; 
                  font-size: 13px; 
                  font-weight: 500;
                  cursor: pointer;
                  transition: all 0.2s;
                "
                onmouseover="this.style.backgroundColor='#e5e7eb'"
                onmouseout="this.style.backgroundColor='#f3f4f6'"
              >
                📋 View Details
              </button>
            </div>
          </div>
        `

        marker.bindPopup(popupContent, {
          maxWidth: 300,
          className: "custom-popup",
        })

        marker.on("click", () => {
          onNGOSelect(ngo)
        })

        marker.ngoData = ngo
        return marker
      })

      setMarkers(newMarkers)

      window.selectNGOFromMap = (ngoId: number) => {
        const ngo = ngos.find((n) => n.id === ngoId)
        if (ngo) {
          onNGOSelect(ngo)
        }
      }

      window.quickDonateFromMap = (ngoId: number) => {
        const ngo = ngos.find((n) => n.id === ngoId)
        if (ngo) {
          setQuickDonateNGO(ngo)
          setShowQuickDonate(true)
        }
      }
    }
  }, [map, ngos, onNGOSelect])

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
              transition: all 0.2s ease;
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

  if (!isLoaded) {
    return (
      <div className="h-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto animate-pulse">
            <MapPin className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-primary">Loading Map...</h3>
            <p className="text-muted-foreground">Initializing Interactive Map</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-full">
      <div ref={mapRef} className="w-full h-full rounded-lg" />

      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg z-[1000]">
        <div className="flex items-center gap-2 text-sm">
          <div className="w-3 h-3 bg-primary rounded-full"></div>
          <span className="font-medium">NGO Locations</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">{ngos.length} NGOs in Mumbai</p>
        <p className="text-xs text-primary mt-1 font-medium">Click markers to donate!</p>
      </div>

      {selectedNGO && (
        <Card className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm shadow-lg animate-fade-in z-[1000]">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-semibold text-primary">{selectedNGO.name}</h4>
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                  <MapPin className="h-3 w-3" />
                  {selectedNGO.location} • {selectedNGO.distance}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary" className="text-xs">
                    {selectedNGO.category}
                  </Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {selectedNGO.beneficiaries}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 ml-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setQuickDonateNGO(selectedNGO)
                    setShowQuickDonate(true)
                  }}
                >
                  <Heart className="h-3 w-3 mr-1" />
                  Quick Donate
                </Button>
                <Button asChild size="sm">
                  <Link href={`/donate?ngo=${selectedNGO.id}`}>Full Details</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Dialog open={showQuickDonate} onOpenChange={setShowQuickDonate}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              Quick Donate to {quickDonateNGO?.name}
            </DialogTitle>
          </DialogHeader>

          {quickDonateNGO && (
            <div className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">{quickDonateNGO.category}</Badge>
                  <span className="text-sm text-muted-foreground">{quickDonateNGO.location}</span>
                </div>
                <p className="text-sm text-muted-foreground">{quickDonateNGO.description}</p>
              </div>

              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Urgent Needs
                </h4>
                <div className="flex flex-wrap gap-2">
                  {quickDonateNGO.urgentNeeds.map((need) => (
                    <Badge key={need} variant="outline" className="text-xs">
                      {need}
                    </Badge>
                  ))}
                </div>
              </div>

              {!selectedDonationAmount ? (
                <div className="grid grid-cols-2 gap-3">
                  <Button className="h-12 flex-col gap-1" onClick={() => setSelectedDonationAmount(500)}>
                    <span className="font-bold">₹500</span>
                    <span className="text-xs opacity-90">Basic Support</span>
                  </Button>
                  <Button className="h-12 flex-col gap-1" onClick={() => setSelectedDonationAmount(1000)}>
                    <span className="font-bold">₹1,000</span>
                    <span className="text-xs opacity-90">Standard Support</span>
                  </Button>
                  <Button className="h-12 flex-col gap-1" onClick={() => setSelectedDonationAmount(2500)}>
                    <span className="font-bold">₹2,500</span>
                    <span className="text-xs opacity-90">Premium Support</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-12 flex-col gap-1 bg-transparent"
                    onClick={() => {
                      window.open(`/donate?ngo=${quickDonateNGO.id}`, "_blank")
                      setShowQuickDonate(false)
                    }}
                  >
                    <span className="font-bold">Custom</span>
                    <span className="text-xs opacity-90">Choose Amount</span>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-center p-4 bg-primary/10 rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      ₹{selectedDonationAmount.toLocaleString("en-IN")}
                    </div>
                    <div className="text-sm text-muted-foreground">Donation Amount</div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="donor-name">Full Name *</Label>
                      <Input id="donor-name" placeholder="Enter your full name" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="donor-email">Email *</Label>
                      <Input id="donor-email" type="email" placeholder="Enter your email" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="donor-phone">Phone *</Label>
                      <Input id="donor-phone" type="tel" placeholder="Enter your phone number" className="mt-1" />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setSelectedDonationAmount(null)} className="flex-1">
                      Back
                    </Button>
                    <Button
                      onClick={() => {
                        alert(
                          `Thank you for your ₹${selectedDonationAmount} donation to ${quickDonateNGO.name}! This is a demo - no payment was processed.`,
                        )
                        setShowQuickDonate(false)
                        setSelectedDonationAmount(null)
                      }}
                      className="flex-1"
                    >
                      Donate Now
                    </Button>
                  </div>
                </div>
              )}

              <div className="text-center pt-2">
                <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    {quickDonateNGO.contact.phone}
                  </div>
                  <div className="flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    Contact
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
