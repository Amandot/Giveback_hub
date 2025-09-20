"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Heart, Users, Target, Phone, ExternalLink } from "lucide-react"
import Link from "next/link"
import LeafletMap from "@/components/leaflet-map"

const nearbyNGOs = [
  {
    id: 1,
    name: "Mumbai Education Foundation",
    description: "Providing quality education to underprivileged children in Mumbai slums",
    category: "Education",
    location: "Dharavi, Mumbai",
    coordinates: { lat: 19.0433, lng: 72.857 },
    distance: "2.3 km",
    beneficiaries: "5,000+ children",
    contact: {
      phone: "+91 98765 43210",
      email: "contact@mumbaiEducation.org",
    },
    urgentNeeds: ["Books", "Stationery", "Computers"],
    image: "/diverse-children-learning.png",
  },
  {
    id: 2,
    name: "Clean Water Mumbai",
    description: "Installing water purification systems in Mumbai's underserved communities",
    category: "Water & Sanitation",
    location: "Bandra East, Mumbai",
    coordinates: { lat: 19.0596, lng: 72.8656 },
    distance: "4.1 km",
    beneficiaries: "15,000+ families",
    contact: {
      phone: "+91 98765 43211",
      email: "help@cleanwatermumbai.org",
    },
    urgentNeeds: ["Water Filters", "Pipes", "Funding"],
    image: "/clean-water-well-construction-rural-community.jpg",
  },
  {
    id: 3,
    name: "Mumbai Health Care Initiative",
    description: "Mobile health clinics serving remote areas of Greater Mumbai",
    category: "Healthcare",
    location: "Powai, Mumbai",
    coordinates: { lat: 19.1176, lng: 72.906 },
    distance: "6.8 km",
    beneficiaries: "8,000+ patients",
    contact: {
      phone: "+91 98765 43212",
      email: "care@mumbaihealthcare.org",
    },
    urgentNeeds: ["Medical Supplies", "Medicines", "Volunteers"],
    image: "/mobile-health-clinic-medical-care-rural-area.jpg",
  },
  {
    id: 4,
    name: "Women Empowerment Mumbai",
    description: "Skill development and microfinance for women entrepreneurs",
    category: "Women Empowerment",
    location: "Andheri West, Mumbai",
    coordinates: { lat: 19.1136, lng: 72.8697 },
    distance: "8.2 km",
    beneficiaries: "3,500+ women",
    contact: {
      phone: "+91 98765 43213",
      email: "empower@wemumbai.org",
    },
    urgentNeeds: ["Sewing Machines", "Training Materials", "Microfinance"],
    image: "/women-entrepreneurs-business-training-microfinance.jpg",
  },
  {
    id: 5,
    name: "Mumbai Street Children Support",
    description: "Rehabilitation and education programs for street children",
    category: "Child Welfare",
    location: "Colaba, Mumbai",
    coordinates: { lat: 18.9067, lng: 72.8147 },
    distance: "12.5 km",
    beneficiaries: "2,000+ children",
    contact: {
      phone: "+91 98765 43214",
      email: "support@streetchildren.org",
    },
    urgentNeeds: ["Food", "Clothing", "Educational Materials"],
    image: "/diverse-children-learning.png",
  },
  {
    id: 6,
    name: "Mumbai Environmental Action",
    description: "Beach cleanup and environmental conservation initiatives",
    category: "Environment",
    location: "Juhu Beach, Mumbai",
    coordinates: { lat: 19.1075, lng: 72.8263 },
    distance: "15.2 km",
    beneficiaries: "Community-wide impact",
    contact: {
      phone: "+91 98765 43215",
      email: "action@mumbaienv.org",
    },
    urgentNeeds: ["Cleanup Equipment", "Volunteers", "Awareness Materials"],
    image: "/clean-water-well-construction-rural-community.jpg",
  },
]

export default function MapPage() {
  const [selectedNGO, setSelectedNGO] = useState(nearbyNGOs[0])
  const [activeCategory, setActiveCategory] = useState("All")

  const categories = [
    "All",
    "Education",
    "Healthcare",
    "Water & Sanitation",
    "Women Empowerment",
    "Child Welfare",
    "Environment",
  ]

  const filteredNGOs =
    activeCategory === "All" ? nearbyNGOs : nearbyNGOs.filter((ngo) => ngo.category === activeCategory)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary/5 border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-primary mb-4 animate-fade-in">Find NGOs Near You</h1>
            <p className="text-lg text-muted-foreground animate-fade-in-delay-1">
              Discover and support local NGOs making a difference in Mumbai communities
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Map Section */}
          <div className="lg:col-span-2">
            <Card className="h-[600px] overflow-hidden animate-fade-in-delay-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Mumbai NGO Map
                </CardTitle>
                <CardDescription>Interactive map showing nearby NGOs and their locations</CardDescription>
              </CardHeader>
              <CardContent className="p-0 h-full">
                <LeafletMap ngos={filteredNGOs} selectedNGO={selectedNGO} onNGOSelect={setSelectedNGO} />
              </CardContent>
            </Card>
          </div>

          {/* NGO Details & Filters */}
          <div className="space-y-6">
            {/* Category Filters */}
            <Card className="animate-fade-in-delay-3">
              <CardHeader>
                <CardTitle>Filter by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={activeCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActiveCategory(category)}
                      className="smooth-hover hover:scale-105"
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Selected NGO Details */}
            <Card className="animate-fade-in-delay-4">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl text-primary">{selectedNGO.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {selectedNGO.location} • {selectedNGO.distance}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">{selectedNGO.category}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <img
                  src={selectedNGO.image || "/placeholder.svg"}
                  alt={selectedNGO.name}
                  className="w-full h-48 object-cover rounded-lg"
                />

                <p className="text-muted-foreground">{selectedNGO.description}</p>

                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-primary" />
                    <span>{selectedNGO.beneficiaries}</span>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-2">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Contact Information
                  </h4>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>{selectedNGO.contact.phone}</p>
                    <p>{selectedNGO.contact.email}</p>
                  </div>
                </div>

                {/* Urgent Needs */}
                <div className="space-y-2">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Urgent Needs
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedNGO.urgentNeeds.map((need) => (
                      <Badge key={need} variant="outline" className="text-xs">
                        {need}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 pt-4">
                  <Button asChild className="w-full smooth-hover hover:scale-105">
                    <Link href={`/donate?ngo=${selectedNGO.id}`}>
                      <Heart className="h-4 w-4 mr-2" />
                      Donate to {selectedNGO.name}
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full smooth-hover hover:scale-105 bg-transparent">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Learn More
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
