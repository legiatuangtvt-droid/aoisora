-- ============================================
-- MIGRATION: Add 4-level geographic hierarchy
-- regions → zones → areas → stores
-- ============================================
-- Run this after full_reset.sql or as a migration on existing DB
-- ============================================

-- ============================================
-- 1. CREATE ZONES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS `zones` (
    `zone_id` INT AUTO_INCREMENT PRIMARY KEY,
    `zone_name` VARCHAR(255) NOT NULL,
    `zone_code` VARCHAR(50) UNIQUE,
    `region_id` INT NOT NULL,
    `description` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_zones_region` FOREIGN KEY (`region_id`) REFERENCES `regions`(`region_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 2. CREATE AREAS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS `areas` (
    `area_id` INT AUTO_INCREMENT PRIMARY KEY,
    `area_name` VARCHAR(255) NOT NULL,
    `area_code` VARCHAR(50) UNIQUE,
    `zone_id` INT NOT NULL,
    `description` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_areas_zone` FOREIGN KEY (`zone_id`) REFERENCES `zones`(`zone_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 3. ADD AREA_ID TO STORES TABLE (if not exists)
-- ============================================
-- First check if column exists, if not add it
SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'stores'
    AND COLUMN_NAME = 'area_id');

SET @sql = IF(@col_exists = 0,
    'ALTER TABLE `stores` ADD COLUMN `area_id` INT NULL AFTER `region_id`',
    'SELECT "area_id column already exists"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add FK constraint if not exists
SET @fk_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
    WHERE CONSTRAINT_SCHEMA = DATABASE()
    AND TABLE_NAME = 'stores'
    AND CONSTRAINT_NAME = 'fk_stores_area');

SET @sql = IF(@fk_exists = 0,
    'ALTER TABLE `stores` ADD CONSTRAINT `fk_stores_area` FOREIGN KEY (`area_id`) REFERENCES `areas`(`area_id`) ON DELETE SET NULL',
    'SELECT "fk_stores_area already exists"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ============================================
-- 4. SEED DATA: ZONES
-- ============================================
-- Miền Bắc (region_id = 1) có 2 zones
INSERT INTO `zones` (`zone_name`, `zone_code`, `region_id`, `description`) VALUES
('Hà Nội', 'HN', 1, 'Khu vực Hà Nội và vùng phụ cận'),
('Bắc Ninh - Hải Phòng', 'BN-HP', 1, 'Khu vực Bắc Ninh, Hải Dương, Hải Phòng');

-- Miền Trung (region_id = 2) có 2 zones
INSERT INTO `zones` (`zone_name`, `zone_code`, `region_id`, `description`) VALUES
('Đà Nẵng', 'DN', 2, 'Khu vực Đà Nẵng và các tỉnh lân cận'),
('Huế - Quảng Nam', 'HUE-QN', 2, 'Khu vực Huế và Quảng Nam');

-- Miền Nam (region_id = 3) có 2 zones
INSERT INTO `zones` (`zone_name`, `zone_code`, `region_id`, `description`) VALUES
('TP.HCM', 'HCM', 3, 'Khu vực TP. Hồ Chí Minh'),
('Bình Dương - Đồng Nai', 'BD-DN', 3, 'Khu vực Bình Dương và Đồng Nai');

-- ============================================
-- 5. SEED DATA: AREAS
-- ============================================
-- Hà Nội zone (zone_id = 1) có 3 areas
INSERT INTO `areas` (`area_name`, `area_code`, `zone_id`, `description`) VALUES
('Quận Long Biên', 'HN-LB', 1, 'Quận Long Biên, Hà Nội'),
('Quận Hà Đông', 'HN-HD', 1, 'Quận Hà Đông, Hà Nội'),
('Quận Cầu Giấy', 'HN-CG', 1, 'Quận Cầu Giấy, Hà Nội');

-- Bắc Ninh - Hải Phòng zone (zone_id = 2) có 2 areas
INSERT INTO `areas` (`area_name`, `area_code`, `zone_id`, `description`) VALUES
('TP. Bắc Ninh', 'BN-TP', 2, 'Thành phố Bắc Ninh'),
('Quận Hồng Bàng - Hải Phòng', 'HP-HB', 2, 'Quận Hồng Bàng, Hải Phòng');

-- Đà Nẵng zone (zone_id = 3) có 2 areas
INSERT INTO `areas` (`area_name`, `area_code`, `zone_id`, `description`) VALUES
('Quận Hải Châu', 'DN-HC', 3, 'Quận Hải Châu, Đà Nẵng'),
('Quận Thanh Khê', 'DN-TK', 3, 'Quận Thanh Khê, Đà Nẵng');

-- Huế - Quảng Nam zone (zone_id = 4) có 2 areas
INSERT INTO `areas` (`area_name`, `area_code`, `zone_id`, `description`) VALUES
('TP. Huế', 'HUE-TP', 4, 'Thành phố Huế'),
('TP. Hội An', 'QN-HA', 4, 'Thành phố Hội An, Quảng Nam');

-- TP.HCM zone (zone_id = 5) có 3 areas
INSERT INTO `areas` (`area_name`, `area_code`, `zone_id`, `description`) VALUES
('Quận Tân Phú', 'HCM-TP', 5, 'Quận Tân Phú, TP.HCM'),
('Quận Bình Tân', 'HCM-BT', 5, 'Quận Bình Tân, TP.HCM'),
('Quận 7', 'HCM-Q7', 5, 'Quận 7, TP.HCM');

-- Bình Dương - Đồng Nai zone (zone_id = 6) có 2 areas
INSERT INTO `areas` (`area_name`, `area_code`, `zone_id`, `description`) VALUES
('TX. Thuận An', 'BD-TA', 6, 'Thị xã Thuận An, Bình Dương'),
('TP. Biên Hòa', 'DN-BH', 6, 'Thành phố Biên Hòa, Đồng Nai');

-- ============================================
-- 6. UPDATE EXISTING STORES WITH AREA_ID
-- ============================================
-- AEON Mall Tân Phú (store_id=1) → Quận Tân Phú (area_id=10)
UPDATE `stores` SET `area_id` = 10 WHERE `store_code` = 'AEON-TP';

-- AEON Mall Bình Dương (store_id=2) → TX. Thuận An (area_id=14)
UPDATE `stores` SET `area_id` = 14 WHERE `store_code` = 'AEON-BD';

-- AEON Mall Long Biên (store_id=3) → Quận Long Biên (area_id=1)
UPDATE `stores` SET `area_id` = 1 WHERE `store_code` = 'AEON-LB';

-- AEON Mall Hà Đông (store_id=4) → Quận Hà Đông (area_id=2)
UPDATE `stores` SET `area_id` = 2 WHERE `store_code` = 'AEON-HD';

-- AEON Mall Đà Nẵng (store_id=5) → Quận Hải Châu (area_id=6)
UPDATE `stores` SET `area_id` = 6 WHERE `store_code` = 'AEON-DN';

-- ============================================
-- 7. ADD MORE STORES FOR COMPREHENSIVE TESTING
-- ============================================
-- Add stores in different areas to test 4-level hierarchy

-- Hà Nội stores
INSERT INTO `stores` (`store_name`, `store_code`, `region_id`, `area_id`, `address`, `phone`, `status`) VALUES
('AEON Mall Cầu Giấy', 'AEON-CG', 1, 3, 'Dịch Vọng Hậu, Cầu Giấy, Hà Nội', '024-3333-4444', 'active'),
('AEON Supermarket Bắc Ninh', 'AEON-BN', 1, 4, '123 Lý Thái Tổ, TP. Bắc Ninh', '0222-333-4444', 'active'),
('AEON Supermarket Hải Phòng', 'AEON-HP', 1, 5, '456 Lạch Tray, Hồng Bàng, Hải Phòng', '0225-333-4444', 'active');

-- Miền Trung stores
INSERT INTO `stores` (`store_name`, `store_code`, `region_id`, `area_id`, `address`, `phone`, `status`) VALUES
('AEON Supermarket Thanh Khê', 'AEON-TK', 2, 7, '789 Điện Biên Phủ, Thanh Khê, Đà Nẵng', '0236-444-5555', 'active'),
('AEON Supermarket Huế', 'AEON-HUE', 2, 8, '123 Lê Lợi, TP. Huế', '0234-333-4444', 'active'),
('AEON Supermarket Hội An', 'AEON-HA', 2, 9, '456 Trần Hưng Đạo, Hội An, Quảng Nam', '0235-333-4444', 'active');

-- TP.HCM stores
INSERT INTO `stores` (`store_name`, `store_code`, `region_id`, `area_id`, `address`, `phone`, `status`) VALUES
('AEON Mall Bình Tân', 'AEON-BT', 3, 11, '1 Đường số 17A, Bình Tân, TP.HCM', '028-5555-6666', 'active'),
('AEON Mall Quận 7', 'AEON-Q7', 3, 12, '123 Nguyễn Lương Bằng, Quận 7, TP.HCM', '028-6666-7777', 'active'),
('AEON Supermarket Biên Hòa', 'AEON-BH', 3, 15, '789 Võ Thị Sáu, TP. Biên Hòa, Đồng Nai', '0251-333-4444', 'active');

-- ============================================
-- 8. ADD STORE LEADERS FOR NEW STORES
-- ============================================
-- Add staff for new stores with proper job grades
INSERT INTO `staff` (`staff_name`, `staff_code`, `username`, `email`, `phone`, `store_id`, `department_id`, `team_id`, `role`, `position`, `job_grade`, `sap_code`, `password_hash`, `status`) VALUES
-- Store Leaders (S3)
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
-- 9. SUMMARY
-- ============================================
-- After running this migration:
-- - 3 Regions (Miền Bắc, Miền Trung, Miền Nam)
-- - 6 Zones (2 per region)
-- - 15 Areas (varying per zone)
-- - 14 Stores (distributed across areas)
--
-- Hierarchy:
-- Miền Bắc (region_id=1)
--   └── Hà Nội (zone_id=1)
--       ├── Quận Long Biên (area_id=1) → AEON Mall Long Biên
--       ├── Quận Hà Đông (area_id=2) → AEON Mall Hà Đông
--       └── Quận Cầu Giấy (area_id=3) → AEON Mall Cầu Giấy
--   └── Bắc Ninh - Hải Phòng (zone_id=2)
--       ├── TP. Bắc Ninh (area_id=4) → AEON Supermarket Bắc Ninh
--       └── Quận Hồng Bàng - HP (area_id=5) → AEON Supermarket Hải Phòng
--
-- Miền Trung (region_id=2)
--   └── Đà Nẵng (zone_id=3)
--       ├── Quận Hải Châu (area_id=6) → AEON Mall Đà Nẵng
--       └── Quận Thanh Khê (area_id=7) → AEON Supermarket Thanh Khê
--   └── Huế - Quảng Nam (zone_id=4)
--       ├── TP. Huế (area_id=8) → AEON Supermarket Huế
--       └── TP. Hội An (area_id=9) → AEON Supermarket Hội An
--
-- Miền Nam (region_id=3)
--   └── TP.HCM (zone_id=5)
--       ├── Quận Tân Phú (area_id=10) → AEON Mall Tân Phú
--       ├── Quận Bình Tân (area_id=11) → AEON Mall Bình Tân
--       └── Quận 7 (area_id=12) → AEON Mall Quận 7
--   └── Bình Dương - Đồng Nai (zone_id=6)
--       ├── TX. Thuận An (area_id=14) → AEON Mall Bình Dương
--       └── TP. Biên Hòa (area_id=15) → AEON Supermarket Biên Hòa

SELECT 'Migration completed successfully!' AS status;
SELECT COUNT(*) AS total_regions FROM regions;
SELECT COUNT(*) AS total_zones FROM zones;
SELECT COUNT(*) AS total_areas FROM areas;
SELECT COUNT(*) AS total_stores FROM stores;
