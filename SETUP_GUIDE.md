# 🌟 GiveBack Hub - Complete Setup & Configuration Guide

## 🎯 Project Overview

GiveBack Hub is a modern, full-stack donation platform that connects generous donors with verified NGOs through seamless donation management, interactive maps, and comprehensive administrative tools.

### ✨ Key Features
- 🗺️ **Interactive Map-Based NGO Discovery**
- 💝 **Flexible Donation System** (Money & Items)
- 🚚 **Advanced Pickup Service** with scheduling & tracking
- 🛡️ **Comprehensive Admin Dashboard**
- 🔐 **Secure Multi-Provider Authentication**
- 📱 **Fully Responsive Design**
- ✨ **Smooth Animations** with GSAP & Barba.js
- 🎨 **Modern UI/UX** with Tailwind CSS
- 🔑 **Emergency Admin Access** with secret key system

## 🚀 Quick Start Installation

### Prerequisites
- Node.js 18+ and npm
- Git
- Google account (for OAuth setup)

### Step 1: Clone & Install
```bash
# Clone the repository
git clone <your-repo-url>
cd giveback-hub

# Install dependencies
npm install
```

### Step 2: Environment Configuration
Create a `.env.local` file in the project root:

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-here"

# Google OAuth (optional - can be configured later)
GOOGLE_CLIENT_ID="your-google-client-id-here"
GOOGLE_CLIENT_SECRET="your-google-client-secret-here"

# Email (optional - can be configured later)
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_FROM="your-email@gmail.com"

# Admin Secret Key for Emergency Access
ADMIN_SECRET_KEY="GIVEBACK_ADMIN_2024_SECRET"
```

### Step 3: Database Setup
```bash
# Generate Prisma client
npx prisma generate

# Initialize database
npx prisma db push
```

### Step 4: Start Development Server
```bash
npm run dev
```

Visit **http://localhost:3000** to see your application!

## 🔐 Authentication & Access

### Emergency Admin Access (Recommended for First Setup)
- **URL**: http://localhost:3000/auth/admin-secret
- **Secret Key**: `GIVEBACK_ADMIN_2024_SECRET` (from .env.local)
- **Process**: Enter secret key + email + name to create admin account
- **Default Password**: `admin123` (change after first login)

### Regular Admin Login
- **URL**: http://localhost:3000/auth/admin-login
- **Use**: Email and password credentials

### User Access
- **Google OAuth**: http://localhost:3000/auth/user-login
- **Credentials**: Email and password (if registered)

### NGO Registration
- **URL**: http://localhost:3000/admin-signup
- **Requirements**: Valid NGO information and location

## 🔧 Google OAuth Setup (Optional)

### Step 1: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project: "GiveBack Hub"
3. Enable Google+ API or Google Identity services

### Step 2: Create OAuth Credentials
1. Go to "APIs & Services" → "Credentials"
2. Create "OAuth 2.0 Client ID"
3. Configure OAuth consent screen
4. Set application type to "Web application"
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`

### Step 3: Update Environment Variables
Replace placeholders in `.env.local`:
```env
GOOGLE_CLIENT_ID="your-actual-client-id"
GOOGLE_CLIENT_SECRET="your-actual-client-secret"
```

### Step 4: Test OAuth
1. Restart development server
2. Visit user login page
3. Test "Sign in with Google" button

## 📧 Email Notifications Setup (Optional)

### Step 1: Gmail App Password
1. Enable 2FA on your Gmail account
2. Go to [Google App Passwords](https://myaccount.google.com/apppasswords)
3. Generate app password for "Mail"
4. Copy the 16-character password

### Step 2: Update Email Configuration
```env
EMAIL_SERVER_USER="your-gmail@gmail.com"
EMAIL_SERVER_PASSWORD="your-16-char-app-password"
EMAIL_FROM="your-gmail@gmail.com"
```

### Step 3: Test Email System
- Submit a donation as a user
- Approve/reject it as an admin
- Check if user receives email notification

## 🏗️ Project Architecture

### Technology Stack
- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS + Radix UI Components
- **Animations**: GSAP + Barba.js + Custom CSS
- **Database**: SQLite (dev) / PostgreSQL (production ready)
- **ORM**: Prisma 6.16.2
- **Authentication**: NextAuth.js
- **Email**: Nodemailer

### Project Structure
```
app/
├── api/                     # Backend API routes
│   ├── auth/               # Authentication endpoints
│   ├── donations/          # Donation management
│   ├── ngos/              # NGO management
│   └── admin/             # Admin operations
├── auth/                   # Authentication pages
│   ├── user-login/        # User login
│   ├── admin-login/       # Admin login
│   └── admin-secret/      # Emergency admin access
├── admin/                  # Admin dashboard
├── dashboard/              # User dashboard
├── donate/                 # Donation pages
├── map/                    # NGO discovery map
└── about/                  # About pages

components/                 # Reusable components
├── ui/                    # Base UI components
├── navigation.tsx         # Main navigation
├── scroll-reveal.tsx      # GSAP animations
└── particle-background.tsx # Interactive background

lib/
├── prisma.ts              # Database client
├── auth-providers.ts      # Auth configuration
└── mail.ts               # Email system

prisma/
├── schema.prisma          # Database schema
└── dev.db                # SQLite database
```

### Database Schema
```prisma
model User {
  id            String     @id @default(cuid())
  email         String     @unique
  name          String?
  password      String?
  role          Role       @default(USER)
  donations     Donation[]
  ngo           NGO?
}

model NGO {
  id          String     @id @default(cuid())
  name        String
  email       String     @unique
  latitude    Float
  longitude   Float
  adminId     String     @unique
  donations   Donation[]
  admin       User       @relation(fields: [adminId], references: [id])
}

model Donation {
  id            String         @id @default(cuid())
  userId        String
  donationType  DonationType   @default(ITEMS)
  itemName      String
  quantity      Int
  amount        Float?
  status        DonationStatus @default(PENDING)
  needsPickup   Boolean        @default(false)
  pickupDate    DateTime?
  pickupStatus  PickupStatus   @default(NOT_REQUIRED)
  user          User           @relation(fields: [userId], references: [id])
  ngo           NGO?           @relation(fields: [ngoId], references: [id])
}

enum Role { USER, ADMIN }
enum DonationStatus { PENDING, APPROVED, REJECTED }
enum DonationType { MONEY, ITEMS }
enum PickupStatus { NOT_REQUIRED, SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED }
```

## 🎨 UI/UX Features

### Modern Animations
- **GSAP ScrollTrigger**: Smooth scroll-based animations
- **Barba.js**: Seamless page transitions
- **Custom CSS**: Hover effects, loading states, micro-interactions
- **Particle Background**: Interactive floating particles

### Responsive Design
- Mobile-first approach
- Touch-friendly interface (44px minimum touch targets)
- Responsive navigation and layouts
- Optimized for all screen sizes

### Accessibility
- Keyboard navigation support
- Screen reader friendly
- High contrast ratios
- Focus indicators
- ARIA labels and descriptions

## 🚀 Production Deployment

### Environment Variables for Production
```env
# Update these for production
NEXTAUTH_URL="https://your-domain.com"
DATABASE_URL="your-production-database-url"
NEXTAUTH_SECRET="your-strong-production-secret"
ADMIN_SECRET_KEY="your-production-admin-secret"

# Production email settings
EMAIL_SERVER_USER="your-production-email"
EMAIL_SERVER_PASSWORD="your-production-password"

# Production OAuth credentials
GOOGLE_CLIENT_ID="your-production-client-id"
GOOGLE_CLIENT_SECRET="your-production-client-secret"
```

### Deployment Steps
1. **Prepare Database**: Set up PostgreSQL or MongoDB for production
2. **Update Environment**: Configure all production environment variables
3. **Build Application**: Run `npm run build`
4. **Deploy**: Use Vercel, Netlify, or your preferred platform
5. **Database Migration**: Run `npx prisma db push` in production
6. **Test**: Verify all features work in production environment

### Recommended Platforms
- **Vercel**: Seamless Next.js deployment
- **Netlify**: Easy static site deployment
- **Railway**: Full-stack deployment with database
- **Heroku**: Traditional platform-as-a-service

## 🔧 Development Commands

```bash
# Development
npm run dev                 # Start development server
npm run build              # Build for production
npm run start              # Start production server
npm run lint               # Run ESLint

# Database
npx prisma generate        # Generate Prisma client
npx prisma db push         # Push schema to database
npx prisma studio          # Open database browser
npx prisma db seed         # Seed database (if configured)

# Utilities
npm run type-check         # Check TypeScript types
npm audit                  # Check for vulnerabilities
npm update                 # Update dependencies
```

## 🐛 Troubleshooting

### Common Issues

**Port Already in Use**
```bash
# Find process using port 3000
netstat -ano | findstr :3000
# Kill the process (Windows)
taskkill /F /PID [PID_NUMBER]
```

**Database Connection Issues**
- Ensure SQLite file permissions are correct
- Check DATABASE_URL format
- Run `npx prisma db push` to sync schema

**Google OAuth Errors**
- Verify redirect URI matches exactly
- Check client ID and secret are correct
- Ensure OAuth consent screen is configured

**Email Not Working**
- Verify Gmail app password (not regular password)
- Check 2FA is enabled on Gmail account
- Confirm SMTP settings are correct

**Build Errors**
- Clear `.next` folder: `rm -rf .next`
- Clear node_modules: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npm run type-check`

### Getting Help
1. Check browser console for client-side errors
2. Check terminal/server logs for backend errors
3. Verify all environment variables are set
4. Test with minimal configuration first
5. Check GitHub issues or create new one

## 📈 Future Enhancements

### Planned Features
- 💳 **Payment Gateway Integration** (Stripe, Razorpay)
- 🔔 **Real-time Notifications** with WebSockets
- 📱 **Native Mobile App** (React Native)
- 📊 **Advanced Analytics** with charts and insights
- 🌍 **Multi-language Support** (i18n)
- 🤖 **AI-powered NGO Recommendations**
- 📧 **Advanced Email Templates**
- 🔍 **Enhanced Search & Filtering**

### Contributing
1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📞 Support & Community

### Resources
- **Documentation**: This setup guide
- **Issues**: GitHub Issues page
- **Discussions**: GitHub Discussions
- **Email**: support@givebackhub.com (if configured)

### Security
- Report security issues privately
- Follow responsible disclosure
- Keep dependencies updated
- Use strong passwords and secrets

---

**🎉 Congratulations! Your GiveBack Hub platform is now ready to make a positive impact in your community!**

*This comprehensive setup guide covers everything needed to get your donation platform running smoothly. For additional help, refer to the troubleshooting section or reach out to the community.*