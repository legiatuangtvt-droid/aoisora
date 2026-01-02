# Aoisora Database Structure

**Database**: PostgreSQL 15+
**Schema**: public
**Last Updated**: 2025-12-31

---

## Overview

| Category | Tables | Description |
|----------|--------|-------------|
| Core | 5 | Regions, Stores, Departments, Staff, Code Master |
| Aoi WS | 4 | Tasks, Checklists, Manuals |
| Aoi DWS | 7 | Shifts, Schedules, Task Groups |
| Aoi Manual | 5 | Folders, Documents, Steps, Media |
| System | 2 | Notifications, Tokens |

**Total Tables**: 23

---

## Core Tables

### regions
Geographic regions for store grouping.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| region_id | SERIAL | PRIMARY KEY | Auto-increment ID |
| region_name | VARCHAR(255) | NOT NULL | Region name |
| region_code | VARCHAR(50) | UNIQUE | Unique code (HN, HCM, DN) |
| description | TEXT | | Region description |
| created_at | TIMESTAMP | DEFAULT NOW | Created timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW | Updated timestamp |

---

### departments
Organizational departments.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| department_id | SERIAL | PRIMARY KEY | Auto-increment ID |
| department_name | VARCHAR(255) | NOT NULL | Department name |
| department_code | VARCHAR(50) | UNIQUE | Unique code (OPS, MKT, HR) |
| description | TEXT | | Department description |
| created_at | TIMESTAMP | DEFAULT NOW | Created timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW | Updated timestamp |

---

### stores
Store locations and details.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| store_id | SERIAL | PRIMARY KEY | Auto-increment ID |
| store_name | VARCHAR(255) | NOT NULL | Store name |
| store_code | VARCHAR(50) | UNIQUE | Unique code (ST001, ST002) |
| region_id | INTEGER | FK regions | Geographic region |
| address | TEXT | | Store address |
| phone | VARCHAR(20) | | Phone number |
| email | VARCHAR(100) | | Email address |
| manager_id | INTEGER | FK staff | Store manager |
| status | VARCHAR(20) | DEFAULT 'active' | Status: active, inactive |
| created_at | TIMESTAMP | DEFAULT NOW | Created timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW | Updated timestamp |

---

### staff
Employees and staff members. **Authentication model for Laravel Sanctum**.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| staff_id | SERIAL | PRIMARY KEY | Auto-increment ID |
| staff_name | VARCHAR(255) | NOT NULL | Full name |
| staff_code | VARCHAR(50) | UNIQUE | Employee code (NV001) |
| username | VARCHAR(100) | UNIQUE, NOT NULL | Login username |
| email | VARCHAR(100) | UNIQUE | Email address |
| phone | VARCHAR(20) | | Phone number |
| store_id | INTEGER | FK stores | Assigned store |
| department_id | INTEGER | FK departments | Department |
| role | VARCHAR(50) | DEFAULT 'STAFF' | Role code |
| password_hash | VARCHAR(255) | NOT NULL | Bcrypt hashed password |
| status | VARCHAR(20) | DEFAULT 'active' | Status: active, inactive |
| is_active | BOOLEAN | DEFAULT true | Active flag |
| created_at | TIMESTAMP | DEFAULT NOW | Created timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW | Updated timestamp |

**Roles**:
- `ADMIN` - Full access
- `MANAGER` - Store manager
- `STORE_LEADER_G3` - Store leader
- `STAFF` - Regular staff

**Default Login**: `admin` / `password123`

---

### code_master
Master lookup table for various code types.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| code_master_id | SERIAL | PRIMARY KEY | Auto-increment ID |
| code_type | VARCHAR(50) | NOT NULL | Type: status, task_type, response_type |
| code | VARCHAR(50) | NOT NULL | Code value |
| name | VARCHAR(255) | NOT NULL | Display name |
| description | TEXT | | Description |
| sort_order | INTEGER | DEFAULT 0 | Display order |
| is_active | BOOLEAN | DEFAULT true | Active flag |
| created_at | TIMESTAMP | DEFAULT NOW | Created timestamp |

**Unique**: (code_type, code)

**Status Codes** (code_type = 'status'):
| ID | Code | Name |
|----|------|------|
| 7 | NOT_YET | Not Yet |
| 8 | ON_PROGRESS | On Progress |
| 9 | DONE | Done |
| 10 | OVERDUE | Overdue |
| 11 | REJECT | Reject |

**Task Types** (code_type = 'task_type'):
| ID | Code | Name |
|----|------|------|
| 1 | STATISTICS | Statistics |
| 2 | ARRANGE | Arrange |
| 3 | PREPARE | Prepare |

**Response Types** (code_type = 'response_type'):
| ID | Code | Name |
|----|------|------|
| 4 | PICTURE | Picture |
| 5 | CHECKLIST | Checklist |
| 6 | YESNO | Yes/No |

---

## Aoi WS Tables

### tasks
Work schedule tasks and assignments.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| task_id | SERIAL | PRIMARY KEY | Auto-increment ID |
| task_name | VARCHAR(500) | NOT NULL | Task name |
| task_description | TEXT | | Detailed description |
| manual_id | INTEGER | FK manuals | Related manual |
| task_type_id | INTEGER | FK code_master | Task type |
| response_type_id | INTEGER | FK code_master | Response type |
| response_num | INTEGER | | Response value |
| is_repeat | BOOLEAN | DEFAULT false | Is recurring |
| repeat_config | JSONB | | Repeat configuration |
| dept_id | INTEGER | FK departments | Department |
| assigned_store_id | INTEGER | FK stores | Assigned store |
| assigned_staff_id | INTEGER | FK staff | Assigned staff |
| do_staff_id | INTEGER | FK staff | Executing staff |
| status_id | INTEGER | FK code_master | Current status |
| priority | VARCHAR(20) | DEFAULT 'normal' | low/normal/high/urgent |
| start_date | DATE | | Start date |
| end_date | DATE | | End date |
| start_time | TIME | | Start time |
| due_datetime | TIMESTAMP | | Due datetime |
| completed_time | TIMESTAMP | | Completion time |
| comment | TEXT | | Comments |
| attachments | JSONB | | Attachment URLs |
| created_staff_id | INTEGER | FK staff | Creator |
| created_at | TIMESTAMP | DEFAULT NOW | Created timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW | Updated timestamp |

---

### check_lists
Checklist items library.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| check_list_id | SERIAL | PRIMARY KEY | Auto-increment ID |
| check_list_name | VARCHAR(500) | NOT NULL | Checklist name |
| description | TEXT | | Description |
| is_active | BOOLEAN | DEFAULT true | Active flag |
| created_at | TIMESTAMP | DEFAULT NOW | Created timestamp |

---

### task_check_list
Many-to-many: Tasks to Checklists.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Auto-increment ID |
| task_id | INTEGER | FK tasks CASCADE | Task reference |
| check_list_id | INTEGER | FK check_lists CASCADE | Checklist reference |
| check_status | BOOLEAN | DEFAULT false | Is completed |
| completed_at | TIMESTAMP | | Completion time |
| completed_by | INTEGER | FK staff | Completed by |
| notes | TEXT | | Notes |

**Unique**: (task_id, check_list_id)

---

### manuals
Legacy task manuals (for WS module).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| manual_id | SERIAL | PRIMARY KEY | Auto-increment ID |
| manual_name | VARCHAR(255) | NOT NULL | Manual name |
| manual_url | TEXT | | URL to document |
| description | TEXT | | Description |
| created_at | TIMESTAMP | DEFAULT NOW | Created timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW | Updated timestamp |

---

## Aoi DWS Tables

### task_groups
Task group definitions with colors.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| group_id | VARCHAR(20) | PRIMARY KEY | Group code (POS, PERI) |
| group_code | VARCHAR(20) | NOT NULL | Display code |
| group_name | VARCHAR(100) | NOT NULL | Group name |
| priority | INTEGER | DEFAULT 50 | Sort priority |
| sort_order | INTEGER | DEFAULT 0 | Display order |
| color_bg | VARCHAR(20) | DEFAULT '#f3f4f6' | Background color |
| color_text | VARCHAR(20) | DEFAULT '#374151' | Text color |
| color_border | VARCHAR(20) | DEFAULT '#9ca3af' | Border color |
| is_active | BOOLEAN | DEFAULT true | Active flag |
| created_at | TIMESTAMP | DEFAULT NOW | Created timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW | Updated timestamp |

**Default Groups**:
| ID | Name | Color |
|----|------|-------|
| POS | Thu ngan | Slate |
| PERI | Perishable | Amber |
| DRY | Dry/Grocery | Blue |
| MMD | Logistics | Indigo |
| LEADER | Leader Tasks | Teal |
| QC-FSH | Quality Control | Green |
| DELICA | Delicatessen | Pink |
| DND | Do Not Disturb | Red |
| OTHER | Other Tasks | Gray |

---

### shift_codes
Shift type definitions.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| shift_code_id | SERIAL | PRIMARY KEY | Auto-increment ID |
| shift_code | VARCHAR(20) | UNIQUE, NOT NULL | Code (V8.6, V8.14) |
| shift_name | VARCHAR(100) | NOT NULL | Display name |
| start_time | TIME | NOT NULL | Start time |
| end_time | TIME | NOT NULL | End time |
| total_hours | DECIMAL(4,2) | DEFAULT 8.0 | Total hours |
| shift_type | VARCHAR(20) | DEFAULT 'regular' | morning/afternoon/full/off |
| break_minutes | INTEGER | DEFAULT 60 | Break duration |
| color_code | VARCHAR(7) | | Hex color |
| is_active | BOOLEAN | DEFAULT true | Active flag |
| created_at | TIMESTAMP | DEFAULT NOW | Created timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW | Updated timestamp |

**Default Shifts**:
| Code | Name | Time | Hours |
|------|------|------|-------|
| V8.6 | Ca sang 6h | 06:00-14:00 | 8.0 |
| V8.14 | Ca chieu 14h | 14:00-22:00 | 8.0 |
| OFF | Nghi | - | 0 |
| FULL | Ca toan thoi gian | 08:00-20:00 | 12.0 |

---

### shift_assignments
Staff shift schedule assignments.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| assignment_id | SERIAL | PRIMARY KEY | Auto-increment ID |
| staff_id | INTEGER | FK staff CASCADE | Staff member |
| store_id | INTEGER | FK stores | Store location |
| shift_date | DATE | NOT NULL | Shift date |
| shift_code_id | INTEGER | FK shift_codes | Shift type |
| status | VARCHAR(20) | DEFAULT 'assigned' | assigned/confirmed/completed |
| notes | TEXT | | Notes |
| assigned_by | INTEGER | FK staff | Assigned by |
| assigned_at | TIMESTAMP | DEFAULT NOW | Assignment time |

**Unique**: (staff_id, shift_date, shift_code_id)

---

### daily_schedule_tasks
Daily task instances for each staff.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| schedule_task_id | SERIAL | PRIMARY KEY | Auto-increment ID |
| staff_id | INTEGER | FK staff CASCADE | Staff member |
| store_id | INTEGER | FK stores | Store location |
| schedule_date | DATE | NOT NULL | Task date |
| group_id | VARCHAR(20) | FK task_groups | Task group |
| task_code | VARCHAR(20) | | Task code |
| task_name | VARCHAR(255) | NOT NULL | Task name |
| start_time | TIME | NOT NULL | Start time |
| end_time | TIME | NOT NULL | End time |
| status | INTEGER | DEFAULT 1 | Status code |
| completed_at | TIMESTAMP | | Completion time |
| notes | TEXT | | Notes |
| created_at | TIMESTAMP | DEFAULT NOW | Created timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW | Updated timestamp |

**Status Codes**:
- 1 = Not Yet
- 2 = Done
- 3 = Skipped
- 4 = In Progress

---

### task_library
Task templates for daily schedule.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| task_lib_id | SERIAL | PRIMARY KEY | Auto-increment ID |
| task_code | VARCHAR(20) | UNIQUE, NOT NULL | Task code |
| task_name | VARCHAR(255) | NOT NULL | Task name |
| group_id | VARCHAR(20) | FK task_groups | Task group |
| duration_minutes | INTEGER | DEFAULT 15 | Duration |
| description | TEXT | | Description |
| is_active | BOOLEAN | DEFAULT true | Active flag |
| created_at | TIMESTAMP | DEFAULT NOW | Created timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW | Updated timestamp |

---

### daily_templates
Daily schedule templates.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| template_id | SERIAL | PRIMARY KEY | Auto-increment ID |
| template_name | VARCHAR(100) | NOT NULL | Template name |
| description | TEXT | | Description |
| template_data | JSONB | | Template configuration |
| applied_stores | JSONB | | Applied store IDs |
| is_active | BOOLEAN | DEFAULT true | Active flag |
| created_at | TIMESTAMP | DEFAULT NOW | Created timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW | Updated timestamp |

---

### shift_templates
Shift pattern templates.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| template_id | SERIAL | PRIMARY KEY | Auto-increment ID |
| template_name | VARCHAR(100) | NOT NULL | Template name |
| description | TEXT | | Description |
| shift_pattern | JSONB | | Pattern configuration |
| is_active | BOOLEAN | DEFAULT true | Active flag |
| created_at | TIMESTAMP | DEFAULT NOW | Created timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW | Updated timestamp |

---

## Aoi Manual Tables

### manual_folders
Folder hierarchy for manual documents.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| folder_id | SERIAL | PRIMARY KEY | Auto-increment ID |
| folder_name | VARCHAR(255) | NOT NULL | Folder name |
| parent_id | INTEGER | FK manual_folders | Parent folder |
| description | TEXT | | Description |
| icon | VARCHAR(50) | | Icon name |
| sort_order | INTEGER | DEFAULT 0 | Display order |
| is_active | BOOLEAN | DEFAULT true | Active flag |
| created_at | TIMESTAMP | DEFAULT NOW | Created timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW | Updated timestamp |

---

### manual_documents
Manual document metadata.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| document_id | SERIAL | PRIMARY KEY | Auto-increment ID |
| folder_id | INTEGER | FK manual_folders | Parent folder |
| title | VARCHAR(255) | NOT NULL | Document title |
| description | TEXT | | Description |
| version | VARCHAR(20) | DEFAULT '1.0' | Version number |
| status | VARCHAR(20) | DEFAULT 'draft' | draft/published/archived |
| tags | JSONB | | Tags array |
| created_by | INTEGER | FK staff | Creator |
| updated_by | INTEGER | FK staff | Last updater |
| published_at | TIMESTAMP | | Published time |
| created_at | TIMESTAMP | DEFAULT NOW | Created timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW | Updated timestamp |

---

### manual_steps
Step-by-step content for manual documents.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| step_id | SERIAL | PRIMARY KEY | Auto-increment ID |
| document_id | INTEGER | FK manual_documents | Parent document |
| step_number | INTEGER | NOT NULL | Step order |
| title | VARCHAR(255) | | Step title |
| content | TEXT | | Step content |
| tips | TEXT | | Tips/hints |
| warnings | TEXT | | Warnings |
| created_at | TIMESTAMP | DEFAULT NOW | Created timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW | Updated timestamp |

---

### manual_media
Media attachments for manual documents.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| media_id | SERIAL | PRIMARY KEY | Auto-increment ID |
| step_id | INTEGER | FK manual_steps | Parent step |
| document_id | INTEGER | FK manual_documents | Parent document |
| media_type | VARCHAR(20) | NOT NULL | image/video/pdf |
| file_path | TEXT | NOT NULL | File path |
| file_name | VARCHAR(255) | | Original filename |
| file_size | INTEGER | | Size in bytes |
| mime_type | VARCHAR(100) | | MIME type |
| alt_text | VARCHAR(255) | | Alt text |
| sort_order | INTEGER | DEFAULT 0 | Display order |
| created_at | TIMESTAMP | DEFAULT NOW | Created timestamp |

---

### manual_view_logs
Track document views for analytics.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| log_id | SERIAL | PRIMARY KEY | Auto-increment ID |
| document_id | INTEGER | FK manual_documents | Document viewed |
| staff_id | INTEGER | FK staff | Viewer |
| viewed_at | TIMESTAMP | DEFAULT NOW | View time |
| duration_seconds | INTEGER | | View duration |

---

## System Tables

### notifications
System notifications for staff.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| notification_id | SERIAL | PRIMARY KEY | Auto-increment ID |
| recipient_staff_id | INTEGER | FK staff CASCADE | Recipient |
| sender_staff_id | INTEGER | FK staff SET NULL | Sender |
| notification_type | VARCHAR(50) | | Type: task_assigned, shift_assigned |
| title | VARCHAR(255) | NOT NULL | Title |
| message | TEXT | | Message body |
| link_url | TEXT | | Related URL |
| is_read | BOOLEAN | DEFAULT false | Read flag |
| read_at | TIMESTAMP | | Read time |
| created_at | TIMESTAMP | DEFAULT NOW | Created timestamp |

---

### personal_access_tokens
Laravel Sanctum tokens.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGSERIAL | PRIMARY KEY | Auto-increment ID |
| tokenable_type | VARCHAR(255) | NOT NULL | Model type |
| tokenable_id | BIGINT | NOT NULL | Model ID |
| name | VARCHAR(255) | NOT NULL | Token name |
| token | VARCHAR(64) | UNIQUE, NOT NULL | Hashed token |
| abilities | TEXT | | Token abilities |
| last_used_at | TIMESTAMP | | Last used time |
| created_at | TIMESTAMP | DEFAULT NOW | Created timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW | Updated timestamp |

---

## Entity Relationships

```
regions (1) ──< (N) stores
stores (1) ──< (N) staff
departments (1) ──< (N) staff
stores (1) ─── (1) staff (manager)

staff (1) ──< (N) tasks (assigned_staff_id)
staff (1) ──< (N) tasks (do_staff_id)
staff (1) ──< (N) tasks (created_staff_id)
stores (1) ──< (N) tasks
departments (1) ──< (N) tasks
manuals (1) ──< (N) tasks
code_master (1) ──< (N) tasks (task_type_id)
code_master (1) ──< (N) tasks (status_id)

tasks (N) ──< task_check_list >── (N) check_lists

shift_codes (1) ──< (N) shift_assignments
staff (1) ──< (N) shift_assignments
stores (1) ──< (N) shift_assignments

task_groups (1) ──< (N) daily_schedule_tasks
staff (1) ──< (N) daily_schedule_tasks
stores (1) ──< (N) daily_schedule_tasks

manual_folders (1) ──< (N) manual_folders (self-ref)
manual_folders (1) ──< (N) manual_documents
manual_documents (1) ──< (N) manual_steps
manual_steps (1) ──< (N) manual_media
manual_documents (1) ──< (N) manual_view_logs

staff (1) ──< (N) notifications (recipient)
staff (1) ──< (N) notifications (sender)
staff (1) ──< (N) personal_access_tokens
```

---

## Indexes

| Table | Index | Columns |
|-------|-------|---------|
| staff | idx_staff_store | store_id |
| staff | idx_staff_department | department_id |
| staff | idx_staff_username | username |
| tasks | idx_tasks_status | status_id |
| tasks | idx_tasks_assigned_staff | assigned_staff_id |
| tasks | idx_tasks_dates | start_date, end_date |
| shift_assignments | idx_shift_assignments_staff | staff_id |
| shift_assignments | idx_shift_assignments_date | shift_date |
| daily_schedule_tasks | idx_daily_schedule_staff | staff_id |
| daily_schedule_tasks | idx_daily_schedule_date | schedule_date |
| notifications | idx_notifications_recipient | recipient_staff_id, is_read |

---

**Document Version**: 1.0
**Generated**: 2025-12-31
