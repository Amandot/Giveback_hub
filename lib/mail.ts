import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Use App Password for Gmail
  },
})

interface DonationNotificationData {
  donorName: string
  donorEmail: string
  itemName: string
  quantity: number
  description: string
  donationId: string
}

interface StatusUpdateData {
  donorName: string
  donorEmail: string
  itemName: string
  quantity: number
  status: 'APPROVED' | 'REJECTED'
  donationId: string
  adminNotes?: string
}

export async function sendAdminNotification(data: DonationNotificationData) {
  const { donorName, donorEmail, itemName, quantity, description, donationId } = data
  
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">🎁 New Donation Submitted</h2>
      
      <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Donation Details</h3>
        <p><strong>Item Name:</strong> ${itemName}</p>
        <p><strong>Quantity:</strong> ${quantity}</p>
        <p><strong>Description:</strong> ${description}</p>
        <p><strong>Donation ID:</strong> ${donationId}</p>
      </div>
      
      <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Donor Information</h3>
        <p><strong>Name:</strong> ${donorName}</p>
        <p><strong>Email:</strong> ${donorEmail}</p>
      </div>
      
      <p style="margin-top: 30px;">
        Please review this donation in your admin dashboard and take appropriate action.
      </p>
      
      <div style="margin-top: 30px; text-align: center;">
        <a href="${process.env.NEXTAUTH_URL}/admin/dashboard" 
           style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
          View in Dashboard
        </a>
      </div>
    </div>
  `

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.ADMIN_EMAIL, // Admin email address
    subject: `New Donation: ${itemName} (${quantity} units)`,
    html: htmlContent,
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log('Admin notification sent successfully')
  } catch (error) {
    console.error('Error sending admin notification:', error)
    throw error
  }
}

export async function sendDonorConfirmation(data: StatusUpdateData) {
  const { donorName, donorEmail, itemName, quantity, status, donationId, adminNotes } = data
  
  const isApproved = status === 'APPROVED'
  const statusColor = isApproved ? '#16a34a' : '#dc2626'
  const statusIcon = isApproved ? '✅' : '❌'
  const statusText = isApproved ? 'Approved' : 'Rejected'
  
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: ${statusColor};">${statusIcon} Donation ${statusText}</h2>
      
      <p>Dear ${donorName},</p>
      
      <p>We wanted to update you on the status of your recent donation:</p>
      
      <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Donation Details</h3>
        <p><strong>Item Name:</strong> ${itemName}</p>
        <p><strong>Quantity:</strong> ${quantity}</p>
        <p><strong>Status:</strong> <span style="color: ${statusColor}; font-weight: bold;">${statusText}</span></p>
        <p><strong>Donation ID:</strong> ${donationId}</p>
      </div>
      
      ${isApproved 
        ? `<p style="color: #16a34a;">
             <strong>Great news!</strong> Your donation has been approved. 
             Our team will contact you soon regarding the collection details.
           </p>`
        : `<p style="color: #dc2626;">
             Unfortunately, we cannot accept this donation at this time. 
             This may be due to current inventory levels or other operational considerations.
           </p>`
      }
      
      ${adminNotes ? `
        <div style="background: #fef3c7; padding: 15px; border-radius: 6px; border-left: 4px solid #f59e0b; margin: 20px 0;">
          <h4 style="margin: 0 0 10px 0; color: #92400e;">Message from Admin:</h4>
          <p style="margin: 0; color: #92400e; font-style: italic;">${adminNotes}</p>
        </div>
      ` : ''}
      
      <p>Thank you for your generosity and support!</p>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 14px;">
          If you have any questions, please contact us at ${process.env.ADMIN_EMAIL}
        </p>
      </div>
    </div>
  `

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: donorEmail,
    subject: `Donation ${statusText}: ${itemName}`,
    html: htmlContent,
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log(`Donor confirmation email sent to ${donorEmail}`)
  } catch (error) {
    console.error('Error sending donor confirmation:', error)
    throw error
  }
}

export async function testEmailConnection() {
  try {
    await transporter.verify()
    console.log('Email server connection verified')
    return true
  } catch (error) {
    console.error('Email server connection failed:', error)
    return false
  }
}