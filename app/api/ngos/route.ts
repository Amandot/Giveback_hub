import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    // Fetch all NGOs with their location data for map display
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
        createdAt: true
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