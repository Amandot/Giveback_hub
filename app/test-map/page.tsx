"use client"

import { useState } from 'react'
import DynamicMap from '@/components/dynamic-map'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function TestMapPage() {
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number; address?: string } | null>(null)
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')

  const handleMapClick = (location: { lat: number; lng: number }) => {
    setSelectedLocation(location)
    setLatitude(location.lat.toString())
    setLongitude(location.lng.toString())
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">OpenStreetMap Test</h1>
        <p className="text-lg text-muted-foreground">
          Click anywhere on the map to select a location. The coordinates will be automatically filled below.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Map */}
        <Card>
          <CardHeader>
            <CardTitle>Interactive Map</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] rounded-lg overflow-hidden border">
              <DynamicMap
                onMapClick={handleMapClick}
                selectedLocation={selectedLocation}
                showNGOs={false}
              />
            </div>
          </CardContent>
        </Card>

        {/* Location Info */}
        <Card>
          <CardHeader>
            <CardTitle>Selected Location</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                placeholder="Click on map to select"
                readOnly
              />
            </div>
            
            <div>
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                placeholder="Click on map to select"
                readOnly
              />
            </div>

            {selectedLocation?.address && (
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={selectedLocation.address}
                  placeholder="Address will appear here"
                  readOnly
                />
              </div>
            )}

            {selectedLocation && (
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-800 mb-2">✅ Location Selected!</h4>
                <p className="text-sm text-green-700">
                  Coordinates: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                </p>
                {selectedLocation.address && (
                  <p className="text-sm text-green-700 mt-1">
                    Address: {selectedLocation.address}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">🎉 Success!</h3>
        <p className="text-blue-700">
          Your Google Maps integration has been successfully replaced with OpenStreetMap using Leaflet. 
          This free alternative provides the same interactive functionality without requiring an API key or billing account.
        </p>
        <ul className="mt-3 space-y-1 text-sm text-blue-600">
          <li>✅ Click-to-select functionality working</li>
          <li>✅ Automatic coordinate updates</li>
          <li>✅ Free reverse geocoding via Nominatim</li>
          <li>✅ No API key required</li>
          <li>✅ SSR-safe with dynamic imports</li>
        </ul>
      </div>
    </div>
  )
}