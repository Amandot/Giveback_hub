"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { User } from "lucide-react"

interface MockUser {
  name: string
  email: string
  image?: string
}

export function MockAuthButton() {
  const [mockUser, setMockUser] = useState<MockUser | null>(null)

  const mockSignIn = () => {
    const user: MockUser = {
      name: "John Doe",
      email: "john.doe@example.com",
      image: "https://via.placeholder.com/40"
    }
    setMockUser(user)
    
    // Store in localStorage for persistence across page reloads
    localStorage.setItem('mockUser', JSON.stringify(user))
  }

  const mockSignOut = () => {
    setMockUser(null)
    localStorage.removeItem('mockUser')
  }

  // Check localStorage on component mount
  useState(() => {
    const stored = localStorage.getItem('mockUser')
    if (stored) {
      try {
        setMockUser(JSON.parse(stored))
      } catch (e) {
        console.error('Failed to parse stored user:', e)
      }
    }
  })

  if (mockUser) {
    return (
      <div className="flex items-center gap-2">
        <Badge variant="secondary">
          <User className="h-3 w-3 mr-1" />
          Demo Mode
        </Badge>
        <span className="text-sm">{mockUser.name}</span>
        <Button variant="outline" size="sm" onClick={mockSignOut}>
          Sign out
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Badge variant="outline" className="text-xs">
        Demo Available
      </Badge>
      <Button 
        size="sm" 
        variant="secondary"
        onClick={mockSignIn}
        title="Try the app with a demo account (no real authentication required)"
      >
        Try Demo Login
      </Button>
    </div>
  )
}