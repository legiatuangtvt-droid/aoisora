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
| 1 | Get Task List | GET | /api/v1/tasks | Get task list with filters, sorting, pagination | Screen load, filter change, sort, pagination, search |
| 2 | Get Departments | GET | /api/v1/departments | Get department list for filter dropdown | Click Filter button (first time) |

### 3.1 API Parameters & Business Logic

#### API 1: Get Task List

**Implicit Parameters** (extracted from JWT token):
- `staff_id`: Current user's staff ID
- `grade_code`: Job grade (G2-G9 for HQ, S1-S6 for Store)
- `grade_type`: Staff type (HQ or STORE)
- `department_id`: For HQ staff
- `store_id`, `region_id`, `area_id`: For Store staff

**Explicit Parameters** (user controls):
- `date_from`: Start date (YYYY-MM-DD)
- `date_to`: End date (YYYY-MM-DD)
- `search`: Search by task name or department name
- `department_id[]`: Filter by departments (multi-select)
- `status[]`: Filter by status (NOT_YET, DONE, DRAFT)
- `hq_check[]`: Filter by HQ check status
- `page`: Page number (default: 1)
- `per_page`: Items per page (default: 10)
- `sort`: Sort field (e.g., "start_date", "-created_at")

**Business Logic by Job Grade**:

| Grade Type | Grade Code | Access Scope |
|------------|------------|--------------|
| HQ | G8, G9 (CCO, GD) | All tasks in company |
| HQ | G7 (Senior GM) | Tasks in managed division |
| HQ | G6, G5 (GM, Manager) | Tasks in managed department |
| HQ | G4 (Deputy Manager) | Tasks in managed team |
| HQ | G3, G2 (Executive, Officer) | Only assigned tasks |
| STORE | S6 (Region Manager) | Tasks in managed region |
| STORE | S5 (Area Manager) | Tasks in managed area |
| STORE | S4 (Store In-charge) | Tasks in store cluster |
| STORE | S3, S2 (Store Leader) | Tasks in managed store |
| STORE | S1 (Staff) | Only assigned tasks |

#### API 2: Get Departments

**Purpose**: Populate department dropdown in Filter Modal

**Returns**: List of departments with hierarchy (Division → Department)

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
