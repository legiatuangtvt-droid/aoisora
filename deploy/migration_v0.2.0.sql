-- ============================================
-- MIGRATION v0.2.0: Double Token System + Geographic Hierarchy
-- Date: 2026-01-21
-- Previous version: v0.1.0 (full_reset.sql)
-- ============================================
-- IMPORT ORDER:
-- 1. Run this file on production phpMyAdmin
-- 2. This will update the existing database schema
-- ============================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ============================================
-- PART 1: CREATE ZONES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS `zones` (
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

-- ============================================
-- PART 2: CREATE AREAS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS `areas` (
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

-- ============================================
-- PART 3: ADD area_id TO STORES TABLE
-- ============================================
-- Check if column exists before adding
SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'stores'
    AND COLUMN_NAME = 'area_id');

SET @sql = IF(@col_exists = 0,
    'ALTER TABLE `stores` ADD COLUMN `area_id` INT NULL AFTER `region_id`',
    'SELECT "area_id column already exists" AS message');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add FK if not exists
SET @fk_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
    WHERE CONSTRAINT_SCHEMA = DATABASE()
    AND TABLE_NAME = 'stores'
    AND CONSTRAINT_NAME = 'fk_stores_area');

SET @sql = IF(@fk_exists = 0,
    'ALTER TABLE `stores` ADD CONSTRAINT `fk_stores_area` FOREIGN KEY (`area_id`) REFERENCES `areas`(`area_id`) ON DELETE SET NULL',
    'SELECT "fk_stores_area already exists" AS message');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ============================================
-- PART 4: ADD is_active, sort_order TO REGIONS
-- ============================================
SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'regions'
    AND COLUMN_NAME = 'is_active');

SET @sql = IF(@col_exists = 0,
    'ALTER TABLE `regions` ADD COLUMN `is_active` TINYINT(1) DEFAULT 1 AFTER `description`, ADD COLUMN `sort_order` INT DEFAULT 0 AFTER `is_active`',
    'SELECT "regions columns already exist" AS message');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ============================================
-- PART 5: ADD geographic scope columns TO STAFF
-- ============================================
SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'staff'
    AND COLUMN_NAME = 'region_id');

SET @sql = IF(@col_exists = 0,
    'ALTER TABLE `staff` ADD COLUMN `region_id` INT NULL AFTER `store_id`, ADD COLUMN `zone_id` INT NULL AFTER `region_id`, ADD COLUMN `area_id` INT NULL AFTER `zone_id`',
    'SELECT "staff geographic columns already exist" AS message');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ============================================
-- PART 6: CREATE REFRESH_TOKENS TABLE (Double Token System)
-- ============================================
CREATE TABLE IF NOT EXISTS `refresh_tokens` (
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

-- ============================================
-- PART 7: CREATE STAFF_ASSIGNMENTS TABLE (Acting Positions)
-- ============================================
CREATE TABLE IF NOT EXISTS `staff_assignments` (
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
    INDEX `idx_effective_grade` (`effective_grade`),
    UNIQUE KEY `unique_staff_scope` (`staff_id`, `scope_type`, `scope_id`, `assignment_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- PART 8: SEED DATA - ZONES (6 zones)
-- ============================================
INSERT IGNORE INTO `zones` (`zone_name`, `zone_code`, `region_id`, `description`, `sort_order`) VALUES
('Hà Nội', 'HN', 1, 'Khu vực Hà Nội và vùng phụ cận', 1),
('Bắc Ninh - Hải Phòng', 'BN-HP', 1, 'Khu vực Bắc Ninh, Hải Dương, Hải Phòng', 2),
('Đà Nẵng', 'DN', 2, 'Khu vực Đà Nẵng và các tỉnh lân cận', 3),
('Huế - Quảng Nam', 'HUE-QN', 2, 'Khu vực Huế và Quảng Nam', 4),
('TP.HCM', 'HCM', 3, 'Khu vực TP. Hồ Chí Minh', 5),
('Bình Dương - Đồng Nai', 'BD-DN', 3, 'Khu vực Bình Dương và Đồng Nai', 6);

-- ============================================
-- PART 9: SEED DATA - AREAS (15 areas)
-- ============================================
INSERT IGNORE INTO `areas` (`area_name`, `area_code`, `zone_id`, `description`, `sort_order`) VALUES
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
('Quận 7', 'HCM-Q7', 5, 'Quận 7, TP.HCM', 12),
-- Bình Dương - Đồng Nai zone (zone_id = 6)
('TX. Thuận An', 'BD-TA', 6, 'Thị xã Thuận An, Bình Dương', 14),
('TP. Biên Hòa', 'DN-BH', 6, 'Thành phố Biên Hòa, Đồng Nai', 15);

-- ============================================
-- PART 10: UPDATE EXISTING STORES WITH area_id
-- ============================================
-- Map existing stores to areas based on location
UPDATE `stores` SET `area_id` = 10 WHERE `store_code` = 'AEON-TP';  -- Tân Phú
UPDATE `stores` SET `area_id` = 14 WHERE `store_code` = 'AEON-BD';  -- Thuận An
UPDATE `stores` SET `area_id` = 1 WHERE `store_code` = 'AEON-LB';   -- Long Biên
UPDATE `stores` SET `area_id` = 2 WHERE `store_code` = 'AEON-HD';   -- Hà Đông
UPDATE `stores` SET `area_id` = 6 WHERE `store_code` = 'AEON-DN';   -- Hải Châu

-- ============================================
-- PART 11: ADD MORE STORES FOR TESTING
-- ============================================
INSERT IGNORE INTO `stores` (`store_name`, `store_code`, `region_id`, `area_id`, `address`, `phone`, `status`) VALUES
-- Hà Nội stores
('AEON Mall Cầu Giấy', 'AEON-CG', 1, 3, 'Dịch Vọng Hậu, Cầu Giấy, Hà Nội', '024-3333-4444', 'active'),
('AEON Supermarket Bắc Ninh', 'AEON-BN', 1, 4, '123 Lý Thái Tổ, TP. Bắc Ninh', '0222-333-4444', 'active'),
('AEON Supermarket Hải Phòng', 'AEON-HP', 1, 5, '456 Lạch Tray, Hồng Bàng, Hải Phòng', '0225-333-4444', 'active'),
-- Miền Trung stores
('AEON Supermarket Thanh Khê', 'AEON-TK', 2, 7, '789 Điện Biên Phủ, Thanh Khê, Đà Nẵng', '0236-444-5555', 'active'),
('AEON Supermarket Huế', 'AEON-HUE', 2, 8, '123 Lê Lợi, TP. Huế', '0234-333-4444', 'active'),
('AEON Supermarket Hội An', 'AEON-HA', 2, 9, '456 Trần Hưng Đạo, Hội An, Quảng Nam', '0235-333-4444', 'active'),
-- TP.HCM stores
('AEON Mall Bình Tân', 'AEON-BT', 3, 11, '1 Đường số 17A, Bình Tân, TP.HCM', '028-5555-6666', 'active'),
('AEON Mall Quận 7', 'AEON-Q7', 3, 12, '123 Nguyễn Lương Bằng, Quận 7, TP.HCM', '028-6666-7777', 'active'),
('AEON Supermarket Biên Hòa', 'AEON-BH', 3, 15, '789 Võ Thị Sáu, TP. Biên Hòa, Đồng Nai', '0251-333-4444', 'active');

-- ============================================
-- PART 12: ADD STORE LEADERS FOR NEW STORES
-- ============================================
INSERT IGNORE INTO `staff` (`staff_name`, `staff_code`, `username`, `email`, `phone`, `store_id`, `department_id`, `team_id`, `role`, `position`, `job_grade`, `sap_code`, `password_hash`, `status`) VALUES
('Nguyễn Văn Store6', 'S3-006', 's3store6', 's3store6@aoisora.vn', '0901111006', 6, 1, 'OPE-STORE', 'MANAGER', 'Store Leader', 'S3', 'SAP106', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
('Trần Thị Store7', 'S3-007', 's3store7', 's3store7@aoisora.vn', '0901111007', 7, 1, 'OPE-STORE', 'MANAGER', 'Store Leader', 'S3', 'SAP107', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
('Lê Văn Store8', 'S3-008', 's3store8', 's3store8@aoisora.vn', '0901111008', 8, 1, 'OPE-STORE', 'MANAGER', 'Store Leader', 'S3', 'SAP108', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
('Phạm Thị Store9', 'S3-009', 's3store9', 's3store9@aoisora.vn', '0901111009', 9, 1, 'OPE-STORE', 'MANAGER', 'Store Leader', 'S3', 'SAP109', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
('Hoàng Văn Store10', 'S3-010', 's3store10', 's3store10@aoisora.vn', '0901111010', 10, 1, 'OPE-STORE', 'MANAGER', 'Store Leader', 'S3', 'SAP110', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
('Vũ Thị Store11', 'S3-011', 's3store11', 's3store11@aoisora.vn', '0901111011', 11, 1, 'OPE-STORE', 'MANAGER', 'Store Leader', 'S3', 'SAP111', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
('Đặng Văn Store12', 'S3-012', 's3store12', 's3store12@aoisora.vn', '0901111012', 12, 1, 'OPE-STORE', 'MANAGER', 'Store Leader', 'S3', 'SAP112', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
('Bùi Thị Store13', 'S3-013', 's3store13', 's3store13@aoisora.vn', '0901111013', 13, 1, 'OPE-STORE', 'MANAGER', 'Store Leader', 'S3', 'SAP113', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
('Ngô Văn Store14', 'S3-014', 's3store14', 's3store14@aoisora.vn', '0901111014', 14, 1, 'OPE-STORE', 'MANAGER', 'Store Leader', 'S3', 'SAP114', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active');

-- ============================================
-- VERIFICATION
-- ============================================
SET FOREIGN_KEY_CHECKS = 1;

SELECT 'Migration v0.2.0 completed successfully!' AS status;
SELECT 'Tables created: zones, areas, refresh_tokens, staff_assignments' AS info;
SELECT COUNT(*) AS total_zones FROM zones;
SELECT COUNT(*) AS total_areas FROM areas;
SELECT COUNT(*) AS total_stores FROM stores;
SELECT COUNT(*) AS total_staff FROM staff;
