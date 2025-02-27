#!/bin/bash
# Simple deployment script for Chef Survey application

# Exit immediately if a command exits with a non-zero status
set -e

echo "🚀 Starting Chef Survey deployment process..."

# Build the application
echo "📦 Building the application..."
npm run build

# Check if Vercel CLI is installed
if command -v vercel &> /dev/null; then
  echo "🔄 Deploying to Vercel..."
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