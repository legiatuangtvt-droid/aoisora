-- ============================================
-- Aoisora Database Schema (MySQL Version)
-- Database: MySQL 5.7+ / MariaDB 10.3+
-- Converted from PostgreSQL
-- ============================================

SET FOREIGN_KEY_CHECKS = 0;

-- ============================================
-- DROP ALL EXISTING TABLES
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
DROP TABLE IF EXISTS `staff`;
DROP TABLE IF EXISTS `teams`;
DROP TABLE IF EXISTS `stores`;
DROP TABLE IF EXISTS `departments`;
DROP TABLE IF EXISTS `regions`;
DROP TABLE IF EXISTS `personal_access_tokens`;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================
-- CORE TABLES
-- ============================================

-- Regions Table
CREATE TABLE `regions` (
    `region_id` INT AUTO_INCREMENT PRIMARY KEY,
    `region_name` VARCHAR(255) NOT NULL,
    `region_code` VARCHAR(50) UNIQUE,
    `description` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Departments Table
CREATE TABLE `departments` (
    `department_id` INT AUTO_INCREMENT PRIMARY KEY,
    `department_name` VARCHAR(255) NOT NULL,
    `department_code` VARCHAR(50) UNIQUE,
    `description` TEXT,
    `parent_id` INT,
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
    `department_id` INT,
    `icon` VARCHAR(50),
    `icon_color` VARCHAR(20),
    `icon_bg` VARCHAR(50),
    `sort_order` INT DEFAULT 0,
    `is_active` TINYINT(1) DEFAULT 1,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_teams_department` FOREIGN KEY (`department_id`) REFERENCES `departments`(`department_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Stores Table
CREATE TABLE `stores` (
    `store_id` INT AUTO_INCREMENT PRIMARY KEY,
    `store_name` VARCHAR(255) NOT NULL,
    `store_code` VARCHAR(50) UNIQUE,
    `region_id` INT,
    `address` TEXT,
    `phone` VARCHAR(20),
    `email` VARCHAR(100),
    `manager_id` INT,
    `status` VARCHAR(20) DEFAULT 'active',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_stores_region` FOREIGN KEY (`region_id`) REFERENCES `regions`(`region_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Staff Table (Auth Model)
CREATE TABLE `staff` (
    `staff_id` INT AUTO_INCREMENT PRIMARY KEY,
    `staff_name` VARCHAR(255) NOT NULL,
    `staff_code` VARCHAR(50) UNIQUE,
    `username` VARCHAR(100) UNIQUE NOT NULL,
    `email` VARCHAR(100) UNIQUE,
    `phone` VARCHAR(20),
    `store_id` INT,
    `department_id` INT,
    `team_id` VARCHAR(50),
    `role` VARCHAR(50) DEFAULT 'STAFF',
    `position` VARCHAR(100),
    `job_grade` VARCHAR(10),
    `sap_code` VARCHAR(20),
    `avatar_url` VARCHAR(500),
    `line_manager_id` INT,
    `joining_date` DATE,
    `password_hash` VARCHAR(255) NOT NULL,
    `status` VARCHAR(20) DEFAULT 'active',
    `is_active` TINYINT(1) DEFAULT 1,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_staff_store` FOREIGN KEY (`store_id`) REFERENCES `stores`(`store_id`) ON DELETE SET NULL,
    CONSTRAINT `fk_staff_department` FOREIGN KEY (`department_id`) REFERENCES `departments`(`department_id`) ON DELETE SET NULL,
    CONSTRAINT `fk_staff_team` FOREIGN KEY (`team_id`) REFERENCES `teams`(`team_id`) ON DELETE SET NULL,
    CONSTRAINT `fk_staff_line_manager` FOREIGN KEY (`line_manager_id`) REFERENCES `staff`(`staff_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add manager FK to stores
ALTER TABLE `stores` ADD CONSTRAINT `fk_stores_manager` FOREIGN KEY (`manager_id`) REFERENCES `staff`(`staff_id`) ON DELETE SET NULL;

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
    `task_name` VARCHAR(500) NOT NULL,
    `task_description` TEXT,
    `manual_id` INT,
    `task_type_id` INT,
    `response_type_id` INT,
    `response_num` INT,
    `is_repeat` TINYINT(1) DEFAULT 0,
    `repeat_config` JSON,
    `dept_id` INT,
    `assigned_store_id` INT,
    `assigned_staff_id` INT,
    `do_staff_id` INT,
    `status_id` INT,
    `priority` VARCHAR(20) DEFAULT 'normal',
    `start_date` DATE,
    `end_date` DATE,
    `start_time` TIME,
    `due_datetime` DATETIME,
    `completed_time` DATETIME,
    `comment` TEXT,
    `attachments` JSON,
    `created_staff_id` INT,
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
    CONSTRAINT `fk_tasks_created_staff` FOREIGN KEY (`created_staff_id`) REFERENCES `staff`(`staff_id`)
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
    `task_id` INT,
    `check_list_id` INT,
    `check_status` TINYINT(1) DEFAULT 0,
    `completed_at` DATETIME,
    `completed_by` INT,
    `notes` TEXT,
    UNIQUE KEY `task_check_list_unique` (`task_id`, `check_list_id`),
    CONSTRAINT `fk_tcl_task` FOREIGN KEY (`task_id`) REFERENCES `tasks`(`task_id`) ON DELETE CASCADE,
    CONSTRAINT `fk_tcl_checklist` FOREIGN KEY (`check_list_id`) REFERENCES `check_lists`(`check_list_id`) ON DELETE CASCADE,
    CONSTRAINT `fk_tcl_completed_by` FOREIGN KEY (`completed_by`) REFERENCES `staff`(`staff_id`)
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
    `staff_id` INT,
    `store_id` INT,
    `shift_date` DATE NOT NULL,
    `shift_code_id` INT,
    `status` VARCHAR(20) DEFAULT 'assigned',
    `notes` TEXT,
    `assigned_by` INT,
    `assigned_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY `shift_assignments_unique` (`staff_id`, `shift_date`, `shift_code_id`),
    CONSTRAINT `fk_sa_staff` FOREIGN KEY (`staff_id`) REFERENCES `staff`(`staff_id`) ON DELETE CASCADE,
    CONSTRAINT `fk_sa_store` FOREIGN KEY (`store_id`) REFERENCES `stores`(`store_id`),
    CONSTRAINT `fk_sa_shift_code` FOREIGN KEY (`shift_code_id`) REFERENCES `shift_codes`(`shift_code_id`),
    CONSTRAINT `fk_sa_assigned_by` FOREIGN KEY (`assigned_by`) REFERENCES `staff`(`staff_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Task Library Table
CREATE TABLE `task_library` (
    `task_lib_id` INT AUTO_INCREMENT PRIMARY KEY,
    `task_code` VARCHAR(20) NOT NULL UNIQUE,
    `task_name` VARCHAR(255) NOT NULL,
    `group_id` VARCHAR(20),
    `duration_minutes` INT DEFAULT 15,
    `description` TEXT,
    `is_active` TINYINT(1) DEFAULT 1,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_tl_group` FOREIGN KEY (`group_id`) REFERENCES `task_groups`(`group_id`)
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
    `staff_id` INT,
    `store_id` INT,
    `schedule_date` DATE NOT NULL,
    `group_id` VARCHAR(20),
    `task_code` VARCHAR(20),
    `task_name` VARCHAR(255) NOT NULL,
    `start_time` TIME NOT NULL,
    `end_time` TIME NOT NULL,
    `status` INT DEFAULT 1 COMMENT '1=Not Yet, 2=Done, 3=Skipped, 4=In Progress',
    `completed_at` DATETIME,
    `notes` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_dst_staff` FOREIGN KEY (`staff_id`) REFERENCES `staff`(`staff_id`) ON DELETE CASCADE,
    CONSTRAINT `fk_dst_store` FOREIGN KEY (`store_id`) REFERENCES `stores`(`store_id`),
    CONSTRAINT `fk_dst_group` FOREIGN KEY (`group_id`) REFERENCES `task_groups`(`group_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- MANUAL (KNOWLEDGE BASE) TABLES
-- ============================================

-- Manual Folders Table
CREATE TABLE `manual_folders` (
    `folder_id` INT AUTO_INCREMENT PRIMARY KEY,
    `folder_name` VARCHAR(255) NOT NULL,
    `parent_id` INT,
    `description` TEXT,
    `icon` VARCHAR(50),
    `sort_order` INT DEFAULT 0,
    `display_order` INT DEFAULT 0,
    `is_active` TINYINT(1) DEFAULT 1,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_mf_parent` FOREIGN KEY (`parent_id`) REFERENCES `manual_folders`(`folder_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Manual Documents Table
CREATE TABLE `manual_documents` (
    `document_id` INT AUTO_INCREMENT PRIMARY KEY,
    `folder_id` INT,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT,
    `version` VARCHAR(20) DEFAULT '1.0',
    `status` VARCHAR(20) DEFAULT 'draft',
    `tags` JSON,
    `created_by` INT,
    `updated_by` INT,
    `published_at` DATETIME,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_md_folder` FOREIGN KEY (`folder_id`) REFERENCES `manual_folders`(`folder_id`) ON DELETE SET NULL,
    CONSTRAINT `fk_md_created_by` FOREIGN KEY (`created_by`) REFERENCES `staff`(`staff_id`),
    CONSTRAINT `fk_md_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `staff`(`staff_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Manual Steps Table
CREATE TABLE `manual_steps` (
    `step_id` INT AUTO_INCREMENT PRIMARY KEY,
    `document_id` INT,
    `step_number` INT NOT NULL,
    `title` VARCHAR(255),
    `content` TEXT,
    `tips` TEXT,
    `warnings` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_ms_document` FOREIGN KEY (`document_id`) REFERENCES `manual_documents`(`document_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Manual Media Table
CREATE TABLE `manual_media` (
    `media_id` INT AUTO_INCREMENT PRIMARY KEY,
    `step_id` INT,
    `document_id` INT,
    `media_type` VARCHAR(20) NOT NULL,
    `file_path` TEXT NOT NULL,
    `file_name` VARCHAR(255),
    `file_size` INT,
    `mime_type` VARCHAR(100),
    `alt_text` VARCHAR(255),
    `sort_order` INT DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_mm_step` FOREIGN KEY (`step_id`) REFERENCES `manual_steps`(`step_id`) ON DELETE CASCADE,
    CONSTRAINT `fk_mm_document` FOREIGN KEY (`document_id`) REFERENCES `manual_documents`(`document_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Manual View Logs Table
CREATE TABLE `manual_view_logs` (
    `log_id` INT AUTO_INCREMENT PRIMARY KEY,
    `document_id` INT,
    `staff_id` INT,
    `viewed_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `duration_seconds` INT,
    CONSTRAINT `fk_mvl_document` FOREIGN KEY (`document_id`) REFERENCES `manual_documents`(`document_id`) ON DELETE CASCADE,
    CONSTRAINT `fk_mvl_staff` FOREIGN KEY (`staff_id`) REFERENCES `staff`(`staff_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TASK DETAIL TABLES
-- ============================================

-- Task Workflow Steps Table
CREATE TABLE `task_workflow_steps` (
    `step_id` INT AUTO_INCREMENT PRIMARY KEY,
    `task_id` INT,
    `step_number` INT NOT NULL COMMENT '1=SUBMIT, 2=APPROVE, 3=DO TASK, 4=CHECK',
    `step_name` VARCHAR(50) NOT NULL,
    `status` VARCHAR(20) DEFAULT 'pending' COMMENT 'pending, in_progress, completed, skipped',
    `assignee_id` INT,
    `skip_info` VARCHAR(255) COMMENT 'e.g., "27 Stores" for DO TASK step',
    `start_date` DATE,
    `end_date` DATE,
    `comment` TEXT,
    `completed_at` DATETIME,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_tws_task` FOREIGN KEY (`task_id`) REFERENCES `tasks`(`task_id`) ON DELETE CASCADE,
    CONSTRAINT `fk_tws_assignee` FOREIGN KEY (`assignee_id`) REFERENCES `staff`(`staff_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Task Store Results Table
CREATE TABLE `task_store_results` (
    `result_id` INT AUTO_INCREMENT PRIMARY KEY,
    `task_id` INT,
    `store_id` INT,
    `status` VARCHAR(20) DEFAULT 'not_started' COMMENT 'not_started, in_progress, success, failed',
    `start_time` DATETIME,
    `completed_time` DATETIME,
    `completed_by_id` INT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_tsr_task` FOREIGN KEY (`task_id`) REFERENCES `tasks`(`task_id`) ON DELETE CASCADE,
    CONSTRAINT `fk_tsr_store` FOREIGN KEY (`store_id`) REFERENCES `stores`(`store_id`) ON DELETE CASCADE,
    CONSTRAINT `fk_tsr_completed_by` FOREIGN KEY (`completed_by_id`) REFERENCES `staff`(`staff_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Task Staff Results Table
CREATE TABLE `task_staff_results` (
    `result_id` INT AUTO_INCREMENT PRIMARY KEY,
    `task_id` INT,
    `staff_id` INT,
    `store_id` INT,
    `status` VARCHAR(20) DEFAULT 'not_started' COMMENT 'not_started, in_progress, success, failed',
    `progress` INT DEFAULT 0 COMMENT '0-100',
    `progress_text` VARCHAR(50) COMMENT 'e.g., "100% (15/15 items)"',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_tsfr_task` FOREIGN KEY (`task_id`) REFERENCES `tasks`(`task_id`) ON DELETE CASCADE,
    CONSTRAINT `fk_tsfr_staff` FOREIGN KEY (`staff_id`) REFERENCES `staff`(`staff_id`) ON DELETE CASCADE,
    CONSTRAINT `fk_tsfr_store` FOREIGN KEY (`store_id`) REFERENCES `stores`(`store_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Task Images Table
CREATE TABLE `task_images` (
    `image_id` INT AUTO_INCREMENT PRIMARY KEY,
    `task_id` INT,
    `store_result_id` INT,
    `staff_result_id` INT,
    `title` VARCHAR(255),
    `image_url` TEXT NOT NULL,
    `thumbnail_url` TEXT,
    `uploaded_by_id` INT,
    `is_completed` TINYINT(1) DEFAULT 0,
    `uploaded_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_ti_task` FOREIGN KEY (`task_id`) REFERENCES `tasks`(`task_id`) ON DELETE CASCADE,
    CONSTRAINT `fk_ti_store_result` FOREIGN KEY (`store_result_id`) REFERENCES `task_store_results`(`result_id`) ON DELETE CASCADE,
    CONSTRAINT `fk_ti_staff_result` FOREIGN KEY (`staff_result_id`) REFERENCES `task_staff_results`(`result_id`) ON DELETE CASCADE,
    CONSTRAINT `fk_ti_uploaded_by` FOREIGN KEY (`uploaded_by_id`) REFERENCES `staff`(`staff_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Task Comments Table
CREATE TABLE `task_comments` (
    `comment_id` INT AUTO_INCREMENT PRIMARY KEY,
    `task_id` INT,
    `store_result_id` INT,
    `staff_result_id` INT,
    `user_id` INT,
    `content` TEXT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_tc_task` FOREIGN KEY (`task_id`) REFERENCES `tasks`(`task_id`) ON DELETE CASCADE,
    CONSTRAINT `fk_tc_store_result` FOREIGN KEY (`store_result_id`) REFERENCES `task_store_results`(`result_id`) ON DELETE CASCADE,
    CONSTRAINT `fk_tc_staff_result` FOREIGN KEY (`staff_result_id`) REFERENCES `task_staff_results`(`result_id`) ON DELETE CASCADE,
    CONSTRAINT `fk_tc_user` FOREIGN KEY (`user_id`) REFERENCES `staff`(`staff_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Task Likes Table
CREATE TABLE `task_likes` (
    `like_id` INT AUTO_INCREMENT PRIMARY KEY,
    `store_result_id` INT,
    `user_id` INT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY `task_likes_unique` (`store_result_id`, `user_id`),
    CONSTRAINT `fk_tl_store_result` FOREIGN KEY (`store_result_id`) REFERENCES `task_store_results`(`result_id`) ON DELETE CASCADE,
    CONSTRAINT `fk_tl_user` FOREIGN KEY (`user_id`) REFERENCES `staff`(`staff_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- NOTIFICATIONS TABLE
-- ============================================

CREATE TABLE `notifications` (
    `notification_id` INT AUTO_INCREMENT PRIMARY KEY,
    `recipient_staff_id` INT,
    `sender_staff_id` INT,
    `notification_type` VARCHAR(50),
    `title` VARCHAR(255) NOT NULL,
    `message` TEXT,
    `link_url` TEXT,
    `is_read` TINYINT(1) DEFAULT 0,
    `read_at` DATETIME,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_n_recipient` FOREIGN KEY (`recipient_staff_id`) REFERENCES `staff`(`staff_id`) ON DELETE CASCADE,
    CONSTRAINT `fk_n_sender` FOREIGN KEY (`sender_staff_id`) REFERENCES `staff`(`staff_id`) ON DELETE SET NULL
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
-- INITIAL DATA - Code Master Values
-- ============================================

INSERT INTO `code_master` (`code_master_id`, `code_type`, `code`, `name`, `sort_order`) VALUES
(1, 'task_type', 'STATISTICS', 'Statistics', 1),
(2, 'task_type', 'ARRANGE', 'Arrange', 2),
(3, 'task_type', 'PREPARE', 'Prepare', 3),
(4, 'response_type', 'PICTURE', 'Picture', 1),
(5, 'response_type', 'CHECKLIST', 'Checklist', 2),
(6, 'response_type', 'YESNO', 'Yes/No', 3),
(7, 'status', 'NOT_YET', 'Not Yet', 1),
(8, 'status', 'ON_PROGRESS', 'On Progress', 2),
(9, 'status', 'DONE', 'Done', 3),
(10, 'status', 'OVERDUE', 'Overdue', 4),
(11, 'status', 'REJECT', 'Reject', 5);

-- ============================================
-- INITIAL DATA - Task Groups
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
-- INITIAL DATA - Shift Codes
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
-- DONE
-- ============================================
