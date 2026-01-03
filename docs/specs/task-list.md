# Task List Screen Specification

> **Status**: Implementation Complete (Frontend Mock)
> **Last Updated**: 2025-12-28
> **Screen ID**: SCR_TASK_LIST
> **Route**: `/tasks/list`

---

## 1. Overview

The Task List screen displays a paginated table of task groups with filtering, sorting, and navigation capabilities.

---

## 2. Screen Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│ List tasks                                                          │
├─────────────────────────────────────────────────────────────────────┤
│ [DatePicker]              [Search]  [Filter]  [+ ADD NEW]           │
├─────────────────────────────────────────────────────────────────────┤
│ No │ Dept │ Task Group │ Start→End │ Progress │ Unable │ Status │ HQ│
├────┼──────┼────────────┼───────────┼──────────┼────────┼────────┼───┤
│ 1  │ MKT  │ Task A     │ 12/01→... │ 5/10     │ 2      │ DONE   │...│
│    │      │  ▼ SubTask │           │          │        │ DRAFT  │   │
├────┼──────┼────────────┼───────────┼──────────┼────────┼────────┼───┤
│ Total: X tasks group (Showing 1-10)              [1] [2] [3] [>]    │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 3. Components

### 3.1 Header Section

| Component | Description | Status |
|-----------|-------------|--------|
| Title | "List tasks" - h1 heading | ✅ Implemented |
| DatePicker | DAY/WEEK/CUSTOM date selection | ✅ Implemented |
| Search | Text search for task name/dept | ✅ Implemented |
| Filter Button | Opens filter modal | ✅ Implemented |
| ADD NEW Button | Navigate to `/tasks/new` | ✅ Implemented |

### 3.2 DatePicker Component

| Feature | Description | Status |
|---------|-------------|--------|
| DAY tab | Select a single day with calendar picker | ✅ Implemented |
| WEEK tab | Select week number (W01-W53) with year, tooltip on hover | ✅ Implemented |
| CUSTOM tab | Dual calendar for date range with left/right click logic | ✅ Implemented |
| Popup size | 841x582 pixels | ✅ Implemented |

#### CUSTOM Tab - Dual Calendar Logic

| Behavior | Description |
|----------|-------------|
| Left calendar click | Always sets start date (From) |
| Right calendar click | Always sets end date (To) |
| Validation | Start date must be ≤ End date |
| Auto-adjust | If selected date violates validation, both dates set to selected date |

### 3.3 Table Columns

| Column | Sortable | Filterable | Status |
|--------|----------|------------|--------|
| No | ✅ Yes | ❌ No | ✅ Implemented |
| Dept | ✅ Yes | ✅ Yes (dropdown) | ✅ Implemented |
| Task Group | ✅ Yes | ❌ No | ✅ Implemented |
| Start → End | ✅ Yes | ❌ No | ✅ Implemented |
| Progress | ✅ Yes | ❌ No | ✅ Implemented |
| Unable | ✅ Yes | ❌ No | ✅ Implemented |
| Status | ✅ Yes | ✅ Yes (dropdown) | ✅ Implemented |
| HQ Check | ✅ Yes | ✅ Yes (dropdown) | ✅ Implemented |

### 3.4 Sorting Behavior

- **3-state cycle**: None → Ascending → Descending → None
- **Visual indicators**:
  - No sort: Gray up/down arrows
  - Ascending: Pink up arrow
  - Descending: Pink down arrow

### 3.5 Column Filter Dropdowns

- Available on: Dept, Status, HQ Check columns
- Features:
  - Checkbox multi-select
  - "All" button to select all options
  - "Clear" button to deselect all
  - Badge showing number of active filters

### 3.6 Row Expansion (Accordion)

- Click expand icon to show sub-tasks
- Only one row can be expanded at a time
- Sub-tasks display: name, assignee, status

### 3.7 Row Click Navigation

- Click on row navigates to `/tasks/{id}` detail page
- Expand button click does NOT trigger navigation (stopPropagation)

### 3.8 Pagination

| Feature | Value | Status |
|---------|-------|--------|
| Items per page | 10 (fixed) | ✅ Implemented |
| Page numbers | Displayed as buttons | ✅ Implemented |
| Previous/Next | Arrow buttons | ✅ Implemented |
| Total count | "Total: X tasks group" | ✅ Implemented |

---

## 4. Filter Modal

| Filter | Options | Status |
|--------|---------|--------|
| View Scope | All team, My tasks | ✅ Implemented |
| Department | Multi-select checkboxes with parent-child logic | ✅ Implemented |
| Status | NOT_YET, DRAFT, DONE (chip buttons) | ✅ Implemented |
| HQ Check | NOT_YET, DRAFT, DONE (chip buttons) | ✅ Implemented |

### 4.1 Department Checkbox Logic

| Action | Behavior |
|--------|----------|
| Check parent | All children are also checked |
| Uncheck parent | All children are also unchecked |
| Check all children | Parent is automatically checked |
| Uncheck any child | Parent is unchecked (if not all children selected) |
| Uncheck all children | Parent is automatically unchecked |

---

## 5. Data Types

```typescript
type TaskStatus = 'NOT_YET' | 'DRAFT' | 'DONE';
type HQCheckStatus = 'NOT_YET' | 'DRAFT' | 'DONE';
type DateMode = 'DAY' | 'WEEK' | 'CUSTOM';

interface TaskGroup {
  id: string;
  no: number;
  dept: string;
  taskGroupName: string;
  startDate: string;
  endDate: string;
  progress: { completed: number; total: number };
  unable: number;
  status: TaskStatus;
  hqCheck: HQCheckStatus;
  subTasks?: SubTask[];
}

interface SubTask {
  id: string;
  name: string;
  assignee?: string;
  status: TaskStatus;
}
```

---

## 6. File Structure

```
frontend/src/
├── app/tasks/
│   ├── list/page.tsx          # Main list page
│   ├── new/page.tsx           # Create new task
│   └── [id]/page.tsx          # Task detail
├── components/
│   ├── ui/
│   │   ├── DatePicker.tsx     # Date selection component
│   │   ├── StatusPill.tsx     # Status badge component
│   │   ├── SearchBar.tsx      # Search input
│   │   └── ColumnFilterDropdown.tsx  # Column filter
│   └── tasks/
│       └── FilterModal.tsx    # Filter modal dialog
├── types/
│   └── tasks.ts               # Type definitions
└── data/
    └── mockTasks.ts           # Mock data (temporary)
```

---

## 7. Pending Features

| Feature | Priority | Status |
|---------|----------|--------|
| Backend API integration | High | ⏳ Pending |
| Real-time updates | Medium | ⏳ Pending |
| Export functionality | Low | ⏳ Pending |

---

## 8. Changelog

| Date | Changes |
|------|---------|
| 2024-12-28 | Initial spec documentation |
| 2024-12-28 | Added column filter dropdowns |
| 2024-12-28 | Added ADD NEW navigation |
| 2024-12-28 | Added task detail navigation |
| 2024-12-28 | Added sorting for all columns |
| 2025-12-28 | Updated DatePicker UI: vertical tabs, week grid with tooltips, dual calendar with borders |
| 2025-12-28 | Added left/right calendar click logic with validation |
| 2025-12-28 | Renamed TODAY tab to DAY for single day selection |
| 2025-12-28 | Added calendar picker for DAY tab |
| 2025-12-28 | Added today highlight with border in all calendars |
| 2026-01-03 | Added search clear button (X icon) |
| 2026-01-03 | Updated default DatePicker from WEEK to DAY (today) |
| 2026-01-03 | Added parent-child checkbox logic in Filter Modal Department section |

---

## 9. Comparison with Original Spec (SCR_TASK_LIST)

| Spec Item | Original Spec | Current Implementation | Status |
|-----------|---------------|------------------------|--------|
| **A.1 Date Display** |
| DAY | Chọn 1 ngày cụ thể để lọc task | ✅ Filter tasks by date overlap | ✅ Fixed |
| WEEK | Hover hiển thị tooltip khoảng ngày | ✅ Tooltip on hover | ✅ Fixed |
| CUSTOM | 2 Calendar, highlight màu hồng nhạt | ✅ Dual calendar with pink highlight | ✅ Fixed |
| **A.2 Search Bar** |
| Logic | Tìm kiếm theo "Task Group" hoặc "Dept" | ✅ Search by taskGroupName or dept | ✅ OK |
| Cơ chế | Real-time hoặc nhấn Enter | ✅ Real-time search | ✅ OK |
| **A.3 Filter Modal** |
| View Scope | Dropdown "All team" mặc định | ✅ Implemented | ✅ OK |
| Department | Cấu trúc phân cấp: Level 1 (Khối), Level 2 (Phòng ban) | ✅ Hierarchical checkboxes | ✅ OK |
| Status | Chips/Tags - Not Yet, Done, Draft | ✅ Chip buttons | ✅ OK |
| HQ Check | Chips/Tags | ✅ Chip buttons | ✅ OK |
| Nút RESET | Reset tất cả điều kiện lọc | ✅ RESET button in footer | ✅ OK |
| **A.4 ADD NEW** |
| Action | Mở màn hình Add Task | ✅ Navigate to /tasks/new | ✅ OK |
| **B. Data Grid** |
| No | Đánh số thứ tự tăng dần theo danh sách hiển thị | ✅ Dynamic index (startIndex + index + 1) | ✅ Fixed |
| Dept | Icon + tên, có icon phễu lọc | ✅ Icon + name + column filter | ✅ OK |
| Task Group | Accordion mở rộng/thu gọn sub-tasks | ✅ Expandable rows | ✅ OK |
| Start -> End | Định dạng DD/MM | ✅ Format DD/MM | ✅ OK |
| Progress | [Đã xong]/[Tổng] | ✅ completed/total | ✅ OK |
| Status | Pills màu, có icon phễu | ✅ StatusPill + column filter | ✅ OK |
| HQ Check | Pills màu, có icon phễu | ✅ StatusPill + column filter | ✅ OK |
| **C. Pagination** |
| Tổng số lượng | "Total: [X] tasks group" | ✅ Implemented | ✅ OK |
| Điều hướng | Các nút phân trang | ✅ Page buttons | ✅ OK |
