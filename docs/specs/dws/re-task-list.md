# RE Task List Screen Specification

---

# BASIC SPEC

## 1. Overview

- **Module**: DWS (Dispatch Work Schedule)
- **Screen ID**: SCR_RE_TASK_LIST
- **Route**: `/dws/re-task-list`
- **Purpose**: Manage RE (Routine Execution) Tasks - list of routine tasks with frequency, duration, and manual references
- **Target Users**: HQ Staff, Store Manager

## 2. User Stories

| ID | As a... | I want to... | So that... |
|----|---------|--------------|------------|
| US-01 | HQ Staff | View all RE tasks in a list | I can see all routine tasks |
| US-02 | HQ Staff | Search tasks by group or name | I can quickly find specific tasks |
| US-03 | HQ Staff | Filter tasks by group | I can focus on specific departments |
| US-04 | HQ Staff | Import tasks from Excel | I can bulk add tasks |
| US-05 | HQ Staff | Export tasks to Excel | I can share task data |
| US-06 | HQ Staff | Add new RE task | I can create new routine tasks |
| US-07 | HQ Staff | Edit existing task | I can update task details |
| US-08 | HQ Staff | Delete task | I can remove obsolete tasks |

## 3. Screen Components Summary

| Component | Description |
|-----------|-------------|
| Header | Page title "Quan Ly RE Task" |
| Search Bar | Search by group or task name |
| Action Buttons | Import, Export, Add New |
| Data Table | Task list with all columns |
| Pagination | Page navigation |

## 4. Screen Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Quan Ly RE Task                                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│ RE Task List    [🔍 Search...]              [Import] [Export] [+ Them Moi]  │
│                                                                              │
│ ┌───────────────────────────────────────────────────────────────────────────┤
│ │ STT │ Group  │ Type │ Task Name    │ Freq │ Num │ Unit │ Manual │ Action  │
│ ├─────┼────────┼──────┼──────────────┼──────┼─────┼──────┼────────┼─────────┤
│ │ 1   │ DELICA │ CTM  │ Pha che Cafe │ Daily│ 1   │ 20   │ DEL-001│ ✏️ 🗑️   │
│ │ 2   │ DELICA │ Prod │ Chuan bi...  │ Daily│ 1   │ 30   │ DEL-002│ ✏️ 🗑️   │
│ │ ... │ ...    │ ...  │ ...          │ ...  │ ... │ ...  │ ...    │ ...     │
│ └───────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│ Hien thi tu 1 den 25 trong tong so 110 muc              [<] [>]             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 5. Navigation

| Action | Destination |
|--------|-------------|
| Click Sidebar "Quan Ly RE Task" | `/dws/re-task-list` |
| Click "Them Moi" | Open Add Task Modal |
| Click Edit icon | Open Edit Task Modal |
| Click Delete icon | Show Delete Confirmation |

## 6. API Endpoints Summary

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/dws/re-tasks` | GET | Get all RE tasks |
| `/api/v1/dws/re-tasks` | POST | Create new RE task |
| `/api/v1/dws/re-tasks/{id}` | PUT | Update RE task |
| `/api/v1/dws/re-tasks/{id}` | DELETE | Delete RE task |
| `/api/v1/dws/re-tasks/import` | POST | Import from Excel |
| `/api/v1/dws/re-tasks/export` | GET | Export to Excel |

## 7. Implementation Status

| Feature | Backend | Frontend | Notes |
|---------|---------|----------|-------|
| RE Task List Page | ⏳ Pending | ✅ Done | Mock data |
| Search/Filter | - | ✅ Done | Frontend only |
| Data Table | - | ✅ Done | With pagination |
| Action Buttons | ⏳ Pending | ✅ Done | Functional |
| Import Modal | ⏳ Pending | ✅ Done | CSV/JSON support |
| Export Modal | ⏳ Pending | ✅ Done | Excel/CSV/JSON |
| Add Task Modal | ⏳ Pending | ✅ Done | Full form with validation |
| Edit Task Modal | ⏳ Pending | ✅ Done | Pre-filled form |
| Delete Confirmation | ⏳ Pending | ✅ Done | With task info preview |
| Empty State | - | ✅ Done | No data / No results |
| Manual Link Clickable | - | ✅ Done | Opens in new tab |

---

# DETAIL SPEC

## 8. Header Section - Detail

| Component | Description | Notes |
|-----------|-------------|-------|
| Page Title | "Quan Ly RE Task" | Bold, large font |
| Background | White | With bottom border |

---

## 9. Search & Action Bar - Detail

### 9.1 Search Bar

| Property | Value |
|----------|-------|
| Placeholder | "Search by group or task name..." |
| Width | 256px (w-64) |
| Position | Left side |
| Icon | Search icon (magnifying glass) |

### 9.2 Action Buttons

| Button | Color | Icon | Action |
|--------|-------|------|--------|
| Import | Green (#22C55E) | Upload icon | Open import modal |
| Export | Orange (#F97316) | Download icon | Open export modal |
| Add New | Pink (#C5055B) | Plus icon | Open add task modal |

---

## 10. Data Table - Detail

### 10.1 Table Header

| Column | Width | Align | Sortable |
|--------|-------|-------|----------|
| STT | 60px | Left | No |
| Group | 100px | Left | Yes |
| Type Task | 100px | Left | Yes |
| Task Name | Flexible | Left | Yes |
| Frequency Type | 100px | Left | Yes |
| Frequency Number | 80px | Center | Yes |
| Re Unit (min) | 80px | Center | Yes |
| Manual Number | 100px | Left | No |
| Manual Link | 100px | Left | No |
| Note | 200px | Left | No |
| Actions | 80px | Center | No |

### 10.2 Header Styling

| Property | Value |
|----------|-------|
| Background | Dark Blue (#1E3A5F) |
| Text Color | White |
| Font Weight | Medium |
| Padding | 12px 16px |

### 10.3 Group Badge Colors

| Group | Background | Text Color |
|-------|------------|------------|
| DELICA | #EDE9FE | #7C3AED |
| D&D | #FEE2E2 | #DC2626 |
| DRY | #DBEAFE | #2563EB |
| POS | #D1FAE5 | #059669 |
| PERI | #FEF3C7 | #D97706 |
| MMD | #CFFAFE | #0891B2 |
| LEADER | #E0E7FF | #4F46E5 |
| QC-FSH | #FCE7F3 | #DB2777 |
| OTHER | #F3F4F6 | #6B7280 |

---

## 11. Data Types

```typescript
// RE Task interface
interface RETask {
  id: number;
  group: string;           // Task group: DELICA, D&D, DRY, etc.
  typeTask: string;        // Task type: CTM, Product, etc.
  taskName: string;        // Task name
  frequencyType: string;   // Daily, Weekly, Monthly
  frequencyNumber: number; // Number of times
  reUnit: number;          // RE Unit in minutes
  manualNumber: string;    // Manual code: DEL-001, DND-001, etc.
  manualLink?: string;     // Link to manual
  note?: string;           // Additional notes
}

// Task groups
type RETaskGroup = 'DELICA' | 'D&D' | 'DRY' | 'POS' | 'PERI' | 'MMD' | 'LEADER' | 'QC-FSH' | 'OTHER';

// Frequency types
type FrequencyType = 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Yearly';

// Task types
type TaskType = 'CTM' | 'Product' | 'Service' | 'Quality' | 'Safety';

// Filter interface
interface RETaskFilters {
  group: string[];
  typeTask: string[];
  frequencyType: string[];
  searchQuery: string;
}
```

---

## 12. Pagination - Detail

| Property | Value |
|----------|-------|
| Items per page | 25 |
| Display format | "Showing X to Y of Z items" |
| Navigation | Previous/Next buttons |
| Button style | Border with rounded corners |

---

## 13. Action Buttons - Detail

### 13.1 Edit Button

| Property | Value |
|----------|-------|
| Icon | Pencil/Edit icon |
| Color | Blue (#2563EB) |
| Hover | Blue background (#DBEAFE) |
| Action | Open edit modal |

### 13.2 Delete Button

| Property | Value |
|----------|-------|
| Icon | Trash icon |
| Color | Red (#DC2626) |
| Hover | Red background (#FEE2E2) |
| Action | Show confirmation dialog |

---

## 14. UI States - Detail

| State Type | State | Display |
|------------|-------|---------|
| Loading | Initial load | Skeleton loader for table |
| Loading | Searching | Spinner in search input |
| Empty | No results | "Khong tim thay ket qua" message |
| Error | Load failed | Error message with retry button |
| Success | Task added | Toast "Them task thanh cong" |
| Success | Task updated | Toast "Cap nhat task thanh cong" |
| Success | Task deleted | Toast "Xoa task thanh cong" |

---

## 15. API Endpoints - Detail

### 15.1 Get RE Tasks

```yaml
get:
  tags:
    - DWS-RETasks
  summary: "RE Task List API"
  description: |
    # Business Logic
      ## 1. Build Query
        ### Select Columns
          - re_tasks.id
          - re_tasks.group
          - re_tasks.type_task
          - re_tasks.task_name
          - re_tasks.frequency_type
          - re_tasks.frequency_number
          - re_tasks.re_unit
          - re_tasks.manual_number
          - re_tasks.manual_link
          - re_tasks.note

        ### Tables
          - re_tasks

        ### Search Conditions
          - IF search != NULL
            → re_tasks.group ILIKE '%' || search || '%'
            OR re_tasks.task_name ILIKE '%' || search || '%'
          - IF group != NULL
            → re_tasks.group IN (request.group)
          - IF frequency_type != NULL
            → re_tasks.frequency_type = request.frequency_type

        ### Order By
          - Dynamic based on sort_by parameter
          - Default: re_tasks.id ASC

      ## 2. Pagination
        - Apply LIMIT = per_page (default: 25)
        - Apply OFFSET = (page - 1) * per_page

      ## 3. Response
        - Return paginated RE task list

  operationId: getRETaskList
  parameters:
    - name: page
      in: query
      required: false
      schema:
        type: integer
        default: 1

    - name: per_page
      in: query
      required: false
      schema:
        type: integer
        default: 25

    - name: search
      in: query
      required: false
      schema:
        type: string
      description: Search by group or task name

    - name: group
      in: query
      required: false
      schema:
        type: array
        items:
          type: string
      description: Filter by group(s)

    - name: frequency_type
      in: query
      required: false
      schema:
        type: string
        enum: [Daily, Weekly, Monthly, Quarterly, Yearly]

    - name: sort_by
      in: query
      required: false
      schema:
        type: string
        enum: [id, group, task_name, frequency_type]
        default: id

    - name: sort_dir
      in: query
      required: false
      schema:
        type: string
        enum: [asc, desc]
        default: asc

  responses:
    200:
      description: OK
      content:
        application/json:
          example:
            data:
              - id: 1
                group: "DELICA"
                typeTask: "CTM"
                taskName: "Pha che Cafe"
                frequencyType: "Daily"
                frequencyNumber: 1
                reUnit: 20
                manualNumber: "DEL-001"
                manualLink: "https://manual.example.com/del-001"
                note: ""
            meta:
              current_page: 1
              per_page: 25
              total: 110
              last_page: 5

    500:
      description: Internal Server Error
```

### 15.2 Create RE Task

```yaml
post:
  tags:
    - DWS-RETasks
  summary: "Create RE Task API"
  description: |
    # Correlation Check
      - manual_number must be unique

    # Business Logic
      ## 1. Validate Input
        - All required fields present
        - manual_number unique check

      ## 2. Insert Record
        - Insert into re_tasks table

      ## 3. Response
        - Return created RE task

  operationId: createRETask
  requestBody:
    required: true
    content:
      application/json:
        schema:
          $ref: "#/components/schemas/RETaskRequest"
        example:
          group: "DELICA"
          type_task: "CTM"
          task_name: "Pha che Cafe"
          frequency_type: "Daily"
          frequency_number: 1
          re_unit: 20
          manual_number: "DEL-001"
          manual_link: "https://manual.example.com/del-001"
          note: "Morning shift only"

  responses:
    201:
      description: Created
      content:
        application/json:
          example:
            success: true
            data:
              id: 111
              group: "DELICA"
              taskName: "Pha che Cafe"
            message: "Task created successfully"

    400:
      description: Bad Request
      content:
        application/json:
          examples:
            validation_error:
              value:
                success: false
                message: "Validation failed"
                errors:
                  task_name: ["Task name is required"]
            duplicate_manual:
              value:
                success: false
                message: "Manual Number already exists"

    500:
      description: Internal Server Error
```

### 15.3 Update RE Task

```yaml
put:
  tags:
    - DWS-RETasks
  summary: "Update RE Task API"
  description: |
    # Correlation Check
      - Task ID must exist
      - manual_number must be unique (excluding current task)

    # Business Logic
      ## 1. Find Existing Task
        - If not found → Return 404

      ## 2. Validate Input
        - Same as Create

      ## 3. Update Record
        - Update re_tasks record

      ## 4. Response
        - Return updated RE task

  operationId: updateRETask
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
          $ref: "#/components/schemas/RETaskRequest"

  responses:
    200:
      description: OK
      content:
        application/json:
          example:
            success: true
            data:
              id: 1
              group: "DELICA"
              taskName: "Updated Task Name"
            message: "Task updated successfully"

    404:
      description: Not Found
      content:
        application/json:
          example:
            success: false
            message: "Task not found"

    400:
      description: Bad Request
```

### 15.4 Delete RE Task

```yaml
delete:
  tags:
    - DWS-RETasks
  summary: "Delete RE Task API"
  description: |
    # Correlation Check
      - Task ID must exist

    # Business Logic
      ## 1. Find Existing Task
        - If not found → Return 404

      ## 2. Delete Record
        - Delete from re_tasks table

      ## 3. Response
        - Return success message

  operationId: deleteRETask
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
            message: "Task deleted successfully"

    404:
      description: Not Found
```

### 15.5 Import RE Tasks

```yaml
post:
  tags:
    - DWS-RETasks
  summary: "Import RE Tasks API"
  description: |
    # Business Logic
      ## 1. Parse File
        - Support CSV, JSON, Excel formats
        - Validate file structure

      ## 2. Validate Each Row
        - Check required fields
        - Check manual_number uniqueness

      ## 3. Bulk Insert
        - Insert all valid records
        - Return count of imported/skipped

  operationId: importRETasks
  requestBody:
    required: true
    content:
      multipart/form-data:
        schema:
          type: object
          properties:
            file:
              type: string
              format: binary
            format:
              type: string
              enum: [csv, json, excel]

  responses:
    200:
      description: OK
      content:
        application/json:
          example:
            success: true
            data:
              imported: 50
              skipped: 2
              errors:
                - row: 15
                  error: "Manual Number already exists"
```

### 15.6 Export RE Tasks

```yaml
get:
  tags:
    - DWS-RETasks
  summary: "Export RE Tasks API"
  description: |
    # Business Logic
      ## 1. Get All Tasks
        - Apply current filters if any

      ## 2. Generate File
        - Support CSV, JSON, Excel formats

      ## 3. Response
        - Return downloadable file

  operationId: exportRETasks
  parameters:
    - name: format
      in: query
      required: true
      schema:
        type: string
        enum: [csv, json, excel]

    - name: group
      in: query
      required: false
      schema:
        type: string
      description: Filter by group before export

  responses:
    200:
      description: OK
      content:
        application/octet-stream:
          schema:
            type: string
            format: binary
```

### 15.7 Schema Definitions

```yaml
components:
  schemas:
    RETaskRequest:
      type: object
      required:
        - group
        - type_task
        - task_name
        - frequency_type
        - frequency_number
        - re_unit
        - manual_number
      properties:
        group:
          type: string
          enum: [DELICA, D&D, DRY, POS, PERI, MMD, LEADER, QC-FSH, OTHER]
        type_task:
          type: string
          enum: [CTM, Product, Service, Quality, Safety]
        task_name:
          type: string
          maxLength: 255
        frequency_type:
          type: string
          enum: [Daily, Weekly, Monthly, Quarterly, Yearly]
        frequency_number:
          type: integer
          minimum: 1
        re_unit:
          type: integer
          minimum: 0
          description: RE Unit in minutes
        manual_number:
          type: string
          maxLength: 20
        manual_link:
          type: string
          format: uri
        note:
          type: string

    RETaskResponse:
      type: object
      properties:
        id:
          type: integer
        group:
          type: string
        typeTask:
          type: string
        taskName:
          type: string
        frequencyType:
          type: string
        frequencyNumber:
          type: integer
        reUnit:
          type: integer
        manualNumber:
          type: string
        manualLink:
          type: string
        note:
          type: string
```

---

## 16. Validation Rules

| Field | Rule | Error Message |
|-------|------|---------------|
| group | Required | "Vui long chon Group" |
| typeTask | Required | "Vui long chon Type Task" |
| taskName | Required, max 255 | "Task name la bat buoc" |
| frequencyType | Required | "Vui long chon Frequency Type" |
| frequencyNumber | Required, min 1 | "Frequency Number phai >= 1" |
| reUnit | Required, min 0 | "RE Unit phai >= 0" |
| manualNumber | Required, unique | "Manual Number da ton tai" |

---

## 17. Files Reference

```
frontend/src/
├── app/
│   └── dws/
│       └── re-task-list/
│           └── page.tsx               # Main page component
├── types/
│   └── reTask.ts                      # Type definitions
├── data/
│   └── mockRETaskData.ts              # Mock data for development
├── utils/
│   └── reTaskExport.ts                # Export/Import utilities
└── components/
    └── dws/
        ├── AddRETaskModal.tsx         # Add new task modal
        ├── EditRETaskModal.tsx        # Edit task modal
        ├── DeleteConfirmDialog.tsx    # Delete confirmation dialog
        ├── ImportRETaskModal.tsx      # Import tasks modal
        ├── ExportRETaskModal.tsx      # Export tasks modal
        └── EmptyState.tsx             # Empty state component
```

---

## 18. Test Scenarios

| Test Case | Scenario | Expected |
|-----------|----------|----------|
| View list | Open RE Task List page | Table displays with data |
| Search | Enter "DELICA" in search | Filter shows DELICA tasks only |
| Pagination | Click next page | Shows next 25 items |
| Add task | Click "Them Moi", fill form, submit | New task appears in list |
| Edit task | Click edit, modify, save | Task updated |
| Delete task | Click delete, confirm | Task removed from list |
| Import | Upload Excel file | Tasks imported |
| Export | Click Export | Excel file downloaded |

---

## 19. Changelog

| Date | Change |
|------|--------|
| 2026-01-06 | Initial specification created |
| 2026-01-06 | Implemented RE Task List page with mock data |
| 2026-01-06 | Added DWS menu items to sidebar |
| 2026-01-06 | Changed UI text from Vietnamese to English |
| 2026-01-06 | Added Import/Export modals with CSV, JSON, Excel support |
| 2026-01-06 | Added Add New Task modal with enhanced UI/UX (gradient header, icons, validation) |
| 2026-01-06 | Added Edit Task modal with pre-filled data |
| 2026-01-06 | Added Delete Confirmation dialog with task info preview |
| 2026-01-06 | Added Empty State component (no-data, no-results, error states) |
| 2026-01-06 | Made Manual Link column clickable (opens in new tab) |
| 2026-01-06 | Updated API section with OpenAPI format (6 endpoints with schemas) |
