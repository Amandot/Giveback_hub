import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Truck, Package, Phone, ArrowRight } from "lucide-react"

export function ServicesSection() {
  const services = [
    {
      title: "Donation Pickup",
      description:
        "We'll collect your donations directly from your location with free pickup for donations above ₹500.",
      icon: Package,
      features: ["Free pickup service", "Scheduled slots", "Tax receipts"],
    },
    {
      title: "Supply Drop-off",
      description: "Direct delivery of essential supplies to communities in need with real-time tracking.",
      icon: Truck,
      features: ["Emergency delivery", "Community coordination", "Live tracking"],
    },
  ]

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-balance mb-4">Convenient Pickup & Drop Services</h2>
          <p className="text-xl text-muted-foreground text-pretty max-w-3xl mx-auto">
            Making donations easier with our pickup services and ensuring supplies reach communities efficiently.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {services.map((service, index) => (
            <Card key={index} className="h-full hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <service.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                </div>
                <CardDescription className="text-base">{service.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-4">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" className="flex items-center gap-2">
              <Link href="/services">
                View All Services
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="flex items-center gap-2 bg-transparent">
              <Phone className="h-4 w-4" />
              Call: +91 98765 43210
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
