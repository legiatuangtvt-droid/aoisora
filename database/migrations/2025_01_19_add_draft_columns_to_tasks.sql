-- Migration: Add draft-related columns to tasks table
-- Date: 2025-01-19
-- Description: Add columns for tracking task source, receiver type, rejection workflow, and approval timestamps

-- Add source column (tracks which flow created the task)
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS source ENUM('task_list', 'library', 'todo_task') DEFAULT 'task_list' AFTER task_id;

-- Add receiver_type column (tracks who receives the task)
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS receiver_type ENUM('store', 'hq_user') DEFAULT 'store' AFTER source;

-- Add approver tracking
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS approver_id INT NULL AFTER created_staff_id;

-- Add rejection tracking columns
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS rejection_count INT DEFAULT 0 AFTER approver_id;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS has_changes_since_rejection TINYINT(1) DEFAULT 0 AFTER rejection_count;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS last_rejection_reason TEXT NULL AFTER has_changes_since_rejection;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS last_rejected_at TIMESTAMP NULL AFTER last_rejection_reason;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS last_rejected_by INT NULL AFTER last_rejected_at;

-- Add library task link (for dispatched tasks)
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS library_task_id INT NULL AFTER last_rejected_by;

-- Add workflow timestamps
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMP NULL AFTER library_task_id;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP NULL AFTER submitted_at;

-- Note: Run this on production via phpMyAdmin before deploying backend code that uses these columns
