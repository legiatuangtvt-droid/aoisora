-- OptiChain Test Data Seed Script
-- Run this AFTER schema_full.sql to populate test data
-- Date: 2025-12-27

-- ============================================
-- REGIONS (4 regions)
-- ============================================
INSERT INTO "regions" ("region_id", "region_name", "region_code", "description") VALUES
(1, 'Ho Chi Minh City', 'HCM', 'Southern region - HCMC area'),
(2, 'Ha Noi', 'HN', 'Northern region - Hanoi area'),
(3, 'Da Nang', 'DN', 'Central region - Da Nang area'),
(4, 'Can Tho', 'CT', 'Mekong Delta region')
ON CONFLICT (region_code) DO NOTHING;

SELECT setval('regions_region_id_seq', (SELECT COALESCE(MAX(region_id), 1) FROM regions));

-- ============================================
-- DEPARTMENTS (5 departments)
-- ============================================
INSERT INTO "departments" ("department_id", "department_name", "department_code", "description") VALUES
(1, 'Operations', 'OPS', 'Store operations and daily management'),
(2, 'Sales', 'SALES', 'Sales and customer service'),
(3, 'Inventory', 'INV', 'Stock management and inventory'),
(4, 'Fresh Food', 'FRESH', 'Fresh produce and food preparation'),
(5, 'Administration', 'ADMIN', 'Administrative and back office')
ON CONFLICT (department_code) DO NOTHING;

SELECT setval('departments_department_id_seq', (SELECT COALESCE(MAX(department_id), 1) FROM departments));

-- ============================================
-- STORES (8 stores across regions)
-- ============================================
INSERT INTO "stores" ("store_id", "store_name", "store_code", "region_id", "address", "phone", "email", "status") VALUES
(1, 'AEON MaxValu Nguyen Cu Trinh', 'AMPM_D1_NCT', 1, '222 Nguyen Cu Trinh, Quan 1, TP.HCM', '028-3838-1001', 'nct@aeon.vn', 'active'),
(2, 'AEON MaxValu Le Van Sy', 'AMPM_D3_LVS', 1, '45 Le Van Sy, Quan 3, TP.HCM', '028-3838-1002', 'lvs@aeon.vn', 'active'),
(3, 'AEON MaxValu CMT8', 'AMPM_D10_CMT', 1, '123 Cach Mang Thang 8, Quan 10, TP.HCM', '028-3838-1003', 'cmt8@aeon.vn', 'active'),
(4, 'AEON MaxValu Sala', 'AMPM_D2_SALA', 1, 'Sala District 2, Thu Duc, TP.HCM', '028-3838-1004', 'sala@aeon.vn', 'active'),
(5, 'AEON MaxValu Cau Giay', 'AMPM_HN_CG', 2, '88 Cau Giay, Ha Noi', '024-3838-2001', 'caugiay@aeon.vn', 'active'),
(6, 'AEON MaxValu Long Bien', 'AMPM_HN_LB', 2, '27 Co Linh, Long Bien, Ha Noi', '024-3838-2002', 'longbien@aeon.vn', 'active'),
(7, 'AEON MaxValu Son Tra', 'AMPM_DN_ST', 3, '100 Ngo Quyen, Son Tra, Da Nang', '0236-3838-3001', 'sontra@aeon.vn', 'active'),
(8, 'AEON MaxValu Ninh Kieu', 'AMPM_CT_NK', 4, '50 30/4, Ninh Kieu, Can Tho', '0292-3838-4001', 'ninhkieu@aeon.vn', 'active')
ON CONFLICT (store_code) DO NOTHING;

SELECT setval('stores_store_id_seq', (SELECT COALESCE(MAX(store_id), 1) FROM stores));

-- ============================================
-- STAFF (40 staff members - mix of roles)
-- Password hash is for 'password123'
-- ============================================
INSERT INTO "staff" ("staff_id", "staff_name", "staff_code", "email", "phone", "store_id", "department_id", "role", "password_hash", "is_active") VALUES
-- Store 1: AEON MaxValu Nguyen Cu Trinh (8 staff)
(1, 'Nguyen Van An', 'AMPM_D1_MGR_01', 'an.nguyen@aeon.vn', '0901-111-001', 1, 1, 'MANAGER', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.GQmQYX7KMwYzOe', true),
(2, 'Vo Minh Tuan', 'AMPM_D1_LEAD_01', 'tuan.vo@aeon.vn', '0901-111-002', 1, 1, 'STORE_LEADER_G3', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.GQmQYX7KMwYzOe', true),
(3, 'Dang Thu Ha', 'AMPM_D1_STAFF_01', 'ha.dang@aeon.vn', '0901-111-003', 1, 2, 'STAFF', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.GQmQYX7KMwYzOe', true),
(4, 'Hoang Xuan Kien', 'AMPM_D1_STAFF_02', 'kien.hoang@aeon.vn', '0901-111-004', 1, 2, 'STAFF', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.GQmQYX7KMwYzOe', true),
(5, 'Bui Thi Lan', 'AMPM_D1_STAFF_03', 'lan.bui@aeon.vn', '0901-111-005', 1, 3, 'STAFF', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.GQmQYX7KMwYzOe', true),
(6, 'Le Quoc Phong', 'AMPM_D1_STAFF_04', 'phong.le@aeon.vn', '0901-111-006', 1, 3, 'STAFF', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.GQmQYX7KMwYzOe', true),
(7, 'Tran Ngoc Hanh', 'AMPM_D1_STAFF_05', 'hanh.tran@aeon.vn', '0901-111-007', 1, 4, 'STAFF', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.GQmQYX7KMwYzOe', true),
(8, 'Pham Duc Anh', 'AMPM_D1_STAFF_06', 'anh.pham@aeon.vn', '0901-111-008', 1, 4, 'STAFF', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.GQmQYX7KMwYzOe', true),

-- Store 2: AEON MaxValu Le Van Sy (6 staff)
(9, 'Tran Thi Bich', 'AMPM_D3_MGR_01', 'bich.tran@aeon.vn', '0901-222-001', 2, 1, 'MANAGER', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.GQmQYX7KMwYzOe', true),
(10, 'Ngo Gia Bao', 'AMPM_D3_LEAD_01', 'bao.ngo@aeon.vn', '0901-222-002', 2, 1, 'STORE_LEADER_G3', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.GQmQYX7KMwYzOe', true),
(11, 'Duong Ngoc Mai', 'AMPM_D3_STAFF_01', 'mai.duong@aeon.vn', '0901-222-003', 2, 2, 'STAFF', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.GQmQYX7KMwYzOe', true),
(12, 'Ly Hoang Nam', 'AMPM_D3_STAFF_02', 'nam.ly@aeon.vn', '0901-222-004', 2, 2, 'STAFF', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.GQmQYX7KMwYzOe', true),
(13, 'Vu Thi Hong', 'AMPM_D3_STAFF_03', 'hong.vu@aeon.vn', '0901-222-005', 2, 3, 'STAFF', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.GQmQYX7KMwYzOe', true),
(14, 'Do Minh Quan', 'AMPM_D3_STAFF_04', 'quan.do@aeon.vn', '0901-222-006', 2, 4, 'STAFF', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.GQmQYX7KMwYzOe', true),

-- Store 3: AEON MaxValu CMT8 (6 staff)
(15, 'Le Thi Cam', 'AMPM_D10_MGR_01', 'cam.le@aeon.vn', '0901-333-001', 3, 1, 'MANAGER', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.GQmQYX7KMwYzOe', true),
(16, 'Nguyen Thanh Dat', 'AMPM_D10_LEAD_01', 'dat.nguyen@aeon.vn', '0901-333-002', 3, 1, 'STORE_LEADER_G3', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.GQmQYX7KMwYzOe', true),
(17, 'Phan Thi Dung', 'AMPM_D10_STAFF_01', 'dung.phan@aeon.vn', '0901-333-003', 3, 2, 'STAFF', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.GQmQYX7KMwYzOe', true),
(18, 'Trinh Van Em', 'AMPM_D10_STAFF_02', 'em.trinh@aeon.vn', '0901-333-004', 3, 2, 'STAFF', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.GQmQYX7KMwYzOe', true),
(19, 'Cao Thi Gia', 'AMPM_D10_STAFF_03', 'gia.cao@aeon.vn', '0901-333-005', 3, 3, 'STAFF', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.GQmQYX7KMwYzOe', true),
(20, 'Dinh Hoang Hai', 'AMPM_D10_STAFF_04', 'hai.dinh@aeon.vn', '0901-333-006', 3, 4, 'STAFF', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.GQmQYX7KMwYzOe', true),

-- Store 4: AEON MaxValu Sala (5 staff)
(21, 'Vo Phuong Chi', 'AMPM_D2_MGR_01', 'chi.vo@aeon.vn', '0901-444-001', 4, 1, 'MANAGER', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.GQmQYX7KMwYzOe', true),
(22, 'Lam Thi Kieu', 'AMPM_D2_LEAD_01', 'kieu.lam@aeon.vn', '0901-444-002', 4, 1, 'STORE_LEADER_G3', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.GQmQYX7KMwYzOe', true),
(23, 'Ho Van Long', 'AMPM_D2_STAFF_01', 'long.ho@aeon.vn', '0901-444-003', 4, 2, 'STAFF', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.GQmQYX7KMwYzOe', true),
(24, 'Mai Thi My', 'AMPM_D2_STAFF_02', 'my.mai@aeon.vn', '0901-444-004', 4, 3, 'STAFF', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.GQmQYX7KMwYzOe', true),
(25, 'Ta Van Nhat', 'AMPM_D2_STAFF_03', 'nhat.ta@aeon.vn', '0901-444-005', 4, 4, 'STAFF', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.GQmQYX7KMwYzOe', true),

-- Store 5: AEON MaxValu Cau Giay - Hanoi (5 staff)
(26, 'Nguyen Thi Oanh', 'AMPM_HN_CG_MGR_01', 'oanh.nguyen@aeon.vn', '0901-555-001', 5, 1, 'MANAGER', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.GQmQYX7KMwYzOe', true),
(27, 'Tran Van Phuc', 'AMPM_HN_CG_LEAD_01', 'phuc.tran@aeon.vn', '0901-555-002', 5, 1, 'STORE_LEADER_G3', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.GQmQYX7KMwYzOe', true),
(28, 'Le Thi Quyen', 'AMPM_HN_CG_STAFF_01', 'quyen.le@aeon.vn', '0901-555-003', 5, 2, 'STAFF', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.GQmQYX7KMwYzOe', true),
(29, 'Pham Van Rang', 'AMPM_HN_CG_STAFF_02', 'rang.pham@aeon.vn', '0901-555-004', 5, 3, 'STAFF', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.GQmQYX7KMwYzOe', true),
(30, 'Hoang Thi Son', 'AMPM_HN_CG_STAFF_03', 'son.hoang@aeon.vn', '0901-555-005', 5, 4, 'STAFF', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.GQmQYX7KMwYzOe', true),

-- Store 6: AEON MaxValu Long Bien - Hanoi (4 staff)
(31, 'Vu Van Tien', 'AMPM_HN_LB_MGR_01', 'tien.vu@aeon.vn', '0901-666-001', 6, 1, 'MANAGER', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.GQmQYX7KMwYzOe', true),
(32, 'Do Thi Uyen', 'AMPM_HN_LB_LEAD_01', 'uyen.do@aeon.vn', '0901-666-002', 6, 1, 'STORE_LEADER_G3', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.GQmQYX7KMwYzOe', true),
(33, 'Bui Van Vinh', 'AMPM_HN_LB_STAFF_01', 'vinh.bui@aeon.vn', '0901-666-003', 6, 2, 'STAFF', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.GQmQYX7KMwYzOe', true),
(34, 'Ly Thi Xuan', 'AMPM_HN_LB_STAFF_02', 'xuan.ly@aeon.vn', '0901-666-004', 6, 3, 'STAFF', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.GQmQYX7KMwYzOe', true),

-- Store 7: AEON MaxValu Son Tra - Da Nang (3 staff)
(35, 'Nguyen Van Yen', 'AMPM_DN_ST_MGR_01', 'yen.nguyen@aeon.vn', '0901-777-001', 7, 1, 'MANAGER', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.GQmQYX7KMwYzOe', true),
(36, 'Tran Thi Zung', 'AMPM_DN_ST_LEAD_01', 'zung.tran@aeon.vn', '0901-777-002', 7, 1, 'STORE_LEADER_G3', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.GQmQYX7KMwYzOe', true),
(37, 'Le Van Bach', 'AMPM_DN_ST_STAFF_01', 'bach.le@aeon.vn', '0901-777-003', 7, 2, 'STAFF', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.GQmQYX7KMwYzOe', true),

-- Store 8: AEON MaxValu Ninh Kieu - Can Tho (3 staff)
(38, 'Pham Thi Cuc', 'AMPM_CT_NK_MGR_01', 'cuc.pham@aeon.vn', '0901-888-001', 8, 1, 'MANAGER', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.GQmQYX7KMwYzOe', true),
(39, 'Vo Van Duy', 'AMPM_CT_NK_LEAD_01', 'duy.vo@aeon.vn', '0901-888-002', 8, 1, 'STORE_LEADER_G3', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.GQmQYX7KMwYzOe', true),
(40, 'Nguyen Thi Em', 'AMPM_CT_NK_STAFF_01', 'em.nguyen@aeon.vn', '0901-888-003', 8, 2, 'STAFF', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.GQmQYX7KMwYzOe', true)
ON CONFLICT (staff_code) DO NOTHING;

SELECT setval('staff_staff_id_seq', (SELECT COALESCE(MAX(staff_id), 1) FROM staff));

-- Update store managers
UPDATE "stores" SET manager_id = 1 WHERE store_id = 1;
UPDATE "stores" SET manager_id = 9 WHERE store_id = 2;
UPDATE "stores" SET manager_id = 15 WHERE store_id = 3;
UPDATE "stores" SET manager_id = 21 WHERE store_id = 4;
UPDATE "stores" SET manager_id = 26 WHERE store_id = 5;
UPDATE "stores" SET manager_id = 31 WHERE store_id = 6;
UPDATE "stores" SET manager_id = 35 WHERE store_id = 7;
UPDATE "stores" SET manager_id = 38 WHERE store_id = 8;

-- ============================================
-- SHIFT CODES (15 shift types)
-- ============================================
INSERT INTO "shift_codes" ("shift_code_id", "shift_code", "shift_name", "start_time", "end_time", "duration_hours", "color_code", "is_active") VALUES
-- 8-hour shifts
(1, 'V8.6', 'Ca sang 8h', '06:00:00', '14:00:00', 8.00, '#4F46E5', true),
(2, 'V8.7', 'Ca sang 8h (7h)', '07:00:00', '15:00:00', 8.00, '#6366F1', true),
(3, 'V8.8', 'Ca trua 8h', '08:00:00', '16:00:00', 8.00, '#818CF8', true),
(4, 'V8.14', 'Ca chieu 8h', '14:00:00', '22:00:00', 8.00, '#10B981', true),
(5, 'V8.1430', 'Ca chieu 8h (14h30)', '14:30:00', '22:30:00', 8.00, '#34D399', true),
(6, 'V8.15', 'Ca chieu 8h (15h)', '15:00:00', '23:00:00', 8.00, '#6EE7B7', true),

-- 6-hour shifts
(7, 'V6.6', 'Ca sang 6h', '06:00:00', '12:00:00', 6.00, '#F59E0B', true),
(8, 'V6.8', 'Ca trua 6h', '08:00:00', '14:00:00', 6.00, '#FBBF24', true),
(9, 'V6.10', 'Ca trua 6h (10h)', '10:00:00', '16:00:00', 6.00, '#FCD34D', true),
(10, 'V6.16', 'Ca chieu 6h', '16:00:00', '22:00:00', 6.00, '#EF4444', true),
(11, 'V6.17', 'Ca chieu 6h (17h)', '17:00:00', '23:00:00', 6.00, '#F87171', true),

-- 4-hour shifts
(12, 'V4.6', 'Ca sang 4h', '06:00:00', '10:00:00', 4.00, '#8B5CF6', true),
(13, 'V4.10', 'Ca trua 4h', '10:00:00', '14:00:00', 4.00, '#A78BFA', true),
(14, 'V4.18', 'Ca toi 4h', '18:00:00', '22:00:00', 4.00, '#C4B5FD', true),

-- Special
(15, 'OFF', 'Nghi phep', '00:00:00', '00:00:00', 0.00, '#9CA3AF', true)
ON CONFLICT (shift_code) DO NOTHING;

SELECT setval('shift_codes_shift_code_id_seq', (SELECT COALESCE(MAX(shift_code_id), 1) FROM shift_codes));

-- ============================================
-- SHIFT ASSIGNMENTS (Current week + next week)
-- For Store 1: AEON MaxValu Nguyen Cu Trinh
-- ============================================

-- Generate dates for current week (Mon-Sun) and next week
-- Using 2025-12-22 as Monday of current week (adjust as needed)

-- Store 1 - Staff assignments for current week (Dec 22-28, 2025)
INSERT INTO "shift_assignments" ("staff_id", "store_id", "shift_date", "shift_code_id", "status", "assigned_by") VALUES
-- Monday 2025-12-22
(2, 1, '2025-12-22', 1, 'confirmed', 1),  -- Vo Minh Tuan - V8.6
(3, 1, '2025-12-22', 4, 'confirmed', 1),  -- Dang Thu Ha - V8.14
(4, 1, '2025-12-22', 7, 'assigned', 1),   -- Hoang Xuan Kien - V6.6
(5, 1, '2025-12-22', 10, 'assigned', 1),  -- Bui Thi Lan - V6.16
(6, 1, '2025-12-22', 1, 'confirmed', 1),  -- Le Quoc Phong - V8.6
(7, 1, '2025-12-22', 5, 'assigned', 1),   -- Tran Ngoc Hanh - V8.1430
(8, 1, '2025-12-22', 15, 'confirmed', 1), -- Pham Duc Anh - OFF

-- Tuesday 2025-12-23
(2, 1, '2025-12-23', 1, 'confirmed', 1),
(3, 1, '2025-12-23', 5, 'confirmed', 1),
(4, 1, '2025-12-23', 8, 'assigned', 1),
(5, 1, '2025-12-23', 10, 'assigned', 1),
(6, 1, '2025-12-23', 2, 'confirmed', 1),
(7, 1, '2025-12-23', 4, 'assigned', 1),
(8, 1, '2025-12-23', 11, 'assigned', 1),

-- Wednesday 2025-12-24
(2, 1, '2025-12-24', 1, 'confirmed', 1),
(3, 1, '2025-12-24', 4, 'confirmed', 1),
(4, 1, '2025-12-24', 7, 'assigned', 1),
(5, 1, '2025-12-24', 15, 'confirmed', 1), -- OFF
(6, 1, '2025-12-24', 1, 'confirmed', 1),
(7, 1, '2025-12-24', 5, 'assigned', 1),
(8, 1, '2025-12-24', 10, 'assigned', 1),

-- Thursday 2025-12-25 (Christmas)
(2, 1, '2025-12-25', 3, 'confirmed', 1),
(3, 1, '2025-12-25', 6, 'confirmed', 1),
(4, 1, '2025-12-25', 8, 'assigned', 1),
(5, 1, '2025-12-25', 11, 'assigned', 1),
(6, 1, '2025-12-25', 15, 'confirmed', 1), -- OFF
(7, 1, '2025-12-25', 4, 'assigned', 1),
(8, 1, '2025-12-25', 9, 'assigned', 1),

-- Friday 2025-12-26
(2, 1, '2025-12-26', 1, 'confirmed', 1),
(3, 1, '2025-12-26', 4, 'confirmed', 1),
(4, 1, '2025-12-26', 7, 'assigned', 1),
(5, 1, '2025-12-26', 10, 'assigned', 1),
(6, 1, '2025-12-26', 2, 'confirmed', 1),
(7, 1, '2025-12-26', 5, 'assigned', 1),
(8, 1, '2025-12-26', 11, 'assigned', 1),

-- Saturday 2025-12-27 (Today)
(2, 1, '2025-12-27', 1, 'confirmed', 1),
(3, 1, '2025-12-27', 5, 'confirmed', 1),
(4, 1, '2025-12-27', 8, 'assigned', 1),
(5, 1, '2025-12-27', 10, 'assigned', 1),
(6, 1, '2025-12-27', 1, 'confirmed', 1),
(7, 1, '2025-12-27', 5, 'assigned', 1),
(8, 1, '2025-12-27', 10, 'assigned', 1),

-- Sunday 2025-12-28
(2, 1, '2025-12-28', 15, 'confirmed', 1), -- OFF
(3, 1, '2025-12-28', 4, 'confirmed', 1),
(4, 1, '2025-12-28', 7, 'assigned', 1),
(5, 1, '2025-12-28', 10, 'assigned', 1),
(6, 1, '2025-12-28', 1, 'confirmed', 1),
(7, 1, '2025-12-28', 15, 'confirmed', 1), -- OFF
(8, 1, '2025-12-28', 4, 'assigned', 1)

ON CONFLICT (staff_id, shift_date, shift_code_id) DO NOTHING;

-- Store 2 - Staff assignments for current week
INSERT INTO "shift_assignments" ("staff_id", "store_id", "shift_date", "shift_code_id", "status", "assigned_by") VALUES
-- Monday 2025-12-22
(10, 2, '2025-12-22', 1, 'confirmed', 9),
(11, 2, '2025-12-22', 4, 'confirmed', 9),
(12, 2, '2025-12-22', 7, 'assigned', 9),
(13, 2, '2025-12-22', 10, 'assigned', 9),
(14, 2, '2025-12-22', 5, 'assigned', 9),

-- Tuesday 2025-12-23
(10, 2, '2025-12-23', 1, 'confirmed', 9),
(11, 2, '2025-12-23', 5, 'confirmed', 9),
(12, 2, '2025-12-23', 8, 'assigned', 9),
(13, 2, '2025-12-23', 10, 'assigned', 9),
(14, 2, '2025-12-23', 4, 'assigned', 9),

-- Wednesday 2025-12-24
(10, 2, '2025-12-24', 1, 'confirmed', 9),
(11, 2, '2025-12-24', 4, 'confirmed', 9),
(12, 2, '2025-12-24', 15, 'confirmed', 9), -- OFF
(13, 2, '2025-12-24', 7, 'assigned', 9),
(14, 2, '2025-12-24', 10, 'assigned', 9),

-- Thursday 2025-12-25
(10, 2, '2025-12-25', 3, 'confirmed', 9),
(11, 2, '2025-12-25', 6, 'confirmed', 9),
(12, 2, '2025-12-25', 8, 'assigned', 9),
(13, 2, '2025-12-25', 11, 'assigned', 9),
(14, 2, '2025-12-25', 15, 'confirmed', 9), -- OFF

-- Friday 2025-12-26
(10, 2, '2025-12-26', 1, 'confirmed', 9),
(11, 2, '2025-12-26', 4, 'confirmed', 9),
(12, 2, '2025-12-26', 7, 'assigned', 9),
(13, 2, '2025-12-26', 10, 'assigned', 9),
(14, 2, '2025-12-26', 5, 'assigned', 9),

-- Saturday 2025-12-27
(10, 2, '2025-12-27', 1, 'confirmed', 9),
(11, 2, '2025-12-27', 5, 'confirmed', 9),
(12, 2, '2025-12-27', 8, 'assigned', 9),
(13, 2, '2025-12-27', 10, 'assigned', 9),
(14, 2, '2025-12-27', 4, 'assigned', 9),

-- Sunday 2025-12-28
(10, 2, '2025-12-28', 15, 'confirmed', 9), -- OFF
(11, 2, '2025-12-28', 4, 'confirmed', 9),
(12, 2, '2025-12-28', 7, 'assigned', 9),
(13, 2, '2025-12-28', 10, 'assigned', 9),
(14, 2, '2025-12-28', 5, 'assigned', 9)

ON CONFLICT (staff_id, shift_date, shift_code_id) DO NOTHING;

-- Store 3 - Staff assignments for current week
INSERT INTO "shift_assignments" ("staff_id", "store_id", "shift_date", "shift_code_id", "status", "assigned_by") VALUES
(16, 3, '2025-12-22', 1, 'confirmed', 15),
(17, 3, '2025-12-22', 4, 'confirmed', 15),
(18, 3, '2025-12-22', 7, 'assigned', 15),
(19, 3, '2025-12-22', 10, 'assigned', 15),
(20, 3, '2025-12-22', 5, 'assigned', 15),
(16, 3, '2025-12-23', 1, 'confirmed', 15),
(17, 3, '2025-12-23', 5, 'confirmed', 15),
(18, 3, '2025-12-23', 8, 'assigned', 15),
(19, 3, '2025-12-23', 10, 'assigned', 15),
(20, 3, '2025-12-23', 4, 'assigned', 15),
(16, 3, '2025-12-24', 1, 'confirmed', 15),
(17, 3, '2025-12-24', 4, 'confirmed', 15),
(18, 3, '2025-12-24', 15, 'confirmed', 15),
(19, 3, '2025-12-24', 7, 'assigned', 15),
(20, 3, '2025-12-24', 10, 'assigned', 15),
(16, 3, '2025-12-25', 3, 'confirmed', 15),
(17, 3, '2025-12-25', 6, 'confirmed', 15),
(18, 3, '2025-12-25', 8, 'assigned', 15),
(19, 3, '2025-12-25', 11, 'assigned', 15),
(20, 3, '2025-12-25', 15, 'confirmed', 15),
(16, 3, '2025-12-26', 1, 'confirmed', 15),
(17, 3, '2025-12-26', 4, 'confirmed', 15),
(18, 3, '2025-12-26', 7, 'assigned', 15),
(19, 3, '2025-12-26', 10, 'assigned', 15),
(20, 3, '2025-12-26', 5, 'assigned', 15),
(16, 3, '2025-12-27', 1, 'confirmed', 15),
(17, 3, '2025-12-27', 5, 'confirmed', 15),
(18, 3, '2025-12-27', 8, 'assigned', 15),
(19, 3, '2025-12-27', 10, 'assigned', 15),
(20, 3, '2025-12-27', 4, 'assigned', 15),
(16, 3, '2025-12-28', 15, 'confirmed', 15),
(17, 3, '2025-12-28', 4, 'confirmed', 15),
(18, 3, '2025-12-28', 7, 'assigned', 15),
(19, 3, '2025-12-28', 10, 'assigned', 15),
(20, 3, '2025-12-28', 5, 'assigned', 15)
ON CONFLICT (staff_id, shift_date, shift_code_id) DO NOTHING;

-- ============================================
-- MANUALS (10 manuals)
-- ============================================
INSERT INTO "manuals" ("manual_id", "manual_name", "manual_url", "description") VALUES
(1, 'Store Opening Procedures', 'https://docs.aeon.vn/manuals/store-opening.pdf', 'Standard operating procedures for opening the store'),
(2, 'Store Closing Procedures', 'https://docs.aeon.vn/manuals/store-closing.pdf', 'Standard operating procedures for closing the store'),
(3, 'Cash Handling Guide', 'https://docs.aeon.vn/manuals/cash-handling.pdf', 'Guidelines for handling cash and POS transactions'),
(4, 'Food Safety Standards', 'https://docs.aeon.vn/manuals/food-safety.pdf', 'Food handling and safety requirements'),
(5, 'Customer Service Excellence', 'https://docs.aeon.vn/manuals/customer-service.pdf', 'Best practices for customer interactions'),
(6, 'Inventory Management', 'https://docs.aeon.vn/manuals/inventory.pdf', 'Stock management and inventory procedures'),
(7, 'Emergency Procedures', 'https://docs.aeon.vn/manuals/emergency.pdf', 'Emergency response and evacuation procedures'),
(8, 'Equipment Maintenance', 'https://docs.aeon.vn/manuals/equipment.pdf', 'Equipment care and maintenance schedules'),
(9, 'Quality Control Checklist', 'https://docs.aeon.vn/manuals/quality-control.pdf', 'Daily quality control procedures'),
(10, 'Staff Training Guide', 'https://docs.aeon.vn/manuals/training.pdf', 'New staff onboarding and training materials')
ON CONFLICT DO NOTHING;

SELECT setval('manuals_manual_id_seq', (SELECT COALESCE(MAX(manual_id), 1) FROM manuals));

-- ============================================
-- CHECK LISTS (20 checklist items)
-- ============================================
INSERT INTO "check_lists" ("check_list_id", "check_list_name", "description", "is_active") VALUES
(1, 'Verify temperature of refrigerators', 'Check all refrigerator units are maintaining correct temperature', true),
(2, 'Clean display shelves', 'Wipe down and organize product displays', true),
(3, 'Check inventory levels', 'Review stock levels and identify low inventory items', true),
(4, 'Verify price tags', 'Ensure all products have correct price tags displayed', true),
(5, 'Clean floors and aisles', 'Sweep and mop all floor areas', true),
(6, 'Check POS systems', 'Verify all registers are working properly', true),
(7, 'Restock products', 'Fill empty shelves from storage', true),
(8, 'Check expiry dates', 'Remove expired products from shelves', true),
(9, 'Clean restrooms', 'Sanitize and restock restroom supplies', true),
(10, 'Verify security systems', 'Check cameras and alarm systems', true),
(11, 'Count cash drawer', 'Verify starting cash amount', true),
(12, 'Check staff schedules', 'Confirm all staff have arrived', true),
(13, 'Review daily promotions', 'Update promotional signage', true),
(14, 'Test emergency exits', 'Verify all exits are accessible', true),
(15, 'Check fresh produce quality', 'Inspect and rotate fresh items', true),
(16, 'Clean checkout counters', 'Sanitize all checkout areas', true),
(17, 'Verify delivery schedule', 'Check incoming deliveries for the day', true),
(18, 'Update digital displays', 'Change promotional content on screens', true),
(19, 'Check shopping carts/baskets', 'Clean and organize carts', true),
(20, 'Review customer feedback', 'Address any pending customer issues', true)
ON CONFLICT DO NOTHING;

SELECT setval('check_lists_check_list_id_seq', (SELECT COALESCE(MAX(check_list_id), 1) FROM check_lists));

-- ============================================
-- TASKS (30 tasks across stores)
-- ============================================
INSERT INTO "tasks" ("task_id", "task_name", "task_description", "manual_id", "task_type_id", "response_type_id", "dept_id", "assigned_store_id", "assigned_staff_id", "do_staff_id", "status_id", "priority", "start_date", "end_date", "start_time", "created_staff_id") VALUES
-- Store 1 Tasks
(1, 'Morning Store Opening', 'Complete all opening procedures', 1, 3, 5, 1, 1, 2, 2, 7, 'high', '2025-12-27', '2025-12-27', '06:00:00', 1),
(2, 'Temperature Check - All Units', 'Record temperatures of all refrigeration units', 4, 1, 4, 3, 1, 5, 5, 8, 'high', '2025-12-27', '2025-12-27', '07:00:00', 1),
(3, 'Inventory Count - Fresh Produce', 'Count and record fresh produce inventory', 6, 1, 5, 3, 1, 5, 5, 7, 'normal', '2025-12-27', '2025-12-27', '08:00:00', 1),
(4, 'Customer Service Training', 'New staff customer service orientation', 5, 2, 6, 2, 1, 3, 3, 7, 'low', '2025-12-27', '2025-12-30', '10:00:00', 1),
(5, 'Evening Closing Procedures', 'Complete store closing checklist', 2, 3, 5, 1, 1, 7, 7, 7, 'high', '2025-12-27', '2025-12-27', '22:00:00', 1),
(6, 'Weekly Shelf Organization', 'Reorganize and clean all shelves', NULL, 2, 4, 2, 1, 4, 4, 8, 'normal', '2025-12-22', '2025-12-28', '09:00:00', 1),
(7, 'Emergency Exit Inspection', 'Monthly emergency exit check', 7, 1, 5, 1, 1, 2, 2, 9, 'high', '2025-12-25', '2025-12-25', '14:00:00', 1),

-- Store 2 Tasks
(8, 'Morning Store Opening', 'Complete all opening procedures', 1, 3, 5, 1, 2, 10, 10, 7, 'high', '2025-12-27', '2025-12-27', '06:00:00', 9),
(9, 'Daily Sales Report', 'Compile and submit daily sales figures', NULL, 1, 4, 5, 2, 10, 10, 7, 'normal', '2025-12-27', '2025-12-27', '21:00:00', 9),
(10, 'Quality Control - Bakery', 'Check bakery products quality', 9, 1, 5, 4, 2, 14, 14, 8, 'high', '2025-12-27', '2025-12-27', '08:00:00', 9),
(11, 'Staff Schedule Review', 'Review and adjust next week schedule', NULL, 2, 6, 1, 2, 10, 10, 7, 'normal', '2025-12-27', '2025-12-28', '15:00:00', 9),
(12, 'Promotional Display Setup', 'Set up New Year promotional displays', NULL, 2, 4, 2, 2, 11, 11, 7, 'normal', '2025-12-28', '2025-12-31', '10:00:00', 9),

-- Store 3 Tasks
(13, 'Morning Store Opening', 'Complete all opening procedures', 1, 3, 5, 1, 3, 16, 16, 7, 'high', '2025-12-27', '2025-12-27', '06:00:00', 15),
(14, 'Equipment Maintenance Check', 'Monthly equipment inspection', 8, 1, 5, 1, 3, 16, 16, 8, 'normal', '2025-12-27', '2025-12-27', '14:00:00', 15),
(15, 'Food Safety Audit', 'Monthly food safety compliance check', 4, 1, 5, 4, 3, 20, 20, 7, 'high', '2025-12-27', '2025-12-27', '09:00:00', 15),
(16, 'Inventory Restock - Beverages', 'Restock beverage section from warehouse', 6, 3, 4, 3, 3, 19, 19, 9, 'normal', '2025-12-26', '2025-12-26', '08:00:00', 15),

-- Store 4 Tasks
(17, 'Morning Store Opening', 'Complete all opening procedures', 1, 3, 5, 1, 4, 22, 22, 7, 'high', '2025-12-27', '2025-12-27', '06:00:00', 21),
(18, 'New Product Placement', 'Arrange new product arrivals on shelves', NULL, 2, 4, 2, 4, 23, 23, 7, 'normal', '2025-12-27', '2025-12-28', '10:00:00', 21),
(19, 'Staff Performance Review', 'Quarterly staff evaluation', 10, 2, 6, 1, 4, 22, 22, 7, 'low', '2025-12-28', '2025-12-31', '14:00:00', 21),

-- Store 5 Tasks (Hanoi)
(20, 'Morning Store Opening', 'Complete all opening procedures', 1, 3, 5, 1, 5, 27, 27, 7, 'high', '2025-12-27', '2025-12-27', '06:00:00', 26),
(21, 'Winter Promotion Setup', 'Set up winter holiday promotions', NULL, 2, 4, 2, 5, 28, 28, 8, 'normal', '2025-12-25', '2025-12-27', '09:00:00', 26),
(22, 'Heating System Check', 'Verify store heating systems working', 8, 1, 6, 1, 5, 27, 27, 9, 'high', '2025-12-26', '2025-12-26', '07:00:00', 26),

-- Store 6 Tasks (Hanoi)
(23, 'Morning Store Opening', 'Complete all opening procedures', 1, 3, 5, 1, 6, 32, 32, 7, 'high', '2025-12-27', '2025-12-27', '06:00:00', 31),
(24, 'Customer Feedback Analysis', 'Review and respond to customer feedback', 5, 1, 5, 2, 6, 32, 32, 8, 'normal', '2025-12-27', '2025-12-28', '15:00:00', 31),

-- Store 7 Tasks (Da Nang)
(25, 'Morning Store Opening', 'Complete all opening procedures', 1, 3, 5, 1, 7, 36, 36, 7, 'high', '2025-12-27', '2025-12-27', '06:00:00', 35),
(26, 'Seafood Quality Check', 'Daily fresh seafood inspection', 4, 1, 4, 4, 7, 37, 37, 8, 'high', '2025-12-27', '2025-12-27', '06:30:00', 35),

-- Store 8 Tasks (Can Tho)
(27, 'Morning Store Opening', 'Complete all opening procedures', 1, 3, 5, 1, 8, 39, 39, 7, 'high', '2025-12-27', '2025-12-27', '06:00:00', 38),
(28, 'Local Product Display', 'Set up Mekong regional products display', NULL, 2, 4, 2, 8, 40, 40, 7, 'normal', '2025-12-27', '2025-12-30', '10:00:00', 38),

-- Overdue tasks
(29, 'Monthly Inventory Audit', 'Complete monthly stock audit', 6, 1, 5, 3, 1, 5, 5, 10, 'high', '2025-12-20', '2025-12-24', '09:00:00', 1),
(30, 'Safety Training Update', 'Update staff safety certifications', 7, 2, 6, 1, 2, 10, 10, 10, 'normal', '2025-12-15', '2025-12-22', '14:00:00', 9)

ON CONFLICT DO NOTHING;

SELECT setval('tasks_task_id_seq', (SELECT COALESCE(MAX(task_id), 1) FROM tasks));

-- ============================================
-- TASK CHECK LISTS (Link tasks to checklists)
-- ============================================
INSERT INTO "task_check_list" ("task_id", "check_list_id", "check_status", "completed_at", "completed_by") VALUES
-- Task 1: Morning Store Opening
(1, 6, true, '2025-12-27 06:15:00', 2),
(1, 11, true, '2025-12-27 06:20:00', 2),
(1, 12, false, NULL, NULL),
(1, 14, true, '2025-12-27 06:25:00', 2),

-- Task 2: Temperature Check
(2, 1, true, '2025-12-27 07:10:00', 5),
(2, 15, false, NULL, NULL),

-- Task 5: Evening Closing
(5, 6, false, NULL, NULL),
(5, 9, false, NULL, NULL),
(5, 10, false, NULL, NULL),
(5, 16, false, NULL, NULL),

-- Task 7: Emergency Exit Inspection
(7, 14, true, '2025-12-25 14:30:00', 2),
(7, 10, true, '2025-12-25 14:45:00', 2),

-- Task 10: Quality Control - Bakery
(10, 8, true, '2025-12-27 08:20:00', 14),
(10, 15, false, NULL, NULL),

-- Task 15: Food Safety Audit
(15, 1, false, NULL, NULL),
(15, 4, false, NULL, NULL),
(15, 8, false, NULL, NULL),
(15, 15, false, NULL, NULL)

ON CONFLICT (task_id, check_list_id) DO NOTHING;

-- ============================================
-- NOTIFICATIONS (20 notifications)
-- ============================================
INSERT INTO "notifications" ("recipient_staff_id", "sender_staff_id", "notification_type", "title", "message", "link_url", "is_read", "read_at") VALUES
-- Unread notifications
(2, 1, 'task_assigned', 'New Task Assigned', 'You have been assigned: Morning Store Opening', '/tasks/1', false, NULL),
(5, 1, 'task_assigned', 'New Task Assigned', 'You have been assigned: Temperature Check - All Units', '/tasks/2', false, NULL),
(3, 1, 'shift_changed', 'Schedule Update', 'Your shift for Dec 28 has been updated to V8.14', '/dws/daily-schedule', false, NULL),
(7, 1, 'task_reminder', 'Task Due Soon', 'Evening Closing Procedures is due in 2 hours', '/tasks/5', false, NULL),
(10, 9, 'task_assigned', 'New Task Assigned', 'You have been assigned: Morning Store Opening', '/tasks/8', false, NULL),
(14, 9, 'task_assigned', 'New Task Assigned', 'You have been assigned: Quality Control - Bakery', '/tasks/10', false, NULL),
(16, 15, 'task_assigned', 'New Task Assigned', 'You have been assigned: Equipment Maintenance Check', '/tasks/14', false, NULL),
(20, 15, 'task_assigned', 'New Task Assigned', 'You have been assigned: Food Safety Audit', '/tasks/15', false, NULL),

-- Read notifications
(2, 1, 'system', 'Welcome', 'Welcome to OptiChain WS system', '/', true, '2025-12-20 09:00:00'),
(3, 1, 'shift_assigned', 'Shift Assigned', 'You have been scheduled for V8.14 on Dec 22', '/dws/daily-schedule', true, '2025-12-21 10:00:00'),
(4, 1, 'shift_assigned', 'Shift Assigned', 'You have been scheduled for V6.6 on Dec 22', '/dws/daily-schedule', true, '2025-12-21 10:05:00'),
(5, 1, 'task_completed', 'Task Completed', 'Monthly Inventory Audit marked as overdue', '/tasks/29', true, '2025-12-25 09:00:00'),
(10, 9, 'system', 'Welcome', 'Welcome to OptiChain WS system', '/', true, '2025-12-20 09:00:00'),
(11, 9, 'shift_assigned', 'Shift Assigned', 'You have been scheduled for V8.14 on Dec 22', '/dws/daily-schedule', true, '2025-12-21 10:30:00'),
(16, 15, 'system', 'Welcome', 'Welcome to OptiChain WS system', '/', true, '2025-12-20 09:00:00'),
(27, 26, 'task_assigned', 'New Task Assigned', 'You have been assigned: Winter Promotion Setup', '/tasks/21', true, '2025-12-25 09:30:00'),
(32, 31, 'shift_assigned', 'Shift Assigned', 'You have been scheduled for V8.6 on Dec 27', '/dws/daily-schedule', true, '2025-12-26 08:00:00'),
(36, 35, 'task_assigned', 'New Task Assigned', 'You have been assigned: Seafood Quality Check', '/tasks/26', true, '2025-12-26 06:00:00'),
(39, 38, 'system', 'Welcome', 'Welcome to OptiChain WS system', '/', true, '2025-12-20 09:00:00'),
(40, 38, 'task_assigned', 'New Task Assigned', 'You have been assigned: Local Product Display', '/tasks/28', true, '2025-12-27 10:00:00')

ON CONFLICT DO NOTHING;

-- ============================================
-- DONE - Test data seeded successfully!
-- ============================================
-- Summary:
--   4 Regions
--   5 Departments
--   8 Stores
--   40 Staff members (with login password: password123)
--   15 Shift Codes
--   100+ Shift Assignments (for current week)
--   10 Manuals
--   20 Checklists
--   30 Tasks
--   20 Notifications
-- ============================================
