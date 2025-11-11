# Email Service Setup

Your contact form is configured to use **Web3Forms** - a free, simple email service.

## Setup Instructions (5 minutes)

### Step 1: Get Your Free Access Key

1. Go to [https://web3forms.com](https://web3forms.com)
2. Click "Create Your Access Key"
3. Enter your email: **tornikeiarajuli@gmail.com**
4. Verify your email (check inbox/spam)
5. Copy your Access Key (looks like: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)

### Step 2: Add Access Key to Environment Variables

1. Open `.env.local` file in the root directory
2. Replace `your_access_key_here` with your actual key:
   ```
   NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
   ```
3. Save the file

### Step 3: Deploy to Production

When deploying to Netlify/Vercel:

1. Go to your hosting dashboard
2. Find "Environment Variables" or "Settings"
3. Add the variable:
   - **Key:** `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY`
   - **Value:** Your access key from Web3Forms

### Step 4: Test It!

1. Restart your dev server: `npm run dev`
2. Go to the Contact section
3. Fill out and submit the form
4. Check your email inbox for the message!

## Features

✅ **Free forever** - No credit card required
✅ **Unlimited emails** - No monthly limits
✅ **Spam protection** - Built-in bot detection
✅ **Email notifications** - Get emails instantly to tornikeiarajuli@gmail.com
✅ **No backend needed** - Works entirely client-side

## How It Works

When someone fills out your contact form:
1. Form data is sent to Web3Forms API
2. Web3Forms validates and processes the data
3. You receive an email at **tornikeiarajuli@gmail.com**
4. User sees success/error message

## Alternative Options

If you prefer a different service:

### Option 2: EmailJS
- Website: https://emailjs.com
- Free tier: 200 emails/month
- Requires Gmail/Outlook integration

### Option 3: Resend
- Website: https://resend.com
- Free tier: 100 emails/day
- Requires API integration

### Option 4: FormSpree
- Website: https://formspree.io
- Free tier: 50 submissions/month
- Simple HTML forms

## Troubleshooting

**No emails arriving?**
- Check spam folder
- Verify access key is correct
- Ensure environment variable starts with `NEXT_PUBLIC_`
- Restart dev server after adding env variable

**Form not working in production?**
- Add environment variable to hosting platform
- Redeploy after adding the variable

**Need help?**
- Web3Forms docs: https://docs.web3forms.com
- Support: support@web3forms.com
