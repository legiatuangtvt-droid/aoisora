-- ============================================
-- File: get_daily_schedule_tasks.sql
-- Purpose: Get daily schedule tasks for DWS page
-- Used by: GET /api/v1/shifts/schedule-tasks/
-- Screen: DWS Daily Schedule (frontend/src/app/dws/daily-schedule/page.tsx)
-- ============================================
-- Parameters:
--   :store_id - Store ID to filter (optional)
--   :schedule_date - Date to filter (optional, format: YYYY-MM-DD)
--   :staff_id - Staff ID to filter (optional)
--   :group_id - Task group ID to filter (optional)
--   :status - Task status to filter (optional)
--   :limit - Number of records to return (default: 200)
--   :offset - Number of records to skip (default: 0)
-- ============================================

SELECT
    dst.schedule_task_id,
    dst.staff_id,
    dst.store_id,
    dst.schedule_date,
    dst.group_id,
    dst.task_code,
    dst.task_name,
    dst.start_time,
    dst.end_time,
    dst.status,
    dst.completed_at,
    dst.notes,
    dst.created_at,
    dst.updated_at,
    -- Task group info for colors
    tg.group_id AS tg_group_id,
    tg.group_code,
    tg.group_name,
    tg.priority,
    tg.sort_order,
    tg.color_bg,
    tg.color_text,
    tg.color_border,
    tg.is_active
FROM daily_schedule_tasks dst
LEFT JOIN task_groups tg ON dst.group_id = tg.group_id
WHERE 1=1
    AND (:store_id IS NULL OR dst.store_id = :store_id)
    AND (:schedule_date IS NULL OR dst.schedule_date = :schedule_date)
    AND (:staff_id IS NULL OR dst.staff_id = :staff_id)
    AND (:group_id IS NULL OR dst.group_id = :group_id)
    AND (:status IS NULL OR dst.status = :status)
ORDER BY
    dst.schedule_date,
    dst.staff_id,
    dst.start_time
LIMIT :limit OFFSET :offset;
