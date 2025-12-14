"use client"

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface ScrollRevealProps {
  children: React.ReactNode
  delay?: number
  className?: string
  animation?: 'fadeUp' | 'fadeLeft' | 'fadeRight' | 'scale' | 'rotate'
  duration?: number
}

export default function ScrollReveal({ 
  children, 
  delay = 0, 
  className = '', 
  animation = 'fadeUp',
  duration = 0.8
}: ScrollRevealProps) {
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element || typeof window === 'undefined') return

    // Set initial state based on animation type
    const initialState = {
      fadeUp: { y: 50, opacity: 0 },
      fadeLeft: { x: -50, opacity: 0 },
      fadeRight: { x: 50, opacity: 0 },
      scale: { scale: 0.8, opacity: 0 },
      rotate: { rotation: 10, opacity: 0 }
    }

    const finalState = {
      fadeUp: { y: 0, opacity: 1 },
      fadeLeft: { x: 0, opacity: 1 },
      fadeRight: { x: 0, opacity: 1 },
      scale: { scale: 1, opacity: 1 },
      rotate: { rotation: 0, opacity: 1 }
    }

    // Set initial state
    gsap.set(element, initialState[animation])

    // Create scroll trigger animation
    gsap.to(element, {
      ...finalState[animation],
      duration,
      delay,
      ease: "power2.out",
      scrollTrigger: {
        trigger: element,
        start: "top 85%",
        end: "bottom 15%",
        toggleActions: "play none none reverse"
      }
    })

    return () => {
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.trigger === element) {
          trigger.kill()
        }
      })
    }
  }, [delay, animation, duration])

  return (
    <div
      ref={elementRef}
      className={`scroll-reveal ${className}`}
    >
      {children}
    </div>
  )
}
