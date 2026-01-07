# Environment Variables Guide

Hướng dẫn setup environment variables cho từng deployment option.

## 📋 Tổng quan

OptiChain sử dụng environment variables để config:
- Database connection
- API URLs
- Security settings
- CORS policies

## 🗂️ Files đã tạo sẵn

### Backend Environment Files:

```
backend/
├── .env.example              # Template chung
├── .env.render.example       # Render + Neon
├── .env.railway.example      # Railway + Supabase
└── .env.cloudrun.example     # Cloud Run + Cloud SQL
```

### Frontend Environment Files:

```
frontend/
├── .env.local.example           # Template chung
├── .env.local.render.example    # Netlify + Render
├── .env.local.railway.example   # Vercel + Railway
└── .env.local.cloudrun.example  # Firebase + Cloud Run
```

### Mobile Config File:

```
mobile/lib/utils/
└── config.dart.example       # All deployment options
```

---

## 🚀 Setup cho Option 1: Railway + Vercel + Supabase

### Backend (Railway):

1. **Copy template:**
   ```bash
   cp backend/.env.railway.example backend/.env
   ```

2. **Edit `.env`:**
   ```bash
   notepad backend/.env
   # Hoặc
   nano backend/.env
   ```

3. **Update values:**
   ```env
   DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.xxx.supabase.co:5432/postgres
   SECRET_KEY=YOUR_GENERATED_SECRET_KEY
   ALLOWED_ORIGINS=https://aura-xxx.vercel.app
   ```

4. **Generate SECRET_KEY:**
   ```bash
   python -c "import secrets; print(secrets.token_urlsafe(32))"
   ```

5. **Add to Railway:**
   - Railway Dashboard → Your Service
   - Tab "Variables"
   - Add each variable từ `.env` file
   - Click "Add" → Deploy lại

### Frontend (Vercel):

1. **Copy template:**
   ```bash
   cp frontend/.env.local.railway.example frontend/.env.local
   ```

2. **Update Railway URL:**
   ```env
   NEXT_PUBLIC_API_URL=https://optichain-backend-production.up.railway.app/api/v1
   ```

3. **Add to Vercel:**
   - Vercel Dashboard → Your Project
   - Settings → Environment Variables
   - Add: `NEXT_PUBLIC_API_URL`
   - Redeploy

### Mobile (Codemagic):

1. **Copy template:**
   ```bash
   cp mobile/lib/utils/config.dart.example mobile/lib/utils/config.dart
   ```

2. **Edit config.dart:**
   ```dart
   static const String apiUrl = railwayApiUrl; // <-- Set this
   ```

3. **Commit và push:**
   ```bash
   git add mobile/lib/utils/config.dart
   git commit -m "Configure mobile for Railway"
   git push
   ```

---

## 🆓 Setup cho Option 2: Render + Netlify + Neon

### Backend (Render):

1. **Copy template:**
   ```bash
   cp backend/.env.render.example backend/.env
   ```

2. **Update values:**
   ```env
   DATABASE_URL=postgresql://optichain_owner:YOUR_PASSWORD@ep-xxx.region.aws.neon.tech/optichain?sslmode=require
   SECRET_KEY=YOUR_GENERATED_SECRET_KEY
   ALLOWED_ORIGINS=https://optichain-xxx.netlify.app
   PORT=8080
   ```

3. **Add to Render:**
   - Render Dashboard → Your Service
   - Tab "Environment"
   - Add each variable
   - Service auto-redeploys

### Frontend (Netlify):

1. **Copy template:**
   ```bash
   cp frontend/.env.local.render.example frontend/.env.local
   ```

2. **Update Render URL:**
   ```env
   NEXT_PUBLIC_API_URL=https://optichain-backend.onrender.com/api/v1
   ```

3. **Add to Netlify:**
   - Netlify Dashboard → Site settings
   - Build & deploy → Environment
   - Add: `NEXT_PUBLIC_API_URL`
   - Trigger deploy

### Mobile (Codemagic):

1. **Copy and edit:**
   ```bash
   cp mobile/lib/utils/config.dart.example mobile/lib/utils/config.dart
   ```

2. **Set to Render:**
   ```dart
   static const String apiUrl = renderApiUrl; // <-- Set this
   ```

3. **Push:**
   ```bash
   git add mobile/lib/utils/config.dart
   git commit -m "Configure mobile for Render"
   git push
   ```

---

## 💰 Setup cho Production: Cloud Run + Firebase

### Backend (Cloud Run):

1. **Copy template:**
   ```bash
   cp backend/.env.cloudrun.example backend/.env
   ```

2. **Update Cloud SQL:**
   ```env
   DATABASE_URL=postgresql://optichain_user:PASSWORD@/optichain?host=/cloudsql/PROJECT_ID:REGION:INSTANCE
   SECRET_KEY=YOUR_GENERATED_SECRET_KEY
   ALLOWED_ORIGINS=https://your-app.web.app
   ```

3. **Deploy với gcloud:**
   ```bash
   gcloud run deploy optichain-backend \
     --set-env-vars "DATABASE_URL=$DATABASE_URL,SECRET_KEY=$SECRET_KEY,..."
   ```

### Frontend (Firebase):

1. **Update next.config.js trực tiếp:**
   ```javascript
   env: {
     API_URL: 'https://optichain-backend-abc.a.run.app/api/v1',
   }
   ```

2. **Deploy:**
   ```bash
   firebase deploy --only hosting
   ```

### Mobile:

1. **Set Cloud Run URL:**
   ```dart
   static const String apiUrl = cloudRunApiUrl;
   ```

---

## 🔐 Security Best Practices

### SECRET_KEY:

**❌ KHÔNG BAO GIỜ:**
- Commit `.env` vào Git
- Share SECRET_KEY publicly
- Dùng default values

**✅ NÊN:**
- Generate random key mỗi environment
- Store trong environment variables
- Rotate key định kỳ

### DATABASE_URL:

**❌ KHÔNG:**
- Hardcode trong code
- Commit vào Git

**✅ NÊN:**
- Dùng environment variables
- Different URLs cho dev/prod

---

## 📝 Variable Reference

### Backend Variables:

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `APP_NAME` | No | OptiChain API | App name |
| `DEBUG` | No | False | Debug mode |
| `DATABASE_URL` | **Yes** | - | PostgreSQL connection |
| `SECRET_KEY` | **Yes** | - | JWT secret key |
| `ALGORITHM` | No | HS256 | JWT algorithm |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | No | 30 | Token lifetime |
| `ALLOWED_ORIGINS` | **Yes** | * | CORS origins |
| `PORT` | No | 8080 | Server port |

### Frontend Variables:

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_API_URL` | **Yes** | Backend API endpoint |

### Mobile Config:

| Constant | Description |
|----------|-------------|
| `apiUrl` | Backend API endpoint |
| `apiTimeout` | Request timeout (60s for Render) |

---

## 🔄 Switching Environments

### Local Development:

```bash
# Backend
cp backend/.env.example backend/.env
# Edit DATABASE_URL to localhost

# Frontend
cp frontend/.env.local.example frontend/.env.local
# Set API_URL to http://localhost:8000/api/v1

# Mobile
# Edit config.dart
static const String apiUrl = localApiUrl;
```

### Staging → Production:

```bash
# Just update environment variables
# No code changes needed
```

---

## 🆘 Troubleshooting

### Backend não thấy env vars:

```bash
# Check if .env exists
ls -la backend/.env

# Verify variables loaded
# In Python:
from dotenv import load_dotenv
load_dotenv()
import os
print(os.getenv('DATABASE_URL'))
```

### Frontend không connect backend:

```bash
# Check env var
echo $NEXT_PUBLIC_API_URL

# Rebuild
npm run build
```

### CORS errors:

```bash
# Update backend ALLOWED_ORIGINS
# Include full frontend URL
ALLOWED_ORIGINS=https://your-exact-frontend-url.com
```

---

## 🔌 Laravel Backend với Reverb WebSocket

> **Note**: Project hiện tại sử dụng Laravel + PHP thay vì FastAPI + Python

### Backend Variables (Laravel):

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `APP_NAME` | No | Laravel | Application name |
| `APP_ENV` | Yes | local | Environment (local/production) |
| `APP_KEY` | **Yes** | - | Laravel encryption key |
| `APP_DEBUG` | No | true | Debug mode |
| `APP_URL` | **Yes** | - | Backend URL |
| `DB_CONNECTION` | No | pgsql | Database driver |
| `DB_HOST` | **Yes** | - | Database host |
| `DB_PORT` | No | 5432 | Database port |
| `DB_DATABASE` | **Yes** | - | Database name |
| `DB_USERNAME` | **Yes** | - | Database user |
| `DB_PASSWORD` | **Yes** | - | Database password |
| `BROADCAST_DRIVER` | No | reverb | Broadcasting driver |

### Reverb WebSocket Variables:

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `REVERB_APP_ID` | **Yes** | - | Reverb application ID |
| `REVERB_APP_KEY` | **Yes** | - | Reverb public key (shared with frontend) |
| `REVERB_APP_SECRET` | **Yes** | - | Reverb secret key |
| `REVERB_HOST` | **Yes** | localhost | WebSocket host |
| `REVERB_PORT` | No | 8080 | WebSocket port |
| `REVERB_SCHEME` | No | http | ws/wss scheme |
| `REVERB_SERVER_HOST` | No | 0.0.0.0 | Internal server host |
| `REVERB_SERVER_PORT` | No | 8080 | Internal server port |

### Frontend Variables (Next.js + Reverb):

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_API_URL` | **Yes** | Backend API endpoint |
| `NEXT_PUBLIC_REVERB_APP_KEY` | **Yes** | Reverb public key |
| `NEXT_PUBLIC_REVERB_HOST` | **Yes** | WebSocket host |
| `NEXT_PUBLIC_REVERB_PORT` | No | WebSocket port |
| `NEXT_PUBLIC_REVERB_SCHEME` | No | http or https |

### Example Backend .env (Production):

```env
APP_NAME=Aoisora
APP_ENV=production
APP_KEY=base64:your_generated_key
APP_DEBUG=false
APP_URL=https://api.yourdomain.com

DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=aoisora
DB_USERNAME=aoisora_user
DB_PASSWORD=your_secure_password

BROADCAST_DRIVER=reverb
CACHE_DRIVER=file
QUEUE_CONNECTION=database
SESSION_DRIVER=file

REVERB_APP_ID=your_app_id
REVERB_APP_KEY=your_app_key
REVERB_APP_SECRET=your_app_secret
REVERB_HOST=api.yourdomain.com
REVERB_PORT=443
REVERB_SCHEME=https
```

### Example Frontend .env.local (Production):

```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api/v1
NEXT_PUBLIC_REVERB_APP_KEY=your_app_key
NEXT_PUBLIC_REVERB_HOST=api.yourdomain.com
NEXT_PUBLIC_REVERB_PORT=443
NEXT_PUBLIC_REVERB_SCHEME=https
```

### Generate Keys:

```bash
# Generate Laravel APP_KEY
php artisan key:generate --show

# Generate Reverb keys (random strings)
# These are already in .env after running reverb:install
# Or generate manually:
php -r "echo bin2hex(random_bytes(16));"
```

---

## 📚 Related Docs

- [Deploy Option 1: Railway](DEPLOY-FREE-ALTERNATIVES.md)
- [Deploy Option 2: Render](DEPLOY-RENDER-NETLIFY-NEON.md)
- [Deploy Production: Cloud Run](DEPLOY-BACKEND-CLOUDRUN.md)
- [Deploy Laravel + Reverb](DEPLOY-LARAVEL-REVERB.md) **(NEW)**

---

**Last updated**: 2026-01-07
