-- ============================================
-- Migration: Create Areas Table
-- Database: PostgreSQL 15+
-- Created: 2026-01-04
-- Purpose: Add Area level between Region and Store
-- Hierarchy: SMBU (HQ) → Region → Area → Store
-- ============================================

-- ============================================
-- Step 1: Create Areas Table
-- ============================================
CREATE TABLE IF NOT EXISTS areas (
    area_id SERIAL PRIMARY KEY,
    area_code VARCHAR(20) NOT NULL UNIQUE,
    area_name VARCHAR(100) NOT NULL,
    area_name_vi VARCHAR(100),
    region_id INTEGER NOT NULL REFERENCES regions(region_id) ON DELETE CASCADE,
    manager_id INTEGER REFERENCES staff(staff_id) ON DELETE SET NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_areas_region_id ON areas(region_id);
CREATE INDEX IF NOT EXISTS idx_areas_is_active ON areas(is_active);

-- ============================================
-- Step 2: Add area_id column to stores table
-- ============================================
ALTER TABLE stores ADD COLUMN IF NOT EXISTS area_id INTEGER REFERENCES areas(area_id) ON DELETE SET NULL;

-- Create index for area_id
CREATE INDEX IF NOT EXISTS idx_stores_area_id ON stores(area_id);

-- ============================================
-- Step 3: Seed Areas Data
-- ============================================

-- OCEAN Region (region_id = 11) - 2 Areas
INSERT INTO areas (area_code, area_name, area_name_vi, region_id, sort_order) VALUES
('OCEAN-A1', 'Ocean Park Main', 'Khu vực Ocean Park Chính', 11, 1),
('OCEAN-A2', 'Vinhomes Ocean Park', 'Khu vực Vinhomes Ocean Park', 11, 2)
ON CONFLICT (area_code) DO NOTHING;

-- HA NOI CENTER Region (region_id = 12) - 2 Areas
INSERT INTO areas (area_code, area_name, area_name_vi, region_id, sort_order) VALUES
('HNC-A1', 'Central Business District', 'Khu vực Trung tâm Thương mại', 12, 1),
('HNC-A2', 'Shopping Mall Area', 'Khu vực Trung tâm Mua sắm', 12, 2)
ON CONFLICT (area_code) DO NOTHING;

-- ECO PARK Region (region_id = 13) - 1 Area
INSERT INTO areas (area_code, area_name, area_name_vi, region_id, sort_order) VALUES
('ECO-A1', 'Ecopark Township', 'Khu đô thị Ecopark', 13, 1)
ON CONFLICT (area_code) DO NOTHING;

-- HA DONG Region (region_id = 14) - 2 Areas
INSERT INTO areas (area_code, area_name, area_name_vi, region_id, sort_order) VALUES
('HD-A1', 'Ha Dong Central', 'Khu vực Hà Đông Trung tâm', 14, 1),
('HD-A2', 'Ha Dong Suburban', 'Khu vực Hà Đông Ngoại thành', 14, 2)
ON CONFLICT (area_code) DO NOTHING;

-- NGD Region (region_id = 15) - 1 Area
INSERT INTO areas (area_code, area_name, area_name_vi, region_id, sort_order) VALUES
('NGD-A1', 'Nguyen Du Area', 'Khu vực Nguyễn Du', 15, 1)
ON CONFLICT (area_code) DO NOTHING;

-- SMBU (Store) Region (region_id = 10) - Overview area for legacy stores
INSERT INTO areas (area_code, area_name, area_name_vi, region_id, sort_order) VALUES
('SMBU-A1', 'SMBU Overview', 'Tổng quan SMBU', 10, 1)
ON CONFLICT (area_code) DO NOTHING;

-- Ha Noi Region (region_id = 1) - Legacy stores
INSERT INTO areas (area_code, area_name, area_name_vi, region_id, sort_order) VALUES
('HN-A1', 'Ha Noi Legacy', 'Khu vực Hà Nội (Legacy)', 1, 1)
ON CONFLICT (area_code) DO NOTHING;

-- ============================================
-- Step 4: Assign Stores to Areas
-- ============================================

-- OCEAN stores: store_code 30xx → OCEAN-A1, 3019-3021 → OCEAN-A2
UPDATE stores SET area_id = (SELECT area_id FROM areas WHERE area_code = 'OCEAN-A1')
WHERE store_code IN ('3014', '3015', '3016', '3017', '3018');

UPDATE stores SET area_id = (SELECT area_id FROM areas WHERE area_code = 'OCEAN-A2')
WHERE store_code IN ('3019', '3020', '3021');

-- HA NOI CENTER stores: 2001-2002 → HNC-A1, 2003-2005 → HNC-A2
UPDATE stores SET area_id = (SELECT area_id FROM areas WHERE area_code = 'HNC-A1')
WHERE store_code IN ('2001', '2002');

UPDATE stores SET area_id = (SELECT area_id FROM areas WHERE area_code = 'HNC-A2')
WHERE store_code IN ('2003', '2004', '2005');

-- ECO PARK stores: all → ECO-A1
UPDATE stores SET area_id = (SELECT area_id FROM areas WHERE area_code = 'ECO-A1')
WHERE store_code IN ('4001', '4002', '4003');

-- HA DONG stores: 5001-5002 → HD-A1, 5003-5004 → HD-A2
UPDATE stores SET area_id = (SELECT area_id FROM areas WHERE area_code = 'HD-A1')
WHERE store_code IN ('5001', '5002');

UPDATE stores SET area_id = (SELECT area_id FROM areas WHERE area_code = 'HD-A2')
WHERE store_code IN ('5003', '5004');

-- NGD stores: all → NGD-A1
UPDATE stores SET area_id = (SELECT area_id FROM areas WHERE area_code = 'NGD-A1')
WHERE store_code IN ('6001', '6002');

-- Legacy Ha Noi stores (ST001-ST004) → HN-A1
UPDATE stores SET area_id = (SELECT area_id FROM areas WHERE area_code = 'HN-A1')
WHERE store_code IN ('ST001', 'ST002', 'ST003', 'ST004');

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- SELECT a.area_code, a.area_name, r.region_name, COUNT(s.store_id) as store_count
-- FROM areas a
-- JOIN regions r ON a.region_id = r.region_id
-- LEFT JOIN stores s ON s.area_id = a.area_id
-- GROUP BY a.area_id, a.area_code, a.area_name, r.region_name
-- ORDER BY r.region_id, a.sort_order;

-- ============================================
-- ROLLBACK (if needed)
-- ============================================
-- UPDATE stores SET area_id = NULL;
-- DROP TABLE IF EXISTS areas CASCADE;
-- ALTER TABLE stores DROP COLUMN IF EXISTS area_id;
