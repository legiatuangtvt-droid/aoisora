# OptiChain API Specification

**Version:** 1.0
**Base URL:** `https://api.optichain.com/api/v1`
**Content-Type:** `application/json`

---

## Table of Contents

1. [Authentication](#1-authentication)
2. [Staff Management](#2-staff-management)
3. [Task Management (WS)](#3-task-management-ws)
4. [Shift Management (DWS)](#4-shift-management-dws)
5. [Notifications](#5-notifications)
6. [Error Handling](#6-error-handling)

---

## 1. Authentication

### 1.1. Login

Authenticates a user and returns a JWT token.

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "username": "string (required)",
  "password": "string (required)"
}
```

**Response 200:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 1440,
  "staff_id": 1,
  "staff_name": "Nguyen Van A",
  "role": "manager"
}
```

**Response 401:**
```json
{
  "detail": "Incorrect email or password"
}
```

---

### 1.2. Get Current User

Returns the currently authenticated user's information.

**Endpoint:** `GET /auth/me`

**Headers:**
```
Authorization: Bearer <token>
```

**Response 200:**
```json
{
  "staff_id": 1,
  "staff_name": "Nguyen Van A",
  "staff_code": "NVA001",
  "email": "nguyen.van.a@optichain.com",
  "phone": "0901234567",
  "store_id": 1,
  "department_id": 12,
  "role": "manager",
  "is_active": true,
  "created_at": "2025-01-01T00:00:00Z",
  "updated_at": "2025-01-01T00:00:00Z",
  "store": {
    "store_id": 1,
    "store_name": "Store Hà Đông"
  },
  "department": {
    "department_id": 12,
    "department_name": "Marketing"
  }
}
```

---

### 1.3. Change Password

Changes the current user's password.

**Endpoint:** `POST /auth/change-password`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "current_password": "string (required)",
  "new_password": "string (required, min 6 characters)"
}
```

**Response 200:**
```json
{
  "message": "Password changed successfully"
}
```

**Response 400:**
```json
{
  "detail": "Current password is incorrect"
}
```

---

## 2. Staff Management

### 2.1. List Staff

Returns a list of staff members with optional filters.

**Endpoint:** `GET /staff`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| store_id | integer | No | Filter by store |
| department_id | integer | No | Filter by department |
| role | string | No | Filter by role (manager/supervisor/staff) |
| is_active | boolean | No | Filter by active status |
| skip | integer | No | Pagination offset (default: 0) |
| limit | integer | No | Pagination limit (default: 100) |

**Response 200:**
```json
[
  {
    "staff_id": 1,
    "staff_name": "Nguyen Van A",
    "staff_code": "NVA001",
    "email": "nguyen.van.a@optichain.com",
    "phone": "0901234567",
    "store_id": 1,
    "department_id": 12,
    "role": "manager",
    "is_active": true,
    "created_at": "2025-01-01T00:00:00Z",
    "updated_at": "2025-01-01T00:00:00Z"
  }
]
```

---

### 2.2. Get Staff by ID

Returns a specific staff member's details.

**Endpoint:** `GET /staff/{staff_id}`

**Response 200:**
```json
{
  "staff_id": 1,
  "staff_name": "Nguyen Van A",
  "staff_code": "NVA001",
  "email": "nguyen.van.a@optichain.com",
  "phone": "0901234567",
  "store_id": 1,
  "department_id": 12,
  "role": "manager",
  "is_active": true,
  "created_at": "2025-01-01T00:00:00Z",
  "updated_at": "2025-01-01T00:00:00Z",
  "store": {
    "store_id": 1,
    "store_name": "Store Hà Đông",
    "store_code": "HD001"
  },
  "department": {
    "department_id": 12,
    "department_name": "Marketing",
    "department_code": "MKT"
  }
}
```

---

### 2.3. Create Staff

Creates a new staff member.

**Endpoint:** `POST /staff`

**Request Body:**
```json
{
  "staff_name": "string (required)",
  "staff_code": "string (optional)",
  "email": "string (required, unique)",
  "phone": "string (optional)",
  "store_id": "integer (optional)",
  "department_id": "integer (optional)",
  "role": "string (optional, default: staff)",
  "password": "string (optional, min 6 characters)"
}
```

**Response 201:**
```json
{
  "staff_id": 37,
  "staff_name": "Tran Van B",
  "email": "tran.van.b@optichain.com",
  "role": "staff",
  "is_active": true,
  "created_at": "2025-01-15T10:00:00Z"
}
```

---

### 2.4. Update Staff

Updates an existing staff member.

**Endpoint:** `PUT /staff/{staff_id}`

**Request Body:**
```json
{
  "staff_name": "string (optional)",
  "staff_code": "string (optional)",
  "email": "string (optional)",
  "phone": "string (optional)",
  "store_id": "integer (optional)",
  "department_id": "integer (optional)",
  "role": "string (optional)",
  "is_active": "boolean (optional)"
}
```

**Response 200:**
```json
{
  "staff_id": 1,
  "staff_name": "Nguyen Van A Updated",
  "updated_at": "2025-01-15T10:00:00Z"
}
```

---

### 2.5. Delete Staff

Deletes a staff member (soft delete - sets is_active to false).

**Endpoint:** `DELETE /staff/{staff_id}`

**Response 200:**
```json
{
  "message": "Staff deleted successfully"
}
```

---

### 2.6. List Stores

Returns all stores.

**Endpoint:** `GET /staff/stores`

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| region_id | integer | No | Filter by region |
| status | string | No | Filter by status (active/inactive) |

**Response 200:**
```json
[
  {
    "store_id": 1,
    "store_name": "Store Hà Đông",
    "store_code": "HD001",
    "region_id": 1,
    "address": "123 Quang Trung, Hà Đông, Hà Nội",
    "phone": "024-1234567",
    "status": "active",
    "region": {
      "region_id": 1,
      "region_name": "Park"
    }
  }
]
```

---

### 2.7. List Departments

Returns all departments.

**Endpoint:** `GET /staff/departments`

**Response 200:**
```json
[
  {
    "department_id": 12,
    "department_name": "Marketing",
    "department_code": "MKT",
    "description": "Marketing department"
  }
]
```

---

### 2.8. List Regions

Returns all regions.

**Endpoint:** `GET /staff/regions`

**Response 200:**
```json
[
  {
    "region_id": 1,
    "region_name": "Park",
    "region_code": "PARK",
    "description": "Park area stores"
  }
]
```

---

## 3. Task Management (WS)

### 3.1. List Tasks

Returns tasks with optional filters.

**Endpoint:** `GET /tasks`

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| status_id | integer | No | Filter by status |
| assigned_staff_id | integer | No | Filter by assigned staff |
| assigned_store_id | integer | No | Filter by store |
| dept_id | integer | No | Filter by department |
| priority | string | No | Filter by priority (low/normal/high/urgent) |
| start_date | date | No | Filter by start date (YYYY-MM-DD) |
| end_date | date | No | Filter by end date (YYYY-MM-DD) |
| skip | integer | No | Pagination offset |
| limit | integer | No | Pagination limit (max: 100) |

**Response 200:**
```json
[
  {
    "task_id": 1,
    "task_name": "Kiểm kê hàng hóa",
    "task_description": "Kiểm kê kho hàng cuối ngày",
    "manual_id": 3,
    "task_type_id": 1,
    "response_type_id": 5,
    "is_repeat": false,
    "dept_id": 13,
    "assigned_store_id": 1,
    "assigned_staff_id": 5,
    "do_staff_id": null,
    "status_id": 7,
    "priority": "high",
    "start_date": "2025-01-15",
    "end_date": "2025-01-15",
    "due_datetime": "2025-01-15T18:00:00Z",
    "completed_time": null,
    "created_at": "2025-01-15T08:00:00Z",
    "status": {
      "code_master_id": 7,
      "code": "NOT_YET",
      "name": "Not Yet"
    },
    "assigned_staff": {
      "staff_id": 5,
      "staff_name": "Tran Van B"
    },
    "assigned_store": {
      "store_id": 1,
      "store_name": "Store Hà Đông"
    }
  }
]
```

---

### 3.2. Get Task by ID

Returns a specific task with full details.

**Endpoint:** `GET /tasks/{task_id}`

**Response 200:**
```json
{
  "task_id": 1,
  "task_name": "Kiểm kê hàng hóa",
  "task_description": "Kiểm kê kho hàng cuối ngày",
  "manual_id": 3,
  "task_type_id": 1,
  "response_type_id": 5,
  "response_num": null,
  "is_repeat": false,
  "repeat_config": null,
  "dept_id": 13,
  "assigned_store_id": 1,
  "assigned_staff_id": 5,
  "do_staff_id": null,
  "status_id": 7,
  "priority": "high",
  "start_date": "2025-01-15",
  "end_date": "2025-01-15",
  "start_time": "08:00:00",
  "due_datetime": "2025-01-15T18:00:00Z",
  "completed_time": null,
  "comment": null,
  "attachments": null,
  "created_staff_id": 1,
  "created_at": "2025-01-15T08:00:00Z",
  "updated_at": "2025-01-15T08:00:00Z",
  "manual": {
    "manual_id": 3,
    "manual_name": "Hướng dẫn kiểm kho",
    "manual_url": "https://docs.example.com/inventory"
  },
  "task_type": {
    "code_master_id": 1,
    "code": "STATISTICS",
    "name": "Thống kê"
  },
  "response_type": {
    "code_master_id": 5,
    "code": "CHECKLIST",
    "name": "Check-List"
  },
  "status": {
    "code_master_id": 7,
    "code": "NOT_YET",
    "name": "Not Yet"
  },
  "department": {
    "department_id": 13,
    "department_name": "Operations"
  },
  "assigned_store": {
    "store_id": 1,
    "store_name": "Store Hà Đông"
  },
  "assigned_staff": {
    "staff_id": 5,
    "staff_name": "Tran Van B"
  },
  "created_staff": {
    "staff_id": 1,
    "staff_name": "Nguyen Van A"
  },
  "checklists": [
    {
      "id": 1,
      "task_id": 1,
      "check_list_id": 1,
      "check_status": false,
      "completed_at": null,
      "completed_by": null,
      "notes": null,
      "check_list": {
        "check_list_id": 1,
        "check_list_name": "Check danh sách kho hàng"
      }
    }
  ]
}
```

---

### 3.3. Create Task

Creates a new task.

**Endpoint:** `POST /tasks`

**Request Body:**
```json
{
  "task_name": "string (required)",
  "task_description": "string (optional)",
  "manual_id": "integer (optional)",
  "task_type_id": "integer (optional)",
  "response_type_id": "integer (optional)",
  "is_repeat": "boolean (optional, default: false)",
  "repeat_config": "object (optional)",
  "dept_id": "integer (optional)",
  "assigned_store_id": "integer (optional)",
  "assigned_staff_id": "integer (optional)",
  "status_id": "integer (optional, default: 7 NOT_YET)",
  "priority": "string (optional, default: normal)",
  "start_date": "date (optional)",
  "end_date": "date (optional)",
  "start_time": "time (optional)",
  "due_datetime": "datetime (optional)"
}
```

**Response 201:**
```json
{
  "task_id": 11,
  "task_name": "New Task",
  "status_id": 7,
  "created_at": "2025-01-15T10:00:00Z"
}
```

---

### 3.4. Update Task

Updates an existing task.

**Endpoint:** `PUT /tasks/{task_id}`

**Request Body:**
```json
{
  "task_name": "string (optional)",
  "task_description": "string (optional)",
  "manual_id": "integer (optional)",
  "task_type_id": "integer (optional)",
  "response_type_id": "integer (optional)",
  "is_repeat": "boolean (optional)",
  "repeat_config": "object (optional)",
  "dept_id": "integer (optional)",
  "assigned_store_id": "integer (optional)",
  "assigned_staff_id": "integer (optional)",
  "do_staff_id": "integer (optional)",
  "status_id": "integer (optional)",
  "priority": "string (optional)",
  "start_date": "date (optional)",
  "end_date": "date (optional)",
  "start_time": "time (optional)",
  "due_datetime": "datetime (optional)",
  "completed_time": "datetime (optional)",
  "comment": "string (optional)",
  "attachments": "array of strings (optional)"
}
```

**Response 200:**
```json
{
  "task_id": 1,
  "task_name": "Updated Task",
  "updated_at": "2025-01-15T10:00:00Z"
}
```

---

### 3.5. Update Task Status

Updates only the status of a task. Creates a notification if status changes.

**Endpoint:** `PUT /tasks/{task_id}/status`

**Request Body:**
```json
{
  "status_id": "integer (required)",
  "comment": "string (optional)"
}
```

**Response 200:**
```json
{
  "task_id": 1,
  "status_id": 9,
  "status": {
    "code": "DONE",
    "name": "Done"
  },
  "updated_at": "2025-01-15T10:00:00Z"
}
```

---

### 3.6. Delete Task

Deletes a task.

**Endpoint:** `DELETE /tasks/{task_id}`

**Response 200:**
```json
{
  "message": "Task deleted successfully"
}
```

---

### 3.7. Get Task Checklists

Returns checklists for a specific task.

**Endpoint:** `GET /tasks/{task_id}/checklists`

**Response 200:**
```json
[
  {
    "id": 1,
    "task_id": 1,
    "check_list_id": 1,
    "check_status": false,
    "completed_at": null,
    "completed_by": null,
    "notes": null,
    "check_list": {
      "check_list_id": 1,
      "check_list_name": "Check danh sách kho hàng",
      "description": "Kiểm tra số lượng hàng trong kho"
    }
  }
]
```

---

### 3.8. Update Task Checklist

Updates a checklist item status.

**Endpoint:** `PUT /tasks/{task_id}/checklists/{checklist_id}`

**Request Body:**
```json
{
  "check_status": "boolean (required)",
  "notes": "string (optional)"
}
```

**Response 200:**
```json
{
  "id": 1,
  "check_status": true,
  "completed_at": "2025-01-15T10:00:00Z",
  "completed_by": 5,
  "notes": "Completed"
}
```

---

### 3.9. Get Code Master

Returns code master entries for lookups.

**Endpoint:** `GET /tasks/code-master`

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| code_type | string | No | Filter by type (task_type/response_type/status) |

**Response 200:**
```json
[
  {
    "code_master_id": 7,
    "code_type": "status",
    "code": "NOT_YET",
    "name": "Not Yet",
    "description": "Task not started",
    "sort_order": 1,
    "is_active": true
  }
]
```

---

## 4. Shift Management (DWS)

### 4.1. List Shift Codes

Returns all shift codes.

**Endpoint:** `GET /shifts/codes`

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| active_only | boolean | No | Return only active shift codes |

**Response 200:**
```json
[
  {
    "shift_code_id": 1,
    "shift_code": "S",
    "shift_name": "Ca Sáng",
    "start_time": "06:00:00",
    "end_time": "14:00:00",
    "duration_hours": 8.0,
    "color_code": "#FFD700",
    "is_active": true,
    "created_at": "2025-01-01T00:00:00Z"
  }
]
```

---

### 4.2. Create Shift Code

Creates a new shift code.

**Endpoint:** `POST /shifts/codes`

**Request Body:**
```json
{
  "shift_code": "string (required, unique)",
  "shift_name": "string (required)",
  "start_time": "time (required, HH:MM:SS)",
  "end_time": "time (required, HH:MM:SS)",
  "duration_hours": "number (optional)",
  "color_code": "string (optional, hex color)"
}
```

**Response 201:**
```json
{
  "shift_code_id": 6,
  "shift_code": "V812",
  "shift_name": "Ca V 8h từ 12:00",
  "start_time": "12:00:00",
  "end_time": "20:00:00",
  "duration_hours": 8.0,
  "color_code": "#4A90D9",
  "is_active": true,
  "created_at": "2025-01-15T10:00:00Z"
}
```

---

### 4.3. Update Shift Code

Updates an existing shift code.

**Endpoint:** `PUT /shifts/codes/{shift_code_id}`

**Request Body:**
```json
{
  "shift_code": "string (optional)",
  "shift_name": "string (optional)",
  "start_time": "time (optional)",
  "end_time": "time (optional)",
  "duration_hours": "number (optional)",
  "color_code": "string (optional)",
  "is_active": "boolean (optional)"
}
```

**Response 200:**
```json
{
  "shift_code_id": 1,
  "shift_code": "S",
  "shift_name": "Ca Sáng Updated",
  "is_active": true
}
```

---

### 4.4. Delete Shift Code

Deletes a shift code.

**Endpoint:** `DELETE /shifts/codes/{shift_code_id}`

**Response 200:**
```json
{
  "message": "Shift code deleted successfully"
}
```

---

### 4.5. Generate Default Shift Codes

Creates default shift codes (S, C, T, OFF, FULL).

**Endpoint:** `POST /shifts/codes/generate`

**Response 201:**
```json
[
  {
    "shift_code_id": 1,
    "shift_code": "S",
    "shift_name": "Ca Sáng",
    "start_time": "06:00:00",
    "end_time": "14:00:00",
    "duration_hours": 8.0,
    "color_code": "#FFD700"
  },
  {
    "shift_code_id": 2,
    "shift_code": "C",
    "shift_name": "Ca Chiều",
    "start_time": "14:00:00",
    "end_time": "22:00:00",
    "duration_hours": 8.0,
    "color_code": "#87CEEB"
  }
]
```

---

### 4.6. List Shift Assignments

Returns shift assignments with optional filters.

**Endpoint:** `GET /shifts/assignments`

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| staff_id | integer | No | Filter by staff |
| store_id | integer | No | Filter by store |
| start_date | date | No | Filter by start date |
| end_date | date | No | Filter by end date |
| status | string | No | Filter by status |

**Response 200:**
```json
[
  {
    "assignment_id": 1,
    "staff_id": 5,
    "store_id": 1,
    "shift_date": "2025-01-15",
    "shift_code_id": 1,
    "status": "assigned",
    "notes": null,
    "assigned_by": 1,
    "assigned_at": "2025-01-14T10:00:00Z",
    "staff": {
      "staff_id": 5,
      "staff_name": "Tran Van B"
    },
    "store": {
      "store_id": 1,
      "store_name": "Store Hà Đông"
    },
    "shift_code": {
      "shift_code_id": 1,
      "shift_code": "S",
      "shift_name": "Ca Sáng",
      "start_time": "06:00:00",
      "end_time": "14:00:00",
      "duration_hours": 8.0
    }
  }
]
```

---

### 4.7. Create Shift Assignment

Creates a single shift assignment.

**Endpoint:** `POST /shifts/assignments`

**Request Body:**
```json
{
  "staff_id": "integer (required)",
  "store_id": "integer (optional)",
  "shift_date": "date (required, YYYY-MM-DD)",
  "shift_code_id": "integer (required)",
  "notes": "string (optional)"
}
```

**Response 201:**
```json
{
  "assignment_id": 8,
  "staff_id": 5,
  "shift_date": "2025-01-16",
  "shift_code_id": 1,
  "status": "assigned",
  "assigned_at": "2025-01-15T10:00:00Z"
}
```

---

### 4.8. Create Bulk Shift Assignments

Creates multiple shift assignments at once.

**Endpoint:** `POST /shifts/assignments/bulk`

**Request Body:**
```json
{
  "staff_ids": ["array of integers (required)"],
  "store_id": "integer (optional)",
  "shift_dates": ["array of dates (required, YYYY-MM-DD)"],
  "shift_code_id": "integer (required)",
  "notes": "string (optional)"
}
```

**Example:**
```json
{
  "staff_ids": [5, 6, 7],
  "store_id": 1,
  "shift_dates": ["2025-01-15", "2025-01-16", "2025-01-17"],
  "shift_code_id": 1,
  "notes": "Ca tăng cường cuối tuần"
}
```

**Response 201:**
```json
{
  "created": 9,
  "skipped": 0,
  "assignments": [
    {
      "assignment_id": 8,
      "staff_id": 5,
      "shift_date": "2025-01-15"
    }
  ]
}
```

---

### 4.9. Update Shift Assignment

Updates an existing shift assignment.

**Endpoint:** `PUT /shifts/assignments/{assignment_id}`

**Request Body:**
```json
{
  "store_id": "integer (optional)",
  "shift_code_id": "integer (optional)",
  "status": "string (optional)",
  "notes": "string (optional)"
}
```

**Response 200:**
```json
{
  "assignment_id": 1,
  "shift_code_id": 2,
  "status": "confirmed"
}
```

---

### 4.10. Delete Shift Assignment

Deletes a shift assignment.

**Endpoint:** `DELETE /shifts/assignments/{assignment_id}`

**Response 200:**
```json
{
  "message": "Shift assignment deleted successfully"
}
```

---

### 4.11. Get Weekly Schedule

Returns the weekly schedule for all staff in a store.

**Endpoint:** `GET /shifts/weekly-schedule`

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| store_id | integer | No | Filter by store |
| start_date | date | Yes | Week start date |
| end_date | date | Yes | Week end date |

**Response 200:**
```json
[
  {
    "staff": {
      "staff_id": 5,
      "staff_name": "Tran Van B",
      "role": "staff"
    },
    "assignments": {
      "2025-01-13": {
        "assignment_id": 1,
        "shift_code": "S",
        "shift_name": "Ca Sáng"
      },
      "2025-01-14": {
        "assignment_id": 2,
        "shift_code": "S",
        "shift_name": "Ca Sáng"
      },
      "2025-01-15": null,
      "2025-01-16": {
        "assignment_id": 3,
        "shift_code": "C",
        "shift_name": "Ca Chiều"
      },
      "2025-01-17": {
        "assignment_id": 4,
        "shift_code": "C",
        "shift_name": "Ca Chiều"
      },
      "2025-01-18": {
        "assignment_id": 5,
        "shift_code": "OFF",
        "shift_name": "Nghỉ"
      },
      "2025-01-19": {
        "assignment_id": 6,
        "shift_code": "OFF",
        "shift_name": "Nghỉ"
      }
    }
  }
]
```

---

### 4.12. Get Man-hour Report

Returns man-hour summary for a specific date.

**Endpoint:** `GET /shifts/man-hour-report`

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| date | date | Yes | Report date |
| store_id | integer | No | Filter by store |

**Response 200:**
```json
[
  {
    "date": "2025-01-15",
    "store_id": 1,
    "store_name": "Store Hà Đông",
    "total_hours": 72.0,
    "target_hours": 80.0,
    "difference": -8.0,
    "status": "THIẾU",
    "staff_count": 9
  },
  {
    "date": "2025-01-15",
    "store_id": 2,
    "store_name": "Store Cầu Giấy",
    "total_hours": 80.0,
    "target_hours": 80.0,
    "difference": 0.0,
    "status": "ĐẠT CHUẨN",
    "staff_count": 10
  }
]
```

---

## 5. Notifications

### 5.1. List Notifications

Returns notifications for the current user.

**Endpoint:** `GET /notifications`

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| is_read | boolean | No | Filter by read status |
| notification_type | string | No | Filter by type |
| skip | integer | No | Pagination offset |
| limit | integer | No | Pagination limit (default: 20) |

**Response 200:**
```json
{
  "notifications": [
    {
      "notification_id": 1,
      "recipient_staff_id": 5,
      "sender_staff_id": 1,
      "notification_type": "task_assigned",
      "title": "New Task Assigned",
      "message": "You have been assigned a new task: Kiểm kê hàng hóa",
      "link_url": "/tasks/1",
      "is_read": false,
      "read_at": null,
      "created_at": "2025-01-15T08:00:00Z"
    }
  ],
  "total": 10,
  "unread_count": 3
}
```

---

### 5.2. Get Unread Count

Returns the count of unread notifications.

**Endpoint:** `GET /notifications/unread-count`

**Response 200:**
```json
{
  "count": 5
}
```

---

### 5.3. Mark as Read

Marks a notification as read.

**Endpoint:** `PUT /notifications/{notification_id}/read`

**Response 200:**
```json
{
  "notification_id": 1,
  "is_read": true,
  "read_at": "2025-01-15T10:00:00Z"
}
```

---

### 5.4. Mark All as Read

Marks all notifications as read.

**Endpoint:** `PUT /notifications/mark-all-read`

**Response 200:**
```json
{
  "message": "Marked 5 notifications as read"
}
```

---

### 5.5. Delete Notification

Deletes a notification.

**Endpoint:** `DELETE /notifications/{notification_id}`

**Response 200:**
```json
{
  "message": "Notification deleted successfully"
}
```

---

### 5.6. Clear Read Notifications

Deletes all read notifications.

**Endpoint:** `DELETE /notifications/clear-read`

**Response 200:**
```json
{
  "message": "Deleted 10 read notifications"
}
```

---

## 6. Error Handling

### 6.1. Error Response Format

All error responses follow this format:

```json
{
  "detail": "Error message describing what went wrong"
}
```

### 6.2. HTTP Status Codes

| Code | Name | Description |
|------|------|-------------|
| 200 | OK | Successful request |
| 201 | Created | Resource created successfully |
| 204 | No Content | Successful request with no body |
| 400 | Bad Request | Invalid request data |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource already exists |
| 422 | Unprocessable Entity | Validation error |
| 500 | Internal Server Error | Server error |

### 6.3. Common Error Messages

```json
// 401 - Authentication errors
{"detail": "Not authenticated"}
{"detail": "Incorrect email or password"}
{"detail": "Token has expired"}
{"detail": "Invalid token"}

// 403 - Authorization errors
{"detail": "Access denied"}
{"detail": "Insufficient permissions"}

// 404 - Not found errors
{"detail": "Staff not found"}
{"detail": "Task not found"}
{"detail": "Shift code not found"}

// 409 - Conflict errors
{"detail": "Email already registered"}
{"detail": "Shift code already exists"}
{"detail": "Assignment already exists"}

// 422 - Validation errors
{
  "detail": [
    {
      "loc": ["body", "email"],
      "msg": "value is not a valid email address",
      "type": "value_error.email"
    }
  ]
}
```

---

## Appendix

### A. Notification Types

| Type | Description | Trigger |
|------|-------------|---------|
| task_assigned | New task assigned | Task created with assigned_staff_id |
| task_status_changed | Task status updated | PUT /tasks/{id}/status |
| task_completed | Task marked as done | Status changed to DONE |
| shift_assigned | New shift assigned | Shift assignment created |
| shift_changed | Shift modified | Shift assignment updated |

### B. Task Status Values

| ID | Code | Name |
|----|------|------|
| 7 | NOT_YET | Not Yet |
| 8 | DRAFT | Draft |
| 9 | DONE | Done |

### C. Shift Assignment Status Values

| Value | Description |
|-------|-------------|
| assigned | Initial state after creation |
| confirmed | Staff confirmed the assignment |
| completed | Shift completed |
| cancelled | Assignment cancelled |

---

*API Version 1.0 - Last Updated: 2026-01-03*
