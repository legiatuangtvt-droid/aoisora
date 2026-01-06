# DWS Module - Dispatch Work Schedule

## Overview

Module quản lý lịch ca làm việc, phân công nhân sự theo ca và theo dõi manhours.

## Screens

| Screen | Spec File | Route | Description |
|--------|-----------|-------|-------------|
| RE Task List | [re-task-list.md](./re-task-list.md) | `/dws/re-task-list` | Quản lý RE Tasks (Routine Execution) |
| Daily Schedule | TBD | `/dws/daily-schedule` | Lịch làm việc hàng ngày |
| Shift Codes | TBD | `/dws/shift-codes` | Quản lý mã ca |
| Workforce Dispatch | TBD | `/dws/workforce-dispatch` | Phân bổ nhân sự |

## Frontend Path

```
/frontend/src/app/dws/
├── re-task-list/page.tsx      # RE Task List screen
├── daily-schedule/page.tsx    # Daily Schedule screen
├── shift-codes/page.tsx       # Shift Codes management
└── workforce-dispatch/page.tsx # Workforce Dispatch screen
```

## Backend Controllers

- `ShiftCodeController` - Quản lý mã ca làm việc
- `ShiftAssignmentController` - Phân công ca cho nhân viên
- `TaskGroupController` - Nhóm công việc
- `DailyScheduleTaskController` - Task theo ngày
- `TaskLibraryController` - Thư viện task
- `DailyTemplateController` - Template theo ngày

## API Routes

```
/api/v1/shifts/codes           # CRUD shift codes
/api/v1/shifts/assignments     # CRUD shift assignments
/api/v1/shifts/task-groups     # CRUD task groups
/api/v1/shifts/schedule-tasks  # CRUD schedule tasks
/api/v1/shifts/weekly/{store}  # Weekly schedule view
/api/v1/shifts/manhours/daily  # Daily manhours report
```

## Status

| Feature | Backend | Frontend | Notes |
|---------|---------|----------|-------|
| RE Task List | ⏳ Pending | ✅ Done | Mock data |
| Daily Schedule | ✅ Done | ✅ Done | Mock data |
| Shift Codes | ✅ Done | ✅ Done | API integrated |
| Workforce Dispatch | ⏳ Pending | ✅ Done | Mock data |
| Shift Assignments | ✅ Done | ⏳ Pending | - |
| Task Groups | ✅ Done | ⏳ Pending | - |

## Changelog

| Date | Change |
|------|--------|
| 2026-01-06 | Added RE Task List screen and spec |
| 2026-01-06 | Updated README with screen routes |
