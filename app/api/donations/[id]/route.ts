import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { sendDonorConfirmation } from '@/lib/mail'

interface Params {
  params: {
    id: string
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Only admins can update donation status.' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { status } = body

    if (!status || !['APPROVED', 'REJECTED'].includes(status)) {
      return NextResponse.json(
        { message: 'Status must be either APPROVED or REJECTED.' },
        { status: 400 }
      )
    }

    const donationId = params.id

    // First, fetch the current donation with user info
    const currentDonation = await prisma.donation.findUnique({
      where: { id: donationId },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          }
        }
      }
    })

    if (!currentDonation) {
      return NextResponse.json(
        { message: 'Donation not found.' },
        { status: 404 }
      )
    }

    if (currentDonation.status !== 'PENDING') {
      return NextResponse.json(
        { message: 'Only pending donations can be updated.' },
        { status: 400 }
      )
    }

    // Update the donation status
    const updatedDonation = await prisma.donation.update({
      where: { id: donationId },
      data: { status },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          }
        }
      }
    })

    // Send confirmation email to donor
    try {
      await sendDonorConfirmation({
        donorName: updatedDonation.user.name || 'Donor',
        donorEmail: updatedDonation.user.email,
        itemName: updatedDonation.itemName,
        quantity: updatedDonation.quantity,
        status: status as 'APPROVED' | 'REJECTED',
        donationId: updatedDonation.id,
      })
    } catch (emailError) {
      console.error('Failed to send donor confirmation:', emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json(
      {
        message: `Donation ${status.toLowerCase()} successfully!`,
        donation: {
          id: updatedDonation.id,
          itemName: updatedDonation.itemName,
          quantity: updatedDonation.quantity,
          status: updatedDonation.status,
          updatedAt: updatedDonation.updatedAt,
        }
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error updating donation status:', error)
    return NextResponse.json(
      { message: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    )
  }
}