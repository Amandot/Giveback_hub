# Fix Google OAuth Authentication - Complete Solution

## 🚨 Current Issue
Google OAuth login is failing because of a **redirect URI mismatch** between your app and Google Cloud Console settings.

## 🔧 Solution 1: Update Google Cloud Console (Recommended)

### Step 1: Update Google Cloud Console
1. **Go to**: [Google Cloud Console](https://console.cloud.google.com/)
2. **Navigate to**: APIs & Credentials → Credentials
3. **Find your OAuth 2.0 Client ID**: `308420835648-ij12rgjhsrlgs6nfakd7p0pkekk2qp0a`
4. **Click** on the OAuth client ID to edit it
5. **In "Authorized redirect URIs" section**:
   - **Remove**: `http://localhost:3000/api/auth/callback/google`
   - **Add**: `http://localhost:3001/api/auth/callback/google`
6. **Click "SAVE"**

### Step 2: Restart Your Application
After updating Google Console, restart your dev server:
```bash
npm run dev
```

## 🔧 Solution 2: Force App to Use Port 3000 (Alternative)

If you prefer not to change Google Console settings:

### Step 1: Kill processes on port 3000
```powershell
# Find what's using port 3000
netstat -ano | findstr :3000

# Kill the process (replace XXXX with the actual PID)
taskkill /F /PID XXXX
```

### Step 2: Update environment back to port 3000
Change `.env.local`:
```
NEXTAUTH_URL=http://localhost:3000
```

### Step 3: Start app on port 3000
```bash
npm run dev -- -p 3000
```

## 🧪 Testing the Fix

1. **Start your development server**
2. **Navigate to**: `http://localhost:3001` (or 3000 if using Solution 2)
3. **Try Google OAuth login**
4. **Check for errors** in browser console and terminal

## 🔍 Common Additional Issues

### Issue: JWT Decryption Errors
If you see JWT decryption errors, clear browser cookies:
1. Open browser DevTools (F12)
2. Go to Application tab
3. Clear cookies for localhost
4. Try logging in again

### Issue: Network Timeouts
- Ensure stable internet connection
- VPN might interfere with Google OAuth
- Try disabling antivirus temporarily

## ✅ Verification Steps

After applying the fix:
1. ✅ No console errors about redirect URI mismatch
2. ✅ Google login popup appears
3. ✅ After Google authentication, redirects back to your app
4. ✅ User is successfully logged in

## 🆘 If Still Not Working

Run this command to check your current NextAuth configuration:
```bash
npm run dev
```

Look for these log messages:
- ✅ "Google OAuth provider configured successfully"
- ❌ Any error messages about OAuth or JWT

Contact support with specific error messages from the console.