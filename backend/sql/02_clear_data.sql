-- ============================================
-- File: 02_clear_data.sql
-- Purpose: Clear all schedule data before inserting new data
-- Run this BEFORE 03_insert_data.sql
-- ============================================

-- Clear in correct order (respect FK constraints)
DELETE FROM daily_schedule_tasks WHERE store_id = 1;
DELETE FROM shift_assignments WHERE store_id = 1;

-- Verify deletion
SELECT 'After clearing:' as status;
SELECT 'daily_schedule_tasks' as table_name, COUNT(*) as remaining FROM daily_schedule_tasks WHERE store_id = 1
UNION ALL
SELECT 'shift_assignments', COUNT(*) FROM shift_assignments WHERE store_id = 1;
