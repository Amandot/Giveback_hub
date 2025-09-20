# Email Notification Setup Guide

## 🎯 What This Does
When admins approve or reject donations, users will automatically receive email notifications with:
- ✅ **Approval emails**: Congratulating users and next steps
- ❌ **Rejection emails**: Explaining why the donation couldn't be accepted  
- 📝 **Admin notes**: Personal messages from admins to users

## 🔧 Setup Instructions

### Step 1: Get Gmail App Password
1. **Enable 2FA** on your Gmail account (if not already enabled)
2. **Go to** [Google App Passwords](https://myaccount.google.com/apppasswords)
3. **Generate** an app password for "Mail"
4. **Copy** the 16-character password (example: `abcd efgh ijkl mnop`)

### Step 2: Update Environment Variables
Add these to your `.env.local` file:

```bash
# Email Configuration
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-app-password-here
ADMIN_EMAIL=admin-notifications@gmail.com
```

**Example:**
```bash
EMAIL_USER=ngo.donations@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop
ADMIN_EMAIL=admin@yourngohub.com
```

### Step 3: Restart Your Server
```bash
npm run dev -- -p 3000
```

## 📧 Email Templates

### ✅ **Approval Email**
```
✅ Donation Approved

Dear [User Name],

Great news! Your donation has been approved.
Our team will contact you soon regarding the collection details.

Donation Details:
- Item: Food & Beverages  
- Quantity: 3
- Status: Approved
- ID: abc123

[Message from Admin: "Thank you for your generous donation!"]

Thank you for your generosity and support!
```

### ❌ **Rejection Email**
```
❌ Donation Rejected

Dear [User Name],

Unfortunately, we cannot accept this donation at this time.
This may be due to current inventory levels or other operational considerations.

[Message from Admin: "We currently have enough of these items, but please try again next month!"]
```

## 🧪 Testing Email Setup

### Method 1: Test Connection (Coming Soon)
We'll add a test email button to the admin dashboard.

### Method 2: Test with Real Donation
1. User submits a donation
2. Admin approves/rejects it
3. Check if user receives email

## 🔍 Troubleshooting

### Common Issues:

**"Missing credentials for PLAIN"**
- ❌ EMAIL_USER or EMAIL_PASS not set
- ✅ Add them to `.env.local` and restart server

**"Invalid login"**
- ❌ Using regular Gmail password instead of app password
- ✅ Generate and use Gmail app password

**"Authentication failed"**
- ❌ 2FA not enabled on Gmail
- ✅ Enable 2FA first, then generate app password

### Check Logs:
```bash
# Look for these in terminal:
✅ "Email notification sent to user@example.com"
❌ "Failed to send email notification: [error]"
```

## 🚀 Features Included

✅ **Auto-send on approval/rejection**
✅ **Beautiful HTML email templates**  
✅ **Admin notes included in emails**
✅ **Both money & item donation support**
✅ **Proper error handling** (won't crash if email fails)
✅ **Responsive email design**

## 📧 Email Examples

The system sends professional emails with:
- 🎨 **Branded styling** with colors and icons
- 📱 **Mobile-friendly** HTML design
- 💬 **Personal admin messages**
- 🔗 **Action buttons** and links
- 📋 **Clear donation details**

Once configured, emails will be sent automatically whenever admins take action on donations!