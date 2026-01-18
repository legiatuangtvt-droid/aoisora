-- ============================================
-- Migration: Add Draft & Approval Fields to Tasks Table
-- Date: 2026-01-18
-- Purpose: Support 3 Creation Flows (Task List, Library, To Do Task)
--          and Approval workflow with rejection tracking
-- ============================================

-- ============================================
-- 1. Add source field - Identify creation flow
-- ============================================
ALTER TABLE `tasks`
ADD COLUMN `source` ENUM('task_list', 'library', 'todo_task') DEFAULT 'task_list'
AFTER `task_id`;

-- ============================================
-- 2. Add receiver_type field - Store vs HQ user
-- ============================================
ALTER TABLE `tasks`
ADD COLUMN `receiver_type` ENUM('store', 'hq_user') DEFAULT 'store'
AFTER `source`;

-- ============================================
-- 3. Add approver_id field - Who approves this task
-- ============================================
ALTER TABLE `tasks`
ADD COLUMN `approver_id` INT NULL
AFTER `created_staff_id`;

ALTER TABLE `tasks`
ADD CONSTRAINT `fk_tasks_approver`
FOREIGN KEY (`approver_id`) REFERENCES `staff`(`staff_id`) ON DELETE SET NULL;

-- ============================================
-- 4. Add rejection tracking fields
-- ============================================
-- Rejection count (max 3 allowed)
ALTER TABLE `tasks`
ADD COLUMN `rejection_count` INT DEFAULT 0
AFTER `approver_id`;

-- Flag to track if user has edited since last rejection
ALTER TABLE `tasks`
ADD COLUMN `has_changes_since_rejection` TINYINT(1) DEFAULT 0
AFTER `rejection_count`;

-- Last rejection reason (required when rejecting)
ALTER TABLE `tasks`
ADD COLUMN `last_rejection_reason` TEXT NULL
AFTER `has_changes_since_rejection`;

-- Last rejection timestamp
ALTER TABLE `tasks`
ADD COLUMN `last_rejected_at` TIMESTAMP NULL
AFTER `last_rejection_reason`;

-- Last rejected by (approver who rejected)
ALTER TABLE `tasks`
ADD COLUMN `last_rejected_by` INT NULL
AFTER `last_rejected_at`;

ALTER TABLE `tasks`
ADD CONSTRAINT `fk_tasks_last_rejected_by`
FOREIGN KEY (`last_rejected_by`) REFERENCES `staff`(`staff_id`) ON DELETE SET NULL;

-- ============================================
-- 5. Add library_task_id for tracking dispatched tasks
-- ============================================
ALTER TABLE `tasks`
ADD COLUMN `library_task_id` INT NULL
AFTER `last_rejected_by`;

-- Note: This FK references task_library table, not tasks
-- ALTER TABLE `tasks`
-- ADD CONSTRAINT `fk_tasks_library_task`
-- FOREIGN KEY (`library_task_id`) REFERENCES `task_library`(`task_library_id`) ON DELETE SET NULL;

-- ============================================
-- 6. Add submitted_at for tracking submission time
-- ============================================
ALTER TABLE `tasks`
ADD COLUMN `submitted_at` TIMESTAMP NULL
AFTER `library_task_id`;

-- ============================================
-- 7. Add approved_at for tracking approval time
-- ============================================
ALTER TABLE `tasks`
ADD COLUMN `approved_at` TIMESTAMP NULL
AFTER `submitted_at`;

-- ============================================
-- 8. Add index for common queries
-- ============================================
-- Index for draft count query (by source and status)
CREATE INDEX `idx_tasks_source_status_created`
ON `tasks` (`source`, `status_id`, `created_staff_id`);

-- Index for finding tasks pending approval
CREATE INDEX `idx_tasks_approver_status`
ON `tasks` (`approver_id`, `status_id`);

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Run these after migration to verify:
-- DESCRIBE `tasks`;
-- SHOW INDEX FROM `tasks`;
