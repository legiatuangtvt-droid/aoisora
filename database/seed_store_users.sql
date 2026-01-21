-- =============================================================================
-- SEED DATA: Store Users (S7, S6, S5, S4, S3, S2, S1)
-- =============================================================================
-- Cấu trúc:
-- - S7 (Region Manager): 1 người/region → 3 người
-- - S6 (Zone Manager): 1 người/zone → 6 người
-- - S5 (Area Manager): 1 người/area → 14 người
-- - S4 (SI - Store In-charge): Quản lý 2+ stores
-- - S3 (Store Leader): Quản lý 1 store
-- - S2 (Deputy Store Leader): Phó quản lý
-- - S1 (Staff): Nhân viên
--
-- Mỗi store ~10 người: 1 S3/S4 + 1 S2 + ~8 S1
-- Tỷ lệ: S2 trở lên = Full-time, S1 = 40% Full-time + 60% Part-time
-- =============================================================================

SET NAMES utf8mb4;
SET @start_id = 1000; -- Start ID để tránh conflict với HQ users

-- =============================================================================
-- CLEANUP: Xóa store users cũ (giữ lại HQ users có staff_id < 1000)
-- =============================================================================
DELETE FROM staff WHERE staff_id >= 1000;

-- =============================================================================
-- PHẦN 1: REGION MANAGERS (S7) - 3 người, mỗi người quản lý 1 region
-- =============================================================================

INSERT INTO staff (staff_id, staff_name, staff_code, username, email, phone, region_id, zone_id, area_id, store_id, role, position, job_grade, password_hash, status, is_active) VALUES
-- Region 1: The North
(@start_id + 1, 'Nguyễn Văn Bắc', 'RM001', 'rm_north', 'rm.north@aeon.vn', '0901000001', 1, NULL, NULL, NULL, 'REGION_MANAGER', 'Region Manager - North', 'S7', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active', 1),

-- Region 2: The Central
(@start_id + 2, 'Trần Văn Trung', 'RM002', 'rm_central', 'rm.central@aeon.vn', '0901000002', 2, NULL, NULL, NULL, 'REGION_MANAGER', 'Region Manager - Central', 'S7', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active', 1),

-- Region 3: The South
(@start_id + 3, 'Lê Văn Nam', 'RM003', 'rm_south', 'rm.south@aeon.vn', '0901000003', 3, NULL, NULL, NULL, 'REGION_MANAGER', 'Region Manager - South', 'S7', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active', 1);

-- =============================================================================
-- PHẦN 2: ZONE MANAGERS (S6) - 6 người, mỗi người quản lý 1 zone
-- =============================================================================

INSERT INTO staff (staff_id, staff_name, staff_code, username, email, phone, region_id, zone_id, area_id, store_id, line_manager_id, role, position, job_grade, password_hash, status, is_active) VALUES
-- Zone 1: Hanoi (Region 1)
(@start_id + 11, 'Phạm Minh Hà', 'ZM001', 'zm_hanoi', 'zm.hanoi@aeon.vn', '0902000001', 1, 1, NULL, NULL, @start_id + 1, 'ZONE_MANAGER', 'Zone Manager - Hanoi', 'S6', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active', 1),

-- Zone 2: Bac Ninh - Hai Phong (Region 1)
(@start_id + 12, 'Hoàng Thị Hải', 'ZM002', 'zm_bacninh', 'zm.bacninh@aeon.vn', '0902000002', 1, 2, NULL, NULL, @start_id + 1, 'ZONE_MANAGER', 'Zone Manager - Bac Ninh HP', 'S6', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active', 1),

-- Zone 3: Da Nang (Region 2)
(@start_id + 13, 'Võ Văn Đà', 'ZM003', 'zm_danang', 'zm.danang@aeon.vn', '0902000003', 2, 3, NULL, NULL, @start_id + 2, 'ZONE_MANAGER', 'Zone Manager - Da Nang', 'S6', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active', 1),

-- Zone 4: Hue - Quang Nam (Region 2)
(@start_id + 14, 'Nguyễn Thị Huế', 'ZM004', 'zm_hue', 'zm.hue@aeon.vn', '0902000004', 2, 4, NULL, NULL, @start_id + 2, 'ZONE_MANAGER', 'Zone Manager - Hue QN', 'S6', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active', 1),

-- Zone 5: Ho Chi Minh City (Region 3)
(@start_id + 15, 'Trần Văn Sài', 'ZM005', 'zm_hcm', 'zm.hcm@aeon.vn', '0902000005', 3, 5, NULL, NULL, @start_id + 3, 'ZONE_MANAGER', 'Zone Manager - HCM', 'S6', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active', 1),

-- Zone 6: Binh Duong - Dong Nai (Region 3)
(@start_id + 16, 'Lê Thị Bình', 'ZM006', 'zm_binhduong', 'zm.binhduong@aeon.vn', '0902000006', 3, 6, NULL, NULL, @start_id + 3, 'ZONE_MANAGER', 'Zone Manager - BD DN', 'S6', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active', 1);

-- =============================================================================
-- PHẦN 3: AREA MANAGERS (S5) - 14 người, mỗi người quản lý 1 area
-- =============================================================================

INSERT INTO staff (staff_id, staff_name, staff_code, username, email, phone, region_id, zone_id, area_id, store_id, line_manager_id, role, position, job_grade, password_hash, status, is_active) VALUES
-- Zone 1 Areas (Hanoi)
(@start_id + 21, 'Đỗ Văn Long', 'AM001', 'am_longbien', 'am.longbien@aeon.vn', '0903000001', 1, 1, 1, NULL, @start_id + 11, 'AREA_MANAGER', 'Area Manager - Long Bien', 'S5', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active', 1),
(@start_id + 22, 'Bùi Thị Hà', 'AM002', 'am_hadong', 'am.hadong@aeon.vn', '0903000002', 1, 1, 2, NULL, @start_id + 11, 'AREA_MANAGER', 'Area Manager - Ha Dong', 'S5', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active', 1),
(@start_id + 23, 'Ngô Văn Giấy', 'AM003', 'am_caugiay', 'am.caugiay@aeon.vn', '0903000003', 1, 1, 3, NULL, @start_id + 11, 'AREA_MANAGER', 'Area Manager - Cau Giay', 'S5', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active', 1),

-- Zone 2 Areas (Bac Ninh - Hai Phong)
(@start_id + 24, 'Trịnh Văn Ninh', 'AM004', 'am_bacninh', 'am.bacninh@aeon.vn', '0903000004', 1, 2, 4, NULL, @start_id + 12, 'AREA_MANAGER', 'Area Manager - Bac Ninh', 'S5', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active', 1),
(@start_id + 25, 'Đinh Thị Phòng', 'AM005', 'am_hongbang', 'am.hongbang@aeon.vn', '0903000005', 1, 2, 5, NULL, @start_id + 12, 'AREA_MANAGER', 'Area Manager - Hong Bang', 'S5', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active', 1),

-- Zone 3 Areas (Da Nang)
(@start_id + 26, 'Phan Văn Châu', 'AM006', 'am_haichau', 'am.haichau@aeon.vn', '0903000006', 2, 3, 6, NULL, @start_id + 13, 'AREA_MANAGER', 'Area Manager - Hai Chau', 'S5', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active', 1),
(@start_id + 27, 'Lý Thị Khê', 'AM007', 'am_thanhkhe', 'am.thanhkhe@aeon.vn', '0903000007', 2, 3, 7, NULL, @start_id + 13, 'AREA_MANAGER', 'Area Manager - Thanh Khe', 'S5', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active', 1),

-- Zone 4 Areas (Hue - Quang Nam)
(@start_id + 28, 'Mai Văn Huế', 'AM008', 'am_huecity', 'am.huecity@aeon.vn', '0903000008', 2, 4, 8, NULL, @start_id + 14, 'AREA_MANAGER', 'Area Manager - Hue City', 'S5', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active', 1),
(@start_id + 29, 'Tạ Thị An', 'AM009', 'am_hoian', 'am.hoian@aeon.vn', '0903000009', 2, 4, 9, NULL, @start_id + 14, 'AREA_MANAGER', 'Area Manager - Hoi An', 'S5', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active', 1),

-- Zone 5 Areas (HCM)
(@start_id + 30, 'Dương Văn Phú', 'AM010', 'am_tanphu', 'am.tanphu@aeon.vn', '0903000010', 3, 5, 10, NULL, @start_id + 15, 'AREA_MANAGER', 'Area Manager - Tan Phu', 'S5', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active', 1),
(@start_id + 31, 'Vương Thị Tân', 'AM011', 'am_binhtan', 'am.binhtan@aeon.vn', '0903000011', 3, 5, 11, NULL, @start_id + 15, 'AREA_MANAGER', 'Area Manager - Binh Tan', 'S5', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active', 1),
(@start_id + 32, 'Chu Văn Bảy', 'AM012', 'am_district7', 'am.district7@aeon.vn', '0903000012', 3, 5, 12, NULL, @start_id + 15, 'AREA_MANAGER', 'Area Manager - District 7', 'S5', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active', 1),

-- Zone 6 Areas (Binh Duong - Dong Nai)
(@start_id + 33, 'Hồ Văn Thuận', 'AM013', 'am_thuanan', 'am.thuanan@aeon.vn', '0903000013', 3, 6, 13, NULL, @start_id + 16, 'AREA_MANAGER', 'Area Manager - Thuan An', 'S5', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active', 1),
(@start_id + 34, 'Cao Thị Hòa', 'AM014', 'am_bienhoa', 'am.bienhoa@aeon.vn', '0903000014', 3, 6, 14, NULL, @start_id + 16, 'AREA_MANAGER', 'Area Manager - Bien Hoa', 'S5', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active', 1);

-- =============================================================================
-- PHẦN 4: STORE LEADERS & STAFF - Sử dụng Stored Procedure để tạo tự động
-- =============================================================================

-- Tạo procedure để sinh store staff
DELIMITER //

DROP PROCEDURE IF EXISTS seed_store_staff//

CREATE PROCEDURE seed_store_staff()
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE v_store_id INT;
    DECLARE v_store_code VARCHAR(50);
    DECLARE v_store_name VARCHAR(255);
    DECLARE v_region_id INT;
    DECLARE v_zone_id INT;
    DECLARE v_area_id INT;
    DECLARE v_area_manager_id INT;
    DECLARE v_staff_counter INT DEFAULT 0;
    DECLARE v_store_counter INT DEFAULT 0;
    DECLARE v_si_id INT DEFAULT NULL; -- Current SI (S4) managing multiple stores
    DECLARE v_si_store_count INT DEFAULT 0; -- Stores assigned to current SI

    -- Vietnamese first names (50 names)
    DECLARE v_first_names VARCHAR(2000) DEFAULT 'An,Bình,Châu,Dũng,Em,Phúc,Giang,Hải,Inh,Khải,Linh,Minh,Ngọc,Oanh,Phương,Quân,Rồng,Sơn,Tâm,Uyên,Vân,Xuân,Yến,Ánh,Bảo,Cường,Dương,Hà,Hiền,Hùng,Hương,Khánh,Lan,Long,Mai,Nam,Nhung,Phong,Quỳnh,Sang,Thảo,Thuỷ,Tiến,Trang,Trung,Tuấn,Tuyết,Vinh,Vũ,Yên';

    -- Vietnamese last names (20 names)
    DECLARE v_last_names VARCHAR(500) DEFAULT 'Nguyễn,Trần,Lê,Phạm,Hoàng,Huỳnh,Phan,Vũ,Võ,Đặng,Bùi,Đỗ,Hồ,Ngô,Dương,Lý,Đinh,Trịnh,Mai,Cao';

    DECLARE v_first_name VARCHAR(50);
    DECLARE v_last_name VARCHAR(50);
    DECLARE v_staff_name VARCHAR(100);
    DECLARE v_username VARCHAR(100);
    DECLARE v_email VARCHAR(100);
    DECLARE v_phone VARCHAR(20);
    DECLARE v_staff_code VARCHAR(50);
    DECLARE v_job_grade VARCHAR(10);
    DECLARE v_position VARCHAR(100);
    DECLARE v_role VARCHAR(50);
    DECLARE v_is_fulltime TINYINT;
    DECLARE v_line_manager_id INT;
    DECLARE v_current_id INT DEFAULT 2000; -- Start ID for store staff

    DECLARE v_i INT;
    DECLARE v_staff_per_store INT DEFAULT 10; -- Total staff per store including leaders

    -- Cursor for stores (join with areas to get zone_id)
    DECLARE store_cursor CURSOR FOR
        SELECT s.store_id, s.store_code, s.store_name, s.region_id, a.zone_id, s.area_id
        FROM stores s
        JOIN areas a ON s.area_id = a.area_id
        ORDER BY s.area_id, s.store_id;

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    -- Clear existing store staff (S1-S4 only, preserve S5-S7)
    DELETE FROM staff WHERE job_grade IN ('S1', 'S2', 'S3', 'S4') AND staff_id >= 2000;

    OPEN store_cursor;

    store_loop: LOOP
        FETCH store_cursor INTO v_store_id, v_store_code, v_store_name, v_region_id, v_zone_id, v_area_id;

        IF done THEN
            LEAVE store_loop;
        END IF;

        SET v_store_counter = v_store_counter + 1;

        -- Get Area Manager ID for this store
        SELECT staff_id INTO v_area_manager_id
        FROM staff
        WHERE job_grade = 'S5' AND area_id = v_area_id
        LIMIT 1;

        -- Every 3 stores, create a new SI (S4)
        IF v_si_store_count >= 3 OR v_si_id IS NULL THEN
            SET v_si_store_count = 0;
            SET v_current_id = v_current_id + 1;
            SET v_si_id = v_current_id;

            -- Create SI (S4) - Store In-charge
            SET v_first_name = SUBSTRING_INDEX(SUBSTRING_INDEX(v_first_names, ',', FLOOR(1 + RAND() * 50)), ',', -1);
            SET v_last_name = SUBSTRING_INDEX(SUBSTRING_INDEX(v_last_names, ',', FLOOR(1 + RAND() * 20)), ',', -1);
            SET v_staff_name = CONCAT(v_last_name, ' ', v_first_name);
            SET v_staff_code = CONCAT('SI', LPAD(v_current_id - 2000, 4, '0'));
            SET v_username = CONCAT('si_', v_store_code);
            SET v_email = CONCAT('si.', v_store_code, '@aeon.vn');
            SET v_phone = CONCAT('090400', LPAD(v_current_id - 2000, 4, '0'));

            INSERT INTO staff (staff_id, staff_name, staff_code, username, email, phone, region_id, zone_id, area_id, store_id, line_manager_id, role, position, job_grade, password_hash, status, is_active)
            VALUES (v_current_id, v_staff_name, v_staff_code, v_username, v_email, v_phone, v_region_id, v_zone_id, v_area_id, v_store_id, v_area_manager_id, 'STORE_INCHARGE', CONCAT('Store In-charge - ', v_store_name), 'S4', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active', 1);
        END IF;

        SET v_si_store_count = v_si_store_count + 1;

        -- Create S3 (Store Leader) for this store
        SET v_current_id = v_current_id + 1;
        SET v_first_name = SUBSTRING_INDEX(SUBSTRING_INDEX(v_first_names, ',', FLOOR(1 + RAND() * 50)), ',', -1);
        SET v_last_name = SUBSTRING_INDEX(SUBSTRING_INDEX(v_last_names, ',', FLOOR(1 + RAND() * 20)), ',', -1);
        SET v_staff_name = CONCAT(v_last_name, ' ', v_first_name);
        SET v_staff_code = CONCAT('SL', LPAD(v_store_counter, 4, '0'));
        SET v_username = CONCAT('sl_', v_store_code);
        SET v_email = CONCAT('sl.', v_store_code, '@aeon.vn');
        SET v_phone = CONCAT('090300', LPAD(v_store_counter, 4, '0'));

        INSERT INTO staff (staff_id, staff_name, staff_code, username, email, phone, region_id, zone_id, area_id, store_id, line_manager_id, role, position, job_grade, password_hash, status, is_active)
        VALUES (v_current_id, v_staff_name, v_staff_code, v_username, v_email, v_phone, v_region_id, v_zone_id, v_area_id, v_store_id, v_si_id, 'STORE_LEADER', CONCAT('Store Leader - ', v_store_name), 'S3', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active', 1);

        SET v_line_manager_id = v_current_id; -- S3 is line manager for S2 and S1

        -- Create S2 (Deputy Store Leader) - 1 per store
        SET v_current_id = v_current_id + 1;
        SET v_first_name = SUBSTRING_INDEX(SUBSTRING_INDEX(v_first_names, ',', FLOOR(1 + RAND() * 50)), ',', -1);
        SET v_last_name = SUBSTRING_INDEX(SUBSTRING_INDEX(v_last_names, ',', FLOOR(1 + RAND() * 20)), ',', -1);
        SET v_staff_name = CONCAT(v_last_name, ' ', v_first_name);
        SET v_staff_code = CONCAT('DSL', LPAD(v_store_counter, 4, '0'));
        SET v_username = CONCAT('dsl_', v_store_code);
        SET v_email = CONCAT('dsl.', v_store_code, '@aeon.vn');
        SET v_phone = CONCAT('090200', LPAD(v_store_counter, 4, '0'));

        INSERT INTO staff (staff_id, staff_name, staff_code, username, email, phone, region_id, zone_id, area_id, store_id, line_manager_id, role, position, job_grade, password_hash, status, is_active)
        VALUES (v_current_id, v_staff_name, v_staff_code, v_username, v_email, v_phone, v_region_id, v_zone_id, v_area_id, v_store_id, v_line_manager_id, 'DEPUTY_STORE_LEADER', CONCAT('Deputy Store Leader - ', v_store_name), 'S2', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active', 1);

        -- Create S1 (Staff) - 7 per store (to reach ~10 total)
        -- 3 full-time (40%) + 4 part-time (60%)
        SET v_i = 1;
        WHILE v_i <= 7 DO
            SET v_current_id = v_current_id + 1;
            SET v_staff_counter = v_staff_counter + 1;

            SET v_first_name = SUBSTRING_INDEX(SUBSTRING_INDEX(v_first_names, ',', FLOOR(1 + RAND() * 50)), ',', -1);
            SET v_last_name = SUBSTRING_INDEX(SUBSTRING_INDEX(v_last_names, ',', FLOOR(1 + RAND() * 20)), ',', -1);
            SET v_staff_name = CONCAT(v_last_name, ' ', v_first_name);
            SET v_staff_code = CONCAT('ST', LPAD(v_staff_counter, 5, '0'));
            SET v_username = CONCAT('staff_', v_store_code, '_', v_i);
            SET v_email = CONCAT('staff', v_staff_counter, '@aeon.vn');
            SET v_phone = CONCAT('090100', LPAD(v_staff_counter, 4, '0'));

            -- First 3 are full-time, rest are part-time
            IF v_i <= 3 THEN
                SET v_position = CONCAT('Staff (Full-time) - ', v_store_name);
                SET v_role = 'STAFF_FULLTIME';
            ELSE
                SET v_position = CONCAT('Staff (Part-time) - ', v_store_name);
                SET v_role = 'STAFF_PARTTIME';
            END IF;

            INSERT INTO staff (staff_id, staff_name, staff_code, username, email, phone, region_id, zone_id, area_id, store_id, line_manager_id, role, position, job_grade, password_hash, status, is_active)
            VALUES (v_current_id, v_staff_name, v_staff_code, v_username, v_email, v_phone, v_region_id, v_zone_id, v_area_id, v_store_id, v_line_manager_id, v_role, v_position, 'S1', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active', 1);

            SET v_i = v_i + 1;
        END WHILE;

    END LOOP;

    CLOSE store_cursor;

    -- Output summary
    SELECT
        'Store Staff Seeding Complete' as message,
        v_store_counter as stores_processed,
        v_staff_counter as s1_staff_created;

END//

DELIMITER ;

-- Execute the procedure
CALL seed_store_staff();

-- Drop the procedure after use
DROP PROCEDURE IF EXISTS seed_store_staff;

-- =============================================================================
-- PHẦN 5: VERIFICATION QUERIES
-- =============================================================================

-- Summary by job grade
SELECT
    job_grade,
    COUNT(*) as total,
    SUM(CASE WHEN role LIKE '%FULLTIME%' OR job_grade IN ('S2', 'S3', 'S4', 'S5', 'S6', 'S7') THEN 1 ELSE 0 END) as fulltime,
    SUM(CASE WHEN role LIKE '%PARTTIME%' THEN 1 ELSE 0 END) as parttime
FROM staff
WHERE job_grade LIKE 'S%'
GROUP BY job_grade
ORDER BY job_grade DESC;

-- Sample data check
SELECT staff_id, staff_name, staff_code, username, job_grade, position, store_id, area_id, zone_id, region_id
FROM staff
WHERE job_grade LIKE 'S%'
ORDER BY job_grade DESC, staff_id
LIMIT 30;
