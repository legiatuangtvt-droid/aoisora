# API Specification: Get Task List

> **API Name**: screen_task_list_api
> **Method**: GET
> **Endpoint**: `/api/v1/tasks`
> **Module**: WS (Task from HQ)
> **Last Updated**: 2026-01-08

---

## 1. Param

### HeaderParam

**Note for Dev Team**: API yêu cầu authentication qua **Bearer token** trong header `Authorization`. Token này đã chứa tất cả thông tin user (staff_id, grade_code, grade_type, department_id, store_id, etc.). Backend sẽ tự động decode token để lấy thông tin user và apply permission filter. Frontend **KHÔNG CẦN** gửi thêm userId hay token riêng.

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
| `department_id[]` | integer[] | No | - | Filter by departments (multi-select) |
| `status[]` | string[] | No | - | Filter by status (NOT_YET, DONE, DRAFT) |
| `hq_check[]` | string[] | No | - | Filter by HQ check status |
| `limit` | integer | No | 10 | Items per page |
| `offset` | integer | No | 1 | Page number |

---

## 2. description

Mô tả chức năng của API:

API này dùng để lấy danh sách task groups với khả năng:
- Lọc theo ngày (start/end date)
- Tìm kiếm theo tên task hoặc department
- Lọc theo department, status, hq_check
- Phân trang với limit/offset
- Tự động filter theo quyền của user (grade_code + grade_type từ JWT token)

---

## 3. SQL

File SQL mã số máy:

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

## 4. return

### HTTPstatus: 200, 201

#### object

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
        "sub_tasks": []
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
| `sub_tasks` | array | - | Child tasks (if any) |

### Error Responses

#### 500 - Internal Server Error

```json
{
  "success": false,
  "message": "Internal server error"
}
```

#### 404 - Not Found

```json
{
  "success": false,
  "message": "Resource not found"
}
```

#### 400 - Bad Request

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

#### 304 - Not Modified

```json
{
  "success": true,
  "message": "Data not modified"
}
```

#### 301 - Moved Permanently

```json
{
  "success": false,
  "message": "Resource moved permanently",
  "redirect_url": "/api/v2/tasks"
}
```

### start>end

Validation message when start date is after end date:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "start": ["Start date must be before or equal to end date"]
  }
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
