import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, MapPin, Calendar, Users, Target } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

// Mock data - in a real app this would come from a database
const projects = [
  {
    id: 1,
    title: "Clean Water Initiative",
    description:
      "Providing access to clean drinking water in rural communities through well construction and water purification systems.",
    fullDescription:
      "The Clean Water Initiative addresses the critical need for safe drinking water in rural Kenyan communities. Through partnerships with local organizations and community leaders, we're constructing sustainable water wells and implementing water purification systems that will serve families for generations to come.",
    location: "Rural Kenya",
    status: "Active",
    category: "Water & Sanitation",
    fundingGoal: 50000,
    fundingRaised: 35000,
    beneficiaries: 500,
    startDate: "2024-01-15",
    endDate: "2024-12-31",
    image: "/clean-water-well-construction-rural-community.jpg",
    impact: "15 wells constructed, 500 families with clean water access",
    objectives: [
      "Construct 25 sustainable water wells",
      "Install water purification systems in 10 communities",
      "Train 50 local technicians for maintenance",
      "Establish water committees for long-term management",
    ],
    timeline: [
      { phase: "Planning & Community Engagement", status: "Completed", date: "Jan 2024" },
      { phase: "Well Construction Phase 1", status: "Completed", date: "Feb-Apr 2024" },
      { phase: "Well Construction Phase 2", status: "In Progress", date: "May-Aug 2024" },
      { phase: "Training & Handover", status: "Upcoming", date: "Sep-Dec 2024" },
    ],
  },
]

interface ProjectPageProps {
  params: {
    id: string
  }
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const project = projects.find((p) => p.id === Number.parseInt(params.id))

  if (!project) {
    notFound()
  }

  const fundingPercentage = (project.fundingRaised / project.fundingGoal) * 100

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

  const getTimelineStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-500"
      case "In Progress":
        return "bg-blue-500"
      case "Upcoming":
        return "bg-gray-300"
      default:
        return "bg-gray-300"
    }
  }

  return (
    <main className="py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-8">
          <Button variant="ghost" asChild>
            <Link href="/projects">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Projects
            </Link>
          </Button>
        </div>

        {/* Project Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          <div>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
              <Badge variant="outline">{project.category}</Badge>
            </div>
            <h1 className="text-4xl font-bold text-balance mb-4">{project.title}</h1>
            <p className="text-xl text-muted-foreground mb-6">{project.fullDescription}</p>

            {/* Key Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                <span>{project.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <span>{project.beneficiaries} beneficiaries</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <span>{new Date(project.startDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                <span>${project.fundingGoal.toLocaleString()} goal</span>
              </div>
            </div>
          </div>

          <div className="aspect-video bg-muted rounded-lg overflow-hidden">
            <img src={project.image || "/placeholder.svg"} alt={project.title} className="w-full h-full object-cover" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Project Objectives */}
            <Card>
              <CardHeader>
                <CardTitle>Project Objectives</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {project.objectives.map((objective, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span>{objective}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Project Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {project.timeline.map((phase, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className={`w-4 h-4 rounded-full ${getTimelineStatusColor(phase.status)}`} />
                      <div className="flex-1">
                        <div className="font-semibold">{phase.phase}</div>
                        <div className="text-sm text-muted-foreground">{phase.date}</div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {phase.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Impact */}
            <Card>
              <CardHeader>
                <CardTitle>Current Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{project.impact}</p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Funding Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Funding Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Progress value={fundingPercentage} className="h-3" />
                  <div className="flex justify-between text-sm">
                    <span>{Math.round(fundingPercentage)}% funded</span>
                    <span>${(project.fundingGoal - project.fundingRaised).toLocaleString()} remaining</span>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">${project.fundingRaised.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">
                      raised of ${project.fundingGoal.toLocaleString()} goal
                    </div>
                  </div>
                  <Button className="w-full" asChild>
                    <Link href="/donate">Donate to This Project</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Share */}
            <Card>
              <CardHeader>
                <CardTitle>Share This Project</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">Help us spread the word about this important work.</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    Share
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    Email
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
