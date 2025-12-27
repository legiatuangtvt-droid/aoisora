# OptiChain WS & DWS - Tài Liệu Thiết Kế Hệ Thống

**Version:** 1.0
**Ngày tạo:** 2025-12-27
**Cập nhật lần cuối:** 2025-12-27

---

## Mục Lục

1. [Tổng Quan Hệ Thống](#1-tổng-quan-hệ-thống)
2. [Kiến Trúc Hệ Thống](#2-kiến-trúc-hệ-thống)
3. [Thiết Kế Database](#3-thiết-kế-database)
4. [Thiết Kế Backend API](#4-thiết-kế-backend-api)
5. [Thiết Kế Frontend](#5-thiết-kế-frontend)
6. [Luồng Xử Lý Nghiệp Vụ](#6-luồng-xử-lý-nghiệp-vụ)
7. [Bảo Mật](#7-bảo-mật)
8. [Deployment](#8-deployment)

---

## 1. Tổng Quan Hệ Thống

### 1.1. Giới Thiệu

OptiChain là hệ thống quản lý công việc và lịch làm việc cho chuỗi cửa hàng bán lẻ, bao gồm hai module chính:

- **WS (Work Schedule):** Quản lý công việc, task, checklist cho nhân viên
- **DWS (Dispatch Work Schedule):** Quản lý ca làm việc, phân công nhân sự

### 1.2. Mục Tiêu

| Mục tiêu | Mô tả |
|----------|-------|
| Số hóa quy trình | Chuyển đổi từ quản lý thủ công sang hệ thống số |
| Theo dõi real-time | Giám sát tiến độ công việc và ca làm việc |
| Tối ưu nhân sự | Phân bổ nhân lực hiệu quả theo man-hour |
| Báo cáo tự động | Tổng hợp và phân tích dữ liệu hoạt động |

### 1.3. Phạm Vi Hệ Thống

```
┌─────────────────────────────────────────────────────────────┐
│                    OptiChain System                          │
├─────────────────────────────┬───────────────────────────────┤
│      WS Module              │       DWS Module               │
├─────────────────────────────┼───────────────────────────────┤
│ • Task Management           │ • Shift Code Management        │
│ • Checklist Tracking        │ • Staff Scheduling             │
│ • Status Workflow           │ • Man-hour Calculation         │
│ • Notification System       │ • Weekly Schedule View         │
│ • Manual Reference          │ • Daily Schedule View          │
└─────────────────────────────┴───────────────────────────────┘
```

### 1.4. Stakeholders

| Role | Mô tả | Quyền hạn |
|------|-------|-----------|
| Admin | Quản trị hệ thống | Full access |
| Manager | Quản lý cửa hàng | CRUD tasks, shifts, view reports |
| Supervisor | Giám sát | Assign tasks, update status |
| Staff | Nhân viên | View/update assigned tasks |

---

## 2. Kiến Trúc Hệ Thống

### 2.1. Tổng Quan Kiến Trúc

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │   Web Browser   │  │  Mobile Browser │  │   API Client    │  │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘  │
└───────────┼─────────────────────┼─────────────────────┼──────────┘
            │                     │                     │
            └─────────────────────┼─────────────────────┘
                                  │ HTTPS
┌─────────────────────────────────┼───────────────────────────────┐
│                      FRONTEND LAYER                              │
│  ┌──────────────────────────────┴──────────────────────────────┐│
│  │                    Next.js 14 (App Router)                   ││
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐   ││
│  │  │  Pages/      │  │  Components/ │  │  API Client      │   ││
│  │  │  - Tasks     │  │  - UI        │  │  - Auth          │   ││
│  │  │  - DWS       │  │  - Forms     │  │  - Fetch         │   ││
│  │  │  - Auth      │  │  - Layout    │  │  - Error Handle  │   ││
│  │  └──────────────┘  └──────────────┘  └──────────────────┘   ││
│  └──────────────────────────────────────────────────────────────┘│
│                         Netlify (CDN)                            │
└─────────────────────────────────┬───────────────────────────────┘
                                  │ REST API
┌─────────────────────────────────┼───────────────────────────────┐
│                       BACKEND LAYER                              │
│  ┌──────────────────────────────┴──────────────────────────────┐│
│  │                    FastAPI (Python 3.11+)                    ││
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐   ││
│  │  │  API Routes  │  │  Services    │  │  Core            │   ││
│  │  │  - /auth     │  │  - Auth      │  │  - Security      │   ││
│  │  │  - /staff    │  │  - Task      │  │  - Config        │   ││
│  │  │  - /tasks    │  │  - Shift     │  │  - Database      │   ││
│  │  │  - /shifts   │  │  - Notify    │  │  - Middleware    │   ││
│  │  └──────────────┘  └──────────────┘  └──────────────────┘   ││
│  └──────────────────────────────────────────────────────────────┘│
│                          Render (Cloud)                          │
└─────────────────────────────────┬───────────────────────────────┘
                                  │ SQL
┌─────────────────────────────────┼───────────────────────────────┐
│                       DATABASE LAYER                             │
│  ┌──────────────────────────────┴──────────────────────────────┐│
│  │                   PostgreSQL 15+                             ││
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐   ││
│  │  │  Core Tables │  │  WS Tables   │  │  DWS Tables      │   ││
│  │  │  - regions   │  │  - tasks     │  │  - shift_codes   │   ││
│  │  │  - stores    │  │  - manuals   │  │  - shift_assign  │   ││
│  │  │  - staff     │  │  - checklists│  │                  │   ││
│  │  │  - depts     │  │  - code_mstr │  │                  │   ││
│  │  └──────────────┘  └──────────────┘  └──────────────────┘   ││
│  └──────────────────────────────────────────────────────────────┘│
│                           Neon (Cloud)                           │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2. Technology Stack

| Layer | Technology | Version | Mục đích |
|-------|------------|---------|----------|
| Frontend | Next.js | 14.x | React framework với SSR |
| Frontend | TypeScript | 5.x | Type safety |
| Frontend | Tailwind CSS | 3.x | Styling |
| Backend | FastAPI | 0.100+ | REST API framework |
| Backend | SQLAlchemy | 2.x | ORM |
| Backend | Pydantic | 2.x | Data validation |
| Database | PostgreSQL | 15+ | Relational database |
| Auth | JWT | - | Token-based auth |
| Hosting | Netlify | - | Frontend hosting |
| Hosting | Render | - | Backend hosting |
| Database | Neon | - | Serverless PostgreSQL |

### 2.3. Communication Flow

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  Client  │────▶│ Frontend │────▶│ Backend  │────▶│ Database │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
     │                │                │                │
     │   1. Request   │                │                │
     │───────────────▶│                │                │
     │                │  2. API Call   │                │
     │                │───────────────▶│                │
     │                │                │  3. Query      │
     │                │                │───────────────▶│
     │                │                │  4. Result     │
     │                │                │◀───────────────│
     │                │  5. Response   │                │
     │                │◀───────────────│                │
     │   6. Render    │                │                │
     │◀───────────────│                │                │
```

---

## 3. Thiết Kế Database

### 3.1. Entity Relationship Diagram

```
                              ┌─────────────┐
                              │   regions   │
                              │─────────────│
                              │ region_id PK│
                              │ region_name │
                              │ region_code │
                              └──────┬──────┘
                                     │ 1
                                     │
                                     │ N
                              ┌──────┴──────┐
                              │   stores    │
                              │─────────────│
                              │ store_id PK │
                              │ store_name  │
         ┌────────────────────│ region_id FK│────────────────────┐
         │                    │ manager_id FK                    │
         │                    └──────┬──────┘                    │
         │                           │ 1                         │
         │                           │                           │
         │                           │ N                         │
         │    ┌─────────────┐ ┌──────┴──────┐ ┌─────────────┐   │
         │    │ departments │ │    staff    │ │ shift_codes │   │
         │    │─────────────│ │─────────────│ │─────────────│   │
         │    │ dept_id PK  │ │ staff_id PK │ │shift_code_id│   │
         │    │ dept_name   │ │ staff_name  │ │ shift_code  │   │
         │    │ dept_code   │ │ email       │ │ shift_name  │   │
         │    └──────┬──────┘ │ store_id FK │ │ start_time  │   │
         │           │        │ dept_id FK  │ │ end_time    │   │
         │           │ 1      │ role        │ │ duration    │   │
         │           │        │ password    │ │ color_code  │   │
         │           │ N      └──────┬──────┘ └──────┬──────┘   │
         │           │               │               │           │
         │           └───────────────┼───────────────┘           │
         │                           │                           │
         │              ┌────────────┼────────────┐              │
         │              │            │            │              │
         │              ▼            ▼            ▼              │
         │    ┌─────────────┐ ┌─────────────┐ ┌─────────────┐   │
         │    │    tasks    │ │notifications│ │shift_assign │   │
         │    │─────────────│ │─────────────│ │─────────────│   │
         │    │ task_id PK  │ │ notif_id PK │ │assign_id PK │   │
         │    │ task_name   │ │ recipient FK│ │ staff_id FK │   │
         │    │ status_id FK│ │ sender FK   │ │ store_id FK │   │
         │    │ staff_id FK │ │ type        │ │shift_code FK│   │
         │    │ store_id FK │ │ title       │ │ shift_date  │   │
         │    │ dept_id FK  │ │ message     │ │ status      │   │
         │    └──────┬──────┘ │ is_read     │ │ notes       │   │
         │           │        └─────────────┘ └─────────────┘   │
         │           │ N                                         │
         │           │                                           │
         │    ┌──────┴──────┐                                   │
         │    │task_checklist                                   │
         │    │─────────────│     ┌─────────────┐               │
         │    │ id PK       │     │ check_lists │               │
         │    │ task_id FK  │────▶│─────────────│               │
         │    │checklist_id │     │checklist_id │               │
         │    │ check_status│     │checklist_name               │
         │    │ completed_at│     │ description │               │
         │    └─────────────┘     └─────────────┘               │
         │                                                       │
         │    ┌─────────────┐     ┌─────────────┐               │
         │    │ code_master │     │   manuals   │               │
         │    │─────────────│     │─────────────│               │
         │    │code_master_id     │ manual_id PK│               │
         │    │ code_type   │     │ manual_name │               │
         │    │ code        │     │ manual_url  │               │
         │    │ name        │     │ description │               │
         │    └─────────────┘     └─────────────┘               │
         │                                                       │
         └───────────────────────────────────────────────────────┘
```

### 3.2. Chi Tiết Bảng Dữ Liệu

#### 3.2.1. Core Tables

**regions** - Quản lý khu vực địa lý
```sql
CREATE TABLE regions (
    region_id SERIAL PRIMARY KEY,
    region_name VARCHAR(255) NOT NULL,
    region_code VARCHAR(50) UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**departments** - Phòng ban
```sql
CREATE TABLE departments (
    department_id SERIAL PRIMARY KEY,
    department_name VARCHAR(255) NOT NULL,
    department_code VARCHAR(50) UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**stores** - Cửa hàng
```sql
CREATE TABLE stores (
    store_id SERIAL PRIMARY KEY,
    store_name VARCHAR(255) NOT NULL,
    store_code VARCHAR(50) UNIQUE,
    region_id INTEGER REFERENCES regions(region_id),
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(100),
    manager_id INTEGER REFERENCES staff(staff_id),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**staff** - Nhân viên
```sql
CREATE TABLE staff (
    staff_id SERIAL PRIMARY KEY,
    staff_name VARCHAR(255) NOT NULL,
    staff_code VARCHAR(50) UNIQUE,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20),
    store_id INTEGER REFERENCES stores(store_id),
    department_id INTEGER REFERENCES departments(department_id),
    role VARCHAR(50), -- manager, supervisor, staff
    password_hash VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_staff_store ON staff(store_id);
```

#### 3.2.2. WS Tables (Work Schedule)

**code_master** - Bảng lookup codes
```sql
CREATE TABLE code_master (
    code_master_id SERIAL PRIMARY KEY,
    code_type VARCHAR(50) NOT NULL, -- task_type, response_type, status
    code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(code_type, code)
);

-- Seed data
INSERT INTO code_master (code_type, code, name) VALUES
('task_type', 'STATISTICS', 'Thống kê'),
('task_type', 'ARRANGE', 'Sắp xếp'),
('task_type', 'PREPARE', 'Chuẩn bị'),
('response_type', 'PICTURE', 'Picture'),
('response_type', 'CHECKLIST', 'Check-List'),
('response_type', 'YESNO', 'Yes-No'),
('status', 'NOT_YET', 'Not Yet'),
('status', 'ON_PROGRESS', 'On Progress'),
('status', 'DONE', 'Done'),
('status', 'OVERDUE', 'Overdue'),
('status', 'REJECT', 'Reject');
```

**tasks** - Công việc
```sql
CREATE TABLE tasks (
    task_id SERIAL PRIMARY KEY,
    task_name VARCHAR(500) NOT NULL,
    task_description TEXT,
    manual_id INTEGER REFERENCES manuals(manual_id),
    task_type_id INTEGER REFERENCES code_master(code_master_id),
    response_type_id INTEGER REFERENCES code_master(code_master_id),
    response_num INTEGER,
    is_repeat BOOLEAN DEFAULT FALSE,
    repeat_config JSONB, -- {"frequency": "daily", "days": [1,2,3]}
    dept_id INTEGER REFERENCES departments(department_id),
    assigned_store_id INTEGER REFERENCES stores(store_id),
    assigned_staff_id INTEGER REFERENCES staff(staff_id),
    do_staff_id INTEGER REFERENCES staff(staff_id),
    status_id INTEGER REFERENCES code_master(code_master_id),
    priority VARCHAR(20) DEFAULT 'normal', -- low, normal, high, urgent
    start_date DATE,
    end_date DATE,
    start_time TIME,
    due_datetime TIMESTAMP,
    completed_time TIMESTAMP,
    comment TEXT,
    attachments JSONB, -- ["url1", "url2"]
    created_staff_id INTEGER REFERENCES staff(staff_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tasks_status ON tasks(status_id);
CREATE INDEX idx_tasks_assigned_staff ON tasks(assigned_staff_id);
CREATE INDEX idx_tasks_date ON tasks(start_date, end_date);
```

**check_lists** - Thư viện checklist
```sql
CREATE TABLE check_lists (
    check_list_id SERIAL PRIMARY KEY,
    check_list_name VARCHAR(500) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**task_check_list** - Task-Checklist mapping
```sql
CREATE TABLE task_check_list (
    id SERIAL PRIMARY KEY,
    task_id INTEGER REFERENCES tasks(task_id) ON DELETE CASCADE,
    check_list_id INTEGER REFERENCES check_lists(check_list_id) ON DELETE CASCADE,
    check_status BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP,
    completed_by INTEGER REFERENCES staff(staff_id),
    notes TEXT,
    UNIQUE(task_id, check_list_id)
);
```

#### 3.2.3. DWS Tables (Dispatch Work Schedule)

**shift_codes** - Định nghĩa ca làm việc
```sql
CREATE TABLE shift_codes (
    shift_code_id SERIAL PRIMARY KEY,
    shift_code VARCHAR(10) NOT NULL UNIQUE, -- S, C, T, OFF, V812
    shift_name VARCHAR(100) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    duration_hours DECIMAL(4,2),
    color_code VARCHAR(7), -- Hex color #FFD700
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Default shift codes
INSERT INTO shift_codes (shift_code, shift_name, start_time, end_time, duration_hours, color_code) VALUES
('S', 'Ca Sáng', '06:00', '14:00', 8.00, '#FFD700'),
('C', 'Ca Chiều', '14:00', '22:00', 8.00, '#87CEEB'),
('T', 'Ca Tối', '22:00', '06:00', 8.00, '#4B0082'),
('OFF', 'Nghỉ', '00:00', '00:00', 0.00, '#D3D3D3'),
('FULL', 'Ca Toàn Thời', '08:00', '20:00', 12.00, '#32CD32');
```

**shift_assignments** - Phân ca cho nhân viên
```sql
CREATE TABLE shift_assignments (
    assignment_id SERIAL PRIMARY KEY,
    staff_id INTEGER REFERENCES staff(staff_id) ON DELETE CASCADE,
    store_id INTEGER REFERENCES stores(store_id),
    shift_date DATE NOT NULL,
    shift_code_id INTEGER REFERENCES shift_codes(shift_code_id),
    status VARCHAR(20) DEFAULT 'assigned', -- assigned, confirmed, completed, cancelled
    notes TEXT,
    assigned_by INTEGER REFERENCES staff(staff_id),
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(staff_id, shift_date, shift_code_id)
);

CREATE INDEX idx_shift_date ON shift_assignments(shift_date);
CREATE INDEX idx_shift_staff ON shift_assignments(staff_id);
```

#### 3.2.4. Notification Table

**notifications** - Thông báo
```sql
CREATE TABLE notifications (
    notification_id SERIAL PRIMARY KEY,
    recipient_staff_id INTEGER REFERENCES staff(staff_id) ON DELETE CASCADE,
    sender_staff_id INTEGER REFERENCES staff(staff_id) ON DELETE SET NULL,
    notification_type VARCHAR(50), -- task_assigned, task_status_changed, shift_assigned
    title VARCHAR(255) NOT NULL,
    message TEXT,
    link_url TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_recipient ON notifications(recipient_staff_id, is_read);
```

### 3.3. Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    Task Status Flow                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│    ┌─────────┐    Assign     ┌─────────────┐                │
│    │ NOT_YET │──────────────▶│ ON_PROGRESS │                │
│    └────┬────┘               └──────┬──────┘                │
│         │                           │                        │
│         │ Overdue                   │ Complete               │
│         ▼                           ▼                        │
│    ┌─────────┐               ┌─────────┐                    │
│    │ OVERDUE │               │  DONE   │                    │
│    └─────────┘               └────┬────┘                    │
│                                   │                          │
│                                   │ Reject                   │
│                                   ▼                          │
│                              ┌─────────┐                    │
│                              │ REJECT  │                    │
│                              └─────────┘                    │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. Thiết Kế Backend API

### 4.1. API Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI app entry
│   ├── api/
│   │   └── v1/
│   │       ├── __init__.py
│   │       ├── auth.py         # Authentication endpoints
│   │       ├── staff.py        # Staff management
│   │       ├── tasks.py        # Task CRUD
│   │       ├── shifts.py       # Shift management
│   │       └── notifications.py # Notification endpoints
│   ├── core/
│   │   ├── __init__.py
│   │   ├── config.py           # Settings & environment
│   │   ├── database.py         # Database connection
│   │   └── security.py         # JWT & password utils
│   ├── models/
│   │   ├── __init__.py
│   │   ├── staff.py            # Staff, Store, Department models
│   │   ├── task.py             # Task, Checklist models
│   │   ├── shift.py            # Shift models
│   │   └── notification.py     # Notification model
│   └── schemas/
│       ├── __init__.py
│       ├── staff.py            # Staff schemas
│       ├── task.py             # Task schemas
│       ├── shift.py            # Shift schemas
│       └── notification.py     # Notification schemas
├── requirements.txt
└── .env
```

### 4.2. API Endpoints

#### 4.2.1. Authentication API

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/v1/auth/login` | Đăng nhập, trả về JWT token | No |
| GET | `/api/v1/auth/me` | Lấy thông tin user hiện tại | Yes |
| POST | `/api/v1/auth/change-password` | Đổi mật khẩu | Yes |
| POST | `/api/v1/auth/logout` | Đăng xuất | Yes |

**Request/Response Examples:**

```json
// POST /api/v1/auth/login
// Request
{
  "email": "user@example.com",
  "password": "password123"
}

// Response 200
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer",
  "expires_in": 1440,
  "staff_id": 1,
  "staff_name": "Nguyen Van A",
  "role": "manager"
}

// Response 401
{
  "detail": "Incorrect email or password"
}
```

#### 4.2.2. Staff API

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| GET | `/api/v1/staff` | Danh sách nhân viên | Yes | All |
| GET | `/api/v1/staff/{id}` | Chi tiết nhân viên | Yes | All |
| POST | `/api/v1/staff` | Tạo nhân viên mới | Yes | Manager |
| PUT | `/api/v1/staff/{id}` | Cập nhật nhân viên | Yes | Manager |
| DELETE | `/api/v1/staff/{id}` | Xóa nhân viên | Yes | Manager |
| GET | `/api/v1/staff/stores` | Danh sách cửa hàng | Yes | All |
| GET | `/api/v1/staff/departments` | Danh sách phòng ban | Yes | All |
| GET | `/api/v1/staff/regions` | Danh sách khu vực | Yes | All |

**Query Parameters:**
```
GET /api/v1/staff?store_id=1&department_id=2&role=staff&is_active=true&skip=0&limit=20
```

#### 4.2.3. Tasks API (WS)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/tasks` | Danh sách tasks | Yes |
| GET | `/api/v1/tasks/{id}` | Chi tiết task | Yes |
| POST | `/api/v1/tasks` | Tạo task mới | Yes |
| PUT | `/api/v1/tasks/{id}` | Cập nhật task | Yes |
| PUT | `/api/v1/tasks/{id}/status` | Cập nhật status | Yes |
| DELETE | `/api/v1/tasks/{id}` | Xóa task | Yes |
| GET | `/api/v1/tasks/{id}/checklists` | Danh sách checklist | Yes |
| PUT | `/api/v1/tasks/{id}/checklists/{cid}` | Update checklist item | Yes |
| GET | `/api/v1/tasks/code-master` | Lấy code master | Yes |

**Query Parameters:**
```
GET /api/v1/tasks?status_id=7&assigned_staff_id=1&assigned_store_id=1&dept_id=1&priority=high&start_date=2025-01-01&end_date=2025-01-31&skip=0&limit=50
```

**Request/Response Examples:**

```json
// POST /api/v1/tasks
// Request
{
  "task_name": "Kiểm kê hàng hóa",
  "task_description": "Kiểm kê kho hàng cuối ngày",
  "assigned_store_id": 1,
  "assigned_staff_id": 5,
  "status_id": 7,
  "priority": "high",
  "start_date": "2025-01-15",
  "due_datetime": "2025-01-15T18:00:00"
}

// Response 201
{
  "task_id": 123,
  "task_name": "Kiểm kê hàng hóa",
  "status": {
    "code_master_id": 7,
    "code": "NOT_YET",
    "name": "Not Yet"
  },
  "assigned_staff": {
    "staff_id": 5,
    "staff_name": "Tran Van B"
  },
  "created_at": "2025-01-15T08:00:00Z"
}
```

#### 4.2.4. Shifts API (DWS)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/shifts/codes` | Danh sách shift codes | Yes |
| POST | `/api/v1/shifts/codes` | Tạo shift code mới | Yes |
| PUT | `/api/v1/shifts/codes/{id}` | Cập nhật shift code | Yes |
| DELETE | `/api/v1/shifts/codes/{id}` | Xóa shift code | Yes |
| POST | `/api/v1/shifts/codes/generate` | Tạo shift codes mặc định | Yes |
| GET | `/api/v1/shifts/assignments` | Danh sách assignments | Yes |
| POST | `/api/v1/shifts/assignments` | Tạo assignment | Yes |
| POST | `/api/v1/shifts/assignments/bulk` | Tạo nhiều assignments | Yes |
| PUT | `/api/v1/shifts/assignments/{id}` | Cập nhật assignment | Yes |
| DELETE | `/api/v1/shifts/assignments/{id}` | Xóa assignment | Yes |
| GET | `/api/v1/shifts/weekly-schedule` | Lịch tuần | Yes |
| GET | `/api/v1/shifts/man-hour-report` | Báo cáo man-hour | Yes |

**Request/Response Examples:**

```json
// POST /api/v1/shifts/assignments/bulk
// Request
{
  "staff_ids": [1, 2, 3],
  "store_id": 1,
  "shift_dates": ["2025-01-15", "2025-01-16", "2025-01-17"],
  "shift_code_id": 1,
  "notes": "Ca tăng cường cuối tuần"
}

// Response 201
{
  "created": 9,
  "skipped": 0,
  "assignments": [...]
}

// GET /api/v1/shifts/man-hour-report?date=2025-01-15&store_id=1
// Response
[
  {
    "date": "2025-01-15",
    "store_id": 1,
    "store_name": "Store Hà Đông",
    "total_hours": 72,
    "target_hours": 80,
    "difference": -8,
    "status": "THIẾU",
    "staff_count": 9
  }
]
```

#### 4.2.5. Notifications API

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/notifications` | Danh sách thông báo | Yes |
| GET | `/api/v1/notifications/unread-count` | Số thông báo chưa đọc | Yes |
| PUT | `/api/v1/notifications/{id}/read` | Đánh dấu đã đọc | Yes |
| PUT | `/api/v1/notifications/mark-all-read` | Đánh dấu tất cả đã đọc | Yes |
| DELETE | `/api/v1/notifications/{id}` | Xóa thông báo | Yes |
| DELETE | `/api/v1/notifications/clear-read` | Xóa thông báo đã đọc | Yes |

### 4.3. Error Handling

```json
// Standard Error Response Format
{
  "detail": "Error message",
  "status_code": 400,
  "error_type": "ValidationError"
}

// HTTP Status Codes
// 200 - OK
// 201 - Created
// 204 - No Content
// 400 - Bad Request
// 401 - Unauthorized
// 403 - Forbidden
// 404 - Not Found
// 422 - Validation Error
// 500 - Internal Server Error
```

### 4.4. Authentication Flow

```
┌──────────┐                    ┌──────────┐                    ┌──────────┐
│  Client  │                    │  Server  │                    │ Database │
└────┬─────┘                    └────┬─────┘                    └────┬─────┘
     │                               │                               │
     │  1. POST /auth/login          │                               │
     │  {email, password}            │                               │
     │──────────────────────────────▶│                               │
     │                               │  2. Query staff by email      │
     │                               │──────────────────────────────▶│
     │                               │  3. Return staff record       │
     │                               │◀──────────────────────────────│
     │                               │                               │
     │                               │  4. Verify password (bcrypt)  │
     │                               │                               │
     │                               │  5. Generate JWT token        │
     │                               │                               │
     │  6. Return token              │                               │
     │◀──────────────────────────────│                               │
     │                               │                               │
     │  7. GET /tasks                │                               │
     │  Authorization: Bearer <token>│                               │
     │──────────────────────────────▶│                               │
     │                               │  8. Validate JWT              │
     │                               │  9. Extract user from token   │
     │                               │                               │
     │                               │  10. Query tasks              │
     │                               │──────────────────────────────▶│
     │                               │  11. Return tasks             │
     │                               │◀──────────────────────────────│
     │  12. Return response          │                               │
     │◀──────────────────────────────│                               │
```

---

## 5. Thiết Kế Frontend

### 5.1. Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Homepage
│   │   ├── tasks/
│   │   │   ├── page.tsx        # Tasks list
│   │   │   └── [id]/
│   │   │       └── page.tsx    # Task detail
│   │   └── dws/
│   │       ├── daily-schedule/
│   │       │   └── page.tsx    # Daily schedule view
│   │       ├── shift-codes/
│   │       │   └── page.tsx    # Shift codes management
│   │       └── workforce-dispatch/
│   │           └── page.tsx    # Workforce dispatch
│   ├── components/
│   │   ├── ui/                 # Reusable UI components
│   │   ├── forms/              # Form components
│   │   └── layout/             # Layout components
│   ├── lib/
│   │   └── api.ts              # API client
│   ├── types/
│   │   └── api.ts              # TypeScript types
│   └── hooks/                  # Custom hooks
├── public/
├── tailwind.config.js
├── next.config.js
└── package.json
```

### 5.2. Page Layouts

#### 5.2.1. Tasks Page (WS)

```
┌─────────────────────────────────────────────────────────────────┐
│  HEADER                                                          │
│  ┌────────┐  ┌─────────────┐  ┌────────────┐        ┌────────┐ │
│  │ ← Back │  │ Store Filter│  │Staff Filter│        │ Status │ │
│  └────────┘  └─────────────┘  └────────────┘        └────────┘ │
├─────────────────────────────────────────────────────────────────┤
│  WEEK NAVIGATION                                                 │
│  ┌────┐  ┌─────────────────────────────────────────────┐ ┌────┐│
│  │ << │  │                    W52                       │ │ >> ││
│  └────┘  │              Dec 22 - Dec 28 2025            │ └────┘│
│          └─────────────────────────────────────────────┘        │
├─────────────────────────────────────────────────────────────────┤
│  DAYS GRID                                                       │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐      │
│  │ Mon │ │ Tue │ │ Wed │ │ Thu │ │ Fri │ │ Sat │ │ Sun │      │
│  │22/12│ │23/12│ │24/12│ │25/12│ │26/12│ │27/12│ │28/12│      │
│  ├─────┤ ├─────┤ ├─────┤ ├─────┤ ├─────┤ ├─────┤ ├─────┤      │
│  │5 Act│ │3 Act│ │4 Act│ │2 Act│ │6 Act│ │1 Act│ │0 Act│      │
│  │2 NY │ │1 NY │ │2 NY │ │1 NY │ │3 NY │ │0 NY │ │0 NY │      │
│  │1 OD │ │0 OD │ │0 OD │ │0 OD │ │1 OD │ │0 OD │ │0 OD │      │
│  │1 OP │ │1 OP │ │1 OP │ │0 OP │ │1 OP │ │1 OP │ │0 OP │      │
│  │1 DN │ │1 DN │ │1 DN │ │1 DN │ │1 DN │ │0 DN │ │0 DN │      │
│  └─────┘ └─────┘ └─────┘ └─────┘ └─────┘ └─────┘ └─────┘      │
├─────────────────────────────────────────────────────────────────┤
│  TASK LIST                                                       │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ ┌──────┐ ┌──────┐                                         │  │
│  │ │Status│ │Priority│  Task Name                    [View]  │  │
│  │ └──────┘ └──────┘                                         │  │
│  │ Assigned: Staff Name  |  Store: Store Name  |  Due: Time  │  │
│  └───────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ ...more tasks...                                          │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

#### 5.2.2. Daily Schedule Page (DWS)

```
┌─────────────────────────────────────────────────────────────────┐
│  HEADER                                                          │
│  ┌────────┐  Lich Hang Ngay - Daily Schedule  ┌─────────────┐   │
│  │ ← Back │                                    │ Store Filter│   │
│  └────────┘                                    └─────────────┘   │
├─────────────────────────────────────────────────────────────────┤
│  WEEK NAVIGATION                                                 │
│  ┌────┐ ┌────┬────┬────┬────┬────┬────┬────┐ ┌────┐            │
│  │ << │ │ T2 │ T3 │ T4 │ T5 │ T6 │ T7 │ CN │ │ >> │            │
│  └────┘ │22/12│23/12│24/12│25/12│26/12│27/12│28/12│ └────┘      │
│         └────┴────┴────┴────┴────┴────┴────┘                    │
├─────────────────────────────────────────────────────────────────┤
│  SCHEDULE TABLE                                                  │
│  ┌──────────┬───────┬─────┬─────┬─────┬─────┬─────┬─────┐      │
│  │  Staff   │ Shift │05:00│06:00│07:00│08:00│...  │22:00│      │
│  ├──────────┼───────┼─────┼─────┼─────┼─────┼─────┼─────┤      │
│  │ Nguyen A │  S    │     │█████│█████│█████│█████│     │      │
│  │ Manager  │06-14  │     │     │     │     │     │     │      │
│  ├──────────┼───────┼─────┼─────┼─────┼─────┼─────┼─────┤      │
│  │ Tran B   │  C    │     │     │     │     │█████│█████│      │
│  │ Staff    │14-22  │     │     │     │     │     │     │      │
│  ├──────────┼───────┼─────┼─────┼─────┼─────┼─────┼─────┤      │
│  │ Le C     │ OFF   │     │     │     │     │     │     │      │
│  │ Staff    │  -    │     │     │     │     │     │     │      │
│  └──────────┴───────┴─────┴─────┴─────┴─────┴─────┴─────┘      │
├─────────────────────────────────────────────────────────────────┤
│  LEGEND                                                          │
│  ┌──┐ S - Ca Sáng (06-14)   ┌──┐ C - Ca Chiều (14-22)          │
│  └──┘                        └──┘                                │
│  ┌──┐ T - Ca Tối (22-06)    ┌──┐ OFF - Nghỉ                     │
│  └──┘                        └──┘                                │
└─────────────────────────────────────────────────────────────────┘
```

#### 5.2.3. Shift Codes Page (DWS)

```
┌─────────────────────────────────────────────────────────────────┐
│  HEADER                                                          │
│  ┌────────┐  Quan Ly Ma Ca - Shift Codes  ┌────────┐ ┌────────┐│
│  │ ← Back │                                │+ Add   │ │Generate││
│  └────────┘                                └────────┘ └────────┘│
├─────────────────────────────────────────────────────────────────┤
│  SHIFT CODES TABLE                                               │
│  ┌────┬─────────┬────────────────┬───────────────┬────┬───────┐│
│  │ #  │  Code   │     Name       │  Time Range   │Dur │Actions││
│  ├────┼─────────┼────────────────┼───────────────┼────┼───────┤│
│  │    │ 8h shifts (5 codes)                              │     ││
│  ├────┼─────────┼────────────────┼───────────────┼────┼───────┤│
│  │ 1  │ [S]     │ Ca Sáng        │ 06:00 - 14:00 │ 8h │ ✏️ 🗑️ ││
│  │ 2  │ [C]     │ Ca Chiều       │ 14:00 - 22:00 │ 8h │ ✏️ 🗑️ ││
│  │ 3  │ [T]     │ Ca Tối         │ 22:00 - 06:00 │ 8h │ ✏️ 🗑️ ││
│  ├────┼─────────┼────────────────┼───────────────┼────┼───────┤│
│  │    │ 12h shifts (1 code)                              │     ││
│  ├────┼─────────┼────────────────┼───────────────┼────┼───────┤│
│  │ 4  │ [FULL]  │ Ca Toàn Thời   │ 08:00 - 20:00 │12h │ ✏️ 🗑️ ││
│  ├────┼─────────┼────────────────┼───────────────┼────┼───────┤│
│  │    │ 0h shifts (1 code)                               │     ││
│  ├────┼─────────┼────────────────┼───────────────┼────┼───────┤│
│  │ 5  │ [OFF]   │ Nghỉ           │ 00:00 - 00:00 │ 0h │ ✏️ 🗑️ ││
│  └────┴─────────┴────────────────┴───────────────┴────┴───────┘│
└─────────────────────────────────────────────────────────────────┘
```

### 5.3. Component Hierarchy

```
App
├── RootLayout
│   ├── Header
│   │   ├── Logo
│   │   ├── Navigation
│   │   └── UserMenu
│   └── Main
│       ├── TasksPage
│       │   ├── TaskFilters
│       │   ├── WeekNavigation
│       │   ├── DaysGrid
│       │   │   └── DayCard (x7)
│       │   └── TaskList
│       │       └── TaskCard (xN)
│       ├── TaskDetailPage
│       │   ├── TaskHeader
│       │   ├── TaskInfo
│       │   ├── StatusUpdate
│       │   ├── ChecklistSection
│       │   └── CommentsSection
│       ├── DailySchedulePage
│       │   ├── ScheduleFilters
│       │   ├── WeekNavigation
│       │   ├── ScheduleTable
│       │   │   └── ScheduleRow (xN)
│       │   └── ShiftLegend
│       └── ShiftCodesPage
│           ├── ShiftCodesHeader
│           ├── ShiftCodesTable
│           │   └── ShiftCodeRow (xN)
│           ├── AddShiftModal
│           ├── EditShiftModal
│           └── GenerateModal
```

### 5.4. State Management

```typescript
// Global State (via Context or Zustand)
interface AppState {
  // Auth
  user: Staff | null;
  isAuthenticated: boolean;

  // Filters
  selectedStoreId: number | null;
  selectedDate: Date;

  // Cache
  stores: Store[];
  departments: Department[];
  shiftCodes: ShiftCode[];
}

// Local State (per page)
interface TasksPageState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  selectedDay: string;
  filters: TaskQueryParams;
}

interface ShiftPageState {
  assignments: ShiftAssignment[];
  staffList: Staff[];
  loading: boolean;
  error: string | null;
}
```

### 5.5. API Client Architecture

```typescript
// lib/api.ts

// Token Management
let accessToken: string | null = null;

export function setAccessToken(token: string | null): void;
export function getAccessToken(): string | null;
export function clearAccessToken(): void;

// Base Fetch
async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit & { skipAuth?: boolean }
): Promise<T>;

// Auth API
export async function login(credentials: LoginRequest): Promise<TokenResponse>;
export async function logout(): Promise<void>;
export async function getCurrentUser(): Promise<Staff>;

// Staff API
export async function getStaff(params?: StaffQueryParams): Promise<Staff[]>;
export async function getStores(): Promise<Store[]>;
export async function getDepartments(): Promise<Department[]>;

// Tasks API
export async function getTasks(params?: TaskQueryParams): Promise<Task[]>;
export async function getTaskById(id: number): Promise<Task>;
export async function createTask(data: TaskCreate): Promise<Task>;
export async function updateTask(id: number, data: TaskUpdate): Promise<Task>;
export async function updateTaskStatus(id: number, data: TaskStatusUpdate): Promise<Task>;

// Shifts API
export async function getShiftCodes(): Promise<ShiftCode[]>;
export async function createShiftCode(data: ShiftCodeCreate): Promise<ShiftCode>;
export async function getShiftAssignments(params?: ShiftQueryParams): Promise<ShiftAssignment[]>;
export async function createBulkShiftAssignments(data: BulkCreate): Promise<BulkResponse>;

// Notifications API
export async function getNotifications(): Promise<NotificationListResponse>;
export async function markNotificationAsRead(id: number): Promise<Notification>;
```

---

## 6. Luồng Xử Lý Nghiệp Vụ

### 6.1. Task Management Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    TASK LIFECYCLE                                │
└─────────────────────────────────────────────────────────────────┘

1. TASK CREATION
   ┌──────────┐         ┌──────────┐         ┌──────────┐
   │ Manager  │────────▶│  Create  │────────▶│ NOT_YET  │
   │          │         │   Task   │         │  Status  │
   └──────────┘         └──────────┘         └────┬─────┘
                                                  │
2. NOTIFICATION                                   │
                                                  ▼
   ┌──────────┐         ┌──────────┐         ┌──────────┐
   │ Assigned │◀────────│  System  │◀────────│ Notify   │
   │   Staff  │         │  Sends   │         │ Created  │
   └──────────┘         └──────────┘         └──────────┘

3. TASK EXECUTION
   ┌──────────┐         ┌──────────┐         ┌──────────┐
   │  Staff   │────────▶│  Start   │────────▶│ON_PROGRESS
   │  Views   │         │  Work    │         │  Status  │
   └──────────┘         └──────────┘         └────┬─────┘
                                                  │
4. CHECKLIST COMPLETION                           │
                                                  ▼
   ┌──────────┐         ┌──────────┐         ┌──────────┐
   │ Complete │────────▶│  Mark    │────────▶│ Progress │
   │  Items   │         │  Done    │         │  Update  │
   └──────────┘         └──────────┘         └────┬─────┘
                                                  │
5. TASK COMPLETION                                │
                                                  ▼
   ┌──────────┐         ┌──────────┐         ┌──────────┐
   │  Submit  │────────▶│  Update  │────────▶│   DONE   │
   │   Task   │         │  Status  │         │  Status  │
   └──────────┘         └──────────┘         └────┬─────┘
                                                  │
6. MANAGER REVIEW                                 │
                                                  ▼
   ┌──────────┐         ┌──────────┐    ┌────────┴────────┐
   │ Manager  │────────▶│  Review  │───▶│ DONE or REJECT  │
   │          │         │   Task   │    └─────────────────┘
   └──────────┘         └──────────┘
```

### 6.2. Shift Assignment Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                 SHIFT ASSIGNMENT FLOW                            │
└─────────────────────────────────────────────────────────────────┘

1. PLANNING PHASE
   ┌──────────┐         ┌──────────┐         ┌──────────┐
   │ Manager  │────────▶│  Select  │────────▶│  Select  │
   │          │         │  Week    │         │  Store   │
   └──────────┘         └──────────┘         └────┬─────┘
                                                  │
2. STAFF SELECTION                                │
                                                  ▼
   ┌──────────┐         ┌──────────┐         ┌──────────┐
   │  View    │────────▶│  Select  │────────▶│  Select  │
   │  Staff   │         │  Staff   │         │  Shift   │
   └──────────┘         └──────────┘         └────┬─────┘
                                                  │
3. ASSIGNMENT                                     │
                                                  ▼
   ┌──────────┐         ┌──────────┐         ┌──────────┐
   │  Assign  │────────▶│  Create  │────────▶│ ASSIGNED │
   │  Shift   │         │Assignment│         │  Status  │
   └──────────┘         └──────────┘         └────┬─────┘
                                                  │
4. NOTIFICATION                                   │
                                                  ▼
   ┌──────────┐         ┌──────────┐         ┌──────────┐
   │  Staff   │◀────────│  System  │◀────────│ Notify   │
   │ Receives │         │  Sends   │         │ Created  │
   └──────────┘         └──────────┘         └──────────┘

5. CONFIRMATION
   ┌──────────┐         ┌──────────┐         ┌──────────┐
   │  Staff   │────────▶│  Confirm │────────▶│CONFIRMED │
   │  Views   │         │  Shift   │         │  Status  │
   └──────────┘         └──────────┘         └──────────┘

6. EXECUTION
   ┌──────────┐         ┌──────────┐         ┌──────────┐
   │  Staff   │────────▶│  Work    │────────▶│COMPLETED │
   │  Works   │         │  Shift   │         │  Status  │
   └──────────┘         └──────────┘         └──────────┘
```

### 6.3. Man-hour Calculation

```
┌─────────────────────────────────────────────────────────────────┐
│                 MAN-HOUR CALCULATION                             │
└─────────────────────────────────────────────────────────────────┘

Formula:
  Total Hours = Σ (Staff × Shift Duration)

  Status:
  - THỪA (Excess):    Total Hours > Target Hours
  - THIẾU (Shortage): Total Hours < Target Hours
  - ĐẠT CHUẨN (Met):  Total Hours = Target Hours

Example Calculation:
┌─────────────────────────────────────────────────────────────────┐
│ Store: Store Hà Đông                                             │
│ Date: 2025-01-15                                                 │
│ Target: 80 hours/day                                             │
├─────────────────────────────────────────────────────────────────┤
│ Staff          │ Shift │ Duration │                              │
│────────────────│───────│──────────│                              │
│ Nguyen Van A   │   S   │   8h     │                              │
│ Tran Thi B     │   S   │   8h     │                              │
│ Le Van C       │   C   │   8h     │                              │
│ Pham Thi D     │   C   │   8h     │                              │
│ Hoang Van E    │   T   │   8h     │                              │
│ Nguyen Thi F   │  FULL │  12h     │                              │
│ Tran Van G     │   S   │   8h     │                              │
│ Le Thi H       │   C   │   8h     │                              │
│ Pham Van I     │  OFF  │   0h     │                              │
├─────────────────────────────────────────────────────────────────┤
│ TOTAL          │       │  68h     │                              │
│ TARGET         │       │  80h     │                              │
│ DIFFERENCE     │       │  -12h    │                              │
│ STATUS         │       │  THIẾU   │                              │
└─────────────────────────────────────────────────────────────────┘
```

---

## 7. Bảo Mật

### 7.1. Authentication

```
┌─────────────────────────────────────────────────────────────────┐
│                    AUTHENTICATION FLOW                           │
└─────────────────────────────────────────────────────────────────┘

Password Storage:
  - Algorithm: bcrypt
  - Salt rounds: 12
  - Never store plain text passwords

JWT Token:
  - Algorithm: HS256
  - Expiry: 24 hours (configurable)
  - Payload: { staff_id, email, role, exp }

Token Validation:
  1. Check token signature
  2. Check expiration
  3. Verify user exists and is active
```

### 7.2. Authorization

```python
# Role-based Access Control

PERMISSIONS = {
    "admin": ["*"],  # Full access
    "manager": [
        "task:create", "task:read", "task:update", "task:delete",
        "shift:create", "shift:read", "shift:update", "shift:delete",
        "staff:read", "staff:update",
        "report:read"
    ],
    "supervisor": [
        "task:read", "task:update",
        "shift:read",
        "staff:read"
    ],
    "staff": [
        "task:read", "task:update:own",
        "shift:read:own"
    ]
}
```

### 7.3. API Security

```
Security Headers:
  - Content-Security-Policy
  - X-Content-Type-Options: nosniff
  - X-Frame-Options: DENY
  - X-XSS-Protection: 1; mode=block

CORS Configuration:
  - Allowed Origins: Frontend domain only
  - Allowed Methods: GET, POST, PUT, DELETE
  - Allowed Headers: Authorization, Content-Type
  - Credentials: true

Rate Limiting:
  - Login: 5 requests/minute
  - API: 100 requests/minute
```

### 7.4. Data Protection

```
Sensitive Data:
  - Passwords: Hashed with bcrypt
  - Tokens: Short-lived, secure storage
  - PII: Access logging, encryption at rest

Input Validation:
  - Pydantic schemas for all inputs
  - SQL injection prevention via ORM
  - XSS prevention via output encoding
```

---

## 8. Deployment

### 8.1. Infrastructure

```
┌─────────────────────────────────────────────────────────────────┐
│                    DEPLOYMENT ARCHITECTURE                       │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────┐     ┌──────────────────┐     ┌──────────────┐
│    Netlify       │     │     Render       │     │     Neon     │
│   (Frontend)     │     │    (Backend)     │     │  (Database)  │
├──────────────────┤     ├──────────────────┤     ├──────────────┤
│ • CDN            │     │ • Docker         │     │ • PostgreSQL │
│ • SSL/TLS        │────▶│ • Auto-scaling   │────▶│ • Serverless │
│ • Build & Deploy │     │ • Health checks  │     │ • Auto backup│
│ • Branch deploys │     │ • Env variables  │     │ • Connection │
│                  │     │                  │     │   pooling    │
└──────────────────┘     └──────────────────┘     └──────────────┘
```

### 8.2. Environment Variables

```bash
# Backend (.env)
DATABASE_URL=postgresql://user:pass@host:5432/dbname
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
ALLOWED_ORIGINS=https://your-frontend.netlify.app

# Frontend (.env.local)
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api/v1
```

### 8.3. CI/CD Pipeline

```yaml
# Backend (Render)
Build Command: pip install -r requirements.txt
Start Command: uvicorn app.main:app --host 0.0.0.0 --port $PORT

# Frontend (Netlify)
Build Command: npm run build
Publish Directory: .next
```

### 8.4. Monitoring

```
Metrics to Monitor:
  - API response times
  - Error rates (4xx, 5xx)
  - Database query performance
  - Active users
  - Task completion rates

Alerting:
  - High error rate
  - Slow response times
  - Database connection issues
  - Server downtime
```

---

## Phụ Lục

### A. API Response Codes

| Code | Meaning | When Used |
|------|---------|-----------|
| 200 | OK | Successful GET, PUT |
| 201 | Created | Successful POST |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Invalid input |
| 401 | Unauthorized | Missing/invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 422 | Validation Error | Schema validation failed |
| 500 | Server Error | Internal error |

### B. Status Code Mappings

| ID | Code | Name | Vietnamese |
|----|------|------|------------|
| 7 | NOT_YET | Not Yet | Chưa bắt đầu |
| 8 | ON_PROGRESS | On Progress | Đang thực hiện |
| 9 | DONE | Done | Hoàn thành |
| 10 | OVERDUE | Overdue | Quá hạn |
| 11 | REJECT | Reject | Từ chối |

### C. Shift Code Standards

| Code | Name | Time | Duration | Color |
|------|------|------|----------|-------|
| S | Ca Sáng | 06:00-14:00 | 8h | #FFD700 |
| C | Ca Chiều | 14:00-22:00 | 8h | #87CEEB |
| T | Ca Tối | 22:00-06:00 | 8h | #4B0082 |
| OFF | Nghỉ | - | 0h | #D3D3D3 |
| FULL | Ca Toàn Thời | 08:00-20:00 | 12h | #32CD32 |

---

**Document Version History:**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-12-27 | System | Initial document |

---

*© 2025 OptiChain. All rights reserved.*
