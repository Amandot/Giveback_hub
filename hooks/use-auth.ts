"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"

interface MockUser {
  name: string
  email: string
  image?: string
}

interface UnifiedUser {
  name?: string | null
  email?: string | null
  image?: string | null
}

interface UnifiedSession {
  user?: UnifiedUser
}

interface AuthState {
  data: UnifiedSession | null
  status: "loading" | "authenticated" | "unauthenticated"
}

export function useAuth(): AuthState {
  const { data: nextAuthSession, status: nextAuthStatus } = useSession()
  const [mockUser, setMockUser] = useState<MockUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check for mock user on component mount
  useEffect(() => {
    const stored = localStorage.getItem('mockUser')
    if (stored) {
      try {
        setMockUser(JSON.parse(stored))
      } catch (e) {
        console.error('Failed to parse stored user:', e)
      }
    }
    setIsLoading(false)
  }, [])

  // Listen for localStorage changes (cross-tab sync)
  useEffect(() => {
    const handleStorageChange = () => {
      const stored = localStorage.getItem('mockUser')
      if (stored) {
        try {
          setMockUser(JSON.parse(stored))
        } catch (e) {
          setMockUser(null)
        }
      } else {
        setMockUser(null)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  // If NextAuth has an authenticated session, use that
  if (nextAuthStatus === "authenticated" && nextAuthSession) {
    return {
      data: nextAuthSession,
      status: "authenticated"
    }
  }

  // If NextAuth is still loading, show loading
  if (nextAuthStatus === "loading" || isLoading) {
    return {
      data: null,
      status: "loading"
    }
  }

  // If we have a mock user, use that
  if (mockUser) {
    return {
      data: {
        user: {
          name: mockUser.name,
          email: mockUser.email,
          image: mockUser.image
        }
      },
      status: "authenticated"
    }
  }

  // No authentication
  return {
    data: null,
    status: "unauthenticated"
  }
}