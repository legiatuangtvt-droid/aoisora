# Deploy Laravel Backend với Reverb WebSocket

Hướng dẫn deploy Laravel API + Reverb WebSocket server lên production.

## Mục lục

1. [Tổng quan kiến trúc](#1-tổng-quan-kiến-trúc)
2. [Các lựa chọn hosting](#2-các-lựa-chọn-hosting)
3. [Deploy lên VPS (DigitalOcean/Vultr)](#3-deploy-lên-vps)
4. [Deploy lên Railway](#4-deploy-lên-railway)
5. [Cấu hình Nginx Reverse Proxy](#5-cấu-hình-nginx-reverse-proxy)
6. [Supervisor cho Reverb](#6-supervisor-cho-reverb)
7. [SSL/HTTPS Configuration](#7-sslhttps-configuration)
8. [Environment Variables](#8-environment-variables)
9. [Troubleshooting](#9-troubleshooting)

---

## 1. Tổng quan kiến trúc

```
┌─────────────────────────────────────────────────────────────┐
│                        PRODUCTION                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ┌─────────────────┐     ┌─────────────────┐              │
│   │   Next.js       │     │   Mobile App    │              │
│   │   (Vercel)      │     │   (iOS/Android) │              │
│   └────────┬────────┘     └────────┬────────┘              │
│            │                       │                        │
│            └───────────┬───────────┘                        │
│                        │                                    │
│                        ▼                                    │
│            ┌───────────────────────┐                        │
│            │       Nginx           │                        │
│            │   (Reverse Proxy)     │                        │
│            └───────────┬───────────┘                        │
│                        │                                    │
│         ┌──────────────┴──────────────┐                     │
│         │                             │                     │
│         ▼                             ▼                     │
│  ┌─────────────────┐      ┌─────────────────────┐          │
│  │  Laravel API    │      │  Reverb WebSocket   │          │
│  │  (PHP-FPM)      │      │  (PHP Process)      │          │
│  │  :8000          │      │  :8080              │          │
│  └────────┬────────┘      └──────────┬──────────┘          │
│           │                          │                      │
│           └───────────┬──────────────┘                      │
│                       │                                     │
│                       ▼                                     │
│            ┌───────────────────────┐                        │
│            │     PostgreSQL        │                        │
│            │     Database          │                        │
│            └───────────────────────┘                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Các thành phần cần chạy

| Component | Port | Command | Notes |
|-----------|------|---------|-------|
| Laravel API | 8000 | `php artisan serve` hoặc PHP-FPM | Main API |
| Reverb | 8080 | `php artisan reverb:start` | WebSocket server |
| Queue Worker | - | `php artisan queue:work` | (Optional) Background jobs |
| Scheduler | - | `php artisan schedule:run` | (Optional) Cron jobs |

---

## 2. Các lựa chọn hosting

### Option A: VPS (Recommended for WebSocket)

| Provider | Price | Pros | Cons |
|----------|-------|------|------|
| **DigitalOcean** | $6/mo | Simple, good docs | Limited free tier |
| **Vultr** | $5/mo | Cheap, fast | Manual setup |
| **Linode** | $5/mo | Reliable | Manual setup |
| **Hetzner** | €4.5/mo | Very cheap, EU | EU only |

**Best for**: Full control, WebSocket support, production-ready

### Option B: PaaS (Easier but limited)

| Provider | Price | WebSocket | Notes |
|----------|-------|-----------|-------|
| **Railway** | Free tier | Yes | Good for small apps |
| **Render** | Free tier | Yes | Sleep after 15 min |
| **Fly.io** | Free tier | Yes | Complex setup |
| **Laravel Forge** | $12/mo | Yes | Best for Laravel |

**Best for**: Quick deployment, less maintenance

### Option C: Without WebSocket (Simpler)

Nếu không cần real-time updates:
- Set `BROADCAST_DRIVER=log` hoặc `null`
- Không cần chạy Reverb
- Dùng polling thay thế (fetch API mỗi 30s)

---

## 3. Deploy lên VPS

### 3.1 Server Requirements

```
- Ubuntu 22.04 LTS
- 1 vCPU, 1GB RAM (minimum)
- 25GB SSD
- PHP 8.2+
- PostgreSQL 15+
- Nginx
- Supervisor
```

### 3.2 Initial Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install PHP 8.3
sudo add-apt-repository ppa:ondrej/php -y
sudo apt install php8.3-fpm php8.3-cli php8.3-pgsql php8.3-mbstring \
    php8.3-xml php8.3-curl php8.3-zip php8.3-bcmath php8.3-intl -y

# Install Composer
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer

# Install Nginx
sudo apt install nginx -y

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Install Supervisor
sudo apt install supervisor -y

# Install Node.js (for frontend build)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install nodejs -y
```

### 3.3 Clone và Setup Project

```bash
# Create project directory
sudo mkdir -p /var/www/aoisora
sudo chown -R $USER:$USER /var/www/aoisora

# Clone repository
cd /var/www/aoisora
git clone https://github.com/CodegymTuLG/aura.git .

# Setup Backend
cd backend
composer install --no-dev --optimize-autoloader
cp .env.example .env
php artisan key:generate

# Set permissions
sudo chown -R www-data:www-data storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache
```

### 3.4 Configure Database

```bash
# Create database
sudo -u postgres psql
CREATE DATABASE aoisora;
CREATE USER aoisora_user WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE aoisora TO aoisora_user;
\q

# Update .env
nano .env
# DB_CONNECTION=pgsql
# DB_HOST=127.0.0.1
# DB_PORT=5432
# DB_DATABASE=aoisora
# DB_USERNAME=aoisora_user
# DB_PASSWORD=your_secure_password

# Run migrations
php artisan migrate --force
```

---

## 4. Deploy lên Railway

Railway hỗ trợ WebSocket và dễ setup hơn VPS.

### 4.1 Tạo Railway Project

1. Đăng ký tại [railway.app](https://railway.app)
2. Create New Project → Deploy from GitHub
3. Chọn repository và branch

### 4.2 Tạo railway.json

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=$PORT",
    "healthcheckPath": "/api/v1/health",
    "healthcheckTimeout": 100
  }
}
```

### 4.3 Tạo Procfile cho Reverb

```
web: php artisan serve --host=0.0.0.0 --port=$PORT
reverb: php artisan reverb:start --host=0.0.0.0 --port=8080
```

### 4.4 Environment Variables (Railway)

```
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-app.railway.app

DB_CONNECTION=pgsql
DATABASE_URL=${{Postgres.DATABASE_URL}}

BROADCAST_DRIVER=reverb
REVERB_APP_ID=your_app_id
REVERB_APP_KEY=your_app_key
REVERB_APP_SECRET=your_app_secret
REVERB_HOST=your-app.railway.app
REVERB_PORT=443
REVERB_SCHEME=https
```

---

## 5. Cấu hình Nginx Reverse Proxy

### 5.1 Site Configuration

```nginx
# /etc/nginx/sites-available/aoisora
server {
    listen 80;
    server_name api.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/api.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.yourdomain.com/privkey.pem;

    root /var/www/aoisora/backend/public;
    index index.php;

    # Laravel API
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.3-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    # WebSocket (Reverb)
    location /app {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 60s;
        proxy_send_timeout 60s;
    }

    # Health check
    location /health {
        access_log off;
        return 200 "OK";
    }
}
```

### 5.2 Enable Site

```bash
sudo ln -s /etc/nginx/sites-available/aoisora /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 6. Supervisor cho Reverb

Supervisor đảm bảo Reverb chạy liên tục và auto-restart nếu crash.

### 6.1 Tạo Config File

```ini
# /etc/supervisor/conf.d/aoisora-reverb.conf
[program:aoisora-reverb]
process_name=%(program_name)s
command=php /var/www/aoisora/backend/artisan reverb:start --host=127.0.0.1 --port=8080
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
numprocs=1
redirect_stderr=true
stdout_logfile=/var/www/aoisora/backend/storage/logs/reverb.log
stopwaitsecs=3600
```

### 6.2 Optional: Queue Worker

```ini
# /etc/supervisor/conf.d/aoisora-worker.conf
[program:aoisora-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/aoisora/backend/artisan queue:work --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
numprocs=2
redirect_stderr=true
stdout_logfile=/var/www/aoisora/backend/storage/logs/worker.log
stopwaitsecs=3600
```

### 6.3 Start Supervisor

```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start aoisora-reverb:*

# Check status
sudo supervisorctl status
```

---

## 7. SSL/HTTPS Configuration

### 7.1 Install Certbot

```bash
sudo apt install certbot python3-certbot-nginx -y
```

### 7.2 Get SSL Certificate

```bash
sudo certbot --nginx -d api.yourdomain.com
```

### 7.3 Auto-renewal

```bash
# Test renewal
sudo certbot renew --dry-run

# Cron job (auto-added by certbot)
# 0 12 * * * /usr/bin/certbot renew --quiet
```

---

## 8. Environment Variables

### 8.1 Backend Production .env

```env
APP_NAME=Aoisora
APP_ENV=production
APP_KEY=base64:your_generated_key
APP_DEBUG=false
APP_URL=https://api.yourdomain.com

LOG_CHANNEL=stack
LOG_LEVEL=error

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
SESSION_LIFETIME=120

# Reverb Configuration
REVERB_APP_ID=your_app_id
REVERB_APP_KEY=your_app_key
REVERB_APP_SECRET=your_app_secret
REVERB_HOST=api.yourdomain.com
REVERB_PORT=443
REVERB_SCHEME=https

# For internal communication
REVERB_SERVER_HOST=127.0.0.1
REVERB_SERVER_PORT=8080
```

### 8.2 Frontend Production .env.local

```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api/v1

# Reverb WebSocket
NEXT_PUBLIC_REVERB_APP_KEY=your_app_key
NEXT_PUBLIC_REVERB_HOST=api.yourdomain.com
NEXT_PUBLIC_REVERB_PORT=443
NEXT_PUBLIC_REVERB_SCHEME=https
```

---

## 9. Troubleshooting

### Issue: WebSocket connection failed

```bash
# Check Reverb is running
sudo supervisorctl status aoisora-reverb

# Check logs
tail -f /var/www/aoisora/backend/storage/logs/reverb.log

# Test WebSocket locally
curl -i -N -H "Connection: Upgrade" -H "Upgrade: websocket" \
    http://127.0.0.1:8080/app/your_app_key
```

### Issue: Nginx WebSocket timeout

```nginx
# Increase timeouts in nginx.conf
proxy_read_timeout 300s;
proxy_send_timeout 300s;
proxy_connect_timeout 75s;
```

### Issue: CORS errors

```php
// config/cors.php
'allowed_origins' => ['https://yourdomain.com', 'https://www.yourdomain.com'],
'supports_credentials' => true,
```

### Issue: Broadcasting not working

```bash
# Clear config cache
php artisan config:clear
php artisan cache:clear

# Verify broadcasting driver
php artisan tinker
>>> config('broadcasting.default')
# Should return "reverb"
```

---

## 10. Deployment Checklist

### Pre-deployment
- [ ] All tests passing locally
- [ ] Environment variables configured
- [ ] Database migrations ready
- [ ] SSL certificate obtained

### Backend deployment
- [ ] Composer dependencies installed (--no-dev)
- [ ] Migrations run
- [ ] Config cached (`php artisan config:cache`)
- [ ] Routes cached (`php artisan route:cache`)
- [ ] Permissions set (storage, bootstrap/cache)

### Reverb deployment
- [ ] Supervisor config created
- [ ] Reverb process running
- [ ] Nginx WebSocket proxy configured
- [ ] WebSocket connection tested

### Frontend deployment
- [ ] Environment variables updated
- [ ] Build successful
- [ ] Deployed to hosting (Vercel/Netlify)
- [ ] WebSocket connection tested

---

## 11. Monitoring

### Log files to monitor

```bash
# Laravel logs
tail -f /var/www/aoisora/backend/storage/logs/laravel.log

# Reverb logs
tail -f /var/www/aoisora/backend/storage/logs/reverb.log

# Nginx access logs
tail -f /var/log/nginx/access.log

# Nginx error logs
tail -f /var/log/nginx/error.log
```

### Health check endpoint

```php
// routes/api.php
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toIso8601String(),
    ]);
});
```

---

**Last updated**: 2026-01-07
