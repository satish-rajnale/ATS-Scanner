# Vercel Deployment Guide

This guide will help you deploy the ATS Resume Scanner to Vercel.

## Prerequisites

1. A GitHub, GitLab, or Bitbucket account
2. A Vercel account (sign up at https://vercel.com)
3. All your API keys ready (Stripe, OpenAI, AdSense)

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push your code to Git**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Import Project to Vercel**
   - Go to https://vercel.com/new
   - Click "Import Git Repository"
   - Select your repository
   - Vercel will auto-detect Next.js settings

3. **Configure Environment Variables**
   In the Vercel project settings, add these environment variables:
   
   **Required:**
   ```
   STRIPE_SECRET_KEY=sk_live_your-stripe-secret-key
   STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your-publishable-key
   NEXT_PUBLIC_BASE_URL=https://your-app.vercel.app
   ```
   
   **Optional:**
   ```
   OPENAI_API_KEY=sk-your-openai-api-key
   NEXT_PUBLIC_ADSENSE_PUBLISHER_ID=ca-pub-XXXXXXXXXXXXXXXX
   GOOGLE_SITE_VERIFICATION=your-verification-code
   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (usually 2-3 minutes)
   - Your app will be live at `https://your-app.vercel.app`

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```
   
   Follow the prompts:
   - Set up and deploy? **Yes**
   - Which scope? Select your account
   - Link to existing project? **No** (first time)
   - Project name? `ats-scanner` (or your choice)
   - Directory? `./` (current directory)
   - Override settings? **No**

4. **Add Environment Variables**
   ```bash
   vercel env add STRIPE_SECRET_KEY
   vercel env add STRIPE_WEBHOOK_SECRET
   vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
   vercel env add NEXT_PUBLIC_BASE_URL
   # Add other variables as needed
   ```

5. **Deploy to Production**
   ```bash
   vercel --prod
   ```

## Post-Deployment Setup

### 1. Configure Stripe Webhook

1. Go to Stripe Dashboard → Developers → Webhooks
2. Click "Add endpoint"
3. Endpoint URL: `https://your-app.vercel.app/api/webhook`
4. Select events: `checkout.session.completed`
5. Copy the webhook signing secret
6. Add it to Vercel environment variables as `STRIPE_WEBHOOK_SECRET`

### 2. Update Base URL

1. Go to Vercel project settings
2. Update `NEXT_PUBLIC_BASE_URL` to your actual domain:
   ```
   NEXT_PUBLIC_BASE_URL=https://your-app.vercel.app
   ```

### 3. Test the Deployment

1. Visit your deployed site
2. Upload a test resume
3. Check that scanning works
4. Test the payment flow (use Stripe test mode first)

### 4. Set Up Custom Domain (Optional)

1. Go to Vercel project → Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update `NEXT_PUBLIC_BASE_URL` to your custom domain

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `STRIPE_SECRET_KEY` | Yes | Stripe secret key (use `sk_live_` for production) |
| `STRIPE_WEBHOOK_SECRET` | Yes | Stripe webhook signing secret |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Yes | Stripe publishable key (use `pk_live_` for production) |
| `NEXT_PUBLIC_BASE_URL` | Yes | Your Vercel app URL |
| `OPENAI_API_KEY` | No | OpenAI API key for AI explanations |
| `NEXT_PUBLIC_ADSENSE_PUBLISHER_ID` | No | Google AdSense publisher ID |
| `GOOGLE_SITE_VERIFICATION` | No | Google Search Console verification code |
| `NEXT_PUBLIC_GA_ID` | No | Google Analytics tracking ID |

## Troubleshooting

### Build Fails

- Check that all dependencies are in `package.json`
- Ensure TypeScript errors are resolved
- Check build logs in Vercel dashboard

### API Routes Not Working

- Verify environment variables are set correctly
- Check that `NEXT_PUBLIC_BASE_URL` matches your domain
- Review serverless function logs in Vercel dashboard

### Stripe Webhook Not Working

- Verify webhook URL is correct in Stripe dashboard
- Check `STRIPE_WEBHOOK_SECRET` matches Stripe's signing secret
- Test webhook in Stripe dashboard → Webhooks → Send test webhook

### AdSense Not Showing

- Ensure AdSense account is approved
- Verify `NEXT_PUBLIC_ADSENSE_PUBLISHER_ID` is correct
- Check browser console for AdSense errors
- Wait 24-48 hours after site approval for ads to appear

## Performance Optimization

Vercel automatically optimizes Next.js apps, but you can:

1. **Enable Edge Functions** (if needed)
   - Update API routes to use Edge Runtime
   - Faster response times globally

2. **Optimize Images**
   - Use Next.js Image component
   - Images are automatically optimized by Vercel

3. **Monitor Performance**
   - Use Vercel Analytics (free tier available)
   - Check Web Vitals in Vercel dashboard

## Security Checklist

- [ ] Use production Stripe keys (not test keys)
- [ ] Never commit `.env.local` to Git
- [ ] Enable Vercel's DDoS protection
- [ ] Set up rate limiting (if needed)
- [ ] Use HTTPS (automatic on Vercel)
- [ ] Review and update CORS settings if needed

## Support

- Vercel Documentation: https://vercel.com/docs
- Next.js Deployment: https://nextjs.org/docs/deployment
- Vercel Support: https://vercel.com/support

