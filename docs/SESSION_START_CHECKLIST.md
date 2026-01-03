# Session Start Checklist

> Khi bắt đầu phiên làm việc mới, thực hiện các bước sau:

---

## 1. Git Synchronization

```bash
git branch                    # Kiểm tra nhánh hiện tại
git status                    # Kiểm tra trạng thái
git pull                      # Pull code mới nhất
git log --oneline -5          # Xem các commit gần đây
```

---

## 2. Start All Services (QUAN TRỌNG)

> **Phải khởi động cả 3 services trước khi bắt đầu làm việc**

### Step 1: Start PostgreSQL Database
```bash
"D:\devtool\laragon\bin\postgresql\pgsql-18\bin\pg_ctl.exe" -D "D:\devtool\laragon\data\postgresql" start
```

### Step 2: Start Backend (Laravel) - Terminal 1
```bash
cd backend
"D:\devtool\laragon\bin\php\php-8.3.28-Win32-vs16-x64\php.exe" artisan serve
# API chạy tại http://localhost:8000
```

### Step 3: Start Frontend (Next.js) - Terminal 2
```bash
cd frontend
npm run dev
# App chạy tại http://localhost:3000 (hoặc 3001, 3002... nếu port bị chiếm)
```

> **Note về CORS**: Backend đã được config để chấp nhận Frontend trên port 3000-3009.
> Nếu port 3000 bị chiếm, Next.js sẽ tự động chuyển sang port khác và vẫn hoạt động bình thường.

### Verify All Services Running
| Service | URL | Expected |
|---------|-----|----------|
| Frontend | http://localhost:3000 (hoặc 300x) | Next.js app |
| Backend API | http://localhost:8000/api/v1/auth/login | JSON response |
| Database | `psql -U postgres -d aoisora -c "\dt"` | List tables |

---

## 3. Test Credentials

| Username | Password | Role |
|----------|----------|------|
| `admin` | `password` | MANAGER |
| `leader1` | `password` | STORE_LEADER_G3 |
| `staff1_1` | `password` | STAFF |

### Quick API Test (curl)
```bash
curl -s http://127.0.0.1:8000/api/v1/auth/login -X POST -H "Content-Type: application/json" -H "Accept: application/json" -d "{\"username\":\"admin\",\"password\":\"password\"}"
```

---

## 4. Working Session Workflow

> **Mục tiêu**: Backend + DB development, kết hợp hoàn thiện Frontend, update spec

### Development Cycle

```
┌─────────────────────────────────────────────────────────────────┐
│  1. Chọn feature/screen cần làm                                 │
│     ↓                                                           │
│  2. Kiểm tra/hoàn thiện Backend API endpoints                   │
│     ↓                                                           │
│  3. Kiểm tra/cập nhật Database schema nếu cần                   │
│     ↓                                                           │
│  4. Hoàn thiện Frontend screen tương ứng                        │
│     ↓                                                           │
│  5. Test tích hợp FE + BE + DB                                  │
│     ↓                                                           │
│  6. Cập nhật spec file trong docs/specs/                        │
│     ↓                                                           │
│  7. Commit & Push                                               │
│     ↓                                                           │
│  (Lặp lại cho feature tiếp theo)                                │
└─────────────────────────────────────────────────────────────────┘
```

### On Every Change (BẮT BUỘC)

1. **Update Spec**: Cập nhật file `.md` spec tương ứng trong `docs/specs/`
2. **Layer Separation**: Đảm bảo code đúng layer (Frontend/Backend/DB)
3. **Commit & Push**: Sau mỗi thay đổi hoàn chỉnh:
   ```bash
   git add .
   git commit -m "<type>(<scope>): <description>"
   git push
   ```

---

## 5. Login Screen Priority

> **LƯU Ý**: Login screen (Authentication) cần được hoàn thiện ĐẦU TIÊN

### Tại sao Login screen quan trọng?
- Tất cả các screens khác đều yêu cầu authentication token
- Không có login → không test được các screens khác trên browser
- Backend API đã sẵn sàng: `/api/v1/auth/login`

### Workaround tạm thời (nếu chưa có Login screen)
```javascript
// Mở Browser Console (F12) tại http://localhost:3000
// Paste đoạn code sau để set token thủ công:

// 1. Gọi API login
fetch('http://localhost:8000/api/v1/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'admin', password: 'password' })
})
.then(r => r.json())
.then(data => {
  localStorage.setItem('access_token', data.access_token);
  console.log('Token saved:', data.access_token);
});

// 2. Refresh page để app sử dụng token
```

### Recommended: Hoàn thiện Login Screen trước
- File: `frontend/src/app/login/page.tsx`
- API: `POST /api/v1/auth/login`
- Response: `{ access_token, token_type, staff }`

---

## 6. Project Structure

```
Aura Web/
├── frontend/          # Next.js 14 (React) - Port 3000
├── backend/           # Laravel 11 (PHP) - Port 8000
├── database/          # PostgreSQL schema & seeds
├── docs/specs/        # Feature specifications
└── mobile/            # Flutter app (future)
```

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
- Schema changes qua Laravel Migrations hoặc `database/schema.sql`
- Seed data qua `database/seed_data.sql`
- KHÔNG chỉnh sửa DB trực tiếp trong production
- Foreign keys và indexes đầy đủ

---

# Module Scope

## WS Module (Work Standard) - TRONG SCOPE

| Component | Tables | Controllers | Frontend Pages |
|-----------|--------|-------------|----------------|
| **Auth** | `staff`, `personal_access_tokens` | AuthController | `/login` |
| **Tasks** | `tasks`, `task_check_list`, `check_lists` | TaskController | `/tasks/*` |
| **Task Groups** | `task_groups` | TaskGroupController | - |
| **Task Library** | `task_library` | TaskLibraryController | `/tasks/library` |
| **Manual** | `manual_*` tables | ManualController | `/manual/*` |
| **Core** | `staff`, `stores`, `departments`, `regions` | Core Controllers | `/users/*`, `/stores/*` |

## DWS Module (Daily Work Schedule) - KHÔNG trong scope hiện tại
- `shift_codes`, `shift_assignments`, `shift_templates`
- `daily_templates`, `daily_schedule_tasks`
- ShiftCodeController, DailyScheduleTaskController...

---

# Spec Files Location

| Feature | Spec File | Status |
|---------|-----------|--------|
| Login Screen | `docs/specs/login.md` | TODO |
| Task List Screen | `docs/specs/task-list.md` | Available |
| Task Detail Screen | `docs/specs/task-detail.md` | Available |
| Task Library Screen | `docs/specs/task-library.md` | Available |
| Add Task Screen | `docs/specs/add-task.md` | Available |
| Todo Task Screen | `docs/specs/todo-task.md` | Available |
| Manual Screen | `docs/specs/manual.md` | TODO |
| User Information | `docs/specs/user-information.md` | Available |
| Store Information | `docs/specs/store-information.md` | Available |
| Message Screen | `docs/specs/message.md` | Available |
| App General | `docs/specs/app-general.md` | Available |

---

# Quick Commands

## Laragon Paths (Windows - D:\devtool\laragon)

```bash
# PHP
PHP="D:\devtool\laragon\bin\php\php-8.3.28-Win32-vs16-x64\php.exe"

# Composer
COMPOSER="D:\devtool\laragon\bin\composer\composer.phar"

# PostgreSQL
PSQL="D:\devtool\laragon\bin\postgresql\pgsql-18\bin\psql.exe"
PG_CTL="D:\devtool\laragon\bin\postgresql\pgsql-18\bin\pg_ctl.exe"
PG_DATA="D:\devtool\laragon\data\postgresql"
```

## Git Commands

```bash
git status
git pull
git add .
git commit -m "message"
git push
```

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

## Frontend Development

```bash
cd frontend
npm install
npm run dev
npm run build
npm run lint
npm run typecheck
```

## Backend Development (with Laragon paths)

```bash
cd backend

# Install dependencies
"D:\devtool\laragon\bin\php\php-8.3.28-Win32-vs16-x64\php.exe" "D:\devtool\laragon\bin\composer\composer.phar" install

# Start Laravel server
"D:\devtool\laragon\bin\php\php-8.3.28-Win32-vs16-x64\php.exe" artisan serve

# List routes
"D:\devtool\laragon\bin\php\php-8.3.28-Win32-vs16-x64\php.exe" artisan route:list --path=api

# Check database connection
"D:\devtool\laragon\bin\php\php-8.3.28-Win32-vs16-x64\php.exe" artisan db:show
```

## PostgreSQL Commands (with Laragon paths)

```bash
# Start PostgreSQL
"D:\devtool\laragon\bin\postgresql\pgsql-18\bin\pg_ctl.exe" -D "D:\devtool\laragon\data\postgresql" start

# Stop PostgreSQL
"D:\devtool\laragon\bin\postgresql\pgsql-18\bin\pg_ctl.exe" -D "D:\devtool\laragon\data\postgresql" stop

# Connect to database
"D:\devtool\laragon\bin\postgresql\pgsql-18\bin\psql.exe" -U postgres -d aoisora

# Run schema.sql (reset database)
"D:\devtool\laragon\bin\postgresql\pgsql-18\bin\psql.exe" -U postgres -d aoisora -f "d:\Project\Aura Web\database\schema.sql"

# Run seed_data.sql
"D:\devtool\laragon\bin\postgresql\pgsql-18\bin\psql.exe" -U postgres -d aoisora -f "d:\Project\Aura Web\database\seed_data.sql"

# List tables
"D:\devtool\laragon\bin\postgresql\pgsql-18\bin\psql.exe" -U postgres -d aoisora -c "\dt"
```

---

# Database Configuration

## Backend `.env` configuration:

```env
APP_NAME=Aoisora
APP_ENV=local
APP_KEY=base64:BuFEDRUHaCmP5M8IFmdcjhIaDPsDNlZflDpjOsFrbRs=
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=aoisora
DB_USERNAME=postgres
DB_PASSWORD=

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

## Frontend `.env.local` configuration:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

---

# End Session Checklist

Trước khi kết thúc phiên làm việc:

- [ ] Commit tất cả changes
- [ ] Push lên remote
- [ ] Update spec files nếu có thay đổi
- [ ] Stop services (optional):
  ```bash
  # Stop PostgreSQL
  "D:\devtool\laragon\bin\postgresql\pgsql-18\bin\pg_ctl.exe" -D "D:\devtool\laragon\data\postgresql" stop

  # Frontend & Backend: Ctrl+C trong terminal
  ```
