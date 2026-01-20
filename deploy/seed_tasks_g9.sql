-- ============================================
-- Aoisora Seed Data - Tasks for G9 User
-- Run this AFTER seed_data_mysql.sql
-- ============================================

-- ============================================
-- UPDATE STAFF - Set job_grade for existing users
-- ============================================

-- Admin User = G9 (highest grade, can see all tasks)
UPDATE `staff` SET `job_grade` = 'G9' WHERE `staff_id` = 1;
-- Manager = G6
UPDATE `staff` SET `job_grade` = 'G6' WHERE `staff_id` = 2;
-- Staff1 = G3
UPDATE `staff` SET `job_grade` = 'G3' WHERE `staff_id` = 3;
-- QC1 = G3
UPDATE `staff` SET `job_grade` = 'G3' WHERE `staff_id` = 4;
-- Acc1 = G3
UPDATE `staff` SET `job_grade` = 'G3' WHERE `staff_id` = 5;

-- ============================================
-- ADDITIONAL STAFF - Different grades for testing
-- Password: Password123! (bcrypt hash)
-- ============================================

INSERT INTO `staff` (`staff_name`, `staff_code`, `username`, `email`, `phone`, `store_id`, `department_id`, `team_id`, `role`, `position`, `job_grade`, `sap_code`, `password_hash`, `status`) VALUES
('Trần Văn G8', 'G8001', 'g8user', 'g8@aoisora.vn', '0901234580', 1, 1, 'QC_DRY', 'MANAGER', 'Senior Manager', 'G8', 'SAP010', '$2y$10$wMUXEBLWnyfQ5S6k0AykoODieUy.QiIpzzCGUHki/EnZ6QcogJuYm', 'active'),
('Nguyễn Thị G7', 'G7001', 'g7user', 'g7@aoisora.vn', '0901234581', 1, 1, 'QC_DRY', 'MANAGER', 'Area Manager', 'G7', 'SAP011', '$2y$10$wMUXEBLWnyfQ5S6k0AykoODieUy.QiIpzzCGUHki/EnZ6QcogJuYm', 'active'),
('Lê Văn G5', 'G5001', 'g5user', 'g5@aoisora.vn', '0901234582', 1, 1, 'QC_DRY', 'STAFF', 'Team Lead', 'G5', 'SAP012', '$2y$10$wMUXEBLWnyfQ5S6k0AykoODieUy.QiIpzzCGUHki/EnZ6QcogJuYm', 'active'),
('Phạm Văn G4', 'G4001', 'g4user', 'g4@aoisora.vn', '0901234583', 1, 1, 'QC_DRY', 'STAFF', 'Senior Staff', 'G4', 'SAP013', '$2y$10$wMUXEBLWnyfQ5S6k0AykoODieUy.QiIpzzCGUHki/EnZ6QcogJuYm', 'active'),
('Hoàng Văn G2', 'G2001', 'g2user', 'g2@aoisora.vn', '0901234584', 1, 1, 'QC_DRY', 'STAFF', 'Junior Staff', 'G2', 'SAP014', '$2y$10$wMUXEBLWnyfQ5S6k0AykoODieUy.QiIpzzCGUHki/EnZ6QcogJuYm', 'active');

-- Note: New staff IDs will be auto-incremented based on existing data
-- The line_manager updates below should be adjusted after checking actual staff_id values

-- ============================================
-- TASKS - 60 tasks with various statuses
-- G9 (admin, staff_id=1) should see all these tasks
-- ============================================

-- Clear existing tasks first
DELETE FROM `tasks`;

-- Reset auto increment
ALTER TABLE `tasks` AUTO_INCREMENT = 1;

-- ============================================
-- DRAFT Tasks (10 tasks) - status_id = 12
-- ============================================

INSERT INTO `tasks` (`task_name`, `task_description`, `source`, `task_type_id`, `response_type_id`, `dept_id`, `assigned_store_id`, `status_id`, `priority`, `start_date`, `end_date`, `created_staff_id`, `approver_id`) VALUES
('Lập kế hoạch kiểm kê Q1', 'Lên kế hoạch kiểm kê hàng hóa quý 1', 'task_list', 1, 5, 1, 1, 12, 'normal', DATE_ADD(CURDATE(), INTERVAL 7 DAY), DATE_ADD(CURDATE(), INTERVAL 14 DAY), 1, 1),
('Chuẩn bị báo cáo tài chính', 'Draft báo cáo tài chính cuối năm', 'task_list', 1, 6, 2, 1, 12, 'high', DATE_ADD(CURDATE(), INTERVAL 5 DAY), DATE_ADD(CURDATE(), INTERVAL 12 DAY), 2, 1),
('Kế hoạch training Q2', 'Lập kế hoạch đào tạo nhân viên Q2', 'task_list', 3, 6, 3, 1, 12, 'normal', DATE_ADD(CURDATE(), INTERVAL 10 DAY), DATE_ADD(CURDATE(), INTERVAL 30 DAY), 1, 1),
('Đề xuất cải tiến quy trình', 'Đề xuất cải tiến quy trình vận hành', 'task_list', 1, 6, 1, 2, 12, 'normal', DATE_ADD(CURDATE(), INTERVAL 3 DAY), DATE_ADD(CURDATE(), INTERVAL 10 DAY), 6, 1),
('Thiết kế layout mới', 'Thiết kế layout kệ hàng mới cho Q2', 'task_list', 2, 4, 1, 1, 12, 'normal', DATE_ADD(CURDATE(), INTERVAL 15 DAY), DATE_ADD(CURDATE(), INTERVAL 25 DAY), 7, 6),
('Kế hoạch khuyến mãi Tết', 'Lên kế hoạch chương trình khuyến mãi Tết', 'task_list', 2, 4, 1, 1, 12, 'high', DATE_ADD(CURDATE(), INTERVAL 20 DAY), DATE_ADD(CURDATE(), INTERVAL 35 DAY), 1, 1),
('Đánh giá nhà cung cấp', 'Đánh giá và xếp hạng nhà cung cấp', 'task_list', 1, 5, 1, 3, 12, 'normal', DATE_ADD(CURDATE(), INTERVAL 8 DAY), DATE_ADD(CURDATE(), INTERVAL 15 DAY), 2, 1),
('Kế hoạch bảo trì thiết bị', 'Lập kế hoạch bảo trì thiết bị định kỳ', 'task_list', 3, 5, 4, 1, 12, 'normal', DATE_ADD(CURDATE(), INTERVAL 12 DAY), DATE_ADD(CURDATE(), INTERVAL 20 DAY), 1, 1),
('Cập nhật manual POS', 'Cập nhật hướng dẫn sử dụng POS mới', 'library', 3, 6, 4, NULL, 12, 'normal', NULL, NULL, 1, 1),
('Template kiểm tra an toàn', 'Tạo template kiểm tra an toàn lao động', 'library', 3, 5, 1, NULL, 12, 'high', NULL, NULL, 6, 1);

-- ============================================
-- APPROVE Tasks (8 tasks) - status_id = 13
-- ============================================

INSERT INTO `tasks` (`task_name`, `task_description`, `source`, `task_type_id`, `response_type_id`, `dept_id`, `assigned_store_id`, `status_id`, `priority`, `start_date`, `end_date`, `created_staff_id`, `approver_id`, `submitted_at`) VALUES
('Kiểm kê kho tháng 1', 'Kiểm kê hàng hóa trong kho tháng 1', 'task_list', 1, 5, 1, 1, 13, 'high', DATE_ADD(CURDATE(), INTERVAL 2 DAY), DATE_ADD(CURDATE(), INTERVAL 5 DAY), 2, 1, NOW()),
('Sắp xếp kệ Tết', 'Sắp xếp kệ hàng cho mùa Tết', 'task_list', 2, 4, 1, 1, 13, 'urgent', DATE_ADD(CURDATE(), INTERVAL 1 DAY), DATE_ADD(CURDATE(), INTERVAL 7 DAY), 3, 2, NOW()),
('Kiểm tra PCCC tháng 1', 'Kiểm tra thiết bị PCCC định kỳ', 'task_list', 3, 5, 1, 2, 13, 'high', DATE_ADD(CURDATE(), INTERVAL 3 DAY), DATE_ADD(CURDATE(), INTERVAL 4 DAY), 8, 2, NOW()),
('Báo cáo hiệu suất tuần', 'Báo cáo hiệu suất làm việc tuần qua', 'task_list', 1, 6, 1, 1, 13, 'normal', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 1 DAY), 9, 8, NOW()),
('Training POS mới', 'Đào tạo sử dụng hệ thống POS mới', 'task_list', 3, 6, 4, 1, 13, 'normal', DATE_ADD(CURDATE(), INTERVAL 5 DAY), DATE_ADD(CURDATE(), INTERVAL 10 DAY), 1, 1, NOW()),
('Kế hoạch nhân sự Q1', 'Lên kế hoạch nhân sự quý 1', 'task_list', 1, 6, 3, NULL, 13, 'high', DATE_ADD(CURDATE(), INTERVAL 7 DAY), DATE_ADD(CURDATE(), INTERVAL 21 DAY), 6, 1, NOW()),
('Template vệ sinh cửa hàng', 'Tạo template checklist vệ sinh', 'library', 3, 5, 1, NULL, 13, 'normal', NULL, NULL, 7, 6, NOW()),
('Template kiểm tra chất lượng', 'Tạo template kiểm tra chất lượng SP', 'library', 3, 5, 1, NULL, 13, 'normal', NULL, NULL, 1, 1, NOW());

-- ============================================
-- NOT_YET Tasks (12 tasks) - status_id = 7
-- ============================================

INSERT INTO `tasks` (`task_name`, `task_description`, `source`, `task_type_id`, `response_type_id`, `dept_id`, `assigned_store_id`, `assigned_staff_id`, `status_id`, `priority`, `start_date`, `end_date`, `created_staff_id`, `approver_id`, `approved_at`) VALUES
('Vệ sinh kệ hàng khu A', 'Vệ sinh và sắp xếp kệ hàng khu A', 'task_list', 2, 4, 1, 1, 3, 7, 'normal', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 2 DAY), 2, 1, NOW()),
('Kiểm tra hạn sử dụng', 'Kiểm tra hạn sử dụng SP khu thực phẩm', 'task_list', 3, 5, 1, 1, 4, 7, 'high', CURDATE(), CURDATE(), 2, 1, NOW()),
('Bổ sung hàng lên kệ', 'Bổ sung hàng từ kho lên kệ trưng bày', 'task_list', 2, 4, 1, 2, 3, 7, 'normal', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 1 DAY), 1, 1, NOW()),
('Kiểm tra giá niêm yết', 'Kiểm tra và cập nhật giá niêm yết', 'task_list', 1, 5, 1, 1, 5, 7, 'normal', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 1 DAY), 2, 1, NOW()),
('Vệ sinh khu POS', 'Vệ sinh khu vực thu ngân', 'task_list', 2, 4, 1, 3, 3, 7, 'normal', CURDATE(), CURDATE(), 1, 1, NOW()),
('Kiểm tra máy lạnh', 'Kiểm tra hoạt động máy lạnh', 'task_list', 3, 5, 4, 1, 4, 7, 'high', DATE_ADD(CURDATE(), INTERVAL 1 DAY), DATE_ADD(CURDATE(), INTERVAL 2 DAY), 1, 1, NOW()),
('Setup khuyến mãi tuần', 'Setup bảng giá khuyến mãi tuần', 'task_list', 2, 4, 1, 1, 3, 7, 'normal', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 3 DAY), 2, 1, NOW()),
('Kiểm tra vệ sinh thực phẩm', 'Kiểm tra vệ sinh khu thực phẩm tươi', 'task_list', 3, 5, 1, 4, 4, 7, 'urgent', CURDATE(), CURDATE(), 1, 1, NOW()),
('Nhận hàng nhập kho', 'Nhận và kiểm tra hàng nhập kho', 'task_list', 1, 5, 1, 1, 5, 7, 'high', DATE_ADD(CURDATE(), INTERVAL 1 DAY), DATE_ADD(CURDATE(), INTERVAL 1 DAY), 2, 1, NOW()),
('Kiểm tra đèn chiếu sáng', 'Kiểm tra hệ thống đèn chiếu sáng', 'task_list', 3, 5, 4, 2, 4, 7, 'normal', DATE_ADD(CURDATE(), INTERVAL 2 DAY), DATE_ADD(CURDATE(), INTERVAL 3 DAY), 1, 1, NOW()),
('Sắp xếp kho hàng', 'Sắp xếp và tổ chức lại kho hàng', 'task_list', 2, 4, 1, 1, 3, 7, 'normal', DATE_ADD(CURDATE(), INTERVAL 1 DAY), DATE_ADD(CURDATE(), INTERVAL 4 DAY), 2, 1, NOW()),
('Chuẩn bị họp đầu tuần', 'Chuẩn bị nội dung họp đầu tuần', 'task_list', 3, 6, 1, 1, 2, 7, 'normal', DATE_ADD(CURDATE(), INTERVAL 3 DAY), DATE_ADD(CURDATE(), INTERVAL 3 DAY), 1, 1, NOW());

-- ============================================
-- ON_PROGRESS Tasks (15 tasks) - status_id = 8
-- ============================================

INSERT INTO `tasks` (`task_name`, `task_description`, `source`, `task_type_id`, `response_type_id`, `dept_id`, `assigned_store_id`, `assigned_staff_id`, `do_staff_id`, `status_id`, `priority`, `start_date`, `end_date`, `created_staff_id`, `approver_id`, `approved_at`) VALUES
('Kiểm kê hàng tồn', 'Kiểm kê hàng tồn kho cuối tuần', 'task_list', 1, 5, 1, 1, 3, 3, 8, 'high', DATE_SUB(CURDATE(), INTERVAL 2 DAY), DATE_ADD(CURDATE(), INTERVAL 1 DAY), 2, 1, DATE_SUB(NOW(), INTERVAL 3 DAY)),
('Sắp xếp kệ khuyến mãi', 'Sắp xếp kệ hàng khuyến mãi tháng', 'task_list', 2, 4, 1, 1, 3, 3, 8, 'normal', DATE_SUB(CURDATE(), INTERVAL 1 DAY), DATE_ADD(CURDATE(), INTERVAL 2 DAY), 1, 1, DATE_SUB(NOW(), INTERVAL 2 DAY)),
('Training nhân viên mới', 'Đào tạo quy trình cho NV mới', 'task_list', 3, 6, 3, 1, 2, 2, 8, 'normal', DATE_SUB(CURDATE(), INTERVAL 3 DAY), DATE_ADD(CURDATE(), INTERVAL 4 DAY), 1, 1, DATE_SUB(NOW(), INTERVAL 4 DAY)),
('Kiểm tra chất lượng SP', 'Kiểm tra chất lượng sản phẩm nhập', 'task_list', 3, 5, 1, 1, 4, 4, 8, 'high', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 1 DAY), 2, 1, DATE_SUB(NOW(), INTERVAL 1 DAY)),
('Cập nhật bảng giá', 'Cập nhật bảng giá cho tuần mới', 'task_list', 1, 4, 1, 2, 3, 3, 8, 'normal', DATE_SUB(CURDATE(), INTERVAL 1 DAY), CURDATE(), 1, 1, DATE_SUB(NOW(), INTERVAL 2 DAY)),
('Vệ sinh tổng thể', 'Vệ sinh tổng thể cửa hàng', 'task_list', 2, 4, 1, 1, 5, 5, 8, 'normal', DATE_SUB(CURDATE(), INTERVAL 2 DAY), CURDATE(), 2, 1, DATE_SUB(NOW(), INTERVAL 3 DAY)),
('Kiểm tra camera', 'Kiểm tra hệ thống camera an ninh', 'task_list', 3, 5, 4, 1, 4, 4, 8, 'high', DATE_SUB(CURDATE(), INTERVAL 1 DAY), DATE_ADD(CURDATE(), INTERVAL 1 DAY), 1, 1, DATE_SUB(NOW(), INTERVAL 2 DAY)),
('Chuẩn bị event cuối tuần', 'Chuẩn bị cho event khuyến mãi', 'task_list', 2, 4, 1, 1, 3, 3, 8, 'urgent', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 2 DAY), 2, 1, DATE_SUB(NOW(), INTERVAL 1 DAY)),
('Báo cáo doanh thu ngày', 'Tổng hợp báo cáo doanh thu ngày', 'task_list', 1, 6, 2, 1, 5, 5, 8, 'normal', DATE_SUB(CURDATE(), INTERVAL 1 DAY), CURDATE(), 1, 1, DATE_SUB(NOW(), INTERVAL 1 DAY)),
('Kiểm kê tài sản', 'Kiểm kê tài sản cố định', 'task_list', 1, 5, 2, 1, 5, 5, 8, 'normal', DATE_SUB(CURDATE(), INTERVAL 4 DAY), DATE_ADD(CURDATE(), INTERVAL 3 DAY), 2, 1, DATE_SUB(NOW(), INTERVAL 5 DAY)),
('Sắp xếp khu vực mới', 'Sắp xếp khu vực bán hàng mới', 'task_list', 2, 4, 1, 3, 3, 3, 8, 'normal', DATE_SUB(CURDATE(), INTERVAL 2 DAY), DATE_ADD(CURDATE(), INTERVAL 1 DAY), 1, 1, DATE_SUB(NOW(), INTERVAL 3 DAY)),
('Chuẩn bị tài liệu họp', 'Chuẩn bị tài liệu cho cuộc họp', 'task_list', 3, 6, 1, 1, 2, 2, 8, 'high', DATE_SUB(CURDATE(), INTERVAL 1 DAY), CURDATE(), 1, 1, DATE_SUB(NOW(), INTERVAL 2 DAY)),
('Kiểm tra hệ thống điện', 'Kiểm tra an toàn hệ thống điện', 'task_list', 3, 5, 4, 2, 4, 4, 8, 'high', DATE_SUB(CURDATE(), INTERVAL 1 DAY), DATE_ADD(CURDATE(), INTERVAL 1 DAY), 2, 1, DATE_SUB(NOW(), INTERVAL 2 DAY)),
('Update menu display', 'Cập nhật menu hiển thị điện tử', 'task_list', 2, 4, 4, 1, 4, 4, 8, 'normal', DATE_SUB(CURDATE(), INTERVAL 2 DAY), DATE_ADD(CURDATE(), INTERVAL 1 DAY), 1, 1, DATE_SUB(NOW(), INTERVAL 3 DAY)),
('Kiểm tra máy POS', 'Kiểm tra hoạt động máy POS', 'task_list', 3, 5, 4, 1, 4, 4, 8, 'high', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 1 DAY), 2, 1, NOW());

-- ============================================
-- DONE Tasks (10 tasks) - status_id = 9
-- ============================================

INSERT INTO `tasks` (`task_name`, `task_description`, `source`, `task_type_id`, `response_type_id`, `dept_id`, `assigned_store_id`, `assigned_staff_id`, `do_staff_id`, `status_id`, `priority`, `start_date`, `end_date`, `created_staff_id`, `approver_id`, `approved_at`, `completed_time`) VALUES
('Kiểm kê cuối tháng 12', 'Kiểm kê hàng hóa cuối tháng 12', 'task_list', 1, 5, 1, 1, 3, 3, 9, 'high', DATE_SUB(CURDATE(), INTERVAL 10 DAY), DATE_SUB(CURDATE(), INTERVAL 7 DAY), 2, 1, DATE_SUB(NOW(), INTERVAL 11 DAY), DATE_SUB(NOW(), INTERVAL 7 DAY)),
('Báo cáo doanh thu tuần 52', 'Báo cáo doanh thu tuần cuối năm', 'task_list', 1, 6, 2, 1, 5, 5, 9, 'normal', DATE_SUB(CURDATE(), INTERVAL 14 DAY), DATE_SUB(CURDATE(), INTERVAL 10 DAY), 1, 1, DATE_SUB(NOW(), INTERVAL 15 DAY), DATE_SUB(NOW(), INTERVAL 10 DAY)),
('Vệ sinh đón năm mới', 'Vệ sinh tổng thể đón năm mới', 'task_list', 2, 4, 1, 1, 3, 3, 9, 'high', DATE_SUB(CURDATE(), INTERVAL 8 DAY), DATE_SUB(CURDATE(), INTERVAL 5 DAY), 2, 1, DATE_SUB(NOW(), INTERVAL 9 DAY), DATE_SUB(NOW(), INTERVAL 5 DAY)),
('Training cuối năm', 'Đào tạo tổng kết cuối năm', 'task_list', 3, 6, 3, 1, 2, 2, 9, 'normal', DATE_SUB(CURDATE(), INTERVAL 12 DAY), DATE_SUB(CURDATE(), INTERVAL 8 DAY), 1, 1, DATE_SUB(NOW(), INTERVAL 13 DAY), DATE_SUB(NOW(), INTERVAL 8 DAY)),
('Kiểm tra PCCC tháng 12', 'Kiểm tra thiết bị PCCC', 'task_list', 3, 5, 1, 1, 4, 4, 9, 'high', DATE_SUB(CURDATE(), INTERVAL 15 DAY), DATE_SUB(CURDATE(), INTERVAL 12 DAY), 2, 1, DATE_SUB(NOW(), INTERVAL 16 DAY), DATE_SUB(NOW(), INTERVAL 12 DAY)),
('Đánh giá hiệu suất Q4', 'Đánh giá hiệu suất quý 4', 'task_list', 1, 6, 3, 1, 2, 2, 9, 'high', DATE_SUB(CURDATE(), INTERVAL 20 DAY), DATE_SUB(CURDATE(), INTERVAL 15 DAY), 1, 1, DATE_SUB(NOW(), INTERVAL 21 DAY), DATE_SUB(NOW(), INTERVAL 15 DAY)),
('Kiểm kê tài sản Q4', 'Kiểm kê tài sản cố định Q4', 'task_list', 1, 5, 2, 1, 5, 5, 9, 'normal', DATE_SUB(CURDATE(), INTERVAL 18 DAY), DATE_SUB(CURDATE(), INTERVAL 13 DAY), 2, 1, DATE_SUB(NOW(), INTERVAL 19 DAY), DATE_SUB(NOW(), INTERVAL 13 DAY)),
('Sắp xếp kho cuối năm', 'Tổng vệ sinh và sắp xếp kho', 'task_list', 2, 4, 1, 2, 3, 3, 9, 'normal', DATE_SUB(CURDATE(), INTERVAL 9 DAY), DATE_SUB(CURDATE(), INTERVAL 6 DAY), 1, 1, DATE_SUB(NOW(), INTERVAL 10 DAY), DATE_SUB(NOW(), INTERVAL 6 DAY)),
('Backup dữ liệu cuối năm', 'Backup toàn bộ dữ liệu', 'task_list', 3, 5, 4, 1, 4, 4, 9, 'urgent', DATE_SUB(CURDATE(), INTERVAL 7 DAY), DATE_SUB(CURDATE(), INTERVAL 5 DAY), 1, 1, DATE_SUB(NOW(), INTERVAL 8 DAY), DATE_SUB(NOW(), INTERVAL 5 DAY)),
('Chuẩn bị event năm mới', 'Chuẩn bị cho event năm mới', 'task_list', 2, 4, 1, 1, 3, 3, 9, 'high', DATE_SUB(CURDATE(), INTERVAL 6 DAY), DATE_SUB(CURDATE(), INTERVAL 3 DAY), 2, 1, DATE_SUB(NOW(), INTERVAL 7 DAY), DATE_SUB(NOW(), INTERVAL 3 DAY));

-- ============================================
-- OVERDUE Tasks (5 tasks) - status_id = 10
-- ============================================

INSERT INTO `tasks` (`task_name`, `task_description`, `source`, `task_type_id`, `response_type_id`, `dept_id`, `assigned_store_id`, `assigned_staff_id`, `do_staff_id`, `status_id`, `priority`, `start_date`, `end_date`, `created_staff_id`, `approver_id`, `approved_at`) VALUES
('Báo cáo tồn kho quá hạn', 'Báo cáo tồn kho chưa hoàn thành', 'task_list', 1, 6, 1, 1, 3, 3, 10, 'high', DATE_SUB(CURDATE(), INTERVAL 10 DAY), DATE_SUB(CURDATE(), INTERVAL 5 DAY), 2, 1, DATE_SUB(NOW(), INTERVAL 11 DAY)),
('Kiểm tra camera quá hạn', 'Kiểm tra camera đã quá hạn', 'task_list', 3, 5, 4, 1, 4, NULL, 10, 'urgent', DATE_SUB(CURDATE(), INTERVAL 7 DAY), DATE_SUB(CURDATE(), INTERVAL 3 DAY), 1, 1, DATE_SUB(NOW(), INTERVAL 8 DAY)),
('Vệ sinh khu B quá hạn', 'Vệ sinh khu B chưa hoàn thành', 'task_list', 2, 4, 1, 2, 3, 3, 10, 'normal', DATE_SUB(CURDATE(), INTERVAL 5 DAY), DATE_SUB(CURDATE(), INTERVAL 2 DAY), 2, 1, DATE_SUB(NOW(), INTERVAL 6 DAY)),
('Update giá quá hạn', 'Cập nhật giá chưa hoàn thành', 'task_list', 1, 4, 1, 1, 5, 5, 10, 'high', DATE_SUB(CURDATE(), INTERVAL 4 DAY), DATE_SUB(CURDATE(), INTERVAL 1 DAY), 1, 1, DATE_SUB(NOW(), INTERVAL 5 DAY)),
('Báo cáo tuần quá hạn', 'Báo cáo tuần chưa nộp', 'task_list', 1, 6, 2, 1, 5, NULL, 10, 'normal', DATE_SUB(CURDATE(), INTERVAL 6 DAY), DATE_SUB(CURDATE(), INTERVAL 2 DAY), 2, 1, DATE_SUB(NOW(), INTERVAL 7 DAY));

-- ============================================
-- Summary: Total 60 tasks
-- DRAFT: 10
-- APPROVE: 8
-- NOT_YET: 12
-- ON_PROGRESS: 15
-- DONE: 10
-- OVERDUE: 5
-- ============================================

-- ============================================
-- FIX STAFF ID REFERENCES
-- The staff IDs 6,7,8,9 in this file may not exist in your database
-- Run these updates to map to valid staff IDs (1-5)
-- ============================================

UPDATE tasks SET created_staff_id = 1 WHERE created_staff_id = 6;
UPDATE tasks SET created_staff_id = 2 WHERE created_staff_id = 7;
UPDATE tasks SET created_staff_id = 3 WHERE created_staff_id = 8;
UPDATE tasks SET created_staff_id = 4 WHERE created_staff_id = 9;
UPDATE tasks SET created_staff_id = 5 WHERE created_staff_id = 10;

UPDATE tasks SET assigned_staff_id = 1 WHERE assigned_staff_id = 6;
UPDATE tasks SET assigned_staff_id = 2 WHERE assigned_staff_id = 7;
UPDATE tasks SET assigned_staff_id = 3 WHERE assigned_staff_id = 8;
UPDATE tasks SET assigned_staff_id = 4 WHERE assigned_staff_id = 9;
UPDATE tasks SET assigned_staff_id = 5 WHERE assigned_staff_id = 10;

UPDATE tasks SET do_staff_id = 1 WHERE do_staff_id = 6;
UPDATE tasks SET do_staff_id = 2 WHERE do_staff_id = 7;
UPDATE tasks SET do_staff_id = 3 WHERE do_staff_id = 8;
UPDATE tasks SET do_staff_id = 4 WHERE do_staff_id = 9;
UPDATE tasks SET do_staff_id = 5 WHERE do_staff_id = 10;

UPDATE tasks SET approver_id = 1 WHERE approver_id = 6;
UPDATE tasks SET approver_id = 2 WHERE approver_id = 7;
UPDATE tasks SET approver_id = 3 WHERE approver_id = 8;

SELECT 'Seed data completed!' AS message;
SELECT
    (SELECT COUNT(*) FROM tasks) AS total_tasks,
    (SELECT COUNT(*) FROM tasks WHERE status_id = 12) AS draft_tasks,
    (SELECT COUNT(*) FROM tasks WHERE status_id = 13) AS approve_tasks,
    (SELECT COUNT(*) FROM tasks WHERE status_id = 7) AS not_yet_tasks,
    (SELECT COUNT(*) FROM tasks WHERE status_id = 8) AS on_progress_tasks,
    (SELECT COUNT(*) FROM tasks WHERE status_id = 9) AS done_tasks,
    (SELECT COUNT(*) FROM tasks WHERE status_id = 10) AS overdue_tasks;
