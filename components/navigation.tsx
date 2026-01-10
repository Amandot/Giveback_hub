"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { AuthButtons } from "@/components/auth-buttons"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            {/* <Link href="/" className="text-2xl font-bold text-primary smooth-hover hover:scale-105">
              <img src="/give back.png" alt="Logo" className="h-8 w-8" /> GiveBack Hub
            </Link> */}
            <Link 
  href="/dashboard" 
  className="text-2xl font-bold text-primary smooth-hover hover:scale-105 flex items-center gap-2"
>
  {/* changed Link to img, fixed path, added alt text */}
  <img src="/give back.png" alt="Logo" className="h-8 w-8" />
  GiveBack Hub
</Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link href="/" className="text-foreground hover:text-primary smooth-hover relative group">
                Home
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
              {/* <Link href="/about" className="text-foreground hover:text-primary smooth-hover relative group">
                About
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link> */}

              {/* <Link href="/services" className="text-foreground hover:text-primary smooth-hover relative group">
                Services
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link> */}
              <Link href="/map" className="text-foreground hover:text-primary smooth-hover relative group">
                Find NGOs
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link href="/contact" className="text-foreground hover:text-primary smooth-hover relative group">
                Contact
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Button asChild className="smooth-hover hover:scale-105 hover:shadow-lg">
                <Link href="/donate">Donate Now</Link>
              </Button>
              <AuthButtons />
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)} className="smooth-hover">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden transition-all duration-300 ease-out ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-border">
            <Link
              href="/"
              className="block px-3 py-2 text-foreground hover:text-primary smooth-hover hover:bg-accent rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/about"
              className="block px-3 py-2 text-foreground hover:text-primary smooth-hover hover:bg-accent rounded-md"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>

            <Link
              href="/services"
              className="block px-3 py-2 text-foreground hover:text-primary smooth-hover hover:bg-accent rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Services
            </Link>
            <Link
              href="/map"
              className="block px-3 py-2 text-foreground hover:text-primary smooth-hover hover:bg-accent rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Find NGOs
            </Link>
            <Link
              href="/contact"
              className="block px-3 py-2 text-foreground hover:text-primary smooth-hover hover:bg-accent rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>
            <div className="px-3 py-2">
              <Button asChild className="w-full smooth-hover hover:scale-105">
                <Link href="/donate" onClick={() => setIsOpen(false)}>
                  Donate Now
                </Link>
              </Button>
            </div>
            <div className="px-3 py-2">
              <AuthButtons />
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
