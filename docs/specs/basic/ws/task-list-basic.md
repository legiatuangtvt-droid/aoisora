# TASK LIST SCREEN SPECIFICATION (SCR_TASK_LIST)

> **Module**: WS (Task from HQ)
> **Screen ID**: SCR_TASK_LIST
> **Route**: `/tasks/list`
> **Last Updated**: 2026-01-08

---

## 1. GENERAL DESCRIPTION

### 1.1 Screen Information

| No | Attribute | Value |
|----|-----------|-------|
| 1 | Screen Name | Task List Management Screen |
| 2 | Screen Code | SCR_TASK_LIST |
| 3 | Target Users | HQ (Headquarter) Staff, Manager, Staff |

**Purpose**: Central dashboard for users to track task group progress across stores/departments.

### 1.2 Access Flow

| No | Step | Description |
|----|------|-------------|
| 1 | Step 1 | From Sidebar Menu, select "Task list HQ-Store" |
| 2 | Step 2 | Select "List task" to open task list management screen |

### 1.3 Screen Layout (ASCII Diagram)

```
┌─────────────────────────────────────────────────────────────────────┐
│ List tasks                                        [Live ●] / [Offline ○]
├─────────────────────────────────────────────────────────────────────┤
│ [TODAY|WEEK|CUSTOM]       [Search...]  [Filter]  [+ ADD NEW]        │
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

## 2. FUNCTIONAL SPECIFICATION

Interface divided into 3 areas: Header (Filter & Actions), Body (Data Grid), Footer (Pagination)

### A. Header Area (Filter & Action)

#### A.1. Date Display

| No | Mode | Description | Interaction |
|----|------|-------------|-------------|
| 1 | TODAY | Default shows current date | Auto-filter tasks valid for today |
| 2 | WEEK | Select by week (W 01 - W 53) | Hover shows date range tooltip |
| 3 | CUSTOM | Select custom date range From - To | 2 parallel calendars, selection highlighted in light pink |

#### A.2. Search Bar

| No | Attribute | Value |
|----|-----------|-------|
| 1 | Type | Text input |
| 2 | Logic | Search by "Task Group" or "Dept" |
| 3 | Mechanism | Real-time or press Enter |

#### A.3. Filter Button (Advanced Filter)

| No | Component | Type | Description |
|----|-----------|------|-------------|
| 1 | Header | Text + Close (X) | Title "Filter", X button to close |
| 2 | View Scope | Dropdown | Select team scope, default "All team" |
| 3 | Department | Checkbox (Multi-select) | Hierarchical: Level 1 (Division), Level 2 (Department) |
| 4 | Status | Chips/Tags | Not Yet, Done, Draft - multi-select support |
| 5 | HQ Check | Chips/Tags | Not Yet, Done, Draft - multi-select support |
| 6 | RESET Button | Button | Reset all filter conditions to default |

#### A.4. "+ ADD NEW" Button

| No | Attribute | Value |
|----|-----------|-------|
| 1 | Type | Primary Button (Pink/Red color) |
| 2 | Action | Open Add Task screen (SCR_TASK_ADD) |

### B. Body Area (Data Grid)

Grid displays data with hierarchical structure (Parent-Child) support.

| No | Column | Description | Features |
|----|--------|-------------|----------|
| 1 | No | Row number | Incremental numbering |
| 2 | Dept | Department | Display name + icon, funnel icon for quick filter |
| 3 | Task Group | Task group | Accordion: Click to expand/collapse sub-tasks |
| 4 | Start → End | Validity period | Format: DD/MM |
| 5 | Progress | Progress | Display fraction: [Done]/[Total] (e.g., 23/27) |
| 6 | Unable | Unable to complete | Number of tasks reported unable to complete |
| 7 | Status | Status | Color pills: Not Yet (red), Done (blue), Draft (green) |
| 8 | HQ Check | HQ verification | Similar color pills to Status, has funnel icon |

### C. Footer Area (Pagination)

| No | Component | Description |
|----|-----------|-------------|
| 1 | Total Count | Display "Total: [X] tasks group" |
| 2 | Navigation | Pagination buttons (<, 1, 2, >) for page navigation |

---

## 3. API INTEGRATION

| No | Action | Method | Endpoint | Description | Trigger |
|----|--------|--------|----------|-------------|---------|
| 1 | Get Task List | GET | /api/v1/tasks | Get task list with filters and pagination | Screen load, filter change, pagination, search |
| 2 | Get Departments | GET | /api/v1/departments | Get department list for filter dropdown | Click Filter button (first time) |

---

## 4. TEST SCENARIOS

### A. UI/UX Testing

| No | Test Case | Scenario | Expected Result |
|----|-----------|----------|-----------------|
| 1 | Display check | Open Task List screen | Columns aligned, Status pill colors match design |
| 2 | Responsive | Resize window to various resolutions | Table layout doesn't break |
| 3 | Accordion indent | Expand Task Group | Sub-tasks indented from parent task |

### B. Functional Testing

| No | Test Case | Scenario | Expected Result |
|----|-----------|----------|-----------------|
| 1 | Search - with results | Enter correct Task name | Returns correct results |
| 2 | Search - no results | Enter non-existent keyword | Display "No data" |
| 3 | Filter by Status | Click Status column funnel, select "Done" | Only show rows with Done status |
| 4 | Combined filter | Dept = PERI and Status = Not Yet | Show rows matching both conditions |
| 5 | Pagination | Click page 2 | Data changes, row numbers continue from page 1 |
| 6 | Expand/Collapse | Click parent task | Show child tasks, click again to collapse |

---

## Related Documents

| Document | Path |
|----------|------|
| Detail Spec | [task-list-detail.md](task-list-detail.md) |
| Task Detail Basic | [task-detail-basic.md](task-detail-basic.md) |
| Add Task Basic | [add-task-basic.md](add-task-basic.md) |
