-- ============================================
-- Aoisora Database Schema
-- Database: PostgreSQL 15+
-- Created: 2025-12-31
-- ============================================
-- This file creates all tables for the Aoisora system
-- Run this on a fresh database to set up the structure
-- ============================================

-- ============================================
-- DROP ALL EXISTING TABLES (reverse order of dependencies)
-- ============================================

DROP TABLE IF EXISTS "task_likes" CASCADE;
DROP TABLE IF EXISTS "task_comments" CASCADE;
DROP TABLE IF EXISTS "task_images" CASCADE;
DROP TABLE IF EXISTS "task_staff_results" CASCADE;
DROP TABLE IF EXISTS "task_store_results" CASCADE;
DROP TABLE IF EXISTS "task_workflow_steps" CASCADE;
DROP TABLE IF EXISTS "manual_view_logs" CASCADE;
DROP TABLE IF EXISTS "manual_media" CASCADE;
DROP TABLE IF EXISTS "manual_steps" CASCADE;
DROP TABLE IF EXISTS "manual_documents" CASCADE;
DROP TABLE IF EXISTS "manual_folders" CASCADE;
DROP TABLE IF EXISTS "notifications" CASCADE;
DROP TABLE IF EXISTS "daily_schedule_tasks" CASCADE;
DROP TABLE IF EXISTS "daily_templates" CASCADE;
DROP TABLE IF EXISTS "task_library" CASCADE;
DROP TABLE IF EXISTS "shift_templates" CASCADE;
DROP TABLE IF EXISTS "shift_assignments" CASCADE;
DROP TABLE IF EXISTS "shift_codes" CASCADE;
DROP TABLE IF EXISTS "task_groups" CASCADE;
DROP TABLE IF EXISTS "task_check_list" CASCADE;
DROP TABLE IF EXISTS "check_lists" CASCADE;
DROP TABLE IF EXISTS "tasks" CASCADE;
DROP TABLE IF EXISTS "manuals" CASCADE;
DROP TABLE IF EXISTS "code_master" CASCADE;
DROP TABLE IF EXISTS "staff" CASCADE;
DROP TABLE IF EXISTS "stores" CASCADE;
DROP TABLE IF EXISTS "departments" CASCADE;
DROP TABLE IF EXISTS "regions" CASCADE;
DROP TABLE IF EXISTS "personal_access_tokens" CASCADE;

-- ============================================
-- CORE TABLES
-- ============================================

-- Regions Table
CREATE TABLE "regions" (
    "region_id" SERIAL PRIMARY KEY,
    "region_name" VARCHAR(255) NOT NULL,
    "region_code" VARCHAR(50) UNIQUE,
    "description" TEXT,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE "regions" IS 'Geographic regions for store grouping';

-- Departments Table
CREATE TABLE "departments" (
    "department_id" SERIAL PRIMARY KEY,
    "department_name" VARCHAR(255) NOT NULL,
    "department_code" VARCHAR(50) UNIQUE,
    "description" TEXT,
    "parent_id" INTEGER,
    "sort_order" INTEGER DEFAULT 0,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add self-referencing FK after table creation
ALTER TABLE "departments" ADD CONSTRAINT "fk_departments_parent"
    FOREIGN KEY ("parent_id") REFERENCES "departments"("department_id") ON DELETE SET NULL;

COMMENT ON TABLE "departments" IS 'Organizational departments (hierarchical)';

-- Stores Table
CREATE TABLE "stores" (
    "store_id" SERIAL PRIMARY KEY,
    "store_name" VARCHAR(255) NOT NULL,
    "store_code" VARCHAR(50) UNIQUE,
    "region_id" INTEGER REFERENCES "regions"("region_id") ON DELETE SET NULL,
    "address" TEXT,
    "phone" VARCHAR(20),
    "email" VARCHAR(100),
    "manager_id" INTEGER,
    "status" VARCHAR(20) DEFAULT 'active',
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE "stores" IS 'Store locations and details';

-- Staff Table (Auth Model)
CREATE TABLE "staff" (
    "staff_id" SERIAL PRIMARY KEY,
    "staff_name" VARCHAR(255) NOT NULL,
    "staff_code" VARCHAR(50) UNIQUE,
    "username" VARCHAR(100) UNIQUE NOT NULL,
    "email" VARCHAR(100) UNIQUE,
    "phone" VARCHAR(20),
    "store_id" INTEGER REFERENCES "stores"("store_id") ON DELETE SET NULL,
    "department_id" INTEGER REFERENCES "departments"("department_id") ON DELETE SET NULL,
    "role" VARCHAR(50) DEFAULT 'STAFF',
    "password_hash" VARCHAR(255) NOT NULL,
    "status" VARCHAR(20) DEFAULT 'active',
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE "staff" IS 'Employees and staff members (auth model for Laravel Sanctum)';

-- Add manager FK to stores after staff table exists
ALTER TABLE "stores" ADD CONSTRAINT "fk_stores_manager"
    FOREIGN KEY ("manager_id") REFERENCES "staff"("staff_id") ON DELETE SET NULL;

-- Sanctum Personal Access Tokens
CREATE TABLE "personal_access_tokens" (
    "id" BIGSERIAL PRIMARY KEY,
    "tokenable_type" VARCHAR(255) NOT NULL,
    "tokenable_id" BIGINT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "token" VARCHAR(64) UNIQUE NOT NULL,
    "abilities" TEXT,
    "last_used_at" TIMESTAMP,
    "expires_at" TIMESTAMP,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "idx_personal_access_tokens_tokenable" ON "personal_access_tokens" ("tokenable_type", "tokenable_id");

-- Code Master Table
CREATE TABLE "code_master" (
    "code_master_id" SERIAL PRIMARY KEY,
    "code_type" VARCHAR(50) NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "sort_order" INTEGER DEFAULT 0,
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "code_master_code_type_code_key" UNIQUE("code_type", "code")
);

COMMENT ON TABLE "code_master" IS 'Master lookup table for status, task_type, response_type';

-- ============================================
-- WS (WORK SCHEDULE) TABLES
-- ============================================

-- Manuals Table (Legacy)
CREATE TABLE "manuals" (
    "manual_id" SERIAL PRIMARY KEY,
    "manual_name" VARCHAR(255) NOT NULL,
    "manual_url" TEXT,
    "description" TEXT,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE "manuals" IS 'Legacy task manuals and documentation';

-- Tasks Table
CREATE TABLE "tasks" (
    "task_id" SERIAL PRIMARY KEY,
    "task_name" VARCHAR(500) NOT NULL,
    "task_description" TEXT,
    "manual_id" INTEGER REFERENCES "manuals"("manual_id") ON DELETE SET NULL,
    "task_type_id" INTEGER REFERENCES "code_master"("code_master_id"),
    "response_type_id" INTEGER REFERENCES "code_master"("code_master_id"),
    "response_num" INTEGER,
    "is_repeat" BOOLEAN DEFAULT false,
    "repeat_config" JSONB,
    "dept_id" INTEGER REFERENCES "departments"("department_id") ON DELETE SET NULL,
    "assigned_store_id" INTEGER REFERENCES "stores"("store_id") ON DELETE SET NULL,
    "assigned_staff_id" INTEGER REFERENCES "staff"("staff_id") ON DELETE SET NULL,
    "do_staff_id" INTEGER REFERENCES "staff"("staff_id") ON DELETE SET NULL,
    "status_id" INTEGER REFERENCES "code_master"("code_master_id"),
    "priority" VARCHAR(20) DEFAULT 'normal',
    "start_date" DATE,
    "end_date" DATE,
    "start_time" TIME,
    "due_datetime" TIMESTAMP,
    "completed_time" TIMESTAMP,
    "comment" TEXT,
    "attachments" JSONB,
    "created_staff_id" INTEGER REFERENCES "staff"("staff_id"),
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE "tasks" IS 'Work schedule tasks and assignments (Aoi WS)';

-- Check Lists Table
CREATE TABLE "check_lists" (
    "check_list_id" SERIAL PRIMARY KEY,
    "check_list_name" VARCHAR(500) NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE "check_lists" IS 'Checklist items library';

-- Task Check List Junction Table
CREATE TABLE "task_check_list" (
    "id" SERIAL PRIMARY KEY,
    "task_id" INTEGER REFERENCES "tasks"("task_id") ON DELETE CASCADE,
    "check_list_id" INTEGER REFERENCES "check_lists"("check_list_id") ON DELETE CASCADE,
    "check_status" BOOLEAN DEFAULT false,
    "completed_at" TIMESTAMP,
    "completed_by" INTEGER REFERENCES "staff"("staff_id"),
    "notes" TEXT,
    CONSTRAINT "task_check_list_unique" UNIQUE("task_id", "check_list_id")
);

COMMENT ON TABLE "task_check_list" IS 'Many-to-many relationship between tasks and checklists';

-- ============================================
-- DWS (DISPATCH WORK SCHEDULE) TABLES
-- ============================================

-- Task Groups Table
CREATE TABLE "task_groups" (
    "group_id" VARCHAR(20) PRIMARY KEY,
    "group_code" VARCHAR(20) NOT NULL,
    "group_name" VARCHAR(100) NOT NULL,
    "priority" INTEGER DEFAULT 50,
    "sort_order" INTEGER DEFAULT 0,
    "color_bg" VARCHAR(20) DEFAULT '#f3f4f6',
    "color_text" VARCHAR(20) DEFAULT '#374151',
    "color_border" VARCHAR(20) DEFAULT '#9ca3af',
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE "task_groups" IS 'Task group definitions with colors (POS, PERI, DRY, etc.)';

-- Shift Codes Table
CREATE TABLE "shift_codes" (
    "shift_code_id" SERIAL PRIMARY KEY,
    "shift_code" VARCHAR(20) NOT NULL UNIQUE,
    "shift_name" VARCHAR(100) NOT NULL,
    "start_time" TIME NOT NULL,
    "end_time" TIME NOT NULL,
    "total_hours" DECIMAL(4,2) DEFAULT 8.0,
    "shift_type" VARCHAR(20) DEFAULT 'regular',
    "break_minutes" INTEGER DEFAULT 60,
    "color_code" VARCHAR(7),
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE "shift_codes" IS 'Shift type definitions (V8.6, V8.14, OFF, etc.)';

-- Shift Templates Table
CREATE TABLE "shift_templates" (
    "template_id" SERIAL PRIMARY KEY,
    "template_name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "shift_pattern" JSONB,
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE "shift_templates" IS 'Shift pattern templates';

-- Shift Assignments Table
CREATE TABLE "shift_assignments" (
    "assignment_id" SERIAL PRIMARY KEY,
    "staff_id" INTEGER REFERENCES "staff"("staff_id") ON DELETE CASCADE,
    "store_id" INTEGER REFERENCES "stores"("store_id"),
    "shift_date" DATE NOT NULL,
    "shift_code_id" INTEGER REFERENCES "shift_codes"("shift_code_id"),
    "status" VARCHAR(20) DEFAULT 'assigned',
    "notes" TEXT,
    "assigned_by" INTEGER REFERENCES "staff"("staff_id"),
    "assigned_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "shift_assignments_unique" UNIQUE("staff_id", "shift_date", "shift_code_id")
);

COMMENT ON TABLE "shift_assignments" IS 'Staff shift schedule assignments';

-- Task Library Table
CREATE TABLE "task_library" (
    "task_lib_id" SERIAL PRIMARY KEY,
    "task_code" VARCHAR(20) NOT NULL UNIQUE,
    "task_name" VARCHAR(255) NOT NULL,
    "group_id" VARCHAR(20) REFERENCES "task_groups"("group_id"),
    "duration_minutes" INTEGER DEFAULT 15,
    "description" TEXT,
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE "task_library" IS 'Task templates for daily schedule';

-- Daily Templates Table
CREATE TABLE "daily_templates" (
    "template_id" SERIAL PRIMARY KEY,
    "template_name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "template_data" JSONB,
    "applied_stores" JSONB,
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE "daily_templates" IS 'Daily schedule templates';

-- Daily Schedule Tasks Table
CREATE TABLE "daily_schedule_tasks" (
    "schedule_task_id" SERIAL PRIMARY KEY,
    "staff_id" INTEGER REFERENCES "staff"("staff_id") ON DELETE CASCADE,
    "store_id" INTEGER REFERENCES "stores"("store_id"),
    "schedule_date" DATE NOT NULL,
    "group_id" VARCHAR(20) REFERENCES "task_groups"("group_id"),
    "task_code" VARCHAR(20),
    "task_name" VARCHAR(255) NOT NULL,
    "start_time" TIME NOT NULL,
    "end_time" TIME NOT NULL,
    "status" INTEGER DEFAULT 1,
    "completed_at" TIMESTAMP,
    "notes" TEXT,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE "daily_schedule_tasks" IS 'Daily task instances for each staff (Aoi DWS)';
COMMENT ON COLUMN "daily_schedule_tasks"."status" IS '1=Not Yet, 2=Done, 3=Skipped, 4=In Progress';

-- ============================================
-- MANUAL (KNOWLEDGE BASE) TABLES
-- ============================================

-- Manual Folders Table
CREATE TABLE "manual_folders" (
    "folder_id" SERIAL PRIMARY KEY,
    "folder_name" VARCHAR(255) NOT NULL,
    "parent_id" INTEGER REFERENCES "manual_folders"("folder_id") ON DELETE CASCADE,
    "description" TEXT,
    "icon" VARCHAR(50),
    "sort_order" INTEGER DEFAULT 0,
    "display_order" INTEGER DEFAULT 0,
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE "manual_folders" IS 'Folder hierarchy for manual documents';

-- Manual Documents Table
CREATE TABLE "manual_documents" (
    "document_id" SERIAL PRIMARY KEY,
    "folder_id" INTEGER REFERENCES "manual_folders"("folder_id") ON DELETE SET NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "version" VARCHAR(20) DEFAULT '1.0',
    "status" VARCHAR(20) DEFAULT 'draft',
    "tags" JSONB,
    "created_by" INTEGER REFERENCES "staff"("staff_id"),
    "updated_by" INTEGER REFERENCES "staff"("staff_id"),
    "published_at" TIMESTAMP,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE "manual_documents" IS 'Manual document metadata (Aoi Manual)';

-- Manual Steps Table
CREATE TABLE "manual_steps" (
    "step_id" SERIAL PRIMARY KEY,
    "document_id" INTEGER REFERENCES "manual_documents"("document_id") ON DELETE CASCADE,
    "step_number" INTEGER NOT NULL,
    "title" VARCHAR(255),
    "content" TEXT,
    "tips" TEXT,
    "warnings" TEXT,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE "manual_steps" IS 'Step-by-step content for manual documents';

-- Manual Media Table
CREATE TABLE "manual_media" (
    "media_id" SERIAL PRIMARY KEY,
    "step_id" INTEGER REFERENCES "manual_steps"("step_id") ON DELETE CASCADE,
    "document_id" INTEGER REFERENCES "manual_documents"("document_id") ON DELETE CASCADE,
    "media_type" VARCHAR(20) NOT NULL,
    "file_path" TEXT NOT NULL,
    "file_name" VARCHAR(255),
    "file_size" INTEGER,
    "mime_type" VARCHAR(100),
    "alt_text" VARCHAR(255),
    "sort_order" INTEGER DEFAULT 0,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE "manual_media" IS 'Media attachments for manual documents';

-- Manual View Logs Table
CREATE TABLE "manual_view_logs" (
    "log_id" SERIAL PRIMARY KEY,
    "document_id" INTEGER REFERENCES "manual_documents"("document_id") ON DELETE CASCADE,
    "staff_id" INTEGER REFERENCES "staff"("staff_id") ON DELETE CASCADE,
    "viewed_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "duration_seconds" INTEGER
);

COMMENT ON TABLE "manual_view_logs" IS 'Track document views for analytics';

-- ============================================
-- TASK DETAIL TABLES (for Task Detail API)
-- ============================================

-- Task Workflow Steps Table
CREATE TABLE "task_workflow_steps" (
    "step_id" SERIAL PRIMARY KEY,
    "task_id" INTEGER REFERENCES "tasks"("task_id") ON DELETE CASCADE,
    "step_number" INTEGER NOT NULL, -- 1=SUBMIT, 2=APPROVE, 3=DO TASK, 4=CHECK
    "step_name" VARCHAR(50) NOT NULL,
    "status" VARCHAR(20) DEFAULT 'pending', -- pending, in_progress, completed, skipped
    "assignee_id" INTEGER REFERENCES "staff"("staff_id") ON DELETE SET NULL,
    "skip_info" VARCHAR(255), -- e.g., "27 Stores" for DO TASK step
    "start_date" DATE,
    "end_date" DATE,
    "comment" TEXT,
    "completed_at" TIMESTAMP,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE "task_workflow_steps" IS 'Workflow steps for each task (SUBMIT, APPROVE, DO TASK, CHECK)';

-- Task Store Results Table
CREATE TABLE "task_store_results" (
    "result_id" SERIAL PRIMARY KEY,
    "task_id" INTEGER REFERENCES "tasks"("task_id") ON DELETE CASCADE,
    "store_id" INTEGER REFERENCES "stores"("store_id") ON DELETE CASCADE,
    "status" VARCHAR(20) DEFAULT 'not_started', -- not_started, in_progress, success, failed
    "start_time" TIMESTAMP,
    "completed_time" TIMESTAMP,
    "completed_by_id" INTEGER REFERENCES "staff"("staff_id") ON DELETE SET NULL,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE "task_store_results" IS 'Task completion results per store';

-- Task Staff Results Table
CREATE TABLE "task_staff_results" (
    "result_id" SERIAL PRIMARY KEY,
    "task_id" INTEGER REFERENCES "tasks"("task_id") ON DELETE CASCADE,
    "staff_id" INTEGER REFERENCES "staff"("staff_id") ON DELETE CASCADE,
    "store_id" INTEGER REFERENCES "stores"("store_id") ON DELETE SET NULL,
    "status" VARCHAR(20) DEFAULT 'not_started', -- not_started, in_progress, success, failed
    "progress" INTEGER DEFAULT 0, -- 0-100
    "progress_text" VARCHAR(50), -- e.g., "100% (15/15 items)"
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE "task_staff_results" IS 'Task completion results per staff member';

-- Task Images Table
CREATE TABLE "task_images" (
    "image_id" SERIAL PRIMARY KEY,
    "task_id" INTEGER REFERENCES "tasks"("task_id") ON DELETE CASCADE,
    "store_result_id" INTEGER REFERENCES "task_store_results"("result_id") ON DELETE CASCADE,
    "staff_result_id" INTEGER REFERENCES "task_staff_results"("result_id") ON DELETE CASCADE,
    "title" VARCHAR(255),
    "image_url" TEXT NOT NULL,
    "thumbnail_url" TEXT,
    "uploaded_by_id" INTEGER REFERENCES "staff"("staff_id") ON DELETE SET NULL,
    "is_completed" BOOLEAN DEFAULT false,
    "uploaded_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE "task_images" IS 'Images uploaded for task completion';

-- Task Comments Table
CREATE TABLE "task_comments" (
    "comment_id" SERIAL PRIMARY KEY,
    "task_id" INTEGER REFERENCES "tasks"("task_id") ON DELETE CASCADE,
    "store_result_id" INTEGER REFERENCES "task_store_results"("result_id") ON DELETE CASCADE,
    "staff_result_id" INTEGER REFERENCES "task_staff_results"("result_id") ON DELETE CASCADE,
    "user_id" INTEGER REFERENCES "staff"("staff_id") ON DELETE SET NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE "task_comments" IS 'Comments on task results';

-- Task Likes Table
CREATE TABLE "task_likes" (
    "like_id" SERIAL PRIMARY KEY,
    "store_result_id" INTEGER REFERENCES "task_store_results"("result_id") ON DELETE CASCADE,
    "user_id" INTEGER REFERENCES "staff"("staff_id") ON DELETE CASCADE,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "task_likes_unique" UNIQUE("store_result_id", "user_id")
);

COMMENT ON TABLE "task_likes" IS 'Likes on store task results';

-- ============================================
-- NOTIFICATIONS TABLE
-- ============================================

CREATE TABLE "notifications" (
    "notification_id" SERIAL PRIMARY KEY,
    "recipient_staff_id" INTEGER REFERENCES "staff"("staff_id") ON DELETE CASCADE,
    "sender_staff_id" INTEGER REFERENCES "staff"("staff_id") ON DELETE SET NULL,
    "notification_type" VARCHAR(50),
    "title" VARCHAR(255) NOT NULL,
    "message" TEXT,
    "link_url" TEXT,
    "is_read" BOOLEAN DEFAULT false,
    "read_at" TIMESTAMP,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE "notifications" IS 'System notifications for staff';

-- ============================================
-- INDEXES
-- ============================================

-- Staff indexes
CREATE INDEX "idx_staff_store" ON "staff" ("store_id");
CREATE INDEX "idx_staff_department" ON "staff" ("department_id");
CREATE INDEX "idx_staff_username" ON "staff" ("username");
CREATE INDEX "idx_staff_status" ON "staff" ("status");

-- Tasks indexes
CREATE INDEX "idx_tasks_status" ON "tasks" ("status_id");
CREATE INDEX "idx_tasks_assigned_staff" ON "tasks" ("assigned_staff_id");
CREATE INDEX "idx_tasks_assigned_store" ON "tasks" ("assigned_store_id");
CREATE INDEX "idx_tasks_dates" ON "tasks" ("start_date", "end_date");

-- Shift assignments indexes
CREATE INDEX "idx_shift_assignments_staff" ON "shift_assignments" ("staff_id");
CREATE INDEX "idx_shift_assignments_date" ON "shift_assignments" ("shift_date");
CREATE INDEX "idx_shift_assignments_store" ON "shift_assignments" ("store_id");

-- Daily schedule tasks indexes
CREATE INDEX "idx_daily_schedule_staff" ON "daily_schedule_tasks" ("staff_id");
CREATE INDEX "idx_daily_schedule_date" ON "daily_schedule_tasks" ("schedule_date");
CREATE INDEX "idx_daily_schedule_store" ON "daily_schedule_tasks" ("store_id");
CREATE INDEX "idx_daily_schedule_group" ON "daily_schedule_tasks" ("group_id");

-- Notifications indexes
CREATE INDEX "idx_notifications_recipient" ON "notifications" ("recipient_staff_id", "is_read");

-- Manual indexes
CREATE INDEX "idx_manual_documents_folder" ON "manual_documents" ("folder_id");
CREATE INDEX "idx_manual_steps_document" ON "manual_steps" ("document_id");
CREATE INDEX "idx_manual_view_logs_document" ON "manual_view_logs" ("document_id");

-- Task detail indexes
CREATE INDEX "idx_task_workflow_steps_task" ON "task_workflow_steps" ("task_id");
CREATE INDEX "idx_task_store_results_task" ON "task_store_results" ("task_id");
CREATE INDEX "idx_task_store_results_store" ON "task_store_results" ("store_id");
CREATE INDEX "idx_task_staff_results_task" ON "task_staff_results" ("task_id");
CREATE INDEX "idx_task_staff_results_staff" ON "task_staff_results" ("staff_id");
CREATE INDEX "idx_task_images_store_result" ON "task_images" ("store_result_id");
CREATE INDEX "idx_task_images_staff_result" ON "task_images" ("staff_result_id");
CREATE INDEX "idx_task_comments_store_result" ON "task_comments" ("store_result_id");
CREATE INDEX "idx_task_comments_staff_result" ON "task_comments" ("staff_result_id");
CREATE INDEX "idx_task_likes_store_result" ON "task_likes" ("store_result_id");

-- ============================================
-- INITIAL DATA - Code Master Values
-- ============================================

-- Task Status Codes
INSERT INTO "code_master" ("code_master_id", "code_type", "code", "name", "sort_order") VALUES
(7, 'status', 'NOT_YET', 'Not Yet', 1),
(8, 'status', 'ON_PROGRESS', 'On Progress', 2),
(9, 'status', 'DONE', 'Done', 3),
(10, 'status', 'OVERDUE', 'Overdue', 4),
(11, 'status', 'REJECT', 'Reject', 5);

-- Task Type Codes
INSERT INTO "code_master" ("code_master_id", "code_type", "code", "name", "sort_order") VALUES
(1, 'task_type', 'STATISTICS', 'Statistics', 1),
(2, 'task_type', 'ARRANGE', 'Arrange', 2),
(3, 'task_type', 'PREPARE', 'Prepare', 3);

-- Response Type Codes
INSERT INTO "code_master" ("code_master_id", "code_type", "code", "name", "sort_order") VALUES
(4, 'response_type', 'PICTURE', 'Picture', 1),
(5, 'response_type', 'CHECKLIST', 'Checklist', 2),
(6, 'response_type', 'YESNO', 'Yes/No', 3);

-- Reset sequence
SELECT setval('code_master_code_master_id_seq', (SELECT MAX(code_master_id) FROM code_master));

-- ============================================
-- INITIAL DATA - Task Groups
-- ============================================

INSERT INTO "task_groups" ("group_id", "group_code", "group_name", "priority", "sort_order", "color_bg", "color_text", "color_border") VALUES
('POS', 'POS', 'Thu ngan', 100, 1, '#e2e8f0', '#1e293b', '#94a3b8'),
('PERI', 'PERI', 'Perishable', 90, 2, '#fef3c7', '#92400e', '#f59e0b'),
('DRY', 'DRY', 'Dry/Grocery', 80, 3, '#dbeafe', '#1e40af', '#3b82f6'),
('MMD', 'MMD', 'Logistics/Receiving', 75, 4, '#e0e7ff', '#3730a3', '#6366f1'),
('LEADER', 'LEADER', 'Leader Tasks', 95, 5, '#99f6e4', '#134e4a', '#2dd4bf'),
('QC-FSH', 'QC-FSH', 'Quality Control', 70, 6, '#dcfce7', '#166534', '#22c55e'),
('DELICA', 'DELICA', 'Delicatessen', 65, 7, '#fce7f3', '#9d174d', '#ec4899'),
('DND', 'DND', 'Do Not Disturb', 50, 8, '#fee2e2', '#991b1b', '#ef4444'),
('OTHER', 'OTHER', 'Other Tasks', 10, 9, '#f3f4f6', '#374151', '#9ca3af');

-- ============================================
-- INITIAL DATA - Shift Codes
-- ============================================

INSERT INTO "shift_codes" ("shift_code", "shift_name", "start_time", "end_time", "total_hours", "shift_type", "break_minutes", "color_code") VALUES
('V8.6', 'Ca sang 6h', '06:00:00', '14:00:00', 8.0, 'morning', 60, '#FFD700'),
('V8.7', 'Ca sang 7h', '07:00:00', '15:00:00', 8.0, 'morning', 60, '#FFA500'),
('V8.8', 'Ca sang 8h', '08:00:00', '16:00:00', 8.0, 'morning', 60, '#FF8C00'),
('V8.14', 'Ca chieu 14h', '14:00:00', '22:00:00', 8.0, 'afternoon', 60, '#87CEEB'),
('V8.14.5', 'Ca chieu 14:30', '14:30:00', '22:30:00', 8.0, 'afternoon', 60, '#00BFFF'),
('V8.15', 'Ca chieu 15h', '15:00:00', '23:00:00', 8.0, 'afternoon', 60, '#1E90FF'),
('OFF', 'Nghi', '00:00:00', '00:00:00', 0.0, 'off', 0, '#D3D3D3'),
('FULL', 'Ca toan thoi gian', '08:00:00', '20:00:00', 12.0, 'full', 90, '#32CD32');

-- ============================================
-- DONE
-- ============================================
