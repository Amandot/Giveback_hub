const bcrypt = require('bcryptjs')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Setting up GiveBack Hub...')

  try {
    // Create admin user
    const adminEmail = 'admin@givebackhub.org'
    const adminPassword = 'admin123456' // Change this in production!
    
    console.log('👤 Creating admin user...')

    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail }
    })

    if (existingAdmin) {
      console.log('✅ Admin user already exists')
    } else {
      const hashedPassword = await bcrypt.hash(adminPassword, 12)
      
      const admin = await prisma.user.create({
        data: {
          name: 'System Administrator',
          email: adminEmail,
          password: hashedPassword,
          role: 'ADMIN',
          emailVerified: new Date(),
        }
      })

      console.log('✅ Admin user created successfully!')
      console.log('📧 Email:', adminEmail)
      console.log('🔒 Password:', adminPassword)
      console.log('⚠️  Please change the admin password after first login!')
    }

    console.log('🎉 Setup completed successfully!')
    console.log('\n📋 Next Steps:')
    console.log('1. Update your .env.local with your actual database URL')
    console.log('2. Update email configuration (EMAIL_USER, EMAIL_PASS)')
    console.log('3. Run: npm run dev')
    console.log('4. Visit http://localhost:3000/auth/admin-login')
    console.log('5. Login with the admin credentials shown above')

  } catch (error) {
    console.error('❌ Setup failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()