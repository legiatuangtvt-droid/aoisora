-- ============================================
-- File: get_staff_with_shifts.sql
-- Purpose: Get staff list with their shift assignments
-- Used by: GET /api/v1/shifts/staff-with-shifts/
-- Screen: DWS Daily Schedule - Staff rows
-- ============================================
-- Parameters:
--   :store_id - Store ID (required)
--   :shift_date - Date to get shifts (required, format: YYYY-MM-DD)
-- ============================================

SELECT
    s.staff_id,
    s.staff_code,
    s.staff_name,
    s.role,
    s.department_id,
    s.is_active,
    -- Shift assignment info
    sa.assignment_id,
    sa.shift_date,
    sa.status AS assignment_status,
    -- Shift code details
    sc.shift_code_id,
    sc.shift_code,
    sc.shift_name,
    sc.start_time AS shift_start_time,
    sc.end_time AS shift_end_time,
    sc.total_hours,
    -- Task statistics
    COALESCE(task_stats.total_tasks, 0) AS total_tasks,
    COALESCE(task_stats.completed_tasks, 0) AS completed_tasks,
    CASE
        WHEN COALESCE(task_stats.total_tasks, 0) = 0 THEN 0
        ELSE ROUND(COALESCE(task_stats.completed_tasks, 0)::numeric / task_stats.total_tasks * 100, 1)
    END AS completion_rate
FROM staff s
LEFT JOIN shift_assignments sa
    ON s.staff_id = sa.staff_id
    AND sa.shift_date = :shift_date
    AND sa.store_id = :store_id
LEFT JOIN shift_codes sc
    ON sa.shift_code_id = sc.shift_code_id
LEFT JOIN (
    SELECT
        staff_id,
        COUNT(*) AS total_tasks,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) AS completed_tasks
    FROM daily_schedule_tasks
    WHERE store_id = :store_id
        AND schedule_date = :shift_date
    GROUP BY staff_id
) task_stats ON s.staff_id = task_stats.staff_id
WHERE s.store_id = :store_id
    AND s.is_active = true
ORDER BY
    CASE s.role
        WHEN 'MANAGER' THEN 1
        WHEN 'STORE_LEADER_G3' THEN 2
        WHEN 'STORE_LEADER_G2' THEN 3
        WHEN 'STAFF' THEN 4
        ELSE 5
    END,
    s.staff_name;
