# To Do Task Screen Specification

---

# BASIC SPEC

## 1. Overview

- **Module**: WS (Task from HQ)
- **Screen ID**: SCR_TODO_TASK
- **Route**: `/tasks/todo`
- **Purpose**: Main screen showing task management overview with weekly progress, calendar view, and daily tasks
- **Target Users**: HQ (Headquarter) Staff

## 2. User Stories

| ID | As a... | I want to... | So that... |
|----|---------|--------------|------------|
| US-01 | HQ Staff | View weekly task overview | I can see the week's task summary |
| US-02 | HQ Staff | Review last week's tasks | I can track progress and bottlenecks |
| US-03 | HQ Staff | View daily tasks in calendar | I know what to do each day |
| US-04 | HQ Staff | Add new tasks | I can plan my work |
| US-05 | HQ Staff | Filter tasks by status/type | I can focus on specific tasks |
| US-06 | Manager | Add comments | I can provide feedback to staff |

## 3. Screen Components Summary

| Component | Description |
|-----------|-------------|
| Week Header | Week title, date range, "+ Add New" button |
| Overall Week Panel | Current week task summary table |
| Last Week Review Panel | Previous week review with progress/output |
| Filter Bar | User, Status, Type dropdowns |
| Calendar View | Weekly calendar with daily tasks |
| Manager Comment Panel | Right sidebar for manager comments |

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

## 5. Navigation

| Action | Destination |
|--------|-------------|
| Click Sidebar "To-do Task" | `/tasks/todo` |
| Click "+ Add New" | Open add task modal |
| Click week arrows | Navigate to previous/next week |
| Click task item | Open task detail modal |

## 6. API Endpoints Summary

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/todo/week/{weekNum}` | GET | Get tasks for a week |
| `/api/v1/todo/date/{date}` | GET | Get tasks by specific day |
| `/api/v1/todo` | POST | Create new task |
| `/api/v1/todo/{id}/status` | PATCH | Update task status |

## 7. Implementation Status

| Feature | Backend | Frontend | Notes |
|---------|---------|----------|-------|
| Todo Task Page | ⏳ Pending | ✅ Done | Mock data |
| Week Header | - | ✅ Done | UI only |
| Overall Week Panel | - | ✅ Done | Mock data |
| Last Week Review | - | ✅ Done | Mock data |
| Filter Bar | - | ✅ Done | Client-side |
| Calendar View | - | ✅ Done | Mock data |
| Manager Comment Panel | - | ✅ Done | Mock data |
| Responsive Design | - | ✅ Done | Mobile/Tablet/Desktop |
| API Integration | ⏳ Pending | ⏳ Pending | - |

---

# DETAIL SPEC

## 8. Week Header - Detail

| Component | Value | Notes |
|-----------|-------|-------|
| Week Title | "WEEK 51, 2025" | Font bold, large, black color |
| Date Range | "December 15- December 21" | Gray text, smaller, below title |
| Add New Button | "+ Add New" button | Filled button pink/red, bold text |

---

## 9. Overall Week Panel - Detail

### 9.1 Panel Header

| Component | Value | Notes |
|-----------|-------|-------|
| Icon | Calendar/checklist icon | Pink color |
| Title | "Overall Week 51" | Font bold |

### 9.2 Table Columns

| Column | Value | Notes |
|--------|-------|-------|
| W51 Task | Total tasks in week 51 | Header pink color/highlight |
| Means/Method | Method to complete task | Has tooltip icon (i) |
| Target | Target value | Example: "Typing..." (placeholder) |

### 9.3 Task Rows

| Task | Description |
|------|-------------|
| 1. Opening Store | Store opening tasks |
| 2. Plan for 2026 | Planning for next year 2026 |
| 3. Support Store | Store support tasks |

---

## 10. Last Week Review Panel - Detail

### 10.1 Panel Header

| Component | Value | Notes |
|-----------|-------|-------|
| Title | "Last Week Review" | Font bold, pink color |

### 10.2 Table Columns

| Column | Value | Notes |
|--------|-------|-------|
| W50 Task | Total tasks in week 50 | Header pink color/highlight |
| Progress/Bottleneck | Progress and bottleneck notes | Notes on bottleneck |
| Output | Output/result of task | Output of each task |

---

## 11. Filter Bar - Detail

| Component | Type | Description |
|-----------|------|-------------|
| All Users | Dropdown | Filter by user with user icon |
| All Statuses | Dropdown | Filter by status: All, In Progress, Done, Pending |
| All Types | Dropdown | Filter by type: All, Personal, Team, Store |

---

## 12. Calendar View - Detail

### 12.1 Calendar Header

| Component | Value | Notes |
|-----------|-------|-------|
| Calendar Icon | Checkmark icon | Pink color |
| Week Title | "Week 51, 2025" | Font bold |
| Navigation Arrows | Left/right arrows | Switch week previous/next |
| Placeholder | Area on right side | Can display mini calendar |

### 12.2 Daily Task Table

| Column | Value | Notes |
|--------|-------|-------|
| Date | Day of week | Format: "MON/15 Dec" (day + date) |
| Productivity | Task list for day | List tasks, numbered sequentially |
| Status | Completion status | Badge style: in progress (orange) |

### 12.3 Date Cell Format

| Component | Value | Notes |
|-----------|-------|-------|
| Day of Week | Day name (MON, TUE, WED...) | Text small, uppercase |
| Day Number | Day number (15, 16, 17...) | Font bold, large |
| Month | Month name (Dec) | Text small, same row with Day |

### 12.4 Productivity Cell Format

| Component | Value | Notes |
|-----------|-------|-------|
| Location Header | Work location | Example: "V917: Long Bien -> Ocean", font bold |
| Task List | Task list for the day | Numbered: 1, 2, 3... |
| Task Item | Task name | Example: "Survey competitor", "Check store" |

### 12.5 Location Dropdowns (Per Day Row)

| Field | Type | Description |
|-------|------|-------------|
| Location Header | Text | Format: "V917: [Region] -> [Zone]" |
| Region | Dropdown | Select region |
| Zone | Dropdown | Dependent on Region |
| Area | Dropdown | Dependent on Zone |
| Store | Dropdown | Dependent on Area |

---

## 13. Task Types - Detail

| Type | Icon | Description |
|------|------|-------------|
| Personal | Pink bullet | Personal individual tasks |
| Team | Cyan bullet | Team collaborative tasks |
| Store | Green bullet | Store-related tasks |

---

## 14. Status Types - Detail

| Status | Color | Hex Code | Description |
|--------|-------|----------|-------------|
| In Process | Yellow/Orange | #EDA600 | Task in progress |
| Done | Blue | #297EF6 | Task completed |
| Draft | Green | #1BBA5E | Draft status |
| Not Yet | Red | #F44336 | Not started yet |

### 14.1 Status Badge Styling

| Status | Border | Background | Dot Color |
|--------|--------|------------|-----------|
| In Process | #EDA600 | #EDA600 10% | #EDA600 |
| Done | #297EF6 | #E5F0FF | #297EF6 |
| Draft | #1BBA5E | #EBFFF3 | #1BBA5E |

---

## 15. Manager Comment Panel - Detail

| Component | Type | Description |
|-----------|------|-------------|
| Panel Title | Text | "Manager Comment" with pink underline |
| Comment Header | Icon + Title | Comment icon with "Manager Comment" |
| Comment Message | Card | Gray background box with avatar, author, time |
| Reply Input | Input | Input field with send button |
| Other Comment | Section | Secondary comment section with same styling |

### 15.1 Comment Styling

| Element | Style |
|---------|-------|
| Avatar background | #E5F0FF |
| Avatar text | #003E95 |
| Message background | #F4F4F4 |
| Message border-radius | 0px 10px 10px 10px |
| Reply border | #9B9B9B |
| Send icon color | #C5055B |

---

## 16. Weekend Display - Detail

| Day | Display |
|-----|---------|
| Saturday | "OFF" - no tasks displayed |
| Sunday | "OFF" - no tasks displayed |

---

## 17. Validation Rules

| Rule | Description |
|------|-------------|
| Task name required | Task name cannot be empty |
| Date required | Must select date for task |
| Type required | Must select task type |
| Week range valid | Week must be within valid range |
| Target optional | Target can be left empty |

---

## 18. API Endpoints - Detail

| Action | Method | Endpoint | Description |
|--------|--------|----------|-------------|
| Get Week Tasks | GET | /api/v1/todo/week/{weekNum} | Get tasks for a week |
| Get Daily Tasks | GET | /api/v1/todo/date/{date} | Get tasks by specific day |
| Get Week Overview | GET | /api/v1/todo/overview/week/{weekNum} | Get week overview summary |
| Get Last Week Review | GET | /api/v1/todo/review/week/{weekNum} | Get review from previous week |
| Create Task | POST | /api/v1/todo | Create new task |
| Update Task | PUT | /api/v1/todo/{id} | Update existing task |
| Delete Task | DELETE | /api/v1/todo/{id} | Delete task |
| Update Status | PATCH | /api/v1/todo/{id}/status | Update task status |

---

## 19. UI States - Detail

| State Type | State | Display |
|------------|-------|---------|
| Loading | Initial load | Skeleton loader on panels and calendar |
| Loading | Week change | Spinner when switching weeks |
| Empty | No tasks | "No tasks for this week" |
| Empty | No daily tasks | "No tasks for this day" |
| Error | Load failed | Error message with retry button |
| Success | Task added | Toast "Task added successfully" |
| Success | Status updated | Toast "Status updated" |
| Active | Current day | Highlight current day row |
| Editable | Target input | Input box with placeholder "Typing..." |

---

## 20. Responsive Design - Detail

| Breakpoint | Description |
|------------|-------------|
| Mobile (<768px) | Stacked layout, FAB for Add New, tab navigation |
| Tablet (768-1023px) | Sidebar overlay, adapted panels |
| Desktop (≥1024px) | Full layout with sidebar |

### 20.1 Mobile Specific Features

- WeekHeader: Stack vertical, centered text, hide Add button (use FAB)
- Panels: Card view with smaller icons and fonts
- FilterBar: Horizontal scroll with flex-shrink-0
- CalendarView: Vertical timeline layout with day cards
- ManagerCommentPanel: Tab navigation (Manager/Other)
- FAB: Floating Action Button for Add New, positioned bottom-right

---

## 21. Files Reference

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

## 22. Test Scenarios

### A. UI/UX Testing

| Test Case | Scenario | Expected |
|-----------|----------|----------|
| Layout check | Open To Do Task screen | Header, panels, calendar display correctly |
| Week display | View week info | Display week number and date range |
| Panel layout | View 2 panels Overview | 2 panels side by side, table inside |
| Calendar layout | View calendar view | Display all days in current week |
| Status colors | View status badges | Colors match status type |

### B. Functional Testing

| Test Case | Scenario | Expected |
|-----------|----------|----------|
| Add new task | Click "+ Add New" -> Save | Task appears in calendar |
| Filter by status | Select from dropdown | Only show tasks matching filter type |
| Filter by type | Click "Personal" filter | Only show tasks of that type |
| Navigate week | Click left/right arrows | Switch to previous/next week |
| Edit target | Click on Target -> Edit | Target updated successfully |
| Update status | Click on status badge | Dropdown appears, select new status |
| View task detail | Click on task in calendar | Modal displays task details |

---

## 23. Changelog

| Date | Change |
|------|--------|
| 2026-01-01 | Initial specification created |
| 2026-01-01 | Implemented full UI: all components |
| 2026-01-01 | Added sidebar menu navigation |
| 2026-01-01 | UI: OverallWeekPanel, LastWeekReviewPanel collapsible |
| 2026-01-01 | UI: FilterBar with icons |
| 2026-01-01 | UI: CalendarView with daily task rows |
| 2026-01-01 | UI: ManagerCommentPanel redesigned to match Figma |
| 2026-01-01 | UX: Sidebar accordion behavior |
| 2026-01-01 | UX: Navigation loading states |
| 2026-01-02 | Responsive: Mobile/Tablet/Desktop breakpoints |
| 2026-01-02 | Responsive: Sidebar overlay, bottom navigation, FAB |
| 2026-01-02 | Fix: Various UI fixes for responsive design |
| 2026-01-02 | Translated specification to English |
| 2026-01-06 | Restructured spec with Basic/Detail sections |
