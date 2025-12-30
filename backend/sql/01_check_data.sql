-- ============================================
-- File: 01_check_data.sql
-- Purpose: Check current data in database
-- ============================================

-- 1. Check staff data
SELECT 'STAFF TABLE' as table_name;
SELECT staff_id, staff_name, role, store_id, is_active
FROM staff
WHERE store_id = 1
ORDER BY staff_id;

-- 2. Check total tasks per date
SELECT 'TASKS COUNT BY DATE' as info;
SELECT schedule_date, COUNT(*) as task_count
FROM daily_schedule_tasks
WHERE store_id = 1
GROUP BY schedule_date
ORDER BY schedule_date;

-- 3. Check tasks per staff for today
SELECT 'TASKS PER STAFF TODAY' as info;
SELECT
    dst.staff_id,
    s.staff_name,
    COUNT(*) as task_count
FROM daily_schedule_tasks dst
JOIN staff s ON dst.staff_id = s.staff_id
WHERE dst.schedule_date = CURRENT_DATE
  AND dst.store_id = 1
GROUP BY dst.staff_id, s.staff_name
ORDER BY dst.staff_id;

-- 4. Check for duplicate tasks (same staff, same time, same date)
SELECT 'DUPLICATE CHECK' as info;
SELECT
    staff_id,
    schedule_date,
    start_time,
    COUNT(*) as duplicate_count
FROM daily_schedule_tasks
WHERE store_id = 1
GROUP BY staff_id, schedule_date, start_time
HAVING COUNT(*) > 1;

-- 5. Sample tasks for staff 1 today
SELECT 'SAMPLE TASKS - STAFF 1 TODAY' as info;
SELECT
    staff_id,
    start_time,
    end_time,
    task_code,
    task_name,
    group_id,
    status
FROM daily_schedule_tasks
WHERE staff_id = 1
  AND schedule_date = CURRENT_DATE
  AND store_id = 1
ORDER BY start_time
LIMIT 10;
