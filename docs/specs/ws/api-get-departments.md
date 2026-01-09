# API Specification: Get Departments

> **API Name**: screen_task_list_departments_api
> **Method**: GET
> **Endpoint**: `/api/v1/departments`
> **Module**: WS (Task from HQ)
> **Last Updated**: 2026-01-09

---

## 1. Param

### HeaderParam

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `userId` | integer | Yes | User ID from token |
| `token` | string | Yes | JWT token |

**Note for Dev Team**: This API requires authentication via **Bearer token** in `Authorization` header. Although department data is not sensitive, authentication is required to maintain consistency with other APIs and ensure only internal users can access company organization structure.

**Example**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `is_active` | boolean | No | true | Filter by active status |
| `parent_id` | integer | No | - | Filter by parent department ID (null = root departments only) |

---

## 2. description

This API retrieves the list of departments for use in filters and dropdowns across the application. The API returns all active departments by default, ordered by `sort_order` and `department_id`.

**Use Cases**:
- Populate department filter dropdown in Task List screen
- Show department options in Add Task form
- Display department hierarchy in organization views

---

## 3. SQL

SQL query implementation:

```sql
-- Get departments list
SELECT
    d.department_id,
    d.department_name,
    d.department_code,
    d.description,
    d.parent_id,
    d.sort_order,
    d.icon,
    d.icon_color,
    d.icon_bg,
    d.is_active
FROM departments d
WHERE 1=1
    -- Active filter (default: only active)
    AND (d.is_active = :is_active OR :is_active IS NULL)

    -- Parent filter (optional)
    AND (d.parent_id = :parent_id OR :parent_id IS NULL)

ORDER BY d.sort_order ASC, d.department_id ASC;
```

---

## 4. return

### HTTPstatus: 200

#### object

Response structure:

```json
{
  "success": true,
  "data": [
    {
      "department_id": 1,
      "department_name": "Marketing",
      "department_code": "MKT",
      "description": "Marketing Department",
      "parent_id": null,
      "sort_order": 1,
      "icon": "marketing",
      "icon_color": "#FF5733",
      "icon_bg": "#FFF0ED",
      "is_active": true
    },
    {
      "department_id": 2,
      "department_name": "Sales",
      "department_code": "SALES",
      "description": "Sales Department",
      "parent_id": null,
      "sort_order": 2,
      "icon": "sales",
      "icon_color": "#33A1FF",
      "icon_bg": "#E6F4FF",
      "is_active": true
    },
    {
      "department_id": 3,
      "department_name": "Digital Marketing",
      "department_code": "DMKT",
      "description": "Digital Marketing Team",
      "parent_id": 1,
      "sort_order": 1,
      "icon": "digital",
      "icon_color": "#9B59B6",
      "icon_bg": "#F5EEF8",
      "is_active": true
    }
  ]
}
```

#### Response Fields

| Field | Type | Max Length | Description |
|-------|------|------------|-------------|
| `department_id` | integer | - | Department ID (Primary Key) |
| `department_name` | text | 255 chars | Department name |
| `department_code` | text | 50 chars | Unique department code |
| `description` | text | - | Department description |
| `parent_id` | integer | - | Parent department ID (null if root) |
| `sort_order` | integer | - | Display order |
| `icon` | text | 50 chars | Icon identifier |
| `icon_color` | text | 20 chars | Icon color (hex code) |
| `icon_bg` | text | 50 chars | Icon background color (hex code) |
| `is_active` | boolean | - | Active status |

### Error Responses

#### 500 - Internal Server Error

```json
{
  "success": false,
  "message": "Internal server error"
}
```

#### 401 - Unauthorized

```json
{
  "success": false,
  "message": "Unauthenticated"
}
```

#### 404 - Not Found

```json
{
  "success": false,
  "message": "Resource not found"
}
```

---

## 5. Business Logic

### Default Behavior

- Returns **all active departments** if no parameters provided
- Ordered by `sort_order` ASC, then `department_id` ASC
- No pagination (departments list is typically small)

### Hierarchical Structure

Departments support hierarchical structure via `parent_id`:

| parent_id Value | Meaning |
|-----------------|---------|
| `null` | Root/top-level department |
| `integer` | Child of department with that ID |

**Example Hierarchy**:
```
Marketing (parent_id: null)
├── Digital Marketing (parent_id: 1)
├── Brand Marketing (parent_id: 1)
└── Content Marketing (parent_id: 1)

Sales (parent_id: null)
├── B2B Sales (parent_id: 2)
└── B2C Sales (parent_id: 2)
```

### Frontend Usage

For Task List filter dropdown, frontend should:
1. Call this API on page load
2. Cache the result (departments rarely change)
3. Build tree structure from flat list using `parent_id`

---

## 6. Related Documents

| Document | Path |
|----------|------|
| Task List Basic Spec | `docs/specs/ws/task-list-basic.md` |
| Task List Detail Spec | `docs/specs/ws/task-list-detail.md` |
| Get Task List API | `docs/specs/ws/api-get-task-list.md` |

---

## 7. Notes

- This API **requires authentication** (Bearer token)
- Response is a flat array - frontend builds hierarchy using `parent_id`
- Department icons are used in Task List to visually identify departments
- Consider caching on frontend as department list rarely changes
- Currently no Resource class - returns raw model data

---

## 8. Database Schema Reference

```sql
CREATE TABLE "departments" (
    "department_id" SERIAL PRIMARY KEY,
    "department_name" VARCHAR(255) NOT NULL,
    "department_code" VARCHAR(50) UNIQUE,
    "description" TEXT,
    "parent_id" INTEGER,
    "sort_order" INTEGER DEFAULT 0,
    "icon" VARCHAR(50),
    "icon_color" VARCHAR(20),
    "icon_bg" VARCHAR(50),
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE "departments" ADD CONSTRAINT "fk_departments_parent"
    FOREIGN KEY ("parent_id") REFERENCES "departments"("department_id") ON DELETE SET NULL;
```

---

## 9. Changelog

| Date | Changes |
|------|---------|
| 2026-01-09 | Initial API specification created |
