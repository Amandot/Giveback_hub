import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"
import { sendDonorConfirmation } from "@/lib/mail"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Try to get the admin's NGO (optional)
    const ngo = await prisma.nGO.findUnique({
      where: {
        adminId: session.user.id
      }
    })

    // Fetch donations for this NGO (if admin has one) or all donations (if admin has no NGO)
    const donations = await prisma.donation.findMany({
      where: ngo ? {
        ngoId: ngo.id
      } : {}, // If no NGO, show all donations
      select: {
        id: true,
        donationType: true,
        itemName: true,
        quantity: true,
        description: true,
        amount: true,
        status: true,
        adminNotes: true,
        ngoId: true,
        createdAt: true,
        updatedAt: true,
        // Include pickup service fields
        needsPickup: true,
        pickupDate: true,
        pickupTime: true,
        pickupAddress: true,
        pickupNotes: true,
        pickupStatus: true,
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
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Fetch pool donations (donations without NGO assignment)
    const poolDonations = await prisma.donation.findMany({
      where: {
        ngoId: null,
        status: "PENDING" // Only show pending pool donations
      },
      select: {
        id: true,
        donationType: true,
        itemName: true,
        quantity: true,
        description: true,
        amount: true,
        status: true,
        adminNotes: true,
        ngoId: true,
        createdAt: true,
        updatedAt: true,
        // Include pickup service fields
        needsPickup: true,
        pickupDate: true,
        pickupTime: true,
        pickupAddress: true,
        pickupNotes: true,
        pickupStatus: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Calculate statistics
    const allDonations = [...donations, ...poolDonations]
    const stats = {
      totalDonations: donations.length,
      pendingDonations: donations.filter(d => d.status === "PENDING").length,
      approvedDonations: donations.filter(d => d.status === "APPROVED").length,
      rejectedDonations: donations.filter(d => d.status === "REJECTED").length,
      poolDonations: poolDonations.length,
      // Add pickup service statistics
      pickupRequests: allDonations.filter(d => d.needsPickup === true).length,
      pendingPickups: allDonations.filter(d => d.needsPickup === true && (d.pickupStatus === 'SCHEDULED' || d.pickupStatus === 'IN_PROGRESS')).length
    }

    return NextResponse.json({
      donations,
      poolDonations,
      stats
    })

  } catch (error) {
    console.error("Error fetching admin donations:", error)
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
    const { donationId, action, adminNotes } = body

    // Validation
    if (!donationId || !action) {
      return NextResponse.json(
        { error: 'Donation ID and action are required.' },
        { status: 400 }
      )
    }

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'Action must be either "approve" or "reject".' },
        { status: 400 }
      )
    }

    // Check if donation exists and belongs to admin's NGO or is from pool
    const donation = await prisma.donation.findUnique({
      where: { id: donationId },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        ngo: {
          select: {
            id: true,
            name: true,
            adminId: true
          }
        }
      }
    })

    if (!donation) {
      return NextResponse.json(
        { error: 'Donation not found.' },
        { status: 404 }
      )
    }

    // Check if admin can manage this donation
    const adminNgo = await prisma.nGO.findUnique({
      where: { adminId: session.user.id }
    })

    // If admin has no NGO, they can manage all donations (super admin)
    // If admin has NGO, they can only manage their NGO's donations or pool donations
    if (adminNgo) {
      const canManage = donation.ngoId === null || donation.ngoId === adminNgo.id
      
      if (!canManage) {
        return NextResponse.json(
          { error: 'You can only manage donations for your NGO or from the general pool.' },
          { status: 403 }
        )
      }
    }
    // If adminNgo is null, admin can manage all donations (super admin access)

    if (donation.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Only pending donations can be approved or rejected.' },
        { status: 400 }
      )
    }

    // Update donation status
    const newStatus = action === 'approve' ? 'APPROVED' : 'REJECTED'
    const updatedDonation = await prisma.donation.update({
      where: { id: donationId },
      data: {
        status: newStatus,
        adminNotes: adminNotes || null,
        ngoId: donation.ngoId || (adminNgo ? adminNgo.id : null), // Assign to admin's NGO if they have one
        updatedAt: new Date()
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        ngo: {
          select: {
            name: true
          }
        }
      }
    })

    console.log(`Donation ${donationId} ${action}d by admin ${session.user.id} ${adminNgo ? `(NGO: ${adminNgo.name})` : '(Super Admin)'}`)

    // Send email notification to the donor
    try {
      await sendDonorConfirmation({
        donorName: updatedDonation.user.name || 'Donor',
        donorEmail: updatedDonation.user.email,
        itemName: updatedDonation.donationType === 'MONEY' ? `Money Donation (₹${updatedDonation.amount})` : updatedDonation.itemName,
        quantity: updatedDonation.quantity,
        status: newStatus,
        donationId: updatedDonation.id,
        adminNotes: updatedDonation.adminNotes || undefined
      })
      console.log(`Email notification sent to ${updatedDonation.user.email}`)
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      message: `Donation ${action}d successfully.`,
      donation: {
        id: updatedDonation.id,
        status: updatedDonation.status,
        updatedAt: updatedDonation.updatedAt,
        adminNotes: updatedDonation.adminNotes,
        ngoId: updatedDonation.ngoId
      }
    }, { status: 200 })

  } catch (error) {
    console.error('Error updating donation status:', error)
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    )
  }
}
