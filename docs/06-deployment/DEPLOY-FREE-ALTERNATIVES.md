# Deploy OptiChain HOÀN TOÀN MIỄN PHÍ

Hướng dẫn deploy OptiChain WS & DWS với **$0 chi phí** sử dụng các dịch vụ free tier.

## 📋 Kiến trúc FREE Deployment

```
┌─────────────────────────────────────┐
│  Mobile Apps (iOS/Android)          │
│  Codemagic Free Tier                │ ← 500 phút build/tháng FREE
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Frontend - Vercel/Netlify          │ ← Hoàn toàn FREE
│  Next.js Static                     │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Backend - Railway/Render           │ ← FREE tier (có giới hạn)
│  FastAPI + Python                   │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Database - Supabase/Neon           │ ← FREE PostgreSQL
└─────────────────────────────────────┘
```

---

## 💰 So sánh các Options MIỄN PHÍ

### Option 1: ⭐ KHUYÊN DÙNG (Dễ nhất)

| Component | Service | Free Tier | Giới hạn |
|-----------|---------|-----------|----------|
| **Backend** | Railway.app | FREE | 500 giờ/tháng, $5 credit |
| **Frontend** | Vercel | FREE | Unlimited, 100GB bandwidth |
| **Database** | Supabase | FREE | 500MB database, 2GB bandwidth |
| **Mobile** | Codemagic | FREE | 500 phút build/tháng |

**Tổng chi phí: $0/tháng** ✅

### Option 2: Hoàn toàn miễn phí vĩnh viễn

| Component | Service | Free Tier | Giới hạn |
|-----------|---------|-----------|----------|
| **Backend** | Render.com | FREE | Sleep sau 15 phút không dùng |
| **Frontend** | Netlify | FREE | 100GB bandwidth |
| **Database** | Neon | FREE | 0.5GB storage |
| **Mobile** | Codemagic | FREE | 500 phút/tháng |

**Tổng chi phí: $0/tháng** ✅ (có trade-offs)

### Option 3: Firebase (All-in-one)

| Component | Service | Free Tier |
|-----------|---------|-----------|
| **Backend** | Firebase Functions | FREE | 2M invocations/tháng |
| **Frontend** | Firebase Hosting | FREE | 10GB storage, 360MB/day |
| **Database** | Firestore | FREE | 1GB storage, 50K reads/day |
| **Mobile** | Codemagic | FREE | 500 phút/tháng |

**Tổng chi phí: $0/tháng** ✅

---

## 🚀 Option 1: Railway + Vercel + Supabase (KHUYÊN DÙNG)

### ✅ Ưu điểm:
- Setup nhanh nhất (< 30 phút)
- Deploy từ GitHub tự động
- Không bị sleep (Railway free tier)
- Database PostgreSQL thật (không phải Firestore)
- URL đẹp, SSL miễn phí

### ⚠️ Giới hạn:
- Railway: 500 giờ runtime/tháng hoặc $5 credit (đủ cho testing)
- Supabase: 500MB database (đủ cho demo/testing)

---

## 📖 Step 1: Deploy Database (Supabase)

### 1.1. Tạo Supabase Project

1. **Truy cập:** https://supabase.com
2. **Sign up** bằng GitHub account
3. **Click "New Project"**
4. **Điền thông tin:**
   ```
   Name: optichain-db
   Database Password: [Tạo password mạnh]
   Region: Southeast Asia (Singapore)
   ```
5. **Click "Create new project"**
6. **Chờ 2-3 phút** để database được setup

### 1.2. Import Schema

1. **Sidebar → SQL Editor**
2. **Click "New query"**
3. **Copy toàn bộ nội dung** từ `database/schema.sql`
4. **Paste vào SQL Editor**
5. **Click "Run" hoặc Ctrl+Enter**
6. **Verify:** Tables đã được tạo

### 1.3. Lấy Connection String

1. **Settings (⚙️) → Database**
2. **Scroll xuống "Connection string"**
3. **Chọn "URI" tab**
4. **Copy connection string:**
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres
   ```
5. **Lưu lại!**

**Xong bước Database!** ✅

---

## 📖 Step 2: Deploy Backend (Railway)

### 2.1. Tạo Railway Account

1. **Truy cập:** https://railway.app
2. **Click "Login with GitHub"**
3. **Authorize Railway**

### 2.2. Deploy từ GitHub

1. **Dashboard → "New Project"**
2. **Click "Deploy from GitHub repo"**
3. **Chọn repository:** `CodegymTuLG/aura`
4. **Click "Deploy Now"**
5. **Railway sẽ tự detect Dockerfile**

**⚠️ Nếu Railway không detect được:**

### 2.3. Config Railway (Manual)

1. **Chọn project vừa tạo**
2. **Click "Settings"**
3. **Root Directory:** `backend`
4. **Custom Start Command:**
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port $PORT
   ```

### 2.4. Thêm Environment Variables

1. **Tab "Variables"**
2. **Add các biến:**
   ```
   DATABASE_URL=postgresql://postgres:[PASSWORD]@db.xxx.supabase.co:5432/postgres
   SECRET_KEY=vZR9X7KpQ_M8NnYyH2JqLw5TFx3Bc4Ga1Sd6Vh0Ui9E
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   ALLOWED_ORIGINS=*
   PORT=8080
   ```

3. **Click "Add"** cho từng biến

### 2.5. Deploy

1. **Tab "Deployments"**
2. **Deployment sẽ tự chạy**
3. **Chờ 5-10 phút**
4. **Check logs** để verify

### 2.6. Lấy Public URL

1. **Tab "Settings"**
2. **Section "Networking"**
3. **Click "Generate Domain"**
4. **Copy URL:** `https://optichain-backend-production.up.railway.app`
5. **Lưu lại!**

### 2.7. Test Backend

```bash
# Test health
curl https://optichain-backend-production.up.railway.app/health

# Expected: {"status":"healthy"}
```

**Xong bước Backend!** ✅

---

## 📖 Step 3: Deploy Frontend (Vercel)

### 3.1. Tạo Vercel Account

1. **Truy cập:** https://vercel.com
2. **Click "Sign Up"**
3. **Login with GitHub**

### 3.2. Import Project

1. **Dashboard → "Add New..." → "Project"**
2. **Click "Import" cho repo `aura`**
3. **Configure Project:**
   ```
   Framework Preset: Next.js
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: out
   ```

### 3.3. Environment Variables

1. **Section "Environment Variables"**
2. **Add:**
   ```
   NEXT_PUBLIC_API_URL=https://optichain-backend-production.up.railway.app/api/v1
   ```

### 3.4. Deploy

1. **Click "Deploy"**
2. **Chờ 2-3 phút**
3. **Vercel sẽ build và deploy tự động**

### 3.5. Lấy URL

1. **Deployment complete**
2. **Copy URL:** `https://aura-xxx.vercel.app`
3. **Lưu lại!**

### 3.6. Update Backend CORS

1. **Quay lại Railway**
2. **Update ALLOWED_ORIGINS:**
   ```
   ALLOWED_ORIGINS=https://aura-xxx.vercel.app
   ```
3. **Redeploy backend**

**Xong bước Frontend!** ✅

---

## 📖 Step 4: Deploy Mobile (Codemagic)

### 4.1. Setup Codemagic

1. **Truy cập:** https://codemagic.io
2. **Sign up with GitHub**
3. **Add repository:** `CodegymTuLG/aura`

### 4.2. Configure Workflow

1. **Select repository**
2. **Workflow:** `android-workflow` (từ `codemagic.yaml`)
3. **Trigger:** On push to `develop_WS_DWS_ver1`

### 4.3. Update Mobile API URL

**Trước khi push, update API URL:**

1. **Create file:** `mobile/lib/utils/config.dart`
   ```dart
   class Config {
     static const String apiUrl = 'https://optichain-backend-production.up.railway.app/api/v1';
   }
   ```

2. **Commit và push:**
   ```bash
   git add mobile/lib/utils/config.dart
   git commit -m "Update mobile API URL"
   git push origin develop_WS_DWS_ver1
   ```

3. **Codemagic sẽ tự động build**

### 4.4. Download APK

1. **Build complete (10-15 phút)**
2. **Download APK** từ Artifacts
3. **Install trên Android phone**

**Xong bước Mobile!** ✅

---

## 🎯 Tóm tắt URLs

Sau khi deploy xong:

```
Database:  Supabase (Internal only)
Backend:   https://optichain-backend-production.up.railway.app
Frontend:  https://aura-xxx.vercel.app
Mobile:    Download APK từ Codemagic
```

---

## 💡 Option 2: Render + Netlify + Neon

### Nếu muốn thử option khác:

**Backend - Render.com:**
- Free tier: Unlimited
- Trade-off: Sleep sau 15 phút không dùng
- Wake up: ~30 giây khi có request đầu tiên

**Frontend - Netlify:**
- Tương tự Vercel
- 100GB bandwidth/tháng

**Database - Neon:**
- PostgreSQL serverless
- Free: 0.5GB storage
- Không bị xóa

### Quick Setup:

1. **Neon DB:**
   - https://neon.tech → Sign up
   - Create project → Copy connection string

2. **Render Backend:**
   - https://render.com → Sign up
   - New → Web Service → Connect repo
   - Root: `backend`
   - Start: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - Add env vars

3. **Netlify Frontend:**
   - https://netlify.com → Sign up
   - Import from Git
   - Build: `cd frontend && npm run build`
   - Publish: `frontend/out`

---

## 💡 Option 3: Firebase Only (Cần refactor Backend)

### Nếu muốn ALL-IN-ONE với Firebase:

**Trade-off:** Phải viết lại Backend thành Firebase Functions

**Pros:**
- Hoàn toàn free
- Auto-scaling
- Integrated với Firebase services

**Cons:**
- Phải refactor Backend từ FastAPI → Cloud Functions
- Firestore thay vì PostgreSQL (khác data model)
- Cold start chậm

**Không recommend cho hiện tại** - Giữ nguyên FastAPI tốt hơn.

---

## 📊 So sánh Chi phí

### Railway + Vercel + Supabase:

| Metric | Free Tier | Vượt thì sao? |
|--------|-----------|---------------|
| Railway uptime | 500 giờ/tháng | Sau đó $5/month |
| Vercel bandwidth | 100GB/tháng | Unlimited miễn phí |
| Supabase storage | 500MB | Upgrade $25/month |

**Dự kiến:** Đủ dùng 1-3 tháng testing/demo

### Render + Netlify + Neon:

| Metric | Free Tier | Trade-off |
|--------|-----------|-----------|
| Render uptime | Unlimited | Sleep 15 phút |
| Netlify bandwidth | 100GB | Đủ dùng |
| Neon storage | 0.5GB | Nhỏ hơn Supabase |

**Dự kiến:** Dùng vĩnh viễn miễn phí (có sleep)

---

## 🔄 Auto-Redeploy

### Railway (từ GitHub):
- Push code → Auto deploy
- Branch: `develop_WS_DWS_ver1`

### Vercel (từ GitHub):
- Push code → Auto deploy
- Preview URLs cho mỗi PR

### Codemagic (từ GitHub):
- Push code → Auto build mobile
- Workflow tự động

---

## 🚨 Giới hạn cần lưu ý

### Railway Free Tier:
- **500 giờ/tháng** = ~20 ngày liên tục
- **Hoặc $5 credit** (hết credit thì service stop)
- **Solution:** Monitor usage, pause khi không dùng

### Supabase Free:
- **500MB database** = Đủ cho ~50K records
- **2GB bandwidth/tháng** = Đủ cho testing
- **Solution:** Clean up data cũ thường xuyên

### Render Free (nếu dùng):
- **Sleep sau 15 phút** không có request
- **Wake up ~30 giây** khi có request mới
- **Solution:** Chấp nhận hoặc dùng Railway

---

## ✅ Checklist Deploy FREE

- [ ] Tạo Supabase account & database
- [ ] Import schema vào Supabase
- [ ] Lấy Supabase connection string
- [ ] Tạo Railway account
- [ ] Deploy backend lên Railway
- [ ] Add environment variables
- [ ] Generate Railway public URL
- [ ] Test backend API
- [ ] Tạo Vercel account
- [ ] Deploy frontend lên Vercel
- [ ] Add API URL vào Vercel env
- [ ] Update CORS trong Railway
- [ ] Test frontend kết nối backend
- [ ] Setup Codemagic
- [ ] Update mobile API URL
- [ ] Push code để trigger Codemagic
- [ ] Download và test APK

---

## 📞 Support & Monitoring

### Monitor Railway Usage:
1. Railway Dashboard → Usage
2. Check "Hours used" và "Credit remaining"
3. Alert khi gần hết

### Monitor Supabase:
1. Supabase Dashboard → Database
2. Check storage usage
3. Alert khi > 400MB

### Logs:
```bash
# Railway logs
# → Railway Dashboard → Deployments → View logs

# Vercel logs
# → Vercel Dashboard → Deployments → Function logs
```

---

## 🎓 Script Deploy cho FREE Option

Tạo script mới cho Railway deployment:

```bash
# scripts/deploy-backend-railway.sh

#!/bin/bash
echo "🚀 Deploying to Railway..."

# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link project
railway link

# Deploy
railway up

echo "✅ Backend deployed to Railway!"
```

---

## 🔄 Upgrade Path (Khi có kinh phí)

**Từ FREE → Paid:**

1. **Railway → Cloud Run**
   - Export DATABASE_URL từ Railway
   - Follow `DEPLOY-BACKEND-CLOUDRUN.md`

2. **Supabase → Cloud SQL**
   - Export database: `pg_dump`
   - Import vào Cloud SQL

3. **Vercel → Firebase Hosting**
   - Cùng stack, chỉ đổi hosting

**Migration time:** ~1-2 giờ

---

## 📝 Next Steps

**Bắt đầu deploy FREE ngay:**

1. **Start với Database:** [Section Step 1](#-step-1-deploy-database-supabase)
2. **Deploy Backend:** [Section Step 2](#-step-2-deploy-backend-railway)
3. **Deploy Frontend:** [Section Step 3](#-step-3-deploy-frontend-vercel)
4. **Build Mobile:** [Section Step 4](#-step-4-deploy-mobile-codemagic)

**Estimated time:** 1-2 giờ (lần đầu)

---

**Last updated**: 2025-12-26
**Recommended for**: Testing, Demo, MVP
**Cost**: $0/month ✅
