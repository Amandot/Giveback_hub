const fs = require('fs');
const path = require('path');

console.log('🔧 Google OAuth Setup Helper');
console.log('============================\n');

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
const envExists = fs.existsSync(envPath);

if (!envExists) {
  console.log('📝 Creating .env.local file...');
  
  const envContent = `# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-key-for-production-change-this-in-production"

# Google OAuth (Get these from Google Cloud Console)
GOOGLE_CLIENT_ID="your-google-client-id-here"
GOOGLE_CLIENT_SECRET="your-google-client-secret-here"

# Email (Optional - for sending emails)
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_FROM="your-email@gmail.com"`;

  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env.local file created!\n');
} else {
  console.log('✅ .env.local file already exists\n');
}

console.log('🔑 Google OAuth Setup Instructions:');
console.log('===================================');
console.log('1. Go to Google Cloud Console: https://console.cloud.google.com/');
console.log('2. Create a new project or select existing one');
console.log('3. Enable Google+ API');
console.log('4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"');
console.log('5. Set Application type to "Web application"');
console.log('6. Add authorized redirect URIs:');
console.log('   - http://localhost:3000/api/auth/callback/google');
console.log('   - http://localhost:3000/auth/callback/google');
console.log('7. Copy the Client ID and Client Secret');
console.log('8. Update .env.local file with your credentials:');
console.log('   GOOGLE_CLIENT_ID="your-actual-client-id"');
console.log('   GOOGLE_CLIENT_SECRET="your-actual-client-secret"');
console.log('\n🚀 After updating .env.local, restart your development server!');
console.log('   npm run dev');
