# 🌟 NGO Donation Platform - GiveBack Hub

*A comprehensive platform connecting donors with NGOs through geographic discovery and seamless donation management*

[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js%2014-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Powered by Prisma](https://img.shields.io/badge/Powered%20by-Prisma-2D3748?style=for-the-badge&logo=prisma)](https://prisma.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

## 🎯 Project Overview

A modern, full-stack NGO donation platform that enables seamless connections between donors and non-governmental organizations. The platform features geographic NGO discovery, comprehensive donation management, **advanced pickup services**, and powerful administrative tools.

### ✨ Key Highlights
- 🗺️ **Interactive Map-Based NGO Discovery**
- 💝 **Flexible Donation System** (Money & Items)
- 🚚 **Advanced Pickup Service** with scheduling & tracking
- 🛡️ **Comprehensive Admin Dashboard**
- 🔐 **Secure Multi-Provider Authentication**
- 📱 **Fully Responsive Design**

---

## 🏗️ Architecture & Technology Stack

### **Frontend**
- **Framework:** Next.js 14.2.16 with App Router
- **Language:** TypeScript
- **UI Library:** React 18
- **Styling:** Tailwind CSS + Radix UI Components
- **Maps:** Google Maps API Integration
- **Animations:** GSAP + CSS Animations

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

#### **👤 User Profiles**
- Profile management with location tracking
- Geographic data for map visualization
- Account security settings

### **🏢 NGO Management System**

#### **📝 NGO Registration**
- Admin-based NGO registration
- Interactive location selection with Maps
- Comprehensive NGO profile management

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

#### **🚚 Pickup Service (Latest Feature)**
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
ngo/
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
- Google Maps API key (for map features)

### **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/ngo-donation-platform.git
   cd ngo-donation-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file with:
   ```
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key
   DATABASE_URL=file:./dev.db
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
   EMAIL_USER=your-email@example.com
   EMAIL_PASS=your-email-password
   ```

4. **Initialize the database**
   ```bash
   npx prisma migrate dev
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Visit `http://localhost:3000` to see the application.

---

## 🗄️ Recent Enhancements

### **🚚 Pickup Service Feature (Latest Addition)**

We recently implemented a comprehensive pickup service system for item donations:

- Added pickup scheduling with date/time selection
- Integrated address specification and special instructions
- Implemented pickup status tracking
- Enhanced admin dashboard with pickup management
- Added urgent notification system for pending pickups

### **📱 Responsive Design Improvements**

- Enhanced mobile experience
- Improved map interactions on small screens
- Streamlined donation process on all devices

---

## 📈 Future Roadmap

- Payment gateway integration
- Real-time notifications with WebSockets
- Native mobile application
- Advanced analytics dashboard
- Multi-language support
- Social media integration

---

## 📁 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👏 Acknowledgements

- Next.js team for the amazing framework
- Prisma team for the excellent ORM
- Tailwind CSS for the styling system
- Google Maps Platform for location services
- All the NGOs that inspired this project
