const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔧 Google OAuth Setup Wizard');
console.log('============================\n');

async function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function setupGoogleOAuth() {
  try {
    console.log('This wizard will help you set up Google OAuth for your NGO platform.\n');
    
    // Step 1: Check current environment
    const envPath = path.join(process.cwd(), '.env.local');
    let envContent = '';
    
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
      console.log('✅ Found existing .env.local file');
    } else {
      console.log('📝 Creating new .env.local file');
    }

    // Step 2: Generate secure NextAuth secret if needed
    let nextAuthSecret = '';
    if (envContent.includes('NEXTAUTH_SECRET=')) {
      const match = envContent.match(/NEXTAUTH_SECRET=(.+)/);
      if (match && match[1] && match[1] !== 'your-secret-key-here-change-this-in-production') {
        nextAuthSecret = match[1];
        console.log('✅ NextAuth secret already configured');
      }
    }
    
    if (!nextAuthSecret) {
      nextAuthSecret = crypto.randomBytes(32).toString('hex');
      console.log('🔑 Generated new NextAuth secret');
    }

    // Step 3: Get Google OAuth credentials
    console.log('\n📋 Google Cloud Console Setup:');
    console.log('1. Go to: https://console.cloud.google.com/');
    console.log('2. Create a new project or select existing one');
    console.log('3. Enable Google+ API:');
    console.log('   - Go to "APIs & Services" → "Library"');
    console.log('   - Search for "Google+ API" or "Google Identity"');
    console.log('   - Click "Enable"');
    console.log('4. Create OAuth 2.0 Credentials:');
    console.log('   - Go to "APIs & Services" → "Credentials"');
    console.log('   - Click "Create Credentials" → "OAuth 2.0 Client IDs"');
    console.log('   - Set Application type to "Web application"');
    console.log('   - Add authorized redirect URIs:');
    console.log('     * http://localhost:3000/api/auth/callback/google');
    console.log('     * http://localhost:3000/auth/callback/google');
    console.log('5. Copy the Client ID and Client Secret\n');

    const hasCredentials = await askQuestion('Do you have Google OAuth credentials ready? (y/n): ');
    
    let googleClientId = '';
    let googleClientSecret = '';
    
    if (hasCredentials.toLowerCase() === 'y' || hasCredentials.toLowerCase() === 'yes') {
      googleClientId = await askQuestion('Enter your Google Client ID: ');
      googleClientSecret = await askQuestion('Enter your Google Client Secret: ');
      
      if (!googleClientId || !googleClientSecret) {
        console.log('❌ Invalid credentials provided. Using placeholder values.');
        googleClientId = 'your-google-client-id-here';
        googleClientSecret = 'your-google-client-secret-here';
      }
    } else {
      console.log('📝 Using placeholder values. You can update them later in .env.local');
      googleClientId = 'your-google-client-id-here';
      googleClientSecret = 'your-google-client-secret-here';
    }

    // Step 4: Update environment file
    const envLines = envContent.split('\n');
    const newEnvLines = [];
    
    // Keep existing non-Google variables and update others
    let hasNextAuthUrl = false;
    let hasNextAuthSecret = false;
    let hasDatabaseUrl = false;
    let hasGoogleClientId = false;
    let hasGoogleClientSecret = false;

    for (const line of envLines) {
      if (line.startsWith('NEXTAUTH_URL=')) {
        hasNextAuthUrl = true;
        newEnvLines.push('NEXTAUTH_URL=http://localhost:3000');
      } else if (line.startsWith('NEXTAUTH_SECRET=')) {
        hasNextAuthSecret = true;
        newEnvLines.push(`NEXTAUTH_SECRET=${nextAuthSecret}`);
      } else if (line.startsWith('DATABASE_URL=')) {
        hasDatabaseUrl = true;
        newEnvLines.push('DATABASE_URL=file:./dev.db');
      } else if (line.startsWith('GOOGLE_CLIENT_ID=')) {
        hasGoogleClientId = true;
        newEnvLines.push(`GOOGLE_CLIENT_ID=${googleClientId}`);
      } else if (line.startsWith('GOOGLE_CLIENT_SECRET=')) {
        hasGoogleClientSecret = true;
        newEnvLines.push(`GOOGLE_CLIENT_SECRET=${googleClientSecret}`);
      } else if (line.trim() && !line.startsWith('#')) {
        newEnvLines.push(line);
      }
    }

    // Add missing variables
    if (!hasNextAuthUrl) newEnvLines.push('NEXTAUTH_URL=http://localhost:3000');
    if (!hasNextAuthSecret) newEnvLines.push(`NEXTAUTH_SECRET=${nextAuthSecret}`);
    if (!hasDatabaseUrl) newEnvLines.push('DATABASE_URL=file:./dev.db');
    if (!hasGoogleClientId) newEnvLines.push(`GOOGLE_CLIENT_ID=${googleClientId}`);
    if (!hasGoogleClientSecret) newEnvLines.push(`GOOGLE_CLIENT_SECRET=${googleClientSecret}`);

    // Write the updated .env.local file
    const finalEnvContent = newEnvLines.join('\n') + '\n';
    fs.writeFileSync(envPath, finalEnvContent);

    console.log('\n✅ Environment file updated successfully!');
    console.log(`🔑 NextAuth Secret: ${nextAuthSecret.substring(0, 8)}...`);
    console.log(`🔑 Google Client ID: ${googleClientId.substring(0, 10)}...`);

    // Step 5: Create test users
    console.log('\n👥 Creating test users...');
    
    const { PrismaClient } = require('@prisma/client');
    const bcrypt = require('bcryptjs');
    const prisma = new PrismaClient();

    try {
      // Create admin user
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
        console.log('✅ Admin user created: admin@example.com / admin123');
      } else {
        console.log('✅ Admin user already exists');
      }

      // Create test user
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
        console.log('✅ Test user created: test@example.com / test123');
      } else {
        console.log('✅ Test user already exists');
      }
    } catch (error) {
      console.log('⚠️  Error creating test users:', error.message);
    } finally {
      await prisma.$disconnect();
    }

    // Step 6: Final instructions
    console.log('\n🚀 Setup Complete!');
    console.log('==================');
    console.log('✅ Environment variables configured');
    console.log('✅ Test users created');
    console.log('✅ Google OAuth ready for configuration');
    
    console.log('\n📋 Next Steps:');
    console.log('1. If you used placeholder Google credentials:');
    console.log('   - Get real credentials from Google Cloud Console');
    console.log('   - Update .env.local with your actual credentials');
    console.log('2. Restart your development server:');
    console.log('   npm run dev');
    console.log('3. Test the authentication:');
    console.log('   - Visit: http://localhost:3000');
    console.log('   - Try signing in with test credentials');
    console.log('   - Or set up Google OAuth and test with Google sign-in');
    
    console.log('\n🔗 Test Pages:');
    console.log('- Main App: http://localhost:3000');
    console.log('- Google OAuth Test: http://localhost:3000/test-google');
    console.log('- User Login: http://localhost:3000/auth/user-login');
    console.log('- Admin Login: http://localhost:3000/auth/admin-login');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
  } finally {
    rl.close();
  }
}

setupGoogleOAuth();
