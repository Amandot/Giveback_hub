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

    // Fetch all NGOs with admin information
    const ngos = await prisma.nGO.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        description: true,
        address: true,
        phone: true,
        website: true,
        latitude: true,
        longitude: true,
        city: true,
        createdAt: true,
        admin: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        _count: {
          select: {
            donations: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ ngos })

  } catch (error) {
    console.error("Error fetching NGOs:", error)
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

    const body = await request.json()
    const { ngoId, action, ...updateData } = body

    if (!ngoId) {
      return NextResponse.json({ error: "NGO ID is required" }, { status: 400 })
    }

    // Check if NGO exists
    const ngo = await prisma.nGO.findUnique({
      where: { id: ngoId }
    })

    if (!ngo) {
      return NextResponse.json({ error: "NGO not found" }, { status: 404 })
    }

    if (action === 'update') {
      // Update NGO information
      const updatedNGO = await prisma.nGO.update({
        where: { id: ngoId },
        data: {
          name: updateData.name || ngo.name,
          email: updateData.email || ngo.email,
          description: updateData.description !== undefined ? updateData.description : ngo.description,
          address: updateData.address !== undefined ? updateData.address : ngo.address,
          phone: updateData.phone !== undefined ? updateData.phone : ngo.phone,
          website: updateData.website !== undefined ? updateData.website : ngo.website,
          latitude: updateData.latitude !== undefined ? parseFloat(updateData.latitude) : ngo.latitude,
          longitude: updateData.longitude !== undefined ? parseFloat(updateData.longitude) : ngo.longitude,
          city: updateData.city || ngo.city
        }
      })

      return NextResponse.json({
        message: "NGO updated successfully",
        ngo: updatedNGO
      })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })

  } catch (error) {
    console.error("Error updating NGO:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const ngoId = searchParams.get('id')

    if (!ngoId) {
      return NextResponse.json({ error: "NGO ID is required" }, { status: 400 })
    }

    // Check if NGO exists and has donations
    const ngo = await prisma.nGO.findUnique({
      where: { id: ngoId },
      include: {
        _count: {
          select: {
            donations: true
          }
        }
      }
    })

    if (!ngo) {
      return NextResponse.json({ error: "NGO not found" }, { status: 404 })
    }

    if (ngo._count.donations > 0) {
      return NextResponse.json(
        { error: "Cannot delete NGO with existing donations. Please transfer or remove donations first." },
        { status: 400 }
      )
    }

    // Delete the NGO (this will also delete the associated admin user due to cascade)
    await prisma.nGO.delete({
      where: { id: ngoId }
    })

    return NextResponse.json({
      message: "NGO deleted successfully"
    })

  } catch (error) {
    console.error("Error deleting NGO:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}