import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ContactForm } from "@/components/contact-form"
import { Mail, Phone, MapPin, Clock } from "lucide-react"

export default function ContactPage() {
  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      details: "info@givebackhub.org",
      description: "Send us an email anytime",
    },
    {
      icon: Phone,
      title: "Phone",
      details: "+1 (555) 123-4567",
      description: "Mon-Fri, 9AM-5PM EST",
    },
    {
      icon: MapPin,
      title: "Address",
      details: "123 Community Drive, Suite 100",
      description: "New York, NY 10001",
    },
    {
      icon: Clock,
      title: "Response Time",
      details: "Within 24 hours",
      description: "We respond to all inquiries quickly",
    },
  ]

  return (
    <main className="py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-balance mb-6">Get in Touch</h1>
          <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
            Have questions about our work, want to volunteer, or interested in partnering with us? We'd love to hear
            from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-bold mb-8">Contact Information</h2>
            <div className="space-y-6">
              {contactInfo.map((info, index) => {
                const Icon = info.icon
                return (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="bg-primary/10 p-3 rounded-lg">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg mb-1">{info.title}</h3>
                          <p className="text-foreground font-medium mb-1">{info.details}</p>
                          <p className="text-muted-foreground text-sm">{info.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Additional Info */}
            <div className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Visit Our Office</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    We welcome visitors to our office! Please schedule an appointment in advance to ensure someone is
                    available to meet with you.
                  </p>
                  <p className="text-muted-foreground">
                    <strong>Office Hours:</strong>
                    <br />
                    Monday - Friday: 9:00 AM - 5:00 PM EST
                    <br />
                    Saturday: 10:00 AM - 2:00 PM EST
                    <br />
                    Sunday: Closed
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <ContactForm />
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How can I volunteer?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We offer various volunteer opportunities both locally and internationally. Contact us to learn about
                  current openings and how to get involved.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Where does my donation go?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  85% of donations go directly to programs, with detailed impact reports available for all donors. We
                  maintain full transparency in our financial operations.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I visit project sites?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes! We organize donor trips and volunteer visits to project sites. These experiences provide
                  firsthand insight into our work and impact.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How do you measure impact?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We use rigorous monitoring and evaluation frameworks, including baseline studies, regular assessments,
                  and third-party evaluations to measure our impact.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
