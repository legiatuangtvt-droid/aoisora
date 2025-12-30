-- ============================================
-- File: get_shift_assignments.sql
-- Purpose: Get shift assignments for a date range
-- Used by: GET /api/v1/shifts/assignments/
-- Screen: DWS Daily Schedule - Staff shift info
-- ============================================
-- Parameters:
--   :store_id - Store ID (required)
--   :start_date - Start date (required, format: YYYY-MM-DD)
--   :end_date - End date (required, format: YYYY-MM-DD)
-- ============================================

SELECT
    sa.assignment_id,
    sa.staff_id,
    sa.store_id,
    sa.shift_date,
    sa.shift_code_id,
    sa.status,
    sa.notes,
    sa.assigned_by,
    sa.assigned_at,
    -- Staff info
    s.staff_name,
    s.staff_code,
    s.role,
    -- Shift code info
    sc.shift_code,
    sc.shift_name,
    sc.start_time,
    sc.end_time,
    sc.total_hours,
    sc.shift_type,
    sc.break_minutes
FROM shift_assignments sa
JOIN staff s ON sa.staff_id = s.staff_id
JOIN shift_codes sc ON sa.shift_code_id = sc.shift_code_id
WHERE sa.store_id = :store_id
    AND sa.shift_date BETWEEN :start_date AND :end_date
ORDER BY sa.shift_date, sc.start_time, s.staff_name;
