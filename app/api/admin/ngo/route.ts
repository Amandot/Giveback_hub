import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Fetch NGO data for this admin
    const ngo = await prisma.nGO.findUnique({
      where: {
        adminId: session.user.id
      },
      include: {
        admin: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    if (!ngo) {
      return NextResponse.json({ error: "NGO not found" }, { status: 404 })
    }

    return NextResponse.json({ ngo })

  } catch (error) {
    console.error("Error fetching NGO:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const updateData = await request.json()

    // Update NGO data
    const updatedNGO = await prisma.nGO.update({
      where: {
        adminId: session.user.id
      },
      data: {
        name: updateData.name,
        email: updateData.email,
        description: updateData.description,
        address: updateData.address,
        phone: updateData.phone,
        website: updateData.website,
        latitude: updateData.latitude ? parseFloat(updateData.latitude) : undefined,
        longitude: updateData.longitude ? parseFloat(updateData.longitude) : undefined
      }
    })

    return NextResponse.json({ 
      message: "NGO updated successfully", 
      ngo: updatedNGO 
    })

  } catch (error) {
    console.error("Error updating NGO:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}