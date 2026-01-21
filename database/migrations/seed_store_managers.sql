-- ============================================
-- Seed: Store Management Hierarchy (S5-S7)
-- Purpose: Create managers for all geographic levels
-- Date: 2026-01-21
-- ============================================
-- Geographic Structure:
-- Region 1 (Miền Bắc): Zone 1 (Hà Nội), Zone 2 (Bắc Ninh - Hải Phòng)
-- Region 2 (Miền Trung): Zone 3 (Đà Nẵng), Zone 4 (Huế - Quảng Nam)
-- Region 3 (Miền Nam): Zone 5 (TP.HCM), Zone 6 (Bình Dương - Đồng Nai)
--
-- Areas by Zone:
-- Zone 1: Area 1,2,3 (Long Biên, Hà Đông, Cầu Giấy)
-- Zone 2: Area 4,5 (Bắc Ninh, Hải Phòng)
-- Zone 3: Area 6,7 (Hải Châu, Thanh Khê)
-- Zone 4: Area 8,9 (Huế, Hội An)
-- Zone 5: Area 10,11,12 (Tân Phú, Bình Tân, Quận 7)
-- Zone 6: Area 13,14 (Thuận An, Biên Hòa)
-- ============================================

-- Password hash for 'password'
SET @password_hash = '$2y$12$HRy5cF.Vz5P.l.wE4wH0OOIcC5ZD9qxfJPYx1Sv7hwKjK8fVmhJ2e';

-- ============================================
-- STEP 1: Update existing S5-S7 staff with correct geographic scope
-- ============================================

-- S7 (Regional Manager) - Miền Nam (Region 3 - largest market)
UPDATE staff SET
    store_id = NULL,
    region_id = 3,
    zone_id = NULL,
    area_id = NULL
WHERE staff_id = 24 AND job_grade = 'S7';

-- S6 (Zone Manager) - TP.HCM (Zone 5)
UPDATE staff SET
    store_id = NULL,
    region_id = NULL,
    zone_id = 5,
    area_id = NULL,
    line_manager_id = 24
WHERE staff_id = 25 AND job_grade = 'S6';

-- S5 (Area Manager) - Quận Tân Phú (Area 10)
UPDATE staff SET
    store_id = NULL,
    region_id = NULL,
    zone_id = NULL,
    area_id = 10,
    line_manager_id = 25
WHERE staff_id = 26 AND job_grade = 'S5';

-- ============================================
-- STEP 2: Add S7 Regional Managers for other regions
-- ============================================

-- S7 for Region 1 (Miền Bắc)
INSERT INTO staff (staff_name, staff_code, username, email, phone, region_id, role, position, job_grade, password_hash, status, is_active) VALUES
('Nguyễn Minh Bắc', 'S7-R1', 'regionalmgr_north', 'regional.north@aeon.vn', '0901000001', 1, 'STORE_MANAGER', 'Regional Manager - North', 'S7', @password_hash, 'active', 1);

SET @s7_north_id = LAST_INSERT_ID();

-- S7 for Region 2 (Miền Trung)
INSERT INTO staff (staff_name, staff_code, username, email, phone, region_id, role, position, job_grade, password_hash, status, is_active) VALUES
('Trần Văn Trung', 'S7-R2', 'regionalmgr_central', 'regional.central@aeon.vn', '0901000002', 2, 'STORE_MANAGER', 'Regional Manager - Central', 'S7', @password_hash, 'active', 1);

SET @s7_central_id = LAST_INSERT_ID();

-- ============================================
-- STEP 3: Add S6 Zone Managers
-- ============================================

-- Zone 1: Hà Nội (Region 1)
INSERT INTO staff (staff_name, staff_code, username, email, phone, zone_id, role, position, job_grade, line_manager_id, password_hash, status, is_active) VALUES
('Lê Thị Hà Nội', 'S6-Z1', 'zonemgr_hanoi', 'zone.hanoi@aeon.vn', '0902000001', 1, 'STORE_MANAGER', 'Zone Manager - Hà Nội', 'S6', @s7_north_id, @password_hash, 'active', 1);
SET @s6_z1_id = LAST_INSERT_ID();

-- Zone 2: Bắc Ninh - Hải Phòng (Region 1)
INSERT INTO staff (staff_name, staff_code, username, email, phone, zone_id, role, position, job_grade, line_manager_id, password_hash, status, is_active) VALUES
('Phạm Văn Hải', 'S6-Z2', 'zonemgr_bnhp', 'zone.bnhp@aeon.vn', '0902000002', 2, 'STORE_MANAGER', 'Zone Manager - Bắc Ninh/Hải Phòng', 'S6', @s7_north_id, @password_hash, 'active', 1);
SET @s6_z2_id = LAST_INSERT_ID();

-- Zone 3: Đà Nẵng (Region 2)
INSERT INTO staff (staff_name, staff_code, username, email, phone, zone_id, role, position, job_grade, line_manager_id, password_hash, status, is_active) VALUES
('Hoàng Thị Đà Nẵng', 'S6-Z3', 'zonemgr_danang', 'zone.danang@aeon.vn', '0902000003', 3, 'STORE_MANAGER', 'Zone Manager - Đà Nẵng', 'S6', @s7_central_id, @password_hash, 'active', 1);
SET @s6_z3_id = LAST_INSERT_ID();

-- Zone 4: Huế - Quảng Nam (Region 2)
INSERT INTO staff (staff_name, staff_code, username, email, phone, zone_id, role, position, job_grade, line_manager_id, password_hash, status, is_active) VALUES
('Võ Văn Huế', 'S6-Z4', 'zonemgr_hueqn', 'zone.hueqn@aeon.vn', '0902000004', 4, 'STORE_MANAGER', 'Zone Manager - Huế/Quảng Nam', 'S6', @s7_central_id, @password_hash, 'active', 1);
SET @s6_z4_id = LAST_INSERT_ID();

-- Zone 6: Bình Dương - Đồng Nai (Region 3 - existing S7 = staff_id 24)
INSERT INTO staff (staff_name, staff_code, username, email, phone, zone_id, role, position, job_grade, line_manager_id, password_hash, status, is_active) VALUES
('Đỗ Thị Bình Dương', 'S6-Z6', 'zonemgr_bddn', 'zone.bddn@aeon.vn', '0902000006', 6, 'STORE_MANAGER', 'Zone Manager - Bình Dương/Đồng Nai', 'S6', 24, @password_hash, 'active', 1);
SET @s6_z6_id = LAST_INSERT_ID();

-- ============================================
-- STEP 4: Add S5 Area Managers
-- ============================================

-- Areas in Zone 1 (Hà Nội)
INSERT INTO staff (staff_name, staff_code, username, email, phone, area_id, role, position, job_grade, line_manager_id, password_hash, status, is_active) VALUES
('Nguyễn Văn Long Biên', 'S5-A1', 'areamgr_longbien', 'area.longbien@aeon.vn', '0903000001', 1, 'STORE_MANAGER', 'Area Manager - Long Biên', 'S5', @s6_z1_id, @password_hash, 'active', 1),
('Trần Thị Hà Đông', 'S5-A2', 'areamgr_hadong', 'area.hadong@aeon.vn', '0903000002', 2, 'STORE_MANAGER', 'Area Manager - Hà Đông', 'S5', @s6_z1_id, @password_hash, 'active', 1),
('Lê Văn Cầu Giấy', 'S5-A3', 'areamgr_caugiay', 'area.caugiay@aeon.vn', '0903000003', 3, 'STORE_MANAGER', 'Area Manager - Cầu Giấy', 'S5', @s6_z1_id, @password_hash, 'active', 1);

-- Areas in Zone 2 (Bắc Ninh - Hải Phòng)
INSERT INTO staff (staff_name, staff_code, username, email, phone, area_id, role, position, job_grade, line_manager_id, password_hash, status, is_active) VALUES
('Phạm Văn Bắc Ninh', 'S5-A4', 'areamgr_bacninh', 'area.bacninh@aeon.vn', '0903000004', 4, 'STORE_MANAGER', 'Area Manager - Bắc Ninh', 'S5', @s6_z2_id, @password_hash, 'active', 1),
('Hoàng Thị Hải Phòng', 'S5-A5', 'areamgr_haiphong', 'area.haiphong@aeon.vn', '0903000005', 5, 'STORE_MANAGER', 'Area Manager - Hải Phòng', 'S5', @s6_z2_id, @password_hash, 'active', 1);

-- Areas in Zone 3 (Đà Nẵng)
INSERT INTO staff (staff_name, staff_code, username, email, phone, area_id, role, position, job_grade, line_manager_id, password_hash, status, is_active) VALUES
('Võ Văn Hải Châu', 'S5-A6', 'areamgr_haichau', 'area.haichau@aeon.vn', '0903000006', 6, 'STORE_MANAGER', 'Area Manager - Hải Châu', 'S5', @s6_z3_id, @password_hash, 'active', 1),
('Đặng Thị Thanh Khê', 'S5-A7', 'areamgr_thanhkhe', 'area.thanhkhe@aeon.vn', '0903000007', 7, 'STORE_MANAGER', 'Area Manager - Thanh Khê', 'S5', @s6_z3_id, @password_hash, 'active', 1);

-- Areas in Zone 4 (Huế - Quảng Nam)
INSERT INTO staff (staff_name, staff_code, username, email, phone, area_id, role, position, job_grade, line_manager_id, password_hash, status, is_active) VALUES
('Nguyễn Thị Huế', 'S5-A8', 'areamgr_hue', 'area.hue@aeon.vn', '0903000008', 8, 'STORE_MANAGER', 'Area Manager - Huế', 'S5', @s6_z4_id, @password_hash, 'active', 1),
('Lê Văn Hội An', 'S5-A9', 'areamgr_hoian', 'area.hoian@aeon.vn', '0903000009', 9, 'STORE_MANAGER', 'Area Manager - Hội An', 'S5', @s6_z4_id, @password_hash, 'active', 1);

-- Areas in Zone 5 (TP.HCM) - existing S6 = staff_id 25, existing S5 = staff_id 26 (Area 10)
INSERT INTO staff (staff_name, staff_code, username, email, phone, area_id, role, position, job_grade, line_manager_id, password_hash, status, is_active) VALUES
('Trần Văn Bình Tân', 'S5-A11', 'areamgr_binhtan', 'area.binhtan@aeon.vn', '0903000011', 11, 'STORE_MANAGER', 'Area Manager - Bình Tân', 'S5', 25, @password_hash, 'active', 1),
('Phạm Thị Quận 7', 'S5-A12', 'areamgr_quan7', 'area.quan7@aeon.vn', '0903000012', 12, 'STORE_MANAGER', 'Area Manager - Quận 7', 'S5', 25, @password_hash, 'active', 1);

-- Update existing S5 (staff_id 26) to report to S6 (staff_id 25)
UPDATE staff SET line_manager_id = 25 WHERE staff_id = 26;

-- Areas in Zone 6 (Bình Dương - Đồng Nai)
INSERT INTO staff (staff_name, staff_code, username, email, phone, area_id, role, position, job_grade, line_manager_id, password_hash, status, is_active) VALUES
('Hoàng Văn Thuận An', 'S5-A13', 'areamgr_thuanan', 'area.thuanan@aeon.vn', '0903000013', 13, 'STORE_MANAGER', 'Area Manager - Thuận An', 'S5', @s6_z6_id, @password_hash, 'active', 1),
('Đỗ Thị Biên Hòa', 'S5-A14', 'areamgr_bienhoa', 'area.bienhoa@aeon.vn', '0903000014', 14, 'STORE_MANAGER', 'Area Manager - Biên Hòa', 'S5', @s6_z6_id, @password_hash, 'active', 1);

-- ============================================
-- VERIFICATION QUERIES (Run after seed)
-- ============================================
-- SELECT job_grade, COUNT(*) as count FROM staff WHERE job_grade IN ('S5','S6','S7') GROUP BY job_grade ORDER BY job_grade DESC;
-- SELECT s.staff_id, s.staff_name, s.job_grade, s.region_id, r.region_name, s.zone_id, z.zone_name, s.area_id, a.area_name
--   FROM staff s
--   LEFT JOIN regions r ON s.region_id = r.region_id
--   LEFT JOIN zones z ON s.zone_id = z.zone_id
--   LEFT JOIN areas a ON s.area_id = a.area_id
--   WHERE s.job_grade IN ('S5','S6','S7')
--   ORDER BY s.job_grade DESC, s.staff_id;
