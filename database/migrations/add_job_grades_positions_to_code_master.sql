-- ============================================
-- Migration: Add Job Grades and Positions to code_master
-- Database: PostgreSQL 15+
-- Created: 2026-01-04
-- Purpose: Workaround solution for HQ/Store staff classification
--          without creating new tables (using existing code_master)
-- ============================================

-- ============================================
-- STAFF TYPES
-- ============================================
INSERT INTO "code_master" ("code_type", "code", "name", "description", "sort_order", "is_active") VALUES
('staff_type', 'HQ', 'Headquarters Staff', 'Nhan vien van phong chinh', 1, true),
('staff_type', 'STORE', 'Store Staff', 'Nhan vien cua hang', 2, true)
ON CONFLICT ("code_type", "code") DO NOTHING;

-- ============================================
-- HQ JOB GRADES (G2 - G9)
-- ============================================
INSERT INTO "code_master" ("code_type", "code", "name", "description", "sort_order", "is_active") VALUES
('job_grade_hq', 'G2', 'Officer', 'Nhan vien - Entry level', 1, true),
('job_grade_hq', 'G3', 'Executive', 'Chuyen vien - Senior individual contributor', 2, true),
('job_grade_hq', 'G4', 'Deputy Manager', 'Pho Truong phong - Team supervision', 3, true),
('job_grade_hq', 'G5', 'Manager', 'Truong phong - Department management', 4, true),
('job_grade_hq', 'G6', 'General Manager', 'Tong Giam doc phong - Senior department head', 5, true),
('job_grade_hq', 'G7', 'Senior General Manager', 'Giam doc khoi - Division leadership', 6, true),
('job_grade_hq', 'G8', 'CCO', 'Giam doc dieu hanh - C-level executive', 7, true),
('job_grade_hq', 'G9', 'General Director', 'Tong Giam doc - CEO', 8, true)
ON CONFLICT ("code_type", "code") DO NOTHING;

-- ============================================
-- STORE JOB GRADES (S1 - S6)
-- ============================================
INSERT INTO "code_master" ("code_type", "code", "name", "description", "sort_order", "is_active") VALUES
('job_grade_store', 'S1', 'Staff', 'Nhan vien cua hang - Entry level store staff', 1, true),
('job_grade_store', 'S2', 'Store Leader G2', 'Pho Truong cua hang - Assistant store leader', 2, true),
('job_grade_store', 'S3', 'Store Leader G3', 'Truong cua hang - Store leader', 3, true),
('job_grade_store', 'S4', 'Store In-charge', 'Truong cum cua hang - Multi-store manager (SI)', 4, true),
('job_grade_store', 'S5', 'Area Manager', 'Quan ly khu vuc - Area supervision', 5, true),
('job_grade_store', 'S6', 'Region Manager', 'Quan ly mien - Regional leadership', 6, true)
ON CONFLICT ("code_type", "code") DO NOTHING;

-- ============================================
-- HQ POSITIONS
-- ============================================
INSERT INTO "code_master" ("code_type", "code", "name", "description", "sort_order", "is_active") VALUES
-- General HQ positions
('position_hq', 'HQ_OFFICER', 'Officer', 'Nhan vien van phong', 1, true),
('position_hq', 'HQ_EXEC', 'Executive', 'Chuyen vien', 2, true),
('position_hq', 'HQ_SENIOR_EXEC', 'Senior Executive', 'Chuyen vien cap cao', 3, true),
('position_hq', 'HQ_TEAM_LEAD', 'Team Lead', 'Truong nhom', 4, true),
('position_hq', 'HQ_DEPUTY_MGR', 'Deputy Manager', 'Pho Truong phong', 5, true),
('position_hq', 'HQ_MANAGER', 'Manager', 'Truong phong', 6, true),
('position_hq', 'HQ_SENIOR_MGR', 'Senior Manager', 'Truong phong cap cao', 7, true),
('position_hq', 'HQ_GM', 'General Manager', 'Tong Giam doc phong', 8, true),
('position_hq', 'HQ_SGM', 'Senior General Manager', 'Giam doc khoi', 9, true),
('position_hq', 'HQ_DIRECTOR', 'Director', 'Giam doc', 10, true),
('position_hq', 'HQ_CCO', 'Chief Commercial Officer', 'Giam doc dieu hanh', 11, true),
('position_hq', 'HQ_GD', 'General Director', 'Tong Giam doc', 12, true),
-- Specialized HQ positions
('position_hq', 'HQ_ACCOUNTANT', 'Accountant', 'Ke toan', 20, true),
('position_hq', 'HQ_HR_SPECIALIST', 'HR Specialist', 'Chuyen vien nhan su', 21, true),
('position_hq', 'HQ_IT_SPECIALIST', 'IT Specialist', 'Chuyen vien CNTT', 22, true),
('position_hq', 'HQ_QC_SPECIALIST', 'QC Specialist', 'Chuyen vien QC', 23, true),
('position_hq', 'HQ_TRAINER', 'Trainer', 'Nhan vien dao tao', 24, true),
('position_hq', 'HQ_ANALYST', 'Analyst', 'Chuyen vien phan tich', 25, true)
ON CONFLICT ("code_type", "code") DO NOTHING;

-- ============================================
-- STORE POSITIONS
-- ============================================
INSERT INTO "code_master" ("code_type", "code", "name", "description", "sort_order", "is_active") VALUES
-- Core store positions
('position_store', 'STORE_STAFF', 'Store Staff', 'Nhan vien cua hang', 1, true),
('position_store', 'STORE_CASHIER', 'Cashier', 'Thu ngan', 2, true),
('position_store', 'STORE_STOCK', 'Stock Staff', 'Nhan vien kho', 3, true),
('position_store', 'STORE_CS', 'Customer Service', 'Nhan vien CSKH', 4, true),
('position_store', 'STORE_SENIOR', 'Senior Staff', 'Nhan vien cap cao', 5, true),
-- Leadership positions
('position_store', 'STORE_SL_G2', 'Store Leader G2', 'Pho Truong cua hang', 10, true),
('position_store', 'STORE_SL_G3', 'Store Leader G3', 'Truong cua hang', 11, true),
('position_store', 'STORE_SI', 'Store In-charge', 'Truong cum cua hang', 12, true),
('position_store', 'STORE_AM', 'Area Manager', 'Quan ly khu vuc', 13, true),
('position_store', 'STORE_RM', 'Region Manager', 'Quan ly mien', 14, true),
-- Specialized store positions
('position_store', 'STORE_PERI', 'Perishable Staff', 'Nhan vien hang tuoi', 20, true),
('position_store', 'STORE_GROCERY', 'Grocery Staff', 'Nhan vien hang kho', 21, true),
('position_store', 'STORE_DELICA', 'Delica Staff', 'Nhan vien Delica', 22, true),
('position_store', 'STORE_RECEIVER', 'Receiver', 'Nhan vien nhan hang', 23, true)
ON CONFLICT ("code_type", "code") DO NOTHING;

-- ============================================
-- SYSTEM ROLES (for permission system)
-- ============================================
INSERT INTO "code_master" ("code_type", "code", "name", "description", "sort_order", "is_active") VALUES
('system_role', 'SUPER_ADMIN', 'Super Admin', 'Full system access - all modules', 1, true),
('system_role', 'ADMIN', 'Admin', 'Administrative access', 2, true),
('system_role', 'MANAGER', 'Manager', 'Management access - can approve', 3, true),
('system_role', 'SUPERVISOR', 'Supervisor', 'Supervisory access - can assign', 4, true),
('system_role', 'STAFF', 'Staff', 'Standard staff access', 5, true),
('system_role', 'VIEWER', 'Viewer', 'Read-only access', 6, true)
ON CONFLICT ("code_type", "code") DO NOTHING;

-- ============================================
-- GRADE COLORS (for UI display)
-- ============================================
INSERT INTO "code_master" ("code_type", "code", "name", "description", "sort_order", "is_active") VALUES
-- HQ Grade Colors
('grade_color', 'G2', '#9CA3AF', 'Gray - Officer', 1, true),
('grade_color', 'G3', '#22A6A1', 'Teal - Executive', 2, true),
('grade_color', 'G4', '#1F7BF2', 'Blue - Deputy Manager', 3, true),
('grade_color', 'G5', '#8B5CF6', 'Purple - Manager', 4, true),
('grade_color', 'G6', '#FF9900', 'Orange - General Manager', 5, true),
('grade_color', 'G7', '#DC2626', 'Red - Senior GM', 6, true),
('grade_color', 'G8', '#991B1B', 'Dark Red - CCO', 7, true),
('grade_color', 'G9', '#7C3AED', 'Violet - GD', 8, true),
-- Store Grade Colors
('grade_color', 'S1', '#9CA3AF', 'Gray - Staff', 10, true),
('grade_color', 'S2', '#81AADB', 'Light Blue - Store Leader G2', 11, true),
('grade_color', 'S3', '#22A6A1', 'Teal - Store Leader G3', 12, true),
('grade_color', 'S4', '#1F7BF2', 'Blue - Store In-charge', 13, true),
('grade_color', 'S5', '#8B5CF6', 'Purple - Area Manager', 14, true),
('grade_color', 'S6', '#FF9900', 'Orange - Region Manager', 15, true)
ON CONFLICT ("code_type", "code") DO NOTHING;

-- ============================================
-- MANAGEMENT SCOPES
-- ============================================
INSERT INTO "code_master" ("code_type", "code", "name", "description", "sort_order", "is_active") VALUES
('management_scope', 'NONE', 'No Management', 'Khong quan ly ai', 1, true),
('management_scope', 'TEAM', 'Team', 'Quan ly nhom', 2, true),
('management_scope', 'DEPARTMENT', 'Department', 'Quan ly phong ban', 3, true),
('management_scope', 'STORE', 'Single Store', 'Quan ly 1 cua hang', 4, true),
('management_scope', 'MULTI_STORE', 'Multi Store', 'Quan ly nhieu cua hang (SI)', 5, true),
('management_scope', 'AREA', 'Area', 'Quan ly khu vuc', 6, true),
('management_scope', 'REGION', 'Region', 'Quan ly mien', 7, true),
('management_scope', 'COMPANY', 'Company', 'Quan ly toan cong ty', 8, true)
ON CONFLICT ("code_type", "code") DO NOTHING;

-- ============================================
-- VERIFICATION QUERY
-- ============================================
-- Run this to verify the data was inserted correctly:
-- SELECT code_type, COUNT(*) as count FROM code_master
-- WHERE code_type IN ('staff_type', 'job_grade_hq', 'job_grade_store', 'position_hq', 'position_store', 'system_role', 'grade_color', 'management_scope')
-- GROUP BY code_type ORDER BY code_type;
