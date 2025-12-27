# OptiChain API - Danh Sach Chuc Nang (Function List)

**Phien ban:** 1.0
**Base URL:** `https://api.optichain.com/api/v1`
**Ngay cap nhat:** 2025-12-27

---

## Muc Luc

1. [Authentication (Xac thuc)](#1-authentication-xác-thực)
2. [Staff Management (Quan ly nhan su)](#2-staff-management-quản-lý-nhân-sự)
3. [Store & Department (Cua hang & Phong ban)](#3-store--department-cửa-hàng--phòng-ban)
4. [Task Management - WS (Quan ly cong viec)](#4-task-management---ws-quản-lý-công-việc)
5. [Shift Management - DWS (Quan ly ca lam viec)](#5-shift-management---dws-quản-lý-ca-làm-việc)
6. [Notifications (Thong bao)](#6-notifications-thông-báo)

---

## 1. Authentication (Xac thuc)

### 1.1. Dang nhap (Login)

| Thuoc tinh | Gia tri |
|------------|---------|
| **Chuc nang** | Xac thuc nguoi dung va lay token JWT |
| **Endpoint** | `POST /auth/login` |
| **Phan quyen** | Khong can |

**INPUT:**
| Truong | Kieu | Bat buoc | Mo ta |
|--------|------|----------|-------|
| email | string | Co | Dia chi email dang ky |
| password | string | Co | Mat khau |

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**OUTPUT (Thanh cong - 200):**
| Truong | Kieu | Mo ta |
|--------|------|-------|
| access_token | string | JWT token de xac thuc |
| token_type | string | Loai token (bearer) |
| expires_in | integer | Thoi gian het han (phut) |
| staff_id | integer | ID nhan vien |
| staff_name | string | Ten nhan vien |
| role | string | Vai tro (manager/supervisor/staff) |

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

**OUTPUT (Loi - 401):**
```json
{
  "detail": "Incorrect email or password"
}
```

---

### 1.2. Lay thong tin nguoi dung hien tai (Get Current User)

| Thuoc tinh | Gia tri |
|------------|---------|
| **Chuc nang** | Lay thong tin chi tiet cua nguoi dung dang dang nhap |
| **Endpoint** | `GET /auth/me` |
| **Phan quyen** | Can token |

**INPUT:**
- Header: `Authorization: Bearer <token>`

**OUTPUT (Thanh cong - 200):**
| Truong | Kieu | Mo ta |
|--------|------|-------|
| staff_id | integer | ID nhan vien |
| staff_name | string | Ten nhan vien |
| staff_code | string | Ma nhan vien |
| email | string | Email |
| phone | string | So dien thoai |
| store_id | integer | ID cua hang |
| department_id | integer | ID phong ban |
| role | string | Vai tro |
| is_active | boolean | Trang thai hoat dong |
| store | object | Thong tin cua hang |
| department | object | Thong tin phong ban |

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
  "store": {
    "store_id": 1,
    "store_name": "Store Ha Dong"
  },
  "department": {
    "department_id": 12,
    "department_name": "Marketing"
  }
}
```

---

### 1.3. Doi mat khau (Change Password)

| Thuoc tinh | Gia tri |
|------------|---------|
| **Chuc nang** | Doi mat khau cho nguoi dung hien tai |
| **Endpoint** | `POST /auth/change-password` |
| **Phan quyen** | Can token |

**INPUT:**
| Truong | Kieu | Bat buoc | Mo ta |
|--------|------|----------|-------|
| current_password | string | Co | Mat khau hien tai |
| new_password | string | Co | Mat khau moi (toi thieu 6 ky tu) |

```json
{
  "current_password": "old_password",
  "new_password": "new_password123"
}
```

**OUTPUT (Thanh cong - 200):**
```json
{
  "message": "Password changed successfully"
}
```

---

## 2. Staff Management (Quan ly nhan su)

### 2.1. Lay danh sach nhan vien (List Staff)

| Thuoc tinh | Gia tri |
|------------|---------|
| **Chuc nang** | Lay danh sach nhan vien theo bo loc |
| **Endpoint** | `GET /staff` |
| **Phan quyen** | Can token |

**INPUT (Query Parameters):**
| Truong | Kieu | Bat buoc | Mo ta |
|--------|------|----------|-------|
| store_id | integer | Khong | Loc theo cua hang |
| department_id | integer | Khong | Loc theo phong ban |
| role | string | Khong | Loc theo vai tro |
| is_active | boolean | Khong | Loc theo trang thai |
| skip | integer | Khong | Bo qua N ban ghi (mac dinh: 0) |
| limit | integer | Khong | Gioi han so ban ghi (mac dinh: 100) |

**OUTPUT (Thanh cong - 200):**
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
    "created_at": "2025-01-01T00:00:00Z"
  }
]
```

---

### 2.2. Lay chi tiet nhan vien (Get Staff by ID)

| Thuoc tinh | Gia tri |
|------------|---------|
| **Chuc nang** | Lay thong tin chi tiet mot nhan vien |
| **Endpoint** | `GET /staff/{staff_id}` |
| **Phan quyen** | Can token |

**INPUT:**
| Truong | Kieu | Bat buoc | Mo ta |
|--------|------|----------|-------|
| staff_id | integer | Co | ID nhan vien (path param) |

**OUTPUT (Thanh cong - 200):**
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
  "store": {
    "store_id": 1,
    "store_name": "Store Ha Dong",
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

### 2.3. Tao nhan vien moi (Create Staff)

| Thuoc tinh | Gia tri |
|------------|---------|
| **Chuc nang** | Tao moi mot nhan vien |
| **Endpoint** | `POST /staff` |
| **Phan quyen** | Can token (Manager) |

**INPUT:**
| Truong | Kieu | Bat buoc | Mo ta |
|--------|------|----------|-------|
| staff_name | string | Co | Ten nhan vien |
| staff_code | string | Khong | Ma nhan vien |
| email | string | Co | Email (khong trung) |
| phone | string | Khong | So dien thoai |
| store_id | integer | Khong | ID cua hang |
| department_id | integer | Khong | ID phong ban |
| role | string | Khong | Vai tro (mac dinh: staff) |
| password | string | Khong | Mat khau (toi thieu 6 ky tu) |

```json
{
  "staff_name": "Tran Van B",
  "email": "tran.van.b@optichain.com",
  "phone": "0912345678",
  "store_id": 1,
  "department_id": 12,
  "role": "staff",
  "password": "password123"
}
```

**OUTPUT (Thanh cong - 201):**
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

### 2.4. Cap nhat nhan vien (Update Staff)

| Thuoc tinh | Gia tri |
|------------|---------|
| **Chuc nang** | Cap nhat thong tin nhan vien |
| **Endpoint** | `PUT /staff/{staff_id}` |
| **Phan quyen** | Can token (Manager) |

**INPUT:**
| Truong | Kieu | Bat buoc | Mo ta |
|--------|------|----------|-------|
| staff_id | integer | Co | ID nhan vien (path param) |
| staff_name | string | Khong | Ten nhan vien |
| staff_code | string | Khong | Ma nhan vien |
| email | string | Khong | Email |
| phone | string | Khong | So dien thoai |
| store_id | integer | Khong | ID cua hang |
| department_id | integer | Khong | ID phong ban |
| role | string | Khong | Vai tro |
| is_active | boolean | Khong | Trang thai hoat dong |

```json
{
  "staff_name": "Nguyen Van A Updated",
  "role": "supervisor"
}
```

**OUTPUT (Thanh cong - 200):**
```json
{
  "staff_id": 1,
  "staff_name": "Nguyen Van A Updated",
  "role": "supervisor",
  "updated_at": "2025-01-15T10:00:00Z"
}
```

---

### 2.5. Xoa nhan vien (Delete Staff)

| Thuoc tinh | Gia tri |
|------------|---------|
| **Chuc nang** | Xoa nhan vien (soft delete) |
| **Endpoint** | `DELETE /staff/{staff_id}` |
| **Phan quyen** | Can token (Manager) |

**INPUT:**
| Truong | Kieu | Bat buoc | Mo ta |
|--------|------|----------|-------|
| staff_id | integer | Co | ID nhan vien (path param) |

**OUTPUT (Thanh cong - 200):**
```json
{
  "message": "Staff deleted successfully"
}
```

---

## 3. Store & Department (Cua hang & Phong ban)

### 3.1. Lay danh sach cua hang (List Stores)

| Thuoc tinh | Gia tri |
|------------|---------|
| **Chuc nang** | Lay danh sach tat ca cua hang |
| **Endpoint** | `GET /staff/stores` |
| **Phan quyen** | Can token |

**INPUT (Query Parameters):**
| Truong | Kieu | Bat buoc | Mo ta |
|--------|------|----------|-------|
| region_id | integer | Khong | Loc theo vung |
| status | string | Khong | Loc theo trang thai |

**OUTPUT (Thanh cong - 200):**
```json
[
  {
    "store_id": 1,
    "store_name": "Store Ha Dong",
    "store_code": "HD001",
    "region_id": 1,
    "address": "123 Quang Trung, Ha Dong, Ha Noi",
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

### 3.2. Lay danh sach phong ban (List Departments)

| Thuoc tinh | Gia tri |
|------------|---------|
| **Chuc nang** | Lay danh sach tat ca phong ban |
| **Endpoint** | `GET /staff/departments` |
| **Phan quyen** | Can token |

**INPUT:** Khong co

**OUTPUT (Thanh cong - 200):**
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

### 3.3. Lay danh sach vung (List Regions)

| Thuoc tinh | Gia tri |
|------------|---------|
| **Chuc nang** | Lay danh sach tat ca vung/khu vuc |
| **Endpoint** | `GET /staff/regions` |
| **Phan quyen** | Can token |

**INPUT:** Khong co

**OUTPUT (Thanh cong - 200):**
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

## 4. Task Management - WS (Quan ly cong viec)

### 4.1. Lay danh sach cong viec (List Tasks)

| Thuoc tinh | Gia tri |
|------------|---------|
| **Chuc nang** | Lay danh sach cong viec theo bo loc |
| **Endpoint** | `GET /tasks` |
| **Phan quyen** | Can token |

**INPUT (Query Parameters):**
| Truong | Kieu | Bat buoc | Mo ta |
|--------|------|----------|-------|
| status_id | integer | Khong | Loc theo trang thai (7=NOT_YET, 8=ON_PROGRESS, 9=DONE, 10=OVERDUE, 11=REJECT) |
| assigned_staff_id | integer | Khong | Loc theo nguoi duoc giao |
| assigned_store_id | integer | Khong | Loc theo cua hang |
| dept_id | integer | Khong | Loc theo phong ban |
| priority | string | Khong | Loc theo uu tien (low/normal/high/urgent) |
| start_date | date | Khong | Loc tu ngay (YYYY-MM-DD) |
| end_date | date | Khong | Loc den ngay (YYYY-MM-DD) |
| skip | integer | Khong | Bo qua N ban ghi |
| limit | integer | Khong | Gioi han so ban ghi (toi da: 100) |

**OUTPUT (Thanh cong - 200):**
```json
[
  {
    "task_id": 1,
    "task_name": "Kiem ke hang hoa",
    "task_description": "Kiem ke kho hang cuoi ngay",
    "status_id": 7,
    "priority": "high",
    "start_date": "2025-01-15",
    "end_date": "2025-01-15",
    "due_datetime": "2025-01-15T18:00:00Z",
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
      "store_name": "Store Ha Dong"
    }
  }
]
```

---

### 4.2. Lay chi tiet cong viec (Get Task by ID)

| Thuoc tinh | Gia tri |
|------------|---------|
| **Chuc nang** | Lay thong tin chi tiet mot cong viec |
| **Endpoint** | `GET /tasks/{task_id}` |
| **Phan quyen** | Can token |

**INPUT:**
| Truong | Kieu | Bat buoc | Mo ta |
|--------|------|----------|-------|
| task_id | integer | Co | ID cong viec (path param) |

**OUTPUT (Thanh cong - 200):**
```json
{
  "task_id": 1,
  "task_name": "Kiem ke hang hoa",
  "task_description": "Kiem ke kho hang cuoi ngay",
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
  "comment": null,
  "attachments": null,
  "manual": {
    "manual_id": 3,
    "manual_name": "Huong dan kiem kho"
  },
  "task_type": {
    "code_master_id": 1,
    "name": "Thong ke"
  },
  "response_type": {
    "code_master_id": 5,
    "name": "Check-List"
  },
  "status": {
    "code_master_id": 7,
    "name": "Not Yet"
  },
  "department": {
    "department_id": 13,
    "department_name": "Operations"
  },
  "assigned_store": {
    "store_id": 1,
    "store_name": "Store Ha Dong"
  },
  "assigned_staff": {
    "staff_id": 5,
    "staff_name": "Tran Van B"
  },
  "checklists": [
    {
      "id": 1,
      "task_id": 1,
      "check_list_id": 1,
      "check_status": false,
      "check_list": {
        "check_list_id": 1,
        "check_list_name": "Check danh sach kho hang"
      }
    }
  ]
}
```

---

### 4.3. Tao cong viec moi (Create Task)

| Thuoc tinh | Gia tri |
|------------|---------|
| **Chuc nang** | Tao moi mot cong viec |
| **Endpoint** | `POST /tasks` |
| **Phan quyen** | Can token (Manager/Supervisor) |

**INPUT:**
| Truong | Kieu | Bat buoc | Mo ta |
|--------|------|----------|-------|
| task_name | string | Co | Ten cong viec |
| task_description | string | Khong | Mo ta chi tiet |
| manual_id | integer | Khong | ID huong dan |
| task_type_id | integer | Khong | ID loai cong viec |
| response_type_id | integer | Khong | ID kieu phan hoi |
| is_repeat | boolean | Khong | Co lap lai khong (mac dinh: false) |
| repeat_config | object | Khong | Cau hinh lap lai |
| dept_id | integer | Khong | ID phong ban |
| assigned_store_id | integer | Khong | ID cua hang |
| assigned_staff_id | integer | Khong | ID nguoi thuc hien |
| status_id | integer | Khong | ID trang thai (mac dinh: 7 NOT_YET) |
| priority | string | Khong | Muc uu tien (mac dinh: normal) |
| start_date | date | Khong | Ngay bat dau |
| end_date | date | Khong | Ngay ket thuc |
| start_time | time | Khong | Gio bat dau |
| due_datetime | datetime | Khong | Han hoan thanh |

```json
{
  "task_name": "Kiem ke hang hoa",
  "task_description": "Kiem ke kho hang cuoi ngay",
  "assigned_store_id": 1,
  "assigned_staff_id": 5,
  "priority": "high",
  "start_date": "2025-01-15",
  "end_date": "2025-01-15",
  "due_datetime": "2025-01-15T18:00:00Z"
}
```

**OUTPUT (Thanh cong - 201):**
```json
{
  "task_id": 11,
  "task_name": "Kiem ke hang hoa",
  "status_id": 7,
  "created_at": "2025-01-15T10:00:00Z"
}
```

---

### 4.4. Cap nhat cong viec (Update Task)

| Thuoc tinh | Gia tri |
|------------|---------|
| **Chuc nang** | Cap nhat thong tin cong viec |
| **Endpoint** | `PUT /tasks/{task_id}` |
| **Phan quyen** | Can token |

**INPUT:**
| Truong | Kieu | Bat buoc | Mo ta |
|--------|------|----------|-------|
| task_id | integer | Co | ID cong viec (path param) |
| task_name | string | Khong | Ten cong viec |
| task_description | string | Khong | Mo ta |
| status_id | integer | Khong | Trang thai |
| priority | string | Khong | Muc uu tien |
| comment | string | Khong | Ghi chu |
| attachments | array | Khong | Danh sach file dinh kem |

```json
{
  "task_description": "Cap nhat mo ta",
  "priority": "urgent",
  "comment": "Can xu ly gap"
}
```

**OUTPUT (Thanh cong - 200):**
```json
{
  "task_id": 1,
  "task_name": "Kiem ke hang hoa",
  "updated_at": "2025-01-15T10:00:00Z"
}
```

---

### 4.5. Cap nhat trang thai cong viec (Update Task Status)

| Thuoc tinh | Gia tri |
|------------|---------|
| **Chuc nang** | Cap nhat trang thai cong viec va tao thong bao |
| **Endpoint** | `PUT /tasks/{task_id}/status` |
| **Phan quyen** | Can token |

**INPUT:**
| Truong | Kieu | Bat buoc | Mo ta |
|--------|------|----------|-------|
| task_id | integer | Co | ID cong viec (path param) |
| status_id | integer | Co | ID trang thai moi |
| comment | string | Khong | Ghi chu |

```json
{
  "status_id": 9,
  "comment": "Da hoan thanh"
}
```

**OUTPUT (Thanh cong - 200):**
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

### 4.6. Xoa cong viec (Delete Task)

| Thuoc tinh | Gia tri |
|------------|---------|
| **Chuc nang** | Xoa mot cong viec |
| **Endpoint** | `DELETE /tasks/{task_id}` |
| **Phan quyen** | Can token (Manager) |

**INPUT:**
| Truong | Kieu | Bat buoc | Mo ta |
|--------|------|----------|-------|
| task_id | integer | Co | ID cong viec (path param) |

**OUTPUT (Thanh cong - 200):**
```json
{
  "message": "Task deleted successfully"
}
```

---

### 4.7. Cap nhat checklist (Update Task Checklist)

| Thuoc tinh | Gia tri |
|------------|---------|
| **Chuc nang** | Cap nhat trang thai mot muc checklist |
| **Endpoint** | `PUT /tasks/{task_id}/checklists/{checklist_id}` |
| **Phan quyen** | Can token |

**INPUT:**
| Truong | Kieu | Bat buoc | Mo ta |
|--------|------|----------|-------|
| task_id | integer | Co | ID cong viec (path param) |
| checklist_id | integer | Co | ID checklist (path param) |
| check_status | boolean | Co | Trang thai da check |
| notes | string | Khong | Ghi chu |

```json
{
  "check_status": true,
  "notes": "Da kiem tra xong"
}
```

**OUTPUT (Thanh cong - 200):**
```json
{
  "id": 1,
  "check_status": true,
  "completed_at": "2025-01-15T10:00:00Z",
  "completed_by": 5,
  "notes": "Da kiem tra xong"
}
```

---

### 4.8. Lay danh sach Code Master (Get Code Master)

| Thuoc tinh | Gia tri |
|------------|---------|
| **Chuc nang** | Lay danh sach cac ma code master (trang thai, loai task, loai response) |
| **Endpoint** | `GET /tasks/code-master` |
| **Phan quyen** | Can token |

**INPUT (Query Parameters):**
| Truong | Kieu | Bat buoc | Mo ta |
|--------|------|----------|-------|
| code_type | string | Khong | Loai code (status/task_type/response_type) |

**OUTPUT (Thanh cong - 200):**
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
  },
  {
    "code_master_id": 8,
    "code_type": "status",
    "code": "ON_PROGRESS",
    "name": "On Progress",
    "sort_order": 2,
    "is_active": true
  }
]
```

---

## 5. Shift Management - DWS (Quan ly ca lam viec)

### 5.1. Lay danh sach ma ca (List Shift Codes)

| Thuoc tinh | Gia tri |
|------------|---------|
| **Chuc nang** | Lay danh sach tat ca ma ca lam viec |
| **Endpoint** | `GET /shifts/codes` |
| **Phan quyen** | Can token |

**INPUT (Query Parameters):**
| Truong | Kieu | Bat buoc | Mo ta |
|--------|------|----------|-------|
| active_only | boolean | Khong | Chi lay ma ca dang hoat dong |

**OUTPUT (Thanh cong - 200):**
```json
[
  {
    "shift_code_id": 1,
    "shift_code": "S",
    "shift_name": "Ca Sang",
    "start_time": "06:00:00",
    "end_time": "14:00:00",
    "duration_hours": 8.0,
    "color_code": "#FFD700",
    "is_active": true
  },
  {
    "shift_code_id": 2,
    "shift_code": "C",
    "shift_name": "Ca Chieu",
    "start_time": "14:00:00",
    "end_time": "22:00:00",
    "duration_hours": 8.0,
    "color_code": "#87CEEB",
    "is_active": true
  }
]
```

---

### 5.2. Tao ma ca moi (Create Shift Code)

| Thuoc tinh | Gia tri |
|------------|---------|
| **Chuc nang** | Tao mot ma ca moi |
| **Endpoint** | `POST /shifts/codes` |
| **Phan quyen** | Can token (Manager) |

**INPUT:**
| Truong | Kieu | Bat buoc | Mo ta |
|--------|------|----------|-------|
| shift_code | string | Co | Ma ca (khong trung) |
| shift_name | string | Co | Ten ca |
| start_time | time | Co | Gio bat dau (HH:MM:SS) |
| end_time | time | Co | Gio ket thuc (HH:MM:SS) |
| duration_hours | number | Khong | So gio lam viec |
| color_code | string | Khong | Ma mau (hex) |

```json
{
  "shift_code": "V812",
  "shift_name": "Ca V 8h tu 12:00",
  "start_time": "12:00:00",
  "end_time": "20:00:00",
  "duration_hours": 8.0,
  "color_code": "#4A90D9"
}
```

**OUTPUT (Thanh cong - 201):**
```json
{
  "shift_code_id": 6,
  "shift_code": "V812",
  "shift_name": "Ca V 8h tu 12:00",
  "start_time": "12:00:00",
  "end_time": "20:00:00",
  "duration_hours": 8.0,
  "color_code": "#4A90D9",
  "is_active": true,
  "created_at": "2025-01-15T10:00:00Z"
}
```

---

### 5.3. Cap nhat ma ca (Update Shift Code)

| Thuoc tinh | Gia tri |
|------------|---------|
| **Chuc nang** | Cap nhat thong tin ma ca |
| **Endpoint** | `PUT /shifts/codes/{shift_code_id}` |
| **Phan quyen** | Can token (Manager) |

**INPUT:**
| Truong | Kieu | Bat buoc | Mo ta |
|--------|------|----------|-------|
| shift_code_id | integer | Co | ID ma ca (path param) |
| shift_code | string | Khong | Ma ca |
| shift_name | string | Khong | Ten ca |
| start_time | time | Khong | Gio bat dau |
| end_time | time | Khong | Gio ket thuc |
| duration_hours | number | Khong | So gio lam viec |
| color_code | string | Khong | Ma mau |
| is_active | boolean | Khong | Trang thai hoat dong |

```json
{
  "shift_name": "Ca Sang Updated",
  "color_code": "#FFE100"
}
```

**OUTPUT (Thanh cong - 200):**
```json
{
  "shift_code_id": 1,
  "shift_code": "S",
  "shift_name": "Ca Sang Updated",
  "is_active": true
}
```

---

### 5.4. Xoa ma ca (Delete Shift Code)

| Thuoc tinh | Gia tri |
|------------|---------|
| **Chuc nang** | Xoa mot ma ca |
| **Endpoint** | `DELETE /shifts/codes/{shift_code_id}` |
| **Phan quyen** | Can token (Manager) |

**INPUT:**
| Truong | Kieu | Bat buoc | Mo ta |
|--------|------|----------|-------|
| shift_code_id | integer | Co | ID ma ca (path param) |

**OUTPUT (Thanh cong - 200):**
```json
{
  "message": "Shift code deleted successfully"
}
```

---

### 5.5. Tao ma ca mac dinh (Generate Default Shift Codes)

| Thuoc tinh | Gia tri |
|------------|---------|
| **Chuc nang** | Tao cac ma ca mac dinh (S, C, T, OFF, FULL) |
| **Endpoint** | `POST /shifts/codes/generate` |
| **Phan quyen** | Can token (Manager) |

**INPUT:** Khong co

**OUTPUT (Thanh cong - 201):**
```json
[
  {
    "shift_code_id": 1,
    "shift_code": "S",
    "shift_name": "Ca Sang",
    "start_time": "06:00:00",
    "end_time": "14:00:00",
    "duration_hours": 8.0,
    "color_code": "#FFD700"
  },
  {
    "shift_code_id": 2,
    "shift_code": "C",
    "shift_name": "Ca Chieu",
    "start_time": "14:00:00",
    "end_time": "22:00:00",
    "duration_hours": 8.0,
    "color_code": "#87CEEB"
  },
  {
    "shift_code_id": 3,
    "shift_code": "T",
    "shift_name": "Ca Toi",
    "start_time": "22:00:00",
    "end_time": "06:00:00",
    "duration_hours": 8.0,
    "color_code": "#9370DB"
  },
  {
    "shift_code_id": 4,
    "shift_code": "OFF",
    "shift_name": "Nghi",
    "start_time": "00:00:00",
    "end_time": "00:00:00",
    "duration_hours": 0.0,
    "color_code": "#D3D3D3"
  },
  {
    "shift_code_id": 5,
    "shift_code": "FULL",
    "shift_name": "Ca Full Day",
    "start_time": "06:00:00",
    "end_time": "22:00:00",
    "duration_hours": 16.0,
    "color_code": "#FF6347"
  }
]
```

---

### 5.6. Lay danh sach phan ca (List Shift Assignments)

| Thuoc tinh | Gia tri |
|------------|---------|
| **Chuc nang** | Lay danh sach phan cong ca lam viec |
| **Endpoint** | `GET /shifts/assignments` |
| **Phan quyen** | Can token |

**INPUT (Query Parameters):**
| Truong | Kieu | Bat buoc | Mo ta |
|--------|------|----------|-------|
| staff_id | integer | Khong | Loc theo nhan vien |
| store_id | integer | Khong | Loc theo cua hang |
| start_date | date | Khong | Loc tu ngay |
| end_date | date | Khong | Loc den ngay |
| status | string | Khong | Loc theo trang thai |

**OUTPUT (Thanh cong - 200):**
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
    "staff": {
      "staff_id": 5,
      "staff_name": "Tran Van B"
    },
    "store": {
      "store_id": 1,
      "store_name": "Store Ha Dong"
    },
    "shift_code": {
      "shift_code_id": 1,
      "shift_code": "S",
      "shift_name": "Ca Sang",
      "start_time": "06:00:00",
      "end_time": "14:00:00",
      "duration_hours": 8.0
    }
  }
]
```

---

### 5.7. Phan ca cho nhan vien (Create Shift Assignment)

| Thuoc tinh | Gia tri |
|------------|---------|
| **Chuc nang** | Phan cong ca lam viec cho mot nhan vien |
| **Endpoint** | `POST /shifts/assignments` |
| **Phan quyen** | Can token (Manager/Supervisor) |

**INPUT:**
| Truong | Kieu | Bat buoc | Mo ta |
|--------|------|----------|-------|
| staff_id | integer | Co | ID nhan vien |
| store_id | integer | Khong | ID cua hang |
| shift_date | date | Co | Ngay lam viec (YYYY-MM-DD) |
| shift_code_id | integer | Co | ID ma ca |
| notes | string | Khong | Ghi chu |

```json
{
  "staff_id": 5,
  "store_id": 1,
  "shift_date": "2025-01-16",
  "shift_code_id": 1,
  "notes": "Ca sang binh thuong"
}
```

**OUTPUT (Thanh cong - 201):**
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

### 5.8. Phan ca hang loat (Create Bulk Shift Assignments)

| Thuoc tinh | Gia tri |
|------------|---------|
| **Chuc nang** | Phan cong ca lam viec cho nhieu nhan vien cung luc |
| **Endpoint** | `POST /shifts/assignments/bulk` |
| **Phan quyen** | Can token (Manager) |

**INPUT:**
| Truong | Kieu | Bat buoc | Mo ta |
|--------|------|----------|-------|
| staff_ids | array[integer] | Co | Danh sach ID nhan vien |
| store_id | integer | Khong | ID cua hang |
| shift_dates | array[date] | Co | Danh sach ngay lam viec |
| shift_code_id | integer | Co | ID ma ca |
| notes | string | Khong | Ghi chu |

```json
{
  "staff_ids": [5, 6, 7],
  "store_id": 1,
  "shift_dates": ["2025-01-15", "2025-01-16", "2025-01-17"],
  "shift_code_id": 1,
  "notes": "Ca tang cuong cuoi tuan"
}
```

**OUTPUT (Thanh cong - 201):**
```json
{
  "created": 9,
  "skipped": 0,
  "assignments": [
    {
      "assignment_id": 8,
      "staff_id": 5,
      "shift_date": "2025-01-15"
    },
    {
      "assignment_id": 9,
      "staff_id": 5,
      "shift_date": "2025-01-16"
    }
  ]
}
```

---

### 5.9. Cap nhat phan ca (Update Shift Assignment)

| Thuoc tinh | Gia tri |
|------------|---------|
| **Chuc nang** | Cap nhat thong tin phan cong ca |
| **Endpoint** | `PUT /shifts/assignments/{assignment_id}` |
| **Phan quyen** | Can token |

**INPUT:**
| Truong | Kieu | Bat buoc | Mo ta |
|--------|------|----------|-------|
| assignment_id | integer | Co | ID phan ca (path param) |
| store_id | integer | Khong | ID cua hang |
| shift_code_id | integer | Khong | ID ma ca |
| status | string | Khong | Trang thai (assigned/confirmed/completed/cancelled) |
| notes | string | Khong | Ghi chu |

```json
{
  "shift_code_id": 2,
  "status": "confirmed"
}
```

**OUTPUT (Thanh cong - 200):**
```json
{
  "assignment_id": 1,
  "shift_code_id": 2,
  "status": "confirmed"
}
```

---

### 5.10. Xoa phan ca (Delete Shift Assignment)

| Thuoc tinh | Gia tri |
|------------|---------|
| **Chuc nang** | Xoa mot phan cong ca |
| **Endpoint** | `DELETE /shifts/assignments/{assignment_id}` |
| **Phan quyen** | Can token (Manager) |

**INPUT:**
| Truong | Kieu | Bat buoc | Mo ta |
|--------|------|----------|-------|
| assignment_id | integer | Co | ID phan ca (path param) |

**OUTPUT (Thanh cong - 200):**
```json
{
  "message": "Shift assignment deleted successfully"
}
```

---

### 5.11. Lay lich lam viec theo tuan (Get Weekly Schedule)

| Thuoc tinh | Gia tri |
|------------|---------|
| **Chuc nang** | Lay lich lam viec cua tat ca nhan vien trong tuan |
| **Endpoint** | `GET /shifts/weekly-schedule` |
| **Phan quyen** | Can token |

**INPUT (Query Parameters):**
| Truong | Kieu | Bat buoc | Mo ta |
|--------|------|----------|-------|
| store_id | integer | Khong | Loc theo cua hang |
| start_date | date | Co | Ngay bat dau tuan |
| end_date | date | Co | Ngay ket thuc tuan |

**OUTPUT (Thanh cong - 200):**
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
        "shift_name": "Ca Sang"
      },
      "2025-01-14": {
        "assignment_id": 2,
        "shift_code": "S",
        "shift_name": "Ca Sang"
      },
      "2025-01-15": null,
      "2025-01-16": {
        "assignment_id": 3,
        "shift_code": "C",
        "shift_name": "Ca Chieu"
      },
      "2025-01-17": {
        "assignment_id": 4,
        "shift_code": "C",
        "shift_name": "Ca Chieu"
      },
      "2025-01-18": {
        "assignment_id": 5,
        "shift_code": "OFF",
        "shift_name": "Nghi"
      },
      "2025-01-19": {
        "assignment_id": 6,
        "shift_code": "OFF",
        "shift_name": "Nghi"
      }
    }
  }
]
```

---

### 5.12. Bao cao man-hour (Get Man-hour Report)

| Thuoc tinh | Gia tri |
|------------|---------|
| **Chuc nang** | Lay bao cao tong hop gio cong theo ngay |
| **Endpoint** | `GET /shifts/man-hour-report` |
| **Phan quyen** | Can token |

**INPUT (Query Parameters):**
| Truong | Kieu | Bat buoc | Mo ta |
|--------|------|----------|-------|
| date | date | Co | Ngay bao cao |
| store_id | integer | Khong | Loc theo cua hang |

**OUTPUT (Thanh cong - 200):**
```json
[
  {
    "date": "2025-01-15",
    "store_id": 1,
    "store_name": "Store Ha Dong",
    "total_hours": 72.0,
    "target_hours": 80.0,
    "difference": -8.0,
    "status": "THIEU",
    "staff_count": 9
  },
  {
    "date": "2025-01-15",
    "store_id": 2,
    "store_name": "Store Cau Giay",
    "total_hours": 80.0,
    "target_hours": 80.0,
    "difference": 0.0,
    "status": "DAT CHUAN",
    "staff_count": 10
  }
]
```

**Giai thich status:**
- `THIEU`: Tong gio < muc tieu (difference < 0)
- `DAT CHUAN`: Tong gio = muc tieu (difference = 0)
- `THUA`: Tong gio > muc tieu (difference > 0)

---

## 6. Notifications (Thong bao)

### 6.1. Lay danh sach thong bao (List Notifications)

| Thuoc tinh | Gia tri |
|------------|---------|
| **Chuc nang** | Lay danh sach thong bao cua nguoi dung hien tai |
| **Endpoint** | `GET /notifications` |
| **Phan quyen** | Can token |

**INPUT (Query Parameters):**
| Truong | Kieu | Bat buoc | Mo ta |
|--------|------|----------|-------|
| is_read | boolean | Khong | Loc theo trang thai da doc |
| notification_type | string | Khong | Loc theo loai thong bao |
| skip | integer | Khong | Bo qua N ban ghi |
| limit | integer | Khong | Gioi han so ban ghi (mac dinh: 20) |

**OUTPUT (Thanh cong - 200):**
```json
{
  "notifications": [
    {
      "notification_id": 1,
      "recipient_staff_id": 5,
      "sender_staff_id": 1,
      "notification_type": "task_assigned",
      "title": "New Task Assigned",
      "message": "You have been assigned a new task: Kiem ke hang hoa",
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

### 6.2. Lay so thong bao chua doc (Get Unread Count)

| Thuoc tinh | Gia tri |
|------------|---------|
| **Chuc nang** | Lay so luong thong bao chua doc |
| **Endpoint** | `GET /notifications/unread-count` |
| **Phan quyen** | Can token |

**INPUT:** Khong co

**OUTPUT (Thanh cong - 200):**
```json
{
  "count": 5
}
```

---

### 6.3. Danh dau da doc (Mark as Read)

| Thuoc tinh | Gia tri |
|------------|---------|
| **Chuc nang** | Danh dau mot thong bao la da doc |
| **Endpoint** | `PUT /notifications/{notification_id}/read` |
| **Phan quyen** | Can token |

**INPUT:**
| Truong | Kieu | Bat buoc | Mo ta |
|--------|------|----------|-------|
| notification_id | integer | Co | ID thong bao (path param) |

**OUTPUT (Thanh cong - 200):**
```json
{
  "notification_id": 1,
  "is_read": true,
  "read_at": "2025-01-15T10:00:00Z"
}
```

---

### 6.4. Danh dau tat ca da doc (Mark All as Read)

| Thuoc tinh | Gia tri |
|------------|---------|
| **Chuc nang** | Danh dau tat ca thong bao la da doc |
| **Endpoint** | `PUT /notifications/mark-all-read` |
| **Phan quyen** | Can token |

**INPUT:** Khong co

**OUTPUT (Thanh cong - 200):**
```json
{
  "message": "Marked 5 notifications as read"
}
```

---

### 6.5. Xoa thong bao (Delete Notification)

| Thuoc tinh | Gia tri |
|------------|---------|
| **Chuc nang** | Xoa mot thong bao |
| **Endpoint** | `DELETE /notifications/{notification_id}` |
| **Phan quyen** | Can token |

**INPUT:**
| Truong | Kieu | Bat buoc | Mo ta |
|--------|------|----------|-------|
| notification_id | integer | Co | ID thong bao (path param) |

**OUTPUT (Thanh cong - 200):**
```json
{
  "message": "Notification deleted successfully"
}
```

---

### 6.6. Xoa thong bao da doc (Clear Read Notifications)

| Thuoc tinh | Gia tri |
|------------|---------|
| **Chuc nang** | Xoa tat ca thong bao da doc |
| **Endpoint** | `DELETE /notifications/clear-read` |
| **Phan quyen** | Can token |

**INPUT:** Khong co

**OUTPUT (Thanh cong - 200):**
```json
{
  "message": "Deleted 10 read notifications"
}
```

---

## Phu Luc

### A. Bang ma trang thai Task

| ID | Code | Ten (EN) | Ten (VI) |
|----|------|----------|----------|
| 7 | NOT_YET | Not Yet | Chua bat dau |
| 8 | ON_PROGRESS | On Progress | Dang thuc hien |
| 9 | DONE | Done | Hoan thanh |
| 10 | OVERDUE | Overdue | Qua han |
| 11 | REJECT | Reject | Tu choi |

### B. Bang ma uu tien Task

| Gia tri | Ten (EN) | Ten (VI) |
|---------|----------|----------|
| low | Low | Thap |
| normal | Normal | Binh thuong |
| high | High | Cao |
| urgent | Urgent | Khan cap |

### C. Bang ma trang thai Shift Assignment

| Gia tri | Ten (EN) | Ten (VI) |
|---------|----------|----------|
| assigned | Assigned | Da phan cong |
| confirmed | Confirmed | Da xac nhan |
| completed | Completed | Hoan thanh |
| cancelled | Cancelled | Da huy |

### D. Bang loai thong bao

| Gia tri | Mo ta |
|---------|-------|
| task_assigned | Cong viec moi duoc giao |
| task_status_changed | Trang thai cong viec thay doi |
| task_completed | Cong viec hoan thanh |
| shift_assigned | Ca lam viec moi duoc giao |
| shift_changed | Ca lam viec thay doi |

### E. Bang ma loi HTTP

| Ma | Ten | Mo ta |
|----|-----|-------|
| 200 | OK | Thanh cong |
| 201 | Created | Tao moi thanh cong |
| 400 | Bad Request | Du lieu khong hop le |
| 401 | Unauthorized | Chua xac thuc |
| 403 | Forbidden | Khong co quyen |
| 404 | Not Found | Khong tim thay |
| 409 | Conflict | Xung dot du lieu |
| 422 | Unprocessable Entity | Loi validate |
| 500 | Internal Server Error | Loi server |

---

*API Version 1.0 - Ngay cap nhat: 2025-12-27*
