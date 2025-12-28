# Task List Screen Specification

> **Status**: Implementation Complete (Frontend Mock)
> **Last Updated**: 2024-12-28
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
| DatePicker | TODAY/WEEK/CUSTOM date selection | ✅ Implemented |
| Search | Text search for task name/dept | ✅ Implemented |
| Filter Button | Opens filter modal | ✅ Implemented |
| ADD NEW Button | Navigate to `/tasks/new` | ✅ Implemented |

### 3.2 DatePicker Component

| Feature | Description | Status |
|---------|-------------|--------|
| TODAY tab | Select current date | ✅ Implemented |
| WEEK tab | Select week number (W01-W53) with year | ✅ Implemented |
| CUSTOM tab | Dual calendar for date range | ✅ Implemented |
| Popup size | 841x582 pixels | ✅ Implemented |

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
| Department | Multi-select checkboxes | ✅ Implemented |
| Status | NOT_YET, DRAFT, DONE | ✅ Implemented |
| HQ Check | NOT_YET, DRAFT, DONE | ✅ Implemented |

---

## 5. Data Types

```typescript
type TaskStatus = 'NOT_YET' | 'DRAFT' | 'DONE';
type HQCheckStatus = 'NOT_YET' | 'DRAFT' | 'DONE';
type DateMode = 'TODAY' | 'WEEK' | 'CUSTOM';

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

---

## 9. Comparison with Original Spec

> **Note**: This section should be updated after comparing with the original Excel spec (SCR_TASK_LIST sheet).

| Spec Item | Original Spec | Current Implementation | Difference |
|-----------|---------------|------------------------|------------|
| TBD | TBD | TBD | TBD |
