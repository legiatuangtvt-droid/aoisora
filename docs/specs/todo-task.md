# TO DO TASK SCREEN SPECIFICATION (SCR_TODO_TASK)

---

## 1. GENERAL DESCRIPTION

| STT | Attribute | Value |
|-----|-----------|-------|
| 1 | Screen Name | To Do Task Screen |
| 2 | Screen Code | SCR_TODO_TASK |
| 3 | Target Users | HQ (Headquarter) Staff |
| 4 | Access Point | From Sidebar Menu: "To-do Task" |

*Purpose: Main screen showing task management overview with weekly progress, calendar view, and daily tasks.*

### Access Flow:

| Step | Action |
|------|--------|
| 1 | From Sidebar Menu, select "To-do Task" |
| 2 | Screen displays with overall weekly info on the left panel |

---

## 2. FUNCTIONAL SPECIFICATION

*Screen contains 3 main areas: Header (Week Info + Actions), Overview Panels (Current Week + Last Week), and Calendar View (Daily Tasks).*

### A. Week Header

| STT | Component | Value | Notes |
|-----|-----------|-------|-------|
| 1 | Week Title | "WEEK 51, 2025" | Font bold, large, color black |
| 2 | Date Range | "December 15- December 21" | Text gray, smaller, below title |
| 3 | Add New Button | Nút "+ Add New" | Button filled pink/red, bold text |

### B. Overall Week Panel (Current Week Overview)

*Panel shows current week task summary statistics.*

#### B.1. Panel Header

| STT | Component | Value | Notes |
|-----|-----------|-------|-------|
| 1 | Icon | Icon calendar/checklist | Pink color |
| 2 | Title | "Overall Week 51" | Font bold |

#### B.2. Table Columns

| STT | Column | Value | Notes |
|-----|--------|-------|-------|
| 1 | W51 Task | Total tasks in week 51 | Header pink color/highlight |
| 2 | Means/Method | Method to complete task | Has tooltip icon (i) |
| 3 | Target | Target value | Example: "Typing..." (placeholder) |

#### B.3. Task Rows

| STT | Task | Description |
|-----|------|-------------|
| 1 | 1. Opening Store | Store opening tasks |
| 2 | 2. Plan for 2026 | Planning for next year 2026 |
| 3 | 3. Support Store | Store support tasks |

### C. Last Week Review Panel (Previous Week Review)

*Panel shows last week review with completion results.*

#### C.1. Panel Header

| STT | Component | Value | Notes |
|-----|-----------|-------|-------|
| 1 | Title | "Last Week Review" | Font bold, pink color |

#### C.2. Table Columns

| STT | Column | Value | Notes |
|-----|--------|-------|-------|
| 1 | W50 Task | Total tasks in week 50 | Header pink color/highlight |
| 2 | Progress/Bottleneck | Progress and bottleneck notes | Notes on bottleneck |
| 3 | Output | Output/result of task | Output of each task |

### D. Filter Bar (Filter Options)

| STT | Component | Type | Description |
|-----|-----------|------|-------------|
| 1 | All Statuses | Dropdown | Filter by status: All, In Progress, Done, Pending |
| 2 | All Types | Dropdown | Filter by type: All, Personal, Team, Store |

### E. Calendar View (Weekly Calendar View)

*Displays tasks organized by day in a weekly calendar format.*

#### E.1. Calendar Header

| STT | Component | Value | Notes |
|-----|-----------|-------|-------|
| 1 | Calendar Icon | Icon tick | Pink color |
| 2 | Week Title | "Week 51, 2025" | Font bold |
| 3 | Navigation Arrows | Left/right arrows | Switch week previous/next |
| 4 | Placeholder | Area on right side | Can display mini calendar |

#### E.2. Daily Task Table

| STT | Column | Value | Notes |
|-----|--------|-------|-------|
| 1 | Date | Day of week | Format: "MON/15 Dec" (day + date) |
| 2 | Productivity | Task list for day | List tasks, numbered sequentially |
| 3 | Type | Task type | Example: "Personal" with icon bullet |
| 4 | Status | Completion status | Badge style: in progress (orange) |

#### E.3. Date Cell Format

| STT | Component | Value | Notes |
|-----|-----------|-------|-------|
| 1 | Day of Week | Day name (MON, TUE, WED...) | Text small, uppercase |
| 2 | Day Number | Day number (15, 16, 17...) | Font bold, large |
| 3 | Month | Month name (Dec) | Text small, same row with Day |

#### E.4. Productivity Cell Format

| STT | Component | Value | Notes |
|-----|-----------|-------|-------|
| 1 | Location Header | Work location | Example: "V917: Long Bien -> Ocean", font bold |
| 2 | Task List | Task list for the day | Numbered: 1, 2, 3... |
| 3 | Task Item | Task name | Example: "Survey competitor", "Check store" |

### F. Task Types (Task Categories)

| STT | Type | Icon | Description |
|-----|------|------|-------------|
| 1 | Personal | Bullet pink | Personal individual tasks |
| 2 | Team | Bullet cyan | Team collaborative tasks |
| 3 | Store | Bullet green | Store-related tasks |

### G. Status Types (Task Statuses)

| STT | Status | Color | Description |
|-----|--------|-------|-------------|
| 1 | In Process | Yellow/Orange (#FFC107) | Task in progress |
| 2 | Done | Green (#4CAF50) | Task completed |
| 3 | Draft | Gray (#9E9E9E) | Draft status |
| 4 | Not Yet | Red (#F44336) | Not started yet |

### H. Location Dropdowns (Per Day Row)

*Each daily task row includes location selection dropdowns.*

| STT | Field | Type | Description |
|-----|-------|------|-------------|
| 1 | Location Header | Text | Format: "V917: [Region] -> [Zone]" |
| 2 | Region | Dropdown | Select region |
| 3 | Zone | Dropdown | Dependent on Region |
| 4 | Area | Dropdown | Dependent on Zone |
| 5 | Store | Dropdown | Dependent on Area |

### I. Manager Comment Panel (Right Sidebar)

*Panel on the right side for manager comments and feedback.*

| STT | Component | Type | Description |
|-----|-----------|------|-------------|
| 1 | Panel Title | Text | "Manager Comment" with pink underline |
| 2 | Comment Input | Textarea | Input field for manager comments |
| 3 | Other Comment | Textarea | Secondary comment section |

### J. Weekend Display

| STT | Day | Display |
|-----|-----|---------|
| 1 | Saturday | "OFF" - no tasks displayed |
| 2 | Sunday | "OFF" - no tasks displayed |

### K. Add New Task

| STT | Component | Value | Notes |
|-----|-----------|-------|-------|
| 1 | Button Label | "+ Add New" | Icon (+) plus text |
| 2 | Button Style | Filled button, pink/red | Hover: darker shade |
| 3 | Click Action | Opens add new task modal | Modal or navigate to add screen |

---

## 3. VALIDATION RULES

| STT | Rule | Description |
|-----|------|-------------|
| 1 | Task name required | Task name cannot be empty |
| 2 | Date required | Must select date for task |
| 3 | Type required | Must select task type |
| 4 | Week range valid | Week must be within valid range |
| 5 | Target optional | Target can be left empty |

---

## 4. API INTEGRATION

| STT | Action | Method | Endpoint | Description |
|-----|--------|--------|----------|-------------|
| 1 | Get Week Tasks | GET | /api/v1/todo/week/{weekNum} | Get tasks for a week |
| 2 | Get Daily Tasks | GET | /api/v1/todo/date/{date} | Get tasks by specific day |
| 3 | Get Week Overview | GET | /api/v1/todo/overview/week/{weekNum} | Get week overview summary |
| 4 | Get Last Week Review | GET | /api/v1/todo/review/week/{weekNum} | Get review from previous week |
| 5 | Create Task | POST | /api/v1/todo | Create new task |
| 6 | Update Task | PUT | /api/v1/todo/{id} | Update existing task |
| 7 | Delete Task | DELETE | /api/v1/todo/{id} | Delete task |
| 8 | Update Status | PATCH | /api/v1/todo/{id}/status | Update task status |

---

## 5. UI STATES

| STT | State Type | State | Display |
|-----|------------|-------|---------|
| 1 | Loading | Initial load | Skeleton loader on panels and calendar |
| 2 | Loading | Week change | Spinner when switching weeks |
| 3 | Empty | No tasks | "No tasks for this week" |
| 4 | Empty | No daily tasks | "No tasks for this day" |
| 5 | Error | Load failed | Error message with retry button |
| 6 | Success | Task added | Toast "Task added successfully" |
| 7 | Success | Status updated | Toast "Status updated" |
| 8 | Active | Current day | Highlight current day row |
| 9 | Editable | Target input | Input box with placeholder "Typing..." |

---

## 6. TEST SCENARIOS

### A. UI/UX Testing

| STT | Test Case | Scenario | Expected |
|-----|-----------|----------|----------|
| 1 | Layout check | Open To Do Task screen | Header, panels, calendar display correctly |
| 2 | Week display | View week info | Display week number and date range |
| 3 | Panel layout | View 2 panels Overview | 2 panels side by side, table inside |
| 4 | Calendar layout | View calendar view | Display all days in current week |
| 5 | Status colors | View status badges | Colors match status type |

### B. Functional Testing

| STT | Test Case | Scenario | Expected |
|-----|-----------|----------|----------|
| 1 | Add new task | Click "+ Add New" -> Save | Task appears in calendar |
| 2 | Filter by status | Select from dropdown | Only show tasks matching filter type |
| 3 | Filter by type | Click "Personal" filter | Only show tasks of that type |
| 4 | Navigate week | Click left/right arrows | Switch to previous/next week |
| 5 | Edit target | Click on Target -> Edit | Target updated successfully |
| 6 | Update status | Click on status badge | Dropdown appears, select new status |
| 7 | View task detail | Click on task in calendar | Modal displays task details |

---

## 7. FILE STRUCTURE

```
frontend/src/
├── app/
│   └── tasks/
│       └── todo/
│           └── page.tsx
├── components/
│   └── tasks/
│       └── todo/
│           ├── TodoTaskPage.tsx
│           ├── WeekHeader.tsx
│           ├── OverallWeekPanel.tsx
│           ├── LastWeekReviewPanel.tsx
│           ├── FilterBar.tsx
│           ├── CalendarView.tsx
│           ├── DailyTaskRow.tsx
│           ├── TaskStatusBadge.tsx
│           ├── ManagerCommentPanel.tsx
│           └── AddTaskModal.tsx
├── types/
│   └── todoTask.ts
└── data/
    └── mockTodoTask.ts
```

---

## CHANGELOG

| Date | Change |
|------|--------|
| 2026-01-01 | Initial specification created |
| 2026-01-01 | Added sections H (Location Dropdowns), I (Manager Comment Panel), J (Weekend Display), K (Add New Task) |
| 2026-01-01 | Implemented full UI: TypeScript types, mock data, all components (WeekHeader, OverallWeekPanel, LastWeekReviewPanel, FilterBar, CalendarView, ManagerCommentPanel) |
| 2026-01-01 | Added sidebar menu navigation: To-do Task menu item with route /tasks/todo |
| 2026-01-01 | Layout: Row 1 = Overview panels, Row 2 = Calendar + Manager Comments side by side |
| 2026-01-01 | UI: OverallWeekPanel - collapsible card with icon, vertical borders in table |
| 2026-01-01 | UI: LastWeekReviewPanel - same collapsible style, use stash_last-updates-solid.png icon |
| 2026-01-01 | UI: Sync expand/collapse state between OverallWeek and LastWeekReview panels |
| 2026-01-01 | UI: FilterBar User selector - added user icon (flowbite_user-solid.png) |
| 2026-01-01 | UI: FilterBar Status selector - added filter icon (flowbite_filter-outline.png) |
| 2026-01-01 | UI: FilterBar Type selector - added types icon (gridicons_types.png) |
