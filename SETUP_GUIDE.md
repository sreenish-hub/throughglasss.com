# Fix Your Security Error - Complete Setup Guide

## Problem Summary
Your website (throughglasss) was showing a security error because the JavaScript code was trying to fetch from `/api/presets` and `/api/contact` endpoints. GitHub Pages is a **static hosting platform** that doesn't support backend API endpoints.

## Solution Implemented

I've fixed the `script.js` file with these two changes:

### 1. ✅ Preset Data (Already Fixed)
**Instead of:** `fetch('/api/presets')`
**Now using:** Local JavaScript object (`PRESETS_DATA`)

The preset data is now stored directly in `script.js`. To add your Lightroom presets:

```javascript
const PRESETS_DATA = [
  {
    id: 1,
    name: 'Your Preset Name',
    desc: 'Description of the preset',
    img: '/images/preset-image.jpg',
    price: '$29',
    link: 'https://gumroad.com/your-link'
  },
  // Add more presets as needed
];
```

### 2. ⚠️ Contact Form (Needs Setup)
**Instead of:** `POST /api/contact`
**Now using:** Formspree.io (Free service)

You need to set up Formspree to handle contact form submissions. Here's how:

## Setup Formspree (3 Steps - Takes 2 minutes)

### Step 1: Create a Formspree Account
1. Go to https://formspree.io
2. Click "Get started"
3. Sign up with your email (support@throughglasss.com)
4. Verify your email

### Step 2: Create a New Form
1. In Formspree dashboard, click "Create new form"
2. Give it a name: "throughglasss-contact"
3. Formspree will give you a **Form ID** (looks like: `abc123def456`)
4. **Copy this ID**

### Step 3: Update Your Code
1. Go to your repository: https://github.com/sreenish-hub/throughglasss
2. Edit `public/script.js`
3. Find this line (around line 108):
   ```javascript
   const FORMSPREE_ID = 'YOUR_FORMSPREE_ID';
   ```
4. Replace `YOUR_FORMSPREE_ID` with your actual ID from Formspree
5. Commit the change

## Example:
If your Formspree ID is `xyzabc123`, the line should be:
```javascript
const FORMSPREE_ID = 'xyzabc123';
```

## Testing Your Website

After making the Formspree change:

1. **Wait 2-5 minutes** for GitHub Pages to rebuild your site
2. Visit: https://sreenish-hub.github.io/throughglasss/
3. The site should now load without security errors ✅
4. Try filling out and submitting the contact form
5. Check your email for the message

## Why This Solution?

✅ **No Backend Server Needed** - Works perfectly with GitHub Pages
✅ **Free** - Both solutions are completely free
✅ **Secure** - Formspree handles spam protection
✅ **Easy to Update** - Just edit the JavaScript array to change presets
✅ **Fast** - Static content loads instantly

## Next Steps to Improve Your Site

1. **Add More Presets** - Edit the PRESETS_DATA array in script.js
2. **Update Preset Images** - Upload images to `/public/images/` folder
3. **Customize Your Gumroad Links** - Update the `link` property in each preset
4. **Add More Sections** - The HTML structure supports unlimited presets

## Security Note

Your site is now secure and follows best practices for static hosting:
- ✅ No API endpoints exposed
- ✅ No sensitive data in code
- ✅ Uses established third-party service (Formspree) for forms
- ✅ Follows GitHub Pages recommendations

## Need Help?

If you encounter any issues:
1. Check the browser console (F12) for error messages
2. Ensure your Formspree ID is correctly copied
3. Verify images are in the `/public/images/` folder
4. Wait 5 minutes after each commit (GitHub Pages rebuild time)

---

**Last Updated:** January 9, 2026
**Your Website:** https://sreenish-hub.github.io/throughglasss/
