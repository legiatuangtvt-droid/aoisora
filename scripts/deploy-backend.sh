#!/bin/bash
# Deploy Backend to Google Cloud Run

echo "🚀 Deploying Backend to Cloud Run..."

# Set your variables
PROJECT_ID="your-gcp-project-id"
REGION="asia-southeast1"
SERVICE_NAME="optichain-backend"

# Navigate to backend directory
cd backend

# Build and deploy to Cloud Run
echo "🔨 Building and deploying..."
gcloud run deploy $SERVICE_NAME \
  --source . \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --project $PROJECT_ID \
  --set-env-vars "DATABASE_URL=$DATABASE_URL,SECRET_KEY=$SECRET_KEY"

echo "✅ Backend deployed successfully!"
echo "📝 Update your frontend .env with the Cloud Run URL"
