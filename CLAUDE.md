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
│     → Spec edits:                                               │
│       • Fix inconsistency/errors: AUTOMATIC (không cần hỏi)    │
│       • Clarify ambiguity: AUTOMATIC (không cần hỏi)           │
│       • Change requirements: PHẢI HỎI USER                      │
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
│  2. COMMIT & PUSH LÊN GITHUB                                    │
│     → Code được đẩy lên GitHub                                  │
│     → ⚠️ FE KHÔNG tự động deploy (đã tắt auto-deploy Vercel)   │
│                                                                 │
│  3. KHI HOÀN THÀNH SCREEN/FEATURE → DEPLOY THỦ CÔNG             │
│     → Database: Import SQL qua phpMyAdmin (nếu có thay đổi)     │
│     → Backend: Upload thủ công qua FileZilla                    │
│     → Frontend: Deploy thủ công qua Vercel Dashboard            │
│       (Deployments → "..." → Redeploy)                          │
│                                                                 │
│  ⚠️ CLAUDE PHẢI NHẮC USER KHI:                                  │
│     - Hoàn thành 1 screen/feature                               │
│     - Định kỳ sau nhiều thay đổi                                │
│     - Có thay đổi backend code → nhắc deploy BE                 │
│     - Có thay đổi DB schema → nhắc import SQL                   │
│     - Có thay đổi frontend → nhắc Redeploy trên Vercel          │
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
├── basic/                      # 📋 Basic Specs (Tổng quan screens)
│   ├── authentication-basic.md         (shared - no prefix)
│   ├── app-general-basic.md            (shared - no prefix)
│   ├── ws-task-list-basic.md
│   ├── ws-task-detail-basic.md
│   ├── ws-task-library-basic.md
│   ├── ws-add-task-basic.md
│   ├── ws-todo-task-basic.md
│   ├── ws-user-information-basic.md
│   ├── ws-store-information-basic.md
│   ├── ws-message-basic.md
│   └── ws-report-basic.md
│
├── detail/                     # 📝 Detail Specs (Chi tiết screens)
│   ├── authentication-detail.md
│   ├── app-general-detail.md
│   ├── ws-task-list-detail.md
│   ├── ws-task-detail-detail.md
│   ├── ws-task-library-detail.md
│   ├── ws-add-task-detail.md
│   ├── ws-todo-task-detail.md
│   ├── ws-user-information-detail.md
│   ├── ws-store-information-detail.md
│   ├── ws-message-detail.md
│   └── ws-report-detail.md
│
└── api/                        # 🔌 API Specs (Tech-agnostic contracts)
    ├── auth-login-api.md
    ├── auth-login-google-api.md
    ├── auth-logout-api.md
    ├── auth-refresh-api.md
    ├── auth-me-api.md
    ├── auth-forgot-password-api.md
    ├── auth-verify-code-api.md
    ├── auth-reset-password-api.md
    ├── auth-resend-code-api.md
    ├── ws-get-departments-api.md
    └── ws-get-task-list-api.md
```

> **Note**:
> - **3 thư mục FLAT** (không có thư mục con)
> - **Module prefix**: `{module}-` cho module-specific files (ws-, dws-, faq-...)
> - **No prefix**: Shared files (authentication, app-general)
> - Mỗi screen: `{module}-{screen}-basic.md` + `{module}-{screen}-detail.md`
> - Mỗi API: `{module}-{action}-api.md`

**Quick Reference:**

| Type | Path | Naming Convention | Example |
|------|------|-------------------|---------|
| **Basic Specs** | `docs/specs/basic/` | `{module}-{screen}-basic.md` | `ws-task-list-basic.md` |
| **Detail Specs** | `docs/specs/detail/` | `{module}-{screen}-detail.md` | `ws-task-list-detail.md` |
| **API Specs** | `docs/specs/api/` | `{module}-{action}-api.md` | `ws-get-departments-api.md` |
| **Shared Specs** | Same directories | No prefix | `authentication-basic.md` |

**Module Prefixes:**
- `ws-` = WS Module (Task from HQ)
- `dws-` = DWS Module (Dispatch Work Schedule)
- `faq-` = FAQ Module
- `manual-` = Manual Module
- `auth-` = Authentication APIs
- (no prefix) = Shared across all modules

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

#### Rule of Thumb (Nguyên tắc vàng)

```
┌─────────────────────────────────────────────────────────────────┐
│  KHI VIẾT SPEC:                                                 │
│                                                                 │
│  1. ĐỌC Tech Stack (CLAUDE.md) → Biết sẽ dùng công nghệ gì     │
│  2. GHI RÕ trong Spec: "Implementation Note: Using Laravel..."  │
│  3. VẪN PHẢI MÔ TẢ CHI TIẾT:                                    │
│     - Business logic (what to do)                               │
│     - API contract (request/response format)                    │
│     - Validation rules (field requirements)                     │
│     - Error handling (error codes, messages)                    │
│     - UI/UX behavior (screen interactions)                      │
│                                                                 │
│  ⚠️ KHÔNG BAO GIỜ nghĩ rằng:                                    │
│     "Đã chọn OAuth2/Laravel rồi, dev team tự hiểu"             │
│                                                                 │
│  ✅ LUÔN LUÔN nghĩ rằng:                                        │
│     "Tech stack là reference, Spec là source of truth"          │
└─────────────────────────────────────────────────────────────────┘
```

#### Response Fields - Universal Principle

**Implementation Note (Áp dụng cho TẤT CẢ API specs):**

Backend có thể tổng hợp dữ liệu từ nhiều bảng (ví dụ: `users`, `staffs`, `roles`, `office_titles`) để xây dựng response object. API contract (cấu trúc Response Fields) vẫn giữ ổn định bất kể cấu trúc database bên dưới thay đổi như thế nào.

_Backend may aggregate data from multiple tables (e.g., users, staffs, roles, office_titles) to construct response objects. The API contract remains stable regardless of underlying database structure._

**Nguyên tắc:**
- Spec mô tả **Response Fields** (WHAT) → Tech-agnostic
- Backend quyết định **Database Query** (HOW) → Implementation detail
- Database structure thay đổi → Backend sửa query logic
- API contract KHÔNG đổi → Frontend KHÔNG cần sửa code

**Ví dụ:**

| Current Schema | Dev Team Design | Response (Unchanged) |
|----------------|-----------------|----------------------|
| 1 table: `staff` | 4 tables: `users` + `staffs` + `roles` + `office_titles` | Same JSON structure |
| `SELECT * FROM staff` | `SELECT * FROM users u JOIN staffs s ...` | `{"id": 123, "role": "ADMIN"}` |

**Kết luận:**

Khi viết API spec, **chỉ cần mô tả Response Fields** (business requirements). KHÔNG cần quan tâm backend sẽ query từ bao nhiêu tables. Dev Team production sẽ tự quyết định database structure và query logic, miễn sao response match với spec.

#### Spec Focus - Current Requirements Only

```
┌─────────────────────────────────────────────────────────────────┐
│  ⚠️ NGUYÊN TẮC QUAN TRỌNG:                                      │
│                                                                 │
│  ✅ Spec chỉ mô tả CURRENT REQUIREMENTS                         │
│     → Những gì CẦN CÓ NGAY BÂY GIỜ                              │
│     → Những gì đang được implement/build                        │
│                                                                 │
│  ❌ Spec KHÔNG BAO GIỜ có "Future Enhancements" section         │
│     → Không liệt kê tính năng "có thể có trong tương lai"      │
│     → Không mô tả features "sẽ làm sau"                         │
│     → Không có "Coming Soon" hay "To Be Implemented"            │
│                                                                 │
│  📌 LÝ DO:                                                       │
│     → Spec là source of truth cho implementation                │
│     → Future plans thay đổi liên tục → gây confusion            │
│     → Dev team cần biết rõ: build GÌ, KHÔNG build gì           │
│                                                                 │
│  💡 NẾU CẦN TRACK FUTURE IDEAS:                                 │
│     → Tạo file riêng: docs/future-plans.md                      │
│     → Hoặc dùng GitHub Issues/Project Board                     │
│     → KHÔNG ghi vào spec files                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Ví dụ SAI:**
```markdown
## 10. Future Enhancements
| Feature | Priority | Description |
| Two-Factor Auth | High | Will add OTP later |
| Biometric Login | Low | Future mobile feature |
```

**Ví dụ ĐÚNG:**
- Nếu 2FA đã được plan → Viết full spec ngay (API endpoints, flow, requirements)
- Nếu 2FA chưa được plan → KHÔNG đề cập trong spec

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

**⚠️ QUAN TRỌNG**: Local và Production dùng **CÙNG TÊN DATABASE** để tránh lỗi không đồng bộ.

```
┌─────────────────────────────────────────────────────────────────┐
│  ⚠️ QUY TẮC DATABASE - BẮT BUỘC                                 │
│                                                                 │
│  1. CHỈ SỬ DỤNG 1 FILE SQL DUY NHẤT: deploy/full_reset.sql     │
│     → File này chứa: Schema + Seed data + Migration            │
│     → Dùng cho CẢ local và production (phpMyAdmin)             │
│     → KHÔNG tạo file SQL riêng lẻ khác                         │
│                                                                 │
│  2. TÊN DATABASE GIỐNG NHAU:                                    │
│     → Local: auraorie68aa_aoisora                              │
│     → Production: auraorie68aa_aoisora                         │
│     → Đảm bảo file SQL chạy được ở cả 2 môi trường             │
│                                                                 │
│  3. KHI CẦN THAY ĐỔI DATABASE:                                  │
│     → Sửa trực tiếp trong deploy/full_reset.sql                │
│     → Import lại file này lên cả local và server               │
│     → KHÔNG tạo migration file riêng                           │
│                                                                 │
│  4. DEFAULT PASSWORD: password                                  │
│     → Tất cả users có password = "password"                    │
│     → Hash: $2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/...    │
│                                                                 │
│  5. VIETNAMESE ENCODING (UTF-8):                                │
│     → File SQL chứa tiếng Việt PHẢI import với UTF-8           │
│     → Dùng flag: --default-character-set=utf8mb4               │
│     → Nếu không: ký tự tiếng Việt sẽ bị lỗi font (garbled)     │
└─────────────────────────────────────────────────────────────────┘
```

| Setting | Value |
|---------|-------|
| **Database engine** | MySQL 8.4 |
| **Database name** | `auraorie68aa_aoisora` (cả local và production) |
| **Single SQL file** | `deploy/full_reset.sql` |
| **Username** | `root` (local) / `auraorie_app` (production) |
| **Password** | `` (empty, local) / `***` (production) |
| **Default user password** | `password` |

**Khởi động MySQL:**
```bash
# Qua Laragon UI: Click "Start All"
# Hoặc command line (nếu đã config):
mysqld --defaults-file="D:\devtool\laragon\data\mysql\my.ini"
```

**Import/Reset Database (Local):**

> ⚠️ **QUAN TRỌNG - Vietnamese Encoding**: File SQL chứa tiếng Việt **BẮT BUỘC** phải import với flag `--default-character-set=utf8mb4`. Nếu không, các ký tự tiếng Việt sẽ bị lỗi font (garbled characters).

```bash
cd "D:\Project\Aura Web"
# Import với UTF-8 encoding cho tiếng Việt
"D:\devtool\laragon\bin\mysql\mysql-8.4.3-winx64\bin\mysql.exe" -uroot --default-character-set=utf8mb4 auraorie68aa_aoisora < deploy/full_reset.sql
```

**Import/Reset Database (Production - phpMyAdmin):**
1. Vào DirectAdmin → MySQL → phpMyAdmin
2. Chọn database `auraorie68aa_aoisora`
3. Import file `deploy/full_reset.sql`

**Export Database từ Local (Tạo file SQL chuẩn để deploy):**

```
┌─────────────────────────────────────────────────────────────────┐
│  ⚠️ QUY TRÌNH EXPORT DATABASE - BẮT BUỘC TRƯỚC KHI DEPLOY       │
│                                                                 │
│  Khi cần deploy database lên server, PHẢI export từ local:     │
│                                                                 │
│  1. ĐẢM BẢO LOCAL DATABASE ĐÃ CHUẨN                             │
│     → Test đầy đủ trên local trước                              │
│     → Kiểm tra data, schema, views đã đúng                      │
│                                                                 │
│  2. EXPORT BẰNG MYSQLDUMP                                       │
│     → Chạy lệnh mysqldump để export toàn bộ database            │
│     → Output ra file deploy/full_reset.sql                      │
│                                                                 │
│  3. VERIFY FILE SQL                                             │
│     → Kiểm tra file đã export đúng chưa                         │
│     → So sánh số lượng tables, views, data                      │
│                                                                 │
│  4. COMMIT & PUSH                                               │
│     → Commit file deploy/full_reset.sql                         │
│     → Push lên GitHub trước khi deploy                          │
└─────────────────────────────────────────────────────────────────┘
```

```bash
# Export toàn bộ database từ local ra file SQL
"D:\devtool\laragon\bin\mysql\mysql-8.4.3-winx64\bin\mysqldump.exe" -uroot --databases auraorie68aa_aoisora --add-drop-database --add-drop-table --routines --triggers --events > "d:\Project\auraProject\deploy\full_reset.sql"

# Verify số lượng records (optional)
"D:\devtool\laragon\bin\mysql\mysql-8.4.3-winx64\bin\mysql.exe" -uroot auraorie68aa_aoisora -e "SELECT COUNT(*) as stores FROM stores; SELECT COUNT(*) as staff FROM staff; SELECT COUNT(*) as tasks FROM tasks;"
```

**Lưu ý quan trọng:**
- **KHÔNG** tự tạo INSERT statements thủ công
- **PHẢI** export từ local database để đảm bảo data consistency
- File `deploy/full_reset.sql` là **nguồn duy nhất** để import lên server
- Sau khi export, test import lại trên local để verify

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

### 9.1 Database Design & Migration Plan (From Dev Team)

**⚠️ QUAN TRỌNG**: Database design từ dev team (file ODS exported to 32 CSV files) khác với schema hiện tại. Migration sẽ thực hiện **dần dần** trong quá trình build demo.

#### Tổng quan Design mới

**Source**: `docs/database/DB_DESIGN_TEAM_REVIEW.md` (tổng hợp từ 32 CSV files)

- **Total tables**: 30 tables (all status "Done")
- **Diagram**: https://dbdiagram.io/d/AEON-DATABASE-69608938d6e030a02488bec2

**Module breakdown:**

| Module | Tables | Ghi chú |
|--------|--------|---------|
| **Shared (Common)** | 15 | regions, zones, areas, stores, staffs, users, departments, divisions, sectors, office_titles, roles, permissions, staff_groups |
| **WS (Task Management)** | 10 | task_library, tasks, task_informations, task_instructions, task_scopes, task_approvals, task_results, task_result_history, task_comments, likes |
| **DWS** | 1 | staff_store_assignment |
| **Message** | 4 | conversations, participants, messages, message_status |

#### Cải tiến chính so với Current Schema

1. **Geographic Hierarchy**: 2 levels → 4 levels (regions → zones → areas → stores)
2. **RBAC System**: roles, permissions, role_user, permission_role
3. **User-Staff Separation**: users (auth) vs staffs (nhân sự data)
4. **Task Normalization**: 1 table lớn → 7 tables liên kết
5. **Messaging System**: conversations, participants, messages, message_status

#### Migration Plan (Thực hiện dần trong Build Demo)

**Phase 1 - Critical (WS Module đang build):**
```
✅ Priority HIGH - Implement ngay khi build WS module:

Geographic Hierarchy:
- [x] regions (existing - keep)
- [ ] zones (NEW - add khi cần filter by zone)
- [ ] areas (NEW - add khi cần filter by area)
- [x] stores (existing - modify to link areas)

User & Auth:
- [x] staff (existing - rename to staffs, restructure)
- [ ] users (NEW - tách auth ra khỏi staffs)
- [ ] roles (NEW - RBAC system)
- [ ] permissions (NEW - RBAC system)
- [ ] role_user (NEW - pivot table)
- [ ] permission_role (NEW - pivot table)

Task System:
- [x] tasks (existing - simplify)
- [ ] task_informations (NEW - task details)
- [ ] task_instructions (NEW - task steps)
- [ ] task_scopes (NEW - task scope)
- [ ] task_approvals (NEW - approval workflow)
- [ ] task_results (NEW - task results)
- [ ] task_result_history (NEW - result history)
- [x] task_comments (existing - keep)
- [ ] likes (NEW - rename from task_likes)
```

**Phase 2 - Enhanced (Sau khi WS hoàn thiện):**
```
⏳ Priority MEDIUM - Add when needed:

Organizational:
- [ ] office_titles (NEW - job titles)
- [ ] divisions (NEW - replace teams)
- [ ] sectors (NEW - business units)
- [ ] staff_groups (NEW - staff grouping)

DWS Module:
- [ ] staff_store_assignment (NEW - DWS module)
```

**Phase 3 - New Features (Future modules):**
```
🔮 Priority LOW - Add cho modules khác:

Messaging (khi cần chat):
- [ ] conversations
- [ ] participants
- [ ] messages
- [ ] message_status

Manual Module (future):
- [ ] manual_* tables (TBD)
```

**Phase 4 - Cleanup (Sau khi migrate xong):**
```
❌ Deprecated tables (remove sau khi migrate):
- teams (→ divisions/sectors)
- check_lists (→ task_instructions)
- shift_codes, shift_templates (→ redesign for DWS)
- daily_templates, daily_schedule_tasks (→ redesign)
- task_workflow_steps (→ task_approvals)
- task_store_results, task_staff_results (→ task_results)
- task_images (→ task_instructions/results)
- notifications (→ redesign)
```

#### Quy tắc Migration trong Build Demo

| Khi | Action | Lưu ý |
|-----|--------|-------|
| **Build screen mới** | Check design xem cần tables nào | Implement theo design, không tự ý sửa |
| **Table đã có** | Modify nếu cần (add columns, FK) | Tạo migration file riêng |
| **Table chưa có** | Create mới theo design | Follow design structure từ CSV |
| **Conflict design vs current** | Ưu tiên design mới | Migrate dần, không breaking current code |
| **Sau mỗi migration** | Update section này | Mark [x] cho tables đã implement |

#### Files tham khảo

| File | Mục đích |
|------|----------|
| `docs/database/DB_DESIGN_TEAM_REVIEW.md` | Full design review (30 tables) |
| `docs/database/design-db-*.csv` | 32 CSV files from dev team |
| `database/schema_mysql.sql` | Current schema (28 tables) |
| `database/migrations/` | Migration files (tạo khi cần) |

#### Data Type Notes

Khi implement tables mới:

- **NVARCHAR → VARCHAR**: Design dùng NVARCHAR (SQL Server), MySQL dùng VARCHAR with utf8mb4
- **BIGINT vs INT**: Design dùng BIGINT cho all IDs, recommend INT cho master data, BIGINT cho high-volume
- **DateTime vs TIMESTAMP**: TIMESTAMP cho audit columns, DATETIME cho business dates

---

**Next review**: Sau khi WS module hoàn thiện, review lại Phase 1 checklist

### 9.2 WS Module Implementation Progress

> **Cập nhật lần cuối**: 2026-01-22

#### Backend API Progress

| Task | Status | Commit | Notes |
|------|--------|--------|-------|
| **1.1 Database Schema** | ✅ Done | - | Tasks, task_store_assignments, task_approval_history, task_library, task_execution_logs |
| **1.2 GET /tasks API** | ✅ Done | - | Status calculation, filtering, pagination with Spatie QueryBuilder |
| **1.3 Store Assignments API** | ✅ Done | `329eaa37` | 12 endpoints for task execution (assign, start, complete, unable, hq-check) |
| **1.4 Task Library API** | ✅ Done | `00281d13` | Full WS workflow: draft → approve → available → cooldown → dispatch |

#### Completed Features

**Task Store Assignments (`/api/v1/stores/{store}/tasks`, `/api/v1/tasks/{task}/stores/{store}`):**
- GET store tasks với filtering
- GET my store tasks (assigned to current user)
- GET task store detail
- POST assign to staff (S2-S4 only)
- PUT reassign to different staff
- DELETE unassign (return to store leader)
- POST start task
- POST complete task
- POST mark unable (with reason)
- POST hq check (approve completion)
- POST hq reject (reject completion)
- GET task progress (all stores summary)

**Task Library (`/api/v1/library-tasks`):**
- CRUD operations with draft/approval workflow
- GET pending approval (for approvers)
- POST submit (draft → approve)
- POST approve (approve → available + auto-create task)
- POST reject (approve → draft with reason)
- POST dispatch (available → create task + store assignments)
- POST override-cooldown (for dept/team heads)
- Auto-save from approved tasks (static method)
- Cooldown mechanism to prevent duplicate dispatches

#### Pending Tasks

| Task | Priority | Notes |
|------|----------|-------|
| Frontend Task List improvements | High | Connect to new APIs |
| Task Detail screen | High | Show store progress, HQ check actions |
| Add Task flow updates | Medium | Connect to approval workflow |
| Library screen | Medium | Template management and dispatch |
| Store Task List screen | Medium | For store users (S1-S4) |
| Real-time updates (Reverb) | Low | WebSocket for live status |

#### Database Tables Implemented

```
✅ tasks (enhanced with approval workflow fields)
✅ task_store_assignments (store task execution)
✅ task_approval_history (approval audit trail)
✅ task_library (reusable templates)
✅ task_execution_logs (action logging)
```

---

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

#### Troubleshooting: Frontend Server Issues

**Lỗi 1: Port đã bị chiếm (Port 3000 is in use)**

```bash
# Tìm process đang dùng port 3000
netstat -ano | findstr :3000 | findstr LISTENING

# Kill process (thay PID bằng số từ lệnh trên)
taskkill //F //PID <PID>

# Khởi động lại frontend
cd frontend && npm run dev
```

**Lỗi 2: Webpack build cache bị hỏng (Cannot find module './72.js')**

Triệu chứng: Server trả về 500 error với message như:
- `Error: Cannot find module './72.js'`
- `Error: Cannot find module './578.js'`

```bash
# 1. Kill frontend process nếu đang chạy
taskkill //F //PID <PID>

# 2. Xóa thư mục .next (build cache)
cd frontend && rm -rf .next

# 3. Khởi động lại
npm run dev
```

**Lỗi 3: Cả hai lỗi trên (Port chiếm + Cache hỏng)**

```bash
# Full reset sequence
netstat -ano | findstr :3000 | findstr LISTENING
# Ghi nhớ PID

taskkill //F //PID <PID>
cd frontend && rm -rf .next && npm run dev
```

Chi tiết: `docs/SESSION_START_CHECKLIST.md`

### 11. Production Deployment (PA Vietnam Hosting)

#### URLs Production

| Component | URL |
|-----------|-----|
| Frontend | `https://aoisora.auraorientalis.vn` |
| Backend API | `https://auraorientalis.vn/api/api/v1` |
| phpMyAdmin | DirectAdmin → MySQL → phpMyAdmin |

#### ⚠️ QUAN TRỌNG: File .env (Local vs Production)

```
┌─────────────────────────────────────────────────────────────────┐
│  ⚠️ CẤU HÌNH .ENV KHÁC NHAU GIỮA LOCAL VÀ PRODUCTION            │
│                                                                 │
│  📁 FILE LOCATIONS:                                             │
│     • Local:      backend/laravel/.env                          │
│     • Production: deploy/laravel/.env (KHÔNG COMMIT LÊN GIT)    │
│                                                                 │
│  🔴 TUYỆT ĐỐI KHÔNG UPLOAD backend/laravel/.env LÊN SERVER!     │
│     → File này chứa cấu hình LOCAL (root, no password)          │
│     → Sẽ gây lỗi 500 vì không kết nối được DB production        │
│                                                                 │
│  ✅ CÁCH LÀM ĐÚNG:                                               │
│     → Dùng file deploy/laravel/.env cho production              │
│     → Hoặc sửa trực tiếp .env trên server qua File Manager      │
└─────────────────────────────────────────────────────────────────┘
```

**So sánh cấu hình .env:**

| Config | Local (`backend/laravel/.env`) | Production (`deploy/laravel/.env`) |
|--------|--------------------------------|-----------------------------------|
| `APP_URL` | `http://localhost` | `https://auraorientalis.vn` |
| `DB_DATABASE` | `auraorie68aa_aoisora` | `auraorie68aa_aoisora` |
| `DB_USERNAME` | `root` | `auraorie68aa_aoisora` |
| `DB_PASSWORD` | (trống) | `<password từ DirectAdmin>` |
| `SANCTUM_STATEFUL_DOMAINS` | `localhost:3000,...` | `aoisora.auraorientalis.vn` |
| `SESSION_DOMAIN` | `localhost` | `auraorientalis.vn` |

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
| **API Entry** | `backend/api/` | `public_html/api/` |
| **Thêm package mới** | `backend/laravel/vendor/` | `public_html/laravel/vendor/` |

**⚠️ KHÔNG upload các file/folder sau:**
- **`.env`** - File local sẽ ghi đè cấu hình production → LỖI 500!
- `storage/` - Chứa logs, cache, sessions của server
- `vendor/` - Chỉ upload khi thêm package mới (composer require)

#### Khi nào cần Import Database (phpMyAdmin)

| Tình huống | File import | Ghi chú |
|------------|-------------|---------|
| **Reset toàn bộ DB** | `deploy/full_reset.sql` | ⚠️ XÓA TOÀN BỘ DATA, dùng file này duy nhất |
| **Thêm/sửa table/column** | Tạo file migration SQL mới trong `database/migrations/` | Chỉ chạy migration, không reset data |

> **Lưu ý**: Chỉ sử dụng DUY NHẤT file `deploy/full_reset.sql` để reset database. Không tạo thêm file SQL khác trong thư mục deploy.

#### Quy trình Deploy Production (Manual - Đã tắt Auto-Deploy)

```
┌─────────────────────────────────────────────────────────────────┐
│  ⚠️ QUAN TRỌNG: FE ĐÃ TẮT AUTO-DEPLOY                           │
│     → Vercel Settings > Git > "Don't build anything"            │
│     → Commit & Push sẽ KHÔNG tự động deploy FE                  │
│     → Phải deploy thủ công theo quy trình dưới đây              │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  QUY TRÌNH DEPLOY AN TOÀN (Theo thứ tự):                        │
│                                                                 │
│  ☐ 1. TEST LOCAL                                                │
│       → Đảm bảo tất cả hoạt động đúng trên local                │
│                                                                 │
│  ☐ 2. COMMIT & PUSH LÊN GITHUB                                  │
│       → Code được đẩy lên GitHub                                │
│       → FE sẽ KHÔNG tự deploy (đã tắt)                          │
│                                                                 │
│  ☐ 3. DEPLOY DATABASE (nếu có thay đổi schema)                  │
│       → Vào DirectAdmin → phpMyAdmin                            │
│       → Import file SQL migration                               │
│                                                                 │
│  ☐ 4. DEPLOY BACKEND (FileZilla)                                │
│       ⚠️ EXCLUDE file .env khi upload!                          │
│       - backend/laravel/app/ → public_html/laravel/app/         │
│       - backend/laravel/routes/ → public_html/laravel/routes/   │
│       - backend/laravel/config/ → public_html/laravel/config/   │
│       - backend/api/ → public_html/api/ (nếu có thay đổi)       │
│                                                                 │
│  ☐ 5. TEST API PRODUCTION                                       │
│       → Test các API endpoints đã thay đổi                      │
│       → Đảm bảo BE hoạt động trước khi deploy FE                │
│                                                                 │
│  ☐ 6. DEPLOY FRONTEND (Vercel - Thủ công)                       │
│       → Vào Vercel Dashboard: vercel.com                        │
│       → Project: aoisora                                        │
│       → Tab: Deployments                                        │
│       → Click vào deployment có tag "Current"                   │
│       → Click "..." (3 chấm) → "Redeploy"                       │
│       → Vercel sẽ build từ code mới nhất trên GitHub            │
│                                                                 │
│  ☐ 7. TEST TOÀN BỘ PRODUCTION                                   │
│       → https://aoisora.auraorientalis.vn                       │
│       → Test các tính năng đã thay đổi                          │
│                                                                 │
│  📌 LƯU Ý:                                                       │
│     → Redeploy tạo bản deployment MỚI (bản cũ vẫn còn)          │
│     → Có thể Rollback: Click bản cũ → "Promote to Production"   │
└─────────────────────────────────────────────────────────────────┘
```

#### Version Naming & Release Notes

```
┌─────────────────────────────────────────────────────────────────┐
│  QUY TẮC ĐẶT TÊN PHIÊN BẢN (Semantic Versioning):               │
│                                                                 │
│  Format: v{MAJOR}.{MINOR}.{PATCH}                               │
│                                                                 │
│  • MAJOR: Thay đổi lớn, breaking changes (v1.0.0 → v2.0.0)      │
│  • MINOR: Thêm tính năng mới (v1.0.0 → v1.1.0)                  │
│  • PATCH: Bug fixes, minor updates (v1.0.0 → v1.0.1)            │
│                                                                 │
│  Ví dụ:                                                         │
│  • v0.1.0 - Initial release (WS Task List basic)                │
│  • v0.1.1 - Fix login bug                                       │
│  • v0.2.0 - Add Task Detail screen                              │
│  • v1.0.0 - WS Module complete, production ready                │
└─────────────────────────────────────────────────────────────────┘
```

**Quy trình tạo Release:**

```
┌─────────────────────────────────────────────────────────────────┐
│  TRƯỚC KHI DEPLOY PRODUCTION:                                   │
│                                                                 │
│  1. TẠO GIT TAG cho phiên bản:                                  │
│     git tag -a v0.1.0 -m "Release v0.1.0: WS Task List"         │
│     git push origin v0.1.0                                      │
│                                                                 │
│  2. CẬP NHẬT FILE CHANGELOG:                                    │
│     → File: CHANGELOG.md (root folder)                          │
│     → Ghi lại tất cả thay đổi kể từ lần deploy trước            │
│                                                                 │
│  3. SAU KHI DEPLOY XONG:                                        │
│     → Cập nhật "Current Version" trong CHANGELOG.md             │
│     → Ghi thời điểm deploy                                      │
└─────────────────────────────────────────────────────────────────┘
```

**File CHANGELOG.md Format:**

```markdown
# Changelog

## [Unreleased]
- Changes since last release (will be included in next version)

## [v0.1.0] - 2025-01-21
### Added
- WS Task List screen with filtering
- Login/Logout functionality
- Department dropdown API

### Changed
- Updated header layout

### Fixed
- Fixed date picker timezone issue

### Deployment Info
- **Deployed at**: 2025-01-21 15:30 (UTC+7)
- **Deployed by**: [Name]
- **Vercel Deployment ID**: 2kefFcgsz
- **DB Migration**: full_reset.sql (v0.1.0)
```

**Claude phải làm khi deploy:**

| Bước | Action |
|------|--------|
| 1 | Hỏi user: "Đây là MAJOR, MINOR hay PATCH release?" |
| 2 | Tạo/cập nhật CHANGELOG.md với các thay đổi |
| 3 | Tạo git tag với version number |
| 4 | Nhắc user deploy theo quy trình |
| 5 | Sau deploy: cập nhật Deployment Info trong CHANGELOG |

#### Nếu LỠ upload .env local lên server

```
┌─────────────────────────────────────────────────────────────────┐
│  KHẮC PHỤC:                                                     │
│                                                                 │
│  1. Mở File Manager trên DirectAdmin                            │
│  2. Edit public_html/laravel/.env                               │
│  3. Copy nội dung từ deploy/laravel/.env                        │
│  4. Save file                                                   │
│  5. Xóa files trong public_html/laravel/bootstrap/cache/        │
└─────────────────────────────────────────────────────────────────┘
```

#### Troubleshooting: Lỗi 500 sau khi deploy

```
┌─────────────────────────────────────────────────────────────────┐
│  KHI GẶP LỖI 500 INTERNAL SERVER ERROR:                         │
│                                                                 │
│  1. Kiểm tra .env trên server:                                  │
│     → DB_USERNAME phải là: auraorie68aa_aoisora                 │
│     → DB_PASSWORD phải có password (không để trống)             │
│     → Nếu sai → copy từ deploy/laravel/.env                     │
│                                                                 │
│  2. Clear cache:                                                │
│     → Xóa files trong public_html/laravel/bootstrap/cache/      │
│                                                                 │
│  3. Kiểm tra Laravel log:                                       │
│     → Download: public_html/laravel/storage/logs/laravel.log    │
│     → Xem lỗi cụ thể ở cuối file                                │
│                                                                 │
│  4. Kiểm tra database:                                          │
│     → phpMyAdmin: Đảm bảo database auraorie68aa_aoisora tồn tại │
│     → Đảm bảo đã import deploy/full_reset.sql                   │
└─────────────────────────────────────────────────────────────────┘
```

#### Test Account Production

- **Username**: `admin`
- **Password**: `password`
- **Role**: ADMIN

Chi tiết: `docs/06-deployment/DEPLOY-PA-VIETNAM-HOSTING.md`

---

## 12. WS Module - Business Flow (Organized by Task Status)

> **Scope**: Section này mô tả luồng hoạt động của **WS Module (Task from HQ)** được tổ chức theo **Task Status Flow**.
>
> **Three Creation Flows**:
> - **Flow 1 - Task HQ→Store**: HQ tạo task giao cho Stores → Approve → Gửi về Stores + Lưu Library
> - **Flow 2 - Template Task**: Tạo template task dùng lại → Approve → Available (chờ dispatch)
> - **Flow 3 - Task HQ→HQ**: HQ tạo task giao cho HQ users khác → Approve → Gửi về HQ users + Lưu Library

```
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│  COMPLETE TASK STATUS FLOW (ADD TASK → DONE)                                               │
│                                                                                            │
│  ══════════════════════════════════════════════════════════════════════════════════════════│
│  GIAI ĐOẠN 1: TẠO TASK (HQ thao tác)                                                       │
│  ══════════════════════════════════════════════════════════════════════════════════════════│
│                                                                                            │
│       FLOW 1                     FLOW 2                     FLOW 3                         │
│    (Task HQ→Store)           (Template Task)             (Task HQ→HQ)                      │
│  ┌─────────────────────┐    ┌─────────────────────┐    ┌─────────────────────┐             │
│  │  Button Add New     │    │  Button Add New     │    │  Button Add New     │             │
│  │  tại Task List      │    │  tại Library Task   │    │  tại To do Task     │             │
│  └──────────┬──────────┘    └──────────┬──────────┘    └──────────┬──────────┘             │
│             └──────────────────────────┼──────────────────────────┘                        │
│                                        ▼                                                   │
│                          ┌──────────────────────────┐                                      │
│                          │     SCREEN: ADD TASK     │                                      │
│                          │  (Cùng 1 screen cho cả   │                                      │
│                          │   3 flows, khác params)  │                                      │
│                          └────────────┬─────────────┘                                      │
│                    ┌──────────────────┼──────────────────┐                                 │
│                    │                  │                  │                                 │
│                 [Cancel]              │            [Save as Draft]                         │
│                    │                  │                  │                                 │
│                    ▼                  │                  ▼                                 │
│               (Hủy, không             ▼            ┌───────────┐                           │
│                 tạo task)         [Submit]◄────────│   DRAFT   │◄──────────┐               │
│                                       │            └───────────┘           │               │
│                                       ▼                  ▲                 │               │
│                                 ┌───────────┐            │                 │               │
│                                 │  APPROVE  ├─ [Reject] ─┘                 │               │
│                                 └─────┬─────┘                              │               │
│                                   Approved                                 │               │
│             ┌─────────────────────────┼─────────────────────────┐          │               │
│             ▼                         ▼                         ▼          │               │
│          FLOW 1                    FLOW 2                    FLOW 3        │               │
│      (Task HQ→Store)           (Template Task)            (Task HQ→HQ)     │               │
│             │                         │                         │          │               │
│             │                         ▼                         │          │               │
│             │                   ┌───────────┐                   │          │               │
│             ├─── Lưu Library ──►│ AVAILABLE │◄── Lưu Library ───┤          │               │
│             │                   └─────┬─────┘                   │          │               │
│             │                     (dispatch)                    │          │               │
│             │                         │                         │          │               │
│             └──────── Gửi Stores ────►┼◄───── Gửi Dep/Team ─────┘          │               │
│                                       │                                    │               │
│                                       ├───► [Pause] ───────────────────────┘               │
│                                       │                                                    │
│  ═════════════════════════════════════╪════════════════════════════════════════════════════│
│  GIAI ĐOẠN 2: THỰC HIỆN TASK          │(Store/HQ thực hiện - HQ verify)                    │
│  ═════════════════════════════════════╪════════════════════════════════════════════════════│
│                                       ▼                                                    │
│                                ┌─────────────┐                                             │
│                                │   NOT YET   │◄── TASK STATUS (tất cả stores = not_yet)    │
│                                └──────┬──────┘                                             │
│  ┌────────────────────────────────────┼─────────────────────────┬────────────────────┐     │
│  │                                    │                         │     ON PROGRESS    │     │
│  │                                    ▼                         │ (ít nhất 1 store   │     │
│  │                             ┌─────────────┐                  │  đang thực hiện)   │     │
│  │                             │   not_yet   │◄── store status  └────────────────────┤     │
│  │                             └──────┬──────┘                                       │     │
│  │         ┌──────────────────────────┼──────────────────────────┐                   │     │
│  │         ▼                          ▼                          ▼                   │     │
│  │  ┌─────────────┐            ┌─────────────┐            ┌─────────────┐            │     │
│  │  │   unable    │◄───────────┤ on_progress ├───────────►│   overdue   │            │     │
│  │  └──────┬──────┘            └──────┬──────┘            └──────┬──────┘            │     │
│  │         │                      ▲   │                          │                   │     │
│  │         │       ┌──────────────┘   │                          │                   │     │
│  │         │       │                  ▼                          │                   │     │
│  │         │       │           ┌─────────────┐                   │                   │     │
│  │         │       │           │done_pending │                   │                   │     │
│  │         │       │           └──────┬──────┘                   │                   │     │
│  │         │       │                  ▼                          │                   │     │
│  │         │       │           ┌─────────────┐                   │                   │     │
│  │         │       └─ Reject ──┤  HQ CHECK   │                   │                   │     │
│  │         │                   └──────┬──────┘                   │                   │     │
│  │         │                       Checked                       │                   │     │
│  │         │                          │                          │                   │     │
│  │         │                          ▼                          │                   │     │
│  │         │                   ┌─────────────┐                   │                   │     │
│  │         │                   │    done     │                   │                   │     │
│  │         │                   └──────┬──────┘                   │                   │     │
│  │         │                          ▼                          │                   │     │
│  │         │              ┌─────────────────────────┐            │                   │     │
│  │         └─────────────►│ System check conditions │◄───────────┘                   │     │
│  │                        └───────────┬─────────────┘                                │     │
│  └────────────────────────────────────┼──────────────────────────────────────────────┘     │
│                          ┌────────────┴────────────┐                                       │
│                          ▼                         ▼                                       │
│                    Tất cả stores             Có bất kỳ store                               │
│                   = done hoặc unable           = overdue                                   │
│                          │                         │                                       │
│                          ▼                         ▼                                       │
│                     ┌──────────┐              ┌──────────┐                                 │
│                     │   DONE   │              │ OVERDUE  │                                 │
│                     └──────────┘              └──────────┘                                 │
│                                                                                            │
│  ══════════════════════════════════════════════════════════════════════════════════════════│
│  📌 LEGEND (Chú thích)                                                                     │
│  ══════════════════════════════════════════════════════════════════════════════════════════│
│                                                                                            │
│  • SCREEN ADD TASK: Cả 3 flows đều mở cùng 1 screen Add Task (khác params/context)         │
│  • DRAFT là OPTIONAL: Chỉ tạo khi user click [Save as Draft]                               │
│    - Click [Submit] trực tiếp → Đi thẳng tới APPROVE (bỏ qua DRAFT)                        │
│    - Click [Save as Draft] → Tạo DRAFT → Sau đó Submit từ Draft → APPROVE                  │
│  • TASK STATUS (UPPERCASE): DRAFT, APPROVE, NOT YET, ON PROGRESS, DONE, OVERDUE            │
│    → Trạng thái tổng thể của task, tính từ tổng hợp tất cả store statuses                  │
│                                                                                            │
│  • Store status (lowercase) - 6 trạng thái:                                                │
│    → not_yet: Store chưa bắt đầu thực hiện                                                 │
│    → on_progress: Store đang thực hiện task                                                │
│    → done_pending: Store báo hoàn thành, chờ HQ kiểm tra                                   │
│    → done (confirmed): HQ đã xác nhận OK                                                   │
│    → unable: Store không thể thực hiện (chọn từ on_progress hoặc not_yet)                  │
│    → overdue: Store quá hạn (today > end_date mà status = not_yet hoặc on_progress)        │
│                                                                                            │
│  • HQ CHECK có 2 actions:                                                                  │
│    → Checked (OK): done_pending → done (confirmed)                                         │
│    → Reject: done_pending → on_progress (yêu cầu làm lại)                                  │
│                                                                                            │
│  • OVERDUE RULES (System auto):                                                            │
│    → not_yet + today > end_date → overdue                                                  │
│    → on_progress + today > end_date → overdue                                              │
│    → done_pending + today > end_date → done (AUTO CONFIRM - lỗi HQ không check kịp)        │
│                                                                                            │
│  • PAUSE (Tạm dừng task):                                                                  │
│    → Chỉ APPROVER có quyền pause (không phải Creator)                                      │
│    → Áp dụng khi: Task đã gửi về stores (NOT YET, ON PROGRESS)                             │
│    → Lý do: Phát hiện task có vấn đề, nguy cơ unable cao                                   │
│    → Kết quả: Task quay về status APPROVE, xóa tất cả store assignments                    │
│    → Library mark: Đánh dấu task tương ứng trong Library là "had_issues" (đã từng có vấn đề)│
│    → Tại APPROVE: Approver có thể SỬA thông tin task (vì Approver chịu trách nhiệm         │
│      về tính khả thi của task, không phải Creator)                                         │
│    → Sau khi sửa: Approver có thể Approve lại để gửi về stores                             │
│                                                                                            │
│  • Receiver = Store (Flow 1) hoặc HQ User (Flow 3)                                         │
│  • Flow 2: Template lưu AVAILABLE → dispatch sau → theo Flow 1 hoặc 3                      │
│                                                                                            │
│  ══════════════════════════════════════════════════════════════════════════════════════════│
│  📌 KEY DIFFERENCES GIỮA 3 FLOWS:                                                          │
│  ══════════════════════════════════════════════════════════════════════════════════════════│
│                                                                                            │
│  ┌────────────────┬─────────────────┬─────────────────┬─────────────────────────┐          │
│  │                │ FLOW 1          │ FLOW 2          │ FLOW 3                  │          │
│  │                │ (Task HQ→Store) │ (Template Task) │ (Task HQ→HQ)            │          │
│  ├────────────────┼─────────────────┼─────────────────┼─────────────────────────┤          │
│  │ Mục đích       │ HQ giao task    │ Tạo template    │ HQ giao task cho        │          │
│  │                │ cho Stores      │ dùng lại        │ HQ users khác           │          │
│  │ Entry Point    │ Task List       │ Library Task    │ To do List              │          │
│  │ Receiver       │ Stores          │ (chọn khi       │ HQ Users                │          │
│  │                │                 │  dispatch)      │                         │          │
│  │ C. Scope       │ Required        │ Hidden          │ Required                │          │
│  │ After Approve  │ (1) Gửi Stores  │ AVAILABLE       │ (1) Gửi HQ users        │          │
│  │                │ (2) Lưu Library │ (chờ dispatch)  │ (2) Lưu Library         │          │
│  │ Draft Limit    │ 5 per user      │ 5 per user      │ 5 per user              │          │
│  └────────────────┴─────────────────┴─────────────────┴─────────────────────────┘          │
│                                                                                            │
│  ══════════════════════════════════════════════════════════════════════════════════════════│
│  📌 RECEIVER STATUS VALUES & TRANSITIONS:                                                  │
│  ══════════════════════════════════════════════════════════════════════════════════════════│
│                                                                                            │
│  ┌─────────────────────┬────────────────────────────────────────────────────────┐          │
│  │ STATUS              │ MÔ TẢ                                                  │          │
│  ├─────────────────────┼────────────────────────────────────────────────────────┤          │
│  │ not_yet             │ Chưa bắt đầu (mặc định khi task được giao)             │          │
│  │ on_progress         │ Đang thực hiện (đã click đủ 2 link)                    │          │
│  │ done_pending        │ Receiver báo done, CHỜ HQ confirm                      │          │
│  │ done                │ HQ đã confirm, hoàn thành THẬT SỰ                      │          │
│  │ unable              │ Không thể thực hiện (có lý do)                         │          │
│  │ overdue             │ Quá hạn (end_date < today)                             │          │
│  └─────────────────────┴────────────────────────────────────────────────────────┘          │
│                                                                                            │
│  ┌─────────────────────┬────────────────────────────────────────────────────────┐          │
│  │ CHUYỂN ĐỔI          │ TRIGGER                                                │          │
│  ├─────────────────────┼────────────────────────────────────────────────────────┤          │
│  │ not_yet →           │ Receiver click ĐỦ 2 link (task type + manual)          │          │
│  │ on_progress         │                                                        │          │
│  ├─────────────────────┼────────────────────────────────────────────────────────┤          │
│  │ on_progress →       │ Receiver click "Mark as Done" + upload evidence        │          │
│  │ done_pending        │ → Chờ HQ confirm                                       │          │
│  ├─────────────────────┼────────────────────────────────────────────────────────┤          │
│  │ done_pending →      │ HQ CHECK: click "Checked" (OK) cho receiver đó         │          │
│  │ done                │                                                        │          │
│  ├─────────────────────┼────────────────────────────────────────────────────────┤          │
│  │ done_pending →      │ HQ CHECK: click "Reject" → yêu cầu làm lại             │          │
│  │ on_progress         │ (quay về on_progress để store thực hiện lại)           │          │
│  ├─────────────────────┼────────────────────────────────────────────────────────┤          │
│  │ on_progress →       │ Receiver click "Unable" + nhập lý do (required)        │          │
│  │ unable              │                                                        │          │
│  ├─────────────────────┼────────────────────────────────────────────────────────┤          │
│  │ not_yet → overdue   │ SYSTEM AUTO: today > end_date (store chưa bắt đầu)     │          │
│  ├─────────────────────┼────────────────────────────────────────────────────────┤          │
│  │ on_progress →       │ SYSTEM AUTO: today > end_date (store đang làm dở)      │          │
│  │ overdue             │                                                        │          │
│  ├─────────────────────┼────────────────────────────────────────────────────────┤          │
│  │ done_pending →      │ SYSTEM AUTO: today > end_date (HQ không check kịp)     │          │
│  │ done (auto confirm) │ → Auto confirm vì lỗi HQ, store đã hoàn thành          │          │
│  └─────────────────────┴────────────────────────────────────────────────────────┘          │
│                                                                                            │
│  ══════════════════════════════════════════════════════════════════════════════════════════│
│  📌 TASK STATUS CALCULATION (Auto từ Receiver Statuses):                                   │
│  ══════════════════════════════════════════════════════════════════════════════════════════│
│                                                                                            │
│  ┌─────────────────────┬────────────────────────────────────────────────────────┐          │
│  │ TASK STATUS         │ ĐIỀU KIỆN (System check conditions)                    │          │
│  ├─────────────────────┼────────────────────────────────────────────────────────┤          │
│  │ NOT YET             │ TẤT CẢ receivers = not_yet                             │          │
│  │ ON PROGRESS         │ ÍT NHẤT 1 receiver đang thực hiện (on_progress,        │          │
│  │                     │ done_pending) VÀ không có overdue                      │          │
│  │ DONE                │ TẤT CẢ receivers = done (confirmed) HOẶC unable        │          │
│  │ OVERDUE             │ Có BẤT KỲ receiver = overdue                           │          │
│  └─────────────────────┴────────────────────────────────────────────────────────┘          │
│                                                                                            │
│  📌 VÍ DỤ (Task giao cho 3 receivers: A, B, C):                                            │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐       │
│  │ Case 1: A=not_yet, B=not_yet, C=not_yet         → TASK = NOT YET               │       │
│  │ Case 2: A=on_progress, B=not_yet, C=not_yet     → TASK = ON PROGRESS           │       │
│  │ Case 3: A=done_pending, B=not_yet, C=not_yet    → TASK = ON PROGRESS           │       │
│  │ Case 4: A=done, B=done_pending, C=on_progress   → TASK = ON PROGRESS           │       │
│  │ Case 5: A=done, B=done, C=unable                → TASK = DONE ✓                │       │
│  │ Case 6: A=done, B=done, C=done_pending          → TASK = ON PROGRESS (chờ HQ)  │       │
│  │ Case 7: A=done, B=on_progress, C=overdue        → TASK = OVERDUE ⚠️            │       │
│  │ Case 8: A=done, B=done, C=overdue               → TASK = OVERDUE ⚠️            │       │
│  └─────────────────────────────────────────────────────────────────────────────────┘       │
│                                                                                            │
│  📌 VÍ DỤ OVERDUE AUTO (khi today > end_date):                                             │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐       │
│  │ Before: A=not_yet      → After: A=overdue (store chưa bắt đầu)                 │       │
│  │ Before: A=on_progress  → After: A=overdue (store đang làm dở)                  │       │
│  │ Before: A=done_pending → After: A=done (AUTO CONFIRM - lỗi HQ không check kịp) │       │
│  │ Before: A=done         → After: A=done (giữ nguyên - đã hoàn thành)            │       │
│  │ Before: A=unable       → After: A=unable (giữ nguyên - đã kết thúc)            │       │
│  └─────────────────────────────────────────────────────────────────────────────────┘       │
│                                                                                            │
│  ══════════════════════════════════════════════════════════════════════════════════════════│
│  📌 HQ CHECK FLOW:                                                                         │
│  ══════════════════════════════════════════════════════════════════════════════════════════│
│                                                                                            │
│    Receiver báo done             HQ CHECK                 Checked → done (confirmed)       │
│    (done_pending)  ───────────►  (kiểm tra)  ──────────►  Reject → on_progress (làm lại)  │
│                                                                                            │
│    • Receiver click "Mark as Done" → status = done_pending                                 │
│    • HQ nhận notification về receiver cần kiểm tra                                         │
│    • HQ vào Task Detail → xem evidence của receiver đó                                     │
│    • HQ có 2 actions:                                                                      │
│      → "Checked" (OK): receiver status = done (confirmed)                                  │
│      → "Reject": receiver status = on_progress (yêu cầu làm lại)                           │
│    • AUTO CONFIRM: Nếu today > end_date mà status = done_pending                           │
│      → System tự động chuyển done_pending → done (lỗi HQ không check kịp)                  │
│    • Khi TẤT CẢ receivers = done hoặc unable → TASK = DONE                                 │
│    • Nếu có BẤT KỲ receiver = overdue → TASK = OVERDUE                                     │
│                                                                                            │
│  ══════════════════════════════════════════════════════════════════════════════════════════│
│  📌 PAUSE FLOW (Tạm dừng task):                                                            │
│  ══════════════════════════════════════════════════════════════════════════════════════════│
│                                                                                            │
│    Task đang thực hiện          Approver PAUSE            Task quay về APPROVE             │
│    (NOT YET/ON PROGRESS) ─────► (tạm dừng task) ────────► (Approver có thể sửa)           │
│                                                                                            │
│    📋 ĐIỀU KIỆN PAUSE:                                                                     │
│    • Task status = NOT YET hoặc ON PROGRESS                                                │
│    • Chưa có store nào = done hoặc done_pending                                            │
│    • Chỉ APPROVER có quyền (không phải Creator)                                            │
│                                                                                            │
│    🔄 KHI PAUSE:                                                                           │
│    • Task status: NOT YET/ON PROGRESS → APPROVE                                            │
│    • Xóa tất cả store assignments (reset về trạng thái chưa giao)                          │
│    • Mark Library: Đánh dấu task tương ứng trong Library là "had_issues"                   │
│      (để cảnh báo khi dispatch lại trong tương lai)                                        │
│    • Notify stores đang thực hiện: "Task [name] đã bị tạm dừng"                            │
│    • Notify Creator: "Task [name] đã bị Approver tạm dừng để điều chỉnh"                   │
│                                                                                            │
│    ✏️ TẠI APPROVE (sau khi Pause):                                                         │
│    • Approver có thể SỬA thông tin task (A. Information, B. Instructions, C. Scope)        │
│    • Lý do: Approver chịu trách nhiệm về tính khả thi, không phải Creator                  │
│    • Sau khi sửa xong: Approver click "Approve" để gửi lại về stores                       │
│                                                                                            │
│    ⚠️ KHÔNG THỂ PAUSE KHI:                                                                 │
│    • Có ít nhất 1 store = done_pending (đang chờ HQ check)                                 │
│    • Có ít nhất 1 store = done (đã hoàn thành)                                             │
│    • Task status = DONE hoặc OVERDUE                                                       │
│                                                                                            │
│    📚 LIBRARY "HAD_ISSUES" FLAG:                                                           │
│    • Khi task bị Pause, task tương ứng trong Library được đánh dấu had_issues = true       │
│    • Hiển thị warning icon ⚠️ trong Library list                                           │
│    • Khi dispatch task có had_issues, hiển thị cảnh báo:                                   │
│      "This task template was paused before due to issues. Review carefully before sending."│
│                                                                                            │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```

### 12.0 Task & Library Overview (Tổng quan Task và Library)

```
┌─────────────────────────────────────────────────────────────────┐
│  THREE CREATION FLOWS - BA LUỒNG TẠO TASK                       │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  📝 FLOW 1: TẠO TASK TỪ TASK LIST (HQ → Store)              ││
│  │  ─────────────────────────────────────────────────────────  ││
│  │  📍 Entry Point: Button "Add New" tại TASK LIST             ││
│  │  📍 Route: /tasks/new                                       ││
│  │                                                             ││
│  │  Đặc điểm:                                                  ││
│  │  → Điền thông tin task + CHỌN Stores (C. Scope required)    ││
│  │  → C. Scope: Chọn theo cấu trúc STORE (Region/Zone/Area/Store)││
│  │  → Submit để gửi phê duyệt                                  ││
│  │  → Sau khi Approve:                                         ││
│  │    ✓ Task được GỬI đến Store Leaders                        ││
│  │    ✓ Task được LƯU vào Library (auto, không có store info)  ││
│  │                                                             ││
│  │  Flow: Draft → Approve → (Gửi Stores + Lưu Library)         ││
│  │                                                             ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  📚 FLOW 2: TẠO TEMPLATE TỪ LIBRARY                         ││
│  │  ─────────────────────────────────────────────────────────  ││
│  │  📍 Entry Point: Button "Add New" tại LIBRARY               ││
│  │  📍 Route: /tasks/new?source=library                        ││
│  │                                                             ││
│  │  Đặc điểm:                                                  ││
│  │  → Điền thông tin task, KHÔNG chọn Scope (C. Scope hidden)  ││
│  │  → Submit để gửi phê duyệt                                  ││
│  │  → Sau khi Approve:                                         ││
│  │    ✓ Template được lưu vào Library (status: available)      ││
│  │    ✓ KHÔNG gửi đến ai (chờ dispatch sau)                    ││
│  │                                                             ││
│  │  Flow: Draft → Approve → Available (chờ dispatch)           ││
│  │                                                             ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  📋 FLOW 3: TẠO TASK TỪ TO DO TASK (HQ → HQ)                ││
│  │  ─────────────────────────────────────────────────────────  ││
│  │  📍 Entry Point: Button "Add New" tại TO DO TASK            ││
│  │  📍 Route: /tasks/new?source=todo_task                      ││
│  │                                                             ││
│  │  Đặc điểm:                                                  ││
│  │  → Điền thông tin task + CHỌN HQ Users (C. Scope required)  ││
│  │  → C. Scope: Chọn theo cấu trúc HQ (Division/Dept/Team/User)││
│  │  → Receiver: Chính mình HOẶC cấp dưới trong Dept/Team       ││
│  │  → Submit để gửi phê duyệt                                  ││
│  │  → Sau khi Approve:                                         ││
│  │    ✓ Task được GỬI đến HQ Users được chọn                   ││
│  │    ✓ Task được LƯU vào Library (auto)                       ││
│  │                                                             ││
│  │  Flow: Draft → Approve → (Gửi HQ Users + Lưu Library)       ││
│  │                                                             ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ⚠️ DRAFT & APPROVE ĐỘC LẬP:                                     │
│     → Draft từ mỗi flow là RIÊNG BIỆT                          │
│     → Mỗi flow có giới hạn 5 drafts riêng                      │
│     → Approver duyệt từng loại riêng                           │
│                                                                 │
│  📊 SO SÁNH BA FLOWS:                                            │
│                                                                 │
│  ┌────────────────┬─────────────────┬─────────────────┬─────────────────┐
│  │ Attribute      │ FLOW 1          │ FLOW 2          │ FLOW 3          │
│  │                │ (Task List)     │ (Library)       │ (To Do Task)    │
│  ├────────────────┼─────────────────┼─────────────────┼─────────────────┤
│  │ Entry Point    │ Task List       │ Library         │ To Do Task      │
│  │                │ > Add New       │ > Add New       │ > Add New       │
│  │ Route          │ /tasks/new      │ /tasks/new      │ /tasks/new      │
│  │                │ ?source=        │ ?source=        │ ?source=        │
│  │                │ task_list       │ library         │ todo_task       │
│  │ Receiver       │ Stores          │ (chọn khi       │ HQ Users        │
│  │                │                 │ dispatch)       │ (Dept/Team)     │
│  │ C. Scope       │ Store structure │ Hidden          │ HQ structure    │
│  │                │ (Region/Zone/   │                 │ (Division/Dept/ │
│  │                │ Area/Store)     │                 │ Team/User)      │
│  │ After Approve  │ Gửi Stores +    │ Lưu Library     │ Gửi HQ Users +  │
│  │                │ Lưu Library     │ (chờ dispatch)  │ Lưu Library     │
│  │ Draft Limit    │ 5 per user      │ 5 per user      │ 5 per user      │
│  │ Use Case       │ HQ giao việc    │ Template dùng   │ HQ giao việc    │
│  │                │ cho Stores      │ lại             │ cho HQ users    │
│  └────────────────┴─────────────────┴─────────────────┴─────────────────┘
│                                                                 │
│  💾 DATABASE:                                                    │
│     → tasks table: Chứa task instances (đang thực hiện)         │
│     → task_library table: Chứa task templates (để dùng lại)     │
│     → source: 'task_list', 'library', 'todo_task' (phân biệt nguồn)│
│     → receiver_type: 'store' hoặc 'hq_user' (phân biệt loại receiver)│
│     → library_task_id: Link từ task instance → template gốc    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 12.1 DRAFT Status (Task Creation)

> **Status Value**: `draft`
> **Applies to**: Task (từ Task List), Template (từ Library), To Do Task - ĐỘC LẬP
> **Next Status**: `approve` (after Submit)

```
┌─────────────────────────────────────────────────────────────────┐
│  DRAFT STATUS - BA LUỒNG TẠO ĐỘC LẬP                            │
│                                                                 │
│  ═══════════════════════════════════════════════════════════════│
│  📝 FLOW 1: DRAFT TỪ TASK LIST (HQ → Store)                     │
│  ═══════════════════════════════════════════════════════════════│
│                                                                 │
│  📍 Entry Point: Task List > Add New                            │
│  📍 Route: /tasks/new?source=task_list                          │
│  📍 C. Scope: REQUIRED - cấu trúc STORE (Region/Zone/Area/Store)│
│  📍 Receiver: Store users (S1-S7)                               │
│                                                                 │
│  ═══════════════════════════════════════════════════════════════│
│  📚 FLOW 2: DRAFT TỪ LIBRARY (Template)                         │
│  ═══════════════════════════════════════════════════════════════│
│                                                                 │
│  📍 Entry Point: Library > Add New                              │
│  📍 Route: /tasks/new?source=library                            │
│  📍 C. Scope: HIDDEN (sẽ chọn khi dispatch sau)                 │
│  📍 Receiver: Tùy thuộc dispatch (Store hoặc HQ)                │
│                                                                 │
│  ═══════════════════════════════════════════════════════════════│
│  📋 FLOW 3: DRAFT TỪ TO DO TASK (HQ → HQ)                       │
│  ═══════════════════════════════════════════════════════════════│
│                                                                 │
│  📍 Entry Point: To Do Task > Add New                           │
│  📍 Route: /tasks/new?source=todo_task                          │
│  📍 C. Scope: REQUIRED - cấu trúc HQ (Division/Dept/Team/User)  │
│  📍 Receiver: Chính mình HOẶC cấp dưới trong Dept/Team          │
│                                                                 │
│  ═══════════════════════════════════════════════════════════════│
│  👤 QUYỀN TẠO (Chung cho cả 3 flows):                           │
│  ═══════════════════════════════════════════════════════════════│
│     → Tất cả HQ users với Job Grade G2-G9                       │
│     → Store users (S1-S7) KHÔNG có quyền tạo task               │
│                                                                 │
│  📋 VALIDATION RULES:                                           │
│                                                                 │
│     1. Save as Draft - Chỉ validate:                            │
│        → Task Name (required, not empty)                        │
│                                                                 │
│     2. Submit - Validate toàn bộ:                               │
│        ┌─────────────────────────────────────────────────────┐  │
│        │ TASK NAME (required)                                │  │
│        ├─────────────────────────────────────────────────────┤  │
│        │ A. INFORMATION:                                     │  │
│        │    • Task Type (required)                           │  │
│        │    • Applicable Period:                             │  │
│        │      - FLOW 1 (Task List): required                 │  │
│        │      - FLOW 2 (Library): HIDDEN (điền khi dispatch) │  │
│        │      - FLOW 3 (To Do): required                     │  │
│        │    • RE Time (required)                             │  │
│        ├─────────────────────────────────────────────────────┤  │
│        │ B. INSTRUCTIONS:                                    │  │
│        │    • Task Type (required): Image / Document         │  │
│        │    • Manual Link (required, valid URL)              │  │
│        │    • Note:                                          │  │
│        │      - IF Task Type = "Document" → required         │  │
│        │      - ELSE → optional                              │  │
│        │    • Photo Guidelines:                              │  │
│        │      - IF Task Type = "Image" → min 1 photo required│  │
│        │      - Max 20 photos, JPG/PNG only, max 5MB each    │  │
│        │      - Upload methods: Click, Paste (Ctrl+V),       │  │
│        │        Drag & Drop                                  │  │
│        │      - Dynamic slots (auto-expand on upload)        │  │
│        │      - ELSE (Document) → hidden                     │  │
│        ├─────────────────────────────────────────────────────┤  │
│        │ C. SCOPE:                                           │  │
│        │    • FLOW 1 (Task List): Store structure required   │  │
│        │      → Region > Zone > Area > Store                 │  │
│        │    • FLOW 2 (Library): HIDDEN (không hiển thị)      │  │
│        │    • FLOW 3 (To Do): HQ structure required          │  │
│        │      → Division > Dept > Team > User                │  │
│        │      → Có thể chọn chính mình hoặc cấp dưới         │  │
│        ├─────────────────────────────────────────────────────┤  │
│        │ D. APPROVAL PROCESS:                                │  │
│        │    • Auto-populated (no validation needed)          │  │
│        │    • System tự động tìm và hiển thị thông tin       │  │
│        └─────────────────────────────────────────────────────┘  │
│                                                                 │
│  ═══════════════════════════════════════════════════════════════│
│  📊 TASK TYPE & SUB-TASK HIERARCHY RULES:                       │
│  ═══════════════════════════════════════════════════════════════│
│                                                                 │
│     📋 TASK TYPE OPTIONS (theo thứ tự frequency lớn → nhỏ):     │
│        ┌─────────────────────────────────────────────────────┐  │
│        │  1. Yearly    (chu kỳ lớn nhất)                     │  │
│        │  2. Quarterly                                       │  │
│        │  3. Monthly                                         │  │
│        │  4. Weekly                                          │  │
│        │  5. Daily     (chu kỳ nhỏ nhất)                     │  │
│        └─────────────────────────────────────────────────────┘  │
│                                                                 │
│     🎯 DEFAULT TASK TYPE BY LEVEL:                              │
│        ┌────────────┬─────────────────────────────────────────┐ │
│        │ Level      │ Default Task Type                       │ │
│        ├────────────┼─────────────────────────────────────────┤ │
│        │ Level 1    │ Yearly                                  │ │
│        │ Level 2    │ Quarterly                               │ │
│        │ Level 3    │ Monthly                                 │ │
│        │ Level 4    │ Weekly                                  │ │
│        │ Level 5    │ Daily                                   │ │
│        └────────────┴─────────────────────────────────────────┘ │
│                                                                 │
│     ⚠️ VALIDATION RULES (Parent-Child Hierarchy):               │
│                                                                 │
│        Rule: Task con PHẢI có Task Type với frequency           │
│              BẰNG HOẶC NHỎ HƠN task cha                         │
│                                                                 │
│        Ví dụ: Nếu task cha = Monthly                            │
│               → Task con chỉ được chọn: Monthly, Weekly, Daily  │
│               → KHÔNG được chọn: Yearly, Quarterly              │
│                                                                 │
│        ┌─────────────────────────────────────────────────────┐  │
│        │  Parent Task Type  │  Child Options Available       │  │
│        ├────────────────────┼────────────────────────────────┤  │
│        │  Yearly            │  Yearly, Quarterly, Monthly,   │  │
│        │                    │  Weekly, Daily                 │  │
│        │  Quarterly         │  Quarterly, Monthly, Weekly,   │  │
│        │                    │  Daily                         │  │
│        │  Monthly           │  Monthly, Weekly, Daily        │  │
│        │  Weekly            │  Weekly, Daily                 │  │
│        │  Daily             │  Daily (only)                  │  │
│        └─────────────────────────────────────────────────────┘  │
│                                                                 │
│     🔄 CASCADE UPDATE BEHAVIOR:                                  │
│                                                                 │
│        Khi user thay đổi Task Type của task cha:                │
│        → System kiểm tra tất cả task con (descendants)          │
│        → Nếu task con có Task Type không hợp lệ (frequency      │
│           lớn hơn task cha mới):                                │
│           ✓ Tự động cập nhật Task Type của task con             │
│           ✓ Ưu tiên dùng Default Task Type theo Level           │
│           ✓ Nếu Default cũng không hợp lệ → dùng Task Type      │
│             của task cha                                        │
│                                                                 │
│        Ví dụ: Level 1 = Yearly, Level 2 = Quarterly             │
│               User đổi Level 1 từ Yearly → Monthly              │
│               → Level 2 tự động đổi từ Quarterly → Monthly      │
│                 (vì Quarterly không hợp lệ với parent Monthly)  │
│                                                                 │
│  ═══════════════════════════════════════════════════════════════│
│                                                                 │
│  📤 SUBMIT ACTION:                                              │
│     → Khi click Submit, task được gửi tới Leader               │
│     → Leader = người được hiển thị tại D. Approval Process     │
│     → Task status chuyển từ 'draft' → 'approve'                │
│                                                                 │
│  📋 TASK STATUS:                                                │
│     • draft    = Bản nháp, chưa submit                         │
│     • approve  = Đang chờ phê duyệt (sau khi submit)           │
│     • approved = Đã được phê duyệt                             │
│     • rejected = Bị từ chối → quay về 'draft'                  │
│                                                                 │
│  📋 DRAFT RULES:                                                │
│                                                                 │
│     ⚠️ QUAN TRỌNG: Draft từ 3 flows là ĐỘC LẬP với nhau        │
│                                                                 │
│     1. Draft bao gồm cả task đang chờ duyệt:                   │
│        → status = 'draft' hoặc 'approve' đều tính là draft     │
│        → Nếu bị reject → quay về status 'draft'                │
│        → Vẫn tính vào giới hạn draft/user                      │
│        → Vẫn áp dụng rule auto-delete 30 ngày                  │
│                                                                 │
│     2. Giới hạn Draft (RIÊNG BIỆT theo flow):                   │
│        ┌───────────────────────────────────────────────────────┐│
│        │  FLOW 1 (Task List): 5 drafts / user                  ││
│        │  FLOW 2 (Library):   5 drafts / user                  ││
│        │  FLOW 3 (To Do):     5 drafts / user                  ││
│        │  ──────────────────────────────────────────────────── ││
│        │  → Tổng cộng user có thể có TỐI ĐA 15 drafts          ││
│        │    (5 Task List + 5 Library + 5 To Do)                ││
│        │  → Đếm riêng theo source (task_list/library/todo_task)││
│        └───────────────────────────────────────────────────────┘│
│        → Nếu đã có 5 (cùng flow) → không cho tạo thêm          │
│        → Phải được approved hoặc xóa draft cũ trước            │
│                                                                 │
│     3. Auto-Delete Draft (30 ngày không hoạt động):             │
│        → Nếu draft không được edit trong 30 ngày                │
│        → System tự động xóa draft đó                            │
│        → Tính từ last_modified_at của draft                     │
│                                                                 │
│     4. Draft Expiration Warning:                                │
│        → 5 ngày trước khi draft bị xóa (ngày 25-30)             │
│        → Hiển thị notification cho user                         │
│        → Trigger: Mỗi lần đăng nhập HOẶC mỗi ngày               │
│        → Format: 'Task "{task_name}" will be deleted in X days' │
│                                                                 │
│  ⏰ TIMELINE:                                                    │
│     Day 0  → User tạo/edit draft                                │
│     Day 25 → "Task [name] will be deleted in 5 days"            │
│     Day 26 → "Task [name] will be deleted in 4 days"            │
│     Day 27 → "Task [name] will be deleted in 3 days"            │
│     Day 28 → "Task [name] will be deleted in 2 days"            │
│     Day 29 → "Task [name] will be deleted in 1 day"             │
│     Day 30 → Auto-delete + notify:                              │
│              "Task [name] was automatically deleted due to      │
│               no edits in the last 30 days"                     │
└─────────────────────────────────────────────────────────────────┘
```

**Implementation Notes:**

| Component | Requirement |
|-----------|-------------|
| **Permission Check** | Backend validate user job_grade trong G2-G9 |
| **Draft Count Check** | Query count drafts WHERE user_id = current AND status = 'draft' |
| **Auto-Delete Job** | Laravel Scheduler chạy daily, xóa drafts có last_modified_at < 30 days |
| **Warning Notification** | Check on login + daily cron, tạo notification cho drafts 25-30 days old |

**Database Fields cần thiết:**

```sql
-- tasks table
status ENUM('draft', 'pending', 'approved', 'rejected', ...)
created_by INT (user_id)
last_modified_at TIMESTAMP -- cập nhật mỗi khi edit draft
```

**API Endpoints liên quan:**

| Action | Endpoint | Description |
|--------|----------|-------------|
| Create Draft | POST /api/v1/tasks | Tạo task với status='draft' |
| Update Draft | PUT /api/v1/tasks/{id} | Update draft, refresh last_modified_at |
| Get My Drafts | GET /api/v1/tasks?status=draft | Lấy danh sách draft của user |
| Delete Draft | DELETE /api/v1/tasks/{id} | Xóa draft thủ công |
| Get Expiring Drafts | GET /api/v1/tasks/expiring | Lấy drafts sắp hết hạn (25-30 days) |

### 12.2 APPROVE Status (Approval Flow)

> **Status Value**: `approve`
> **Applies to**: Task (tạo từ Task List)
> **Previous Status**: `draft` (after Submit)
> **Next Status**: `not_yet` (gửi về stores) + auto-save to Library | `draft` (if rejected)

```
┌─────────────────────────────────────────────────────────────────┐
│  APPROVE STATUS - APPROVAL FLOW                                 │
│                                                                 │
│  📋 STATUS: approve (Đang chờ phê duyệt)                        │
│     → Task chuyển sang status này sau khi user click Submit     │
│     → Task được gửi tới người có thẩm quyền phê duyệt          │
│                                                                 │
│  👤 XÁC ĐỊNH NGƯỜI PHÊ DUYỆT (Approver):                        │
│                                                                 │
│     Nguyên tắc: Cấp trên TRỰC TIẾP trong cơ cấu tổ chức        │
│                                                                 │
│     ┌─────────────────────────────────────────────────────────┐ │
│     │  CƠ CẤU TỔ CHỨC (Job Grade Hierarchy):                  │ │
│     │                                                         │ │
│     │  G9 ──► G8 ──► G7 ──► G6 ──► G5 ──► G4 ──► G3 ──► G2   │ │
│     │  (cao)                                          (thấp)  │ │
│     │                                                         │ │
│     │  Team/Department Structure:                             │ │
│     │  • Mỗi Team/Dept có người đứng đầu (highest grade)      │ │
│     │  • Approver = cấp trên trực tiếp cùng Team/Dept         │ │
│     │  • Nếu không có → tìm lên cấp cao hơn trong hierarchy   │ │
│     └─────────────────────────────────────────────────────────┘ │
│                                                                 │
│  🔍 LOGIC TÌM APPROVER:                                         │
│                                                                 │
│     1. Xác định Team/Department của user tạo task              │
│     2. Tìm người có Job Grade cao hơn trong cùng Team/Dept     │
│     3. Nếu KHÔNG TÌM THẤY (user là cao nhất trong Team/Dept):  │
│        → Tìm lên cấp cao hơn theo hierarchy tổ chức            │
│        → Ví dụ: Team không có G4, G5 → tìm G6 quản lý          │
│                                                                 │
│     Ví dụ cụ thể:                                               │
│     ┌─────────────────────────────────────────────────────────┐ │
│     │  Case 1: G2 tạo task, Team có G3                        │ │
│     │          → Approver = G3 (cấp trên trực tiếp)           │ │
│     │                                                         │ │
│     │  Case 2: G3 tạo task, Team có G4                        │ │
│     │          → Approver = G4 (cấp trên trực tiếp)           │ │
│     │                                                         │ │
│     │  Case 3: G3 tạo task, Team KHÔNG có G4, G5              │ │
│     │          → Approver = G6 (skip G4, G5 vì không tồn tại) │ │
│     │                                                         │ │
│     │  Case 4: G3 là cao nhất trong Team, báo cáo cho Dept    │ │
│     │          → Approver = Dept Head (G5/G6/...)             │ │
│     └─────────────────────────────────────────────────────────┘ │
│                                                                 │
│  🖥️ UI STATES (Add Task Screen):                                │
│                                                                 │
│     A. CREATOR VIEW (người tạo task đang chờ duyệt):           │
│        ┌─────────────────────────────────────────────────────┐ │
│        │  • Button "Save as Draft" → DISABLED (gray out)     │ │
│        │  • Button "Submit" → đổi thành "Approving" (disabled)│ │
│        │  • Không thể edit nội dung task                      │ │
│        │  • Hiển thị trạng thái "Waiting for approval"        │ │
│        └─────────────────────────────────────────────────────┘ │
│                                                                 │
│     B. APPROVER VIEW (người phê duyệt):                        │
│        ┌─────────────────────────────────────────────────────┐ │
│        │  • Button "Approve" → Phê duyệt task                │ │
│        │  • Button "Reject" → Từ chối, mở modal nhập lý do   │ │
│        │  • Có thể xem toàn bộ nội dung task (read-only)     │ │
│        └─────────────────────────────────────────────────────┘ │
│                                                                 │
│  📤 APPROVER ACTIONS:                                           │
│                                                                 │
│     1. APPROVE (Phê duyệt):                                    │
│        → Task status: 'approve' → 'not_yet'                    │
│        → HAI HÀNH ĐỘNG ĐỒNG THỜI:                              │
│          ┌───────────────────────────────────────────────────┐ │
│          │ A. GỬI VỀ STORES:                                 │ │
│          │    • Task được gửi tới Store Leaders              │ │
│          │    • Stores xác định từ C. Scope                  │ │
│          │    • Mỗi Store Leader nhận notification           │ │
│          │    • Task status = 'not_yet'                      │ │
│          │                                                   │ │
│          │ B. LƯU VÀO LIBRARY (tự động):                     │ │
│          │    • Copy task content (không có store info)      │ │
│          │    • Lưu vào task_library table                   │ │
│          │    • Library status = 'available'                 │ │
│          │    • Có thể dispatch lại nhiều lần                │ │
│          └───────────────────────────────────────────────────┘ │
│        → Không còn tính là draft của user tạo                  │
│                                                                 │
│     2. REJECT (Từ chối):                                       │
│        → Task status: 'approve' → 'draft'                      │
│        → Task quay về cho user tạo để chỉnh sửa               │
│        → Vẫn tính vào giới hạn 5 draft/user                   │
│        → Approver phải ghi lý do từ chối (required)           │
│        → KHÔNG lưu vào Library (chưa được approve)            │
│                                                                 │
│  🔄 RESUBMISSION RULES (Gửi lại sau khi bị từ chối):           │
│                                                                 │
│     1. MUST EDIT BEFORE RESUBMIT:                              │
│        → Sau khi bị reject, user PHẢI edit ít nhất 1 field    │
│        → Không cho phép Submit lại nếu chưa có thay đổi        │
│        → System track: has_changes_since_rejection flag        │
│                                                                 │
│     2. MAXIMUM 3 REJECTION ATTEMPTS:                           │
│        → Mỗi task chỉ được reject tối đa 3 lần                │
│        → Sau lần reject thứ 3:                                 │
│          • Không cho phép Submit nữa                           │
│          • User chỉ có thể DELETE task                         │
│          • Button "Submit" → DISABLED                          │
│          • Hiển thị: "Maximum rejection limit reached.         │
│            This task can only be deleted."                     │
│        → rejection_count được track trong database             │
│                                                                 │
│     3. REJECTION COUNTER LOGIC:                                │
│        → rejection_count++ mỗi khi Approver reject             │
│        → Counter KHÔNG reset khi edit                          │
│        → Counter KHÔNG reset khi chuyển Approver               │
│        → Counter chỉ thuộc về task, không phải user            │
│                                                                 │
│  📧 NOTIFICATIONS:                                              │
│                                                                 │
│     Khi Submit:                                                │
│     → Notify Approver: "New task pending approval: [task_name]"│
│                                                                 │
│     Khi Approve:                                               │
│     → Notify Creator: "Your task [task_name] has been approved"│
│     → Notify Store Leaders (trong Scope):                      │
│       "New task assigned: [task_name]"                         │
│                                                                 │
│     Khi Reject:                                                │
│     → Notify Creator: "Your task [task_name] was rejected.     │
│                        Reason: [rejection_reason]"             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Approver Lookup Algorithm:**

```
1. GET user's team_id, department_id, job_grade
2. FIND users in same team WHERE job_grade > user.job_grade
3. IF found → SELECT user with MIN(job_grade) as Approver
4. IF NOT found:
   a. FIND users in same department WHERE job_grade > user.job_grade
   b. IF found → SELECT user with MIN(job_grade) as Approver
5. IF still NOT found:
   a. FIND in parent organizational unit (Division/Sector)
   b. Continue up hierarchy until Approver found
6. FALLBACK: System Admin or designated approval account
```

**API Endpoints liên quan:**

| Action | Endpoint | Description |
|--------|----------|-------------|
| Get Pending Approvals | GET /api/v1/tasks/pending-approval | Lấy tasks cần user phê duyệt |
| Approve Task | POST /api/v1/tasks/{id}/approve | Phê duyệt task |
| Reject Task | POST /api/v1/tasks/{id}/reject | Từ chối task (body: reason) |
| Get Approver | GET /api/v1/users/{id}/approver | Lấy thông tin approver của user |

**Database Fields cho Resubmission:**

```sql
-- tasks table
rejection_count INT DEFAULT 0        -- Đếm số lần bị reject (max 3)
has_changes_since_rejection BOOLEAN  -- Flag track đã edit sau reject chưa
last_rejection_reason TEXT           -- Lý do reject gần nhất
last_rejected_at TIMESTAMP           -- Thời điểm reject gần nhất
```

**Resubmission Validation Logic:**

```
ON SUBMIT (sau khi đã bị reject):
1. CHECK rejection_count >= 3 → BLOCK with error "Maximum rejection limit reached"
2. CHECK has_changes_since_rejection = false → BLOCK with error "Please edit at least one field before resubmitting"
3. IF all checks pass → Allow submit, set has_changes_since_rejection = false

ON EDIT (khi task đang ở status 'draft' sau reject):
→ SET has_changes_since_rejection = true

ON REJECT:
→ SET rejection_count = rejection_count + 1
→ SET has_changes_since_rejection = false
→ SET last_rejection_reason = [reason from approver]
→ SET last_rejected_at = NOW()
```

### 12.3 AVAILABLE Status (Library Templates) & COOLDOWN

> **Status Value**: `available` | `cooldown`
> **Applies to**: Task Library (templates từ 2 nguồn)
> **Previous Status**: Approve thành công (từ Flow 1 hoặc Flow 2)
> **Next Status**: Dispatch → tạo task instance mới với status `not_yet`

```
┌─────────────────────────────────────────────────────────────────┐
│  AVAILABLE STATUS - LIBRARY TEMPLATES READY FOR DISPATCH        │
│                                                                 │
│  📚 KHÁI NIỆM:                                                   │
│     → Library chứa các task templates đã được approve           │
│     → Templates có thể đến từ 2 NGUỒN khác nhau                 │
│     → KHÔNG có thông tin Store (chỉ lưu nội dung task)          │
│     → Dùng để dispatch nhiều lần đến các stores khác nhau       │
│                                                                 │
│  ═══════════════════════════════════════════════════════════════│
│  📥 HAI NGUỒN TẠO TEMPLATE TRONG LIBRARY                         │
│  ═══════════════════════════════════════════════════════════════│
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  NGUỒN 1: TỰ ĐỘNG TỪ TASK LIST (Auto-save)                  ││
│  │  ───────────────────────────────────────────────────────────││
│  │  Khi task từ Task List được approve thành công:             ││
│  │  → Task instance GỬI về Stores (status: not_yet)            ││
│  │  → ĐỒNG THỜI: Copy content → Lưu Library (available)        ││
│  │  → Template KHÔNG chứa store info, dates                    ││
│  │  → source = 'task_list'                                     ││
│  ├─────────────────────────────────────────────────────────────┤│
│  │  NGUỒN 2: TẠO TRỰC TIẾP TỪ LIBRARY (Manual create)          ││
│  │  ───────────────────────────────────────────────────────────││
│  │  Khi template từ Library được approve thành công:           ││
│  │  → Template chuyển status: approve → available              ││
│  │  → KHÔNG gửi đến stores (chờ dispatch sau)                  ││
│  │  → source = 'library'                                       ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  📍 LIBRARY SCREEN: /tasks/library                               │
│     → Hiển thị tất cả templates (cả 2 nguồn)                    │
│     → Mỗi template có button "Dispatch" để gửi                  │
│     → CÓ button "Add New" (để tạo template trực tiếp - Flow 2) │
│     → Có thể filter theo source nếu cần                         │
│                                                                 │
│  📋 LIBRARY TEMPLATE STATUS:                                     │
│     • draft     = Bản nháp (chỉ Flow 2)                         │
│     • approve   = Đang chờ duyệt (chỉ Flow 2)                   │
│     • available = Sẵn sàng dispatch (cả 2 nguồn)                │
│     • cooldown  = Đang trong thời gian chờ (tránh gửi trùng)    │
│                                                                 │
│  ═══════════════════════════════════════════════════════════════│
│  🔄 DISPATCH PROCESS (Gửi Task từ Library)                       │
│  ═══════════════════════════════════════════════════════════════│
│                                                                 │
│  👤 AI CÓ QUYỀN DISPATCH (Gửi task từ Library):                 │
│                                                                 │
│     Nguyên tắc: Tất cả users cùng Department/Team với Creator   │
│                                                                 │
│     ┌─────────────────────────────────────────────────────────┐ │
│     │  CẤU TRÚC TỔ CHỨC:                                      │ │
│     │                                                         │ │
│     │  Company                                                │ │
│     │  └── Division                                           │ │
│     │      └── Department ← Nếu có Dept → cùng Dept           │ │
│     │          └── Team    ← Nếu ko có Dept → cùng Team       │ │
│     │                                                         │ │
│     │  Ví dụ 1: Creator thuộc HR Department                   │ │
│     │  → Tất cả users trong HR Dept có quyền dispatch         │ │
│     │                                                         │ │
│     │  Ví dụ 2: Creator thuộc Team A (không có Dept)          │ │
│     │  → Tất cả users trong Team A có quyền dispatch          │ │
│     │                                                         │ │
│     │  Ví dụ 3: Creator là Director (báo cáo trực tiếp CEO)   │ │
│     │  → Chỉ Creator và CEO có quyền dispatch                 │ │
│     └─────────────────────────────────────────────────────────┘ │
│                                                                 │
│  🔄 DISPATCH STEPS:                                              │
│                                                                 │
│     1. User vào Library, chọn task có status 'available'       │
│     2. Click "Send to Stores" (hoặc "Dispatch")                │
│     3. Modal hiện lên để chọn Scope:                           │
│        ┌─────────────────────────────────────────────────────┐ │
│        │  SELECT SCOPE                                       │ │
│        │  ┌─────────────────────────────────────────────────┐│ │
│        │  │ Region:  [Dropdown]                             ││ │
│        │  │ Zone:    [Dropdown]                             ││ │
│        │  │ Area:    [Dropdown]                             ││ │
│        │  │ Store:   [Multi-select]                         ││ │
│        │  └─────────────────────────────────────────────────┘│ │
│        │  [Cancel]                        [Send to Stores]   │ │
│        └─────────────────────────────────────────────────────┘ │
│     4. Sau khi chọn Scope, click "Send to Stores"              │
│     5. System tạo bản copy của Library Task với Scope đã chọn  │
│     6. Task mới có status 'not_yet' (dispatched)               │
│     7. Gửi đến Store Leaders (xem Section 12.4)                │
│                                                                 │
│  📌 LƯU Ý QUAN TRỌNG:                                           │
│     → Library Task gốc vẫn giữ status 'available'              │
│     → Mỗi lần dispatch tạo 1 bản copy MỚI                      │
│     → Có thể dispatch cùng 1 Library Task nhiều lần            │
│     → Mỗi lần dispatch có thể chọn Scope khác nhau             │
│                                                                 │
│  📊 TRACKING:                                                    │
│     → Library Task có field: dispatch_count (số lần đã gửi)    │
│     → Mỗi dispatched task link về library_task_id gốc          │
│                                                                 │
│  ═══════════════════════════════════════════════════════════════│
│  ❄️ COOLDOWN MECHANISM (Cơ chế Làm Lạnh)                         │
│  ═══════════════════════════════════════════════════════════════│
│                                                                 │
│  🎯 MỤC ĐÍCH:                                                    │
│     → Ngăn chặn việc gửi trùng task đến cùng stores             │
│     → Tránh confusion khi nhiều người cùng dispatch             │
│     → Bảo vệ stores khỏi nhận task duplicate                    │
│                                                                 │
│  🔄 COOLDOWN TRIGGER:                                            │
│                                                                 │
│     Khi user click "Send to Stores", system kiểm tra:           │
│     ┌─────────────────────────────────────────────────────────┐ │
│     │  CHECK DUPLICATE:                                       │ │
│     │                                                         │ │
│     │  1. Cùng Library Task gốc (library_task_id)             │ │
│     │  2. Cùng Scope (stores được chọn)                       │ │
│     │  3. Thời gian trùng nhau (start_date - end_date)        │ │
│     │                                                         │ │
│     │  Nếu TẤT CẢ 3 điều kiện trùng → DUPLICATE DETECTED      │ │
│     └─────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ❄️ KHI DUPLICATE DETECTED:                                      │
│                                                                 │
│     1. Library Task chuyển status: 'available' → 'cooldown'    │
│     2. Disable button "Send to Stores"                         │
│     3. Hiển thị thông báo:                                     │
│        "This task has already been sent to the selected        │
│         stores for this period by [sender_name].               │
│         Task is in cooldown until [end_date]."                 │
│     4. Cooldown period = start_date → end_date của task đã gửi │
│                                                                 │
│  ⏰ COOLDOWN PERIOD:                                             │
│                                                                 │
│     ┌─────────────────────────────────────────────────────────┐ │
│     │  Timeline:                                              │ │
│     │                                                         │ │
│     │  [start_date]──────────────────────────[end_date]       │ │
│     │       │                                      │          │ │
│     │       └── COOLDOWN ACTIVE ──────────────────┘           │ │
│     │                                              │          │ │
│     │                              Auto-release ───┘          │ │
│     │                              status → 'available'       │ │
│     └─────────────────────────────────────────────────────────┘ │
│                                                                 │
│  🔓 OVERRIDE COOLDOWN (Phá khóa):                                │
│                                                                 │
│     Chỉ người có quyền CAO NHẤT trong Team/Dept có thể phá khóa │
│                                                                 │
│     ┌─────────────────────────────────────────────────────────┐ │
│     │  XÁC ĐỊNH NGƯỜI CÓ QUYỀN PHÁ KHÓA:                      │ │
│     │                                                         │ │
│     │  1. Nếu có Department:                                  │ │
│     │     → Department Head (job_grade cao nhất trong Dept)   │ │
│     │                                                         │ │
│     │  2. Nếu chỉ có Team (không có Dept):                    │ │
│     │     → Team Leader (job_grade cao nhất trong Team)       │ │
│     │                                                         │ │
│     │  3. Nếu báo cáo trực tiếp lên Director/CEO:             │ │
│     │     → Director/CEO                                      │ │
│     └─────────────────────────────────────────────────────────┘ │
│                                                                 │
│     UI cho người có quyền phá khóa:                             │
│     ┌─────────────────────────────────────────────────────────┐ │
│     │  ⚠️ This task is in COOLDOWN                            │ │
│     │                                                         │ │
│     │  Already sent by: [sender_name]                         │ │
│     │  Sent at: [datetime]                                    │ │
│     │  Period: [start_date] - [end_date]                      │ │
│     │  Stores: [list of stores]                               │ │
│     │                                                         │ │
│     │  [Cancel]              [Override & Send Anyway]         │ │
│     └─────────────────────────────────────────────────────────┘ │
│                                                                 │
│  📝 OVERRIDE LOGGING:                                            │
│     → Ghi log khi phá khóa: who, when, reason (optional)       │
│     → Dùng cho audit và troubleshooting                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Database Fields cho Library Task & Cooldown:**

```sql
-- tasks table (thêm fields)
is_library_task BOOLEAN DEFAULT FALSE    -- Đánh dấu là Library Task
library_task_id INT NULL                 -- Link đến Library Task gốc (nếu là bản copy)
dispatch_count INT DEFAULT 0             -- Số lần đã dispatch (cho Library Task)

-- Cooldown fields
cooldown_until TIMESTAMP NULL           -- Thời điểm hết cooldown
cooldown_triggered_by INT NULL          -- User đã trigger cooldown (đã gửi trước)
cooldown_triggered_at TIMESTAMP NULL    -- Thời điểm trigger cooldown

-- Khi dispatch:
-- 1. Copy task gốc → task mới với library_task_id = task gốc
-- 2. Task mới có is_library_task = FALSE, status = 'not_yet'
-- 3. Cập nhật dispatch_count++ cho task gốc

-- cooldown_overrides: Log các lần phá khóa
id INT PRIMARY KEY
library_task_id INT
overridden_by INT                       -- User phá khóa
overridden_at TIMESTAMP
reason TEXT NULL
dispatched_task_id INT                  -- Task được tạo sau khi phá khóa
```

**UI States cho Library Task:**

| Status | Badge Color | Actions Available |
|--------|-------------|-------------------|
| draft | Gray | Edit, Delete, Submit |
| approve | Yellow | View only (Creator), Approve/Reject (Approver) |
| available | Green | View, Dispatch (cùng Dept/Team users) |
| cooldown | Ice Blue | View only, Override (highest grade only) |

**API Endpoints cho Library Task:**

| Action | Endpoint | Description |
|--------|----------|-------------|
| Get Library Tasks | GET /api/v1/tasks/library | Lấy danh sách Library Tasks |
| Create Library Task | POST /api/v1/tasks/library | Tạo Library Task mới |
| Dispatch Library Task | POST /api/v1/tasks/{id}/dispatch | Gửi Library Task đến stores |
| Get Dispatch History | GET /api/v1/tasks/{id}/dispatch-history | Lịch sử dispatch của Library Task |
| Check Cooldown | GET /api/v1/tasks/{id}/cooldown-status | Kiểm tra trạng thái cooldown |
| Override Cooldown | POST /api/v1/tasks/{id}/override-cooldown | Phá khóa cooldown (cần quyền) |
| Get Override History | GET /api/v1/tasks/{id}/override-history | Lịch sử phá khóa |

**Cooldown Check Logic:**

```
ON DISPATCH ATTEMPT:
1. GET library_task_id, selected_stores[], start_date, end_date
2. FIND existing dispatched tasks WHERE:
   - library_task_id = same
   - stores overlap với selected_stores
   - (start_date, end_date) overlaps
3. IF found:
   a. IF current_user = highest_grade_in_dept_or_team:
      → Show override confirmation modal
      → IF confirmed: allow dispatch, log override
   b. ELSE:
      → SET library_task.status = 'cooldown'
      → SET library_task.cooldown_until = existing_task.end_date
      → BLOCK dispatch with message
4. IF not found:
   → Allow dispatch normally

ON DAILY CRON (hoặc on-demand):
1. FIND library tasks WHERE status = 'cooldown' AND cooldown_until < NOW()
2. UPDATE status = 'available', clear cooldown fields
```

### 12.4 NOT_YET Status (Task Dispatched to Stores)

> **Status Value**: `not_yet`
> **Applies to**: One-Time Task (after approve) & Dispatched Library Task
> **Previous Status**: `approved` (One-Time) hoặc dispatch từ `available` (Library)
> **Next Status**: `on_progress` (khi store bắt đầu làm)

```
┌─────────────────────────────────────────────────────────────────┐
│  NOT_YET STATUS - TASK DISTRIBUTED TO STORES                    │
│                                                                 │
│  📋 TRIGGER: Khi HQ Approver click "Approve"                    │
│                                                                 │
│  🏪 XÁC ĐỊNH DANH SÁCH STORES:                                  │
│     → Lấy từ C. Scope của task                                  │
│     → Scope chứa: Region, Zone, Area, Store(s)                  │
│     → Nếu chọn Region → tất cả Stores trong Region              │
│     → Nếu chọn Zone → tất cả Stores trong Zone                  │
│     → Nếu chọn Area → tất cả Stores trong Area                  │
│     → Nếu chọn Store(s) → chỉ các Stores được chọn              │
│                                                                 │
│  👤 XÁC ĐỊNH STORE LEADERS:                                     │
│     → Mỗi Store có 1 Store Leader (thường là S6 hoặc cao nhất)  │
│     → Store Leader = staff có job_grade cao nhất trong Store    │
│     → Ví dụ: Store A có S6, S5, S4 → Store Leader = S6          │
│                                                                 │
│  📤 DISTRIBUTION ACTIONS:                                        │
│                                                                 │
│     1. Task được "gán" cho từng Store trong Scope               │
│        → Tạo task_store_assignments records                     │
│        → Mỗi Store có 1 assignment với status = 'not_yet'       │
│        → Task tổng thể chuyển status = 'not_yet'                │
│                                                                 │
│     2. Notify từng Store Leader:                                │
│        → "New task assigned: [task_name]"                       │
│        → Task xuất hiện trong Task List của Store Leader        │
│                                                                 │
│     3. Store Leader có thể:                                     │
│        → Xem chi tiết task                                      │
│        → Phân công cho Staff trong Store                        │
│        → Theo dõi tiến độ thực hiện                             │
│                                                                 │
│  📊 HAI LOẠI STATUS (Phân biệt rõ):                              │
│                                                                 │
│     ┌─────────────────────────────────────────────────────────┐ │
│     │  1. TASK STATUS (Status của toàn bộ task - HQ view)     │ │
│     │     ─────────────────────────────────────────────────── │ │
│     │     • not_yet     = Chưa bắt đầu (mới gửi về stores)    │ │
│     │     • on_progress = Đang thực hiện (≥1 store đang làm)  │ │
│     │     • overdue     = Quá hạn (end_date < today)          │ │
│     │     • done        = Hoàn thành (tất cả stores xong)     │ │
│     │                                                         │ │
│     │     Hiển thị tại: Task List (HQ view)                   │ │
│     │     Logic tính:                                         │ │
│     │     - not_yet: tất cả stores đều not_yet                │ │
│     │     - on_progress: ≥1 store đang on_progress            │ │
│     │     - overdue: end_date < today VÀ chưa done            │ │
│     │     - done: tất cả stores đều completed/unable          │ │
│     │                                                         │ │
│     ├─────────────────────────────────────────────────────────┤ │
│     │  2. STORE STATUS (Status của từng store thực hiện task) │ │
│     │     ─────────────────────────────────────────────────── │ │
│     │     • not_yet     = Chưa bắt đầu (default khi assign)   │ │
│     │     • on_progress = Đang thực hiện                      │ │
│     │     • done        = Hoàn thành                          │ │
│     │     • unable      = Không thể hoàn thành                │ │
│     │                                                         │ │
│     │     Hiển thị tại: Task Detail > Statistics Cards        │ │
│     │     Mỗi store tự cập nhật status của mình               │ │
│     └─────────────────────────────────────────────────────────┘ │
│                                                                 │
│  📈 STATISTICS CARDS (Task Detail - HQ view):                    │
│     ┌──────────────┬──────────────┬──────────────┬────────────┐ │
│     │ Not Started  │  Completed   │    Unable    │  Avg Time  │ │
│     │    (10)      │    (25)      │     (2)      │   2.5h     │ │
│     └──────────────┴──────────────┴──────────────┴────────────┘ │
│     → Not Started: số stores có status = 'not_yet'              │
│     → Completed: số stores có status = 'done'                   │
│     → Unable: số stores có status = 'unable'                    │
│     → Avg Time: thời gian TB từ assign → done                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Database Tables cho Distribution:**

```sql
-- tasks table (thêm field cho overall status)
overall_status ENUM('not_yet', 'on_progress', 'overdue', 'done') DEFAULT 'not_yet'

-- task_store_assignments: Gán task cho từng store
task_id INT
store_id INT
assigned_at TIMESTAMP
status ENUM('not_yet', 'on_progress', 'done', 'unable') DEFAULT 'not_yet'
started_at TIMESTAMP NULL          -- Khi chuyển sang on_progress
completed_at TIMESTAMP NULL        -- Khi chuyển sang done/unable
completed_by INT NULL (staff_id)
unable_reason TEXT NULL            -- Lý do unable (required nếu unable)
notes TEXT NULL

-- Unique constraint: (task_id, store_id)
```

**Status Transition Rules:**

```
TASK STATUS (Overall):
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  [approved] ──dispatch──► [not_yet]                             │
│                              │                                  │
│                              ▼                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ AUTO-CALCULATE từ store statuses:                         │  │
│  │                                                           │  │
│  │ IF all stores = 'not_yet' → task = 'not_yet'              │  │
│  │ IF any store = 'on_progress' → task = 'on_progress'       │  │
│  │ IF end_date < today AND task != 'done' → task = 'overdue' │  │
│  │ IF all stores = 'done' OR 'unable' → task = 'done'        │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

STORE STATUS:
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  [not_yet] ──start──► [on_progress] ──complete──► [done]        │
│      │                      │                                   │
│      │                      └──unable──► [unable]               │
│      │                                                          │
│      └──────────unable──────────────────► [unable]              │
│                                                                 │
│  Transitions allowed:                                           │
│  • not_yet → on_progress (Store bắt đầu làm)                    │
│  • not_yet → unable (Không thể thực hiện ngay từ đầu)           │
│  • on_progress → done (Hoàn thành)                              │
│  • on_progress → unable (Không thể hoàn thành)                  │
│                                                                 │
│  ⚠️ KHÔNG cho phép:                                             │
│  • done → bất kỳ status nào (đã hoàn thành rồi)                 │
│  • unable → bất kỳ status nào (đã kết thúc rồi)                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**API Endpoints liên quan:**

| Action | Endpoint | Description |
|--------|----------|-------------|
| Get Store Tasks | GET /api/v1/stores/{id}/tasks | Lấy danh sách tasks được gán cho store |
| Start Task | POST /api/v1/tasks/{id}/stores/{store_id}/start | Chuyển status → on_progress |
| Complete Task | POST /api/v1/tasks/{id}/stores/{store_id}/complete | Chuyển status → done |
| Mark Unable | POST /api/v1/tasks/{id}/stores/{store_id}/unable | Chuyển status → unable (body: reason) |
| Get Task Store Progress | GET /api/v1/tasks/{id}/progress | Lấy tiến độ task theo từng store |

### 12.5 ON_PROGRESS Status (Store Execution)

> **Status Value**: `on_progress`
> **Applies to**: Task instance & Re-dispatched Library Task (Store Status)
> **Previous Status**: `not_yet` (khi Store bắt đầu làm)
> **Next Status**: `done` (hoàn thành) hoặc `unable` (không thể hoàn thành)

```
┌─────────────────────────────────────────────────────────────────┐
│  ON_PROGRESS STATUS - STORE TASK EXECUTION                      │
│                                                                 │
│  📋 TRIGGER: Sau khi HQ Approver click "Approve"                │
│     → Task được giao về các Stores trong Scope                  │
│     → Mỗi Store nhận 1 "assignment" riêng                       │
│                                                                 │
│  ═══════════════════════════════════════════════════════════════│
│  📊 HAI LOẠI STATUS - PHÂN BIỆT RÕ RÀNG                         │
│  ═══════════════════════════════════════════════════════════════│
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  1️⃣ TASK STATUS (Trạng thái tổng thể - HQ View)             ││
│  │  ────────────────────────────────────────────────────────── ││
│  │                                                             ││
│  │  📍 Định nghĩa: Trạng thái của TOÀN BỘ task nhìn từ HQ      ││
│  │  📍 Hiển thị tại: Task List (HQ), Task Detail Header        ││
│  │  📍 Tính toán: AUTO-CALCULATE từ tất cả Store Statuses      ││
│  │                                                             ││
│  │  Các giá trị:                                               ││
│  │  ┌──────────────┬───────────────────────────────────────┐   ││
│  │  │ Status       │ Điều kiện                             │   ││
│  │  ├──────────────┼───────────────────────────────────────┤   ││
│  │  │ not_yet      │ TẤT CẢ stores = 'not_yet'             │   ││
│  │  │ on_progress  │ ÍT NHẤT 1 store = 'on_progress'       │   ││
│  │  │ overdue      │ end_date < today VÀ task ≠ 'done'     │   ││
│  │  │ done         │ TẤT CẢ stores = 'done' HOẶC 'unable'  │   ││
│  │  └──────────────┴───────────────────────────────────────┘   ││
│  │                                                             ││
│  │  Badge Colors:                                              ││
│  │  • not_yet     → Gray (#6B7280)                             ││
│  │  • on_progress → Blue (#3B82F6)                             ││
│  │  • overdue     → Red (#EF4444)                              ││
│  │  • done        → Green (#10B981)                            ││
│  │                                                             ││
│  ├─────────────────────────────────────────────────────────────┤│
│  │  2️⃣ STORE STATUS (Trạng thái từng Store - Store View)        ││
│  │  ────────────────────────────────────────────────────────── ││
│  │                                                             ││
│  │  📍 Định nghĩa: Trạng thái thực hiện task của TỪNG store    ││
│  │  📍 Hiển thị tại: Task Detail > Statistics Cards,           ││
│  │                   Store's Task List, Store Progress Table   ││
│  │  📍 Cập nhật bởi: Store Leader hoặc Staff được assign       ││
│  │                                                             ││
│  │  Các giá trị:                                               ││
│  │  ┌──────────────┬───────────────────────────────────────┐   ││
│  │  │ Status       │ Ý nghĩa                               │   ││
│  │  ├──────────────┼───────────────────────────────────────┤   ││
│  │  │ not_yet      │ Chưa bắt đầu (default khi assign)     │   ││
│  │  │ on_progress  │ Đang thực hiện                        │   ││
│  │  │ done         │ Đã hoàn thành                         │   ││
│  │  │ unable       │ Không thể thực hiện (cần ghi lý do)   │   ││
│  │  └──────────────┴───────────────────────────────────────┘   ││
│  │                                                             ││
│  │  Badge Colors:                                              ││
│  │  • not_yet     → Gray (#6B7280)                             ││
│  │  • on_progress → Blue (#3B82F6)                             ││
│  │  • done        → Green (#10B981)                            ││
│  │  • unable      → Orange (#F59E0B)                           ││
│  │                                                             ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ═══════════════════════════════════════════════════════════════│
│  🔄 STORE STATUS TRANSITIONS (Luồng chuyển trạng thái)         │
│  ═══════════════════════════════════════════════════════════════│
│                                                                 │
│     ┌─────────────────────────────────────────────────────────┐ │
│     │                                                         │ │
│     │         ┌──────────┐                                    │ │
│     │         │ not_yet  │ ← Default khi task được assign     │ │
│     │         └────┬─────┘                                    │ │
│     │              │                                          │ │
│     │      ┌───────┴───────┐                                  │ │
│     │      │               │                                  │ │
│     │      ▼               ▼                                  │ │
│     │ ┌───────────┐   ┌──────────┐                            │ │
│     │ │on_progress│   │  unable  │ ← Không thể làm từ đầu     │ │
│     │ └────┬──────┘   └──────────┘                            │ │
│     │      │               ▲                                  │ │
│     │      ├───────────────┘                                  │ │
│     │      │                                                  │ │
│     │      ▼                                                  │ │
│     │ ┌──────────┐                                            │ │
│     │ │   done   │ ← Hoàn thành                               │ │
│     │ └──────────┘                                            │ │
│     │                                                         │ │
│     │  ✅ ALLOWED TRANSITIONS:                                │ │
│     │     • not_yet → on_progress (Bắt đầu làm)               │ │
│     │     • not_yet → unable (Không thể làm ngay từ đầu)      │ │
│     │     • on_progress → done (Hoàn thành)                   │ │
│     │     • on_progress → unable (Không thể hoàn thành)       │ │
│     │                                                         │ │
│     │  ❌ FORBIDDEN TRANSITIONS:                              │ │
│     │     • done → ANY (Đã hoàn thành, không thể đổi)         │ │
│     │     • unable → ANY (Đã kết thúc, không thể đổi)         │ │
│     │                                                         │ │
│     └─────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ═══════════════════════════════════════════════════════════════│
│  👥 STORE ORGANIZATION & PERMISSIONS (Cơ cấu tổ chức Store)      │
│  ═══════════════════════════════════════════════════════════════│
│                                                                 │
│     ┌─────────────────────────────────────────────────────────┐ │
│     │  CƠ CẤU TỔ CHỨC STORE (S7 → S1):                        │ │
│     │                                                         │ │
│     │  ┌─────────────────────────────────────────────────────┐│ │
│     │  │ 🏢 REGIONAL MANAGEMENT (Quản lý vùng - S7-S5)       ││ │
│     │  │    Chủ yếu: Giám sát tổng quát theo phạm vi địa lý  ││ │
│     │  ├─────────────────────────────────────────────────────┤│ │
│     │  │                                                     ││ │
│     │  │  S7 - Region Manager                                ││ │
│     │  │      → Quản lý 1 REGION (nhiều Zones)               ││ │
│     │  │      → Scope: Tất cả stores trong Region            ││ │
│     │  │       ↓                                             ││ │
│     │  │  S6 - Zone Manager                                  ││ │
│     │  │      → Quản lý 1 hoặc nhiều ZONES                   ││ │
│     │  │      → Scope: Tất cả stores trong Zone(s)           ││ │
│     │  │       ↓                                             ││ │
│     │  │  S5 - Area Manager                                  ││ │
│     │  │      → Quản lý 1 hoặc nhiều AREAS                   ││ │
│     │  │      → Scope: Tất cả stores trong Area(s)           ││ │
│     │  │                                                     ││ │
│     │  └─────────────────────────────────────────────────────┘│ │
│     │                      ↓                                  │ │
│     │  ┌─────────────────────────────────────────────────────┐│ │
│     │  │ 🏪 STORE MANAGEMENT (Quản lý cửa hàng - S4-S2)      ││ │
│     │  │    Chủ yếu: Thực hiện task, giao việc cho staff     ││ │
│     │  ├─────────────────────────────────────────────────────┤│ │
│     │  │                                                     ││ │
│     │  │  S4 - SI (Store In-charge)                          ││ │
│     │  │      → Quản lý từ 2 STORES trở lên                  ││ │
│     │  │      → Có thể giao task cho S1                      ││ │
│     │  │       ↓                                             ││ │
│     │  │  S3 - Store Leader                                  ││ │
│     │  │      → Quản lý 1 STORE                              ││ │
│     │  │      → Người chịu trách nhiệm chính của store       ││ │
│     │  │      → Có thể giao task cho S1                      ││ │
│     │  │       ↓                                             ││ │
│     │  │  S2 - Deputy Store Leader (Phó Store Leader)        ││ │
│     │  │      → Phó của S3, quyền hạn tương đương S3         ││ │
│     │  │      → Thấp hơn S3 về mặt cấp bậc                   ││ │
│     │  │      → Có thể giao task cho S1                      ││ │
│     │  │                                                     ││ │
│     │  └─────────────────────────────────────────────────────┘│ │
│     │                      ↓                                  │ │
│     │  ┌─────────────────────────────────────────────────────┐│ │
│     │  │ 👷 STORE STAFF (Nhân viên cửa hàng - S1)            ││ │
│     │  ├─────────────────────────────────────────────────────┤│ │
│     │  │                                                     ││ │
│     │  │  S1 - Staff                                         ││ │
│     │  │      → Nhân viên thực hiện task                     ││ │
│     │  │      → Được S2/S3/S4 giao việc                      ││ │
│     │  │      → Thực hiện và báo cáo kết quả                 ││ │
│     │  │                                                     ││ │
│     │  └─────────────────────────────────────────────────────┘│ │
│     │                                                         │ │
│     └─────────────────────────────────────────────────────────┘ │
│                                                                 │
│     📊 PHÂN LOẠI THEO CHỨC NĂNG:                                 │
│                                                                 │
│     ┌──────────────────┬─────────────────────────────────────┐  │
│     │ Nhóm             │ Grades │ Chức năng chính            │  │
│     ├──────────────────┼────────┼────────────────────────────┤  │
│     │ Regional Mgmt    │ S7-S5  │ Giám sát tổng quát,        │  │
│     │                  │        │ xem báo cáo theo vùng      │  │
│     ├──────────────────┼────────┼────────────────────────────┤  │
│     │ Store Leaders    │ S4-S2  │ Nhận task, giao việc,      │  │
│     │                  │        │ thực hiện, báo cáo         │  │
│     ├──────────────────┼────────┼────────────────────────────┤  │
│     │ Staff            │ S1     │ Thực hiện task được giao   │  │
│     └──────────────────┴────────┴────────────────────────────┘  │
│                                                                 │
│     PERMISSIONS BY GRADE:                                       │
│     ┌──────────────────┬───────┬───────┬───────┬───────┬──────┐│
│     │ Action           │ S7-S5 │ S4    │ S3    │ S2    │ S1   ││
│     │                  │ Reg.  │ SI    │ Lead  │ Deputy│ Staff││
│     ├──────────────────┼───────┼───────┼───────┼───────┼──────┤│
│     │ View All Tasks   │ ✅*   │ ✅    │ ✅    │ ✅    │ ❌   ││
│     │ View Assigned    │ ✅    │ ✅    │ ✅    │ ✅    │ ✅   ││
│     │ Assign to Staff  │ ❌    │ ✅    │ ✅    │ ✅    │ ❌   ││
│     │ Start Task       │ ❌    │ ✅    │ ✅    │ ✅    │ ✅** ││
│     │ Complete Task    │ ❌    │ ✅    │ ✅    │ ✅    │ ✅** ││
│     │ Mark Unable      │ ❌    │ ✅    │ ✅    │ ✅    │ ✅** ││
│     │ Add Comment      │ ✅    │ ✅    │ ✅    │ ✅    │ ✅   ││
│     │ Upload Evidence  │ ❌    │ ✅    │ ✅    │ ✅    │ ✅** ││
│     │ View Reports     │ ✅    │ ✅    │ ✅    │ ✅    │ ❌   ││
│     └──────────────────┴───────┴───────┴───────┴───────┴──────┘│
│                                                                 │
│     * S7-S5: View tasks trong scope quản lý (Region/Zone/Area) │
│     ** S1: Chỉ với tasks được assign cho họ                    │
│                                                                 │
│  ═══════════════════════════════════════════════════════════════│
│  👤 TASK ASSIGNMENT WITHIN STORE (Giao việc trong Store)         │
│  ═══════════════════════════════════════════════════════════════│
│                                                                 │
│     📋 KHÁI NIỆM:                                                │
│        → Store Leaders (S4/S3/S2) có thể giao task cho Staff   │
│        → Nếu KHÔNG giao → Store Leader tự làm                   │
│        → Nếu CÓ giao → S1 được assign sẽ thực hiện              │
│                                                                 │
│     ┌─────────────────────────────────────────────────────────┐ │
│     │  ASSIGNMENT FLOW:                                       │ │
│     │                                                         │ │
│     │  Task được giao về Store                                │ │
│     │       │                                                 │ │
│     │       ▼                                                 │ │
│     │  ┌──────────────────────────────────────────────────┐   │ │
│     │  │ Store Leader (S4/S3/S2) nhận task               │   │ │
│     │  │ assigned_to = NULL (chưa giao cho ai)            │   │ │
│     │  │ executor = Store Leader (default)                │   │ │
│     │  └──────────────────────────────────────────────────┘   │ │
│     │       │                                                 │ │
│     │       ├─── Option A: TỰ LÀM ────────────────────────┐   │ │
│     │       │                                             │   │ │
│     │       │    → Store Leader tự thực hiện              │   │ │
│     │       │    → assigned_to = NULL                     │   │ │
│     │       │    → completed_by = Store Leader            │   │ │
│     │       │                                             │   │ │
│     │       ├─── Option B: GIAO cho Staff ────────────────┤   │ │
│     │       │                                             │   │ │
│     │       ▼                                             ▼   │ │
│     │  ┌──────────────────────────────────────────────────┐   │ │
│     │  │ Store Leader click "Assign to Staff"            │   │ │
│     │  │ → Chọn Staff (S1) từ danh sách                  │   │ │
│     │  │ → SET assigned_to = selected_staff_id           │   │ │
│     │  │ → Notify Staff được giao                        │   │ │
│     │  └──────────────────────────────────────────────────┘   │ │
│     │       │                                                 │ │
│     │       ▼                                                 │ │
│     │  ┌──────────────────────────────────────────────────┐   │ │
│     │  │ Staff (S1) thực hiện task                        │   │ │
│     │  │ → Có thể Start, Complete task                    │   │ │
│     │  │ → Có thể Upload Evidence                         │   │ │
│     │  │ → Có thể Mark Unable (khi được assign)           │   │ │
│     │  │ → completed_by = Staff đó                        │   │ │
│     │  └──────────────────────────────────────────────────┘   │ │
│     │                                                         │ │
│     └─────────────────────────────────────────────────────────┘ │
│                                                                 │
│     📌 ASSIGNMENT RULES:                                         │
│                                                                 │
│     1. AI CÓ QUYỀN ASSIGN:                                     │
│        → S4 (SI), S3 (Store Leader), S2 (Deputy)               │
│        → S7-S5 KHÔNG trực tiếp assign (chỉ giám sát)           │
│                                                                 │
│     2. ASSIGN CHO AI:                                          │
│        → Chỉ assign cho S1 (Staff)                             │
│        → S2/S3/S4 tự làm hoặc giao cho S1                      │
│                                                                 │
│     3. REASSIGN / UNASSIGN:                                    │
│        → Có thể đổi người hoặc thu hồi bất kỳ lúc nào          │
│        → Trước khi task được Complete/Unable                   │
│                                                                 │
│     4. SAU KHI ASSIGN, STAFF (S1) SẼ:                          │
│        → Thấy task trong "My Tasks" của họ                     │
│        → Nhận notification về task được giao                   │
│        → Có quyền Start, Complete, Upload Evidence, Mark Unable│
│                                                                 │
│     🔄 REASSIGN / UNASSIGN:                                      │
│                                                                 │
│     ┌─────────────────────────────────────────────────────────┐ │
│     │  Điều kiện cho phép Reassign/Unassign:                  │ │
│     │                                                         │ │
│     │  ✅ Được phép khi:                                       │ │
│     │     • store_status = 'not_yet'                          │ │
│     │     • store_status = 'on_progress'                      │ │
│     │                                                         │ │
│     │  ❌ KHÔNG được phép khi:                                 │ │
│     │     • store_status = 'done' (đã hoàn thành)             │ │
│     │     • store_status = 'unable' (đã đánh dấu unable)      │ │
│     │                                                         │ │
│     │  Actions:                                               │ │
│     │  • REASSIGN: Đổi từ Staff A → Staff B                   │ │
│     │    → Notify Staff A: "Task [name] đã được giao cho      │ │
│     │      người khác"                                        │ │
│     │    → Notify Staff B: "Bạn được giao task [name]"        │ │
│     │                                                         │ │
│     │  • UNASSIGN: Thu hồi về Store Leader tự làm             │ │
│     │    → SET assigned_to = NULL                             │ │
│     │    → Notify Staff: "Task [name] đã được thu hồi"        │ │
│     └─────────────────────────────────────────────────────────┘ │
│                                                                 │
│     👁️ VISIBILITY RULES (Ai thấy task nào):                     │
│                                                                 │
│     ┌──────────────────┬─────────────────────────────────────┐  │
│     │ User             │ Thấy những tasks nào                │  │
│     ├──────────────────┼─────────────────────────────────────┤  │
│     │ S7 (Region Mgr)  │ Tasks của TẤT CẢ stores trong Region│  │
│     │ S6 (Zone Mgr)    │ Tasks của TẤT CẢ stores trong Zone  │  │
│     │ S5 (Area Mgr)    │ Tasks của TẤT CẢ stores trong Area  │  │
│     ├──────────────────┼─────────────────────────────────────┤  │
│     │ S4 (SI)          │ Tasks của các stores quản lý (2+)   │  │
│     │ S3 (Store Lead)  │ TẤT CẢ tasks của store mình quản lý │  │
│     │ S2 (Deputy)      │ TẤT CẢ tasks của store (như S3)     │  │
│     ├──────────────────┼─────────────────────────────────────┤  │
│     │ S1 (Staff)       │ CHỈ tasks được assign cho họ        │  │
│     └──────────────────┴─────────────────────────────────────┘  │
│                                                                 │
│     📊 UI DISPLAY (Task List tại Store):                         │
│                                                                 │
│     ┌─────────────────────────────────────────────────────────┐ │
│     │ Task Name          │ Assigned To    │ Status │ Actions  │ │
│     ├────────────────────┼────────────────┼────────┼──────────┤ │
│     │ Kiểm kê hàng Q1    │ Nguyễn Văn A   │ 🔵     │ [View]   │ │
│     │ Trưng bày SP mới   │ -- (Chưa giao) │ ⚪     │ [Assign] │ │
│     │ Báo cáo doanh thu  │ Trần Thị B     │ ✅     │ [View]   │ │
│     └─────────────────────────────────────────────────────────┘ │
│                                                                 │
│     Legend:                                                    │
│     • "-- (Chưa giao)" = Store Leader (S4/S3/S2) tự làm        │
│     • Hiển thị tên Staff (S1) nếu đã assign                    │
│     • Button [Assign] chỉ hiện cho S4/S3/S2 với tasks chưa giao│
│                                                                 │
│  ═══════════════════════════════════════════════════════════════│
│  📱 STORE TASK LIST VIEW (Màn hình Task List tại Store)          │
│  ═══════════════════════════════════════════════════════════════│
│                                                                 │
│     ┌─────────────────────────────────────────────────────────┐ │
│     │  TASK LIST (Store View)                    [Filter ▼]   │ │
│     ├─────────────────────────────────────────────────────────┤ │
│     │                                                         │ │
│     │  📋 Tasks được sắp xếp theo ưu tiên:                    │ │
│     │                                                         │ │
│     │  1. OVERDUE (Quá hạn) - Đỏ                              │ │
│     │     → end_date < today VÀ status ≠ done/unable          │ │
│     │                                                         │ │
│     │  2. NOT YET (Chưa bắt đầu) - Xám                        │ │
│     │     → status = 'not_yet', sắp theo start_date ASC       │ │
│     │                                                         │ │
│     │  3. ON PROGRESS (Đang làm) - Xanh dương                 │ │
│     │     → status = 'on_progress', sắp theo end_date ASC     │ │
│     │                                                         │ │
│     │  4. DONE (Hoàn thành) - Xanh lá                         │ │
│     │     → status = 'done', sắp theo completed_at DESC       │ │
│     │                                                         │ │
│     │  5. UNABLE (Không thể làm) - Cam                        │ │
│     │     → status = 'unable', sắp theo completed_at DESC     │ │
│     │                                                         │ │
│     └─────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ═══════════════════════════════════════════════════════════════│
│  📝 TASK EXECUTION ACTIONS (Các hành động thực hiện Task)        │
│  ═══════════════════════════════════════════════════════════════│
│                                                                 │
│     1️⃣ START TASK (Bắt đầu thực hiện)                           │
│     ──────────────────────────────────────────────────────────  │
│     Trigger: Store user click "Start" button                   │
│     Conditions:                                                │
│       • Current store_status = 'not_yet'                       │
│       • User có quyền:                                         │
│         - S4/S3/S2: Luôn được phép (Store Leaders)             │
│         - S1: Chỉ khi task được assign cho họ                  │
│     Actions:                                                   │
│       • SET store_status = 'on_progress'                       │
│       • SET started_at = NOW()                                 │
│       • SET started_by = current_user_id                       │
│       • Recalculate task overall_status                        │
│     API: POST /api/v1/tasks/{id}/stores/{store_id}/start       │
│                                                                │
│     2️⃣ COMPLETE TASK (Hoàn thành)                              │
│     ──────────────────────────────────────────────────────────  │
│     Trigger: Store user click "Complete" button                │
│     Conditions:                                                │
│       • Current store_status = 'on_progress'                   │
│       • User có quyền:                                         │
│         - S4/S3/S2: Luôn được phép (Store Leaders)             │
│         - S1: Chỉ khi task được assign cho họ                  │
│       • (Optional) Evidence uploaded nếu task yêu cầu          │
│     Actions:                                                   │
│       • SET store_status = 'done'                              │
│       • SET completed_at = NOW()                               │
│       • SET completed_by = current_user_id                     │
│       • Recalculate task overall_status                        │
│       • Notify HQ nếu tất cả stores đã done                    │
│     API: POST /api/v1/tasks/{id}/stores/{store_id}/complete    │
│                                                                 │
│     3️⃣ MARK UNABLE (Đánh dấu không thể thực hiện)               │
│     ──────────────────────────────────────────────────────────  │
│     Trigger: Store user click "Unable to Complete" button      │
│     Conditions:                                                │
│       • Current store_status = 'not_yet' OR 'on_progress'      │
│       • User có quyền:                                         │
│         - S4/S3/S2: Luôn được phép (Store Leaders)             │
│         - S1: Chỉ khi task được assign cho họ                  │
│       • Reason is REQUIRED (bắt buộc nhập lý do)               │
│     Actions:                                                   │
│       • SET store_status = 'unable'                            │
│       • SET completed_at = NOW()                               │
│       • SET completed_by = current_user_id                     │
│       • SET unable_reason = [input reason]                     │
│       • Recalculate task overall_status                        │
│       • Notify HQ về unable status                             │
│     API: POST /api/v1/tasks/{id}/stores/{store_id}/unable      │
│           Body: { "reason": "..." }                            │
│                                                                 │
│     ┌─────────────────────────────────────────────────────────┐ │
│     │  UNABLE REASONS (Các lý do phổ biến):                   │ │
│     │                                                         │ │
│     │  • Thiếu nhân sự / Staff shortage                       │ │
│     │  • Thiếu thiết bị / Equipment unavailable               │ │
│     │  • Điều kiện thời tiết / Weather conditions             │ │
│     │  • Store đóng cửa tạm thời / Store temporarily closed   │ │
│     │  • Hàng hóa chưa về / Products not arrived              │ │
│     │  • Lý do khác / Other (phải ghi rõ)                     │ │
│     └─────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ═══════════════════════════════════════════════════════════════│
│  📊 STATISTICS CARDS (Task Detail - HQ View)                     │
│  ═══════════════════════════════════════════════════════════════│
│                                                                 │
│     ┌───────────────────────────────────────────────────────┐   │
│     │  TASK: "Kiểm kê hàng hóa Q1"         Status: ON_PROGRESS│   │
│     ├───────────────────────────────────────────────────────┤   │
│     │                                                       │   │
│     │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐      │   │
│     │  │Not Yet  │ │Completed│ │ Unable  │ │Avg Time │      │   │
│     │  │   10    │ │   25    │ │    2    │ │  2.5h   │      │   │
│     │  │ stores  │ │ stores  │ │ stores  │ │         │      │   │
│     │  └─────────┘ └─────────┘ └─────────┘ └─────────┘      │   │
│     │                                                       │   │
│     │  Total Stores: 37 | Progress: 73% (27/37 finished)    │   │
│     └───────────────────────────────────────────────────────┘   │
│                                                                 │
│     Calculation:                                                │
│     • Not Yet: COUNT WHERE store_status = 'not_yet'            │
│     • Completed: COUNT WHERE store_status = 'done'             │
│     • Unable: COUNT WHERE store_status = 'unable'              │
│     • Avg Time: AVG(completed_at - started_at) WHERE done      │
│     • Progress: (done + unable) / total * 100%                 │
│                                                                 │
│  ═══════════════════════════════════════════════════════════════│
│  📈 STORE PROGRESS TABLE (Chi tiết tiến độ từng Store)           │
│  ═══════════════════════════════════════════════════════════════│
│                                                                 │
│     ┌─────────────────────────────────────────────────────────┐ │
│     │ Store Progress                              [Export ▼]  │ │
│     ├──────┬────────────┬──────────┬──────────┬──────────────┤ │
│     │ #    │ Store      │ Status   │ Time     │ Completed By │ │
│     ├──────┼────────────┼──────────┼──────────┼──────────────┤ │
│     │ 1    │ Store A    │ ✅ Done  │ 2.5h     │ Nguyen Van A │ │
│     │ 2    │ Store B    │ ✅ Done  │ 1.8h     │ Tran Thi B   │ │
│     │ 3    │ Store C    │ 🔵 Progress│ -      │ -            │ │
│     │ 4    │ Store D    │ ⚪ Not Yet│ -       │ -            │ │
│     │ 5    │ Store E    │ 🟠 Unable│ -        │ Le Van C     │ │
│     │      │            │ Reason: Thiếu nhân sự              │ │
│     └──────┴────────────┴──────────┴──────────┴──────────────┘ │
│                                                                 │
│     Features:                                                  │
│     • Sortable by: Store name, Status, Time, Completed date   │
│     • Filterable by: Status, Region, Zone, Area               │
│     • Exportable: CSV, Excel                                  │
│     • Click row → View store's task detail                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Database Schema cho Store Task Execution:**

```sql
-- task_store_assignments: Gán task cho từng store
CREATE TABLE task_store_assignments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    task_id BIGINT NOT NULL,
    store_id BIGINT NOT NULL,

    -- Status tracking
    status ENUM('not_yet', 'on_progress', 'done', 'unable') DEFAULT 'not_yet',

    -- Timestamps
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    started_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,

    -- User tracking (HQ → Store)
    assigned_by BIGINT NULL,          -- HQ user who dispatched task to store

    -- User tracking (Within Store)
    assigned_to_staff BIGINT NULL,    -- Staff được Store Leader giao việc (NULL = S6 tự làm)
    assigned_to_at TIMESTAMP NULL,    -- Thời điểm giao việc cho staff

    -- Execution tracking
    started_by BIGINT NULL,           -- Store user who started (S6 hoặc Staff được giao)
    completed_by BIGINT NULL,         -- Store user who completed/marked unable

    -- Unable specific
    unable_reason TEXT NULL,          -- Required if status = 'unable'

    -- Additional info
    notes TEXT NULL,

    -- Constraints
    UNIQUE KEY unique_task_store (task_id, store_id),
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
    FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,

    INDEX idx_task_status (task_id, status),
    INDEX idx_store_status (store_id, status)
);

-- task_execution_logs: Log chi tiết các actions
CREATE TABLE task_execution_logs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    task_store_assignment_id BIGINT NOT NULL,

    action ENUM('dispatched', 'assigned_to_staff', 'reassigned', 'unassigned', 'started', 'completed', 'marked_unable') NOT NULL,
    performed_by BIGINT NOT NULL,
    performed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    old_status VARCHAR(20) NULL,
    new_status VARCHAR(20) NULL,
    notes TEXT NULL,

    FOREIGN KEY (task_store_assignment_id) REFERENCES task_store_assignments(id) ON DELETE CASCADE,
    INDEX idx_assignment (task_store_assignment_id),
    INDEX idx_performed_at (performed_at)
);
```

**API Endpoints cho Store Task Execution:**

| Action | Method | Endpoint | Description | Permission |
|--------|--------|----------|-------------|------------|
| Get Store's Tasks | GET | `/api/v1/stores/{store_id}/tasks` | Lấy danh sách tasks của store | S1-S7 |
| Get My Tasks | GET | `/api/v1/stores/{store_id}/tasks/my` | Tasks được assign cho current user | S1-S4 |
| Get Task Detail | GET | `/api/v1/tasks/{id}/stores/{store_id}` | Chi tiết task tại store | S1-S7 |
| **Assign to Staff** | POST | `/api/v1/tasks/{id}/stores/{store_id}/assign` | Giao task cho S1 | **S4-S2 only** |
| **Reassign** | PUT | `/api/v1/tasks/{id}/stores/{store_id}/assign` | Đổi người thực hiện | **S4-S2 only** |
| **Unassign** | DELETE | `/api/v1/tasks/{id}/stores/{store_id}/assign` | Thu hồi về Leader tự làm | **S4-S2 only** |
| Start Task | POST | `/api/v1/tasks/{id}/stores/{store_id}/start` | Bắt đầu thực hiện | S4-S2 hoặc S1 được assign |
| Complete Task | POST | `/api/v1/tasks/{id}/stores/{store_id}/complete` | Hoàn thành task | S4-S2 hoặc S1 được assign |
| Mark Unable | POST | `/api/v1/tasks/{id}/stores/{store_id}/unable` | Đánh dấu không thể làm | S4-S2 hoặc S1 được assign |
| Get Progress | GET | `/api/v1/tasks/{id}/progress` | Tiến độ tất cả stores | HQ + S7-S5 |
| Add Evidence | POST | `/api/v1/tasks/{id}/stores/{store_id}/evidence` | Upload ảnh/file kết quả | S4-S1 |

**Assign to Staff - Request Body:**

```json
POST /api/v1/tasks/{id}/stores/{store_id}/assign
{
  "staff_id": 123  // ID của staff được giao (S1 only)
}
```

**Assign to Staff - Response:**

```json
{
  "success": true,
  "message": "Task assigned to Nguyen Van A",
  "data": {
    "task_id": 1,
    "store_id": 5,
    "assigned_to_staff": 123,
    "assigned_to_name": "Nguyen Van A",
    "assigned_to_at": "2024-01-15T10:30:00Z"
  }
}
```

**Permission Logic cho Start/Complete/Mark Unable:**

```
ON START, COMPLETE, or MARK UNABLE action:

1. GET task_store_assignment WHERE task_id AND store_id
2. CHECK current_user permission:

   IF assigned_to_staff IS NULL:
       // Chưa giao cho ai → Store Leader tự làm
       → ALLOW if current_user.job_grade IN (S4, S3, S2)
       → DENY if current_user.job_grade = S1 (Staff không tự nhận task)

   ELSE:
       // Đã giao cho S1 staff
       IF current_user.id = assigned_to_staff:
           → ALLOW (S1 được giao - có thể Start, Complete, Mark Unable)
       ELSE IF current_user.job_grade IN (S4, S3, S2):
           → ALLOW (Store Leader có thể override)
       ELSE:
           → DENY "This task is assigned to another staff"
```

**Task Status Auto-Calculation Logic:**

```
ON ANY STORE STATUS CHANGE:

1. GET all store_statuses for this task_id
2. CALCULATE new overall_status:

   IF all stores = 'not_yet':
       overall_status = 'not_yet'

   ELSE IF any store = 'on_progress':
       overall_status = 'on_progress'

   ELSE IF all stores IN ('done', 'unable'):
       overall_status = 'done'

   ELSE:
       overall_status = 'on_progress'  // Mixed states

3. CHECK overdue:
   IF end_date < TODAY AND overall_status NOT IN ('done'):
       overall_status = 'overdue'

4. UPDATE tasks SET overall_status = [calculated]

5. NOTIFY if needed:
   IF overall_status changed to 'done':
       → Notify task creator
       → Notify approvers
```

**Notifications cho Store Execution:**

| Event | Recipients | Message |
|-------|------------|---------|
| Task assigned to store | Store Leader (S6) | "New task assigned: [task_name]" |
| **S6 assigned task to staff** | Staff được giao | "You have been assigned: [task_name]" |
| **S6 reassigned task** | Staff cũ | "Task [task_name] has been reassigned to another staff" |
| **S6 reassigned task** | Staff mới | "You have been assigned: [task_name]" |
| **S6 unassigned task** | Staff bị thu hồi | "Task [task_name] has been unassigned from you" |
| Store started task | Task creator (HQ) | "[store_name] started: [task_name]" |
| Store completed task | Task creator (HQ) | "[store_name] completed: [task_name]" |
| Store marked unable | Task creator + Approver | "[store_name] unable to complete: [task_name]. Reason: [reason]" |
| All stores completed | Task creator + Approver | "Task completed by all stores: [task_name]" |
| Task overdue | Store Leaders (not done) + Staff được giao | "Task overdue: [task_name]" |

### 12.6 OVERDUE Status

> **Status Value**: `overdue`
> **Applies to**: One-Time Task & Dispatched Library Task (Task Overall Status)
> **Condition**: `end_date < today` VÀ task chưa `done`
> **Auto-calculated**: System tự động set khi điều kiện thỏa mãn

```
┌─────────────────────────────────────────────────────────────────┐
│  OVERDUE STATUS - TASK QUÁ HẠN                                  │
│                                                                 │
│  📋 ĐỊNH NGHĨA:                                                  │
│     → Task có end_date < today (ngày hiện tại)                  │
│     → VÀ task chưa hoàn thành (overall_status ≠ 'done')         │
│     → Status này được AUTO-CALCULATE bởi system                 │
│                                                                 │
│  🔄 CÁCH TÍNH TOÁN:                                              │
│                                                                 │
│     ON DAILY CRON (hoặc on-demand check):                       │
│     ┌─────────────────────────────────────────────────────────┐ │
│     │  IF end_date < TODAY:                                   │ │
│     │     IF overall_status NOT IN ('done'):                  │ │
│     │        → SET overall_status = 'overdue'                 │ │
│     │        → Trigger overdue notifications                  │ │
│     └─────────────────────────────────────────────────────────┘ │
│                                                                 │
│  📧 OVERDUE NOTIFICATIONS:                                       │
│                                                                 │
│     Recipients:                                                │
│     • Task Creator (HQ)                                        │
│     • Approver                                                 │
│     • Store Leaders của các stores chưa hoàn thành             │
│     • Staff được giao (nếu có)                                 │
│                                                                 │
│     Message:                                                   │
│     "Task [task_name] is overdue. End date was [end_date]."    │
│                                                                 │
│  🎨 UI DISPLAY:                                                  │
│                                                                 │
│     Badge Color: Red (#EF4444)                                 │
│     Priority: Cao nhất trong các task đang thực hiện           │
│     Position: Hiển thị đầu tiên trong Task List (sau Draft     │
│               và Approve)                                      │
│                                                                 │
│  📊 STATISTICS (Task Detail - HQ View):                          │
│                                                                 │
│     Hiển thị thêm:                                             │
│     • Days Overdue: Số ngày quá hạn (today - end_date)         │
│     • Stores Not Completed: Danh sách stores chưa xong         │
│                                                                 │
│  ⚠️ LƯU Ý:                                                       │
│     → Overdue KHÔNG phải là trạng thái cuối cùng               │
│     → Task vẫn có thể được hoàn thành sau khi overdue          │
│     → Khi tất cả stores done/unable → chuyển sang 'done'       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Overdue Check Logic:**

```
ON DAILY SCHEDULER (hoặc API call):
1. GET all tasks WHERE:
   - overall_status NOT IN ('done', 'draft', 'approve')
   - end_date < TODAY
   - overall_status != 'overdue'  // Chưa được mark overdue
2. FOR EACH task:
   a. SET overall_status = 'overdue'
   b. CREATE notification for stakeholders
   c. LOG overdue event

ON STORE STATUS CHANGE (while task is overdue):
1. IF all stores IN ('done', 'unable'):
   → SET overall_status = 'done' (kể cả khi đã overdue)
2. ELSE:
   → Keep overall_status = 'overdue'
```

### 12.7 DONE Status

> **Status Value**: `done`
> **Applies to**: One-Time Task & Dispatched Library Task (Task Overall Status)
> **Condition**: Tất cả stores đã `done` hoặc `unable`
> **Final Status**: Đây là trạng thái cuối cùng của task

```
┌─────────────────────────────────────────────────────────────────┐
│  DONE STATUS - TASK HOÀN THÀNH                                  │
│                                                                 │
│  📋 ĐỊNH NGHĨA:                                                  │
│     → TẤT CẢ stores đã hoàn thành (done) hoặc unable            │
│     → Không còn store nào ở status 'not_yet' hoặc 'on_progress' │
│     → Đây là FINAL STATUS - không thể thay đổi sau khi done     │
│                                                                 │
│  🔄 CÁCH TÍNH TOÁN:                                              │
│                                                                 │
│     ON ANY STORE STATUS CHANGE:                                 │
│     ┌─────────────────────────────────────────────────────────┐ │
│     │  GET all store_statuses for task                        │ │
│     │                                                         │ │
│     │  IF all stores IN ('done', 'unable'):                   │ │
│     │     → SET overall_status = 'done'                       │ │
│     │     → Trigger completion notifications                  │ │
│     │     → Calculate final statistics                        │ │
│     └─────────────────────────────────────────────────────────┘ │
│                                                                 │
│  📧 COMPLETION NOTIFICATIONS:                                    │
│                                                                 │
│     Recipients:                                                │
│     • Task Creator (HQ)                                        │
│     • Approver                                                 │
│                                                                 │
│     Message:                                                   │
│     "Task [task_name] has been completed by all stores."       │
│                                                                 │
│  🎨 UI DISPLAY:                                                  │
│                                                                 │
│     Badge Color: Green (#10B981)                               │
│     Priority: Thấp nhất (hiển thị cuối trong Task List)        │
│                                                                 │
│  📊 FINAL STATISTICS (Task Detail - HQ View):                    │
│                                                                 │
│     ┌──────────────┬──────────────┬──────────────┬────────────┐ │
│     │  Completed   │    Unable    │  Avg Time    │ Total Time │ │
│     │    (25)      │     (2)      │   2.5h       │   3 days   │ │
│     └──────────────┴──────────────┴──────────────┴────────────┘ │
│                                                                 │
│     • Completed: Số stores có status = 'done'                  │
│     • Unable: Số stores có status = 'unable'                   │
│     • Avg Time: Thời gian TB từ start → complete (done only)   │
│     • Total Time: Tổng thời gian từ dispatch → last completion │
│                                                                 │
│  📈 COMPLETION RATE:                                             │
│                                                                 │
│     completion_rate = done_count / total_stores * 100%         │
│     success_rate = done_count / (done_count + unable_count)    │
│                                                                 │
│  ⚠️ DONE STATUS LÀ FINAL:                                        │
│                                                                 │
│     → KHÔNG thể thay đổi sau khi task đã done                  │
│     → Stores KHÔNG thể edit kết quả sau khi task done          │
│     → Chỉ có thể xem lịch sử và statistics                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Done Status Calculation Logic:**

```
ON STORE STATUS CHANGE TO 'done' OR 'unable':

1. GET all store_statuses for this task_id
2. CHECK if all stores are in final state:
   - final_states = ['done', 'unable']
   - all_final = all stores IN final_states

3. IF all_final:
   a. SET task.overall_status = 'done'
   b. SET task.completed_at = NOW()
   c. CALCULATE final statistics:
      - done_count = COUNT WHERE status = 'done'
      - unable_count = COUNT WHERE status = 'unable'
      - avg_execution_time = AVG(completed_at - started_at) WHERE done
      - total_time = MAX(completed_at) - task.dispatched_at
   d. CREATE completion notification

4. IF NOT all_final AND end_date < TODAY:
   → SET task.overall_status = 'overdue'

5. ELSE:
   → SET task.overall_status = 'on_progress'
```

### 12.8 Supporting Features (Display Logic & History)

> **Note**: Section này chứa các tính năng hỗ trợ không phải status, bao gồm logic hiển thị và lịch sử task.

#### 12.8.1 Task List Display Logic

```
┌─────────────────────────────────────────────────────────────────┐
│  TASK LIST DISPLAY LOGIC                                        │
│                                                                 │
│  📋 HAI DANH SÁCH ĐỘC LẬP:                                       │
│                                                                 │
│     1. TASK LIST (/tasks/list)                                  │
│        → Chứa các tasks đang xử lý (instances)                  │
│        → Hiển thị cho cả HQ và Store users                      │
│        → Hiển thị: draft, approve, not_yet, on_progress,        │
│          overdue, done                                          │
│                                                                 │
│     2. LIBRARY (/tasks/library)                                 │
│        → Chứa task templates từ 2 nguồn:                        │
│          • Tự động từ Task List (khi approve)                   │
│          • Tạo trực tiếp từ Library (Add New)                   │
│        → Chỉ hiển thị cho HQ users                              │
│        → Dùng để dispatch nhiều lần                             │
│                                                                 │
│  📊 TASK LIST - THỨ TỰ HIỂN THỊ (Ưu tiên cao → thấp):           │
│                                                                 │
│     ┌─────────────────────────────────────────────────────────┐ │
│     │  1. Approve    → Tasks đang chờ phê duyệt (vàng)        │ │
│     │  2. Draft      → Bản nháp chưa submit (xám)             │ │
│     │  3. Overdue    → Quá hạn chưa hoàn thành (đỏ)           │ │
│     │  4. Not Yet    → Chưa bắt đầu (xám nhạt)                │ │
│     │  5. On Progress→ Đang thực hiện (xanh dương)            │ │
│     │  6. Done       → Đã hoàn thành (xanh lá)                │ │
│     └─────────────────────────────────────────────────────────┘ │
│                                                                 │
│  📚 LIBRARY - THỨ TỰ HIỂN THỊ (Ưu tiên cao → thấp):             │
│                                                                 │
│     ┌─────────────────────────────────────────────────────────┐ │
│     │  1. Approve    → Đang chờ phê duyệt (vàng) - Flow 2     │ │
│     │  2. Draft      → Bản nháp chưa submit (xám) - Flow 2    │ │
│     │  3. Available  → Sẵn sàng dispatch (xanh lá)            │ │
│     │  4. Cooldown   → Đang trong thời gian chờ (xanh băng)   │ │
│     └─────────────────────────────────────────────────────────┘ │
│                                                                 │
│  📌 LƯU Ý:                                                       │
│     → Library CÓ draft/approve khi tạo template trực tiếp       │
│     → Templates từ Task List được lưu với status = available   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### 12.8.2 Task Execution History

```
┌─────────────────────────────────────────────────────────────────┐
│  TASK EXECUTION HISTORY                                         │
│                                                                 │
│  📋 KHÁI NIỆM:                                                   │
│     → Mỗi task trải qua nhiều giai đoạn (steps/phases)          │
│     → Mỗi giai đoạn có người thực hiện, thời gian, comment      │
│     → Lịch sử được hiển thị dạng Timeline/Stepper               │
│     → Click vào Status badge trên Task List → mở History popup  │
│                                                                 │
│  🎯 ENTRY POINT:                                                 │
│     → Task List: Click vào Status badge của task                │
│     → Task Detail: Tab "History" hoặc section History           │
│     → Hiển thị: Popup/Modal với timeline các steps              │
│                                                                 │
│  ═══════════════════════════════════════════════════════════════│
│  📊 CÁC GIAI ĐOẠN (STEPS) CỦA TASK                               │
│  ═══════════════════════════════════════════════════════════════│
│                                                                 │
│     ┌─────────────────────────────────────────────────────────┐ │
│     │  TASK LIFECYCLE STEPS:                                  │ │
│     │                                                         │ │
│     │  Step 1: SUBMIT (Gửi phê duyệt)                         │ │
│     │  ─────────────────────────────────────────────────────  │ │
│     │  • Trigger: Creator click "Submit"                      │ │
│     │  • Assign to: Creator (người tạo task)                  │ │
│     │  • Status: Submitted                                    │ │
│     │  • Dates: Created date → Submit date                    │ │
│     │  • Comment: Ghi chú khi submit (optional)               │ │
│     │                                                         │ │
│     │  Step 2: APPROVE (Phê duyệt)                            │ │
│     │  ─────────────────────────────────────────────────────  │ │
│     │  • Trigger: Approver click "Approve" hoặc "Reject"      │ │
│     │  • Assign to: Approver (cấp trên trực tiếp)             │ │
│     │  • Status: Done / Rejected                              │ │
│     │  • Dates: Approval start → Approval end                 │ │
│     │  • Comment: Lý do approve/reject                        │ │
│     │                                                         │ │
│     │  Step 3: DO TASK (Thực hiện tại Stores)                 │ │
│     │  ─────────────────────────────────────────────────────  │ │
│     │  • Trigger: Task dispatched đến stores                  │ │
│     │  • Assign to: X Stores (số stores được giao)            │ │
│     │  • Status: Progress counter (23/27)                     │ │
│     │  • Dates: Applicable period (start → end)               │ │
│     │  • Detail: Click để xem tiến độ từng store              │ │
│     │                                                         │ │
│     │  Step 4: CHECK (Kiểm tra kết quả)                       │ │
│     │  ─────────────────────────────────────────────────────  │ │
│     │  • Trigger: Stores hoàn thành, cần verify               │ │
│     │  • Assign to: PERI / QA team / Creator                  │ │
│     │  • Status: In process / Done                            │ │
│     │  • Dates: Check period                                  │ │
│     │  • Comment: Kết quả kiểm tra                            │ │
│     │                                                         │ │
│     └─────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ═══════════════════════════════════════════════════════════════│
│  🔄 ROUNDS (Vòng lặp khi bị Reject)                              │
│  ═══════════════════════════════════════════════════════════════│
│                                                                 │
│     ┌─────────────────────────────────────────────────────────┐ │
│     │  ROUND CONCEPT:                                         │ │
│     │                                                         │ │
│     │  • Round 1: Lần submit đầu tiên                         │ │
│     │  • Round 2: Sau khi bị reject lần 1, sửa và submit lại  │ │
│     │  • Round 3: Sau khi bị reject lần 2, sửa và submit lại  │ │
│     │  • Max: 3 rounds (sau 3 lần reject → task bị khóa)      │ │
│     │                                                         │ │
│     │  UI: Tab selector [Round 1] [Round 2] [Round 3]         │ │
│     │  Mỗi round hiển thị timeline riêng                      │ │
│     │                                                         │ │
│     └─────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ═══════════════════════════════════════════════════════════════│
│  🖥️ UI DESIGN (History Popup)                                    │
│  ═══════════════════════════════════════════════════════════════│
│                                                                 │
│     ┌─────────────────────────────────────────────────────────┐ │
│     │  TASK HISTORY                                      [X]  │ │
│     ├─────────────────────────────────────────────────────────┤ │
│     │  ┌──────────┐ ┌──────────┐ ┌──────────┐                 │ │
│     │  │ Round 1  │ │ Round 2  │ │ Round 3  │  (Tab selector) │ │
│     │  └──────────┘ └──────────┘ └──────────┘                 │ │
│     │                                                         │ │
│     │                      Link ASSIGN TASK (clickable)       │ │
│     │                                                         │ │
│     │  ●──┐                                                   │ │
│     │  │  │  ┌─────────────────────────────────────────────┐  │ │
│     │  │  │  │ Step 1: SUBMIT                    [Avatar]  │  │ │
│     │  │  │  │ ● Submitted                                 │  │ │
│     │  │  │  │                                             │  │ │
│     │  │  │  │ Assign to                                   │  │ │
│     │  │  │  │ Nguyen Dai Viet                             │  │ │
│     │  │  │  │                                             │  │ │
│     │  │  │  │ Start Day          End Day                  │  │ │
│     │  │  │  │ Oct 10, 2025       Oct 12, 2025             │  │ │
│     │  │  │  │ ─────────────────────────────────────────── │  │ │
│     │  │  │  │ 💬 Comment                                  │  │ │
│     │  │  │  │ "Reference site about Lorem Ipsum,          │  │ │
│     │  │  │  │  giving information on its origins"         │  │ │
│     │  │  │  └─────────────────────────────────────────────┘  │ │
│     │  │                                                      │ │
│     │  ✓──┐                                                   │ │
│     │  │  │  ┌─────────────────────────────────────────────┐  │ │
│     │  │  │  │ Step 2: APPROVE                   [Avatar]  │  │ │
│     │  │  │  │ ● Done                                      │  │ │
│     │  │  │  │                                             │  │ │
│     │  │  │  │ Assign to                                   │  │ │
│     │  │  │  │ Yoshinaga                                   │  │ │
│     │  │  │  │                                             │  │ │
│     │  │  │  │ Start Day          End Day                  │  │ │
│     │  │  │  │ Oct 14, 2025       Oct 15, 2025             │  │ │
│     │  │  │  │ ─────────────────────────────────────────── │  │ │
│     │  │  │  │ 💬 Comment                                  │  │ │
│     │  │  │  │ "Lorem Ipsum, giving information on         │  │ │
│     │  │  │  │  its origins"                               │  │ │
│     │  │  │  └─────────────────────────────────────────────┘  │ │
│     │  │                                                      │ │
│     │  ⚙──┐                                                   │ │
│     │  │  │  ┌─────────────────────────────────────────────┐  │ │
│     │  │  │  │ Step 3: DO TASK                             │  │ │
│     │  │  │  │ [23/27] (progress badge)                    │  │ │
│     │  │  │  │                                             │  │ │
│     │  │  │  │ Assign to                                   │  │ │
│     │  │  │  │ 27 Stores                                   │  │ │
│     │  │  │  │                                             │  │ │
│     │  │  │  │ Start Day          End Day                  │  │ │
│     │  │  │  │ Oct 19, 2025       Oct 21, 2025             │  │ │
│     │  │  │  └─────────────────────────────────────────────┘  │ │
│     │  │                                                      │ │
│     │  ☑──┐                                                   │ │
│     │     │  ┌─────────────────────────────────────────────┐  │ │
│     │     │  │ Step 4: CHECK                               │  │ │
│     │     │  │ ● In process (yellow badge)                 │  │ │
│     │     │  │                                             │  │ │
│     │     │  │ Assign to                                   │  │ │
│     │     │  │ PERI                                        │  │ │
│     │     │  │                                             │  │ │
│     │     │  │ Start Day          End Day                  │  │ │
│     │     │  │ Oct 19, 2025       Oct 21, 2025             │  │ │
│     │     │  └─────────────────────────────────────────────┘  │ │
│     │                                                         │ │
│     └─────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ═══════════════════════════════════════════════════════════════│
│  🎨 STATUS BADGES & ICONS                                        │
│  ═══════════════════════════════════════════════════════════════│
│                                                                 │
│     STEP ICONS (Timeline):                                     │
│     ┌──────────────┬──────────┬─────────────────────────────┐  │
│     │ Step         │ Icon     │ Mô tả                       │  │
│     ├──────────────┼──────────┼─────────────────────────────┤  │
│     │ SUBMIT       │ 📋 (doc) │ Document/clipboard icon     │  │
│     │ APPROVE      │ ✓ (check)│ Checkmark in circle         │  │
│     │ DO TASK      │ ⚙ (gear) │ Settings/gear icon          │  │
│     │ CHECK        │ ☑ (verify)│ Clipboard with check       │  │
│     └──────────────┴──────────┴─────────────────────────────┘  │
│                                                                 │
│     STATUS BADGES:                                             │
│     ┌──────────────┬──────────┬─────────────────────────────┐  │
│     │ Status       │ Color    │ Sử dụng khi                 │  │
│     ├──────────────┼──────────┼─────────────────────────────┤  │
│     │ Submitted    │ 🟢 Green │ Step 1 hoàn thành submit    │  │
│     │ Done         │ 🟢 Green │ Step đã hoàn thành          │  │
│     │ In process   │ 🟡 Yellow│ Step đang thực hiện         │  │
│     │ Rejected     │ 🔴 Red   │ Step bị reject              │  │
│     │ Pending      │ ⚪ Gray  │ Step chưa đến               │  │
│     │ 23/27        │ 🟢 Green │ Progress counter (DO TASK)  │  │
│     └──────────────┴──────────┴─────────────────────────────┘  │
│                                                                 │
│     TIMELINE LINE COLORS:                                      │
│     • Completed step → step: Solid magenta/pink line           │
│     • Current step: Magenta/pink dot (filled)                  │
│     • Future step: Gray dashed line                            │
│                                                                 │
│  ═══════════════════════════════════════════════════════════════│
│  📝 STEP CARD STRUCTURE                                          │
│  ═══════════════════════════════════════════════════════════════│
│                                                                 │
│     Mỗi Step Card bao gồm:                                     │
│     ┌─────────────────────────────────────────────────────────┐ │
│     │ 1. Header:                                              │ │
│     │    • Step number + Title (Step 1: SUBMIT)               │ │
│     │    • Avatar của người thực hiện (góc phải)              │ │
│     │    • Status badge (Submitted, Done, In process...)      │ │
│     │                                                         │ │
│     │ 2. Assignment Info:                                     │ │
│     │    • Label: "Assign to"                                 │ │
│     │    • Value: Tên người/số stores                         │ │
│     │                                                         │ │
│     │ 3. Date Range:                                          │ │
│     │    • Start Day: [date]                                  │ │
│     │    • End Day: [date]                                    │ │
│     │                                                         │ │
│     │ 4. Comment Section (optional):                          │ │
│     │    • Icon: 💬                                           │ │
│     │    • Background: Light gray                             │ │
│     │    • Content: Comment text                              │ │
│     └─────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ═══════════════════════════════════════════════════════════════│
│  🔗 LINK ASSIGN TASK                                             │
│  ═══════════════════════════════════════════════════════════════│
│                                                                 │
│     • Vị trí: Phía trên timeline, căn phải                     │
│     • Style: Italic, underline, clickable link                 │
│     • Action: Mở màn hình Task Detail / Add Task               │
│     • Hiển thị: Chỉ khi user có quyền view task detail         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Database Schema cho Task History:**

```sql
-- task_history: Lưu lịch sử các steps của task
CREATE TABLE task_history (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    task_id BIGINT NOT NULL,
    round_number INT DEFAULT 1,           -- Vòng lặp (1, 2, 3)

    -- Step info
    step_number INT NOT NULL,             -- 1, 2, 3, 4
    step_name VARCHAR(50) NOT NULL,       -- SUBMIT, APPROVE, DO_TASK, CHECK
    step_status VARCHAR(20) NOT NULL,     -- submitted, done, in_process, rejected, pending

    -- Assignment
    assigned_to_type ENUM('user', 'stores', 'team') NOT NULL,
    assigned_to_id BIGINT NULL,           -- user_id hoặc NULL nếu là stores
    assigned_to_name VARCHAR(255) NULL,   -- Tên hiển thị
    assigned_to_count INT NULL,           -- Số lượng (cho stores)

    -- Dates
    start_date DATE NULL,
    end_date DATE NULL,
    actual_start_at TIMESTAMP NULL,
    actual_end_at TIMESTAMP NULL,

    -- Progress (cho DO_TASK step)
    progress_done INT DEFAULT 0,          -- Số đã hoàn thành
    progress_total INT DEFAULT 0,         -- Tổng số

    -- Comment
    comment TEXT NULL,

    -- Audit
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- Constraints
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
    INDEX idx_task_round (task_id, round_number),
    INDEX idx_task_step (task_id, step_number)
);
```

**API Endpoints cho Task History:**

| Action | Method | Endpoint | Description | Permission |
|--------|--------|----------|-------------|------------|
| Get Task History | GET | `/api/v1/tasks/{id}/history` | Lấy toàn bộ history của task | All users có quyền view task |
| Get Round History | GET | `/api/v1/tasks/{id}/history?round=1` | Lấy history của round cụ thể | All users có quyền view task |
| Add History Entry | POST | `/api/v1/tasks/{id}/history` | Thêm entry mới (internal) | System only |

**Task History Response Example:**

```json
{
  "task_id": 123,
  "task_name": "Kiểm kê hàng hóa Q1",
  "current_round": 1,
  "total_rounds": 1,
  "rounds": [
    {
      "round_number": 1,
      "steps": [
        {
          "step_number": 1,
          "step_name": "SUBMIT",
          "step_status": "submitted",
          "assigned_to": {
            "type": "user",
            "id": 45,
            "name": "Nguyen Dai Viet",
            "avatar": "/avatars/45.jpg"
          },
          "start_date": "2025-10-10",
          "end_date": "2025-10-12",
          "comment": "Reference site about Lorem Ipsum..."
        },
        {
          "step_number": 2,
          "step_name": "APPROVE",
          "step_status": "done",
          "assigned_to": {
            "type": "user",
            "id": 12,
            "name": "Yoshinaga",
            "avatar": "/avatars/12.jpg"
          },
          "start_date": "2025-10-14",
          "end_date": "2025-10-15",
          "comment": "Lorem Ipsum, giving information on its origins"
        },
        {
          "step_number": 3,
          "step_name": "DO_TASK",
          "step_status": "in_process",
          "assigned_to": {
            "type": "stores",
            "count": 27,
            "name": "27 Stores"
          },
          "start_date": "2025-10-19",
          "end_date": "2025-10-21",
          "progress": {
            "done": 23,
            "total": 27
          }
        },
        {
          "step_number": 4,
          "step_name": "CHECK",
          "step_status": "in_process",
          "assigned_to": {
            "type": "user",
            "id": 8,
            "name": "PERI",
            "avatar": null
          },
          "start_date": "2025-10-19",
          "end_date": "2025-10-21",
          "comment": null
        }
      ]
    }
  ]
}
```

**Auto-create History Entries:**

```
TRIGGERS tự động tạo history entries:

1. ON TASK SUBMIT:
   → Create Step 1 (SUBMIT) với status = 'submitted'
   → Create Step 2 (APPROVE) với status = 'pending'

2. ON TASK APPROVE:
   → Update Step 2 (APPROVE) status = 'done'
   → Create Step 3 (DO_TASK) với status = 'in_process'
   → Create Step 4 (CHECK) với status = 'pending'

3. ON TASK REJECT:
   → Update Step 2 (APPROVE) status = 'rejected'
   → Tăng round_number
   → Create new Step 1, 2 cho round mới

4. ON STORE STATUS CHANGE:
   → Update Step 3 (DO_TASK) progress counter

5. ON ALL STORES COMPLETED:
   → Update Step 3 (DO_TASK) status = 'done'
   → Update Step 4 (CHECK) status = 'in_process'

6. ON CHECK COMPLETED:
   → Update Step 4 (CHECK) status = 'done'
```

---

## 13. WS MODULE - KẾ HOẠCH HOÀN THIỆN (Master Checklist)

> **Mục tiêu**: Hoàn thiện toàn bộ WS Module, loại bỏ mockData, code FE+BE+DB hoàn chỉnh
> **Cập nhật lần cuối**: 2026-01-22

```
┌─────────────────────────────────────────────────────────────────┐
│  TỔNG QUAN 5 GIAI ĐOẠN                                          │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  PHASE 1: HOÀN THIỆN CHỨC NĂNG                           │   │
│  │  → Mục tiêu: Tất cả screens chạy được, không mockData    │   │
│  │  → FE + BE + DB hoàn chỉnh                               │   │
│  │  → Status: 🔄 IN PROGRESS                                │   │
│  └──────────────────────────────────────────────────────────┘   │
│                         ↓                                       │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  PHASE 2: TỐI ƯU HIỆU SUẤT                               │   │
│  │  → API response optimization (loại bỏ fields thừa)       │   │
│  │  → Query optimization (N+1, indexing)                    │   │
│  │  → Frontend performance (lazy loading, caching)          │   │
│  │  → Status: ⏳ PENDING                                    │   │
│  └──────────────────────────────────────────────────────────┘   │
│                         ↓                                       │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  PHASE 3: CẢI THIỆN UI/UX                                │   │
│  │  → Responsive design                                     │   │
│  │  → Loading states, error handling                        │   │
│  │  → Accessibility                                         │   │
│  │  → Status: ⏳ PENDING                                    │   │
│  └──────────────────────────────────────────────────────────┘   │
│                         ↓                                       │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  PHASE 4: REFACTOR THEO TECH STACK REFERENCE             │   │
│  │  → Áp dụng recommendations từ Dev Team                   │   │
│  │  → Service Layer, Form Requests, Caching, etc.           │   │
│  │  → Chuẩn bị codebase cho production                      │   │
│  │  → Status: ⏳ PENDING                                    │   │
│  └──────────────────────────────────────────────────────────┘   │
│                         ↓                                       │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  PHASE 5: DEPLOY DEMO & FEEDBACK                         │   │
│  │  → Deploy lên server cho user test                       │   │
│  │  → Thu thập feedback về bug, UI/UX                       │   │
│  │  → ⚡ CÓ THỂ CHẠY SONG SONG với Phase 1-4               │   │
│  │  → Status: ⏳ PENDING                                    │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### PHASE 1: HOÀN THIỆN CHỨC NĂNG (No MockData)

#### 1.1 Database - Tables & Migrations

| # | Task | Status | Notes |
|---|------|--------|-------|
| 1.1.1 | `tasks` table - review & update schema | ✅ | Enhanced with approval workflow fields |
| 1.1.2 | `task_store_assignments` table | ✅ | Store task execution tracking |
| 1.1.3 | `task_approval_history` table | ✅ | Verified and working |
| 1.1.4 | `task_library` table | ✅ | Templates with cooldown support |
| 1.1.5 | `task_execution_logs` table | ✅ | Action logging implemented |
| 1.1.6 | Foreign keys & indexes | ✅ | Data integrity ensured |

#### 1.2 Backend APIs

**Task List Screen:**
| # | API | Method | Status | Notes |
|---|-----|--------|--------|-------|
| 1.2.1 | GET /tasks | GET | ✅ | Status calculation, filtering, pagination |
| 1.2.2 | GET /tasks-draft-info | GET | ✅ | Đếm drafts per user |
| 1.2.3 | DELETE /tasks/{id} | DELETE | ✅ | Xóa draft |

**Task Detail Screen:**
| # | API | Method | Status | Notes |
|---|-----|--------|--------|-------|
| 1.2.4 | GET /tasks/{id} | GET | ✅ | Chi tiết task với sub_tasks |
| 1.2.5 | GET /tasks/{id}/history | GET | ✅ | Approval history |
| 1.2.6 | GET /tasks/{id}/progress | GET | ✅ | Store progress - `329eaa37` |

**Add Task Screen:**
| # | API | Method | Status | Notes |
|---|-----|--------|--------|-------|
| 1.2.7 | POST /tasks | POST | ✅ | Tạo task/draft |
| 1.2.8 | PUT /tasks/{id} | PUT | ✅ | Update draft |
| 1.2.9 | POST /tasks/{id}/submit | POST | ✅ | Submit for approval |

**Approval Flow:**
| # | API | Method | Status | Notes |
|---|-----|--------|--------|-------|
| 1.2.10 | GET /tasks/pending-approval | GET | ✅ | Tasks chờ user duyệt |
| 1.2.11 | POST /tasks/{id}/approve | POST | ✅ | Approve task |
| 1.2.12 | POST /tasks/{id}/reject | POST | ✅ | Reject task |
| 1.2.13 | GET /staff/{id}/approver | GET | ✅ | Tìm approver của user |

**Library Screen:**
| # | API | Method | Status | Notes |
|---|-----|--------|--------|-------|
| 1.2.14 | GET /library-tasks | GET | ✅ | Danh sách templates - `00281d13` |
| 1.2.15 | POST /library-tasks | POST | ✅ | Tạo template trực tiếp |
| 1.2.16 | POST /library-tasks/{id}/dispatch | POST | ✅ | Gửi template đến stores |

**Store Execution:**
| # | API | Method | Status | Notes |
|---|-----|--------|--------|-------|
| 1.2.17 | GET /stores/{id}/tasks | GET | ✅ | Tasks của store - `329eaa37` |
| 1.2.18 | POST /tasks/{id}/stores/{store_id}/start | POST | ✅ | Bắt đầu task |
| 1.2.19 | POST /tasks/{id}/stores/{store_id}/complete | POST | ✅ | Hoàn thành task |
| 1.2.20 | POST /tasks/{id}/stores/{store_id}/unable | POST | ✅ | Mark unable |
| 1.2.21 | POST /tasks/{id}/stores/{store_id}/assign | POST | ✅ | Giao việc cho staff |

**HQ Check:**
| # | API | Method | Status | Notes |
|---|-----|--------|--------|-------|
| 1.2.22 | GET /tasks/hq-check | GET | ✅ | Tasks cần HQ kiểm tra (filter endpoint) |
| 1.2.23 | POST /tasks/{id}/stores/{store_id}/check | POST | ✅ | HQ Check - `329eaa37` |

**Supporting APIs:**
| # | API | Method | Status | Notes |
|---|-----|--------|--------|-------|
| 1.2.24 | GET /scope-hierarchy | GET | ✅ | Region/Zone/Area/Store |
| 1.2.25 | GET /code-master | GET | ✅ | Task types, categories |
| 1.2.26 | GET /departments | GET | ✅ | Departments list |

#### 1.3 Frontend Screens

**Task List (/tasks/list):**
| # | Task | Status | Notes |
|---|------|--------|-------|
| 1.3.1 | Hiển thị danh sách tasks | ✅ | Đang hoạt động |
| 1.3.2 | Filter by status | ✅ | Full status options for HQ/Store users, multi-select support |
| 1.3.3 | Filter by department | ✅ | Multi-department filter support |
| 1.3.4 | Search by task name | ✅ | Debounced search (300ms), partial matching, clear button |
| 1.3.5 | Pagination | ✅ | Đang hoạt động |
| 1.3.6 | Progress column - từ store assignments | ✅ | Dùng store_progress từ API |
| 1.3.7 | Unable column - từ store assignments | ✅ | Dùng store_progress từ API |
| 1.3.8 | Click Status → History modal | ✅ | Đã implement |
| 1.3.9 | 3-dots menu actions | ✅ | View Approval History + Pause Task (with confirmation modal) |
| 1.3.10 | Sub-tasks expand/collapse | ✅ | Đang hoạt động |

**Task Detail (/tasks/[id]):**
| # | Task | Status | Notes |
|---|------|--------|-------|
| 1.3.11 | Task header info | ✅ | Using real API data |
| 1.3.12 | Statistics cards (Not Yet, Done, Unable, Avg Time) | ✅ | Using getTaskProgress API |
| 1.3.13 | Store progress table | ✅ | Using store assignments from API |
| 1.3.14 | Comments section | ✅ | Full CRUD with add/edit/delete, owner-only permissions |
| 1.3.15 | Attachments/Evidence | ✅ | Backend API + Frontend modal complete

**Add Task (/tasks/new):**
| # | Task | Status | Notes |
|---|------|--------|-------|
| 1.3.16 | A. Information section | ✅ | Task Type, Applicable Period, Execution Time with validation |
| 1.3.17 | B. Instructions section | ✅ | Photo guidelines (click/paste/drag-drop), Manual Link, Note |
| 1.3.18 | C. Scope section - Store hierarchy | ✅ | Using real API via useScopeData hook |
| 1.3.19 | C. Scope section - HQ hierarchy | ✅ | Backend API + useHQHierarchy hook complete |
| 1.3.20 | D. Approval Process - auto populate | ✅ | Auto-fetches approver via getApproverForStaff API |
| 1.3.21 | Save as Draft | ✅ | Implemented in handleSaveDraft |
| 1.3.22 | Submit for approval | ✅ | Implemented in handleSubmit |
| 1.3.23 | Edit existing draft | ✅ | Works via URL params (?id=xxx) |
| 1.3.24 | source=library mode | ✅ | Hides scope section correctly |
| 1.3.25 | source=todo_task mode | ✅ | Uses useHQHierarchy hook for HQ scope |

**Library (/tasks/library):**
| # | Task | Status | Notes |
|---|------|--------|-------|
| 1.3.26 | Danh sách templates | ✅ | Real API (getWsLibraryTemplates), grouped by department |
| 1.3.27 | Add New template | ✅ | Routes to /tasks/new?source=library |
| 1.3.28 | Dispatch template | ✅ | Full dispatch page with scope selector, dates, priority |
| 1.3.29 | Cooldown status display | ✅ | Cooldown badge (cyan), isInCooldown/cooldownMinutes mapped |
| 1.3.30 | Override cooldown (highest grade) | ✅ | Modal with reason, API integration (overrideWsLibraryCooldown) |

**To Do Task (/tasks/todo):**
| # | Task | Status | Notes |
|---|------|--------|-------|
| 1.3.31 | Danh sách tasks HQ→HQ | ✅ | Backend source filter added, calendar view deferred to Phase 2 |
| 1.3.32 | Add New → Add Task (source=todo_task) | ✅ | Routes to /tasks/new?source=todo_task |
| 1.3.33 | My tasks (created by me) | ✅ | FilterModal "My Tasks" option + filter[created_staff_id] in page.tsx |

**Approval Screen (/tasks/approval):**
| # | Task | Status | Notes |
|---|------|--------|-------|
| 1.3.34 | Pending approvals list | ✅ | Real API (getPendingApprovals), table with task info |
| 1.3.35 | Approve action | ✅ | Approve button with API call (approveTask) |
| 1.3.36 | Reject action | ✅ | Reject modal with reason input (rejectTask API) |
| 1.3.37 | View task detail (read-only) | ✅ | View button links to /tasks/detail |

**Store Task View (/stores/[id]/tasks):**
| # | Task | Status | Notes |
|---|------|--------|-------|
| 1.3.38 | Tasks assigned to store | ✅ | Real API (getStoreTasks, getMyStoreTasks), role-based visibility |
| 1.3.39 | Start task action | ✅ | startStoreTask API, not_yet → on_progress |
| 1.3.40 | Complete task action | ✅ | completeStoreTask API, on_progress → done_pending |
| 1.3.41 | Mark unable action | ✅ | markStoreTaskUnable API with reason modal |
| 1.3.42 | Upload evidence | ✅ | Complete modal with notes and evidence URLs |
| 1.3.43 | Assign to staff (S4-S2) | ✅ | Assign/Unassign buttons with staff selection modal |

**HQ Check Screen (/tasks/hq-check):**
| # | Task | Status | Notes |
|---|------|--------|-------|
| 1.3.44 | Tasks pending HQ check | ✅ | Real API (getHQCheckList), expand/collapse task cards |
| 1.3.45 | View store evidence | ✅ | Store list with completion info, notes |
| 1.3.46 | Checked action | ✅ | hqCheckStore API, done_pending → done |
| 1.3.47 | Reject action | ✅ | hqRejectStore API with reason modal |

#### 1.4 Shared Components

| # | Component | Status | Notes |
|---|-----------|--------|-------|
| 1.4.1 | ApprovalHistoryModal | ✅ | Đã implement |
| 1.4.2 | ScopeSelector (Store hierarchy) | ✅ | Exists as ScopeSection.tsx (scopeType='store') |
| 1.4.3 | ScopeSelector (HQ hierarchy) | ✅ | Exists as ScopeSection.tsx (scopeType='hq') |
| 1.4.4 | TaskStatusBadge | ✅ | Status với colors |
| 1.4.5 | StoreStatusBadge | ✅ | Reusable component with 6 statuses |
| 1.4.6 | PhotoUploader | ✅ | Integrated in InstructionsSection (click, paste, drag-drop) |
| 1.4.7 | EvidenceViewer | ✅ | Implemented in Task Detail page as modal

### PHASE 2: TỐI ƯU HIỆU SUẤT

| # | Task | Status | Notes |
|---|------|--------|-------|
| 2.1 | Tạo TaskListResource - loại bỏ ~25 fields thừa | ✅ | Reduced payload ~60%, excludes photo_guidelines, attachments, etc. |
| 2.2 | Tạo TaskDetailResource - full info | ✅ | Full task info with all relationships |
| 2.3 | Fix N+1 queries trong Task List | ✅ | Eager loading với select columns |
| 2.4 | Add database indexes | ✅ | Verified existing indexes on tasks, task_store_assignments |
| 2.5 | Frontend: React Query caching | ✅ | QueryProvider + useTasks, useStoreTasks, useLibraryTasks, useScopeHierarchy hooks |
| 2.6 | Frontend: Lazy loading images | ✅ | LazyImage component + updated ImageGrid, ImageLightbox, StaffCard, etc. |
| 2.7 | Frontend: Virtual scrolling cho long lists | ✅ | VirtualList, VirtualTable components created. Current pagination (15-100) handles most cases. |
| 2.8 | API response compression | ✅ | .htaccess mod_deflate + Laravel CompressResponse middleware |
| 2.9 | Pagination optimization | ✅ | HasCursorPagination trait + PaginationService with cursor/offset support |

### PHASE 3: CẢI THIỆN UI/UX

| # | Task | Status | Notes |
|---|------|--------|-------|
| 3.1 | Loading states cho tất cả screens | ✅ | Page-specific skeletons, LoadingSpinner, LoadingOverlay |
| 3.2 | Error handling UI | ✅ | Toast notifications, ErrorDisplay component, ErrorBoundary |
| 3.3 | Empty states | ✅ | EmptyState, SuccessEmptyState components with icons |
| 3.4 | Responsive design (mobile) | ✅ | ResponsiveTable wrapper, mobile-friendly layouts |
| 3.5 | Accessibility (a11y) | ✅ | ARIA labels, roles, keyboard navigation, focus management |
| 3.6 | Form validation UX | ✅ | Inline errors, aria-invalid, focus on error fields |
| 3.7 | Confirmation dialogs | ✅ | ConfirmationModal component, delete/submit/approve dialogs |
| 3.8 | Success feedback | ✅ | Toast notifications on all actions (approve, reject, complete, etc.) |
| 3.9 | Dark mode support | ✅ | Full dark mode với dark: classes trên tất cả components |
| 3.10 | Animation/transitions | ✅ | Page fade-in, stagger animations, modal transitions, hover effects |

### PHASE 4: REFACTOR THEO TECH STACK REFERENCE

> **Mục tiêu**: Áp dụng các recommendations từ Dev Team để codebase sẵn sàng cho production
> **Tham khảo**: CLAUDE.md > Section "Tech Stack Reference" (dòng 110-143)

#### 4.1 Service Layer Pattern

| # | Task | Status | Notes |
|---|------|--------|-------|
| 4.1.1 | Tạo `app/Services/` directory | ⏳ | Cấu trúc thư mục cho Services |
| 4.1.2 | `TaskService.php` | ⏳ | Business logic cho Tasks (create, update, submit, approve) |
| 4.1.3 | `TaskStoreService.php` | ⏳ | Store execution logic (start, complete, unable, assign) |
| 4.1.4 | `TaskLibraryService.php` | ⏳ | Library logic (dispatch, cooldown, override) |
| 4.1.5 | `ApprovalService.php` | ⏳ | Approval workflow (find approver, approve, reject) |
| 4.1.6 | Refactor Controllers → gọi Services | ⏳ | Controllers chỉ handle request/response |

**Cấu trúc mới:**
```
Request → Controller → Service → Model → Resource → Response
```

#### 4.2 Form Request Classes (Validation)

| # | Task | Status | Notes |
|---|------|--------|-------|
| 4.2.1 | `StoreTaskRequest.php` | ⏳ | Validation cho tạo/update task |
| 4.2.2 | `SubmitTaskRequest.php` | ⏳ | Validation cho submit task |
| 4.2.3 | `ApproveRejectRequest.php` | ⏳ | Validation cho approve/reject |
| 4.2.4 | `StoreExecutionRequest.php` | ⏳ | Validation cho store actions (start, complete, unable) |
| 4.2.5 | `DispatchLibraryRequest.php` | ⏳ | Validation cho dispatch từ Library |
| 4.2.6 | Refactor Controllers → dùng Form Requests | ⏳ | Loại bỏ validation khỏi Controllers |

#### 4.3 Authentication (Laravel Passport)

| # | Task | Status | Notes |
|---|------|--------|-------|
| 4.3.1 | Install Laravel Passport | ⏳ | `composer require laravel/passport` |
| 4.3.2 | Publish & migrate Passport tables | ⏳ | `php artisan passport:install` |
| 4.3.3 | Configure User model với HasApiTokens | ⏳ | Trait cho OAuth2 |
| 4.3.4 | Tạo Personal Access Tokens | ⏳ | Token-based auth thay vì Sanctum |
| 4.3.5 | Update AuthController | ⏳ | Login trả về Passport token |
| 4.3.6 | Update Frontend auth flow | ⏳ | Store & refresh Passport tokens |
| 4.3.7 | Test authentication flow | ⏳ | Login, logout, token refresh |

#### 4.4 Caching Strategy (Redis + Response Caching)

| # | Task | Status | Notes |
|---|------|--------|-------|
| 4.4.1 | Install & configure Redis | ⏳ | `predis/predis` hoặc phpredis |
| 4.4.2 | Install Spatie Response Caching | ⏳ | `composer require spatie/laravel-responsecache` |
| 4.4.3 | Cache master data (departments, stores, code_master) | ⏳ | Redis cache với TTL |
| 4.4.4 | Cache scope hierarchy (regions, zones, areas) | ⏳ | Ít thay đổi, cache lâu |
| 4.4.5 | Response cache cho static pages | ⏳ | Library list, department list |
| 4.4.6 | Cache invalidation strategy | ⏳ | Clear cache khi data thay đổi |

#### 4.5 Background Jobs (Laravel Horizon)

| # | Task | Status | Notes |
|---|------|--------|-------|
| 4.5.1 | Install Laravel Horizon | ⏳ | `composer require laravel/horizon` |
| 4.5.2 | Configure Horizon dashboard | ⏳ | Monitoring UI |
| 4.5.3 | `SendTaskNotificationJob` | ⏳ | Async notifications |
| 4.5.4 | `ProcessOverdueTasksJob` | ⏳ | Daily check for overdue |
| 4.5.5 | `CleanupExpiredDraftsJob` | ⏳ | 30-day draft cleanup |
| 4.5.6 | `AutoConfirmOverdueCheckJob` | ⏳ | Auto-confirm done_pending khi overdue |

#### 4.6 Query Optimization

| # | Task | Status | Notes |
|---|------|--------|-------|
| 4.6.1 | Audit N+1 queries với Debugbar | ⏳ | Identify problematic queries |
| 4.6.2 | Refactor sang Query Builder cho complex queries | ⏳ | Performance improvement |
| 4.6.3 | Giữ Eloquent cho simple CRUD | ⏳ | Readability + relationships |
| 4.6.4 | Add missing indexes | ⏳ | Based on query analysis |
| 4.6.5 | Optimize eager loading | ⏳ | Load only needed relations |

#### 4.7 Code Quality Tools

| # | Task | Status | Notes |
|---|------|--------|-------|
| 4.7.1 | Install Laravel Pint | ⏳ | Code style fixer |
| 4.7.2 | Configure Pint rules | ⏳ | PSR-12 + Laravel conventions |
| 4.7.3 | Run Pint trên toàn bộ codebase | ⏳ | Auto-fix style issues |
| 4.7.4 | Install Pest PHP | ⏳ | Testing framework |
| 4.7.5 | Write basic tests cho critical flows | ⏳ | Auth, Task CRUD, Approval |

#### 4.8 Monitoring (Laravel Pulse)

| # | Task | Status | Notes |
|---|------|--------|-------|
| 4.8.1 | Install Laravel Pulse | ⏳ | `composer require laravel/pulse` |
| 4.8.2 | Configure Pulse dashboard | ⏳ | Performance monitoring |
| 4.8.3 | Setup slow query alerts | ⏳ | Queries > 1s |
| 4.8.4 | Monitor memory usage | ⏳ | Prevent memory leaks |

### PHASE 5: DEPLOY DEMO & FEEDBACK

| # | Task | Status | Notes |
|---|------|--------|-------|
| 5.1 | Test toàn bộ tại LOCAL | 🔄 | Step 1 CLI/Bash: ✅ PASSED (2026-01-23), Step 2 Manual: ⏳ |
| 5.2 | Deploy database changes | ⏳ | phpMyAdmin |
| 5.3 | Deploy backend changes | ⏳ | FileZilla |
| 5.4 | Deploy frontend changes | ⏳ | Vercel Redeploy |
| 5.5 | Test trên production | ⏳ | All screens |
| 5.6 | Tạo test accounts cho users | ⏳ | HQ + Store roles |
| 5.7 | Thu thập feedback | ⏳ | Bug reports, UI/UX |
| 5.8 | Prioritize & fix issues | ⏳ | Based on feedback |

---

#### 5.1 CHI TIẾT: KẾ HOẠCH TEST LOCAL

```
┌─────────────────────────────────────────────────────────────────┐
│  QUY TRÌNH TEST LOCAL (Lặp lại cho đến khi hết bug)            │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  BƯỚC 1: CLI/BASH TEST (Tự động)                        │   │
│  │  → Test DB connection, API endpoints, build process     │   │
│  │  → Nếu FAIL → Fix → Quay lại Bước 1                     │   │
│  │  → Nếu PASS → Chuyển sang Bước 2                        │   │
│  └─────────────────────────────────────────────────────────┘   │
│                          ↓                                      │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  BƯỚC 2: MANUAL TEST (Thủ công)                         │   │
│  │  → Test UI/UX, user flows, edge cases                   │   │
│  │  → Nếu có BUG → Fix → Quay lại Bước 1                   │   │
│  │  → Nếu PASS → Task 4.1 hoàn thành ✓                     │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**BƯỚC 1: CLI/BASH TEST**

| # | Test Case | Command | Expected | Status |
|---|-----------|---------|----------|--------|
| **A. DATABASE TESTS** |
| A.1 | MySQL connection | `mysql -uroot -e "SELECT 1"` | OK | ✅ |
| A.2 | Database exists | `mysql -uroot -e "USE auraorie68aa_aoisora; SELECT COUNT(*) FROM staff;"` | Count > 0 | ✅ 23 staff |
| A.3 | Tables exist | `mysql -uroot auraorie68aa_aoisora -e "SHOW TABLES;"` | 28+ tables | ✅ 40 tables |
| A.4 | Test data exists | `mysql -uroot auraorie68aa_aoisora -e "SELECT COUNT(*) FROM tasks;"` | Count > 0 | ✅ 90 tasks, 460 stores |
| A.5 | Foreign keys OK | `mysql -uroot auraorie68aa_aoisora -e "SELECT * FROM task_store_assignments LIMIT 1;"` | No error | ✅ 90 FK constraints |
| **B. BACKEND TESTS** |
| B.1 | PHP version | `php -v` | 8.3.x | ✅ 8.3.28 |
| B.2 | Laravel version | `php artisan --version` | Laravel 11.x | ✅ 11.47.0 |
| B.3 | Config clear | `cd backend/laravel && php artisan config:clear` | OK | ✅ |
| B.4 | Route list | `cd backend/laravel && php artisan route:list --path=api/v1` | Routes listed | ✅ |
| B.5 | PHP syntax - TaskController | `php -l TaskController.php` | No errors | ✅ |
| B.6 | PHP syntax - Task model | `php -l Task.php` | No errors | ✅ |
| B.7 | PHP syntax - CodeMaster | `php -l CodeMaster.php` | No errors | ✅ |
| B.8 | PHP syntax - TaskListResource | `php -l TaskListResource.php` | No errors | ✅ |
| B.9 | PHP syntax - TaskDetailResource | `php -l TaskDetailResource.php` | No errors | ✅ |
| B.10 | PHP syntax - TaskLibraryController | `php -l TaskLibraryController.php` | No errors | ✅ |
| B.11 | Skip - TaskService | (file doesn't exist) | - | ⏭️ skipped |
| B.12 | Task routes | `php artisan route:list --path=api/v1/tasks` | Routes | ✅ 33 routes |
| B.13 | Server running | Check port 8000 | Running | ✅ |
| B.14 | API Health check | `curl -s http://localhost:8000/api/v1/health` | {"status":"ok"} | ✅ |
| B.15 | Auth - Login | `curl -X POST http://localhost:8000/api/v1/auth/login -d "..."` | Token returned | ✅ |
| **C. FRONTEND TESTS** |
| C.1 | Node version | `node -v` | 18.x+ | ✅ 24.13.0 |
| C.2 | NPM version | `npm -v` | 8.x+ | ✅ 11.6.2 |
| C.3 | TypeScript check | `cd frontend && npx tsc --noEmit` | No errors | ✅ |
| C.4 | ESLint check | `cd frontend && npm run lint` | No errors | ✅ warnings only |
| C.5 | Build check | `cd frontend && npm run build` | Build success | ✅ |
| C.6 | Dev server start | `cd frontend && npm run dev` | Port 3000 | ✅ |

**BƯỚC 2: MANUAL TEST**

| # | Screen/Flow | Test Cases | Status | Tested At |
|---|-------------|------------|--------|-----------|
| **D. AUTHENTICATION** |
| D.1 | Login Page | - Login với HQ user (admin/password) | ✅ | 2026-01-23 |
| D.2 | Login Page | - Login với Store user | ✅ | 2026-01-23 |
| D.3 | Login Page | - Login fail với wrong password | ✅ | 2026-01-23 |
| D.4 | Logout | - Logout và redirect về login | ✅ | 2026-01-23 |
| **E. TASK LIST (HQ)** |
| E.1 | /tasks/list | - Hiển thị danh sách tasks | ✅ | 2026-01-23 |
| E.2 | /tasks/list | - Filter by Department | ✅ | 2026-01-23 |
| E.3 | /tasks/list | - Filter by Status | ✅ | 2026-01-23 |
| E.4 | /tasks/list | - Search by task name | ✅ | 2026-01-23 |
| E.5 | /tasks/list | - Pagination hoạt động | ✅ | 2026-01-23 |
| E.6 | /tasks/list | - Click Status → History modal | ✅ | 2026-01-23 |
| E.7 | /tasks/list | - Expand/Collapse sub-tasks | ✅ | 2026-01-23 |
| E.8 | /tasks/list | - Progress & Unable columns hiển thị đúng | ✅ | 2026-01-23 |
| **F. TASK DETAIL** |
| F.1 | /tasks/detail | - Hiển thị task info đầy đủ | ✅ | 2026-01-23 |
| F.2 | /tasks/detail | - Statistics cards (Not Yet, Done, Unable, Avg Time) | ✅ | 2026-01-23 |
| F.3 | /tasks/detail | - Store progress table | ✅ | 2026-01-23 |
| F.4 | /tasks/detail | - Comments section CRUD | ✅ | 2026-01-23 |
| F.5 | /tasks/detail | - Attachments/Evidence modal | ✅ | 2026-01-23 |
| **G. ADD TASK** |
| G.1 | /tasks/new | - Tạo task mới (source=task_list) | ✅ | 2026-01-23 |
| G.2 | /tasks/new | - Save as Draft | ⚠️ BUG#1 | 2026-01-23 |
| G.3 | /tasks/new | - Submit for approval | ✅ | 2026-01-23 |
| G.4 | /tasks/new | - Edit existing draft | ✅ | 2026-01-23 |
| G.5 | /tasks/new | - Validation hiển thị đúng | ✅ | 2026-01-23 |
| G.6 | /tasks/new | - Scope selector (Store hierarchy) | ✅ | 2026-01-23 |
| G.7 | /tasks/new | - Photo upload (click/paste/drag) | ✅ | 2026-01-23 |
| G.8 | /tasks/new?source=library | - Không hiển thị Scope section | ✅ | 2026-01-23 |
| G.9 | /tasks/new?source=todo_task | - HQ hierarchy cho scope | ✅ | 2026-01-23 |
| **H. APPROVAL FLOW** |
| H.1 | /tasks/approval | - Hiển thị pending approvals | ✅ | 2026-01-23 |
| H.2 | /tasks/approval | - Approve task → status change | ✅ (FIX#1) | 2026-01-23 |
| H.3 | /tasks/approval | - Reject task với reason | ✅ | 2026-01-23 |
| H.4 | /tasks/approval | - Approver auto-determine | ✅ | 2026-01-23 |
| **I. LIBRARY** |
| I.1 | /tasks/library | - Hiển thị templates theo department | ✅ | 2026-01-23 |
| I.2 | /tasks/library | - Add New → /tasks/new?source=library | ✅ | 2026-01-23 |
| I.3 | /tasks/library | - Submit template for approval | ✅ | 2026-01-23 |
| I.4 | /tasks/library | - Approve → status=available | ✅ | 2026-01-23 |
| I.5 | /tasks/library | - Dispatch to stores | ✅ | 2026-01-23 |
| I.6 | /tasks/library | - dispatch_count updates | ✅ | 2026-01-23 |
| **J. TODO TASK** |
| J.1 | /tasks/todo | - Filter source=todo_task | ✅ | 2026-01-23 |
| J.2 | /tasks/todo | - Page loads (HTTP 200) | ✅ | 2026-01-23 |
| J.3 | /tasks/todo | - Filter "My Tasks" (created_staff_id) | ✅ | 2026-01-23 |
| **K. STORE TASKS** |
| K.1 | /stores/[id]/tasks | - GET store tasks | ✅ | 2026-01-23 |
| K.2 | /stores/[id]/tasks | - Start task action | ✅ | 2026-01-23 |
| K.3 | /stores/[id]/tasks | - Complete task → done_pending | ✅ | 2026-01-23 |
| K.4 | /stores/[id]/tasks | - Mark unable với reason | ✅ | 2026-01-23 |
| K.5 | /stores/[id]/tasks | - Assign to staff (S4-S2) | ✅ | 2026-01-23 |
| K.6 | /stores/[id]/tasks | - Page loads (HTTP 200) | ✅ | 2026-01-23 |
| **L. HQ CHECK** |
| L.1 | /tasks/hq-check | - GET hq-check list | ✅ | 2026-01-23 |
| L.2 | /tasks/hq-check | - HQ Check approve → done | ✅ | 2026-01-23 |
| L.3 | /tasks/hq-check | - HQ Reject → on_progress | ✅ | 2026-01-23 |
| L.4 | /tasks/hq-check | - Page loads (HTTP 200) | ✅ | 2026-01-23 |
| **M. UI/UX GENERAL** |
| M.1-M.7 | All screens | - All pages load HTTP 200 | ✅ | 2026-01-23 |
| M.1-M.7 | All screens | - Browser UI tests (Dark mode, Loading, etc.) | 🔍 Browser | - |

---

**BƯỚC 3: UI/UX SCREENSHOT TEST**

> **Mục đích**: Test giao diện visual của từng screen, user cung cấp screenshot để verify.
>
> **Quy trình thực hiện**:
> ```
> ┌─────────────────────────────────────────────────────────────────┐
> │  SCREENSHOT TEST WORKFLOW                                       │
> │                                                                 │
> │  1️⃣ CLAUDE YÊU CẦU CAPTURE                                      │
> │     → Hướng dẫn user chụp màn hình ở đâu, như thế nào          │
> │     → Chỉ rõ URL, trạng thái cần test, điều kiện cụ thể        │
> │                                                                 │
> │  2️⃣ USER CUNG CẤP SCREENSHOT                                    │
> │     → User chụp màn hình theo hướng dẫn                        │
> │     → Paste ảnh vào chat                                       │
> │                                                                 │
> │  3️⃣ CLAUDE PHÂN TÍCH & THẢO LUẬN                                │
> │     → Review screenshot theo test scenario                     │
> │     → So sánh với Expected UI                                  │
> │     → Thảo luận với user về findings                          │
> │                                                                 │
> │  4️⃣ CLAUDE ĐỀ XUẤT                                              │
> │     → Đề xuất cải thiện UI/UX nếu có vấn đề                   │
> │     → Liệt kê các options (nếu có nhiều cách fix)             │
> │                                                                 │
> │  5️⃣ USER QUYẾT ĐỊNH                                             │
> │     → User chọn implement những gì                             │
> │     → User có thể skip hoặc defer to later                    │
> │                                                                 │
> │  6️⃣ CLAUDE THỰC HIỆN CHANGES (CHƯA COMMIT)                      │
> │     → Implement changes theo quyết định của user              │
> │     → ⚠️ CHƯA COMMIT - chờ user xác nhận fix thành công       │
> │                                                                 │
> │  7️⃣ VERIFY CODE TRƯỚC KHI RETEST                                │
> │     → Claude đọc lại file đã sửa để xác nhận code đúng        │
> │     → Báo cáo cho user: code đã sửa đúng chưa?                │
> │     → Nếu code chưa đúng → quay lại bước 6                    │
> │     → Nếu code đã đúng → hướng dẫn user hard refresh          │
> │       (Ctrl+Shift+R hoặc restart dev server)                  │
> │                                                                 │
> │  8️⃣ USER RETEST & CUNG CẤP SCREENSHOT                           │
> │     → User retest sau khi hard refresh                        │
> │     → User cung cấp screenshot kết quả                        │
> │     → Claude review screenshot                                │
> │                                                                 │
> │  9️⃣ CLAUDE XÁC NHẬN & COMMIT                                    │
> │     → Nếu screenshot cho thấy FIX THÀNH CÔNG:                 │
> │       ✓ Commit & Push changes                                 │
> │       ✓ Cập nhật Status = ✅ PASSED trong bảng                │
> │       ✓ Ghi Fix Details                                       │
> │     → Nếu screenshot cho thấy VẪN LỖI:                        │
> │       ✗ KHÔNG commit                                          │
> │       ✗ Quay lại bước 3 để phân tích tiếp                    │
> │                                                                 │
> └─────────────────────────────────────────────────────────────────┘
> ```

#### N. LOGIN PAGE

| # | Test Scenario | Expected UI | Screenshot | Status | Tested At |
|---|---------------|-------------|------------|--------|-----------|
| N.1 | Login form - Light mode | Logo, Email input, Password input, Login button hiển thị đúng | ✅ | ✅ FIX | 2026-01-24 |
| N.2 | Login form - Dark mode | Form switch sang dark theme, colors phù hợp | N/A | N/A | 2026-01-24 |
| N.3 | Validation error - Empty fields | Button disables when fields empty (correct behavior) | ✅ | ✅ | 2026-01-24 |
| N.4 | Validation error - Wrong credentials | Error message hiển thị below password field | ✅ | ✅ PASSED | 2026-01-24 |
| N.5 | Loading state | Button disabled, spinner hiển thị khi đang login | ✅ | ✅ PASSED | 2026-01-24 |
| N.6 | Mobile responsive | Form centered, full width on mobile (<768px) | ✅ | ✅ PASSED | 2026-01-24 |

**N.1 Fix Details (2026-01-24):**
- Fixed typo: "Welcom back" → "Welcome back"
- Fixed typo: "deatls" → "details"
- Removed redundant "Welcome back!" from subtitle
- File: `frontend/src/app/auth/signin/page.tsx` (lines 130-131)

**N.2 Note:** Login page không có dark mode toggle. Dark mode chỉ available sau khi login.

**N.3 Note:** Form sử dụng button disable thay vì hiển thị error message khi fields trống. Sign in button chỉ enable khi cả 2 fields (Email/Phone và Password) đều có giá trị.

**N.4 Fix Details (2026-01-24):**
- **Root Cause:** AuthGuard was showing spinner for ALL routes when `isLoading=true`, causing SignInPage to unmount during login and losing form state (error message).
- **Fix:** Added early return for public routes in AuthGuard - always render children immediately for `/auth/*` routes.
- **File:** `frontend/src/components/auth/AuthGuard.tsx` (lines 39-43)
- **Commit:** `a50c63a`
- **Result:** Error message "Incorrect password" now displays correctly after login failure.

#### O. TASK LIST PAGE (/tasks/list)

| # | Test Scenario | Expected UI | Screenshot | Status | Tested At |
|---|---------------|-------------|------------|--------|-----------|
| O.1 | Page layout - Light mode | Header, filters, table hiển thị đúng layout | ✅ | ✅ | 2026-01-24 |
| O.2 | Page layout - Dark mode | Colors chuyển đổi phù hợp dark theme | ✅ | ✅ | 2026-01-24 |
| O.3 | Filter accordion | Click → expand/collapse animation smooth | ⏳ | ⏳ | - |
| O.4 | Filter chips | Selected filters hiển thị chips, X để remove | ⏳ | ⏳ | - |
| O.5 | Department dropdown | Dropdown mở, options hiển thị đầy đủ | ⏳ | ⏳ | - |
| O.6 | Status filter badges | Badges có màu đúng (Draft=gray, Approve=yellow, etc.) | ⏳ | ⏳ | - |
| O.7 | Table header | Columns aligned, sortable indicators | ⏳ | ⏳ | - |
| O.8 | Table row hover | Row highlight khi hover | ⏳ | ⏳ | - |
| O.9 | Status badge colors | Draft(gray), Approve(yellow), Not Yet(blue), Done(green), Overdue(red) | ⏳ | ⏳ | - |
| O.10 | Progress column | Progress bar hiển thị % với màu phù hợp | ⏳ | ⏳ | - |
| O.11 | Unable column | Counter hiển thị số stores unable (red text) | ⏳ | ⏳ | - |
| O.12 | Sub-tasks expand | Click arrow → sub-tasks hiện với indent | ⏳ | ⏳ | - |
| O.13 | Sub-tasks collapse | Click again → sub-tasks ẩn, animation smooth | ⏳ | ⏳ | - |
| O.14 | 3-dots menu | Hover row → menu icon, click → dropdown options | ⏳ | ⏳ | - |
| O.15 | Pagination | Page numbers, Previous/Next buttons styled đúng | ⏳ | ⏳ | - |
| O.16 | Empty state | Khi không có data → Empty illustration + message | ⏳ | ⏳ | - |
| O.17 | Loading skeleton | Skeleton placeholders khi loading | ⏳ | ⏳ | - |
| O.18 | History modal | Click status → modal mở, timeline UI | ⏳ | ⏳ | - |
| O.19 | History modal steps | SUBMIT → APPROVE → DO TASK → CHECK steps | ⏳ | ⏳ | - |
| O.20 | Mobile table scroll | Table scroll horizontal on mobile | ⏳ | ⏳ | - |

#### P. TASK DETAIL PAGE (/tasks/detail)

| # | Test Scenario | Expected UI | Screenshot | Status | Tested At |
|---|---------------|-------------|------------|--------|-----------|
| P.1 | Page header | Task name, status badge, back button | ⏳ | ⏳ | - |
| P.2 | Info section | A.Information, B.Instructions, C.Scope cards | ⏳ | ⏳ | - |
| P.3 | Statistics cards | 4 cards: Not Yet, Done, Unable, Avg Time - colors đúng | ⏳ | ⏳ | - |
| P.4 | Statistics - Not Yet | Gray card, count hiển thị | ⏳ | ⏳ | - |
| P.5 | Statistics - Done | Green card, count hiển thị | ⏳ | ⏳ | - |
| P.6 | Statistics - Unable | Orange/Red card, count hiển thị | ⏳ | ⏳ | - |
| P.7 | Statistics - Avg Time | Blue card, time format (Xh Xm) | ⏳ | ⏳ | - |
| P.8 | Store progress table | Store name, status badge, assignee, actions | ⏳ | ⏳ | - |
| P.9 | Store status badges | not_yet(gray), on_progress(blue), done_pending(yellow), done(green), unable(orange) | ⏳ | ⏳ | - |
| P.10 | Comments section | Comment list, add comment form | ⏳ | ⏳ | - |
| P.11 | Comment item | Avatar, name, timestamp, content, edit/delete buttons | ⏳ | ⏳ | - |
| P.12 | Add comment form | Textarea, Submit button | ⏳ | ⏳ | - |
| P.13 | Edit comment | Inline edit mode, Save/Cancel buttons | ⏳ | ⏳ | - |
| P.14 | Delete comment confirm | Confirmation dialog hiển thị | ⏳ | ⏳ | - |
| P.15 | Evidence modal | Click "View Evidence" → modal với images/files | ⏳ | ⏳ | - |
| P.16 | Evidence gallery | Image thumbnails, click to expand | ⏳ | ⏳ | - |
| P.17 | Dark mode | All elements switch colors properly | ⏳ | ⏳ | - |
| P.18 | Mobile layout | Cards stack vertically on mobile | ⏳ | ⏳ | - |

#### Q. ADD TASK PAGE (/tasks/new)

| # | Test Scenario | Expected UI | Screenshot | Status | Tested At |
|---|---------------|-------------|------------|--------|-----------|
| Q.1 | Page layout | A.Information, B.Instructions, C.Scope, D.Approval sections | ⏳ | ⏳ | - |
| Q.2 | Task name input | Text input với label, placeholder | ⏳ | ⏳ | - |
| Q.3 | Task Type dropdown | Dropdown với options: Daily, Weekly, Monthly, etc. | ⏳ | ⏳ | - |
| Q.4 | Date picker - Start | Calendar picker UI | ⏳ | ⏳ | - |
| Q.5 | Date picker - End | Calendar picker UI, validation start < end | ⏳ | ⏳ | - |
| Q.6 | Execution time input | Number input với unit selector (hours/minutes) | ⏳ | ⏳ | - |
| Q.7 | Instructions type radio | Image / Document radio buttons | ⏳ | ⏳ | - |
| Q.8 | Manual link input | URL input với validation | ⏳ | ⏳ | - |
| Q.9 | Note textarea | Textarea với character count | ⏳ | ⏳ | - |
| Q.10 | Photo upload - Empty | Upload area với icon, "Click or drag" text | ⏳ | ⏳ | - |
| Q.11 | Photo upload - With images | Thumbnails grid, remove button mỗi ảnh | ⏳ | ⏳ | - |
| Q.12 | Photo upload - Drag over | Highlight border khi drag file vào | ⏳ | ⏳ | - |
| Q.13 | Photo upload - Progress | Upload progress bar | ⏳ | ⏳ | - |
| Q.14 | Scope selector - Region | Dropdown với regions | ⏳ | ⏳ | - |
| Q.15 | Scope selector - Zone | Dropdown filtered by region | ⏳ | ⏳ | - |
| Q.16 | Scope selector - Area | Dropdown filtered by zone | ⏳ | ⏳ | - |
| Q.17 | Scope selector - Store | Multi-select stores | ⏳ | ⏳ | - |
| Q.18 | Scope - Selected stores | Chips hiển thị selected stores | ⏳ | ⏳ | - |
| Q.19 | HQ Scope (source=todo_task) | Division → Dept → Team → User hierarchy | ⏳ | ⏳ | - |
| Q.20 | D.Approval auto-fill | Approver name, title hiển thị tự động | ⏳ | ⏳ | - |
| Q.21 | Save Draft button | Button styled, disabled khi invalid | ⏳ | ⏳ | - |
| Q.22 | Submit button | Primary button styled | ⏳ | ⏳ | - |
| Q.23 | Validation errors | Red border, error messages hiển thị | ⏳ | ⏳ | - |
| Q.24 | Loading state | Buttons disabled, spinner khi saving | ⏳ | ⏳ | - |
| Q.25 | source=library mode | C.Scope section ẩn | ⏳ | ⏳ | - |
| Q.26 | Dark mode | All inputs, buttons switch theme | ⏳ | ⏳ | - |
| Q.27 | Mobile layout | Form full width, scrollable | ⏳ | ⏳ | - |

#### R. APPROVAL PAGE (/tasks/approval)

| # | Test Scenario | Expected UI | Screenshot | Status | Tested At |
|---|---------------|-------------|------------|--------|-----------|
| R.1 | Page header | "Pending Approvals" title, count badge | ⏳ | ⏳ | - |
| R.2 | Approval table | Task name, creator, department, period, status, actions | ⏳ | ⏳ | - |
| R.3 | Creator avatar | Avatar circle với initial letter | ⏳ | ⏳ | - |
| R.4 | View button | Eye icon, click → task detail | ⏳ | ⏳ | - |
| R.5 | Approve button | Green button "Approve" | ⏳ | ⏳ | - |
| R.6 | Reject button | Red button "Reject" | ⏳ | ⏳ | - |
| R.7 | Reject modal | Modal với reason textarea | ⏳ | ⏳ | - |
| R.8 | Reject validation | Error nếu reason empty | ⏳ | ⏳ | - |
| R.9 | Processing state | Button disabled, "..." text khi processing | ⏳ | ⏳ | - |
| R.10 | Success toast | Toast "Task approved" / "Task rejected" | ⏳ | ⏳ | - |
| R.11 | Empty state | "No pending approvals" message | ⏳ | ⏳ | - |
| R.12 | Non-HQ user | "Only HQ users can access" message | ⏳ | ⏳ | - |
| R.13 | Dark mode | Theme switch properly | ⏳ | ⏳ | - |

#### S. LIBRARY PAGE (/tasks/library)

| # | Test Scenario | Expected UI | Screenshot | Status | Tested At |
|---|---------------|-------------|------------|--------|-----------|
| S.1 | Page header | "Library" title, "Add New" button | ⏳ | ⏳ | - |
| S.2 | Department tabs/dropdown | Filter by department | ⏳ | ⏳ | - |
| S.3 | Template table | Type, Task Name, Owner, Last Update, Status, Usage | ⏳ | ⏳ | - |
| S.4 | Status badges | Draft, Approve, Available, Cooldown colors | ⏳ | ⏳ | - |
| S.5 | Cooldown badge | Cyan/Ice blue color | ⏳ | ⏳ | - |
| S.6 | Usage count | Number hiển thị | ⏳ | ⏳ | - |
| S.7 | Row actions menu | Edit, Duplicate, Delete, View Usage, Dispatch | ⏳ | ⏳ | - |
| S.8 | Dispatch action | Click → navigate to dispatch page | ⏳ | ⏳ | - |
| S.9 | Override cooldown modal | Modal với reason input (cho highest grade) | ⏳ | ⏳ | - |
| S.10 | Add New → /tasks/new | Navigate với source=library | ⏳ | ⏳ | - |
| S.11 | Empty state | "No templates" message | ⏳ | ⏳ | - |
| S.12 | Dark mode | Theme switch | ⏳ | ⏳ | - |

#### T. DISPATCH PAGE (/tasks/library/dispatch)

| # | Test Scenario | Expected UI | Screenshot | Status | Tested At |
|---|---------------|-------------|------------|--------|-----------|
| T.1 | Page header | Template name, back button | ⏳ | ⏳ | - |
| T.2 | Template preview | Read-only info from template | ⏳ | ⏳ | - |
| T.3 | Scope selector | Region → Zone → Area → Store hierarchy | ⏳ | ⏳ | - |
| T.4 | Date range picker | Start date, End date | ⏳ | ⏳ | - |
| T.5 | Priority selector | Dropdown/Radio for priority | ⏳ | ⏳ | - |
| T.6 | Dispatch button | Primary button "Dispatch to Stores" | ⏳ | ⏳ | - |
| T.7 | Confirmation | Confirm dialog trước dispatch | ⏳ | ⏳ | - |
| T.8 | Success redirect | Redirect về library sau dispatch | ⏳ | ⏳ | - |
| T.9 | Dark mode | Theme switch | ⏳ | ⏳ | - |

#### U. TODO TASK PAGE (/tasks/todo)

| # | Test Scenario | Expected UI | Screenshot | Status | Tested At |
|---|---------------|-------------|------------|--------|-----------|
| U.1 | Page header | "To Do Tasks" title | ⏳ | ⏳ | - |
| U.2 | Task list | HQ→HQ tasks hiển thị | ⏳ | ⏳ | - |
| U.3 | My Tasks filter | Filter checkbox/toggle | ⏳ | ⏳ | - |
| U.4 | Add New button | Navigate to /tasks/new?source=todo_task | ⏳ | ⏳ | - |
| U.5 | Task status badges | Same as Task List | ⏳ | ⏳ | - |
| U.6 | Empty state | "No tasks" message | ⏳ | ⏳ | - |
| U.7 | Dark mode | Theme switch | ⏳ | ⏳ | - |

#### V. STORE TASKS PAGE (/stores/[id]/tasks)

| # | Test Scenario | Expected UI | Screenshot | Status | Tested At |
|---|---------------|-------------|------------|--------|-----------|
| V.1 | Page header | Store name, task count | ⏳ | ⏳ | - |
| V.2 | Task list | Tasks assigned to this store | ⏳ | ⏳ | - |
| V.3 | Status badges | not_yet, on_progress, done_pending, done, unable | ⏳ | ⏳ | - |
| V.4 | Start button | Blue button for not_yet tasks | ⏳ | ⏳ | - |
| V.5 | Complete button | Green button for on_progress tasks | ⏳ | ⏳ | - |
| V.6 | Unable button | Orange button với reason modal | ⏳ | ⏳ | - |
| V.7 | Unable reason modal | Textarea required | ⏳ | ⏳ | - |
| V.8 | Assign to staff button | For S4-S2 users | ⏳ | ⏳ | - |
| V.9 | Staff selection modal | Dropdown list staff S1 | ⏳ | ⏳ | - |
| V.10 | Unassign button | For assigned tasks | ⏳ | ⏳ | - |
| V.11 | Complete modal | Notes input, evidence upload | ⏳ | ⏳ | - |
| V.12 | Evidence upload | File/Image upload UI | ⏳ | ⏳ | - |
| V.13 | Role-based visibility | S1 sees only assigned, S2-S4 sees all | ⏳ | ⏳ | - |
| V.14 | Dark mode | Theme switch | ⏳ | ⏳ | - |

#### W. HQ CHECK PAGE (/tasks/hq-check)

| # | Test Scenario | Expected UI | Screenshot | Status | Tested At |
|---|---------------|-------------|------------|--------|-----------|
| W.1 | Page header | "HQ Check" title, count badge | ⏳ | ⏳ | - |
| W.2 | Task cards | Expandable task cards | ⏳ | ⏳ | - |
| W.3 | Expand/Collapse | Click → show store list | ⏳ | ⏳ | - |
| W.4 | Store list | Store name, completion time, notes | ⏳ | ⏳ | - |
| W.5 | View evidence | Link to view store's evidence | ⏳ | ⏳ | - |
| W.6 | Checked button | Green button "Checked" | ⏳ | ⏳ | - |
| W.7 | Reject button | Red button "Reject" | ⏳ | ⏳ | - |
| W.8 | Reject reason modal | Textarea for reason | ⏳ | ⏳ | - |
| W.9 | Processing state | Buttons disabled during action | ⏳ | ⏳ | - |
| W.10 | Success feedback | Toast notification | ⏳ | ⏳ | - |
| W.11 | Empty state | "No tasks pending check" message | ⏳ | ⏳ | - |
| W.12 | Dark mode | Theme switch | ⏳ | ⏳ | - |

#### X. GENERAL UI/UX

| # | Test Scenario | Expected UI | Screenshot | Status | Tested At |
|---|---------------|-------------|------------|--------|-----------|
| X.1 | Navigation sidebar | All menu items visible, active state | ⏳ | ⏳ | - |
| X.2 | Sidebar collapse | Toggle button, icons only mode | ⏳ | ⏳ | - |
| X.3 | Dark mode toggle | Switch in header/sidebar | ⏳ | ⏳ | - |
| X.4 | User dropdown | Avatar, name, logout option | ⏳ | ⏳ | - |
| X.5 | Breadcrumb | Path navigation | ⏳ | ⏳ | - |
| X.6 | Toast notifications | Success (green), Error (red), Info (blue) | ⏳ | ⏳ | - |
| X.7 | Loading spinners | Consistent spinner design | ⏳ | ⏳ | - |
| X.8 | Skeleton loaders | Content placeholders | ⏳ | ⏳ | - |
| X.9 | Modal backdrop | Dark overlay, click outside to close | ⏳ | ⏳ | - |
| X.10 | Modal animations | Fade in/out, scale animations | ⏳ | ⏳ | - |
| X.11 | Button states | Normal, hover, active, disabled | ⏳ | ⏳ | - |
| X.12 | Input focus states | Focus ring, border color change | ⏳ | ⏳ | - |
| X.13 | Responsive breakpoints | Desktop (>1024), Tablet (768-1024), Mobile (<768) | ⏳ | ⏳ | - |
| X.14 | Mobile navigation | Hamburger menu, drawer | ⏳ | ⏳ | - |
| X.15 | Scroll behavior | Smooth scroll, sticky headers | ⏳ | ⏳ | - |
| X.16 | Error pages | 404, 500 page designs | ⏳ | ⏳ | - |
| X.17 | Print styles | Tables printable (if needed) | ⏳ | ⏳ | - |

---

**UI/UX TEST SUMMARY:**

| Section | Total Tests | Passed | Failed | N/A | Pending |
|---------|-------------|--------|--------|-----|---------|
| N. Login | 6 | 2 | 0 | 1 | 3 |
| O. Task List | 20 | 0 | 0 | 0 | 20 |
| P. Task Detail | 18 | 0 | 0 | 0 | 18 |
| Q. Add Task | 27 | 0 | 0 | 0 | 27 |
| R. Approval | 13 | 0 | 0 | 0 | 13 |
| S. Library | 12 | 0 | 0 | 0 | 12 |
| T. Dispatch | 9 | 0 | 0 | 0 | 9 |
| U. Todo Task | 7 | 0 | 0 | 0 | 7 |
| V. Store Tasks | 14 | 0 | 0 | 0 | 14 |
| W. HQ Check | 12 | 0 | 0 | 0 | 12 |
| X. General UI | 17 | 0 | 0 | 0 | 17 |
| **TOTAL** | **155** | **2** | **0** | **1** | **152** |

---

**TEST ACCOUNTS:**

| Role | Username | Password | Job Grade | Notes |
|------|----------|----------|-----------|-------|
| HQ Admin | admin | password | G9 | Full access |
| HQ User | hq_user1 | password | G3 | Normal HQ |
| Store Leader | store_lead | password | S3 | Store 1 |
| Store Staff | store_staff | password | S1 | Store 1 |

**BUG TRACKING:**

| # | Screen | Bug Description | Priority | Status | Fixed In |
|---|--------|-----------------|----------|--------|----------|
| BUG#1 | POST /tasks | status_id không tự động set =12 (DRAFT), tạo task mới có status_id=NULL | Medium | Open | - |
| FIX#1 | POST /tasks/{id}/approve | Thiếu status_id=14 (DISPATCHED) trong code_master | High | Fixed | Manual Test |

### PROGRESS TRACKING

```
┌─────────────────────────────────────────────────────────────────┐
│  PHASE 1 PROGRESS                                               │
│                                                                 │
│  Database:     [██████████] 100% (6/6 tasks)                   │
│  Backend APIs: [██████████] 100% (26/26 tasks)                 │
│  Frontend:     [██████████] 100% (47/47 tasks)                 │
│  Components:   [██████████] 100% (7/7 tasks)                   │
│  ────────────────────────────────────────────────────────────── │
│  OVERALL:      [██████████] 100%                               │
│                                                                 │
│  PHASE 2 PROGRESS: [██████████] 100% (9/9 tasks)               │
│  PHASE 3 PROGRESS: [██████████] 100% (10/10 tasks)             │
│  PHASE 4 PROGRESS: [░░░░░░░░░░] 0% (0/39 tasks)                │
│    → 4.1 Service Layer: ⏳ (0/6)                                │
│    → 4.2 Form Requests: ⏳ (0/6)                                │
│    → 4.3 Passport Auth: ⏳ (0/7)                                │
│    → 4.4 Caching: ⏳ (0/6)                                      │
│    → 4.5 Background Jobs: ⏳ (0/6)                              │
│    → 4.6 Query Optimization: ⏳ (0/5)                           │
│    → 4.7 Code Quality: ⏳ (0/5)                                 │
│    → 4.8 Monitoring: ⏳ (0/4)                                   │
│  PHASE 5 PROGRESS: [███░░░░░░░] ~26% (Step 3 in progress)      │
│    → Step 1 CLI/Bash Tests: ✅ PASSED (2026-01-23)             │
│    → Step 2 Manual Tests: ✅ PASSED (2026-01-23)               │
│      54/56 tests passed, 1 bug found (BUG#1), 1 fix applied    │
│    → Step 3 UI/UX Screenshot Tests: 🔄 IN PROGRESS (5/155)     │
│      N.1-N.6 ✅, O.1 ✅, O.2 ✅ (Task List Dark mode)          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

Last Updated: 2026-01-24 (Step 3 UI/UX Test - O.2 completed)
```

### LEGEND

| Symbol | Meaning |
|--------|---------|
| ✅ | Hoàn thành |
| 🔄 | Đang làm / Cần review |
| ⏳ | Chưa bắt đầu |
| ❌ | Blocked / Có vấn đề |

---

## Tham khảo chi tiết

- Session Start: `docs/SESSION_START_CHECKLIST.md`
- Deployment: `docs/06-deployment/DEPLOY-PA-VIETNAM-HOSTING.md`
