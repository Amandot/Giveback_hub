import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const { admin, ngo } = await request.json()

    // Validate required fields
    if (!admin?.name || !admin?.email || !admin?.password) {
      return NextResponse.json(
        { error: "Admin name, email, and password are required" },
        { status: 400 }
      )
    }

    if (!ngo?.name || !ngo?.email || !ngo?.description || 
        ngo?.latitude === undefined || ngo?.longitude === undefined) {
      return NextResponse.json(
        { error: "NGO name, email, description, and location are required" },
        { status: 400 }
      )
    }

    // Check if admin email already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: admin.email }
    })

    if (existingAdmin) {
      return NextResponse.json(
        { error: "Admin email already exists" },
        { status: 400 }
      )
    }

    // Check if NGO email already exists
    const existingNGO = await prisma.nGO.findUnique({
      where: { email: ngo.email }
    })

    if (existingNGO) {
      return NextResponse.json(
        { error: "NGO email already exists" },
        { status: 400 }
      )
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(admin.password, 12)

    // Create admin user and NGO in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create admin user
      const newAdmin = await tx.user.create({
        data: {
          name: admin.name,
          email: admin.email,
          password: hashedPassword,
          role: "ADMIN"
        }
      })

      // Create NGO
      const newNGO = await tx.nGO.create({
        data: {
          name: ngo.name,
          email: ngo.email,
          description: ngo.description,
          address: ngo.address || null,
          phone: ngo.phone || null,
          website: ngo.website || null,
          latitude: parseFloat(ngo.latitude),
          longitude: parseFloat(ngo.longitude),
          city: "Mumbai", // Default to Mumbai as specified
          adminId: newAdmin.id
        }
      })

      return { admin: newAdmin, ngo: newNGO }
    })

    return NextResponse.json({
      message: "NGO registration successful",
      admin: {
        id: result.admin.id,
        name: result.admin.name,
        email: result.admin.email,
        role: result.admin.role
      },
      ngo: {
        id: result.ngo.id,
        name: result.ngo.name,
        email: result.ngo.email
      }
    })

  } catch (error) {
    console.error("Admin signup error:", error)
    
    if (error instanceof Error) {
      // Handle Prisma unique constraint errors
      if (error.message.includes("Unique constraint")) {
        return NextResponse.json(
          { error: "Email already exists" },
          { status: 400 }
        )
      }
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}