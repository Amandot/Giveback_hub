'use client'

import { signIn, getProviders, getSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function TestGooglePage() {
  const [providers, setProviders] = useState<any>(null)
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [providersRes, sessionRes] = await Promise.all([
          getProviders(),
          getSession()
        ])
        setProviders(providersRes)
        setSession(sessionRes)
      } catch (err) {
        setError('Failed to load authentication data')
        console.error('Error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleGoogleSignIn = async () => {
    try {
      setError(null)
      const result = await signIn('google', { 
        callbackUrl: '/dashboard',
        redirect: false 
      })
      
      if (result?.error) {
        setError(`Google sign-in failed: ${result.error}`)
      } else if (result?.ok) {
        router.push('/dashboard')
      }
    } catch (err) {
      setError('An error occurred during Google sign-in')
      console.error('Google sign-in error:', err)
    }
  }

  const handleCredentialsSignIn = async (email: string, password: string) => {
    try {
      setError(null)
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false
      })
      
      if (result?.error) {
        setError(`Sign-in failed: ${result.error}`)
      } else if (result?.ok) {
        router.push('/dashboard')
      }
    } catch (err) {
      setError('An error occurred during sign-in')
      console.error('Credentials sign-in error:', err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading authentication...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-8">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          🔐 Authentication Test Center
        </h1>
        
        {session && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="text-lg font-semibold text-green-800 mb-2">✅ Currently Signed In</h3>
            <p className="text-green-700">Welcome, {session.user?.name || session.user?.email}!</p>
            <p className="text-sm text-green-600">Role: {session.user?.role || 'USER'}</p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="text-lg font-semibold text-red-800 mb-2">❌ Error</h3>
            <p className="text-red-700">{error}</p>
          </div>
        )}
        
        <div className="space-y-8">
          {/* Google OAuth Section */}
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Google OAuth Authentication</h2>
            
            {providers?.google ? (
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 font-medium">✅ Google OAuth is configured and ready!</p>
                </div>
                
                <button
                  onClick={handleGoogleSignIn}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl"
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="text-lg">Sign in with Google</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800 font-medium">⚠️ Google OAuth not configured</p>
                  <p className="text-sm text-yellow-600 mt-2">
                    Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env.local
                  </p>
                </div>
                
                <div className="text-center">
                  <p className="text-gray-600 mb-4">To set up Google OAuth, run:</p>
                  <code className="bg-gray-100 px-4 py-2 rounded text-sm">
                    node scripts/google-oauth-setup.js
                  </code>
                </div>
              </div>
            )}
          </div>

          {/* Credentials Authentication Section */}
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Test with Credentials</h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">Admin User</h3>
                <p className="text-sm text-gray-600 mb-3">admin@example.com / admin123</p>
                <button
                  onClick={() => handleCredentialsSignIn('admin@example.com', 'admin123')}
                  className="w-full bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded transition-colors duration-200"
                >
                  Sign in as Admin
                </button>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">Test User</h3>
                <p className="text-sm text-gray-600 mb-3">test@example.com / test123</p>
                <button
                  onClick={() => handleCredentialsSignIn('test@example.com', 'test123')}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded transition-colors duration-200"
                >
                  Sign in as User
                </button>
              </div>
            </div>
          </div>

          {/* Available Providers Info */}
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Available Providers</h2>
            {providers ? (
              <div className="space-y-2">
                {Object.values(providers).map((provider: any) => (
                  <div key={provider.name} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="font-medium text-blue-800">{provider.name}</p>
                    <p className="text-sm text-blue-600">ID: {provider.id}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-red-500">No providers available</p>
            )}
          </div>

          {/* Navigation */}
          <div className="text-center space-x-4">
            <a
              href="/auth/user-login"
              className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition-colors duration-200"
            >
              Go to Login Page
            </a>
            <a
              href="/"
              className="inline-block bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded transition-colors duration-200"
            >
              Back to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
