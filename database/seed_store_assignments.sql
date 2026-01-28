-- ============================================================================
-- SEED STORE ASSIGNMENTS FOR TASKS
-- Covers all possible scenarios for task statuses: NOT_YET, ON_PROGRESS, DONE, OVERDUE
-- ============================================================================

-- First, clear existing assignments (except for tasks that already have proper data)
DELETE FROM task_store_assignments WHERE task_id NOT IN (815, 816, 817, 818);

-- ============================================================================
-- HELPER: Get random stores for each task based on task's scope
-- We'll assign 5-10 stores per task for demo purposes
-- ============================================================================

-- ============================================================================
-- 1. NOT_YET TASKS (status_id = 7)
-- All store assignments should have status = 'not_yet'
-- This represents tasks that have been dispatched but no store has started yet
-- ============================================================================

-- Get NOT_YET root tasks and assign stores
INSERT INTO task_store_assignments (task_id, store_id, status, assigned_at, assigned_by, notes)
SELECT
    t.task_id,
    s.store_id,
    'not_yet',
    DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 7) DAY),
    1, -- Admin User
    'Task dispatched, awaiting store action'
FROM tasks t
CROSS JOIN (
    SELECT store_id FROM stores ORDER BY RAND() LIMIT 30
) s
WHERE t.status_id = 7
AND t.parent_task_id IS NULL
AND NOT EXISTS (SELECT 1 FROM task_store_assignments tsa WHERE tsa.task_id = t.task_id)
ORDER BY RAND()
LIMIT 200;

-- ============================================================================
-- 2. ON_PROGRESS TASKS (status_id = 8)
-- Mix of statuses: some not_yet, some on_progress, some done_pending
-- This represents tasks where stores are actively working
-- ============================================================================

-- First batch: stores with 'not_yet' (30%)
INSERT INTO task_store_assignments (task_id, store_id, status, assigned_at, assigned_by, notes)
SELECT
    t.task_id,
    s.store_id,
    'not_yet',
    DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 14) DAY),
    1,
    'Pending store action'
FROM tasks t
CROSS JOIN (
    SELECT store_id FROM stores WHERE store_id BETWEEN 1 AND 50 ORDER BY RAND() LIMIT 3
) s
WHERE t.status_id = 8
AND t.parent_task_id IS NULL
AND NOT EXISTS (SELECT 1 FROM task_store_assignments tsa WHERE tsa.task_id = t.task_id AND tsa.store_id = s.store_id);

-- Second batch: stores with 'on_progress' (40%)
INSERT INTO task_store_assignments (task_id, store_id, status, assigned_at, assigned_by, started_at, started_by, notes)
SELECT
    t.task_id,
    s.store_id,
    'on_progress',
    DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 14) DAY),
    1,
    DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 7) DAY),
    ((s.store_id % 34) + 11), -- Store staff (cycles through IDs 11-44)
    'Store is working on this task'
FROM tasks t
CROSS JOIN (
    SELECT store_id FROM stores WHERE store_id BETWEEN 51 AND 150 ORDER BY RAND() LIMIT 4
) s
WHERE t.status_id = 8
AND t.parent_task_id IS NULL
AND NOT EXISTS (SELECT 1 FROM task_store_assignments tsa WHERE tsa.task_id = t.task_id AND tsa.store_id = s.store_id);

-- Third batch: stores with 'done_pending' (30%) - waiting for HQ check
INSERT INTO task_store_assignments (task_id, store_id, status, assigned_at, assigned_by, started_at, started_by, completed_at, completed_by, notes)
SELECT
    t.task_id,
    s.store_id,
    'done_pending',
    DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 14) DAY),
    1,
    DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 10) DAY),
    ((s.store_id % 34) + 11),
    DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 3) DAY),
    ((s.store_id % 34) + 11),
    'Completed by store, awaiting HQ verification'
FROM tasks t
CROSS JOIN (
    SELECT store_id FROM stores WHERE store_id BETWEEN 151 AND 250 ORDER BY RAND() LIMIT 3
) s
WHERE t.status_id = 8
AND t.parent_task_id IS NULL
AND NOT EXISTS (SELECT 1 FROM task_store_assignments tsa WHERE tsa.task_id = t.task_id AND tsa.store_id = s.store_id);

-- ============================================================================
-- 3. DONE TASKS (status_id = 9)
-- All stores completed: mix of 'done' and 'unable'
-- This represents tasks that are fully completed
-- ============================================================================

-- Majority: stores with 'done' (80%)
INSERT INTO task_store_assignments (task_id, store_id, status, assigned_at, assigned_by, started_at, started_by, completed_at, completed_by, checked_by, checked_at, check_notes, notes)
SELECT
    t.task_id,
    s.store_id,
    'done',
    DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 30) DAY),
    1,
    DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 25) DAY),
    ((s.store_id % 34) + 11),
    DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 20) DAY),
    ((s.store_id % 34) + 11),
    1, -- Admin checked
    DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 15) DAY),
    'Verified and approved by HQ',
    'Task completed successfully'
FROM tasks t
CROSS JOIN (
    SELECT store_id FROM stores WHERE store_id BETWEEN 1 AND 200 ORDER BY RAND() LIMIT 8
) s
WHERE t.status_id = 9
AND t.parent_task_id IS NULL
AND NOT EXISTS (SELECT 1 FROM task_store_assignments tsa WHERE tsa.task_id = t.task_id AND tsa.store_id = s.store_id);

-- Some: stores with 'unable' (20%)
INSERT INTO task_store_assignments (task_id, store_id, status, assigned_at, assigned_by, started_at, started_by, completed_at, completed_by, unable_reason, notes)
SELECT
    t.task_id,
    s.store_id,
    'unable',
    DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 30) DAY),
    1,
    DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 25) DAY),
    ((s.store_id % 34) + 11),
    DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 20) DAY),
    ((s.store_id % 34) + 11),
    CASE FLOOR(RAND() * 5)
        WHEN 0 THEN 'Thiếu nhân sự / Staff shortage'
        WHEN 1 THEN 'Thiếu thiết bị / Equipment unavailable'
        WHEN 2 THEN 'Store đóng cửa tạm thời / Store temporarily closed'
        WHEN 3 THEN 'Hàng hóa chưa về / Products not arrived'
        ELSE 'Lý do khác / Other reason'
    END,
    'Unable to complete - marked by store'
FROM tasks t
CROSS JOIN (
    SELECT store_id FROM stores WHERE store_id BETWEEN 201 AND 300 ORDER BY RAND() LIMIT 2
) s
WHERE t.status_id = 9
AND t.parent_task_id IS NULL
AND NOT EXISTS (SELECT 1 FROM task_store_assignments tsa WHERE tsa.task_id = t.task_id AND tsa.store_id = s.store_id);

-- ============================================================================
-- 4. OVERDUE TASKS (status_id = 10)
-- Mix showing why task is overdue: some stores haven't completed
-- This represents tasks past deadline with incomplete stores
-- ============================================================================

-- Some: stores with 'not_yet' (still haven't started - main reason for overdue)
INSERT INTO task_store_assignments (task_id, store_id, status, assigned_at, assigned_by, notes)
SELECT
    t.task_id,
    s.store_id,
    'not_yet',
    DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 30 + 10) DAY),
    1,
    'OVERDUE: Store has not started this task'
FROM tasks t
CROSS JOIN (
    SELECT store_id FROM stores WHERE store_id BETWEEN 1 AND 100 ORDER BY RAND() LIMIT 3
) s
WHERE t.status_id = 10
AND t.parent_task_id IS NULL
AND NOT EXISTS (SELECT 1 FROM task_store_assignments tsa WHERE tsa.task_id = t.task_id AND tsa.store_id = s.store_id);

-- Some: stores with 'on_progress' (started but not finished before deadline)
INSERT INTO task_store_assignments (task_id, store_id, status, assigned_at, assigned_by, started_at, started_by, notes)
SELECT
    t.task_id,
    s.store_id,
    'on_progress',
    DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 30 + 10) DAY),
    1,
    DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 20 + 5) DAY),
    ((s.store_id % 34) + 11),
    'OVERDUE: Store started but did not complete before deadline'
FROM tasks t
CROSS JOIN (
    SELECT store_id FROM stores WHERE store_id BETWEEN 101 AND 200 ORDER BY RAND() LIMIT 2
) s
WHERE t.status_id = 10
AND t.parent_task_id IS NULL
AND NOT EXISTS (SELECT 1 FROM task_store_assignments tsa WHERE tsa.task_id = t.task_id AND tsa.store_id = s.store_id);

-- Some: stores with 'done' (completed on time)
INSERT INTO task_store_assignments (task_id, store_id, status, assigned_at, assigned_by, started_at, started_by, completed_at, completed_by, checked_by, checked_at, notes)
SELECT
    t.task_id,
    s.store_id,
    'done',
    DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 30 + 10) DAY),
    1,
    DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 25 + 5) DAY),
    ((s.store_id % 34) + 11),
    DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 20) DAY),
    ((s.store_id % 34) + 11),
    1,
    DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 15) DAY),
    'Completed before deadline'
FROM tasks t
CROSS JOIN (
    SELECT store_id FROM stores WHERE store_id BETWEEN 201 AND 350 ORDER BY RAND() LIMIT 4
) s
WHERE t.status_id = 10
AND t.parent_task_id IS NULL
AND NOT EXISTS (SELECT 1 FROM task_store_assignments tsa WHERE tsa.task_id = t.task_id AND tsa.store_id = s.store_id);

-- Some: stores with 'unable'
INSERT INTO task_store_assignments (task_id, store_id, status, assigned_at, assigned_by, completed_at, completed_by, unable_reason, notes)
SELECT
    t.task_id,
    s.store_id,
    'unable',
    DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 30 + 10) DAY),
    1,
    DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 20) DAY),
    ((s.store_id % 34) + 11),
    'Không thể hoàn thành do điều kiện khách quan / Unable to complete due to circumstances',
    'Marked as unable'
FROM tasks t
CROSS JOIN (
    SELECT store_id FROM stores WHERE store_id BETWEEN 351 AND 400 ORDER BY RAND() LIMIT 1
) s
WHERE t.status_id = 10
AND t.parent_task_id IS NULL
AND NOT EXISTS (SELECT 1 FROM task_store_assignments tsa WHERE tsa.task_id = t.task_id AND tsa.store_id = s.store_id);

-- ============================================================================
-- 5. ALSO ADD ASSIGNMENTS FOR CHILD TASKS (sub-tasks)
-- Child tasks inherit the parent's scope but have their own execution status
-- ============================================================================

-- For child tasks of ON_PROGRESS parents
INSERT INTO task_store_assignments (task_id, store_id, status, assigned_at, assigned_by, started_at, started_by, notes)
SELECT
    child.task_id,
    tsa.store_id,
    CASE
        WHEN RAND() < 0.3 THEN 'not_yet'
        WHEN RAND() < 0.6 THEN 'on_progress'
        ELSE 'done_pending'
    END,
    tsa.assigned_at,
    tsa.assigned_by,
    CASE WHEN RAND() > 0.3 THEN DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 5) DAY) ELSE NULL END,
    CASE WHEN RAND() > 0.3 THEN ((tsa.store_id % 34) + 11) ELSE NULL END,
    'Child task of ON_PROGRESS parent'
FROM tasks child
JOIN tasks parent ON child.parent_task_id = parent.task_id
JOIN task_store_assignments tsa ON tsa.task_id = parent.task_id
WHERE parent.status_id = 8
AND NOT EXISTS (SELECT 1 FROM task_store_assignments x WHERE x.task_id = child.task_id AND x.store_id = tsa.store_id)
LIMIT 500;

-- For child tasks of DONE parents
INSERT INTO task_store_assignments (task_id, store_id, status, assigned_at, assigned_by, started_at, started_by, completed_at, completed_by, checked_by, checked_at, notes)
SELECT
    child.task_id,
    tsa.store_id,
    CASE WHEN RAND() < 0.9 THEN 'done' ELSE 'unable' END,
    tsa.assigned_at,
    tsa.assigned_by,
    DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 20) DAY),
    ((tsa.store_id % 34) + 11),
    DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 15) DAY),
    ((tsa.store_id % 34) + 11),
    1,
    DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 10) DAY),
    'Child task of DONE parent'
FROM tasks child
JOIN tasks parent ON child.parent_task_id = parent.task_id
JOIN task_store_assignments tsa ON tsa.task_id = parent.task_id
WHERE parent.status_id = 9
AND NOT EXISTS (SELECT 1 FROM task_store_assignments x WHERE x.task_id = child.task_id AND x.store_id = tsa.store_id)
LIMIT 500;

-- ============================================================================
-- SUMMARY
-- ============================================================================
SELECT
    'Store Assignments Summary' as info,
    (SELECT COUNT(*) FROM task_store_assignments) as total_assignments,
    (SELECT COUNT(DISTINCT task_id) FROM task_store_assignments) as tasks_with_assignments;

SELECT
    status,
    COUNT(*) as count
FROM task_store_assignments
GROUP BY status
ORDER BY FIELD(status, 'not_yet', 'on_progress', 'done_pending', 'done', 'unable');
