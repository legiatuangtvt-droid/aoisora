-- Add subtasks to achieve ~80% coverage (72 of 90 parent tasks should have subtasks)
-- Task 18 "Template kiểm tra chất lượng" has full 5-level hierarchy for comprehensive testing

-- Reset AUTO_INCREMENT to continue from 110 (current max is 109)
ALTER TABLE `tasks` AUTO_INCREMENT = 110;

-- ============================================================
-- TASK 18: "Template kiểm tra chất lượng" - FULL 5-LEVEL HIERARCHY
-- ============================================================
-- Level 2 subtasks (3 main areas)
INSERT INTO `tasks` (`task_id`,`parent_task_id`,`task_level`,`source`,`receiver_type`,`task_name`,`task_description`,`task_type_id`,`response_type_id`,`dept_id`,`status_id`,`priority`,`created_staff_id`,`approver_id`,`created_at`,`updated_at`) VALUES
(110, 18, 2, 'library', 'store', 'Kiểm tra chất lượng thực phẩm', 'Kiểm tra chất lượng sản phẩm thực phẩm', 3, 5, 1, 13, 'normal', 1, 1, NOW(), NOW()),
(111, 18, 2, 'library', 'store', 'Kiểm tra chất lượng hàng khô', 'Kiểm tra chất lượng sản phẩm hàng khô', 3, 5, 1, 13, 'normal', 1, 1, NOW(), NOW()),
(112, 18, 2, 'library', 'store', 'Kiểm tra chất lượng đông lạnh', 'Kiểm tra chất lượng sản phẩm đông lạnh', 3, 5, 1, 13, 'normal', 1, 1, NOW(), NOW());

-- Level 3 subtasks (under Level 2)
INSERT INTO `tasks` (`task_id`,`parent_task_id`,`task_level`,`source`,`receiver_type`,`task_name`,`task_description`,`task_type_id`,`response_type_id`,`dept_id`,`status_id`,`priority`,`created_staff_id`,`approver_id`,`created_at`,`updated_at`) VALUES
-- Under 110 (Thực phẩm)
(113, 110, 3, 'library', 'store', 'Kiểm tra rau củ quả', 'Kiểm tra độ tươi và chất lượng rau củ', 3, 5, 1, 13, 'normal', 1, 1, NOW(), NOW()),
(114, 110, 3, 'library', 'store', 'Kiểm tra thịt cá', 'Kiểm tra chất lượng thịt và hải sản', 3, 5, 1, 13, 'normal', 1, 1, NOW(), NOW()),
(115, 110, 3, 'library', 'store', 'Kiểm tra sữa và dairy', 'Kiểm tra chất lượng sản phẩm sữa', 3, 5, 1, 13, 'normal', 1, 1, NOW(), NOW()),
-- Under 111 (Hàng khô)
(116, 111, 3, 'library', 'store', 'Kiểm tra gạo và ngũ cốc', 'Kiểm tra chất lượng gạo, mì, nui', 3, 5, 1, 13, 'normal', 1, 1, NOW(), NOW()),
(117, 111, 3, 'library', 'store', 'Kiểm tra đồ hộp', 'Kiểm tra chất lượng đồ hộp', 3, 5, 1, 13, 'normal', 1, 1, NOW(), NOW()),
-- Under 112 (Đông lạnh)
(118, 112, 3, 'library', 'store', 'Kiểm tra hải sản đông lạnh', 'Kiểm tra chất lượng hải sản đông lạnh', 3, 5, 1, 13, 'normal', 1, 1, NOW(), NOW()),
(119, 112, 3, 'library', 'store', 'Kiểm tra thực phẩm chế biến', 'Kiểm tra thực phẩm chế biến sẵn', 3, 5, 1, 13, 'normal', 1, 1, NOW(), NOW());

-- Level 4 subtasks (under Level 3)
INSERT INTO `tasks` (`task_id`,`parent_task_id`,`task_level`,`source`,`receiver_type`,`task_name`,`task_description`,`task_type_id`,`response_type_id`,`dept_id`,`status_id`,`priority`,`created_staff_id`,`approver_id`,`created_at`,`updated_at`) VALUES
-- Under 113 (Rau củ)
(120, 113, 4, 'library', 'store', 'Kiểm tra độ tươi', 'Kiểm tra độ tươi và màu sắc', 3, 5, 1, 13, 'normal', 1, 1, NOW(), NOW()),
(121, 113, 4, 'library', 'store', 'Kiểm tra hạn sử dụng', 'Kiểm tra hạn sử dụng còn lại', 3, 5, 1, 13, 'normal', 1, 1, NOW(), NOW()),
-- Under 114 (Thịt cá)
(122, 114, 4, 'library', 'store', 'Kiểm tra nhiệt độ bảo quản', 'Kiểm tra nhiệt độ tủ mát', 3, 5, 1, 13, 'normal', 1, 1, NOW(), NOW()),
(123, 114, 4, 'library', 'store', 'Kiểm tra mùi vị', 'Kiểm tra mùi của sản phẩm', 3, 5, 1, 13, 'normal', 1, 1, NOW(), NOW()),
-- Under 116 (Gạo)
(124, 116, 4, 'library', 'store', 'Kiểm tra bao bì', 'Kiểm tra tình trạng bao bì', 3, 5, 1, 13, 'normal', 1, 1, NOW(), NOW()),
-- Under 118 (Hải sản đông lạnh)
(125, 118, 4, 'library', 'store', 'Kiểm tra độ đông', 'Kiểm tra nhiệt độ tủ đông', 3, 5, 1, 13, 'normal', 1, 1, NOW(), NOW());

-- Level 5 subtasks (under Level 4)
INSERT INTO `tasks` (`task_id`,`parent_task_id`,`task_level`,`source`,`receiver_type`,`task_name`,`task_description`,`task_type_id`,`response_type_id`,`dept_id`,`status_id`,`priority`,`created_staff_id`,`approver_id`,`created_at`,`updated_at`) VALUES
-- Under 120 (Độ tươi)
(126, 120, 5, 'library', 'store', 'Đánh giá màu sắc lá', 'Kiểm tra màu xanh của lá rau', 3, 5, 1, 13, 'normal', 1, 1, NOW(), NOW()),
(127, 120, 5, 'library', 'store', 'Đánh giá độ giòn', 'Kiểm tra độ giòn của rau', 3, 5, 1, 13, 'normal', 1, 1, NOW(), NOW()),
-- Under 122 (Nhiệt độ)
(128, 122, 5, 'library', 'store', 'Ghi nhận nhiệt độ sáng', 'Ghi nhiệt độ tủ mát buổi sáng', 3, 5, 1, 13, 'normal', 1, 1, NOW(), NOW()),
(129, 122, 5, 'library', 'store', 'Ghi nhận nhiệt độ chiều', 'Ghi nhiệt độ tủ mát buổi chiều', 3, 5, 1, 13, 'normal', 1, 1, NOW(), NOW()),
-- Under 125 (Độ đông)
(130, 125, 5, 'library', 'store', 'Đo nhiệt độ tủ đông', 'Đo và ghi nhận nhiệt độ -18°C', 3, 5, 1, 13, 'normal', 1, 1, NOW(), NOW());

-- ============================================================
-- SUBTASKS FOR OTHER TASKS (to achieve ~80% coverage)
-- Adding subtasks for tasks 2-10, 12-17, 19-30, 32-90 (except 1, 11, 18, 31 which already have)
-- ============================================================

-- Task 2: Chuẩn bị báo cáo tài chính (Level 2 only)
INSERT INTO `tasks` (`task_id`,`parent_task_id`,`task_level`,`source`,`receiver_type`,`task_name`,`task_description`,`task_type_id`,`response_type_id`,`dept_id`,`status_id`,`priority`,`created_staff_id`,`approver_id`,`created_at`,`updated_at`) VALUES
(131, 2, 2, 'task_list', 'store', 'Thu thập số liệu doanh thu', 'Thu thập dữ liệu doanh thu tháng', 1, 6, 2, 12, 'high', 2, 1, NOW(), NOW()),
(132, 2, 2, 'task_list', 'store', 'Phân tích chi phí', 'Phân tích chi phí vận hành', 1, 6, 2, 12, 'normal', 2, 1, NOW(), NOW());

-- Task 3: Kế hoạch training Q2 (Level 2-3)
INSERT INTO `tasks` (`task_id`,`parent_task_id`,`task_level`,`source`,`receiver_type`,`task_name`,`task_description`,`task_type_id`,`response_type_id`,`dept_id`,`status_id`,`priority`,`created_staff_id`,`approver_id`,`created_at`,`updated_at`) VALUES
(133, 3, 2, 'task_list', 'store', 'Khảo sát nhu cầu training', 'Khảo sát nhu cầu đào tạo của NV', 3, 6, 3, 12, 'normal', 1, 1, NOW(), NOW()),
(134, 3, 2, 'task_list', 'store', 'Lập danh sách khóa học', 'Lập danh sách các khóa đào tạo', 3, 6, 3, 12, 'normal', 1, 1, NOW(), NOW()),
(135, 133, 3, 'task_list', 'store', 'Gửi form khảo sát', 'Gửi form khảo sát cho các store', 3, 6, 3, 12, 'normal', 1, 1, NOW(), NOW()),
(136, 133, 3, 'task_list', 'store', 'Tổng hợp kết quả', 'Tổng hợp kết quả khảo sát', 3, 6, 3, 12, 'normal', 1, 1, NOW(), NOW());

-- Task 4: Đề xuất cải tiến quy trình (Level 2)
INSERT INTO `tasks` (`task_id`,`parent_task_id`,`task_level`,`source`,`receiver_type`,`task_name`,`task_description`,`task_type_id`,`response_type_id`,`dept_id`,`status_id`,`priority`,`created_staff_id`,`approver_id`,`created_at`,`updated_at`) VALUES
(137, 4, 2, 'task_list', 'store', 'Phân tích quy trình hiện tại', 'Phân tích điểm yếu quy trình', 1, 6, 1, 12, 'normal', 4, 1, NOW(), NOW()),
(138, 4, 2, 'task_list', 'store', 'Đề xuất giải pháp', 'Đề xuất các giải pháp cải tiến', 1, 6, 1, 12, 'normal', 4, 1, NOW(), NOW());

-- Task 5: Thiết kế layout mới (Level 2-3)
INSERT INTO `tasks` (`task_id`,`parent_task_id`,`task_level`,`source`,`receiver_type`,`task_name`,`task_description`,`task_type_id`,`response_type_id`,`dept_id`,`status_id`,`priority`,`created_staff_id`,`approver_id`,`created_at`,`updated_at`) VALUES
(139, 5, 2, 'task_list', 'store', 'Khảo sát không gian', 'Đo đạc và khảo sát không gian', 2, 4, 1, 12, 'normal', 5, 4, NOW(), NOW()),
(140, 5, 2, 'task_list', 'store', 'Vẽ bản thiết kế', 'Vẽ layout kệ hàng mới', 2, 4, 1, 12, 'normal', 5, 4, NOW(), NOW()),
(141, 139, 3, 'task_list', 'store', 'Đo diện tích', 'Đo diện tích từng khu vực', 2, 4, 1, 12, 'normal', 5, 4, NOW(), NOW());

-- Task 6: Kế hoạch khuyến mãi Tết (Level 2)
INSERT INTO `tasks` (`task_id`,`parent_task_id`,`task_level`,`source`,`receiver_type`,`task_name`,`task_description`,`task_type_id`,`response_type_id`,`dept_id`,`status_id`,`priority`,`created_staff_id`,`approver_id`,`created_at`,`updated_at`) VALUES
(142, 6, 2, 'task_list', 'store', 'Lên danh sách SP khuyến mãi', 'Chọn sản phẩm tham gia KM', 2, 4, 1, 12, 'high', 1, 1, NOW(), NOW()),
(143, 6, 2, 'task_list', 'store', 'Thiết kế POSM', 'Thiết kế vật phẩm trưng bày', 2, 4, 1, 12, 'normal', 1, 1, NOW(), NOW());

-- Task 7: Đánh giá nhà cung cấp (Level 2-3)
INSERT INTO `tasks` (`task_id`,`parent_task_id`,`task_level`,`source`,`receiver_type`,`task_name`,`task_description`,`task_type_id`,`response_type_id`,`dept_id`,`status_id`,`priority`,`created_staff_id`,`approver_id`,`created_at`,`updated_at`) VALUES
(144, 7, 2, 'task_list', 'store', 'Thu thập data NCC', 'Thu thập dữ liệu nhà cung cấp', 1, 5, 1, 12, 'normal', 2, 1, NOW(), NOW()),
(145, 7, 2, 'task_list', 'store', 'Đánh giá chất lượng', 'Đánh giá chất lượng hàng hóa', 1, 5, 1, 12, 'normal', 2, 1, NOW(), NOW()),
(146, 144, 3, 'task_list', 'store', 'Liên hệ NCC', 'Liên hệ lấy thông tin NCC', 1, 5, 1, 12, 'normal', 2, 1, NOW(), NOW());

-- Task 8: Kế hoạch bảo trì thiết bị (Level 2)
INSERT INTO `tasks` (`task_id`,`parent_task_id`,`task_level`,`source`,`receiver_type`,`task_name`,`task_description`,`task_type_id`,`response_type_id`,`dept_id`,`status_id`,`priority`,`created_staff_id`,`approver_id`,`created_at`,`updated_at`) VALUES
(147, 8, 2, 'task_list', 'store', 'Liệt kê thiết bị cần bảo trì', 'Lập danh sách thiết bị', 3, 5, 4, 12, 'normal', 1, 1, NOW(), NOW()),
(148, 8, 2, 'task_list', 'store', 'Lên lịch bảo trì', 'Lập lịch bảo trì định kỳ', 3, 5, 4, 12, 'normal', 1, 1, NOW(), NOW());

-- Task 9: Cập nhật manual POS (Level 2)
INSERT INTO `tasks` (`task_id`,`parent_task_id`,`task_level`,`source`,`receiver_type`,`task_name`,`task_description`,`task_type_id`,`response_type_id`,`dept_id`,`status_id`,`priority`,`created_staff_id`,`approver_id`,`created_at`,`updated_at`) VALUES
(149, 9, 2, 'library', 'store', 'Soạn nội dung manual', 'Soạn nội dung hướng dẫn', 3, 6, 4, 12, 'normal', 1, 1, NOW(), NOW()),
(150, 9, 2, 'library', 'store', 'Chụp hình minh họa', 'Chụp hình các bước thực hiện', 3, 6, 4, 12, 'normal', 1, 1, NOW(), NOW());

-- Task 10: Template kiểm tra an toàn (Level 2-3)
INSERT INTO `tasks` (`task_id`,`parent_task_id`,`task_level`,`source`,`receiver_type`,`task_name`,`task_description`,`task_type_id`,`response_type_id`,`dept_id`,`status_id`,`priority`,`created_staff_id`,`approver_id`,`created_at`,`updated_at`) VALUES
(151, 10, 2, 'library', 'store', 'Kiểm tra an toàn điện', 'Kiểm tra hệ thống điện', 3, 5, 1, 12, 'high', 4, 1, NOW(), NOW()),
(152, 10, 2, 'library', 'store', 'Kiểm tra an toàn PCCC', 'Kiểm tra thiết bị PCCC', 3, 5, 1, 12, 'high', 4, 1, NOW(), NOW()),
(153, 151, 3, 'library', 'store', 'Kiểm tra ổ cắm', 'Kiểm tra các ổ cắm điện', 3, 5, 1, 12, 'normal', 4, 1, NOW(), NOW()),
(154, 152, 3, 'library', 'store', 'Kiểm tra bình chữa cháy', 'Kiểm tra hạn bình CC', 3, 5, 1, 12, 'high', 4, 1, NOW(), NOW());

-- Task 12: Sắp xếp kệ Tết (Level 2)
INSERT INTO `tasks` (`task_id`,`parent_task_id`,`task_level`,`source`,`receiver_type`,`task_name`,`task_description`,`task_type_id`,`response_type_id`,`dept_id`,`status_id`,`priority`,`start_date`,`end_date`,`created_staff_id`,`approver_id`,`submitted_at`,`created_at`,`updated_at`) VALUES
(155, 12, 2, 'task_list', 'store', 'Dọn dẹp kệ cũ', 'Dọn dẹp sản phẩm cũ trên kệ', 2, 4, 1, 13, 'urgent', '2026-01-23', '2026-01-29', 7, 2, '2026-01-22 01:42:52', NOW(), NOW()),
(156, 12, 2, 'task_list', 'store', 'Bày trí SP Tết', 'Bày trí sản phẩm Tết lên kệ', 2, 4, 1, 13, 'urgent', '2026-01-23', '2026-01-29', 7, 2, '2026-01-22 01:42:52', NOW(), NOW());

-- Task 13: Kiểm tra PCCC tháng 1 (Level 2)
INSERT INTO `tasks` (`task_id`,`parent_task_id`,`task_level`,`source`,`receiver_type`,`task_name`,`task_description`,`task_type_id`,`response_type_id`,`dept_id`,`status_id`,`priority`,`start_date`,`end_date`,`created_staff_id`,`approver_id`,`submitted_at`,`created_at`,`updated_at`) VALUES
(157, 13, 2, 'task_list', 'store', 'Kiểm tra bình CC', 'Kiểm tra số lượng bình chữa cháy', 3, 5, 1, 13, 'high', '2026-01-25', '2026-01-26', 6, 2, '2026-01-22 01:42:52', NOW(), NOW()),
(158, 13, 2, 'task_list', 'store', 'Kiểm tra lối thoát hiểm', 'Kiểm tra lối thoát hiểm', 3, 5, 1, 13, 'high', '2026-01-25', '2026-01-26', 6, 2, '2026-01-22 01:42:52', NOW(), NOW());

-- Task 14: Báo cáo hiệu suất tuần (Level 2)
INSERT INTO `tasks` (`task_id`,`parent_task_id`,`task_level`,`source`,`receiver_type`,`task_name`,`task_description`,`task_type_id`,`response_type_id`,`dept_id`,`status_id`,`priority`,`start_date`,`end_date`,`created_staff_id`,`approver_id`,`submitted_at`,`created_at`,`updated_at`) VALUES
(159, 14, 2, 'task_list', 'store', 'Thu thập KPI', 'Thu thập số liệu KPI tuần', 1, 6, 1, 13, 'normal', '2026-01-22', '2026-01-23', 5, 4, '2026-01-22 01:42:52', NOW(), NOW()),
(160, 14, 2, 'task_list', 'store', 'Tổng hợp báo cáo', 'Tổng hợp và viết báo cáo', 1, 6, 1, 13, 'normal', '2026-01-22', '2026-01-23', 5, 4, '2026-01-22 01:42:52', NOW(), NOW());

-- Task 15: Training POS mới (Level 2-3)
INSERT INTO `tasks` (`task_id`,`parent_task_id`,`task_level`,`source`,`receiver_type`,`task_name`,`task_description`,`task_type_id`,`response_type_id`,`dept_id`,`status_id`,`priority`,`start_date`,`end_date`,`created_staff_id`,`approver_id`,`submitted_at`,`created_at`,`updated_at`) VALUES
(161, 15, 2, 'task_list', 'store', 'Chuẩn bị tài liệu training', 'Chuẩn bị tài liệu đào tạo', 3, 6, 4, 13, 'normal', '2026-01-27', '2026-02-01', 1, 1, '2026-01-22 01:42:52', NOW(), NOW()),
(162, 15, 2, 'task_list', 'store', 'Thực hành trên máy', 'Thực hành sử dụng POS', 3, 6, 4, 13, 'normal', '2026-01-27', '2026-02-01', 1, 1, '2026-01-22 01:42:52', NOW(), NOW()),
(163, 161, 3, 'task_list', 'store', 'In tài liệu', 'In tài liệu hướng dẫn', 3, 6, 4, 13, 'normal', '2026-01-27', '2026-02-01', 1, 1, '2026-01-22 01:42:52', NOW(), NOW());

-- Task 16: Kế hoạch nhân sự Q1 (Level 2)
INSERT INTO `tasks` (`task_id`,`parent_task_id`,`task_level`,`source`,`receiver_type`,`task_name`,`task_description`,`task_type_id`,`response_type_id`,`dept_id`,`status_id`,`priority`,`start_date`,`end_date`,`created_staff_id`,`approver_id`,`submitted_at`,`created_at`,`updated_at`) VALUES
(164, 16, 2, 'task_list', 'store', 'Đánh giá nhu cầu NS', 'Đánh giá nhu cầu nhân sự Q1', 1, 6, 3, 13, 'high', '2026-01-29', '2026-02-12', 4, 1, '2026-01-22 01:42:52', NOW(), NOW()),
(165, 16, 2, 'task_list', 'store', 'Lập kế hoạch tuyển dụng', 'Lên kế hoạch tuyển dụng', 1, 6, 3, 13, 'normal', '2026-01-29', '2026-02-12', 4, 1, '2026-01-22 01:42:52', NOW(), NOW());

-- Task 17: Template vệ sinh cửa hàng (Level 2)
INSERT INTO `tasks` (`task_id`,`parent_task_id`,`task_level`,`source`,`receiver_type`,`task_name`,`task_description`,`task_type_id`,`response_type_id`,`dept_id`,`status_id`,`priority`,`created_staff_id`,`approver_id`,`submitted_at`,`created_at`,`updated_at`) VALUES
(166, 17, 2, 'library', 'store', 'VS khu bán hàng', 'Vệ sinh khu vực bán hàng', 3, 5, 1, 13, 'normal', 5, 4, '2026-01-22 01:42:52', NOW(), NOW()),
(167, 17, 2, 'library', 'store', 'VS khu kho', 'Vệ sinh khu vực kho', 3, 5, 1, 13, 'normal', 5, 4, '2026-01-22 01:42:52', NOW(), NOW());

-- Tasks 19-30: Adding subtasks (Level 2)
INSERT INTO `tasks` (`task_id`,`parent_task_id`,`task_level`,`source`,`receiver_type`,`task_name`,`task_description`,`task_type_id`,`response_type_id`,`dept_id`,`assigned_store_id`,`status_id`,`priority`,`start_date`,`end_date`,`created_staff_id`,`approver_id`,`approved_at`,`created_at`,`updated_at`) VALUES
-- Task 19
(168, 19, 2, 'task_list', 'store', 'Lau kệ khu A-1', 'Lau dọn kệ hàng khu A phần 1', 2, 4, 1, 7, 7, 'normal', '2026-01-22', '2026-01-24', 2, 1, '2026-01-22 01:42:52', NOW(), NOW()),
(169, 19, 2, 'task_list', 'store', 'Lau kệ khu A-2', 'Lau dọn kệ hàng khu A phần 2', 2, 4, 1, 7, 7, 'normal', '2026-01-22', '2026-01-24', 2, 1, '2026-01-22 01:42:52', NOW(), NOW()),
-- Task 20
(170, 20, 2, 'task_list', 'store', 'Kiểm tra HSD rau củ', 'Kiểm tra HSD rau củ quả', 3, 5, 1, 9, 7, 'high', '2026-01-22', '2026-01-22', 2, 1, '2026-01-22 01:42:52', NOW(), NOW()),
(171, 20, 2, 'task_list', 'store', 'Kiểm tra HSD thịt cá', 'Kiểm tra HSD thịt cá', 3, 5, 1, 9, 7, 'high', '2026-01-22', '2026-01-22', 2, 1, '2026-01-22 01:42:52', NOW(), NOW()),
-- Task 21
(172, 21, 2, 'task_list', 'store', 'Bổ sung hàng kệ 1', 'Bổ sung hàng lên kệ số 1', 2, 4, 1, 7, 7, 'normal', '2026-01-22', '2026-01-23', 1, 1, '2026-01-22 01:42:52', NOW(), NOW()),
-- Task 22
(173, 22, 2, 'task_list', 'store', 'Kiểm tra giá khu A', 'Kiểm tra giá niêm yết khu A', 1, 5, 1, 10, 7, 'normal', '2026-01-22', '2026-01-23', 2, 1, '2026-01-22 01:42:52', NOW(), NOW()),
-- Task 23
(174, 23, 2, 'task_list', 'store', 'Lau quầy thu ngân', 'Lau dọn quầy thu ngân', 2, 4, 1, 7, 7, 'normal', '2026-01-22', '2026-01-22', 1, 1, '2026-01-22 01:42:52', NOW(), NOW()),
-- Task 24
(175, 24, 2, 'task_list', 'store', 'Kiểm tra máy lạnh 1', 'Kiểm tra máy lạnh số 1', 3, 5, 4, 9, 7, 'high', '2026-01-23', '2026-01-24', 1, 1, '2026-01-22 01:42:52', NOW(), NOW()),
-- Task 25
(176, 25, 2, 'task_list', 'store', 'In bảng giá KM', 'In bảng giá khuyến mãi', 2, 4, 1, 7, 7, 'normal', '2026-01-22', '2026-01-25', 2, 1, '2026-01-22 01:42:52', NOW(), NOW()),
-- Task 26
(177, 26, 2, 'task_list', 'store', 'VS khu thịt', 'Vệ sinh khu bán thịt', 3, 5, 1, 9, 7, 'urgent', '2026-01-22', '2026-01-22', 1, 1, '2026-01-22 01:42:52', NOW(), NOW()),
-- Task 27
(178, 27, 2, 'task_list', 'store', 'Kiểm tra SL hàng', 'Kiểm tra số lượng hàng nhập', 1, 5, 1, 10, 7, 'high', '2026-01-23', '2026-01-23', 2, 1, '2026-01-22 01:42:52', NOW(), NOW()),
-- Task 28
(179, 28, 2, 'task_list', 'store', 'Thay bóng đèn hỏng', 'Thay thế bóng đèn hư hỏng', 3, 5, 4, 9, 7, 'normal', '2026-01-24', '2026-01-25', 1, 1, '2026-01-22 01:42:52', NOW(), NOW()),
-- Task 29
(180, 29, 2, 'task_list', 'store', 'Sắp xếp kho A', 'Sắp xếp hàng trong kho A', 2, 4, 1, 7, 7, 'normal', '2026-01-23', '2026-01-26', 2, 1, '2026-01-22 01:42:52', NOW(), NOW()),
-- Task 30
(181, 30, 2, 'task_list', 'store', 'Soạn slide họp', 'Soạn slide cho cuộc họp', 3, 6, 1, 4, 7, 'normal', '2026-01-25', '2026-01-25', 1, 1, '2026-01-22 01:42:52', NOW(), NOW());

-- Tasks 32-45: Adding subtasks
INSERT INTO `tasks` (`task_id`,`parent_task_id`,`task_level`,`source`,`receiver_type`,`task_name`,`task_description`,`task_type_id`,`response_type_id`,`dept_id`,`assigned_store_id`,`do_staff_id`,`status_id`,`priority`,`start_date`,`end_date`,`created_staff_id`,`approver_id`,`approved_at`,`created_at`,`updated_at`) VALUES
-- Task 32
(182, 32, 2, 'task_list', 'store', 'Lấy hàng KM từ kho', 'Lấy hàng khuyến mãi từ kho', 2, 4, 1, 7, 7, 8, 'normal', '2026-01-21', '2026-01-24', 1, 1, '2026-01-20 01:42:52', NOW(), NOW()),
-- Task 33
(183, 33, 2, 'task_list', 'store', 'Soạn tài liệu training', 'Soạn tài liệu đào tạo NV mới', 3, 6, 3, 4, 4, 8, 'normal', '2026-01-19', '2026-01-26', 1, 1, '2026-01-18 01:42:52', NOW(), NOW()),
-- Task 34
(184, 34, 2, 'task_list', 'store', 'Kiểm tra bao bì SP', 'Kiểm tra bao bì sản phẩm', 3, 5, 1, 9, 9, 8, 'high', '2026-01-22', '2026-01-23', 2, 1, '2026-01-21 01:42:52', NOW(), NOW()),
-- Task 35
(185, 35, 2, 'task_list', 'store', 'In bảng giá mới', 'In và dán bảng giá mới', 1, 4, 1, 7, 7, 8, 'normal', '2026-01-21', '2026-01-22', 1, 1, '2026-01-20 01:42:52', NOW(), NOW()),
-- Task 36
(186, 36, 2, 'task_list', 'store', 'VS khu vực A', 'Vệ sinh khu vực A', 2, 4, 1, 10, 10, 8, 'normal', '2026-01-20', '2026-01-22', 2, 1, '2026-01-19 01:42:52', NOW(), NOW()),
-- Task 37
(187, 37, 2, 'task_list', 'store', 'Test camera khu 1', 'Test hoạt động camera khu 1', 3, 5, 4, 9, 9, 8, 'high', '2026-01-21', '2026-01-23', 1, 1, '2026-01-20 01:42:52', NOW(), NOW()),
-- Task 38
(188, 38, 2, 'task_list', 'store', 'Chuẩn bị banner', 'Chuẩn bị banner cho event', 2, 4, 1, 7, 7, 8, 'urgent', '2026-01-22', '2026-01-24', 2, 1, '2026-01-21 01:42:52', NOW(), NOW()),
-- Task 39
(189, 39, 2, 'task_list', 'store', 'Tổng hợp doanh số', 'Tổng hợp số liệu doanh số', 1, 6, 2, 10, 10, 8, 'normal', '2026-01-21', '2026-01-22', 1, 1, '2026-01-21 01:42:52', NOW(), NOW()),
-- Task 40
(190, 40, 2, 'task_list', 'store', 'Kiểm đếm máy móc', 'Kiểm đếm máy móc thiết bị', 1, 5, 2, 10, 10, 8, 'normal', '2026-01-18', '2026-01-25', 2, 1, '2026-01-17 01:42:52', NOW(), NOW()),
-- Task 41
(191, 41, 2, 'task_list', 'store', 'Dọn dẹp khu cũ', 'Dọn dẹp khu vực bán hàng cũ', 2, 4, 1, 7, 7, 8, 'normal', '2026-01-20', '2026-01-23', 1, 1, '2026-01-19 01:42:52', NOW(), NOW()),
-- Task 42
(192, 42, 2, 'task_list', 'store', 'In tài liệu họp', 'In tài liệu cho cuộc họp', 3, 6, 1, 4, 4, 8, 'high', '2026-01-21', '2026-01-22', 1, 1, '2026-01-20 01:42:52', NOW(), NOW()),
-- Task 43
(193, 43, 2, 'task_list', 'store', 'Kiểm tra dây điện', 'Kiểm tra hệ thống dây điện', 3, 5, 4, 9, 9, 8, 'high', '2026-01-21', '2026-01-23', 2, 1, '2026-01-20 01:42:52', NOW(), NOW()),
-- Task 44
(194, 44, 2, 'task_list', 'store', 'Cập nhật nội dung', 'Cập nhật nội dung menu', 2, 4, 4, 9, 9, 8, 'normal', '2026-01-20', '2026-01-23', 1, 1, '2026-01-19 01:42:52', NOW(), NOW()),
-- Task 45
(195, 45, 2, 'task_list', 'store', 'Test thanh toán', 'Test chức năng thanh toán', 3, 5, 4, 9, 9, 8, 'high', '2026-01-22', '2026-01-23', 2, 1, '2026-01-22 01:42:52', NOW(), NOW());

-- Tasks 46-60: Adding subtasks (DONE and OVERDUE tasks)
INSERT INTO `tasks` (`task_id`,`parent_task_id`,`task_level`,`source`,`receiver_type`,`task_name`,`task_description`,`task_type_id`,`response_type_id`,`dept_id`,`assigned_store_id`,`do_staff_id`,`status_id`,`priority`,`start_date`,`end_date`,`completed_time`,`created_staff_id`,`approver_id`,`approved_at`,`created_at`,`updated_at`) VALUES
-- Task 46 (DONE)
(196, 46, 2, 'task_list', 'store', 'Đếm hàng kho 1', 'Đếm hàng trong kho số 1', 1, 5, 1, 7, 7, 9, 'high', '2026-01-12', '2026-01-15', '2026-01-15 01:42:52', 2, 1, '2026-01-11 01:42:52', NOW(), NOW()),
-- Task 47 (DONE)
(197, 47, 2, 'task_list', 'store', 'Tính doanh thu ngày', 'Tổng hợp doanh thu theo ngày', 1, 6, 2, 10, 10, 9, 'normal', '2026-01-08', '2026-01-12', '2026-01-12 01:42:52', 1, 1, '2026-01-07 01:42:52', NOW(), NOW()),
-- Task 48 (DONE)
(198, 48, 2, 'task_list', 'store', 'Lau sàn nhà', 'Lau dọn sàn toàn bộ', 2, 4, 1, 7, 7, 9, 'high', '2026-01-14', '2026-01-17', '2026-01-17 01:42:52', 2, 1, '2026-01-13 01:42:52', NOW(), NOW()),
-- Task 49 (DONE)
(199, 49, 2, 'task_list', 'store', 'Đánh giá NV', 'Đánh giá hiệu suất NV', 3, 6, 3, 4, 4, 9, 'normal', '2026-01-10', '2026-01-14', '2026-01-14 01:42:52', 1, 1, '2026-01-09 01:42:52', NOW(), NOW()),
-- Task 50 (DONE)
(200, 50, 2, 'task_list', 'store', 'Kiểm tra bình CC', 'Kiểm tra bình chữa cháy', 3, 5, 1, 9, 9, 9, 'high', '2026-01-07', '2026-01-10', '2026-01-10 01:42:52', 2, 1, '2026-01-06 01:42:52', NOW(), NOW()),
-- Task 51 (DONE)
(201, 51, 2, 'task_list', 'store', 'Tính KPI Q4', 'Tính toán KPI quý 4', 1, 6, 3, 4, 4, 9, 'high', '2026-01-02', '2026-01-07', '2026-01-07 01:42:52', 1, 1, '2026-01-01 01:42:52', NOW(), NOW()),
-- Task 52 (DONE)
(202, 52, 2, 'task_list', 'store', 'Đếm tài sản', 'Đếm số lượng tài sản', 1, 5, 2, 10, 10, 9, 'normal', '2026-01-04', '2026-01-09', '2026-01-09 01:42:52', 2, 1, '2026-01-03 01:42:52', NOW(), NOW()),
-- Task 53 (DONE)
(203, 53, 2, 'task_list', 'store', 'Xếp hàng theo loại', 'Phân loại và xếp hàng', 2, 4, 1, 7, 7, 9, 'normal', '2026-01-13', '2026-01-16', '2026-01-16 01:42:52', 1, 1, '2026-01-12 01:42:52', NOW(), NOW()),
-- Task 54 (DONE)
(204, 54, 2, 'task_list', 'store', 'Copy dữ liệu', 'Copy dữ liệu vào ổ cứng', 3, 5, 4, 9, 9, 9, 'urgent', '2026-01-15', '2026-01-17', '2026-01-17 01:42:52', 1, 1, '2026-01-14 01:42:52', NOW(), NOW()),
-- Task 55 (DONE)
(205, 55, 2, 'task_list', 'store', 'Trang trí booth', 'Trang trí booth event', 2, 4, 1, 7, 7, 9, 'high', '2026-01-16', '2026-01-19', '2026-01-19 01:42:52', 2, 1, '2026-01-15 01:42:52', NOW(), NOW()),
-- Task 56 (OVERDUE)
(206, 56, 2, 'task_list', 'store', 'Tổng hợp tồn kho', 'Tổng hợp báo cáo tồn kho', 1, 6, 1, 7, 7, 10, 'high', '2026-01-12', '2026-01-17', NULL, 2, 1, '2026-01-11 01:42:52', NOW(), NOW()),
-- Task 57 (OVERDUE)
(207, 57, 2, 'task_list', 'store', 'Test camera góc khuất', 'Test camera góc khuất', 3, 5, 4, 9, NULL, 10, 'urgent', '2026-01-15', '2026-01-19', NULL, 1, 1, '2026-01-14 01:42:52', NOW(), NOW()),
-- Task 58 (OVERDUE)
(208, 58, 2, 'task_list', 'store', 'Lau khu B-1', 'Lau dọn khu B phần 1', 2, 4, 1, 7, 7, 10, 'normal', '2026-01-17', '2026-01-20', NULL, 2, 1, '2026-01-16 01:42:52', NOW(), NOW()),
-- Task 59 (OVERDUE)
(209, 59, 2, 'task_list', 'store', 'Cập nhật giá SP', 'Cập nhật giá sản phẩm', 1, 4, 1, 10, 10, 10, 'high', '2026-01-18', '2026-01-21', NULL, 1, 1, '2026-01-17 01:42:52', NOW(), NOW()),
-- Task 60 (OVERDUE)
(210, 60, 2, 'task_list', 'store', 'Viết báo cáo', 'Viết nội dung báo cáo', 1, 6, 2, 10, NULL, 10, 'normal', '2026-01-16', '2026-01-20', NULL, 2, 1, '2026-01-15 01:42:52', NOW(), NOW());

-- Tasks 61-75: Adding subtasks
INSERT INTO `tasks` (`task_id`,`parent_task_id`,`task_level`,`source`,`receiver_type`,`task_name`,`task_description`,`task_type_id`,`response_type_id`,`dept_id`,`assigned_store_id`,`do_staff_id`,`status_id`,`priority`,`start_date`,`end_date`,`created_staff_id`,`approver_id`,`approved_at`,`created_at`,`updated_at`) VALUES
-- Task 61
(211, 61, 2, 'task_list', 'store', 'Kiểm tra van nước', 'Kiểm tra hoạt động van nước', 3, 5, 1, 7, NULL, 7, 'normal', '2026-01-22', '2026-01-24', 1, 1, '2026-01-22 01:42:52', NOW(), NOW()),
-- Task 62
(212, 62, 2, 'task_list', 'store', 'Sắp xếp kệ C-1', 'Sắp xếp kệ hàng C phần 1', 2, 4, 1, 7, NULL, 7, 'normal', '2026-01-22', '2026-01-23', 2, 1, '2026-01-22 01:42:52', NOW(), NOW()),
-- Task 63
(213, 63, 2, 'task_list', 'store', 'Đếm hàng khu A', 'Đếm số lượng hàng khu A', 1, 5, 1, 9, NULL, 7, 'high', '2026-01-22', '2026-01-23', 1, 1, '2026-01-22 01:42:52', NOW(), NOW()),
-- Task 64
(214, 64, 2, 'task_list', 'store', 'Rửa thùng rác', 'Rửa và khử trùng thùng rác', 2, 4, 1, 7, NULL, 7, 'urgent', '2026-01-22', '2026-01-22', 2, 1, '2026-01-22 01:42:52', NOW(), NOW()),
-- Task 65
(215, 65, 2, 'task_list', 'store', 'In và dán bảng giá', 'In bảng giá và dán lên kệ', 1, 4, 1, 10, NULL, 7, 'normal', '2026-01-23', '2026-01-24', 1, 1, '2026-01-22 01:42:52', NOW(), NOW()),
-- Task 66
(216, 66, 2, 'task_list', 'store', 'Kiểm tra tủ đông', 'Kiểm tra hoạt động tủ đông', 3, 5, 1, 9, NULL, 7, 'high', '2026-01-22', '2026-01-23', 2, 1, '2026-01-22 01:42:52', NOW(), NOW()),
-- Task 67
(217, 67, 2, 'task_list', 'store', 'Kiểm tra chất lượng', 'Kiểm tra chất lượng hàng nhập', 1, 5, 1, 10, NULL, 7, 'normal', '2026-01-23', '2026-01-23', 1, 1, '2026-01-22 01:42:52', NOW(), NOW()),
-- Task 68
(218, 68, 2, 'task_list', 'store', 'Chụp ảnh kệ hỏng', 'Chụp ảnh kệ hàng cần sửa', 1, 6, 1, 7, NULL, 7, 'normal', '2026-01-22', '2026-01-25', 2, 1, '2026-01-22 01:42:52', NOW(), NOW()),
-- Task 69
(219, 69, 2, 'task_list', 'store', 'Kê kệ mới', 'Kê và lắp đặt kệ mới', 2, 4, 1, 7, NULL, 7, 'high', '2026-01-24', '2026-01-26', 1, 1, '2026-01-22 01:42:52', NOW(), NOW()),
-- Task 70
(220, 70, 2, 'task_list', 'store', 'Test camera đêm', 'Test chất lượng camera ban đêm', 3, 5, 1, 9, NULL, 7, 'normal', '2026-01-23', '2026-01-24', 2, 1, '2026-01-22 01:42:52', NOW(), NOW()),
-- Task 71
(221, 71, 2, 'task_list', 'store', 'VS khu Fresh', 'Vệ sinh khu thực phẩm tươi', 2, 4, 1, 7, 7, 8, 'high', '2026-01-21', '2026-01-23', 1, 1, '2026-01-20 01:42:52', NOW(), NOW()),
-- Task 72
(222, 72, 2, 'task_list', 'store', 'Nhập liệu kiểm kê', 'Nhập dữ liệu kiểm kê vào hệ thống', 1, 5, 1, 9, 9, 8, 'normal', '2026-01-20', '2026-01-23', 2, 1, '2026-01-19 01:42:52', NOW(), NOW()),
-- Task 73
(223, 73, 2, 'task_list', 'store', 'Sắp hàng FIFO', 'Xếp hàng theo nguyên tắc FIFO', 2, 4, 1, 10, 10, 8, 'high', '2026-01-21', '2026-01-22', 1, 1, '2026-01-20 01:42:52', NOW(), NOW()),
-- Task 74
(224, 74, 2, 'task_list', 'store', 'Trưng bày SP KM', 'Trưng bày sản phẩm khuyến mãi', 2, 4, 1, 7, 7, 8, 'normal', '2026-01-20', '2026-01-24', 2, 1, '2026-01-19 01:42:52', NOW(), NOW()),
-- Task 75
(225, 75, 2, 'task_list', 'store', 'Loại bỏ rau hỏng', 'Loại bỏ rau củ không đạt', 3, 5, 1, 9, 9, 8, 'urgent', '2026-01-22', '2026-01-22', 1, 1, '2026-01-22 01:42:52', NOW(), NOW());

-- Tasks 76-90: Adding subtasks
INSERT INTO `tasks` (`task_id`,`parent_task_id`,`task_level`,`source`,`receiver_type`,`task_name`,`task_description`,`task_type_id`,`response_type_id`,`dept_id`,`assigned_store_id`,`do_staff_id`,`status_id`,`priority`,`start_date`,`end_date`,`completed_time`,`created_staff_id`,`approver_id`,`approved_at`,`created_at`,`updated_at`) VALUES
-- Task 76
(226, 76, 2, 'task_list', 'store', 'Export báo cáo', 'Export báo cáo từ hệ thống', 1, 6, 2, 10, 10, 8, 'normal', '2026-01-21', '2026-01-22', NULL, 2, 1, '2026-01-20 01:42:52', NOW(), NOW()),
-- Task 77
(227, 77, 2, 'task_list', 'store', 'Test in hóa đơn', 'Test chức năng in hóa đơn', 3, 5, 4, 9, 9, 8, 'high', '2026-01-21', '2026-01-23', NULL, 1, 1, '2026-01-20 01:42:52', NOW(), NOW()),
-- Task 78
(228, 78, 2, 'task_list', 'store', 'Lau bàn ghế', 'Lau dọn bàn ghế khách', 2, 4, 1, 7, 7, 8, 'normal', '2026-01-20', '2026-01-22', NULL, 2, 1, '2026-01-19 01:42:52', NOW(), NOW()),
-- Task 79
(229, 79, 2, 'task_list', 'store', 'Xếp thực phẩm chế biến', 'Xếp gọn đồ ăn chế biến sẵn', 2, 4, 1, 7, 7, 8, 'normal', '2026-01-21', '2026-01-23', NULL, 1, 1, '2026-01-20 01:42:52', NOW(), NOW()),
-- Task 80
(230, 80, 2, 'task_list', 'store', 'Test quẹt thẻ', 'Test chức năng quẹt thẻ', 3, 5, 4, 9, 9, 8, 'high', '2026-01-22', '2026-01-23', NULL, 2, 1, '2026-01-22 01:42:52', NOW(), NOW()),
-- Task 81 (DONE)
(231, 81, 2, 'task_list', 'store', 'Đếm hàng tuần 4', 'Đếm hàng cuối tuần 4', 1, 5, 1, 7, 7, 9, 'high', '2026-01-10', '2026-01-13', '2026-01-13 01:42:52', 1, 1, '2026-01-09 01:42:52', NOW(), NOW()),
-- Task 82 (DONE)
(232, 82, 2, 'task_list', 'store', 'Quét dọn kho', 'Quét dọn sàn kho', 2, 4, 1, 7, 7, 9, 'normal', '2026-01-14', '2026-01-17', '2026-01-17 01:42:52', 2, 1, '2026-01-13 01:42:52', NOW(), NOW()),
-- Task 83 (DONE)
(233, 83, 2, 'task_list', 'store', 'Thực hành ATTP', 'Thực hành kiến thức ATTP', 3, 6, 3, 4, 4, 9, 'high', '2026-01-12', '2026-01-15', '2026-01-15 01:42:52', 1, 1, '2026-01-11 01:42:52', NOW(), NOW()),
-- Task 84 (DONE)
(234, 84, 2, 'task_list', 'store', 'Tổng hợp chi phí', 'Tổng hợp chi phí tháng 12', 1, 6, 2, 10, 10, 9, 'normal', '2026-01-08', '2026-01-12', '2026-01-12 01:42:52', 2, 1, '2026-01-07 01:42:52', NOW(), NOW()),
-- Task 85 (DONE)
(235, 85, 2, 'task_list', 'store', 'Kiểm tra van gas', 'Kiểm tra van gas bếp', 3, 5, 1, 9, 9, 9, 'urgent', '2026-01-16', '2026-01-18', '2026-01-18 01:42:52', 1, 1, '2026-01-15 01:42:52', NOW(), NOW()),
-- Task 86 (OVERDUE)
(236, 86, 2, 'task_list', 'store', 'Phân loại hàng tồn', 'Phân loại hàng tồn kho', 1, 6, 1, 7, 7, 10, 'high', '2026-01-14', '2026-01-18', NULL, 1, 1, '2026-01-13 01:42:52', NOW(), NOW()),
-- Task 87 (OVERDUE)
(237, 87, 2, 'task_list', 'store', 'Kiểm tra gas máy lạnh', 'Kiểm tra gas máy lạnh', 3, 5, 4, 9, NULL, 10, 'urgent', '2026-01-16', '2026-01-20', NULL, 2, 1, '2026-01-15 01:42:52', NOW(), NOW()),
-- Task 88 (OVERDUE)
(238, 88, 2, 'task_list', 'store', 'Lau cửa kính khu D', 'Lau cửa kính khu D', 2, 4, 1, 7, 7, 10, 'normal', '2026-01-17', '2026-01-21', NULL, 1, 1, '2026-01-16 01:42:52', NOW(), NOW()),
-- Task 89 (OVERDUE)
(239, 89, 2, 'task_list', 'store', 'In tag giá Fresh', 'In tag giá khu Fresh', 1, 4, 1, 10, 10, 10, 'high', '2026-01-18', '2026-01-21', NULL, 2, 1, '2026-01-17 01:42:52', NOW(), NOW()),
-- Task 90 (OVERDUE)
(240, 90, 2, 'task_list', 'store', 'Lập danh sách NV', 'Lập danh sách nhân viên tuần', 1, 6, 3, 4, NULL, 10, 'normal', '2026-01-15', '2026-01-19', NULL, 1, 1, '2026-01-14 01:42:52', NOW(), NOW());

-- Summary: Added 131 new subtasks (IDs 110-240)
-- Total tasks now: 109 + 131 = 240
-- Coverage: All 90 parent tasks now have at least 1 subtask = 100% coverage
-- Task 18 has full 5-level hierarchy (21 subtasks total including all levels)

SELECT
    'Subtasks added successfully!' AS message,
    COUNT(*) AS total_tasks,
    SUM(CASE WHEN parent_task_id IS NULL THEN 1 ELSE 0 END) AS parent_tasks,
    SUM(CASE WHEN parent_task_id IS NOT NULL THEN 1 ELSE 0 END) AS subtasks
FROM tasks;
