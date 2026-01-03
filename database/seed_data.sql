-- ============================================
-- Aoisora Test Data
-- Database: PostgreSQL 15+
-- Created: 2025-12-31
-- ============================================
-- This file inserts test data for development
-- Data covers 1 week before to 1 week after current date
-- Run after schema.sql
-- ============================================

-- ============================================
-- CORE DATA: Regions
-- ============================================

INSERT INTO "regions" ("region_id", "region_name", "region_code", "description") VALUES
(1, 'Ha Noi', 'HN', 'Thu do Ha Noi'),
(2, 'Ho Chi Minh', 'HCM', 'Thanh pho Ho Chi Minh'),
(3, 'Da Nang', 'DN', 'Thanh pho Da Nang'),
(4, 'Hai Phong', 'HP', 'Thanh pho Hai Phong'),
(5, 'Can Tho', 'CT', 'Thanh pho Can Tho');

SELECT setval('regions_region_id_seq', 5);

-- ============================================
-- CORE DATA: Departments
-- ============================================

INSERT INTO "departments" ("department_id", "department_name", "department_code", "description") VALUES
(1, 'Operations', 'OPS', 'Store operations'),
(2, 'Marketing', 'MKT', 'Marketing department'),
(3, 'Human Resources', 'HR', 'Human resources'),
(4, 'Quality Control', 'QC', 'Quality assurance'),
(5, 'Logistics', 'LOG', 'Supply chain and logistics'),
(6, 'Finance', 'FIN', 'Finance and accounting'),
(7, 'IT', 'IT', 'Information technology');

SELECT setval('departments_department_id_seq', 7);

-- ============================================
-- CORE DATA: Stores (4 stores for testing)
-- ============================================

INSERT INTO "stores" ("store_id", "store_name", "store_code", "region_id", "address", "phone", "email", "status") VALUES
(1, 'Store Ha Dong', 'ST001', 1, '123 Ha Dong, Ha Noi', '024-1234-5678', 'hadong@aoisora.com', 'active'),
(2, 'Store Cau Giay', 'ST002', 1, '456 Cau Giay, Ha Noi', '024-2345-6789', 'caugiay@aoisora.com', 'active'),
(3, 'Store Thanh Xuan', 'ST003', 1, '789 Thanh Xuan, Ha Noi', '024-3456-7890', 'thanhxuan@aoisora.com', 'active'),
(4, 'Store Dong Da', 'ST004', 1, '321 Dong Da, Ha Noi', '024-4567-8901', 'dongda@aoisora.com', 'active');

SELECT setval('stores_store_id_seq', 4);

-- ============================================
-- CORE DATA: Staff (32 staff - 8 per store)
-- Password: password123 (bcrypt hashed)
-- ============================================

-- Store 1 Staff
INSERT INTO "staff" ("staff_id", "staff_name", "staff_code", "username", "email", "phone", "store_id", "department_id", "role", "password_hash", "status") VALUES
(1, 'Nguyen Van A', 'NV001', 'admin', 'admin@aoisora.com', '0901234567', 1, 1, 'MANAGER', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(2, 'Tran Thi B', 'NV002', 'leader1', 'leader1@aoisora.com', '0902345678', 1, 1, 'STORE_LEADER_G3', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(3, 'Le Van C', 'NV003', 'staff1_1', 'staff1_1@aoisora.com', '0903456789', 1, 1, 'STAFF', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(4, 'Pham Thi D', 'NV004', 'staff1_2', 'staff1_2@aoisora.com', '0904567890', 1, 1, 'STAFF', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(5, 'Hoang Van E', 'NV005', 'staff1_3', 'staff1_3@aoisora.com', '0905678901', 1, 1, 'STAFF', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(6, 'Nguyen Thi F', 'NV006', 'staff1_4', 'staff1_4@aoisora.com', '0906789012', 1, 1, 'STAFF', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(7, 'Tran Van G', 'NV007', 'staff1_5', 'staff1_5@aoisora.com', '0907890123', 1, 1, 'STAFF', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(8, 'Le Thi H', 'NV008', 'staff1_6', 'staff1_6@aoisora.com', '0908901234', 1, 1, 'STAFF', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),

-- Store 2 Staff
(9, 'Pham Van I', 'NV009', 'manager2', 'manager2@aoisora.com', '0909012345', 2, 1, 'MANAGER', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(10, 'Hoang Thi K', 'NV010', 'leader2', 'leader2@aoisora.com', '0910123456', 2, 1, 'STORE_LEADER_G3', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(11, 'Nguyen Van L', 'NV011', 'staff2_1', 'staff2_1@aoisora.com', '0911234567', 2, 1, 'STAFF', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(12, 'Tran Thi M', 'NV012', 'staff2_2', 'staff2_2@aoisora.com', '0912345678', 2, 1, 'STAFF', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(13, 'Le Van N', 'NV013', 'staff2_3', 'staff2_3@aoisora.com', '0913456789', 2, 1, 'STAFF', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(14, 'Pham Thi O', 'NV014', 'staff2_4', 'staff2_4@aoisora.com', '0914567890', 2, 1, 'STAFF', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(15, 'Hoang Van P', 'NV015', 'staff2_5', 'staff2_5@aoisora.com', '0915678901', 2, 1, 'STAFF', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(16, 'Nguyen Thi Q', 'NV016', 'staff2_6', 'staff2_6@aoisora.com', '0916789012', 2, 1, 'STAFF', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),

-- Store 3 Staff
(17, 'Tran Van R', 'NV017', 'manager3', 'manager3@aoisora.com', '0917890123', 3, 1, 'MANAGER', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(18, 'Le Thi S', 'NV018', 'leader3', 'leader3@aoisora.com', '0918901234', 3, 1, 'STORE_LEADER_G3', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(19, 'Pham Van T', 'NV019', 'staff3_1', 'staff3_1@aoisora.com', '0919012345', 3, 1, 'STAFF', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(20, 'Hoang Thi U', 'NV020', 'staff3_2', 'staff3_2@aoisora.com', '0920123456', 3, 1, 'STAFF', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(21, 'Nguyen Van V', 'NV021', 'staff3_3', 'staff3_3@aoisora.com', '0921234567', 3, 1, 'STAFF', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(22, 'Tran Thi W', 'NV022', 'staff3_4', 'staff3_4@aoisora.com', '0922345678', 3, 1, 'STAFF', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(23, 'Le Van X', 'NV023', 'staff3_5', 'staff3_5@aoisora.com', '0923456789', 3, 1, 'STAFF', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(24, 'Pham Thi Y', 'NV024', 'staff3_6', 'staff3_6@aoisora.com', '0924567890', 3, 1, 'STAFF', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),

-- Store 4 Staff
(25, 'Hoang Van Z', 'NV025', 'manager4', 'manager4@aoisora.com', '0925678901', 4, 1, 'MANAGER', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(26, 'Nguyen Thi AA', 'NV026', 'leader4', 'leader4@aoisora.com', '0926789012', 4, 1, 'STORE_LEADER_G3', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(27, 'Tran Van AB', 'NV027', 'staff4_1', 'staff4_1@aoisora.com', '0927890123', 4, 1, 'STAFF', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(28, 'Le Thi AC', 'NV028', 'staff4_2', 'staff4_2@aoisora.com', '0928901234', 4, 1, 'STAFF', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(29, 'Pham Van AD', 'NV029', 'staff4_3', 'staff4_3@aoisora.com', '0929012345', 4, 1, 'STAFF', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(30, 'Hoang Thi AE', 'NV030', 'staff4_4', 'staff4_4@aoisora.com', '0930123456', 4, 1, 'STAFF', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(31, 'Nguyen Van AF', 'NV031', 'staff4_5', 'staff4_5@aoisora.com', '0931234567', 4, 1, 'STAFF', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(32, 'Tran Thi AG', 'NV032', 'staff4_6', 'staff4_6@aoisora.com', '0932345678', 4, 1, 'STAFF', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active');

SELECT setval('staff_staff_id_seq', 32);

-- Update store managers
UPDATE "stores" SET "manager_id" = 1 WHERE "store_id" = 1;
UPDATE "stores" SET "manager_id" = 9 WHERE "store_id" = 2;
UPDATE "stores" SET "manager_id" = 17 WHERE "store_id" = 3;
UPDATE "stores" SET "manager_id" = 25 WHERE "store_id" = 4;

-- ============================================
-- WS DATA: Checklists
-- ============================================

INSERT INTO "check_lists" ("check_list_id", "check_list_name", "description") VALUES
(1, 'Kiem tra san pham het han', 'Kiem tra va loai bo san pham het han su dung'),
(2, 'Ve sinh khu vuc', 'Lau don sach se khu vuc lam viec'),
(3, 'Kiem tra nhiet do tu lanh', 'Ghi nhan nhiet do tu mat va tu dong'),
(4, 'Sap xep ke hang', 'Sap xep hang hoa theo nguyen tac FIFO'),
(5, 'Kiem tra gia tien', 'Kiem tra bang gia va nhan gia san pham');

SELECT setval('check_lists_check_list_id_seq', 5);

-- ============================================
-- WS DATA: Manuals (Legacy)
-- ============================================

INSERT INTO "manuals" ("manual_id", "manual_name", "manual_url", "description") VALUES
(1, 'Huong dan mo cua hang', '/manuals/open-store.pdf', 'Quy trinh mo cua hang hang ngay'),
(2, 'Huong dan dong cua hang', '/manuals/close-store.pdf', 'Quy trinh dong cua hang hang ngay'),
(3, 'Huong dan xu ly khach hang', '/manuals/customer-service.pdf', 'Quy trinh phuc vu khach hang');

SELECT setval('manuals_manual_id_seq', 3);

-- ============================================
-- DWS DATA: Shift Assignments and Daily Tasks
-- Using dynamic date generation for ±1 week
-- ============================================

DO $$
DECLARE
    v_date DATE;
    v_store_id INTEGER;
    v_staff RECORD;
    v_shift_code_id INTEGER;
    v_start_time TIME;
    v_end_time TIME;
    v_slot_time TIME;
    v_task_index INTEGER;
    v_group_id VARCHAR(20);
    v_task_name VARCHAR(255);
    v_day_offset INTEGER;
    v_staff_index INTEGER;
    v_task_code VARCHAR(20);

    -- Task names for each group
    v_leader_tasks TEXT[] := ARRAY[
        'Mo kho', 'Balancing', 'Kiem tra hang', 'Duyet don', 'Giao viec',
        'Meeting', 'Ban giao tien', 'Kiem tra OOS', 'Duyet khuyen mai',
        'Giam sat', 'Chuan bi ban giao', 'Dong kho', 'Ban giao ca'
    ];
    v_pos_tasks TEXT[] := ARRAY[
        'Mo POS', 'Check POS', 'Ho tro POS', 'Doi soat tien', 'In bao cao',
        'Kiem ke POS', 'Doi tien le', 'Check voucher', 'Phuc vu khach',
        'Ho tro thanh toan', 'Xu ly khieu nai', 'Kiem POS cuoi ca', 'Dong POS'
    ];
    v_peri_tasks TEXT[] := ARRAY[
        'Len thit ca', 'Len rau cu', 'Sap xep ke', 'Kiem HSD', 'Cat got rau',
        'Dong goi thit', 'Can dong goi', 'Dan nhan gia', 'Bo sung ke',
        'Giam gia Peri', 'Xoay ke FIFO', 'Check nhiet do', 'Kiem kho Peri'
    ];
    v_dry_tasks TEXT[] := ARRAY[
        'Len hang kho', 'Keo mat Dry', 'Sap xep ke', 'Ban OOS', 'Kiem HSD Dry',
        'Xoay FIFO', 'Dan nhan', 'Check gia', 'Bo sung ke', 'Kiem promo',
        'Sap xep endcap', 'Ve sinh ke', 'Kiem kho Dry'
    ];
    v_mmd_tasks TEXT[] := ARRAY[
        'Nhan hang Peri', 'Kiem hang Peri', 'Nhan hang RDC', 'Kiem hang RDC',
        'Phan loai hang', 'Nhap kho', 'Cap nhat ton', 'Xu ly hang tra',
        'Kiem DC', 'Bao cao nhap', 'Sap xep kho', 'Kiem kho MMD'
    ];
    v_qc_tasks TEXT[] := ARRAY[
        'Cleaning Time', 'Kiem tra VSC', 'Ve sinh khu vuc', 'Check nhiet do',
        'Kiem tra chat luong'
    ];

BEGIN
    -- Loop through 15 days: -7 to +7 from current date
    FOR v_day_offset IN -7..7 LOOP
        v_date := CURRENT_DATE + v_day_offset;

        -- Loop through stores (1-4)
        FOR v_store_id IN 1..4 LOOP

            -- Get staff for this store (8 staff per store)
            v_staff_index := 0;
            FOR v_staff IN
                SELECT staff_id, role
                FROM staff
                WHERE store_id = v_store_id AND is_active = true
                ORDER BY
                    CASE role
                        WHEN 'MANAGER' THEN 1
                        WHEN 'STORE_LEADER_G3' THEN 2
                        ELSE 3
                    END, staff_id
                LIMIT 8
            LOOP
                v_staff_index := v_staff_index + 1;

                -- First 4 staff: morning shift, last 4: afternoon shift
                IF v_staff_index <= 4 THEN
                    v_shift_code_id := 1; -- V8.6 (06:00-14:00)
                    v_start_time := '06:00:00'::TIME;
                    v_end_time := '14:00:00'::TIME;
                ELSE
                    v_shift_code_id := 4; -- V8.14 (14:00-22:00)
                    v_start_time := '14:00:00'::TIME;
                    v_end_time := '22:00:00'::TIME;
                END IF;

                -- Insert shift assignment
                INSERT INTO shift_assignments (staff_id, store_id, shift_date, shift_code_id, status, assigned_by, assigned_at)
                VALUES (v_staff.staff_id, v_store_id, v_date, v_shift_code_id, 'assigned', 1, NOW())
                ON CONFLICT (staff_id, shift_date, shift_code_id) DO NOTHING;

                -- Create tasks for each 15-minute slot
                v_slot_time := v_start_time;
                v_task_index := 0;

                WHILE v_slot_time < v_end_time LOOP
                    v_task_index := v_task_index + 1;

                    -- Determine task type based on staff role and slot
                    IF v_staff.role IN ('MANAGER', 'STORE_LEADER_G3') THEN
                        IF v_task_index % 3 = 0 THEN
                            v_group_id := 'POS';
                            v_task_name := v_pos_tasks[1 + (v_task_index % array_length(v_pos_tasks, 1))];
                            v_task_code := 'POS' || LPAD(v_task_index::TEXT, 2, '0');
                        ELSIF v_slot_time >= v_start_time + INTERVAL '6 hours' AND v_slot_time < v_start_time + INTERVAL '7 hours' THEN
                            v_group_id := 'OTHER';
                            v_task_name := 'Break Time';
                            v_task_code := 'BRK01';
                        ELSE
                            v_group_id := 'LEADER';
                            v_task_name := v_leader_tasks[1 + (v_task_index % array_length(v_leader_tasks, 1))];
                            v_task_code := 'LDR' || LPAD(v_task_index::TEXT, 2, '0');
                        END IF;
                    ELSIF v_staff_index IN (2, 6) THEN
                        -- PERI staff
                        IF v_slot_time >= v_start_time + INTERVAL '3 hours' AND v_slot_time < v_start_time + INTERVAL '3 hours 30 minutes' THEN
                            v_group_id := 'QC-FSH';
                            v_task_name := v_qc_tasks[1 + (v_task_index % array_length(v_qc_tasks, 1))];
                            v_task_code := 'QC' || LPAD(v_task_index::TEXT, 2, '0');
                        ELSIF v_slot_time >= v_start_time + INTERVAL '6 hours' AND v_slot_time < v_start_time + INTERVAL '7 hours' THEN
                            v_group_id := 'OTHER';
                            v_task_name := 'Break Time';
                            v_task_code := 'BRK01';
                        ELSE
                            v_group_id := 'PERI';
                            v_task_name := v_peri_tasks[1 + (v_task_index % array_length(v_peri_tasks, 1))];
                            v_task_code := 'PER' || LPAD(v_task_index::TEXT, 2, '0');
                        END IF;
                    ELSIF v_staff_index IN (3, 7) THEN
                        -- DRY staff
                        IF v_slot_time >= v_start_time + INTERVAL '3 hours' AND v_slot_time < v_start_time + INTERVAL '3 hours 30 minutes' THEN
                            v_group_id := 'QC-FSH';
                            v_task_name := v_qc_tasks[1 + (v_task_index % array_length(v_qc_tasks, 1))];
                            v_task_code := 'QC' || LPAD(v_task_index::TEXT, 2, '0');
                        ELSIF v_slot_time >= v_start_time + INTERVAL '6 hours' AND v_slot_time < v_start_time + INTERVAL '7 hours' THEN
                            v_group_id := 'OTHER';
                            v_task_name := 'Break Time';
                            v_task_code := 'BRK01';
                        ELSE
                            v_group_id := 'DRY';
                            v_task_name := v_dry_tasks[1 + (v_task_index % array_length(v_dry_tasks, 1))];
                            v_task_code := 'DRY' || LPAD(v_task_index::TEXT, 2, '0');
                        END IF;
                    ELSE
                        -- MMD staff
                        IF v_slot_time >= v_start_time + INTERVAL '3 hours' AND v_slot_time < v_start_time + INTERVAL '3 hours 30 minutes' THEN
                            v_group_id := 'QC-FSH';
                            v_task_name := v_qc_tasks[1 + (v_task_index % array_length(v_qc_tasks, 1))];
                            v_task_code := 'QC' || LPAD(v_task_index::TEXT, 2, '0');
                        ELSIF v_slot_time >= v_start_time + INTERVAL '6 hours' AND v_slot_time < v_start_time + INTERVAL '7 hours' THEN
                            v_group_id := 'OTHER';
                            v_task_name := 'Break Time';
                            v_task_code := 'BRK01';
                        ELSE
                            v_group_id := 'MMD';
                            v_task_name := v_mmd_tasks[1 + (v_task_index % array_length(v_mmd_tasks, 1))];
                            v_task_code := 'MMD' || LPAD(v_task_index::TEXT, 2, '0');
                        END IF;
                    END IF;

                    -- Insert daily schedule task
                    INSERT INTO daily_schedule_tasks (
                        staff_id, store_id, schedule_date, group_id, task_code, task_name,
                        start_time, end_time, status, created_at, updated_at
                    )
                    VALUES (
                        v_staff.staff_id,
                        v_store_id,
                        v_date,
                        v_group_id,
                        v_task_code,
                        v_task_name,
                        v_slot_time,
                        v_slot_time + INTERVAL '15 minutes',
                        -- Status: 1=Not Yet, 2=Done, 3=Skipped, 4=In Progress
                        CASE
                            WHEN v_date < CURRENT_DATE THEN
                                CASE WHEN random() > 0.1 THEN 2 ELSE 3 END
                            WHEN v_date = CURRENT_DATE AND v_slot_time < CURRENT_TIME THEN
                                CASE WHEN random() > 0.2 THEN 2 ELSE 4 END
                            ELSE 1
                        END,
                        NOW(),
                        NOW()
                    )
                    ON CONFLICT DO NOTHING;

                    v_slot_time := v_slot_time + INTERVAL '15 minutes';
                END LOOP;

            END LOOP; -- End staff loop
        END LOOP; -- End store loop
    END LOOP; -- End day loop

    RAISE NOTICE 'Test data generation completed!';
END $$;

-- ============================================
-- WS DATA: Sample Tasks
-- ============================================

INSERT INTO "tasks" ("task_name", "task_description", "task_type_id", "response_type_id", "status_id", "dept_id", "assigned_store_id", "assigned_staff_id", "created_staff_id", "priority", "start_date", "end_date") VALUES
-- Original 5 tasks
('Kiem ke hang hoa thang 12', 'Kiem ke toan bo hang hoa trong kho', 1, 5, 8, 1, 1, 3, 1, 'high', CURRENT_DATE - 3, CURRENT_DATE + 4),
('Ve sinh khu vuc thuc pham', 'Ve sinh sach se khu vuc trung bay thuc pham', 2, 6, 7, 1, 1, 4, 1, 'normal', CURRENT_DATE, CURRENT_DATE + 1),
('Chuan bi khuyen mai Tet', 'Chuan bi hang hoa va bang gia khuyen mai Tet', 3, 4, 7, 2, 1, 5, 1, 'urgent', CURRENT_DATE + 1, CURRENT_DATE + 7),
('Bao cao doanh thu tuan', 'Tong hop va bao cao doanh thu tuan', 1, 4, 9, 6, 2, 11, 9, 'normal', CURRENT_DATE - 7, CURRENT_DATE - 1),
('Dao tao nhan vien moi', 'Dao tao quy trinh lam viec cho nhan vien moi', 3, 5, 8, 3, 3, 19, 17, 'normal', CURRENT_DATE - 2, CURRENT_DATE + 5),

-- Additional 45 tasks for filter testing (Total: 50 tasks)
-- Operations (OPS) - dept_id=1
('Kiem tra nhiet do tu lanh', 'Kiem tra va ghi nhan nhiet do tu mat, tu dong', 1, 5, 7, 1, 1, 3, 1, 'high', CURRENT_DATE, CURRENT_DATE + 1),
('Sap xep hang hoa ke 1', 'Sap xep lai hang hoa theo nguyen tac FIFO', 2, 6, 7, 1, 1, 4, 1, 'normal', CURRENT_DATE - 1, CURRENT_DATE),
('Kiem tra HSD san pham', 'Kiem tra han su dung san pham trong khu vuc', 1, 5, 9, 1, 2, 11, 9, 'high', CURRENT_DATE - 5, CURRENT_DATE - 3),
('Ve sinh khu vuc thu ngan', 'Lau don sach se khu vuc quay thu ngan', 2, 6, 8, 1, 2, 12, 9, 'normal', CURRENT_DATE - 2, CURRENT_DATE),
('Kiem tra thiet bi dien', 'Kiem tra hoat dong cua cac thiet bi dien', 1, 5, 7, 1, 3, 19, 17, 'normal', CURRENT_DATE, CURRENT_DATE + 2),
('Bao tri he thong dieu hoa', 'Bao tri dinh ky he thong dieu hoa', 3, 4, 7, 1, 3, 20, 17, 'low', CURRENT_DATE + 2, CURRENT_DATE + 5),
('Kiem tra camera an ninh', 'Kiem tra hoat dong cua he thong camera', 1, 5, 9, 1, 4, 27, 25, 'high', CURRENT_DATE - 4, CURRENT_DATE - 2),
('Cap nhat bang gia', 'Cap nhat bang gia moi cho san pham', 2, 6, 8, 1, 4, 28, 25, 'normal', CURRENT_DATE - 1, CURRENT_DATE + 1),

-- Marketing (MKT) - dept_id=2
('Thiet ke poster khuyen mai', 'Thiet ke poster quang cao chuong trinh khuyen mai', 3, 4, 7, 2, 1, 5, 1, 'high', CURRENT_DATE, CURRENT_DATE + 3),
('Chuan bi vat pham POSM', 'Chuan bi vat pham quang cao tai diem ban', 2, 6, 8, 2, 1, 6, 1, 'normal', CURRENT_DATE - 2, CURRENT_DATE + 1),
('Khao sat khach hang', 'Thuc hien khao sat y kien khach hang', 3, 4, 7, 2, 2, 13, 9, 'normal', CURRENT_DATE + 1, CURRENT_DATE + 7),
('Bao cao hieu qua marketing', 'Tong hop bao cao hieu qua cac chuong trinh', 1, 4, 9, 2, 2, 14, 9, 'low', CURRENT_DATE - 10, CURRENT_DATE - 5),
('Lap ke hoach truyen thong', 'Lap ke hoach truyen thong thang toi', 3, 4, 7, 2, 3, 21, 17, 'high', CURRENT_DATE + 3, CURRENT_DATE + 10),
('Quan ly fanpage', 'Dang bai va tuong tac tren fanpage', 2, 6, 8, 2, 3, 22, 17, 'normal', CURRENT_DATE - 1, CURRENT_DATE + 2),
('To chuc su kien sampling', 'To chuc su kien dung thu san pham', 3, 4, 7, 2, 4, 29, 25, 'urgent', CURRENT_DATE + 2, CURRENT_DATE + 4),

-- Human Resources (HR) - dept_id=3
('Tuyen dung nhan vien ban hang', 'Tuyen dung 3 nhan vien ban hang moi', 3, 4, 7, 3, 1, 7, 1, 'high', CURRENT_DATE, CURRENT_DATE + 14),
('Danh gia nhan vien quy 4', 'Thuc hien danh gia nhan vien quy 4', 1, 4, 8, 3, 1, 8, 1, 'normal', CURRENT_DATE - 5, CURRENT_DATE + 5),
('Cap nhat ho so nhan su', 'Cap nhat thong tin ho so nhan vien', 2, 6, 9, 3, 2, 15, 9, 'low', CURRENT_DATE - 7, CURRENT_DATE - 3),
('To chuc team building', 'To chuc hoat dong team building thang', 3, 4, 7, 3, 2, 16, 9, 'normal', CURRENT_DATE + 5, CURRENT_DATE + 7),
('Dao tao an toan lao dong', 'Dao tao ve an toan lao dong cho nhan vien', 3, 5, 7, 3, 3, 23, 17, 'high', CURRENT_DATE + 1, CURRENT_DATE + 3),
('Xu ly don xin nghi phep', 'Xu ly cac don xin nghi phep cua nhan vien', 2, 6, 8, 3, 4, 30, 25, 'normal', CURRENT_DATE - 1, CURRENT_DATE),

-- Quality Control (QC) - dept_id=4
('Kiem tra chat luong thuc pham', 'Kiem tra chat luong thuc pham nhap kho', 1, 5, 7, 4, 1, 3, 1, 'urgent', CURRENT_DATE, CURRENT_DATE + 1),
('Danh gia nha cung cap', 'Danh gia chat luong nha cung cap', 1, 4, 8, 4, 1, 4, 1, 'high', CURRENT_DATE - 3, CURRENT_DATE + 2),
('Kiem tra ve sinh an toan', 'Kiem tra tieu chuan ve sinh an toan thuc pham', 1, 5, 9, 4, 2, 11, 9, 'high', CURRENT_DATE - 6, CURRENT_DATE - 4),
('Xu ly san pham loi', 'Xu ly va bao cao san pham bi loi', 2, 6, 7, 4, 2, 12, 9, 'urgent', CURRENT_DATE, CURRENT_DATE + 1),
('Kiem tra quy trinh bao quan', 'Kiem tra quy trinh bao quan san pham', 1, 5, 8, 4, 3, 19, 17, 'normal', CURRENT_DATE - 2, CURRENT_DATE + 1),
('Lap bao cao QC hang thang', 'Tong hop bao cao kiem soat chat luong', 1, 4, 7, 4, 4, 27, 25, 'low', CURRENT_DATE + 3, CURRENT_DATE + 7),

-- Logistics (LOG) - dept_id=5
('Nhan hang tu nha cung cap', 'Nhan va kiem tra hang hoa tu NCC', 2, 6, 7, 5, 1, 5, 1, 'high', CURRENT_DATE, CURRENT_DATE + 1),
('Sap xep kho hang', 'Sap xep lai kho hang theo quy dinh', 2, 6, 8, 5, 1, 6, 1, 'normal', CURRENT_DATE - 2, CURRENT_DATE),
('Kiem ke ton kho', 'Kiem ke so luong ton kho thuc te', 1, 5, 9, 5, 2, 13, 9, 'high', CURRENT_DATE - 5, CURRENT_DATE - 3),
('Chuyen hang giua cac cua hang', 'Dieu phoi chuyen hang giua cac chi nhanh', 2, 6, 7, 5, 2, 14, 9, 'normal', CURRENT_DATE + 1, CURRENT_DATE + 2),
('Cap nhat he thong quan ly kho', 'Cap nhat thong tin vao he thong WMS', 2, 6, 8, 5, 3, 21, 17, 'low', CURRENT_DATE - 1, CURRENT_DATE + 1),
('Xu ly hang tra ve', 'Xu ly va phan loai hang tra ve tu khach', 2, 6, 7, 5, 4, 29, 25, 'normal', CURRENT_DATE, CURRENT_DATE + 2),

-- Finance (FIN) - dept_id=6
('Doi soat doanh thu ngay', 'Doi soat doanh thu ban hang trong ngay', 1, 4, 7, 6, 1, 7, 1, 'high', CURRENT_DATE, CURRENT_DATE + 1),
('Lap bao cao tai chinh thang', 'Tong hop bao cao tai chinh hang thang', 1, 4, 8, 6, 1, 8, 1, 'normal', CURRENT_DATE - 3, CURRENT_DATE + 2),
('Thanh toan nha cung cap', 'Thuc hien thanh toan cho nha cung cap', 2, 6, 9, 6, 2, 15, 9, 'high', CURRENT_DATE - 7, CURRENT_DATE - 5),
('Kiem tra chi phi van hanh', 'Kiem tra va phan tich chi phi van hanh', 1, 4, 7, 6, 3, 23, 17, 'normal', CURRENT_DATE + 2, CURRENT_DATE + 5),
('Xu ly hoan tien khach hang', 'Xu ly cac yeu cau hoan tien tu khach', 2, 6, 8, 6, 4, 30, 25, 'urgent', CURRENT_DATE - 1, CURRENT_DATE),

-- IT - dept_id=7
('Bao tri he thong POS', 'Bao tri va cap nhat he thong POS', 3, 4, 7, 7, 1, 3, 1, 'high', CURRENT_DATE + 1, CURRENT_DATE + 3),
('Sao luu du lieu', 'Sao luu du lieu he thong hang ngay', 2, 6, 9, 7, 1, 4, 1, 'normal', CURRENT_DATE - 1, CURRENT_DATE),
('Kiem tra mang noi bo', 'Kiem tra va dam bao mang hoat dong on dinh', 1, 5, 8, 7, 2, 11, 9, 'normal', CURRENT_DATE - 2, CURRENT_DATE),
('Cap nhat phan mem', 'Cap nhat phien ban phan mem moi', 3, 4, 7, 7, 3, 19, 17, 'low', CURRENT_DATE + 3, CURRENT_DATE + 7),
('Ho tro ky thuat cho nhan vien', 'Ho tro xu ly cac van de ky thuat', 2, 6, 7, 7, 4, 27, 25, 'normal', CURRENT_DATE, CURRENT_DATE + 2);

-- ============================================
-- MANUAL DATA: Folders and Documents
-- ============================================

INSERT INTO "manual_folders" ("folder_id", "folder_name", "parent_id", "description", "icon", "sort_order") VALUES
(1, 'Quy trinh van hanh', NULL, 'Cac quy trinh van hanh cua hang', 'folder', 1),
(2, 'Mo cua hang', 1, 'Quy trinh mo cua hang', 'door-open', 1),
(3, 'Dong cua hang', 1, 'Quy trinh dong cua hang', 'door-closed', 2),
(4, 'Quan ly hang hoa', NULL, 'Huong dan quan ly hang hoa', 'package', 2),
(5, 'Phuc vu khach hang', NULL, 'Quy trinh phuc vu khach hang', 'users', 3);

SELECT setval('manual_folders_folder_id_seq', 5);

INSERT INTO "manual_documents" ("document_id", "folder_id", "title", "description", "version", "status", "created_by") VALUES
(1, 2, 'Quy trinh mo cua hang buoi sang', 'Huong dan chi tiet cac buoc mo cua hang', '1.0', 'published', 1),
(2, 3, 'Quy trinh dong cua hang buoi toi', 'Huong dan chi tiet cac buoc dong cua hang', '1.0', 'published', 1),
(3, 4, 'Huong dan kiem ke hang hoa', 'Quy trinh kiem ke hang hoa dinh ky', '1.0', 'published', 1),
(4, 5, 'Quy trinh xu ly khieu nai khach hang', 'Huong dan xu ly cac tinh huong khieu nai', '1.2', 'published', 1);

SELECT setval('manual_documents_document_id_seq', 4);

INSERT INTO "manual_steps" ("step_id", "document_id", "step_number", "title", "content", "tips") VALUES
(1, 1, 1, 'Kiem tra an ninh', 'Kiem tra camera va he thong bao dong truoc khi mo cua', 'Luu y kiem tra tat ca cac goc camera'),
(2, 1, 2, 'Bat dien va thiet bi', 'Bat dien cho toan bo cua hang va kiem tra thiet bi', 'Kiem tra tu lanh dau tien'),
(3, 1, 3, 'Chuan bi quay thu ngan', 'Mo may tinh POS va kiem tra tien mat', 'Dam bao du tien le'),
(4, 2, 1, 'Kiem tra khach con trong cua hang', 'Thong bao gio dong cua va kiem tra khach hang', NULL),
(5, 2, 2, 'Tat thiet bi va den', 'Tat cac thiet bi khong can thiet', 'Giu lai den bao ve'),
(6, 2, 3, 'Khoa cua va bat bao dong', 'Khoa tat ca cac cua va bat he thong bao dong', NULL);

SELECT setval('manual_steps_step_id_seq', 6);

-- ============================================
-- NOTIFICATIONS DATA
-- ============================================

INSERT INTO "notifications" ("recipient_staff_id", "sender_staff_id", "notification_type", "title", "message", "is_read") VALUES
(3, 1, 'task_assigned', 'Task moi duoc gan', 'Ban da duoc gan task "Kiem ke hang hoa thang 12"', false),
(4, 1, 'task_assigned', 'Task moi duoc gan', 'Ban da duoc gan task "Ve sinh khu vuc thuc pham"', false),
(5, 1, 'task_assigned', 'Task moi duoc gan', 'Ban da duoc gan task "Chuan bi khuyen mai Tet"', true),
(1, NULL, 'system', 'Chao mung den voi Aoisora', 'Cam on ban da su dung he thong Aoisora', true),
(2, 1, 'shift_assigned', 'Ca lam viec moi', 'Ban da duoc phan cong ca sang ngay mai', false);

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

SELECT 'REGIONS' AS table_name, COUNT(*) AS count FROM regions
UNION ALL SELECT 'DEPARTMENTS', COUNT(*) FROM departments
UNION ALL SELECT 'STORES', COUNT(*) FROM stores
UNION ALL SELECT 'STAFF', COUNT(*) FROM staff
UNION ALL SELECT 'TASK_GROUPS', COUNT(*) FROM task_groups
UNION ALL SELECT 'SHIFT_CODES', COUNT(*) FROM shift_codes
UNION ALL SELECT 'SHIFT_ASSIGNMENTS', COUNT(*) FROM shift_assignments
UNION ALL SELECT 'DAILY_SCHEDULE_TASKS', COUNT(*) FROM daily_schedule_tasks
UNION ALL SELECT 'NOTIFICATIONS', COUNT(*) FROM notifications
UNION ALL SELECT 'MANUAL_FOLDERS', COUNT(*) FROM manual_folders
UNION ALL SELECT 'MANUAL_DOCUMENTS', COUNT(*) FROM manual_documents;

-- ============================================
-- DONE
-- ============================================
