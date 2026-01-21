-- ============================================
-- Migration: Add is_active and sort_order to geographic tables
-- Purpose: Enable filtering by active status and custom sorting
-- Date: 2026-01-21
-- ============================================

-- Add columns to regions table
ALTER TABLE `regions`
    ADD COLUMN `is_active` TINYINT(1) DEFAULT 1 AFTER `description`,
    ADD COLUMN `sort_order` INT DEFAULT 0 AFTER `is_active`;

-- Add columns to zones table
ALTER TABLE `zones`
    ADD COLUMN `is_active` TINYINT(1) DEFAULT 1 AFTER `description`,
    ADD COLUMN `sort_order` INT DEFAULT 0 AFTER `is_active`;

-- Add columns to areas table
ALTER TABLE `areas`
    ADD COLUMN `is_active` TINYINT(1) DEFAULT 1 AFTER `description`,
    ADD COLUMN `sort_order` INT DEFAULT 0 AFTER `is_active`;

-- Add indexes for better query performance
CREATE INDEX `idx_regions_is_active` ON `regions`(`is_active`);
CREATE INDEX `idx_regions_sort_order` ON `regions`(`sort_order`);

CREATE INDEX `idx_zones_is_active` ON `zones`(`is_active`);
CREATE INDEX `idx_zones_sort_order` ON `zones`(`sort_order`);

CREATE INDEX `idx_areas_is_active` ON `areas`(`is_active`);
CREATE INDEX `idx_areas_sort_order` ON `areas`(`sort_order`);

-- Update sort_order based on current order
UPDATE `regions` SET `sort_order` = `region_id`;
UPDATE `zones` SET `sort_order` = `zone_id`;
UPDATE `areas` SET `sort_order` = `area_id`;
