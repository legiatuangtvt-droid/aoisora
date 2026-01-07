-- ============================================
-- Aoisora Seed Data - MySQL Version
-- Run this AFTER schema_mysql.sql
-- ============================================

-- ============================================
-- REGIONS
-- ============================================

INSERT INTO `regions` (`region_name`, `region_code`, `description`) VALUES
('Miền Bắc', 'NORTH', 'Khu vực phía Bắc'),
('Miền Trung', 'CENTRAL', 'Khu vực miền Trung'),
('Miền Nam', 'SOUTH', 'Khu vực phía Nam');

-- ============================================
-- DEPARTMENTS
-- ============================================

INSERT INTO `departments` (`department_name`, `department_code`, `description`, `icon`, `icon_color`, `icon_bg`, `sort_order`) VALUES
('Operation', 'OPE', 'Operation Department', 'Settings', '#3b82f6', '#dbeafe', 1),
('Account', 'ACC', 'Account Department', 'Calculator', '#22c55e', '#dcfce7', 2),
('HR', 'HR', 'Human Resources', 'Users', '#f59e0b', '#fef3c7', 3),
('IT', 'IT', 'Information Technology', 'Monitor', '#8b5cf6', '#ede9fe', 4),
('Marketing', 'MKT', 'Marketing Department', 'Megaphone', '#ec4899', '#fce7f3', 5);

-- ============================================
-- TEAMS
-- ============================================

INSERT INTO `teams` (`team_id`, `team_name`, `department_id`, `icon`, `icon_color`, `icon_bg`, `sort_order`) VALUES
('OPE-STORE', 'Store Operations', 1, 'Store', '#3b82f6', '#dbeafe', 1),
('OPE-QC', 'Quality Control', 1, 'CheckCircle', '#22c55e', '#dcfce7', 2),
('ACC-AP', 'Account Payable', 2, 'CreditCard', '#f59e0b', '#fef3c7', 1),
('ACC-AR', 'Account Receivable', 2, 'Wallet', '#22c55e', '#dcfce7', 2),
('HR-RECRUIT', 'Recruitment', 3, 'UserPlus', '#3b82f6', '#dbeafe', 1),
('IT-DEV', 'Development', 4, 'Code', '#8b5cf6', '#ede9fe', 1),
('IT-INFRA', 'Infrastructure', 4, 'Server', '#6366f1', '#e0e7ff', 2);

-- ============================================
-- STORES
-- ============================================

INSERT INTO `stores` (`store_name`, `store_code`, `region_id`, `address`, `phone`, `status`) VALUES
('AEON Mall Tân Phú', 'AEON-TP', 3, '30 Bờ Bao Tân Thắng, Sơn Kỳ, Tân Phú, TP.HCM', '028-1234-5678', 'active'),
('AEON Mall Bình Dương', 'AEON-BD', 3, 'Số 1 Đại lộ Bình Dương, TX Thuận An, Bình Dương', '0274-123-4567', 'active'),
('AEON Mall Long Biên', 'AEON-LB', 1, '27 Cổ Linh, Long Biên, Hà Nội', '024-1234-5678', 'active'),
('AEON Mall Hà Đông', 'AEON-HD', 1, 'Dương Nội, Hà Đông, Hà Nội', '024-8765-4321', 'active'),
('AEON Mall Đà Nẵng', 'AEON-DN', 2, '123 Nguyễn Văn Linh, Hải Châu, Đà Nẵng', '0236-123-4567', 'active');

-- ============================================
-- STAFF (Demo accounts)
-- Password: Password123! (bcrypt hash)
-- ============================================

INSERT INTO `staff` (`staff_name`, `staff_code`, `username`, `email`, `phone`, `store_id`, `department_id`, `team_id`, `role`, `position`, `sap_code`, `password_hash`, `status`) VALUES
('Admin User', 'ADMIN001', 'admin', 'admin@aoisora.vn', '0901234567', 1, 1, 'OPE-STORE', 'ADMIN', 'System Administrator', 'SAP001', '$2y$10$wMUXEBLWnyfQ5S6k0AykoODieUy.QiIpzzCGUHki/EnZ6QcogJuYm', 'active'),
('Nguyễn Văn Manager', 'MGR001', 'manager', 'manager@aoisora.vn', '0901234568', 1, 1, 'OPE-STORE', 'MANAGER', 'Store Manager', 'SAP002', '$2y$10$wMUXEBLWnyfQ5S6k0AykoODieUy.QiIpzzCGUHki/EnZ6QcogJuYm', 'active'),
('Trần Thị Staff', 'STF001', 'staff1', 'staff1@aoisora.vn', '0901234569', 1, 1, 'OPE-STORE', 'STAFF', 'Sales Staff', 'SAP003', '$2y$10$wMUXEBLWnyfQ5S6k0AykoODieUy.QiIpzzCGUHki/EnZ6QcogJuYm', 'active'),
('Lê Văn QC', 'QC001', 'qc1', 'qc1@aoisora.vn', '0901234570', 1, 1, 'OPE-QC', 'STAFF', 'QC Staff', 'SAP004', '$2y$10$wMUXEBLWnyfQ5S6k0AykoODieUy.QiIpzzCGUHki/EnZ6QcogJuYm', 'active'),
('Phạm Thị Account', 'ACC001', 'acc1', 'acc1@aoisora.vn', '0901234571', 1, 2, 'ACC-AP', 'STAFF', 'Accountant', 'SAP005', '$2y$10$wMUXEBLWnyfQ5S6k0AykoODieUy.QiIpzzCGUHki/EnZ6QcogJuYm', 'active');

-- Set line managers
UPDATE `staff` SET `line_manager_id` = 1 WHERE `staff_id` IN (2);
UPDATE `staff` SET `line_manager_id` = 2 WHERE `staff_id` IN (3, 4, 5);

-- Set store managers
UPDATE `stores` SET `manager_id` = 2 WHERE `store_id` = 1;
UPDATE `stores` SET `manager_id` = 2 WHERE `store_id` = 2;

-- ============================================
-- CHECK LISTS
-- ============================================

INSERT INTO `check_lists` (`check_list_name`, `description`) VALUES
('Kiểm tra hàng tồn kho', 'Đếm và kiểm tra số lượng hàng tồn'),
('Vệ sinh kệ hàng', 'Lau dọn và sắp xếp kệ hàng'),
('Kiểm tra hạn sử dụng', 'Kiểm tra và loại bỏ hàng hết hạn'),
('Bổ sung hàng lên kệ', 'Đưa hàng từ kho lên kệ trưng bày'),
('Kiểm tra giá niêm yết', 'Đảm bảo giá niêm yết chính xác'),
('Kiểm tra PCCC', 'Kiểm tra thiết bị phòng cháy chữa cháy'),
('Vệ sinh khu vực POS', 'Dọn dẹp khu vực thu ngân'),
('Kiểm tra máy POS', 'Kiểm tra hoạt động máy POS');

-- ============================================
-- SAMPLE TASKS
-- ============================================

INSERT INTO `tasks` (`task_name`, `task_description`, `task_type_id`, `response_type_id`, `dept_id`, `assigned_store_id`, `assigned_staff_id`, `status_id`, `priority`, `start_date`, `end_date`, `created_staff_id`) VALUES
('Kiểm kê hàng tồn cuối tháng', 'Thực hiện kiểm kê toàn bộ hàng hóa trong cửa hàng', 1, 5, 1, 1, 3, 7, 'high', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 3 DAY), 1),
('Sắp xếp kệ hàng khuyến mãi', 'Bố trí lại kệ hàng cho chương trình khuyến mãi tháng mới', 2, 4, 1, 1, 3, 8, 'normal', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 5 DAY), 2),
('Chuẩn bị báo cáo doanh thu', 'Tổng hợp báo cáo doanh thu tuần', 1, 6, 2, 1, 5, 9, 'normal', DATE_SUB(CURDATE(), INTERVAL 7 DAY), DATE_SUB(CURDATE(), INTERVAL 2 DAY), 1),
('Kiểm tra chất lượng thực phẩm', 'Kiểm tra nhiệt độ và chất lượng thực phẩm tươi sống', 3, 5, 1, 1, 4, 7, 'urgent', CURDATE(), CURDATE(), 2),
('Training nhân viên mới', 'Đào tạo quy trình làm việc cho nhân viên mới', 3, 6, 1, 1, 2, 7, 'normal', DATE_ADD(CURDATE(), INTERVAL 1 DAY), DATE_ADD(CURDATE(), INTERVAL 7 DAY), 1);

-- ============================================
-- TASK LIBRARY (for DWS)
-- ============================================

INSERT INTO `task_library` (`task_code`, `task_name`, `group_id`, `duration_minutes`, `description`) VALUES
('POS-OPEN', 'Mở ca POS', 'POS', 15, 'Kiểm tra và mở máy POS đầu ca'),
('POS-CLOSE', 'Đóng ca POS', 'POS', 20, 'Kiểm đếm tiền và đóng ca POS'),
('POS-CLEAN', 'Vệ sinh khu vực POS', 'POS', 10, 'Lau dọn khu vực thu ngân'),
('PERI-CHECK', 'Kiểm tra thực phẩm tươi', 'PERI', 30, 'Kiểm tra nhiệt độ và chất lượng'),
('PERI-ROTATE', 'Xoay hàng FIFO', 'PERI', 45, 'Xoay hàng theo nguyên tắc FIFO'),
('DRY-REFILL', 'Bổ sung hàng khô', 'DRY', 60, 'Đưa hàng từ kho lên kệ'),
('DRY-CLEAN', 'Vệ sinh kệ hàng khô', 'DRY', 30, 'Lau dọn và sắp xếp kệ'),
('MMD-RECEIVE', 'Nhận hàng', 'MMD', 90, 'Tiếp nhận và kiểm tra hàng nhập'),
('LEADER-MEETING', 'Họp đầu ca', 'LEADER', 15, 'Họp triển khai công việc đầu ca'),
('QC-AUDIT', 'Kiểm tra chất lượng', 'QC-FSH', 45, 'Kiểm tra chất lượng định kỳ');

-- ============================================
-- MANUAL FOLDERS
-- ============================================

INSERT INTO `manual_folders` (`folder_name`, `description`, `icon`, `sort_order`) VALUES
('Quy trình vận hành', 'Hướng dẫn quy trình vận hành cửa hàng', 'BookOpen', 1),
('Hướng dẫn sử dụng thiết bị', 'Hướng dẫn sử dụng máy móc, thiết bị', 'Monitor', 2),
('Chính sách & Quy định', 'Các chính sách và quy định của công ty', 'FileText', 3),
('An toàn lao động', 'Hướng dẫn an toàn lao động', 'Shield', 4);

-- ============================================
-- MANUAL DOCUMENTS
-- ============================================

INSERT INTO `manual_documents` (`folder_id`, `title`, `description`, `version`, `status`, `created_by`) VALUES
(1, 'Quy trình mở cửa hàng', 'Hướng dẫn chi tiết các bước mở cửa hàng đầu ngày', '1.0', 'published', 1),
(1, 'Quy trình đóng cửa hàng', 'Hướng dẫn chi tiết các bước đóng cửa hàng cuối ngày', '1.0', 'published', 1),
(2, 'Sử dụng máy POS', 'Hướng dẫn sử dụng máy tính tiền POS', '2.0', 'published', 1),
(3, 'Quy định đồng phục', 'Quy định về đồng phục và trang phục làm việc', '1.0', 'published', 1),
(4, 'An toàn PCCC', 'Hướng dẫn phòng cháy chữa cháy', '1.0', 'published', 1);

-- ============================================
-- DONE
-- ============================================
