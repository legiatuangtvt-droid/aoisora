# Aoisora Development & Deployment Guide

**Version**: 3.0
**Last Updated**: 2026-01-01

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Laravel Stack & Architecture Decisions](#2-laravel-stack--architecture-decisions)
3. [Local Development Setup](#3-local-development-setup)
4. [Database Setup](#4-database-setup)
5. [Running the Application](#5-running-the-application)
6. [Production Deployment (Firebase)](#6-production-deployment-firebase)
7. [Troubleshooting](#7-troubleshooting)

---

## 1. Prerequisites

### Required Software

| Software | Version | Download |
|----------|---------|----------|
| PHP | 8.3+ | https://windows.php.net/download |
| Composer | 2.x | https://getcomposer.org/download |
| Node.js | 18.x+ | https://nodejs.org |
| PostgreSQL | 17+ | https://www.postgresql.org/download |
| Git | 2.x+ | https://git-scm.com/download |

### PHP Extensions Required

Enable these extensions in `php.ini`:

```ini
extension=pdo_pgsql
extension=pgsql
extension=openssl
extension=mbstring
extension=tokenizer
extension=json
extension=curl
extension=fileinfo
```

### Verify Installation

```bash
# Check PHP version and extensions
php -v
php -m | grep pgsql

# Check Composer
composer --version

# Check Node.js
node --version
npm --version

# Check PostgreSQL
psql --version
```

---

## 2. Laravel Stack & Architecture Decisions

Dự án Aoisora sử dụng các công nghệ và pattern sau cho Laravel Backend. Các quyết định này được đưa ra dựa trên tính mở rộng và khả năng bảo trì lâu dài.

### 2.1 Authentication & Authorization: Laravel Passport

**Lựa chọn**: Laravel Passport (OAuth2 Server)

```bash
composer require laravel/passport
php artisan passport:install
```

**Lý do**:
- Setup có phức tạp hơn Laravel Sanctum, nhưng tính mở rộng và phát triển sau này tốt hơn nhiều
- Hỗ trợ đầy đủ OAuth2 flows (Authorization Code, Password Grant, Client Credentials, etc.)
- Nếu yêu cầu thay đổi hoặc cải tiến, chỉ cần thêm vào mà không cần chuyển đổi phương thức xác thực gây lỗi toàn bộ hệ thống
- Phù hợp cho mobile apps, third-party integrations

**Cấu hình cơ bản**:
```php
// config/auth.php
'guards' => [
    'api' => [
        'driver' => 'passport',
        'provider' => 'staff',  // Custom provider for Staff model
    ],
],
```

### 2.2 Query Methods: Query Builder + Eloquent ORM

**Lựa chọn**: Sử dụng kết hợp cả hai phương thức

| Phương thức | Ưu điểm | Nhược điểm | Khi nào dùng |
|-------------|---------|------------|--------------|
| **Query Builder** | Performance tốt nhất, tính custom cao, developers quen thuộc | Cú pháp dài hơn | Complex queries, reports, bulk operations |
| **Eloquent ORM** | Syntax đẹp, relationships dễ dàng, được Laravel khuyên dùng | Overhead nhỏ | CRUD operations, relationship queries |

**Ví dụ Query Builder** (cho reports, complex queries):
```php
// Performance-critical query
$report = DB::table('daily_schedule_tasks')
    ->join('staff', 'daily_schedule_tasks.staff_id', '=', 'staff.id')
    ->select('staff.name', DB::raw('COUNT(*) as total_tasks'))
    ->where('work_date', '>=', now()->subDays(7))
    ->groupBy('staff.id', 'staff.name')
    ->orderByDesc('total_tasks')
    ->get();
```

**Ví dụ Eloquent ORM** (cho CRUD, relationships):
```php
// Clean and maintainable
$task = DailyScheduleTask::with(['staff', 'store', 'taskLibrary'])
    ->where('work_date', today())
    ->where('store_id', $storeId)
    ->get();
```

**Nguyên tắc**:
- Eloquent cho operations đơn giản, có relationships
- Query Builder cho reports, complex aggregations, bulk updates

### 2.3 Database Management: Laravel Migrations

**Lựa chọn**: Laravel Migrations (Version Control for Database)

```bash
php artisan make:migration create_staff_table
php artisan migrate
php artisan migrate:rollback
```

**Lý do**:
- Chuyên nghiệp hóa quy trình quản lý DB
- Version control cho database schema
- Dễ dàng rollback khi có lỗi
- Team collaboration tốt hơn
- Tự động sync schema giữa các môi trường

**Cấu trúc thư mục**:
```
database/
├── migrations/           # Schema changes
│   ├── 2024_01_01_000001_create_stores_table.php
│   ├── 2024_01_01_000002_create_staff_table.php
│   └── ...
├── seeders/              # Test data
│   └── DatabaseSeeder.php
└── factories/            # Model factories for testing
```

### 2.4 Validation & Request Handling: Form Request Classes

**Lựa chọn**: Form Request Classes (tách validation logic)

```bash
php artisan make:request StoreStaffRequest
```

**Lý do**:
- Controller cực kỳ gọn gàng, chỉ làm nhiệm vụ điều hướng
- Không cần quan tâm dữ liệu đúng hay sai trong Controller
- Tái sử dụng: Một Form Request có thể dùng chung cho cả Web route và API route
- Dễ maintain và test

**Ví dụ**:
```php
// app/Http/Requests/StoreStaffRequest.php
class StoreStaffRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'employee_code' => 'required|string|max:20|unique:staff',
            'name' => 'required|string|max:100',
            'email' => 'required|email|unique:staff',
            'store_id' => 'required|exists:stores,id',
            'role' => 'required|in:MANAGER,STORE_LEADER_G3,STAFF',
        ];
    }

    public function messages(): array
    {
        return [
            'employee_code.unique' => 'Mã nhân viên đã tồn tại',
            'email.unique' => 'Email đã được sử dụng',
        ];
    }
}

// Controller sử dụng - cực kỳ gọn gàng
class StaffController extends Controller
{
    public function store(StoreStaffRequest $request)
    {
        // Validation đã được xử lý tự động
        $staff = Staff::create($request->validated());
        return response()->json($staff, 201);
    }
}
```

### 2.5 Background Jobs & Queue

**Lựa chọn**: Tùy thuộc vào yêu cầu dự án

| Option | Khi nào dùng | Tài nguyên |
|--------|--------------|------------|
| **Laravel Queue** | Ít tính năng xử lý hàng đợi | Thấp |
| **Laravel Horizon** | Xử lý hàng đợi nhiều, số lượng người dùng lớn | Tốn thêm tài nguyên server |

**Khuyến nghị hiện tại**: Bắt đầu với Laravel Queue, upgrade lên Horizon khi cần.

```bash
# Basic Queue
php artisan queue:work

# Nếu cần Horizon (sau này)
composer require laravel/horizon
php artisan horizon:install
```

### 2.6 Caching: Laravel Cache + Spatie Response Cache

**Lựa chọn**: Sử dụng kết hợp cả hai

**Laravel Cache (Redis/Memcached)** - cho data caching:
```php
// Cache query results
$stores = Cache::remember('stores.all', 3600, function () {
    return Store::with('region')->get();
});

// Cache với tags
Cache::tags(['stores', 'reports'])->put('key', $value, $seconds);
```

**Spatie Response Cache** - cho HTTP response caching (trang tĩnh):
```bash
composer require spatie/laravel-responsecache
```

```php
// Routes ít thay đổi
Route::get('/api/v1/code-master', [CodeMasterController::class, 'index'])
    ->middleware('cacheResponse:3600');
```

**Cấu hình Production**:
```env
CACHE_DRIVER=redis
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
```

### 2.7 Testing: Pest PHP

**Lựa chọn**: Pest PHP

```bash
composer require pestphp/pest --dev
php artisan pest:install
```

**Lý do**:
- Syntax cực sạch, dễ đọc
- Tốc độ chạy rất nhanh
- Compatible với PHPUnit
- Modern testing experience

**Ví dụ**:
```php
// tests/Feature/StaffTest.php
it('can create a new staff member', function () {
    $response = $this->postJson('/api/v1/staff', [
        'employee_code' => 'EMP001',
        'name' => 'Nguyen Van A',
        'email' => 'a@example.com',
        'store_id' => 1,
        'role' => 'STAFF',
    ]);

    $response->assertStatus(201)
        ->assertJsonStructure(['id', 'employee_code', 'name']);
});

it('validates required fields', function () {
    $response = $this->postJson('/api/v1/staff', []);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['employee_code', 'name', 'email']);
});
```

### 2.8 Code Quality: Laravel Pint

**Lựa chọn**: Laravel Pint

```bash
# Đã được cài sẵn trong Laravel 11+
./vendor/bin/pint

# Hoặc check only
./vendor/bin/pint --test
```

**Lý do**:
- Cấu hình cực kỳ tối giản
- Chạy rất nhanh
- Được cài đặt sẵn trong Laravel 11+
- Dựa trên PHP-CS-Fixer

**Cấu hình** (`pint.json`):
```json
{
    "preset": "laravel",
    "rules": {
        "simplified_null_return": true,
        "braces": {
            "allow_single_line_closure": true
        }
    }
}
```

### 2.9 Logging & Monitoring: Laravel Pulse

**Lựa chọn**: Laravel Pulse (Application Performance Monitoring)

```bash
composer require laravel/pulse
php artisan pulse:install
php artisan migrate
```

**Lý do**:
- Cực nhẹ, thiết kế để chạy an toàn trên Production
- Phát hiện "điểm nghẽn" (bottleneck) trước khi hệ thống gặp vấn đề
- Dashboard trực quan
- Track slow queries, exceptions, queue jobs

**Access Dashboard**: `https://your-app.com/pulse`

### 2.10 API Documentation

**Lựa chọn**: Tài liệu thủ công (không dùng auto-generation)

**Lý do**:
- Cả Scramble và Laravel Swagger đều generate tài liệu từ code
- Điều này đi ngược với bản chất dự án: **phải có tài liệu thì mới có code**
- Tài liệu API nên được viết trước, là spec để implement

**Quy trình đúng**:
1. Viết API spec/documentation trước
2. Review và approve spec
3. Implement code theo spec
4. Verify code matches spec

### 2.11 File Storage: Laravel Filesystem

**Lựa chọn**: Laravel Filesystem (local/S3/GCS abstraction)

```php
// Upload file
Storage::disk('local')->put('files/document.pdf', $content);

// Đổi sang S3 chỉ cần thay config
Storage::disk('s3')->put('files/document.pdf', $content);
```

**Lý do**:
- Tính năng basic của Laravel
- Phù hợp cho lưu trữ file đơn thuần
- Dễ dàng switch giữa local/S3/GCS

### 2.12 Utilities (Cài đặt tùy theo tính năng)

Các packages hữu ích, cài đặt khi cần:

```bash
# Excel Import/Export
composer require maatwebsite/excel

# PDF Generation
composer require barryvdh/laravel-dompdf

# Image Processing
composer require intervention/image

# Backup Database
composer require spatie/laravel-backup
```

### 2.13 Tóm tắt Laravel Stack

| Category | Lựa chọn | Package/Feature |
|----------|----------|-----------------|
| Authentication | Laravel Passport | OAuth2 Server |
| Query Methods | Hybrid | Query Builder + Eloquent ORM |
| Database | Laravel Migrations | Version Control |
| Validation | Form Request Classes | Tách logic validation |
| Queue | Laravel Queue | (Horizon khi scale) |
| Caching | Hybrid | Laravel Cache + Spatie Response Cache |
| Testing | Pest PHP | Modern syntax |
| Code Quality | Laravel Pint | Auto-formatting |
| Monitoring | Laravel Pulse | Performance monitoring |
| API Docs | Manual | Spec-first approach |
| File Storage | Laravel Filesystem | Local/S3/GCS |

---

## 3. Local Development Setup

### 3.1 Clone Repository

```bash
git clone https://github.com/your-org/aura.git
cd aura
```

### 3.2 Backend Setup (Laravel 11)

```bash
# Navigate to backend (thư mục mới)
cd backend-new

# Install PHP dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Install Passport OAuth keys
php artisan passport:keys
```

### 3.3 Configure Backend Environment

Edit `backend-new/.env`:

```env
APP_NAME=Aoisora
APP_ENV=local
APP_KEY=base64:YOUR_GENERATED_KEY
APP_DEBUG=true
APP_TIMEZONE=Asia/Ho_Chi_Minh
APP_URL=http://localhost:8000

# Database Configuration (PostgreSQL 17)
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5433
DB_DATABASE=aoisora-dev
DB_USERNAME=postgres
DB_PASSWORD=p@ssw0rd

# Cache & Queue (use file for local dev)
CACHE_STORE=file
QUEUE_CONNECTION=sync
SESSION_DRIVER=file

# Redis (Production)
# CACHE_STORE=redis
# REDIS_HOST=127.0.0.1
# REDIS_PORT=6379

# Optional: Sentry Error Tracking
SENTRY_LARAVEL_DSN=
```

### 3.4 Frontend Setup (Next.js)

```bash
# Navigate to frontend
cd ../frontend

# Install Node.js dependencies
npm install

# Copy environment file
cp .env.example .env.local
```

### 3.5 Configure Frontend Environment

Edit `frontend/.env.local`:

```env
# API URL for local development
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

# Optional: Enable debug mode
NEXT_PUBLIC_DEBUG=true
```

---

## 4. Database Setup

### 4.1 PostgreSQL Setup (PHP 8.3 + PostgreSQL 17)

**Lưu ý**: PHP 8.3 đã hỗ trợ SCRAM-SHA-256 authentication, không cần thay đổi cấu hình PostgreSQL.

**Verify PostgreSQL running**:
```cmd
# Check PostgreSQL service
pg_isready -h 127.0.0.1 -p 5433

# Or via Windows Services
net start | findstr postgresql
```

### 4.2 Create Database

Using pgAdmin or psql:

```sql
-- Connect to PostgreSQL
psql -U postgres -h localhost -p 5433

-- Create database
CREATE DATABASE "aoisora-dev";

-- Connect to database
\c aoisora-dev
```

### 4.3 Run Migrations (Laravel)

```bash
# From backend-new directory
cd backend-new

# Run all migrations
php artisan migrate

# Run migrations with seeding
php artisan migrate --seed
```

### 4.4 Seed Test Data

```bash
# Seed database with test data
php artisan db:seed

# Or run specific seeder
php artisan db:seed --class=StaffSeeder
```

### 4.5 Verify Data

```sql
-- Check record counts
SELECT 'staff' AS table_name, COUNT(*) FROM staff
UNION ALL SELECT 'stores', COUNT(*) FROM stores
UNION ALL SELECT 'daily_schedule_tasks', COUNT(*) FROM daily_schedule_tasks;
```

---

## 5. Running the Application

### 5.1 Start Backend Server

```bash
cd backend-new
php artisan serve --host=0.0.0.0 --port=8000
```

Backend will run at: `http://localhost:8000`

### 5.2 Start Frontend Server

```bash
cd frontend
npm run dev
```

Frontend will run at: `http://localhost:3000`

### 5.3 Test API Connection

```bash
# Test login endpoint
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password123"}'
```

### 5.4 Default Login Credentials

| Username | Password | Role |
|----------|----------|------|
| admin | password123 | admin |
| leader | password123 | STORE_LEADER_G3 |
| staff1 | password123 | STAFF |

---

## 6. Production Deployment (Firebase)

### 6.1 Firebase Project Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create new project: `aoisora-prod`
3. Enable Firebase Hosting

### 6.2 Install Firebase CLI

```bash
npm install -g firebase-tools
firebase login
```

### 6.3 Initialize Firebase Hosting

```bash
cd frontend
firebase init hosting

# Select options:
# - Use existing project: aoisora-prod
# - Public directory: out
# - Configure as single-page app: Yes
# - Set up automatic builds: No
```

### 6.4 Configure Frontend for Production

Edit `frontend/.env.production`:

```env
# Production API URL (your Laravel backend URL)
NEXT_PUBLIC_API_URL=https://api.aoisora.com/api/v1

# Disable debug
NEXT_PUBLIC_DEBUG=false
```

### 6.5 Build Frontend for Production

```bash
cd frontend

# Build static export
npm run build

# Export static files
npm run export
```

### 6.6 Deploy to Firebase Hosting

```bash
# Deploy frontend
firebase deploy --only hosting
```

Your frontend will be available at: `https://aoisora-prod.web.app`

### 6.7 Backend Deployment Options

For Laravel backend, you have several options:

#### Option A: Traditional VPS (Recommended)

1. Set up Ubuntu/Debian VPS
2. Install Nginx + PHP-FPM + PostgreSQL
3. Configure SSL with Let's Encrypt
4. Deploy Laravel with Git

Example Nginx config:

```nginx
server {
    listen 443 ssl http2;
    server_name api.aoisora.com;

    root /var/www/aoisora/backend-new/public;
    index index.php;

    ssl_certificate /etc/letsencrypt/live/api.aoisora.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.aoisora.com/privkey.pem;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.3-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }
}
```

#### Option B: Platform as a Service

- [Laravel Forge](https://forge.laravel.com)
- [Ploi](https://ploi.io)
- [DigitalOcean App Platform](https://www.digitalocean.com/products/app-platform)

#### Option C: Containerized (Docker)

Create `Dockerfile` for Laravel:

```dockerfile
FROM php:8.3-fpm

RUN apt-get update && apt-get install -y \
    libpq-dev \
    libzip-dev \
    && docker-php-ext-install pdo pdo_pgsql zip

WORKDIR /var/www
COPY . .
RUN composer install --no-dev --optimize-autoloader

EXPOSE 9000
CMD ["php-fpm"]
```

### 6.8 Production Environment Variables

Backend `.env.production`:

```env
APP_NAME=Aoisora
APP_ENV=production
APP_DEBUG=false
APP_TIMEZONE=Asia/Ho_Chi_Minh
APP_URL=https://api.aoisora.com

DB_CONNECTION=pgsql
DB_HOST=your-production-db-host
DB_PORT=5432
DB_DATABASE=aoisora_prod
DB_USERNAME=aoisora_user
DB_PASSWORD=secure_password_here

# Cache & Queue (Production with Redis)
CACHE_STORE=redis
QUEUE_CONNECTION=redis
SESSION_DRIVER=redis
REDIS_HOST=your-redis-host
REDIS_PORT=6379

# Sentry for error tracking
SENTRY_LARAVEL_DSN=https://xxx@sentry.io/xxx
```

### 6.9 Firebase Hosting Configuration

Edit `frontend/firebase.json`:

```json
{
  "hosting": {
    "public": "out",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000, immutable"
          }
        ]
      }
    ]
  }
}
```

---

## 7. Troubleshooting

### Common Issues

#### PHP pdo_pgsql extension not found

```bash
# Windows: Edit php.ini
extension=pdo_pgsql
extension=pgsql

# Linux (Ubuntu/Debian)
sudo apt install php8.3-pgsql
```

#### Port already in use

```bash
# Find process using port 8001
netstat -ano | findstr :8000

# Kill process (Windows)
taskkill /PID <PID> /F

# Linux
kill -9 $(lsof -t -i:8000)
```

#### CORS errors

Check `backend/config/cors.php`:

```php
'paths' => ['api/*', 'sanctum/csrf-cookie'],
'allowed_origins' => [
    'http://localhost:3000',
    'https://aoisora-prod.web.app'
],
'supports_credentials' => true,
```

#### Database connection failed

1. Check PostgreSQL is running
2. Verify connection settings in `.env`
3. Test connection:

```bash
psql -U postgres -h 127.0.0.1 -p 5433 -d aoisora-dev
```

#### Laravel key not set

```bash
php artisan key:generate
```

#### Composer memory limit

```bash
COMPOSER_MEMORY_LIMIT=-1 composer install
```

---

## Quick Reference

### Development Commands

```bash
# Backend (Laravel 11)
cd backend-new
php artisan serve --host=0.0.0.0         # Start server
php artisan route:list                   # List routes
php artisan cache:clear                  # Clear cache
php artisan config:clear                 # Clear config
php artisan optimize:clear               # Clear all caches

# Database
php artisan migrate                      # Run migrations
php artisan migrate:fresh --seed         # Reset and seed
php artisan db:seed                      # Seed data

# Frontend
cd frontend
npm run dev                              # Start dev server
npm run build                            # Build for production
npm run lint                             # Run linter
```

### Project URLs

| Environment | Frontend | Backend API |
|-------------|----------|-------------|
| Local | http://localhost:3000 | http://localhost:8000/api/v1 |
| Production | https://aoisora-prod.web.app | https://api.aoisora.com/api/v1 |

---

**Document Version**: 3.0
**Created**: 2025-12-31
**Updated**: 2026-01-01
**Author**: Claude Code

### Changelog

- v3.0 (2026-01-01): Migrated to PHP 8.3, Laravel 11, PostgreSQL 17. Updated paths to `backend-new/`.
- v2.0 (2025-12-31): Added Laravel Stack & Architecture Decisions section.
- v1.0 (2025-12-30): Initial documentation.
