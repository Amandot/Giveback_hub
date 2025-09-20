import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const pathname = req.nextUrl.pathname

    // Allow access to login, auth pages, and admin-signup
    if (pathname.startsWith('/auth/') || pathname === '/login' || pathname === '/admin-signup') {
      // If user is already authenticated, redirect based on role
      if (token) {
        if (token.role === 'ADMIN') {
          return NextResponse.redirect(new URL('/admin', req.url))
        } else {
          return NextResponse.redirect(new URL('/dashboard', req.url))
        }
      }
      return NextResponse.next()
    }

    // Protect admin routes (including /admin and /admin/*)
    if (pathname.startsWith('/admin/') || pathname === '/admin') {
      if (!token) {
        return NextResponse.redirect(new URL('/auth/admin-login', req.url))
      }
      if (token.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }
      return NextResponse.next()
    }

    // Protect user dashboard
    if (pathname.startsWith('/dashboard')) {
      if (!token) {
        return NextResponse.redirect(new URL('/auth/user-login', req.url))
      }
      if (token.role === 'ADMIN') {
        return NextResponse.redirect(new URL('/admin', req.url))
      }
      return NextResponse.next()
    }

    // Protect donation page (user only)
    if (pathname.startsWith('/donate')) {
      if (!token) {
        return NextResponse.redirect(new URL('/auth/user-login', req.url))
      }
      if (token.role === 'ADMIN') {
        return NextResponse.redirect(new URL('/admin', req.url))
      }
      return NextResponse.next()
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname

        // Always allow access to public pages
        if (pathname === '/' || 
            pathname.startsWith('/about') || 
            pathname.startsWith('/projects') || 
            pathname.startsWith('/services') ||
            pathname.startsWith('/contact') ||
            pathname.startsWith('/map') ||
            pathname.startsWith('/api/auth') ||
            pathname.startsWith('/_next') ||
            pathname.includes('.')) {
          return true
        }

        // For protected routes, check if user is authenticated
        if (pathname.startsWith('/admin/') || 
            pathname === '/admin' ||
            pathname.startsWith('/dashboard') || 
            pathname.startsWith('/donate') ||
            pathname.startsWith('/profile')) {
          return !!token
        }

        // Auth pages don't need token but we handle them in the main middleware
        if (pathname.startsWith('/auth/')) {
          return true
        }

        return true
      },
    },
  }
)

export const config = {
  matcher: [
    '/admin/:path*',
    '/admin',
    '/admin-signup',
    '/dashboard/:path*',
    '/donate/:path*',
    '/auth/:path*',
    '/profile/:path*'
  ]
}
