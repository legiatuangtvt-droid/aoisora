# Task List - Basic Specification

> **Module**: WS (Task from HQ)
> **Screen ID**: SCR_TASK_LIST
> **Route**: `/tasks/list`
> **Last Updated**: 2026-01-08

---

## 1. Overview

| Field | Value |
|-------|-------|
| **Purpose** | Hiển thị danh sách task groups với khả năng lọc, sắp xếp và điều hướng |
| **Target Users** | Manager, Staff |
| **Entry Points** | Sidebar menu, Dashboard quick link |

---

## 2. User Stories

| ID | As a... | I want to... | So that... |
|----|---------|--------------|------------|
| US-01 | Manager | View all task groups | I can monitor team progress |
| US-02 | Manager | Filter tasks by date/dept/status | I can focus on specific tasks |
| US-03 | Manager | Sort tasks by column | I can organize the list |
| US-04 | Staff | View my assigned tasks | I know what to work on |
| US-05 | Manager | Create new task | I can assign work to team |

---

## 3. Screen Components Summary

| Component | Description |
|-----------|-------------|
| Header | Title "List tasks" |
| DatePicker | DAY/WEEK/CUSTOM date selection |
| Search | Text search for task name/dept |
| Filter Button | Opens filter modal |
| ADD NEW Button | Navigate to create task |
| Data Table | Task groups with sortable columns |
| Pagination | 10 items per page |
| Live Indicator | WebSocket connection status |

---

## 4. Screen Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│ List tasks                                        [Live ●] / [Offline ○]
├─────────────────────────────────────────────────────────────────────┤
│ [DatePicker]              [Search...]  [Filter]  [+ ADD NEW]        │
├─────────────────────────────────────────────────────────────────────┤
│ No │ Dept ▼│ Task Group │ Start→End │ Progress │ Unable │Status▼│HQ▼│
├────┼───────┼────────────┼───────────┼──────────┼────────┼───────┼───┤
│ 1  │ MKT   │ Task A     │ 12/01→... │ 5/10     │ 2      │ DONE  │...│
│ ▶  │       │  └ SubTask │           │          │        │ DRAFT │   │
├────┼───────┼────────────┼───────────┼──────────┼────────┼───────┼───┤
│ 2  │ SLS   │ Task B     │ 12/05→... │ 3/8      │ 0      │ DRAFT │...│
├────┴───────┴────────────┴───────────┴──────────┴────────┴───────┴───┤
│ Total: X tasks group (Page 1 of 5)              [<] [1] [2] [3] [>] │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 5. Navigation

| Action | Destination | Description |
|--------|-------------|-------------|
| Click row | `/tasks/{id}` | Navigate to Task Detail |
| Click ADD NEW | `/tasks/new` | Navigate to Create Task |
| Click Filter | Modal | Open Filter Modal |
| Click expand (▶) | - | Expand row to show sub-tasks |

---

## 6. API Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/tasks` | Get task list with filters, sorting, pagination |
| GET | `/api/v1/tasks/{id}` | Get task detail |
| GET | `/api/v1/departments` | Get department list for filter |

---

## 7. Implementation Status

| Feature | Backend | Frontend | Deploy | Notes |
|---------|---------|----------|--------|-------|
| Task List Table | ✅ Done | ✅ Done | [DEMO] | API integrated |
| DatePicker (DAY/WEEK/CUSTOM) | ✅ Done | ✅ Done | [DEMO] | Server-side date range filter |
| Search | ✅ Done | ✅ Done | [DEMO] | Server-side partial match, debounced 300ms |
| Filter Modal | ✅ Done | ✅ Done | [DEMO] | Server-side (dept, status, hqCheck) |
| Sorting | ✅ Done | ✅ Done | [DEMO] | Server-side via Spatie QueryBuilder |
| Pagination | ✅ Done | ✅ Done | [DEMO] | Server-side, 10 items/page |
| Column Quick Filters | - | ✅ Done | [DEMO] | Client-side (dept, status, hqCheck) |
| Row Expansion | - | ✅ Done | [DEMO] | Show sub-tasks |
| Real-time Updates | ✅ Done | ✅ Done | [PROD-ONLY] | Cần WebSocket server (Reverb) |
| Export Excel/PDF | ⏳ Pending | ⏳ Pending | [DEMO] | - |

---

## 8. Related Documents

| Document | Path |
|----------|------|
| Detail Spec | `docs/specs/ws/task-list-detail.md` |
| Task Detail Basic | `docs/specs/ws/task-detail-basic.md` |
| Add Task Basic | `docs/specs/ws/add-task-basic.md` |
