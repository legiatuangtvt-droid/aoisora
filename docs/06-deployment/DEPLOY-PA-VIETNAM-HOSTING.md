# Deploy to PA Vietnam Shared Hosting

Hướng dẫn deploy Aoisora lên PA Vietnam Shared Hosting (DirectAdmin).

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Production Environment                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────────────┐     ┌──────────────────────────┐   │
│  │  Frontend (Vercel)  │     │ Backend (PA Vietnam)     │   │
│  │                     │     │                          │   │
│  │  Next.js App        │────▶│ Laravel API              │   │
│  │  Auto-deploy on     │     │ public_html/api/         │   │
│  │  git push           │     │ public_html/laravel/     │   │
│  │                     │     │                          │   │
│  │  Domain:            │     │ Domain:                  │   │
│  │  aoisora.           │     │ auraorientalis.vn/api/   │   │
│  │  auraorientalis.vn  │     │ api/v1                   │   │
│  └─────────────────────┘     └──────────────────────────┘   │
│                                       │                      │
│                                       ▼                      │
│                              ┌──────────────────────────┐   │
│                              │  Database (MySQL)        │   │
│                              │  auraorie68aa_aoisora    │   │
│                              └──────────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## URLs

| Component | URL |
|-----------|-----|
| Frontend | `https://aoisora.auraorientalis.vn` |
| Backend API | `https://auraorientalis.vn/api/api/v1` |
| phpMyAdmin | DirectAdmin → MySQL → phpMyAdmin |

## Credentials

### Database
- **Host**: `127.0.0.1`
- **Port**: `3306`
- **Database**: `auraorie68aa_aoisora`
- **Username**: `auraorie68aa_aoisora`
- **Password**: *(stored in `.env` file)*

### Test Account
- **Username**: `admin`
- **Password**: `password`
- **Role**: ADMIN

---

## Backend Deployment (PA Vietnam)

### Directory Structure on Hosting

```
public_html/
├── api/                    ← Laravel public folder content
│   ├── index.php          ← Modified to point to ../laravel
│   ├── .htaccess
│   └── ...
│
└── laravel/               ← Laravel app (excluding public/)
    ├── app/
    ├── bootstrap/
    ├── config/
    ├── database/
    ├── resources/
    ├── routes/
    ├── storage/
    ├── vendor/
    ├── .env               ← Production config
    └── ...
```

### First Time Deployment

1. **Create directories on hosting**:
   ```
   public_html/api/
   public_html/laravel/
   ```

2. **Upload files via FileZilla**:
   - Upload `backend/` content (except `public/`) → `public_html/laravel/`
   - Upload `deploy/api/index.php` → `public_html/api/index.php`
   - Upload `deploy/api/.htaccess` → `public_html/api/.htaccess`
   - Upload `deploy/laravel/.env` → `public_html/laravel/.env`

3. **Import database**:
   - Open phpMyAdmin in DirectAdmin
   - Select database `auraorie68aa_aoisora`
   - Import `deploy/schema_mysql.sql`
   - Import `deploy/seed_data_mysql.sql`

4. **Set permissions** (via File Manager):
   - `laravel/storage/` → `755` (recursive)
   - `laravel/bootstrap/cache/` → `755`

### Update Deployment (Code Changes Only)

Upload only changed files via FileZilla:

| Local Path | Remote Path |
|------------|-------------|
| `backend/app/` | `public_html/laravel/app/` |
| `backend/routes/` | `public_html/laravel/routes/` |
| `backend/config/` | `public_html/laravel/config/` |
| `backend/resources/` | `public_html/laravel/resources/` |

**DO NOT upload again**:
- `vendor/` - Only when packages change
- `.env` - Only when config changes
- `storage/` - Contains runtime data

### Database Schema Updates

1. Create migration SQL file
2. Import via phpMyAdmin

---

## Frontend Deployment (Vercel)

### Auto-Deploy

Frontend auto-deploys when pushing to `main` branch:

```bash
git add .
git commit -m "feat(frontend): description"
git push origin main
```

### Environment Variables (Vercel Dashboard)

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_API_URL` | `https://auraorientalis.vn/api/api/v1` |
| `NEXT_PUBLIC_WEBSOCKET_ENABLED` | `false` |

### Manual Redeploy

1. Go to Vercel Dashboard → Deployments
2. Click latest deployment → `...` → Redeploy

Or push empty commit:
```bash
git commit --allow-empty -m "chore: trigger redeploy"
git push origin main
```

---

## Configuration Files

### Backend `.env` (deploy/laravel/.env)

```env
APP_NAME=Aoisora
APP_ENV=production
APP_KEY=base64:BuFEDRUHaCmP5M8IFmdcjhIaDPsDNlZflDpjOsFrbRs=
APP_DEBUG=false
APP_URL=https://auraorientalis.vn/api

LOG_CHANNEL=stack

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=auraorie68aa_aoisora
DB_USERNAME=auraorie68aa_aoisora
DB_PASSWORD=<password>

BROADCAST_DRIVER=log
CACHE_DRIVER=file
QUEUE_CONNECTION=sync
SESSION_DRIVER=file
SESSION_LIFETIME=120

CORS_ALLOWED_ORIGINS=https://aoisora.auraorientalis.vn,https://auraorientalis.vn
```

### Backend CORS (backend/config/cors.php)

```php
'allowed_origins' => explode(',', env('CORS_ALLOWED_ORIGINS', 'http://localhost:3000')),

'allowed_origins_patterns' => [
    '/^http:\/\/localhost:300[0-9]$/',
    '/^http:\/\/127\.0\.0\.1:300[0-9]$/',
    '/^https:\/\/.*\.vercel\.app$/',
    '/^https:\/\/.*\.auraorientalis\.vn$/',
],
```

### Frontend `.env.production`

```env
NEXT_PUBLIC_API_URL=https://auraorientalis.vn/api/api/v1
NEXT_PUBLIC_WEBSOCKET_ENABLED=false
```

---

## Testing

### Test API Endpoints

```bash
# Health check
curl https://auraorientalis.vn/api/api/v1/departments

# Login
curl -X POST https://auraorientalis.vn/api/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identifier":"admin","password":"password"}'
```

### Test from Browser Console

```javascript
fetch('https://auraorientalis.vn/api/api/v1/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  body: JSON.stringify({ identifier: 'admin', password: 'password' })
})
.then(r => r.json())
.then(console.log)
```

---

## Troubleshooting

### 403 Forbidden
- Check if `index.php` exists in `public_html/api/`
- Verify `.htaccess` file is uploaded

### 404 Not Found
- Check route path (should be `/api/api/v1/...`)
- Verify `index.php` paths point to `../laravel/`

### 500 Internal Server Error
- Check `laravel/storage/logs/laravel.log`
- Verify file permissions on `storage/` and `bootstrap/cache/`
- Check `.env` database credentials

### CORS Errors
- Upload updated `config/cors.php`
- Upload updated `.env` with CORS_ALLOWED_ORIGINS
- Clear browser cache

### Login "Incorrect Password"
- Run SQL: `UPDATE staff SET password_hash = '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' WHERE username = 'admin';`
- Password will be `password`

---

## Local Files Reference

| File | Purpose |
|------|---------|
| `deploy/api/index.php` | Modified Laravel entry point |
| `deploy/api/.htaccess` | Apache rewrite rules |
| `deploy/laravel/.env` | Production environment config |
| `deploy/schema_mysql.sql` | MySQL database schema |
| `deploy/seed_data_mysql.sql` | Sample data |
| `deploy/update_password.sql` | Fix password hash |

---

**Last updated**: 2026-01-07
