# API Specification: Get Task List

> **API Name**: screen_task_list_api
> **Method**: GET
> **Endpoint**: `/api/v1/tasks`
> **Module**: WS (Task from HQ)
> **Last Updated**: 2026-01-08

---

## 1. Parameters

### HeaderParam

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `userId` | integer | Yes | User ID from token |
| `token` | string | Yes | JWT token |

**Note for Dev Team**: This API requires authentication via **Bearer token** in `Authorization` header. The token contains all user information (staff_id, grade_code, grade_type, department_id, store_id, etc.). Backend will automatically decode the token to extract user info and apply permission-based filters.

**Example**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `start` | date | No | today | Start date (YYYY-MM-DD) |
| `end` | date | No | today | End date (YYYY-MM-DD) |
| `search` | string | No | - | Search by task name or department name |
| `view_scope` | string | No | all_team | View scope filter: "all_team", "my_team", "my_department" |
| `department_id[]` | integer[] | No | - | Filter by departments (multi-select) |
| `status[]` | string[] | No | - | Filter by status (NOT_YET, DONE, DRAFT) |
| `hq_check[]` | string[] | No | - | Filter by HQ check status (NOT_YET, DONE, DRAFT) |
| `limit` | integer | No | 10 | Items per page (max: 100) |
| `offset` | integer | No | 1 | Page number |

---

## 2. Description

This API retrieves the list of task groups with the following capabilities:
- Filter by date range (start/end date)
- Search by task name or department name
- Filter by department, status, and HQ check status
- Pagination with limit/offset
- Automatic permission-based filtering (based on user's grade_code + grade_type from JWT token)

---

## 3. SQL

SQL query implementation:

```sql
-- Get tasks with filters and pagination
SELECT
    t.id,
    t.dept_id,
    d.dept_name,
    t.task_name,
    t.task_level,
    t.start_date,
    t.end_date,
    t.done_task_count,
    t.all_task_count,
    t.unable_task_count,
    t.status_id,
    s.status_name,
    t.hq_check_status_id,
    hs.status_name as hq_check_status_name,
    t.parent_task_id
FROM tasks t
LEFT JOIN departments d ON t.dept_id = d.id
LEFT JOIN statuses s ON t.status_id = s.id
LEFT JOIN statuses hs ON t.hq_check_status_id = hs.id
WHERE 1=1
    -- Date filter
    AND (t.start_date >= :start_date OR :start_date IS NULL)
    AND (t.end_date <= :end_date OR :end_date IS NULL)

    -- Search filter
    AND (
        t.task_name LIKE CONCAT('%', :search, '%')
        OR d.dept_name LIKE CONCAT('%', :search, '%')
        OR :search IS NULL
    )

    -- Department filter
    AND (t.dept_id IN (:department_ids) OR :department_ids IS NULL)

    -- Status filter
    AND (s.status_code IN (:status_codes) OR :status_codes IS NULL)

    -- HQ Check filter
    AND (hs.status_code IN (:hq_check_codes) OR :hq_check_codes IS NULL)

    -- Permission filter (based on user grade)
    -- [Apply grade-based filter here based on JWT token]

ORDER BY t.created_at DESC
LIMIT :limit OFFSET :offset;
```

---

## 4. Return

### HTTPstatus: 200 OK

#### Success Response

Response structure:

```json
{
  "success": true,
  "data": {
    "tasks": [
      {
        "id": 1,
        "dept": {
          "id": 5,
          "name": "MKT",
          "icon": "marketing"
        },
        "task_name": "Campaign Q1 2026",
        "task_level": 1,
        "start": "2026-01-10",
        "end": "2026-03-31",
        "done_task_count": 5,
        "all_task_count": 10,
        "unable_count": 2,
        "status": {
          "id": 2,
          "name": "DONE",
          "code": "DONE"
        },
        "hq_check": {
          "id": 1,
          "name": "NOT_YET",
          "code": "NOT_YET"
        },
        "sub_tasks": [
          {
            "id": 101,
            "task_name": "Đại hàng hoa",
            "task_level": 2,
            "start": "2026-01-10",
            "end": "2026-03-31",
            "status": {
              "id": 2,
              "name": "DONE",
              "code": "DONE"
            },
            "assignee": "Nguyen Van A",
            "sub_tasks": [
              {
                "id": 1001,
                "task_name": "Chuẩn bị vật liệu",
                "task_level": 3,
                "start": "2026-01-10",
                "end": "2026-01-15",
                "status": {
                  "id": 2,
                  "name": "DONE",
                  "code": "DONE"
                },
                "assignee": "Le Van C",
                "sub_tasks": []
              }
            ]
          },
          {
            "id": 102,
            "task_name": "Chụp hình",
            "task_level": 2,
            "start": "2026-01-10",
            "end": "2026-03-31",
            "status": {
              "id": 1,
              "name": "DRAFT",
              "code": "DRAFT"
            },
            "assignee": "Tran Thi B",
            "sub_tasks": []
          }
        ]
      }
    ],
    "pagination": {
      "total": 45,
      "per_page": 10,
      "current_page": 1,
      "last_page": 5,
      "from": 1,
      "to": 10
    }
  }
}
```

#### Response Fields

| Field | Type | Max Length | Description |
|-------|------|------------|-------------|
| `id` | integer | - | Task ID |
| `dept` | object | - | Department information |
| `dept.id` | integer | - | Department ID |
| `dept.name` | text | 300 ký tự | Department name |
| `dept.icon` | text | 100 ký tự | Department icon |
| `task_name` | text | 300 ký tự | Task name |
| `task_level` | int | - | Task level (1=parent, 2=child) |
| `start` | date | - | Start date |
| `end` | date | - | End date |
| `done_task_count` | int | - | Number of completed tasks |
| `all_task_count` | int | - | Total number of tasks |
| `unable_count` | int | - | Number of unable tasks |
| `status` | object | - | Status information |
| `status.id` | int | - | Status ID |
| `status.name` | text | 300 ký tự | Status name |
| `status.code` | text | 50 ký tự | Status code |
| `hq_check` | object | - | HQ check status |
| `hq_check.id` | int | - | HQ check status ID |
| `hq_check.name` | text | 300 ký tự | HQ check status name |
| `hq_check.code` | text | 50 ký tự | HQ check status code |
| `sub_tasks` | array | - | Child tasks array (recursive structure, max 5 levels) |
| `sub_tasks[].id` | integer | - | Sub-task ID |
| `sub_tasks[].task_name` | text | 300 ký tự | Sub-task name |
| `sub_tasks[].task_level` | int | - | Task level (1=parent, 2-5=sub-tasks) |
| `sub_tasks[].start` | date | - | Sub-task start date |
| `sub_tasks[].end` | date | - | Sub-task end date |
| `sub_tasks[].status` | object | - | Sub-task status |
| `sub_tasks[].status.id` | int | - | Status ID |
| `sub_tasks[].status.name` | text | 300 ký tự | Status name |
| `sub_tasks[].status.code` | text | 50 ký tự | Status code (NOT_YET, DRAFT, DONE) |
| `sub_tasks[].assignee` | text | 300 ký tự | Person assigned to this sub-task (optional) |
| `sub_tasks[].sub_tasks` | array | - | Nested sub-tasks (recursive, max depth 5) |

### Error Responses

#### 400 - Bad Request

Invalid parameters or validation errors.

```json
{
  "success": false,
  "message": "Invalid parameters",
  "errors": {
    "start": ["Start date must be in YYYY-MM-DD format"],
    "limit": ["Limit must be between 1 and 100"]
  }
}
```

**Common validation errors:**

- Start date must be in YYYY-MM-DD format
- End date must be in YYYY-MM-DD format
- Start date must be before or equal to end date
- Limit must be between 1 and 100
- Offset must be greater than 0

#### 401 - Unauthorized

Missing or invalid authentication token.

```json
{
  "success": false,
  "message": "Unauthorized",
  "errors": {
    "token": ["Token is invalid or expired"]
  }
}
```

#### 500 - Internal Server Error

Server encountered an unexpected error.

```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## 5. Business Logic

### Permission-based Data Access

API automatically filters data based on user's job grade (extracted from JWT token):

| Grade Type | Grade Code | Access Scope | SQL Filter |
|------------|------------|--------------|------------|
| HQ | G8, G9 | All company tasks | No filter |
| HQ | G7 | Tasks in managed division | `WHERE division_id = :user_division_id` |
| HQ | G6, G5 | Tasks in managed department | `WHERE department_id = :user_department_id` |
| HQ | G4 | Tasks in managed team | `WHERE team_id = :user_team_id` |
| HQ | G3, G2 | Only assigned tasks | `WHERE assigned_staff_id = :user_staff_id` |
| STORE | S6 | Tasks in managed region | `WHERE region_id = :user_region_id` |
| STORE | S5 | Tasks in managed area | `WHERE area_id = :user_area_id` |
| STORE | S4 | Tasks in store cluster | `WHERE store_id IN (:user_store_cluster)` |
| STORE | S3, S2 | Tasks in managed store | `WHERE store_id = :user_store_id` |
| STORE | S1 | Only assigned tasks | `WHERE assigned_staff_id = :user_staff_id` |

### Date Range Default

- If `start` is not provided → default to today
- If `end` is not provided → default to today
- If both not provided → show tasks valid for today

### Pagination

- Default `limit` = 10
- Maximum `limit` = 100
- `offset` starts from 1 (not 0)

### Task Hierarchy

**Structure:**
```
Level 1: Task Group (Parent Task)
  └─ Level 2: Sub-task
      └─ Level 3: Sub-sub-task
          └─ Level 4: Sub-sub-sub-task
              └─ Level 5: Sub-sub-sub-sub-task (Maximum depth)
```

**Rules:**
- Maximum depth: **5 levels**
- Each task has `task_level` field (1-5) to identify hierarchy depth
- Sub-tasks are nested recursively in `sub_tasks` array
- Parent-child relationship is implicit through nesting (no `parent_task_id` needed)
- Each level can have unlimited children
- Frontend should render with progressive indent (e.g., 20px per level)

**Example hierarchy:**
```
Campaign Q1 2026 (Level 1, ID: 1)
├─ Đại hàng hoa (Level 2, ID: 101)
│  └─ Chuẩn bị vật liệu (Level 3, ID: 1001)
│     └─ Đặt hàng hoa (Level 4, ID: 10001)
│        └─ Xác nhận đơn (Level 5, ID: 100001)
└─ Chụp hình (Level 2, ID: 102)
```

**Why nested structure without parent_task_id:**
- ✅ **Simpler**: Parent-child relationship is clear from nesting
- ✅ **No redundancy**: Don't need both `parent_task_id` AND `sub_tasks[]`
- ✅ **Frontend-friendly**: Ready-to-render tree structure
- ✅ **Cleaner JSON**: Less fields, easier to understand

**Backend Implementation:**
- Use recursive CTE (Common Table Expression) to fetch nested tasks
- Backend should limit depth to 5 levels maximum
- Return error if attempting to create task deeper than level 5

### Task Visibility & Permissions

**Approach: Task-Assignment Based (Simplified)**

**API Response:**
- API returns ALL tasks (parent + all sub-tasks) without filtering
- API includes `assignee` field in all sub-tasks for backend tracking
- Frontend applies display logic based on user context

**Frontend Display Rules:**

| User Scenario | Display Behavior |
|---------------|------------------|
| **Assigned to parent task** | Show full task hierarchy (parent + all sub-tasks) |
| **Assigned to sub-task only** | Show parent task (context) + assigned sub-task(s) |
| **Not assigned** | Apply grade-based filter (see Permission-based Data Access) |

**Parent Task Context Rule:**
- ✅ **Always show parent task** when user is assigned to any sub-task
- Parent task provides context (campaign/project understanding)
- Parent task displayed as read-only if user not assigned to it
- Helps user understand overall workflow and dependencies

**Assignee Field Display:**
- `assignee` field exists in API response
- **Frontend does NOT display assignee names** (no UI design requirement)
- Field reserved for future use or internal tracking only

**Implementation Summary:**
```typescript
// API: Returns all tasks with assignee field
// Frontend:
// - Does NOT display assignee names in UI
// - Filters display based on task assignments
// - Always shows parent task for context

const shouldShowTask = (task, currentUser) => {
  // Show if assigned to parent or any sub-task
  return isAssignedToTask(task, currentUser) ||
         hasAssignedSubTask(task, currentUser);
};
```

**Key Principles:**
1. **Simplicity**: No complex role-based visibility rules
2. **Context**: Parent task always visible for assigned users
3. **Privacy**: Assignee names not displayed in UI
4. **Flexibility**: API structure supports future enhancements

---

## 6. Related Documents

| Document | Path |
|----------|------|
| Task List Basic Spec | `docs/specs/ws/task-list-basic.md` |
| Task List Detail Spec | `docs/specs/ws/task-list-detail.md` |
| Job Grades Reference | `docs/specs/_shared/app-general-detail.md#10-job-grades--permissions-system` |

---

## 7. Notes

- API requires authentication via Bearer token
- User permissions are extracted from JWT token (staff_id, grade_code, grade_type)
- Response includes hierarchical tasks (parent tasks with sub_tasks array)
- Search is case-insensitive and supports partial matching
- All filters can be combined
