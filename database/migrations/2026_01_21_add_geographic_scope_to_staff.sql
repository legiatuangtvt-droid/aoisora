-- ============================================
-- Migration: Add Geographic Scope to Staff Table
-- Purpose: Allow S5-S7 managers to manage regions/zones/areas instead of single stores
-- Date: 2026-01-21
-- ============================================

-- Add region_id column for S7 (Regional Manager)
ALTER TABLE `staff` ADD COLUMN `region_id` INT NULL AFTER `store_id`;

-- Add zone_id column for S6 (Zone Manager)
ALTER TABLE `staff` ADD COLUMN `zone_id` INT NULL AFTER `region_id`;

-- Add area_id column for S5 (Area Manager)
ALTER TABLE `staff` ADD COLUMN `area_id` INT NULL AFTER `zone_id`;

-- Add foreign key constraints
ALTER TABLE `staff`
    ADD CONSTRAINT `fk_staff_region` FOREIGN KEY (`region_id`) REFERENCES `regions`(`region_id`) ON DELETE SET NULL,
    ADD CONSTRAINT `fk_staff_zone` FOREIGN KEY (`zone_id`) REFERENCES `zones`(`zone_id`) ON DELETE SET NULL,
    ADD CONSTRAINT `fk_staff_area` FOREIGN KEY (`area_id`) REFERENCES `areas`(`area_id`) ON DELETE SET NULL;

-- Add indexes for better query performance
CREATE INDEX `idx_staff_region` ON `staff`(`region_id`);
CREATE INDEX `idx_staff_zone` ON `staff`(`zone_id`);
CREATE INDEX `idx_staff_area` ON `staff`(`area_id`);

-- ============================================
-- NOTES ON STAFF GEOGRAPHIC SCOPE:
-- ============================================
-- S7 (Regional Manager): Uses region_id - manages all stores in a region
-- S6 (Zone Manager): Uses zone_id - manages all stores in a zone
-- S5 (Area Manager): Uses area_id - manages all stores in an area
-- S4-S1 (Store Staff): Uses store_id - works at a specific store
--
-- A staff member should have ONLY ONE of:
--   - region_id (for S7)
--   - zone_id (for S6)
--   - area_id (for S5)
--   - store_id (for S4-S1)
-- ============================================
