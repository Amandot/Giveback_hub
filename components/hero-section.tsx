"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useSession } from "next-auth/react"

export function HeroSection() {
  const { data: session, status } = useSession()
  
  // Show personalized content for authenticated users
  if (status === "authenticated" && session?.user) {
    const firstName = session.user.name?.split(' ')[0] || 'Friend'
    
    return (
      <section className="relative py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-balance mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
              Welcome back, <span className="text-primary">{firstName}!</span>
            </h1>
            <p className="text-xl text-muted-foreground text-pretty mb-8 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
              Ready to continue making a difference? Explore your personalized dashboard and discover new ways to create impact in your community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-400">
              <Button asChild size="lg" className="smooth-hover hover:scale-105 hover:shadow-lg">
                <Link href="/dashboard">View My Dashboard</Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                asChild
                className="smooth-hover hover:scale-105 hover:shadow-md bg-transparent"
              >
                <Link href="/donate">Make a Donation</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    )
  }
  
  // Default content for non-authenticated users
  return (
    <section className="relative py-20 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-balance mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            Empowering Communities, <span className="text-primary">Changing Lives</span>
          </h1>
          <p className="text-xl text-muted-foreground text-pretty mb-8 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            Join us in creating lasting impact through community-driven initiatives that address real needs and build
            sustainable futures.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-400">
            <Button asChild size="lg" className="smooth-hover hover:scale-105 hover:shadow-lg">
              <Link href="/donate">Make a Donation</Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              asChild
              className="smooth-hover hover:scale-105 hover:shadow-md bg-transparent"
            >
              <Link href="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
