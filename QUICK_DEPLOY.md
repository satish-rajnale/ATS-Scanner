# Quick Vercel Deployment Guide

## 🚀 Deploy in 5 Minutes

### Step 1: Push to GitHub (2 min)

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit: ATS Scanner MVP"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/ats-scanner.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Vercel (3 min)

1. **Go to Vercel**: https://vercel.com/new
2. **Import Repository**: Click "Import Git Repository" and select your repo
3. **Configure Project**:
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
4. **Add Environment Variables** (click "Environment Variables"):
   
   **Required:**
   ```
   STRIPE_SECRET_KEY=sk_test_... (or sk_live_... for production)
   STRIPE_WEBHOOK_SECRET=whsec_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_... (or pk_live_...)
   ```
   
   **After first deployment, add:**
   ```
   NEXT_PUBLIC_BASE_URL=https://your-app-name.vercel.app
   ```
   
   **Optional:**
   ```
   OPENAI_API_KEY=sk-...
   NEXT_PUBLIC_ADSENSE_PUBLISHER_ID=ca-pub-...
   GOOGLE_SITE_VERIFICATION=...
   NEXT_PUBLIC_GA_ID=G-...
   ```

5. **Deploy**: Click "Deploy" button
6. **Wait**: Build takes 2-3 minutes

### Step 3: Configure Stripe Webhook (2 min)

1. **Get your Vercel URL**: After deployment, copy your app URL (e.g., `https://ats-scanner.vercel.app`)
2. **Stripe Dashboard**: Go to https://dashboard.stripe.com/webhooks
3. **Add Endpoint**:
   - Endpoint URL: `https://your-app.vercel.app/api/webhook`
   - Events to send: Select `checkout.session.completed`
   - Click "Add endpoint"
4. **Copy Webhook Secret**: Click on the webhook → "Signing secret" → "Reveal"
5. **Update Vercel**: Go to Vercel project → Settings → Environment Variables
   - Update `STRIPE_WEBHOOK_SECRET` with the new secret
   - Redeploy (or it will auto-update)

### Step 4: Update Base URL (1 min)

1. Go to Vercel project → Settings → Environment Variables
2. Add/Update: `NEXT_PUBLIC_BASE_URL` = `https://your-app-name.vercel.app`
3. Redeploy (or wait for auto-deploy)

### ✅ Done!

Your app is now live at `https://your-app-name.vercel.app`

## 🔧 Troubleshooting

**Build fails?**
- Check Vercel build logs
- Ensure all dependencies are in `package.json`
- Fix any TypeScript errors

**Stripe not working?**
- Verify webhook URL matches your Vercel domain
- Check `STRIPE_WEBHOOK_SECRET` is correct
- Test in Stripe Dashboard → Webhooks → Send test webhook

**Environment variables not working?**
- Make sure to use `NEXT_PUBLIC_` prefix for client-side variables
- Redeploy after adding new variables
- Check variable names match exactly (case-sensitive)

## 📚 More Help

- Full deployment guide: [DEPLOYMENT.md](./DEPLOYMENT.md)
- Vercel docs: https://vercel.com/docs
- Next.js deployment: https://nextjs.org/docs/deployment

