-- ============================================
-- Migration: Update Store Staff to use Store Grades (S1-S6)
-- Database: PostgreSQL 15+
-- Created: 2026-01-04
-- Purpose: Convert existing store staff from HQ grades (G2-G5) to Store grades (S1-S4)
-- ============================================

-- ============================================
-- MAPPING LOGIC:
-- Store staff (has store_id) will be converted:
--   G5 (Manager) → S3 (Store Leader G3) - Store managers
--   G3 (Executive) → S3 (Store Leader G3) - Store leaders
--   G2 (Officer) → S1 (Staff) - Regular store staff
--   G4 (Deputy Manager) → S2 (Store Leader G2) - Deputy store leaders
--
-- HQ staff (store_id IS NULL) will keep their HQ grades (G2-G9)
-- ============================================

-- Update Store Managers (G5 with store_id) to S3 (Store Leader G3)
UPDATE "staff"
SET job_grade = 'S3',
    position = 'Store Leader G3'
WHERE store_id IS NOT NULL
  AND job_grade = 'G5'
  AND position IN ('Store Manager', 'Manager');

-- Update Store Managers with G3 to S3 (Store Leader G3)
UPDATE "staff"
SET job_grade = 'S3',
    position = 'Store Leader G3'
WHERE store_id IS NOT NULL
  AND job_grade = 'G3'
  AND position = 'Store Manager';

-- Update Store Leaders with G3 to S2 (Store Leader G2) - they are deputy leaders
UPDATE "staff"
SET job_grade = 'S2',
    position = 'Store Leader G2'
WHERE store_id IS NOT NULL
  AND job_grade = 'G3'
  AND position = 'Store Leader';

-- Update regular store staff (G2 with store_id) to S1 (Staff)
UPDATE "staff"
SET job_grade = 'S1'
WHERE store_id IS NOT NULL
  AND job_grade = 'G2';

-- Update G1 staff to S1
UPDATE "staff"
SET job_grade = 'S1'
WHERE store_id IS NOT NULL
  AND job_grade = 'G1';

-- ============================================
-- VERIFICATION QUERY
-- ============================================
-- Run this to verify the migration:
-- SELECT job_grade, position, COUNT(*) as count
-- FROM staff
-- WHERE store_id IS NOT NULL
-- GROUP BY job_grade, position
-- ORDER BY job_grade;

-- ============================================
-- ROLLBACK (if needed) - Note: position changes are not reversible
-- ============================================
-- UPDATE staff SET job_grade = 'G5' WHERE store_id IS NOT NULL AND job_grade = 'S3';
-- UPDATE staff SET job_grade = 'G3' WHERE store_id IS NOT NULL AND job_grade = 'S2';
-- UPDATE staff SET job_grade = 'G2' WHERE store_id IS NOT NULL AND job_grade = 'S1' AND position NOT IN ('Cashier', 'Grocery Staff', 'Sales Staff', 'Security', 'Stock Keeper');
-- UPDATE staff SET job_grade = 'G1' WHERE store_id IS NOT NULL AND job_grade = 'S1' AND position IN ('Cashier', 'Grocery Staff', 'Sales Staff', 'Security', 'Stock Keeper');
