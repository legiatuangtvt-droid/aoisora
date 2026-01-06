# Task Library Screen Specification

---

# BASIC SPEC

## 1. Overview

- **Module**: WS (Task from HQ)
- **Screen ID**: SCR_TASK_LIBRARY
- **Route**: `/tasks/library`
- **Purpose**: Manage and organize common task templates for recurring office and store operations
- **Target Users**: HQ (Headquarter) Staff

## 2. User Stories

| ID | As a... | I want to... | So that... |
|----|---------|--------------|------------|
| US-01 | HQ Staff | View all task templates | I can see available templates for task creation |
| US-02 | HQ Staff | Filter tasks by Office/Store tab | I can focus on relevant task types |
| US-03 | HQ Staff | Filter tasks by department | I can find department-specific templates |
| US-04 | HQ Staff | Search task templates | I can quickly find specific tasks |
| US-05 | HQ Staff | Create new task template | I can add reusable task templates |
| US-06 | HQ Staff | Edit/Delete/Duplicate templates | I can manage existing templates |

## 3. Screen Components Summary

| Component | Description |
|-----------|-------------|
| Header | Title "TASK LIBRARY" with "+ Create New" button |
| Tab Navigation | OFFICE TASKS / STORE TASKS tabs |
| Department Filter Chips | Quick filter by Admin, HR, Legal, etc. |
| Search Bar | Text search with filter button |
| Task Group Sections | Expandable department groups with task tables |

## 4. Screen Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│ TASK LIBRARY                                      [+ Create New]    │
│ Manage and organize recurring tasks for office and store operations │
├─────────────────────────────────────────────────────────────────────┤
│ [OFFICE TASKS]  [STORE TASKS]                                       │
├─────────────────────────────────────────────────────────────────────┤
│ [Admin] [HR] [Legal]           [Search...] [Filter]                 │
├─────────────────────────────────────────────────────────────────────┤
│ ▼ ADMIN TASKS                              [3 GROUP TASKS]          │
│ ┌───────────────────────────────────────────────────────────────┐   │
│ │ No │ Type │ Task Name │ Owner │ Last Update │ Status │ Usage │   │
│ │ 1  │ Daily│ Opening...│ Thu OP│ 25 Dec, 25  │In prog │  565  │   │
│ │ 2  │ Weekly│ Check SS │Nguyen │ 23 Dec, 25  │ Draft  │   52  │   │
│ └───────────────────────────────────────────────────────────────┘   │
│ ▶ HR TASKS                                 [2 GROUP TASKS]          │
└─────────────────────────────────────────────────────────────────────┘
```

## 5. Navigation

| Action | Destination |
|--------|-------------|
| Click Sidebar "Task Library" | `/tasks/library` |
| Click "+ Create New" | Open create task form |
| Click Task Row | Open task detail/edit form |
| Click Edit menu | Edit task template |
| Click Duplicate menu | Create copy of task |

## 6. API Endpoints Summary

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/task-library` | GET | Get task template list |
| `/api/v1/task-library/{id}` | GET | Get task template detail |
| `/api/v1/task-library` | POST | Create new task template |
| `/api/v1/task-library/{id}` | PUT/DELETE | Update/Delete template |

## 7. Implementation Status

| Feature | Backend | Frontend | Notes |
|---------|---------|----------|-------|
| Task Library Page | ⏳ Pending | ✅ Done | Mock data |
| Tab Navigation | - | ✅ Done | Frontend only |
| Department Filter Chips | - | ✅ Done | Frontend only |
| Search | ⏳ Pending | ✅ Done | Client-side |
| Task Group Table | ⏳ Pending | ✅ Done | Mock data |
| CRUD Operations | ⏳ Pending | ⏳ Pending | - |

---

# DETAIL SPEC

## 8. Header Section - Detail

### 8.1 Components

| Component | Description | Notes |
|-----------|-------------|-------|
| Page Title | "TASK LIBRARY" | Font 16m, bold, black color |
| Subtitle | "Manage and organize recurring tasks for office and store operations." | Gray text |
| Create New Button | "+ Create New" | Filled button, pink/red color, right corner |

---

## 9. Tab Navigation - Detail

### 9.1 Tabs

| Tab | Icon | Description |
|-----|------|-------------|
| OFFICE TASKS | Building icon | Tasks for office staff (HQ) |
| STORE TASKS | Store icon | Tasks for store staff |

### 9.2 Tab Styling

- Active tab: Pink underline and pink text
- Inactive tab: Gray text, no underline

---

## 10. Department Filter Chips - Detail

### 10.1 Available Chips

| Chip | Icon | Description |
|------|------|-------------|
| Admin | Person/admin icon | Filter Admin department tasks |
| HR | People icon | Filter HR department tasks |
| Legal | - | Filter Legal department tasks |

### 10.2 Chip Behavior

- Active chip: Light pink background, pink color
- Multiple chips can be selected simultaneously
- Click to toggle selection

---

## 11. Search & Filter Bar - Detail

| Component | Type | Description |
|-----------|------|-------------|
| Search Input | Text input | Placeholder: "Search in task library..." |
| Search Icon | Magnifying glass icon | Left side of input |
| Filter Button | Button | "Filter" button with funnel icon, right corner |

---

## 12. Task Group Section - Detail

### 12.1 Task Group Header

| Component | Description | Notes |
|-----------|-------------|-------|
| Department Icon | Department icon | Color by department |
| Department Name | Department name + "TASKS" | e.g., "ADMIN TASKS", Bold font |
| Group Tasks Count | Number of group tasks | Badge "X GROUP TASKS" right corner |
| Expand/Collapse Icon | Arrow icon (V/A) | Right corner, click to toggle |

### 12.2 Task Data Table Columns

| Column | Description | Sortable | Notes |
|--------|-------------|----------|-------|
| No | Sequential number | No | Incrementing numbers |
| Type | Task type (Daily, Weekly, Ad hoc) | Yes | With sort icon (^) |
| Task Name | Task name | Yes | e.g., "Opening Store" |
| Owner | Task owner/creator | No | Avatar + Name |
| Last Update | Last update date | No | Format: DD MMM, YY |
| Status | Status | No | Color badge |
| Usage | Usage count | No | e.g., 565, 52, 1 |
| Menu | Action menu | No | 3-dot icon |

---

## 13. Task Types - Detail

| Type | Description | Example |
|------|-------------|---------|
| Daily | Daily recurring tasks | Opening Store, Closing Store |
| Weekly | Weekly recurring tasks | Check SS, Weekly Report |
| Ad hoc | One-time tasks | Report competitor, Special tasks |

---

## 14. Status Types - Detail

| Status | Color | Hex Code | Description |
|--------|-------|----------|-------------|
| In progress | Yellow/Orange | #FFC107 | Task is being used |
| Draft | Blue | #E91E63 | Task in draft status |
| Available | Green | #4CAF50 | Task is ready |

---

## 15. Row Actions Menu - Detail

| Action | Icon | Description |
|--------|------|-------------|
| Edit | Pencil icon | Edit task template |
| Duplicate | Copy icon | Create copy of task template |
| Delete | Trash icon | Delete task template |
| View Usage | Chart icon | View usage statistics |

---

## 16. Department Colors - Detail

| Department | Icon | Color |
|------------|------|-------|
| ADMIN TASKS | Person/admin icon | Pink (#E91E63) |
| HR | People icon | Purple (#9C27B0) |
| Create New group | Green (#4CAF50) | Green (#4CAF50) |

---

## 17. Validation Rules

| Rule | Description |
|------|-------------|
| Task name required | Task name cannot be empty |
| Task name unique | Task name must be unique within same department |
| Type required | Must select task type (Daily/Weekly/Ad hoc) |
| Owner required | Must have task owner |
| Department required | Task must belong to a department |
| Search min length | Search requires minimum 2 characters |

---

## 18. API Endpoints - Detail

| Action | Method | Endpoint | Description |
|--------|--------|----------|-------------|
| Get Task Library | GET | /api/v1/task-library | Get task template list |
| Get by Department | GET | /api/v1/task-library?dept={id} | Get tasks by department |
| Get Task Detail | GET | /api/v1/task-library/{id} | Get task template detail |
| Create Task | POST | /api/v1/task-library | Create new task template |
| Update Task | PUT | /api/v1/task-library/{id} | Update task template |
| Delete Task | DELETE | /api/v1/task-library/{id} | Delete task template |
| Duplicate Task | POST | /api/v1/task-library/{id}/duplicate | Create task copy |
| Search Tasks | GET | /api/v1/task-library/search?q={query} | Search tasks |
| Get Usage Stats | GET | /api/v1/task-library/{id}/stats | Get usage statistics |

### 18.1 Get Task Library

```yaml
get:
  tags:
    - WS-TaskLibrary
  summary: "Get Task Library API"
  description: |
    # Business Logic
      ## 1. Get Task Templates
        ### Select Columns
          - task_templates.id, task_templates.name
          - task_templates.type, task_templates.status
          - task_templates.usage_count
          - task_templates.updated_at
          - owner.full_name as owner_name
          - departments.name as department_name

        ### Join Conditions
          - LEFT JOIN staff owner ON task_templates.owner_id
          - LEFT JOIN departments ON task_templates.department_id

        ### Search Conditions
          - IF tab = 'office' → task_templates.scope = 'office'
          - IF tab = 'store' → task_templates.scope = 'store'
          - IF dept → task_templates.department_id IN (dept)

        ### Group By
          - departments.id (for grouping display)

        ### Order By
          - departments.display_order ASC
          - task_templates.id ASC

      ## 2. Response
        - Return grouped task templates

  operationId: getTaskLibrary
  parameters:
    - name: tab
      in: query
      required: false
      schema:
        type: string
        enum: [office, store]
        default: office

    - name: dept
      in: query
      required: false
      schema:
        type: array
        items:
          type: integer
      description: Filter by department IDs

    - name: search
      in: query
      required: false
      schema:
        type: string
        minLength: 2

  responses:
    200:
      description: OK
      content:
        application/json:
          example:
            data:
              groups:
                - departmentId: 1
                  departmentName: "ADMIN"
                  taskCount: 3
                  tasks:
                    - id: 1
                      type: "Daily"
                      taskName: "Opening Store"
                      owner: "Thu OP"
                      lastUpdate: "2025-12-25"
                      status: "In progress"
                      usage: 565
                    - id: 2
                      type: "Weekly"
                      taskName: "Check SS"
                      owner: "Nguyen"
                      lastUpdate: "2025-12-23"
                      status: "Draft"
                      usage: 52
                - departmentId: 2
                  departmentName: "HR"
                  taskCount: 2
                  tasks: []
```

### 18.2 Get Task Detail

```yaml
get:
  tags:
    - WS-TaskLibrary
  summary: "Get Task Template Detail API"
  description: |
    # Business Logic
      ## 1. Get Template
        ### Select Columns
          - All task_templates fields
          - owner info
          - department info

      ## 2. Response
        - Return full template detail

  operationId: getTaskTemplateDetail
  parameters:
    - name: id
      in: path
      required: true
      schema:
        type: integer

  responses:
    200:
      description: OK
      content:
        application/json:
          example:
            data:
              id: 1
              name: "Opening Store"
              type: "Daily"
              scope: "store"
              department:
                id: 1
                name: "ADMIN"
              owner:
                id: 10
                name: "Thu OP"
              status: "In progress"
              usageCount: 565
              createdAt: "2025-01-01"
              updatedAt: "2025-12-25"
              description: "Daily store opening checklist"
              checklist:
                - "Unlock doors"
                - "Turn on lights"
                - "Check inventory"

    404:
      description: Template Not Found
```

### 18.3 Create Task Template

```yaml
post:
  tags:
    - WS-TaskLibrary
  summary: "Create Task Template API"
  description: |
    # Correlation Check
      - name: Must be unique within department
      - department_id: Must exist

    # Business Logic
      ## 1. Validate Input
        - Check name unique in department
        - Check department exists

      ## 2. Create Template
        - Insert into task_templates
        - Set owner_id = authenticated_user
        - Set status = 'Draft'

      ## 3. Response
        - Return created template

  operationId: createTaskTemplate
  requestBody:
    required: true
    content:
      application/json:
        schema:
          $ref: "#/components/schemas/CreateTaskTemplateRequest"
        example:
          name: "New Task Template"
          type: "Weekly"
          scope: "office"
          department_id: 1
          description: "Weekly review task"
          checklist:
            - "Review reports"
            - "Update metrics"

  responses:
    201:
      description: Created
      content:
        application/json:
          example:
            success: true
            data:
              id: 100
              name: "New Task Template"
              status: "Draft"
            message: "Task template created successfully"

    400:
      description: Bad Request
```

### 18.4 Update Task Template

```yaml
put:
  tags:
    - WS-TaskLibrary
  summary: "Update Task Template API"
  description: |
    # Correlation Check
      - id: Must exist
      - name: Must be unique (excluding current)

    # Business Logic
      ## 1. Find Template
        - If not found → Return 404

      ## 2. Update Template
        - Update task_templates record

      ## 3. Response
        - Return updated template

  operationId: updateTaskTemplate
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
          $ref: "#/components/schemas/CreateTaskTemplateRequest"

  responses:
    200:
      description: OK

    404:
      description: Template Not Found
```

### 18.5 Delete Task Template

```yaml
delete:
  tags:
    - WS-TaskLibrary
  summary: "Delete Task Template API"
  description: |
    # Correlation Check
      - id: Must exist

    # Business Logic
      ## 1. Find Template
        - If not found → Return 404

      ## 2. Delete Template
        - Soft delete or hard delete

      ## 3. Response
        - Return success

  operationId: deleteTaskTemplate
  parameters:
    - name: id
      in: path
      required: true
      schema:
        type: integer

  responses:
    200:
      description: OK
      content:
        application/json:
          example:
            success: true
            message: "Task template deleted"

    404:
      description: Template Not Found
```

### 18.6 Duplicate Task Template

```yaml
post:
  tags:
    - WS-TaskLibrary
  summary: "Duplicate Task Template API"
  description: |
    # Business Logic
      ## 1. Find Original Template
        - If not found → Return 404

      ## 2. Create Copy
        - Copy all fields
        - Append "(Copy)" to name
        - Set status = 'Draft'
        - Set usage_count = 0

      ## 3. Response
        - Return new template

  operationId: duplicateTaskTemplate
  parameters:
    - name: id
      in: path
      required: true
      schema:
        type: integer

  responses:
    201:
      description: Created
      content:
        application/json:
          example:
            success: true
            data:
              id: 101
              name: "Opening Store (Copy)"
              status: "Draft"
            message: "Task template duplicated"
```

### 18.7 Search Tasks

```yaml
get:
  tags:
    - WS-TaskLibrary
  summary: "Search Task Templates API"
  description: |
    # Business Logic
      ## 1. Search
        ### Search Conditions
          - task_templates.name ILIKE '%' || query || '%'
          - OR task_templates.description ILIKE '%' || query || '%'

      ## 2. Response
        - Return matching templates

  operationId: searchTaskTemplates
  parameters:
    - name: q
      in: query
      required: true
      schema:
        type: string
        minLength: 2

  responses:
    200:
      description: OK
      content:
        application/json:
          example:
            data:
              - id: 1
                name: "Opening Store"
                department: "ADMIN"
                type: "Daily"
```

### 18.8 Schema Definitions

```yaml
components:
  schemas:
    CreateTaskTemplateRequest:
      type: object
      required:
        - name
        - type
        - department_id
      properties:
        name:
          type: string
          maxLength: 255
        type:
          type: string
          enum: [Daily, Weekly, Ad hoc]
        scope:
          type: string
          enum: [office, store]
        department_id:
          type: integer
        description:
          type: string
        checklist:
          type: array
          items:
            type: string

    TaskTemplateResponse:
      type: object
      properties:
        id:
          type: integer
        name:
          type: string
        type:
          type: string
        scope:
          type: string
        department:
          type: object
          properties:
            id:
              type: integer
            name:
              type: string
        owner:
          type: object
          properties:
            id:
              type: integer
            name:
              type: string
        status:
          type: string
          enum: [Draft, In progress, Available]
        usageCount:
          type: integer
        createdAt:
          type: string
          format: date
        updatedAt:
          type: string
          format: date
```

---

## 19. UI States - Detail

| State Type | State | Display |
|------------|-------|---------|
| Loading | Initial load | Skeleton loader for table |
| Loading | Searching | Spinner in search input |
| Loading | Deleting | Spinner on row being deleted |
| Empty | No tasks | "No tasks found in this department" |
| Empty | Search no results | "No matching tasks found" |
| Error | Load failed | Error message with retry button |
| Error | Delete failed | Toast error message |
| Success | Task created | Toast "Task template created successfully" |
| Success | Task deleted | Toast "Task template deleted" |
| Active | Tab selected | Tab has pink underline |
| Active | Chip selected | Chip has light pink background |
| Expanded | Group open | Arrow icon rotates up (A) |
| Collapsed | Group closed | Arrow icon rotates down (V) |

---

## 20. Files Reference

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

## 21. Test Scenarios

### A. UI/UX Testing

| Test Case | Scenario | Expected |
|-----------|----------|----------|
| Layout check | Open Task Library screen | Header, tabs, filter, table display correctly |
| Tab switch | Click tab STORE TASKS | Content changes, underline moves |
| Chip filter | Click chip "Admin" | Chip active, table filters by Admin |
| Expand/Collapse | Click on group header | Toggle show/hide table |
| Status colors | View status badges | Colors correct: yellow, blue, green |
| Sort columns | Click on header Type, Task Name | Table sorts by column |

### B. Functional Testing

| Test Case | Scenario | Expected |
|-----------|----------|----------|
| Search task | Enter "Opening" in search | Results filter to tasks containing "Opening" |
| Search no result | Enter text not found | Display "No matching tasks found" |
| Create task | Click "+ Create New Document" | Navigate to create new form |
| Edit task | Click menu -> Edit | Open edit task template form |
| Delete task | Click menu -> Delete -> Confirm | Task deleted, success toast |
| Duplicate task | Click menu -> Duplicate | New task created with name "(Copy)" |
| Filter by chip | Click chip Admin | Only show Admin tasks |
| Multi-chip filter | Click chip Admin + HR | Table shows tasks from both Admin and HR |

---

## 22. Changelog

| Date | Change |
|------|--------|
| 2026-01-02 | Initial specification created |
| 2026-01-02 | Implemented UI: route /tasks/library, all components created, sidebar menu highlight fix |
| 2026-01-02 | Translated specification to English |
| 2026-01-06 | Restructured spec with Basic/Detail sections |
