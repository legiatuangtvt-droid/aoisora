# TASK LIBRARY SCREEN SPECIFICATION (SCR_TASK_LIBRARY)

---

## 1. GENERAL DESCRIPTION

| No | Attribute | Value |
|----|-----------|-------|
| 1 | Screen Name | Task Library Screen |
| 2 | Screen Code | SCR_TASK_LIBRARY |
| 3 | Target Users | HQ (Headquarter) Staff |
| 4 | Access Point | From Sidebar Menu: "Task Library" |

*Purpose: Admin manages and organizes common task templates for recurring tasks for office and store operations. Allows creating, editing and deleting task templates.*

### Access Flow:

| Step | Action |
|------|--------|
| 1 | From Sidebar Menu, select "Task Library" |
| 2 | Screen displays with 2 tabs: OFFICE TASKS and STORE TASKS |

---

## 2. FUNCTIONAL SPECIFICATION

*Interface divided into: Header (Title + Actions), Tab Navigation, Filter Bar, and Content Area (Task Groups).*

### A. Page Header

| No | Component | Description | Notes |
|----|-----------|-------------|-------|
| 1 | Page Title | "TASK LIBRARY" | Font 16m, bold, black color |
| 2 | Subtitle | "Manage and organize recurring tasks for office and store operations." | Gray text |
| 3 | Create New Document | Button "+ Create New" | Filled button, pink/red color, right corner |

### B. Tab Navigation (Task Type Navigation)

*Categorize tasks by target users: Office (headquarters) or Store (stores).*

| No | Tab | Icon | Description |
|----|-----|------|-------------|
| 1 | OFFICE TASKS | Building icon | Tasks for office staff (HQ) |
| 2 | STORE TASKS | Store icon | Tasks for store staff |

*Active tab has pink underline and pink text.*

### C. Department Filter Chips

*Quick filter tasks by department, displayed as chips/buttons.*

| No | Chip | Icon | Description |
|----|------|------|-------------|
| 1 | Admin | Person/admin icon | Filter Admin department tasks |
| 2 | HR | People icon | Filter HR department tasks |
| 3 | Legal | - | Filter Legal department tasks |

*Active chip has light pink background, pink color. Multiple chips can be selected simultaneously.*

### D. Search & Filter Bar

| No | Component | Type | Description |
|----|-----------|------|-------------|
| 1 | Search Input | Text input | Placeholder: "Search in task library..." |
| 2 | Search Icon | Magnifying glass icon | Left side of input |
| 3 | Filter Button | Button | "Filter" button with funnel icon, right corner |

### E. Task Group Section (Task Groups)

*Each department has a section containing task list, expandable/collapsible*

#### E.1. Task Group Header

| No | Component | Description | Notes |
|----|-----------|-------------|-------|
| 1 | Department Icon | Department icon | Color by department |
| 2 | Department Name | Department name + "TASKS" | e.g., "ADMIN TASKS", Bold font |
| 3 | Group Tasks Count | Number of group tasks | Badge "X GROUP TASKS" right corner |
| 4 | Expand/Collapse Icon | Arrow icon (V/A) | Right corner, click to toggle |

#### E.2. Task Data Table

| No | Column | Description | Notes |
|----|--------|-------------|-------|
| 1 | No | Sequential number | Incrementing numbers |
| 2 | Type | Task type | Daily, Weekly, Ad hoc - with sort icon (^) |
| 3 | Task Name | Task name | e.g., "Opening Store", "Check SS" - with sort icon |
| 4 | Owner | Task owner/creator | Avatar + Name (e.g., Thu OP, Nguyen GD) |
| 5 | Last Update | Last update date | Format: DD MMM, YY (e.g., 25 Dec, 25) |
| 6 | Status | Status | Color badge: In progress (yellow), Draft (blue), Available (green) |
| 7 | Usage | Usage count | e.g., 565, 52, 1 |
| 8 | Menu (three dots) | Action menu | Edit, Delete, Duplicate options |

### F. Task Types

| No | Type | Icon | Description |
|----|------|------|-------------|
| 1 | Daily | - | Daily tasks | Opening Store, Closing Store |
| 2 | Weekly | - | Weekly tasks | Check SS, Weekly Report |
| 3 | Ad hoc | - | Ad-hoc tasks | Report competitor, Special tasks |

### G. Status Types

| No | Status | Color | Description |
|----|--------|-------|-------------|
| 1 | In progress | Yellow/Orange (#FFC107) | Task is being used |
| 2 | Draft | Blue (#E91E63) | Task in draft status |
| 3 | Available | Green (#4CAF50) | Task is ready |

### H. Department Task Groups

*List of task groups by department with the following groups:*

| No | Department | Icon | Color |
|----|------------|------|-------|
| 1 | ADMIN TASKS | Person/admin icon | Pink (#E91E63) |
| 2 | HR | People icon | Purple (#9C27B0) |
| 3 | Create New group | Green (#4CAF50) | Green (#4CAF50) |

### I. Create New Document

| No | Component | Description | Notes |
|----|-----------|-------------|-------|
| 1 | Button Label | "+ Create New" | Icon (+) before text |
| 2 | Button Style | Filled button, colored | Hover: darker shade |
| 3 | Click Action | Open create task form | Navigate to create new screen |

### J. Row Actions Menu (Three Dots Menu)

*Menu displayed when clicking three dots icon on each row*

| No | Action | Icon | Description |
|----|--------|------|-------------|
| 1 | Edit | Pencil icon | Edit task template |
| 2 | Duplicate | Copy icon | Create copy of task template |
| 3 | Delete | Trash icon | Delete task template |
| 4 | View Usage | Chart icon | View usage statistics |

---

## 3. VALIDATION RULES

| No | Rule | Description |
|----|------|-------------|
| 1 | Task name required | Task name cannot be empty |
| 2 | Task name unique | Task name must be unique within same department |
| 3 | Type required | Must select task type (Daily/Weekly/Ad hoc) |
| 4 | Owner required | Must have task owner |
| 5 | Department required | Task must belong to a department |
| 6 | Search min length | Search requires minimum 2 characters |

---

## 4. API INTEGRATION

| No | Action | Method | Endpoint | Description |
|----|--------|--------|----------|-------------|
| 1 | Get Task Library | GET | /api/v1/task-library | Get task template list |
| 2 | Get by Department | GET | /api/v1/task-library?dept={id} | Get tasks by department |
| 3 | Get Task Detail | GET | /api/v1/task-library/{id} | Get task template detail |
| 4 | Create Task | POST | /api/v1/task-library | Create new task template |
| 5 | Update Task | PUT | /api/v1/task-library/{id} | Update task template |
| 6 | Delete Task | DELETE | /api/v1/task-library/{id} | Delete task template |
| 7 | Duplicate Task | POST | /api/v1/task-library/{id}/duplicate | Create task copy |
| 8 | Search Tasks | GET | /api/v1/task-library/search?q={query} | Search tasks |
| 9 | Get Usage Stats | GET | /api/v1/task-library/{id}/stats | Get usage statistics |

---

## 5. UI STATES

| No | State Type | State | Display |
|----|------------|-------|---------|
| 1 | Loading | Initial load | Skeleton loader for table |
| 2 | Loading | Searching | Spinner in search input |
| 3 | Loading | Deleting | Spinner on row being deleted |
| 4 | Empty | No tasks | "No tasks found in this department" |
| 5 | Empty | Search no results | "No matching tasks found" |
| 6 | Error | Load failed | Error message with retry button |
| 7 | Error | Delete failed | Toast error message |
| 8 | Success | Task created | Toast "Task template created successfully" |
| 9 | Success | Task deleted | Toast "Task template deleted" |
| 10 | Active | Tab selected | Tab has pink underline |
| 11 | Active | Chip selected | Chip has light pink background |
| 12 | Expanded | Group open | Arrow icon rotates up (A) |
| 13 | Collapsed | Group closed | Arrow icon rotates down (V) |

---

## 6. TEST SCENARIOS

### A. UI/UX Testing

| No | Test Case | Scenario | Expected |
|----|-----------|----------|----------|
| 1 | Layout check | Open Task Library screen | Header, tabs, filter, table display correctly |
| 2 | Tab switch | Click tab STORE TASKS | Content changes, underline moves |
| 3 | Chip filter | Click chip "Admin" | Chip active, table filters by Admin |
| 4 | Expand/Collapse | Click on group header | Toggle show/hide table |
| 5 | Status colors | View status badges | Colors correct: yellow, blue, green |
| 6 | Sort columns | Click on header Type, Task Name | Table sorts by column |

### B. Functional Testing

| No | Test Case | Scenario | Expected |
|----|-----------|----------|----------|
| 1 | Search task | Enter "Opening" in search | Results filter to tasks containing "Opening" |
| 2 | Search no result | Enter text not found | Display "No matching tasks found" |
| 3 | Create task | Click "+ Create New Document" | Navigate to create new form |
| 4 | Edit task | Click menu -> Edit | Open edit task template form |
| 5 | Delete task | Click menu -> Delete -> Confirm | Task deleted, success toast |
| 6 | Duplicate task | Click menu -> Duplicate | New task created with name "(Copy)" |
| 7 | Filter by chip | Click chip Admin | Only show Admin tasks |
| 8 | Multi-chip filter | Click chip Admin + HR | Table shows tasks from both Admin and HR |

---

## 7. FILE STRUCTURE

```
frontend/src/
├── app/
│   └── tasks/
│       └── library/
│           └── page.tsx
├── components/
│   └── library/
│       ├── index.ts
│       ├── TaskLibraryHeader.tsx
│       ├── TaskLibraryTabs.tsx
│       ├── DepartmentFilterChips.tsx
│       ├── TaskSearchBar.tsx
│       ├── TaskGroupSection.tsx
│       ├── TaskDataTable.tsx
│       ├── TaskStatusBadge.tsx
│       └── TaskRowActions.tsx
├── types/
│   └── taskLibrary.ts
└── data/
    └── mockTaskLibrary.ts
```

---

## CHANGELOG

| Date | Change |
|------|--------|
| 2026-01-02 | Initial specification created |
| 2026-01-02 | Implemented UI: route /tasks/library, all components created, sidebar menu highlight fix |
| 2026-01-02 | Translated specification to English |
