# DWS Module - Dispatch Work Schedule

## Overview

Module quản lý lịch ca làm việc, phân công nhân sự theo ca và theo dõi manhours.

## Screens

| Screen | Spec File | Description |
|--------|-----------|-------------|
| Shift Management | TBD | Quản lý ca làm việc |
| Schedule Tasks | TBD | Phân công công việc theo ca |
| Manhours | TBD | Theo dõi giờ công |
| Weekly View | TBD | Xem lịch tuần |

## Frontend Path

```
/frontend/src/app/dws/
```

## Backend Controllers

- `ShiftCodeController`
- `ShiftAssignmentController`
- `TaskGroupController`
- `DailyScheduleTaskController`
- `TaskLibraryController`
- `DailyTemplateController`

## API Routes

```
/api/v1/shifts/codes
/api/v1/shifts/assignments
/api/v1/shifts/task-groups
/api/v1/shifts/schedule-tasks
/api/v1/shifts/weekly/{store}
/api/v1/shifts/manhours/daily
```

## Status

| Feature | Status |
|---------|--------|
| Shift Codes | ✅ Done (Backend) |
| Shift Assignments | ✅ Done (Backend) |
| Task Groups | ✅ Done (Backend) |
| Frontend | ⏳ Pending |
