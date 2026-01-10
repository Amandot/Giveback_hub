"use client"

import Link from "next/link"
import { useSession } from "next-auth/react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogoutDialog } from "@/components/logout-dialog"
import { 
  Home, 
  Heart, 
  Users, 
  MapPin, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  BarChart3,
  UserCheck,
  Building2
} from "lucide-react"

export function DashboardNav() {
  const { data: session, status } = useSession()
  const [isOpen, setIsOpen] = useState(false)

  if (status === "loading") {
    return (
      <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="animate-pulse h-8 bg-gray-200 rounded w-32"></div>
            <div className="animate-pulse h-8 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
      </div>
    )
  }

  if (status === "unauthenticated") {
    return null
  }

  const user = session?.user
  const userInitials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'
  const isAdmin = user?.role === 'admin' || user?.email?.includes('admin')



  const navigationItems = [
    { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
    { href: "/donate", label: "Donate", icon: Heart },

    { href: "/map", label: "Find NGOs", icon: MapPin },
    ...(isAdmin ? [
      { href: "/admin", label: "Admin Panel", icon: UserCheck },
      { href: "/admin/ngos", label: "Manage NGOs", icon: Building2 }
    ] : [])
  ]


  return (
    <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b border-border shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            {/* <Link href="/dashboard" className="text-2xl font-bold text-primary smooth-hover hover:scale-105 flex items-center gap-2">
              <Link href="/public/give back.png className="h-8 w-8" />
              GiveBack Hub
            </Link> */}
            <Link 
  href="/dashboard" 
  className="text-2xl font-bold text-primary smooth-hover hover:scale-105 flex items-center gap-2"
>
  {/* changed Link to img, fixed path, added alt text */}
  <img src="/give back.png" alt="Logo" className="h-8 w-8" />
  GiveBack Hub
</Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navigationItems.map((item) => {
              const IconComponent = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-foreground hover:text-primary smooth-hover relative group flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent/50"
                >
                  <IconComponent className="h-4 w-4" />
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                </Link>
              )
            })}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user?.image || ""} alt={user?.name || "User"} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                    {isAdmin && (
                      <div className="mt-1">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary">
                          Admin
                        </span>
                      </div>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="w-full flex items-center cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="w-full flex items-center cursor-pointer">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <LogoutDialog redirectTo="/">
                  <span className="flex items-center w-full text-destructive hover:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </span>
                </LogoutDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.image || ""} alt={user?.name || "User"} />
              <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)} className="smooth-hover">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden transition-all duration-300 ease-out ${
            isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-border">
            {navigationItems.map((item) => {
              const IconComponent = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-3 py-2 text-foreground hover:text-primary smooth-hover hover:bg-accent rounded-md flex items-center gap-2"
                  onClick={() => setIsOpen(false)}
                >
                  <IconComponent className="h-4 w-4" />
                  {item.label}
                </Link>
              )
            })}
            <hr className="my-2 border-border" />
            <Link
              href="/profile"
              className="block px-3 py-2 text-foreground hover:text-primary smooth-hover hover:bg-accent rounded-md flex items-center gap-2"
              onClick={() => setIsOpen(false)}
            >
              <Settings className="h-4 w-4" />
              Profile
            </Link>
            <div className="px-3 py-2">
              <LogoutDialog 
                redirectTo="/" 
                showConfirmation={true}
                variant="ghost"
                size="sm"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Log out
              </LogoutDialog>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}