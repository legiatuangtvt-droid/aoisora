#!/bin/bash
# Deploy Frontend to Firebase Hosting

echo "🚀 Deploying Frontend to Firebase Hosting..."

# Navigate to frontend directory
cd frontend

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build Next.js static export
echo "🔨 Building Next.js app..."
npm run build

# Go back to root
cd ..

# Deploy to Firebase
echo "☁️  Deploying to Firebase..."
firebase deploy --only hosting

echo "✅ Frontend deployed successfully!"
