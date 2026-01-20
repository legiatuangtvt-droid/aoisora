-- ============================================
-- THÊM 30 TASKS NỮA (đã có 28, cần thêm để đạt 50+)
-- ============================================

-- NOT_YET Tasks thêm (10 tasks) - status_id = 7
INSERT INTO tasks (task_name, task_description, source, task_type_id, response_type_id, dept_id, assigned_store_id, assigned_staff_id, status_id, priority, start_date, end_date, created_staff_id, approver_id, approved_at) VALUES
('Kiểm tra hệ thống nước', 'Kiểm tra hệ thống cấp nước trong store', 'task_list', 3, 5, 1, 1, 3, 7, 'normal', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 2 DAY), 1, 1, NOW()),
('Sắp xếp khu vực C', 'Sắp xếp lại kệ hàng khu vực C', 'task_list', 2, 4, 1, 2, 3, 7, 'normal', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 1 DAY), 2, 1, NOW()),
('Kiểm tra hàng tồn khu A', 'Kiểm tra và báo cáo hàng tồn khu A', 'task_list', 1, 5, 1, 1, 4, 7, 'high', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 1 DAY), 1, 1, NOW()),
('Vệ sinh khu thực phẩm tươi', 'Vệ sinh khu vực thực phẩm tươi sống', 'task_list', 2, 4, 1, 3, 3, 7, 'urgent', CURDATE(), CURDATE(), 2, 1, NOW()),
('Cập nhật bảng giá mới', 'Cập nhật bảng giá sản phẩm mới', 'task_list', 1, 4, 1, 1, 5, 7, 'normal', DATE_ADD(CURDATE(), INTERVAL 1 DAY), DATE_ADD(CURDATE(), INTERVAL 2 DAY), 1, 1, NOW()),
('Kiểm tra thiết bị làm lạnh', 'Kiểm tra tủ đông và tủ mát', 'task_list', 3, 5, 1, 2, 4, 7, 'high', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 1 DAY), 2, 1, NOW()),
('Nhận hàng từ kho trung tâm', 'Nhận và kiểm tra hàng từ kho', 'task_list', 1, 5, 1, 1, 5, 7, 'normal', DATE_ADD(CURDATE(), INTERVAL 1 DAY), DATE_ADD(CURDATE(), INTERVAL 1 DAY), 1, 1, NOW()),
('Báo cáo tình trạng kệ hàng', 'Báo cáo kệ hàng cần sửa chữa', 'task_list', 1, 6, 1, 3, 3, 7, 'normal', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 3 DAY), 2, 1, NOW()),
('Setup khu vực khuyến mãi mới', 'Thiết lập khu vực khuyến mãi đặc biệt', 'task_list', 2, 4, 1, 1, 3, 7, 'high', DATE_ADD(CURDATE(), INTERVAL 2 DAY), DATE_ADD(CURDATE(), INTERVAL 4 DAY), 1, 1, NOW()),
('Kiểm tra an ninh đêm', 'Kiểm tra camera và thiết bị an ninh', 'task_list', 3, 5, 1, 2, 4, 7, 'normal', DATE_ADD(CURDATE(), INTERVAL 1 DAY), DATE_ADD(CURDATE(), INTERVAL 2 DAY), 2, 1, NOW());

-- ON_PROGRESS Tasks thêm (10 tasks) - status_id = 8
INSERT INTO tasks (task_name, task_description, source, task_type_id, response_type_id, dept_id, assigned_store_id, assigned_staff_id, do_staff_id, status_id, priority, start_date, end_date, created_staff_id, approver_id, approved_at) VALUES
('Tổng vệ sinh cuối tuần', 'Vệ sinh toàn bộ cửa hàng', 'task_list', 2, 4, 1, 1, 3, 3, 8, 'high', DATE_SUB(CURDATE(), INTERVAL 1 DAY), DATE_ADD(CURDATE(), INTERVAL 1 DAY), 1, 1, DATE_SUB(NOW(), INTERVAL 2 DAY)),
('Kiểm kê hàng nhập mới', 'Kiểm kê lô hàng mới nhập', 'task_list', 1, 5, 1, 2, 4, 4, 8, 'normal', DATE_SUB(CURDATE(), INTERVAL 2 DAY), DATE_ADD(CURDATE(), INTERVAL 1 DAY), 2, 1, DATE_SUB(NOW(), INTERVAL 3 DAY)),
('Sắp xếp hàng theo FIFO', 'Sắp xếp lại hàng theo nguyên tắc FIFO', 'task_list', 2, 4, 1, 1, 5, 5, 8, 'high', DATE_SUB(CURDATE(), INTERVAL 1 DAY), CURDATE(), 1, 1, DATE_SUB(NOW(), INTERVAL 2 DAY)),
('Chuẩn bị khuyến mãi tuần mới', 'Setup chương trình KM tuần mới', 'task_list', 2, 4, 1, 3, 3, 3, 8, 'normal', DATE_SUB(CURDATE(), INTERVAL 2 DAY), DATE_ADD(CURDATE(), INTERVAL 2 DAY), 2, 1, DATE_SUB(NOW(), INTERVAL 3 DAY)),
('Kiểm tra chất lượng rau củ', 'Kiểm tra độ tươi rau củ quả', 'task_list', 3, 5, 1, 1, 4, 4, 8, 'urgent', CURDATE(), CURDATE(), 1, 1, NOW()),
('Báo cáo doanh số realtime', 'Cập nhật báo cáo doanh số', 'task_list', 1, 6, 2, 1, 5, 5, 8, 'normal', DATE_SUB(CURDATE(), INTERVAL 1 DAY), CURDATE(), 2, 1, DATE_SUB(NOW(), INTERVAL 2 DAY)),
('Kiểm tra hệ thống POS', 'Kiểm tra và test hệ thống POS', 'task_list', 3, 5, 4, 2, 4, 4, 8, 'high', DATE_SUB(CURDATE(), INTERVAL 1 DAY), DATE_ADD(CURDATE(), INTERVAL 1 DAY), 1, 1, DATE_SUB(NOW(), INTERVAL 2 DAY)),
('Vệ sinh khu vực khách hàng', 'Vệ sinh khu ngồi và toilet', 'task_list', 2, 4, 1, 1, 3, 3, 8, 'normal', DATE_SUB(CURDATE(), INTERVAL 2 DAY), CURDATE(), 2, 1, DATE_SUB(NOW(), INTERVAL 3 DAY)),
('Sắp xếp khu Delica', 'Sắp xếp khu bán đồ ăn sẵn', 'task_list', 2, 4, 1, 3, 3, 3, 8, 'normal', DATE_SUB(CURDATE(), INTERVAL 1 DAY), DATE_ADD(CURDATE(), INTERVAL 1 DAY), 1, 1, DATE_SUB(NOW(), INTERVAL 2 DAY)),
('Kiểm tra máy tính tiền', 'Kiểm tra hoạt động máy tính tiền', 'task_list', 3, 5, 4, 1, 4, 4, 8, 'high', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 1 DAY), 2, 1, NOW());

-- DONE Tasks thêm (5 tasks) - status_id = 9
INSERT INTO tasks (task_name, task_description, source, task_type_id, response_type_id, dept_id, assigned_store_id, assigned_staff_id, do_staff_id, status_id, priority, start_date, end_date, created_staff_id, approver_id, approved_at, completed_time) VALUES
('Kiểm kê hàng tháng 12 tuần 4', 'Kiểm kê hàng tuần 4 tháng 12', 'task_list', 1, 5, 1, 1, 3, 3, 9, 'high', DATE_SUB(CURDATE(), INTERVAL 12 DAY), DATE_SUB(CURDATE(), INTERVAL 9 DAY), 1, 1, DATE_SUB(NOW(), INTERVAL 13 DAY), DATE_SUB(NOW(), INTERVAL 9 DAY)),
('Vệ sinh kho cuối năm', 'Tổng vệ sinh kho trước năm mới', 'task_list', 2, 4, 1, 2, 3, 3, 9, 'normal', DATE_SUB(CURDATE(), INTERVAL 8 DAY), DATE_SUB(CURDATE(), INTERVAL 5 DAY), 2, 1, DATE_SUB(NOW(), INTERVAL 9 DAY), DATE_SUB(NOW(), INTERVAL 5 DAY)),
('Training an toàn thực phẩm', 'Đào tạo ATTP cho nhân viên', 'task_list', 3, 6, 3, 1, 2, 2, 9, 'high', DATE_SUB(CURDATE(), INTERVAL 10 DAY), DATE_SUB(CURDATE(), INTERVAL 7 DAY), 1, 1, DATE_SUB(NOW(), INTERVAL 11 DAY), DATE_SUB(NOW(), INTERVAL 7 DAY)),
('Báo cáo chi phí tháng 12', 'Báo cáo chi phí vận hành tháng 12', 'task_list', 1, 6, 2, 1, 5, 5, 9, 'normal', DATE_SUB(CURDATE(), INTERVAL 14 DAY), DATE_SUB(CURDATE(), INTERVAL 10 DAY), 2, 1, DATE_SUB(NOW(), INTERVAL 15 DAY), DATE_SUB(NOW(), INTERVAL 10 DAY)),
('Kiểm tra PCCC cuối năm', 'Kiểm tra thiết bị PCCC trước năm mới', 'task_list', 3, 5, 1, 3, 4, 4, 9, 'urgent', DATE_SUB(CURDATE(), INTERVAL 6 DAY), DATE_SUB(CURDATE(), INTERVAL 4 DAY), 1, 1, DATE_SUB(NOW(), INTERVAL 7 DAY), DATE_SUB(NOW(), INTERVAL 4 DAY));

-- OVERDUE Tasks thêm (5 tasks) - status_id = 10
INSERT INTO tasks (task_name, task_description, source, task_type_id, response_type_id, dept_id, assigned_store_id, assigned_staff_id, do_staff_id, status_id, priority, start_date, end_date, created_staff_id, approver_id, approved_at) VALUES
('Báo cáo tồn kho tuần trước', 'Báo cáo tồn kho chưa nộp', 'task_list', 1, 6, 1, 1, 3, 3, 10, 'high', DATE_SUB(CURDATE(), INTERVAL 8 DAY), DATE_SUB(CURDATE(), INTERVAL 4 DAY), 1, 1, DATE_SUB(NOW(), INTERVAL 9 DAY)),
('Kiểm tra máy lạnh khu B', 'Kiểm tra máy lạnh đã quá hạn', 'task_list', 3, 5, 4, 2, 4, NULL, 10, 'urgent', DATE_SUB(CURDATE(), INTERVAL 6 DAY), DATE_SUB(CURDATE(), INTERVAL 2 DAY), 2, 1, DATE_SUB(NOW(), INTERVAL 7 DAY)),
('Vệ sinh khu D quá hạn', 'Vệ sinh khu D chưa hoàn thành', 'task_list', 2, 4, 1, 1, 3, 3, 10, 'normal', DATE_SUB(CURDATE(), INTERVAL 5 DAY), DATE_SUB(CURDATE(), INTERVAL 1 DAY), 1, 1, DATE_SUB(NOW(), INTERVAL 6 DAY)),
('Cập nhật giá khu Fresh', 'Cập nhật giá chưa hoàn thành', 'task_list', 1, 4, 1, 3, 5, 5, 10, 'high', DATE_SUB(CURDATE(), INTERVAL 4 DAY), DATE_SUB(CURDATE(), INTERVAL 1 DAY), 2, 1, DATE_SUB(NOW(), INTERVAL 5 DAY)),
('Báo cáo nhân sự quá hạn', 'Báo cáo nhân sự tuần chưa nộp', 'task_list', 1, 6, 3, 1, 2, NULL, 10, 'normal', DATE_SUB(CURDATE(), INTERVAL 7 DAY), DATE_SUB(CURDATE(), INTERVAL 3 DAY), 1, 1, DATE_SUB(NOW(), INTERVAL 8 DAY));

SELECT 'Added 30 more tasks!' AS message;
SELECT COUNT(*) as total_tasks FROM tasks;
