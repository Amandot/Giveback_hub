const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    console.log('🔧 Creating test user...');
    
    // Check if admin user exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@example.com' }
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 12);
      
      await prisma.user.create({
        data: {
          email: 'admin@example.com',
          name: 'Admin User',
          password: hashedPassword,
          role: 'ADMIN',
          image: null
        }
      });
      
      console.log('✅ Admin user created:');
      console.log('   Email: admin@example.com');
      console.log('   Password: admin123');
    } else {
      console.log('✅ Admin user already exists');
    }

    // Check if test user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: 'test@example.com' }
    });

    if (!existingUser) {
      const hashedPassword = await bcrypt.hash('test123', 12);
      
      await prisma.user.create({
        data: {
          email: 'test@example.com',
          name: 'Test User',
          password: hashedPassword,
          role: 'USER',
          image: null
        }
      });
      
      console.log('✅ Test user created:');
      console.log('   Email: test@example.com');
      console.log('   Password: test123');
    } else {
      console.log('✅ Test user already exists');
    }

    console.log('\n🚀 You can now sign in with these credentials:');
    console.log('   Admin: admin@example.com / admin123');
    console.log('   User: test@example.com / test123');

  } catch (error) {
    console.error('❌ Error creating test user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();
