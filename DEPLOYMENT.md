# 🚀 Vercel Deployment Guide

## Prerequisites
- GitHub account
- Vercel account (free tier available)
- PostgreSQL database (we'll use Vercel Postgres)

## Step-by-Step Deployment

### 1. **Prepare Your Repository**
```bash
# Make sure all changes are committed
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 2. **Set Up Vercel Postgres Database**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Storage" → "Create Database" → "Postgres"
3. Choose a name like `giveback-hub-db`
4. Select your region
5. Click "Create"
6. Copy the `DATABASE_URL` from the connection details

### 3. **Deploy to Vercel**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)

### 4. **Configure Environment Variables**
In Vercel project settings → Environment Variables, add:

#### Required Variables:
```
DATABASE_URL=postgresql://[from-vercel-postgres]
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXTAUTH_SECRET=Z8g3bfE9rjRq7wFkyMT20RWA3W2GpZYMn76j7nfC6Ow=
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyBHLett8djBo62dDXj0EjCpF8OK-1iSEhs
ADMIN_SECRET_KEY=GIVEBACK_ADMIN_2024_SECRET
```

#### Optional Variables (for full functionality):
```
GOOGLE_CLIENT_ID=your-google-oauth-client-id
GOOGLE_CLIENT_SECRET=your-google-oauth-secret
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password
EMAIL_FROM=your-email@gmail.com
```

### 5. **Database Migration**
After deployment, run database migration:
1. Go to Vercel Dashboard → Your Project → Functions
2. Or use Vercel CLI:
```bash
npx vercel env pull .env.local
npx prisma migrate deploy
```

### 6. **Verify Deployment**
1. Visit your deployed app: `https://your-app-name.vercel.app`
2. Test key features:
   - ✅ Home page loads
   - ✅ User registration works
   - ✅ Admin login works (`/auth/admin-secret`)
   - ✅ NGO registration works (`/admin-signup`)
   - ✅ Map functionality works
   - ✅ Donation system works

## 🔧 Troubleshooting

### Common Issues:

#### 1. **Database Connection Error**
- Ensure `DATABASE_URL` is correctly set in Vercel environment variables
- Check if Vercel Postgres is properly connected to your project

#### 2. **Build Failures**
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify TypeScript errors are resolved

#### 3. **Environment Variables Not Working**
- Make sure variables are set in Vercel dashboard
- Redeploy after adding new environment variables
- Check variable names match exactly (case-sensitive)

#### 4. **Google Maps Not Loading**
- Verify `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is set
- Check Google Cloud Console for API key restrictions
- Ensure Maps JavaScript API is enabled

#### 5. **Authentication Issues**
- Update `NEXTAUTH_URL` to match your Vercel domain
- Regenerate `NEXTAUTH_SECRET` if needed
- Update Google OAuth redirect URIs if using Google login

## 🎯 Post-Deployment Setup

### 1. **Create Admin Account**
Visit: `https://your-app.vercel.app/auth/admin-secret`
- Use secret key: `GIVEBACK_ADMIN_2024_SECRET`
- Create your admin account

### 2. **Register First NGO**
Visit: `https://your-app.vercel.app/admin-signup`
- Register your first NGO
- Test the complete flow

### 3. **Test Donation Flow**
- Create a user account
- Make a test donation
- Verify admin can approve/reject

## 🔒 Security Considerations

### Production Security:
1. **Change Default Secrets**: Update `ADMIN_SECRET_KEY` and `NEXTAUTH_SECRET`
2. **API Key Restrictions**: Restrict Google Maps API key to your domain
3. **Database Security**: Use strong passwords and enable SSL
4. **Environment Variables**: Never commit secrets to Git

### Recommended Updates:
```bash
# Generate new NextAuth secret
openssl rand -base64 32

# Update admin secret key
# Use a strong, unique key for production
```

## 📊 Monitoring & Analytics

### Built-in Features:
- Vercel Analytics (already included)
- Real-time function logs
- Performance monitoring

### Optional Additions:
- Sentry for error tracking
- LogRocket for user session recording
- Google Analytics for detailed insights

## 🚀 Continuous Deployment

Your app is now set up for automatic deployment:
- Push to `main` branch → Automatic deployment
- Pull requests → Preview deployments
- Environment variables → Managed in Vercel dashboard

## 📞 Support

If you encounter issues:
1. Check Vercel function logs
2. Review build logs in Vercel dashboard
3. Test locally with production environment variables
4. Consult Vercel documentation

---

**🎉 Congratulations!** Your GiveBack Hub is now live on Vercel!