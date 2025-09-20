"use client"

import type React from "react"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  useEffect(() => {
    const initTransitions = () => {
      // Add fade-in animation to page content
      const pageContent = document.querySelector('[data-barba="container"]')
      if (pageContent) {
        pageContent.classList.add("opacity-0", "translate-y-4")

        // Animate in
        setTimeout(() => {
          pageContent.classList.remove("opacity-0", "translate-y-4")
          pageContent.classList.add("opacity-100", "translate-y-0", "transition-all", "duration-500", "ease-out")
        }, 50)
      }
    }

    initTransitions()
  }, [pathname])

  return (
    <div data-barba="container" className="min-h-screen transition-all duration-500 ease-out">
      {children}
    </div>
  )
}
