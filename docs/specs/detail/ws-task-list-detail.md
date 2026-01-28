# Task List - Detail Specification

> **Module**: WS (Task from HQ)
> **Screen ID**: SCR_TASK_LIST
> **Route**: `/tasks/list`
> **Last Updated**: 2026-01-28

---

## 1. Component Details

### 1.1 Header Section

| Component | Description | Status |
|-----------|-------------|--------|
| Title | "List tasks" - h1 heading | ✅ Implemented |
| DatePicker | DAY/WEEK/CUSTOM date selection | ✅ Implemented |
| Search | Text search for task name/dept | ✅ Implemented |
| Filter Button | Opens filter modal | ✅ Implemented |
| ADD NEW Button | Navigate to `/tasks/new` | ✅ Implemented |
| Live Indicator | WebSocket connection status | ✅ Implemented |

### 1.2 DatePicker Component

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

### 1.3 Search Component

| Feature | Description |
|---------|-------------|
| Placeholder | "Search task name..." |
| Debounce | 300ms delay before API call |
| Clear button | X icon to clear search text |
| Server-side | Partial match on task_name field |

---

## 2. Data Table - Detail

### 2.1 Columns

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

### 2.2 Sorting Behavior

- **3-state cycle**: None → Ascending → Descending → None
- **Visual indicators**:
  - No sort: Gray up/down arrows
  - Ascending: Pink up arrow
  - Descending: Pink down arrow

### 2.3 Column Filter Dropdowns

- Available on: Dept, Status, HQ Check columns
- Features:
  - Checkbox multi-select
  - "All" button to select all options
  - "Clear" button to deselect all
  - Badge showing number of active filters

### 2.4 Row Expansion (Accordion)

- Click expand icon to show sub-tasks
- Only one row can be expanded at a time
- Sub-tasks display: name, assignee, status

### 2.5 Row Click Navigation

- Click on row navigates to `/tasks/{id}` detail page
- Expand button click does NOT trigger navigation (stopPropagation)

### 2.6 Task Visibility Rules by Status

Tasks are filtered based on user's relationship to the task:

| Status | Who Can See | Filter Field | Logic |
|--------|-------------|--------------|-------|
| **Draft** | Creator only | `created_staff_id` | `task.created_staff_id = current_user.staff_id` |
| **Approve** | Creator OR Approver | `created_staff_id`, `approver_staff_id` | `task.created_staff_id = current_user.staff_id OR task.approver_staff_id = current_user.staff_id` |
| **Not Yet** | All users | - | No additional filter |
| **On Progress** | All users | - | No additional filter |
| **Done** | All users | - | No additional filter |
| **Overdue** | All users | - | No additional filter |

**Implementation Notes:**

```typescript
// Backend applies these filters automatically based on status
// Frontend just sends status filter, backend handles visibility

// Example query logic in TaskController:
// 1. If status = DRAFT → WHERE created_staff_id = auth_user
// 2. If status = APPROVE → WHERE created_staff_id = auth_user OR approver_staff_id = auth_user
// 3. Other statuses → No visibility filter (standard department/team scope applies)
```

**Rationale:**
- **Draft**: Personal work-in-progress, only creator should see their drafts
- **Approve**: Creator needs to track submission status, Approver needs to review and take action
- **Other statuses**: Tasks are dispatched and public within the organization

---

## 3. Filter Modal - Detail

### 3.1 Filter Options

| Filter | Options | Status |
|--------|---------|--------|
| View Scope | All team, My tasks | ✅ Implemented |
| Department | Multi-select checkboxes with parent-child logic | ✅ Implemented |
| Status | NOT_YET, DRAFT, DONE (chip buttons) | ✅ Implemented |
| HQ Check | NOT_YET, DRAFT, DONE (chip buttons) | ✅ Implemented |

### 3.2 Department Checkbox Logic

| Action | Behavior |
|--------|----------|
| Check parent | All children are also checked |
| Uncheck parent | All children are also unchecked |
| Check all children | Parent is automatically checked |
| Uncheck any child | Parent is automatically unchecked |

**Principle**: Parent checked ⟺ All children checked

---

## 4. Pagination - Detail

| Feature | Value | Status |
|---------|-------|--------|
| Items per page | 10 (configurable via API) | ✅ Server-side |
| Page numbers | Smart pagination showing pages around current | ✅ Implemented |
| Previous/Next | Arrow buttons | ✅ Implemented |
| Total count | "Total: X tasks group (Page N of M)" | ✅ Server-side |

### 4.1 Server-side Pagination

- Pagination is now handled server-side via Laravel's built-in paginator
- Frontend receives paginated response with `current_page`, `last_page`, `total`, `per_page`
- Page change triggers new API call with `page` parameter
- Reduces memory usage on frontend, improves performance for large datasets

---

## 5. Real-time Updates (WebSocket) [PROD-ONLY]

### 5.1 Architecture
- **Server**: Laravel Reverb (PHP-based WebSocket server)
- **Client**: Laravel Echo + Pusher.js
- **Channel**: Public channel `tasks`
- **Event**: `task.updated`

### 5.2 How it works
1. User creates/updates/deletes a task via API
2. TaskController broadcasts `TaskUpdated` event
3. Reverb server forwards event to all connected clients
4. Frontend receives event and refreshes task list

### 5.3 Configuration

**Backend (.env)**:
```
BROADCAST_DRIVER=reverb
REVERB_APP_ID=260147
REVERB_APP_KEY=suhaw3wjz4bsbm2gmt5k
REVERB_APP_SECRET=myrh562nv1igehs3ysgb
REVERB_HOST=localhost
REVERB_PORT=8080
REVERB_SCHEME=http
```

**Frontend (.env.local)**:
```
NEXT_PUBLIC_REVERB_APP_KEY=suhaw3wjz4bsbm2gmt5k
NEXT_PUBLIC_REVERB_HOST=localhost
NEXT_PUBLIC_REVERB_PORT=8080
NEXT_PUBLIC_REVERB_SCHEME=http
```

### 5.4 Running Reverb Server
```bash
php artisan reverb:start --port=8080
```

### 5.5 UI Indicator
- Green dot with "Live" text when WebSocket connected
- Gray dot with "Offline" text when disconnected

---

## 6. API Endpoints - Detail

### 6.1 Get Task List

```yaml
get:
  tags:
    - WS-Tasks
  summary: "Task List API"
  description: |
    # Correlation Check
      - Date Range Check
        - If date_from > date_to → Return date range validation error
      - Master Data Existence Check
        - dept_id: Check against departments table
        - status_id: Check against code_master table
        - assigned_staff_id: Check against staff table

    # Business Logic
      ## 1. Build Query
        ### Select Columns
          - tasks.task_id
          - tasks.task_name
          - tasks.task_description
          - tasks.start_date
          - tasks.end_date
          - tasks.priority
          - departments.department_name AS dept
          - code_master.code_name AS status (WHERE code_type = 'task_status')
          - staff.staff_name AS assigned_staff_name
          - COUNT(task_check_list.check_list_id) AS total_checklists
          - SUM(CASE WHEN task_check_list.is_completed = true THEN 1 ELSE 0 END) AS completed_checklists

        ### Tables
          - tasks
          - departments
          - code_master
          - staff
          - task_check_list

        ### Join Conditions
          - tasks.dept_id = departments.department_id LEFT JOIN
          - tasks.status_id = code_master.code_master_id LEFT JOIN
          - tasks.assigned_staff_id = staff.staff_id LEFT JOIN
          - tasks.task_id = task_check_list.task_id LEFT JOIN

        ### Search Conditions
          - IF date_from != NULL AND date_to = NULL
            → tasks.start_date >= request.date_from
          - IF date_from = NULL AND date_to != NULL
            → tasks.end_date <= request.date_to
          - IF date_from != NULL AND date_to != NULL
            → tasks.start_date >= request.date_from AND tasks.end_date <= request.date_to
          - IF dept_id != NULL
            → tasks.dept_id = request.dept_id
          - IF status_id != NULL
            → tasks.status_id = request.status_id
          - IF assigned_staff_id != NULL
            → tasks.assigned_staff_id = request.assigned_staff_id
          - IF task_name != NULL
            → tasks.task_name ILIKE '%' || request.task_name || '%'

        ### Group By
          - tasks.task_id
          - departments.department_name
          - code_master.code_name
          - staff.staff_name

        ### Order By
          - Dynamic based on sort_by parameter
          - Default: tasks.created_at DESC

      ## 2. Pagination
        - Apply LIMIT = per_page (default: 20)
        - Apply OFFSET = (page - 1) * per_page
        - Calculate total_pages = CEIL(total_count / per_page)

      ## 3. Response
        - Return paginated task list with meta information

  operationId: getTaskList
  parameters:
    # Header Parameters
    - name: Authorization
      in: header
      required: false
      schema:
        type: string
      description: Bearer token (optional for public access)

    # Query Parameters
    - name: date_from
      in: query
      required: false
      schema:
        type: string
        format: date
      description: Filter start date (YYYY-MM-DD)

    - name: date_to
      in: query
      required: false
      schema:
        type: string
        format: date
      description: Filter end date (YYYY-MM-DD)

    - name: task_name
      in: query
      required: false
      schema:
        type: string
      description: Partial search on task name

    - name: dept_id
      in: query
      required: false
      schema:
        type: integer
      description: Filter by department ID

    - name: status_id
      in: query
      required: false
      schema:
        type: integer
      description: Filter by status ID (code_master)

    - name: assigned_staff_id
      in: query
      required: false
      schema:
        type: integer
      description: Filter by assigned staff ID

    - name: assigned_store_id
      in: query
      required: false
      schema:
        type: integer
      description: Filter by assigned store ID

    - name: include
      in: query
      required: false
      schema:
        type: string
      description: |
        Comma-separated relations to include:
        assignedStaff, createdBy, assignedStore, department, taskType, responseType, status

    - name: sort_by
      in: query
      required: false
      schema:
        type: string
        enum: [task_id, task_name, start_date, end_date, created_at]
        default: created_at
      description: Column to sort by

    - name: sort_dir
      in: query
      required: false
      schema:
        type: string
        enum: [asc, desc]
        default: desc
      description: Sort direction

    - name: page
      in: query
      required: false
      schema:
        type: integer
        default: 1
      description: Page number

    - name: per_page
      in: query
      required: false
      schema:
        type: integer
        default: 20
        maximum: 100
      description: Items per page

  responses:
    200:
      description: OK
      content:
        application/json:
          schema:
            type: object
            properties:
              data:
                type: array
                items:
                  $ref: "#/components/schemas/Task"
              links:
                $ref: "#/components/schemas/PaginationLinks"
              meta:
                $ref: "#/components/schemas/PaginationMeta"
          example:
            data:
              - task_id: 1
                task_name: "Marketing Campaign Q1"
                task_description: "Quarterly marketing campaign"
                start_date: "2026-01-01"
                end_date: "2026-01-31"
                priority: "high"
                department:
                  department_id: 1
                  department_name: "Marketing"
                status:
                  code_master_id: 10
                  code_name: "DRAFT"
                assigned_staff:
                  staff_id: 5
                  staff_name: "John Doe"
                progress:
                  completed: 5
                  total: 10
            meta:
              current_page: 1
              per_page: 20
              total: 50
              last_page: 3

    400:
      description: Bad Request
      content:
        application/json:
          examples:
            date_range_error:
              summary: Date range validation error
              value:
                success: false
                message: "date_from must be before or equal to date_to"
                errors:
                  date_from: ["The date from must be a date before or equal to date to."]
            invalid_parameter:
              summary: Invalid parameter error
              value:
                success: false
                message: "Validation failed"
                errors:
                  dept_id: ["The selected dept id is invalid."]

    500:
      description: Internal Server Error
      content:
        application/json:
          example:
            success: false
            message: "Internal server error"
```

### 6.2 Get Department List

```yaml
get:
  tags:
    - WS-Master
  summary: "Department List API"
  description: |
    # Business Logic
      ## 1. Get Department Data
        ### Select Columns
          - department_id
          - department_name
          - department_code
          - parent_department_id
          - level
          - is_active

        ### Tables
          - departments

        ### Search Conditions
          - is_active = true (default, unless include_inactive = true)

        ### Order By
          - level ASC, department_name ASC

      ## 2. Response
        - Return hierarchical department list

  operationId: getDepartmentList
  parameters:
    - name: include_inactive
      in: query
      required: false
      schema:
        type: boolean
        default: false
      description: Include inactive departments

  responses:
    200:
      description: OK
      content:
        application/json:
          example:
            data:
              - department_id: 1
                department_name: "Head Office"
                department_code: "HO"
                parent_department_id: null
                level: 0
                children:
                  - department_id: 2
                    department_name: "Marketing"
                    department_code: "MKT"
                    parent_department_id: 1
                    level: 1
                  - department_id: 3
                    department_name: "Sales"
                    department_code: "SLS"
                    parent_department_id: 1
                    level: 1
```

---

## 7. Data Types

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

interface PaginatedTaskResponse {
  data: TaskGroup[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  };
}

interface TaskUpdateEvent {
  action: 'created' | 'updated' | 'deleted' | 'status_changed';
  task: {
    task_id: number;
    task_name: string;
    status_id: number;
    dept_id: number | null;
    assigned_store_id: number | null;
    start_date: string | null;
    end_date: string | null;
    priority: string | null;
    updated_at: string;
  };
  timestamp: string;
}
```

---

## 8. Schema Definitions

```yaml
components:
  schemas:
    Task:
      type: object
      properties:
        task_id:
          type: integer
          description: Primary key
        task_name:
          type: string
          maxLength: 500
          description: Task name
        task_description:
          type: string
          nullable: true
          description: Task description
        start_date:
          type: string
          format: date
          nullable: true
        end_date:
          type: string
          format: date
          nullable: true
        priority:
          type: string
          enum: [low, normal, high, urgent]
          default: normal
        status:
          $ref: "#/components/schemas/CodeMaster"
        department:
          $ref: "#/components/schemas/Department"
        assigned_staff:
          $ref: "#/components/schemas/Staff"

    CodeMaster:
      type: object
      properties:
        code_master_id:
          type: integer
        code_type:
          type: string
        code_value:
          type: string
        code_name:
          type: string

    Department:
      type: object
      properties:
        department_id:
          type: integer
        department_name:
          type: string
        department_code:
          type: string
        parent_department_id:
          type: integer
          nullable: true
        level:
          type: integer

    Staff:
      type: object
      properties:
        staff_id:
          type: integer
        staff_name:
          type: string
        email:
          type: string

    PaginationLinks:
      type: object
      properties:
        first:
          type: string
        last:
          type: string
        prev:
          type: string
          nullable: true
        next:
          type: string
          nullable: true

    PaginationMeta:
      type: object
      properties:
        current_page:
          type: integer
        from:
          type: integer
        last_page:
          type: integer
        per_page:
          type: integer
        to:
          type: integer
        total:
          type: integer
```

---

## 9. Validation Rules

| Field | Rules |
|-------|-------|
| date_from | Optional, date format YYYY-MM-DD |
| date_to | Optional, date format YYYY-MM-DD, must be >= date_from |
| task_name | Optional, string, max 500 chars |
| dept_id | Optional, integer, must exist in departments table |
| status_id | Optional, integer, must exist in code_master table |
| page | Optional, integer, min 1 |
| per_page | Optional, integer, min 1, max 100 |

---

## 10. Files Reference

### 10.1 Frontend Files

```
frontend/src/
├── app/tasks/
│   └── list/page.tsx              # Main list page
├── components/
│   ├── ui/
│   │   ├── DatePicker.tsx         # Date selection component
│   │   ├── StatusPill.tsx         # Status badge component
│   │   ├── SearchBar.tsx          # Search input
│   │   └── ColumnFilterDropdown.tsx  # Column filter
│   └── tasks/
│       └── FilterModal.tsx        # Filter modal dialog
├── types/
│   └── tasks.ts                   # Type definitions
├── lib/
│   └── echo.ts                    # Echo configuration
├── hooks/
│   └── useTaskUpdates.ts          # WebSocket hook
└── services/
    └── taskService.ts             # API calls
```

### 10.2 Backend Files

| Feature | File |
|---------|------|
| Controller | `app/Http/Controllers/Api/V1/TaskController.php` |
| Model | `app/Models/Task.php` |
| Resource | `app/Http/Resources/TaskResource.php` |
| Event | `app/Events/TaskUpdated.php` |

---

## 11. Pending Features

| Feature | Priority | Status |
|---------|----------|--------|
| Export Excel | Medium | ⏳ Pending |
| Export PDF | Low | ⏳ Pending |
| Bulk actions | Low | ⏳ Pending |

---

## 12. Changelog

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
| 2026-01-06 | Restructured spec with Basic/Detail sections |
| 2026-01-06 | Updated API section with OpenAPI format (correlation checks, business logic, schemas) |
| 2026-01-07 | Integrated server-side API: pagination, search filter, department filter, status filter |
| 2026-01-07 | Added PaginatedTaskResponse type with Laravel pagination fields |
| 2026-01-07 | Improved getTasks() to use Spatie QueryBuilder filter syntax |
| 2026-01-07 | Added debounced search (300ms) for better UX |
| 2026-01-07 | Updated pagination UI to show "Page N of M" with smart page buttons |
| 2026-01-07 | Added server-side date range filter (end_date_from, start_date_to) |
| 2026-01-07 | DatePicker now triggers API call when date selection changes |
| 2026-01-07 | Implemented real-time updates using Laravel Reverb WebSocket |
| 2026-01-07 | Added TaskUpdated event for broadcasting task changes |
| 2026-01-07 | Created useTaskUpdates React hook for WebSocket subscription |
| 2026-01-07 | Added Live/Offline connection status indicator in Task List header |
| 2026-01-08 | Split spec into basic and detail files |
| 2026-01-28 | Added Task Visibility Rules by Status (Section 2.6): Draft=creator, Approve=creator/approver, others=all |
