-- ============================================
-- File: 03_insert_staff.sql
-- Purpose: Insert staff data for store 1
-- ============================================

-- Clear existing staff for store 1 first (if needed)
-- DELETE FROM staff WHERE store_id = 1;

-- Insert 8 staff members for store 1
INSERT INTO staff (staff_id, staff_code, staff_name, role, store_id, department_id, is_active, email)
VALUES
    (1, 'AMPM_D1_NCT_LEAD_01', 'Vo Minh Tuan', 'STORE_LEADER_G3', 1, 1, true, 'tuan.vm@aeon.com'),
    (2, 'AMPM_D1_NCT_STAFF_02', 'Dang Thu Ha', 'STAFF', 1, 2, true, 'ha.dt@aeon.com'),
    (3, 'AMPM_D1_NCT_STAFF_03', 'Hoang Xuan Kien', 'STAFF', 1, 3, true, 'kien.hx@aeon.com'),
    (4, 'AMPM_D1_NCT_STAFF_04', 'Bui Thi Lan', 'STAFF', 1, 4, true, 'lan.bt@aeon.com'),
    (5, 'AMPM_D1_NCT_STAFF_05', 'Le Quoc Phong', 'STAFF', 1, 5, true, 'phong.lq@aeon.com'),
    (6, 'AMPM_D1_NCT_STAFF_06', 'Tran Ngoc Hanh', 'STAFF', 1, 2, true, 'hanh.tn@aeon.com'),
    (7, 'AMPM_D1_NCT_STAFF_07', 'Pham Duc Anh', 'STAFF', 1, 3, true, 'anh.pd@aeon.com'),
    (8, 'AMPM_D1_NCT_STAFF_08', 'Vo Phuong Chi', 'STAFF', 1, 4, true, 'chi.vp@aeon.com')
ON CONFLICT (staff_id) DO UPDATE SET
    staff_name = EXCLUDED.staff_name,
    role = EXCLUDED.role,
    store_id = EXCLUDED.store_id;

-- Verify
SELECT staff_id, staff_name, role, store_id FROM staff WHERE store_id = 1 ORDER BY staff_id;
