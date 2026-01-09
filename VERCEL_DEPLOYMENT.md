# Deploy Admin Panel to Vercel - Complete Guide

## Overview
Your site is split into two parts:
- **Frontend** (GitHub Pages) - Static site at `https://sreenish-hub.github.io/throughglasss.com/`
- **Backend API** (Vercel) - Admin panel API endpoints

## Step 1: Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up"
3. Choose "Continue with GitHub"
4. Authorize Vercel to access your GitHub account

## Step 2: Deploy to Vercel
1. In Vercel dashboard, click "Add New Project"
2. Select your `throughglasss` repository
3. Configure:
   - **Root Directory:** `./` (root of your project)
   - **Build Command:** (leave empty - no build needed)
   - **Output Directory:** (leave empty)

## Step 3: Set Environment Variables
In Vercel project settings > Environment Variables, add:

```
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_super_secure_password_here
JWT_SECRET=your_random_secret_key_12345
NODE_ENV=production
```

⚠️ **IMPORTANT:** Change the password to something secure!

## Step 4: Get Your Vercel API URL
After deployment, Vercel will give you a URL like:
```
https://throughglasss.vercel.app
```

## Step 5: Update Admin Panel
In your local `admin.html`, update line 103:
```javascript
const API_URL = 'https://throughglasss.vercel.app/api';
```

## Step 6: Test the Admin Panel
1. Visit `https://sreenish-hub.github.io/throughglasss.com/admin.html`
2. Login with your credentials:
   - Username: `admin`
   - Password: Your password from step 3

## File Structure
```
throughglasss/
├── api/
│   ├── index.js          (Backend API)
│   └── package.json      (Dependencies)
├── admin.html            (Admin dashboard)
├── index.html            (Main website)
├── vercel.json           (Deployment config)
├── .env.example          (Template for env vars)
└── public/
    ├── script.js
    ├── styles.css
    └── images/
```

## Troubleshooting

### "Cannot connect to API"
- Check that Vercel URL is correct in `admin.html`
- Verify environment variables are set in Vercel dashboard
- Check browser console for CORS errors

### "Invalid credentials"
- Verify username/password in Vercel environment variables
- Password is case-sensitive!

### "502 Bad Gateway"
- Wait a few minutes for Vercel to finish deploying
- Check deployment logs in Vercel dashboard

## Local Development
To test locally before deploying:

```bash
cd api
npm install
NODE_ENV=development ADMIN_USERNAME=admin ADMIN_PASSWORD=test123 JWT_SECRET=dev-secret node index.js
```

Then update `admin.html`:
```javascript
const API_URL = 'http://localhost:3000/api';
```

## Security Notes
- ✅ Passwords are NOT stored - use strong credentials
- ✅ JWT tokens expire after 24 hours
- ✅ All API requests require authentication (except GET /presets)
- ✅ Store `.env` file in `.gitignore` (already done)

## Next Steps
1. Deploy to Vercel
2. Set environment variables
3. Update admin.html with your Vercel URL
4. Test login and CRUD operations
5. Commit changes to GitHub

Questions? Check the Vercel docs: https://vercel.com/docs
