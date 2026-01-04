# Enterprise Database Schema Design

> Version: 2.0
> Last Updated: 2026-01-04
> Author: Claude Code

## Overview

Thiết kế database cho hệ thống quản lý vận hành chuỗi cửa hàng với 6 modules:
- **WS** (Work Schedule) - Quản lý task
- **DWS** (Dispatch Work Schedule) - Lập lịch ca
- **Manual** - Knowledge Base
- **QC** (Quality Check) - Kiểm tra chất lượng
- **FAQ** - Hỏi đáp
- **Training** - Đào tạo

---

## Part 1: Core Schema (Shared Entities)

### 1.1 Organization Structure

```
Regions (Miền)
    └── Areas (Khu vực)
          └── Stores (Cửa hàng)
                └── Store Departments (Bộ phận cửa hàng)

HQ Departments (Phòng ban HQ)
    └── Teams (Nhóm)
```

### 1.2 Staff Hierarchy

```
HQ Staff:
  G9 (GD) → G8 (CCO) → G7 (SGM) → G6 (GM) → G5 (Manager) → G4 (Deputy) → G3 (Executive) → G2 (Officer)

Store Staff:
  S6 (Region Manager) → S5 (Area Manager) → S4 (SI) → S3 (Store Leader G3) → S2 (Store Leader G2) → S1 (Staff)
```

---

## Part 2: Detailed Table Specifications

### 2.1 Job Grades Table

```sql
CREATE TABLE "job_grades" (
    "grade_id" SERIAL PRIMARY KEY,
    "grade_code" VARCHAR(10) UNIQUE NOT NULL,           -- G2, G3, S1, S2...
    "grade_name" VARCHAR(100) NOT NULL,                 -- Officer, Store Leader...
    "grade_name_vi" VARCHAR(100),                       -- Tên tiếng Việt
    "grade_type" VARCHAR(10) NOT NULL,                  -- 'HQ' hoặc 'STORE'
    "level" INTEGER NOT NULL,                           -- Thứ tự cấp bậc (1 = thấp nhất)
    "color_code" VARCHAR(7),                            -- Màu hiển thị UI (#RRGGBB)
    "min_salary" DECIMAL(15,2),                         -- Lương tối thiểu
    "max_salary" DECIMAL(15,2),                         -- Lương tối đa
    "description" TEXT,
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chk_grade_type" CHECK (grade_type IN ('HQ', 'STORE'))
);

CREATE INDEX "idx_job_grades_type" ON "job_grades"("grade_type");
CREATE INDEX "idx_job_grades_level" ON "job_grades"("level");
```

### 2.2 Positions Table

```sql
CREATE TABLE "positions" (
    "position_id" SERIAL PRIMARY KEY,
    "position_code" VARCHAR(50) UNIQUE NOT NULL,        -- STAFF, SL_G2, AM, MGR...
    "position_name" VARCHAR(100) NOT NULL,              -- Store Leader G2, Area Manager...
    "position_name_vi" VARCHAR(100),                    -- Tên tiếng Việt
    "position_type" VARCHAR(10) NOT NULL,               -- 'HQ' hoặc 'STORE'
    "grade_id" INTEGER REFERENCES "job_grades"("grade_id"),
    "management_scope" VARCHAR(20) DEFAULT 'NONE',      -- Phạm vi quản lý
    "max_direct_reports" INTEGER,                       -- Số nhân viên trực tiếp tối đa
    "can_approve_leave" BOOLEAN DEFAULT false,          -- Có thể duyệt nghỉ phép
    "can_approve_overtime" BOOLEAN DEFAULT false,       -- Có thể duyệt tăng ca
    "can_manage_schedule" BOOLEAN DEFAULT false,        -- Có thể quản lý lịch
    "description" TEXT,
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chk_position_type" CHECK (position_type IN ('HQ', 'STORE')),
    CONSTRAINT "chk_management_scope" CHECK (management_scope IN ('NONE', 'TEAM', 'DEPARTMENT', 'STORE', 'MULTI_STORE', 'AREA', 'REGION', 'COMPANY'))
);

CREATE INDEX "idx_positions_type" ON "positions"("position_type");
CREATE INDEX "idx_positions_grade" ON "positions"("grade_id");
```

### 2.3 Regions Table (Enhanced)

```sql
CREATE TABLE "regions" (
    "region_id" SERIAL PRIMARY KEY,
    "region_code" VARCHAR(50) UNIQUE NOT NULL,          -- NORTH, SOUTH, CENTRAL...
    "region_name" VARCHAR(255) NOT NULL,
    "region_name_vi" VARCHAR(255),                      -- Miền Bắc, Miền Nam...
    "manager_id" INTEGER,                               -- Region Manager (FK to staff)
    "description" TEXT,
    "sort_order" INTEGER DEFAULT 0,
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "idx_regions_manager" ON "regions"("manager_id");
```

### 2.4 Areas Table (New)

```sql
CREATE TABLE "areas" (
    "area_id" SERIAL PRIMARY KEY,
    "area_code" VARCHAR(50) UNIQUE NOT NULL,            -- HN_CENTER, HN_HADONG...
    "area_name" VARCHAR(255) NOT NULL,
    "area_name_vi" VARCHAR(255),                        -- Hà Nội Trung Tâm...
    "region_id" INTEGER REFERENCES "regions"("region_id"),
    "manager_id" INTEGER,                               -- Area Manager (FK to staff)
    "description" TEXT,
    "sort_order" INTEGER DEFAULT 0,
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "idx_areas_region" ON "areas"("region_id");
CREATE INDEX "idx_areas_manager" ON "areas"("manager_id");
```

### 2.5 Stores Table (Enhanced)

```sql
CREATE TABLE "stores" (
    "store_id" SERIAL PRIMARY KEY,
    "store_code" VARCHAR(50) UNIQUE NOT NULL,           -- ST001, ST002...
    "store_name" VARCHAR(255) NOT NULL,
    "store_name_vi" VARCHAR(255),
    "store_type" VARCHAR(20) DEFAULT 'STANDARD',        -- STANDARD, FLAGSHIP, EXPRESS
    "region_id" INTEGER REFERENCES "regions"("region_id"),
    "area_id" INTEGER REFERENCES "areas"("area_id"),
    "address" TEXT,
    "ward" VARCHAR(100),                                -- Phường/Xã
    "district" VARCHAR(100),                            -- Quận/Huyện
    "city" VARCHAR(100),                                -- Tỉnh/Thành phố
    "phone" VARCHAR(20),
    "email" VARCHAR(100),
    "latitude" DECIMAL(10,8),                           -- Vị trí GPS
    "longitude" DECIMAL(11,8),
    "opening_date" DATE,
    "closing_date" DATE,                                -- Null nếu đang hoạt động
    "floor_area" DECIMAL(10,2),                         -- Diện tích (m2)
    "max_capacity" INTEGER,                             -- Số nhân viên tối đa
    "operating_hours" JSONB,                            -- {"mon": "08:00-22:00", ...}
    "status" VARCHAR(20) DEFAULT 'active',
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chk_store_type" CHECK (store_type IN ('STANDARD', 'FLAGSHIP', 'EXPRESS', 'WAREHOUSE')),
    CONSTRAINT "chk_store_status" CHECK (status IN ('active', 'inactive', 'renovation', 'closed'))
);

CREATE INDEX "idx_stores_region" ON "stores"("region_id");
CREATE INDEX "idx_stores_area" ON "stores"("area_id");
CREATE INDEX "idx_stores_status" ON "stores"("status");
```

### 2.6 HQ Departments Table (Enhanced)

```sql
CREATE TABLE "departments" (
    "department_id" SERIAL PRIMARY KEY,
    "department_code" VARCHAR(50) UNIQUE NOT NULL,      -- OP, ADMIN, HR...
    "department_name" VARCHAR(255) NOT NULL,
    "department_name_vi" VARCHAR(255),
    "department_type" VARCHAR(10) DEFAULT 'HQ',         -- HQ, STORE (store-level depts)
    "parent_id" INTEGER REFERENCES "departments"("department_id"),
    "head_position_id" INTEGER REFERENCES "positions"("position_id"), -- Vị trí Head
    "manager_id" INTEGER,                               -- Current Head (FK to staff)
    "cost_center" VARCHAR(50),                          -- Mã trung tâm chi phí
    "budget_code" VARCHAR(50),                          -- Mã ngân sách
    "icon" VARCHAR(50),
    "icon_color" VARCHAR(20),
    "icon_bg" VARCHAR(50),
    "sort_order" INTEGER DEFAULT 0,
    "description" TEXT,
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chk_department_type" CHECK (department_type IN ('HQ', 'STORE'))
);

CREATE INDEX "idx_departments_parent" ON "departments"("parent_id");
CREATE INDEX "idx_departments_type" ON "departments"("department_type");
CREATE INDEX "idx_departments_manager" ON "departments"("manager_id");
```

### 2.7 Teams Table (Enhanced)

```sql
CREATE TABLE "teams" (
    "team_id" SERIAL PRIMARY KEY,
    "team_code" VARCHAR(50) UNIQUE NOT NULL,
    "team_name" VARCHAR(255) NOT NULL,
    "team_name_vi" VARCHAR(255),
    "department_id" INTEGER REFERENCES "departments"("department_id"),
    "leader_id" INTEGER,                                -- Team Leader (FK to staff)
    "icon" VARCHAR(50),
    "icon_color" VARCHAR(20),
    "icon_bg" VARCHAR(50),
    "sort_order" INTEGER DEFAULT 0,
    "max_members" INTEGER,
    "description" TEXT,
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "idx_teams_department" ON "teams"("department_id");
CREATE INDEX "idx_teams_leader" ON "teams"("leader_id");
```

### 2.8 Staff Table (Enhanced)

```sql
CREATE TABLE "staff" (
    "staff_id" SERIAL PRIMARY KEY,
    "staff_code" VARCHAR(50) UNIQUE NOT NULL,           -- Employee code
    "sap_code" VARCHAR(20) UNIQUE,                      -- SAP Employee ID
    "staff_name" VARCHAR(255) NOT NULL,
    "username" VARCHAR(100) UNIQUE NOT NULL,
    "email" VARCHAR(100) UNIQUE,
    "phone" VARCHAR(20),
    "personal_email" VARCHAR(100),                      -- Email cá nhân
    "personal_phone" VARCHAR(20),                       -- SĐT cá nhân

    -- Classification
    "staff_type" VARCHAR(10) NOT NULL DEFAULT 'HQ',     -- HQ, STORE
    "position_id" INTEGER REFERENCES "positions"("position_id"),
    "grade_id" INTEGER REFERENCES "job_grades"("grade_id"),

    -- Organization (cho HQ Staff)
    "department_id" INTEGER REFERENCES "departments"("department_id"),
    "team_id" INTEGER REFERENCES "teams"("team_id"),

    -- Store Assignment (cho Store Staff - primary store)
    "primary_store_id" INTEGER REFERENCES "stores"("store_id"),

    -- Reporting
    "line_manager_id" INTEGER REFERENCES "staff"("staff_id"),
    "dotted_line_manager_id" INTEGER REFERENCES "staff"("staff_id"), -- Báo cáo chấm (matrix org)

    -- Personal Info
    "date_of_birth" DATE,
    "gender" VARCHAR(10),
    "national_id" VARCHAR(20),                          -- CCCD/CMND
    "tax_code" VARCHAR(20),                             -- Mã số thuế
    "bank_account" VARCHAR(50),
    "bank_name" VARCHAR(100),
    "permanent_address" TEXT,
    "current_address" TEXT,
    "avatar_url" VARCHAR(500),

    -- Employment
    "joining_date" DATE,
    "probation_end_date" DATE,
    "contract_type" VARCHAR(20),                        -- PROBATION, DEFINITE, INDEFINITE
    "contract_end_date" DATE,
    "termination_date" DATE,
    "termination_reason" TEXT,

    -- Compensation (basic info, detail in salary table)
    "base_salary" DECIMAL(15,2),
    "hourly_rate" DECIMAL(10,2),

    -- Skills & Certifications
    "skills" JSONB,                                     -- ["POS", "Inventory", "Customer Service"]
    "certifications" JSONB,                             -- [{"name": "Food Safety", "expiry": "2025-12-31"}]

    -- System
    "password_hash" VARCHAR(255) NOT NULL,
    "status" VARCHAR(20) DEFAULT 'active',
    "is_active" BOOLEAN DEFAULT true,
    "last_login_at" TIMESTAMP,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chk_staff_type" CHECK (staff_type IN ('HQ', 'STORE')),
    CONSTRAINT "chk_gender" CHECK (gender IN ('MALE', 'FEMALE', 'OTHER')),
    CONSTRAINT "chk_contract_type" CHECK (contract_type IN ('PROBATION', 'DEFINITE', 'INDEFINITE', 'PART_TIME', 'SEASONAL')),
    CONSTRAINT "chk_staff_status" CHECK (status IN ('active', 'inactive', 'on_leave', 'suspended', 'terminated'))
);

CREATE INDEX "idx_staff_type" ON "staff"("staff_type");
CREATE INDEX "idx_staff_position" ON "staff"("position_id");
CREATE INDEX "idx_staff_grade" ON "staff"("grade_id");
CREATE INDEX "idx_staff_department" ON "staff"("department_id");
CREATE INDEX "idx_staff_team" ON "staff"("team_id");
CREATE INDEX "idx_staff_primary_store" ON "staff"("primary_store_id");
CREATE INDEX "idx_staff_line_manager" ON "staff"("line_manager_id");
CREATE INDEX "idx_staff_status" ON "staff"("status");
```

### 2.9 Store Assignments Table (Multi-store management)

```sql
CREATE TABLE "store_assignments" (
    "assignment_id" SERIAL PRIMARY KEY,
    "staff_id" INTEGER NOT NULL REFERENCES "staff"("staff_id"),
    "store_id" INTEGER NOT NULL REFERENCES "stores"("store_id"),
    "assignment_type" VARCHAR(20) NOT NULL,             -- PRIMARY, SECONDARY, TEMPORARY, SUPPORT
    "role_at_store" VARCHAR(50),                        -- Vai trò tại store này
    "is_primary" BOOLEAN DEFAULT false,                 -- Store chính
    "start_date" DATE NOT NULL,
    "end_date" DATE,                                    -- Null = vô thời hạn
    "assigned_by" INTEGER REFERENCES "staff"("staff_id"),
    "notes" TEXT,
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chk_assignment_type" CHECK (assignment_type IN ('PRIMARY', 'SECONDARY', 'TEMPORARY', 'SUPPORT', 'TRAINING')),
    CONSTRAINT "unique_staff_store_active" UNIQUE ("staff_id", "store_id", "is_active")
        WHERE is_active = true
);

CREATE INDEX "idx_store_assignments_staff" ON "store_assignments"("staff_id");
CREATE INDEX "idx_store_assignments_store" ON "store_assignments"("store_id");
CREATE INDEX "idx_store_assignments_active" ON "store_assignments"("is_active");
```

### 2.10 Salary & Compensation

```sql
CREATE TABLE "salary_grades" (
    "salary_grade_id" SERIAL PRIMARY KEY,
    "grade_id" INTEGER REFERENCES "job_grades"("grade_id"),
    "effective_date" DATE NOT NULL,
    "min_salary" DECIMAL(15,2) NOT NULL,
    "max_salary" DECIMAL(15,2) NOT NULL,
    "standard_salary" DECIMAL(15,2),                    -- Mức lương chuẩn
    "currency" VARCHAR(3) DEFAULT 'VND',
    "notes" TEXT,
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "staff_salaries" (
    "salary_id" SERIAL PRIMARY KEY,
    "staff_id" INTEGER NOT NULL REFERENCES "staff"("staff_id"),
    "effective_date" DATE NOT NULL,
    "base_salary" DECIMAL(15,2) NOT NULL,               -- Lương cơ bản
    "allowances" JSONB,                                 -- {"housing": 2000000, "transport": 500000}
    "deductions" JSONB,                                 -- {"insurance": 500000}
    "gross_salary" DECIMAL(15,2) GENERATED ALWAYS AS (
        base_salary + COALESCE((allowances->>'total')::DECIMAL, 0)
    ) STORED,
    "currency" VARCHAR(3) DEFAULT 'VND',
    "approved_by" INTEGER REFERENCES "staff"("staff_id"),
    "approved_at" TIMESTAMP,
    "notes" TEXT,
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "idx_staff_salaries_staff" ON "staff_salaries"("staff_id");
CREATE INDEX "idx_staff_salaries_effective" ON "staff_salaries"("effective_date");
```

---

## Part 3: Permission & Access Control

### 3.1 Enhanced Permission System

```sql
-- Spatie Permission tables đã có, thêm custom extensions

-- Module-based permissions
CREATE TABLE "module_permissions" (
    "module_permission_id" SERIAL PRIMARY KEY,
    "module_code" VARCHAR(20) NOT NULL,                 -- WS, DWS, MANUAL, QC, FAQ, TRAINING
    "permission_code" VARCHAR(100) NOT NULL,            -- view_tasks, create_tasks, approve_tasks
    "permission_name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "unique_module_permission" UNIQUE ("module_code", "permission_code")
);

-- Position-Permission mapping (Default permissions theo Position)
CREATE TABLE "position_permissions" (
    "id" SERIAL PRIMARY KEY,
    "position_id" INTEGER REFERENCES "positions"("position_id"),
    "module_permission_id" INTEGER REFERENCES "module_permissions"("module_permission_id"),
    "can_view" BOOLEAN DEFAULT false,
    "can_create" BOOLEAN DEFAULT false,
    "can_edit" BOOLEAN DEFAULT false,
    "can_delete" BOOLEAN DEFAULT false,
    "can_approve" BOOLEAN DEFAULT false,
    "scope" VARCHAR(20) DEFAULT 'OWN',                  -- OWN, TEAM, DEPARTMENT, STORE, AREA, REGION, ALL
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "unique_position_module" UNIQUE ("position_id", "module_permission_id")
);

-- Store-specific permissions (Override cho từng store)
CREATE TABLE "store_staff_permissions" (
    "id" SERIAL PRIMARY KEY,
    "staff_id" INTEGER REFERENCES "staff"("staff_id"),
    "store_id" INTEGER REFERENCES "stores"("store_id"),
    "module_permission_id" INTEGER REFERENCES "module_permissions"("module_permission_id"),
    "granted" BOOLEAN DEFAULT true,
    "granted_by" INTEGER REFERENCES "staff"("staff_id"),
    "granted_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP,
    "notes" TEXT,

    CONSTRAINT "unique_staff_store_permission" UNIQUE ("staff_id", "store_id", "module_permission_id")
);
```

---

## Part 4: Code Master & Lookup Tables

### 4.1 Enhanced Code Master

```sql
CREATE TABLE "code_master" (
    "code_id" SERIAL PRIMARY KEY,
    "code_type" VARCHAR(50) NOT NULL,                   -- STATUS, TASK_TYPE, SHIFT_TYPE...
    "code" VARCHAR(50) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "name_vi" VARCHAR(255),
    "description" TEXT,
    "parent_code" VARCHAR(50),                          -- Cho hierarchical codes
    "extra_data" JSONB,                                 -- Thông tin bổ sung
    "sort_order" INTEGER DEFAULT 0,
    "is_system" BOOLEAN DEFAULT false,                  -- System codes không được xóa
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "unique_code_type_code" UNIQUE ("code_type", "code")
);

CREATE INDEX "idx_code_master_type" ON "code_master"("code_type");
CREATE INDEX "idx_code_master_active" ON "code_master"("is_active");
```

---

## Part 5: Audit & History

### 5.1 Audit Log

```sql
CREATE TABLE "audit_logs" (
    "audit_id" BIGSERIAL PRIMARY KEY,
    "table_name" VARCHAR(100) NOT NULL,
    "record_id" INTEGER NOT NULL,
    "action" VARCHAR(20) NOT NULL,                      -- INSERT, UPDATE, DELETE
    "old_values" JSONB,
    "new_values" JSONB,
    "changed_fields" TEXT[],
    "performed_by" INTEGER REFERENCES "staff"("staff_id"),
    "performed_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "ip_address" INET,
    "user_agent" TEXT,
    "module" VARCHAR(20)                                -- WS, DWS, etc.
);

CREATE INDEX "idx_audit_logs_table" ON "audit_logs"("table_name", "record_id");
CREATE INDEX "idx_audit_logs_performed_by" ON "audit_logs"("performed_by");
CREATE INDEX "idx_audit_logs_performed_at" ON "audit_logs"("performed_at");
```

### 5.2 Staff History (Position/Grade changes)

```sql
CREATE TABLE "staff_history" (
    "history_id" SERIAL PRIMARY KEY,
    "staff_id" INTEGER NOT NULL REFERENCES "staff"("staff_id"),
    "change_type" VARCHAR(50) NOT NULL,                 -- PROMOTION, TRANSFER, SALARY_CHANGE, STATUS_CHANGE
    "change_date" DATE NOT NULL,
    "old_value" JSONB,
    "new_value" JSONB,
    "reason" TEXT,
    "approved_by" INTEGER REFERENCES "staff"("staff_id"),
    "effective_date" DATE,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "idx_staff_history_staff" ON "staff_history"("staff_id");
CREATE INDEX "idx_staff_history_type" ON "staff_history"("change_type");
CREATE INDEX "idx_staff_history_date" ON "staff_history"("change_date");
```

---

## Part 6: Seed Data

### 6.1 Job Grades Seed

```sql
-- HQ Job Grades
INSERT INTO "job_grades" (grade_code, grade_name, grade_name_vi, grade_type, level, color_code) VALUES
('G2', 'Officer', 'Nhân viên', 'HQ', 1, '#9CA3AF'),
('G3', 'Executive', 'Chuyên viên', 'HQ', 2, '#22A6A1'),
('G4', 'Deputy Manager', 'Phó Trưởng phòng', 'HQ', 3, '#1F7BF2'),
('G5', 'Manager', 'Trưởng phòng', 'HQ', 4, '#8B5CF6'),
('G6', 'General Manager', 'Tổng Giám đốc phòng', 'HQ', 5, '#FF9900'),
('G7', 'Senior General Manager', 'Giám đốc khối', 'HQ', 6, '#DC2626'),
('G8', 'CCO', 'Giám đốc điều hành', 'HQ', 7, '#991B1B'),
('G9', 'General Director', 'Tổng Giám đốc', 'HQ', 8, '#7C3AED');

-- Store Job Grades
INSERT INTO "job_grades" (grade_code, grade_name, grade_name_vi, grade_type, level, color_code) VALUES
('S1', 'Staff', 'Nhân viên cửa hàng', 'STORE', 1, '#9CA3AF'),
('S2', 'Store Leader G2', 'Phó Trưởng cửa hàng', 'STORE', 2, '#81AADB'),
('S3', 'Store Leader G3', 'Trưởng cửa hàng', 'STORE', 3, '#22A6A1'),
('S4', 'Store In-charge', 'Trưởng cụm cửa hàng', 'STORE', 4, '#1F7BF2'),
('S5', 'Area Manager', 'Quản lý khu vực', 'STORE', 5, '#8B5CF6'),
('S6', 'Region Manager', 'Quản lý miền', 'STORE', 6, '#FF9900');
```

### 6.2 Positions Seed

```sql
-- HQ Positions
INSERT INTO "positions" (position_code, position_name, position_name_vi, position_type, grade_id, management_scope) VALUES
('HQ_OFFICER', 'Officer', 'Nhân viên', 'HQ', (SELECT grade_id FROM job_grades WHERE grade_code = 'G2'), 'NONE'),
('HQ_EXEC', 'Executive', 'Chuyên viên', 'HQ', (SELECT grade_id FROM job_grades WHERE grade_code = 'G3'), 'NONE'),
('HQ_DEPUTY', 'Deputy Manager', 'Phó Trưởng phòng', 'HQ', (SELECT grade_id FROM job_grades WHERE grade_code = 'G4'), 'TEAM'),
('HQ_MANAGER', 'Manager', 'Trưởng phòng', 'HQ', (SELECT grade_id FROM job_grades WHERE grade_code = 'G5'), 'DEPARTMENT'),
('HQ_GM', 'General Manager', 'Tổng Giám đốc phòng', 'HQ', (SELECT grade_id FROM job_grades WHERE grade_code = 'G6'), 'DEPARTMENT'),
('HQ_SGM', 'Senior General Manager', 'Giám đốc khối', 'HQ', (SELECT grade_id FROM job_grades WHERE grade_code = 'G7'), 'COMPANY'),
('HQ_CCO', 'CCO', 'Giám đốc điều hành', 'HQ', (SELECT grade_id FROM job_grades WHERE grade_code = 'G8'), 'COMPANY'),
('HQ_GD', 'General Director', 'Tổng Giám đốc', 'HQ', (SELECT grade_id FROM job_grades WHERE grade_code = 'G9'), 'COMPANY');

-- Store Positions
INSERT INTO "positions" (position_code, position_name, position_name_vi, position_type, grade_id, management_scope, can_manage_schedule) VALUES
('STORE_STAFF', 'Staff', 'Nhân viên cửa hàng', 'STORE', (SELECT grade_id FROM job_grades WHERE grade_code = 'S1'), 'NONE', false),
('STORE_SL_G2', 'Store Leader G2', 'Phó Trưởng cửa hàng', 'STORE', (SELECT grade_id FROM job_grades WHERE grade_code = 'S2'), 'STORE', true),
('STORE_SL_G3', 'Store Leader G3', 'Trưởng cửa hàng', 'STORE', (SELECT grade_id FROM job_grades WHERE grade_code = 'S3'), 'STORE', true),
('STORE_SI', 'Store In-charge', 'Trưởng cụm cửa hàng', 'STORE', (SELECT grade_id FROM job_grades WHERE grade_code = 'S4'), 'MULTI_STORE', true),
('STORE_AM', 'Area Manager', 'Quản lý khu vực', 'STORE', (SELECT grade_id FROM job_grades WHERE grade_code = 'S5'), 'AREA', true),
('STORE_RM', 'Region Manager', 'Quản lý miền', 'STORE', (SELECT grade_id FROM job_grades WHERE grade_code = 'S6'), 'REGION', true);
```

### 6.3 Module Permissions Seed

```sql
-- WS Module Permissions
INSERT INTO "module_permissions" (module_code, permission_code, permission_name) VALUES
('WS', 'view_tasks', 'View Tasks'),
('WS', 'create_tasks', 'Create Tasks'),
('WS', 'edit_tasks', 'Edit Tasks'),
('WS', 'delete_tasks', 'Delete Tasks'),
('WS', 'assign_tasks', 'Assign Tasks'),
('WS', 'approve_tasks', 'Approve Tasks'),
('WS', 'view_reports', 'View WS Reports');

-- DWS Module Permissions
INSERT INTO "module_permissions" (module_code, permission_code, permission_name) VALUES
('DWS', 'view_schedule', 'View Schedule'),
('DWS', 'create_schedule', 'Create Schedule'),
('DWS', 'edit_schedule', 'Edit Schedule'),
('DWS', 'approve_schedule', 'Approve Schedule'),
('DWS', 'manage_shifts', 'Manage Shift Codes'),
('DWS', 'view_timesheet', 'View Timesheet'),
('DWS', 'approve_timesheet', 'Approve Timesheet');

-- Manual Module Permissions
INSERT INTO "module_permissions" (module_code, permission_code, permission_name) VALUES
('MANUAL', 'view_documents', 'View Documents'),
('MANUAL', 'create_documents', 'Create Documents'),
('MANUAL', 'edit_documents', 'Edit Documents'),
('MANUAL', 'delete_documents', 'Delete Documents'),
('MANUAL', 'approve_documents', 'Approve Documents'),
('MANUAL', 'manage_categories', 'Manage Categories');

-- QC Module Permissions
INSERT INTO "module_permissions" (module_code, permission_code, permission_name) VALUES
('QC', 'view_audits', 'View Audits'),
('QC', 'create_audits', 'Create Audits'),
('QC', 'perform_audits', 'Perform Audits'),
('QC', 'approve_audits', 'Approve Audits'),
('QC', 'view_qc_reports', 'View QC Reports');

-- FAQ Module Permissions
INSERT INTO "module_permissions" (module_code, permission_code, permission_name) VALUES
('FAQ', 'view_faqs', 'View FAQs'),
('FAQ', 'create_faqs', 'Create FAQs'),
('FAQ', 'edit_faqs', 'Edit FAQs'),
('FAQ', 'delete_faqs', 'Delete FAQs'),
('FAQ', 'answer_questions', 'Answer Questions');

-- Training Module Permissions
INSERT INTO "module_permissions" (module_code, permission_code, permission_name) VALUES
('TRAINING', 'view_courses', 'View Courses'),
('TRAINING', 'create_courses', 'Create Courses'),
('TRAINING', 'manage_courses', 'Manage Courses'),
('TRAINING', 'enroll_staff', 'Enroll Staff'),
('TRAINING', 'view_progress', 'View Training Progress'),
('TRAINING', 'issue_certificates', 'Issue Certificates');
```

---

## Part 7: Migration Strategy & Improvement Roadmap

> **Mục đích**: Tài liệu này là bản đề xuất cải tiến DB, được ghi nhận trong quá trình phát triển.
> Schema hiện tại đang dùng: `docs/04-database/DB_DATABASE_STRUCTURE.md`

---

### 🎯 Improvement Priority Matrix

| Priority | Category | Risk Level | Effort | Description |
|----------|----------|------------|--------|-------------|
| **P1** | Critical | Low | Medium | Cần thiết để scale, không breaking changes |
| **P2** | Important | Medium | High | Cải thiện performance/maintainability đáng kể |
| **P3** | Nice-to-have | High | High | Tối ưu nhưng có thể delay |

---

### 📋 Phase 1: Normalization (P1 - Critical)

**Objective**: Normalize các string columns thành reference tables

**Duration estimate**: N/A - Phụ thuộc PM approval

#### 1.1 Job Grades Normalization
| Current | Proposed | Impact |
|---------|----------|--------|
| `staff.job_grade VARCHAR` | `staff.grade_id FK` → `job_grades` | All modules using staff data |

**Detailed Steps:**
```
1. CREATE TABLE job_grades (không ảnh hưởng existing data)
2. INSERT seed data cho HQ (G2-G9) và Store (S1-S6)
3. ADD COLUMN staff.grade_id INTEGER (nullable)
4. UPDATE staff SET grade_id = (SELECT grade_id FROM job_grades WHERE grade_code = job_grade)
5. Verify data integrity
6. ALTER COLUMN grade_id SET NOT NULL (sau khi migrate)
7. DROP COLUMN job_grade (optional - keep for backward compat)
```

**Rollback Plan:**
```sql
-- Nếu cần rollback
UPDATE staff SET job_grade = (SELECT grade_code FROM job_grades WHERE grade_id = staff.grade_id);
ALTER TABLE staff DROP COLUMN grade_id;
```

#### 1.2 Positions Normalization
| Current | Proposed | Impact |
|---------|----------|--------|
| `staff.position VARCHAR` | `staff.position_id FK` → `positions` | All staff-related queries |

**Migration query:**
```sql
-- Create mapping từ existing positions
INSERT INTO positions (position_code, position_name, position_type)
SELECT DISTINCT
    REPLACE(UPPER(position), ' ', '_'),
    position,
    CASE WHEN position LIKE '%Store%' THEN 'STORE' ELSE 'HQ' END
FROM staff WHERE position IS NOT NULL;
```

#### 1.3 Areas Table (New)
| Current | Proposed | Impact |
|---------|----------|--------|
| Stores belong directly to regions | Stores → Areas → Regions | Store hierarchy queries |

**Why needed:**
- Hệ thống cần Area Manager quản lý nhiều stores trong cùng area
- Hiện tại không có entity để group stores theo area
- Store In-charge (SI) quản lý cụm stores cần area assignment

---

### 📋 Phase 2: Enhanced Staff Management (P1)

#### 2.1 Staff Type Classification
```sql
ALTER TABLE staff ADD COLUMN staff_type VARCHAR(10) DEFAULT 'HQ';
-- Values: 'HQ', 'STORE'
```

**Business Rule:**
- HQ staff: Assigned to departments, teams
- Store staff: Assigned to stores via store_assignments

#### 2.2 Store Assignments (Multi-store support)
| Requirement | Solution |
|-------------|----------|
| SI manages 2-3 stores | `store_assignments` table with `assignment_type` |
| Staff can work at multiple stores | Track PRIMARY vs SECONDARY assignments |
| Temporary assignments | `start_date`, `end_date` tracking |

**Use cases:**
1. **Store In-charge (SI)**: PRIMARY store + SECONDARY stores they oversee
2. **Seasonal staff**: TEMPORARY assignment during peak seasons
3. **Training**: TRAINING assignment when onboarding at different store

---

### 📋 Phase 3: Permission System Enhancement (P2)

#### 3.1 Module-based Permissions
| Current | Proposed |
|---------|----------|
| Basic role-permission via Spatie | Module-specific permissions with scope |

**Permission Scope Levels:**
```
OWN       → Only own records
TEAM      → Team members' records
DEPARTMENT → Department records
STORE     → Single store
MULTI_STORE → Assigned stores (for SI)
AREA      → All stores in area
REGION    → All stores in region
ALL       → Company-wide
```

#### 3.2 Position-Permission Defaults
- Mỗi position có default permissions
- Admin có thể override cho từng staff
- Store-specific permissions cho multi-store staff

---

### 📋 Phase 4: Audit & History (P2)

#### 4.1 Audit Logging
- Track all CRUD operations
- Store old/new values as JSONB
- Essential for compliance và debugging

#### 4.2 Staff History
- Track promotions, transfers, salary changes
- Required for HR reporting

---

### 📋 Phase 5: Advanced Features (P3 - Nice-to-have)

#### 5.1 Salary & Compensation Tables
- Salary ranges per grade
- Staff salary history
- Allowances & deductions tracking

#### 5.2 Enhanced Code Master
- Hierarchical code support
- Localization (name_vi)
- Extra metadata via JSONB

---

### 🔄 Implementation Sequence

```
Step 1: [P1] job_grades table + seed data
        └── No breaking changes, pure addition

Step 2: [P1] positions table + seed data
        └── No breaking changes, pure addition

Step 3: [P1] areas table + migrate from regions
        └── Low risk, stores still work without area_id

Step 4: [P1] Add FK columns to staff (nullable)
        └── staff.grade_id, staff.position_id, staff.staff_type

Step 5: [P1] Data migration scripts
        └── Map existing string values to new FKs

Step 6: [P1] store_assignments table
        └── Enable multi-store management

Step 7: [P2] Permission tables
        └── Can be done after core tables stable

Step 8: [P2] Audit tables
        └── Independent, can add anytime

Step 9: [P3] Salary tables
        └── Future enhancement
```

---

### ⚠️ Risk Assessment

| Risk | Mitigation |
|------|------------|
| Breaking existing APIs | Add new columns as nullable, keep old columns |
| Data migration errors | Run in transaction, verify counts before/after |
| Performance impact | Add indexes before migration |
| Frontend breaking | Update types incrementally, support both old/new |

---

### 📝 Discovered Issues During Development

> Section này được cập nhật trong quá trình phát triển WS module.
> Format theo hướng dẫn trong CLAUDE.md

#### Template:
```markdown
### [DATE] Issue: [Tên vấn đề]
- **Table**: [table_name]
- **Current**: [mô tả hiện tại]
- **Problem**: [vấn đề gặp phải]
- **Proposed Solution**: [giải pháp đề xuất]
- **Impact**: [ảnh hưởng nếu thay đổi]
- **Priority**: [High/Medium/Low]
```

---

*Chưa có issues được ghi nhận. Section này sẽ được cập nhật khi phát hiện vấn đề trong quá trình development.*

---

## Appendix: ER Diagram

```
                                    ┌─────────────┐
                                    │  job_grades │
                                    └──────┬──────┘
                                           │
┌──────────┐     ┌──────────┐     ┌───────┴───────┐
│  regions │────>│   areas  │────>│   positions   │
└────┬─────┘     └────┬─────┘     └───────┬───────┘
     │                │                    │
     │                │           ┌────────┴────────┐
     │                │           │                 │
     │           ┌────┴────┐     ┌┴─────────┐  ┌────┴─────┐
     │           │  stores │<────│  staff   │──│departments│
     │           └────┬────┘     └────┬─────┘  └──────────┘
     │                │               │              │
     │                │               │         ┌────┴────┐
     │           ┌────┴──────────┐    │         │  teams  │
     │           │store_assignments│<─┘         └─────────┘
     │           └───────────────┘
     │
     └────────────────────────────────────────────────────┐
                                                          │
┌─────────────────────────────────────────────────────────┘
│
│   ┌─────────────────┐     ┌─────────────────────┐
└──>│module_permissions│────>│position_permissions │
    └─────────────────┘     └─────────────────────┘
```
