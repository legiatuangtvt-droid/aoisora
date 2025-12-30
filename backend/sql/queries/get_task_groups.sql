-- ============================================
-- File: get_task_groups.sql
-- Purpose: Get all task groups with colors
-- Used by: GET /api/v1/shifts/task-groups/
-- Screen: DWS Daily Schedule - Task card colors
-- ============================================
-- Parameters: None (returns all active groups)
-- ============================================

SELECT
    group_id,
    group_code,
    group_name,
    priority,
    sort_order,
    color_bg,
    color_text,
    color_border,
    is_active,
    created_at
FROM task_groups
WHERE is_active = true
ORDER BY sort_order, priority DESC;
