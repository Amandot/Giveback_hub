# 🌟 GiveBack Hub - Community Donation Platform

*A comprehensive platform connecting donors with NGOs through geographic discovery and seamless donation management*

[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js%2014-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Powered by Prisma](https://img.shields.io/badge/Powered%20by-Prisma-2D3748?style=for-the-badge&logo=prisma)](https://prisma.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![GSAP](https://img.shields.io/badge/GSAP-88CE02?style=for-the-badge&logo=greensock&logoColor=white)](https://greensock.com/)

## 🎯 Project Overview

GiveBack Hub is a cutting-edge donation platform that bridges the gap between compassionate donors and impactful NGOs. Built with modern web technologies, it features smooth animations, interactive maps, comprehensive donation management, and powerful administrative tools.

### ✨ Key Highlights
- �️ *c*Interactive Map-Based NGO Discovery**
- � **dFlexible Donation System** (Money & Items)
- � **Adveanced Pickup Service** with scheduling & tracking
- �*️ **Comprehensive Admin Dashboard**
- 🔐 **Secure Multi-Provider Authentication**
- 📱 **Fully Responsive Design**
- ✨ **Smooth Animations** with GSAP & Barba.js
- 🎨 **Modern UI/UX** with Tailwind CSS
- 🔑 **Emergency Admin Access** with secret key system

---

## 🏗️ Architecture & Technology Stack

### **Frontend**
- **Framework:** Next.js 14.2.16 with App Router
- **Language:** TypeScript
- **UI Library:** React 18
- **Styling:** Tailwind CSS + Radix UI Components
- **Maps:** OpenStreetMap with Leaflet Integration
- **Animations:** GSAP + Barba.js + Custom CSS Animations
- **Smooth Scrolling:** Native CSS + GSAP ScrollTrigger

### **Backend**
- **API:** Next.js API Routes
- **Database:** SQLite (Development) / PostgreSQL (Production Ready)
- **ORM:** Prisma 6.16.2
- **Authentication:** NextAuth.js (OAuth + Credentials)
- **Email:** Nodemailer
- **Security:** bcryptjs for password hashing

### **Development Tools**
- **Package Manager:** npm
- **Database Management:** Prisma Studio
- **Code Quality:** ESLint + TypeScript
- **Deployment:** Vercel Ready

---

## 📝 Core Features

### **👥 User Management System**

#### **🔐 Authentication & Authorization**
- Multi-provider authentication (Google OAuth)
- Credential-based login for administrators
- Role-based access control (USER vs ADMIN)
- Secure session management
- **Emergency admin access** with secret key system
- Password hashing with bcryptjs

#### **👤 User Profiles**
- Profile management with location tracking
- Geographic data for map visualization
- Account security settings

### **🏢 NGO Management System**

#### **📝 NGO Registration**
- Admin-based NGO registration with secure registration key
- Interactive location selection with Maps
- Comprehensive NGO profile management
- Protected registration process using `ADMIN_SECRET_KEY`

#### **🗺️ Geographic Features**
- NGO discovery on interactive maps
- Location-based filtering
- Visual representation of NGO presence

### **💝 Donation System**

#### **💰 Money Donations**
- Predefined and custom amounts
- Currency support (₹)
- One-time donation processing

#### **💶 Item Donations**
- Category-based donation system
- Quantity and description fields
- Photo upload capabilities
- **🤖 AI-Powered Item Analysis** (NEW!)

#### **🤖 AI-Powered Donation Analysis (Latest Feature)**
- **Smart Image Recognition**: Upload photos of donation items for automatic identification
- **Gemini 1.5 Flash Integration**: Powered by Google's advanced AI model
- **Automatic Form Filling**: AI identifies item name, category, and condition
- **Validation System**: Rejects inappropriate or non-donation items
- **User-Friendly Interface**: Simple upload → analyze → submit workflow
- **Fallback Support**: Manual entry option if AI analysis fails

#### **🚚 Pickup Service**
- Schedule pickup date and time
- Address specification
- Special instructions for pickup team
- Status tracking (Scheduled → In Progress → Completed)
- Admin management dashboard

### **🛡️ Admin Dashboard**

- Comprehensive statistics overview
- Donation management (approve/reject)
- User oversight and analytics
- Pickup service management with status updates
- NGO profile administration

### **💬 Communication System**

- Email notifications for donation events
- Status update alerts
- Pickup service notifications
- Admin alerts for new donations

---

## 📊 Database Architecture

### **📃 Core Tables**
- `User` - User accounts with role-based access
- `NGO` - Non-governmental organizations profiles
- `Donation` - Donation records with pickup service data
- `Account` & `Session` - Authentication data

### **🖫 Enums**
- `Role` - USER, ADMIN
- `DonationType` - MONEY, ITEMS
- `DonationStatus` - PENDING, APPROVED, REJECTED
- `PickupStatus` - NOT_REQUIRED, SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED

### **🔗 Key Relationships**
- User → Donations (One-to-Many)
- User → NGO (One-to-One for admins)
- NGO → Donations (One-to-Many)

---

## 💻 Project Structure

```
giveback-hub/
├── app/                  # Next.js App Router
│   ├── admin/           # Admin dashboard
│   ├── admin-signup/    # NGO registration
│   ├── api/             # Backend API routes
│   ├── auth/            # Authentication pages
│   ├── dashboard/       # User dashboard
│   ├── donate/          # Donation pages
│   ├── map/             # NGO map discovery
│   └── page.tsx         # Landing page
├── components/          # Reusable components
│   ├── ui/             # Base UI components
│   ├── google-map.tsx   # Map component
│   ├── donation-form.tsx # Donation form
│   └── ...
├── prisma/              # Database schema & migrations
│   ├── schema.prisma    # Database model
│   └── migrations/      # Migration history
├── lib/                 # Utility functions
└── public/              # Static assets
```

---

## 🚀 Getting Started

### **Prerequisites**
- Node.js 18+ and npm
- Git
- OpenStreetMap and Leaflet (for map features)

### **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/giveback-hub.git
   cd giveback-hub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file with:
   ```env
   # Database
   DATABASE_URL="file:./dev.db"

   # NextAuth.js
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-nextauth-secret-here"

   # Google OAuth (optional - can be configured later)
   GOOGLE_CLIENT_ID="your-google-client-id-here"
   GOOGLE_CLIENT_SECRET="your-google-client-secret-here"

   # Google Maps API Key (optional - now using OpenStreetMap)
   # NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-google-maps-api-key"

   # Google Gemini AI API Key (required for AI-powered donation analysis)
   GEMINI_API_KEY="your-gemini-api-key"

   # Email (optional - can be configured later)
   EMAIL_SERVER_HOST="smtp.gmail.com"
   EMAIL_SERVER_PORT=587
   EMAIL_SERVER_USER="your-email@gmail.com"
   EMAIL_SERVER_PASSWORD="your-app-password"
   EMAIL_FROM="your-email@gmail.com"

   # Admin Secret Key for Emergency Access
   ADMIN_SECRET_KEY="GIVEBACK_ADMIN_2024_SECRET"
   ```

4. **Initialize the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Visit `http://localhost:3000` to see the application.

---

## 🗄️ Recent Enhancements

### **🤖 AI-Powered Donation Analysis (Latest Update)**

- **Gemini 1.5 Flash Integration**: Advanced AI model for image recognition
- **Smart Item Identification**: Automatically detects donation items from photos
- **Auto-Form Filling**: AI fills item name, category, and description
- **Content Validation**: Rejects inappropriate or non-donation content
- **User Experience**: Simple upload → analyze → submit workflow
- **Fallback Support**: Manual entry if AI analysis is unavailable

### **✨ UI/UX Improvements**

- **Enhanced Animations**: Integrated GSAP and Barba.js for smooth page transitions
- **Smooth Scrolling**: Native CSS smooth scrolling with GSAP ScrollTrigger
- **Modern Design**: Updated Tailwind CSS with custom animations and effects
- **Interactive Elements**: Hover effects, loading states, and micro-interactions
- **Accessibility**: Improved focus states and mobile touch targets

### **🔑 Emergency Admin Access System**

- **Secret Key Login**: Instant admin account creation with secure key
- **Flexible Authentication**: Multiple ways to access admin features
- **Security Enhanced**: Proper password hashing and session management

### **🚚 Pickup Service Feature**

- Added pickup scheduling with date/time selection
- Integrated address specification and special instructions
- Implemented pickup status tracking
- Enhanced admin dashboard with pickup management
- Added urgent notification system for pending pickups

### **📱 Responsive Design**

- Enhanced mobile experience across all devices
- Improved map interactions on small screens
- Streamlined donation process with better UX

---

## 🎯 User Flows

### **For Donors (Users)**
1. Visit `/auth/user-login`
2. Sign in with Google or email/password
3. Redirected to `/dashboard` (personalized)
4. Click "🤖 AI Donate" or visit `/donate-ai` for AI-powered donations
5. Upload photo of donation item → AI analyzes and fills form
6. Review AI suggestions and submit donation
7. Receive email confirmation when status changes

**Alternative Flow (Traditional):**
1. Click "Donate Now" or visit `/donate`
2. Manually fill donation form (item, quantity, description)
3. Submit and receive confirmation

### **For NGO Staff (Admins)**
1. Visit `/auth/admin-login`
2. Sign in with admin credentials
3. Redirected to `/admin/dashboard`
4. View pending donations in table
5. Click "Approve" or "Reject" buttons
6. Donor automatically receives email notification

---

## 📈 Future Roadmap

- 💳 **Payment Gateway Integration** (Stripe, Razorpay)
- 🔔 **Real-time Notifications** with WebSockets
- 📱 **Native Mobile Application** (React Native)
- 📊 **Advanced Analytics Dashboard** with charts and insights
- 🌍 **Multi-language Support** (i18n)
- 📱 **Social Media Integration** for sharing donations
- 🤖 **AI-powered NGO Recommendations**
- 📧 **Advanced Email Templates** and notifications
- 🔍 **Advanced Search & Filtering** for NGOs and donations
- 📈 **Impact Tracking** and reporting system

---

## 🔒 Security Features

- **Role-based Authentication**: Separate login flows for users and admins
- **Route Protection**: Middleware prevents unauthorized access
- **Password Hashing**: bcrypt with salt rounds
- **Session Management**: NextAuth handles JWT tokens
- **Input Validation**: Server-side validation for all forms
- **Emergency Access**: Secure admin creation with secret keys
- **CSRF Protection**: Built-in NextAuth CSRF protection

---

## 🚀 Production Deployment

### **Environment Variables for Production**
```env
NEXTAUTH_URL=https://your-domain.com
DATABASE_URL="your-production-database-url"
EMAIL_SERVER_USER=your-production-email
EMAIL_SERVER_PASSWORD=your-production-email-password
NEXTAUTH_SECRET="your-strong-secret-key"
ADMIN_SECRET_KEY="your-admin-creation-secret"
```

### **Deployment Steps**
1. Update environment variables
2. Run `npx prisma generate`
3. Run `npx prisma db push`
4. Deploy to Vercel, Netlify, or your preferred platform

---

## 👏 Acknowledgements

- **Next.js** team for the amazing framework
- **Prisma** team for the excellent ORM
- **Tailwind CSS** for the styling system
- **Radix UI** for accessible components
- **GSAP** for smooth animations
- **OpenStreetMap & Leaflet** for interactive maps
- All the **NGOs** and **communities** that inspired this project

---

## 🚀 Deployment

### **Vercel Deployment (Recommended)**

This project is optimized for Vercel deployment with zero configuration:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/giveback-hub)

**📖 Complete Deployment Guide:** See [DEPLOYMENT.md](./DEPLOYMENT.md) for step-by-step instructions.

### **Quick Deploy Steps:**
1. **Fork/Clone** this repository
2. **Connect** to Vercel via GitHub
3. **Add Environment Variables** (see `.env.example`)
4. **Deploy** - Vercel handles the rest!

### **Production Requirements:**
- **Database:** PostgreSQL (Vercel Postgres recommended)
- **Environment Variables:** All variables from `.env.example`
- **OpenStreetMap Integration:** Free map service with Leaflet
- **Domain:** Custom domain supported

### **Post-Deployment:**
1. Set up Vercel Postgres database
2. Run database migrations
3. Create admin account via `/auth/admin-secret`
4. Register first NGO via `/admin-signup`

---

## 🌟 Live Features

Once deployed, your platform will include:

- **🏠 Landing Page** - Modern hero section with smooth animations
- **🗺️ Interactive Map** - Discover NGOs by location
- **💝 Donation System** - Support NGOs with money or items
- **🤖 AI-Powered Donations** - Smart item analysis and form filling
- **� Pickup Sebrvice** - Schedule item pickups with tracking
- **� Useir Dashboard** - Track donations and impact
- **📊 Admin Dashboard** - Comprehensive management tools
- **🏢 NGO Management** - Complete NGO administration
- **� Securee Authentication** - Multiple login options
- **📱 Mobile Responsive** - Perfect on all devices
