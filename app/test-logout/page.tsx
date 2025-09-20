"use client"

import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EmergencyLogout, SessionDebugInfo } from "@/components/emergency-logout"
import { SimpleLogoutButton, LogoutOptions, EmergencyLogoutButton } from "@/components/logout-options"
import { LogoutDialog } from "@/components/logout-dialog"
import { Button } from "@/components/ui/button"

export default function LogoutTestPage() {
  const { data: session, status } = useSession()

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Logout Test Page</h1>
          <p className="text-muted-foreground">
            Test all logout functionality components
          </p>
        </div>

        <SessionDebugInfo />

        <div className="grid md:grid-cols-2 gap-6">
          {/* Simple Logout Buttons */}
          <Card>
            <CardHeader>
              <CardTitle>Simple Logout Buttons</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <SimpleLogoutButton variant="default" text="Default Button" />
              <SimpleLogoutButton variant="outline" text="Outline Button" />
              <SimpleLogoutButton variant="destructive" text="Destructive Button" />
              <SimpleLogoutButton variant="secondary" text="Secondary Button" />
            </CardContent>
          </Card>

          {/* Logout Dialog */}
          <Card>
            <CardHeader>
              <CardTitle>Logout Dialog</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <LogoutDialog>
                <Button variant="outline" className="w-full">
                  Logout with Confirmation
                </Button>
              </LogoutDialog>
              
              <LogoutDialog showConfirmation={false}>
                <Button variant="secondary" className="w-full">
                  Logout without Confirmation
                </Button>
              </LogoutDialog>
            </CardContent>
          </Card>

          {/* Advanced Options */}
          <Card>
            <CardHeader>
              <CardTitle>Advanced Logout Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <LogoutOptions>
                <Button variant="outline" className="w-full">
                  Logout Options Menu
                </Button>
              </LogoutOptions>
              
              <EmergencyLogoutButton />
            </CardContent>
          </Card>

          {/* Emergency */}
          <Card>
            <CardHeader>
              <CardTitle>Emergency Logout</CardTitle>
            </CardHeader>
            <CardContent>
              <EmergencyLogout />
            </CardContent>
          </Card>
        </div>

        {status === "authenticated" ? (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <p className="text-green-800 text-center">
                ✅ You are logged in! All logout buttons above should work.
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-800 text-center">
                ❌ You are not logged in. Please sign in first to test logout functionality.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}