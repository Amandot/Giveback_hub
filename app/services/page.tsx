import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Truck, Package, Clock, MapPin, Phone, Mail } from "lucide-react"

export default function ServicesPage() {
  const services = [
    {
      title: "Donation Pickup",
      description: "We'll collect your donations directly from your location",
      icon: Package,
      features: [
        "Free pickup for donations above ₹500",
        "Scheduled pickup slots",
        "Receipt generation",
        "Tax exemption certificates",
      ],
      areas: ["Mumbai Central", "Bandra", "Andheri", "Powai", "Thane"],
    },
    {
      title: "Supply Drop-off",
      description: "Direct delivery of essential supplies to communities in need",
      icon: Truck,
      features: ["Emergency supply delivery", "Scheduled distribution", "Real-time tracking", "Community coordination"],
      areas: ["Dharavi", "Govandi", "Mankhurd", "Kurla", "Chembur"],
    },
  ]

  const pickupTypes = [
    { name: "Clothing & Textiles", color: "bg-blue-100 text-blue-800" },
    { name: "Books & Stationery", color: "bg-green-100 text-green-800" },
    { name: "Food Items", color: "bg-orange-100 text-orange-800" },
    { name: "Medical Supplies", color: "bg-red-100 text-red-800" },
    { name: "Electronics", color: "bg-purple-100 text-purple-800" },
    { name: "Toys & Games", color: "bg-pink-100 text-pink-800" },
  ]

  return (
    <main className="py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-balance mb-6">Pickup & Drop Services</h1>
          <p className="text-xl text-muted-foreground text-pretty max-w-3xl mx-auto">
            Making donations easier with convenient pickup services and ensuring supplies reach communities efficiently
            through our drop-off network.
          </p>
        </div>

        {/* Services Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {services.map((service, index) => (
            <Card key={index} className="h-full">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <service.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">{service.title}</CardTitle>
                </div>
                <CardDescription className="text-base">{service.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Features:</h4>
                    <ul className="space-y-1">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Service Areas:</h4>
                    <div className="flex flex-wrap gap-2">
                      {service.areas.map((area, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          <MapPin className="h-3 w-3 mr-1" />
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pickup Types */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">What We Accept</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {pickupTypes.map((type, index) => (
              <div key={index} className={`p-4 rounded-lg text-center ${type.color}`}>
                <p className="font-semibold text-sm">{type.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Schedule Pickup</h3>
              <p className="text-muted-foreground">Call us or book online to schedule a convenient pickup time</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Prepare Items</h3>
              <p className="text-muted-foreground">Pack your donations and have them ready for collection</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. We Collect</h3>
              <p className="text-muted-foreground">Our team arrives at your location and collects the donations</p>
            </div>
          </div>
        </div>

        {/* Service Hours */}
        <div className="mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Service Hours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Pickup Services</h4>
                  <p className="text-sm text-muted-foreground mb-1">Monday - Saturday: 9:00 AM - 6:00 PM</p>
                  <p className="text-sm text-muted-foreground">Sunday: 10:00 AM - 4:00 PM</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Emergency Drop-off</h4>
                  <p className="text-sm text-muted-foreground mb-1">Available 24/7 for urgent supplies</p>
                  <p className="text-sm text-muted-foreground">Call our emergency hotline</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact & Booking */}
        <div className="bg-muted/30 rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Schedule?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Contact us to schedule a pickup or learn more about our drop-off services. We're here to make your donations
            count.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Call: +91 98765 43210
            </Button>
            <Button variant="outline" size="lg" className="flex items-center gap-2 bg-transparent">
              <Mail className="h-4 w-4" />
              Email: services@givebackhub.org
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
