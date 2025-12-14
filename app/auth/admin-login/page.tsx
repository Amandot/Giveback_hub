"use client"

import { useState, useEffect } from 'react'
import { signIn, getSession, useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Shield, Mail, Lock, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function AdminLoginPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const callbackUrl = searchParams.get('callbackUrl') || '/admin/dashboard'
  const errorParam = searchParams.get('error')

  useEffect(() => {
    if (errorParam) {
      setError('Authentication failed. Please try again.')
    }
  }, [errorParam])

  // Redirect if already logged in
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role === 'ADMIN') {
      router.push('/admin/dashboard')
    } else if (status === 'authenticated' && session?.user?.role === 'USER') {
      router.push('/dashboard')
    }
  }, [status, session, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields.')
      setIsLoading(false)
      return
    }

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false
      })

      if (result?.error) {
        setError('Invalid email or password.')
      } else {
        // Check user role after successful login
        const session = await getSession()
        if (session?.user?.role === 'ADMIN') {
          router.push('/admin/dashboard')
        } else if (session?.user?.role === 'USER') {
          setError('Access denied. This login is for administrators only.')
        } else {
          setError('Account not found or insufficient permissions.')
        }
      }
    } catch (error) {
      setError('An unexpected error occurred.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center animate-fade-in-up">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-purple-100 rounded-full">
              <Shield className="h-12 w-12 text-purple-600" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Admin Access</h2>
          <p className="mt-2 text-sm text-gray-600">
            Secure administrator portal for NGO management
          </p>
        </div>

        <Card className="shadow-xl border-0 animate-fade-in-up stagger-1">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl text-center">Administrator Login</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access the management dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive" className="animate-fade-in-up">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Admin Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="pl-10 h-11 border-2 focus:border-purple-500 transition-colors"
                    placeholder="admin@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="pl-10 h-11 border-2 focus:border-purple-500 transition-colors"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Sign in as Admin
                  </>
                )}
              </Button>
            </form>

            {/* Security Notice */}
            <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg">
              <div className="flex items-start">
                <Shield className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-amber-800">
                    Secure Administrator Access
                  </h3>
                  <p className="text-sm text-amber-700 mt-1">
                    This portal is exclusively for verified NGO administrators and authorized staff members.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center space-y-4 animate-fade-in-up stagger-2">
          <div className="flex items-center justify-center space-x-4">
            <Link 
              href="/auth/admin-signup" 
              className="text-sm text-purple-600 hover:text-purple-500 font-medium hover:underline transition-colors"
            >
              Register NGO
            </Link>
            <span className="text-gray-300">•</span>
            <Link 
              href="/auth/admin-secret" 
              className="text-sm text-red-600 hover:text-red-500 font-medium hover:underline transition-colors"
            >
              Emergency Access
            </Link>
            <span className="text-gray-300">•</span>
            <Link 
              href="/auth/user-login" 
              className="text-sm text-blue-600 hover:text-blue-500 font-medium hover:underline transition-colors"
            >
              User Login
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