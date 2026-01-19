-- Migration: Add Test Users with all Job Grades for comprehensive testing
-- Date: 2025-01-19
-- Purpose: Add users with HQ Grades (G2-G9) and Store Grades (S1-S7) for User Switcher testing

-- Set UTF-8 encoding
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- Password hash for 'password' using bcrypt
-- All test users will have password: password
SET @password_hash = '$2y$10$wMUXEBLWnyfQ5S6k0AykoODieUy.QiIpzzCGUHki/EnZ6QcogJuYm';

-- =====================================================
-- HQ USERS (G2-G9) - Can create tasks
-- Using ASCII names to avoid encoding issues
-- =====================================================

-- G9 - CEO Level (Company-wide access)
INSERT INTO `staff` (`staff_name`, `staff_code`, `username`, `email`, `phone`, `store_id`, `department_id`, `role`, `position`, `job_grade`, `password_hash`, `status`, `is_active`)
VALUES ('CEO User (G9)', 'HQ-G9-001', 'ceo', 'ceo@aoisora.vn', '0900000009', NULL, 1, 'ADMIN', 'Chief Executive Officer', 'G9', @password_hash, 'active', 1)
ON DUPLICATE KEY UPDATE `job_grade` = 'G9', `position` = 'Chief Executive Officer', `staff_name` = 'CEO User (G9)';

-- G8 - Director Level (Company-wide access)
INSERT INTO `staff` (`staff_name`, `staff_code`, `username`, `email`, `phone`, `store_id`, `department_id`, `role`, `position`, `job_grade`, `password_hash`, `status`, `is_active`)
VALUES ('Director User (G8)', 'HQ-G8-001', 'director', 'director@aoisora.vn', '0900000008', NULL, 1, 'ADMIN', 'Operations Director', 'G8', @password_hash, 'active', 1)
ON DUPLICATE KEY UPDATE `job_grade` = 'G8', `position` = 'Operations Director', `staff_name` = 'Director User (G8)';

-- G7 - Senior Manager Level
INSERT INTO `staff` (`staff_name`, `staff_code`, `username`, `email`, `phone`, `store_id`, `department_id`, `role`, `position`, `job_grade`, `password_hash`, `status`, `is_active`)
VALUES ('Sr Manager User (G7)', 'HQ-G7-001', 'srmanager', 'srmanager@aoisora.vn', '0900000007', NULL, 1, 'MANAGER', 'Senior Operations Manager', 'G7', @password_hash, 'active', 1)
ON DUPLICATE KEY UPDATE `job_grade` = 'G7', `position` = 'Senior Operations Manager', `staff_name` = 'Sr Manager User (G7)';

-- G6 - Manager Level
INSERT INTO `staff` (`staff_name`, `staff_code`, `username`, `email`, `phone`, `store_id`, `department_id`, `role`, `position`, `job_grade`, `password_hash`, `status`, `is_active`)
VALUES ('HQ Manager User (G6)', 'HQ-G6-001', 'hqmanager', 'hqmanager@aoisora.vn', '0900000006', NULL, 1, 'MANAGER', 'Department Manager', 'G6', @password_hash, 'active', 1)
ON DUPLICATE KEY UPDATE `job_grade` = 'G6', `position` = 'Department Manager', `staff_name` = 'HQ Manager User (G6)';

-- G5 - Assistant Manager Level
INSERT INTO `staff` (`staff_name`, `staff_code`, `username`, `email`, `phone`, `store_id`, `department_id`, `role`, `position`, `job_grade`, `password_hash`, `status`, `is_active`)
VALUES ('Asst Manager User (G5)', 'HQ-G5-001', 'asstmanager', 'asstmanager@aoisora.vn', '0900000005', NULL, 1, 'MANAGER', 'Assistant Manager', 'G5', @password_hash, 'active', 1)
ON DUPLICATE KEY UPDATE `job_grade` = 'G5', `position` = 'Assistant Manager', `staff_name` = 'Asst Manager User (G5)';

-- G4 - Senior Supervisor Level
INSERT INTO `staff` (`staff_name`, `staff_code`, `username`, `email`, `phone`, `store_id`, `department_id`, `role`, `position`, `job_grade`, `password_hash`, `status`, `is_active`)
VALUES ('Sr Supervisor User (G4)', 'HQ-G4-001', 'srsupervisor', 'srsupervisor@aoisora.vn', '0900000004', NULL, 1, 'SUPERVISOR', 'Senior Supervisor', 'G4', @password_hash, 'active', 1)
ON DUPLICATE KEY UPDATE `job_grade` = 'G4', `position` = 'Senior Supervisor', `staff_name` = 'Sr Supervisor User (G4)';

-- G3 - Supervisor Level
INSERT INTO `staff` (`staff_name`, `staff_code`, `username`, `email`, `phone`, `store_id`, `department_id`, `role`, `position`, `job_grade`, `password_hash`, `status`, `is_active`)
VALUES ('Supervisor User (G3)', 'HQ-G3-001', 'supervisor', 'supervisor@aoisora.vn', '0900000003', NULL, 1, 'SUPERVISOR', 'Supervisor', 'G3', @password_hash, 'active', 1)
ON DUPLICATE KEY UPDATE `job_grade` = 'G3', `position` = 'Supervisor', `staff_name` = 'Supervisor User (G3)';

-- G2 - Senior Staff Level (lowest HQ grade that can create tasks)
INSERT INTO `staff` (`staff_name`, `staff_code`, `username`, `email`, `phone`, `store_id`, `department_id`, `role`, `position`, `job_grade`, `password_hash`, `status`, `is_active`)
VALUES ('Sr Staff User (G2)', 'HQ-G2-001', 'srstaff', 'srstaff@aoisora.vn', '0900000002', NULL, 1, 'STAFF', 'Senior Staff', 'G2', @password_hash, 'active', 1)
ON DUPLICATE KEY UPDATE `job_grade` = 'G2', `position` = 'Senior Staff', `staff_name` = 'Sr Staff User (G2)';

-- =====================================================
-- STORE USERS (S1-S7) - CANNOT create tasks
-- =====================================================

-- S7 - Regional Manager (highest store grade)
INSERT INTO `staff` (`staff_name`, `staff_code`, `username`, `email`, `phone`, `store_id`, `department_id`, `role`, `position`, `job_grade`, `password_hash`, `status`, `is_active`)
VALUES ('Regional Mgr User (S7)', 'ST-S7-001', 'regionalmgr', 'regionalmgr@aoisora.vn', '0900000017', 1, NULL, 'MANAGER', 'Regional Manager', 'S7', @password_hash, 'active', 1)
ON DUPLICATE KEY UPDATE `job_grade` = 'S7', `position` = 'Regional Manager', `staff_name` = 'Regional Mgr User (S7)';

-- S6 - Zone Manager
INSERT INTO `staff` (`staff_name`, `staff_code`, `username`, `email`, `phone`, `store_id`, `department_id`, `role`, `position`, `job_grade`, `password_hash`, `status`, `is_active`)
VALUES ('Zone Mgr User (S6)', 'ST-S6-001', 'zonemgr', 'zonemgr@aoisora.vn', '0900000016', 1, NULL, 'MANAGER', 'Zone Manager', 'S6', @password_hash, 'active', 1)
ON DUPLICATE KEY UPDATE `job_grade` = 'S6', `position` = 'Zone Manager', `staff_name` = 'Zone Mgr User (S6)';

-- S5 - Area Manager
INSERT INTO `staff` (`staff_name`, `staff_code`, `username`, `email`, `phone`, `store_id`, `department_id`, `role`, `position`, `job_grade`, `password_hash`, `status`, `is_active`)
VALUES ('Area Mgr User (S5)', 'ST-S5-001', 'areamgr', 'areamgr@aoisora.vn', '0900000015', 1, NULL, 'MANAGER', 'Area Manager', 'S5', @password_hash, 'active', 1)
ON DUPLICATE KEY UPDATE `job_grade` = 'S5', `position` = 'Area Manager', `staff_name` = 'Area Mgr User (S5)';

-- S4 - Store In-charge (SI)
INSERT INTO `staff` (`staff_name`, `staff_code`, `username`, `email`, `phone`, `store_id`, `department_id`, `role`, `position`, `job_grade`, `password_hash`, `status`, `is_active`)
VALUES ('Store IC User (S4)', 'ST-S4-001', 'storeic', 'storeic@aoisora.vn', '0900000014', 1, NULL, 'SUPERVISOR', 'Store In-charge', 'S4', @password_hash, 'active', 1)
ON DUPLICATE KEY UPDATE `job_grade` = 'S4', `position` = 'Store In-charge', `staff_name` = 'Store IC User (S4)';

-- S3 - Store Leader
INSERT INTO `staff` (`staff_name`, `staff_code`, `username`, `email`, `phone`, `store_id`, `department_id`, `role`, `position`, `job_grade`, `password_hash`, `status`, `is_active`)
VALUES ('Store Leader User (S3)', 'ST-S3-001', 'storeleader', 'storeleader@aoisora.vn', '0900000013', 1, NULL, 'SUPERVISOR', 'Store Leader', 'S3', @password_hash, 'active', 1)
ON DUPLICATE KEY UPDATE `job_grade` = 'S3', `position` = 'Store Leader', `staff_name` = 'Store Leader User (S3)';

-- S2 - Deputy Store Leader
INSERT INTO `staff` (`staff_name`, `staff_code`, `username`, `email`, `phone`, `store_id`, `department_id`, `role`, `position`, `job_grade`, `password_hash`, `status`, `is_active`)
VALUES ('Deputy Leader User (S2)', 'ST-S2-001', 'deputyleader', 'deputyleader@aoisora.vn', '0900000012', 1, NULL, 'SUPERVISOR', 'Deputy Store Leader', 'S2', @password_hash, 'active', 1)
ON DUPLICATE KEY UPDATE `job_grade` = 'S2', `position` = 'Deputy Store Leader', `staff_name` = 'Deputy Leader User (S2)';

-- S1 - Store Staff (lowest store grade)
INSERT INTO `staff` (`staff_name`, `staff_code`, `username`, `email`, `phone`, `store_id`, `department_id`, `role`, `position`, `job_grade`, `password_hash`, `status`, `is_active`)
VALUES ('Store Staff User (S1)', 'ST-S1-001', 'storestaff', 'storestaff@aoisora.vn', '0900000011', 1, NULL, 'STAFF', 'Store Staff', 'S1', @password_hash, 'active', 1)
ON DUPLICATE KEY UPDATE `job_grade` = 'S1', `position` = 'Store Staff', `staff_name` = 'Store Staff User (S1)';

-- =====================================================
-- Update existing admin user to have G9 grade
-- =====================================================
UPDATE `staff` SET `job_grade` = 'G9' WHERE `username` = 'admin' AND (`job_grade` IS NULL OR `job_grade` = '');

-- =====================================================
-- Set up line_manager relationships for approval flow
-- Using temporary table to work around MySQL self-join limitation
-- =====================================================

-- Create temporary lookup table
CREATE TEMPORARY TABLE IF NOT EXISTS staff_grade_lookup AS
SELECT staff_id, job_grade FROM staff WHERE job_grade IS NOT NULL;

-- HQ hierarchy: G2 -> G3 -> G4 -> G5 -> G6 -> G7 -> G8 -> G9
UPDATE `staff` s1
INNER JOIN staff_grade_lookup sgl ON sgl.job_grade = 'G3'
SET s1.line_manager_id = sgl.staff_id
WHERE s1.job_grade = 'G2';

UPDATE `staff` s1
INNER JOIN staff_grade_lookup sgl ON sgl.job_grade = 'G4'
SET s1.line_manager_id = sgl.staff_id
WHERE s1.job_grade = 'G3';

UPDATE `staff` s1
INNER JOIN staff_grade_lookup sgl ON sgl.job_grade = 'G5'
SET s1.line_manager_id = sgl.staff_id
WHERE s1.job_grade = 'G4';

UPDATE `staff` s1
INNER JOIN staff_grade_lookup sgl ON sgl.job_grade = 'G6'
SET s1.line_manager_id = sgl.staff_id
WHERE s1.job_grade = 'G5';

UPDATE `staff` s1
INNER JOIN staff_grade_lookup sgl ON sgl.job_grade = 'G7'
SET s1.line_manager_id = sgl.staff_id
WHERE s1.job_grade = 'G6';

UPDATE `staff` s1
INNER JOIN staff_grade_lookup sgl ON sgl.job_grade = 'G8'
SET s1.line_manager_id = sgl.staff_id
WHERE s1.job_grade = 'G7';

UPDATE `staff` s1
INNER JOIN staff_grade_lookup sgl ON sgl.job_grade = 'G9'
SET s1.line_manager_id = sgl.staff_id
WHERE s1.job_grade = 'G8';

-- Store hierarchy: S1 -> S2 -> S3 -> S4 -> S5 -> S6 -> S7
UPDATE `staff` s1
INNER JOIN staff_grade_lookup sgl ON sgl.job_grade = 'S2'
SET s1.line_manager_id = sgl.staff_id
WHERE s1.job_grade = 'S1';

UPDATE `staff` s1
INNER JOIN staff_grade_lookup sgl ON sgl.job_grade = 'S3'
SET s1.line_manager_id = sgl.staff_id
WHERE s1.job_grade = 'S2';

UPDATE `staff` s1
INNER JOIN staff_grade_lookup sgl ON sgl.job_grade = 'S4'
SET s1.line_manager_id = sgl.staff_id
WHERE s1.job_grade = 'S3';

UPDATE `staff` s1
INNER JOIN staff_grade_lookup sgl ON sgl.job_grade = 'S5'
SET s1.line_manager_id = sgl.staff_id
WHERE s1.job_grade = 'S4';

UPDATE `staff` s1
INNER JOIN staff_grade_lookup sgl ON sgl.job_grade = 'S6'
SET s1.line_manager_id = sgl.staff_id
WHERE s1.job_grade = 'S5';

UPDATE `staff` s1
INNER JOIN staff_grade_lookup sgl ON sgl.job_grade = 'S7'
SET s1.line_manager_id = sgl.staff_id
WHERE s1.job_grade = 'S6';

-- Clean up temporary table
DROP TEMPORARY TABLE IF EXISTS staff_grade_lookup;

-- =====================================================
-- Summary of Test Users
-- =====================================================
-- HQ Users (CAN create tasks):
-- | Username      | Grade | Position                  | Password  |
-- |---------------|-------|---------------------------|-----------|
-- | ceo           | G9    | CEO                       | password  |
-- | director      | G8    | Operations Director       | password  |
-- | srmanager     | G7    | Senior Operations Manager | password  |
-- | hqmanager     | G6    | Department Manager        | password  |
-- | asstmanager   | G5    | Assistant Manager         | password  |
-- | srsupervisor  | G4    | Senior Supervisor         | password  |
-- | supervisor    | G3    | Supervisor                | password  |
-- | srstaff       | G2    | Senior Staff              | password  |
--
-- Store Users (CANNOT create tasks):
-- | Username      | Grade | Position                  | Password  |
-- |---------------|-------|---------------------------|-----------|
-- | regionalmgr   | S7    | Regional Manager          | password  |
-- | zonemgr       | S6    | Zone Manager              | password  |
-- | areamgr       | S5    | Area Manager              | password  |
-- | storeic       | S4    | Store In-charge           | password  |
-- | storeleader   | S3    | Store Leader              | password  |
-- | deputyleader  | S2    | Deputy Store Leader       | password  |
-- | storestaff    | S1    | Store Staff               | password  |
