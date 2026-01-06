# WS Module - Task from HQ (Work Schedule)

## Overview

Module quản lý task từ Headquarters, bao gồm quản lý công việc, nhân sự, cửa hàng và thông báo.

## Screens

| Screen | Spec File | Description |
|--------|-----------|-------------|
| Task List | [task-list.md](task-list.md) | Danh sách task |
| Task Detail | [task-detail.md](task-detail.md) | Chi tiết task |
| Task Library | [task-library.md](task-library.md) | Thư viện task mẫu |
| Add Task | [add-task.md](add-task.md) | Thêm task mới |
| Todo Task | [todo-task.md](todo-task.md) | Checklist công việc |
| User Information | [user-information.md](user-information.md) | Quản lý nhân sự |
| Store Information | [store-information.md](store-information.md) | Quản lý cửa hàng |
| Message | [message.md](message.md) | Thông báo nội bộ |
| Report | [report.md](report.md) | Báo cáo |

## Frontend Path

```
/frontend/src/app/tasks/
```

## Backend Controllers

- `TaskController`
- `CheckListController`
- `StaffController`
- `StoreController`
- `UserInfoController`
- `StoreInfoController`
- `NotificationController`

## Status

| Feature | Status |
|---------|--------|
| Task CRUD | ✅ Done |
| User Info | ✅ Done |
| Store Info | ✅ Done |
| Message | ⏳ In Progress |
| Report | ⏳ Pending |
