# ATS Resume Scanner - Zero-Capital Micro-SaaS MVP

A full-stack Next.js application that scans resumes for ATS (Applicant Tracking System) compatibility. Built for deployment on Vercel with one-time payment integration via Stripe.

## Features

- **Free ATS Scanning**: Upload PDF or DOCX resumes and get instant ATS scores
- **Keyword Matching**: Compare your resume against job descriptions
- **Issue Detection**: Identify formatting problems and missing sections
- **AI-Powered Explanations**: Get detailed insights with OpenAI (premium feature)
- **One-Time Payments**: Unlock full reports via Stripe Checkout
- **SEO Optimized**: Content-rich pages for organic discovery
- **Privacy First**: Resumes processed in-memory, never stored

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Next.js API Routes
- **Payments**: Stripe Checkout
- **AI**: OpenAI API (GPT-3.5-turbo)
- **File Parsing**: pdf-parse, mammoth
- **Deployment**: Vercel

## Project Structure

```
ats-scanner/
├── app/
│   ├── api/
│   │   ├── scan-resume/      # Resume processing endpoint
│   │   ├── ai-explain/       # OpenAI explanation endpoint
│   │   ├── create-checkout-session/  # Stripe checkout
│   │   └── webhook/           # Stripe webhook handler
│   ├── ats-resume-scanner/   # SEO page
│   ├── how-to-pass-ats/      # SEO page
│   ├── resume-ats-score-explained/  # SEO page
│   ├── privacy-policy/       # Legal page
│   ├── refund-policy/        # Legal page
│   ├── terms/                # Legal page
│   ├── contact/              # Contact page
│   ├── results/              # Results page with paywall
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Landing page
│   ├── globals.css           # Global styles
│   ├── sitemap.ts            # SEO sitemap
│   └── robots.ts             # SEO robots.txt
├── lib/
│   ├── resume-parser.ts      # PDF/DOCX parsing utilities
│   └── ats-scorer.ts         # ATS scoring algorithm
└── package.json
```

## Setup Instructions

### 1. Clone and Install

```bash
cd ats-scanner
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```env
# OpenAI API (optional - fallback explanation used if not provided)
OPENAI_API_KEY=sk-your-openai-api-key

# Stripe Keys (required for payments)
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your-publishable-key

# Base URL (for production, set to your Vercel domain)
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Google AdSense (for monetization)
# Get your publisher ID from https://www.google.com/adsense
# Format: ca-pub-XXXXXXXXXXXXXXXX
NEXT_PUBLIC_ADSENSE_PUBLISHER_ID=ca-pub-YOUR_PUBLISHER_ID

# Google Site Verification (optional, for Search Console)
GOOGLE_SITE_VERIFICATION=your-verification-code

# Google Analytics (optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### 3. Stripe Setup

1. Create a Stripe account at https://stripe.com
2. Get your API keys from the Stripe Dashboard
3. Create a webhook endpoint:
   - URL: `https://your-domain.vercel.app/api/webhook`
   - Events to listen for: `checkout.session.completed`, `payment_intent.succeeded`
4. Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET`

### 4. OpenAI Setup (Optional)

1. Get an API key from https://platform.openai.com
2. Add it to `OPENAI_API_KEY`
3. If not provided, the app will use fallback static explanations

### 6. Google AdSense Setup (Optional)

1. Create a Google AdSense account at https://www.google.com/adsense
2. Get your Publisher ID (format: `ca-pub-XXXXXXXXXXXXXXXX`)
3. Add it to `NEXT_PUBLIC_ADSENSE_PUBLISHER_ID` in `.env.local`
4. Update the ad slot IDs in `components/AdSense.tsx`:
   - `LEFT_SIDEBAR` - Replace with your left sidebar ad slot ID
   - `RIGHT_SIDEBAR` - Replace with your right sidebar ad slot ID
   - `BOTTOM_BANNER` - Replace with your bottom banner ad slot ID
   - `IN_ARTICLE` - Replace with your in-article ad slot ID
5. AdSense ads will appear on:
   - Left and right sidebars (desktop only)
   - Bottom of pages (banner)
   - In-article placements (SEO pages)

**Note**: AdSense requires site approval before ads start showing. Use test mode during development.

### 7. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Vercel Deployment

### Quick Deploy (5 minutes)

See [QUICK_DEPLOY.md](./QUICK_DEPLOY.md) for step-by-step instructions.

### Summary

1. **Push to Git**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Deploy to Vercel**:
   - Go to https://vercel.com/new
   - Import your Git repository
   - Add environment variables (see below)
   - Click "Deploy"

3. **Required Environment Variables**:
   ```
   STRIPE_SECRET_KEY=sk_live_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
   NEXT_PUBLIC_BASE_URL=https://your-app.vercel.app
   ```

4. **Configure Stripe Webhook**:
   - URL: `https://your-app.vercel.app/api/webhook`
   - Event: `checkout.session.completed`

For detailed instructions, see:
- **Quick Guide**: [QUICK_DEPLOY.md](./QUICK_DEPLOY.md)
- **Full Guide**: [DEPLOYMENT.md](./DEPLOYMENT.md)

## How It Works

### Resume Processing Flow

1. User uploads resume (PDF/DOCX) on landing page
2. File is sent to `/api/scan-resume`
3. Backend extracts text using `pdf-parse` or `mammoth`
4. ATS scoring algorithm analyzes:
   - Essential sections (Contact, Experience, Education, Skills)
   - Formatting issues (tables, columns, image-only)
   - Resume length
   - Keyword matching (if job description provided)
5. Results returned with ATS score and preview issues (first 2)
6. Results stored in sessionStorage and displayed on results page

### Payment Flow

1. User clicks "Unlock Full Report" on results page
2. Frontend calls `/api/create-checkout-session`
3. Stripe Checkout session created ($3.99 one-time payment)
4. User redirected to Stripe payment page
5. After payment, redirected back with `payment_success=true`
6. Frontend calls `/api/ai-explain` to get full AI explanation
7. Full report displayed with all issues and AI insights

### ATS Scoring Algorithm

Starting score: 100 points

**Deductions:**
- Missing Contact Info: -5
- Missing Experience: -10
- Missing Education: -5
- Missing Skills: -10
- Image-only resume: -20
- Tables detected: -10
- Columns detected: -5
- Resume too long/short: -5
- Low keyword match: -5 to -20 (based on percentage)

Final score clamped between 0-100.

## API Endpoints

### POST `/api/scan-resume`

Processes a resume file and returns ATS analysis.

**Request:**
- `multipart/form-data`
- `resume`: File (PDF or DOCX, max 5MB)
- `jobDescription`: string (optional)

**Response:**
```json
{
  "atsScore": 75,
  "keywordMatchPercentage": 65.5,
  "detectedIssues": [...],
  "previewIssues": [...],
  "rawFindings": {...}
}
```

### POST `/api/ai-explain`

Generates AI-powered explanation of ATS score.

**Request:**
```json
{
  "atsScore": 75,
  "issues": [...],
  "rawFindings": {...}
}
```

**Response:**
```json
{
  "explanation": "Your resume received an ATS score of 75/100..."
}
```

### POST `/api/create-checkout-session`

Creates Stripe Checkout session for payment.

**Request:**
```json
{
  "returnUrl": "/results?payment_success=true"
}
```

**Response:**
```json
{
  "url": "https://checkout.stripe.com/..."
}
```

### POST `/api/webhook`

Handles Stripe webhook events (payment confirmations).

## Customization

### Change Payment Amount

Edit `app/api/create-checkout-session/route.ts`:
```typescript
unit_amount: 399, // Change to desired amount in cents
```

### Modify ATS Scoring

Edit `lib/ats-scorer.ts` to adjust scoring weights and detection logic.

### Update SEO Content

Edit the SEO pages in `app/ats-resume-scanner/`, `app/how-to-pass-ats/`, and `app/resume-ats-score-explained/`.

### SEO Features

The app includes comprehensive SEO optimization:

- **Structured Data**: JSON-LD schema markup for better search visibility
- **Meta Tags**: Optimized titles, descriptions, and Open Graph tags
- **Sitemap**: Auto-generated XML sitemap at `/sitemap.xml`
- **Robots.txt**: Proper crawling directives
- **Black Headers**: All H1-H6 headings are styled in black for better readability and SEO
- **Internal Linking**: Strategic internal links between pages
- **Content-Rich Pages**: 800-1200 word SEO pages with proper heading hierarchy

### AdSense Monetization

The app includes Google AdSense integration for monetization:

- **Sidebar Ads**: Fixed left and right sidebar ads (desktop only, 160x600px)
- **Bottom Banner**: Responsive banner ad at bottom of pages (728x90px)
- **In-Article Ads**: Auto ads in content sections (SEO pages)

To enable:
1. Get AdSense Publisher ID
2. Add to `NEXT_PUBLIC_ADSENSE_PUBLISHER_ID`
3. Create ad units in AdSense dashboard
4. Update slot IDs in `components/AdSense.tsx`

## Limitations

- **Stateless**: No database, so results are lost after session ends
- **File Size**: 5MB limit for resume uploads
- **Formats**: Only PDF and DOCX supported
- **No User Accounts**: No authentication or saved history

## Future Enhancements

- Add database for user accounts and scan history
- Support more file formats
- Email reports
- Batch scanning
- Resume templates
- Integration with job boards

## License

This project is provided as-is for MVP purposes.

## Support

For issues or questions, see the `/contact` page or open an issue in the repository.

