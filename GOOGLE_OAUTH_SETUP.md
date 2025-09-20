# Google OAuth Setup Guide

This guide will help you set up Google OAuth authentication for your NGO platform.

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Enter project name: "NGO Platform" (or any name you prefer)
4. Click "Create"

## Step 2: Enable Google+ API

1. In the Google Cloud Console, go to "APIs & Services" → "Library"
2. Search for "Google+ API" or "Google Identity"
3. Click on "Google+ API" and then "Enable"

## Step 3: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth 2.0 Client IDs"
3. If prompted, configure the OAuth consent screen:
   - Choose "External" user type
   - Fill in required fields:
     - App name: "NGO Platform"
     - User support email: your email
     - Developer contact: your email
   - Add scopes: `email`, `profile`, `openid`
   - Add test users: your email address

## Step 4: Configure OAuth Client

1. Set Application type to "Web application"
2. Add authorized redirect URIs:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
3. Click "Create"
4. Copy the Client ID and Client Secret

## Step 5: Update Environment Variables

1. Open `.env.local` file in your project root
2. Replace the placeholder values:
   ```env
   GOOGLE_CLIENT_ID="your-actual-client-id-here"
   GOOGLE_CLIENT_SECRET="your-actual-client-secret-here"
   ```

## Step 6: Test the Setup

1. Restart your development server:
   ```bash
   npm run dev
   ```
2. Go to `http://localhost:3000`
3. Click "Sign In as Donor"
4. You should see a "Sign in with Google" button
5. Click it to test the OAuth flow

## Troubleshooting

### Common Issues:

1. **"Error 400: redirect_uri_mismatch"**
   - Make sure the redirect URI in Google Console exactly matches: `http://localhost:3000/api/auth/callback/google`

2. **"This app isn't verified"**
   - This is normal for development. Click "Advanced" → "Go to NGO Platform (unsafe)"

3. **"Access blocked: This app's request is invalid"**
   - Check that your Client ID and Secret are correct in `.env.local`
   - Make sure the OAuth consent screen is configured

4. **"Invalid client"**
   - Verify the Client ID and Secret are copied correctly
   - Ensure there are no extra spaces or characters

### For Production:

1. Add your production domain to authorized redirect URIs:
   ```
   https://yourdomain.com/api/auth/callback/google
   ```
2. Update `NEXTAUTH_URL` in environment variables
3. Submit your app for verification if you want to remove the "unverified" warning

## Security Notes

- Never commit your `.env.local` file to version control
- Use different OAuth credentials for development and production
- Regularly rotate your Client Secret
- Monitor your OAuth usage in Google Cloud Console

## Need Help?

If you encounter issues:
1. Check the browser console for error messages
2. Check the server logs for authentication errors
3. Verify all environment variables are set correctly
4. Ensure the Google Cloud project is properly configured