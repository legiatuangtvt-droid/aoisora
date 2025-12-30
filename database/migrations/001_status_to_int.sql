-- ============================================
-- Migration: Convert status from VARCHAR to INT
-- Uses code_master table for status lookup
-- Date: 2025-12-29
-- ============================================

-- ============================================
-- STEP 1: Insert status codes into code_master
-- Classification: TASK_STATUS
-- ============================================
INSERT INTO code_master (code_type, code, name, description, sort_order, is_active)
VALUES
    ('TASK_STATUS', '1', 'Not Yet', 'Task not started yet', 1, true),
    ('TASK_STATUS', '2', 'Done', 'Task completed successfully', 2, true),
    ('TASK_STATUS', '3', 'Skipped', 'Task was skipped', 3, true),
    ('TASK_STATUS', '4', 'In Progress', 'Task is currently in progress', 4, true)
ON CONFLICT (code_type, code) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    sort_order = EXCLUDED.sort_order;

-- ============================================
-- STEP 2: Add new status_code column (INT)
-- ============================================
ALTER TABLE daily_schedule_tasks
ADD COLUMN IF NOT EXISTS status_code INTEGER DEFAULT 1;

-- ============================================
-- STEP 3: Migrate existing data
-- Map old string status to new int status_code
-- ============================================
UPDATE daily_schedule_tasks
SET status_code = CASE status
    WHEN 'pending' THEN 1      -- Not Yet
    WHEN 'in_progress' THEN 4  -- In Progress
    WHEN 'completed' THEN 2    -- Done
    WHEN 'skipped' THEN 3      -- Skipped
    ELSE 1                     -- Default to Not Yet
END;

-- ============================================
-- STEP 4: Drop old status column and rename new one
-- ============================================
ALTER TABLE daily_schedule_tasks DROP COLUMN IF EXISTS status;
ALTER TABLE daily_schedule_tasks RENAME COLUMN status_code TO status;

-- ============================================
-- STEP 5: Add NOT NULL constraint and default
-- ============================================
ALTER TABLE daily_schedule_tasks ALTER COLUMN status SET NOT NULL;
ALTER TABLE daily_schedule_tasks ALTER COLUMN status SET DEFAULT 1;

-- ============================================
-- STEP 6: Add FK constraint to code_master (optional)
-- Note: This requires code_master.code to be the same type
-- Since code_master.code is VARCHAR and we want INT,
-- we'll use a CHECK constraint instead
-- ============================================
ALTER TABLE daily_schedule_tasks
ADD CONSTRAINT chk_status_valid CHECK (status IN (1, 2, 3, 4));

-- ============================================
-- STEP 7: Create index for status queries
-- ============================================
CREATE INDEX IF NOT EXISTS idx_daily_schedule_tasks_status ON daily_schedule_tasks(status);

-- ============================================
-- VERIFY
-- ============================================
SELECT 'code_master status codes:' as info;
SELECT * FROM code_master WHERE code_type = 'TASK_STATUS' ORDER BY sort_order;

SELECT 'daily_schedule_tasks status distribution:' as info;
SELECT status, COUNT(*) as count
FROM daily_schedule_tasks
GROUP BY status
ORDER BY status;
