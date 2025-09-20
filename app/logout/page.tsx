"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Home, LogIn, UserPlus } from "lucide-react"
import Link from "next/link"

export default function LogoutPage() {
  const router = useRouter()
  const [countdown, setCountdown] = useState(10)

  useEffect(() => {
    // Countdown timer for auto-redirect
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          router.push("/")
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Success Message */}
        <Card className="border-green-200">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <CardTitle className="text-2xl text-green-800">Successfully Signed Out</CardTitle>
              <CardDescription className="text-green-700">
                You have been safely logged out from your account
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Auto-redirect notice */}
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-800">
                Redirecting to homepage in <span className="font-bold text-green-600">{countdown}</span> seconds
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button asChild className="w-full" size="lg">
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Go to Homepage
                </Link>
              </Button>
              
              <div className="grid grid-cols-2 gap-3">
                <Button asChild variant="outline" size="sm">
                  <Link href="/auth/user-login">
                    <LogIn className="mr-1 h-3 w-3" />
                    Sign In
                  </Link>
                </Button>
                
                <Button asChild variant="outline" size="sm">
                  <Link href="/admin-signup">
                    <UserPlus className="mr-1 h-3 w-3" />
                    Register NGO
                  </Link>
                </Button>
              </div>
            </div>

            {/* Security Tips */}
            <div className="text-center space-y-2">
              <h4 className="text-sm font-semibold text-gray-700">Security Tips</h4>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Always sign out from public devices</li>
                <li>• Use strong, unique passwords</li>
                <li>• Never share your login credentials</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Thank You Message */}
        <Card>
          <CardContent className="pt-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Thank you for using GiveBack Hub</h3>
            <p className="text-sm text-muted-foreground">
              Together, we're making a difference in our communities. Come back anytime to continue your impact!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}