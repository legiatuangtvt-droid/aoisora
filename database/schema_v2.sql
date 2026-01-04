-- ============================================================================
-- AURA WEB - Enterprise Database Schema v2.0
-- ============================================================================
-- Description: Database schema for retail chain management system
-- Modules: WS, DWS, Manual, QC, FAQ, Training
-- Version: 2.0
-- Created: 2026-01-04
-- ============================================================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- PART 1: CORE TABLES - Job Grades & Positions
-- ============================================================================

-- Job Grades (Cấp bậc công việc)
CREATE TABLE "job_grades" (
    "grade_id" SERIAL PRIMARY KEY,
    "grade_code" VARCHAR(10) UNIQUE NOT NULL,
    "grade_name" VARCHAR(100) NOT NULL,
    "grade_name_vi" VARCHAR(100),
    "grade_type" VARCHAR(10) NOT NULL,
    "level" INTEGER NOT NULL,
    "color_code" VARCHAR(7),
    "min_salary" DECIMAL(15,2),
    "max_salary" DECIMAL(15,2),
    "description" TEXT,
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chk_grade_type" CHECK (grade_type IN ('HQ', 'STORE'))
);

CREATE INDEX "idx_job_grades_type" ON "job_grades"("grade_type");
CREATE INDEX "idx_job_grades_level" ON "job_grades"("level");

-- Positions (Chức vụ)
CREATE TABLE "positions" (
    "position_id" SERIAL PRIMARY KEY,
    "position_code" VARCHAR(50) UNIQUE NOT NULL,
    "position_name" VARCHAR(100) NOT NULL,
    "position_name_vi" VARCHAR(100),
    "position_type" VARCHAR(10) NOT NULL,
    "grade_id" INTEGER REFERENCES "job_grades"("grade_id"),
    "management_scope" VARCHAR(20) DEFAULT 'NONE',
    "max_direct_reports" INTEGER,
    "can_approve_leave" BOOLEAN DEFAULT false,
    "can_approve_overtime" BOOLEAN DEFAULT false,
    "can_manage_schedule" BOOLEAN DEFAULT false,
    "description" TEXT,
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chk_position_type" CHECK (position_type IN ('HQ', 'STORE')),
    CONSTRAINT "chk_management_scope" CHECK (management_scope IN ('NONE', 'TEAM', 'DEPARTMENT', 'STORE', 'MULTI_STORE', 'AREA', 'REGION', 'COMPANY'))
);

CREATE INDEX "idx_positions_type" ON "positions"("position_type");
CREATE INDEX "idx_positions_grade" ON "positions"("grade_id");

-- ============================================================================
-- PART 2: ORGANIZATION STRUCTURE
-- ============================================================================

-- Regions (Miền)
CREATE TABLE "regions" (
    "region_id" SERIAL PRIMARY KEY,
    "region_code" VARCHAR(50) UNIQUE NOT NULL,
    "region_name" VARCHAR(255) NOT NULL,
    "region_name_vi" VARCHAR(255),
    "manager_id" INTEGER,
    "description" TEXT,
    "sort_order" INTEGER DEFAULT 0,
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Areas (Khu vực - giữa Region và Store)
CREATE TABLE "areas" (
    "area_id" SERIAL PRIMARY KEY,
    "area_code" VARCHAR(50) UNIQUE NOT NULL,
    "area_name" VARCHAR(255) NOT NULL,
    "area_name_vi" VARCHAR(255),
    "region_id" INTEGER REFERENCES "regions"("region_id"),
    "manager_id" INTEGER,
    "description" TEXT,
    "sort_order" INTEGER DEFAULT 0,
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "idx_areas_region" ON "areas"("region_id");

-- Stores (Cửa hàng)
CREATE TABLE "stores" (
    "store_id" SERIAL PRIMARY KEY,
    "store_code" VARCHAR(50) UNIQUE NOT NULL,
    "store_name" VARCHAR(255) NOT NULL,
    "store_name_vi" VARCHAR(255),
    "store_type" VARCHAR(20) DEFAULT 'STANDARD',
    "region_id" INTEGER REFERENCES "regions"("region_id"),
    "area_id" INTEGER REFERENCES "areas"("area_id"),
    "address" TEXT,
    "ward" VARCHAR(100),
    "district" VARCHAR(100),
    "city" VARCHAR(100),
    "phone" VARCHAR(20),
    "email" VARCHAR(100),
    "latitude" DECIMAL(10,8),
    "longitude" DECIMAL(11,8),
    "opening_date" DATE,
    "closing_date" DATE,
    "floor_area" DECIMAL(10,2),
    "max_capacity" INTEGER,
    "operating_hours" JSONB,
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

-- Departments (Phòng ban)
CREATE TABLE "departments" (
    "department_id" SERIAL PRIMARY KEY,
    "department_code" VARCHAR(50) UNIQUE NOT NULL,
    "department_name" VARCHAR(255) NOT NULL,
    "department_name_vi" VARCHAR(255),
    "department_type" VARCHAR(10) DEFAULT 'HQ',
    "parent_id" INTEGER REFERENCES "departments"("department_id"),
    "head_position_id" INTEGER REFERENCES "positions"("position_id"),
    "manager_id" INTEGER,
    "cost_center" VARCHAR(50),
    "budget_code" VARCHAR(50),
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

-- Teams (Nhóm)
CREATE TABLE "teams" (
    "team_id" SERIAL PRIMARY KEY,
    "team_code" VARCHAR(50) UNIQUE NOT NULL,
    "team_name" VARCHAR(255) NOT NULL,
    "team_name_vi" VARCHAR(255),
    "department_id" INTEGER REFERENCES "departments"("department_id"),
    "leader_id" INTEGER,
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

-- ============================================================================
-- PART 3: STAFF & HUMAN RESOURCES
-- ============================================================================

-- Staff (Nhân viên)
CREATE TABLE "staff" (
    "staff_id" SERIAL PRIMARY KEY,
    "staff_code" VARCHAR(50) UNIQUE NOT NULL,
    "sap_code" VARCHAR(20) UNIQUE,
    "staff_name" VARCHAR(255) NOT NULL,
    "username" VARCHAR(100) UNIQUE NOT NULL,
    "email" VARCHAR(100) UNIQUE,
    "phone" VARCHAR(20),
    "personal_email" VARCHAR(100),
    "personal_phone" VARCHAR(20),

    -- Classification
    "staff_type" VARCHAR(10) NOT NULL DEFAULT 'HQ',
    "position_id" INTEGER REFERENCES "positions"("position_id"),
    "grade_id" INTEGER REFERENCES "job_grades"("grade_id"),

    -- Legacy columns (for backward compatibility during migration)
    "role" VARCHAR(50),
    "position" VARCHAR(100),
    "job_grade" VARCHAR(10),

    -- Organization (HQ Staff)
    "department_id" INTEGER REFERENCES "departments"("department_id"),
    "team_id" INTEGER REFERENCES "teams"("team_id"),

    -- Store Assignment (Store Staff - primary)
    "store_id" INTEGER REFERENCES "stores"("store_id"),
    "primary_store_id" INTEGER REFERENCES "stores"("store_id"),

    -- Reporting
    "line_manager_id" INTEGER REFERENCES "staff"("staff_id"),
    "dotted_line_manager_id" INTEGER REFERENCES "staff"("staff_id"),

    -- Personal Info
    "date_of_birth" DATE,
    "gender" VARCHAR(10),
    "national_id" VARCHAR(20),
    "tax_code" VARCHAR(20),
    "bank_account" VARCHAR(50),
    "bank_name" VARCHAR(100),
    "permanent_address" TEXT,
    "current_address" TEXT,
    "avatar_url" VARCHAR(500),

    -- Employment
    "joining_date" DATE,
    "hire_date" DATE,
    "probation_end_date" DATE,
    "contract_type" VARCHAR(20),
    "contract_end_date" DATE,
    "termination_date" DATE,
    "termination_reason" TEXT,

    -- Compensation
    "base_salary" DECIMAL(15,2),
    "hourly_rate" DECIMAL(10,2),

    -- Skills
    "skills" JSONB,
    "certifications" JSONB,

    -- System
    "password_hash" VARCHAR(255) NOT NULL,
    "status" VARCHAR(20) DEFAULT 'active',
    "is_active" BOOLEAN DEFAULT true,
    "last_login_at" TIMESTAMP,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chk_staff_type" CHECK (staff_type IN ('HQ', 'STORE')),
    CONSTRAINT "chk_gender" CHECK (gender IS NULL OR gender IN ('MALE', 'FEMALE', 'OTHER')),
    CONSTRAINT "chk_contract_type" CHECK (contract_type IS NULL OR contract_type IN ('PROBATION', 'DEFINITE', 'INDEFINITE', 'PART_TIME', 'SEASONAL')),
    CONSTRAINT "chk_staff_status" CHECK (status IN ('active', 'inactive', 'on_leave', 'suspended', 'terminated'))
);

CREATE INDEX "idx_staff_type" ON "staff"("staff_type");
CREATE INDEX "idx_staff_position" ON "staff"("position_id");
CREATE INDEX "idx_staff_grade" ON "staff"("grade_id");
CREATE INDEX "idx_staff_department" ON "staff"("department_id");
CREATE INDEX "idx_staff_team" ON "staff"("team_id");
CREATE INDEX "idx_staff_store" ON "staff"("store_id");
CREATE INDEX "idx_staff_primary_store" ON "staff"("primary_store_id");
CREATE INDEX "idx_staff_line_manager" ON "staff"("line_manager_id");
CREATE INDEX "idx_staff_status" ON "staff"("status");
CREATE INDEX "idx_staff_job_grade" ON "staff"("job_grade");

-- Add FK constraints after staff table exists
ALTER TABLE "regions" ADD CONSTRAINT "fk_regions_manager"
    FOREIGN KEY ("manager_id") REFERENCES "staff"("staff_id");
ALTER TABLE "areas" ADD CONSTRAINT "fk_areas_manager"
    FOREIGN KEY ("manager_id") REFERENCES "staff"("staff_id");
ALTER TABLE "departments" ADD CONSTRAINT "fk_departments_manager"
    FOREIGN KEY ("manager_id") REFERENCES "staff"("staff_id");
ALTER TABLE "teams" ADD CONSTRAINT "fk_teams_leader"
    FOREIGN KEY ("leader_id") REFERENCES "staff"("staff_id");

CREATE INDEX "idx_regions_manager" ON "regions"("manager_id");
CREATE INDEX "idx_areas_manager" ON "areas"("manager_id");
CREATE INDEX "idx_departments_manager" ON "departments"("manager_id");
CREATE INDEX "idx_teams_leader" ON "teams"("leader_id");

-- Store Assignments (Multi-store management)
CREATE TABLE "store_assignments" (
    "assignment_id" SERIAL PRIMARY KEY,
    "staff_id" INTEGER NOT NULL REFERENCES "staff"("staff_id"),
    "store_id" INTEGER NOT NULL REFERENCES "stores"("store_id"),
    "assignment_type" VARCHAR(20) NOT NULL,
    "role_at_store" VARCHAR(50),
    "is_primary" BOOLEAN DEFAULT false,
    "start_date" DATE NOT NULL,
    "end_date" DATE,
    "assigned_by" INTEGER REFERENCES "staff"("staff_id"),
    "notes" TEXT,
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chk_assignment_type" CHECK (assignment_type IN ('PRIMARY', 'SECONDARY', 'TEMPORARY', 'SUPPORT', 'TRAINING'))
);

CREATE INDEX "idx_store_assignments_staff" ON "store_assignments"("staff_id");
CREATE INDEX "idx_store_assignments_store" ON "store_assignments"("store_id");
CREATE INDEX "idx_store_assignments_active" ON "store_assignments"("is_active");
CREATE UNIQUE INDEX "idx_store_assignments_unique_active"
    ON "store_assignments"("staff_id", "store_id") WHERE is_active = true;

-- ============================================================================
-- PART 4: SALARY & COMPENSATION
-- ============================================================================

-- Salary Grades (Thang lương theo cấp bậc)
CREATE TABLE "salary_grades" (
    "salary_grade_id" SERIAL PRIMARY KEY,
    "grade_id" INTEGER REFERENCES "job_grades"("grade_id"),
    "effective_date" DATE NOT NULL,
    "min_salary" DECIMAL(15,2) NOT NULL,
    "max_salary" DECIMAL(15,2) NOT NULL,
    "standard_salary" DECIMAL(15,2),
    "currency" VARCHAR(3) DEFAULT 'VND',
    "notes" TEXT,
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "idx_salary_grades_grade" ON "salary_grades"("grade_id");
CREATE INDEX "idx_salary_grades_effective" ON "salary_grades"("effective_date");

-- Staff Salaries (Lương nhân viên)
CREATE TABLE "staff_salaries" (
    "salary_id" SERIAL PRIMARY KEY,
    "staff_id" INTEGER NOT NULL REFERENCES "staff"("staff_id"),
    "effective_date" DATE NOT NULL,
    "base_salary" DECIMAL(15,2) NOT NULL,
    "allowances" JSONB DEFAULT '{}',
    "deductions" JSONB DEFAULT '{}',
    "currency" VARCHAR(3) DEFAULT 'VND',
    "approved_by" INTEGER REFERENCES "staff"("staff_id"),
    "approved_at" TIMESTAMP,
    "notes" TEXT,
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "idx_staff_salaries_staff" ON "staff_salaries"("staff_id");
CREATE INDEX "idx_staff_salaries_effective" ON "staff_salaries"("effective_date");

-- ============================================================================
-- PART 5: PERMISSIONS & ACCESS CONTROL
-- ============================================================================

-- Module Permissions
CREATE TABLE "module_permissions" (
    "module_permission_id" SERIAL PRIMARY KEY,
    "module_code" VARCHAR(20) NOT NULL,
    "permission_code" VARCHAR(100) NOT NULL,
    "permission_name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "unique_module_permission" UNIQUE ("module_code", "permission_code")
);

CREATE INDEX "idx_module_permissions_module" ON "module_permissions"("module_code");

-- Position Permissions (Default permissions by position)
CREATE TABLE "position_permissions" (
    "id" SERIAL PRIMARY KEY,
    "position_id" INTEGER REFERENCES "positions"("position_id"),
    "module_permission_id" INTEGER REFERENCES "module_permissions"("module_permission_id"),
    "can_view" BOOLEAN DEFAULT false,
    "can_create" BOOLEAN DEFAULT false,
    "can_edit" BOOLEAN DEFAULT false,
    "can_delete" BOOLEAN DEFAULT false,
    "can_approve" BOOLEAN DEFAULT false,
    "scope" VARCHAR(20) DEFAULT 'OWN',
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "unique_position_module" UNIQUE ("position_id", "module_permission_id"),
    CONSTRAINT "chk_scope" CHECK (scope IN ('OWN', 'TEAM', 'DEPARTMENT', 'STORE', 'AREA', 'REGION', 'ALL'))
);

CREATE INDEX "idx_position_permissions_position" ON "position_permissions"("position_id");

-- Staff Permissions Override (Custom permissions per staff)
CREATE TABLE "staff_permissions" (
    "id" SERIAL PRIMARY KEY,
    "staff_id" INTEGER REFERENCES "staff"("staff_id"),
    "module_permission_id" INTEGER REFERENCES "module_permissions"("module_permission_id"),
    "store_id" INTEGER REFERENCES "stores"("store_id"),
    "granted" BOOLEAN DEFAULT true,
    "granted_by" INTEGER REFERENCES "staff"("staff_id"),
    "granted_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP,
    "notes" TEXT,

    CONSTRAINT "unique_staff_permission" UNIQUE ("staff_id", "module_permission_id", "store_id")
);

CREATE INDEX "idx_staff_permissions_staff" ON "staff_permissions"("staff_id");

-- ============================================================================
-- PART 6: CODE MASTER & LOOKUP
-- ============================================================================

-- Code Master (Danh mục dùng chung)
CREATE TABLE "code_master" (
    "code_id" SERIAL PRIMARY KEY,
    "code_type" VARCHAR(50) NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "name_vi" VARCHAR(255),
    "description" TEXT,
    "parent_code" VARCHAR(50),
    "extra_data" JSONB,
    "sort_order" INTEGER DEFAULT 0,
    "is_system" BOOLEAN DEFAULT false,
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "unique_code_type_code" UNIQUE ("code_type", "code")
);

CREATE INDEX "idx_code_master_type" ON "code_master"("code_type");
CREATE INDEX "idx_code_master_active" ON "code_master"("is_active");

-- ============================================================================
-- PART 7: AUDIT & HISTORY
-- ============================================================================

-- Audit Logs
CREATE TABLE "audit_logs" (
    "audit_id" BIGSERIAL PRIMARY KEY,
    "table_name" VARCHAR(100) NOT NULL,
    "record_id" INTEGER NOT NULL,
    "action" VARCHAR(20) NOT NULL,
    "old_values" JSONB,
    "new_values" JSONB,
    "changed_fields" TEXT[],
    "performed_by" INTEGER REFERENCES "staff"("staff_id"),
    "performed_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "ip_address" INET,
    "user_agent" TEXT,
    "module" VARCHAR(20)
);

CREATE INDEX "idx_audit_logs_table" ON "audit_logs"("table_name", "record_id");
CREATE INDEX "idx_audit_logs_performed_by" ON "audit_logs"("performed_by");
CREATE INDEX "idx_audit_logs_performed_at" ON "audit_logs"("performed_at");

-- Staff History
CREATE TABLE "staff_history" (
    "history_id" SERIAL PRIMARY KEY,
    "staff_id" INTEGER NOT NULL REFERENCES "staff"("staff_id"),
    "change_type" VARCHAR(50) NOT NULL,
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

-- ============================================================================
-- PART 8: DWS MODULE - SHIFT MANAGEMENT (Enhanced)
-- ============================================================================

-- Shift Codes (Mã ca làm việc)
CREATE TABLE "shift_codes" (
    "shift_code_id" SERIAL PRIMARY KEY,
    "shift_code" VARCHAR(20) NOT NULL UNIQUE,
    "shift_name" VARCHAR(100) NOT NULL,
    "shift_name_vi" VARCHAR(100),
    "start_time" TIME NOT NULL,
    "end_time" TIME NOT NULL,
    "total_hours" DECIMAL(4,2) DEFAULT 8.0,
    "shift_type" VARCHAR(20) DEFAULT 'regular',
    "break_minutes" INTEGER DEFAULT 60,
    "color_code" VARCHAR(7),
    "is_off_day" BOOLEAN DEFAULT false,
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chk_shift_type" CHECK (shift_type IN ('regular', 'morning', 'afternoon', 'evening', 'night', 'full', 'off', 'holiday'))
);

-- Shift Assignments (Phân công ca)
CREATE TABLE "shift_assignments" (
    "assignment_id" SERIAL PRIMARY KEY,
    "staff_id" INTEGER REFERENCES "staff"("staff_id") ON DELETE CASCADE,
    "store_id" INTEGER REFERENCES "stores"("store_id"),
    "shift_date" DATE NOT NULL,
    "shift_code_id" INTEGER REFERENCES "shift_codes"("shift_code_id"),
    "actual_start_time" TIME,
    "actual_end_time" TIME,
    "status" VARCHAR(20) DEFAULT 'assigned',
    "notes" TEXT,
    "assigned_by" INTEGER REFERENCES "staff"("staff_id"),
    "assigned_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "approved_by" INTEGER REFERENCES "staff"("staff_id"),
    "approved_at" TIMESTAMP,

    CONSTRAINT "shift_assignments_unique" UNIQUE("staff_id", "shift_date", "shift_code_id"),
    CONSTRAINT "chk_shift_status" CHECK (status IN ('assigned', 'confirmed', 'in_progress', 'completed', 'absent', 'cancelled'))
);

CREATE INDEX "idx_shift_assignments_staff" ON "shift_assignments"("staff_id");
CREATE INDEX "idx_shift_assignments_store" ON "shift_assignments"("store_id");
CREATE INDEX "idx_shift_assignments_date" ON "shift_assignments"("shift_date");

-- ============================================================================
-- PART 9: NOTIFICATIONS
-- ============================================================================

CREATE TABLE "notifications" (
    "notification_id" SERIAL PRIMARY KEY,
    "recipient_staff_id" INTEGER REFERENCES "staff"("staff_id"),
    "sender_staff_id" INTEGER REFERENCES "staff"("staff_id"),
    "title" VARCHAR(255) NOT NULL,
    "message" TEXT,
    "type" VARCHAR(50),
    "module" VARCHAR(20),
    "reference_type" VARCHAR(50),
    "reference_id" INTEGER,
    "is_read" BOOLEAN DEFAULT false,
    "read_at" TIMESTAMP,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "idx_notifications_recipient" ON "notifications"("recipient_staff_id");
CREATE INDEX "idx_notifications_read" ON "notifications"("is_read");

-- ============================================================================
-- PART 10: SANCTUM TOKENS (Laravel Auth)
-- ============================================================================

CREATE TABLE "personal_access_tokens" (
    "id" BIGSERIAL PRIMARY KEY,
    "tokenable_type" VARCHAR(255) NOT NULL,
    "tokenable_id" BIGINT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "token" VARCHAR(64) UNIQUE NOT NULL,
    "abilities" TEXT,
    "last_used_at" TIMESTAMP,
    "expires_at" TIMESTAMP,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "idx_personal_access_tokens_tokenable" ON "personal_access_tokens"("tokenable_type", "tokenable_id");

-- ============================================================================
-- SEED DATA
-- ============================================================================

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

-- Module Permissions
INSERT INTO "module_permissions" (module_code, permission_code, permission_name) VALUES
-- WS Module
('WS', 'view_tasks', 'View Tasks'),
('WS', 'create_tasks', 'Create Tasks'),
('WS', 'edit_tasks', 'Edit Tasks'),
('WS', 'delete_tasks', 'Delete Tasks'),
('WS', 'assign_tasks', 'Assign Tasks'),
('WS', 'approve_tasks', 'Approve Tasks'),
('WS', 'view_reports', 'View WS Reports'),
-- DWS Module
('DWS', 'view_schedule', 'View Schedule'),
('DWS', 'create_schedule', 'Create Schedule'),
('DWS', 'edit_schedule', 'Edit Schedule'),
('DWS', 'approve_schedule', 'Approve Schedule'),
('DWS', 'manage_shifts', 'Manage Shift Codes'),
('DWS', 'view_timesheet', 'View Timesheet'),
('DWS', 'approve_timesheet', 'Approve Timesheet'),
-- Manual Module
('MANUAL', 'view_documents', 'View Documents'),
('MANUAL', 'create_documents', 'Create Documents'),
('MANUAL', 'edit_documents', 'Edit Documents'),
('MANUAL', 'delete_documents', 'Delete Documents'),
('MANUAL', 'approve_documents', 'Approve Documents'),
('MANUAL', 'manage_categories', 'Manage Categories'),
-- QC Module
('QC', 'view_audits', 'View Audits'),
('QC', 'create_audits', 'Create Audits'),
('QC', 'perform_audits', 'Perform Audits'),
('QC', 'approve_audits', 'Approve Audits'),
('QC', 'view_qc_reports', 'View QC Reports'),
-- FAQ Module
('FAQ', 'view_faqs', 'View FAQs'),
('FAQ', 'create_faqs', 'Create FAQs'),
('FAQ', 'edit_faqs', 'Edit FAQs'),
('FAQ', 'delete_faqs', 'Delete FAQs'),
('FAQ', 'answer_questions', 'Answer Questions'),
-- Training Module
('TRAINING', 'view_courses', 'View Courses'),
('TRAINING', 'create_courses', 'Create Courses'),
('TRAINING', 'manage_courses', 'Manage Courses'),
('TRAINING', 'enroll_staff', 'Enroll Staff'),
('TRAINING', 'view_progress', 'View Training Progress'),
('TRAINING', 'issue_certificates', 'Issue Certificates');

-- Shift Codes
INSERT INTO "shift_codes" (shift_code, shift_name, shift_name_vi, start_time, end_time, total_hours, shift_type, break_minutes, color_code) VALUES
('V8.6', 'Morning 6AM', 'Ca sáng 6h', '06:00', '14:00', 8.0, 'morning', 60, '#22C55E'),
('V8.7', 'Morning 7AM', 'Ca sáng 7h', '07:00', '15:00', 8.0, 'morning', 60, '#10B981'),
('V8.8', 'Morning 8AM', 'Ca sáng 8h', '08:00', '16:00', 8.0, 'morning', 60, '#059669'),
('V8.14', 'Afternoon 2PM', 'Ca chiều 14h', '14:00', '22:00', 8.0, 'afternoon', 60, '#3B82F6'),
('V8.14.5', 'Afternoon 2:30PM', 'Ca chiều 14:30', '14:30', '22:30', 8.0, 'afternoon', 60, '#2563EB'),
('V8.15', 'Afternoon 3PM', 'Ca chiều 15h', '15:00', '23:00', 8.0, 'afternoon', 60, '#1D4ED8'),
('OFF', 'Day Off', 'Nghỉ', '00:00', '00:00', 0, 'off', 0, '#9CA3AF'),
('FULL', 'Full Day', 'Ca toàn thời gian', '08:00', '20:00', 12.0, 'full', 90, '#F59E0B');
