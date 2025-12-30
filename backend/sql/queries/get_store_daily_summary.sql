-- ============================================
-- File: get_store_daily_summary.sql
-- Purpose: Get store summary for daily schedule header
-- Used by: GET /api/v1/shifts/store-daily-summary/
-- Screen: DWS Daily Schedule - Store completion header
-- ============================================
-- Parameters:
--   :store_id - Store ID (required)
--   :schedule_date - Date to get summary (required, format: YYYY-MM-DD)
-- ============================================

SELECT
    st.store_id,
    st.store_name,
    st.store_code,
    -- Staff counts
    COALESCE(staff_on_duty.count, 0) AS staff_on_duty,
    COALESCE(staff_total.count, 0) AS total_staff,
    -- Task statistics
    COALESCE(task_stats.total_tasks, 0) AS total_tasks,
    COALESCE(task_stats.completed_tasks, 0) AS completed_tasks,
    COALESCE(task_stats.in_progress_tasks, 0) AS in_progress_tasks,
    COALESCE(task_stats.pending_tasks, 0) AS pending_tasks,
    COALESCE(task_stats.skipped_tasks, 0) AS skipped_tasks,
    -- Completion rate
    CASE
        WHEN COALESCE(task_stats.total_tasks, 0) = 0 THEN 0
        ELSE ROUND(COALESCE(task_stats.completed_tasks, 0)::numeric / task_stats.total_tasks * 100, 1)
    END AS completion_rate,
    -- Task breakdown by group
    COALESCE(group_stats.breakdown, '[]'::json) AS group_breakdown
FROM stores st
-- Staff on duty count
LEFT JOIN (
    SELECT store_id, COUNT(DISTINCT staff_id) AS count
    FROM shift_assignments
    WHERE shift_date = :schedule_date
        AND status IN ('assigned', 'confirmed')
    GROUP BY store_id
) staff_on_duty ON st.store_id = staff_on_duty.store_id
-- Total staff count
LEFT JOIN (
    SELECT store_id, COUNT(*) AS count
    FROM staff
    WHERE is_active = true
    GROUP BY store_id
) staff_total ON st.store_id = staff_total.store_id
-- Task statistics
LEFT JOIN (
    SELECT
        store_id,
        COUNT(*) AS total_tasks,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) AS completed_tasks,
        COUNT(CASE WHEN status = 'in_progress' THEN 1 END) AS in_progress_tasks,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) AS pending_tasks,
        COUNT(CASE WHEN status = 'skipped' THEN 1 END) AS skipped_tasks
    FROM daily_schedule_tasks
    WHERE schedule_date = :schedule_date
    GROUP BY store_id
) task_stats ON st.store_id = task_stats.store_id
-- Group breakdown
LEFT JOIN LATERAL (
    SELECT json_agg(row_to_json(gb)) AS breakdown
    FROM (
        SELECT
            tg.group_id,
            tg.group_name,
            tg.color_bg,
            COUNT(*) AS total,
            COUNT(CASE WHEN dst.status = 'completed' THEN 1 END) AS completed
        FROM daily_schedule_tasks dst
        JOIN task_groups tg ON dst.group_id = tg.group_id
        WHERE dst.store_id = st.store_id
            AND dst.schedule_date = :schedule_date
        GROUP BY tg.group_id, tg.group_name, tg.color_bg
        ORDER BY tg.sort_order
    ) gb
) group_stats ON true
WHERE st.store_id = :store_id;
