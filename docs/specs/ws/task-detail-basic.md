# Task Detail - Basic Specification

> **Module**: WS (Task from HQ)
> **Screen ID**: SCR_TASK_DETAIL
> **Routes**: `/tasks/[id]`, `/tasks/detail` (auto-redirect)
> **Last Updated**: 2026-01-08

---

## 1. Overview

| Field | Value |
|-------|-------|
| **Purpose** | Display detailed task information from HQ to stores with multiple view modes |
| **Target Users** | Manager, Staff |
| **Entry Points** | Task List row click, Sidebar "Detail" menu |

---

## 2. User Stories

| ID | As a... | I want to... | So that... |
|----|---------|--------------|------------|
| US-01 | Manager | View task details with store results | I can monitor store completion status |
| US-02 | Manager | Switch between Results/Comment/Staff views | I can see different aspects of task progress |
| US-03 | Manager | Filter results by region/area/store | I can focus on specific locations |
| US-04 | Manager | View workflow steps | I can track task approval process |
| US-05 | Staff | View task instructions and images | I know what to do for the task |
| US-06 | Manager | Like and comment on store results | I can provide feedback to stores |

---

## 3. Screen Components Summary

| Component | Description |
|-----------|-------------|
| Task Header | Level badge, name, dates, status, statistics cards |
| Filter Bar | Region/Area/Store dropdowns, status filter, search, view mode toggle |
| Store Results | Cards showing store completion with images and comments |
| Staff Cards | Individual staff progress with requirements grid |
| Workflow Panel | Slide-in panel showing task approval steps |

---

## 4. Screen Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ [Logo]                    [Notification] [Avatar] User Name  [Company Logo] │
├──────────┬──────────────────────────────────────────────────────────────────┤
│          │ List task → Detail                                               │
│ Sidebar  │ ┌─────────────────────────────────────────────────────────────┐  │
│          │ │ Task Header                                                 │  │
│          │ │ [Task level 1] Task Name                                    │  │
│          │ │ 04 Nov - 21 Dec | HQ Check: D097                            │  │
│          │ │ Task type: Image | Manual link | [workflow icon]            │  │
│          │ │                                                             │  │
│          │ │ [Not Started: 5] [Completed: 20] [Unable: 2] [Avg: 60min]   │  │
│          │ └─────────────────────────────────────────────────────────────┘  │
│          │ ┌─────────────────────────────────────────────────────────────┐  │
│          │ │ Filter Bar                                                  │  │
│          │ │ [Region ▼] [Area ▼] [Store ▼] [Search...] [Results|Comment|Staff] │
│          │ └─────────────────────────────────────────────────────────────┘  │
│          │ ┌─────────────────────────────────────────────────────────────┐  │
│          │ │ Results Content                                             │  │
│          │ │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │  │
│          │ │  │ Store Card  │  │ Store Card  │  │ Store Card  │         │  │
│          │ │  │ - Images    │  │ - Images    │  │ - Images    │         │  │
│          │ │  │ - Comments  │  │ - Comments  │  │ - Comments  │         │  │
│          │ │  └─────────────┘  └─────────────┘  └─────────────┘         │  │
│          │ └─────────────────────────────────────────────────────────────┘  │
└──────────┴──────────────────────────────────────────────────────────────────┘
```

---

## 5. Navigation

| Action | Destination | Description |
|--------|-------------|-------------|
| Click row in Task List | `/tasks/{id}` | Display detail of specific task |
| Click "Detail" menu in Sidebar | `/tasks/detail` | Auto-redirect to nearest deadline task |
| Click breadcrumb "List task" | `/tasks/list` | Return to task list |
| Click workflow icon | - | Open Workflow Steps Panel |

### Auto-redirect Logic (`/tasks/detail`)

1. Get all tasks with end dates
2. Filter tasks where `endDate >= today` (not expired)
3. Sort by `endDate` ascending (nearest first)
4. Redirect to first task
5. Fallback: If no upcoming tasks, redirect to first task in list
6. Fallback: If no tasks at all, redirect to `/tasks/list`

---

## 6. API Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/tasks/{id}` | Get full task details |
| GET | `/api/v1/tasks/{id}/stores` | Get results by store |
| GET | `/api/v1/tasks/{id}/staffs` | Get results by staff |
| GET | `/api/v1/tasks/{id}/comments` | Get comments |
| POST | `/api/v1/tasks/{id}/comments` | Add comment |
| POST | `/api/v1/tasks/{id}/like` | Like a task result |
| POST | `/api/v1/tasks/{id}/reminder` | Send reminder to staff |

---

## 7. Implementation Status

| Feature | Backend | Frontend | Deploy | Notes |
|---------|---------|----------|--------|-------|
| Task Header | ⏳ Pending | ✅ Done | [DEMO] | Mock data |
| Filter Bar | ⏳ Pending | ✅ Done | [DEMO] | Client-side filtering |
| Store Results View | ⏳ Pending | ✅ Done | [DEMO] | Mock data |
| Staff View | ⏳ Pending | ✅ Done | [DEMO] | Mock data |
| Comments Section | ⏳ Pending | ✅ Done | [DEMO] | Mock data |
| Image Lightbox | - | ✅ Done | [DEMO] | Frontend only |
| Workflow Steps Panel | ⏳ Pending | ✅ Done | [DEMO] | Mock data |
| Like/Unlike | ⏳ Pending | ✅ Done | [DEMO] | Mock data |
| Send Reminder | ⏳ Pending | ✅ Done | [PROD-ONLY] | Cần notification system |
| API Integration | ⏳ Pending | ⏳ Pending | [DEMO] | - |

---

## 8. View Modes

| Mode | Description | Content |
|------|-------------|---------|
| Results View | Task results grouped by store | Store cards with images, comments |
| Comment View | All comments across stores | Store cards with expanded comments, no images |
| Staff View | Individual staff progress | Staff cards with requirements grid |

---

## 9. Related Documents

| Document | Path |
|----------|------|
| Detail Spec | `docs/specs/ws/task-detail-detail.md` |
| Task List Basic | `docs/specs/ws/task-list-basic.md` |
| Add Task Basic | `docs/specs/ws/add-task-basic.md` |
