const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

console.log('🔧 Complete Google OAuth Setup');
console.log('==============================\n');

// Generate a secure NextAuth secret
const nextAuthSecret = crypto.randomBytes(32).toString('hex');

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
let envContent = '';

if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, 'utf8');
} else {
  console.log('📝 Creating .env.local file...');
}

// Update or create environment variables
const envLines = envContent.split('\n');
const newEnvLines = [];

// Keep existing non-Google variables
let hasGoogleClientId = false;
let hasGoogleClientSecret = false;
let hasNextAuthSecret = false;

for (const line of envLines) {
  if (line.startsWith('GOOGLE_CLIENT_ID=')) {
    hasGoogleClientId = true;
    newEnvLines.push(line);
  } else if (line.startsWith('GOOGLE_CLIENT_SECRET=')) {
    hasGoogleClientSecret = true;
    newEnvLines.push(line);
  } else if (line.startsWith('NEXTAUTH_SECRET=')) {
    hasNextAuthSecret = true;
    newEnvLines.push(`NEXTAUTH_SECRET=${nextAuthSecret}`);
  } else if (line.trim() && !line.startsWith('#')) {
    newEnvLines.push(line);
  }
}

// Add missing variables
if (!hasNextAuthSecret) {
  newEnvLines.push(`NEXTAUTH_SECRET=${nextAuthSecret}`);
}

if (!hasGoogleClientId) {
  newEnvLines.push('GOOGLE_CLIENT_ID=your-google-client-id-here');
}

if (!hasGoogleClientSecret) {
  newEnvLines.push('GOOGLE_CLIENT_SECRET=your-google-client-secret-here');
}

// Add other required variables
const requiredVars = [
  'NEXTAUTH_URL=http://localhost:3000',
  'DATABASE_URL=file:./dev.db'
];

for (const varLine of requiredVars) {
  const varName = varLine.split('=')[0];
  if (!newEnvLines.some(line => line.startsWith(varName + '='))) {
    newEnvLines.push(varLine);
  }
}

// Write the updated .env.local file
const finalEnvContent = newEnvLines.join('\n') + '\n';
fs.writeFileSync(envPath, finalEnvContent);

console.log('✅ Environment file updated!');
console.log(`🔑 Generated secure NextAuth secret: ${nextAuthSecret.substring(0, 8)}...`);

console.log('\n🔑 Google OAuth Setup Instructions:');
console.log('===================================');
console.log('1. Go to Google Cloud Console: https://console.cloud.google.com/');
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
console.log('5. Copy the Client ID and Client Secret');
console.log('6. Update .env.local file with your credentials:');
console.log('   GOOGLE_CLIENT_ID="your-actual-client-id"');
console.log('   GOOGLE_CLIENT_SECRET="your-actual-client-secret"');

console.log('\n🚀 Quick Test Setup (for development only):');
console.log('===========================================');
console.log('If you want to test without Google OAuth, you can:');
console.log('1. Use the admin login with credentials:');
console.log('   Email: admin@example.com');
console.log('   Password: admin123');
console.log('2. Or create a test user through the admin panel');

console.log('\n📝 Current .env.local content:');
console.log('==============================');
console.log(fs.readFileSync(envPath, 'utf8'));

console.log('\n🔄 After updating Google credentials, restart your server:');
console.log('   npm run dev');
