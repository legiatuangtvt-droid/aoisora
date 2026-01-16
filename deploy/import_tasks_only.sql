-- ============================================
-- TASKS ONLY IMPORT
-- ============================================
-- Clear existing tasks first
DELETE FROM task_check_list;
DELETE FROM tasks;

-- Reset auto increment
ALTER TABLE tasks AUTO_INCREMENT = 1;

-- ============================================
-- TASKS
-- ============================================
-- Status IDs: 7=NOT_YET, 8=ON_PROGRESS, 9=DONE, 10=OVERDUE, 11=REJECT, 12=DRAFT, 13=APPROVE
-- HQ users: Xem tất cả 6 status (APPROVE → DRAFT → OVERDUE → NOT_YET → ON_PROGRESS → DONE)
-- Store users: Chỉ xem 4 status (OVERDUE → NOT_YET → ON_PROGRESS → DONE)
-- Current date context: 2026-01-16
-- ============================================

INSERT INTO `tasks` (`task_id`, `task_name`, `task_description`, `manual_id`, `task_type_id`, `response_type_id`, `dept_id`, `assigned_store_id`, `assigned_staff_id`, `status_id`, `priority`, `start_date`, `end_date`, `created_staff_id`) VALUES
-- ============================================
-- APPROVE tasks (status_id = 13) - Chờ phê duyệt từ cấp cao hơn
-- 10 tasks
-- ============================================
(1, 'Đề xuất tăng ca dịp Tết', 'Đề xuất lịch tăng ca cho nhân viên dịp Tết Nguyên Đán', NULL, 1, 2, 3, NULL, 4, 13, 'high', '2026-01-10', '2026-01-20', 4),
(2, 'Phê duyệt ngân sách Q1', 'Xem xét và phê duyệt ngân sách hoạt động Q1/2026', NULL, 1, 2, 4, NULL, 2, 13, 'high', '2026-01-05', '2026-01-25', 2),
(3, 'Kế hoạch khuyến mãi Valentine', 'Đề xuất chương trình khuyến mãi Valentine 14/2', NULL, 2, 1, 1, 1, 5, 13, 'normal', '2026-01-10', '2026-02-10', 2),
(4, 'Hợp đồng nhà cung cấp mới', 'Review và approve hợp đồng với NCC rau củ mới', NULL, 1, 2, 1, NULL, 2, 13, 'high', '2026-01-12', '2026-01-22', 2),
(5, 'Đề xuất mua thiết bị mới', 'Phê duyệt mua 5 tủ lạnh cho khu Fresh Food', NULL, 1, 2, 1, 2, 6, 13, 'normal', '2026-01-08', '2026-01-30', 2),
(6, 'Kế hoạch tuyển dụng tháng 2', 'Đề xuất tuyển 10 nhân viên part-time', NULL, 1, 2, 3, NULL, 4, 13, 'normal', '2026-01-15', '2026-01-31', 4),
(7, 'Đề xuất cải tiến quy trình QC', 'Review đề xuất cải tiến quy trình kiểm tra chất lượng', NULL, 1, 2, 2, NULL, 3, 13, 'low', '2026-01-10', '2026-02-15', 3),
(8, 'Phê duyệt mua sắm thiết bị IT', 'Đề xuất mua 10 máy tính mới cho các cửa hàng', NULL, 1, 2, 5, NULL, 1, 13, 'high', '2026-01-12', '2026-01-28', 1),
(9, 'Đề xuất điều chỉnh KPI Q1', 'Xem xét đề xuất thay đổi KPI cho bộ phận kinh doanh', NULL, 1, 2, 1, NULL, 2, 13, 'normal', '2026-01-14', '2026-01-25', 2),
(10, 'Phê duyệt chính sách thưởng Tết', 'Xem xét và phê duyệt chính sách thưởng Tết 2026', NULL, 1, 2, 3, NULL, 4, 13, 'urgent', '2026-01-08', '2026-01-18', 4),

-- ============================================
-- DRAFT tasks (status_id = 12) - Bản nháp, chưa gửi
-- 8 tasks
-- ============================================
(11, 'Chuẩn bị khai trương chi nhánh mới', 'Lên kế hoạch khai trương MaxValu Thủ Đức', NULL, 1, 1, 1, NULL, NULL, 12, 'high', NULL, NULL, 2),
(12, 'Kế hoạch đào tạo Q1/2026', 'Xây dựng kế hoạch đào tạo nhân viên mới quý 1', NULL, 3, 2, 3, NULL, NULL, 12, 'normal', NULL, NULL, 4),
(13, 'Chiến dịch marketing Tết 2026', 'Lên ý tưởng chiến dịch marketing dịp Tết', NULL, 2, 1, 1, NULL, NULL, 12, 'high', NULL, NULL, 2),
(14, 'Báo cáo phân tích bán hàng', 'Draft báo cáo phân tích xu hướng bán hàng', NULL, 1, 2, 4, NULL, NULL, 12, 'normal', NULL, NULL, 2),
(15, 'Kế hoạch inventory system upgrade', 'Đề xuất nâng cấp hệ thống quản lý kho', NULL, 1, 2, 5, NULL, NULL, 12, 'low', NULL, NULL, 1),
(16, 'Đề xuất mở rộng kho hàng', 'Dự thảo kế hoạch mở rộng khu vực kho', NULL, 1, 2, 7, NULL, NULL, 12, 'normal', NULL, NULL, 2),
(17, 'Kế hoạch bảo trì hệ thống', 'Lên lịch bảo trì định kỳ hệ thống IT', NULL, 1, 2, 5, NULL, NULL, 12, 'low', NULL, NULL, 1),
(18, 'Đề xuất cải thiện quy trình nhập hàng', 'Draft kế hoạch cải tiến logistics', NULL, 1, 2, 7, NULL, NULL, 12, 'normal', NULL, NULL, 2),

-- ============================================
-- OVERDUE tasks (status_id = 10) - Quá hạn chưa hoàn thành
-- 8 tasks
-- ============================================
(19, 'Nộp báo cáo thuế tháng 12', 'Hoàn thành và nộp báo cáo thuế GTGT', NULL, 1, 2, 4, NULL, 2, 10, 'urgent', '2026-01-10', '2026-01-15', 2),
(20, 'Kiểm tra hạn sử dụng hàng Tết', 'Rà soát HSD các mặt hàng Tết nhập sớm', NULL, 1, 1, 2, 1, 9, 10, 'high', '2026-01-05', '2026-01-10', 3),
(21, 'Cập nhật thông tin NCC', 'Cập nhật thông tin liên hệ nhà cung cấp', NULL, 1, 1, 1, NULL, 2, 10, 'normal', '2026-01-01', '2026-01-07', 2),
(22, 'Hoàn thành đánh giá nhân viên', 'Đánh giá performance cuối năm', NULL, 1, 2, 3, 2, 6, 10, 'high', '2025-12-28', '2026-01-05', 4),
(23, 'Sửa chữa kệ hàng hư hỏng', 'Thay thế 3 kệ hàng bị gãy tại khu Dry', NULL, 1, 1, 1, 3, 14, 10, 'normal', '2026-01-03', '2026-01-08', 2),
(24, 'Gửi feedback khách hàng', 'Tổng hợp và gửi báo cáo feedback KH tháng 12', NULL, 1, 2, 1, 1, 5, 10, 'normal', '2026-01-05', '2026-01-10', 2),
(25, 'Bổ sung hàng dự trữ Tết', 'Order thêm hàng bánh kẹo cho dịp Tết', NULL, 1, 1, 7, 1, 10, 10, 'high', '2026-01-08', '2026-01-14', 2),
(26, 'Hoàn thiện tài liệu ISO', 'Cập nhật tài liệu theo chuẩn ISO mới', NULL, 1, 2, 2, NULL, 3, 10, 'high', '2026-01-01', '2026-01-12', 3),

-- ============================================
-- NOT_YET tasks (status_id = 7) - Đã gửi, chưa bắt đầu
-- 10 tasks
-- ============================================
(27, 'Kiểm kê hàng tồn cuối tháng', 'Kiểm kê toàn bộ hàng hóa tồn kho cuối tháng 1', NULL, 1, 2, 1, 1, 8, 7, 'high', '2026-01-25', '2026-01-31', 2),
(28, 'Đào tạo HACCP cho nhân viên mới', 'Tổ chức buổi đào tạo HACCP cho 15 nhân viên mới', NULL, 3, 2, 2, NULL, 3, 7, 'high', '2026-01-20', '2026-01-25', 3),
(29, 'Bảo trì hệ thống điều hòa', 'Lịch bảo trì định kỳ hệ thống HVAC', NULL, 1, 1, 5, 3, 7, 7, 'normal', '2026-01-22', '2026-01-24', 2),
(30, 'Setup booth khuyến mãi Tết', 'Lắp đặt booth giới thiệu sản phẩm Tết', NULL, 2, 1, 1, 1, 10, 7, 'high', '2026-01-18', '2026-01-20', 2),
(31, 'Kiểm tra thiết bị PCCC', 'Kiểm tra định kỳ các thiết bị phòng cháy chữa cháy', NULL, 1, 1, 1, 1, 14, 7, 'high', '2026-01-19', '2026-01-19', 2),
(32, 'Cập nhật bảng giá mới', 'Thay đổi bảng giá theo chính sách mới từ 1/2', NULL, 1, 1, 1, 2, 11, 7, 'normal', '2026-01-28', '2026-02-01', 2),
(33, 'Họp review KPI tháng 1', 'Tổ chức họp đánh giá KPI tháng 1', NULL, 1, 2, 1, NULL, 2, 7, 'normal', '2026-02-01', '2026-02-03', 2),
(34, 'Báo cáo an toàn thực phẩm Q1', 'Chuẩn bị báo cáo ATTP gửi cơ quan quản lý', NULL, 1, 2, 2, NULL, 3, 7, 'high', '2026-02-15', '2026-02-28', 3),
(35, 'Đào tạo sử dụng POS mới', 'Training nhân viên thu ngân sử dụng hệ thống POS mới', NULL, 3, 2, 5, 1, 8, 7, 'normal', '2026-01-25', '2026-01-27', 1),
(36, 'Kiểm tra định kỳ thang máy', 'Bảo trì và kiểm tra an toàn thang máy', NULL, 1, 1, 1, 3, 14, 7, 'normal', '2026-01-23', '2026-01-23', 2),

-- ============================================
-- ON_PROGRESS tasks (status_id = 8) - Đang thực hiện
-- 8 tasks
-- ============================================
(37, 'Kiểm tra nhiệt độ tủ lạnh buổi sáng', 'Ghi nhận nhiệt độ tất cả tủ lạnh khu Fresh Food lúc 8:00', NULL, 1, 1, 2, 1, 9, 8, 'high', '2026-01-16', '2026-01-16', 2),
(38, 'Báo cáo doanh thu tuần', 'Tổng hợp doanh thu tuần 3 tháng 1/2026', NULL, 1, 2, 1, NULL, 5, 8, 'normal', '2026-01-13', '2026-01-17', 2),
(39, 'Trưng bày hàng Tết', 'Sắp xếp khu trưng bày hàng Tết theo planogram', NULL, 2, 1, 1, 1, 10, 8, 'high', '2026-01-10', '2026-01-20', 2),
(40, 'Đào tạo nhân viên mới', 'Đào tạo quy trình cho 3 nhân viên mới', NULL, 3, 2, 3, 3, 13, 8, 'normal', '2026-01-14', '2026-01-21', 4),
(41, 'Chuẩn bị khuyến mãi cuối tuần', 'Setup banner và giá khuyến mãi', NULL, 2, 1, 1, 2, 11, 8, 'high', '2026-01-15', '2026-01-17', 2),
(42, 'Vệ sinh tổng kết tuần', 'Tổng vệ sinh khu vực bán hàng', NULL, 1, 1, 1, 1, 8, 8, 'normal', '2026-01-16', '2026-01-16', 2),
(43, 'Kiểm kê hàng tồn kho', 'Kiểm kê toàn bộ hàng hóa cuối tuần', NULL, 1, 2, 1, 2, 12, 8, 'normal', '2026-01-15', '2026-01-17', 2),
(44, 'Chuẩn bị hàng Tết Nguyên Đán', 'Nhập và trưng bày hàng Tết', NULL, 2, 1, 1, 1, 10, 8, 'urgent', '2026-01-14', '2026-01-20', 2),

-- ============================================
-- DONE tasks (status_id = 9) - Đã hoàn thành
-- 10 tasks
-- ============================================
(45, 'Kiểm kê hàng tồn cuối năm 2025', 'Kiểm kê toàn bộ hàng hóa tồn kho cuối năm', NULL, 1, 2, 1, 1, 8, 9, 'high', '2025-12-28', '2025-12-31', 2),
(46, 'Trang trí Giáng sinh', 'Trang trí cửa hàng dịp Giáng sinh', NULL, 2, 1, 1, 1, 10, 9, 'normal', '2025-12-15', '2025-12-20', 2),
(47, 'Đào tạo nhân viên cuối năm', 'Buổi đào tạo tổng kết năm 2025', NULL, 3, 2, 3, NULL, 4, 9, 'normal', '2025-12-20', '2025-12-22', 4),
(48, 'Báo cáo doanh thu năm 2025', 'Tổng hợp báo cáo doanh thu cả năm', NULL, 1, 2, 4, NULL, 2, 9, 'high', '2025-12-26', '2025-12-31', 2),
(49, 'Bảo trì máy lạnh', 'Bảo trì định kỳ hệ thống máy lạnh', NULL, 1, 1, 5, 2, 12, 9, 'low', '2025-12-10', '2025-12-12', 2),
(50, 'Vệ sinh tổng kho', 'Tổng vệ sinh kho hàng cuối năm', NULL, 1, 1, 7, 1, 9, 9, 'normal', '2025-12-23', '2025-12-24', 2),
(51, 'Họp định hướng năm mới', 'Họp triển khai kế hoạch năm 2026', NULL, 1, 2, 1, NULL, 2, 9, 'high', '2026-01-02', '2026-01-02', 2),
(52, 'Cập nhật danh mục sản phẩm', 'Cập nhật danh mục SP trên hệ thống', NULL, 1, 1, 5, NULL, 1, 9, 'normal', '2026-01-03', '2026-01-05', 1),
(53, 'Đào tạo an toàn lao động', 'Buổi training ATLĐ cho toàn bộ nhân viên', NULL, 3, 2, 3, 1, 4, 9, 'high', '2026-01-06', '2026-01-06', 4),
(54, 'Backup dữ liệu hệ thống', 'Sao lưu dữ liệu định kỳ đầu tháng', NULL, 1, 1, 5, NULL, 1, 9, 'normal', '2026-01-01', '2026-01-01', 1),

-- ============================================
-- REJECT tasks (status_id = 11) - Đã bị từ chối
-- 6 tasks
-- ============================================
(55, 'Đề xuất tăng lương nhân viên', 'Đề xuất tăng lương 10% cho toàn bộ NV', NULL, 1, 2, 3, NULL, 4, 11, 'high', '2025-12-15', '2025-12-20', 4),
(56, 'Mua thêm xe đẩy hàng', 'Đề xuất mua 20 xe đẩy mới', NULL, 1, 2, 1, 1, 5, 11, 'normal', '2025-12-20', '2025-12-28', 2),
(57, 'Thay đổi nhà cung cấp bánh', 'Đề xuất đổi NCC bánh ngọt', NULL, 1, 2, 1, NULL, 2, 11, 'low', '2025-12-18', '2025-12-25', 2),
(58, 'Tổ chức team building', 'Đề xuất team building cuối năm', NULL, 3, 2, 3, 2, 6, 11, 'low', '2025-12-10', '2025-12-15', 4),
(59, 'Đề xuất thuê thêm bảo vệ', 'Đề xuất tuyển thêm 5 nhân viên bảo vệ', NULL, 1, 2, 1, 3, 7, 11, 'normal', '2025-12-22', '2025-12-28', 2),
(60, 'Đề xuất mua xe nâng hàng', 'Đề xuất mua 2 xe nâng hàng cho kho', NULL, 1, 2, 7, NULL, 2, 11, 'high', '2025-12-25', '2025-12-30', 2);

-- ============================================
-- TASK CHECK LIST (Junction)
-- ============================================
INSERT INTO `task_check_list` (`task_id`, `check_list_id`, `check_status`) VALUES
(37, 1, 0),  -- Kiểm tra nhiệt độ tủ lạnh
(38, 10, 0), -- Báo cáo doanh thu tuần
(43, 3, 0),  -- Kiểm kê hàng tồn kho
(43, 6, 0),
(42, 2, 1),  -- Vệ sinh tổng kết tuần
(42, 8, 1),
(51, 7, 0);  -- Họp định hướng năm mới
