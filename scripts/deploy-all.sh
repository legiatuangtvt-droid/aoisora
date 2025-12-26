#!/bin/bash
# Deploy entire stack

echo "🚀 Deploying OptiChain Full Stack..."

# Deploy Backend first
echo "1️⃣ Deploying Backend to Cloud Run..."
./scripts/deploy-backend.sh

# Wait for user to update frontend env
echo ""
echo "⚠️  Please update frontend/.env.local with the Cloud Run URL"
read -p "Press Enter when ready to continue..."

# Deploy Frontend
echo ""
echo "2️⃣ Deploying Frontend to Firebase..."
./scripts/deploy-frontend.sh

echo ""
echo "✅ Full stack deployed!"
echo "📱 Mobile app: Push to GitHub to trigger Codemagic build"
