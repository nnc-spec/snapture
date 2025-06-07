#!/bin/bash

# Snapture GitHub Repository Initialization Script

echo "🚀 Initializing Snapture Git Repository..."

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first."
    exit 1
fi

# Initialize git repository
echo "📁 Initializing git repository..."
git init

# Add all files
echo "📝 Adding all files..."
git add .

# Create initial commit
echo "💾 Creating initial commit..."
git commit -m "Initial commit: Snapture AI visual memory creator

✨ Features:
- Complete React frontend with TypeScript
- Express backend with PostgreSQL
- AI image generation with Pollinations.ai
- Stripe payment integration
- Mobile app structure for iOS deployment
- Memory persistence and user-friendly checkout flow

🛠️ Tech Stack:
- Frontend: React 18, TypeScript, TailwindCSS, Shadcn/ui
- Backend: Node.js, Express, PostgreSQL, Drizzle ORM
- AI: OpenRouter, Pollinations.ai
- Payments: Stripe
- Mobile: React Native with Expo

🚀 Ready for production deployment"

echo "✅ Git repository initialized successfully!"
echo ""
echo "Next steps:"
echo "1. Create a repository on GitHub named 'snapture'"
echo "2. Run: git remote add origin https://github.com/YOUR_USERNAME/snapture.git"
echo "3. Run: git branch -M main"
echo "4. Run: git push -u origin main"
echo ""
echo "📖 For detailed instructions, see: scripts/setup-github.md"