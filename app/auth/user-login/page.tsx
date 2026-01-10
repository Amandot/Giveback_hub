"use client"

import { useState, useEffect } from 'react'
import { signIn, getProviders, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Heart, AlertCircle, Loader2, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function UserLoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [providers, setProviders] = useState<any>(null)
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    // Redirect if already authenticated
    if (status === "authenticated") {
      router.push('/dashboard')
      return
    }

    // Load providers
    getProviders().then(setProviders)
  }, [status, router])

  const handleGoogleSignIn = async () => {
    if (!providers?.google) {
      setError('Google sign-in is not configured. Please contact support.')
      return
    }

    setIsLoading(true)
    setError('')
    
    try {
      const result = await signIn('google', { 
        callbackUrl: '/dashboard',
        redirect: false
      })
      
      if (result?.error) {
        setError('Sign-in failed. Please try again.')
        setIsLoading(false)
      } else if (result?.ok) {
        // Success - redirect will happen automatically
        setError('')
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.')
      setIsLoading(false)
    }
  }

  // Show loading state while checking session
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Show success state if authenticated
  if (status === "authenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="text-center">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back!</h2>
          <p className="text-muted-foreground mb-4">Redirecting to your dashboard...</p>
          <Button asChild>
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        </div>
      </div>
    )
  }


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center animate-fade-in-up">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              {/* <Heart className="h-12 w-12 text-primary" /> */}
              <img src="/give back.png" alt="Logo" className="h-25 w-25" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your GiveBack Hub account and start making a difference
          </p>
        </div>

        <Card className="shadow-xl border-0 animate-fade-in-up stagger-1">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl text-center">Sign In</CardTitle>
            <CardDescription className="text-center">
              Join thousands of donors making an impact
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive" className="animate-fade-in-up">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Google Sign In */}
            {providers?.google ? (
              <Button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full h-12 bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-medium shadow-sm hover:shadow-md transition-all duration-200"
                variant="outline"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    Continue with Google
                  </>
                )}
              </Button>
            ) : (
              <Alert className="border-yellow-200 bg-yellow-50">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800">
                  Google sign-in is currently being configured. Please try again in a few minutes or contact support.
                </AlertDescription>
              </Alert>
            )}

            {/* Info text */}
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">
                Secure sign-in with your Google account
              </p>
              <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                <span className="flex items-center">
                  <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                  Secure
                </span>
                <span className="flex items-center">
                  <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                  Fast
                </span>
                <span className="flex items-center">
                  <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                  Private
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center space-y-4 animate-fade-in-up stagger-2">
          <div className="flex items-center justify-center space-x-4">
            <Link 
              href="/auth/admin-login" 
              className="text-sm text-primary hover:text-primary/80 font-medium hover:underline transition-colors"
            >
              Admin Login
            </Link>
            <span className="text-gray-300">•</span>
            <Link 
              href="/admin-signup" 
              className="text-sm text-green-600 hover:text-green-500 font-medium hover:underline transition-colors"
            >
              Register NGO
            </Link>
          </div>
          <Link 
            href="/" 
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}