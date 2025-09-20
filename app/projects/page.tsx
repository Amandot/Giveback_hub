import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"

export default function ProjectsPage() {
  // Mock data - in a real app this would come from a database
  const projects = [
    {
      id: 1,
      title: "Clean Water Initiative",
      description:
        "Providing access to clean drinking water in rural communities through well construction and water purification systems.",
      location: "Rural Kenya",
      status: "Active",
      category: "Water & Sanitation",
      fundingGoal: 50000,
      fundingRaised: 35000,
      beneficiaries: 500,
      startDate: "2024-01-15",
      image: "/diverse-community-members-working-together-on-deve.jpg",
      impact: "15 wells constructed, 500 families with clean water access",
    },
    {
      id: 2,
      title: "Education Support Program",
      description: "Building schools and providing educational resources to underserved children in remote areas.",
      location: "Guatemala",
      status: "Active",
      category: "Education",
      fundingGoal: 75000,
      fundingRaised: 45000,
      beneficiaries: 300,
      startDate: "2024-02-01",
      image: "/school-construction-children-learning-guatemala.jpg",
      impact: "2 schools built, 300 children enrolled, 15 teachers trained",
    },
    {
      id: 3,
      title: "Healthcare Access Project",
      description:
        "Mobile health clinics bringing essential medical care to communities lacking healthcare infrastructure.",
      location: "Rural Bangladesh",
      status: "Active",
      category: "Healthcare",
      fundingGoal: 60000,
      fundingRaised: 60000,
      beneficiaries: 1200,
      startDate: "2023-09-01",
      image: "/mobile-health-clinic-medical-care-rural-area.jpg",
      impact: "3 mobile clinics operational, 1,200 patients treated monthly",
    },
    {
      id: 4,
      title: "Women's Empowerment Initiative",
      description: "Providing microfinance and business training to women entrepreneurs in underserved communities.",
      location: "Rural India",
      status: "Planning",
      category: "Economic Development",
      fundingGoal: 40000,
      fundingRaised: 12000,
      beneficiaries: 200,
      startDate: "2024-06-01",
      image: "/professional-indian-woman-business-attire-headshot.jpg",
      impact: "Project launching soon - 200 women to receive training and microloans",
    },
    {
      id: 5,
      title: "Sustainable Agriculture Program",
      description: "Teaching sustainable farming techniques and providing seeds and tools to improve food security.",
      location: "Rural Ethiopia",
      status: "Completed",
      category: "Agriculture",
      fundingGoal: 30000,
      fundingRaised: 30000,
      beneficiaries: 150,
      startDate: "2023-03-01",
      image: "/diverse-community-members-working-together-on-deve.jpg",
      impact: "150 farmers trained, 40% increase in crop yields, improved food security",
    },
    {
      id: 6,
      title: "Youth Skills Development",
      description: "Vocational training programs for young adults to develop marketable skills and find employment.",
      location: "Urban Philippines",
      status: "Active",
      category: "Education",
      fundingGoal: 45000,
      fundingRaised: 28000,
      beneficiaries: 100,
      startDate: "2024-03-01",
      image: "/professional-indian-man-business-suit-headshot.jpg",
      impact: "80 youth enrolled, 65% job placement rate for graduates",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800"
      case "Planning":
        return "bg-yellow-100 text-yellow-800"
      case "Completed":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Water & Sanitation":
        return "bg-blue-100 text-blue-800"
      case "Education":
        return "bg-purple-100 text-purple-800"
      case "Healthcare":
        return "bg-red-100 text-red-800"
      case "Economic Development":
        return "bg-green-100 text-green-800"
      case "Agriculture":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <main className="py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-balance mb-6">Our Projects</h1>
          <p className="text-xl text-muted-foreground text-pretty max-w-3xl mx-auto">
            Discover the communities we're working with and the sustainable solutions we're implementing together. Every
            project is designed with local input and measured for lasting impact.
          </p>
        </div>

        {/* Filter Section */}
        <div className="mb-12">
          <div className="flex flex-wrap gap-4 justify-center">
            <Button variant="outline" size="sm">
              All Projects
            </Button>
            <Button variant="outline" size="sm">
              Active
            </Button>
            <Button variant="outline" size="sm">
              Planning
            </Button>
            <Button variant="outline" size="sm">
              Completed
            </Button>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => {
            const fundingPercentage = (project.fundingRaised / project.fundingGoal) * 100

            return (
              <Card key={project.id} className="overflow-hidden">
                <div className="aspect-video bg-muted">
                  <img
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex flex-wrap gap-2">
                      <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
                      <Badge variant="outline" className={getCategoryColor(project.category)}>
                        {project.category}
                      </Badge>
                    </div>
                  </div>
                  <CardTitle className="text-xl text-balance">{project.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{project.location}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 text-sm">{project.description}</p>

                  {/* Funding Progress */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Funding Progress</span>
                      <span>{Math.round(fundingPercentage)}%</span>
                    </div>
                    <Progress value={fundingPercentage} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>${project.fundingRaised.toLocaleString()} raised</span>
                      <span>${project.fundingGoal.toLocaleString()} goal</span>
                    </div>
                  </div>

                  {/* Impact Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4 text-center">
                    <div>
                      <div className="text-lg font-bold text-primary">{project.beneficiaries}</div>
                      <div className="text-xs text-muted-foreground">Beneficiaries</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-primary">{new Date(project.startDate).getFullYear()}</div>
                      <div className="text-xs text-muted-foreground">Started</div>
                    </div>
                  </div>

                  {/* Impact Description */}
                  <div className="mb-4">
                    <p className="text-xs text-muted-foreground">
                      <strong>Impact:</strong> {project.impact}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1" asChild>
                      <Link href={`/projects/${project.id}`}>Learn More</Link>
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <Link href="/donate">Donate</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-muted/30 rounded-lg p-8">
            <h2 className="text-3xl font-bold mb-4">Want to Start a New Project?</h2>
            <p className="text-muted-foreground text-pretty max-w-2xl mx-auto mb-6">
              We're always looking for new opportunities to make a difference. If you know of a community in need or
              have an idea for a sustainable development project, we'd love to hear from you.
            </p>
            <Button asChild size="lg">
              <Link href="/contact">Propose a Project</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
