"use client"

import { useState } from "react"
import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { LogOut, Loader2 } from "lucide-react"

interface LogoutDialogProps {
  children: React.ReactNode
  redirectTo?: string
  showConfirmation?: boolean
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
}

export function LogoutDialog({ 
  children, 
  redirectTo = "/", 
  showConfirmation = true,
  variant = "ghost",
  size = "default"
}: LogoutDialogProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    setIsLoggingOut(true)
    
    try {
      // Clear any local storage or session storage if needed
      localStorage.removeItem("userPreferences")
      sessionStorage.clear()
      
      // Sign out with NextAuth
      await signOut({ 
        redirect: false,
        callbackUrl: redirectTo 
      })
      
      // Force redirect after logout
      router.push(redirectTo)
      router.refresh()
      
    } catch (error) {
      console.error("Logout error:", error)
      // Still try to redirect even if there's an error
      router.push(redirectTo)
    } finally {
      setIsLoggingOut(false)
    }
  }

  if (!showConfirmation) {
    return (
      <Button
        variant={variant}
        size={size}
        onClick={handleLogout}
        disabled={isLoggingOut}
        className="flex items-center gap-2"
      >
        {isLoggingOut ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Signing out...
          </>
        ) : (
          children
        )}
      </Button>
    )
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant={variant}
          size={size}
          disabled={isLoggingOut}
          className="flex items-center gap-2"
        >
          {isLoggingOut ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Signing out...
            </>
          ) : (
            children
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <LogOut className="h-5 w-5 text-destructive" />
            Confirm Logout
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to sign out? You'll need to sign in again to access your dashboard and make donations.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoggingOut}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoggingOut ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing out...
              </>
            ) : (
              // <>
              //   <LogOut className="mr-2 h-4 w-4" />
              //   Sign out
              // </>
              <>
  {/* Change icon color here (e.g., text-white, text-black, text-yellow-300) */}
  <LogOut className="mr-2 h-4 w-4 text-white" />
  
  {/* Change text color here */}
  <span className="text-white">Sign out</span>
</>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

// Quick logout button without confirmation
export function QuickLogoutButton({
  variant = "ghost",
  size = "sm",
  redirectTo = "/",
  className = ""
}: {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  redirectTo?: string
  className?: string
}) {
  return (
    <LogoutDialog 
      showConfirmation={false} 
      redirectTo={redirectTo}
      variant={variant}
      size={size}
    >
      <LogOut className="h-4 w-4 mr-1" />
      Sign out
    </LogoutDialog>
  )
}