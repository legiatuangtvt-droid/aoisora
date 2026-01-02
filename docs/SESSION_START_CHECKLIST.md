# Session Start Checklist

> Khi bắt đầu phiên làm việc mới, thực hiện các bước sau:

---

## 1. Git Synchronization

- [ ] Kiểm tra nhánh hiện tại: `git branch`
- [ ] Kiểm tra trạng thái: `git status`
- [ ] Pull code mới nhất: `git pull`
- [ ] Xem các commit gần đây: `git log --oneline -5`

---

## 2. Project Structure Overview

```
Aura Web/
├── frontend/          # Next.js 14 (React) - Port 3000
├── backend/           # Laravel 11 (PHP) - Port 8000
├── database/          # PostgreSQL schema & seeds
├── docs/specs/        # Feature specifications
└── mobile/            # Flutter app (future)
```

---

## 3. Environment Check

### Frontend (Next.js)
- [ ] Kiểm tra Node.js version: `node -v` (yêu cầu v18+)
- [ ] Kiểm tra npm version: `npm -v`
- [ ] Cài đặt dependencies: `cd frontend && npm install`
- [ ] Kiểm tra file `.env.local` (nếu có)

### Backend (Laravel)
- [ ] Kiểm tra PHP version: `php -v` (yêu cầu PHP 8.0+)
- [ ] Kiểm tra Composer: `composer -V`
- [ ] Cài đặt dependencies: `cd backend && composer install`
- [ ] Kiểm tra file `.env` và cấu hình DB

### Database (PostgreSQL)
- [ ] Kiểm tra PostgreSQL: `psql --version` (yêu cầu v15+)
- [ ] Kiểm tra kết nối DB: `psql -U postgres -c "SELECT version();"`
- [ ] Verify database exists: `psql -U postgres -l`

---

## 4. Run Applications

### Frontend
```bash
cd frontend
npm run dev
# App chạy tại http://localhost:3000
```

### Backend
```bash
cd backend
php artisan serve
# API chạy tại http://localhost:8000
```

### Database
```bash
# Chạy migrations
cd backend
php artisan migrate

# Chạy seeders (data mẫu)
php artisan db:seed
```

---

## 5. Identify Issues

- [ ] Liệt kê các lỗi compile/runtime (nếu có)
- [ ] Liệt kê các warning
- [ ] Đề xuất các cải thiện cần thiết

---

# Architecture Separation Rules

> **QUAN TRỌNG**: Tuân thủ nguyên tắc tách biệt giữa các layer

## Layer Responsibilities

| Layer | Location | Responsibility | KHÔNG được làm |
|-------|----------|----------------|----------------|
| **Frontend** | `/frontend` | UI, User interactions, State management | Truy cập DB trực tiếp, Business logic phức tạp |
| **Backend** | `/backend` | API endpoints, Business logic, Validation | Render HTML, Truy cập DB không qua Model |
| **Database** | `/database` | Data storage, Schema, Indexes | Business logic trong SQL |

## Data Flow

```
User → Frontend (Next.js) → API Request → Backend (Laravel) → Database (PostgreSQL)
                                ↓
User ← Frontend (Next.js) ← API Response ← Backend (Laravel) ← Database (PostgreSQL)
```

## Code Organization Rules

### Frontend Rules
- Chỉ gọi API, KHÔNG truy cập DB trực tiếp
- State management với React hooks/context
- UI components trong `/components`
- API calls trong `/lib/api.ts`
- Types trong `/types`

### Backend Rules
- Controllers chỉ xử lý request/response
- Business logic trong Services (nếu phức tạp)
- Data access qua Eloquent Models
- Validation qua Form Requests
- API versioning: `/api/v1/*`

### Database Rules
- Schema changes qua Laravel Migrations
- Seed data qua Laravel Seeders
- KHÔNG chỉnh sửa DB trực tiếp (dùng migrations)
- Foreign keys và indexes đầy đủ

---

# Working Session Rules

> Trong suốt phiên làm việc, tuân thủ các quy tắc sau:

## On Every Change

1. **Update Spec**: Mỗi khi có thay đổi code, cập nhật file `.md` spec tương ứng trong `docs/specs/`
2. **Layer Separation**: Đảm bảo code đúng layer (Frontend/Backend/DB)
3. **Commit & Push**: Sau mỗi thay đổi hoàn chỉnh:
   ```bash
   git add .
   git commit -m "Mô tả thay đổi"
   git push
   ```

## Module Scope

### WS Module (Work Standard)
| Component | Tables | Controllers | Frontend Pages |
|-----------|--------|-------------|----------------|
| Tasks | `tasks`, `task_check_list`, `check_lists` | TaskController | `/tasks/*` |
| Task Groups | `task_groups` | TaskGroupController | - |
| Task Library | `task_library` | TaskLibraryController | `/tasks/library` |
| Manual | `manual_*` tables | ManualController | `/manual/*` |
| Core | `staff`, `stores`, `departments`, `regions` | Core Controllers | `/users/*`, `/stores/*` |

### DWS Module (Daily Work Schedule) - KHÔNG trong scope hiện tại
- `shift_codes`, `shift_assignments`, `shift_templates`
- `daily_templates`, `daily_schedule_tasks`
- ShiftCodeController, DailyScheduleTaskController...

## Spec Files Location

| Feature | Spec File |
|---------|-----------|
| Task List Screen | `docs/specs/task-list.md` |
| Task Detail Screen | `docs/specs/task-detail.md` |
| Task Library Screen | `docs/specs/task-library.md` |
| Add Task Screen | `docs/specs/add-task.md` |
| Todo Task Screen | `docs/specs/todo-task.md` |
| User Information | `docs/specs/user-information.md` |
| Store Information | `docs/specs/store-information.md` |
| Message Screen | `docs/specs/message.md` |
| App General | `docs/specs/app-general.md` |

## Commit Message Format

```
<type>(<scope>): <short description>

- Detail 1
- Detail 2

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
```

**Types**: `feat`, `fix`, `refactor`, `docs`, `style`, `chore`

**Scopes**: `frontend`, `backend`, `db`, `api`, `docs`

---

# Quick Commands

```bash
# Git
git status
git pull
git add .
git commit -m "message"
git push

# Frontend Development
cd frontend
npm install
npm run dev
npm run build
npm run lint
npm run typecheck

# Backend Development
cd backend
composer install
php artisan serve
php artisan migrate
php artisan db:seed
php artisan route:list

# Database
psql -U postgres -d aoisora
php artisan migrate:fresh --seed  # Reset DB with seeds
```

---

# Required Software Installation

## Cần cài đặt trước khi làm việc với Backend + DB:

### 1. PHP 8.0+ (với extensions)
```bash
# Windows: Download từ https://windows.php.net/download/
# Hoặc dùng XAMPP/Laragon

# Verify
php -v
```

**Extensions cần thiết:**
- pdo_pgsql (PostgreSQL)
- mbstring
- openssl
- tokenizer
- xml
- ctype
- json
- bcmath

### 2. Composer (PHP Package Manager)
```bash
# Windows: Download từ https://getcomposer.org/download/

# Verify
composer -V
```

### 3. PostgreSQL 15+
```bash
# Windows: Download từ https://www.postgresql.org/download/windows/

# Verify
psql --version

# Default credentials
# Host: localhost
# Port: 5432
# User: postgres
# Password: (set during installation)
```

### 4. pgAdmin (Optional - GUI cho PostgreSQL)
```bash
# Đi kèm với PostgreSQL installer
# Hoặc download riêng: https://www.pgadmin.org/download/
```

---

# Database Configuration

## Backend `.env` configuration:

```env
APP_NAME=Aoisora
APP_ENV=local
APP_KEY=base64:...
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=aoisora
DB_USERNAME=postgres
DB_PASSWORD=your_password

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

## Create database:

```sql
-- Connect to PostgreSQL
psql -U postgres

-- Create database
CREATE DATABASE aoisora;

-- Verify
\l
```
