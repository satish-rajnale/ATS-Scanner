#!/bin/bash

# Script to fix GitHub remote URL
# Replace YOUR_USERNAME with your actual GitHub username

echo "🔧 Fixing GitHub Remote URL"
echo ""
echo "Before running this script:"
echo "1. Create a repository on GitHub at https://github.com/new"
echo "2. Name it 'ats-scanner' (or your preferred name)"
echo "3. DO NOT initialize with README, .gitignore, or license"
echo "4. Copy your repository URL (e.g., https://github.com/YOUR_USERNAME/ats-scanner.git)"
echo ""
read -p "Enter your GitHub repository URL: " REPO_URL

if [ -z "$REPO_URL" ]; then
    echo "❌ Error: Repository URL is required"
    exit 1
fi

# Remove existing remote if it exists
git remote remove origin 2>/dev/null

# Add the correct remote
git remote add origin "$REPO_URL"

# Rename branch to main if on master
current_branch=$(git branch --show-current)
if [ "$current_branch" = "master" ]; then
    git branch -M main
    echo "✅ Renamed branch from master to main"
fi

echo ""
echo "✅ Remote URL updated to: $REPO_URL"
echo ""
echo "Next steps:"
echo "1. Verify remote: git remote -v"
echo "2. Push to GitHub: git push -u origin main"
echo ""

