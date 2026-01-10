"use client"

import dynamic from 'next/dynamic'
import { MapPin } from 'lucide-react'

// Dynamic import of OpenStreetMap component with SSR disabled
const OpenStreetMap = dynamic(() => import('./openstreet-map'), {
  ssr: false,
  loading: () => (
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
})

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

interface DynamicMapProps {
  // For displaying NGOs
  ngos?: NGO[]
  selectedNGO?: NGO | null
  onNGOSelect?: (ngo: NGO) => void
  
  // For location selection (admin signup)
  onMapClick?: (location: { lat: number; lng: number }) => void
  selectedLocation?: { lat: number; lng: number; address?: string } | null
  showNGOs?: boolean
}

export default function DynamicMap(props: DynamicMapProps) {
  return <OpenStreetMap {...props} />
}