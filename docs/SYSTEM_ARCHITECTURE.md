# OptiChain WS & DWS System Architecture

**Version**: 2.0 (Rebuild)
**Date**: 2025-12-26
**Status**: Planning Phase

---

## 📋 TÓM TẮT HỆ THỐNG

### WS (Work Schedule) - Quản lý công việc
- Quản lý tasks hàng ngày/tuần/tháng
- Checklist cho mỗi task
- Notification khi task được assign/hoàn thành
- Experience points (EXP) cho nhân viên
- Báo cáo theo store/department

### DWS (Dispatch Work Schedule) - Phân công ca làm việc
- Quản lý shift codes (ca làm việc)
- Phân công nhân viên theo ca
- Man-hour tracking (giờ công)
- Template lịch làm việc
- Task groups theo nhóm công việc

---

## 🏗️ KIẾN TRÚC MỚI

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND (Next.js 14)                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │   WS Pages  │  │  DWS Pages  │  │   Common    │          │
│  │  - Tasks    │  │  - Schedule │  │  - Login    │          │
│  │  - Reports  │  │  - Shifts   │  │  - Profile  │          │
│  │  - Create   │  │  - Dispatch │  │  - Notif    │          │
│  └─────────────┘  └─────────────┘  └─────────────┘          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND (FastAPI)                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │  WS APIs    │  │  DWS APIs   │  │  Auth APIs  │          │
│  │  /tasks     │  │  /shifts    │  │  /auth      │          │
│  │  /checklists│  │  /schedules │  │  /users     │          │
│  │  /templates │  │  /dispatch  │  │  /notif     │          │
│  └─────────────┘  └─────────────┘  └─────────────┘          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  DATABASE (PostgreSQL - Neon)                │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Core: regions, stores, departments, staff, code_master│  │
│  │  WS: tasks, check_lists, task_check_list, manuals     │  │
│  │  DWS: shift_codes, shift_assignments, task_groups     │  │
│  │  System: notifications                                 │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 DATABASE SCHEMA

### Core Tables (Đã có)
| Table | Records | Mô tả |
|-------|---------|-------|
| regions | 5 | Khu vực địa lý |
| stores | 20 | Cửa hàng |
| departments | 7 | Phòng ban |
| staff | 36 | Nhân viên |
| code_master | 11 | Lookup codes |

### WS Tables (Đã có)
| Table | Records | Mô tả |
|-------|---------|-------|
| tasks | 10 | Công việc |
| check_lists | 4 | Danh sách kiểm tra |
| task_check_list | 11 | Task ↔ Checklist mapping |
| manuals | 3 | Tài liệu hướng dẫn |

### DWS Tables (Đã có)
| Table | Records | Mô tả |
|-------|---------|-------|
| shift_codes | 5 | Mã ca làm việc |
| shift_assignments | 7 | Phân công ca |

### Tables cần thêm
| Table | Mô tả |
|-------|-------|
| task_groups | Nhóm công việc (POS, PERI, DRY...) |
| daily_templates | Template lịch làm việc |
| template_tasks | Tasks mẫu |

---

## 🔧 WS MODULE - LOGIC CHI TIẾT

### 1. Task Management

#### Task Status Flow
```
NOT_YET (7) → ON_PROGRESS (8) → DONE (9)
                    ↓
              OVERDUE (10)
                    ↓
               REJECT (11)
```

#### Task Types (code_master)
- **STATISTICS (1)**: Thống kê
- **ARRANGE (2)**: Sắp xếp
- **PREPARE (3)**: Chuẩn bị

#### Response Types
- **PICTURE (4)**: Chụp ảnh để xác nhận
- **CHECKLIST (5)**: Hoàn thành checklist
- **YESNO (6)**: Xác nhận Yes/No

#### Task Creation Flow
```
1. Manager tạo task (task_name, dept_id, do_staff_id, dates)
2. System gửi notification đến staff được assign
3. Staff nhận task, bắt đầu thực hiện
4. Staff cập nhật status → ON_PROGRESS
5. Staff hoàn thành checklist items (nếu có)
6. Staff submit → DONE
7. System gửi notification đến Manager
8. Staff nhận EXP points
```

#### API Endpoints cần implement

```
# Tasks
GET    /api/v1/tasks                    # List tasks (filters: status, dept, staff, store)
GET    /api/v1/tasks/{id}               # Get task detail
POST   /api/v1/tasks                    # Create task
PUT    /api/v1/tasks/{id}               # Update task
DELETE /api/v1/tasks/{id}               # Delete task
PUT    /api/v1/tasks/{id}/status        # Update status (trigger notification)

# Check Lists
GET    /api/v1/checklists               # List all checklists
POST   /api/v1/checklists               # Create checklist

# Task Check List
GET    /api/v1/tasks/{id}/checklists    # Get task's checklists
POST   /api/v1/tasks/{id}/checklists    # Add checklist to task
PUT    /api/v1/tasks/{id}/checklists/{cid} # Update checklist status

# Manuals
GET    /api/v1/manuals                  # List manuals
POST   /api/v1/manuals                  # Create manual

# Template Tasks (for recurring tasks)
GET    /api/v1/template-tasks           # List templates
POST   /api/v1/template-tasks           # Create template
```

### 2. Notification System

#### Notification Types
- `task_assigned`: Khi task được assign cho staff
- `task_status_changed`: Khi task thay đổi status
- `task_completed`: Khi task hoàn thành
- `shift_assigned`: Khi ca làm việc được phân công

#### Notification Flow
```
1. Action trigger (task update, shift assign)
2. Determine recipient(s)
3. Create notification record
4. (Optional) Send push notification
5. Update unread count
```

#### API Endpoints
```
GET    /api/v1/notifications            # List notifications for user
GET    /api/v1/notifications/unread     # Get unread count
PUT    /api/v1/notifications/{id}/read  # Mark as read
PUT    /api/v1/notifications/read-all   # Mark all as read
```

### 3. Experience Points (EXP) System

#### EXP Rules
- Task completed on time: +1 EXP
- Task completed early: +2 EXP
- Task overdue: 0 EXP
- Checklist item completed: +0.5 EXP

#### API Endpoints
```
GET    /api/v1/staff/{id}/exp           # Get staff EXP
POST   /api/v1/staff/{id}/exp           # Add EXP to staff
GET    /api/v1/leaderboard              # Get EXP leaderboard
```

---

## 🗓️ DWS MODULE - LOGIC CHI TIẾT

### 1. Shift Codes

#### Default Shift Codes
| Code | Name | Time | Duration |
|------|------|------|----------|
| S | Ca Sáng | 06:00-14:00 | 8h |
| C | Ca Chiều | 14:00-22:00 | 8h |
| T | Ca Tối | 22:00-06:00 | 8h |
| OFF | Nghỉ | - | 0h |
| FULL | Ca Full | 08:00-20:00 | 12h |

#### Extended Shift Codes (từ legacy)
| Code | Time | Duration |
|------|------|----------|
| V812 | 06:00~14:30 | 8.5h |
| V829 | 14:30~23:00 | 8.5h |
| V712 | 06:00~13:30 | 7.5h |
| V728 | 13:30~21:00 | 7.5h |
| V612 | 06:00~12:30 | 6.5h |
| V626 | 12:30~19:00 | 6.5h |

#### Shift Code Naming Convention
```
{Char}{Duration}{TimeCode}
- Char: V, C, T, S...
- Duration: 4-8 (giờ)
- TimeCode: hour*2 + minute/30
```

#### API Endpoints
```
GET    /api/v1/shift-codes              # List all shift codes
POST   /api/v1/shift-codes              # Create shift code
PUT    /api/v1/shift-codes/{id}         # Update shift code
DELETE /api/v1/shift-codes/{id}         # Delete shift code
POST   /api/v1/shift-codes/generate     # Auto-generate shifts
```

### 2. Shift Assignments

#### Assignment Status
- `assigned`: Đã phân công
- `confirmed`: Nhân viên xác nhận
- `completed`: Hoàn thành ca
- `cancelled`: Hủy

#### Assignment Flow
```
1. Manager mở weekly schedule view
2. Chọn staff + ngày + shift code
3. System tạo shift_assignment
4. Notification gửi đến staff
5. Staff confirm ca làm việc
6. Khi hết ca → status = completed
```

#### Constraints
- Mỗi staff chỉ có 1 shift/ngày (unique: staff_id + shift_date)
- Không assign OFF cho ngày đã có shift
- Tổng giờ/tuần không quá 48h (configurable)

#### API Endpoints
```
GET    /api/v1/shift-assignments        # List assignments (filters: date, store, staff)
POST   /api/v1/shift-assignments        # Create assignment
PUT    /api/v1/shift-assignments/{id}   # Update assignment
DELETE /api/v1/shift-assignments/{id}   # Delete assignment
PUT    /api/v1/shift-assignments/{id}/confirm  # Staff confirm shift

# Bulk operations
POST   /api/v1/shift-assignments/bulk   # Create multiple assignments
GET    /api/v1/shift-assignments/weekly # Get weekly schedule view
```

### 3. Man-Hour Tracking

#### Calculation Logic
```python
# Template standard per day
TEMPLATE_MANHOUR = 80  # hours

# Calculate actual man-hours
actual_hours = sum(shift.duration for shift in day_shifts)

# Calculate variance
diff = actual_hours - TEMPLATE_MANHOUR

# Status
if diff > 0:
    status = "THỪA"  # Surplus
elif diff < 0:
    status = "THIẾU"  # Shortage
else:
    status = "ĐẠT CHUẨN"  # On target
```

#### API Endpoints
```
GET    /api/v1/manhours/daily           # Daily man-hour report
GET    /api/v1/manhours/weekly          # Weekly man-hour report
GET    /api/v1/manhours/store/{id}      # Store man-hour summary
```

### 4. Task Groups (Nhóm công việc)

#### Default Task Groups
| ID | Code | Priority | Color |
|----|------|----------|-------|
| POS | POS | 100 | Blue |
| PERI | Perishables | 80 | Green |
| DRY | Dry Goods | 70 | Amber |
| MERCH | Merchandise | 60 | Purple |
| CLEAN | Cleaning | 50 | Teal |

#### Task Structure in Group
```json
{
  "order": 1,
  "name": "Mở POS",
  "typeTask": "Fixed",        // Fixed, Product, CTM
  "frequency": "Daily",       // Daily, Weekly, Monthly
  "frequencyNumber": 1,
  "reUnit": 10,               // minutes per task
  "manual_number": "POS-001",
  "concurrentPerformers": 1,
  "allowedPositions": ["POS", "Leader"],
  "timeWindows": [
    {"startTime": "05:40", "endTime": "05:50"}
  ]
}
```

#### API Endpoints
```
GET    /api/v1/task-groups              # List task groups
POST   /api/v1/task-groups              # Create task group
PUT    /api/v1/task-groups/{id}         # Update task group
DELETE /api/v1/task-groups/{id}         # Delete task group

GET    /api/v1/task-groups/{id}/tasks   # Get tasks in group
POST   /api/v1/task-groups/{id}/tasks   # Add task to group
PUT    /api/v1/task-groups/{id}/tasks/{tid}  # Update task
DELETE /api/v1/task-groups/{id}/tasks/{tid}  # Remove task
```

### 5. Daily Templates

#### Template Structure
```json
{
  "id": "tpl_001",
  "name": "Standard Weekday",
  "tasks": [
    {
      "taskCode": "POS-001",
      "startTime": "05:40",
      "endTime": "06:00",
      "position": "POS"
    }
  ],
  "appliedStores": [1, 2, 3],
  "createdAt": "2025-12-26T00:00:00Z"
}
```

#### API Endpoints
```
GET    /api/v1/daily-templates          # List templates
POST   /api/v1/daily-templates          # Create template
PUT    /api/v1/daily-templates/{id}     # Update template
DELETE /api/v1/daily-templates/{id}     # Delete template
POST   /api/v1/daily-templates/{id}/apply  # Apply to stores
```

---

## 🎨 FRONTEND PAGES

### WS Module Pages

| Page | Route | Mô tả |
|------|-------|-------|
| Tasks List | `/tasks` | Weekly calendar view với status counters |
| Task Detail | `/tasks/[id]` | Chi tiết task + checklist |
| Create Task | `/tasks/create` | Form tạo task mới |
| Reports | `/reports` | Báo cáo theo store/dept |

### DWS Module Pages

| Page | Route | Mô tả |
|------|-------|-------|
| Daily Schedule | `/dws/daily-schedule` | Lịch làm việc hàng ngày |
| Shift Codes | `/dws/shift-codes` | Quản lý mã ca |
| Workforce Dispatch | `/dws/workforce-dispatch` | Phân công nhân sự |
| Task Groups | `/dws/task-groups` | Quản lý nhóm công việc |
| Templates | `/dws/templates` | Quản lý template lịch |

### Common Pages

| Page | Route | Mô tả |
|------|-------|-------|
| Login | `/login` | Đăng nhập |
| Profile | `/profile` | Thông tin cá nhân |
| Notifications | `/notifications` | Danh sách thông báo |
| Settings | `/settings` | Cài đặt |

---

## 🔐 AUTHENTICATION & AUTHORIZATION

### Roles
| Role ID | Name | Permissions |
|---------|------|-------------|
| 1 | ADMIN | Full access |
| 2 | HQ_STAFF | View all, create tasks |
| 3 | REGIONAL_MANAGER | Manage region stores |
| 4 | AREA_MANAGER | Manage area stores |
| 5 | STORE_INCHARGE | Manage single store |
| 6 | STORE_LEADER | View store, do tasks |
| 7 | STAFF | Do assigned tasks only |

### Permission Matrix

| Action | ADMIN | HQ | REG_MGR | AREA_MGR | STORE_IC | LEADER | STAFF |
|--------|-------|-----|---------|----------|----------|--------|-------|
| Create Task | ✓ | ✓ | ✓ | ✓ | ✓ | - | - |
| Assign Task | ✓ | ✓ | ✓ | ✓ | ✓ | - | - |
| Do Task | ✓ | - | - | - | - | ✓ | ✓ |
| View Reports | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | - |
| Manage Shifts | ✓ | ✓ | ✓ | ✓ | ✓ | - | - |
| Manage Staff | ✓ | ✓ | ✓ | ✓ | - | - | - |

---

## 📁 FILE STRUCTURE MỚI

```
frontend/src/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx              # Dashboard layout with sidebar
│   │   ├── page.tsx                # Home/Dashboard
│   │   ├── tasks/
│   │   │   ├── page.tsx            # Tasks list (weekly calendar)
│   │   │   ├── [id]/page.tsx       # Task detail
│   │   │   └── create/page.tsx     # Create task
│   │   ├── dws/
│   │   │   ├── daily-schedule/page.tsx
│   │   │   ├── shift-codes/page.tsx
│   │   │   ├── workforce-dispatch/page.tsx
│   │   │   ├── task-groups/page.tsx
│   │   │   └── templates/page.tsx
│   │   ├── reports/page.tsx
│   │   ├── notifications/page.tsx
│   │   └── settings/page.tsx
│   └── api/                        # API routes (if needed)
├── components/
│   ├── ui/                         # Base UI components
│   ├── ws/                         # WS-specific components
│   │   ├── TaskCard.tsx
│   │   ├── TaskCalendar.tsx
│   │   ├── ChecklistItem.tsx
│   │   └── StatusBadge.tsx
│   ├── dws/                        # DWS-specific components
│   │   ├── ShiftCodeEditor.tsx
│   │   ├── ScheduleGrid.tsx
│   │   ├── DispatchBoard.tsx
│   │   └── TaskGroupCard.tsx
│   └── common/                     # Shared components
│       ├── Sidebar.tsx
│       ├── Header.tsx
│       ├── BackendStatus.tsx
│       └── NotificationBell.tsx
├── lib/
│   ├── api.ts                      # API client
│   ├── auth.ts                     # Auth utilities
│   └── utils.ts                    # Helper functions
├── hooks/
│   ├── useTasks.ts
│   ├── useShifts.ts
│   └── useNotifications.ts
├── types/
│   ├── task.ts
│   ├── shift.ts
│   ├── staff.ts
│   └── index.ts
└── data/
    ├── shiftCodes.ts
    └── taskGroups.ts

backend/app/
├── main.py                         # FastAPI app
├── core/
│   ├── config.py                   # Settings
│   ├── database.py                 # DB connection
│   └── security.py                 # Auth helpers
├── models/
│   ├── task.py
│   ├── shift.py
│   ├── staff.py
│   └── notification.py
├── schemas/
│   ├── task.py
│   ├── shift.py
│   └── notification.py
├── api/
│   ├── v1/
│   │   ├── tasks.py
│   │   ├── shifts.py
│   │   ├── staff.py
│   │   ├── notifications.py
│   │   └── auth.py
│   └── deps.py                     # Dependencies
└── services/
    ├── task_service.py
    ├── shift_service.py
    └── notification_service.py
```

---

## 🚀 IMPLEMENTATION PLAN

### Phase 1: Core Backend APIs (Priority: HIGH)
1. ✅ Database schema & migration
2. [ ] Staff API (CRUD + auth)
3. [ ] Tasks API (CRUD + status update)
4. [ ] Notifications API

### Phase 2: WS Module (Priority: HIGH)
1. [ ] Tasks list page (weekly calendar)
2. [ ] Task detail page
3. [ ] Create task form
4. [ ] Checklist management

### Phase 3: DWS Module (Priority: MEDIUM)
1. [ ] Shift codes management
2. [ ] Shift assignments
3. [ ] Daily schedule view
4. [ ] Workforce dispatch

### Phase 4: Advanced Features (Priority: LOW)
1. [ ] Task groups
2. [ ] Daily templates
3. [ ] Man-hour tracking
4. [ ] Reports & analytics
5. [ ] EXP system

---

## 📚 LEGACY CODE REFERENCES

### Key Files từ Legacy
| File | Location | Logic |
|------|----------|-------|
| tasks.php | legacy/officepc/api/ | Task CRUD + notifications |
| do-task.js | legacy/officepc/js/ | Staff task UI |
| workforce-dispatch.js | legacy/refactor-dws/public/ | Dispatch algorithm |
| daily-templates-logic.js | legacy/refactor-dws/public/ | Template logic |
| task-groups.js | legacy/refactor-dws/public/ | Task groups CRUD |

### Data Files
| File | Location | Content |
|------|----------|---------|
| data-task_groups.json | legacy/refactor-dws/public/ | Task definitions |
| shiftCodes.ts | frontend/src/data/ | Shift code helpers |

---

**Document Version**: 1.0
**Last Updated**: 2025-12-26
**Author**: Claude Code
