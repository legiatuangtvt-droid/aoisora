-- =============================================================================
-- SEED DATA: Acting/Concurrent Positions (Kiêm nhiệm)
-- =============================================================================
-- Ví dụ thực tế về các trường hợp kiêm nhiệm phổ biến:
--
-- 1. Region Manager kiêm Zone Manager (khi Zone Manager nghỉ/thiếu)
-- 2. Zone Manager kiêm Area Manager (khi Area Manager nghỉ/thiếu)
-- 3. Area Manager kiêm Store Leader (khi Store Leader nghỉ/thiếu)
-- 4. Store Leader (S3) kiêm quản lý store khác (cùng area)
-- 5. SI (S4) mở rộng phạm vi quản lý thêm stores
-- =============================================================================

SET NAMES utf8mb4;

-- =============================================================================
-- CASE 1: Region Manager kiêm Zone Manager
-- =============================================================================
-- Region Manager North (staff_id=1001) kiêm Zone Manager của Zone 2 (Bac Ninh-HP)
-- Lý do: Zone Manager Zone 2 nghỉ phép dài hạn

INSERT INTO staff_assignments (staff_id, assignment_type, scope_type, scope_id, effective_grade, notes, start_date, end_date)
VALUES (1001, 'acting', 'zone', 2, 'S6', 'Kiêm nhiệm Zone Bac Ninh-HP do ZM nghỉ phép', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 3 MONTH))
ON DUPLICATE KEY UPDATE notes = VALUES(notes), updated_at = CURRENT_TIMESTAMP;

-- =============================================================================
-- CASE 2: Zone Manager kiêm Area Manager
-- =============================================================================
-- Zone Manager Hanoi (staff_id=1011) kiêm Area Manager Long Bien (area_id=1)
-- Lý do: Area Manager Long Bien chuyển công tác, chưa có người thay

INSERT INTO staff_assignments (staff_id, assignment_type, scope_type, scope_id, effective_grade, notes, start_date)
VALUES (1011, 'acting', 'area', 1, 'S5', 'Kiêm nhiệm Area Long Bien - chờ tuyển AM mới', CURDATE())
ON DUPLICATE KEY UPDATE notes = VALUES(notes), updated_at = CURRENT_TIMESTAMP;

-- Zone Manager HCM (staff_id=1015) kiêm Area Manager Tan Phu (area_id=10)
INSERT INTO staff_assignments (staff_id, assignment_type, scope_type, scope_id, effective_grade, notes, start_date)
VALUES (1015, 'acting', 'area', 10, 'S5', 'Kiêm nhiệm Area Tan Phu tạm thời', CURDATE())
ON DUPLICATE KEY UPDATE notes = VALUES(notes), updated_at = CURRENT_TIMESTAMP;

-- =============================================================================
-- CASE 3: Area Manager kiêm Store Leader
-- =============================================================================
-- Area Manager Ha Dong (staff_id=1022) kiêm Store Leader của store đầu tiên trong area
-- Lý do: Store Leader nghỉ việc đột xuất

-- Lấy store_id đầu tiên trong Area 2 (Ha Dong)
SET @store_in_hadong = (SELECT store_id FROM stores WHERE area_id = 2 ORDER BY store_id LIMIT 1);

INSERT INTO staff_assignments (staff_id, assignment_type, scope_type, scope_id, effective_grade, notes, start_date)
SELECT 1022, 'acting', 'store', @store_in_hadong, 'S3', 'Kiêm nhiệm Store Leader - SL nghỉ việc', CURDATE()
FROM DUAL WHERE @store_in_hadong IS NOT NULL
ON DUPLICATE KEY UPDATE notes = VALUES(notes), updated_at = CURRENT_TIMESTAMP;

-- =============================================================================
-- CASE 4: Store Leader (S3) kiêm quản lý store khác cùng area
-- =============================================================================
-- Tìm 1 Store Leader S3 và gán kiêm nhiệm store kế bên

-- Store Leader của store 1 kiêm store 2 (nếu cùng area)
SET @sl_store1 = (
    SELECT sa.staff_id
    FROM staff_assignments sa
    JOIN staff s ON sa.staff_id = s.staff_id
    WHERE sa.scope_type = 'store'
      AND sa.scope_id = (SELECT MIN(store_id) FROM stores WHERE area_id = 1)
      AND sa.assignment_type = 'primary'
      AND s.job_grade = 'S3'
    LIMIT 1
);

SET @store2_in_area1 = (
    SELECT store_id FROM stores WHERE area_id = 1 ORDER BY store_id LIMIT 1 OFFSET 1
);

INSERT INTO staff_assignments (staff_id, assignment_type, scope_type, scope_id, effective_grade, notes, start_date)
SELECT @sl_store1, 'acting', 'store', @store2_in_area1, 'S3', 'Kiêm nhiệm store kế bên - hỗ trợ tạm thời', CURDATE()
FROM DUAL WHERE @sl_store1 IS NOT NULL AND @store2_in_area1 IS NOT NULL
ON DUPLICATE KEY UPDATE notes = VALUES(notes), updated_at = CURRENT_TIMESTAMP;

-- =============================================================================
-- CASE 5: SI (S4) mở rộng phạm vi quản lý
-- =============================================================================
-- SI đầu tiên (quản lý 3 stores) kiêm thêm 1 store nữa
-- Tình huống: Store đó không có SI phụ trách

SET @first_si = (
    SELECT staff_id FROM staff WHERE job_grade = 'S4' ORDER BY staff_id LIMIT 1
);

-- Tìm 1 store chưa có SI (hoặc store cuối cùng trong area 3)
SET @extra_store = (
    SELECT store_id FROM stores WHERE area_id = 3 ORDER BY store_id DESC LIMIT 1
);

INSERT INTO staff_assignments (staff_id, assignment_type, scope_type, scope_id, effective_grade, notes, start_date)
SELECT @first_si, 'acting', 'store', @extra_store, 'S4', 'Mở rộng phạm vi quản lý - hỗ trợ area', CURDATE()
FROM DUAL WHERE @first_si IS NOT NULL AND @extra_store IS NOT NULL
ON DUPLICATE KEY UPDATE notes = VALUES(notes), updated_at = CURRENT_TIMESTAMP;

-- =============================================================================
-- VERIFICATION: Hiển thị các vị trí kiêm nhiệm đã tạo
-- =============================================================================

SELECT
    s.staff_name,
    s.job_grade AS primary_grade,
    sa.effective_grade,
    sa.scope_type,
    sa.scope_id,
    CASE sa.scope_type
        WHEN 'region' THEN (SELECT region_name FROM regions WHERE region_id = sa.scope_id)
        WHEN 'zone' THEN (SELECT zone_name FROM zones WHERE zone_id = sa.scope_id)
        WHEN 'area' THEN (SELECT area_name FROM areas WHERE area_id = sa.scope_id)
        WHEN 'store' THEN (SELECT store_name FROM stores WHERE store_id = sa.scope_id)
    END AS scope_name,
    sa.assignment_type,
    sa.notes
FROM staff_assignments sa
JOIN staff s ON sa.staff_id = s.staff_id
WHERE sa.assignment_type = 'acting'
ORDER BY s.job_grade, sa.scope_type;

-- =============================================================================
-- SUMMARY
-- =============================================================================

SELECT
    'Acting Positions Summary' AS report,
    (SELECT COUNT(*) FROM staff_assignments WHERE assignment_type = 'acting') AS total_acting_positions,
    (SELECT COUNT(DISTINCT staff_id) FROM staff_assignments WHERE assignment_type = 'acting') AS staff_with_acting_roles;
