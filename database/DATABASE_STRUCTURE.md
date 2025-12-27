# OptiChain WS & DWS Database Structure

**Database Type**: PostgreSQL 15+
**Schema**: public
**Migration Date**: 2025-12-26
**Total Tables**: 13

---

## 📊 Database Overview

### WS (Work Schedule) Module
- **tasks** - Work schedule tasks and assignments
- **check_lists** - Checklist items library
- **task_check_list** - Tasks ↔ Checklists mapping
- **manuals** - Task manuals and documentation

### DWS (Dispatch Work Schedule) Module
- **shift_codes** - Shift type definitions (S, C, T, OFF, FULL)
- **shift_assignments** - Staff shift schedule assignments

### Core Tables
- **regions** - Geographic regions for store grouping
- **stores** - Store locations and details
- **departments** - Organizational departments
- **staff** - Employees and staff members
- **code_master** - Master lookup table
- **notifications** - System notifications

---

## 📋 Table Details

### 1. regions
**Description**: Geographic regions for store grouping

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| region_id | SERIAL | PRIMARY KEY | Primary key |
| region_name | VARCHAR(255) | NOT NULL | Region name |
| region_code | VARCHAR(50) | UNIQUE | Unique region code |
| description | TEXT | | Region description |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | |

**Current Data**: 5 records
```
1 - Park (PARK)
2 - Super Market (SUPERMARKET)
3 - Lake (LAKE)
4 - Old Quarter (OLDQUARTER)
5 - Shopping Mall (MALL)
```

---

### 2. stores
**Description**: Store locations and details

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| store_id | SERIAL | PRIMARY KEY | Primary key |
| store_name | VARCHAR(255) | NOT NULL | Store name |
| store_code | VARCHAR(50) | UNIQUE | Unique store code |
| region_id | INTEGER | FK → regions(region_id) | Geographic region |
| address | TEXT | | Store address |
| phone | VARCHAR(20) | | Store phone number |
| email | VARCHAR(100) | | Store email |
| manager_id | INTEGER | FK → staff(staff_id) | Store manager |
| status | VARCHAR(20) | DEFAULT 'active' | Store status |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | |

**Relationships**:
- `region_id` → `regions.region_id` (many-to-one)
- `manager_id` → `staff.staff_id` (many-to-one)

**Current Data**: 20 stores (Store Hà Đông → Store Chương Mỹ)

---

### 3. departments
**Description**: Organizational departments

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| department_id | SERIAL | PRIMARY KEY | Primary key |
| department_name | VARCHAR(255) | NOT NULL | Department name |
| department_code | VARCHAR(50) | UNIQUE | Unique department code |
| description | TEXT | | Department description |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | |

**Current Data**: 7 departments
```
12 - MKT (Marketing)
13 - OP (Operations)
14 - IMP (Import)
15 - HR (Human Resources)
16 - ORD (Order)
17 - QC (Quality Control)
18 - ADM (Admin)
```

---

### 4. staff
**Description**: Employees and staff members

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| staff_id | SERIAL | PRIMARY KEY | Primary key |
| staff_name | VARCHAR(255) | NOT NULL | Staff full name |
| staff_code | VARCHAR(50) | UNIQUE | Unique staff code/ID |
| email | VARCHAR(100) | UNIQUE | Staff email address |
| phone | VARCHAR(20) | | Staff phone number |
| store_id | INTEGER | FK → stores(store_id) | Assigned store |
| department_id | INTEGER | FK → departments(department_id) | Department assignment |
| role | VARCHAR(50) | | Staff role: manager, supervisor, staff |
| password_hash | VARCHAR(255) | | Hashed password for login |
| is_active | BOOLEAN | DEFAULT TRUE | Whether staff is active |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | |

**Relationships**:
- `store_id` → `stores.store_id` (many-to-one)
- `department_id` → `departments.department_id` (many-to-one)

**Indexes**:
- `idx_staff_store` ON (store_id)

**Current Data**: 36 staff members

**Sample Login Credentials**:
```
Email: le.van.cuong@optichain.com
Password: password123
Role: Manager - Store Hà Đông
```

---

### 5. code_master
**Description**: Master lookup table for various code types

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| code_master_id | SERIAL | PRIMARY KEY | Primary key |
| code_type | VARCHAR(50) | NOT NULL | Type: task_type, response_type, status |
| code | VARCHAR(50) | NOT NULL | Code value |
| name | VARCHAR(255) | NOT NULL | Display name |
| description | TEXT | | Code description |
| sort_order | INTEGER | DEFAULT 0 | Display order |
| is_active | BOOLEAN | DEFAULT TRUE | Whether code is active |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | |

**Unique Constraint**: (code_type, code)

**Current Data**: 11 codes
```
Task Types:
  1 - STATISTICS (Thống kê)
  2 - ARRANGE (Sắp xếp)
  3 - PREPARE (Chuẩn bị)

Response Types:
  4 - PICTURE (Picture)
  5 - CHECKLIST (Check-List)
  6 - YESNO (Yes-No)

Status:
  7 - NOT_YET (Not Yet)
  8 - ON_PROGRESS (On Progress)
  9 - DONE (Done)
  10 - OVERDUE (Overdue)
  11 - REJECT (Reject)
```

---

### 6. manuals
**Description**: Task manuals and documentation

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| manual_id | SERIAL | PRIMARY KEY | Primary key |
| manual_name | VARCHAR(255) | NOT NULL | Manual name/title |
| manual_url | TEXT | | URL to manual document |
| description | TEXT | | Manual description |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | |

**Current Data**: 3 manuals
```
1 - Hướng dẫn bán hàng (Sales training manual)
2 - Hướng dẫn an toàn (Safety procedures manual)
3 - Hướng dẫn kiểm kho (Inventory check manual)
```

---

### 7. tasks (WS - Work Schedule)
**Description**: Work schedule tasks and assignments

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| task_id | SERIAL | PRIMARY KEY | Primary key |
| task_name | VARCHAR(500) | NOT NULL | Task name/title |
| task_description | TEXT | | Detailed task description |
| manual_id | INTEGER | FK → manuals(manual_id) | Related manual/documentation |
| task_type_id | INTEGER | FK → code_master(code_master_id) | Task type (DAILY, WEEKLY, MONTHLY) |
| response_type_id | INTEGER | FK → code_master(code_master_id) | Response type (YES_NO, NUMBER) |
| response_num | INTEGER | | Response number value |
| is_repeat | BOOLEAN | DEFAULT FALSE | Whether task repeats |
| repeat_config | JSONB | | JSON configuration for repeat schedule |
| dept_id | INTEGER | FK → departments(department_id) | Assigned department |
| assigned_store_id | INTEGER | FK → stores(store_id) | Assigned store |
| assigned_staff_id | INTEGER | FK → staff(staff_id) | Staff assigned to task |
| do_staff_id | INTEGER | FK → staff(staff_id) | Staff executing the task |
| status_id | INTEGER | FK → code_master(code_master_id) | Task status |
| priority | VARCHAR(20) | DEFAULT 'normal' | Task priority: low, normal, high, urgent |
| start_date | DATE | | Task start date |
| end_date | DATE | | Task end date |
| start_time | TIME | | Task start time |
| due_datetime | TIMESTAMP | | Task due date and time |
| completed_time | TIMESTAMP | | When task was completed |
| comment | TEXT | | Task comments/notes |
| attachments | JSONB | | JSON array of attachment URLs |
| created_staff_id | INTEGER | FK → staff(staff_id) | Staff who created the task |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | |

**Relationships**:
- `manual_id` → `manuals.manual_id`
- `task_type_id` → `code_master.code_master_id`
- `response_type_id` → `code_master.code_master_id`
- `dept_id` → `departments.department_id`
- `assigned_store_id` → `stores.store_id`
- `assigned_staff_id` → `staff.staff_id`
- `do_staff_id` → `staff.staff_id`
- `status_id` → `code_master.code_master_id`
- `created_staff_id` → `staff.staff_id`

**Indexes**:
- `idx_tasks_status` ON (status_id)
- `idx_tasks_assigned_staff` ON (assigned_staff_id)

**Current Data**: 10 sample tasks

---

### 8. check_lists
**Description**: Checklist items library

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| check_list_id | SERIAL | PRIMARY KEY | Primary key |
| check_list_name | VARCHAR(500) | NOT NULL | Checklist item name |
| description | TEXT | | Checklist item description |
| is_active | BOOLEAN | DEFAULT TRUE | Whether checklist is active |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | |

**Current Data**: 4 checklists
```
1 - Check danh sách kho hàng (Inventory checklist)
2 - Check an toàn lao động (Safety checklist)
3 - Check trưng bày sản phẩm (Product display checklist)
4 - Check vệ sinh cửa hàng (Store cleaning checklist)
```

---

### 9. task_check_list
**Description**: Many-to-many relationship between tasks and checklists

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Primary key |
| task_id | INTEGER | FK → tasks(task_id) CASCADE | Related task |
| check_list_id | INTEGER | FK → check_lists(check_list_id) CASCADE | Related checklist item |
| check_status | BOOLEAN | DEFAULT FALSE | Whether checklist item is completed |
| completed_at | TIMESTAMP | | When item was completed |
| completed_by | INTEGER | FK → staff(staff_id) | Staff who completed the item |
| notes | TEXT | | Completion notes |

**Unique Constraint**: (task_id, check_list_id)

**Relationships**:
- `task_id` → `tasks.task_id` (ON DELETE CASCADE)
- `check_list_id` → `check_lists.check_list_id` (ON DELETE CASCADE)
- `completed_by` → `staff.staff_id`

**Current Data**: 11 task-checklist mappings

---

### 10. shift_codes (DWS - Dispatch Work Schedule)
**Description**: Shift type definitions

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| shift_code_id | SERIAL | PRIMARY KEY | Primary key |
| shift_code | VARCHAR(10) | NOT NULL UNIQUE | Shift code: S, C, T, OFF, etc. |
| shift_name | VARCHAR(100) | NOT NULL | Shift name in Vietnamese |
| start_time | TIME | NOT NULL | Shift start time |
| end_time | TIME | NOT NULL | Shift end time |
| duration_hours | DECIMAL(4,2) | | Shift duration in hours |
| color_code | VARCHAR(7) | | Hex color code for display |
| is_active | BOOLEAN | DEFAULT TRUE | Whether shift code is active |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | |

**Expected Data**: 5 shift codes
```
S - Ca Sáng (06:00-14:00, 8h, #FFD700)
C - Ca Chiều (14:00-22:00, 8h, #87CEEB)
T - Ca Tối (22:00-06:00, 8h, #4B0082)
OFF - Nghỉ (0h, #D3D3D3)
FULL - Ca Toàn Thời (08:00-20:00, 12h, #32CD32)
```

---

### 11. shift_assignments
**Description**: Staff shift schedule assignments

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| assignment_id | SERIAL | PRIMARY KEY | Primary key |
| staff_id | INTEGER | FK → staff(staff_id) CASCADE | Assigned staff member |
| store_id | INTEGER | FK → stores(store_id) | Store location for shift |
| shift_date | DATE | NOT NULL | Date of shift |
| shift_code_id | INTEGER | FK → shift_codes(shift_code_id) | Shift type |
| status | VARCHAR(20) | DEFAULT 'assigned' | Status: assigned, confirmed, completed, cancelled |
| notes | TEXT | | Additional notes |
| assigned_by | INTEGER | FK → staff(staff_id) | Manager who created assignment |
| assigned_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | |

**Unique Constraint**: (staff_id, shift_date, shift_code_id)

**Relationships**:
- `staff_id` → `staff.staff_id` (ON DELETE CASCADE)
- `store_id` → `stores.store_id`
- `shift_code_id` → `shift_codes.shift_code_id`
- `assigned_by` → `staff.staff_id`

**Current Data**: 7 sample shift assignments for 2025-12-26

---

### 12. notifications
**Description**: System notifications for staff

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| notification_id | SERIAL | PRIMARY KEY | Primary key |
| recipient_staff_id | INTEGER | FK → staff(staff_id) CASCADE | Staff receiving notification |
| sender_staff_id | INTEGER | FK → staff(staff_id) SET NULL | Staff sending notification |
| notification_type | VARCHAR(50) | | Type: task_assigned, shift_changed, etc. |
| title | VARCHAR(255) | NOT NULL | Notification title |
| message | TEXT | | Notification message body |
| link_url | TEXT | | Link to related resource |
| is_read | BOOLEAN | DEFAULT FALSE | Whether notification was read |
| read_at | TIMESTAMP | | When notification was read |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | |

**Relationships**:
- `recipient_staff_id` → `staff.staff_id` (ON DELETE CASCADE)
- `sender_staff_id` → `staff.staff_id` (ON DELETE SET NULL)

**Indexes**:
- `idx_notifications_recipient` ON (recipient_staff_id, is_read)

**Current Data**: 5 sample notifications

---

## 🔗 Entity Relationship Diagram (Text)

```
regions (1) ──< (many) stores
stores (1) ──< (many) staff
departments (1) ──< (many) staff
stores (1) ─── (1) staff (manager)

staff (1) ──< (many) tasks (assigned_staff_id)
staff (1) ──< (many) tasks (do_staff_id)
staff (1) ──< (many) tasks (created_staff_id)
stores (1) ──< (many) tasks
departments (1) ──< (many) tasks
manuals (1) ──< (many) tasks
code_master (1) ──< (many) tasks (task_type_id)
code_master (1) ──< (many) tasks (response_type_id)
code_master (1) ──< (many) tasks (status_id)

tasks (many) ──< task_check_list >── (many) check_lists
staff (1) ──< (many) task_check_list (completed_by)

shift_codes (1) ──< (many) shift_assignments
staff (1) ──< (many) shift_assignments (staff_id)
staff (1) ──< (many) shift_assignments (assigned_by)
stores (1) ──< (many) shift_assignments

staff (1) ──< (many) notifications (recipient)
staff (1) ──< (many) notifications (sender)
```

---

## 📊 Database Statistics

| Table | Records | Primary Use |
|-------|---------|-------------|
| regions | 5 | Geographic grouping |
| departments | 7 | Organizational structure |
| stores | 20 | Store locations |
| staff | 36 | Employee management |
| code_master | 11 | Lookup values |
| manuals | 3 | Documentation |
| check_lists | 4 | Task checklists |
| tasks | 10 | Work scheduling |
| task_check_list | 11 | Task completion tracking |
| shift_codes | 5 | Shift definitions |
| shift_assignments | 7 | Staff scheduling |
| notifications | 5 | User notifications |

**Total Records**: 124

---

## 🔐 Security Notes

- All passwords are hashed using bcrypt
- Default password for all accounts: `password123`
- Email format: `firstname.lastname@optichain.com`
- Foreign keys use appropriate CASCADE/SET NULL policies
- Unique constraints prevent duplicate data

---

## 🚀 Next Steps

1. **Import to A5:SQL Mk-2**:
   - Open A5M2 → Database → Add DB
   - Connect to Neon database
   - Database → Import from Database
   - Save as `.a5er` file

2. **Backend API Development**:
   - Implement endpoints for all tables
   - Add authentication middleware
   - Create CRUD operations

3. **Frontend Integration**:
   - Connect Tasks page to backend
   - Build DWS shift management UI
   - Implement real-time updates

---

**Generated**: 2025-12-26
**Database**: PostgreSQL on Neon
**Schema Version**: 1.0
