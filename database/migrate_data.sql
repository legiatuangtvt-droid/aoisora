-- Migration Script: MySQL to PostgreSQL (Neon)
-- OptiChain WS & DWS Database
-- Converts old MySQL structure to new PostgreSQL schema

-- ============================================
-- STEP 1: Migrate Regions
-- ============================================

-- Map old region_master to new regions table
INSERT INTO regions (region_name, region_code, description, created_at) VALUES
('Park', 'PARK', 'Park area stores', CURRENT_TIMESTAMP),
('Super Market', 'SUPERMARKET', 'Supermarket area stores', CURRENT_TIMESTAMP),
('Lake', 'LAKE', 'Lake area stores', CURRENT_TIMESTAMP),
('Old Quarter', 'OLDQUARTER', 'Old Quarter area stores', CURRENT_TIMESTAMP),
('Shopping Mall', 'MALL', 'Shopping Mall area stores', CURRENT_TIMESTAMP)
ON CONFLICT (region_code) DO NOTHING;

-- ============================================
-- STEP 2: Migrate Departments
-- ============================================

-- Map old departments to new departments table
INSERT INTO departments (department_code, department_name, description, created_at) VALUES
('MKT', 'Marketing', 'Marketing Department', CURRENT_TIMESTAMP),
('OP', 'Operations', 'Operations Department', CURRENT_TIMESTAMP),
('IMP', 'Import', 'Import Department', CURRENT_TIMESTAMP),
('HR', 'Human Resources', 'HR Department', CURRENT_TIMESTAMP),
('ORD', 'Order', 'Order Department', CURRENT_TIMESTAMP),
('QC', 'Quality Control', 'QC Department', CURRENT_TIMESTAMP),
('ADM', 'Admin', 'Admin Department', CURRENT_TIMESTAMP)
ON CONFLICT (department_code) DO NOTHING;

-- ============================================
-- STEP 3: Migrate Stores
-- ============================================

-- Map old store_master to new stores table
INSERT INTO stores (store_code, store_name, region_id, phone, email, status, created_at)
SELECT
    sm.store_code,
    sm.store_name,
    r.region_id,
    sm.phone_number,
    CONCAT(LOWER(REPLACE(sm.store_name, ' ', '')), '@optichain.com'),
    CASE WHEN sm.level > 0 THEN 'active' ELSE 'inactive' END,
    CURRENT_TIMESTAMP
FROM (VALUES
    ('Store_001', 'Store Hà Đông', 1, '024-1000101', 1, 1),
    ('Store_002', 'Store Cầu Giấy', 1, '024-1000102', 1, 1),
    ('Store_003', 'Store Hoàn Kiếm', 2, '024-1000103', 2, 1),
    ('Store_004', 'Store Tây Hồ', 2, '024-1000104', 2, 1),
    ('Store_005', 'Store Thanh Xuân', 3, '024-1000105', 3, 1),
    ('Store_006', 'Store Ba Đình', 3, '024-1000106', 3, 1),
    ('Store_007', 'Store Đống Đa', 4, '024-1000107', 4, 1),
    ('Store_008', 'Store Hai Bà Trưng', 4, '024-1000108', 4, 1),
    ('Store_009', 'Store Long Biên', 5, '024-1000109', 5, 1),
    ('Store_010', 'Store Hoàng Mai', 5, '024-1000110', 5, 1),
    ('Store_011', 'Store Bắc Từ Liêm', 1, '024-1000111', 1, 1),
    ('Store_012', 'Store Nam Từ Liêm', 1, '024-1000112', 1, 1),
    ('Store_013', 'Store Sóc Sơn', 2, '024-1000113', 2, 1),
    ('Store_014', 'Store Đông Anh', 2, '024-1000114', 2, 1),
    ('Store_015', 'Store Thanh Trì', 3, '024-1000115', 3, 1),
    ('Store_016', 'Store Mê Linh', 3, '024-1000116', 3, 1),
    ('Store_017', 'Store Phú Xuyên', 4, '024-1000117', 4, 1),
    ('Store_018', 'Store Thường Tín', 4, '024-1000118', 4, 1),
    ('Store_019', 'Store Gia Lâm', 5, '024-1000119', 5, 1),
    ('Store_020', 'Store Chương Mỹ', 5, '024-1000120', 5, 1)
) AS sm(store_code, store_name, old_region_id, phone_number, region_id, level)
LEFT JOIN regions r ON sm.region_id = r.region_id
ON CONFLICT (store_code) DO NOTHING;

-- ============================================
-- STEP 4: Migrate Staff
-- ============================================

-- Map old staff_master to new staff table
-- Note: Creating dummy password hash (in production, staff should reset password)
INSERT INTO staff (staff_code, staff_name, email, phone, store_id, department_id, role, password_hash, is_active, created_at)
SELECT
    'STF' || LPAD(ROW_NUMBER() OVER (ORDER BY s.store_id, s.staff_name)::text, 3, '0'),
    s.staff_name,
    LOWER(REPLACE(s.staff_name, ' ', '.')) || '@optichain.com',
    NULL, -- Phone number not in old data
    st.store_id,
    d.department_id,
    CASE
        WHEN s.staff_code IN ('STF003', 'STF007', 'STF013', 'STF017', 'STF020', 'STF027', 'STF032', 'STF034', 'STF039', 'STF044', 'STF049', 'STF052', 'STF057', 'STF062', 'STF067', 'STF072', 'STF077', 'STF082', 'STF084', 'STF089') THEN 'manager'
        WHEN s.staff_code IN ('STF002', 'STF005', 'STF008', 'STF010', 'STF012', 'STF015', 'STF016', 'STF022', 'STF024', 'STF026', 'STF028', 'STF031', 'STF033', 'STF035', 'STF038', 'STF040', 'STF043', 'STF045', 'STF048', 'STF051', 'STF053', 'STF056', 'STF058', 'STF061', 'STF064', 'STF068', 'STF070', 'STF073', 'STF075', 'STF078', 'STF080', 'STF083', 'STF085', 'STF088', 'STF091', 'STF093') THEN 'supervisor'
        ELSE 'staff'
    END,
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5eiXFXq0Y1jMS', -- bcrypt hash of 'password123'
    true,
    CURRENT_TIMESTAMP
FROM (VALUES
    ('STF001', 'Nguyen Van An', 1, 18),
    ('STF002', 'Tran Thi Bich', 1, 12),
    ('STF003', 'Le Van Cuong', 1, 13),
    ('STF004', 'Pham Thi Dung', 1, 14),
    ('STF005', 'Hoang Van Em', 1, 15),
    ('STF007', 'Tran Van Giang', 2, 17),
    ('STF009', 'Pham Van Hung', 2, 12),
    ('STF013', 'Le Van Nam', 3, 16),
    ('STF014', 'Pham Thi Oanh', 3, 17),
    ('STF017', 'Tran Van Sang', 4, 13),
    ('STF020', 'Hoang Thi Vy', 5, 16),
    ('STF022', 'Tran Thi Yen', 5, 18),
    ('STF023', 'Le Van Zung', 5, 12),
    ('STF027', 'Tran Van Duc', 6, 16),
    ('STF029', 'Pham Van Hieu', 6, 18),
    ('STF032', 'Tran Thi Nga', 7, 14),
    ('STF034', 'Pham Thi Quynh', 8, 16),
    ('STF037', 'Tran Van Uoc', 8, 12),
    ('STF039', 'Pham Van Xinh', 9, 14),
    ('STF044', 'Pham Thi Cam', 10, 12),
    ('STF047', 'Tran Van Em', 10, 15),
    ('STF049', 'Pham Van Hung', 11, 17),
    ('STF051', 'Nguyen Van Khoa', 11, 12),
    ('STF052', 'Tran Thi Lan', 12, 13),
    ('STF055', 'Hoang Van Phat', 12, 16),
    ('STF057', 'Tran Van Sang', 13, 18),
    ('STF062', 'Tran Thi Yen', 14, 16),
    ('STF065', 'Hoang Van Bao', 14, 12),
    ('STF067', 'Tran Van Duc', 15, 14),
    ('STF069', 'Pham Van Hieu', 15, 16),
    ('STF072', 'Tran Thi Nga', 16, 12),
    ('STF077', 'Tran Van Uoc', 17, 17),
    ('STF082', 'Tran Thi Anh', 18, 15),
    ('STF084', 'Pham Thi Cam', 19, 17),
    ('STF087', 'Tran Van Em', 19, 13),
    ('STF089', 'Pham Van Hung', 20, 15)
) AS s(staff_code, staff_name, old_store_id, old_dept_id)
LEFT JOIN stores st ON st.store_code = 'Store_' || LPAD(s.old_store_id::text, 3, '0')
LEFT JOIN departments d ON d.department_id = s.old_dept_id
WHERE st.store_id IS NOT NULL AND d.department_id IS NOT NULL
ON CONFLICT (staff_code) DO NOTHING;

-- ============================================
-- STEP 5: Migrate Code Master
-- ============================================

-- Map old code_master to new code_master
-- Old: classification + code system
-- New: code_type + code system
INSERT INTO code_master (code_type, code, name, sort_order, is_active, created_at) VALUES
-- Task Types (old classification = 1)
('task_type', 'STATISTICS', 'Thống kê', 1, true, CURRENT_TIMESTAMP),
('task_type', 'ARRANGE', 'Sắp xếp', 2, true, CURRENT_TIMESTAMP),
('task_type', 'PREPARE', 'Chuẩn bị', 3, true, CURRENT_TIMESTAMP),

-- Response Types (old classification = 2)
('response_type', 'PICTURE', 'Picture', 1, true, CURRENT_TIMESTAMP),
('response_type', 'CHECKLIST', 'Check-List', 3, true, CURRENT_TIMESTAMP),
('response_type', 'YESNO', 'Yes-No', 4, true, CURRENT_TIMESTAMP),

-- Status (old classification = 3)
('status', 'NOT_YET', 'Not Yet', 1, true, CURRENT_TIMESTAMP),
('status', 'ON_PROGRESS', 'On Progress', 2, true, CURRENT_TIMESTAMP),
('status', 'DONE', 'Done', 3, true, CURRENT_TIMESTAMP),
('status', 'OVERDUE', 'Overdue', 4, true, CURRENT_TIMESTAMP),
('status', 'REJECT', 'Reject', 5, true, CURRENT_TIMESTAMP)
ON CONFLICT (code_type, code) DO NOTHING;

-- ============================================
-- STEP 6: Migrate Manuals
-- ============================================

INSERT INTO manuals (manual_name, manual_url, description, created_at) VALUES
('Hướng dẫn bán hàng', 'https://example.com/manuals/sales.pdf', 'Sales training manual', CURRENT_TIMESTAMP),
('Hướng dẫn an toàn', 'https://example.com/manuals/safety.pdf', 'Safety procedures manual', CURRENT_TIMESTAMP),
('Hướng dẫn kiểm kho', 'https://example.com/manuals/inventory.pdf', 'Inventory check manual', CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- ============================================
-- STEP 7: Migrate Check Lists
-- ============================================

INSERT INTO check_lists (check_list_name, description, is_active, created_at) VALUES
('Check danh sách kho hàng', 'Inventory checklist', true, CURRENT_TIMESTAMP),
('Check an toàn lao động', 'Safety checklist', true, CURRENT_TIMESTAMP),
('Check trưng bày sản phẩm', 'Product display checklist', true, CURRENT_TIMESTAMP),
('Check vệ sinh cửa hàng', 'Store cleaning checklist', true, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- ============================================
-- NOTES ON MIGRATION
-- ============================================

-- The following tables need custom migration logic:
-- 1. tasks - Complex mapping from old structure to new
--    - Old: task_type_id, response_type_id, status_id reference code_master.code_master_id
--    - New: Same references but different IDs after migration
--    - Need to map: re -> is_repeat, created_staff_id, do_staff_id

-- 2. task_check_list - Need to map old task_id to new task_id

-- 3. notifications - Need to map old staff IDs to new staff IDs

-- 4. New tables added (not in old schema):
--    - shift_codes (for DWS module)
--    - shift_assignments (for DWS module)

-- ============================================
-- SAMPLE SHIFT CODES (for DWS)
-- ============================================

INSERT INTO shift_codes (shift_code, shift_name, start_time, end_time, duration_hours, color_code, is_active, created_at) VALUES
('S', 'Ca Sáng', '06:00:00', '14:00:00', 8.00, '#FFD700', true, CURRENT_TIMESTAMP),
('C', 'Ca Chiều', '14:00:00', '22:00:00', 8.00, '#87CEEB', true, CURRENT_TIMESTAMP),
('T', 'Ca Tối', '22:00:00', '06:00:00', 8.00, '#4B0082', true, CURRENT_TIMESTAMP),
('OFF', 'Nghỉ', NULL, NULL, 0, '#D3D3D3', true, CURRENT_TIMESTAMP),
('FULL', 'Ca Toàn Thời', '08:00:00', '20:00:00', 12.00, '#32CD32', true, CURRENT_TIMESTAMP)
ON CONFLICT (shift_code) DO NOTHING;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- After running this migration, verify with these queries:

-- Check regions count
-- SELECT COUNT(*) FROM regions; -- Expected: 5

-- Check departments count
-- SELECT COUNT(*) FROM departments; -- Expected: 7

-- Check stores count
-- SELECT COUNT(*) FROM stores; -- Expected: 20

-- Check staff count
-- SELECT COUNT(*) FROM staff; -- Expected: ~36 (sample data)

-- Check code_master count
-- SELECT COUNT(*) FROM code_master; -- Expected: 11

-- Check manuals count
-- SELECT COUNT(*) FROM manuals; -- Expected: 3

-- Check check_lists count
-- SELECT COUNT(*) FROM check_lists; -- Expected: 4

-- Check shift_codes count
-- SELECT COUNT(*) FROM shift_codes; -- Expected: 5

-- ============================================
-- NEXT STEPS
-- ============================================

-- 1. Migrate tasks data (requires custom mapping script)
-- 2. Migrate task_check_list relationships
-- 3. Migrate notifications with new staff IDs
-- 4. Set up manager_id in stores table (circular reference)
-- 5. Generate sample shift_assignments for testing

COMMENT ON TABLE regions IS 'Migrated from old region_master table';
COMMENT ON TABLE stores IS 'Migrated from old store_master table';
COMMENT ON TABLE staff IS 'Migrated from old staff_master table';
COMMENT ON TABLE code_master IS 'Migrated from old code_master table with new structure';
