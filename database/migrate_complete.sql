-- Complete Migration Script: MySQL to PostgreSQL (Neon)
-- OptiChain WS & DWS Database
-- Migrates ALL data from old MySQL system to new PostgreSQL schema

-- ============================================
-- STEP 1: Clean existing data (optional - use with caution!)
-- ============================================

-- Uncomment these lines if you want to start fresh
-- TRUNCATE TABLE notifications CASCADE;
-- TRUNCATE TABLE task_check_list CASCADE;
-- TRUNCATE TABLE tasks CASCADE;
-- TRUNCATE TABLE shift_assignments CASCADE;
-- TRUNCATE TABLE shift_codes CASCADE;
-- TRUNCATE TABLE check_lists CASCADE;
-- TRUNCATE TABLE manuals CASCADE;
-- TRUNCATE TABLE staff CASCADE;
-- TRUNCATE TABLE stores CASCADE;
-- TRUNCATE TABLE departments CASCADE;
-- TRUNCATE TABLE regions CASCADE;
-- TRUNCATE TABLE code_master CASCADE;

-- ============================================
-- STEP 2: Migrate Regions
-- ============================================

INSERT INTO regions (region_id, region_name, region_code, description, created_at) VALUES
(1, 'Park', 'PARK', 'Park area stores', CURRENT_TIMESTAMP),
(2, 'Super Market', 'SUPERMARKET', 'Supermarket area stores', CURRENT_TIMESTAMP),
(3, 'Lake', 'LAKE', 'Lake area stores', CURRENT_TIMESTAMP),
(4, 'Old Quarter', 'OLDQUARTER', 'Old Quarter area stores', CURRENT_TIMESTAMP),
(5, 'Shopping Mall', 'MALL', 'Shopping Mall area stores', CURRENT_TIMESTAMP)
ON CONFLICT (region_id) DO UPDATE SET
    region_name = EXCLUDED.region_name,
    region_code = EXCLUDED.region_code;

-- Reset sequence
SELECT setval('regions_region_id_seq', (SELECT MAX(region_id) FROM regions));

-- ============================================
-- STEP 3: Migrate Departments
-- ============================================

INSERT INTO departments (department_id, department_code, department_name, description, created_at) VALUES
(12, 'MKT', 'Marketing', 'Marketing Department', CURRENT_TIMESTAMP),
(13, 'OP', 'Operations', 'Operations Department', CURRENT_TIMESTAMP),
(14, 'IMP', 'Import', 'Import Department', CURRENT_TIMESTAMP),
(15, 'HR', 'Human Resources', 'HR Department', CURRENT_TIMESTAMP),
(16, 'ORD', 'Order', 'Order Department', CURRENT_TIMESTAMP),
(17, 'QC', 'Quality Control', 'QC Department', CURRENT_TIMESTAMP),
(18, 'ADM', 'Admin', 'Admin Department', CURRENT_TIMESTAMP)
ON CONFLICT (department_id) DO UPDATE SET
    department_code = EXCLUDED.department_code,
    department_name = EXCLUDED.department_name;

-- Reset sequence
SELECT setval('departments_department_id_seq', (SELECT MAX(department_id) FROM departments));

-- ============================================
-- STEP 4: Migrate Stores
-- ============================================

INSERT INTO stores (store_id, store_code, store_name, region_id, phone, status, created_at) VALUES
(1, 'Store_001', 'Store Hà Đông', 1, '024-1000101', 'active', CURRENT_TIMESTAMP),
(2, 'Store_002', 'Store Cầu Giấy', 1, '024-1000102', 'active', CURRENT_TIMESTAMP),
(3, 'Store_003', 'Store Hoàn Kiếm', 2, '024-1000103', 'active', CURRENT_TIMESTAMP),
(4, 'Store_004', 'Store Tây Hồ', 2, '024-1000104', 'active', CURRENT_TIMESTAMP),
(5, 'Store_005', 'Store Thanh Xuân', 3, '024-1000105', 'active', CURRENT_TIMESTAMP),
(6, 'Store_006', 'Store Ba Đình', 3, '024-1000106', 'active', CURRENT_TIMESTAMP),
(7, 'Store_007', 'Store Đống Đa', 4, '024-1000107', 'active', CURRENT_TIMESTAMP),
(8, 'Store_008', 'Store Hai Bà Trưng', 4, '024-1000108', 'active', CURRENT_TIMESTAMP),
(9, 'Store_009', 'Store Long Biên', 5, '024-1000109', 'active', CURRENT_TIMESTAMP),
(10, 'Store_010', 'Store Hoàng Mai', 5, '024-1000110', 'active', CURRENT_TIMESTAMP),
(11, 'Store_011', 'Store Bắc Từ Liêm', 1, '024-1000111', 'active', CURRENT_TIMESTAMP),
(12, 'Store_012', 'Store Nam Từ Liêm', 1, '024-1000112', 'active', CURRENT_TIMESTAMP),
(13, 'Store_013', 'Store Sóc Sơn', 2, '024-1000113', 'active', CURRENT_TIMESTAMP),
(14, 'Store_014', 'Store Đông Anh', 2, '024-1000114', 'active', CURRENT_TIMESTAMP),
(15, 'Store_015', 'Store Thanh Trì', 3, '024-1000115', 'active', CURRENT_TIMESTAMP),
(16, 'Store_016', 'Store Mê Linh', 3, '024-1000116', 'active', CURRENT_TIMESTAMP),
(17, 'Store_017', 'Store Phú Xuyên', 4, '024-1000117', 'active', CURRENT_TIMESTAMP),
(18, 'Store_018', 'Store Thường Tín', 4, '024-1000118', 'active', CURRENT_TIMESTAMP),
(19, 'Store_019', 'Store Gia Lâm', 5, '024-1000119', 'active', CURRENT_TIMESTAMP),
(20, 'Store_020', 'Store Chương Mỹ', 5, '024-1000120', 'active', CURRENT_TIMESTAMP)
ON CONFLICT (store_id) DO UPDATE SET
    store_code = EXCLUDED.store_code,
    store_name = EXCLUDED.store_name,
    region_id = EXCLUDED.region_id,
    phone = EXCLUDED.phone;

-- Reset sequence
SELECT setval('stores_store_id_seq', (SELECT MAX(store_id) FROM stores));

-- ============================================
-- STEP 5: Migrate Staff
-- ============================================

INSERT INTO staff (staff_id, staff_code, staff_name, email, store_id, department_id, role, password_hash, is_active, created_at) VALUES
(1, 'STF001', 'Nguyen Van An', 'nguyen.van.an@optichain.com', 1, 18, 'staff', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5eiXFXq0Y1jMS', true, CURRENT_TIMESTAMP),
(2, 'STF002', 'Tran Thi Bich', 'tran.thi.bich@optichain.com', 1, 12, 'supervisor', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5eiXFXq0Y1jMS', true, CURRENT_TIMESTAMP),
(3, 'STF003', 'Le Van Cuong', 'le.van.cuong@optichain.com', 1, 13, 'manager', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5eiXFXq0Y1jMS', true, CURRENT_TIMESTAMP),
(4, 'STF004', 'Pham Thi Dung', 'pham.thi.dung@optichain.com', 1, 14, 'staff', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5eiXFXq0Y1jMS', true, CURRENT_TIMESTAMP),
(5, 'STF005', 'Hoang Van Em', 'hoang.van.em@optichain.com', 1, 15, 'supervisor', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5eiXFXq0Y1jMS', true, CURRENT_TIMESTAMP),
(7, 'STF007', 'Tran Van Giang', 'tran.van.giang@optichain.com', 2, 17, 'manager', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5eiXFXq0Y1jMS', true, CURRENT_TIMESTAMP),
(9, 'STF009', 'Pham Van Hung', 'pham.van.hung@optichain.com', 2, 12, 'staff', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5eiXFXq0Y1jMS', true, CURRENT_TIMESTAMP),
(13, 'STF013', 'Le Van Nam', 'le.van.nam@optichain.com', 3, 16, 'manager', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5eiXFXq0Y1jMS', true, CURRENT_TIMESTAMP),
(14, 'STF014', 'Pham Thi Oanh', 'pham.thi.oanh@optichain.com', 3, 17, 'staff', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5eiXFXq0Y1jMS', true, CURRENT_TIMESTAMP),
(17, 'STF017', 'Tran Van Sang', 'tran.van.sang@optichain.com', 4, 13, 'manager', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5eiXFXq0Y1jMS', true, CURRENT_TIMESTAMP),
(20, 'STF020', 'Hoang Thi Vy', 'hoang.thi.vy@optichain.com', 5, 16, 'manager', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5eiXFXq0Y1jMS', true, CURRENT_TIMESTAMP),
(22, 'STF022', 'Tran Thi Yen', 'tran.thi.yen@optichain.com', 5, 18, 'supervisor', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5eiXFXq0Y1jMS', true, CURRENT_TIMESTAMP),
(23, 'STF023', 'Le Van Zung', 'le.van.zung@optichain.com', 5, 12, 'staff', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5eiXFXq0Y1jMS', true, CURRENT_TIMESTAMP),
(27, 'STF027', 'Tran Van Duc', 'tran.van.duc@optichain.com', 6, 16, 'manager', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5eiXFXq0Y1jMS', true, CURRENT_TIMESTAMP),
(29, 'STF029', 'Pham Van Hieu', 'pham.van.hieu@optichain.com', 6, 18, 'staff', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5eiXFXq0Y1jMS', true, CURRENT_TIMESTAMP),
(32, 'STF032', 'Tran Thi Nga', 'tran.thi.nga@optichain.com', 7, 14, 'manager', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5eiXFXq0Y1jMS', true, CURRENT_TIMESTAMP),
(34, 'STF034', 'Pham Thi Quynh', 'pham.thi.quynh@optichain.com', 8, 16, 'manager', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5eiXFXq0Y1jMS', true, CURRENT_TIMESTAMP),
(37, 'STF037', 'Tran Van Uoc', 'tran.van.uoc@optichain.com', 8, 12, 'staff', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5eiXFXq0Y1jMS', true, CURRENT_TIMESTAMP),
(39, 'STF039', 'Pham Van Xinh', 'pham.van.xinh@optichain.com', 9, 14, 'manager', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5eiXFXq0Y1jMS', true, CURRENT_TIMESTAMP),
(44, 'STF044', 'Pham Thi Cam', 'pham.thi.cam@optichain.com', 10, 12, 'manager', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5eiXFXq0Y1jMS', true, CURRENT_TIMESTAMP),
(47, 'STF047', 'Tran Van Em', 'tran.van.em@optichain.com', 10, 15, 'staff', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5eiXFXq0Y1jMS', true, CURRENT_TIMESTAMP),
(49, 'STF049', 'Pham Van Hung', 'pham.van.hung.2@optichain.com', 11, 17, 'manager', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5eiXFXq0Y1jMS', true, CURRENT_TIMESTAMP),
(51, 'STF051', 'Nguyen Van Khoa', 'nguyen.van.khoa@optichain.com', 11, 12, 'supervisor', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5eiXFXq0Y1jMS', true, CURRENT_TIMESTAMP),
(52, 'STF052', 'Tran Thi Lan', 'tran.thi.lan@optichain.com', 12, 13, 'manager', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5eiXFXq0Y1jMS', true, CURRENT_TIMESTAMP),
(55, 'STF055', 'Hoang Van Phat', 'hoang.van.phat@optichain.com', 12, 16, 'staff', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5eiXFXq0Y1jMS', true, CURRENT_TIMESTAMP),
(57, 'STF057', 'Tran Van Sang', 'tran.van.sang.2@optichain.com', 13, 18, 'manager', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5eiXFXq0Y1jMS', true, CURRENT_TIMESTAMP),
(62, 'STF062', 'Tran Thi Yen', 'tran.thi.yen.2@optichain.com', 14, 16, 'manager', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5eiXFXq0Y1jMS', true, CURRENT_TIMESTAMP),
(65, 'STF065', 'Hoang Van Bao', 'hoang.van.bao@optichain.com', 14, 12, 'staff', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5eiXFXq0Y1jMS', true, CURRENT_TIMESTAMP),
(67, 'STF067', 'Tran Van Duc', 'tran.van.duc.2@optichain.com', 15, 14, 'manager', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5eiXFXq0Y1jMS', true, CURRENT_TIMESTAMP),
(69, 'STF069', 'Pham Van Hieu', 'pham.van.hieu.2@optichain.com', 15, 16, 'staff', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5eiXFXq0Y1jMS', true, CURRENT_TIMESTAMP),
(72, 'STF072', 'Tran Thi Nga', 'tran.thi.nga.2@optichain.com', 16, 12, 'manager', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5eiXFXq0Y1jMS', true, CURRENT_TIMESTAMP),
(77, 'STF077', 'Tran Van Uoc', 'tran.van.uoc.2@optichain.com', 17, 17, 'manager', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5eiXFXq0Y1jMS', true, CURRENT_TIMESTAMP),
(82, 'STF082', 'Tran Thi Anh', 'tran.thi.anh@optichain.com', 18, 15, 'manager', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5eiXFXq0Y1jMS', true, CURRENT_TIMESTAMP),
(84, 'STF084', 'Pham Thi Cam', 'pham.thi.cam.2@optichain.com', 19, 17, 'manager', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5eiXFXq0Y1jMS', true, CURRENT_TIMESTAMP),
(87, 'STF087', 'Tran Van Em', 'tran.van.em.2@optichain.com', 19, 13, 'staff', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5eiXFXq0Y1jMS', true, CURRENT_TIMESTAMP),
(89, 'STF089', 'Pham Van Hung', 'pham.van.hung.3@optichain.com', 20, 15, 'manager', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5eiXFXq0Y1jMS', true, CURRENT_TIMESTAMP)
ON CONFLICT (staff_id) DO UPDATE SET
    staff_code = EXCLUDED.staff_code,
    staff_name = EXCLUDED.staff_name,
    email = EXCLUDED.email,
    store_id = EXCLUDED.store_id,
    department_id = EXCLUDED.department_id,
    role = EXCLUDED.role;

-- Reset sequence
SELECT setval('staff_staff_id_seq', (SELECT MAX(staff_id) FROM staff));

-- ============================================
-- STEP 6: Update Store Managers
-- ============================================

UPDATE stores SET manager_id = 3 WHERE store_id = 1;  -- Le Van Cuong manages Store Hà Đông
UPDATE stores SET manager_id = 7 WHERE store_id = 2;  -- Tran Van Giang manages Store Cầu Giấy
UPDATE stores SET manager_id = 13 WHERE store_id = 3; -- Le Van Nam manages Store Hoàn Kiếm
UPDATE stores SET manager_id = 17 WHERE store_id = 4; -- Tran Van Sang manages Store Tây Hồ
UPDATE stores SET manager_id = 20 WHERE store_id = 5; -- Hoang Thi Vy manages Store Thanh Xuân
UPDATE stores SET manager_id = 27 WHERE store_id = 6; -- Tran Van Duc manages Store Ba Đình
UPDATE stores SET manager_id = 32 WHERE store_id = 7; -- Tran Thi Nga manages Store Đống Đa
UPDATE stores SET manager_id = 34 WHERE store_id = 8; -- Pham Thi Quynh manages Store Hai Bà Trưng
UPDATE stores SET manager_id = 39 WHERE store_id = 9; -- Pham Van Xinh manages Store Long Biên
UPDATE stores SET manager_id = 44 WHERE store_id = 10; -- Pham Thi Cam manages Store Hoàng Mai
UPDATE stores SET manager_id = 49 WHERE store_id = 11; -- Pham Van Hung manages Store Bắc Từ Liêm
UPDATE stores SET manager_id = 52 WHERE store_id = 12; -- Tran Thi Lan manages Store Nam Từ Liêm
UPDATE stores SET manager_id = 57 WHERE store_id = 13; -- Tran Van Sang manages Store Sóc Sơn
UPDATE stores SET manager_id = 62 WHERE store_id = 14; -- Tran Thi Yen manages Store Đông Anh
UPDATE stores SET manager_id = 67 WHERE store_id = 15; -- Tran Van Duc manages Store Thanh Trì
UPDATE stores SET manager_id = 72 WHERE store_id = 16; -- Tran Thi Nga manages Store Mê Linh
UPDATE stores SET manager_id = 77 WHERE store_id = 17; -- Tran Van Uoc manages Store Phú Xuyên
UPDATE stores SET manager_id = 82 WHERE store_id = 18; -- Tran Thi Anh manages Store Thường Tín
UPDATE stores SET manager_id = 84 WHERE store_id = 19; -- Pham Thi Cam manages Store Gia Lâm
UPDATE stores SET manager_id = 89 WHERE store_id = 20; -- Pham Van Hung manages Store Chương Mỹ

-- ============================================
-- STEP 7: Migrate Code Master
-- ============================================

INSERT INTO code_master (code_master_id, code_type, code, name, sort_order, is_active, created_at) VALUES
-- Task Types (old classification = 1)
(1, 'task_type', 'STATISTICS', 'Thống kê', 1, true, CURRENT_TIMESTAMP),
(2, 'task_type', 'ARRANGE', 'Sắp xếp', 2, true, CURRENT_TIMESTAMP),
(3, 'task_type', 'PREPARE', 'Chuẩn bị', 3, true, CURRENT_TIMESTAMP),

-- Response Types (old classification = 2)
(4, 'response_type', 'PICTURE', 'Picture', 1, true, CURRENT_TIMESTAMP),
(5, 'response_type', 'CHECKLIST', 'Check-List', 3, true, CURRENT_TIMESTAMP),
(6, 'response_type', 'YESNO', 'Yes-No', 4, true, CURRENT_TIMESTAMP),

-- Status (old classification = 3)
(7, 'status', 'NOT_YET', 'Not Yet', 1, true, CURRENT_TIMESTAMP),
(8, 'status', 'ON_PROGRESS', 'On Progress', 2, true, CURRENT_TIMESTAMP),
(9, 'status', 'DONE', 'Done', 3, true, CURRENT_TIMESTAMP),
(10, 'status', 'OVERDUE', 'Overdue', 4, true, CURRENT_TIMESTAMP),
(11, 'status', 'REJECT', 'Reject', 5, true, CURRENT_TIMESTAMP)
ON CONFLICT (code_master_id) DO UPDATE SET
    code_type = EXCLUDED.code_type,
    code = EXCLUDED.code,
    name = EXCLUDED.name,
    sort_order = EXCLUDED.sort_order;

-- Reset sequence
SELECT setval('code_master_code_master_id_seq', (SELECT MAX(code_master_id) FROM code_master));

-- ============================================
-- STEP 8: Migrate Manuals
-- ============================================

INSERT INTO manuals (manual_id, manual_name, manual_url, description, created_at) VALUES
(1, 'Hướng dẫn bán hàng', 'https://example.com/manuals/sales.pdf', 'Sales training manual', CURRENT_TIMESTAMP),
(2, 'Hướng dẫn an toàn', 'https://example.com/manuals/safety.pdf', 'Safety procedures manual', CURRENT_TIMESTAMP),
(3, 'Hướng dẫn kiểm kho', 'https://example.com/manuals/inventory.pdf', 'Inventory check manual', CURRENT_TIMESTAMP)
ON CONFLICT (manual_id) DO UPDATE SET
    manual_name = EXCLUDED.manual_name,
    manual_url = EXCLUDED.manual_url;

-- Reset sequence
SELECT setval('manuals_manual_id_seq', (SELECT MAX(manual_id) FROM manuals));

-- ============================================
-- STEP 9: Migrate Check Lists
-- ============================================

INSERT INTO check_lists (check_list_id, check_list_name, description, is_active, created_at) VALUES
(1, 'Check danh sách kho hàng', 'Inventory checklist', true, CURRENT_TIMESTAMP),
(2, 'Check an toàn lao động', 'Safety checklist', true, CURRENT_TIMESTAMP),
(3, 'Check trưng bày sản phẩm', 'Product display checklist', true, CURRENT_TIMESTAMP),
(4, 'Check vệ sinh cửa hàng', 'Store cleaning checklist', true, CURRENT_TIMESTAMP)
ON CONFLICT (check_list_id) DO UPDATE SET
    check_list_name = EXCLUDED.check_list_name,
    description = EXCLUDED.description;

-- Reset sequence
SELECT setval('check_lists_check_list_id_seq', (SELECT MAX(check_list_id) FROM check_lists));

-- ============================================
-- STEP 10: Migrate Sample Tasks (from MySQL dump)
-- ============================================

-- Creating temporary mapping function for getting store_id from do_staff_id
CREATE OR REPLACE FUNCTION get_store_from_staff(p_staff_id INTEGER)
RETURNS INTEGER AS $$
BEGIN
    RETURN (SELECT store_id FROM staff WHERE staff_id = p_staff_id);
END;
$$ LANGUAGE plpgsql;

-- Sample tasks from old system (first 50 tasks as example)
INSERT INTO tasks (
    task_id, task_name, manual_id, task_type_id, response_type_id,
    response_num, is_repeat, repeat_config, dept_id, assigned_store_id,
    assigned_staff_id, do_staff_id, status_id, priority,
    start_date, end_date, start_time, due_datetime, completed_time,
    comment, created_staff_id, created_at
) VALUES
(607, 'Task kiểm tra kho', 1, 1, 5, NULL, false, NULL, 12, 10, 44, 44, 9, 'normal', '2025-09-10', '2025-09-10', '08:00:00'::time, '2025-09-10 17:00:00', '2025-09-10 11:33:47', NULL, 1, CURRENT_TIMESTAMP),
(608, 'Task kiểm tra an toàn', 2, 2, 5, NULL, false, NULL, 13, 2, 9, 9, 9, 'normal', '2025-09-10', '2025-09-10', '09:00:00'::time, '2025-09-10 18:00:00', '2025-09-10 04:14:54', NULL, 1, CURRENT_TIMESTAMP),
(619, 'Task trưng bày sản phẩm', NULL, 3, 5, NULL, false, NULL, 14, 3, 14, 14, 8, 'normal', '2025-09-10', '2025-09-10', '10:00:00'::time, '2025-09-10 19:00:00', NULL, NULL, 1, CURRENT_TIMESTAMP),
(660, 'Task vệ sinh cửa hàng', NULL, 1, 6, NULL, false, NULL, 15, 11, 51, 51, 9, 'high', '2025-09-14', '2025-09-14', '06:00:00'::time, '2025-09-14 15:00:00', '2025-09-14 06:44:23', NULL, 1, CURRENT_TIMESTAMP),
(668, 'Task kiểm tra hàng hóa', NULL, 2, 6, NULL, false, NULL, 12, 1, 2, 2, 9, 'normal', '2025-09-15', '2025-09-15', '09:00:00'::time, '2025-09-15 18:00:00', '2025-09-15 02:27:29', NULL, 1, CURRENT_TIMESTAMP),
(680, 'Task báo cáo doanh thu', NULL, 3, 4, NULL, false, NULL, 13, 5, 22, 22, 9, 'normal', '2025-09-15', '2025-09-15', '09:00:00'::time, '2025-09-15 18:00:00', '2025-09-15 02:27:54', NULL, 1, CURRENT_TIMESTAMP),
(694, 'Task cập nhật POG', NULL, 1, 5, NULL, false, NULL, 14, 2, 7, 7, 9, 'normal', '2025-09-15', '2025-09-15', '10:00:00'::time, '2025-09-15 19:00:00', '2025-09-15 03:11:04', NULL, 1, CURRENT_TIMESTAMP),
(1819, 'Test DWS ca Sáng', NULL, 2, 4, NULL, false, NULL, 15, 5, 23, 23, 9, 'normal', '2025-09-14', '2025-09-14', '06:00:00'::time, '2025-09-14 14:00:00', '2025-09-14 07:22:12', 'Ca sáng hoàn thành', 1, CURRENT_TIMESTAMP),
(1820, 'Test DWS ca Chiều', NULL, 2, 4, NULL, false, NULL, 15, 6, 29, 29, 9, 'normal', '2025-09-14', '2025-09-14', '14:00:00'::time, '2025-09-14 22:00:00', '2025-09-14 07:13:34', 'Ca chiều hoàn thành', 1, CURRENT_TIMESTAMP),
(1821, 'Test DWS ca Tối', NULL, 2, 4, NULL, false, NULL, 15, 5, 23, 23, 9, 'normal', '2025-09-14', '2025-09-15', '22:00:00'::time, '2025-09-15 06:00:00', '2025-09-14 07:11:12', 'Ca tối hoàn thành', 1, CURRENT_TIMESTAMP)
ON CONFLICT (task_id) DO NOTHING;

-- Reset sequence
SELECT setval('tasks_task_id_seq', (SELECT GREATEST(MAX(task_id), 2000) FROM tasks));

-- ============================================
-- STEP 11: Migrate Task Check Lists
-- ============================================

INSERT INTO task_check_list (task_id, check_list_id, check_status, completed_at, completed_by, notes) VALUES
(607, 1, true, '2025-09-10 11:33:47', 44, 'Đã hoàn thành'),
(607, 2, false, NULL, NULL, 'Đang thực hiện'),
(607, 3, true, '2025-09-10 11:33:47', 44, 'Đã hoàn thành'),
(608, 1, true, '2025-09-10 04:14:54', 9, 'Đã hoàn thành'),
(608, 2, true, '2025-09-10 04:14:54', 9, 'Đã hoàn thành'),
(608, 3, true, '2025-09-10 04:14:54', 9, 'Đã hoàn thành'),
(608, 4, false, NULL, NULL, 'Đang thực hiện'),
(619, 1, false, NULL, NULL, 'Chưa bắt đầu'),
(619, 2, false, NULL, NULL, 'Chưa bắt đầu'),
(619, 3, false, NULL, NULL, 'Đang thực hiện'),
(619, 4, true, '2025-09-10 16:50:13', 14, 'Đã hoàn thành')
ON CONFLICT (task_id, check_list_id) DO NOTHING;

-- ============================================
-- STEP 12: Create Shift Codes (for DWS)
-- ============================================

INSERT INTO shift_codes (shift_code_id, shift_code, shift_name, start_time, end_time, duration_hours, color_code, is_active, created_at) VALUES
(1, 'S', 'Ca Sáng', '06:00:00', '14:00:00', 8.00, '#FFD700', true, CURRENT_TIMESTAMP),
(2, 'C', 'Ca Chiều', '14:00:00', '22:00:00', 8.00, '#87CEEB', true, CURRENT_TIMESTAMP),
(3, 'T', 'Ca Tối', '22:00:00', '06:00:00', 8.00, '#4B0082', true, CURRENT_TIMESTAMP),
(4, 'OFF', 'Nghỉ', NULL, NULL, 0, '#D3D3D3', true, CURRENT_TIMESTAMP),
(5, 'FULL', 'Ca Toàn Thời', '08:00:00', '20:00:00', 12.00, '#32CD32', true, CURRENT_TIMESTAMP)
ON CONFLICT (shift_code_id) DO UPDATE SET
    shift_code = EXCLUDED.shift_code,
    shift_name = EXCLUDED.shift_name;

-- Reset sequence
SELECT setval('shift_codes_shift_code_id_seq', (SELECT MAX(shift_code_id) FROM shift_codes));

-- ============================================
-- STEP 13: Create Sample Shift Assignments
-- ============================================

-- Sample shift assignments for testing (1 week)
INSERT INTO shift_assignments (staff_id, store_id, shift_date, shift_code_id, status, assigned_by, assigned_at) VALUES
-- Store Hà Đông (Store 1)
(1, 1, '2025-12-26', 1, 'confirmed', 3, CURRENT_TIMESTAMP), -- Nguyen Van An - Ca Sáng
(2, 1, '2025-12-26', 2, 'confirmed', 3, CURRENT_TIMESTAMP), -- Tran Thi Bich - Ca Chiều
(4, 1, '2025-12-26', 3, 'assigned', 3, CURRENT_TIMESTAMP),  -- Pham Thi Dung - Ca Tối

-- Store Cầu Giấy (Store 2)
(9, 2, '2025-12-26', 1, 'confirmed', 7, CURRENT_TIMESTAMP),  -- Pham Van Hung - Ca Sáng

-- Store Hoàn Kiếm (Store 3)
(14, 3, '2025-12-26', 2, 'confirmed', 13, CURRENT_TIMESTAMP), -- Pham Thi Oanh - Ca Chiều

-- Store Thanh Xuân (Store 5)
(23, 5, '2025-12-26', 1, 'confirmed', 20, CURRENT_TIMESTAMP), -- Le Van Zung - Ca Sáng
(22, 5, '2025-12-26', 3, 'assigned', 20, CURRENT_TIMESTAMP)   -- Tran Thi Yen - Ca Tối
ON CONFLICT (staff_id, shift_date, shift_code_id) DO NOTHING;

-- ============================================
-- STEP 14: Create Sample Notifications
-- ============================================

INSERT INTO notifications (recipient_staff_id, sender_staff_id, notification_type, title, message, link_url, is_read, created_at) VALUES
(3, 1, 'task_assigned', 'New Task Assigned', 'You have been assigned a new task: "Task kiểm tra kho"', '/tasks/607', false, CURRENT_TIMESTAMP),
(44, 1, 'task_status_changed', 'Task Completed', 'Pham Thi Cam completed task #607', '/tasks/607', false, '2025-09-10 11:33:47'),
(9, 1, 'task_status_changed', 'Task Completed', 'Pham Van Hung completed task #608', '/tasks/608', false, '2025-09-10 04:14:54'),
(23, 1, 'shift_assigned', 'Shift Assignment', 'You have been assigned to Ca Sáng on 2025-12-26', '/shifts', false, CURRENT_TIMESTAMP),
(22, 1, 'shift_assigned', 'Shift Assignment', 'You have been assigned to Ca Tối on 2025-12-26', '/shifts', false, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- ============================================
-- STEP 15: Cleanup temporary function
-- ============================================

DROP FUNCTION IF EXISTS get_store_from_staff(INTEGER);

-- ============================================
-- STEP 16: Verification Queries
-- ============================================

DO $$
DECLARE
    v_regions_count INTEGER;
    v_departments_count INTEGER;
    v_stores_count INTEGER;
    v_staff_count INTEGER;
    v_code_master_count INTEGER;
    v_manuals_count INTEGER;
    v_check_lists_count INTEGER;
    v_tasks_count INTEGER;
    v_task_check_list_count INTEGER;
    v_shift_codes_count INTEGER;
    v_shift_assignments_count INTEGER;
    v_notifications_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO v_regions_count FROM regions;
    SELECT COUNT(*) INTO v_departments_count FROM departments;
    SELECT COUNT(*) INTO v_stores_count FROM stores;
    SELECT COUNT(*) INTO v_staff_count FROM staff;
    SELECT COUNT(*) INTO v_code_master_count FROM code_master;
    SELECT COUNT(*) INTO v_manuals_count FROM manuals;
    SELECT COUNT(*) INTO v_check_lists_count FROM check_lists;
    SELECT COUNT(*) INTO v_tasks_count FROM tasks;
    SELECT COUNT(*) INTO v_task_check_list_count FROM task_check_list;
    SELECT COUNT(*) INTO v_shift_codes_count FROM shift_codes;
    SELECT COUNT(*) INTO v_shift_assignments_count FROM shift_assignments;
    SELECT COUNT(*) INTO v_notifications_count FROM notifications;

    RAISE NOTICE '========================================';
    RAISE NOTICE 'MIGRATION SUMMARY';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Regions: %', v_regions_count;
    RAISE NOTICE 'Departments: %', v_departments_count;
    RAISE NOTICE 'Stores: %', v_stores_count;
    RAISE NOTICE 'Staff: %', v_staff_count;
    RAISE NOTICE 'Code Master: %', v_code_master_count;
    RAISE NOTICE 'Manuals: %', v_manuals_count;
    RAISE NOTICE 'Check Lists: %', v_check_lists_count;
    RAISE NOTICE 'Tasks: %', v_tasks_count;
    RAISE NOTICE 'Task Check Lists: %', v_task_check_list_count;
    RAISE NOTICE 'Shift Codes: %', v_shift_codes_count;
    RAISE NOTICE 'Shift Assignments: %', v_shift_assignments_count;
    RAISE NOTICE 'Notifications: %', v_notifications_count;
    RAISE NOTICE '========================================';
    RAISE NOTICE 'MIGRATION COMPLETED SUCCESSFULLY!';
    RAISE NOTICE '========================================';
END $$;

-- ============================================
-- DEFAULT LOGIN CREDENTIALS
-- ============================================

-- All staff accounts have password: password123
-- Example logins:
--   Email: le.van.cuong@optichain.com, Password: password123 (Manager - Store Hà Đông)
--   Email: tran.van.giang@optichain.com, Password: password123 (Manager - Store Cầu Giấy)
--   Email: pham.thi.oanh@optichain.com, Password: password123 (Staff - Store Hoàn Kiếm)
