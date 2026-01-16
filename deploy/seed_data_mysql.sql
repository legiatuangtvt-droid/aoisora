-- ============================================
-- Aoisora Seed Data (MySQL Version)
-- Run this AFTER schema_mysql.sql
-- ============================================

-- ============================================
-- REGIONS
-- ============================================

INSERT INTO `regions` (`region_id`, `region_name`, `region_code`, `description`) VALUES
(1, 'Miền Bắc', 'NORTH', 'Khu vực miền Bắc Việt Nam'),
(2, 'Miền Trung', 'CENTRAL', 'Khu vực miền Trung Việt Nam'),
(3, 'Miền Nam', 'SOUTH', 'Khu vực miền Nam Việt Nam');

-- ============================================
-- DEPARTMENTS
-- ============================================

INSERT INTO `departments` (`department_id`, `department_name`, `department_code`, `description`, `parent_id`, `sort_order`, `icon`, `icon_color`, `icon_bg`) VALUES
(1, 'Operation', 'OPS', 'Bộ phận vận hành', NULL, 1, 'settings', '#3b82f6', '#dbeafe'),
(2, 'Quality Control', 'QC', 'Bộ phận kiểm soát chất lượng', NULL, 2, 'check-circle', '#22c55e', '#dcfce7'),
(3, 'Human Resources', 'HR', 'Bộ phận nhân sự', NULL, 3, 'users', '#8b5cf6', '#ede9fe'),
(4, 'Finance', 'FIN', 'Bộ phận tài chính', NULL, 4, 'dollar-sign', '#f59e0b', '#fef3c7'),
(5, 'IT Department', 'IT', 'Bộ phận công nghệ thông tin', NULL, 5, 'code', '#06b6d4', '#cffafe'),
(6, 'Store Operations', 'STORE_OPS', 'Vận hành cửa hàng', 1, 1, 'store', '#3b82f6', '#dbeafe'),
(7, 'Logistics', 'LOG', 'Logistics và kho vận', 1, 2, 'truck', '#3b82f6', '#dbeafe');

-- ============================================
-- TEAMS
-- ============================================

INSERT INTO `teams` (`team_id`, `team_name`, `department_id`, `icon`, `icon_color`, `icon_bg`, `sort_order`) VALUES
('ACCOUNT', 'Account Team', 1, 'calculator', '#3b82f6', '#dbeafe', 1),
('QC_FRESH', 'QC Fresh Team', 2, 'leaf', '#22c55e', '#dcfce7', 1),
('QC_DRY', 'QC Dry Team', 2, 'box', '#22c55e', '#dcfce7', 2),
('RECRUIT', 'Recruitment Team', 3, 'user-plus', '#8b5cf6', '#ede9fe', 1),
('TRAINING', 'Training Team', 3, 'book-open', '#8b5cf6', '#ede9fe', 2),
('DEV', 'Development Team', 5, 'code', '#06b6d4', '#cffafe', 1),
('SUPPORT', 'Support Team', 5, 'headphones', '#06b6d4', '#cffafe', 2);

-- ============================================
-- STORES
-- ============================================

INSERT INTO `stores` (`store_id`, `store_name`, `store_code`, `region_id`, `address`, `phone`, `email`, `status`) VALUES
(1, 'AEON Mall Tân Phú', 'AEON_TP', 3, '30 Bờ Bao Tân Thắng, Sơn Kỳ, Tân Phú, TP.HCM', '028-1234-5678', 'tanphu@aeon.com.vn', 'active'),
(2, 'AEON Mall Bình Tân', 'AEON_BT', 3, '1 Đường số 17A, Bình Trị Đông B, Bình Tân, TP.HCM', '028-2345-6789', 'binhtan@aeon.com.vn', 'active'),
(3, 'AEON Mall Long Biên', 'AEON_LB', 1, '27 Cổ Linh, Long Biên, Hà Nội', '024-3456-7890', 'longbien@aeon.com.vn', 'active'),
(4, 'AEON Mall Hà Đông', 'AEON_HD', 1, 'Dương Nội, Hà Đông, Hà Nội', '024-4567-8901', 'hadong@aeon.com.vn', 'active'),
(5, 'AEON Mall Huế', 'AEON_HUE', 2, 'Đường An Dương Vương, TP. Huế', '0234-567-8901', 'hue@aeon.com.vn', 'active'),
(6, 'AEON Celadon Tân Phú', 'AEON_CLD', 3, 'Khu Celadon City, Tân Phú, TP.HCM', '028-3456-7890', 'celadon@aeon.com.vn', 'active'),
(7, 'AEON Mall Hải Phòng', 'AEON_HP', 1, 'Lê Chân, Hải Phòng', '0225-678-9012', 'haiphong@aeon.com.vn', 'active'),
(8, 'MaxValu Cộng Hòa', 'MV_CH', 3, '123 Cộng Hòa, Tân Bình, TP.HCM', '028-4567-8901', 'conghoa@maxvalu.com.vn', 'active'),
(9, 'MaxValu Nguyễn Văn Trỗi', 'MV_NVT', 3, '456 Nguyễn Văn Trỗi, Phú Nhuận, TP.HCM', '028-5678-9012', 'nvtroi@maxvalu.com.vn', 'active'),
(10, 'MaxValu Lê Văn Sỹ', 'MV_LVS', 3, '789 Lê Văn Sỹ, Q.3, TP.HCM', '028-6789-0123', 'lvsy@maxvalu.com.vn', 'active');

-- ============================================
-- STAFF (password_hash = bcrypt của "password123")
-- ============================================

-- Job Grades:
-- HQ: G2=Officer, G3=Executive, G4=Deputy Manager, G5=Manager, G6=GM, G7=SGM, G8=CCO, G9=GD
-- Store: S1=Staff, S2=Store Leader G2, S3=Store Leader G3, S4=Store In-charge, S5=Area Manager, S6=Region Manager

INSERT INTO `staff` (`staff_id`, `staff_name`, `staff_code`, `username`, `email`, `phone`, `store_id`, `department_id`, `team_id`, `role`, `position`, `job_grade`, `password_hash`, `status`) VALUES
-- Admin & HQ Staff (G2-G9)
(1, 'Admin System', 'ADM001', 'admin', 'admin@aoisora.com', '0901234567', NULL, 5, 'DEV', 'ADMIN', 'System Administrator', 'G9', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(2, 'Nguyễn Văn Minh', 'HQ001', 'nguyenvanminh', 'minh.nguyen@aoisora.com', '0902345678', NULL, 1, 'ACCOUNT', 'HQ', 'Operation Manager', 'G5', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(3, 'Trần Thị Hương', 'HQ002', 'tranthihuong', 'huong.tran@aoisora.com', '0903456789', NULL, 2, 'QC_FRESH', 'HQ', 'QC Manager', 'G5', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(4, 'Lê Hoàng Nam', 'HQ003', 'lehoangnam', 'nam.le@aoisora.com', '0904567890', NULL, 3, 'TRAINING', 'HQ', 'HR Manager', 'G5', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),

-- Store Managers (S3 = Store Leader G3 / Trưởng cửa hàng)
(5, 'Phạm Văn Đức', 'SM001', 'phamvanduc', 'duc.pham@aoisora.com', '0905678901', 1, 6, NULL, 'SM', 'Store Manager', 'S3', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(6, 'Võ Thị Mai', 'SM002', 'vothimai', 'mai.vo@aoisora.com', '0906789012', 2, 6, NULL, 'SM', 'Store Manager', 'S3', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(7, 'Hoàng Minh Tuấn', 'SM003', 'hoangminhtuan', 'tuan.hoang@aoisora.com', '0907890123', 3, 6, NULL, 'SM', 'Store Manager', 'S3', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),

-- Store Staff (S1=Staff, S2=Store Leader G2/Phó Trưởng cửa hàng)
(8, 'Nguyễn Thị Lan', 'ST001', 'nguyenthilan', 'lan.nguyen@aoisora.com', '0908901234', 1, 6, NULL, 'STAFF', 'Cashier Leader', 'S2', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(9, 'Trần Văn Hùng', 'ST002', 'tranvanhung', 'hung.tran@aoisora.com', '0909012345', 1, 6, NULL, 'STAFF', 'Fresh Food Staff', 'S1', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(10, 'Lê Thị Hồng', 'ST003', 'lethihong', 'hong.le@aoisora.com', '0910123456', 1, 6, NULL, 'STAFF', 'Dry Goods Staff', 'S1', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(11, 'Phạm Minh Quân', 'ST004', 'phamminhquan', 'quan.pham@aoisora.com', '0911234567', 2, 6, NULL, 'STAFF', 'Cashier', 'S1', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(12, 'Võ Văn Thành', 'ST005', 'vovanthanh', 'thanh.vo@aoisora.com', '0912345678', 2, 6, NULL, 'STAFF', 'Warehouse Staff', 'S1', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(13, 'Đặng Thị Yến', 'ST006', 'dangthiyen', 'yen.dang@aoisora.com', '0913456789', 3, 6, NULL, 'STAFF', 'Customer Service', 'S1', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(14, 'Bùi Văn Long', 'ST007', 'buivanlong', 'long.bui@aoisora.com', '0914567890', 3, 6, NULL, 'STAFF', 'Security', 'S1', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(15, 'Ngô Thị Thảo', 'ST008', 'ngothithao', 'thao.ngo@aoisora.com', '0915678901', 4, 6, NULL, 'STAFF', 'Cashier', 'S1', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active');

-- Update store managers
UPDATE `stores` SET `manager_id` = 5 WHERE `store_id` = 1;
UPDATE `stores` SET `manager_id` = 6 WHERE `store_id` = 2;
UPDATE `stores` SET `manager_id` = 7 WHERE `store_id` = 3;

-- Update line managers
UPDATE `staff` SET `line_manager_id` = 2 WHERE `staff_id` IN (5, 6, 7);
UPDATE `staff` SET `line_manager_id` = 5 WHERE `staff_id` IN (8, 9, 10);
UPDATE `staff` SET `line_manager_id` = 6 WHERE `staff_id` IN (11, 12);
UPDATE `staff` SET `line_manager_id` = 7 WHERE `staff_id` IN (13, 14, 15);

-- ============================================
-- CHECK LISTS
-- ============================================

INSERT INTO `check_lists` (`check_list_id`, `check_list_name`, `description`) VALUES
(1, 'Kiểm tra nhiệt độ tủ lạnh', 'Đo và ghi nhận nhiệt độ các tủ lạnh'),
(2, 'Vệ sinh khu vực bán hàng', 'Lau chùi kệ hàng, sàn nhà'),
(3, 'Kiểm tra hạn sử dụng sản phẩm', 'Rà soát và loại bỏ hàng hết hạn'),
(4, 'Đếm tiền đầu ca', 'Kiểm tra số tiền trong két'),
(5, 'Kiểm tra thiết bị POS', 'Đảm bảo máy POS hoạt động bình thường'),
(6, 'Sắp xếp hàng hóa trên kệ', 'Đảm bảo hàng được trưng bày đúng vị trí'),
(7, 'Kiểm tra camera an ninh', 'Đảm bảo tất cả camera hoạt động'),
(8, 'Vệ sinh khu vực WC', 'Dọn dẹp và bổ sung vật tư WC'),
(9, 'Kiểm tra đèn chiếu sáng', 'Thay thế bóng đèn hỏng'),
(10, 'Báo cáo doanh thu cuối ngày', 'Tổng hợp và nộp báo cáo doanh thu');

-- ============================================
-- MANUALS (Legacy)
-- ============================================

INSERT INTO `manuals` (`manual_id`, `manual_name`, `manual_url`, `description`) VALUES
(1, 'Hướng dẫn vận hành POS', 'https://docs.aoisora.com/pos-guide', 'Tài liệu hướng dẫn sử dụng máy POS'),
(2, 'Quy trình kiểm tra chất lượng', 'https://docs.aoisora.com/qc-process', 'Quy trình QC tiêu chuẩn'),
(3, 'An toàn thực phẩm', 'https://docs.aoisora.com/food-safety', 'Hướng dẫn an toàn thực phẩm');

-- ============================================
-- TASKS
-- ============================================

INSERT INTO `tasks` (`task_id`, `task_name`, `task_description`, `manual_id`, `task_type_id`, `response_type_id`, `dept_id`, `assigned_store_id`, `assigned_staff_id`, `status_id`, `priority`, `start_date`, `end_date`, `created_staff_id`) VALUES
(1, 'Kiểm tra nhiệt độ tủ lạnh buổi sáng', 'Ghi nhận nhiệt độ tất cả tủ lạnh khu Fresh Food lúc 8:00', NULL, 1, 1, 2, 1, 9, 7, 'high', '2026-01-07', '2026-01-07', 2),
(2, 'Báo cáo doanh thu tuần', 'Tổng hợp doanh thu tuần 1 tháng 1/2026', NULL, 1, 2, 1, NULL, 5, 8, 'normal', '2026-01-06', '2026-01-10', 2),
(3, 'Trưng bày hàng Tết', 'Sắp xếp khu trưng bày hàng Tết theo planogram', NULL, 2, 1, 1, 1, 10, 7, 'high', '2026-01-05', '2026-01-15', 2),
(4, 'Kiểm kê hàng tồn kho', 'Kiểm kê toàn bộ hàng hóa cuối tuần', NULL, 1, 2, 1, 2, 12, 7, 'normal', '2026-01-10', '2026-01-12', 2),
(5, 'Vệ sinh khu vực bán hàng', 'Tổng vệ sinh cuối tuần', NULL, 3, 1, 1, 1, 8, 9, 'low', '2026-01-04', '2026-01-04', 2),
(6, 'Đào tạo nhân viên mới', 'Đào tạo quy trình cho 3 nhân viên mới', NULL, 3, 2, 3, 3, 13, 8, 'normal', '2026-01-06', '2026-01-20', 4),
(7, 'Kiểm tra camera an ninh', 'Rà soát hoạt động tất cả camera', NULL, 1, 2, 1, 1, 14, 7, 'normal', '2026-01-07', '2026-01-07', 2),
(8, 'Chuẩn bị khuyến mãi cuối tuần', 'Setup banner và giá khuyến mãi', NULL, 2, 1, 1, 2, 11, 7, 'high', '2026-01-08', '2026-01-10', 2),

-- ============================================
-- 50 ADDITIONAL SAMPLE TASKS
-- Status IDs: 7=NOT_YET, 8=ON_PROGRESS, 9=DONE, 10=OVERDUE, 11=REJECT, 12=DRAFT
-- Current date context: 2026-01-16
-- ============================================

-- DRAFT tasks (status_id = 12) - No dates or future dates
(9, 'Chuẩn bị khai trương chi nhánh mới', 'Lên kế hoạch khai trương MaxValu Thủ Đức', NULL, 1, 1, 1, NULL, NULL, 12, 'high', NULL, NULL, 2),
(10, 'Kế hoạch đào tạo Q1/2026', 'Xây dựng kế hoạch đào tạo nhân viên mới quý 1', NULL, 3, 2, 3, NULL, NULL, 12, 'normal', NULL, NULL, 4),
(11, 'Chiến dịch marketing Tết 2026', 'Lên ý tưởng chiến dịch marketing dịp Tết', NULL, 2, 1, 1, NULL, NULL, 12, 'high', NULL, NULL, 2),
(12, 'Báo cáo phân tích bán hàng', 'Draft báo cáo phân tích xu hướng bán hàng', NULL, 1, 2, 4, NULL, NULL, 12, 'normal', NULL, NULL, 2),
(13, 'Kế hoạch inventory system upgrade', 'Đề xuất nâng cấp hệ thống quản lý kho', NULL, 1, 2, 5, NULL, NULL, 12, 'low', NULL, NULL, 1),

-- ON_PROGRESS/Approve tasks (status_id = 8) - Currently active, waiting for approval
(14, 'Đề xuất tăng ca dịp Tết', 'Đề xuất lịch tăng ca cho nhân viên dịp Tết Nguyên Đán', NULL, 1, 2, 3, NULL, 4, 8, 'high', '2026-01-10', '2026-01-20', 4),
(15, 'Phê duyệt ngân sách Q1', 'Xem xét và phê duyệt ngân sách hoạt động Q1/2026', NULL, 1, 2, 4, NULL, 2, 8, 'high', '2026-01-05', '2026-01-25', 2),
(16, 'Kế hoạch khuyến mãi Valentine', 'Đề xuất chương trình khuyến mãi Valentine 14/2', NULL, 2, 1, 1, 1, 5, 8, 'normal', '2026-01-10', '2026-02-10', 2),
(17, 'Hợp đồng nhà cung cấp mới', 'Review và approve hợp đồng với NCC rau củ mới', NULL, 1, 2, 1, NULL, 2, 8, 'high', '2026-01-12', '2026-01-22', 2),
(18, 'Đề xuất mua thiết bị mới', 'Phê duyệt mua 5 tủ lạnh cho khu Fresh Food', NULL, 1, 2, 1, 2, 6, 8, 'normal', '2026-01-08', '2026-01-30', 2),
(19, 'Kế hoạch tuyển dụng tháng 2', 'Đề xuất tuyển 10 nhân viên part-time', NULL, 1, 2, 3, NULL, 4, 8, 'normal', '2026-01-15', '2026-01-31', 4),
(20, 'Đề xuất cải tiến quy trình QC', 'Review đề xuất cải tiến quy trình kiểm tra chất lượng', NULL, 1, 2, 2, NULL, 3, 8, 'low', '2026-01-10', '2026-02-15', 3),

-- NOT_YET tasks (status_id = 7) - Future tasks, not started yet
(21, 'Kiểm kê hàng tồn cuối tháng', 'Kiểm kê toàn bộ hàng hóa tồn kho cuối tháng 1', NULL, 1, 2, 1, 1, 8, 7, 'high', '2026-01-25', '2026-01-31', 2),
(22, 'Đào tạo HACCP cho nhân viên mới', 'Tổ chức buổi đào tạo HACCP cho 15 nhân viên mới', NULL, 3, 2, 2, NULL, 3, 7, 'high', '2026-01-20', '2026-01-25', 3),
(23, 'Bảo trì hệ thống điều hòa', 'Lịch bảo trì định kỳ hệ thống HVAC', NULL, 1, 1, 5, 3, 7, 7, 'normal', '2026-01-22', '2026-01-24', 2),
(24, 'Setup booth khuyến mãi Tết', 'Lắp đặt booth giới thiệu sản phẩm Tết', NULL, 2, 1, 1, 1, 10, 7, 'high', '2026-01-18', '2026-01-20', 2),
(25, 'Kiểm tra thiết bị PCCC', 'Kiểm tra định kỳ các thiết bị phòng cháy chữa cháy', NULL, 1, 1, 1, 1, 14, 7, 'high', '2026-01-19', '2026-01-19', 2),
(26, 'Cập nhật bảng giá mới', 'Thay đổi bảng giá theo chính sách mới từ 1/2', NULL, 1, 1, 1, 2, 11, 7, 'normal', '2026-01-28', '2026-02-01', 2),
(27, 'Họp review KPI tháng 1', 'Tổ chức họp đánh giá KPI tháng 1', NULL, 1, 2, 1, NULL, 2, 7, 'normal', '2026-02-01', '2026-02-03', 2),
(28, 'Báo cáo an toàn thực phẩm Q1', 'Chuẩn bị báo cáo ATTP gửi cơ quan quản lý', NULL, 1, 2, 2, NULL, 3, 7, 'high', '2026-02-15', '2026-02-28', 3),
(29, 'Đào tạo sử dụng POS mới', 'Training nhân viên thu ngân sử dụng hệ thống POS mới', NULL, 3, 2, 5, 1, 8, 7, 'normal', '2026-01-25', '2026-01-27', 1),
(30, 'Kiểm tra định kỳ thang máy', 'Bảo trì và kiểm tra an toàn thang máy', NULL, 1, 1, 1, 3, 14, 7, 'normal', '2026-01-23', '2026-01-23', 2),

-- DONE tasks (status_id = 9) - Completed in the past
(31, 'Kiểm kê hàng tồn cuối năm 2025', 'Kiểm kê toàn bộ hàng hóa tồn kho cuối năm', NULL, 1, 2, 1, 1, 8, 9, 'high', '2025-12-28', '2025-12-31', 2),
(32, 'Trang trí Giáng sinh', 'Trang trí cửa hàng dịp Giáng sinh', NULL, 2, 1, 1, 1, 10, 9, 'normal', '2025-12-15', '2025-12-20', 2),
(33, 'Đào tạo nhân viên cuối năm', 'Buổi đào tạo tổng kết năm 2025', NULL, 3, 2, 3, NULL, 4, 9, 'normal', '2025-12-20', '2025-12-22', 4),
(34, 'Báo cáo doanh thu năm 2025', 'Tổng hợp báo cáo doanh thu cả năm', NULL, 1, 2, 4, NULL, 2, 9, 'high', '2025-12-26', '2025-12-31', 2),
(35, 'Bảo trì máy lạnh', 'Bảo trì định kỳ hệ thống máy lạnh', NULL, 1, 1, 5, 2, 12, 9, 'low', '2025-12-10', '2025-12-12', 2),
(36, 'Vệ sinh tổng kho', 'Tổng vệ sinh kho hàng cuối năm', NULL, 1, 1, 7, 1, 9, 9, 'normal', '2025-12-23', '2025-12-24', 2),
(37, 'Kiểm tra camera an ninh', 'Rà soát và test tất cả camera', NULL, 1, 1, 1, 3, 14, 9, 'normal', '2026-01-02', '2026-01-03', 2),
(38, 'Họp định hướng năm mới', 'Họp triển khai kế hoạch năm 2026', NULL, 1, 2, 1, NULL, 2, 9, 'high', '2026-01-02', '2026-01-02', 2),
(39, 'Cập nhật danh mục sản phẩm', 'Cập nhật danh mục SP trên hệ thống', NULL, 1, 1, 5, NULL, 1, 9, 'normal', '2026-01-03', '2026-01-05', 1),
(40, 'Kiểm tra nhiệt độ kho lạnh', 'Kiểm tra định kỳ nhiệt độ kho lạnh', NULL, 1, 1, 2, 1, 9, 9, 'high', '2026-01-05', '2026-01-05', 3),
(41, 'Trưng bày sản phẩm mới', 'Setup khu trưng bày sản phẩm mới tháng 1', NULL, 2, 1, 1, 2, 11, 9, 'normal', '2026-01-08', '2026-01-10', 2),
(42, 'Đào tạo an toàn lao động', 'Buổi training ATLĐ cho toàn bộ nhân viên', NULL, 3, 2, 3, 1, 4, 9, 'high', '2026-01-06', '2026-01-06', 4),
(43, 'Backup dữ liệu hệ thống', 'Sao lưu dữ liệu định kỳ đầu tháng', NULL, 1, 1, 5, NULL, 1, 9, 'normal', '2026-01-01', '2026-01-01', 1),
(44, 'Review hợp đồng lao động', 'Rà soát hợp đồng LĐ hết hạn Q1', NULL, 1, 2, 3, NULL, 4, 9, 'normal', '2026-01-08', '2026-01-12', 4),

-- OVERDUE tasks (status_id = 10) - Past deadline but not completed
(45, 'Nộp báo cáo thuế tháng 12', 'Hoàn thành và nộp báo cáo thuế GTGT', NULL, 1, 2, 4, NULL, 2, 10, 'urgent', '2026-01-10', '2026-01-15', 2),
(46, 'Kiểm tra hạn sử dụng hàng Tết', 'Rà soát HSD các mặt hàng Tết nhập sớm', NULL, 1, 1, 2, 1, 9, 10, 'high', '2026-01-05', '2026-01-10', 3),
(47, 'Cập nhật thông tin NCC', 'Cập nhật thông tin liên hệ nhà cung cấp', NULL, 1, 1, 1, NULL, 2, 10, 'normal', '2026-01-01', '2026-01-07', 2),
(48, 'Hoàn thành đánh giá nhân viên', 'Đánh giá performance cuối năm', NULL, 1, 2, 3, 2, 6, 10, 'high', '2025-12-28', '2026-01-05', 4),
(49, 'Sửa chữa kệ hàng hư hỏng', 'Thay thế 3 kệ hàng bị gãy tại khu Dry', NULL, 1, 1, 1, 3, 14, 10, 'normal', '2026-01-03', '2026-01-08', 2),
(50, 'Gửi feedback khách hàng', 'Tổng hợp và gửi báo cáo feedback KH tháng 12', NULL, 1, 2, 1, 1, 5, 10, 'normal', '2026-01-05', '2026-01-10', 2),
(51, 'Bổ sung hàng dự trữ Tết', 'Order thêm hàng bánh kẹo cho dịp Tết', NULL, 1, 1, 7, 1, 10, 10, 'high', '2026-01-08', '2026-01-14', 2),
(52, 'Hoàn thiện tài liệu ISO', 'Cập nhật tài liệu theo chuẩn ISO mới', NULL, 1, 2, 2, NULL, 3, 10, 'high', '2026-01-01', '2026-01-12', 3),

-- REJECT tasks (status_id = 11) - Rejected by approver
(53, 'Đề xuất tăng lương nhân viên', 'Đề xuất tăng lương 10% cho toàn bộ NV', NULL, 1, 2, 3, NULL, 4, 11, 'high', '2025-12-15', '2025-12-20', 4),
(54, 'Mua thêm xe đẩy hàng', 'Đề xuất mua 20 xe đẩy mới', NULL, 1, 2, 1, 1, 5, 11, 'normal', '2025-12-20', '2025-12-28', 2),
(55, 'Thay đổi nhà cung cấp bánh', 'Đề xuất đổi NCC bánh ngọt', NULL, 1, 2, 1, NULL, 2, 11, 'low', '2025-12-18', '2025-12-25', 2),
(56, 'Tổ chức team building', 'Đề xuất team building cuối năm', NULL, 3, 2, 3, 2, 6, 11, 'low', '2025-12-10', '2025-12-15', 4),

-- More NOT_YET tasks for variety
(57, 'Chuẩn bị hàng Tết Nguyên Đán', 'Nhập và trưng bày hàng Tết', NULL, 2, 1, 1, 1, 10, 7, 'urgent', '2026-01-20', '2026-01-28', 2),
(58, 'Đào tạo kỹ năng giao tiếp', 'Training soft skills cho nhân viên', NULL, 3, 2, 3, 3, 13, 7, 'normal', '2026-01-22', '2026-01-24', 4);

-- ============================================
-- TASK CHECK LIST (Junction)
-- ============================================

INSERT INTO `task_check_list` (`task_id`, `check_list_id`, `check_status`) VALUES
(1, 1, 0),
(2, 10, 0),
(4, 3, 0),
(4, 6, 0),
(5, 2, 1),
(5, 8, 1),
(7, 7, 0);

-- ============================================
-- TASK LIBRARY (DWS)
-- ============================================

INSERT INTO `task_library` (`task_lib_id`, `task_code`, `task_name`, `group_id`, `duration_minutes`, `description`) VALUES
(1, 'POS001', 'Mở quầy thu ngân', 'POS', 15, 'Chuẩn bị két tiền, kiểm tra máy POS'),
(2, 'POS002', 'Đếm tiền cuối ca', 'POS', 20, 'Đếm tiền và đối chiếu với hệ thống'),
(3, 'POS003', 'Hỗ trợ khách hàng', 'POS', 30, 'Giải đáp thắc mắc, xử lý khiếu nại'),
(4, 'PERI001', 'Kiểm tra nhiệt độ', 'PERI', 15, 'Đo nhiệt độ tủ lạnh, tủ đông'),
(5, 'PERI002', 'Bổ sung hàng Fresh', 'PERI', 45, 'Lấy hàng từ kho, sắp xếp lên kệ'),
(6, 'PERI003', 'Kiểm tra hạn sử dụng', 'PERI', 30, 'Rà soát và loại bỏ hàng hết hạn'),
(7, 'DRY001', 'Bổ sung hàng Dry', 'DRY', 60, 'Lấy hàng từ kho, sắp xếp lên kệ'),
(8, 'DRY002', 'Kiểm tra giá niêm yết', 'DRY', 20, 'Đảm bảo giá trên kệ khớp với hệ thống'),
(9, 'MMD001', 'Nhận hàng từ nhà cung cấp', 'MMD', 60, 'Kiểm tra và nhập hàng vào hệ thống'),
(10, 'MMD002', 'Sắp xếp kho', 'MMD', 45, 'Tổ chức hàng hóa trong kho'),
(11, 'LEADER001', 'Họp đầu ca', 'LEADER', 15, 'Phổ biến công việc cho nhân viên'),
(12, 'LEADER002', 'Kiểm tra công việc', 'LEADER', 30, 'Giám sát tiến độ công việc'),
(13, 'QC001', 'Kiểm tra vệ sinh', 'QC-FSH', 30, 'Đánh giá vệ sinh khu vực bán hàng'),
(14, 'QC002', 'Kiểm tra chất lượng hàng', 'QC-FSH', 45, 'Đánh giá chất lượng sản phẩm'),
(15, 'DEL001', 'Chuẩn bị Delica', 'DELICA', 60, 'Chế biến và trưng bày thức ăn nhanh');

-- ============================================
-- DAILY SCHEDULE TASKS (Sample for today)
-- ============================================

INSERT INTO `daily_schedule_tasks` (`staff_id`, `store_id`, `schedule_date`, `group_id`, `task_code`, `task_name`, `start_time`, `end_time`, `status`) VALUES
-- Staff 8 (Cashier Leader) - Store 1
(8, 1, '2026-01-07', 'LEADER', 'LEADER001', 'Họp đầu ca', '06:00:00', '06:15:00', 2),
(8, 1, '2026-01-07', 'POS', 'POS001', 'Mở quầy thu ngân', '06:15:00', '06:30:00', 2),
(8, 1, '2026-01-07', 'POS', 'POS003', 'Hỗ trợ khách hàng', '09:00:00', '09:30:00', 1),
(8, 1, '2026-01-07', 'LEADER', 'LEADER002', 'Kiểm tra công việc', '11:00:00', '11:30:00', 1),
(8, 1, '2026-01-07', 'POS', 'POS002', 'Đếm tiền cuối ca', '13:40:00', '14:00:00', 1),

-- Staff 9 (Fresh Food) - Store 1
(9, 1, '2026-01-07', 'PERI', 'PERI001', 'Kiểm tra nhiệt độ', '06:00:00', '06:15:00', 2),
(9, 1, '2026-01-07', 'PERI', 'PERI002', 'Bổ sung hàng Fresh', '06:15:00', '07:00:00', 2),
(9, 1, '2026-01-07', 'PERI', 'PERI003', 'Kiểm tra hạn sử dụng', '08:00:00', '08:30:00', 4),
(9, 1, '2026-01-07', 'PERI', 'PERI002', 'Bổ sung hàng Fresh', '10:00:00', '10:45:00', 1),
(9, 1, '2026-01-07', 'PERI', 'PERI001', 'Kiểm tra nhiệt độ', '12:00:00', '12:15:00', 1),

-- Staff 10 (Dry Goods) - Store 1
(10, 1, '2026-01-07', 'DRY', 'DRY001', 'Bổ sung hàng Dry', '06:00:00', '07:00:00', 2),
(10, 1, '2026-01-07', 'DRY', 'DRY002', 'Kiểm tra giá niêm yết', '07:00:00', '07:20:00', 2),
(10, 1, '2026-01-07', 'DRY', 'DRY001', 'Bổ sung hàng Dry', '09:00:00', '10:00:00', 1),
(10, 1, '2026-01-07', 'DRY', 'DRY002', 'Kiểm tra giá niêm yết', '11:00:00', '11:20:00', 1);

-- ============================================
-- SHIFT ASSIGNMENTS (Sample for this week)
-- ============================================

INSERT INTO `shift_assignments` (`staff_id`, `store_id`, `shift_date`, `shift_code_id`, `status`, `assigned_by`) VALUES
-- Staff 8
(8, 1, '2026-01-06', 1, 'completed', 5),
(8, 1, '2026-01-07', 1, 'assigned', 5),
(8, 1, '2026-01-08', 1, 'assigned', 5),
(8, 1, '2026-01-09', 4, 'assigned', 5),
(8, 1, '2026-01-10', 7, 'assigned', 5),

-- Staff 9
(9, 1, '2026-01-06', 1, 'completed', 5),
(9, 1, '2026-01-07', 1, 'assigned', 5),
(9, 1, '2026-01-08', 4, 'assigned', 5),
(9, 1, '2026-01-09', 1, 'assigned', 5),
(9, 1, '2026-01-10', 1, 'assigned', 5),

-- Staff 10
(10, 1, '2026-01-06', 4, 'completed', 5),
(10, 1, '2026-01-07', 1, 'assigned', 5),
(10, 1, '2026-01-08', 1, 'assigned', 5),
(10, 1, '2026-01-09', 7, 'assigned', 5),
(10, 1, '2026-01-10', 4, 'assigned', 5);

-- ============================================
-- MANUAL FOLDERS
-- ============================================

INSERT INTO `manual_folders` (`folder_id`, `folder_name`, `parent_id`, `description`, `icon`, `sort_order`) VALUES
(1, 'Vận hành cửa hàng', NULL, 'Tài liệu vận hành cửa hàng', 'store', 1),
(2, 'An toàn thực phẩm', NULL, 'Quy trình an toàn thực phẩm', 'shield', 2),
(3, 'Dịch vụ khách hàng', NULL, 'Hướng dẫn chăm sóc khách hàng', 'users', 3),
(4, 'Quy trình thu ngân', 1, 'Hướng dẫn cho nhân viên thu ngân', 'credit-card', 1),
(5, 'Quy trình kho', 1, 'Hướng dẫn quản lý kho', 'package', 2),
(6, 'HACCP', 2, 'Quy trình HACCP', 'clipboard-check', 1),
(7, 'Vệ sinh', 2, 'Quy trình vệ sinh', 'sparkles', 2);

-- ============================================
-- MANUAL DOCUMENTS
-- ============================================

INSERT INTO `manual_documents` (`document_id`, `folder_id`, `title`, `description`, `version`, `status`, `created_by`, `published_at`) VALUES
(1, 4, 'Hướng dẫn mở ca thu ngân', 'Các bước chuẩn bị trước khi bắt đầu ca làm việc', '1.0', 'published', 2, '2026-01-01 00:00:00'),
(2, 4, 'Xử lý thanh toán thẻ', 'Quy trình thanh toán bằng thẻ tín dụng/ghi nợ', '1.2', 'published', 2, '2026-01-01 00:00:00'),
(3, 5, 'Nhận hàng từ nhà cung cấp', 'Quy trình kiểm tra và nhập hàng', '1.0', 'published', 2, '2026-01-01 00:00:00'),
(4, 6, 'Kiểm tra nhiệt độ', 'Hướng dẫn đo và ghi nhận nhiệt độ', '1.1', 'published', 3, '2026-01-01 00:00:00'),
(5, 7, 'Vệ sinh khu vực bán hàng', 'Quy trình vệ sinh hàng ngày', '1.0', 'published', 3, '2026-01-01 00:00:00');

-- ============================================
-- MANUAL STEPS
-- ============================================

INSERT INTO `manual_steps` (`step_id`, `document_id`, `step_number`, `title`, `content`, `tips`, `warnings`) VALUES
(1, 1, 1, 'Đăng nhập hệ thống', 'Sử dụng tài khoản được cấp để đăng nhập vào máy POS', 'Kiểm tra kết nối mạng trước khi đăng nhập', NULL),
(2, 1, 2, 'Kiểm tra két tiền', 'Đếm số tiền trong két và đối chiếu với sổ bàn giao', 'Ghi chép rõ ràng số tiền nhận được', 'Báo ngay cho quản lý nếu có sai lệch'),
(3, 1, 3, 'Chuẩn bị vật tư', 'Kiểm tra túi nilon, hóa đơn, băng keo...', NULL, NULL),
(4, 4, 1, 'Chuẩn bị nhiệt kế', 'Lấy nhiệt kế từ vị trí lưu trữ, kiểm tra pin', 'Sử dụng nhiệt kế đã được hiệu chuẩn', NULL),
(5, 4, 2, 'Đo nhiệt độ', 'Đặt nhiệt kế vào vị trí quy định trong tủ, đợi 30 giây', NULL, 'Không chạm vào đầu đo bằng tay'),
(6, 4, 3, 'Ghi nhận kết quả', 'Ghi nhiệt độ vào sổ theo dõi và hệ thống', 'Ghi rõ thời gian đo', 'Báo ngay nếu nhiệt độ vượt ngưỡng cho phép');

-- ============================================
-- NOTIFICATIONS
-- ============================================

INSERT INTO `notifications` (`recipient_staff_id`, `sender_staff_id`, `notification_type`, `title`, `message`, `link_url`, `is_read`) VALUES
(5, 2, 'task', 'Task mới được giao', 'Bạn có task mới: Báo cáo doanh thu tuần', '/tasks/2', 0),
(8, 5, 'task', 'Task mới được giao', 'Bạn có task mới: Vệ sinh khu vực bán hàng', '/tasks/5', 1),
(9, 2, 'task', 'Task mới được giao', 'Bạn có task mới: Kiểm tra nhiệt độ tủ lạnh buổi sáng', '/tasks/1', 0),
(5, 2, 'announcement', 'Thông báo quan trọng', 'Họp tổng kết tháng vào 15/01/2026', NULL, 0),
(6, 2, 'announcement', 'Thông báo quan trọng', 'Họp tổng kết tháng vào 15/01/2026', NULL, 0),
(7, 2, 'announcement', 'Thông báo quan trọng', 'Họp tổng kết tháng vào 15/01/2026', NULL, 0);

-- ============================================
-- DONE
-- ============================================
