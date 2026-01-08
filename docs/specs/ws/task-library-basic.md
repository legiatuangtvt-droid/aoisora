# Task Library - Basic Specification

> **Module**: WS (Task from HQ)
> **Screen ID**: SCR_TASK_LIBRARY
> **Route**: `/tasks/library`
> **Last Updated**: 2026-01-08

---

## 1. Overview

| Field | Value |
|-------|-------|
| **Purpose** | Manage and organize common task templates for recurring office and store operations |
| **Target Users** | HQ (Headquarter) Staff |
| **Entry Points** | Sidebar "Task Library" menu |

---

## 2. User Stories

| ID | As a... | I want to... | So that... |
|----|---------|--------------|------------|
| US-01 | HQ Staff | View all task templates | I can see available templates for task creation |
| US-02 | HQ Staff | Filter tasks by Office/Store tab | I can focus on relevant task types |
| US-03 | HQ Staff | Filter tasks by department | I can find department-specific templates |
| US-04 | HQ Staff | Search task templates | I can quickly find specific tasks |
| US-05 | HQ Staff | Create new task template | I can add reusable task templates |
| US-06 | HQ Staff | Edit/Delete/Duplicate templates | I can manage existing templates |

---

## 3. Screen Components Summary

| Component | Description |
|-----------|-------------|
| Header | Title "TASK LIBRARY" with "+ Create New" button |
| Tab Navigation | OFFICE TASKS / STORE TASKS tabs |
| Department Filter Chips | Quick filter by Admin, HR, Legal, etc. |
| Search Bar | Text search with filter button |
| Task Group Sections | Expandable department groups with task tables |

---

## 4. Screen Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│ TASK LIBRARY                                      [+ Create New]    │
│ Manage and organize recurring tasks for office and store operations │
├─────────────────────────────────────────────────────────────────────┤
│ [OFFICE TASKS]  [STORE TASKS]                                       │
├─────────────────────────────────────────────────────────────────────┤
│ [Admin] [HR] [Legal]           [Search...] [Filter]                 │
├─────────────────────────────────────────────────────────────────────┤
│ ▼ ADMIN TASKS                              [3 GROUP TASKS]          │
│ ┌───────────────────────────────────────────────────────────────┐   │
│ │ No │ Type │ Task Name │ Owner │ Last Update │ Status │ Usage │   │
│ │ 1  │ Daily│ Opening...│ Thu OP│ 25 Dec, 25  │In prog │  565  │   │
│ │ 2  │ Weekly│ Check SS │Nguyen │ 23 Dec, 25  │ Draft  │   52  │   │
│ └───────────────────────────────────────────────────────────────┘   │
│ ▶ HR TASKS                                 [2 GROUP TASKS]          │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 5. Navigation

| Action | Destination | Description |
|--------|-------------|-------------|
| Click Sidebar "Task Library" | `/tasks/library` | Open Task Library |
| Click "+ Create New" | - | Open create task form |
| Click Task Row | - | Open task detail/edit form |
| Click Edit menu | - | Edit task template |
| Click Duplicate menu | - | Create copy of task |

---

## 6. API Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/task-library` | Get task template list |
| GET | `/api/v1/task-library/{id}` | Get task template detail |
| POST | `/api/v1/task-library` | Create new task template |
| PUT | `/api/v1/task-library/{id}` | Update template |
| DELETE | `/api/v1/task-library/{id}` | Delete template |
| POST | `/api/v1/task-library/{id}/duplicate` | Duplicate template |

---

## 7. Implementation Status

| Feature | Backend | Frontend | Deploy | Notes |
|---------|---------|----------|--------|-------|
| Task Library Page | ⏳ Pending | ✅ Done | [DEMO] | Mock data |
| Tab Navigation | - | ✅ Done | [DEMO] | Frontend only |
| Department Filter Chips | - | ✅ Done | [DEMO] | Frontend only |
| Search | ⏳ Pending | ✅ Done | [DEMO] | Client-side |
| Task Group Table | ⏳ Pending | ✅ Done | [DEMO] | Mock data |
| CRUD Operations | ⏳ Pending | ⏳ Pending | [DEMO] | - |

---

## 8. Task Types

| Type | Description |
|------|-------------|
| Daily | Daily recurring tasks |
| Weekly | Weekly recurring tasks |
| Ad hoc | One-time tasks |

---

## 9. Related Documents

| Document | Path |
|----------|------|
| Detail Spec | `docs/specs/ws/task-library-detail.md` |
| Add Task Basic | `docs/specs/ws/add-task-basic.md` |
| Task List Basic | `docs/specs/ws/task-list-basic.md` |
