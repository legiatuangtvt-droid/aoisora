-- ============================================
-- FULL DATABASE RESET - Version 0.2.0
-- Import this file to phpMyAdmin to reset entire database
-- Created: 2026-01-22
-- Database: auraorie68aa_aoisora
--
-- CHANGES from v0.1.0:
-- - Added zones table (6 zones)
-- - Added areas table (15 areas)
-- - Added refresh_tokens table (Double Token System)
-- - Added staff_assignments table (Acting Positions)
-- - Added area_id to stores table
-- - Added region_id, zone_id, area_id to staff table
-- - Added is_active, sort_order to regions table
-- ============================================

-- Select database (production)
USE `auraorie68aa_aoisora`;

-- Disable foreign key checks during import
SET FOREIGN_KEY_CHECKS = 0;
SET NAMES utf8mb4;

-- ============================================
-- DROP ALL EXISTING TABLES (reverse order of dependencies)
-- ============================================

DROP TABLE IF EXISTS `task_likes`;
DROP TABLE IF EXISTS `task_comments`;
DROP TABLE IF EXISTS `task_images`;
DROP TABLE IF EXISTS `task_staff_results`;
DROP TABLE IF EXISTS `task_store_results`;
DROP TABLE IF EXISTS `task_workflow_steps`;
DROP TABLE IF EXISTS `manual_view_logs`;
DROP TABLE IF EXISTS `manual_media`;
DROP TABLE IF EXISTS `manual_steps`;
DROP TABLE IF EXISTS `manual_documents`;
DROP TABLE IF EXISTS `manual_folders`;
DROP TABLE IF EXISTS `notifications`;
DROP TABLE IF EXISTS `daily_schedule_tasks`;
DROP TABLE IF EXISTS `daily_templates`;
DROP TABLE IF EXISTS `task_library`;
DROP TABLE IF EXISTS `shift_templates`;
DROP TABLE IF EXISTS `shift_assignments`;
DROP TABLE IF EXISTS `shift_codes`;
DROP TABLE IF EXISTS `task_groups`;
DROP TABLE IF EXISTS `task_check_list`;
DROP TABLE IF EXISTS `check_lists`;
DROP TABLE IF EXISTS `tasks`;
DROP TABLE IF EXISTS `manuals`;
DROP TABLE IF EXISTS `code_master`;
DROP TABLE IF EXISTS `staff_assignments`;
DROP TABLE IF EXISTS `refresh_tokens`;
DROP TABLE IF EXISTS `personal_access_tokens`;
DROP TABLE IF EXISTS `password_reset_tokens`;
DROP TABLE IF EXISTS `staff`;
DROP TABLE IF EXISTS `teams`;
DROP TABLE IF EXISTS `stores`;
DROP TABLE IF EXISTS `areas`;
DROP TABLE IF EXISTS `zones`;
DROP TABLE IF EXISTS `departments`;
DROP TABLE IF EXISTS `regions`;
DROP TABLE IF EXISTS `model_has_permissions`;
DROP TABLE IF EXISTS `model_has_roles`;
DROP TABLE IF EXISTS `role_has_permissions`;
DROP TABLE IF EXISTS `permissions`;
DROP TABLE IF EXISTS `roles`;

-- ============================================
-- CORE TABLES
-- ============================================

-- Regions Table (v0.2.0: added is_active, sort_order)
CREATE TABLE `regions` (
    `region_id` INT AUTO_INCREMENT PRIMARY KEY,
    `region_name` VARCHAR(255) NOT NULL,
    `region_code` VARCHAR(50) UNIQUE,
    `description` TEXT,
    `is_active` TINYINT(1) DEFAULT 1,
    `sort_order` INT DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Zones Table (NEW in v0.2.0)
CREATE TABLE `zones` (
    `zone_id` INT AUTO_INCREMENT PRIMARY KEY,
    `zone_name` VARCHAR(255) NOT NULL,
    `zone_code` VARCHAR(50) UNIQUE,
    `region_id` INT NOT NULL,
    `description` TEXT,
    `is_active` TINYINT(1) DEFAULT 1,
    `sort_order` INT DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_zones_region` FOREIGN KEY (`region_id`) REFERENCES `regions`(`region_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Areas Table (NEW in v0.2.0)
CREATE TABLE `areas` (
    `area_id` INT AUTO_INCREMENT PRIMARY KEY,
    `area_name` VARCHAR(255) NOT NULL,
    `area_code` VARCHAR(50) UNIQUE,
    `zone_id` INT NOT NULL,
    `description` TEXT,
    `is_active` TINYINT(1) DEFAULT 1,
    `sort_order` INT DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_areas_zone` FOREIGN KEY (`zone_id`) REFERENCES `zones`(`zone_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Departments Table
CREATE TABLE `departments` (
    `department_id` INT AUTO_INCREMENT PRIMARY KEY,
    `department_name` VARCHAR(255) NOT NULL,
    `department_code` VARCHAR(50) UNIQUE,
    `description` TEXT,
    `parent_id` INT NULL,
    `sort_order` INT DEFAULT 0,
    `icon` VARCHAR(50),
    `icon_color` VARCHAR(20),
    `icon_bg` VARCHAR(50),
    `is_active` TINYINT(1) DEFAULT 1,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_departments_parent` FOREIGN KEY (`parent_id`) REFERENCES `departments`(`department_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Teams Table
CREATE TABLE `teams` (
    `team_id` VARCHAR(50) PRIMARY KEY,
    `team_name` VARCHAR(255) NOT NULL,
    `department_id` INT NULL,
    `icon` VARCHAR(50),
    `icon_color` VARCHAR(20),
    `icon_bg` VARCHAR(50),
    `sort_order` INT DEFAULT 0,
    `is_active` TINYINT(1) DEFAULT 1,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_teams_department` FOREIGN KEY (`department_id`) REFERENCES `departments`(`department_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Stores Table (v0.2.0: added area_id)
CREATE TABLE `stores` (
    `store_id` INT AUTO_INCREMENT PRIMARY KEY,
    `store_name` VARCHAR(255) NOT NULL,
    `store_code` VARCHAR(50) UNIQUE,
    `region_id` INT NULL,
    `area_id` INT NULL,
    `address` TEXT,
    `phone` VARCHAR(20),
    `email` VARCHAR(100),
    `manager_id` INT NULL,
    `status` VARCHAR(20) DEFAULT 'active',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_stores_region` FOREIGN KEY (`region_id`) REFERENCES `regions`(`region_id`) ON DELETE SET NULL,
    CONSTRAINT `fk_stores_area` FOREIGN KEY (`area_id`) REFERENCES `areas`(`area_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Staff Table (v0.2.0: added region_id, zone_id, area_id for geographic scope)
CREATE TABLE `staff` (
    `staff_id` INT AUTO_INCREMENT PRIMARY KEY,
    `staff_name` VARCHAR(255) NOT NULL,
    `staff_code` VARCHAR(50) UNIQUE,
    `username` VARCHAR(100) UNIQUE NOT NULL,
    `email` VARCHAR(100) UNIQUE,
    `google_id` VARCHAR(255) UNIQUE NULL,
    `phone` VARCHAR(20),
    `store_id` INT NULL,
    `region_id` INT NULL,
    `zone_id` INT NULL,
    `area_id` INT NULL,
    `department_id` INT NULL,
    `team_id` VARCHAR(50) NULL,
    `role` VARCHAR(50) DEFAULT 'STAFF',
    `position` VARCHAR(100),
    `job_grade` VARCHAR(10),
    `sap_code` VARCHAR(20),
    `avatar_url` VARCHAR(500),
    `line_manager_id` INT NULL,
    `joining_date` DATE,
    `password_hash` VARCHAR(255) NOT NULL,
    `status` VARCHAR(20) DEFAULT 'active',
    `is_active` TINYINT(1) DEFAULT 1,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_staff_store` FOREIGN KEY (`store_id`) REFERENCES `stores`(`store_id`) ON DELETE SET NULL,
    CONSTRAINT `fk_staff_department` FOREIGN KEY (`department_id`) REFERENCES `departments`(`department_id`) ON DELETE SET NULL,
    CONSTRAINT `fk_staff_team` FOREIGN KEY (`team_id`) REFERENCES `teams`(`team_id`) ON DELETE SET NULL,
    CONSTRAINT `fk_staff_region` FOREIGN KEY (`region_id`) REFERENCES `regions`(`region_id`) ON DELETE SET NULL,
    CONSTRAINT `fk_staff_zone` FOREIGN KEY (`zone_id`) REFERENCES `zones`(`zone_id`) ON DELETE SET NULL,
    CONSTRAINT `fk_staff_area` FOREIGN KEY (`area_id`) REFERENCES `areas`(`area_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add self-referencing FK after table creation
ALTER TABLE `staff` ADD CONSTRAINT `fk_staff_line_manager`
    FOREIGN KEY (`line_manager_id`) REFERENCES `staff`(`staff_id`) ON DELETE SET NULL;

-- Add manager FK to stores
ALTER TABLE `stores` ADD CONSTRAINT `fk_stores_manager`
    FOREIGN KEY (`manager_id`) REFERENCES `staff`(`staff_id`) ON DELETE SET NULL;

-- Sanctum Personal Access Tokens
CREATE TABLE `personal_access_tokens` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `tokenable_type` VARCHAR(255) NOT NULL,
    `tokenable_id` BIGINT UNSIGNED NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `token` VARCHAR(64) UNIQUE NOT NULL,
    `abilities` TEXT,
    `last_used_at` TIMESTAMP NULL,
    `expires_at` TIMESTAMP NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_personal_access_tokens_tokenable` (`tokenable_type`, `tokenable_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Password Reset Tokens
CREATE TABLE `password_reset_tokens` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `email` VARCHAR(100) NOT NULL,
    `token` VARCHAR(10) NOT NULL,
    `used` TINYINT(1) DEFAULT 0,
    `is_valid` TINYINT(1) DEFAULT 1,
    `expires_at` TIMESTAMP NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_password_reset_tokens_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Refresh Tokens Table (NEW in v0.2.0 - Double Token System)
CREATE TABLE `refresh_tokens` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `staff_id` INT NOT NULL,
    `token_hash` VARCHAR(64) NOT NULL,
    `family_id` CHAR(36) NOT NULL,
    `expires_at` TIMESTAMP NOT NULL,
    `revoked_at` TIMESTAMP NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_token_hash` (`token_hash`),
    INDEX `idx_staff_id` (`staff_id`),
    INDEX `idx_family_id` (`family_id`),
    INDEX `idx_expires_at` (`expires_at`),
    CONSTRAINT `fk_refresh_tokens_staff` FOREIGN KEY (`staff_id`) REFERENCES `staff`(`staff_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Staff Assignments Table (NEW in v0.2.0 - Acting Positions)
CREATE TABLE `staff_assignments` (
    `assignment_id` INT AUTO_INCREMENT PRIMARY KEY,
    `staff_id` INT NOT NULL,
    `assignment_type` ENUM('primary', 'acting') NOT NULL DEFAULT 'primary',
    `scope_type` ENUM('region', 'zone', 'area', 'store') NOT NULL,
    `scope_id` INT NOT NULL,
    `effective_grade` VARCHAR(10) NULL,
    `start_date` DATE NULL,
    `end_date` DATE NULL,
    `is_active` TINYINT(1) DEFAULT 1,
    `notes` TEXT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `created_by` INT NULL,
    FOREIGN KEY (`staff_id`) REFERENCES `staff`(`staff_id`) ON DELETE CASCADE,
    INDEX `idx_staff_id` (`staff_id`),
    INDEX `idx_scope` (`scope_type`, `scope_id`),
    INDEX `idx_active` (`is_active`),
    INDEX `idx_effective_date` (`start_date`, `end_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Code Master Table
CREATE TABLE `code_master` (
    `code_master_id` INT AUTO_INCREMENT PRIMARY KEY,
    `code_type` VARCHAR(50) NOT NULL,
    `code` VARCHAR(50) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT,
    `sort_order` INT DEFAULT 0,
    `is_active` TINYINT(1) DEFAULT 1,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY `code_master_code_type_code_key` (`code_type`, `code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- WS (WORK SCHEDULE) TABLES
-- ============================================

-- Manuals Table (Legacy)
CREATE TABLE `manuals` (
    `manual_id` INT AUTO_INCREMENT PRIMARY KEY,
    `manual_name` VARCHAR(255) NOT NULL,
    `manual_url` TEXT,
    `description` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tasks Table
CREATE TABLE `tasks` (
    `task_id` INT AUTO_INCREMENT PRIMARY KEY,
    `parent_task_id` INT NULL,
    `task_level` TINYINT DEFAULT 1,
    `source` ENUM('task_list', 'library', 'todo_task') DEFAULT 'task_list',
    `receiver_type` ENUM('store', 'hq_user') DEFAULT 'store',
    `task_name` VARCHAR(500) NOT NULL,
    `task_description` TEXT,
    `manual_id` INT NULL,
    `task_type_id` INT NULL,
    `response_type_id` INT NULL,
    `response_num` INT,
    `is_repeat` TINYINT(1) DEFAULT 0,
    `repeat_config` JSON,
    `dept_id` INT NULL,
    `assigned_store_id` INT NULL,
    `assigned_staff_id` INT NULL,
    `do_staff_id` INT NULL,
    `status_id` INT NULL,
    `priority` VARCHAR(20) DEFAULT 'normal',
    `start_date` DATE,
    `end_date` DATE,
    `start_time` TIME,
    `due_datetime` TIMESTAMP NULL,
    `completed_time` TIMESTAMP NULL,
    `comment` TEXT,
    `attachments` JSON,
    `created_staff_id` INT NULL,
    `approver_id` INT NULL,
    `rejection_count` INT DEFAULT 0,
    `has_changes_since_rejection` TINYINT(1) DEFAULT 0,
    `last_rejection_reason` TEXT NULL,
    `last_rejected_at` TIMESTAMP NULL,
    `last_rejected_by` INT NULL,
    `library_task_id` INT NULL,
    `submitted_at` TIMESTAMP NULL,
    `approved_at` TIMESTAMP NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_tasks_manual` FOREIGN KEY (`manual_id`) REFERENCES `manuals`(`manual_id`) ON DELETE SET NULL,
    CONSTRAINT `fk_tasks_task_type` FOREIGN KEY (`task_type_id`) REFERENCES `code_master`(`code_master_id`),
    CONSTRAINT `fk_tasks_response_type` FOREIGN KEY (`response_type_id`) REFERENCES `code_master`(`code_master_id`),
    CONSTRAINT `fk_tasks_dept` FOREIGN KEY (`dept_id`) REFERENCES `departments`(`department_id`) ON DELETE SET NULL,
    CONSTRAINT `fk_tasks_assigned_store` FOREIGN KEY (`assigned_store_id`) REFERENCES `stores`(`store_id`) ON DELETE SET NULL,
    CONSTRAINT `fk_tasks_assigned_staff` FOREIGN KEY (`assigned_staff_id`) REFERENCES `staff`(`staff_id`) ON DELETE SET NULL,
    CONSTRAINT `fk_tasks_do_staff` FOREIGN KEY (`do_staff_id`) REFERENCES `staff`(`staff_id`) ON DELETE SET NULL,
    CONSTRAINT `fk_tasks_status` FOREIGN KEY (`status_id`) REFERENCES `code_master`(`code_master_id`),
    CONSTRAINT `fk_tasks_created_staff` FOREIGN KEY (`created_staff_id`) REFERENCES `staff`(`staff_id`),
    CONSTRAINT `fk_tasks_approver` FOREIGN KEY (`approver_id`) REFERENCES `staff`(`staff_id`) ON DELETE SET NULL,
    CONSTRAINT `fk_tasks_last_rejected_by` FOREIGN KEY (`last_rejected_by`) REFERENCES `staff`(`staff_id`) ON DELETE SET NULL,
    CONSTRAINT `fk_tasks_parent` FOREIGN KEY (`parent_task_id`) REFERENCES `tasks`(`task_id`) ON DELETE CASCADE,
    INDEX `idx_tasks_source_status_created` (`source`, `status_id`, `created_staff_id`),
    INDEX `idx_tasks_approver_status` (`approver_id`, `status_id`),
    INDEX `idx_tasks_parent` (`parent_task_id`),
    INDEX `idx_tasks_level` (`task_level`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Check Lists Table
CREATE TABLE `check_lists` (
    `check_list_id` INT AUTO_INCREMENT PRIMARY KEY,
    `check_list_name` VARCHAR(500) NOT NULL,
    `description` TEXT,
    `is_active` TINYINT(1) DEFAULT 1,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Task Check List Junction Table
CREATE TABLE `task_check_list` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `task_id` INT NULL,
    `check_list_id` INT NULL,
    `check_status` TINYINT(1) DEFAULT 0,
    `completed_at` TIMESTAMP NULL,
    `completed_by` INT NULL,
    `notes` TEXT,
    UNIQUE KEY `task_check_list_unique` (`task_id`, `check_list_id`),
    CONSTRAINT `fk_task_check_list_task` FOREIGN KEY (`task_id`) REFERENCES `tasks`(`task_id`) ON DELETE CASCADE,
    CONSTRAINT `fk_task_check_list_checklist` FOREIGN KEY (`check_list_id`) REFERENCES `check_lists`(`check_list_id`) ON DELETE CASCADE,
    CONSTRAINT `fk_task_check_list_completed_by` FOREIGN KEY (`completed_by`) REFERENCES `staff`(`staff_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- DWS (DISPATCH WORK SCHEDULE) TABLES
-- ============================================

-- Task Groups Table
CREATE TABLE `task_groups` (
    `group_id` VARCHAR(20) PRIMARY KEY,
    `group_code` VARCHAR(20) NOT NULL,
    `group_name` VARCHAR(100) NOT NULL,
    `priority` INT DEFAULT 50,
    `sort_order` INT DEFAULT 0,
    `color_bg` VARCHAR(20) DEFAULT '#f3f4f6',
    `color_text` VARCHAR(20) DEFAULT '#374151',
    `color_border` VARCHAR(20) DEFAULT '#9ca3af',
    `is_active` TINYINT(1) DEFAULT 1,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Shift Codes Table
CREATE TABLE `shift_codes` (
    `shift_code_id` INT AUTO_INCREMENT PRIMARY KEY,
    `shift_code` VARCHAR(20) NOT NULL UNIQUE,
    `shift_name` VARCHAR(100) NOT NULL,
    `start_time` TIME NOT NULL,
    `end_time` TIME NOT NULL,
    `total_hours` DECIMAL(4,2) DEFAULT 8.0,
    `shift_type` VARCHAR(20) DEFAULT 'regular',
    `break_minutes` INT DEFAULT 60,
    `color_code` VARCHAR(7),
    `is_active` TINYINT(1) DEFAULT 1,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Shift Templates Table
CREATE TABLE `shift_templates` (
    `template_id` INT AUTO_INCREMENT PRIMARY KEY,
    `template_name` VARCHAR(100) NOT NULL,
    `description` TEXT,
    `shift_pattern` JSON,
    `is_active` TINYINT(1) DEFAULT 1,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Shift Assignments Table
CREATE TABLE `shift_assignments` (
    `assignment_id` INT AUTO_INCREMENT PRIMARY KEY,
    `staff_id` INT NULL,
    `store_id` INT NULL,
    `shift_date` DATE NOT NULL,
    `shift_code_id` INT NULL,
    `status` VARCHAR(20) DEFAULT 'assigned',
    `notes` TEXT,
    `assigned_by` INT NULL,
    `assigned_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY `shift_assignments_unique` (`staff_id`, `shift_date`, `shift_code_id`),
    CONSTRAINT `fk_shift_assignments_staff` FOREIGN KEY (`staff_id`) REFERENCES `staff`(`staff_id`) ON DELETE CASCADE,
    CONSTRAINT `fk_shift_assignments_store` FOREIGN KEY (`store_id`) REFERENCES `stores`(`store_id`),
    CONSTRAINT `fk_shift_assignments_shift_code` FOREIGN KEY (`shift_code_id`) REFERENCES `shift_codes`(`shift_code_id`),
    CONSTRAINT `fk_shift_assignments_assigned_by` FOREIGN KEY (`assigned_by`) REFERENCES `staff`(`staff_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Task Library Table
CREATE TABLE `task_library` (
    `task_lib_id` INT AUTO_INCREMENT PRIMARY KEY,
    `task_code` VARCHAR(20) NOT NULL UNIQUE,
    `task_name` VARCHAR(255) NOT NULL,
    `group_id` VARCHAR(20) NULL,
    `duration_minutes` INT DEFAULT 15,
    `description` TEXT,
    `is_active` TINYINT(1) DEFAULT 1,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_task_library_group` FOREIGN KEY (`group_id`) REFERENCES `task_groups`(`group_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Daily Templates Table
CREATE TABLE `daily_templates` (
    `template_id` INT AUTO_INCREMENT PRIMARY KEY,
    `template_name` VARCHAR(100) NOT NULL,
    `description` TEXT,
    `template_data` JSON,
    `applied_stores` JSON,
    `is_active` TINYINT(1) DEFAULT 1,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Daily Schedule Tasks Table
CREATE TABLE `daily_schedule_tasks` (
    `schedule_task_id` INT AUTO_INCREMENT PRIMARY KEY,
    `staff_id` INT NULL,
    `store_id` INT NULL,
    `schedule_date` DATE NOT NULL,
    `group_id` VARCHAR(20) NULL,
    `task_code` VARCHAR(20),
    `task_name` VARCHAR(255) NOT NULL,
    `start_time` TIME NOT NULL,
    `end_time` TIME NOT NULL,
    `status` INT DEFAULT 1,
    `completed_at` TIMESTAMP NULL,
    `notes` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_daily_schedule_staff` FOREIGN KEY (`staff_id`) REFERENCES `staff`(`staff_id`) ON DELETE CASCADE,
    CONSTRAINT `fk_daily_schedule_store` FOREIGN KEY (`store_id`) REFERENCES `stores`(`store_id`),
    CONSTRAINT `fk_daily_schedule_group` FOREIGN KEY (`group_id`) REFERENCES `task_groups`(`group_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- MANUAL (KNOWLEDGE BASE) TABLES
-- ============================================

-- Manual Folders Table
CREATE TABLE `manual_folders` (
    `folder_id` INT AUTO_INCREMENT PRIMARY KEY,
    `folder_name` VARCHAR(255) NOT NULL,
    `parent_id` INT NULL,
    `description` TEXT,
    `icon` VARCHAR(50),
    `sort_order` INT DEFAULT 0,
    `display_order` INT DEFAULT 0,
    `is_active` TINYINT(1) DEFAULT 1,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_manual_folders_parent` FOREIGN KEY (`parent_id`) REFERENCES `manual_folders`(`folder_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Manual Documents Table
CREATE TABLE `manual_documents` (
    `document_id` INT AUTO_INCREMENT PRIMARY KEY,
    `folder_id` INT NULL,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT,
    `version` VARCHAR(20) DEFAULT '1.0',
    `status` VARCHAR(20) DEFAULT 'draft',
    `tags` JSON,
    `created_by` INT NULL,
    `updated_by` INT NULL,
    `published_at` TIMESTAMP NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_manual_documents_folder` FOREIGN KEY (`folder_id`) REFERENCES `manual_folders`(`folder_id`) ON DELETE SET NULL,
    CONSTRAINT `fk_manual_documents_created_by` FOREIGN KEY (`created_by`) REFERENCES `staff`(`staff_id`),
    CONSTRAINT `fk_manual_documents_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `staff`(`staff_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Manual Steps Table
CREATE TABLE `manual_steps` (
    `step_id` INT AUTO_INCREMENT PRIMARY KEY,
    `document_id` INT NULL,
    `step_number` INT NOT NULL,
    `title` VARCHAR(255),
    `content` TEXT,
    `tips` TEXT,
    `warnings` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_manual_steps_document` FOREIGN KEY (`document_id`) REFERENCES `manual_documents`(`document_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Manual Media Table
CREATE TABLE `manual_media` (
    `media_id` INT AUTO_INCREMENT PRIMARY KEY,
    `step_id` INT NULL,
    `document_id` INT NULL,
    `media_type` VARCHAR(20) NOT NULL,
    `file_path` TEXT NOT NULL,
    `file_name` VARCHAR(255),
    `file_size` INT,
    `mime_type` VARCHAR(100),
    `alt_text` VARCHAR(255),
    `sort_order` INT DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_manual_media_step` FOREIGN KEY (`step_id`) REFERENCES `manual_steps`(`step_id`) ON DELETE CASCADE,
    CONSTRAINT `fk_manual_media_document` FOREIGN KEY (`document_id`) REFERENCES `manual_documents`(`document_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Manual View Logs Table
CREATE TABLE `manual_view_logs` (
    `log_id` INT AUTO_INCREMENT PRIMARY KEY,
    `document_id` INT NULL,
    `staff_id` INT NULL,
    `viewed_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `duration_seconds` INT,
    CONSTRAINT `fk_manual_view_logs_document` FOREIGN KEY (`document_id`) REFERENCES `manual_documents`(`document_id`) ON DELETE CASCADE,
    CONSTRAINT `fk_manual_view_logs_staff` FOREIGN KEY (`staff_id`) REFERENCES `staff`(`staff_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TASK DETAIL TABLES
-- ============================================

-- Task Workflow Steps Table
CREATE TABLE `task_workflow_steps` (
    `step_id` INT AUTO_INCREMENT PRIMARY KEY,
    `task_id` INT NULL,
    `step_number` INT NOT NULL,
    `step_name` VARCHAR(50) NOT NULL,
    `status` VARCHAR(20) DEFAULT 'pending',
    `assignee_id` INT NULL,
    `skip_info` VARCHAR(255),
    `start_date` DATE,
    `end_date` DATE,
    `comment` TEXT,
    `completed_at` TIMESTAMP NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_task_workflow_steps_task` FOREIGN KEY (`task_id`) REFERENCES `tasks`(`task_id`) ON DELETE CASCADE,
    CONSTRAINT `fk_task_workflow_steps_assignee` FOREIGN KEY (`assignee_id`) REFERENCES `staff`(`staff_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Task Store Results Table
CREATE TABLE `task_store_results` (
    `result_id` INT AUTO_INCREMENT PRIMARY KEY,
    `task_id` INT NULL,
    `store_id` INT NULL,
    `status` VARCHAR(20) DEFAULT 'not_started',
    `start_time` TIMESTAMP NULL,
    `completed_time` TIMESTAMP NULL,
    `completed_by_id` INT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_task_store_results_task` FOREIGN KEY (`task_id`) REFERENCES `tasks`(`task_id`) ON DELETE CASCADE,
    CONSTRAINT `fk_task_store_results_store` FOREIGN KEY (`store_id`) REFERENCES `stores`(`store_id`) ON DELETE CASCADE,
    CONSTRAINT `fk_task_store_results_completed_by` FOREIGN KEY (`completed_by_id`) REFERENCES `staff`(`staff_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Task Staff Results Table
CREATE TABLE `task_staff_results` (
    `result_id` INT AUTO_INCREMENT PRIMARY KEY,
    `task_id` INT NULL,
    `staff_id` INT NULL,
    `store_id` INT NULL,
    `status` VARCHAR(20) DEFAULT 'not_started',
    `progress` INT DEFAULT 0,
    `progress_text` VARCHAR(50),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_task_staff_results_task` FOREIGN KEY (`task_id`) REFERENCES `tasks`(`task_id`) ON DELETE CASCADE,
    CONSTRAINT `fk_task_staff_results_staff` FOREIGN KEY (`staff_id`) REFERENCES `staff`(`staff_id`) ON DELETE CASCADE,
    CONSTRAINT `fk_task_staff_results_store` FOREIGN KEY (`store_id`) REFERENCES `stores`(`store_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Task Images Table
CREATE TABLE `task_images` (
    `image_id` INT AUTO_INCREMENT PRIMARY KEY,
    `task_id` INT NULL,
    `store_result_id` INT NULL,
    `staff_result_id` INT NULL,
    `title` VARCHAR(255),
    `image_url` TEXT NOT NULL,
    `thumbnail_url` TEXT,
    `uploaded_by_id` INT NULL,
    `is_completed` TINYINT(1) DEFAULT 0,
    `uploaded_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_task_images_task` FOREIGN KEY (`task_id`) REFERENCES `tasks`(`task_id`) ON DELETE CASCADE,
    CONSTRAINT `fk_task_images_store_result` FOREIGN KEY (`store_result_id`) REFERENCES `task_store_results`(`result_id`) ON DELETE CASCADE,
    CONSTRAINT `fk_task_images_staff_result` FOREIGN KEY (`staff_result_id`) REFERENCES `task_staff_results`(`result_id`) ON DELETE CASCADE,
    CONSTRAINT `fk_task_images_uploaded_by` FOREIGN KEY (`uploaded_by_id`) REFERENCES `staff`(`staff_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Task Comments Table
CREATE TABLE `task_comments` (
    `comment_id` INT AUTO_INCREMENT PRIMARY KEY,
    `task_id` INT NULL,
    `store_result_id` INT NULL,
    `staff_result_id` INT NULL,
    `user_id` INT NULL,
    `content` TEXT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_task_comments_task` FOREIGN KEY (`task_id`) REFERENCES `tasks`(`task_id`) ON DELETE CASCADE,
    CONSTRAINT `fk_task_comments_store_result` FOREIGN KEY (`store_result_id`) REFERENCES `task_store_results`(`result_id`) ON DELETE CASCADE,
    CONSTRAINT `fk_task_comments_staff_result` FOREIGN KEY (`staff_result_id`) REFERENCES `task_staff_results`(`result_id`) ON DELETE CASCADE,
    CONSTRAINT `fk_task_comments_user` FOREIGN KEY (`user_id`) REFERENCES `staff`(`staff_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Task Likes Table
CREATE TABLE `task_likes` (
    `like_id` INT AUTO_INCREMENT PRIMARY KEY,
    `store_result_id` INT NULL,
    `user_id` INT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY `task_likes_unique` (`store_result_id`, `user_id`),
    CONSTRAINT `fk_task_likes_store_result` FOREIGN KEY (`store_result_id`) REFERENCES `task_store_results`(`result_id`) ON DELETE CASCADE,
    CONSTRAINT `fk_task_likes_user` FOREIGN KEY (`user_id`) REFERENCES `staff`(`staff_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- NOTIFICATIONS TABLE
-- ============================================

CREATE TABLE `notifications` (
    `notification_id` INT AUTO_INCREMENT PRIMARY KEY,
    `recipient_staff_id` INT NULL,
    `sender_staff_id` INT NULL,
    `notification_type` VARCHAR(50),
    `title` VARCHAR(255) NOT NULL,
    `message` TEXT,
    `link_url` TEXT,
    `is_read` TINYINT(1) DEFAULT 0,
    `read_at` TIMESTAMP NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_notifications_recipient` FOREIGN KEY (`recipient_staff_id`) REFERENCES `staff`(`staff_id`) ON DELETE CASCADE,
    CONSTRAINT `fk_notifications_sender` FOREIGN KEY (`sender_staff_id`) REFERENCES `staff`(`staff_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX `idx_staff_store` ON `staff` (`store_id`);
CREATE INDEX `idx_staff_department` ON `staff` (`department_id`);
CREATE INDEX `idx_staff_username` ON `staff` (`username`);
CREATE INDEX `idx_staff_status` ON `staff` (`status`);

CREATE INDEX `idx_tasks_status` ON `tasks` (`status_id`);
CREATE INDEX `idx_tasks_assigned_staff` ON `tasks` (`assigned_staff_id`);
CREATE INDEX `idx_tasks_assigned_store` ON `tasks` (`assigned_store_id`);
CREATE INDEX `idx_tasks_dates` ON `tasks` (`start_date`, `end_date`);

CREATE INDEX `idx_shift_assignments_staff` ON `shift_assignments` (`staff_id`);
CREATE INDEX `idx_shift_assignments_date` ON `shift_assignments` (`shift_date`);
CREATE INDEX `idx_shift_assignments_store` ON `shift_assignments` (`store_id`);

CREATE INDEX `idx_daily_schedule_staff` ON `daily_schedule_tasks` (`staff_id`);
CREATE INDEX `idx_daily_schedule_date` ON `daily_schedule_tasks` (`schedule_date`);
CREATE INDEX `idx_daily_schedule_store` ON `daily_schedule_tasks` (`store_id`);
CREATE INDEX `idx_daily_schedule_group` ON `daily_schedule_tasks` (`group_id`);

CREATE INDEX `idx_notifications_recipient` ON `notifications` (`recipient_staff_id`, `is_read`);

CREATE INDEX `idx_manual_documents_folder` ON `manual_documents` (`folder_id`);
CREATE INDEX `idx_manual_steps_document` ON `manual_steps` (`document_id`);
CREATE INDEX `idx_manual_view_logs_document` ON `manual_view_logs` (`document_id`);

CREATE INDEX `idx_task_workflow_steps_task` ON `task_workflow_steps` (`task_id`);
CREATE INDEX `idx_task_store_results_task` ON `task_store_results` (`task_id`);
CREATE INDEX `idx_task_store_results_store` ON `task_store_results` (`store_id`);
CREATE INDEX `idx_task_staff_results_task` ON `task_staff_results` (`task_id`);
CREATE INDEX `idx_task_staff_results_staff` ON `task_staff_results` (`staff_id`);
CREATE INDEX `idx_task_images_store_result` ON `task_images` (`store_result_id`);
CREATE INDEX `idx_task_images_staff_result` ON `task_images` (`staff_result_id`);
CREATE INDEX `idx_task_comments_store_result` ON `task_comments` (`store_result_id`);
CREATE INDEX `idx_task_comments_staff_result` ON `task_comments` (`staff_result_id`);
CREATE INDEX `idx_task_likes_store_result` ON `task_likes` (`store_result_id`);

-- ============================================
-- SEED DATA - Code Master Values
-- ============================================

INSERT INTO `code_master` (`code_master_id`, `code_type`, `code`, `name`, `sort_order`) VALUES
(7, 'status', 'NOT_YET', 'Not Yet', 4),
(8, 'status', 'ON_PROGRESS', 'On Progress', 5),
(9, 'status', 'DONE', 'Done', 6),
(10, 'status', 'OVERDUE', 'Overdue', 3),
(11, 'status', 'REJECT', 'Reject', 7),
(12, 'status', 'DRAFT', 'Draft', 2),
(13, 'status', 'APPROVE', 'Approve', 1);

INSERT INTO `code_master` (`code_master_id`, `code_type`, `code`, `name`, `sort_order`) VALUES
(1, 'task_type', 'STATISTICS', 'Statistics', 1),
(2, 'task_type', 'ARRANGE', 'Arrange', 2),
(3, 'task_type', 'PREPARE', 'Prepare', 3);

INSERT INTO `code_master` (`code_master_id`, `code_type`, `code`, `name`, `sort_order`) VALUES
(4, 'response_type', 'PICTURE', 'Picture', 1),
(5, 'response_type', 'CHECKLIST', 'Checklist', 2),
(6, 'response_type', 'YESNO', 'Yes/No', 3);

-- ============================================
-- SEED DATA - Task Groups
-- ============================================

INSERT INTO `task_groups` (`group_id`, `group_code`, `group_name`, `priority`, `sort_order`, `color_bg`, `color_text`, `color_border`) VALUES
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
-- SEED DATA - Shift Codes
-- ============================================

INSERT INTO `shift_codes` (`shift_code`, `shift_name`, `start_time`, `end_time`, `total_hours`, `shift_type`, `break_minutes`, `color_code`) VALUES
('V8.6', 'Ca sang 6h', '06:00:00', '14:00:00', 8.0, 'morning', 60, '#FFD700'),
('V8.7', 'Ca sang 7h', '07:00:00', '15:00:00', 8.0, 'morning', 60, '#FFA500'),
('V8.8', 'Ca sang 8h', '08:00:00', '16:00:00', 8.0, 'morning', 60, '#FF8C00'),
('V8.14', 'Ca chieu 14h', '14:00:00', '22:00:00', 8.0, 'afternoon', 60, '#87CEEB'),
('V8.14.5', 'Ca chieu 14:30', '14:30:00', '22:30:00', 8.0, 'afternoon', 60, '#00BFFF'),
('V8.15', 'Ca chieu 15h', '15:00:00', '23:00:00', 8.0, 'afternoon', 60, '#1E90FF'),
('OFF', 'Nghi', '00:00:00', '00:00:00', 0.0, 'off', 0, '#D3D3D3'),
('FULL', 'Ca toan thoi gian', '08:00:00', '20:00:00', 12.0, 'full', 90, '#32CD32');

-- ============================================
-- SEED DATA - Regions (v0.2.0: with is_active, sort_order)
-- ============================================

INSERT INTO `regions` (`region_name`, `region_code`, `description`, `is_active`, `sort_order`) VALUES
('Miền Bắc', 'NORTH', 'Khu vực phía Bắc', 1, 1),
('Miền Trung', 'CENTRAL', 'Khu vực miền Trung', 1, 2),
('Miền Nam', 'SOUTH', 'Khu vực phía Nam', 1, 3);

-- ============================================
-- SEED DATA - Zones (NEW in v0.2.0)
-- ============================================

INSERT INTO `zones` (`zone_name`, `zone_code`, `region_id`, `description`, `sort_order`) VALUES
('Hà Nội', 'HN', 1, 'Khu vực Hà Nội và vùng phụ cận', 1),
('Bắc Ninh - Hải Phòng', 'BN-HP', 1, 'Khu vực Bắc Ninh, Hải Dương, Hải Phòng', 2),
('Đà Nẵng', 'DN', 2, 'Khu vực Đà Nẵng và các tỉnh lân cận', 3),
('Huế - Quảng Nam', 'HUE-QN', 2, 'Khu vực Huế và Quảng Nam', 4),
('TP.HCM', 'HCM', 3, 'Khu vực TP. Hồ Chí Minh', 5),
('Bình Dương - Đồng Nai', 'BD-DN', 3, 'Khu vực Bình Dương và Đồng Nai', 6);

-- ============================================
-- SEED DATA - Areas (NEW in v0.2.0)
-- ============================================

INSERT INTO `areas` (`area_name`, `area_code`, `zone_id`, `description`, `sort_order`) VALUES
-- Hà Nội zone (zone_id = 1)
('Quận Long Biên', 'HN-LB', 1, 'Quận Long Biên, Hà Nội', 1),
('Quận Hà Đông', 'HN-HD', 1, 'Quận Hà Đông, Hà Nội', 2),
('Quận Cầu Giấy', 'HN-CG', 1, 'Quận Cầu Giấy, Hà Nội', 3),
-- Bắc Ninh - Hải Phòng zone (zone_id = 2)
('TP. Bắc Ninh', 'BN-TP', 2, 'Thành phố Bắc Ninh', 4),
('Quận Hồng Bàng - Hải Phòng', 'HP-HB', 2, 'Quận Hồng Bàng, Hải Phòng', 5),
-- Đà Nẵng zone (zone_id = 3)
('Quận Hải Châu', 'DN-HC', 3, 'Quận Hải Châu, Đà Nẵng', 6),
('Quận Thanh Khê', 'DN-TK', 3, 'Quận Thanh Khê, Đà Nẵng', 7),
-- Huế - Quảng Nam zone (zone_id = 4)
('TP. Huế', 'HUE-TP', 4, 'Thành phố Huế', 8),
('TP. Hội An', 'QN-HA', 4, 'Thành phố Hội An, Quảng Nam', 9),
-- TP.HCM zone (zone_id = 5)
('Quận Tân Phú', 'HCM-TP', 5, 'Quận Tân Phú, TP.HCM', 10),
('Quận Bình Tân', 'HCM-BT', 5, 'Quận Bình Tân, TP.HCM', 11),
('Quận Gò Vấp', 'HCM-GV', 5, 'Quận Gò Vấp, TP.HCM', 12),
-- Bình Dương - Đồng Nai zone (zone_id = 6)
('TX. Thuận An', 'BD-TA', 6, 'Thị xã Thuận An, Bình Dương', 13),
('TP. Biên Hòa', 'DN-BH', 6, 'Thành phố Biên Hòa, Đồng Nai', 14),
('TX. Dĩ An', 'BD-DA', 6, 'Thị xã Dĩ An, Bình Dương', 15);

-- ============================================
-- SEED DATA - Departments
-- ============================================

INSERT INTO `departments` (`department_name`, `department_code`, `description`, `icon`, `icon_color`, `icon_bg`, `sort_order`) VALUES
('Operation', 'OPE', 'Operation Department', 'Settings', '#3b82f6', '#dbeafe', 1),
('Account', 'ACC', 'Account Department', 'Calculator', '#22c55e', '#dcfce7', 2),
('HR', 'HR', 'Human Resources', 'Users', '#f59e0b', '#fef3c7', 3),
('IT', 'IT', 'Information Technology', 'Monitor', '#8b5cf6', '#ede9fe', 4),
('Marketing', 'MKT', 'Marketing Department', 'Megaphone', '#ec4899', '#fce7f3', 5);

-- ============================================
-- SEED DATA - Teams
-- ============================================

INSERT INTO `teams` (`team_id`, `team_name`, `department_id`, `icon`, `icon_color`, `icon_bg`, `sort_order`) VALUES
('OPE-STORE', 'Store Operations', 1, 'Store', '#3b82f6', '#dbeafe', 1),
('OPE-QC', 'Quality Control', 1, 'CheckCircle', '#22c55e', '#dcfce7', 2),
('ACC-AP', 'Account Payable', 2, 'CreditCard', '#f59e0b', '#fef3c7', 1),
('ACC-AR', 'Account Receivable', 2, 'Wallet', '#22c55e', '#dcfce7', 2),
('HR-RECRUIT', 'Recruitment', 3, 'UserPlus', '#3b82f6', '#dbeafe', 1),
('IT-DEV', 'Development', 4, 'Code', '#8b5cf6', '#ede9fe', 1),
('IT-INFRA', 'Infrastructure', 4, 'Server', '#6366f1', '#e0e7ff', 2);

-- ============================================
-- SEED DATA - Stores (v0.2.0: with area_id)
-- ============================================

INSERT INTO `stores` (`store_name`, `store_code`, `region_id`, `area_id`, `address`, `phone`, `status`) VALUES
-- Miền Nam stores
('AEON Mall Tân Phú', 'AEON-TP', 3, 10, '30 Bờ Bao Tân Thắng, Sơn Kỳ, Tân Phú, TP.HCM', '028-1234-5678', 'active'),
('AEON Mall Bình Dương', 'AEON-BD', 3, 13, 'Số 1 Đại lộ Bình Dương, TX Thuận An, Bình Dương', '0274-123-4567', 'active'),
('AEON Mall Bình Tân', 'AEON-BT', 3, 11, '1 Đường số 17A, Bình Tân, TP.HCM', '028-2222-3333', 'active'),
('AEON Supermarket Gò Vấp', 'AEON-GV', 3, 12, '123 Quang Trung, Gò Vấp, TP.HCM', '028-3333-4444', 'active'),
-- Miền Bắc stores
('AEON Mall Long Biên', 'AEON-LB', 1, 1, '27 Cổ Linh, Long Biên, Hà Nội', '024-1234-5678', 'active'),
('AEON Mall Hà Đông', 'AEON-HD', 1, 2, 'Dương Nội, Hà Đông, Hà Nội', '024-8765-4321', 'active'),
('AEON Mall Cầu Giấy', 'AEON-CG', 1, 3, 'Dịch Vọng Hậu, Cầu Giấy, Hà Nội', '024-3333-4444', 'active'),
('AEON Supermarket Bắc Ninh', 'AEON-BN', 1, 4, '123 Lý Thái Tổ, TP. Bắc Ninh', '0222-333-4444', 'active'),
('AEON Supermarket Hải Phòng', 'AEON-HP', 1, 5, '456 Lạch Tray, Hồng Bàng, Hải Phòng', '0225-333-4444', 'active'),
-- Miền Trung stores
('AEON Mall Đà Nẵng', 'AEON-DN', 2, 6, '123 Nguyễn Văn Linh, Hải Châu, Đà Nẵng', '0236-123-4567', 'active'),
('AEON Supermarket Thanh Khê', 'AEON-TK', 2, 7, '789 Điện Biên Phủ, Thanh Khê, Đà Nẵng', '0236-444-5555', 'active'),
('AEON Supermarket Huế', 'AEON-HUE', 2, 8, '123 Lê Lợi, TP. Huế', '0234-333-4444', 'active'),
('AEON Supermarket Hội An', 'AEON-HA', 2, 9, '456 Trần Hưng Đạo, Hội An, Quảng Nam', '0235-333-4444', 'active');

-- ============================================
-- SEED DATA - Staff (v0.2.0: with geographic scope)
-- Password: password (bcrypt hash)
-- ============================================

INSERT INTO `staff` (`staff_name`, `staff_code`, `username`, `email`, `phone`, `store_id`, `department_id`, `team_id`, `role`, `position`, `job_grade`, `sap_code`, `password_hash`, `status`) VALUES
-- HQ Staff (G9-G2)
('Admin User', 'ADMIN001', 'admin', 'admin@aoisora.vn', '0901234567', NULL, 1, 'OPE-STORE', 'ADMIN', 'System Administrator', 'G9', 'SAP001', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
('Trần Văn G8', 'G8001', 'g8user', 'g8@aoisora.vn', '0901234580', NULL, 1, 'OPE-QC', 'MANAGER', 'Senior Manager', 'G8', 'SAP010', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
('Nguyễn Thị G7', 'G7001', 'g7user', 'g7@aoisora.vn', '0901234581', NULL, 1, 'OPE-QC', 'MANAGER', 'Area Manager', 'G7', 'SAP011', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
('Nguyễn Văn Manager', 'MGR001', 'manager', 'manager@aoisora.vn', '0901234568', NULL, 1, 'OPE-STORE', 'MANAGER', 'Store Manager', 'G6', 'SAP002', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
('Lê Văn G5', 'G5001', 'g5user', 'g5@aoisora.vn', '0901234582', NULL, 1, 'OPE-QC', 'STAFF', 'Team Lead', 'G5', 'SAP012', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
('Phạm Văn G4', 'G4001', 'g4user', 'g4@aoisora.vn', '0901234583', NULL, 1, 'OPE-QC', 'STAFF', 'Senior Staff', 'G4', 'SAP013', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
('Trần Thị Staff', 'STF001', 'staff1', 'staff1@aoisora.vn', '0901234569', NULL, 1, 'OPE-STORE', 'STAFF', 'Sales Staff', 'G3', 'SAP003', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
('Hoàng Văn G2', 'G2001', 'g2user', 'g2@aoisora.vn', '0901234584', NULL, 1, 'OPE-QC', 'STAFF', 'Junior Staff', 'G2', 'SAP014', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
-- Other HQ Staff
('Lê Văn QC', 'QC001', 'qc1', 'qc1@aoisora.vn', '0901234570', NULL, 1, 'OPE-QC', 'STAFF', 'QC Staff', 'G3', 'SAP004', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
('Phạm Thị Account', 'ACC001', 'acc1', 'acc1@aoisora.vn', '0901234571', NULL, 2, 'ACC-AP', 'STAFF', 'Accountant', 'G3', 'SAP005', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active');

-- Store Leaders (S3 for each store)
INSERT INTO `staff` (`staff_name`, `staff_code`, `username`, `email`, `phone`, `store_id`, `department_id`, `team_id`, `role`, `position`, `job_grade`, `sap_code`, `password_hash`, `status`) VALUES
('Nguyễn Văn Store1', 'S3-001', 's3store1', 's3store1@aoisora.vn', '0901111001', 1, 1, 'OPE-STORE', 'MANAGER', 'Store Leader', 'S3', 'SAP101', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
('Trần Thị Store2', 'S3-002', 's3store2', 's3store2@aoisora.vn', '0901111002', 2, 1, 'OPE-STORE', 'MANAGER', 'Store Leader', 'S3', 'SAP102', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
('Lê Văn Store3', 'S3-003', 's3store3', 's3store3@aoisora.vn', '0901111003', 3, 1, 'OPE-STORE', 'MANAGER', 'Store Leader', 'S3', 'SAP103', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
('Phạm Thị Store4', 'S3-004', 's3store4', 's3store4@aoisora.vn', '0901111004', 4, 1, 'OPE-STORE', 'MANAGER', 'Store Leader', 'S3', 'SAP104', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
('Hoàng Văn Store5', 'S3-005', 's3store5', 's3store5@aoisora.vn', '0901111005', 5, 1, 'OPE-STORE', 'MANAGER', 'Store Leader', 'S3', 'SAP105', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
('Nguyễn Văn Store6', 'S3-006', 's3store6', 's3store6@aoisora.vn', '0901111006', 6, 1, 'OPE-STORE', 'MANAGER', 'Store Leader', 'S3', 'SAP106', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
('Trần Thị Store7', 'S3-007', 's3store7', 's3store7@aoisora.vn', '0901111007', 7, 1, 'OPE-STORE', 'MANAGER', 'Store Leader', 'S3', 'SAP107', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
('Lê Văn Store8', 'S3-008', 's3store8', 's3store8@aoisora.vn', '0901111008', 8, 1, 'OPE-STORE', 'MANAGER', 'Store Leader', 'S3', 'SAP108', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
('Phạm Thị Store9', 'S3-009', 's3store9', 's3store9@aoisora.vn', '0901111009', 9, 1, 'OPE-STORE', 'MANAGER', 'Store Leader', 'S3', 'SAP109', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
('Hoàng Văn Store10', 'S3-010', 's3store10', 's3store10@aoisora.vn', '0901111010', 10, 1, 'OPE-STORE', 'MANAGER', 'Store Leader', 'S3', 'SAP110', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
('Nguyễn Văn Store11', 'S3-011', 's3store11', 's3store11@aoisora.vn', '0901111011', 11, 1, 'OPE-STORE', 'MANAGER', 'Store Leader', 'S3', 'SAP111', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
('Trần Thị Store12', 'S3-012', 's3store12', 's3store12@aoisora.vn', '0901111012', 12, 1, 'OPE-STORE', 'MANAGER', 'Store Leader', 'S3', 'SAP112', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
('Lê Văn Store13', 'S3-013', 's3store13', 's3store13@aoisora.vn', '0901111013', 13, 1, 'OPE-STORE', 'MANAGER', 'Store Leader', 'S3', 'SAP113', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active');

-- Set line managers for HQ staff
UPDATE `staff` SET `line_manager_id` = 1 WHERE `staff_id` IN (2, 3, 4);
UPDATE `staff` SET `line_manager_id` = 2 WHERE `staff_id` IN (5, 6);
UPDATE `staff` SET `line_manager_id` = 4 WHERE `staff_id` IN (7, 8, 9, 10);

-- Set store managers
UPDATE `stores` SET `manager_id` = 11 WHERE `store_id` = 1;
UPDATE `stores` SET `manager_id` = 12 WHERE `store_id` = 2;
UPDATE `stores` SET `manager_id` = 13 WHERE `store_id` = 3;
UPDATE `stores` SET `manager_id` = 14 WHERE `store_id` = 4;
UPDATE `stores` SET `manager_id` = 15 WHERE `store_id` = 5;
UPDATE `stores` SET `manager_id` = 16 WHERE `store_id` = 6;
UPDATE `stores` SET `manager_id` = 17 WHERE `store_id` = 7;
UPDATE `stores` SET `manager_id` = 18 WHERE `store_id` = 8;
UPDATE `stores` SET `manager_id` = 19 WHERE `store_id` = 9;
UPDATE `stores` SET `manager_id` = 20 WHERE `store_id` = 10;
UPDATE `stores` SET `manager_id` = 21 WHERE `store_id` = 11;
UPDATE `stores` SET `manager_id` = 22 WHERE `store_id` = 12;
UPDATE `stores` SET `manager_id` = 23 WHERE `store_id` = 13;

-- ============================================
-- SEED DATA - Check Lists
-- ============================================

INSERT INTO `check_lists` (`check_list_name`, `description`) VALUES
('Kiểm tra hàng tồn kho', 'Đếm và kiểm tra số lượng hàng tồn'),
('Vệ sinh kệ hàng', 'Lau dọn và sắp xếp kệ hàng'),
('Kiểm tra hạn sử dụng', 'Kiểm tra và loại bỏ hàng hết hạn'),
('Bổ sung hàng lên kệ', 'Đưa hàng từ kho lên kệ trưng bày'),
('Kiểm tra giá niêm yết', 'Đảm bảo giá niêm yết chính xác'),
('Kiểm tra PCCC', 'Kiểm tra thiết bị phòng cháy chữa cháy'),
('Vệ sinh khu vực POS', 'Dọn dẹp khu vực thu ngân'),
('Kiểm tra máy POS', 'Kiểm tra hoạt động máy POS');

-- ============================================
-- SEED DATA - Task Library (for DWS)
-- ============================================

INSERT INTO `task_library` (`task_code`, `task_name`, `group_id`, `duration_minutes`, `description`) VALUES
('POS-OPEN', 'Mở ca POS', 'POS', 15, 'Kiểm tra và mở máy POS đầu ca'),
('POS-CLOSE', 'Đóng ca POS', 'POS', 20, 'Kiểm đếm tiền và đóng ca POS'),
('POS-CLEAN', 'Vệ sinh khu vực POS', 'POS', 10, 'Lau dọn khu vực thu ngân'),
('PERI-CHECK', 'Kiểm tra thực phẩm tươi', 'PERI', 30, 'Kiểm tra nhiệt độ và chất lượng'),
('PERI-ROTATE', 'Xoay hàng FIFO', 'PERI', 45, 'Xoay hàng theo nguyên tắc FIFO'),
('DRY-REFILL', 'Bổ sung hàng khô', 'DRY', 60, 'Đưa hàng từ kho lên kệ'),
('DRY-CLEAN', 'Vệ sinh kệ hàng khô', 'DRY', 30, 'Lau dọn và sắp xếp kệ'),
('MMD-RECEIVE', 'Nhận hàng', 'MMD', 90, 'Tiếp nhận và kiểm tra hàng nhập'),
('LEADER-MEETING', 'Họp đầu ca', 'LEADER', 15, 'Họp triển khai công việc đầu ca'),
('QC-AUDIT', 'Kiểm tra chất lượng', 'QC-FSH', 45, 'Kiểm tra chất lượng định kỳ');

-- ============================================
-- SEED DATA - Manual Folders
-- ============================================

INSERT INTO `manual_folders` (`folder_name`, `description`, `icon`, `sort_order`) VALUES
('Quy trình vận hành', 'Hướng dẫn quy trình vận hành cửa hàng', 'BookOpen', 1),
('Hướng dẫn sử dụng thiết bị', 'Hướng dẫn sử dụng máy móc, thiết bị', 'Monitor', 2),
('Chính sách & Quy định', 'Các chính sách và quy định của công ty', 'FileText', 3),
('An toàn lao động', 'Hướng dẫn an toàn lao động', 'Shield', 4);

-- ============================================
-- SEED DATA - Manual Documents
-- ============================================

INSERT INTO `manual_documents` (`folder_id`, `title`, `description`, `version`, `status`, `created_by`) VALUES
(1, 'Quy trình mở cửa hàng', 'Hướng dẫn chi tiết các bước mở cửa hàng đầu ngày', '1.0', 'published', 1),
(1, 'Quy trình đóng cửa hàng', 'Hướng dẫn chi tiết các bước đóng cửa hàng cuối ngày', '1.0', 'published', 1),
(2, 'Sử dụng máy POS', 'Hướng dẫn sử dụng máy tính tiền POS', '2.0', 'published', 1),
(3, 'Quy định đồng phục', 'Quy định về đồng phục và trang phục làm việc', '1.0', 'published', 1),
(4, 'An toàn PCCC', 'Hướng dẫn phòng cháy chữa cháy', '1.0', 'published', 1);

-- ============================================
-- SEED DATA - Sample Tasks (60+ tasks for testing)
-- ============================================

-- DRAFT Tasks (10 tasks) - status_id = 12
INSERT INTO `tasks` (`task_name`, `task_description`, `source`, `task_type_id`, `response_type_id`, `dept_id`, `assigned_store_id`, `status_id`, `priority`, `start_date`, `end_date`, `created_staff_id`, `approver_id`) VALUES
('Lập kế hoạch kiểm kê Q1', 'Lên kế hoạch kiểm kê hàng hóa quý 1', 'task_list', 1, 5, 1, 1, 12, 'normal', DATE_ADD(CURDATE(), INTERVAL 7 DAY), DATE_ADD(CURDATE(), INTERVAL 14 DAY), 1, 1),
('Chuẩn bị báo cáo tài chính', 'Draft báo cáo tài chính cuối năm', 'task_list', 1, 6, 2, 1, 12, 'high', DATE_ADD(CURDATE(), INTERVAL 5 DAY), DATE_ADD(CURDATE(), INTERVAL 12 DAY), 2, 1),
('Kế hoạch training Q2', 'Lập kế hoạch đào tạo nhân viên Q2', 'task_list', 3, 6, 3, 1, 12, 'normal', DATE_ADD(CURDATE(), INTERVAL 10 DAY), DATE_ADD(CURDATE(), INTERVAL 30 DAY), 1, 1),
('Đề xuất cải tiến quy trình', 'Đề xuất cải tiến quy trình vận hành', 'task_list', 1, 6, 1, 2, 12, 'normal', DATE_ADD(CURDATE(), INTERVAL 3 DAY), DATE_ADD(CURDATE(), INTERVAL 10 DAY), 4, 1),
('Thiết kế layout mới', 'Thiết kế layout kệ hàng mới cho Q2', 'task_list', 2, 4, 1, 1, 12, 'normal', DATE_ADD(CURDATE(), INTERVAL 15 DAY), DATE_ADD(CURDATE(), INTERVAL 25 DAY), 5, 4),
('Kế hoạch khuyến mãi Tết', 'Lên kế hoạch chương trình khuyến mãi Tết', 'task_list', 2, 4, 1, 1, 12, 'high', DATE_ADD(CURDATE(), INTERVAL 20 DAY), DATE_ADD(CURDATE(), INTERVAL 35 DAY), 1, 1),
('Đánh giá nhà cung cấp', 'Đánh giá và xếp hạng nhà cung cấp', 'task_list', 1, 5, 1, 3, 12, 'normal', DATE_ADD(CURDATE(), INTERVAL 8 DAY), DATE_ADD(CURDATE(), INTERVAL 15 DAY), 2, 1),
('Kế hoạch bảo trì thiết bị', 'Lập kế hoạch bảo trì thiết bị định kỳ', 'task_list', 3, 5, 4, 1, 12, 'normal', DATE_ADD(CURDATE(), INTERVAL 12 DAY), DATE_ADD(CURDATE(), INTERVAL 20 DAY), 1, 1),
('Cập nhật manual POS', 'Cập nhật hướng dẫn sử dụng POS mới', 'library', 3, 6, 4, NULL, 12, 'normal', NULL, NULL, 1, 1),
('Template kiểm tra an toàn', 'Tạo template kiểm tra an toàn lao động', 'library', 3, 5, 1, NULL, 12, 'high', NULL, NULL, 4, 1);

-- APPROVE Tasks (8 tasks) - status_id = 13
INSERT INTO `tasks` (`task_name`, `task_description`, `source`, `task_type_id`, `response_type_id`, `dept_id`, `assigned_store_id`, `status_id`, `priority`, `start_date`, `end_date`, `created_staff_id`, `approver_id`, `submitted_at`) VALUES
('Kiểm kê kho tháng 1', 'Kiểm kê hàng hóa trong kho tháng 1', 'task_list', 1, 5, 1, 1, 13, 'high', DATE_ADD(CURDATE(), INTERVAL 2 DAY), DATE_ADD(CURDATE(), INTERVAL 5 DAY), 2, 1, NOW()),
('Sắp xếp kệ Tết', 'Sắp xếp kệ hàng cho mùa Tết', 'task_list', 2, 4, 1, 1, 13, 'urgent', DATE_ADD(CURDATE(), INTERVAL 1 DAY), DATE_ADD(CURDATE(), INTERVAL 7 DAY), 7, 2, NOW()),
('Kiểm tra PCCC tháng 1', 'Kiểm tra thiết bị PCCC định kỳ', 'task_list', 3, 5, 1, 2, 13, 'high', DATE_ADD(CURDATE(), INTERVAL 3 DAY), DATE_ADD(CURDATE(), INTERVAL 4 DAY), 6, 2, NOW()),
('Báo cáo hiệu suất tuần', 'Báo cáo hiệu suất làm việc tuần qua', 'task_list', 1, 6, 1, 1, 13, 'normal', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 1 DAY), 5, 4, NOW()),
('Training POS mới', 'Đào tạo sử dụng hệ thống POS mới', 'task_list', 3, 6, 4, 1, 13, 'normal', DATE_ADD(CURDATE(), INTERVAL 5 DAY), DATE_ADD(CURDATE(), INTERVAL 10 DAY), 1, 1, NOW()),
('Kế hoạch nhân sự Q1', 'Lên kế hoạch nhân sự quý 1', 'task_list', 1, 6, 3, NULL, 13, 'high', DATE_ADD(CURDATE(), INTERVAL 7 DAY), DATE_ADD(CURDATE(), INTERVAL 21 DAY), 4, 1, NOW()),
('Template vệ sinh cửa hàng', 'Tạo template checklist vệ sinh', 'library', 3, 5, 1, NULL, 13, 'normal', NULL, NULL, 5, 4, NOW()),
('Template kiểm tra chất lượng', 'Tạo template kiểm tra chất lượng SP', 'library', 3, 5, 1, NULL, 13, 'normal', NULL, NULL, 1, 1, NOW());

-- NOT_YET Tasks (12 tasks) - status_id = 7
INSERT INTO `tasks` (`task_name`, `task_description`, `source`, `task_type_id`, `response_type_id`, `dept_id`, `assigned_store_id`, `assigned_staff_id`, `status_id`, `priority`, `start_date`, `end_date`, `created_staff_id`, `approver_id`, `approved_at`) VALUES
('Vệ sinh kệ hàng khu A', 'Vệ sinh và sắp xếp kệ hàng khu A', 'task_list', 2, 4, 1, 1, 7, 7, 'normal', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 2 DAY), 2, 1, NOW()),
('Kiểm tra hạn sử dụng', 'Kiểm tra hạn sử dụng SP khu thực phẩm', 'task_list', 3, 5, 1, 1, 9, 7, 'high', CURDATE(), CURDATE(), 2, 1, NOW()),
('Bổ sung hàng lên kệ', 'Bổ sung hàng từ kho lên kệ trưng bày', 'task_list', 2, 4, 1, 2, 7, 7, 'normal', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 1 DAY), 1, 1, NOW()),
('Kiểm tra giá niêm yết', 'Kiểm tra và cập nhật giá niêm yết', 'task_list', 1, 5, 1, 1, 10, 7, 'normal', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 1 DAY), 2, 1, NOW()),
('Vệ sinh khu POS', 'Vệ sinh khu vực thu ngân', 'task_list', 2, 4, 1, 3, 7, 7, 'normal', CURDATE(), CURDATE(), 1, 1, NOW()),
('Kiểm tra máy lạnh', 'Kiểm tra hoạt động máy lạnh', 'task_list', 3, 5, 4, 1, 9, 7, 'high', DATE_ADD(CURDATE(), INTERVAL 1 DAY), DATE_ADD(CURDATE(), INTERVAL 2 DAY), 1, 1, NOW()),
('Setup khuyến mãi tuần', 'Setup bảng giá khuyến mãi tuần', 'task_list', 2, 4, 1, 1, 7, 7, 'normal', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 3 DAY), 2, 1, NOW()),
('Kiểm tra vệ sinh thực phẩm', 'Kiểm tra vệ sinh khu thực phẩm tươi', 'task_list', 3, 5, 1, 4, 9, 7, 'urgent', CURDATE(), CURDATE(), 1, 1, NOW()),
('Nhận hàng nhập kho', 'Nhận và kiểm tra hàng nhập kho', 'task_list', 1, 5, 1, 1, 10, 7, 'high', DATE_ADD(CURDATE(), INTERVAL 1 DAY), DATE_ADD(CURDATE(), INTERVAL 1 DAY), 2, 1, NOW()),
('Kiểm tra đèn chiếu sáng', 'Kiểm tra hệ thống đèn chiếu sáng', 'task_list', 3, 5, 4, 2, 9, 7, 'normal', DATE_ADD(CURDATE(), INTERVAL 2 DAY), DATE_ADD(CURDATE(), INTERVAL 3 DAY), 1, 1, NOW()),
('Sắp xếp kho hàng', 'Sắp xếp và tổ chức lại kho hàng', 'task_list', 2, 4, 1, 1, 7, 7, 'normal', DATE_ADD(CURDATE(), INTERVAL 1 DAY), DATE_ADD(CURDATE(), INTERVAL 4 DAY), 2, 1, NOW()),
('Chuẩn bị họp đầu tuần', 'Chuẩn bị nội dung họp đầu tuần', 'task_list', 3, 6, 1, 1, 4, 7, 'normal', DATE_ADD(CURDATE(), INTERVAL 3 DAY), DATE_ADD(CURDATE(), INTERVAL 3 DAY), 1, 1, NOW());

-- ON_PROGRESS Tasks (15 tasks) - status_id = 8
INSERT INTO `tasks` (`task_name`, `task_description`, `source`, `task_type_id`, `response_type_id`, `dept_id`, `assigned_store_id`, `assigned_staff_id`, `do_staff_id`, `status_id`, `priority`, `start_date`, `end_date`, `created_staff_id`, `approver_id`, `approved_at`) VALUES
('Kiểm kê hàng tồn', 'Kiểm kê hàng tồn kho cuối tuần', 'task_list', 1, 5, 1, 1, 7, 7, 8, 'high', DATE_SUB(CURDATE(), INTERVAL 2 DAY), DATE_ADD(CURDATE(), INTERVAL 1 DAY), 2, 1, DATE_SUB(NOW(), INTERVAL 3 DAY)),
('Sắp xếp kệ khuyến mãi', 'Sắp xếp kệ hàng khuyến mãi tháng', 'task_list', 2, 4, 1, 1, 7, 7, 8, 'normal', DATE_SUB(CURDATE(), INTERVAL 1 DAY), DATE_ADD(CURDATE(), INTERVAL 2 DAY), 1, 1, DATE_SUB(NOW(), INTERVAL 2 DAY)),
('Training nhân viên mới', 'Đào tạo quy trình cho NV mới', 'task_list', 3, 6, 3, 1, 4, 4, 8, 'normal', DATE_SUB(CURDATE(), INTERVAL 3 DAY), DATE_ADD(CURDATE(), INTERVAL 4 DAY), 1, 1, DATE_SUB(NOW(), INTERVAL 4 DAY)),
('Kiểm tra chất lượng SP', 'Kiểm tra chất lượng sản phẩm nhập', 'task_list', 3, 5, 1, 1, 9, 9, 8, 'high', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 1 DAY), 2, 1, DATE_SUB(NOW(), INTERVAL 1 DAY)),
('Cập nhật bảng giá', 'Cập nhật bảng giá cho tuần mới', 'task_list', 1, 4, 1, 2, 7, 7, 8, 'normal', DATE_SUB(CURDATE(), INTERVAL 1 DAY), CURDATE(), 1, 1, DATE_SUB(NOW(), INTERVAL 2 DAY)),
('Vệ sinh tổng thể', 'Vệ sinh tổng thể cửa hàng', 'task_list', 2, 4, 1, 1, 10, 10, 8, 'normal', DATE_SUB(CURDATE(), INTERVAL 2 DAY), CURDATE(), 2, 1, DATE_SUB(NOW(), INTERVAL 3 DAY)),
('Kiểm tra camera', 'Kiểm tra hệ thống camera an ninh', 'task_list', 3, 5, 4, 1, 9, 9, 8, 'high', DATE_SUB(CURDATE(), INTERVAL 1 DAY), DATE_ADD(CURDATE(), INTERVAL 1 DAY), 1, 1, DATE_SUB(NOW(), INTERVAL 2 DAY)),
('Chuẩn bị event cuối tuần', 'Chuẩn bị cho event khuyến mãi', 'task_list', 2, 4, 1, 1, 7, 7, 8, 'urgent', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 2 DAY), 2, 1, DATE_SUB(NOW(), INTERVAL 1 DAY)),
('Báo cáo doanh thu ngày', 'Tổng hợp báo cáo doanh thu ngày', 'task_list', 1, 6, 2, 1, 10, 10, 8, 'normal', DATE_SUB(CURDATE(), INTERVAL 1 DAY), CURDATE(), 1, 1, DATE_SUB(NOW(), INTERVAL 1 DAY)),
('Kiểm kê tài sản', 'Kiểm kê tài sản cố định', 'task_list', 1, 5, 2, 1, 10, 10, 8, 'normal', DATE_SUB(CURDATE(), INTERVAL 4 DAY), DATE_ADD(CURDATE(), INTERVAL 3 DAY), 2, 1, DATE_SUB(NOW(), INTERVAL 5 DAY)),
('Sắp xếp khu vực mới', 'Sắp xếp khu vực bán hàng mới', 'task_list', 2, 4, 1, 3, 7, 7, 8, 'normal', DATE_SUB(CURDATE(), INTERVAL 2 DAY), DATE_ADD(CURDATE(), INTERVAL 1 DAY), 1, 1, DATE_SUB(NOW(), INTERVAL 3 DAY)),
('Chuẩn bị tài liệu họp', 'Chuẩn bị tài liệu cho cuộc họp', 'task_list', 3, 6, 1, 1, 4, 4, 8, 'high', DATE_SUB(CURDATE(), INTERVAL 1 DAY), CURDATE(), 1, 1, DATE_SUB(NOW(), INTERVAL 2 DAY)),
('Kiểm tra hệ thống điện', 'Kiểm tra an toàn hệ thống điện', 'task_list', 3, 5, 4, 2, 9, 9, 8, 'high', DATE_SUB(CURDATE(), INTERVAL 1 DAY), DATE_ADD(CURDATE(), INTERVAL 1 DAY), 2, 1, DATE_SUB(NOW(), INTERVAL 2 DAY)),
('Update menu display', 'Cập nhật menu hiển thị điện tử', 'task_list', 2, 4, 4, 1, 9, 9, 8, 'normal', DATE_SUB(CURDATE(), INTERVAL 2 DAY), DATE_ADD(CURDATE(), INTERVAL 1 DAY), 1, 1, DATE_SUB(NOW(), INTERVAL 3 DAY)),
('Kiểm tra máy POS', 'Kiểm tra hoạt động máy POS', 'task_list', 3, 5, 4, 1, 9, 9, 8, 'high', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 1 DAY), 2, 1, NOW());

-- DONE Tasks (10 tasks) - status_id = 9
INSERT INTO `tasks` (`task_name`, `task_description`, `source`, `task_type_id`, `response_type_id`, `dept_id`, `assigned_store_id`, `assigned_staff_id`, `do_staff_id`, `status_id`, `priority`, `start_date`, `end_date`, `created_staff_id`, `approver_id`, `approved_at`, `completed_time`) VALUES
('Kiểm kê cuối tháng 12', 'Kiểm kê hàng hóa cuối tháng 12', 'task_list', 1, 5, 1, 1, 7, 7, 9, 'high', DATE_SUB(CURDATE(), INTERVAL 10 DAY), DATE_SUB(CURDATE(), INTERVAL 7 DAY), 2, 1, DATE_SUB(NOW(), INTERVAL 11 DAY), DATE_SUB(NOW(), INTERVAL 7 DAY)),
('Báo cáo doanh thu tuần 52', 'Báo cáo doanh thu tuần cuối năm', 'task_list', 1, 6, 2, 1, 10, 10, 9, 'normal', DATE_SUB(CURDATE(), INTERVAL 14 DAY), DATE_SUB(CURDATE(), INTERVAL 10 DAY), 1, 1, DATE_SUB(NOW(), INTERVAL 15 DAY), DATE_SUB(NOW(), INTERVAL 10 DAY)),
('Vệ sinh đón năm mới', 'Vệ sinh tổng thể đón năm mới', 'task_list', 2, 4, 1, 1, 7, 7, 9, 'high', DATE_SUB(CURDATE(), INTERVAL 8 DAY), DATE_SUB(CURDATE(), INTERVAL 5 DAY), 2, 1, DATE_SUB(NOW(), INTERVAL 9 DAY), DATE_SUB(NOW(), INTERVAL 5 DAY)),
('Training cuối năm', 'Đào tạo tổng kết cuối năm', 'task_list', 3, 6, 3, 1, 4, 4, 9, 'normal', DATE_SUB(CURDATE(), INTERVAL 12 DAY), DATE_SUB(CURDATE(), INTERVAL 8 DAY), 1, 1, DATE_SUB(NOW(), INTERVAL 13 DAY), DATE_SUB(NOW(), INTERVAL 8 DAY)),
('Kiểm tra PCCC tháng 12', 'Kiểm tra thiết bị PCCC', 'task_list', 3, 5, 1, 1, 9, 9, 9, 'high', DATE_SUB(CURDATE(), INTERVAL 15 DAY), DATE_SUB(CURDATE(), INTERVAL 12 DAY), 2, 1, DATE_SUB(NOW(), INTERVAL 16 DAY), DATE_SUB(NOW(), INTERVAL 12 DAY)),
('Đánh giá hiệu suất Q4', 'Đánh giá hiệu suất quý 4', 'task_list', 1, 6, 3, 1, 4, 4, 9, 'high', DATE_SUB(CURDATE(), INTERVAL 20 DAY), DATE_SUB(CURDATE(), INTERVAL 15 DAY), 1, 1, DATE_SUB(NOW(), INTERVAL 21 DAY), DATE_SUB(NOW(), INTERVAL 15 DAY)),
('Kiểm kê tài sản Q4', 'Kiểm kê tài sản cố định Q4', 'task_list', 1, 5, 2, 1, 10, 10, 9, 'normal', DATE_SUB(CURDATE(), INTERVAL 18 DAY), DATE_SUB(CURDATE(), INTERVAL 13 DAY), 2, 1, DATE_SUB(NOW(), INTERVAL 19 DAY), DATE_SUB(NOW(), INTERVAL 13 DAY)),
('Sắp xếp kho cuối năm', 'Tổng vệ sinh và sắp xếp kho', 'task_list', 2, 4, 1, 2, 7, 7, 9, 'normal', DATE_SUB(CURDATE(), INTERVAL 9 DAY), DATE_SUB(CURDATE(), INTERVAL 6 DAY), 1, 1, DATE_SUB(NOW(), INTERVAL 10 DAY), DATE_SUB(NOW(), INTERVAL 6 DAY)),
('Backup dữ liệu cuối năm', 'Backup toàn bộ dữ liệu', 'task_list', 3, 5, 4, 1, 9, 9, 9, 'urgent', DATE_SUB(CURDATE(), INTERVAL 7 DAY), DATE_SUB(CURDATE(), INTERVAL 5 DAY), 1, 1, DATE_SUB(NOW(), INTERVAL 8 DAY), DATE_SUB(NOW(), INTERVAL 5 DAY)),
('Chuẩn bị event năm mới', 'Chuẩn bị cho event năm mới', 'task_list', 2, 4, 1, 1, 7, 7, 9, 'high', DATE_SUB(CURDATE(), INTERVAL 6 DAY), DATE_SUB(CURDATE(), INTERVAL 3 DAY), 2, 1, DATE_SUB(NOW(), INTERVAL 7 DAY), DATE_SUB(NOW(), INTERVAL 3 DAY));

-- OVERDUE Tasks (5 tasks) - status_id = 10
INSERT INTO `tasks` (`task_name`, `task_description`, `source`, `task_type_id`, `response_type_id`, `dept_id`, `assigned_store_id`, `assigned_staff_id`, `do_staff_id`, `status_id`, `priority`, `start_date`, `end_date`, `created_staff_id`, `approver_id`, `approved_at`) VALUES
('Báo cáo tồn kho quá hạn', 'Báo cáo tồn kho chưa hoàn thành', 'task_list', 1, 6, 1, 1, 7, 7, 10, 'high', DATE_SUB(CURDATE(), INTERVAL 10 DAY), DATE_SUB(CURDATE(), INTERVAL 5 DAY), 2, 1, DATE_SUB(NOW(), INTERVAL 11 DAY)),
('Kiểm tra camera quá hạn', 'Kiểm tra camera đã quá hạn', 'task_list', 3, 5, 4, 1, 9, NULL, 10, 'urgent', DATE_SUB(CURDATE(), INTERVAL 7 DAY), DATE_SUB(CURDATE(), INTERVAL 3 DAY), 1, 1, DATE_SUB(NOW(), INTERVAL 8 DAY)),
('Vệ sinh khu B quá hạn', 'Vệ sinh khu B chưa hoàn thành', 'task_list', 2, 4, 1, 2, 7, 7, 10, 'normal', DATE_SUB(CURDATE(), INTERVAL 5 DAY), DATE_SUB(CURDATE(), INTERVAL 2 DAY), 2, 1, DATE_SUB(NOW(), INTERVAL 6 DAY)),
('Update giá quá hạn', 'Cập nhật giá chưa hoàn thành', 'task_list', 1, 4, 1, 1, 10, 10, 10, 'high', DATE_SUB(CURDATE(), INTERVAL 4 DAY), DATE_SUB(CURDATE(), INTERVAL 1 DAY), 1, 1, DATE_SUB(NOW(), INTERVAL 5 DAY)),
('Báo cáo tuần quá hạn', 'Báo cáo tuần chưa nộp', 'task_list', 1, 6, 2, 1, 10, NULL, 10, 'normal', DATE_SUB(CURDATE(), INTERVAL 6 DAY), DATE_SUB(CURDATE(), INTERVAL 2 DAY), 2, 1, DATE_SUB(NOW(), INTERVAL 7 DAY));

-- More NOT_YET Tasks (10 tasks) for pagination testing
INSERT INTO `tasks` (`task_name`, `task_description`, `source`, `task_type_id`, `response_type_id`, `dept_id`, `assigned_store_id`, `assigned_staff_id`, `status_id`, `priority`, `start_date`, `end_date`, `created_staff_id`, `approver_id`, `approved_at`) VALUES
('Kiểm tra hệ thống nước', 'Kiểm tra hệ thống cấp nước trong store', 'task_list', 3, 5, 1, 1, 7, 7, 'normal', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 2 DAY), 1, 1, NOW()),
('Sắp xếp khu vực C', 'Sắp xếp lại kệ hàng khu vực C', 'task_list', 2, 4, 1, 2, 7, 7, 'normal', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 1 DAY), 2, 1, NOW()),
('Kiểm tra hàng tồn khu A', 'Kiểm tra và báo cáo hàng tồn khu A', 'task_list', 1, 5, 1, 1, 9, 7, 'high', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 1 DAY), 1, 1, NOW()),
('Vệ sinh khu thực phẩm tươi', 'Vệ sinh khu vực thực phẩm tươi sống', 'task_list', 2, 4, 1, 3, 7, 7, 'urgent', CURDATE(), CURDATE(), 2, 1, NOW()),
('Cập nhật bảng giá mới', 'Cập nhật bảng giá sản phẩm mới', 'task_list', 1, 4, 1, 1, 10, 7, 'normal', DATE_ADD(CURDATE(), INTERVAL 1 DAY), DATE_ADD(CURDATE(), INTERVAL 2 DAY), 1, 1, NOW()),
('Kiểm tra thiết bị làm lạnh', 'Kiểm tra tủ đông và tủ mát', 'task_list', 3, 5, 1, 2, 9, 7, 'high', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 1 DAY), 2, 1, NOW()),
('Nhận hàng từ kho trung tâm', 'Nhận và kiểm tra hàng từ kho', 'task_list', 1, 5, 1, 1, 10, 7, 'normal', DATE_ADD(CURDATE(), INTERVAL 1 DAY), DATE_ADD(CURDATE(), INTERVAL 1 DAY), 1, 1, NOW()),
('Báo cáo tình trạng kệ hàng', 'Báo cáo kệ hàng cần sửa chữa', 'task_list', 1, 6, 1, 3, 7, 7, 'normal', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 3 DAY), 2, 1, NOW()),
('Setup khu vực khuyến mãi mới', 'Thiết lập khu vực khuyến mãi đặc biệt', 'task_list', 2, 4, 1, 1, 7, 7, 'high', DATE_ADD(CURDATE(), INTERVAL 2 DAY), DATE_ADD(CURDATE(), INTERVAL 4 DAY), 1, 1, NOW()),
('Kiểm tra an ninh đêm', 'Kiểm tra camera và thiết bị an ninh', 'task_list', 3, 5, 1, 2, 9, 7, 'normal', DATE_ADD(CURDATE(), INTERVAL 1 DAY), DATE_ADD(CURDATE(), INTERVAL 2 DAY), 2, 1, NOW());

-- More ON_PROGRESS Tasks (10 tasks) for pagination testing
INSERT INTO `tasks` (`task_name`, `task_description`, `source`, `task_type_id`, `response_type_id`, `dept_id`, `assigned_store_id`, `assigned_staff_id`, `do_staff_id`, `status_id`, `priority`, `start_date`, `end_date`, `created_staff_id`, `approver_id`, `approved_at`) VALUES
('Tổng vệ sinh cuối tuần', 'Vệ sinh toàn bộ cửa hàng', 'task_list', 2, 4, 1, 1, 7, 7, 8, 'high', DATE_SUB(CURDATE(), INTERVAL 1 DAY), DATE_ADD(CURDATE(), INTERVAL 1 DAY), 1, 1, DATE_SUB(NOW(), INTERVAL 2 DAY)),
('Kiểm kê hàng nhập mới', 'Kiểm kê lô hàng mới nhập', 'task_list', 1, 5, 1, 2, 9, 9, 8, 'normal', DATE_SUB(CURDATE(), INTERVAL 2 DAY), DATE_ADD(CURDATE(), INTERVAL 1 DAY), 2, 1, DATE_SUB(NOW(), INTERVAL 3 DAY)),
('Sắp xếp hàng theo FIFO', 'Sắp xếp lại hàng theo nguyên tắc FIFO', 'task_list', 2, 4, 1, 1, 10, 10, 8, 'high', DATE_SUB(CURDATE(), INTERVAL 1 DAY), CURDATE(), 1, 1, DATE_SUB(NOW(), INTERVAL 2 DAY)),
('Chuẩn bị khuyến mãi tuần mới', 'Setup chương trình KM tuần mới', 'task_list', 2, 4, 1, 3, 7, 7, 8, 'normal', DATE_SUB(CURDATE(), INTERVAL 2 DAY), DATE_ADD(CURDATE(), INTERVAL 2 DAY), 2, 1, DATE_SUB(NOW(), INTERVAL 3 DAY)),
('Kiểm tra chất lượng rau củ', 'Kiểm tra độ tươi rau củ quả', 'task_list', 3, 5, 1, 1, 9, 9, 8, 'urgent', CURDATE(), CURDATE(), 1, 1, NOW()),
('Báo cáo doanh số realtime', 'Cập nhật báo cáo doanh số', 'task_list', 1, 6, 2, 1, 10, 10, 8, 'normal', DATE_SUB(CURDATE(), INTERVAL 1 DAY), CURDATE(), 2, 1, DATE_SUB(NOW(), INTERVAL 2 DAY)),
('Kiểm tra hệ thống POS', 'Kiểm tra và test hệ thống POS', 'task_list', 3, 5, 4, 2, 9, 9, 8, 'high', DATE_SUB(CURDATE(), INTERVAL 1 DAY), DATE_ADD(CURDATE(), INTERVAL 1 DAY), 1, 1, DATE_SUB(NOW(), INTERVAL 2 DAY)),
('Vệ sinh khu vực khách hàng', 'Vệ sinh khu ngồi và toilet', 'task_list', 2, 4, 1, 1, 7, 7, 8, 'normal', DATE_SUB(CURDATE(), INTERVAL 2 DAY), CURDATE(), 2, 1, DATE_SUB(NOW(), INTERVAL 3 DAY)),
('Sắp xếp khu Delica', 'Sắp xếp khu bán đồ ăn sẵn', 'task_list', 2, 4, 1, 3, 7, 7, 8, 'normal', DATE_SUB(CURDATE(), INTERVAL 1 DAY), DATE_ADD(CURDATE(), INTERVAL 1 DAY), 1, 1, DATE_SUB(NOW(), INTERVAL 2 DAY)),
('Kiểm tra máy tính tiền', 'Kiểm tra hoạt động máy tính tiền', 'task_list', 3, 5, 4, 1, 9, 9, 8, 'high', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 1 DAY), 2, 1, NOW());

-- More DONE Tasks (5 tasks)
INSERT INTO `tasks` (`task_name`, `task_description`, `source`, `task_type_id`, `response_type_id`, `dept_id`, `assigned_store_id`, `assigned_staff_id`, `do_staff_id`, `status_id`, `priority`, `start_date`, `end_date`, `created_staff_id`, `approver_id`, `approved_at`, `completed_time`) VALUES
('Kiểm kê hàng tháng 12 tuần 4', 'Kiểm kê hàng tuần 4 tháng 12', 'task_list', 1, 5, 1, 1, 7, 7, 9, 'high', DATE_SUB(CURDATE(), INTERVAL 12 DAY), DATE_SUB(CURDATE(), INTERVAL 9 DAY), 1, 1, DATE_SUB(NOW(), INTERVAL 13 DAY), DATE_SUB(NOW(), INTERVAL 9 DAY)),
('Vệ sinh kho cuối năm', 'Tổng vệ sinh kho trước năm mới', 'task_list', 2, 4, 1, 2, 7, 7, 9, 'normal', DATE_SUB(CURDATE(), INTERVAL 8 DAY), DATE_SUB(CURDATE(), INTERVAL 5 DAY), 2, 1, DATE_SUB(NOW(), INTERVAL 9 DAY), DATE_SUB(NOW(), INTERVAL 5 DAY)),
('Training an toàn thực phẩm', 'Đào tạo ATTP cho nhân viên', 'task_list', 3, 6, 3, 1, 4, 4, 9, 'high', DATE_SUB(CURDATE(), INTERVAL 10 DAY), DATE_SUB(CURDATE(), INTERVAL 7 DAY), 1, 1, DATE_SUB(NOW(), INTERVAL 11 DAY), DATE_SUB(NOW(), INTERVAL 7 DAY)),
('Báo cáo chi phí tháng 12', 'Báo cáo chi phí vận hành tháng 12', 'task_list', 1, 6, 2, 1, 10, 10, 9, 'normal', DATE_SUB(CURDATE(), INTERVAL 14 DAY), DATE_SUB(CURDATE(), INTERVAL 10 DAY), 2, 1, DATE_SUB(NOW(), INTERVAL 15 DAY), DATE_SUB(NOW(), INTERVAL 10 DAY)),
('Kiểm tra PCCC cuối năm', 'Kiểm tra thiết bị PCCC trước năm mới', 'task_list', 3, 5, 1, 3, 9, 9, 9, 'urgent', DATE_SUB(CURDATE(), INTERVAL 6 DAY), DATE_SUB(CURDATE(), INTERVAL 4 DAY), 1, 1, DATE_SUB(NOW(), INTERVAL 7 DAY), DATE_SUB(NOW(), INTERVAL 4 DAY));

-- More OVERDUE Tasks (5 tasks)
INSERT INTO `tasks` (`task_name`, `task_description`, `source`, `task_type_id`, `response_type_id`, `dept_id`, `assigned_store_id`, `assigned_staff_id`, `do_staff_id`, `status_id`, `priority`, `start_date`, `end_date`, `created_staff_id`, `approver_id`, `approved_at`) VALUES
('Báo cáo tồn kho tuần trước', 'Báo cáo tồn kho chưa nộp', 'task_list', 1, 6, 1, 1, 7, 7, 10, 'high', DATE_SUB(CURDATE(), INTERVAL 8 DAY), DATE_SUB(CURDATE(), INTERVAL 4 DAY), 1, 1, DATE_SUB(NOW(), INTERVAL 9 DAY)),
('Kiểm tra máy lạnh khu B', 'Kiểm tra máy lạnh đã quá hạn', 'task_list', 3, 5, 4, 2, 9, NULL, 10, 'urgent', DATE_SUB(CURDATE(), INTERVAL 6 DAY), DATE_SUB(CURDATE(), INTERVAL 2 DAY), 2, 1, DATE_SUB(NOW(), INTERVAL 7 DAY)),
('Vệ sinh khu D quá hạn', 'Vệ sinh khu D chưa hoàn thành', 'task_list', 2, 4, 1, 1, 7, 7, 10, 'normal', DATE_SUB(CURDATE(), INTERVAL 5 DAY), DATE_SUB(CURDATE(), INTERVAL 1 DAY), 1, 1, DATE_SUB(NOW(), INTERVAL 6 DAY)),
('Cập nhật giá khu Fresh', 'Cập nhật giá chưa hoàn thành', 'task_list', 1, 4, 1, 3, 10, 10, 10, 'high', DATE_SUB(CURDATE(), INTERVAL 4 DAY), DATE_SUB(CURDATE(), INTERVAL 1 DAY), 2, 1, DATE_SUB(NOW(), INTERVAL 5 DAY)),
('Báo cáo nhân sự quá hạn', 'Báo cáo nhân sự tuần chưa nộp', 'task_list', 1, 6, 3, 1, 4, NULL, 10, 'normal', DATE_SUB(CURDATE(), INTERVAL 7 DAY), DATE_SUB(CURDATE(), INTERVAL 3 DAY), 1, 1, DATE_SUB(NOW(), INTERVAL 8 DAY));

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

SET FOREIGN_KEY_CHECKS = 1;

SELECT 'Database reset v0.2.0 completed successfully!' AS status;

SELECT
    (SELECT COUNT(*) FROM regions) AS total_regions,
    (SELECT COUNT(*) FROM zones) AS total_zones,
    (SELECT COUNT(*) FROM areas) AS total_areas,
    (SELECT COUNT(*) FROM stores) AS total_stores,
    (SELECT COUNT(*) FROM staff) AS total_staff,
    (SELECT COUNT(*) FROM departments) AS total_departments,
    (SELECT COUNT(*) FROM tasks) AS total_tasks;

SELECT
    (SELECT COUNT(*) FROM tasks WHERE status_id = 12) AS draft_tasks,
    (SELECT COUNT(*) FROM tasks WHERE status_id = 13) AS approve_tasks,
    (SELECT COUNT(*) FROM tasks WHERE status_id = 7) AS not_yet_tasks,
    (SELECT COUNT(*) FROM tasks WHERE status_id = 8) AS on_progress_tasks,
    (SELECT COUNT(*) FROM tasks WHERE status_id = 9) AS done_tasks,
    (SELECT COUNT(*) FROM tasks WHERE status_id = 10) AS overdue_tasks;
