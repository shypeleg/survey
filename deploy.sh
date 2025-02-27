#!/bin/bash
# Simple deployment script for Chef Survey application

# Exit immediately if a command exits with a non-zero status
set -e

echo "🚀 Starting Chef Survey deployment process..."

# Ensure environment variables are set
if [ ! -f .env.local ]; then
  echo "📝 Creating .env.local file with required environment variables..."
  echo "NEXTAUTH_URL=https://your-app.vercel.app" > .env.local
  echo "NEXTAUTH_SECRET=$(openssl rand -base64 32)" >> .env.local
  echo "✅ .env.local file created. Please update NEXTAUTH_URL after deployment."
fi

# Build the application
echo "📦 Building the application..."
npm run build

# Check if Vercel CLI is installed
if command -v vercel &> /dev/null; then
  echo "🔄 Deploying to Vercel..."
  # Pass environment variables to Vercel
  vercel --prod
  echo "✅ Deployment to Vercel complete!"
else
  echo "ℹ️ Vercel CLI not found. To deploy to Vercel automatically, install the Vercel CLI:"
  echo "  npm install -g vercel"
  echo ""
  echo "🔧 For other deployment options, please see the deploy-guide.md file."
fi

echo "🎉 Build process complete! Your application is ready for deployment."
echo "📝 For detailed deployment instructions, refer to deploy-guide.md"