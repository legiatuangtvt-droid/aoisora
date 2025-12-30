-- ============================================
-- File: 04_insert_shift_assignments.sql
-- Purpose: Insert shift assignments for today
-- Staff 1-4: Ca sang (V8.6: 06:00-14:00) - shift_code_id = 1
-- Staff 5-8: Ca chieu (V8.14: 14:30-22:30) - shift_code_id = 2
-- ============================================

-- Clear existing assignments for today
DELETE FROM shift_assignments
WHERE store_id = 1
  AND shift_date = CURRENT_DATE;

-- Insert shift assignments for today
-- Ca sang: Staff 1-4
INSERT INTO shift_assignments (staff_id, store_id, shift_date, shift_code_id, status, assigned_by)
VALUES
    (1, 1, CURRENT_DATE, 1, 'assigned', 1),
    (2, 1, CURRENT_DATE, 1, 'assigned', 1),
    (3, 1, CURRENT_DATE, 1, 'assigned', 1),
    (4, 1, CURRENT_DATE, 1, 'assigned', 1),
-- Ca chieu: Staff 5-8
    (5, 1, CURRENT_DATE, 2, 'assigned', 1),
    (6, 1, CURRENT_DATE, 2, 'assigned', 1),
    (7, 1, CURRENT_DATE, 2, 'assigned', 1),
    (8, 1, CURRENT_DATE, 2, 'assigned', 1);

-- Verify
SELECT
    sa.staff_id,
    s.staff_name,
    sa.shift_date,
    sc.shift_code,
    sc.start_time,
    sc.end_time
FROM shift_assignments sa
JOIN staff s ON sa.staff_id = s.staff_id
JOIN shift_codes sc ON sa.shift_code_id = sc.shift_code_id
WHERE sa.store_id = 1
  AND sa.shift_date = CURRENT_DATE
ORDER BY sa.staff_id;
