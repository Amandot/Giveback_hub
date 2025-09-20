"use client"

import { useState } from "react"
import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { LogoutDialog } from "@/components/logout-dialog"
import { ChevronDown, LogOut, Smartphone, Monitor, Shield } from "lucide-react"

interface LogoutOptionsProps {
  children: React.ReactNode
}

export function LogoutOptions({ children }: LogoutOptionsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogoutAllDevices = async () => {
    setIsLoading(true)
    try {
      // Clear all storage
      localStorage.clear()
      sessionStorage.clear()
      
      // Sign out and invalidate all sessions
      await signOut({ 
        redirect: false,
        callbackUrl: "/"
      })
      
      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center">
      {/* Main logout button */}
      <LogoutDialog redirectTo="/">
        {children}
      </LogoutDialog>
      
      {/* Dropdown with additional options */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 ml-1"
            disabled={isLoading}
          >
            <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">Logout Options</p>
              <p className="text-xs leading-none text-muted-foreground">
                Choose how you want to sign out
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <DropdownMenuItem asChild>
            <LogoutDialog 
              redirectTo="/" 
              showConfirmation={false}
              variant="ghost"
              size="sm"
            >
              <div className="flex items-center w-full cursor-pointer">
                <Monitor className="mr-2 h-4 w-4" />
                <div className="flex-1">
                  <div className="text-sm">Sign out this device</div>
                  <div className="text-xs text-muted-foreground">
                    Keep other sessions active
                  </div>
                </div>
              </div>
            </LogoutDialog>
          </DropdownMenuItem>

          <DropdownMenuItem 
            onClick={handleLogoutAllDevices}
            disabled={isLoading}
            className="cursor-pointer"
          >
            <Smartphone className="mr-2 h-4 w-4" />
            <div className="flex-1">
              <div className="text-sm">Sign out all devices</div>
              <div className="text-xs text-muted-foreground">
                End all active sessions
              </div>
            </div>
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          
          <DropdownMenuItem asChild>
            <LogoutDialog 
              redirectTo="/admin-signup" 
              showConfirmation={true}
              variant="ghost"
              size="sm"
            >
              <div className="flex items-center w-full cursor-pointer text-orange-600 hover:text-orange-700">
                <Shield className="mr-2 h-4 w-4" />
                <div className="flex-1">
                  <div className="text-sm">Switch to NGO signup</div>
                  <div className="text-xs text-muted-foreground">
                    Sign out and register NGO
                  </div>
                </div>
              </div>
            </LogoutDialog>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

// Simple logout button with tooltip
export function SimpleLogoutButton({
  size = "sm",
  variant = "outline",
  showIcon = true,
  text = "Sign out"
}: {
  size?: "default" | "sm" | "lg" | "icon"
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  showIcon?: boolean
  text?: string
}) {
  return (
    <LogoutDialog 
      redirectTo="/" 
      variant={variant}
      size={size}
    >
      <div className="flex items-center gap-2">
        {showIcon && <LogOut className="h-4 w-4" />}
        {text}
      </div>
    </LogoutDialog>
  )
}

// Emergency logout button (no confirmation)
export function EmergencyLogoutButton() {
  return (
    <LogoutDialog 
      redirectTo="/" 
      showConfirmation={false}
      variant="destructive"
      size="sm"
    >
      <div className="flex items-center gap-2">
        <LogOut className="h-4 w-4" />
        Emergency Logout
      </div>
    </LogoutDialog>
  )
}