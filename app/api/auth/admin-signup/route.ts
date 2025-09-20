import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// Admin registration key - in production, this should be in environment variables
const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY || 'ADMIN_SECRET_2024'

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, adminKey } = await req.json()

    // Validate required fields
    if (!name || !email || !password || !adminKey) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Validate admin key
    if (adminKey !== ADMIN_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Invalid admin registration key' },
        { status: 403 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      )
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create the admin user
    const newAdmin = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'ADMIN'
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Admin account created successfully',
      user: {
        id: newAdmin.id,
        name: newAdmin.name,
        email: newAdmin.email,
        role: newAdmin.role,
        createdAt: newAdmin.createdAt.toISOString()
      }
    })

  } catch (error) {
    console.error('Error creating admin account:', error)
    return NextResponse.json(
      { error: 'Failed to create admin account. Please try again.' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}