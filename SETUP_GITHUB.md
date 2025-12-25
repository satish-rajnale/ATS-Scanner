# Setting Up GitHub Repository

## Step 1: Create Repository on GitHub

1. Go to https://github.com/new
2. Repository name: `ats-scanner` (or your preferred name)
3. Description: "ATS Resume Scanner - Zero-Capital Micro-SaaS MVP"
4. Choose: **Public** or **Private**
5. **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. Click "Create repository"

## Step 2: Connect Your Local Repository

After creating the repository, GitHub will show you commands. Use these:

### If you haven't initialized git yet:
```bash
git init
git add .
git commit -m "Initial commit: ATS Scanner MVP"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/ats-scanner.git
git push -u origin main
```

### If you already have git initialized (your case):
```bash
# Remove the placeholder remote
git remote remove origin

# Add your actual GitHub repository URL
git remote add origin https://github.com/YOUR_USERNAME/ats-scanner.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

## Step 3: Replace YOUR_USERNAME

Replace `YOUR_USERNAME` with your actual GitHub username in the commands above.

For example, if your username is `johndoe`:
```bash
git remote add origin https://github.com/johndoe/ats-scanner.git
```

## Troubleshooting

### Error: "repository not found"
- Make sure you created the repository on GitHub first
- Check that the repository name matches exactly
- Verify you have access to the repository

### Error: "authentication failed"
- Use GitHub Personal Access Token instead of password
- Generate token: GitHub Settings → Developer settings → Personal access tokens → Generate new token
- Use token as password when prompted

### Error: "remote origin already exists"
- Remove it first: `git remote remove origin`
- Then add the correct one

### Error: "failed to push some refs"
- Make sure the repository exists on GitHub
- Check that you're using the correct URL
- Try: `git push -u origin main --force` (only if you're sure, this overwrites remote)

