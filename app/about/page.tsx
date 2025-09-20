import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AboutPage() {
  const values = [
    {
      title: "Transparency",
      description:
        "We believe in complete transparency with our donors and communities about how funds are used and impact is measured.",
    },
    {
      title: "Community-Led",
      description:
        "Our projects are designed and implemented with direct input from the communities we serve, ensuring sustainable solutions.",
    },
    {
      title: "Measurable Impact",
      description:
        "Every project includes clear metrics and regular reporting to demonstrate real, lasting change in people's lives.",
    },
    {
      title: "Collaboration",
      description:
        "We work with local partners, volunteers, and stakeholders to maximize our collective impact and reach.",
    },
  ]

  const team = [
    {
      name: "Priya Sharma",
      role: "Executive Director",
      bio: "15+ years in international development with focus on sustainable community programs.",
    },
    {
      name: "Arjun Patel",
      role: "Program Manager",
      bio: "Former Peace Corps volunteer with expertise in water and sanitation projects.",
    },
    {
      name: "Kavya Reddy",
      role: "Community Outreach",
      bio: "Local community leader with deep connections across our target regions.",
    },
  ]

  return (
    <main className="py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-balance mb-6">About GiveBack Hub</h1>
          <p className="text-xl text-muted-foreground text-pretty max-w-3xl mx-auto">
            Founded in 2020, GiveBack Hub emerged from a simple belief: that sustainable change happens when communities
            are empowered to lead their own development.
          </p>
        </div>

        {/* Mission Section */}
        <div className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-muted-foreground mb-4">
                We partner with underserved communities to identify their most pressing needs and develop sustainable
                solutions that create lasting positive impact.
              </p>
              <p className="text-muted-foreground mb-4">
                Through collaborative projects in education, healthcare, clean water, and economic development, we work
                to break cycles of poverty and build resilient communities.
              </p>
              <p className="text-muted-foreground">
                Our approach prioritizes local leadership, transparent operations, and measurable outcomes to ensure
                every donation creates maximum impact.
              </p>
            </div>
            <div className="aspect-video bg-muted rounded-lg">
              <img
                src="/diverse-community-members-working-together-on-deve.jpg"
                alt="Community members working together"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-xl">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="w-24 h-24 bg-muted rounded-full mx-auto mb-4">
                    <img
                      src={
                        index === 0
                          ? "/professional-indian-woman-business-attire-headshot.jpg"
                          : index === 1
                            ? "/professional-indian-man-business-suit-headshot.jpg"
                            : "/professional-indian-woman-traditional-modern-headshot.jpg"
                      }
                      alt={member.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <CardTitle className="text-xl">{member.name}</CardTitle>
                  <p className="text-primary font-semibold">{member.role}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Impact Section */}
        <div className="bg-muted/30 rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Mission</h2>
          <p className="text-muted-foreground text-pretty max-w-2xl mx-auto">
            Every donation, volunteer hour, and shared story helps us expand our reach and deepen our impact. Together,
            we can build a world where every community has the resources and support they need to thrive.
          </p>
        </div>
      </div>
    </main>
  )
}
