# OptiChain Deployment Guide

Hướng dẫn deploy OptiChain WS & DWS lên production.

## Kiến trúc Deployment

```
┌─────────────────────────────────────────┐
│         Mobile Apps (iOS/Android)        │
│           Built by Codemagic            │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌────────────────────────────────────────┐
│      Frontend (Firebase Hosting)       │
│          Next.js Static Export         │
└────────────────┬───────────────────────┘
                 │
                 ▼
┌────────────────────────────────────────┐
│     Backend API (Google Cloud Run)     │
│          FastAPI + Python              │
└────────────────┬───────────────────────┘
                 │
                 ▼
┌────────────────────────────────────────┐
│    Database (Cloud SQL PostgreSQL)     │
└────────────────────────────────────────┘
```

## Prerequisites

### 1. Google Cloud Platform
- Tạo project trên [GCP Console](https://console.cloud.google.com)
- Enable APIs:
  - Cloud Run API
  - Cloud SQL API
  - Cloud Build API

### 2. Firebase
- Tạo project trên [Firebase Console](https://console.firebase.google.com)
- Liên kết với GCP project (nếu chưa)
- Install Firebase CLI: `npm install -g firebase-tools`

### 3. Codemagic
- Tạo account tại [codemagic.io](https://codemagic.io)
- Connect GitHub repository
- Thêm certificates cho iOS (nếu deploy iOS)

### 4. Tools cần cài
```bash
# Google Cloud CLI
curl https://sdk.cloud.google.com | bash

# Firebase CLI
npm install -g firebase-tools

# Flutter (cho local testing)
# Follow: https://flutter.dev/docs/get-started/install
```

---

## 1. Deploy Database (Cloud SQL PostgreSQL)

### Tạo Cloud SQL instance

```bash
# Set project
gcloud config set project YOUR_PROJECT_ID

# Create PostgreSQL instance
gcloud sql instances create optichain-db \
  --database-version=POSTGRES_15 \
  --cpu=2 \
  --memory=4GB \
  --region=asia-southeast1 \
  --root-password=YOUR_ROOT_PASSWORD

# Create database
gcloud sql databases create optichain \
  --instance=optichain-db

# Create user
gcloud sql users create optichain_user \
  --instance=optichain-db \
  --password=YOUR_USER_PASSWORD
```

### Import schema

```bash
# Upload schema
gcloud sql import sql optichain-db \
  gs://your-bucket/schema.sql \
  --database=optichain

# Or connect via Cloud SQL Proxy
cloud_sql_proxy -instances=PROJECT_ID:REGION:optichain-db=tcp:5432
psql -h 127.0.0.1 -U optichain_user -d optichain -f database/schema.sql
```

### Get connection string

```bash
gcloud sql instances describe optichain-db --format="value(connectionName)"
# Output: project-id:region:instance-name
```

Connection string format:
```
postgresql://optichain_user:PASSWORD@/optichain?host=/cloudsql/PROJECT_ID:REGION:optichain-db
```

---

## 2. Deploy Backend (Cloud Run)

### Option A: Sử dụng script

```bash
# Cập nhật thông tin trong script
nano scripts/deploy-backend.sh

# Set environment variables
export DATABASE_URL="postgresql://..."
export SECRET_KEY="your-secret-key-here"

# Deploy
./scripts/deploy-backend.sh
```

### Option B: Manual deployment

```bash
cd backend

# Build và deploy
gcloud run deploy optichain-backend \
  --source . \
  --platform managed \
  --region asia-southeast1 \
  --allow-unauthenticated \
  --set-env-vars "DATABASE_URL=$DATABASE_URL,SECRET_KEY=$SECRET_KEY,ALLOWED_ORIGINS=https://your-app.web.app" \
  --add-cloudsql-instances PROJECT_ID:REGION:optichain-db
```

### Lấy URL backend

```bash
gcloud run services describe optichain-backend \
  --region asia-southeast1 \
  --format="value(status.url)"
```

**Lưu URL này để config frontend!**

---

## 3. Deploy Frontend (Firebase Hosting)

### Setup Firebase

```bash
# Login to Firebase
firebase login

# Initialize Firebase (nếu chưa)
firebase init hosting

# Chọn project của bạn
# Public directory: frontend/out
# Single-page app: Yes
# GitHub deploys: No (optional)
```

### Update API URL

Cập nhật file `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=https://optichain-backend-xxx-uc.a.run.app/api/v1
```

### Deploy

```bash
# Option A: Sử dụng script
./scripts/deploy-frontend.sh

# Option B: Manual
cd frontend
npm install
npm run build
cd ..
firebase deploy --only hosting
```

### Custom domain (optional)

```bash
firebase hosting:channel:deploy production
# Hoặc setup custom domain trong Firebase Console
```

---

## 4. Deploy Mobile App (Codemagic)

### Setup Codemagic

1. **Connect repository**
   - Login vào [Codemagic](https://codemagic.io)
   - Add repository: `CodegymTuLG/aura`

2. **Configure workflow**
   - File `codemagic.yaml` đã được tạo sẵn
   - Update email trong config
   - Commit và push

3. **Add credentials** (trong Codemagic UI)

   **For Android:**
   - Keystore file
   - Keystore password
   - Key alias
   - Key password

   **For iOS:**
   - Apple Developer certificate
   - Provisioning profile
   - App Store Connect API key

### Trigger build

```bash
# Push to GitHub sẽ tự động trigger build
git add .
git commit -m "Setup deployment configs"
git push origin develop_WS_DWS_ver1
```

### Manual build trên Codemagic

1. Vào Codemagic dashboard
2. Chọn workflow: `ios-android-workflow` hoặc `android-workflow`
3. Click "Start new build"
4. Chọn branch: `develop_WS_DWS_ver1`
5. Click "Start build"

### Download APK/AAB

Sau khi build xong:
- APK: Download từ Artifacts
- AAB: Upload lên Google Play Console
- iOS: Upload lên TestFlight/App Store Connect

---

## 5. Environment Variables

### Backend (.env)
```env
DATABASE_URL=postgresql://user:pass@/db?host=/cloudsql/project:region:instance
SECRET_KEY=your-secret-key-minimum-32-characters
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
ALLOWED_ORIGINS=https://your-app.web.app,https://your-app.firebaseapp.com
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=https://your-backend-url.run.app/api/v1
```

### Mobile (lib/utils/config.dart)
```dart
class Config {
  static const String apiUrl = 'https://your-backend-url.run.app/api/v1';
}
```

---

## 6. Deployment Checklist

### Pre-deployment
- [ ] Database schema đã được import
- [ ] Environment variables đã được set
- [ ] Backend API đã test local
- [ ] Frontend đã test local
- [ ] Mobile app đã test trên emulator/simulator

### Backend deployment
- [ ] Cloud SQL instance đã chạy
- [ ] Cloud Run service đã deploy
- [ ] API endpoints hoạt động (test bằng curl/Postman)
- [ ] CORS đã được config đúng

### Frontend deployment
- [ ] API URL đã được update
- [ ] Build successful (`npm run build`)
- [ ] Firebase Hosting đã deploy
- [ ] Website accessible từ Firebase URL

### Mobile deployment
- [ ] Codemagic đã được setup
- [ ] Credentials (keystore/certificates) đã add
- [ ] Build successful trên Codemagic
- [ ] APK/IPA có thể download và install

---

## 7. Monitoring & Logs

### Backend logs (Cloud Run)
```bash
gcloud run services logs read optichain-backend \
  --region asia-southeast1 \
  --limit 50
```

### Frontend logs (Firebase)
```bash
firebase hosting:channel:list
```

### Mobile logs
- Android: Codemagic build logs
- iOS: Xcode logs hoặc TestFlight feedback

---

## 8. CI/CD Pipeline

### Automatic deployment flow

```
Git Push → GitHub
    ↓
    ├─→ Codemagic (Mobile)
    │      ↓
    │   Build APK/AAB
    │      ↓
    │   Build IPA
    │      ↓
    │   Distribute
    │
    ├─→ Cloud Build (Backend) [Optional]
    │      ↓
    │   Deploy to Cloud Run
    │
    └─→ GitHub Actions (Frontend) [Optional]
           ↓
       Deploy to Firebase
```

### Setup GitHub Actions (Optional)

Tạo `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Firebase

on:
  push:
    branches: [main, develop_WS_DWS_ver1]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: cd frontend && npm install && npm run build
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          channelId: live
```

---

## 9. Costs Estimation

### GCP (Monthly)
- **Cloud Run**: $0 - $30 (depending on traffic)
- **Cloud SQL**: $25 - $100 (db-f1-micro to db-n1-standard-2)
- **Cloud Build**: $0 (120 build-minutes/day free)
- **Total**: ~$25 - $130/month

### Firebase
- **Hosting**: Free (10GB storage, 360MB/day transfer)
- **Functions**: Free tier available

### Codemagic
- **Free tier**: 500 build minutes/month
- **Paid**: Starting from $39/month for unlimited builds

**Total estimated**: $25 - $170/month (depending on usage)

---

## 10. Troubleshooting

### Backend issues

**Issue**: Cloud Run deploy failed
```bash
# Check logs
gcloud run services logs read optichain-backend --region asia-southeast1

# Common fixes:
# - Check Dockerfile syntax
# - Verify requirements.txt
# - Check environment variables
```

**Issue**: Database connection failed
```bash
# Test connection
gcloud sql connect optichain-db --user=optichain_user

# Check Cloud SQL Proxy
cloud_sql_proxy -instances=PROJECT:REGION:INSTANCE=tcp:5432
```

### Frontend issues

**Issue**: Build failed
```bash
# Clear cache
cd frontend
rm -rf .next node_modules
npm install
npm run build
```

**Issue**: API calls failing (CORS)
- Check `ALLOWED_ORIGINS` in backend
- Verify API URL in frontend `.env.local`

### Mobile issues

**Issue**: Codemagic build failed
- Check Flutter version compatibility
- Verify dependencies in `pubspec.yaml`
- Check build logs in Codemagic dashboard

**Issue**: APK not installing
- Check minimum SDK version
- Verify signing configuration

---

## 11. Next Steps

1. **Setup monitoring**: Add Cloud Monitoring for backend
2. **Add analytics**: Firebase Analytics cho mobile
3. **Setup alerts**: Email/SMS alerts cho errors
4. **Backup strategy**: Automated Cloud SQL backups
5. **CDN**: CloudFlare hoặc Cloud CDN cho frontend

---

## Support

Nếu gặp vấn đề:
1. Check logs trước (backend/frontend/mobile)
2. Review environment variables
3. Test locally trước khi deploy
4. Contact team lead

---

**Last updated**: 2025-12-26
