-- ============================================
-- File: seed_dws_test_data.sql
-- Purpose: Insert DWS test data for all stores
-- Data Range: 7 days before and 7 days after current date
-- Prerequisites: Run schema_full.sql and seed_test_data.sql first
-- ============================================

-- ============================================
-- PART 1: INSERT TASK GROUPS (Master Data)
-- ============================================
INSERT INTO task_groups (group_id, group_code, group_name, priority, sort_order, color_bg, color_text, color_border, is_active)
VALUES
    ('POS', 'POS', 'Thu ngan', 100, 1, '#e2e8f0', '#1e293b', '#94a3b8', true),
    ('PERI', 'PERI', 'Perishable', 90, 2, '#fef3c7', '#92400e', '#f59e0b', true),
    ('DRY', 'DRY', 'Dry/Grocery', 80, 3, '#dbeafe', '#1e40af', '#3b82f6', true),
    ('MMD', 'MMD', 'Logistics/Receiving', 75, 4, '#e0e7ff', '#3730a3', '#6366f1', true),
    ('LEADER', 'LEADER', 'Leader Tasks', 95, 5, '#99f6e4', '#134e4a', '#2dd4bf', true),
    ('QC-FSH', 'QC-FSH', 'Quality Control', 70, 6, '#dcfce7', '#166534', '#22c55e', true),
    ('DELICA', 'DELICA', 'Delicatessen', 65, 7, '#fce7f3', '#9d174d', '#ec4899', true),
    ('DND', 'DND', 'Do Not Disturb', 50, 8, '#fee2e2', '#991b1b', '#ef4444', true),
    ('OTHER', 'OTHER', 'Other Tasks', 10, 9, '#f3f4f6', '#374151', '#9ca3af', true)
ON CONFLICT (group_id) DO UPDATE SET
    group_name = EXCLUDED.group_name,
    color_bg = EXCLUDED.color_bg,
    color_text = EXCLUDED.color_text,
    color_border = EXCLUDED.color_border;

-- ============================================
-- PART 2: INSERT SHIFT CODES (Master Data)
-- ============================================
INSERT INTO shift_codes (shift_code_id, shift_code, shift_name, start_time, end_time, total_hours, shift_type, break_minutes, is_active)
VALUES
    (1, 'V8.6', 'Ca sang 6h', '06:00:00', '14:00:00', 8.0, 'morning', 60, true),
    (2, 'V8.7', 'Ca sang 7h', '07:00:00', '15:00:00', 8.0, 'morning', 60, true),
    (3, 'V8.8', 'Ca sang 8h', '08:00:00', '16:00:00', 8.0, 'morning', 60, true),
    (4, 'V8.14', 'Ca chieu 14h', '14:00:00', '22:00:00', 8.0, 'afternoon', 60, true),
    (5, 'V8.14.5', 'Ca chieu 14:30', '14:30:00', '22:30:00', 8.0, 'afternoon', 60, true),
    (6, 'V8.15', 'Ca chieu 15h', '15:00:00', '23:00:00', 8.0, 'afternoon', 60, true)
ON CONFLICT (shift_code_id) DO UPDATE SET
    shift_code = EXCLUDED.shift_code,
    shift_name = EXCLUDED.shift_name,
    start_time = EXCLUDED.start_time,
    end_time = EXCLUDED.end_time;

-- ============================================
-- PART 3: CREATE SHIFT ASSIGNMENTS AND TASKS
-- Using DO block with dynamic dates
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
    v_task_code VARCHAR(20);
    v_task_name VARCHAR(255);
    v_day_offset INTEGER;
    v_staff_index INTEGER;

    -- Task templates for each group
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

        -- Loop through stores (store 1-4 for testing)
        FOR v_store_id IN 1..4 LOOP

            -- Get staff for this store
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

                -- Assign shift: first 4 staff morning, last 4 afternoon
                IF v_staff_index <= 4 THEN
                    v_shift_code_id := 1; -- Ca sang 6h
                    v_start_time := '06:00:00'::TIME;
                    v_end_time := '14:00:00'::TIME;
                ELSE
                    v_shift_code_id := 5; -- Ca chieu 14:30
                    v_start_time := '14:30:00'::TIME;
                    v_end_time := '22:30:00'::TIME;
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

                    -- Determine task type based on staff role and time
                    IF v_staff.role IN ('MANAGER', 'STORE_LEADER_G3') THEN
                        -- Leader gets LEADER and POS tasks
                        IF v_task_index % 3 = 0 THEN
                            v_group_id := 'POS';
                            v_task_name := v_pos_tasks[1 + (v_task_index % array_length(v_pos_tasks, 1))];
                            v_task_code := '01' || LPAD(v_task_index::TEXT, 2, '0');
                        ELSIF v_slot_time >= v_start_time + INTERVAL '6 hours' AND v_slot_time < v_start_time + INTERVAL '7 hours' THEN
                            v_group_id := 'OTHER';
                            v_task_name := 'Break Time';
                            v_task_code := '1005';
                        ELSE
                            v_group_id := 'LEADER';
                            v_task_name := v_leader_tasks[1 + (v_task_index % array_length(v_leader_tasks, 1))];
                            v_task_code := '15' || LPAD(v_task_index::TEXT, 2, '0');
                        END IF;
                    ELSIF v_staff_index IN (2, 6) THEN
                        -- PERI staff
                        IF v_slot_time >= v_start_time + INTERVAL '3 hours' AND v_slot_time < v_start_time + INTERVAL '3 hours 30 minutes' THEN
                            v_group_id := 'QC-FSH';
                            v_task_name := v_qc_tasks[1 + (v_task_index % array_length(v_qc_tasks, 1))];
                            v_task_code := '08' || LPAD(v_task_index::TEXT, 2, '0');
                        ELSIF v_slot_time >= v_start_time + INTERVAL '6 hours' AND v_slot_time < v_start_time + INTERVAL '7 hours' THEN
                            v_group_id := 'OTHER';
                            v_task_name := 'Break Time';
                            v_task_code := '1005';
                        ELSE
                            v_group_id := 'PERI';
                            v_task_name := v_peri_tasks[1 + (v_task_index % array_length(v_peri_tasks, 1))];
                            v_task_code := '02' || LPAD(v_task_index::TEXT, 2, '0');
                        END IF;
                    ELSIF v_staff_index IN (3, 7) THEN
                        -- DRY staff
                        IF v_slot_time >= v_start_time + INTERVAL '3 hours' AND v_slot_time < v_start_time + INTERVAL '3 hours 30 minutes' THEN
                            v_group_id := 'QC-FSH';
                            v_task_name := v_qc_tasks[1 + (v_task_index % array_length(v_qc_tasks, 1))];
                            v_task_code := '08' || LPAD(v_task_index::TEXT, 2, '0');
                        ELSIF v_slot_time >= v_start_time + INTERVAL '6 hours' AND v_slot_time < v_start_time + INTERVAL '7 hours' THEN
                            v_group_id := 'OTHER';
                            v_task_name := 'Break Time';
                            v_task_code := '1005';
                        ELSE
                            v_group_id := 'DRY';
                            v_task_name := v_dry_tasks[1 + (v_task_index % array_length(v_dry_tasks, 1))];
                            v_task_code := '03' || LPAD(v_task_index::TEXT, 2, '0');
                        END IF;
                    ELSE
                        -- MMD staff
                        IF v_slot_time >= v_start_time + INTERVAL '3 hours' AND v_slot_time < v_start_time + INTERVAL '3 hours 30 minutes' THEN
                            v_group_id := 'QC-FSH';
                            v_task_name := v_qc_tasks[1 + (v_task_index % array_length(v_qc_tasks, 1))];
                            v_task_code := '08' || LPAD(v_task_index::TEXT, 2, '0');
                        ELSIF v_slot_time >= v_start_time + INTERVAL '6 hours' AND v_slot_time < v_start_time + INTERVAL '7 hours' THEN
                            v_group_id := 'OTHER';
                            v_task_name := 'Break Time';
                            v_task_code := '1005';
                        ELSE
                            v_group_id := 'MMD';
                            v_task_name := v_mmd_tasks[1 + (v_task_index % array_length(v_mmd_tasks, 1))];
                            v_task_code := '04' || LPAD(v_task_index::TEXT, 2, '0');
                        END IF;
                    END IF;

                    -- Insert task
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
                                CASE WHEN random() > 0.1 THEN 2 ELSE 3 END  -- Done or Skipped
                            WHEN v_date = CURRENT_DATE AND v_slot_time < CURRENT_TIME THEN
                                CASE WHEN random() > 0.2 THEN 2 ELSE 4 END  -- Done or In Progress
                            ELSE 1  -- Not Yet
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

    RAISE NOTICE 'DWS test data generation completed!';
END $$;

-- ============================================
-- PART 4: VERIFY DATA
-- ============================================
SELECT 'TASK GROUPS' AS table_name, COUNT(*) AS count FROM task_groups
UNION ALL
SELECT 'SHIFT CODES', COUNT(*) FROM shift_codes
UNION ALL
SELECT 'SHIFT ASSIGNMENTS', COUNT(*) FROM shift_assignments
UNION ALL
SELECT 'DAILY SCHEDULE TASKS', COUNT(*) FROM daily_schedule_tasks;

-- Check distribution by date
-- Status: 1=Not Yet, 2=Done, 3=Skipped, 4=In Progress
SELECT
    schedule_date,
    COUNT(*) AS total_tasks,
    COUNT(CASE WHEN status = 2 THEN 1 END) AS done,
    COUNT(CASE WHEN status = 1 THEN 1 END) AS not_yet,
    COUNT(CASE WHEN status = 3 THEN 1 END) AS skipped,
    COUNT(CASE WHEN status = 4 THEN 1 END) AS in_progress
FROM daily_schedule_tasks
WHERE store_id = 1
GROUP BY schedule_date
ORDER BY schedule_date;
