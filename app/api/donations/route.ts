import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { sendAdminNotification } from '@/lib/mail'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { message: 'You must be logged in to submit a donation.' },
        { status: 401 }
      )
    }

    if (session.user.role !== 'USER') {
      return NextResponse.json(
        { message: 'Only users can submit donations.' },
        { status: 403 }
      )
    }

    const body = await request.json()
    
    // Debug logging
    console.log('Received request body:', body)
    console.log('Session data:', session)
    console.log('User ID:', session?.user?.id)
    
    const { 
      donationType, 
      itemName, 
      quantity, 
      description, 
      amount, 
      donationCategory,
      ngoId,
      // Pickup service fields
      needsPickup,
      pickupDate,
      pickupTime,
      pickupAddress,
      pickupNotes
    } = body

    // Validation based on donation type
    if (!donationType || (donationType !== 'MONEY' && donationType !== 'ITEMS')) {
      return NextResponse.json(
        { message: 'Donation type must be either "MONEY" or "ITEMS".' },
        { status: 400 }
      )
    }

    // For money donations
    if (donationType === 'MONEY') {
      if (!amount || typeof amount !== 'number' || amount <= 0) {
        return NextResponse.json(
          { message: 'Valid amount is required for money donations.' },
          { status: 400 }
        )
      }
    }

    // For item donations
    if (donationType === 'ITEMS') {
      if (!itemName) {
        return NextResponse.json(
          { message: 'Item name is required for item donations.' },
          { status: 400 }
        )
      }
    }

    // Additional validation for item donations
    if (donationType === 'ITEMS') {
      if (typeof itemName !== 'string' || itemName.trim().length === 0) {
        return NextResponse.json(
          { message: 'Item name must be a valid string.' },
          { status: 400 }
        )
      }

      // Validate quantity only if provided
      if (quantity !== undefined && quantity !== null && (!Number.isInteger(quantity) || quantity <= 0)) {
        return NextResponse.json(
          { message: 'Quantity must be a positive integer.' },
          { status: 400 }
        )
      }

      // Validate description only if provided
      if (description !== undefined && description !== null && typeof description === 'string' && description.trim().length === 0) {
        return NextResponse.json(
          { message: 'Description cannot be empty if provided.' },
          { status: 400 }
        )
      }
    }

    // Validate pickup service for item donations
    if (donationType === 'ITEMS' && needsPickup) {
      if (!pickupDate || !pickupTime || !pickupAddress) {
        return NextResponse.json(
          { message: 'Pickup date, time, and address are required when pickup service is requested.' },
          { status: 400 }
        )
      }
      
      // Validate pickup date is not in the past
      const pickupDateTime = new Date(`${pickupDate}T${pickupTime}`)
      if (pickupDateTime < new Date()) {
        return NextResponse.json(
          { message: 'Pickup date and time cannot be in the past.' },
          { status: 400 }
        )
      }
    }

    // Validate NGO if provided
    if (ngoId && typeof ngoId === 'string' && ngoId.trim() !== '') {
      const ngo = await prisma.nGO.findUnique({
        where: { id: ngoId.trim() }
      })
      
      if (!ngo) {
        return NextResponse.json(
          { message: 'Selected NGO not found.' },
          { status: 400 }
        )
      }
    }

    // Create donation in database
    const donationData: any = {
      userId: session.user.id,
      donationType: donationType,
      status: 'PENDING',
      ngoId: (ngoId && ngoId.trim() !== '' && ngoId !== 'null') ? ngoId.trim() : null,
    }

    // Add type-specific fields
    if (donationType === 'MONEY') {
      donationData.amount = amount
      donationData.itemName = 'Money Donation'
      donationData.quantity = 1
      donationData.description = `Money donation of ₹${amount}`
    } else {
      donationData.itemName = itemName.trim()
      donationData.quantity = quantity ? parseInt(quantity) : 1
      donationData.description = description ? description.trim() : itemName.trim()
      
      // Add image URL if provided
      if (body.imageUrl) {
        donationData.imageUrl = body.imageUrl
      }
      
      // Add pickup service fields for item donations
      donationData.needsPickup = needsPickup || false
      if (needsPickup) {
        donationData.pickupDate = new Date(pickupDate)
        donationData.pickupTime = pickupTime
        donationData.pickupAddress = pickupAddress.trim()
        donationData.pickupNotes = pickupNotes ? pickupNotes.trim() : null
        donationData.pickupStatus = 'SCHEDULED'
      }
    }

    const donation = await prisma.donation.create({
      data: donationData,
      include: {
        user: {
          select: {
            name: true,
            email: true,
          }
        },
        ngo: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    })

    // Send email notification to admin
    try {
      await sendAdminNotification({
        donorName: donation.user.name || 'Unknown',
        donorEmail: donation.user.email,
        itemName: donation.itemName,
        quantity: donation.quantity,
        description: donation.description,
        donationId: donation.id,
      })
    } catch (emailError) {
      console.error('Failed to send admin notification:', emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json(
      {
        message: 'Donation submitted successfully!',
        donation: {
          id: donation.id,
          itemName: donation.itemName,
          quantity: donation.quantity,
          status: donation.status,
          createdAt: donation.createdAt,
        }
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Error creating donation:', error)
    return NextResponse.json(
      { message: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    let whereClause: any = {}

    // If user is not admin, only show their own donations
    if (session.user.role !== 'ADMIN') {
      whereClause.userId = session.user.id
    }

    // Filter by status if provided
    if (status && ['PENDING', 'APPROVED', 'REJECTED'].includes(status)) {
      whereClause.status = status
    }

    const donations = await prisma.donation.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            name: true,
            email: true,
          }
        },
        ngo: {
          select: {
            id: true,
            name: true,
          }
        }
      },
      orderBy: [
        { status: 'asc' }, // PENDING first
        { createdAt: 'desc' }
      ]
    })

    return NextResponse.json({ donations }, { status: 200 })

  } catch (error) {
    console.error('Error fetching donations:', error)
    return NextResponse.json(
      { message: 'An unexpected error occurred.' },
      { status: 500 }
    )
  }
}