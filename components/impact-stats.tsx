import { Card, CardContent } from "@/components/ui/card"

export function ImpactStats() {
  const stats = [
    {
      number: "2,500+",
      label: "Lives Impacted",
      description: "Community members directly benefited",
    },
    {
      number: "15",
      label: "Active Projects",
      description: "Ongoing initiatives across regions",
    },
    {
      number: "85%",
      label: "Funds to Programs",
      description: "Direct allocation to community projects",
    },
    {
      number: "50+",
      label: "Volunteers",
      description: "Dedicated community champions",
    },
  ]

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-balance mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            Our Impact in Numbers
          </h2>
          <p className="text-muted-foreground text-pretty max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            Every donation creates measurable change in communities worldwide
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className={`text-center smooth-hover hover:scale-105 hover:shadow-lg group animate-in fade-in slide-in-from-bottom-4 duration-700`}
              style={{ animationDelay: `${(index + 1) * 150}ms` }}
            >
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-primary mb-2 group-hover:scale-110 smooth-hover">
                  {stat.number}
                </div>
                <div className="text-lg font-semibold mb-1 group-hover:text-primary smooth-hover">{stat.label}</div>
                <div className="text-sm text-muted-foreground">{stat.description}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
