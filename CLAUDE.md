# Claude Code Project Instructions

> File này được Claude Code tự động đọc khi bắt đầu phiên làm việc.

---

## ⚠️ CRITICAL CHECKLIST - PHẢI ĐỌC TRƯỚC MỖI COMMIT

```
┌─────────────────────────────────────────────────────────────────┐
│  TRƯỚC KHI COMMIT, HÃY TỰ HỎI:                                  │
│                                                                 │
│  ☐ 1. Đã UPDATE SPEC file trong docs/specs/ chưa?               │
│       → API endpoints, UI changes, validation rules, etc.       │
│                                                                 │
│  ☐ 2. Spec file có KHỚP với code vừa viết không?                │
│       → Request/Response format, Error codes, States            │
│                                                                 │
│  ☐ 3. Đã test API/UI hoạt động đúng chưa?                       │
│                                                                 │
│  CHỈ COMMIT SAU KHI CẢ 3 ĐIỀU TRÊN ĐỀU HOÀN THÀNH!              │
└─────────────────────────────────────────────────────────────────┘
```

---

## Quy tắc bắt buộc

### 1. Workflow sau mỗi thay đổi code

Sau khi hoàn thành bất kỳ thay đổi code nào, **BẮT BUỘC** thực hiện theo thứ tự:

1. **Update Spec TRƯỚC**: Cập nhật file `.md` spec tương ứng trong `docs/specs/`
   - ⚠️ **KHÔNG ĐƯỢC BỎ QUA BƯỚC NÀY**
   - Spec phải được update TRƯỚC khi commit
   - Nếu code thay đổi API → update API section trong spec
   - Nếu code thay đổi UI → update UI section trong spec

2. **Commit & Push**:
   ```bash
   git add .
   git commit -m "<type>(<scope>): <description>"
   git push
   ```

### 2. Commit Message Format

```
<type>(<scope>): <short description>

- Detail 1
- Detail 2

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
```

**Types**: `feat`, `fix`, `refactor`, `docs`, `style`, `chore`

**Scopes**: `frontend`, `backend`, `db`, `api`, `docs`

### 3. Architecture Separation

| Layer | Location | Responsibility |
|-------|----------|----------------|
| **Frontend** | `/frontend` | UI, User interactions, State management |
| **Backend** | `/backend` | API endpoints, Business logic, Validation |
| **Database** | `/database` | Data storage, Schema, Indexes |

### 4. Spec Files Location

Specs được tổ chức theo module:

```
docs/specs/
├── _shared/                    # Shared across all modules
│   ├── authentication.md       # Login, Sign Up, Forgot Password
│   └── app-general.md          # App-wide settings, themes
│
├── ws/                         # WS Module (Task from HQ)
│   ├── task-list.md
│   ├── task-detail.md
│   ├── task-library.md
│   ├── add-task.md
│   ├── todo-task.md
│   ├── user-information.md
│   ├── store-information.md
│   ├── message.md
│   └── report.md
│
├── dws/                        # DWS Module
├── faq/                        # FAQ Module
├── manual/                     # Manual Module
├── check-quality/              # Check Quality Module
└── training/                   # Training Module
```

**Quick Reference:**

| Module | Spec Path | Description |
|--------|-----------|-------------|
| Shared | `docs/specs/_shared/` | Authentication, App General |
| WS | `docs/specs/ws/` | Task from HQ |
| DWS | `docs/specs/dws/` | Dispatch Work Schedule |
| FAQ | `docs/specs/faq/` | Frequently Asked Questions |
| Manual | `docs/specs/manual/` | Knowledge Base |
| Check Quality | `docs/specs/check-quality/` | Quality Check |
| Training | `docs/specs/training/` | Training |

### 5. Laragon Paths (Windows)

```bash
# PHP
PHP="D:\devtool\laragon\bin\php\php-8.3.28-Win32-vs16-x64\php.exe"

# PostgreSQL
PSQL="D:\devtool\laragon\bin\postgresql\pgsql-18\bin\psql.exe"
PG_CTL="D:\devtool\laragon\bin\postgresql\pgsql-18\bin\pg_ctl.exe"
PG_DATA="D:\devtool\laragon\data\postgresql"
```

### 6. Database

- Database name: `aoisora`
- Schema file: `database/schema.sql`
- Seed file: `database/seed_data.sql`

### 7. Module Scope

Hệ thống có **6 module chính** (hiển thị sau khi login success). **Chỉ sửa code trong scope module được yêu cầu**.

| Module | Tên đầy đủ | Frontend Path | Spec Path |
|--------|------------|---------------|-----------|
| **WS** | Task from HQ (Work Schedule) | `/tasks/*` | `docs/specs/ws/` |
| **DWS** | Dispatch Work Schedule | `/dws/*` | `docs/specs/dws/` |
| **FAQ** | Frequently Asked Questions | `/faq/*` | `docs/specs/faq/` |
| **Manual** | Knowledge Base | `/manual/*` | `docs/specs/manual/` |
| **Check Quality** | Quality Check | `/check-quality/*` | `docs/specs/check-quality/` |
| **Training** | Training | `/training/*` | `docs/specs/training/` |

**Backend Controllers theo Module:**

| Module | Controllers |
|--------|-------------|
| WS | `TaskController`, `CheckListController`, `StaffController`, `StoreController`, `UserInfoController`, `StoreInfoController`, `NotificationController` |
| DWS | `ShiftCodeController`, `ShiftAssignmentController`, `TaskGroupController`, `DailyScheduleTaskController` |
| Manual | `ManualFolderController`, `ManualDocumentController`, `ManualStepController`, `ManualMediaController` |
| FAQ | TBD |
| Check Quality | TBD |
| Training | TBD |

⚠️ **Quan trọng**: Khi được yêu cầu làm việc trên 1 module, KHÔNG sửa code của module khác trừ khi được yêu cầu rõ ràng.

### 8. Backend Patterns (Laravel)

Tuân thủ các pattern sau khi viết code backend:

```
Request → Controller → Service → Model → Resource → Response
```

| Rule | Mô tả |
|------|-------|
| **Controller** | Chỉ nhận request, gọi Service, trả về Resource. KHÔNG chứa business logic |
| **Service** | Chứa business logic, query database, xử lý data |
| **Resource** | Transform model thành JSON response. Sử dụng cho TẤT CẢ API response |
| **Validation** | Sử dụng Form Request classes, không validate trong Controller |

**Ví dụ cấu trúc:**
```
app/
├── Http/
│   ├── Controllers/Api/V1/
│   │   └── UserInfoController.php    # Gọi Service, return Resource
│   ├── Requests/
│   │   └── StoreUserRequest.php      # Validation rules
│   └── Resources/
│       └── StaffResource.php         # JSON transformation
└── Services/
    └── UserInfoService.php           # Business logic
```

### 9. Database Improvement Tracking

Trong quá trình phát triển, ghi lại các cải tiến DB cần thiết vào `docs/database/enterprise-schema-design.md`:

| Khi nào ghi | Ghi gì |
|-------------|--------|
| Phát hiện duplicate data | Thêm vào "Discovered Issues" với table name, vấn đề cụ thể |
| Cần normalize column | Ghi column name, suggest FK relationship |
| Thiếu index | Ghi query pattern và suggested index |
| Cần thêm constraint | Ghi constraint type và reason |
| Schema limitation | Ghi limitation và proposed solution |

**Format entry:**
```markdown
### [DATE] Issue: [Tên vấn đề]
- **Table**: [table_name]
- **Current**: [mô tả hiện tại]
- **Problem**: [vấn đề gặp phải]
- **Proposed Solution**: [giải pháp đề xuất]
- **Impact**: [ảnh hưởng nếu thay đổi]
- **Priority**: [High/Medium/Low]
```

**File reference:**
- Current Schema: `docs/04-database/DB_DATABASE_STRUCTURE.md`
- Proposed Schema: `docs/database/enterprise-schema-design.md`
- SQL Implementation: `database/schema_v2.sql`

### 10. Session Start (Khởi động phiên làm việc mới)

**⚠️ BẮT BUỘC**: Trước khi bắt đầu code, **PHẢI** đồng bộ nhánh với remote:

```bash
# 1. Fetch và pull latest changes
git fetch origin
git pull origin <current-branch>

# 2. Nếu có conflict, resolve trước khi tiếp tục
```

Sau khi đồng bộ xong, khởi động servers theo thứ tự:

```bash
# 1. Start PostgreSQL
"D:\devtool\laragon\bin\postgresql\pgsql-18\bin\pg_ctl.exe" -D "D:\devtool\laragon\data\postgresql" start

# 2. Start Backend (Laravel)
cd backend && "D:\devtool\laragon\bin\php\php-8.3.28-Win32-vs16-x64\php.exe" artisan serve

# 3. Start Frontend (Next.js)
cd frontend && npm run dev

# 4. Start Reverb WebSocket Server (Optional - for real-time updates)
cd backend && "D:\devtool\laragon\bin\php\php-8.3.28-Win32-vs16-x64\php.exe" artisan reverb:start --port=8080
```

> **Note**: Reverb là optional. Nếu không chạy, app vẫn hoạt động bình thường nhưng không có real-time updates (Task List sẽ hiển thị "Offline").

Chi tiết: `docs/SESSION_START_CHECKLIST.md`

---

## Tham khảo chi tiết

Xem thêm tại: `docs/SESSION_START_CHECKLIST.md`
