-- ============================================
-- File: 05_insert_daily_schedule_tasks.sql
-- Purpose: Insert daily schedule tasks for store 1
-- Staff data from 03_insert_staff.sql:
--   staff_id=1: Vo Minh Tuan (STORE_LEADER_G3) - Ca sang
--   staff_id=2: Dang Thu Ha (STAFF) - Ca sang
--   staff_id=3: Hoang Xuan Kien (STAFF) - Ca sang
--   staff_id=4: Bui Thi Lan (STAFF) - Ca sang
--   staff_id=5: Le Quoc Phong (STAFF) - Ca chieu
--   staff_id=6: Tran Ngoc Hanh (STAFF) - Ca chieu
--   staff_id=7: Pham Duc Anh (STAFF) - Ca chieu
--   staff_id=8: Vo Phuong Chi (STAFF) - Ca chieu
--
-- Ca sang: 06:00-14:00 (Staff 1,2,3,4)
-- Ca chieu: 14:30-22:30 (Staff 5,6,7,8)
-- ============================================

-- Clear existing tasks for store 1 today
DELETE FROM daily_schedule_tasks
WHERE store_id = 1
  AND schedule_date = CURRENT_DATE;

-- ============================================
-- CA SANG (06:00-14:00) - Staff 1,2,3,4
-- ============================================

-- Staff 1 - Vo Minh Tuan (STORE_LEADER) - LEADER tasks
INSERT INTO daily_schedule_tasks (staff_id, store_id, schedule_date, group_id, task_code, task_name, start_time, end_time, status, created_at, updated_at) VALUES
(1, 1, CURRENT_DATE, 'LEADER', '1501', 'Mo kho', '06:00:00', '06:15:00', 'pending', NOW(), NOW()),
(1, 1, CURRENT_DATE, 'LEADER', '1505', 'Balancing', '06:15:00', '06:30:00', 'pending', NOW(), NOW()),
(1, 1, CURRENT_DATE, 'POS', '0101', 'Mo POS', '06:30:00', '06:45:00', 'pending', NOW(), NOW()),
(1, 1, CURRENT_DATE, 'POS', '0102', 'Check POS', '06:45:00', '07:00:00', 'pending', NOW(), NOW()),
(1, 1, CURRENT_DATE, 'LEADER', '1506', 'Kiem tra hang', '07:00:00', '07:15:00', 'pending', NOW(), NOW()),
(1, 1, CURRENT_DATE, 'LEADER', '1507', 'Duyet don', '07:15:00', '07:30:00', 'pending', NOW(), NOW()),
(1, 1, CURRENT_DATE, 'LEADER', '1508', 'Giao viec', '07:30:00', '07:45:00', 'pending', NOW(), NOW()),
(1, 1, CURRENT_DATE, 'POS', '0103', 'Ho tro POS', '07:45:00', '08:00:00', 'pending', NOW(), NOW()),
(1, 1, CURRENT_DATE, 'LEADER', '1509', 'Meeting sang', '08:00:00', '08:15:00', 'pending', NOW(), NOW()),
(1, 1, CURRENT_DATE, 'POS', '0104', 'Doi soat tien', '08:15:00', '08:30:00', 'pending', NOW(), NOW()),
(1, 1, CURRENT_DATE, 'POS', '0105', 'In bao cao', '08:30:00', '08:45:00', 'pending', NOW(), NOW()),
(1, 1, CURRENT_DATE, 'POS', '0106', 'Kiem ke POS', '08:45:00', '09:00:00', 'pending', NOW(), NOW()),
(1, 1, CURRENT_DATE, 'QC-FSH', '0801', 'Cleaning Time', '09:00:00', '09:15:00', 'pending', NOW(), NOW()),
(1, 1, CURRENT_DATE, 'QC-FSH', '0802', 'Kiem tra VSC', '09:15:00', '09:30:00', 'pending', NOW(), NOW()),
(1, 1, CURRENT_DATE, 'QC-FSH', '0803', 'Ve sinh khu POS', '09:30:00', '09:45:00', 'pending', NOW(), NOW()),
(1, 1, CURRENT_DATE, 'LEADER', '1510', 'Ban giao tien', '09:45:00', '10:00:00', 'pending', NOW(), NOW()),
(1, 1, CURRENT_DATE, 'LEADER', '1511', 'Kiem tra OOS', '10:00:00', '10:15:00', 'pending', NOW(), NOW()),
(1, 1, CURRENT_DATE, 'LEADER', '1512', 'Duyet khuyen mai', '10:15:00', '10:30:00', 'pending', NOW(), NOW()),
(1, 1, CURRENT_DATE, 'POS', '0107', 'Doi tien le', '10:30:00', '10:45:00', 'pending', NOW(), NOW()),
(1, 1, CURRENT_DATE, 'POS', '0108', 'Check voucher', '10:45:00', '11:00:00', 'pending', NOW(), NOW()),
(1, 1, CURRENT_DATE, 'POS', '0109', 'Phuc vu khach', '11:00:00', '11:15:00', 'pending', NOW(), NOW()),
(1, 1, CURRENT_DATE, 'POS', '0110', 'Ho tro thanh toan', '11:15:00', '11:30:00', 'pending', NOW(), NOW()),
(1, 1, CURRENT_DATE, 'POS', '0111', 'Xu ly khieu nai', '11:30:00', '11:45:00', 'pending', NOW(), NOW()),
(1, 1, CURRENT_DATE, 'LEADER', '1513', 'Giam sat', '11:45:00', '12:00:00', 'pending', NOW(), NOW()),
(1, 1, CURRENT_DATE, 'OTHER', '1005', 'Break Time', '12:00:00', '12:15:00', 'pending', NOW(), NOW()),
(1, 1, CURRENT_DATE, 'OTHER', '1006', 'Break Time', '12:15:00', '12:30:00', 'pending', NOW(), NOW()),
(1, 1, CURRENT_DATE, 'OTHER', '1007', 'Break Time', '12:30:00', '12:45:00', 'pending', NOW(), NOW()),
(1, 1, CURRENT_DATE, 'OTHER', '1008', 'Break Time', '12:45:00', '13:00:00', 'pending', NOW(), NOW()),
(1, 1, CURRENT_DATE, 'LEADER', '1514', 'Chuan bi ban giao', '13:00:00', '13:15:00', 'pending', NOW(), NOW()),
(1, 1, CURRENT_DATE, 'LEADER', '1515', 'Dong kho', '13:15:00', '13:30:00', 'pending', NOW(), NOW()),
(1, 1, CURRENT_DATE, 'POS', '0112', 'Kiem POS cuoi ca', '13:30:00', '13:45:00', 'pending', NOW(), NOW()),
(1, 1, CURRENT_DATE, 'LEADER', '1516', 'Ban giao ca', '13:45:00', '14:00:00', 'pending', NOW(), NOW());

-- Staff 2 - Dang Thu Ha - PERI tasks
INSERT INTO daily_schedule_tasks (staff_id, store_id, schedule_date, group_id, task_code, task_name, start_time, end_time, status, created_at, updated_at) VALUES
(2, 1, CURRENT_DATE, 'PERI', '0201', 'Len thit ca', '06:00:00', '06:15:00', 'pending', NOW(), NOW()),
(2, 1, CURRENT_DATE, 'PERI', '0202', 'Len rau cu', '06:15:00', '06:30:00', 'pending', NOW(), NOW()),
(2, 1, CURRENT_DATE, 'PERI', '0203', 'Sap xep ke', '06:30:00', '06:45:00', 'pending', NOW(), NOW()),
(2, 1, CURRENT_DATE, 'PERI', '0204', 'Kiem HSD', '06:45:00', '07:00:00', 'pending', NOW(), NOW()),
(2, 1, CURRENT_DATE, 'PERI', '0205', 'Cat got rau', '07:00:00', '07:15:00', 'pending', NOW(), NOW()),
(2, 1, CURRENT_DATE, 'PERI', '0206', 'Dong goi thit', '07:15:00', '07:30:00', 'pending', NOW(), NOW()),
(2, 1, CURRENT_DATE, 'PERI', '0207', 'Can dong goi', '07:30:00', '07:45:00', 'pending', NOW(), NOW()),
(2, 1, CURRENT_DATE, 'PERI', '0208', 'Dan nhan gia', '07:45:00', '08:00:00', 'pending', NOW(), NOW()),
(2, 1, CURRENT_DATE, 'PERI', '0209', 'Bo sung ke', '08:00:00', '08:15:00', 'pending', NOW(), NOW()),
(2, 1, CURRENT_DATE, 'PERI', '0210', 'Giam gia Peri', '08:15:00', '08:30:00', 'pending', NOW(), NOW()),
(2, 1, CURRENT_DATE, 'PERI', '0211', 'Xoay ke FIFO', '08:30:00', '08:45:00', 'pending', NOW(), NOW()),
(2, 1, CURRENT_DATE, 'PERI', '0212', 'Check nhiet do', '08:45:00', '09:00:00', 'pending', NOW(), NOW()),
(2, 1, CURRENT_DATE, 'QC-FSH', '0801', 'Cleaning Time', '09:00:00', '09:15:00', 'pending', NOW(), NOW()),
(2, 1, CURRENT_DATE, 'QC-FSH', '0804', 'Ve sinh ke Peri', '09:15:00', '09:30:00', 'pending', NOW(), NOW()),
(2, 1, CURRENT_DATE, 'PERI', '0213', 'Kiem kho Peri', '09:30:00', '09:45:00', 'pending', NOW(), NOW()),
(2, 1, CURRENT_DATE, 'PERI', '0214', 'Dat hang Peri', '09:45:00', '10:00:00', 'pending', NOW(), NOW()),
(2, 1, CURRENT_DATE, 'PERI', '0215', 'Xu ly hang hu', '10:00:00', '10:15:00', 'pending', NOW(), NOW()),
(2, 1, CURRENT_DATE, 'PERI', '0216', 'Cat got bo sung', '10:15:00', '10:30:00', 'pending', NOW(), NOW()),
(2, 1, CURRENT_DATE, 'PERI', '0217', 'Keo mat Peri', '10:30:00', '10:45:00', 'pending', NOW(), NOW()),
(2, 1, CURRENT_DATE, 'PERI', '0218', 'Check OOS Peri', '10:45:00', '11:00:00', 'pending', NOW(), NOW()),
(2, 1, CURRENT_DATE, 'PERI', '0219', 'Len hang trua', '11:00:00', '11:15:00', 'pending', NOW(), NOW()),
(2, 1, CURRENT_DATE, 'PERI', '0220', 'Bo sung salad', '11:15:00', '11:30:00', 'pending', NOW(), NOW()),
(2, 1, CURRENT_DATE, 'PERI', '0221', 'Kiem ke lanh', '11:30:00', '11:45:00', 'pending', NOW(), NOW()),
(2, 1, CURRENT_DATE, 'PERI', '0222', 'Chuan bi giam gia', '11:45:00', '12:00:00', 'pending', NOW(), NOW()),
(2, 1, CURRENT_DATE, 'OTHER', '1005', 'Break Time', '12:00:00', '12:15:00', 'pending', NOW(), NOW()),
(2, 1, CURRENT_DATE, 'OTHER', '1006', 'Break Time', '12:15:00', '12:30:00', 'pending', NOW(), NOW()),
(2, 1, CURRENT_DATE, 'OTHER', '1007', 'Break Time', '12:30:00', '12:45:00', 'pending', NOW(), NOW()),
(2, 1, CURRENT_DATE, 'OTHER', '1008', 'Break Time', '12:45:00', '13:00:00', 'pending', NOW(), NOW()),
(2, 1, CURRENT_DATE, 'PERI', '0223', 'Giam gia trua', '13:00:00', '13:15:00', 'pending', NOW(), NOW()),
(2, 1, CURRENT_DATE, 'PERI', '0224', 'Kiem hang ton', '13:15:00', '13:30:00', 'pending', NOW(), NOW()),
(2, 1, CURRENT_DATE, 'PERI', '0225', 'Ve sinh khu vuc', '13:30:00', '13:45:00', 'pending', NOW(), NOW()),
(2, 1, CURRENT_DATE, 'PERI', '0226', 'Ban giao Peri', '13:45:00', '14:00:00', 'pending', NOW(), NOW());

-- Staff 3 - Hoang Xuan Kien - DRY tasks
INSERT INTO daily_schedule_tasks (staff_id, store_id, schedule_date, group_id, task_code, task_name, start_time, end_time, status) VALUES
(3, 1, CURRENT_DATE, 'PERI', '0201', 'Len thit ca', '06:00:00', '06:15:00', 'pending'),
(3, 1, CURRENT_DATE, 'PERI', '0202', 'Len rau cu', '06:15:00', '06:30:00', 'pending'),
(3, 1, CURRENT_DATE, 'PERI', '0203', 'Sap xep ke', '06:30:00', '06:45:00', 'pending'),
(3, 1, CURRENT_DATE, 'PERI', '0204', 'Kiem HSD', '06:45:00', '07:00:00', 'pending'),
(3, 1, CURRENT_DATE, 'PERI', '0205', 'Cat got rau', '07:00:00', '07:15:00', 'pending'),
(3, 1, CURRENT_DATE, 'PERI', '0206', 'Dong goi thit', '07:15:00', '07:30:00', 'pending'),
(3, 1, CURRENT_DATE, 'PERI', '0207', 'Can dong goi', '07:30:00', '07:45:00', 'pending'),
(3, 1, CURRENT_DATE, 'PERI', '0208', 'Dan nhan gia', '07:45:00', '08:00:00', 'pending'),
(3, 1, CURRENT_DATE, 'PERI', '0209', 'Bo sung ke', '08:00:00', '08:15:00', 'pending'),
(3, 1, CURRENT_DATE, 'PERI', '0210', 'Giam gia Peri', '08:15:00', '08:30:00', 'pending'),
(3, 1, CURRENT_DATE, 'PERI', '0211', 'Xoay ke FIFO', '08:30:00', '08:45:00', 'pending'),
(3, 1, CURRENT_DATE, 'PERI', '0212', 'Check nhiet do', '08:45:00', '09:00:00', 'pending'),
(3, 1, CURRENT_DATE, 'QC-FSH', '0801', 'Cleaning Time', '09:00:00', '09:15:00', 'pending'),
(3, 1, CURRENT_DATE, 'QC-FSH', '0804', 'Ve sinh ke Peri', '09:15:00', '09:30:00', 'pending'),
(3, 1, CURRENT_DATE, 'PERI', '0213', 'Kiem kho Peri', '09:30:00', '09:45:00', 'pending'),
(3, 1, CURRENT_DATE, 'PERI', '0214', 'Dat hang Peri', '09:45:00', '10:00:00', 'pending'),
(3, 1, CURRENT_DATE, 'PERI', '0215', 'Xu ly hang hu', '10:00:00', '10:15:00', 'pending'),
(3, 1, CURRENT_DATE, 'PERI', '0216', 'Cat got bo sung', '10:15:00', '10:30:00', 'pending'),
(3, 1, CURRENT_DATE, 'PERI', '0217', 'Keo mat Peri', '10:30:00', '10:45:00', 'pending'),
(3, 1, CURRENT_DATE, 'PERI', '0218', 'Check OOS Peri', '10:45:00', '11:00:00', 'pending'),
(3, 1, CURRENT_DATE, 'PERI', '0219', 'Len hang trua', '11:00:00', '11:15:00', 'pending'),
(3, 1, CURRENT_DATE, 'PERI', '0220', 'Bo sung salad', '11:15:00', '11:30:00', 'pending'),
(3, 1, CURRENT_DATE, 'PERI', '0221', 'Kiem ke lanh', '11:30:00', '11:45:00', 'pending'),
(3, 1, CURRENT_DATE, 'PERI', '0222', 'Chuan bi giam gia', '11:45:00', '12:00:00', 'pending'),
(3, 1, CURRENT_DATE, 'OTHER', '1005', 'Break Time', '12:00:00', '12:15:00', 'pending'),
(3, 1, CURRENT_DATE, 'OTHER', '1006', 'Break Time', '12:15:00', '12:30:00', 'pending'),
(3, 1, CURRENT_DATE, 'OTHER', '1007', 'Break Time', '12:30:00', '12:45:00', 'pending'),
(3, 1, CURRENT_DATE, 'OTHER', '1008', 'Break Time', '12:45:00', '13:00:00', 'pending'),
(3, 1, CURRENT_DATE, 'PERI', '0223', 'Giam gia trua', '13:00:00', '13:15:00', 'pending'),
(3, 1, CURRENT_DATE, 'PERI', '0224', 'Kiem hang ton', '13:15:00', '13:30:00', 'pending'),
(3, 1, CURRENT_DATE, 'PERI', '0225', 'Ve sinh khu vuc', '13:30:00', '13:45:00', 'pending'),
(3, 1, CURRENT_DATE, 'PERI', '0226', 'Ban giao Peri', '13:45:00', '14:00:00', 'pending');

-- Staff 4 - Hoang Xuan Kien - DRY tasks
INSERT INTO daily_schedule_tasks (staff_id, store_id, schedule_date, group_id, task_code, task_name, start_time, end_time, status) VALUES
(4, 1, CURRENT_DATE, 'DRY', '0301', 'Len hang kho', '06:00:00', '06:15:00', 'pending'),
(4, 1, CURRENT_DATE, 'DRY', '0302', 'Keo mat Dry', '06:15:00', '06:30:00', 'pending'),
(4, 1, CURRENT_DATE, 'DRY', '0303', 'Sap xep ke', '06:30:00', '06:45:00', 'pending'),
(4, 1, CURRENT_DATE, 'DRY', '0304', 'Ban OOS', '06:45:00', '07:00:00', 'pending'),
(4, 1, CURRENT_DATE, 'DRY', '0305', 'Kiem HSD Dry', '07:00:00', '07:15:00', 'pending'),
(4, 1, CURRENT_DATE, 'DRY', '0306', 'Xoay FIFO', '07:15:00', '07:30:00', 'pending'),
(4, 1, CURRENT_DATE, 'DRY', '0307', 'Dan nhan', '07:30:00', '07:45:00', 'pending'),
(4, 1, CURRENT_DATE, 'DRY', '0308', 'Check gia', '07:45:00', '08:00:00', 'pending'),
(4, 1, CURRENT_DATE, 'DRY', '0309', 'Bo sung ke', '08:00:00', '08:15:00', 'pending'),
(4, 1, CURRENT_DATE, 'DRY', '0310', 'Kiem promo', '08:15:00', '08:30:00', 'pending'),
(4, 1, CURRENT_DATE, 'DRY', '0311', 'Sap xep endcap', '08:30:00', '08:45:00', 'pending'),
(4, 1, CURRENT_DATE, 'DRY', '0312', 'Ve sinh ke', '08:45:00', '09:00:00', 'pending'),
(4, 1, CURRENT_DATE, 'QC-FSH', '0801', 'Cleaning Time', '09:00:00', '09:15:00', 'pending'),
(4, 1, CURRENT_DATE, 'QC-FSH', '0805', 'Ve sinh khu Dry', '09:15:00', '09:30:00', 'pending'),
(4, 1, CURRENT_DATE, 'DRY', '0313', 'Kiem kho Dry', '09:30:00', '09:45:00', 'pending'),
(4, 1, CURRENT_DATE, 'DRY', '0314', 'Dat hang Dry', '09:45:00', '10:00:00', 'pending'),
(4, 1, CURRENT_DATE, 'DRY', '0315', 'Xu ly hang loi', '10:00:00', '10:15:00', 'pending'),
(4, 1, CURRENT_DATE, 'DRY', '0316', 'Keo mat lan 2', '10:15:00', '10:30:00', 'pending'),
(4, 1, CURRENT_DATE, 'DRY', '0317', 'Check OOS', '10:30:00', '10:45:00', 'pending'),
(4, 1, CURRENT_DATE, 'DRY', '0318', 'Cap nhat POG', '10:45:00', '11:00:00', 'pending'),
(4, 1, CURRENT_DATE, 'DRY', '0319', 'Bo sung snack', '11:00:00', '11:15:00', 'pending'),
(4, 1, CURRENT_DATE, 'DRY', '0320', 'Check nuoc uong', '11:15:00', '11:30:00', 'pending'),
(4, 1, CURRENT_DATE, 'DRY', '0321', 'Sap xep mi goi', '11:30:00', '11:45:00', 'pending'),
(4, 1, CURRENT_DATE, 'DRY', '0322', 'Kiem gia vi', '11:45:00', '12:00:00', 'pending'),
(4, 1, CURRENT_DATE, 'OTHER', '1005', 'Break Time', '12:00:00', '12:15:00', 'pending'),
(4, 1, CURRENT_DATE, 'OTHER', '1006', 'Break Time', '12:15:00', '12:30:00', 'pending'),
(4, 1, CURRENT_DATE, 'OTHER', '1007', 'Break Time', '12:30:00', '12:45:00', 'pending'),
(4, 1, CURRENT_DATE, 'OTHER', '1008', 'Break Time', '12:45:00', '13:00:00', 'pending'),
(4, 1, CURRENT_DATE, 'DRY', '0323', 'Keo mat cuoi', '13:00:00', '13:15:00', 'pending'),
(4, 1, CURRENT_DATE, 'DRY', '0324', 'Bao cao OOS', '13:15:00', '13:30:00', 'pending'),
(4, 1, CURRENT_DATE, 'DRY', '0325', 'Ve sinh khu vuc', '13:30:00', '13:45:00', 'pending'),
(4, 1, CURRENT_DATE, 'DRY', '0326', 'Ban giao Dry', '13:45:00', '14:00:00', 'pending');

-- Staff 5 - Bui Thi Lan - MMD tasks
INSERT INTO daily_schedule_tasks (staff_id, store_id, schedule_date, group_id, task_code, task_name, start_time, end_time, status) VALUES
(5, 1, CURRENT_DATE, 'MMD', '0401', 'Nhan hang Peri', '06:00:00', '06:15:00', 'pending'),
(5, 1, CURRENT_DATE, 'MMD', '0402', 'Kiem hang Peri', '06:15:00', '06:30:00', 'pending'),
(5, 1, CURRENT_DATE, 'MMD', '0403', 'Nhan hang RDC', '06:30:00', '06:45:00', 'pending'),
(5, 1, CURRENT_DATE, 'MMD', '0404', 'Kiem hang RDC', '06:45:00', '07:00:00', 'pending'),
(5, 1, CURRENT_DATE, 'MMD', '0405', 'Nhan hang D&D', '07:00:00', '07:15:00', 'pending'),
(5, 1, CURRENT_DATE, 'MMD', '0406', 'Phan loai hang', '07:15:00', '07:30:00', 'pending'),
(5, 1, CURRENT_DATE, 'MMD', '0407', 'Nhap kho', '07:30:00', '07:45:00', 'pending'),
(5, 1, CURRENT_DATE, 'MMD', '0408', 'Cap nhat ton', '07:45:00', '08:00:00', 'pending'),
(5, 1, CURRENT_DATE, 'MMD', '0409', 'Xu ly hang tra', '08:00:00', '08:15:00', 'pending'),
(5, 1, CURRENT_DATE, 'MMD', '0410', 'Kiem DC', '08:15:00', '08:30:00', 'pending'),
(5, 1, CURRENT_DATE, 'MMD', '0411', 'Bao cao nhap', '08:30:00', '08:45:00', 'pending'),
(5, 1, CURRENT_DATE, 'MMD', '0412', 'Sap xep kho', '08:45:00', '09:00:00', 'pending'),
(5, 1, CURRENT_DATE, 'QC-FSH', '0801', 'Cleaning Time', '09:00:00', '09:15:00', 'pending'),
(5, 1, CURRENT_DATE, 'QC-FSH', '0806', 'Ve sinh kho', '09:15:00', '09:30:00', 'pending'),
(5, 1, CURRENT_DATE, 'MMD', '0413', 'Kiem kho MMD', '09:30:00', '09:45:00', 'pending'),
(5, 1, CURRENT_DATE, 'MMD', '0414', 'Nhan hang bo sung', '09:45:00', '10:00:00', 'pending'),
(5, 1, CURRENT_DATE, 'MMD', '0415', 'Xu ly claim', '10:00:00', '10:15:00', 'pending'),
(5, 1, CURRENT_DATE, 'MMD', '0416', 'Kiem HSD kho', '10:15:00', '10:30:00', 'pending'),
(5, 1, CURRENT_DATE, 'MMD', '0417', 'Chuan bi xuat', '10:30:00', '10:45:00', 'pending'),
(5, 1, CURRENT_DATE, 'MMD', '0418', 'Nhan hang RDC 2', '10:45:00', '11:00:00', 'pending'),
(5, 1, CURRENT_DATE, 'MMD', '0419', 'Kiem hang RDC 2', '11:00:00', '11:15:00', 'pending'),
(5, 1, CURRENT_DATE, 'MMD', '0420', 'Phan loai RDC', '11:15:00', '11:30:00', 'pending'),
(5, 1, CURRENT_DATE, 'MMD', '0421', 'Nhap kho bo sung', '11:30:00', '11:45:00', 'pending'),
(5, 1, CURRENT_DATE, 'MMD', '0422', 'Cap nhat he thong', '11:45:00', '12:00:00', 'pending'),
(5, 1, CURRENT_DATE, 'OTHER', '1005', 'Break Time', '12:00:00', '12:15:00', 'pending'),
(5, 1, CURRENT_DATE, 'OTHER', '1006', 'Break Time', '12:15:00', '12:30:00', 'pending'),
(5, 1, CURRENT_DATE, 'OTHER', '1007', 'Break Time', '12:30:00', '12:45:00', 'pending'),
(5, 1, CURRENT_DATE, 'OTHER', '1008', 'Break Time', '12:45:00', '13:00:00', 'pending'),
(5, 1, CURRENT_DATE, 'MMD', '0423', 'Bao cao ton kho', '13:00:00', '13:15:00', 'pending'),
(5, 1, CURRENT_DATE, 'MMD', '0424', 'Kiem hang cho', '13:15:00', '13:30:00', 'pending'),
(5, 1, CURRENT_DATE, 'MMD', '0425', 'Ve sinh khu MMD', '13:30:00', '13:45:00', 'pending'),
(5, 1, CURRENT_DATE, 'MMD', '0426', 'Ban giao MMD', '13:45:00', '14:00:00', 'pending');

-- ============================================
-- CA CHIEU (14:30-22:30) - Staff 6,7,8
-- ============================================

-- Staff 6 - Le Quoc Phong - LEADER chieu
INSERT INTO daily_schedule_tasks (staff_id, store_id, schedule_date, group_id, task_code, task_name, start_time, end_time, status) VALUES
(6, 1, CURRENT_DATE, 'LEADER', '2501', 'Nhan ban giao', '14:30:00', '14:45:00', 'pending'),
(6, 1, CURRENT_DATE, 'LEADER', '2502', 'Kiem tra ca', '14:45:00', '15:00:00', 'pending'),
(6, 1, CURRENT_DATE, 'LEADER', '2503', 'Check hang OOS', '15:00:00', '15:15:00', 'pending'),
(6, 1, CURRENT_DATE, 'LEADER', '2504', 'Duyet giam gia', '15:15:00', '15:30:00', 'pending'),
(6, 1, CURRENT_DATE, 'LEADER', '2505', 'Giam sat san', '15:30:00', '15:45:00', 'pending'),
(6, 1, CURRENT_DATE, 'POS', '0113', 'Ho tro POS', '15:45:00', '16:00:00', 'pending'),
(6, 1, CURRENT_DATE, 'LEADER', '2506', 'Kiem promo', '16:00:00', '16:15:00', 'pending'),
(6, 1, CURRENT_DATE, 'POS', '0114', 'Check tien POS', '16:15:00', '16:30:00', 'pending'),
(6, 1, CURRENT_DATE, 'POS', '0115', 'Doi tien le', '16:30:00', '16:45:00', 'pending'),
(6, 1, CURRENT_DATE, 'LEADER', '2507', 'Meeting chieu', '16:45:00', '17:00:00', 'pending'),
(6, 1, CURRENT_DATE, 'POS', '0116', 'Ho tro thanh toan', '17:00:00', '17:15:00', 'pending'),
(6, 1, CURRENT_DATE, 'POS', '0117', 'Phuc vu khach', '17:15:00', '17:30:00', 'pending'),
(6, 1, CURRENT_DATE, 'LEADER', '2508', 'Giam sat POS', '17:30:00', '17:45:00', 'pending'),
(6, 1, CURRENT_DATE, 'POS', '0118', 'Xu ly khieu nai', '17:45:00', '18:00:00', 'pending'),
(6, 1, CURRENT_DATE, 'LEADER', '2509', 'Dieu phoi nhan luc', '18:00:00', '18:15:00', 'pending'),
(6, 1, CURRENT_DATE, 'POS', '0119', 'Ho tro POS peak', '18:15:00', '18:30:00', 'pending'),
(6, 1, CURRENT_DATE, 'POS', '0120', 'Check queue', '18:30:00', '18:45:00', 'pending'),
(6, 1, CURRENT_DATE, 'LEADER', '2510', 'Kiem tra san', '18:45:00', '19:00:00', 'pending'),
(6, 1, CURRENT_DATE, 'POS', '0121', 'Doi soat tien', '19:00:00', '19:15:00', 'pending'),
(6, 1, CURRENT_DATE, 'LEADER', '2511', 'Duyet giam gia toi', '19:15:00', '19:30:00', 'pending'),
(6, 1, CURRENT_DATE, 'QC-FSH', '0807', 'Cleaning toi', '19:30:00', '19:45:00', 'pending'),
(6, 1, CURRENT_DATE, 'LEADER', '2512', 'Kiem VSC', '19:45:00', '20:00:00', 'pending'),
(6, 1, CURRENT_DATE, 'OTHER', '1005', 'Break Time', '20:00:00', '20:15:00', 'pending'),
(6, 1, CURRENT_DATE, 'OTHER', '1006', 'Break Time', '20:15:00', '20:30:00', 'pending'),
(6, 1, CURRENT_DATE, 'OTHER', '1007', 'Break Time', '20:30:00', '20:45:00', 'pending'),
(6, 1, CURRENT_DATE, 'OTHER', '1008', 'Break Time', '20:45:00', '21:00:00', 'pending'),
(6, 1, CURRENT_DATE, 'LEADER', '2513', 'Chuan bi dong cua', '21:00:00', '21:15:00', 'pending'),
(6, 1, CURRENT_DATE, 'POS', '0122', 'Dem tien cuoi', '21:15:00', '21:30:00', 'pending'),
(6, 1, CURRENT_DATE, 'LEADER', '2514', 'Kiem tra kho', '21:30:00', '21:45:00', 'pending'),
(6, 1, CURRENT_DATE, 'LEADER', '2515', 'Bao cao ngay', '21:45:00', '22:00:00', 'pending'),
(6, 1, CURRENT_DATE, 'POS', '0123', 'Dong POS', '22:00:00', '22:15:00', 'pending'),
(6, 1, CURRENT_DATE, 'LEADER', '2516', 'Dong kho', '22:15:00', '22:30:00', 'pending');

-- Staff 7 - Tran Ngoc Hanh - PERI chieu
INSERT INTO daily_schedule_tasks (staff_id, store_id, schedule_date, group_id, task_code, task_name, start_time, end_time, status) VALUES
(7, 1, CURRENT_DATE, 'PERI', '0227', 'Nhan ban giao Peri', '14:30:00', '14:45:00', 'pending'),
(7, 1, CURRENT_DATE, 'PERI', '0228', 'Kiem hang Peri', '14:45:00', '15:00:00', 'pending'),
(7, 1, CURRENT_DATE, 'PERI', '0229', 'Bo sung ke chieu', '15:00:00', '15:15:00', 'pending'),
(7, 1, CURRENT_DATE, 'PERI', '0230', 'Keo mat Peri', '15:15:00', '15:30:00', 'pending'),
(7, 1, CURRENT_DATE, 'PERI', '0231', 'Cat got chieu', '15:30:00', '15:45:00', 'pending'),
(7, 1, CURRENT_DATE, 'PERI', '0232', 'Dong goi thit', '15:45:00', '16:00:00', 'pending'),
(7, 1, CURRENT_DATE, 'PERI', '0233', 'Kiem HSD', '16:00:00', '16:15:00', 'pending'),
(7, 1, CURRENT_DATE, 'PERI', '0234', 'Chuan bi giam gia', '16:15:00', '16:30:00', 'pending'),
(7, 1, CURRENT_DATE, 'PERI', '0235', 'Dan sticker giam', '16:30:00', '16:45:00', 'pending'),
(7, 1, CURRENT_DATE, 'PERI', '0236', 'Xoay FIFO', '16:45:00', '17:00:00', 'pending'),
(7, 1, CURRENT_DATE, 'PERI', '0237', 'Bo sung peak', '17:00:00', '17:15:00', 'pending'),
(7, 1, CURRENT_DATE, 'PERI', '0238', 'Keo mat peak', '17:15:00', '17:30:00', 'pending'),
(7, 1, CURRENT_DATE, 'PERI', '0239', 'Check OOS', '17:30:00', '17:45:00', 'pending'),
(7, 1, CURRENT_DATE, 'PERI', '0240', 'Cat got bo sung', '17:45:00', '18:00:00', 'pending'),
(7, 1, CURRENT_DATE, 'PERI', '0241', 'Bo sung salad', '18:00:00', '18:15:00', 'pending'),
(7, 1, CURRENT_DATE, 'PERI', '0242', 'Kiem nhiet do', '18:15:00', '18:30:00', 'pending'),
(7, 1, CURRENT_DATE, 'PERI', '0243', 'Xu ly hang hu', '18:30:00', '18:45:00', 'pending'),
(7, 1, CURRENT_DATE, 'PERI', '0244', 'Keo mat toi', '18:45:00', '19:00:00', 'pending'),
(7, 1, CURRENT_DATE, 'PERI', '0245', 'Giam gia toi 30%', '19:00:00', '19:15:00', 'pending'),
(7, 1, CURRENT_DATE, 'PERI', '0246', 'Giam gia toi 50%', '19:15:00', '19:30:00', 'pending'),
(7, 1, CURRENT_DATE, 'QC-FSH', '0808', 'Ve sinh ke Peri', '19:30:00', '19:45:00', 'pending'),
(7, 1, CURRENT_DATE, 'PERI', '0247', 'Thu don hang', '19:45:00', '20:00:00', 'pending'),
(7, 1, CURRENT_DATE, 'OTHER', '1005', 'Break Time', '20:00:00', '20:15:00', 'pending'),
(7, 1, CURRENT_DATE, 'OTHER', '1006', 'Break Time', '20:15:00', '20:30:00', 'pending'),
(7, 1, CURRENT_DATE, 'OTHER', '1007', 'Break Time', '20:30:00', '20:45:00', 'pending'),
(7, 1, CURRENT_DATE, 'OTHER', '1008', 'Break Time', '20:45:00', '21:00:00', 'pending'),
(7, 1, CURRENT_DATE, 'PERI', '0248', 'Thu hang cuoi', '21:00:00', '21:15:00', 'pending'),
(7, 1, CURRENT_DATE, 'PERI', '0249', 'Kiem kho toi', '21:15:00', '21:30:00', 'pending'),
(7, 1, CURRENT_DATE, 'PERI', '0250', 'Ve sinh khu vuc', '21:30:00', '21:45:00', 'pending'),
(7, 1, CURRENT_DATE, 'PERI', '0251', 'Bao cao Peri', '21:45:00', '22:00:00', 'pending'),
(7, 1, CURRENT_DATE, 'PERI', '0252', 'Dong ke lanh', '22:00:00', '22:15:00', 'pending'),
(7, 1, CURRENT_DATE, 'PERI', '0253', 'Ban giao cuoi', '22:15:00', '22:30:00', 'pending');

-- Staff 8 - Pham Duc Anh - DRY/DELICA chieu
INSERT INTO daily_schedule_tasks (staff_id, store_id, schedule_date, group_id, task_code, task_name, start_time, end_time, status) VALUES
(8, 1, CURRENT_DATE, 'DRY', '0327', 'Nhan ban giao Dry', '14:30:00', '14:45:00', 'pending'),
(8, 1, CURRENT_DATE, 'DRY', '0328', 'Kiem OOS Dry', '14:45:00', '15:00:00', 'pending'),
(8, 1, CURRENT_DATE, 'DRY', '0329', 'Bo sung ke chieu', '15:00:00', '15:15:00', 'pending'),
(8, 1, CURRENT_DATE, 'DRY', '0330', 'Keo mat Dry', '15:15:00', '15:30:00', 'pending'),
(8, 1, CURRENT_DATE, 'DRY', '0331', 'Check promo', '15:30:00', '15:45:00', 'pending'),
(8, 1, CURRENT_DATE, 'DRY', '0332', 'Sap xep endcap', '15:45:00', '16:00:00', 'pending'),
(8, 1, CURRENT_DATE, 'DRY', '0333', 'Kiem HSD', '16:00:00', '16:15:00', 'pending'),
(8, 1, CURRENT_DATE, 'DRY', '0334', 'Bo sung snack', '16:15:00', '16:30:00', 'pending'),
(8, 1, CURRENT_DATE, 'DRY', '0335', 'Check nuoc uong', '16:30:00', '16:45:00', 'pending'),
(8, 1, CURRENT_DATE, 'DRY', '0336', 'Xoay FIFO', '16:45:00', '17:00:00', 'pending'),
(8, 1, CURRENT_DATE, 'DRY', '0337', 'Bo sung peak', '17:00:00', '17:15:00', 'pending'),
(8, 1, CURRENT_DATE, 'DRY', '0338', 'Keo mat peak', '17:15:00', '17:30:00', 'pending'),
(8, 1, CURRENT_DATE, 'DRY', '0339', 'Check OOS peak', '17:30:00', '17:45:00', 'pending'),
(8, 1, CURRENT_DATE, 'DRY', '0340', 'Sap xep gondola', '17:45:00', '18:00:00', 'pending'),
(8, 1, CURRENT_DATE, 'DRY', '0341', 'Bo sung mi goi', '18:00:00', '18:15:00', 'pending'),
(8, 1, CURRENT_DATE, 'DRY', '0342', 'Check gia vi', '18:15:00', '18:30:00', 'pending'),
(8, 1, CURRENT_DATE, 'DRY', '0343', 'Kiem banh keo', '18:30:00', '18:45:00', 'pending'),
(8, 1, CURRENT_DATE, 'DRY', '0344', 'Keo mat toi', '18:45:00', '19:00:00', 'pending'),
(8, 1, CURRENT_DATE, 'DRY', '0345', 'Giam gia HSD', '19:00:00', '19:15:00', 'pending'),
(8, 1, CURRENT_DATE, 'DRY', '0346', 'Thu don hang', '19:15:00', '19:30:00', 'pending'),
(8, 1, CURRENT_DATE, 'QC-FSH', '0809', 'Ve sinh ke Dry', '19:30:00', '19:45:00', 'pending'),
(8, 1, CURRENT_DATE, 'DRY', '0347', 'Kiem kho Dry', '19:45:00', '20:00:00', 'pending'),
(8, 1, CURRENT_DATE, 'OTHER', '1005', 'Break Time', '20:00:00', '20:15:00', 'pending'),
(8, 1, CURRENT_DATE, 'OTHER', '1006', 'Break Time', '20:15:00', '20:30:00', 'pending'),
(8, 1, CURRENT_DATE, 'OTHER', '1007', 'Break Time', '20:30:00', '20:45:00', 'pending'),
(8, 1, CURRENT_DATE, 'OTHER', '1008', 'Break Time', '20:45:00', '21:00:00', 'pending'),
(8, 1, CURRENT_DATE, 'DRY', '0348', 'Keo mat cuoi', '21:00:00', '21:15:00', 'pending'),
(8, 1, CURRENT_DATE, 'DRY', '0349', 'Bao cao OOS', '21:15:00', '21:30:00', 'pending'),
(8, 1, CURRENT_DATE, 'DRY', '0350', 'Ve sinh khu vuc', '21:30:00', '21:45:00', 'pending'),
(8, 1, CURRENT_DATE, 'DRY', '0351', 'Bao cao Dry', '21:45:00', '22:00:00', 'pending'),
(8, 1, CURRENT_DATE, 'DRY', '0352', 'Kiem tra cuoi', '22:00:00', '22:15:00', 'pending'),
(8, 1, CURRENT_DATE, 'DRY', '0353', 'Ban giao cuoi', '22:15:00', '22:30:00', 'pending');

-- ============================================
-- Verify inserted data
-- ============================================
SELECT 'INSERTED TASKS SUMMARY' as info;
SELECT
    staff_id,
    COUNT(*) as task_count
FROM daily_schedule_tasks
WHERE store_id = 1 AND schedule_date = CURRENT_DATE
GROUP BY staff_id
ORDER BY staff_id;

SELECT 'SAMPLE TASKS' as info;
SELECT staff_id, start_time, task_code, task_name, group_id
FROM daily_schedule_tasks
WHERE store_id = 1 AND schedule_date = CURRENT_DATE
ORDER BY staff_id, start_time
LIMIT 10;
