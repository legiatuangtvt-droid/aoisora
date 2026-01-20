-- ============================================
-- Migration: Add Task Hierarchy Support
-- Date: 2026-01-20
-- Description: Add parent_task_id and task_level columns
--              to enable nested sub-tasks (max 5 levels)
-- ============================================

-- Add columns
ALTER TABLE `tasks`
    ADD COLUMN `parent_task_id` INT NULL AFTER `task_id`,
    ADD COLUMN `task_level` TINYINT DEFAULT 1 AFTER `parent_task_id`;

-- Add foreign key constraint
ALTER TABLE `tasks`
    ADD CONSTRAINT `fk_tasks_parent` FOREIGN KEY (`parent_task_id`)
    REFERENCES `tasks`(`task_id`) ON DELETE CASCADE;

-- Add indexes for performance
ALTER TABLE `tasks`
    ADD INDEX `idx_tasks_parent` (`parent_task_id`),
    ADD INDEX `idx_tasks_level` (`task_level`);

-- ============================================
-- Verify the changes
-- ============================================
-- SHOW COLUMNS FROM `tasks` LIKE 'parent_task_id';
-- SHOW COLUMNS FROM `tasks` LIKE 'task_level';
