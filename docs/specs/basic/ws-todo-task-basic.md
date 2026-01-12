# To Do Task - Basic Specification

> **Module**: WS (Task from HQ)
> **Screen ID**: SCR_TODO_TASK
> **Route**: `/tasks/todo`
> **Last Updated**: 2026-01-08

---

## 1. Overview

| Field | Value |
|-------|-------|
| **Purpose** | Main screen showing task management overview with weekly progress, calendar view, and daily tasks |
| **Target Users** | HQ (Headquarter) Staff |
| **Entry Points** | Sidebar "To-do Task" menu |

---

## 2. User Stories

| ID | As a... | I want to... | So that... |
|----|---------|--------------|------------|
| US-01 | HQ Staff | View weekly task overview | I can see the week's task summary |
| US-02 | HQ Staff | Review last week's tasks | I can track progress and bottlenecks |
| US-03 | HQ Staff | View daily tasks in calendar | I know what to do each day |
| US-04 | HQ Staff | Add new tasks | I can plan my work |
| US-05 | HQ Staff | Filter tasks by status/type | I can focus on specific tasks |
| US-06 | Manager | Add comments | I can provide feedback to staff |

---

## 3. Screen Components Summary

| Component | Description |
|-----------|-------------|
| Week Header | Week title, date range, "+ Add New" button |
| Overall Week Panel | Current week task summary table |
| Last Week Review Panel | Previous week review with progress/output |
| Filter Bar | User, Status, Type dropdowns |
| Calendar View | Weekly calendar with daily tasks |
| Manager Comment Panel | Right sidebar for manager comments |

---

## 4. Screen Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│ WEEK 51, 2025                                        [+ Add New]     │
│ December 15 - December 21                                            │
├─────────────────────────────────┬───────────────────────────────────┤
│ ▼ Overall Week 51              │ ▼ Last Week Review                 │
│ ┌─────────────────────────────┐│ ┌─────────────────────────────────┐│
│ │ W51 Task │ Means │ Target   ││ │ W50 Task │ Progress │ Output    ││
│ │ Opening  │ ...   │ ...      ││ │ Opening  │ ...      │ ...       ││
│ └─────────────────────────────┘│ └─────────────────────────────────┘│
├─────────────────────────────────┴───────────────────────────────────┤
│ [All Users ▼] [All Statuses ▼] [All Types ▼]                        │
├─────────────────────────────────────────────────────────────────────┤
│ ▼ Week 51, 2025                    │ Manager Comment              │
│ ┌──────────────────────────────────┤ ┌───────────────────────────┐│
│ │ MON/15 │ Tasks... │ In Process   │ │ Comment from manager...   ││
│ │ TUE/16 │ Tasks... │ Done         │ │                           ││
│ │ WED/17 │ Tasks... │ Draft        │ └───────────────────────────┘│
│ └──────────────────────────────────┘                               │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 5. Navigation

| Action | Destination | Description |
|--------|-------------|-------------|
| Click Sidebar "To-do Task" | `/tasks/todo` | Open To-do Task |
| Click "+ Add New" | - | Open add task modal |
| Click week arrows | - | Navigate to previous/next week |
| Click task item | - | Open task detail modal |

---

## 6. API Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/todo/week/{weekNum}` | Get tasks for a week |
| GET | `/api/v1/todo/overview/week/{weekNum}` | Get week overview |
| GET | `/api/v1/todo/review/week/{weekNum}` | Get last week review |
| POST | `/api/v1/todo` | Create new task |
| PUT | `/api/v1/todo/{id}` | Update task |
| PATCH | `/api/v1/todo/{id}/status` | Update task status |
| DELETE | `/api/v1/todo/{id}` | Delete task |

---

## 7. Implementation Status

| Feature | Backend | Frontend | Deploy | Notes |
|---------|---------|----------|--------|-------|
| Todo Task Page | ⏳ Pending | ✅ Done | [DEMO] | Mock data |
| Week Header | - | ✅ Done | [DEMO] | UI only |
| Overall Week Panel | - | ✅ Done | [DEMO] | Mock data |
| Last Week Review | - | ✅ Done | [DEMO] | Mock data |
| Filter Bar | - | ✅ Done | [DEMO] | Client-side |
| Calendar View | - | ✅ Done | [DEMO] | Mock data |
| Manager Comment Panel | - | ✅ Done | [DEMO] | Mock data |
| Responsive Design | - | ✅ Done | [DEMO] | Mobile/Tablet/Desktop |
| API Integration | ⏳ Pending | ⏳ Pending | [DEMO] | - |

---

## 8. Task Types

| Type | Icon | Description |
|------|------|-------------|
| Personal | Pink bullet | Personal individual tasks |
| Team | Cyan bullet | Team collaborative tasks |
| Store | Green bullet | Store-related tasks |

---

## 9. Status Types

| Status | Color | Description |
|--------|-------|-------------|
| In Process | Yellow/Orange | Task in progress |
| Done | Blue | Task completed |
| Draft | Green | Draft status |
| Not Yet | Red | Not started yet |

---

## 10. Related Documents

| Document | Path |
|----------|------|
| Detail Spec | `docs/specs/detail/ws-todo-task-detail.md` |
| Task List Basic | `docs/specs/basic/ws-task-list-basic.md` |
| Add Task Basic | `docs/specs/basic/ws-add-task-basic.md` |
