-- OptiChain WS & DWS Database Schema
-- PostgreSQL Schema for Neon Database
-- Date: 2025-12-27
--
-- USAGE: Run this entire file on Neon SQL Editor to reset/update database structure
-- WARNING: This will DROP and recreate all tables! Data will be lost!

-- ============================================
-- DROP ALL EXISTING TABLES (in correct order due to FK constraints)
-- ============================================

DROP TABLE IF EXISTS "notifications" CASCADE;
DROP TABLE IF EXISTS "shift_assignments" CASCADE;
DROP TABLE IF EXISTS "shift_codes" CASCADE;
DROP TABLE IF EXISTS "task_check_list" CASCADE;
DROP TABLE IF EXISTS "check_lists" CASCADE;
DROP TABLE IF EXISTS "tasks" CASCADE;
DROP TABLE IF EXISTS "manuals" CASCADE;
DROP TABLE IF EXISTS "code_master" CASCADE;
DROP TABLE IF EXISTS "staff" CASCADE;
DROP TABLE IF EXISTS "stores" CASCADE;
DROP TABLE IF EXISTS "departments" CASCADE;
DROP TABLE IF EXISTS "regions" CASCADE;

-- ============================================
-- CREATE SCHEMA
-- ============================================

CREATE SCHEMA IF NOT EXISTS "public";

-- ============================================
-- CORE TABLES
-- ============================================

-- Regions Table
CREATE TABLE "regions" (
	"region_id" serial PRIMARY KEY,
	"region_name" varchar(255) NOT NULL,
	"region_code" varchar(50) CONSTRAINT "regions_region_code_key" UNIQUE,
	"description" text,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP
);

-- Departments Table
CREATE TABLE "departments" (
	"department_id" serial PRIMARY KEY,
	"department_name" varchar(255) NOT NULL,
	"department_code" varchar(50) CONSTRAINT "departments_department_code_key" UNIQUE,
	"description" text,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP
);

-- Stores Table
CREATE TABLE "stores" (
	"store_id" serial PRIMARY KEY,
	"store_name" varchar(255) NOT NULL,
	"store_code" varchar(50) CONSTRAINT "stores_store_code_key" UNIQUE,
	"region_id" integer,
	"address" text,
	"phone" varchar(20),
	"email" varchar(100),
	"manager_id" integer,
	"status" varchar(20) DEFAULT 'active',
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP
);

-- Staff Table
CREATE TABLE "staff" (
	"staff_id" serial PRIMARY KEY,
	"staff_name" varchar(255) NOT NULL,
	"staff_code" varchar(50) CONSTRAINT "staff_staff_code_key" UNIQUE,
	"email" varchar(100) CONSTRAINT "staff_email_key" UNIQUE,
	"phone" varchar(20),
	"store_id" integer,
	"department_id" integer,
	"role" varchar(50),
	"password_hash" varchar(255),
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- LOOKUP TABLES
-- ============================================

-- Code Master Table
CREATE TABLE "code_master" (
	"code_master_id" serial PRIMARY KEY,
	"code_type" varchar(50) NOT NULL,
	"code" varchar(50) NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"sort_order" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "code_master_code_type_code_key" UNIQUE("code_type","code")
);

-- ============================================
-- WS (Work Schedule) TABLES
-- ============================================

-- Manuals Table
CREATE TABLE "manuals" (
	"manual_id" serial PRIMARY KEY,
	"manual_name" varchar(255) NOT NULL,
	"manual_url" text,
	"description" text,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP
);

-- Tasks Table
CREATE TABLE "tasks" (
	"task_id" serial PRIMARY KEY,
	"task_name" varchar(500) NOT NULL,
	"task_description" text,
	"manual_id" integer,
	"task_type_id" integer,
	"response_type_id" integer,
	"response_num" integer,
	"is_repeat" boolean DEFAULT false,
	"repeat_config" jsonb,
	"dept_id" integer,
	"assigned_store_id" integer,
	"assigned_staff_id" integer,
	"do_staff_id" integer,
	"status_id" integer,
	"priority" varchar(20) DEFAULT 'normal',
	"start_date" date,
	"end_date" date,
	"start_time" time,
	"due_datetime" timestamp,
	"completed_time" timestamp,
	"comment" text,
	"attachments" jsonb,
	"created_staff_id" integer,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP
);

-- Check Lists Table
CREATE TABLE "check_lists" (
	"check_list_id" serial PRIMARY KEY,
	"check_list_name" varchar(500) NOT NULL,
	"description" text,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP
);

-- Task Check List Junction Table
CREATE TABLE "task_check_list" (
	"id" serial PRIMARY KEY,
	"task_id" integer,
	"check_list_id" integer,
	"check_status" boolean DEFAULT false,
	"completed_at" timestamp,
	"completed_by" integer,
	"notes" text,
	CONSTRAINT "task_check_list_task_id_check_list_id_key" UNIQUE("task_id","check_list_id")
);

-- ============================================
-- DWS (Dispatch Work Schedule) TABLES
-- ============================================

-- Shift Codes Table
CREATE TABLE "shift_codes" (
	"shift_code_id" serial PRIMARY KEY,
	"shift_code" varchar(10) NOT NULL CONSTRAINT "shift_codes_shift_code_key" UNIQUE,
	"shift_name" varchar(100) NOT NULL,
	"start_time" time NOT NULL,
	"end_time" time NOT NULL,
	"duration_hours" numeric(4, 2),
	"color_code" varchar(7),
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP
);

-- Shift Assignments Table
CREATE TABLE "shift_assignments" (
	"assignment_id" serial PRIMARY KEY,
	"staff_id" integer,
	"store_id" integer,
	"shift_date" date NOT NULL,
	"shift_code_id" integer,
	"status" varchar(20) DEFAULT 'assigned',
	"notes" text,
	"assigned_by" integer,
	"assigned_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "shift_assignments_staff_id_shift_date_shift_code_id_key" UNIQUE("staff_id","shift_date","shift_code_id")
);

-- ============================================
-- NOTIFICATIONS TABLE
-- ============================================

-- Notifications Table
CREATE TABLE "notifications" (
	"notification_id" serial PRIMARY KEY,
	"recipient_staff_id" integer,
	"sender_staff_id" integer,
	"notification_type" varchar(50),
	"title" varchar(255) NOT NULL,
	"message" text,
	"link_url" text,
	"is_read" boolean DEFAULT false,
	"read_at" timestamp,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- FOREIGN KEY CONSTRAINTS
-- ============================================

-- Stores Foreign Keys
ALTER TABLE "stores" ADD CONSTRAINT "stores_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "regions"("region_id") ON DELETE SET NULL;
ALTER TABLE "stores" ADD CONSTRAINT "fk_manager" FOREIGN KEY ("manager_id") REFERENCES "staff"("staff_id") ON DELETE SET NULL;

-- Staff Foreign Keys
ALTER TABLE "staff" ADD CONSTRAINT "staff_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "stores"("store_id") ON DELETE SET NULL;
ALTER TABLE "staff" ADD CONSTRAINT "staff_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("department_id") ON DELETE SET NULL;

-- Tasks Foreign Keys
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_manual_id_fkey" FOREIGN KEY ("manual_id") REFERENCES "manuals"("manual_id") ON DELETE SET NULL;
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_task_type_id_fkey" FOREIGN KEY ("task_type_id") REFERENCES "code_master"("code_master_id");
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_response_type_id_fkey" FOREIGN KEY ("response_type_id") REFERENCES "code_master"("code_master_id");
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_dept_id_fkey" FOREIGN KEY ("dept_id") REFERENCES "departments"("department_id") ON DELETE SET NULL;
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_assigned_store_id_fkey" FOREIGN KEY ("assigned_store_id") REFERENCES "stores"("store_id") ON DELETE SET NULL;
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_assigned_staff_id_fkey" FOREIGN KEY ("assigned_staff_id") REFERENCES "staff"("staff_id") ON DELETE SET NULL;
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_do_staff_id_fkey" FOREIGN KEY ("do_staff_id") REFERENCES "staff"("staff_id") ON DELETE SET NULL;
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "code_master"("code_master_id");
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_created_staff_id_fkey" FOREIGN KEY ("created_staff_id") REFERENCES "staff"("staff_id");

-- Task Check List Foreign Keys
ALTER TABLE "task_check_list" ADD CONSTRAINT "task_check_list_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "tasks"("task_id") ON DELETE CASCADE;
ALTER TABLE "task_check_list" ADD CONSTRAINT "task_check_list_check_list_id_fkey" FOREIGN KEY ("check_list_id") REFERENCES "check_lists"("check_list_id") ON DELETE CASCADE;
ALTER TABLE "task_check_list" ADD CONSTRAINT "task_check_list_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "staff"("staff_id");

-- Shift Assignments Foreign Keys
ALTER TABLE "shift_assignments" ADD CONSTRAINT "shift_assignments_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "staff"("staff_id") ON DELETE CASCADE;
ALTER TABLE "shift_assignments" ADD CONSTRAINT "shift_assignments_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "stores"("store_id");
ALTER TABLE "shift_assignments" ADD CONSTRAINT "shift_assignments_shift_code_id_fkey" FOREIGN KEY ("shift_code_id") REFERENCES "shift_codes"("shift_code_id");
ALTER TABLE "shift_assignments" ADD CONSTRAINT "shift_assignments_assigned_by_fkey" FOREIGN KEY ("assigned_by") REFERENCES "staff"("staff_id");

-- Notifications Foreign Keys
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_recipient_staff_id_fkey" FOREIGN KEY ("recipient_staff_id") REFERENCES "staff"("staff_id") ON DELETE CASCADE;
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_sender_staff_id_fkey" FOREIGN KEY ("sender_staff_id") REFERENCES "staff"("staff_id") ON DELETE SET NULL;

-- ============================================
-- INDEXES
-- ============================================

-- Staff Indexes
CREATE INDEX IF NOT EXISTS "idx_staff_store" ON "staff" ("store_id");
CREATE INDEX IF NOT EXISTS "idx_staff_email" ON "staff" ("email");

-- Tasks Indexes
CREATE INDEX IF NOT EXISTS "idx_tasks_status" ON "tasks" ("status_id");
CREATE INDEX IF NOT EXISTS "idx_tasks_assigned_staff" ON "tasks" ("assigned_staff_id");
CREATE INDEX IF NOT EXISTS "idx_tasks_assigned_store" ON "tasks" ("assigned_store_id");
CREATE INDEX IF NOT EXISTS "idx_tasks_dates" ON "tasks" ("start_date", "end_date");

-- Shift Assignments Indexes
CREATE INDEX IF NOT EXISTS "idx_shift_assignments_staff" ON "shift_assignments" ("staff_id");
CREATE INDEX IF NOT EXISTS "idx_shift_assignments_date" ON "shift_assignments" ("shift_date");
CREATE INDEX IF NOT EXISTS "idx_shift_assignments_store" ON "shift_assignments" ("store_id");

-- Notifications Indexes
CREATE INDEX IF NOT EXISTS "idx_notifications_recipient" ON "notifications" ("recipient_staff_id", "is_read");

-- ============================================
-- INITIAL DATA - Code Master Values
-- ============================================

-- Task Status Codes (status_id: 7-11)
INSERT INTO "code_master" ("code_master_id", "code_type", "code", "name", "sort_order") VALUES
(7, 'status', 'NOT_YET', 'Not Yet', 1),
(8, 'status', 'ON_PROGRESS', 'On Progress', 2),
(9, 'status', 'DONE', 'Done', 3),
(10, 'status', 'OVERDUE', 'Overdue', 4),
(11, 'status', 'REJECT', 'Reject', 5)
ON CONFLICT (code_type, code) DO UPDATE SET name = EXCLUDED.name, sort_order = EXCLUDED.sort_order;

-- Task Type Codes (task_type_id: 1-3)
INSERT INTO "code_master" ("code_master_id", "code_type", "code", "name", "sort_order") VALUES
(1, 'task_type', 'STATISTICS', 'Statistics', 1),
(2, 'task_type', 'ARRANGE', 'Arrange', 2),
(3, 'task_type', 'PREPARE', 'Prepare', 3)
ON CONFLICT (code_type, code) DO UPDATE SET name = EXCLUDED.name, sort_order = EXCLUDED.sort_order;

-- Response Type Codes (response_type_id: 4-6)
INSERT INTO "code_master" ("code_master_id", "code_type", "code", "name", "sort_order") VALUES
(4, 'response_type', 'PICTURE', 'Picture', 1),
(5, 'response_type', 'CHECKLIST', 'Checklist', 2),
(6, 'response_type', 'YESNO', 'Yes/No', 3)
ON CONFLICT (code_type, code) DO UPDATE SET name = EXCLUDED.name, sort_order = EXCLUDED.sort_order;

-- Reset sequences to correct values
SELECT setval('code_master_code_master_id_seq', (SELECT MAX(code_master_id) FROM code_master));

-- ============================================
-- COMMENTS (for documentation)
-- ============================================

COMMENT ON TABLE "regions" IS 'Geographic regions for store grouping';
COMMENT ON TABLE "stores" IS 'Store locations and details';
COMMENT ON TABLE "departments" IS 'Organizational departments';
COMMENT ON TABLE "staff" IS 'Employees and staff members';
COMMENT ON TABLE "code_master" IS 'Master lookup table for various code types (status, task_type, response_type)';
COMMENT ON TABLE "manuals" IS 'Task manuals and documentation';
COMMENT ON TABLE "tasks" IS 'Work schedule tasks and assignments (WS module)';
COMMENT ON TABLE "check_lists" IS 'Checklist items library';
COMMENT ON TABLE "task_check_list" IS 'Many-to-many relationship between tasks and checklists';
COMMENT ON TABLE "shift_codes" IS 'Shift type definitions - V8.6, V8.14, OFF, etc. (DWS module)';
COMMENT ON TABLE "shift_assignments" IS 'Staff shift schedule assignments (DWS module)';
COMMENT ON TABLE "notifications" IS 'System notifications for staff';

-- ============================================
-- DONE
-- ============================================
-- Schema recreation complete!
-- All tables have been dropped and recreated with the latest structure.
