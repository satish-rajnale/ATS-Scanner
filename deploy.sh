#!/bin/bash

# ATS Scanner - Vercel Deployment Script
# This script helps prepare your project for Vercel deployment

echo "🚀 Preparing ATS Scanner for Vercel Deployment..."

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing Git repository..."
    git init
    git branch -M main
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "⚠️  Warning: .env.local not found. Make sure to add environment variables in Vercel dashboard."
fi

# Check for required files
echo "✅ Checking project structure..."
required_files=("package.json" "next.config.js" "tsconfig.json" "tailwind.config.ts")
for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✓ $file"
    else
        echo "  ✗ Missing: $file"
    fi
done

echo ""
echo "📝 Next steps:"
echo "1. Push to GitHub/GitLab/Bitbucket:"
echo "   git add ."
echo "   git commit -m 'Ready for deployment'"
echo "   git remote add origin <your-repo-url>"
echo "   git push -u origin main"
echo ""
echo "2. Go to https://vercel.com/new and import your repository"
echo ""
echo "3. Add these environment variables in Vercel:"
echo "   - STRIPE_SECRET_KEY"
echo "   - STRIPE_WEBHOOK_SECRET"
echo "   - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
echo "   - NEXT_PUBLIC_BASE_URL (set after first deployment)"
echo "   - OPENAI_API_KEY (optional)"
echo "   - NEXT_PUBLIC_ADSENSE_PUBLISHER_ID (optional)"
echo ""
echo "4. Deploy and update NEXT_PUBLIC_BASE_URL with your Vercel domain"
echo ""
echo "📖 For detailed instructions, see DEPLOYMENT.md"
echo ""
echo "✨ Ready to deploy!"

