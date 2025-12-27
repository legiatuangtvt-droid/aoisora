# Deploy Frontend lên Firebase Hosting - Hướng dẫn chi tiết

Hướng dẫn từng bước để deploy OptiChain Frontend (Next.js) lên Firebase Hosting.

## 📋 Mục lục

1. [Chuẩn bị](#1-chuẩn-bị)
2. [Tạo Firebase Project](#2-tạo-firebase-project)
3. [Cài đặt Firebase CLI](#3-cài-đặt-firebase-cli)
4. [Configure Frontend](#4-configure-frontend)
5. [Deploy Frontend](#5-deploy-frontend)
6. [Verify Deployment](#6-verify-deployment)
7. [Troubleshooting](#7-troubleshooting)

---

## 1. Chuẩn bị

### ✅ Checklist

- [ ] Đã deploy Backend lên Cloud Run (có Service URL)
- [ ] Node.js đã cài (version 18+)
- [ ] npm hoặc yarn đã cài
- [ ] Có tài khoản Google

### 💰 Chi phí

- **Firebase Hosting**: **FREE**
  - 10 GB storage
  - 360 MB/day bandwidth
  - SSL certificate miễn phí
  - Global CDN

---

## 2. Tạo Firebase Project

### Bước 2.1: Truy cập Firebase Console

1. Mở browser: https://console.firebase.google.com
2. Đăng nhập bằng Google account

### Bước 2.2: Tạo Project mới

1. **Click "Add project" hoặc "Create a project"**

2. **Step 1 - Project name:**
   ```
   Project name: OptiChain Production
   ```
   - Firebase sẽ tự tạo Project ID: `optichain-production-xxxx`
   - Click "Continue"

3. **Step 2 - Google Analytics:**
   ```
   Enable Google Analytics: ✅ (recommended)
   ```
   - Click "Continue"

4. **Step 3 - Configure Analytics:**
   ```
   Analytics location: Vietnam (hoặc Singapore)
   ```
   - Accept terms
   - Click "Create project"

5. **Chờ 30-60 giây** để Firebase setup

6. **Click "Continue"** khi thấy "Your new project is ready"

### Bước 2.3: Setup Hosting

1. **Trong Firebase Console, sidebar → "Build" → "Hosting"**

2. **Click "Get started"**

3. **Sẽ thấy hướng dẫn setup Firebase CLI** (chúng ta sẽ làm ở bước tiếp)

4. **Lưu lại Project ID:**
   - Góc trên → Settings (⚙️) → Project settings
   - Copy "Project ID": `optichain-production-xxxx`

---

## 3. Cài đặt Firebase CLI

### Bước 3.1: Cài Firebase Tools

**Windows/Mac/Linux:**

```bash
npm install -g firebase-tools

# Verify installation
firebase --version
# Should show: 13.x.x or higher
```

**Nếu gặp lỗi permission (Mac/Linux):**
```bash
sudo npm install -g firebase-tools
```

### Bước 3.2: Login vào Firebase

```bash
firebase login

# Sẽ mở browser
# Đăng nhập bằng Google account
# Cho phép Firebase CLI access

# Verify login
firebase projects:list

# Should see your project:
# optichain-production-xxxx
```

**Nếu đang ở môi trường CI/CD (không có browser):**
```bash
firebase login:ci
# Follow instructions, lưu lại token
```

---

## 4. Configure Frontend

### Bước 4.1: Update Firebase Config

1. **Navigate to project root:**
   ```bash
   cd c:\Users\PC\Documents\aura
   ```

2. **Edit `.firebaserc`:**
   ```bash
   notepad .firebaserc
   # Hoặc
   nano .firebaserc
   ```

3. **Update Project ID:**
   ```json
   {
     "projects": {
       "default": "optichain-production-xxxx"
     }
   }
   ```
   Replace `optichain-production-xxxx` với Project ID của bạn

4. **Save file**

### Bước 4.2: Update API URL

1. **Lấy Backend URL từ Cloud Run:**
   ```bash
   # Nếu đã deploy backend
   gcloud run services describe optichain-backend \
     --region asia-southeast1 \
     --format="value(status.url)"

   # Output example:
   # https://optichain-backend-abc123-uc.a.run.app
   ```

2. **Tạo `.env.local` cho frontend:**
   ```bash
   cd frontend

   # Windows
   echo NEXT_PUBLIC_API_URL=https://optichain-backend-abc123-uc.a.run.app/api/v1 > .env.local

   # Mac/Linux
   echo "NEXT_PUBLIC_API_URL=https://optichain-backend-abc123-uc.a.run.app/api/v1" > .env.local
   ```

3. **Verify `.env.local`:**
   ```bash
   cat .env.local
   # Should show:
   # NEXT_PUBLIC_API_URL=https://optichain-backend-abc123-uc.a.run.app/api/v1
   ```

### Bước 4.3: Test Build Locally

```bash
# Still in frontend directory

# Install dependencies
npm install

# Build for production
npm run build

# Should see:
# ✓ Generating static pages (3/3)
# ✓ Finalizing page optimization
#
# Route (app)                              Size     First Load JS
# ┌ ○ /                                    137 B          87.2 kB
# └ ○ /_not-found                          871 B          84.9 kB
```

**Nếu build thành công → OK!**

**Nếu có error:**
- Check `.env.local` đúng format
- Check `next.config.js` có `output: 'export'`
- Fix errors và build lại

---

## 5. Deploy Frontend

### Bước 5.1: Option A - Deploy bằng Script (Recommended)

1. **Back to project root:**
   ```bash
   cd ..
   # Now at: c:\Users\PC\Documents\aura
   ```

2. **Run deployment script:**
   ```bash
   # Windows (Git Bash hoặc WSL)
   bash scripts/deploy-frontend.sh

   # Mac/Linux
   chmod +x scripts/deploy-frontend.sh
   ./scripts/deploy-frontend.sh
   ```

3. **Script sẽ tự động:**
   - Install npm dependencies
   - Build Next.js app
   - Deploy lên Firebase Hosting

4. **Output expected:**
   ```
   🚀 Deploying Frontend to Firebase Hosting...
   📦 Installing dependencies...
   🔨 Building Next.js app...
   ☁️  Deploying to Firebase...

   ✔  Deploy complete!

   Project Console: https://console.firebase.google.com/project/optichain-production-xxxx/overview
   Hosting URL: https://optichain-production-xxxx.web.app
   ```

### Bước 5.2: Option B - Deploy Manual

```bash
# Navigate to project root
cd c:\Users\PC\Documents\aura

# Install frontend dependencies
cd frontend
npm install

# Build Next.js
npm run build

# Back to root
cd ..

# Deploy to Firebase
firebase deploy --only hosting
```

**Prompts:**
```
? What do you want to use as your public directory?
→ frontend/out

? Configure as a single-page app (rewrite all urls to /index.html)?
→ Yes

? Set up automatic builds and deploys with GitHub?
→ No (chọn Yes nếu muốn setup CI/CD sau)

? File frontend/out/index.html already exists. Overwrite?
→ No
```

**Deploy output:**
```
=== Deploying to 'optichain-production-xxxx'...

i  deploying hosting
i  hosting[optichain-production-xxxx]: beginning deploy...
i  hosting[optichain-production-xxxx]: found 15 files in frontend/out
✔  hosting[optichain-production-xxxx]: file upload complete
i  hosting[optichain-production-xxxx]: finalizing version...
✔  hosting[optichain-production-xxxx]: version finalized
i  hosting[optichain-production-xxxx]: releasing new version...
✔  hosting[optichain-production-xxxx]: release complete

✔  Deploy complete!

Project Console: https://console.firebase.google.com/project/optichain-production-xxxx/overview
Hosting URL: https://optichain-production-xxxx.web.app
```

**Lưu lại Hosting URL!**

---

## 6. Verify Deployment

### Bước 6.1: Test trên Browser

1. **Mở Hosting URL:**
   ```
   https://optichain-production-xxxx.web.app
   ```

2. **Kiểm tra:**
   - ✅ Trang load được
   - ✅ Hiển thị "OptiChain WS & DWS"
   - ✅ UI đúng như local
   - ✅ Không có lỗi trong Console (F12)

### Bước 6.2: Test API Connection

**Nếu frontend có call API:**

1. **Mở DevTools (F12) → Network tab**

2. **Trigger một API call** (ví dụ: login, fetch tasks)

3. **Check request:**
   - ✅ Request URL đúng (https://optichain-backend-abc123-uc.a.run.app/api/v1/...)
   - ✅ Response 200 OK
   - ✅ Data trả về đúng

**Nếu gặp CORS error:**
```
Access to fetch at 'https://...' from origin 'https://optichain-production-xxxx.web.app' has been blocked by CORS policy
```

**Fix:**
- Update backend `ALLOWED_ORIGINS` env var
- Redeploy backend

### Bước 6.3: Test trên Mobile

1. **Scan QR code** (Firebase Console → Hosting → Domain)
2. Hoặc mở URL trên mobile browser
3. Check responsive design

### Bước 6.4: Check Deployment History

```bash
firebase hosting:releases:list

# Output:
# Version    Status  Create Time           Deploy Time
# abc123     current 2 minutes ago         2 minutes ago
```

---

## 7. Troubleshooting

### Issue 1: Build Failed - "Module not found"

**Error:**
```
Error: Cannot find module 'next/font'
```

**Solution:**
```bash
cd frontend

# Clear cache
rm -rf node_modules .next

# Reinstall
npm install

# Rebuild
npm run build
```

### Issue 2: 404 Not Found on Routes

**Error:** All routes except `/` return 404

**Solution:**

1. **Check `firebase.json` has rewrite rules:**
   ```json
   {
     "hosting": {
       "public": "frontend/out",
       "rewrites": [
         {
           "source": "**",
           "destination": "/index.html"
         }
       ]
     }
   }
   ```

2. **Redeploy:**
   ```bash
   firebase deploy --only hosting
   ```

### Issue 3: API Calls Failing (CORS)

**Error in Console:**
```
CORS policy: No 'Access-Control-Allow-Origin' header
```

**Solution:**

1. **Update Backend ALLOWED_ORIGINS:**
   ```bash
   gcloud run services update optichain-backend \
     --region asia-southeast1 \
     --update-env-vars "ALLOWED_ORIGINS=https://optichain-production-xxxx.web.app,https://optichain-production-xxxx.firebaseapp.com"
   ```

2. **Wait 1 minute, test lại**

### Issue 4: Environment Variables Not Working

**Error:** API URL vẫn là localhost

**Solution:**

1. **Verify `.env.local` exists:**
   ```bash
   cd frontend
   ls .env.local
   ```

2. **Check content:**
   ```bash
   cat .env.local
   # Must have: NEXT_PUBLIC_API_URL=https://...
   ```

3. **Rebuild:**
   ```bash
   npm run build
   cd ..
   firebase deploy --only hosting
   ```

### Issue 5: Deployment Stuck

**Symptom:** `firebase deploy` hangs

**Solution:**

1. **Cancel (Ctrl+C)**

2. **Check network:**
   ```bash
   ping firebase.googleapis.com
   ```

3. **Re-login:**
   ```bash
   firebase logout
   firebase login
   ```

4. **Try again:**
   ```bash
   firebase deploy --only hosting
   ```

### Issue 6: Check Deployment Logs

```bash
# View hosting releases
firebase hosting:channel:list

# View deploy history
firebase hosting:releases:list

# Check project info
firebase projects:list
```

---

## 8. Update Frontend (Redeploy)

### Sau khi sửa code:

```bash
# 1. Navigate to frontend
cd frontend

# 2. Make changes to your code
# ... edit files ...

# 3. Test locally
npm run dev
# Open http://localhost:3000

# 4. Build
npm run build

# 5. Deploy
cd ..
firebase deploy --only hosting

# 6. Verify
# Open: https://optichain-production-xxxx.web.app
```

---

## 9. Advanced: Custom Domain

### Bước 9.1: Add Custom Domain

1. **Firebase Console → Hosting → Add custom domain**

2. **Enter domain:**
   ```
   app.yourdomain.com
   ```

3. **Verify ownership:**
   - Add TXT record to DNS
   - Wait for verification

4. **Configure DNS:**
   - Add A records (Firebase sẽ cung cấp IPs)

5. **Wait for SSL provision** (~15 phút)

### Bước 9.2: Update Backend CORS

```bash
gcloud run services update optichain-backend \
  --region asia-southeast1 \
  --update-env-vars "ALLOWED_ORIGINS=https://app.yourdomain.com"
```

---

## 10. Advanced: Preview Channels

### Tạo preview channel cho testing:

```bash
# Deploy to preview channel
firebase hosting:channel:deploy preview

# Output:
# ✔  Channel URL: https://optichain-production-xxxx--preview-abc123.web.app
# Expires: 2024-01-30
```

### Use cases:
- Test trước khi deploy production
- Show client để review
- A/B testing

---

## 11. Performance Optimization

### Bước 11.1: Enable Caching

Already configured in `firebase.json`:
```json
{
  "hosting": {
    "headers": [
      {
        "source": "**",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=3600"
          }
        ]
      }
    ]
  }
}
```

### Bước 11.2: Analyze Bundle Size

```bash
cd frontend

# Analyze build
npm run build

# Look for large chunks
# Optimize imports nếu cần
```

### Bước 11.3: Test Performance

1. **Open Hosting URL**
2. **F12 → Lighthouse**
3. **Run audit**
4. **Target:**
   - Performance: >90
   - Accessibility: >90
   - Best Practices: >90
   - SEO: >90

---

## 12. Monitoring & Analytics

### Firebase Console Metrics:

1. **Hosting → Dashboard:**
   - Requests/minute
   - Bandwidth usage
   - Most requested files

2. **Analytics → Dashboard:**
   - Active users
   - Page views
   - User demographics

### Setup Alerts:

1. **Integrations → Cloud Monitoring**
2. **Create alert for:**
   - High error rate
   - Unusual traffic spike

---

## 13. Rollback

### Nếu cần rollback về version cũ:

```bash
# List releases
firebase hosting:releases:list

# Rollback to previous version
firebase hosting:rollback

# Or specific version
firebase hosting:clone <source-site>:<source-release> <target-site>
```

---

## 14. CI/CD with GitHub Actions (Optional)

### Setup auto-deploy on git push:

1. **Generate Firebase token:**
   ```bash
   firebase login:ci
   # Save the token
   ```

2. **Add token to GitHub Secrets:**
   - GitHub repo → Settings → Secrets
   - Add: `FIREBASE_TOKEN`

3. **Create `.github/workflows/deploy-frontend.yml`:**
   ```yaml
   name: Deploy Frontend

   on:
     push:
       branches: [main, develop_WS_DWS_ver1]
       paths:
         - 'frontend/**'

   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - uses: actions/setup-node@v3
           with:
             node-version: 18

         - name: Install and Build
           run: |
             cd frontend
             npm install
             npm run build

         - uses: FirebaseExtended/action-hosting-deploy@v0
           with:
             repoToken: '${{ secrets.GITHUB_TOKEN }}'
             firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
             channelId: live
             projectId: optichain-production-xxxx
   ```

---

## 15. Next Steps

✅ Frontend đã deploy thành công!

**Tiếp theo:**

1. **Update Mobile App Config:**
   ```dart
   // mobile/lib/utils/config.dart
   static const String apiUrl = 'https://optichain-backend-abc123-uc.a.run.app/api/v1';
   ```

2. **Deploy Mobile App:** Follow [Codemagic Guide](DEPLOY-MOBILE-CODEMAGIC.md)

3. **Setup Domain:** (Optional) Add custom domain

4. **Test End-to-End:**
   - Frontend → Backend → Database
   - Login flow
   - CRUD operations

5. **Monitor:**
   - Firebase Console → Hosting
   - Cloud Run Console → Backend
   - Setup alerts

---

## 📞 Support

Nếu gặp vấn đề:

1. **Check Firebase Console:**
   - Hosting → Deployment status

2. **Check Logs:**
   ```bash
   firebase hosting:channel:list
   ```

3. **Verify Build:**
   ```bash
   cd frontend
   npm run build
   # Check for errors
   ```

4. **Review Troubleshooting:** [Section 7](#7-troubleshooting)

5. **Contact team lead**

---

**Last updated**: 2025-12-26
**Tested on**: Windows 11, macOS Sonoma, Ubuntu 22.04
