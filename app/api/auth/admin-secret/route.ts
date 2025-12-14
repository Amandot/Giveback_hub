import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const { secretKey, email, name } = await request.json()

    // Verify the secret key
    if (secretKey !== process.env.ADMIN_SECRET_KEY) {
      return NextResponse.json(
        { error: "Invalid secret key" },
        { status: 401 }
      )
    }

    if (!email || !name) {
      return NextResponse.json(
        { error: "Email and name are required" },
        { status: 400 }
      )
    }

    // Check if user already exists
    let user = await prisma.user.findUnique({
      where: { email }
    })

    if (user) {
      // Update existing user to admin role
      user = await prisma.user.update({
        where: { email },
        data: { 
          role: "ADMIN",
          name: name
        }
      })
    } else {
      // Create new admin user
      const hashedPassword = await bcrypt.hash("admin123", 12)
      user = await prisma.user.create({
        data: {
          email,
          name,
          password: hashedPassword,
          role: "ADMIN"
        }
      })
    }

    return NextResponse.json({
      success: true,
      message: "Admin account created/updated successfully",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    })

  } catch (error) {
    console.error("Admin secret key error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}