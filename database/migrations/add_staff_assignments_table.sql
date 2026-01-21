-- =============================================================================
-- MIGRATION: Add staff_assignments table for concurrent/acting positions
-- =============================================================================
-- Mục đích: Cho phép 1 người quản lý cấp cao kiêm nhiệm quản lý cấp thấp
-- Ví dụ:
--   - Region Manager kiêm Zone Manager của 1 zone
--   - Zone Manager kiêm Area Manager của 1 area
--   - Area Manager kiêm Store Leader của 1 store
--   - Store Leader kiêm quản lý store khác (khi thiếu người)
-- =============================================================================

SET NAMES utf8mb4;

-- =============================================================================
-- BẢNG staff_assignments: Lưu các vị trí/phạm vi quản lý của staff
-- =============================================================================
-- Mỗi staff có thể có nhiều assignments (vị trí chính + kiêm nhiệm)
-- assignment_type: 'primary' (chính) hoặc 'acting' (kiêm nhiệm)
-- scope_type: 'region', 'zone', 'area', 'store'
-- scope_id: ID của region/zone/area/store tương ứng

CREATE TABLE IF NOT EXISTS staff_assignments (
    assignment_id INT AUTO_INCREMENT PRIMARY KEY,
    staff_id INT NOT NULL,

    -- Loại assignment
    assignment_type ENUM('primary', 'acting') NOT NULL DEFAULT 'primary',
    -- primary: Vị trí chính thức
    -- acting: Kiêm nhiệm/tạm thời

    -- Phạm vi quản lý
    scope_type ENUM('region', 'zone', 'area', 'store') NOT NULL,
    scope_id INT NOT NULL,

    -- Job grade cho assignment này (có thể khác với job_grade chính)
    -- Ví dụ: S7 kiêm S6 → assignment có effective_grade = S6
    effective_grade VARCHAR(10) NULL,

    -- Thời gian hiệu lực (NULL = vô thời hạn)
    start_date DATE NULL,
    end_date DATE NULL,

    -- Trạng thái
    is_active TINYINT(1) DEFAULT 1,

    -- Ghi chú
    notes TEXT NULL,

    -- Audit
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT NULL,

    -- Constraints
    FOREIGN KEY (staff_id) REFERENCES staff(staff_id) ON DELETE CASCADE,

    -- Indexes
    INDEX idx_staff_id (staff_id),
    INDEX idx_scope (scope_type, scope_id),
    INDEX idx_active (is_active),
    INDEX idx_effective_grade (effective_grade),

    -- Unique: 1 staff chỉ có 1 assignment cho mỗi scope (trừ khi khác type)
    UNIQUE KEY unique_staff_scope (staff_id, scope_type, scope_id, assignment_type)
);

-- =============================================================================
-- VIEW: v_staff_all_assignments - Hiển thị tất cả assignments của staff
-- =============================================================================

CREATE OR REPLACE VIEW v_staff_all_assignments AS
SELECT
    sa.assignment_id,
    sa.staff_id,
    s.staff_name,
    s.staff_code,
    s.job_grade AS primary_grade,
    sa.effective_grade,
    COALESCE(sa.effective_grade, s.job_grade) AS working_grade,
    sa.assignment_type,
    sa.scope_type,
    sa.scope_id,
    CASE sa.scope_type
        WHEN 'region' THEN r.region_name
        WHEN 'zone' THEN z.zone_name
        WHEN 'area' THEN a.area_name
        WHEN 'store' THEN st.store_name
    END AS scope_name,
    sa.start_date,
    sa.end_date,
    sa.is_active,
    sa.notes
FROM staff_assignments sa
JOIN staff s ON sa.staff_id = s.staff_id
LEFT JOIN regions r ON sa.scope_type = 'region' AND sa.scope_id = r.region_id
LEFT JOIN zones z ON sa.scope_type = 'zone' AND sa.scope_id = z.zone_id
LEFT JOIN areas a ON sa.scope_type = 'area' AND sa.scope_id = a.area_id
LEFT JOIN stores st ON sa.scope_type = 'store' AND sa.scope_id = st.store_id
WHERE sa.is_active = 1
  AND (sa.end_date IS NULL OR sa.end_date >= CURDATE());

-- =============================================================================
-- VIEW: v_scope_managers - Tìm manager cho mỗi scope (ưu tiên primary > acting)
-- =============================================================================

CREATE OR REPLACE VIEW v_scope_managers AS
SELECT
    sa.scope_type,
    sa.scope_id,
    sa.staff_id,
    s.staff_name,
    s.staff_code,
    COALESCE(sa.effective_grade, s.job_grade) AS effective_grade,
    sa.assignment_type,
    CASE sa.scope_type
        WHEN 'region' THEN r.region_name
        WHEN 'zone' THEN z.zone_name
        WHEN 'area' THEN a.area_name
        WHEN 'store' THEN st.store_name
    END AS scope_name
FROM staff_assignments sa
JOIN staff s ON sa.staff_id = s.staff_id
LEFT JOIN regions r ON sa.scope_type = 'region' AND sa.scope_id = r.region_id
LEFT JOIN zones z ON sa.scope_type = 'zone' AND sa.scope_id = z.zone_id
LEFT JOIN areas a ON sa.scope_type = 'area' AND sa.scope_id = a.area_id
LEFT JOIN stores st ON sa.scope_type = 'store' AND sa.scope_id = st.store_id
WHERE sa.is_active = 1
  AND (sa.end_date IS NULL OR sa.end_date >= CURDATE())
ORDER BY
    sa.scope_type,
    sa.scope_id,
    CASE sa.assignment_type WHEN 'primary' THEN 1 ELSE 2 END;

-- =============================================================================
-- MIGRATE: Tạo assignments từ data hiện có trong staff table
-- =============================================================================

-- Insert Region Manager assignments (S7)
INSERT INTO staff_assignments (staff_id, assignment_type, scope_type, scope_id, effective_grade)
SELECT staff_id, 'primary', 'region', region_id, 'S7'
FROM staff
WHERE job_grade = 'S7' AND region_id IS NOT NULL
ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;

-- Insert Zone Manager assignments (S6)
INSERT INTO staff_assignments (staff_id, assignment_type, scope_type, scope_id, effective_grade)
SELECT staff_id, 'primary', 'zone', zone_id, 'S6'
FROM staff
WHERE job_grade = 'S6' AND zone_id IS NOT NULL
ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;

-- Insert Area Manager assignments (S5)
INSERT INTO staff_assignments (staff_id, assignment_type, scope_type, scope_id, effective_grade)
SELECT staff_id, 'primary', 'area', area_id, 'S5'
FROM staff
WHERE job_grade = 'S5' AND area_id IS NOT NULL
ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;

-- Insert Store assignments (S4, S3, S2)
INSERT INTO staff_assignments (staff_id, assignment_type, scope_type, scope_id, effective_grade)
SELECT staff_id, 'primary', 'store', store_id, job_grade
FROM staff
WHERE job_grade IN ('S4', 'S3', 'S2') AND store_id IS NOT NULL
ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;

-- =============================================================================
-- SAMPLE: Ví dụ kiêm nhiệm - Region Manager kiêm Zone Manager
-- =============================================================================

-- Uncomment để test: Region Manager North (staff_id=1001) kiêm Zone Manager Hanoi (zone_id=1)
-- INSERT INTO staff_assignments (staff_id, assignment_type, scope_type, scope_id, effective_grade, notes)
-- VALUES (1001, 'acting', 'zone', 1, 'S6', 'Kiêm nhiệm Zone Manager Hanoi do thiếu nhân sự');

-- =============================================================================
-- STORED PROCEDURE: Gán kiêm nhiệm cho staff
-- =============================================================================

DELIMITER //

DROP PROCEDURE IF EXISTS assign_acting_position//

CREATE PROCEDURE assign_acting_position(
    IN p_staff_id INT,
    IN p_scope_type VARCHAR(20),
    IN p_scope_id INT,
    IN p_effective_grade VARCHAR(10),
    IN p_notes TEXT,
    IN p_end_date DATE
)
BEGIN
    DECLARE v_staff_grade VARCHAR(10);
    DECLARE v_grade_order INT;
    DECLARE v_effective_order INT;

    -- Lấy job grade của staff
    SELECT job_grade INTO v_staff_grade FROM staff WHERE staff_id = p_staff_id;

    -- Validate: Staff phải tồn tại
    IF v_staff_grade IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Staff not found';
    END IF;

    -- Validate: effective_grade phải thấp hơn hoặc bằng job_grade chính
    -- Grade order: S7=1, S6=2, S5=3, S4=4, S3=5, S2=6, S1=7
    SET v_grade_order = CASE v_staff_grade
        WHEN 'S7' THEN 1 WHEN 'S6' THEN 2 WHEN 'S5' THEN 3 WHEN 'S4' THEN 4
        WHEN 'S3' THEN 5 WHEN 'S2' THEN 6 WHEN 'S1' THEN 7 ELSE 99 END;

    SET v_effective_order = CASE p_effective_grade
        WHEN 'S7' THEN 1 WHEN 'S6' THEN 2 WHEN 'S5' THEN 3 WHEN 'S4' THEN 4
        WHEN 'S3' THEN 5 WHEN 'S2' THEN 6 WHEN 'S1' THEN 7 ELSE 99 END;

    IF v_effective_order < v_grade_order THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Cannot assign higher grade than primary grade';
    END IF;

    -- Insert acting assignment
    INSERT INTO staff_assignments (
        staff_id, assignment_type, scope_type, scope_id,
        effective_grade, notes, start_date, end_date
    ) VALUES (
        p_staff_id, 'acting', p_scope_type, p_scope_id,
        p_effective_grade, p_notes, CURDATE(), p_end_date
    )
    ON DUPLICATE KEY UPDATE
        effective_grade = p_effective_grade,
        notes = p_notes,
        end_date = p_end_date,
        is_active = 1,
        updated_at = CURRENT_TIMESTAMP;

    SELECT 'Acting position assigned successfully' AS message;
END//

DELIMITER ;

-- =============================================================================
-- STORED PROCEDURE: Lấy tất cả managers của 1 scope (bao gồm kiêm nhiệm)
-- =============================================================================

DELIMITER //

DROP PROCEDURE IF EXISTS get_scope_managers//

CREATE PROCEDURE get_scope_managers(
    IN p_scope_type VARCHAR(20),
    IN p_scope_id INT
)
BEGIN
    SELECT
        sa.staff_id,
        s.staff_name,
        s.staff_code,
        s.job_grade AS primary_grade,
        COALESCE(sa.effective_grade, s.job_grade) AS effective_grade,
        sa.assignment_type,
        sa.notes,
        sa.start_date,
        sa.end_date
    FROM staff_assignments sa
    JOIN staff s ON sa.staff_id = s.staff_id
    WHERE sa.scope_type = p_scope_type
      AND sa.scope_id = p_scope_id
      AND sa.is_active = 1
      AND (sa.end_date IS NULL OR sa.end_date >= CURDATE())
    ORDER BY
        CASE sa.assignment_type WHEN 'primary' THEN 1 ELSE 2 END,
        s.job_grade;
END//

DELIMITER ;

-- =============================================================================
-- VERIFICATION
-- =============================================================================

SELECT 'staff_assignments table created' AS status;

SELECT
    scope_type,
    assignment_type,
    COUNT(*) as count
FROM staff_assignments
GROUP BY scope_type, assignment_type
ORDER BY scope_type, assignment_type;
