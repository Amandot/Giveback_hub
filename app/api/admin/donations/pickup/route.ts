import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { donationId, pickupStatus } = body

    // Validation
    if (!donationId || !pickupStatus) {
      return NextResponse.json(
        { error: 'Donation ID and pickup status are required.' },
        { status: 400 }
      )
    }

    const validStatuses = ['NOT_REQUIRED', 'SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']
    if (!validStatuses.includes(pickupStatus)) {
      return NextResponse.json(
        { error: 'Invalid pickup status.' },
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
          { error: 'You can only manage pickup status for donations assigned to your NGO or from the general pool.' },
          { status: 403 }
        )
      }
    }

    // Update pickup status
    const updatedDonation = await prisma.donation.update({
      where: { id: donationId },
      data: {
        pickupStatus: pickupStatus,
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

    console.log(`Pickup status for donation ${donationId} updated to ${pickupStatus} by admin ${session.user.id}`)

    return NextResponse.json({
      message: `Pickup status updated to ${pickupStatus.toLowerCase().replace('_', ' ')}.`,
      donation: {
        id: updatedDonation.id,
        pickupStatus: updatedDonation.pickupStatus,
        updatedAt: updatedDonation.updatedAt
      }
    }, { status: 200 })

  } catch (error) {
    console.error('Error updating pickup status:', error)
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    )
  }
}