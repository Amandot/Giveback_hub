"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, Eye, EyeOff } from "lucide-react"
import Link from "next/link"

export default function AdminSecretPage() {
  const [formData, setFormData] = useState({
    secretKey: "",
    email: "",
    name: ""
  })
  const [showSecretKey, setShowSecretKey] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      // First, create/update admin account with secret key
      const response = await fetch("/api/auth/admin-secret", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create admin account")
      }

      setSuccess("Admin account created successfully! Signing you in...")

      // Then sign in with credentials
      const result = await signIn("credentials", {
        email: formData.email,
        password: "admin123", // Default password set by the API
        redirect: false,
      })

      if (result?.error) {
        throw new Error("Failed to sign in")
      }

      // Redirect to admin dashboard
      router.push("/admin")
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-red-500 to-orange-600 rounded-2xl flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Admin Secret Access
              </CardTitle>
              <CardDescription className="text-gray-600 mt-2">
                Emergency admin account creation with secret key
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-800">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="border-green-200 bg-green-50">
                <AlertDescription className="text-green-800">
                  {success}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="secretKey" className="text-sm font-medium text-gray-700">
                  Admin Secret Key
                </Label>
                <div className="relative">
                  <Input
                    id="secretKey"
                    name="secretKey"
                    type={showSecretKey ? "text" : "password"}
                    value={formData.secretKey}
                    onChange={handleChange}
                    placeholder="Enter admin secret key"
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSecretKey(!showSecretKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showSecretKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Admin Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@example.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Admin Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Administrator Name"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 hover:shadow-lg"
              >
                {isLoading ? "Creating Admin Account..." : "Create Admin Account"}
              </Button>
            </form>

            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Regular admin login?{" "}
                <Link
                  href="/auth/admin-login"
                  className="text-red-600 hover:text-red-700 font-medium hover:underline"
                >
                  Sign in here
                </Link>
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-xs text-yellow-800">
                <strong>Note:</strong> This creates an admin account with default password "admin123". 
                Please change the password after first login for security.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}