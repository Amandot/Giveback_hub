import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { donationId } = await request.json()

    if (!donationId) {
      return NextResponse.json({ error: "Donation ID is required" }, { status: 400 })
    }

    // Get the admin's NGO
    const ngo = await prisma.nGO.findUnique({
      where: {
        adminId: session.user.id
      }
    })

    if (!ngo) {
      return NextResponse.json({ error: "NGO not found" }, { status: 404 })
    }

    // Verify the donation exists and is in the pool (no NGO assigned)
    const donation = await prisma.donation.findUnique({
      where: {
        id: donationId
      }
    })

    if (!donation) {
      return NextResponse.json({ error: "Donation not found" }, { status: 404 })
    }

    if (donation.ngoId !== null) {
      return NextResponse.json({ error: "Donation is already assigned to an NGO" }, { status: 400 })
    }

    if (donation.status !== "PENDING") {
      return NextResponse.json({ error: "Only pending donations can be accepted" }, { status: 400 })
    }

    // Assign the donation to this NGO
    const updatedDonation = await prisma.donation.update({
      where: {
        id: donationId
      },
      data: {
        ngoId: ngo.id,
        status: "APPROVED" // Automatically approve when accepted from pool
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        ngo: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    return NextResponse.json({
      message: "Donation accepted successfully",
      donation: updatedDonation
    })

  } catch (error) {
    console.error("Error accepting donation:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}