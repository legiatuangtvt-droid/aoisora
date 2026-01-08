# To Do Task - Detail Specification

> **Module**: WS (Task from HQ)
> **Screen ID**: SCR_TODO_TASK
> **Route**: `/tasks/todo`
> **Last Updated**: 2026-01-08

---

## 1. Week Header - Detail

| Component | Value | Notes |
|-----------|-------|-------|
| Week Title | "WEEK 51, 2025" | Font bold, large, black color |
| Date Range | "December 15- December 21" | Gray text, smaller, below title |
| Add New Button | "+ Add New" button | Filled button pink/red, bold text |

---

## 2. Overall Week Panel - Detail

### 2.1 Panel Header

| Component | Value | Notes |
|-----------|-------|-------|
| Icon | Calendar/checklist icon | Pink color |
| Title | "Overall Week 51" | Font bold |

### 2.2 Table Columns

| Column | Value | Notes |
|--------|-------|-------|
| W51 Task | Total tasks in week 51 | Header pink color/highlight |
| Means/Method | Method to complete task | Has tooltip icon (i) |
| Target | Target value | Example: "Typing..." (placeholder) |

---

## 3. Last Week Review Panel - Detail

### 3.1 Panel Header

| Component | Value | Notes |
|-----------|-------|-------|
| Title | "Last Week Review" | Font bold, pink color |

### 3.2 Table Columns

| Column | Value | Notes |
|--------|-------|-------|
| W50 Task | Total tasks in week 50 | Header pink color/highlight |
| Progress/Bottleneck | Progress and bottleneck notes | Notes on bottleneck |
| Output | Output/result of task | Output of each task |

---

## 4. Filter Bar - Detail

| Component | Type | Description |
|-----------|------|-------------|
| All Users | Dropdown | Filter by user with user icon |
| All Statuses | Dropdown | Filter by status: All, In Progress, Done, Pending |
| All Types | Dropdown | Filter by type: All, Personal, Team, Store |

---

## 5. Calendar View - Detail

### 5.1 Calendar Header

| Component | Value | Notes |
|-----------|-------|-------|
| Calendar Icon | Checkmark icon | Pink color |
| Week Title | "Week 51, 2025" | Font bold |
| Navigation Arrows | Left/right arrows | Switch week previous/next |

### 5.2 Daily Task Table

| Column | Value | Notes |
|--------|-------|-------|
| Date | Day of week | Format: "MON/15 Dec" (day + date) |
| Productivity | Task list for day | List tasks, numbered sequentially |
| Status | Completion status | Badge style: in progress (orange) |

### 5.3 Date Cell Format

| Component | Value | Notes |
|-----------|-------|-------|
| Day of Week | Day name (MON, TUE, WED...) | Text small, uppercase |
| Day Number | Day number (15, 16, 17...) | Font bold, large |
| Month | Month name (Dec) | Text small, same row with Day |

### 5.4 Productivity Cell Format

| Component | Value | Notes |
|-----------|-------|-------|
| Location Header | Work location | Example: "V917: Long Bien -> Ocean", font bold |
| Task List | Task list for the day | Numbered: 1, 2, 3... |
| Task Item | Task name | Example: "Survey competitor", "Check store" |

### 5.5 Location Dropdowns (Per Day Row)

| Field | Type | Description |
|-------|------|-------------|
| Location Header | Text | Format: "V917: [Region] -> [Zone]" |
| Region | Dropdown | Select region |
| Zone | Dropdown | Dependent on Region |
| Area | Dropdown | Dependent on Zone |
| Store | Dropdown | Dependent on Area |

---

## 6. Status Badge Styling - Detail

| Status | Border | Background | Dot Color |
|--------|--------|------------|-----------|
| In Process | #EDA600 | #EDA600 10% | #EDA600 |
| Done | #297EF6 | #E5F0FF | #297EF6 |
| Draft | #1BBA5E | #EBFFF3 | #1BBA5E |
| Not Yet | #F44336 | - | #F44336 |

---

## 7. Manager Comment Panel - Detail

| Component | Type | Description |
|-----------|------|-------------|
| Panel Title | Text | "Manager Comment" with pink underline |
| Comment Header | Icon + Title | Comment icon with "Manager Comment" |
| Comment Message | Card | Gray background box with avatar, author, time |
| Reply Input | Input | Input field with send button |

### 7.1 Comment Styling

| Element | Style |
|---------|-------|
| Avatar background | #E5F0FF |
| Avatar text | #003E95 |
| Message background | #F4F4F4 |
| Message border-radius | 0px 10px 10px 10px |
| Reply border | #9B9B9B |
| Send icon color | #C5055B |

---

## 8. Weekend Display - Detail

| Day | Display |
|-----|---------|
| Saturday | "OFF" - no tasks displayed |
| Sunday | "OFF" - no tasks displayed |

---

## 9. API Endpoints - Detail

### 9.1 Get Week Tasks

```yaml
get:
  tags:
    - WS-TodoTask
  summary: "Get Week Tasks API"
  description: |
    # Business Logic
      ## 1. Get Tasks for Week
        ### Search Conditions
          - EXTRACT(WEEK FROM todo_tasks.date) = weekNum
          - todo_tasks.user_id = authenticated_user
          - IF user filter → todo_tasks.user_id IN (filter)
          - IF status filter → todo_tasks.status IN (filter)
          - IF type filter → todo_tasks.type IN (filter)

        ### Order By
          - todo_tasks.date ASC

      ## 2. Group by Date
        - Group tasks by day for calendar display

  operationId: getWeekTasks
  parameters:
    - name: weekNum
      in: path
      required: true
      schema:
        type: integer

    - name: year
      in: query
      schema:
        type: integer
        default: 2025

    - name: user
      in: query
      schema:
        type: integer

    - name: status
      in: query
      schema:
        type: string
        enum: [in_progress, done, draft, not_yet]

    - name: type
      in: query
      schema:
        type: string
        enum: [personal, team, store]

  responses:
    200:
      description: OK
```

### 9.2 Get Week Overview

```yaml
get:
  tags:
    - WS-TodoTask
  summary: "Get Week Overview API"

  operationId: getWeekOverview
  parameters:
    - name: weekNum
      in: path
      required: true
      schema:
        type: integer

  responses:
    200:
      description: OK
```

### 9.3 Get Last Week Review

```yaml
get:
  tags:
    - WS-TodoTask
  summary: "Get Last Week Review API"

  operationId: getLastWeekReview
  parameters:
    - name: weekNum
      in: path
      required: true
      schema:
        type: integer

  responses:
    200:
      description: OK
```

### 9.4 Create Task

```yaml
post:
  tags:
    - WS-TodoTask
  summary: "Create Todo Task API"

  operationId: createTodoTask
  requestBody:
    required: true
    content:
      application/json:
        schema:
          $ref: "#/components/schemas/CreateTodoTaskRequest"

  responses:
    201:
      description: Created
    400:
      description: Bad Request
```

### 9.5 Update Task Status

```yaml
patch:
  tags:
    - WS-TodoTask
  summary: "Update Task Status API"

  operationId: updateTodoTaskStatus
  parameters:
    - name: id
      in: path
      required: true
      schema:
        type: integer

  requestBody:
    required: true
    content:
      application/json:
        schema:
          type: object
          properties:
            status:
              type: string
              enum: [in_progress, done, draft, not_yet]

  responses:
    200:
      description: OK
    404:
      description: Task Not Found
```

---

## 10. Schema Definitions

```yaml
components:
  schemas:
    CreateTodoTaskRequest:
      type: object
      required:
        - name
        - date
      properties:
        name:
          type: string
          maxLength: 255
        date:
          type: string
          format: date
        type:
          type: string
          enum: [personal, team, store]
          default: personal
        location:
          type: object
          properties:
            region:
              type: string
            zone:
              type: string
            area:
              type: string
            store:
              type: string
        means:
          type: string
        target:
          type: string

    TodoTaskResponse:
      type: object
      properties:
        id:
          type: integer
        name:
          type: string
        date:
          type: string
          format: date
        type:
          type: string
          enum: [personal, team, store]
        status:
          type: string
          enum: [in_progress, done, draft, not_yet]
        location:
          type: string

    WeekTasksResponse:
      type: object
      properties:
        weekNumber:
          type: integer
        year:
          type: integer
        dateRange:
          type: string
        days:
          type: array
          items:
            type: object
            properties:
              date:
                type: string
                format: date
              dayOfWeek:
                type: string
              isOff:
                type: boolean
              tasks:
                type: array
                items:
                  $ref: "#/components/schemas/TodoTaskResponse"
```

---

## 11. UI States - Detail

| State Type | State | Display |
|------------|-------|---------|
| Loading | Initial load | Skeleton loader on panels and calendar |
| Loading | Week change | Spinner when switching weeks |
| Empty | No tasks | "No tasks for this week" |
| Error | Load failed | Error message with retry button |
| Success | Task added | Toast "Task added successfully" |
| Active | Current day | Highlight current day row |

---

## 12. Responsive Design - Detail

| Breakpoint | Description |
|------------|-------------|
| Mobile (<768px) | Stacked layout, FAB for Add New, tab navigation |
| Tablet (768-1023px) | Sidebar overlay, adapted panels |
| Desktop (≥1024px) | Full layout with sidebar |

### 12.1 Mobile Specific Features

- WeekHeader: Stack vertical, centered text, hide Add button (use FAB)
- Panels: Card view with smaller icons and fonts
- FilterBar: Horizontal scroll with flex-shrink-0
- CalendarView: Vertical timeline layout with day cards
- ManagerCommentPanel: Tab navigation (Manager/Other)
- FAB: Floating Action Button for Add New, positioned bottom-right

---

## 13. Files Reference

```
frontend/src/
├── app/tasks/todo/
│   └── page.tsx
├── components/tasks/todo/
│   ├── TodoTaskPage.tsx
│   ├── WeekHeader.tsx
│   ├── OverallWeekPanel.tsx
│   ├── LastWeekReviewPanel.tsx
│   ├── FilterBar.tsx
│   ├── CalendarView.tsx
│   ├── DailyTaskRow.tsx
│   ├── TaskStatusBadge.tsx
│   ├── ManagerCommentPanel.tsx
│   └── AddTaskModal.tsx
├── types/
│   └── todoTask.ts
└── data/
    └── mockTodoTask.ts
```

---

## 14. Changelog

| Date | Change |
|------|--------|
| 2026-01-01 | Initial specification created |
| 2026-01-01 | Implemented full UI: all components |
| 2026-01-01 | Added sidebar menu navigation |
| 2026-01-01 | UI: Panels collapsible |
| 2026-01-01 | UI: FilterBar with icons |
| 2026-01-01 | UI: CalendarView with daily task rows |
| 2026-01-01 | UI: ManagerCommentPanel redesigned to match Figma |
| 2026-01-01 | UX: Sidebar accordion behavior |
| 2026-01-02 | Responsive: Mobile/Tablet/Desktop breakpoints |
| 2026-01-02 | Translated specification to English |
| 2026-01-06 | Restructured spec with Basic/Detail sections |
| 2026-01-08 | Split spec into basic and detail files |
