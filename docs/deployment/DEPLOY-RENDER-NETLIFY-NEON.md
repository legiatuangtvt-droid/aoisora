# Deploy OptiChain với Render + Netlify + Neon - 100% FREE VĨNH VIỄN

Hướng dẫn chi tiết deploy OptiChain WS & DWS hoàn toàn miễn phí với Render, Netlify và Neon.

## 📋 Tổng quan

```
┌─────────────────────────────────────┐
│  📱 Mobile: Codemagic FREE          │
│  500 phút build/tháng               │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  🌐 Frontend: Netlify FREE          │
│  100GB bandwidth, unlimited builds  │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  🎨 Backend: Render.com FREE        │
│  Unlimited, sleep sau 15 phút       │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  🗄️  Database: Neon FREE            │
│  0.5GB PostgreSQL serverless        │
└─────────────────────────────────────┘
```

## 💰 Chi phí: $0/tháng VĨNH VIỄN

### Free Tier Details:

| Service | Giới hạn | Trade-off |
|---------|----------|-----------|
| **Neon** | 0.5GB storage, 1 project | Đủ cho demo |
| **Render** | Unlimited uptime | Sleep sau 15 phút không dùng |
| **Netlify** | 100GB bandwidth/tháng | Đủ cho ~10K users |
| **Codemagic** | 500 phút build/tháng | ~10-15 builds |

### ⚠️ Trade-offs quan trọng:

**Backend Sleep:**
- Sau **15 phút** không có request → Backend ngủ
- Request đầu tiên sau khi ngủ → Đợi **20-40 giây** để wake up
- Requests tiếp theo → Nhanh bình thường

**Giải pháp:**
- Dùng UptimeRobot ping mỗi 14 phút (keep-alive)
- Hoặc chấp nhận delay lần đầu

---

## 📖 BƯỚC 1: Deploy Database (Neon) - 5 phút

### 1.1. Tạo Neon Account

1. **Truy cập:** https://neon.tech
2. **Click "Sign up"**
3. **Chọn "Continue with GitHub"** (recommended)
4. **Authorize Neon**

### 1.2. Tạo Project

1. **Dashboard → Click "New Project"**

2. **Điền thông tin:**
   ```
   Project name: optichain-production
   PostgreSQL version: 16 (latest)
   Region: Asia Pacific (Singapore) hoặc US East (Ohio)
   ```

3. **Click "Create Project"**

4. **Chờ 5-10 giây** để project được tạo

### 1.3. Lấy Connection String

Sau khi project được tạo, bạn sẽ thấy màn hình **"Connection Details"**:

1. **Copy connection string:**
   ```
   postgresql://optichain_owner:xxxxx@ep-xxx.region.aws.neon.tech/optichain?sslmode=require
   ```

2. **Lưu vào notepad** - cần dùng sau!

### 1.4. Import Database Schema

**Option A: Qua Neon SQL Editor (Web)**

1. **Sidebar → "SQL Editor"**

2. **Click "New Query"**

3. **Mở file local:**
   ```bash
   # Windows
   notepad c:\Users\PC\Documents\aura\database\schema.sql

   # Copy toàn bộ nội dung
   ```

4. **Paste vào Neon SQL Editor**

5. **Click "Run" (hoặc Ctrl+Enter)**

6. **Đợi ~5-10 giây**, check output:
   ```
   ✅ Tables created successfully
   ```

**Option B: Qua psql (Command line)**

```bash
# Install psql nếu chưa có
# Windows: choco install postgresql
# Mac: brew install postgresql
# Linux: sudo apt install postgresql-client

# Connect và import
psql "postgresql://optichain_owner:xxxxx@ep-xxx.region.aws.neon.tech/optichain?sslmode=require" \
  -f database/schema.sql
```

### 1.5. Verify Database

1. **SQL Editor → New Query**

2. **Run:**
   ```sql
   -- Check tables
   SELECT table_name
   FROM information_schema.tables
   WHERE table_schema = 'public';

   -- Should see: regions, stores, staff, tasks, etc.

   -- Check sample data
   SELECT * FROM code_master;
   ```

3. **Expected:** Thấy danh sách tables và sample data

**✅ Database Setup Complete!**

---

## 📖 BƯỚC 2: Deploy Backend (Render) - 15 phút

### 2.1. Tạo Render Account

1. **Truy cập:** https://render.com
2. **Click "Get Started"**
3. **Chọn "GitHub"** (recommended)
4. **Authorize Render**

### 2.2. Create Web Service

1. **Dashboard → Click "New +"**

2. **Chọn "Web Service"**

3. **Connect GitHub:**
   - Nếu chưa connect: Click "Connect GitHub"
   - Authorize Render
   - Chọn repository: **CodegymTuLG/aura**

4. **Configure Service:**

   **Basic Settings:**
   ```
   Name: optichain-backend
   Region: Singapore (hoặc gần nhất)
   Branch: develop_WS_DWS_ver1
   Root Directory: backend
   Runtime: Docker
   ```

   **Build & Deploy:**
   ```
   Build Command: (leave empty - sẽ dùng Dockerfile)
   Start Command: (leave empty - Dockerfile có CMD)
   ```

### 2.3. Configure Environment Variables

Scroll xuống **"Environment Variables"**:

1. **Click "Add Environment Variable"**

2. **Thêm các biến sau:**

   **DATABASE_URL:**
   ```
   Key: DATABASE_URL
   Value: postgresql://optichain_owner:xxxxx@ep-xxx.region.aws.neon.tech/optichain?sslmode=require
   ```
   (Paste connection string từ Neon)

   **SECRET_KEY:**
   ```
   Key: SECRET_KEY
   Value: [Generate secret key - xem bên dưới]
   ```

   **ALGORITHM:**
   ```
   Key: ALGORITHM
   Value: HS256
   ```

   **ACCESS_TOKEN_EXPIRE_MINUTES:**
   ```
   Key: ACCESS_TOKEN_EXPIRE_MINUTES
   Value: 30
   ```

   **ALLOWED_ORIGINS:**
   ```
   Key: ALLOWED_ORIGINS
   Value: *
   ```
   (Sẽ update sau khi có frontend URL)

   **PORT:**
   ```
   Key: PORT
   Value: 8080
   ```

### 2.4. Generate SECRET_KEY

**Trong terminal/Git Bash:**
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"

# Output example:
# vZR9X7KpQ_M8NnYyH2JqLw5TFx3Bc4Ga1Sd6Vh0Ui9E

# Copy và paste vào Render environment variable
```

### 2.5. Configure Auto-Deploy

Scroll xuống **"Auto-Deploy"**:
```
☑️ Auto-Deploy: Yes
Branch: develop_WS_DWS_ver1
```

### 2.6. Plan Selection

```
Instance Type: Free
```

### 2.7. Create Web Service

1. **Click "Create Web Service"**

2. **Render sẽ bắt đầu deploy:**
   ```
   ⏳ Building...
   ⏳ Deploying...
   ```

3. **Chờ 5-10 phút** (lần đầu build Dockerfile)

4. **Theo dõi logs:**
   - Tab "Logs" → Xem build progress
   - Check errors nếu có

### 2.8. Deployment Success

Khi thấy:
```
✅ Your service is live 🎉
```

**Lấy Public URL:**
```
URL: https://optichain-backend.onrender.com
```

**Copy và lưu lại URL này!**

### 2.9. Test Backend

```bash
# Test health endpoint
curl https://optichain-backend.onrender.com/health

# Expected:
# {"status":"healthy"}

# Test root
curl https://optichain-backend.onrender.com/

# Expected:
# {
#   "message": "Welcome to OptiChain API",
#   "version": "1.0.0",
#   "status": "running"
# }
```

**Nếu gặp lỗi:**
- Check "Logs" tab trong Render
- Verify environment variables
- Check Dockerfile syntax

**✅ Backend Setup Complete!**

---

## 📖 BƯỚC 3: Deploy Frontend (Netlify) - 10 phút

### 3.1. Tạo Netlify Account

1. **Truy cập:** https://netlify.com
2. **Click "Sign up"**
3. **Chọn "GitHub"**
4. **Authorize Netlify**

### 3.2. Import Project

1. **Dashboard → Click "Add new site"**

2. **Chọn "Import an existing project"**

3. **Click "Deploy with GitHub"**

4. **Authorize Netlify** (nếu chưa)

5. **Chọn repository:** `CodegymTuLG/aura`

### 3.3. Configure Build Settings

**Site settings:**
```
Branch to deploy: develop_WS_DWS_ver1
```

**Build settings:**
```
Base directory: frontend
Build command: npm run build
Publish directory: frontend/out
```

**⚠️ Important:** Netlify có thể tự detect Next.js, nếu auto-fill khác thì sửa lại như trên.

### 3.4. Environment Variables

1. **Click "Show advanced"**

2. **Click "New variable"**

3. **Add:**
   ```
   Key: NEXT_PUBLIC_API_URL
   Value: https://optichain-backend.onrender.com/api/v1
   ```
   (Thay bằng Render URL của bạn)

### 3.5. Deploy Site

1. **Click "Deploy site"**

2. **Netlify sẽ build:**
   ```
   ⏳ Building...
   ⏳ Deploying...
   ```

3. **Chờ 2-3 phút**

4. **Theo dõi logs** nếu muốn

### 3.6. Deployment Success

Khi deploy xong:
```
✅ Site is live
```

**Lấy URL:**
```
URL: https://optichain-xxx.netlify.app
```

**Hoặc custom domain (nếu có):**
```
Site settings → Domain management → Add custom domain
```

### 3.7. Test Frontend

1. **Mở browser:**
   ```
   https://optichain-xxx.netlify.app
   ```

2. **Kiểm tra:**
   - ✅ Trang load được
   - ✅ Hiển thị "OptiChain WS & DWS"
   - ✅ UI render đúng
   - ✅ F12 → Console không có errors

### 3.8. Update Backend CORS

**Quay lại Render:**

1. **Dashboard → optichain-backend**

2. **Tab "Environment"**

3. **Edit ALLOWED_ORIGINS:**
   ```
   Key: ALLOWED_ORIGINS
   Value: https://optichain-xxx.netlify.app
   ```
   (Thay bằng Netlify URL của bạn)

4. **Click "Save Changes"**

5. **Render sẽ tự động redeploy** (~2 phút)

### 3.9. Test API Connection

1. **Mở Netlify URL**

2. **F12 → Network tab**

3. **Nếu frontend có API calls:**
   - Check request đến Render backend
   - Verify response 200 OK
   - Check data trả về

**✅ Frontend Setup Complete!**

---

## 📖 BƯỚC 4: Build Mobile App (Codemagic) - 30 phút

### 4.1. Setup Codemagic Account

1. **Truy cập:** https://codemagic.io
2. **Click "Sign up for free"**
3. **Chọn "GitHub"**
4. **Authorize Codemagic**

### 4.2. Add Application

1. **Dashboard → "Add application"**

2. **Select repository:**
   - Repository: `CodegymTuLG/aura`
   - Click "Next"

3. **Project type:**
   - Select: "Flutter App"
   - Click "Finish"

### 4.3. Configure Workflow

1. **Select workflow file:**
   ```
   ☑️ Use codemagic.yaml from repository
   ```

2. **Branch:**
   ```
   develop_WS_DWS_ver1
   ```

3. **Workflow:**
   ```
   android-workflow (cho Android only - nhanh hơn)
   hoặc
   ios-android-workflow (build cả iOS và Android)
   ```

### 4.4. Update Mobile API URL

**Trước khi build, cần update API URL:**

1. **Create file:** `mobile/lib/utils/config.dart`

   ```dart
   class Config {
     static const String apiUrl = 'https://optichain-backend.onrender.com/api/v1';

     // For development
     static const String devApiUrl = 'http://localhost:8000/api/v1';

     // Environment-based
     static String get currentApiUrl {
       // You can add logic here for different environments
       return apiUrl;
     }
   }
   ```

2. **Commit và push:**
   ```bash
   git add mobile/lib/utils/config.dart
   git commit -m "Add mobile API config for Render backend"
   git push origin develop_WS_DWS_ver1
   ```

### 4.5. Start Build

1. **Codemagic sẽ tự động detect push**

2. **Hoặc manual trigger:**
   - Click "Start new build"
   - Select branch: `develop_WS_DWS_ver1`
   - Select workflow: `android-workflow`
   - Click "Start build"

3. **Build time:** 10-15 phút

4. **Theo dõi logs** trong build screen

### 4.6. Download APK

Sau khi build complete:

1. **Tab "Artifacts"**

2. **Download:**
   - `app-release.apk` - APK file
   - `app-release.aab` - App Bundle (cho Google Play)

3. **Install trên Android:**
   ```
   - Copy APK vào phone
   - Enable "Install from unknown sources"
   - Install APK
   - Open app
   ```

### 4.7. Test Mobile App

1. **Mở app**
2. **Check:**
   - ✅ App launch OK
   - ✅ UI hiển thị
   - ✅ API calls work
   - ⚠️ Lần đầu có thể chậm 30s (backend wake up)

**✅ Mobile Setup Complete!**

---

## 📊 Tổng kết URLs

Sau khi deploy xong:

```
Database:  Neon (Internal only)
           postgresql://...neon.tech/optichain

Backend:   https://optichain-backend.onrender.com
           Swagger: https://optichain-backend.onrender.com/docs

Frontend:  https://optichain-xxx.netlify.app

Mobile:    Download APK từ Codemagic Artifacts
```

---

## 🔄 Auto Redeploy

### Backend (Render):
- ✅ Auto-deploy khi push code
- ✅ Branch: `develop_WS_DWS_ver1`
- Settings → "Auto-Deploy" enabled

### Frontend (Netlify):
- ✅ Auto-deploy khi push code
- ✅ Build hooks configured
- Site settings → Build & deploy

### Mobile (Codemagic):
- ✅ Auto-build khi push code
- ✅ Workflow trigger configured
- Check `codemagic.yaml`

---

## ⚠️ Xử lý Backend Sleep

### Vấn đề:
```
Backend sleep sau 15 phút → Request đầu tiên chậm 20-40s
```

### Giải pháp 1: UptimeRobot (Keep-alive)

1. **Truy cập:** https://uptimerobot.com

2. **Sign up free** (50 monitors)

3. **Add New Monitor:**
   ```
   Monitor Type: HTTP(s)
   Friendly Name: OptiChain Backend
   URL: https://optichain-backend.onrender.com/health
   Monitoring Interval: 5 minutes
   ```

4. **Save**

**Result:** Backend sẽ được ping mỗi 5 phút → Không bao giờ sleep

### Giải pháp 2: Cron-job.org

1. **Truy cập:** https://cron-job.org

2. **Create account free**

3. **Create cronjob:**
   ```
   Title: Keep OptiChain Alive
   URL: https://optichain-backend.onrender.com/health
   Schedule: */14 * * * * (Every 14 minutes)
   ```

**Result:** Backend được ping mỗi 14 phút

### Giải pháp 3: Thông báo User

**Frontend: Show message khi wake up**

Edit `frontend/src/app/layout.tsx`:

```typescript
import { useEffect, useState } from 'react';

export default function RootLayout({ children }) {
  const [isWakingUp, setIsWakingUp] = useState(false);

  useEffect(() => {
    // Detect slow API response (backend waking up)
    const checkBackend = async () => {
      const start = Date.now();
      try {
        await fetch(process.env.NEXT_PUBLIC_API_URL + '/health');
        const duration = Date.now() - start;

        if (duration > 5000) {
          setIsWakingUp(true);
          setTimeout(() => setIsWakingUp(false), 5000);
        }
      } catch (e) {
        console.error('Backend check failed', e);
      }
    };

    checkBackend();
  }, []);

  return (
    <html lang="en">
      <body>
        {isWakingUp && (
          <div className="fixed top-0 left-0 right-0 bg-yellow-100 p-4 text-center">
            ⏳ Backend đang khởi động, vui lòng đợi...
          </div>
        )}
        {children}
      </body>
    </html>
  );
}
```

---

## 🔍 Monitoring & Logs

### Neon (Database):

1. **Dashboard → Project**
2. **Tab "Monitoring":**
   - Storage usage
   - Query performance
   - Connection count

3. **Alerts:**
   - Email khi storage > 400MB (80% of 500MB)

### Render (Backend):

1. **Dashboard → Service**
2. **Tab "Logs":**
   - Real-time logs
   - Filter by error/warning
   - Download logs

3. **Tab "Metrics":**
   - CPU usage
   - Memory usage
   - Response time

4. **Alerts:**
   - Email khi deployment fails
   - Slack integration (optional)

### Netlify (Frontend):

1. **Site dashboard**
2. **Analytics:**
   - Page views
   - Bandwidth usage
   - Build minutes

3. **Deploy logs:**
   - Build output
   - Deploy status
   - Error messages

### Codemagic (Mobile):

1. **Build history**
2. **Build logs:**
   - Compilation output
   - Test results
   - Artifact generation

---

## 🐛 Troubleshooting

### Issue 1: Backend build failed

**Error:** "Error building Docker image"

**Solution:**
```bash
# Check Dockerfile locally
cd backend
docker build -t test-backend .

# If error, fix Dockerfile
# Then push changes
git add backend/Dockerfile
git commit -m "Fix Dockerfile"
git push origin develop_WS_DWS_ver1
```

### Issue 2: Frontend build failed

**Error:** "Build command failed"

**Solution:**
```bash
# Test build locally
cd frontend
npm install
npm run build

# Check errors
# Fix issues
# Push changes
```

### Issue 3: Database connection failed

**Error:** "could not connect to server"

**Solution:**

1. **Check Neon status:**
   - Neon dashboard → Project
   - Verify status = "Active"

2. **Verify connection string:**
   - Render → Environment → DATABASE_URL
   - Check SSL mode: `?sslmode=require`

3. **Test connection:**
   ```bash
   psql "postgresql://..." -c "SELECT 1"
   ```

### Issue 4: Backend wake up timeout

**Error:** "Request timeout after 30s"

**Solution:**

1. **Increase timeout:**
   - Frontend fetch timeout: 60s
   - Show loading indicator

2. **Use UptimeRobot** (see above)

3. **Warm up endpoint:**
   ```javascript
   // Call /health on page load
   fetch('/health').catch(() => {});
   ```

### Issue 5: CORS error

**Error:** "Access blocked by CORS policy"

**Solution:**

1. **Check ALLOWED_ORIGINS:**
   ```
   Render → Environment → ALLOWED_ORIGINS
   Value: https://optichain-xxx.netlify.app
   ```

2. **Redeploy backend** (auto after env change)

---

## 💡 Optimization Tips

### Database (Neon):

**Free tier: 0.5GB**

1. **Monitor storage:**
   ```sql
   SELECT pg_size_pretty(pg_database_size('optichain'));
   ```

2. **Clean old data:**
   ```sql
   -- Delete old notifications
   DELETE FROM notifications WHERE created_at < NOW() - INTERVAL '30 days';

   -- Vacuum
   VACUUM ANALYZE;
   ```

3. **Use indexes:**
   - Already in `database/schema.sql`

### Backend (Render):

1. **Optimize Docker image:**
   ```dockerfile
   # Use slim image
   FROM python:3.11-slim

   # Multi-stage build (optional)
   # Cache pip dependencies
   ```

2. **Reduce memory usage:**
   - Limit workers: `--workers 1`
   - Use gunicorn instead of uvicorn (optional)

3. **Enable caching:**
   ```python
   # Add response caching
   from fastapi_cache import FastAPICache
   ```

### Frontend (Netlify):

1. **Optimize bundle:**
   ```bash
   # Analyze bundle size
   npm run build

   # Check output
   # Optimize large dependencies
   ```

2. **Enable caching:**
   - Already configured in Next.js

3. **Compress images:**
   - Use WebP format
   - Optimize in build

---

## 📈 Usage Monitoring

### Track Free Tier Limits:

**Neon:**
```
Storage: 500MB
Check: Dashboard → Project → Storage
Alert: Set email alert at 400MB
```

**Render:**
```
Build time: Unlimited
Bandwidth: 100GB/month
Check: Dashboard → Metrics
```

**Netlify:**
```
Bandwidth: 100GB/month
Build minutes: 300 minutes/month
Check: Site settings → Usage
```

**Codemagic:**
```
Build minutes: 500 minutes/month
Check: Account → Usage
Alert: Email at 400 minutes
```

---

## 🔄 Upgrade Path

### Khi cần upgrade:

**From Render → Railway:**
- Export env vars
- Same Dockerfile
- Deploy time: ~10 phút

**From Neon → Supabase:**
```bash
# Export database
pg_dump "postgresql://...neon.tech/..." > dump.sql

# Import to Supabase
psql "postgresql://...supabase.co/..." < dump.sql
```

**From Netlify → Vercel:**
- Same Next.js config
- Import from GitHub
- Deploy time: ~5 phút

---

## ✅ Final Checklist

- [ ] Neon database created
- [ ] Schema imported successfully
- [ ] Render backend deployed
- [ ] Backend health check OK
- [ ] Netlify frontend deployed
- [ ] Frontend loads correctly
- [ ] CORS configured
- [ ] Mobile API config updated
- [ ] Codemagic build successful
- [ ] APK downloaded and tested
- [ ] UptimeRobot configured (optional)
- [ ] Auto-deploy enabled
- [ ] Monitoring setup

---

## 🎉 Hoàn thành!

**Bạn đã deploy thành công OptiChain với:**
- ✅ $0 chi phí vĩnh viễn
- ✅ Auto-deploy từ GitHub
- ✅ Full stack: Database + Backend + Frontend + Mobile
- ✅ Production-ready URLs

**URLs của bạn:**
```
Backend:  https://optichain-backend.onrender.com
Frontend: https://optichain-xxx.netlify.app
Mobile:   APK downloaded
```

**Next steps:**
- Test tất cả features
- Add custom domain (optional)
- Setup monitoring alerts
- Share với team/client

---

## 📞 Support

**Nếu gặp vấn đề:**
1. Check logs trong từng service
2. Review troubleshooting section
3. Test locally trước
4. Contact team lead

**Resources:**
- Neon Docs: https://neon.tech/docs
- Render Docs: https://render.com/docs
- Netlify Docs: https://docs.netlify.com
- Codemagic Docs: https://docs.codemagic.io

---

**Last updated**: 2025-12-26
**Tested on**: Windows 11, macOS Sonoma, Ubuntu 22.04
**Total setup time**: ~60-90 phút (lần đầu)
**Cost**: $0/month FOREVER ✅
