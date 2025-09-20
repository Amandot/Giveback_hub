# GiveBack Hub - Complete Setup Guide

## 🚀 New Features Implemented

### 1. **Separate User & Admin Authentication**
- **Users**: Login at `/auth/user-login` with Google OAuth or email/password
- **Admins**: Login at `/auth/admin-login` with email/password only
- Role-based redirects: Users → `/dashboard`, Admins → `/admin/dashboard`

### 2. **Donation Management System**
- Users can submit item donations at `/donate`
- Donations are saved with status: `PENDING`, `APPROVED`, `REJECTED`
- Admin receives email notification for new donations

### 3. **Email Notifications**
- **Admin Notification**: When donation is submitted
- **Donor Confirmation**: When donation status is updated
- Uses Nodemailer with Gmail SMTP

### 4. **Admin Dashboard**
- View all donations in a table
- Approve/Reject pending donations
- Statistics and metrics display
- Real-time status updates

### 5. **Role-Based Route Protection**
- Middleware automatically redirects based on user roles
- Protected routes: `/admin/*` (admin only), `/dashboard` (user only), `/donate` (user only)

## 📋 Setup Instructions

### Step 1: Environment Variables
Update your `.env.local` file with the following:

```env
# Google OAuth Credentials
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret

# Database Configuration
DATABASE_URL="mongodb://localhost:27017/giveback-hub"
# OR use MongoDB Atlas:
# DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/giveback-hub"

# Email Configuration (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
ADMIN_EMAIL=admin@givebackhub.org

# Admin Creation Secret
ADMIN_CREATION_SECRET=your-secret-key-here
```

### Step 2: Gmail App Password Setup
1. Go to Google Account Settings → Security
2. Enable 2-Factor Authentication
3. Generate an App Password for "Mail"
4. Use this password in `EMAIL_PASS` (not your regular Gmail password)

### Step 3: Database Setup

#### Option A: Local MongoDB
```bash
# Install MongoDB locally
# On Windows with chocolatey:
choco install mongodb

# Start MongoDB service
mongod

# The DATABASE_URL should be: mongodb://localhost:27017/giveback-hub
```

#### Option B: MongoDB Atlas (Cloud)
1. Create free account at https://mongodb.com/atlas
2. Create cluster and database
3. Get connection string and update `DATABASE_URL`

### Step 4: Install Dependencies & Initialize
```bash
# Install all dependencies
npm install

# Generate Prisma client
npx prisma generate

# Push database schema
npx prisma db push

# Run setup script to create admin user
node scripts/setup.js
```

### Step 5: Run the Application
```bash
npm run dev
```

Visit http://localhost:3000

## 🔐 Default Credentials

**Admin Login**: http://localhost:3000/auth/admin-login
- **Email**: admin@givebackhub.org
- **Password**: admin123456

**User Login**: http://localhost:3000/auth/user-login
- Use Google Sign-in or create account with email/password

## 📁 Project Structure

```
app/
├── api/
│   ├── auth/[...nextauth]/route.ts    # NextAuth configuration
│   ├── donations/route.ts             # Donation CRUD operations
│   ├── donations/[id]/route.ts        # Update donation status
│   └── admin/create-user/route.ts     # Create admin accounts
├── auth/
│   ├── user-login/page.tsx            # User login page
│   └── admin-login/page.tsx           # Admin login page
├── admin/
│   └── dashboard/page.tsx             # Admin dashboard
├── donate/page.tsx                    # Donation form
├── dashboard/page.tsx                 # User dashboard (existing)
└── profile/page.tsx                   # User profile (existing)

lib/
├── prisma.ts                          # Prisma client
├── mail.ts                            # Email notification system
└── auth.ts                            # Auth utilities

prisma/
└── schema.prisma                      # Database schema

middleware.ts                          # Route protection
```

## 🎯 User Flows

### For Donors (Users)
1. Visit `/auth/user-login`
2. Sign in with Google or email/password
3. Redirected to `/dashboard` (personalized)
4. Click "Donate Now" or visit `/donate`
5. Fill donation form (item, quantity, description)
6. Receive email confirmation when status changes

### For NGO Staff (Admins)
1. Visit `/auth/admin-login`
2. Sign in with admin credentials
3. Redirected to `/admin/dashboard`
4. View pending donations in table
5. Click "Approve" or "Reject" buttons
6. Donor automatically receives email notification

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/[...nextauth]` - NextAuth handlers

### Donations
- `GET /api/donations` - Get donations (filtered by role)
- `POST /api/donations` - Create new donation (user only)
- `PATCH /api/donations/[id]` - Update donation status (admin only)

### Admin
- `POST /api/admin/create-user` - Create admin accounts (protected)

## 🛠 Database Schema

```prisma
model User {
  id            String    @id @default(auto()) @map("_id") @db.ObjectId
  email         String    @unique
  name          String?
  password      String?   // For admin credentials
  role          Role      @default(USER)
  donations     Donation[]
  // ... other fields
}

model Donation {
  id          String         @id @default(auto()) @map("_id") @db.ObjectId
  userId      String         @db.ObjectId
  itemName    String
  quantity    Int
  description String
  status      DonationStatus @default(PENDING)
  createdAt   DateTime       @default(now())
  updatedAt   DateTime       @updatedAt
  user        User           @relation(fields: [userId], references: [id])
}

enum Role {
  USER
  ADMIN
}

enum DonationStatus {
  PENDING
  APPROVED
  REJECTED
}
```

## 📧 Email Templates

The system sends two types of emails:

1. **Admin Notification** - When user submits donation
2. **Donor Confirmation** - When admin approves/rejects donation

Both use HTML templates with proper styling and include relevant information.

## 🔒 Security Features

- **Role-based Authentication**: Separate login flows for users and admins
- **Route Protection**: Middleware prevents unauthorized access
- **Password Hashing**: bcrypt with salt rounds
- **Session Management**: NextAuth handles JWT tokens
- **Input Validation**: Server-side validation for all forms

## 🚀 Production Deployment

### Environment Variables for Production
```env
NEXTAUTH_URL=https://your-domain.com
DATABASE_URL="your-production-mongodb-url"
EMAIL_USER=your-production-email
EMAIL_PASS=your-production-email-password
ADMIN_EMAIL=admin@your-domain.com
NEXTAUTH_SECRET="your-strong-secret-key"
ADMIN_CREATION_SECRET="your-admin-creation-secret"
```

### Deployment Steps
1. Update environment variables
2. Run `npx prisma generate`
3. Run `npx prisma db push`
4. Deploy to Vercel, Netlify, or your preferred platform

## 📞 Support

For issues or questions:
1. Check the console for error messages
2. Verify all environment variables are set correctly
3. Ensure database is running and accessible
4. Check email configuration if notifications aren't working

## 🔄 Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Database commands
npx prisma generate          # Generate Prisma client
npx prisma db push          # Push schema to database
npx prisma studio           # Open database browser

# Create admin user
node scripts/setup.js

# Reset database (caution!)
npx prisma db push --force-reset
```

This completes the comprehensive donation management system with role-based authentication, email notifications, and admin dashboard! 🎉