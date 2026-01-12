# Task Library - Detail Specification

> **Module**: WS (Task from HQ)
> **Screen ID**: SCR_TASK_LIBRARY
> **Route**: `/tasks/library`
> **Last Updated**: 2026-01-08

---

## 1. Header Section - Detail

| Component | Description | Notes |
|-----------|-------------|-------|
| Page Title | "TASK LIBRARY" | Font 16m, bold, black color |
| Subtitle | "Manage and organize recurring tasks for office and store operations." | Gray text |
| Create New Button | "+ Create New" | Filled button, pink/red color, right corner |

---

## 2. Tab Navigation - Detail

### 2.1 Tabs

| Tab | Icon | Description |
|-----|------|-------------|
| OFFICE TASKS | Building icon | Tasks for office staff (HQ) |
| STORE TASKS | Store icon | Tasks for store staff |

### 2.2 Tab Styling

- Active tab: Pink underline and pink text
- Inactive tab: Gray text, no underline

---

## 3. Department Filter Chips - Detail

### 3.1 Available Chips

| Chip | Icon | Description |
|------|------|-------------|
| Admin | Person/admin icon | Filter Admin department tasks |
| HR | People icon | Filter HR department tasks |
| Legal | - | Filter Legal department tasks |

### 3.2 Chip Behavior

- Active chip: Light pink background, pink color
- Multiple chips can be selected simultaneously
- Click to toggle selection

---

## 4. Search & Filter Bar - Detail

| Component | Type | Description |
|-----------|------|-------------|
| Search Input | Text input | Placeholder: "Search in task library..." |
| Search Icon | Magnifying glass icon | Left side of input |
| Filter Button | Button | "Filter" button with funnel icon, right corner |

---

## 5. Task Group Section - Detail

### 5.1 Task Group Header

| Component | Description | Notes |
|-----------|-------------|-------|
| Department Icon | Department icon | Color by department |
| Department Name | Department name + "TASKS" | e.g., "ADMIN TASKS", Bold font |
| Group Tasks Count | Number of group tasks | Badge "X GROUP TASKS" right corner |
| Expand/Collapse Icon | Arrow icon (V/A) | Right corner, click to toggle |

### 5.2 Task Data Table Columns

| Column | Description | Sortable | Notes |
|--------|-------------|----------|-------|
| No | Sequential number | No | Incrementing numbers |
| Type | Task type (Daily, Weekly, Ad hoc) | Yes | With sort icon |
| Task Name | Task name | Yes | e.g., "Opening Store" |
| Owner | Task owner/creator | No | Avatar + Name |
| Last Update | Last update date | No | Format: DD MMM, YY |
| Status | Status | No | Color badge |
| Usage | Usage count | No | e.g., 565, 52 |
| Menu | Action menu | No | 3-dot icon |

---

## 6. Status Types - Detail

| Status | Color | Hex Code | Description |
|--------|-------|----------|-------------|
| In progress | Yellow/Orange | #FFC107 | Task is being used |
| Draft | Blue | #E91E63 | Task in draft status |
| Available | Green | #4CAF50 | Task is ready |

---

## 7. Row Actions Menu - Detail

| Action | Icon | Description |
|--------|------|-------------|
| Edit | Pencil icon | Edit task template |
| Duplicate | Copy icon | Create copy of task template |
| Delete | Trash icon | Delete task template |
| View Usage | Chart icon | View usage statistics |

---

## 8. Department Colors - Detail

| Department | Icon | Color |
|------------|------|-------|
| ADMIN TASKS | Person/admin icon | Pink (#E91E63) |
| HR | People icon | Purple (#9C27B0) |
| Create New group | - | Green (#4CAF50) |

---

## 9. Validation Rules

| Rule | Description |
|------|-------------|
| Task name required | Task name cannot be empty |
| Task name unique | Task name must be unique within same department |
| Type required | Must select task type (Daily/Weekly/Ad hoc) |
| Owner required | Must have task owner |
| Department required | Task must belong to a department |
| Search min length | Search requires minimum 2 characters |

---

## 10. API Endpoints - Detail

### 10.1 Get Task Library

```yaml
get:
  tags:
    - WS-TaskLibrary
  summary: "Get Task Library API"
  description: |
    # Business Logic
      ## 1. Get Task Templates
        ### Select Columns
          - task_templates.id, name, type, status, usage_count, updated_at
          - owner.full_name as owner_name
          - departments.name as department_name

        ### Search Conditions
          - IF tab = 'office' → task_templates.scope = 'office'
          - IF tab = 'store' → task_templates.scope = 'store'
          - IF dept → task_templates.department_id IN (dept)

        ### Group By
          - departments.id

        ### Order By
          - departments.display_order ASC

      ## 2. Response
        - Return grouped task templates

  operationId: getTaskLibrary
  parameters:
    - name: tab
      in: query
      schema:
        type: string
        enum: [office, store]
        default: office

    - name: dept
      in: query
      schema:
        type: array
        items:
          type: integer

    - name: search
      in: query
      schema:
        type: string
        minLength: 2

  responses:
    200:
      description: OK
```

### 10.2 Create Task Template

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
      - Set owner_id = authenticated_user
      - Set status = 'Draft'

  operationId: createTaskTemplate
  requestBody:
    required: true
    content:
      application/json:
        schema:
          $ref: "#/components/schemas/CreateTaskTemplateRequest"

  responses:
    201:
      description: Created
    400:
      description: Bad Request
```

### 10.3 Update Task Template

```yaml
put:
  tags:
    - WS-TaskLibrary
  summary: "Update Task Template API"

  operationId: updateTaskTemplate
  parameters:
    - name: id
      in: path
      required: true
      schema:
        type: integer

  responses:
    200:
      description: OK
    404:
      description: Template Not Found
```

### 10.4 Delete Task Template

```yaml
delete:
  tags:
    - WS-TaskLibrary
  summary: "Delete Task Template API"

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
    404:
      description: Template Not Found
```

### 10.5 Duplicate Task Template

```yaml
post:
  tags:
    - WS-TaskLibrary
  summary: "Duplicate Task Template API"
  description: |
    - Copy all fields
    - Append "(Copy)" to name
    - Set status = 'Draft'
    - Set usage_count = 0

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
```

---

## 11. Schema Definitions

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
        owner:
          type: object
        status:
          type: string
          enum: [Draft, In progress, Available]
        usageCount:
          type: integer
```

---

## 12. UI States - Detail

| State Type | State | Display |
|------------|-------|---------|
| Loading | Initial load | Skeleton loader for table |
| Loading | Searching | Spinner in search input |
| Empty | No tasks | "No tasks found in this department" |
| Empty | Search no results | "No matching tasks found" |
| Error | Load failed | Error message with retry button |
| Success | Task created | Toast "Task template created successfully" |
| Success | Task deleted | Toast "Task template deleted" |
| Active | Tab selected | Tab has pink underline |
| Active | Chip selected | Chip has light pink background |
| Expanded | Group open | Arrow icon rotates up |
| Collapsed | Group closed | Arrow icon rotates down |

---

## 13. Files Reference

```
frontend/src/
├── app/tasks/library/
│   └── page.tsx
├── components/library/
│   ├── index.ts
│   ├── TaskLibraryHeader.tsx
│   ├── TaskLibraryTabs.tsx
│   ├── DepartmentFilterChips.tsx
│   ├── TaskSearchBar.tsx
│   ├── TaskGroupSection.tsx
│   ├── TaskDataTable.tsx
│   ├── TaskStatusBadge.tsx
│   └── TaskRowActions.tsx
├── types/
│   └── taskLibrary.ts
└── data/
    └── mockTaskLibrary.ts
```

---

## 14. Changelog

| Date | Change |
|------|--------|
| 2026-01-02 | Initial specification created |
| 2026-01-02 | Implemented UI: route /tasks/library, all components created |
| 2026-01-02 | Translated specification to English |
| 2026-01-06 | Restructured spec with Basic/Detail sections |
| 2026-01-08 | Split spec into basic and detail files |
