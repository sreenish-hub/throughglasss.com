# 🚀 Admin Panel Setup - Quick Start Guide

Your backend is now ready to deploy! Here's the **3-step deployment**:

## Step 1: Create Free Vercel Account (5 minutes)
1. Go to [vercel.com/signup](https://vercel.com/signup)
2. Click "Continue with GitHub"
3. Authorize Vercel

## Step 2: Deploy Your Backend (2 minutes)
1. In Vercel, click **"Add New Project"**
2. Select `throughglasss` repository
3. Click **"Deploy"** (use all defaults)

Wait for deployment to complete → You'll get a URL like:
```
https://throughglasss.vercel.app
```

## Step 3: Add Environment Variables (2 minutes)
1. In Vercel project > Settings > Environment Variables
2. Add these variables:

| Name | Value |
|------|-------|
| `ADMIN_USERNAME` | `admin` |
| `ADMIN_PASSWORD` | `your_secure_password_here` |
| `JWT_SECRET` | `your_random_secret_key` |
| `NODE_ENV` | `production` |

⚠️ **Change password to something strong!**

## Step 4: Update Admin Panel (1 minute)
1. Go to your local `admin.html` file
2. Find line 103: `const API_URL = ...`
3. Replace with your Vercel URL:
```javascript
const API_URL = 'https://throughglasss.vercel.app/api';
```
4. Save and commit to GitHub

## Step 5: Test It! 🎉
Visit: `https://sreenish-hub.github.io/throughglasss.com/admin.html`

Login with:
- Username: `admin`
- Password: Your password from Step 3

## File Locations
- **Frontend**: GitHub Pages (`https://sreenish-hub.github.io/throughglasss.com/`)
- **Backend API**: Vercel (`https://throughglasss.vercel.app/api`)
- **Admin Panel**: Mixed - frontend UI on GitHub Pages, API on Vercel

## API Endpoints Available
```
POST   /api/auth/login          → Login to admin
GET    /api/presets             → Get all presets
POST   /api/presets             → Add new preset
PUT    /api/presets/:id         → Update preset
DELETE /api/presets/:id         → Delete preset
```

## Troubleshooting

### "Cannot connect to API"
- ✅ Check URL in admin.html matches your Vercel URL
- ✅ Make sure all environment variables are set in Vercel
- ✅ Wait 5 minutes after deploying

### "Invalid credentials"
- ✅ Password is case-sensitive
- ✅ Check username/password in Vercel environment variables

### Still not working?
- Check browser console (F12 > Console tab) for error messages
- Check Vercel deployment logs: https://vercel.com/dashboard

## Security Notes ✅
- Passwords are NOT saved in code
- All API requests require JWT authentication
- Tokens expire after 24 hours
- CORS is configured for your domain

## Done! 🎉
Your admin panel is ready to manage presets from anywhere!
