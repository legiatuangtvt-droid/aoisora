# Claude Code Project Instructions

> File này được Claude Code tự động đọc khi bắt đầu phiên làm việc.

---

## 👤 VAI TRÒ VÀ TRÁCH NHIỆM

### User Role: Spec Writer & QA Tester

```
┌─────────────────────────────────────────────────────────────────┐
│  NHIỆM VỤ CHÍNH:                                                │
│                                                                 │
│  📝 ĐẦU VÀO (Specification)                                     │
│     → Viết Basic Spec: Tổng quan screen/feature                 │
│     → Viết Detail Spec: Chi tiết UI, API, Logic                 │
│                                                                 │
│  🧪 ĐẦU RA (Testing)                                            │
│     → Test từng screen sau khi build xong                       │
│     → Verify spec khớp với implementation                       │
│     → Report bugs và issues                                     │
│                                                                 │
│  🚀 SAU KHI PRODUCTION                                          │
│     → Vận hành và bảo trì app                                   │
│     → Monitor và xử lý issues                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Quy trình làm việc hiện tại

```
┌─────────────────────────────────────────────────────────────────┐
│  WORKFLOW (SPEC-FIRST APPROACH):                                │
│                                                                 │
│  1. ĐỌC & HOÀN THIỆN SPEC                                       │
│     → Đọc spec file trong docs/specs/{module}/                 │
│     → ⚠️ PHẢI HỎI USER trước khi edit spec                     │
│     → Hoàn thiện spec để sẵn sàng build                        │
│     → Basic Spec: {screen}-basic.md (tổng quan)                │
│     → Detail Spec: {screen}-detail.md (chi tiết)               │
│                                                                 │
│  2. BUILD DEMO (theo SPEC)                                      │
│     → Code theo spec đã hoàn thiện                             │
│     → ⚠️ Liên tục SO SÁNH code với spec khi coding             │
│     → Lưu ý: đã code theo spec chưa? Vì sao chưa?             │
│     → Phát hiện vấn đề spec → BÁO CÁO & ĐỀ XUẤT sửa spec      │
│     → Code có thể edit AUTOMATICALLY (không cần hỏi)           │
│     → Build trên local, test đầy đủ tính năng                  │
│                                                                 │
│  3. REVIEW & ĐIỀU CHỈNH SPEC                                    │
│     → Quay lại xem xét spec dựa trên findings từ coding       │
│     → ⚠️ HỎI USER trước khi điều chỉnh spec                    │
│     → Hoàn thiện spec nếu cần                                  │
│     → Đảm bảo spec khớp với implementation                     │
│                                                                 │
│  4. COMMIT & PUSH                                               │
│     → Sau MỖI thay đổi (spec hoặc code)                       │
│     → Commit với message rõ ràng                               │
│     → Push lên remote repository                               │
│                                                                 │
│  ⚠️ QUY TẮC QUAN TRỌNG:                                         │
│     → SPEC là source of truth để build demo                    │
│     → Code edits: AUTOMATIC (không cần hỏi user)               │
│     → Spec edits: PHẢI HỎI USER trước khi edit                 │
│     → So sánh code vs spec LIÊN TỤC trong quá trình coding    │
│     → Report spec issues ngay khi phát hiện                    │
└─────────────────────────────────────────────────────────────────┘
```

### Module đang phát triển

| Priority | Module | Status | Notes |
|----------|--------|--------|-------|
| 1 | **WS** (Task from HQ) | 🔄 In Progress | Đang phát triển đầu tiên |
| 2 | DWS | ⏳ Pending | - |
| 3 | Manual | ⏳ Pending | - |
| 4 | FAQ | ⏳ Pending | - |
| 5 | Check Quality | ⏳ Pending | - |
| 6 | Training | ⏳ Pending | - |

### Tech Stack Reference (Chỉ dùng cho Demo Building)

```
┌─────────────────────────────────────────────────────────────────┐
│  ⚠️ QUAN TRỌNG: PHÂN BIỆT DEMO vs SPEC                          │
│                                                                 │
│  🔧 TECH STACK (Chỉ cho Demo/Prototype)                         │
│     → Dùng để build demo trên local                            │
│     → Giúp hiểu rõ app trước khi viết spec production           │
│     → Demo KHÔNG phải là 100% spec                              │
│     → Recommendations từ Dev Team được apply cho demo           │
│                                                                 │
│  📝 SPEC (Tech-Agnostic cho Production)                         │
│     → KHÔNG đề cập demo implementation                          │
│     → KHÔNG đề cập tech stack cụ thể                            │
│     → KHÔNG đề cập tình trạng phát triển của demo               │
│     → KHÔNG đề cập framework/library names                      │
│                                                                 │
│  ✅ Spec mô tả: WHAT (business requirements)                    │
│  ❌ Spec KHÔNG mô tả: HOW (technical implementation)            │
└─────────────────────────────────────────────────────────────────┘
```

**Production Tech Stack (Reference Only - Reviewed by Dev Team)**:

| Layer | Technology | Reason (Dev Team Review) |
|-------|------------|--------------------------|
| **Backend Framework** | Laravel 10.x + PHP 8.3 | Core framework, modern PHP |
| **Frontend Framework** | Next.js 14 + React 18 | SSR/SSG, App Router |
| **Database** | MySQL 8.4 | Relational data, ACID compliance |
| **Authentication** | ✅ **Laravel Passport** (OAuth2) | Recommended by dev team - better scalability than Sanctum |
| **Query Methods** | ✅ **Query Builder + Eloquent ORM** | Use both: Query Builder for performance, Eloquent for relationships |
| **Database Migrations** | ✅ **Laravel Migrations** | Version control for database schema |
| **Validation** | ✅ **Form Request Classes** | Separate validation logic from Controllers |
| **Background Jobs** | ✅ **Laravel Horizon** | Recommended for peak 150-200 jobs/hour, real-time monitoring needed |
| **Caching** | ✅ **Redis + Response Caching** | Redis for data, Spatie Response Caching for static pages |
| **Testing** | ✅ **Pest PHP** | Clean syntax, fast execution |
| **Code Quality** | ✅ **Laravel Pint** | Built-in Laravel 10+, zero-config |
| **Monitoring** | ✅ **Laravel Pulse** | Lightweight APM, production-safe |
| **API Documentation** | ❌ **Manual (NO auto-generate)** | Spec → Code workflow, not Code → Docs |
| **File Storage** | ✅ **Laravel Filesystem** | Local/S3/GCS abstraction |
| **Real-time** | Laravel Reverb (WebSocket) | Live updates, chat, notifications |
| **Hosting** | PA Vietnam (cPanel/DirectAdmin) | Production server |

**Key Decisions from Dev Team Review**:

1. **Passport over Sanctum**: Mở rộng tốt hơn, hỗ trợ OAuth2 đầy đủ
2. **Hybrid Query Approach**: Query Builder cho complex queries, Eloquent cho CRUD
3. **Form Requests**: Tách validation khỏi Controller để code gọn, tái sử dụng
4. **No Auto API Docs**: Scramble/Swagger đi ngược workflow (code → docs), chúng ta cần (spec → code)
5. **Dual Caching**: Redis cho data caching, Response Caching cho static pages
6. **Horizon over Queue**: Peak 150-200 jobs/hour, cần real-time monitoring dashboard, scalable cho growth (+300% in 2yr)

**Lưu ý quan trọng**:
- Demo build theo recommendations của dev team
- Spec vẫn viết **tech-agnostic** cho production
- Dev team production có thể dùng bất kỳ tech nào implement spec
- Spec chỉ mô tả **business requirements**, không lock vào framework
- **KHÔNG bao giờ** generate API docs tự động từ code (đi ngược workflow)

---

## ⚠️ WORKFLOW LÀM VIỆC - CLAUDE PHẢI NHỚ

```
┌─────────────────────────────────────────────────────────────────┐
│  FLOW LÀM VIỆC HIỆN TẠI:                                        │
│                                                                 │
│  1. BUILD & TEST TRÊN LOCAL                                     │
│     → Phát triển và test tất cả trên local trước                │
│                                                                 │
│  2. KHI HOÀN THÀNH SCREEN/FEATURE → NHẮC USER DEPLOY            │
│     → Frontend: Tự động deploy khi commit & push (Vercel)       │
│     → Backend: Upload thủ công qua FileZilla                    │
│     → Database: Import file MySQL qua phpMyAdmin (DirectAdmin)  │
│                                                                 │
│  ⚠️ CLAUDE PHẢI NHẮC USER KHI:                                  │
│     - Hoàn thành 1 screen/feature                               │
│     - Định kỳ sau nhiều thay đổi                                │
│     - Có thay đổi backend code → nhắc deploy BE                 │
│     - Có thay đổi DB schema → nhắc import SQL                   │
└─────────────────────────────────────────────────────────────────┘
```

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
| **Backend** | `/backend/laravel` | API endpoints, Business logic, Validation |
| **API Entry** | `/backend/api` | Public endpoint (index.php) |
| **Database** | `/database` | Data storage, Schema, Indexes |

**Backend Structure (match server):**
```
backend/
├── api/                    # Upload to: public_html/api/
│   ├── .htaccess
│   └── index.php          # Entry point, trỏ đến ../laravel/
│
└── laravel/               # Upload to: public_html/laravel/
    ├── app/
    ├── bootstrap/
    ├── config/
    ├── database/
    ├── resources/
    ├── routes/
    ├── storage/
    ├── tests/
    ├── vendor/
    ├── .env
    ├── artisan
    └── composer.json
```

### 4. Spec Files Location

Specs được tổ chức theo module:

```
docs/specs/
├── _shared/                    # Shared across all modules
│   ├── authentication-basic.md
│   ├── authentication-detail.md
│   ├── app-general-basic.md
│   └── app-general-detail.md
│
├── ws/                         # WS Module (Task from HQ)
│   ├── task-list-basic.md
│   ├── task-list-detail.md
│   ├── task-detail-basic.md
│   ├── task-detail-detail.md
│   ├── task-library-basic.md
│   ├── task-library-detail.md
│   ├── add-task-basic.md
│   ├── add-task-detail.md
│   ├── todo-task-basic.md
│   ├── todo-task-detail.md
│   ├── user-information-basic.md
│   ├── user-information-detail.md
│   ├── store-information-basic.md
│   ├── store-information-detail.md
│   ├── message-basic.md
│   ├── message-detail.md
│   ├── report-basic.md
│   └── report-detail.md
│
├── dws/                        # DWS Module
├── faq/                        # FAQ Module
├── manual/                     # Manual Module
├── check-quality/              # Check Quality Module
└── training/                   # Training Module
```

> **Note**: Mỗi screen có 2 files: `-basic.md` (tổng quan) và `-detail.md` (chi tiết)

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

### 4.1 Quy tắc viết Spec File

#### Nguyên tắc cơ bản

```
┌─────────────────────────────────────────────────────────────────┐
│  NGUYÊN TẮC VÀNG CỦA SPEC WRITING:                              │
│                                                                 │
│  "SPEC MÔ TẢ CÁI GÌ CẦN CÓ, KHÔNG PHẢI LÀM THẾ NÀO"            │
│                                                                 │
│  ✅ SPEC LÀ YÊU CẦU SẢN PHẨM (Product Requirements)             │
│     → Mô tả WHAT: chức năng cần có, kết quả mong đợi            │
│     → Mô tả WHY: business logic, lý do cần feature này          │
│     → Tech-agnostic: không phụ thuộc framework/ngôn ngữ         │
│                                                                 │
│  ❌ SPEC KHÔNG PHẢI TÀI LIỆU KỸ THUẬT (Technical Docs)          │
│     → Không mô tả HOW: không viết code implementation           │
│     → Không đề cập framework: Laravel, Node.js, Django...       │
│     → Không có SQL queries, không có package/library names      │
│                                                                 │
│  📌 PHÂN ĐỊNH TRÁCH NHIỆM:                                      │
│     → Product Owner (bạn): Viết WHAT & WHY trong spec           │
│     → Dev Team: Quyết định HOW & implement                      │
└─────────────────────────────────────────────────────────────────┘
```

```
┌─────────────────────────────────────────────────────────────────┐
│  SPEC VIẾT CHO PRODUCTION, KHÔNG PHẢI CHO DEMO                  │
│                                                                 │
│  → Spec mô tả feature đầy đủ như sẽ triển khai trên production  │
│  → Build trên local đầy đủ tính năng                            │
│  → Deploy demo có thể thiếu một số feature do hạn chế server    │
│  → Sử dụng badge [DEMO] hoặc [PROD-ONLY] để phân biệt           │
└─────────────────────────────────────────────────────────────────┘
```

#### Checklist khi viết Spec (Tech-Agnostic)

| ❌ Loại bỏ | ✅ Thay bằng |
|------------|-------------|
| Framework names (Laravel, Django) | "Backend must..." / "System must..." |
| SQL queries (SELECT, INSERT) | "Data Persistence Requirements" |
| Code examples (PHP, Python, JS) | Business logic descriptions |
| Package names (composer, npm) | "Integration Requirements" |
| Config files (.env, config.php) | "Configuration Requirements" |
| Implementation details | Functional requirements |

**Ví dụ:**

| ❌ Tech-specific (SAI) | ✅ Tech-agnostic (ĐÚNG) |
|-----------------------|-------------------------|
| "Use Laravel Sanctum for authentication" | "System must authenticate users with Bearer tokens" |
| "Hash password with BCrypt via Hash::make()" | "Password must be hashed (one-way) before storage" |
| "Install google/apiclient package" | "Backend must integrate with Google token verification API" |
| `INSERT INTO personal_access_tokens...` | "System must store token with expiration timestamp" |
| "Use Laravel throttle middleware" | "System must limit login attempts to 60/minute" |

#### Cấu trúc Spec Files (Tách 2 file riêng)

Mỗi screen có **2 file spec riêng biệt** để dễ báo cáo:

```
docs/specs/{module}/
├── {screen}-basic.md      # Basic Spec - Tổng quan
└── {screen}-detail.md     # Detail Spec - Chi tiết
```

**Ví dụ cho Task List:**
```
docs/specs/ws/
├── task-list-basic.md     # Basic Spec
└── task-list-detail.md    # Detail Spec
```

---

**File 1: `{screen}-basic.md` - Basic Specification**

Basic Spec chia thành **4 mục chính** theo format sau:

```markdown
# [SCREEN NAME] SPECIFICATION ([SCREEN_CODE])

> **Module**: [Module Name]
> **Screen ID**: [SCREEN_CODE]
> **Route**: `/path/to/screen`
> **Last Updated**: YYYY-MM-DD

---

## 1. GENERAL DESCRIPTION

### 1.1 Screen Information

| No | Attribute | Value |
|----|-----------|-------|
| 1 | Screen Name | [Screen Name] |
| 2 | Screen Code | [SCREEN_CODE] |
| 3 | Target Users | [User roles] |

**Purpose**: [Brief description of screen purpose]

### 1.2 Access Flow

| No | Step | Description |
|----|------|-------------|
| 1 | Step 1 | [Navigation step 1] |
| 2 | Step 2 | [Navigation step 2] |

### 1.3 Screen Layout (ASCII Diagram)

```
┌─────────────────────────────────────────────────────────────────┐
│ [Screen Title]                                    [Status]       │
├─────────────────────────────────────────────────────────────────┤
│ [Controls and Filters]                                          │
├─────────────────────────────────────────────────────────────────┤
│ [Data Grid/Content Area]                                        │
├─────────────────────────────────────────────────────────────────┤
│ [Footer/Pagination]                                             │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. FUNCTIONAL SPECIFICATION

Interface divided into [X] areas: [Area 1], [Area 2], [Area 3]

### A. [Area 1 Name] (e.g., Header - Filter & Action)

#### A.1. [Component 1 Name]

| No | Attribute/Mode | Description | Interaction/Value |
|----|----------------|-------------|-------------------|
| 1 | [Mode 1] | [Description] | [Interaction] |
| 2 | [Mode 2] | [Description] | [Interaction] |

#### A.2. [Component 2 Name]

| No | Attribute | Value |
|----|-----------|-------|
| 1 | Type | [Type] |
| 2 | Logic | [Logic] |
| 3 | Mechanism | [Mechanism] |

#### A.3. [Component 3 Name]

| No | Component | Type | Description |
|----|-----------|------|-------------|
| 1 | [Sub-component 1] | [Type] | [Description] |
| 2 | [Sub-component 2] | [Type] | [Description] |

### B. [Area 2 Name] (e.g., Body - Data Grid)

Brief description of this area.

| No | Column/Component | Description | Features |
|----|------------------|-------------|----------|
| 1 | [Column 1] | [Description] | [Features] |
| 2 | [Column 2] | [Description] | [Features] |

### C. [Area 3 Name] (e.g., Footer - Pagination)

| No | Component | Description |
|----|-----------|-------------|
| 1 | [Component 1] | [Description] |
| 2 | [Component 2] | [Description] |

---

## 3. API INTEGRATION

| No | Action | Method | Endpoint | Description | Trigger |
|----|--------|--------|----------|-------------|---------|
| 1 | [Action 1] | GET/POST | /api/v1/[endpoint] | [Description] | [When this API is called] |
| 2 | [Action 2] | GET/POST | /api/v1/[endpoint] | [Description] | [When this API is called] |

---

## 4. TEST SCENARIOS

### A. UI/UX Testing

| No | Test Case | Scenario | Expected Result |
|----|-----------|----------|-----------------|
| 1 | [Test name] | [Scenario] | [Expected result] |
| 2 | [Test name] | [Scenario] | [Expected result] |

### B. Functional Testing

| No | Test Case | Scenario | Expected Result |
|----|-----------|----------|-----------------|
| 1 | [Test name] | [Scenario] | [Expected result] |
| 2 | [Test name] | [Scenario] | [Expected result] |

---

## Related Documents

| Document | Path |
|----------|------|
| Detail Spec | [link-to-detail.md] |
| Related Screen 1 | [link-to-related-1.md] |
```

**Lưu ý quan trọng:**
- **4 mục chính**: General Description, Functional Specification, API Integration, Test Scenarios
- Mỗi mục có thể có nhiều sub-sections tùy theo độ phức tạp của screen
- **API Integration**: Chỉ liệt kê table với columns: No, Action, Method, Endpoint, Description, Trigger
- **CHI TIẾT** (parameters, business logic, request/response) → Thuộc về **Detail Spec**
- KHÔNG bao gồm Implementation Status (đó là tracking cá nhân, không phải spec cho dev team)

---

**File 2: `{screen}-detail.md` - Detail Specification**

```markdown
# [Screen Name] - Detail Specification

## 1. Component Details
### 1.1 [Component 1]
### 1.2 [Component 2]
- Chi tiết từng component: states, styles, behaviors

## 2. API Endpoints - Detail
- OpenAPI format với correlation check, business logic
- Request/Response examples
- Error codes

## 3. Data Types
- TypeScript interfaces
- Enums, constants

## 4. Validation Rules
- Field validation, business rules

## 5. Files Reference
### 5.1 Frontend Files
### 5.2 Backend Files

## 6. Pending Features
- Table: Feature | Priority | Status

## 7. Changelog
- Table: Date | Changes
```

#### Badge phân biệt Demo vs Production

| Badge | Ý nghĩa | Sử dụng khi |
|-------|---------|-------------|
| `[DEMO]` | Feature hoạt động trên bản demo | Feature đơn giản, không cần server đặc biệt |
| `[PROD-ONLY]` | Feature chỉ triển khai trên production | Cần email server, file storage, WebSocket, background jobs |
| `[LOCAL-DEV]` | Feature có thể test trên local | Build đầy đủ trên local nhưng không deploy lên demo |

**Ví dụ sử dụng trong Implementation Status:**

```markdown
## 7. Implementation Status

| Feature | Backend | Frontend | Deploy | Notes |
|---------|---------|----------|--------|-------|
| Task List Table | ✅ Done | ✅ Done | [DEMO] | Hoạt động đầy đủ |
| Real-time Updates | ✅ Done | ✅ Done | [PROD-ONLY] | Cần WebSocket server |
| Email Notifications | ✅ Done | ✅ Done | [PROD-ONLY] | Cần SMTP server |
| File Upload | ✅ Done | ✅ Done | [LOCAL-DEV] | Demo server không có storage |
| Export Excel | ⏳ Pending | ⏳ Pending | [DEMO] | - |
```

#### Các feature thường là [PROD-ONLY]

| Feature Type | Lý do không deploy demo |
|--------------|-------------------------|
| **Email** | Forgot password, notifications - demo không có SMTP |
| **WebSocket** | Real-time updates - demo không chạy Reverb server |
| **File Upload** | Storage hạn chế trên demo server |
| **Background Jobs** | Demo không chạy queue worker |
| **PDF/Excel Export** | Có thể nặng, demo server hạn chế resources |
| **Push Notifications** | Cần Firebase/APNS setup |

#### API Spec Format (OpenAPI style)

```yaml
get/post:
  tags:
    - [Module]-[Feature]
  summary: "API Name"
  description: |
    # Correlation Check
      - [Validation rules]

    # Business Logic
      ## 1. [Step 1]
        ### [Sub-step details]
      ## 2. [Step 2]

  operationId: functionName
  parameters:
    - name: param_name
      in: query/path/header
      required: true/false
      schema:
        type: string/integer/boolean

  requestBody: (for POST/PUT)
    required: true
    content:
      application/json:
        schema:
          $ref: "#/components/schemas/RequestSchema"

  responses:
    200:
      description: OK
      content:
        application/json:
          example: {...}
    400/401/404/500:
      description: Error description
```

#### Changelog Format

```markdown
## 14. Changelog

| Date | Changes |
|------|---------|
| YYYY-MM-DD | Brief description of changes |
```

**Lưu ý quan trọng:**
- Mỗi khi thay đổi code → **BẮT BUỘC** update Changelog
- Ghi rõ ngày (YYYY-MM-DD format)
- Mô tả ngắn gọn những gì thay đổi

### 5. Laragon Paths (Windows)

```bash
# PHP
PHP="D:\devtool\laragon\bin\php\php-8.3.28-Win32-vs16-x64\php.exe"

# MySQL
MYSQL="D:\devtool\laragon\bin\mysql\mysql-8.4.3-winx64\bin\mysql.exe"
MYSQLD="D:\devtool\laragon\bin\mysql\mysql-8.4.3-winx64\bin\mysqld.exe"
```

### 6. Database

**⚠️ QUAN TRỌNG**: Local và Production đều dùng **MySQL** để đảm bảo tương thích.

- **Database engine**: MySQL 8.4
- **Database name**: `aoisora`
- **Schema file**: `database/schema_mysql.sql`
- **Seed file**: `deploy/seed_data_mysql.sql`
- **Username**: `root` (local) / `auraorie_app` (production)
- **Password**: `` (empty, local) / `***` (production)

**Khởi động MySQL:**
```bash
# Qua Laragon UI: Click "Start All"
# Hoặc command line (nếu đã config):
mysqld --defaults-file="D:\devtool\laragon\data\mysql\my.ini"
```

**Import Schema:**
```bash
cd "D:\Project\Aura Web"
"D:\devtool\laragon\bin\mysql\mysql-8.4.3-winx64\bin\mysql.exe" -uroot aoisora < database/schema_mysql.sql
"D:\devtool\laragon\bin\mysql\mysql-8.4.3-winx64\bin\mysql.exe" -uroot aoisora < deploy/seed_data_mysql.sql
```

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
# 1. Start MySQL (qua Laragon UI hoặc command)
# Laragon UI: Click "Start All" hoặc right-click MySQL → Start

# 2. Start Backend (PHP built-in server)
cd backend/api && "D:\devtool\laragon\bin\php\php-8.3.28-Win32-vs16-x64\php.exe" -S localhost:8000

# 3. Start Frontend (Next.js)
cd frontend && npm run dev

# 4. Start Reverb WebSocket Server (Optional - for real-time updates)
cd backend/laravel && "D:\devtool\laragon\bin\php\php-8.3.28-Win32-vs16-x64\php.exe" artisan reverb:start --port=8080
```

> **Notes**:
> - Backend chạy từ `backend/api/` (entry point) chứ không phải `backend/laravel/`
> - Reverb là optional. Nếu không chạy, app vẫn hoạt động bình thường nhưng không có real-time updates (Task List sẽ hiển thị "Offline").

Chi tiết: `docs/SESSION_START_CHECKLIST.md`

### 11. Production Deployment (PA Vietnam Hosting)

#### URLs Production

| Component | URL |
|-----------|-----|
| Frontend | `https://aoisora.auraorientalis.vn` |
| Backend API | `https://auraorientalis.vn/api/api/v1` |
| phpMyAdmin | DirectAdmin → MySQL → phpMyAdmin |

#### Khi nào cần Upload Backend (FileZilla)

**Cấu trúc local → server mapping:**
```
backend/api/      →  public_html/api/
backend/laravel/  →  public_html/laravel/
```

| Thay đổi | Local Path | Server Path |
|----------|------------|-------------|
| **Controller/Service/Model** | `backend/laravel/app/` | `public_html/laravel/app/` |
| **Routes** | `backend/laravel/routes/` | `public_html/laravel/routes/` |
| **Config** (cors, auth...) | `backend/laravel/config/` | `public_html/laravel/config/` |
| **Resources/Views** | `backend/laravel/resources/` | `public_html/laravel/resources/` |
| **Environment** | `backend/laravel/.env` | `public_html/laravel/.env` |
| **API Entry** | `backend/api/` | `public_html/api/` |
| **Thêm package mới** | `backend/laravel/vendor/` | `public_html/laravel/vendor/` |

**KHÔNG cần upload lại:**
- `vendor/` - Chỉ khi thêm package mới (composer require)
- `storage/` - Chứa logs, cache, sessions
- `.env` - Chỉ khi thay đổi config

#### Khi nào cần Import Database (phpMyAdmin)

| Tình huống | File import | Ghi chú |
|------------|-------------|---------|
| **Thêm/sửa table/column** | Tạo file migration SQL mới | Chỉ chạy migration, không reset data |
| **Reset toàn bộ DB** | `deploy/schema_mysql.sql` | ⚠️ XÓA TOÀN BỘ DATA |
| **Reset + seed data** | `schema_mysql.sql` → `seed_data_mysql.sql` | ⚠️ XÓA TOÀN BỘ DATA |
| **Fix password user** | `deploy/update_password.sql` | Password sẽ là `password` |
| **Thêm data mẫu** | `deploy/seed_data_mysql.sql` | Chỉ khi DB trống |

#### Quy trình Deploy sau khi code

```
┌─────────────────────────────────────────────────────────────────┐
│  CHECKLIST DEPLOY SAU KHI CODE:                                 │
│                                                                 │
│  ☐ 1. Test local hoạt động đúng                                 │
│                                                                 │
│  ☐ 2. Commit & Push (Frontend auto-deploy qua Vercel)           │
│                                                                 │
│  ☐ 3. Backend thay đổi? → Upload qua FileZilla                  │
│       - backend/laravel/ → public_html/laravel/                 │
│       - backend/api/ → public_html/api/ (nếu có thay đổi)       │
│                                                                 │
│  ☐ 4. Database schema thay đổi? → Import qua phpMyAdmin         │
│       - Tạo file migration SQL riêng (không dùng schema_mysql)  │
│                                                                 │
│  ☐ 5. Test trên production: https://aoisora.auraorientalis.vn   │
└─────────────────────────────────────────────────────────────────┘
```

#### Test Account Production

- **Username**: `admin`
- **Password**: `password`
- **Role**: ADMIN

Chi tiết: `docs/06-deployment/DEPLOY-PA-VIETNAM-HOSTING.md`

---

## Tham khảo chi tiết

- Session Start: `docs/SESSION_START_CHECKLIST.md`
- Deployment: `docs/06-deployment/DEPLOY-PA-VIETNAM-HOSTING.md`
