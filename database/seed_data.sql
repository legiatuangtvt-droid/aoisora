-- ============================================
-- Aoisora Test Data
-- Database: PostgreSQL 15+
-- Created: 2025-12-31
-- ============================================
-- This file inserts test data for development
-- Data covers 1 week before to 1 week after current date
-- Run after schema.sql
-- ============================================

-- ============================================
-- CORE DATA: Regions
-- ============================================

INSERT INTO "regions" ("region_id", "region_name", "region_code", "description") VALUES
(1, 'Ha Noi', 'HN', 'Thu do Ha Noi'),
(2, 'Ho Chi Minh', 'HCM', 'Thanh pho Ho Chi Minh'),
(3, 'Da Nang', 'DN', 'Thanh pho Da Nang'),
(4, 'Hai Phong', 'HP', 'Thanh pho Hai Phong'),
(5, 'Can Tho', 'CT', 'Thanh pho Can Tho');

SELECT setval('regions_region_id_seq', 5);

-- ============================================
-- CORE DATA: Departments (Hierarchical Structure)
-- Display format: [sort_order]. [name] (e.g., "1. OP")
-- ============================================

-- SMBU (Head Office) - Root department
INSERT INTO "departments" ("department_id", "department_name", "department_code", "description", "parent_id", "sort_order", "icon", "icon_color", "icon_bg") VALUES
(100, 'SMBU (Head Office)', 'SMBU', 'Head Office - Strategic Management Business Unit', NULL, 0, 'building', '#C5055B', 'rgba(197, 5, 91, 0.1)');

-- Parent departments (Level 1 - under SMBU)
INSERT INTO "departments" ("department_id", "department_name", "department_code", "description", "parent_id", "sort_order", "icon", "icon_color", "icon_bg") VALUES
(1, 'OP', 'OP', 'Operations', 100, 1, 'op', '#0D9488', 'rgba(13, 148, 136, 0.1)'),
(2, 'Admin', 'ADMIN', 'Administration', 100, 2, 'admin', '#233D62', 'rgba(35, 61, 98, 0.1)'),
(3, 'Control', 'CONTROL', 'Quality Control', 100, 3, 'control', '#7C3AED', 'rgba(124, 58, 237, 0.1)'),
(4, 'Improvement', 'IMPROVEMENT', 'Process Improvement', 100, 4, 'improvement', '#2563EB', 'rgba(37, 99, 235, 0.1)'),
(5, 'Planning', 'PLANNING', 'Planning & MD', 100, 5, 'md', '#D97706', 'rgba(217, 119, 6, 0.1)'),
(6, 'HR', 'HR', 'Human Resources', 100, 6, 'hr', '#E11D48', 'rgba(225, 29, 72, 0.1)');

-- Child departments (Level 2 - under OP)
INSERT INTO "departments" ("department_id", "department_name", "department_code", "description", "parent_id", "sort_order") VALUES
(11, 'Perisable', 'PERI', 'Perishable goods', 1, 1),
(12, 'Grocery', 'GRO', 'Grocery department', 1, 2),
(13, 'Delica', 'DELICA', 'Delicatessen', 1, 3),
(14, 'D&D', 'DD', 'Deli & Dairy', 1, 4),
(15, 'CS', 'CS', 'Customer Service', 1, 5);

-- Child departments (Level 2 - under Admin)
INSERT INTO "departments" ("department_id", "department_name", "department_code", "description", "parent_id", "sort_order") VALUES
(21, 'Admin', 'ADMIN-SUB', 'Admin sub-department', 2, 1),
(22, 'MMD', 'MMD', 'Merchandising', 2, 2),
(23, 'ACC', 'ACC', 'Accounting', 2, 3);

-- Child departments (Level 2 - under Planning)
INSERT INTO "departments" ("department_id", "department_name", "department_code", "description", "parent_id", "sort_order") VALUES
(51, 'MKT', 'MKT', 'Marketing', 5, 1),
(52, 'SPA', 'SPA', 'Space Planning', 5, 2),
(53, 'ORD', 'ORD', 'Ordering', 5, 3);

SELECT setval('departments_department_id_seq', 100);

-- ============================================
-- CORE DATA: Teams (Sub-groups within departments)
-- ============================================

INSERT INTO "teams" ("team_id", "team_name", "department_id", "icon", "icon_color", "icon_bg", "sort_order") VALUES
-- Teams under Admin department (department_id = 2)
('account-team', 'Account Team', 2, 'users', '#003E95', '#E5F0FF', 1),
('qc-team', 'Quality Control', 2, 'shield', '#6B06B8', '#FDF0FF', 2),
-- Teams under OP department (department_id = 1)
('peri-team', 'Perishable Team', 1, 'leaf', '#059669', '#ECFDF5', 1),
('grocery-team', 'Grocery Team', 1, 'shopping-cart', '#2563EB', '#EFF6FF', 2),
-- Teams under Control department (department_id = 3)
('qc-control-team', 'QC Control Team', 3, 'check-circle', '#7C3AED', '#F5F3FF', 1),
-- Teams under Improvement department (department_id = 4)
('process-team', 'Process Team', 4, 'cog', '#2563EB', '#EFF6FF', 1),
('it-team', 'IT Team', 4, 'desktop', '#0891B2', '#ECFEFF', 2),
-- Teams under HR department (department_id = 6)
('recruit-team', 'Recruitment Team', 6, 'user-plus', '#E11D48', '#FFF1F2', 1),
('training-team', 'Training Team', 6, 'book', '#EA580C', '#FFF7ED', 2);

-- ============================================
-- CORE DATA: Stores (4 stores for testing)
-- ============================================

INSERT INTO "stores" ("store_id", "store_name", "store_code", "region_id", "address", "phone", "email", "status") VALUES
(1, 'Store Ha Dong', 'ST001', 1, '123 Ha Dong, Ha Noi', '024-1234-5678', 'hadong@aoisora.com', 'active'),
(2, 'Store Cau Giay', 'ST002', 1, '456 Cau Giay, Ha Noi', '024-2345-6789', 'caugiay@aoisora.com', 'active'),
(3, 'Store Thanh Xuan', 'ST003', 1, '789 Thanh Xuan, Ha Noi', '024-3456-7890', 'thanhxuan@aoisora.com', 'active'),
(4, 'Store Dong Da', 'ST004', 1, '321 Dong Da, Ha Noi', '024-4567-8901', 'dongda@aoisora.com', 'active');

SELECT setval('stores_store_id_seq', 4);

-- ============================================
-- CORE DATA: Staff (32 store staff + 52 SMBU staff = 84 total)
-- Password: password (bcrypt hashed)
-- ============================================

-- Store 1 Staff (staff_id 1-8)
INSERT INTO "staff" ("staff_id", "staff_name", "staff_code", "username", "email", "phone", "store_id", "department_id", "role", "position", "job_grade", "sap_code", "password_hash", "status") VALUES
(1, 'Nguyen Van A', 'NV001', 'admin', 'admin@aoisora.com', '0901234567', 1, 1, 'MANAGER', 'Store Manager', 'G5', 'SM01', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(2, 'Tran Thi B', 'NV002', 'leader1', 'leader1@aoisora.com', '0902345678', 1, 1, 'STORE_LEADER_G3', 'Store Leader', 'G3', 'SL01', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(3, 'Le Van C', 'NV003', 'staff1_1', 'staff1_1@aoisora.com', '0903456789', 1, 1, 'STAFF', 'Staff', 'G2', 'ST01', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(4, 'Pham Thi D', 'NV004', 'staff1_2', 'staff1_2@aoisora.com', '0904567890', 1, 1, 'STAFF', 'Staff', 'G2', 'ST02', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(5, 'Hoang Van E', 'NV005', 'staff1_3', 'staff1_3@aoisora.com', '0905678901', 1, 1, 'STAFF', 'Staff', 'G2', 'ST03', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(6, 'Nguyen Thi F', 'NV006', 'staff1_4', 'staff1_4@aoisora.com', '0906789012', 1, 1, 'STAFF', 'Staff', 'G2', 'ST04', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(7, 'Tran Van G', 'NV007', 'staff1_5', 'staff1_5@aoisora.com', '0907890123', 1, 1, 'STAFF', 'Staff', 'G2', 'ST05', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(8, 'Le Thi H', 'NV008', 'staff1_6', 'staff1_6@aoisora.com', '0908901234', 1, 1, 'STAFF', 'Staff', 'G2', 'ST06', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),

-- Store 2 Staff (staff_id 9-16)
(9, 'Pham Van I', 'NV009', 'manager2', 'manager2@aoisora.com', '0909012345', 2, 1, 'MANAGER', 'Store Manager', 'G5', 'SM02', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(10, 'Hoang Thi K', 'NV010', 'leader2', 'leader2@aoisora.com', '0910123456', 2, 1, 'STORE_LEADER_G3', 'Store Leader', 'G3', 'SL02', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(11, 'Nguyen Van L', 'NV011', 'staff2_1', 'staff2_1@aoisora.com', '0911234567', 2, 1, 'STAFF', 'Staff', 'G2', 'ST07', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(12, 'Tran Thi M', 'NV012', 'staff2_2', 'staff2_2@aoisora.com', '0912345678', 2, 1, 'STAFF', 'Staff', 'G2', 'ST08', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(13, 'Le Van N', 'NV013', 'staff2_3', 'staff2_3@aoisora.com', '0913456789', 2, 1, 'STAFF', 'Staff', 'G2', 'ST09', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(14, 'Pham Thi O', 'NV014', 'staff2_4', 'staff2_4@aoisora.com', '0914567890', 2, 1, 'STAFF', 'Staff', 'G2', 'ST10', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(15, 'Hoang Van P', 'NV015', 'staff2_5', 'staff2_5@aoisora.com', '0915678901', 2, 1, 'STAFF', 'Staff', 'G2', 'ST11', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(16, 'Nguyen Thi Q', 'NV016', 'staff2_6', 'staff2_6@aoisora.com', '0916789012', 2, 1, 'STAFF', 'Staff', 'G2', 'ST12', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),

-- Store 3 Staff (staff_id 17-24)
(17, 'Tran Van R', 'NV017', 'manager3', 'manager3@aoisora.com', '0917890123', 3, 1, 'MANAGER', 'Store Manager', 'G5', 'SM03', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(18, 'Le Thi S', 'NV018', 'leader3', 'leader3@aoisora.com', '0918901234', 3, 1, 'STORE_LEADER_G3', 'Store Leader', 'G3', 'SL03', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(19, 'Pham Van T', 'NV019', 'staff3_1', 'staff3_1@aoisora.com', '0919012345', 3, 1, 'STAFF', 'Staff', 'G2', 'ST13', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(20, 'Hoang Thi U', 'NV020', 'staff3_2', 'staff3_2@aoisora.com', '0920123456', 3, 1, 'STAFF', 'Staff', 'G2', 'ST14', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(21, 'Nguyen Van V', 'NV021', 'staff3_3', 'staff3_3@aoisora.com', '0921234567', 3, 1, 'STAFF', 'Staff', 'G2', 'ST15', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(22, 'Tran Thi W', 'NV022', 'staff3_4', 'staff3_4@aoisora.com', '0922345678', 3, 1, 'STAFF', 'Staff', 'G2', 'ST16', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(23, 'Le Van X', 'NV023', 'staff3_5', 'staff3_5@aoisora.com', '0923456789', 3, 1, 'STAFF', 'Staff', 'G2', 'ST17', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(24, 'Pham Thi Y', 'NV024', 'staff3_6', 'staff3_6@aoisora.com', '0924567890', 3, 1, 'STAFF', 'Staff', 'G2', 'ST18', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),

-- Store 4 Staff (staff_id 25-32)
(25, 'Hoang Van Z', 'NV025', 'manager4', 'manager4@aoisora.com', '0925678901', 4, 1, 'MANAGER', 'Store Manager', 'G5', 'SM04', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(26, 'Nguyen Thi AA', 'NV026', 'leader4', 'leader4@aoisora.com', '0926789012', 4, 1, 'STORE_LEADER_G3', 'Store Leader', 'G3', 'SL04', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(27, 'Tran Van AB', 'NV027', 'staff4_1', 'staff4_1@aoisora.com', '0927890123', 4, 1, 'STAFF', 'Staff', 'G2', 'ST19', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(28, 'Le Thi AC', 'NV028', 'staff4_2', 'staff4_2@aoisora.com', '0928901234', 4, 1, 'STAFF', 'Staff', 'G2', 'ST20', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(29, 'Pham Van AD', 'NV029', 'staff4_3', 'staff4_3@aoisora.com', '0929012345', 4, 1, 'STAFF', 'Staff', 'G2', 'ST21', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(30, 'Hoang Thi AE', 'NV030', 'staff4_4', 'staff4_4@aoisora.com', '0930123456', 4, 1, 'STAFF', 'Staff', 'G2', 'ST22', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(31, 'Nguyen Van AF', 'NV031', 'staff4_5', 'staff4_5@aoisora.com', '0931234567', 4, 1, 'STAFF', 'Staff', 'G2', 'ST23', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(32, 'Tran Thi AG', 'NV032', 'staff4_6', 'staff4_6@aoisora.com', '0932345678', 4, 1, 'STAFF', 'Staff', 'G2', 'ST24', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active');

-- ============================================
-- SMBU (Head Office) Staff - Based on mockUserInfo.ts
-- store_id = NULL for HQ staff
-- ============================================

-- SMBU Root User - General Manager (staff_id 100)
INSERT INTO "staff" ("staff_id", "staff_name", "staff_code", "username", "email", "phone", "store_id", "department_id", "team_id", "role", "position", "job_grade", "sap_code", "password_hash", "status") VALUES
(100, 'YOSHINAGA', 'SM001', 'yoshinaga', 'yoshinaga@aoisora.com', '0900000001', NULL, 100, NULL, 'GENERAL_MANAGER', 'General Manager', 'G6', 'SM GM', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active');

-- ADMIN Department Staff (department_id = 2)
-- Department Head
INSERT INTO "staff" ("staff_id", "staff_name", "staff_code", "username", "email", "phone", "store_id", "department_id", "team_id", "role", "position", "job_grade", "sap_code", "line_manager_id", "password_hash", "status") VALUES
(101, 'Do Thi Kim Duyen', 'AD001', 'duyen.admin', 'duyen@aoisora.com', '0900000101', NULL, 2, NULL, 'DEPT_HEAD', 'Head of Dept, Deputy Manager', 'G4', 'AD HD', 100, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
-- Account Team Members
(102, 'Nguyen Thi Hien', 'AD002', 'hien.account', 'hien@aoisora.com', '0900000102', NULL, 2, 'account-team', 'TEAM_LEAD', 'Team Lead', 'G3', 'AC TL', 101, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(103, 'Nguyen Thi Hang', 'AD003', 'hang.account', 'hang@aoisora.com', '0900000103', NULL, 2, 'account-team', 'STAFF', 'Account Executive', 'G2', 'AC EX', 102, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
-- Quality Control Team Members
(104, 'Tran Van An', 'AD004', 'an.qc', 'an.qc@aoisora.com', '0900000104', NULL, 2, 'qc-team', 'TEAM_LEAD', 'Team Lead', 'G3', 'QC TL', 101, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(105, 'Le Thi Binh', 'AD005', 'binh.qc', 'binh@aoisora.com', '0900000105', NULL, 2, 'qc-team', 'STAFF', 'QC Specialist', 'G2', 'QC SP', 104, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(106, 'Pham Van Cuong', 'AD006', 'cuong.qc', 'cuong@aoisora.com', '0900000106', NULL, 2, 'qc-team', 'STAFF', 'QC Analyst', 'G2', 'QC AN', 104, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(107, 'Hoang Thi Dung', 'AD007', 'dung.qc', 'dung@aoisora.com', '0900000107', NULL, 2, 'qc-team', 'STAFF', 'QC Officer', 'G2', 'QC OF', 104, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active');

-- OP Department Staff (department_id = 1)
INSERT INTO "staff" ("staff_id", "staff_name", "staff_code", "username", "email", "phone", "store_id", "department_id", "team_id", "role", "position", "job_grade", "sap_code", "line_manager_id", "password_hash", "status") VALUES
(110, 'Nguyen Van Hung', 'OP001', 'hung.op', 'hung.op@aoisora.com', '0900000110', NULL, 1, NULL, 'DEPT_HEAD', 'Head of Operations', 'G4', 'OP HD', 100, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(111, 'Tran Thi Mai', 'OP002', 'mai.peri', 'mai.peri@aoisora.com', '0900000111', NULL, 1, 'peri-team', 'TEAM_LEAD', 'Perishable Team Lead', 'G3', 'PE TL', 110, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(112, 'Le Van Duc', 'OP003', 'duc.peri', 'duc.peri@aoisora.com', '0900000112', NULL, 1, 'peri-team', 'STAFF', 'Perishable Specialist', 'G2', 'PE SP', 111, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(113, 'Pham Thi Lan', 'OP004', 'lan.peri', 'lan.peri@aoisora.com', '0900000113', NULL, 1, 'peri-team', 'STAFF', 'Perishable Officer', 'G2', 'PE OF', 111, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(114, 'Hoang Van Minh', 'OP005', 'minh.grocery', 'minh.gro@aoisora.com', '0900000114', NULL, 1, 'grocery-team', 'TEAM_LEAD', 'Grocery Team Lead', 'G3', 'GR TL', 110, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(115, 'Nguyen Thi Nga', 'OP006', 'nga.grocery', 'nga.gro@aoisora.com', '0900000115', NULL, 1, 'grocery-team', 'STAFF', 'Grocery Specialist', 'G2', 'GR SP', 114, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(116, 'Tran Van Phong', 'OP007', 'phong.grocery', 'phong.gro@aoisora.com', '0900000116', NULL, 1, 'grocery-team', 'STAFF', 'Grocery Officer', 'G2', 'GR OF', 114, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(117, 'Le Thi Quynh', 'OP008', 'quynh.grocery', 'quynh.gro@aoisora.com', '0900000117', NULL, 1, 'grocery-team', 'STAFF', 'Grocery Staff', 'G2', 'GR ST', 114, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(118, 'Pham Van Son', 'OP009', 'son.grocery', 'son.gro@aoisora.com', '0900000118', NULL, 1, 'grocery-team', 'STAFF', 'Grocery Staff', 'G2', 'GR S2', 114, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(119, 'Hoang Thi Tam', 'OP010', 'tam.grocery', 'tam.gro@aoisora.com', '0900000119', NULL, 1, 'grocery-team', 'STAFF', 'Grocery Staff', 'G2', 'GR S3', 114, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active');

-- CONTROL Department Staff (department_id = 3)
INSERT INTO "staff" ("staff_id", "staff_name", "staff_code", "username", "email", "phone", "store_id", "department_id", "team_id", "role", "position", "job_grade", "sap_code", "line_manager_id", "password_hash", "status") VALUES
(120, 'Nguyen Van Khanh', 'CT001', 'khanh.control', 'khanh.ctrl@aoisora.com', '0900000120', NULL, 3, NULL, 'DEPT_HEAD', 'Head of Control', 'G4', 'CT HD', 100, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(121, 'Tran Thi Linh', 'CT002', 'linh.qc', 'linh.qc@aoisora.com', '0900000121', NULL, 3, 'qc-control-team', 'TEAM_LEAD', 'QC Control Lead', 'G3', 'QC CL', 120, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(122, 'Le Van Nam', 'CT003', 'nam.qc', 'nam.qc@aoisora.com', '0900000122', NULL, 3, 'qc-control-team', 'STAFF', 'QC Inspector', 'G2', 'QC IN', 121, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(123, 'Pham Thi Oanh', 'CT004', 'oanh.qc', 'oanh.qc@aoisora.com', '0900000123', NULL, 3, 'qc-control-team', 'STAFF', 'QC Analyst', 'G2', 'QC A2', 121, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(124, 'Hoang Van Phu', 'CT005', 'phu.qc', 'phu.qc@aoisora.com', '0900000124', NULL, 3, 'qc-control-team', 'STAFF', 'QC Officer', 'G2', 'QC O2', 121, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(125, 'Nguyen Thi Quyen', 'CT006', 'quyen.qc', 'quyen.qc@aoisora.com', '0900000125', NULL, 3, 'qc-control-team', 'STAFF', 'QC Staff', 'G2', 'QC S1', 121, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(126, 'Tran Van Rong', 'CT007', 'rong.qc', 'rong.qc@aoisora.com', '0900000126', NULL, 3, 'qc-control-team', 'STAFF', 'QC Staff', 'G2', 'QC S2', 121, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(127, 'Le Thi Suong', 'CT008', 'suong.qc', 'suong.qc@aoisora.com', '0900000127', NULL, 3, 'qc-control-team', 'STAFF', 'QC Staff', 'G2', 'QC S3', 121, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(128, 'Pham Van Tu', 'CT009', 'tu.qc', 'tu.qc@aoisora.com', '0900000128', NULL, 3, 'qc-control-team', 'STAFF', 'QC Staff', 'G2', 'QC S4', 121, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(129, 'Hoang Thi Uyen', 'CT010', 'uyen.qc', 'uyen.qc@aoisora.com', '0900000129', NULL, 3, 'qc-control-team', 'STAFF', 'QC Staff', 'G2', 'QC S5', 121, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active');

-- IMPROVEMENT Department Staff (department_id = 4)
INSERT INTO "staff" ("staff_id", "staff_name", "staff_code", "username", "email", "phone", "store_id", "department_id", "team_id", "role", "position", "job_grade", "sap_code", "line_manager_id", "password_hash", "status") VALUES
(130, 'Nguyen Van Vinh', 'IM001', 'vinh.improve', 'vinh.imp@aoisora.com', '0900000130', NULL, 4, NULL, 'DEPT_HEAD', 'Head of Improvement', 'G5', 'IM HD', 100, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(131, 'Tran Thi Xuan', 'IM002', 'xuan.process', 'xuan.proc@aoisora.com', '0900000131', NULL, 4, 'process-team', 'TEAM_LEAD', 'Process Team Lead', 'G3', 'PR TL', 130, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(132, 'Le Van Yen', 'IM003', 'yen.process', 'yen.proc@aoisora.com', '0900000132', NULL, 4, 'process-team', 'STAFF', 'Process Analyst', 'G2', 'PR AN', 131, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(133, 'Pham Thi Zung', 'IM004', 'zung.process', 'zung.proc@aoisora.com', '0900000133', NULL, 4, 'process-team', 'STAFF', 'Process Engineer', 'G2', 'PR EN', 131, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(134, 'Hoang Van Bach', 'IM005', 'bach.it', 'bach.it@aoisora.com', '0900000134', NULL, 4, 'it-team', 'TEAM_LEAD', 'IT Team Lead', 'G3', 'IT TL', 130, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(135, 'Nguyen Thi Cam', 'IM006', 'cam.it', 'cam.it@aoisora.com', '0900000135', NULL, 4, 'it-team', 'STAFF', 'Software Developer', 'G2', 'IT SD', 134, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(136, 'Tran Van Dan', 'IM007', 'dan.it', 'dan.it@aoisora.com', '0900000136', NULL, 4, 'it-team', 'STAFF', 'System Admin', 'G2', 'IT SA', 134, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(137, 'Le Thi Em', 'IM008', 'em.it', 'em.it@aoisora.com', '0900000137', NULL, 4, 'it-team', 'STAFF', 'IT Support', 'G2', 'IT SU', 134, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(138, 'Pham Van Gia', 'IM009', 'gia.it', 'gia.it@aoisora.com', '0900000138', NULL, 4, 'it-team', 'STAFF', 'IT Staff', 'G2', 'IT S1', 134, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(139, 'Hoang Thi Ha', 'IM010', 'ha.it', 'ha.it@aoisora.com', '0900000139', NULL, 4, 'it-team', 'STAFF', 'IT Staff', 'G2', 'IT S2', 134, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(140, 'Nguyen Van Hoa', 'IM011', 'hoa.it', 'hoa.it@aoisora.com', '0900000140', NULL, 4, 'it-team', 'STAFF', 'IT Staff', 'G2', 'IT S3', 134, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(141, 'Tran Thi Kim', 'IM012', 'kim.it', 'kim.it@aoisora.com', '0900000141', NULL, 4, 'it-team', 'STAFF', 'IT Staff', 'G2', 'IT S4', 134, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active');

-- HR Department Staff (department_id = 6)
INSERT INTO "staff" ("staff_id", "staff_name", "staff_code", "username", "email", "phone", "store_id", "department_id", "team_id", "role", "position", "job_grade", "sap_code", "line_manager_id", "password_hash", "status") VALUES
(150, 'Le Van Lam', 'HR001', 'lam.hr', 'lam.hr@aoisora.com', '0900000150', NULL, 6, NULL, 'DEPT_HEAD', 'Head of HR', 'G3', 'HR HD', 100, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(151, 'Pham Thi My', 'HR002', 'my.recruit', 'my.hr@aoisora.com', '0900000151', NULL, 6, 'recruit-team', 'STAFF', 'Recruiter', 'G2', 'HR RC', 150, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(152, 'Hoang Van Nghia', 'HR003', 'nghia.train', 'nghia.hr@aoisora.com', '0900000152', NULL, 6, 'training-team', 'STAFF', 'Training Specialist', 'G2', 'HR TR', 150, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(153, 'Nguyen Thi Pha', 'HR004', 'pha.hr', 'pha.hr@aoisora.com', '0900000153', NULL, 6, 'recruit-team', 'STAFF', 'HR Officer', 'G1', 'HR OF', 150, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(154, 'Tran Van Quan', 'HR005', 'quan.hr', 'quan.hr@aoisora.com', '0900000154', NULL, 6, 'training-team', 'STAFF', 'HR Staff', 'G1', 'HR S1', 150, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active');

-- MD Department Staff (using Planning department_id = 5 as MD)
INSERT INTO "staff" ("staff_id", "staff_name", "staff_code", "username", "email", "phone", "store_id", "department_id", "team_id", "role", "position", "job_grade", "sap_code", "line_manager_id", "password_hash", "status") VALUES
(160, 'Le Thi Sen', 'MD001', 'sen.md', 'sen.md@aoisora.com', '0900000160', NULL, 5, NULL, 'DEPT_HEAD', 'Head of Planning', 'G3', 'MD HD', 100, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(161, 'Pham Van Tai', 'MD002', 'tai.md', 'tai.md@aoisora.com', '0900000161', NULL, 5, NULL, 'STAFF', 'Planner', 'G2', 'MD PL', 160, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(162, 'Hoang Thi Ut', 'MD003', 'ut.md', 'ut.md@aoisora.com', '0900000162', NULL, 5, NULL, 'STAFF', 'Planner', 'G2', 'MD P2', 160, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(163, 'Nguyen Van Viet', 'MD004', 'viet.md', 'viet.md@aoisora.com', '0900000163', NULL, 5, NULL, 'STAFF', 'Marketing Staff', 'G2', 'MD MK', 160, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(164, 'Tran Thi Xim', 'MD005', 'xim.md', 'xim.md@aoisora.com', '0900000164', NULL, 5, NULL, 'STAFF', 'Space Planner', 'G2', 'MD SP', 160, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(165, 'Le Van Yen', 'MD006', 'yen.md', 'yen.md@aoisora.com', '0900000165', NULL, 5, NULL, 'STAFF', 'Ordering Staff', 'G2', 'MD OR', 160, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(166, 'Pham Thi Zoan', 'MD007', 'zoan.md', 'zoan.md@aoisora.com', '0900000166', NULL, 5, NULL, 'STAFF', 'Assistant', 'G2', 'MD AS', 160, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
(167, 'Hoang Van An', 'MD008', 'an.md', 'an.md@aoisora.com', '0900000167', NULL, 5, NULL, 'STAFF', 'Staff', 'G2', 'MD S1', 160, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active');

SELECT setval('staff_staff_id_seq', 200);

-- Update store managers
UPDATE "stores" SET "manager_id" = 1 WHERE "store_id" = 1;
UPDATE "stores" SET "manager_id" = 9 WHERE "store_id" = 2;
UPDATE "stores" SET "manager_id" = 17 WHERE "store_id" = 3;
UPDATE "stores" SET "manager_id" = 25 WHERE "store_id" = 4;

-- ============================================
-- WS DATA: Checklists
-- ============================================

INSERT INTO "check_lists" ("check_list_id", "check_list_name", "description") VALUES
(1, 'Kiem tra san pham het han', 'Kiem tra va loai bo san pham het han su dung'),
(2, 'Ve sinh khu vuc', 'Lau don sach se khu vuc lam viec'),
(3, 'Kiem tra nhiet do tu lanh', 'Ghi nhan nhiet do tu mat va tu dong'),
(4, 'Sap xep ke hang', 'Sap xep hang hoa theo nguyen tac FIFO'),
(5, 'Kiem tra gia tien', 'Kiem tra bang gia va nhan gia san pham');

SELECT setval('check_lists_check_list_id_seq', 5);

-- ============================================
-- WS DATA: Manuals (Legacy)
-- ============================================

INSERT INTO "manuals" ("manual_id", "manual_name", "manual_url", "description") VALUES
(1, 'Huong dan mo cua hang', '/manuals/open-store.pdf', 'Quy trinh mo cua hang hang ngay'),
(2, 'Huong dan dong cua hang', '/manuals/close-store.pdf', 'Quy trinh dong cua hang hang ngay'),
(3, 'Huong dan xu ly khach hang', '/manuals/customer-service.pdf', 'Quy trinh phuc vu khach hang');

SELECT setval('manuals_manual_id_seq', 3);

-- ============================================
-- DWS DATA: Shift Assignments and Daily Tasks
-- Using dynamic date generation for ±1 week
-- ============================================

DO $$
DECLARE
    v_date DATE;
    v_store_id INTEGER;
    v_staff RECORD;
    v_shift_code_id INTEGER;
    v_start_time TIME;
    v_end_time TIME;
    v_slot_time TIME;
    v_task_index INTEGER;
    v_group_id VARCHAR(20);
    v_task_name VARCHAR(255);
    v_day_offset INTEGER;
    v_staff_index INTEGER;
    v_task_code VARCHAR(20);

    -- Task names for each group
    v_leader_tasks TEXT[] := ARRAY[
        'Mo kho', 'Balancing', 'Kiem tra hang', 'Duyet don', 'Giao viec',
        'Meeting', 'Ban giao tien', 'Kiem tra OOS', 'Duyet khuyen mai',
        'Giam sat', 'Chuan bi ban giao', 'Dong kho', 'Ban giao ca'
    ];
    v_pos_tasks TEXT[] := ARRAY[
        'Mo POS', 'Check POS', 'Ho tro POS', 'Doi soat tien', 'In bao cao',
        'Kiem ke POS', 'Doi tien le', 'Check voucher', 'Phuc vu khach',
        'Ho tro thanh toan', 'Xu ly khieu nai', 'Kiem POS cuoi ca', 'Dong POS'
    ];
    v_peri_tasks TEXT[] := ARRAY[
        'Len thit ca', 'Len rau cu', 'Sap xep ke', 'Kiem HSD', 'Cat got rau',
        'Dong goi thit', 'Can dong goi', 'Dan nhan gia', 'Bo sung ke',
        'Giam gia Peri', 'Xoay ke FIFO', 'Check nhiet do', 'Kiem kho Peri'
    ];
    v_dry_tasks TEXT[] := ARRAY[
        'Len hang kho', 'Keo mat Dry', 'Sap xep ke', 'Ban OOS', 'Kiem HSD Dry',
        'Xoay FIFO', 'Dan nhan', 'Check gia', 'Bo sung ke', 'Kiem promo',
        'Sap xep endcap', 'Ve sinh ke', 'Kiem kho Dry'
    ];
    v_mmd_tasks TEXT[] := ARRAY[
        'Nhan hang Peri', 'Kiem hang Peri', 'Nhan hang RDC', 'Kiem hang RDC',
        'Phan loai hang', 'Nhap kho', 'Cap nhat ton', 'Xu ly hang tra',
        'Kiem DC', 'Bao cao nhap', 'Sap xep kho', 'Kiem kho MMD'
    ];
    v_qc_tasks TEXT[] := ARRAY[
        'Cleaning Time', 'Kiem tra VSC', 'Ve sinh khu vuc', 'Check nhiet do',
        'Kiem tra chat luong'
    ];

BEGIN
    -- Loop through 15 days: -7 to +7 from current date
    FOR v_day_offset IN -7..7 LOOP
        v_date := CURRENT_DATE + v_day_offset;

        -- Loop through stores (1-4)
        FOR v_store_id IN 1..4 LOOP

            -- Get staff for this store (8 staff per store)
            v_staff_index := 0;
            FOR v_staff IN
                SELECT staff_id, role
                FROM staff
                WHERE store_id = v_store_id AND is_active = true
                ORDER BY
                    CASE role
                        WHEN 'MANAGER' THEN 1
                        WHEN 'STORE_LEADER_G3' THEN 2
                        ELSE 3
                    END, staff_id
                LIMIT 8
            LOOP
                v_staff_index := v_staff_index + 1;

                -- First 4 staff: morning shift, last 4: afternoon shift
                IF v_staff_index <= 4 THEN
                    v_shift_code_id := 1; -- V8.6 (06:00-14:00)
                    v_start_time := '06:00:00'::TIME;
                    v_end_time := '14:00:00'::TIME;
                ELSE
                    v_shift_code_id := 4; -- V8.14 (14:00-22:00)
                    v_start_time := '14:00:00'::TIME;
                    v_end_time := '22:00:00'::TIME;
                END IF;

                -- Insert shift assignment
                INSERT INTO shift_assignments (staff_id, store_id, shift_date, shift_code_id, status, assigned_by, assigned_at)
                VALUES (v_staff.staff_id, v_store_id, v_date, v_shift_code_id, 'assigned', 1, NOW())
                ON CONFLICT (staff_id, shift_date, shift_code_id) DO NOTHING;

                -- Create tasks for each 15-minute slot
                v_slot_time := v_start_time;
                v_task_index := 0;

                WHILE v_slot_time < v_end_time LOOP
                    v_task_index := v_task_index + 1;

                    -- Determine task type based on staff role and slot
                    IF v_staff.role IN ('MANAGER', 'STORE_LEADER_G3') THEN
                        IF v_task_index % 3 = 0 THEN
                            v_group_id := 'POS';
                            v_task_name := v_pos_tasks[1 + (v_task_index % array_length(v_pos_tasks, 1))];
                            v_task_code := 'POS' || LPAD(v_task_index::TEXT, 2, '0');
                        ELSIF v_slot_time >= v_start_time + INTERVAL '6 hours' AND v_slot_time < v_start_time + INTERVAL '7 hours' THEN
                            v_group_id := 'OTHER';
                            v_task_name := 'Break Time';
                            v_task_code := 'BRK01';
                        ELSE
                            v_group_id := 'LEADER';
                            v_task_name := v_leader_tasks[1 + (v_task_index % array_length(v_leader_tasks, 1))];
                            v_task_code := 'LDR' || LPAD(v_task_index::TEXT, 2, '0');
                        END IF;
                    ELSIF v_staff_index IN (2, 6) THEN
                        -- PERI staff
                        IF v_slot_time >= v_start_time + INTERVAL '3 hours' AND v_slot_time < v_start_time + INTERVAL '3 hours 30 minutes' THEN
                            v_group_id := 'QC-FSH';
                            v_task_name := v_qc_tasks[1 + (v_task_index % array_length(v_qc_tasks, 1))];
                            v_task_code := 'QC' || LPAD(v_task_index::TEXT, 2, '0');
                        ELSIF v_slot_time >= v_start_time + INTERVAL '6 hours' AND v_slot_time < v_start_time + INTERVAL '7 hours' THEN
                            v_group_id := 'OTHER';
                            v_task_name := 'Break Time';
                            v_task_code := 'BRK01';
                        ELSE
                            v_group_id := 'PERI';
                            v_task_name := v_peri_tasks[1 + (v_task_index % array_length(v_peri_tasks, 1))];
                            v_task_code := 'PER' || LPAD(v_task_index::TEXT, 2, '0');
                        END IF;
                    ELSIF v_staff_index IN (3, 7) THEN
                        -- DRY staff
                        IF v_slot_time >= v_start_time + INTERVAL '3 hours' AND v_slot_time < v_start_time + INTERVAL '3 hours 30 minutes' THEN
                            v_group_id := 'QC-FSH';
                            v_task_name := v_qc_tasks[1 + (v_task_index % array_length(v_qc_tasks, 1))];
                            v_task_code := 'QC' || LPAD(v_task_index::TEXT, 2, '0');
                        ELSIF v_slot_time >= v_start_time + INTERVAL '6 hours' AND v_slot_time < v_start_time + INTERVAL '7 hours' THEN
                            v_group_id := 'OTHER';
                            v_task_name := 'Break Time';
                            v_task_code := 'BRK01';
                        ELSE
                            v_group_id := 'DRY';
                            v_task_name := v_dry_tasks[1 + (v_task_index % array_length(v_dry_tasks, 1))];
                            v_task_code := 'DRY' || LPAD(v_task_index::TEXT, 2, '0');
                        END IF;
                    ELSE
                        -- MMD staff
                        IF v_slot_time >= v_start_time + INTERVAL '3 hours' AND v_slot_time < v_start_time + INTERVAL '3 hours 30 minutes' THEN
                            v_group_id := 'QC-FSH';
                            v_task_name := v_qc_tasks[1 + (v_task_index % array_length(v_qc_tasks, 1))];
                            v_task_code := 'QC' || LPAD(v_task_index::TEXT, 2, '0');
                        ELSIF v_slot_time >= v_start_time + INTERVAL '6 hours' AND v_slot_time < v_start_time + INTERVAL '7 hours' THEN
                            v_group_id := 'OTHER';
                            v_task_name := 'Break Time';
                            v_task_code := 'BRK01';
                        ELSE
                            v_group_id := 'MMD';
                            v_task_name := v_mmd_tasks[1 + (v_task_index % array_length(v_mmd_tasks, 1))];
                            v_task_code := 'MMD' || LPAD(v_task_index::TEXT, 2, '0');
                        END IF;
                    END IF;

                    -- Insert daily schedule task
                    INSERT INTO daily_schedule_tasks (
                        staff_id, store_id, schedule_date, group_id, task_code, task_name,
                        start_time, end_time, status, created_at, updated_at
                    )
                    VALUES (
                        v_staff.staff_id,
                        v_store_id,
                        v_date,
                        v_group_id,
                        v_task_code,
                        v_task_name,
                        v_slot_time,
                        v_slot_time + INTERVAL '15 minutes',
                        -- Status: 1=Not Yet, 2=Done, 3=Skipped, 4=In Progress
                        CASE
                            WHEN v_date < CURRENT_DATE THEN
                                CASE WHEN random() > 0.1 THEN 2 ELSE 3 END
                            WHEN v_date = CURRENT_DATE AND v_slot_time < CURRENT_TIME THEN
                                CASE WHEN random() > 0.2 THEN 2 ELSE 4 END
                            ELSE 1
                        END,
                        NOW(),
                        NOW()
                    )
                    ON CONFLICT DO NOTHING;

                    v_slot_time := v_slot_time + INTERVAL '15 minutes';
                END LOOP;

            END LOOP; -- End staff loop
        END LOOP; -- End store loop
    END LOOP; -- End day loop

    RAISE NOTICE 'Test data generation completed!';
END $$;

-- ============================================
-- WS DATA: Sample Tasks
-- Department mapping:
--   11=PERI, 12=GRO, 13=DELICA, 14=D&D, 15=CS (under OP)
--   21=Admin, 22=MMD, 23=ACC (under Admin)
--   3=Control, 4=Improvement, 6=HR (parent)
--   51=MKT, 52=SPA, 53=ORD (under Planning)
-- ============================================

INSERT INTO "tasks" ("task_name", "task_description", "task_type_id", "response_type_id", "status_id", "dept_id", "assigned_store_id", "assigned_staff_id", "created_staff_id", "priority", "start_date", "end_date") VALUES
-- Original 5 tasks
('Kiem ke hang hoa thang 12', 'Kiem ke toan bo hang hoa trong kho', 1, 5, 8, 22, 1, 3, 1, 'high', CURRENT_DATE - 3, CURRENT_DATE + 4),
('Ve sinh khu vuc thuc pham', 'Ve sinh sach se khu vuc trung bay thuc pham', 2, 6, 7, 23, 1, 4, 1, 'normal', CURRENT_DATE, CURRENT_DATE + 1),
('Chuan bi khuyen mai Tet', 'Chuan bi hang hoa va bang gia khuyen mai Tet', 3, 4, 7, 3, 1, 5, 1, 'urgent', CURRENT_DATE + 1, CURRENT_DATE + 7),
('Bao cao doanh thu tuan', 'Tong hop va bao cao doanh thu tuan', 1, 4, 9, 4, 2, 11, 9, 'normal', CURRENT_DATE - 7, CURRENT_DATE - 1),
('Dao tao nhan vien moi', 'Dao tao quy trinh lam viec cho nhan vien moi', 3, 5, 8, 51, 3, 19, 17, 'normal', CURRENT_DATE - 2, CURRENT_DATE + 5),

-- PERI (Perishable) - dept_id=11
('Kiem tra nhiet do tu lanh', 'Kiem tra va ghi nhan nhiet do tu mat, tu dong', 1, 5, 7, 52, 1, 3, 1, 'high', CURRENT_DATE, CURRENT_DATE + 1),
('Sap xep hang hoa ke 1', 'Sap xep lai hang hoa theo nguyen tac FIFO', 2, 6, 7, 53, 1, 4, 1, 'normal', CURRENT_DATE - 1, CURRENT_DATE),
('Kiem tra HSD san pham', 'Kiem tra han su dung san pham trong khu vuc', 1, 5, 9, 6, 2, 11, 9, 'high', CURRENT_DATE - 5, CURRENT_DATE - 3),
('Ve sinh khu vuc thu ngan', 'Lau don sach se khu vuc quay thu ngan', 2, 6, 8, 11, 2, 12, 9, 'normal', CURRENT_DATE - 2, CURRENT_DATE),
('Kiem tra thiet bi dien', 'Kiem tra hoat dong cua cac thiet bi dien', 1, 5, 7, 12, 3, 19, 17, 'normal', CURRENT_DATE, CURRENT_DATE + 2),
('Bao tri he thong dieu hoa', 'Bao tri dinh ky he thong dieu hoa', 3, 4, 7, 13, 3, 20, 17, 'low', CURRENT_DATE + 2, CURRENT_DATE + 5),
('Kiem tra camera an ninh', 'Kiem tra hoat dong cua he thong camera', 1, 5, 9, 14, 4, 27, 25, 'high', CURRENT_DATE - 4, CURRENT_DATE - 2),
('Cap nhat bang gia', 'Cap nhat bang gia moi cho san pham', 2, 6, 8, 15, 4, 28, 25, 'normal', CURRENT_DATE - 1, CURRENT_DATE + 1),

-- MKT (Marketing) - dept_id=51
('Thiet ke poster khuyen mai', 'Thiet ke poster quang cao chuong trinh khuyen mai', 3, 4, 7, 51, 1, 5, 1, 'high', CURRENT_DATE, CURRENT_DATE + 3),
('Chuan bi vat pham POSM', 'Chuan bi vat pham quang cao tai diem ban', 2, 6, 8, 51, 1, 6, 1, 'normal', CURRENT_DATE - 2, CURRENT_DATE + 1),
('Khao sat khach hang', 'Thuc hien khao sat y kien khach hang', 3, 4, 7, 51, 2, 13, 9, 'normal', CURRENT_DATE + 1, CURRENT_DATE + 7),
('Bao cao hieu qua marketing', 'Tong hop bao cao hieu qua cac chuong trinh', 1, 4, 9, 51, 2, 14, 9, 'low', CURRENT_DATE - 10, CURRENT_DATE - 5),
('Lap ke hoach truyen thong', 'Lap ke hoach truyen thong thang toi', 3, 4, 7, 52, 3, 21, 17, 'high', CURRENT_DATE + 3, CURRENT_DATE + 10),
('Quan ly fanpage', 'Dang bai va tuong tac tren fanpage', 2, 6, 8, 52, 3, 22, 17, 'normal', CURRENT_DATE - 1, CURRENT_DATE + 2),
('To chuc su kien sampling', 'To chuc su kien dung thu san pham', 3, 4, 7, 53, 4, 29, 25, 'urgent', CURRENT_DATE + 2, CURRENT_DATE + 4),

-- HR (Human Resources) - dept_id=6
('Tuyen dung nhan vien ban hang', 'Tuyen dung 3 nhan vien ban hang moi', 3, 4, 7, 6, 1, 7, 1, 'high', CURRENT_DATE, CURRENT_DATE + 14),
('Danh gia nhan vien quy 4', 'Thuc hien danh gia nhan vien quy 4', 1, 4, 8, 6, 1, 8, 1, 'normal', CURRENT_DATE - 5, CURRENT_DATE + 5),
('Cap nhat ho so nhan su', 'Cap nhat thong tin ho so nhan vien', 2, 6, 9, 6, 2, 15, 9, 'low', CURRENT_DATE - 7, CURRENT_DATE - 3),
('To chuc team building', 'To chuc hoat dong team building thang', 3, 4, 7, 6, 2, 16, 9, 'normal', CURRENT_DATE + 5, CURRENT_DATE + 7),
('Dao tao an toan lao dong', 'Dao tao ve an toan lao dong cho nhan vien', 3, 5, 7, 6, 3, 23, 17, 'high', CURRENT_DATE + 1, CURRENT_DATE + 3),
('Xu ly don xin nghi phep', 'Xu ly cac don xin nghi phep cua nhan vien', 2, 6, 8, 6, 4, 30, 25, 'normal', CURRENT_DATE - 1, CURRENT_DATE),

-- Control (Quality Control) - dept_id=3
('Kiem tra chat luong thuc pham', 'Kiem tra chat luong thuc pham nhap kho', 1, 5, 7, 3, 1, 3, 1, 'urgent', CURRENT_DATE, CURRENT_DATE + 1),
('Danh gia nha cung cap', 'Danh gia chat luong nha cung cap', 1, 4, 8, 3, 1, 4, 1, 'high', CURRENT_DATE - 3, CURRENT_DATE + 2),
('Kiem tra ve sinh an toan', 'Kiem tra tieu chuan ve sinh an toan thuc pham', 1, 5, 9, 3, 2, 11, 9, 'high', CURRENT_DATE - 6, CURRENT_DATE - 4),
('Xu ly san pham loi', 'Xu ly va bao cao san pham bi loi', 2, 6, 7, 3, 2, 12, 9, 'urgent', CURRENT_DATE, CURRENT_DATE + 1),
('Kiem tra quy trinh bao quan', 'Kiem tra quy trinh bao quan san pham', 1, 5, 8, 3, 3, 19, 17, 'normal', CURRENT_DATE - 2, CURRENT_DATE + 1),
('Lap bao cao QC hang thang', 'Tong hop bao cao kiem soat chat luong', 1, 4, 7, 3, 4, 27, 25, 'low', CURRENT_DATE + 3, CURRENT_DATE + 7),

-- MMD (Merchandising) - dept_id=22
('Nhan hang tu nha cung cap', 'Nhan va kiem tra hang hoa tu NCC', 2, 6, 7, 22, 1, 5, 1, 'high', CURRENT_DATE, CURRENT_DATE + 1),
('Sap xep kho hang', 'Sap xep lai kho hang theo quy dinh', 2, 6, 8, 22, 1, 6, 1, 'normal', CURRENT_DATE - 2, CURRENT_DATE),
('Kiem ke ton kho', 'Kiem ke so luong ton kho thuc te', 1, 5, 9, 22, 2, 13, 9, 'high', CURRENT_DATE - 5, CURRENT_DATE - 3),
('Chuyen hang giua cac cua hang', 'Dieu phoi chuyen hang giua cac chi nhanh', 2, 6, 7, 22, 2, 14, 9, 'normal', CURRENT_DATE + 1, CURRENT_DATE + 2),
('Cap nhat he thong quan ly kho', 'Cap nhat thong tin vao he thong WMS', 2, 6, 8, 22, 3, 21, 17, 'low', CURRENT_DATE - 1, CURRENT_DATE + 1),
('Xu ly hang tra ve', 'Xu ly va phan loai hang tra ve tu khach', 2, 6, 7, 22, 4, 29, 25, 'normal', CURRENT_DATE, CURRENT_DATE + 2),

-- ACC (Accounting) - dept_id=23
('Doi soat doanh thu ngay', 'Doi soat doanh thu ban hang trong ngay', 1, 4, 7, 23, 1, 7, 1, 'high', CURRENT_DATE, CURRENT_DATE + 1),
('Lap bao cao tai chinh thang', 'Tong hop bao cao tai chinh hang thang', 1, 4, 8, 23, 1, 8, 1, 'normal', CURRENT_DATE - 3, CURRENT_DATE + 2),
('Thanh toan nha cung cap', 'Thuc hien thanh toan cho nha cung cap', 2, 6, 9, 23, 2, 15, 9, 'high', CURRENT_DATE - 7, CURRENT_DATE - 5),
('Kiem tra chi phi van hanh', 'Kiem tra va phan tich chi phi van hanh', 1, 4, 7, 23, 3, 23, 17, 'normal', CURRENT_DATE + 2, CURRENT_DATE + 5),
('Xu ly hoan tien khach hang', 'Xu ly cac yeu cau hoan tien tu khach', 2, 6, 8, 23, 4, 30, 25, 'urgent', CURRENT_DATE - 1, CURRENT_DATE),

-- Improvement - dept_id=4
('Bao tri he thong POS', 'Bao tri va cap nhat he thong POS', 3, 4, 7, 4, 1, 3, 1, 'high', CURRENT_DATE + 1, CURRENT_DATE + 3),
('Sao luu du lieu', 'Sao luu du lieu he thong hang ngay', 2, 6, 9, 4, 1, 4, 1, 'normal', CURRENT_DATE - 1, CURRENT_DATE),
('Kiem tra mang noi bo', 'Kiem tra va dam bao mang hoat dong on dinh', 1, 5, 8, 4, 2, 11, 9, 'normal', CURRENT_DATE - 2, CURRENT_DATE),
('Cap nhat phan mem', 'Cap nhat phien ban phan mem moi', 3, 4, 7, 4, 3, 19, 17, 'low', CURRENT_DATE + 3, CURRENT_DATE + 7),
('Ho tro ky thuat cho nhan vien', 'Ho tro xu ly cac van de ky thuat', 2, 6, 7, 4, 4, 27, 25, 'normal', CURRENT_DATE, CURRENT_DATE + 2);

-- ============================================
-- TASK DETAIL DATA: Workflow Steps, Store Results, Staff Results
-- ============================================

-- Sample image URLs
-- SAMPLE_IMAGE = 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop'
-- SAMPLE_STORE_IMAGE = 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=400&h=300&fit=crop'

-- Workflow Steps for Task 1 (Kiem ke hang hoa thang 12)
INSERT INTO "task_workflow_steps" ("task_id", "step_number", "step_name", "status", "assignee_id", "skip_info", "start_date", "end_date", "comment") VALUES
(1, 1, 'SUBMIT', 'completed', 1, NULL, CURRENT_DATE - 5, CURRENT_DATE - 4, 'Reference doc about inventory check procedures'),
(1, 2, 'APPROVE', 'completed', 2, NULL, CURRENT_DATE - 4, CURRENT_DATE - 3, 'Approved for all stores'),
(1, 3, 'DO TASK', 'in_progress', NULL, '4 Stores', CURRENT_DATE - 3, CURRENT_DATE + 4, NULL),
(1, 4, 'CHECK', 'pending', 1, NULL, CURRENT_DATE + 4, CURRENT_DATE + 7, NULL);

-- Workflow Steps for Task 2 (Ve sinh khu vuc thuc pham)
INSERT INTO "task_workflow_steps" ("task_id", "step_number", "step_name", "status", "assignee_id", "skip_info", "start_date", "end_date", "comment") VALUES
(2, 1, 'SUBMIT', 'completed', 1, NULL, CURRENT_DATE - 2, CURRENT_DATE - 1, 'Daily cleaning task submitted'),
(2, 2, 'APPROVE', 'completed', 2, NULL, CURRENT_DATE - 1, CURRENT_DATE, 'Auto-approved for routine task'),
(2, 3, 'DO TASK', 'in_progress', NULL, '4 Stores', CURRENT_DATE, CURRENT_DATE + 1, NULL),
(2, 4, 'CHECK', 'pending', 9, NULL, CURRENT_DATE + 1, CURRENT_DATE + 2, NULL);

-- Workflow Steps for Task 3 (Chuan bi khuyen mai Tet)
INSERT INTO "task_workflow_steps" ("task_id", "step_number", "step_name", "status", "assignee_id", "skip_info", "start_date", "end_date", "comment") VALUES
(3, 1, 'SUBMIT', 'completed', 1, NULL, CURRENT_DATE - 1, CURRENT_DATE, 'Tet promotion preparation plan'),
(3, 2, 'APPROVE', 'in_progress', 2, NULL, CURRENT_DATE, CURRENT_DATE + 1, NULL),
(3, 3, 'DO TASK', 'pending', NULL, '4 Stores', CURRENT_DATE + 1, CURRENT_DATE + 7, NULL),
(3, 4, 'CHECK', 'pending', 17, NULL, CURRENT_DATE + 7, CURRENT_DATE + 10, NULL);

-- Store Results for Task 1
INSERT INTO "task_store_results" ("result_id", "task_id", "store_id", "status", "start_time", "completed_time", "completed_by_id") VALUES
(1, 1, 1, 'success', CURRENT_TIMESTAMP - INTERVAL '3 days', CURRENT_TIMESTAMP - INTERVAL '1 day', 3),
(2, 1, 2, 'failed', CURRENT_TIMESTAMP - INTERVAL '3 days', CURRENT_TIMESTAMP - INTERVAL '1 day', 11),
(3, 1, 3, 'in_progress', CURRENT_TIMESTAMP - INTERVAL '2 days', NULL, 19),
(4, 1, 4, 'not_started', NULL, NULL, NULL);

-- Store Results for Task 2
INSERT INTO "task_store_results" ("result_id", "task_id", "store_id", "status", "start_time", "completed_time", "completed_by_id") VALUES
(5, 2, 1, 'success', CURRENT_TIMESTAMP - INTERVAL '6 hours', CURRENT_TIMESTAMP - INTERVAL '2 hours', 4),
(6, 2, 2, 'in_progress', CURRENT_TIMESTAMP - INTERVAL '4 hours', NULL, 12),
(7, 2, 3, 'not_started', NULL, NULL, NULL),
(8, 2, 4, 'not_started', NULL, NULL, NULL);

SELECT setval('task_store_results_result_id_seq', 8);

-- Staff Results for Task 1
INSERT INTO "task_staff_results" ("result_id", "task_id", "staff_id", "store_id", "status", "progress", "progress_text") VALUES
(1, 1, 3, 1, 'success', 100, '100% (15/15 items)'),
(2, 1, 4, 1, 'success', 100, '100% (10/10 items)'),
(3, 1, 11, 2, 'in_progress', 75, '75% (7.5/10 items)'),
(4, 1, 12, 2, 'in_progress', 50, '50% (5/10 items)'),
(5, 1, 19, 3, 'not_started', 0, '0% (0/15 items)'),
(6, 1, 20, 3, 'not_started', 0, '0% (0/10 items)');

SELECT setval('task_staff_results_result_id_seq', 6);

-- Images for Store Results
INSERT INTO "task_images" ("task_id", "store_result_id", "staff_result_id", "title", "image_url", "thumbnail_url", "uploaded_by_id", "is_completed") VALUES
-- Images for Store 1 Result (Task 1)
(1, 1, NULL, 'Picture at POS', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=200&h=150&fit=crop', 3, true),
(1, 1, NULL, 'Picture at Peri Area', 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=200&h=150&fit=crop', 3, true),
(1, 1, NULL, 'Picture at Ware House', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=200&h=150&fit=crop', 3, true),
(1, 1, NULL, 'Picture at POS 2', 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=200&h=150&fit=crop', 4, true),
-- Images for Store 2 Result (Task 1) - partial
(1, 2, NULL, 'Checking inventory', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=200&h=150&fit=crop', 11, true),
(1, 2, NULL, 'Issue found', 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=200&h=150&fit=crop', 11, true);

-- Images for Staff Results
INSERT INTO "task_images" ("task_id", "store_result_id", "staff_result_id", "title", "image_url", "thumbnail_url", "uploaded_by_id", "is_completed") VALUES
(1, NULL, 1, 'Staff completion photo 1', 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=200&h=150&fit=crop', 3, true),
(1, NULL, 1, 'Staff completion photo 2', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=200&h=150&fit=crop', 3, true),
(1, NULL, 2, 'Staff completion photo', 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=200&h=150&fit=crop', 4, true),
(1, NULL, 3, 'In progress photo', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=200&h=150&fit=crop', 11, true);

-- Comments for Store Results
INSERT INTO "task_comments" ("task_id", "store_result_id", "staff_result_id", "user_id", "content", "created_at") VALUES
-- Comments for Store 1 Result
(1, 1, NULL, 3, 'nha cung cap giao thieu hoa nen chi co hinh ABC.', CURRENT_TIMESTAMP - INTERVAL '2 days'),
(1, 1, NULL, 1, 'ok mi da bao MO xu ly tiep.', CURRENT_TIMESTAMP - INTERVAL '1 day 23 hours'),
-- Comments for Store 2 Result
(1, 2, NULL, 11, 'Phat hien hang bi loi, can xu ly gap.', CURRENT_TIMESTAMP - INTERVAL '1 day 20 hours'),
(1, 2, NULL, 9, 'Da gui yeu cau doi hang.', CURRENT_TIMESTAMP - INTERVAL '1 day 18 hours');

-- Comments for Staff Results
INSERT INTO "task_comments" ("task_id", "store_result_id", "staff_result_id", "user_id", "content", "created_at") VALUES
(1, NULL, 1, 3, 'Da hoan thanh kiem ke khu vuc A.', CURRENT_TIMESTAMP - INTERVAL '2 days'),
(1, NULL, 1, 1, 'ok, I will check later', CURRENT_TIMESTAMP - INTERVAL '1 day 22 hours'),
(1, NULL, 3, 11, 'Dang cho hang ve de kiem tra.', CURRENT_TIMESTAMP - INTERVAL '1 day');

-- Likes for Store Results
INSERT INTO "task_likes" ("store_result_id", "user_id") VALUES
(1, 1),
(1, 2),
(1, 9),
(5, 1),
(5, 2);

-- ============================================
-- MANUAL DATA: Folders and Documents
-- ============================================

INSERT INTO "manual_folders" ("folder_id", "folder_name", "parent_id", "description", "icon", "sort_order") VALUES
(1, 'Quy trinh van hanh', NULL, 'Cac quy trinh van hanh cua hang', 'folder', 1),
(2, 'Mo cua hang', 1, 'Quy trinh mo cua hang', 'door-open', 1),
(3, 'Dong cua hang', 1, 'Quy trinh dong cua hang', 'door-closed', 2),
(4, 'Quan ly hang hoa', NULL, 'Huong dan quan ly hang hoa', 'package', 2),
(5, 'Phuc vu khach hang', NULL, 'Quy trinh phuc vu khach hang', 'users', 3);

SELECT setval('manual_folders_folder_id_seq', 5);

INSERT INTO "manual_documents" ("document_id", "folder_id", "title", "description", "version", "status", "created_by") VALUES
(1, 2, 'Quy trinh mo cua hang buoi sang', 'Huong dan chi tiet cac buoc mo cua hang', '1.0', 'published', 1),
(2, 3, 'Quy trinh dong cua hang buoi toi', 'Huong dan chi tiet cac buoc dong cua hang', '1.0', 'published', 1),
(3, 4, 'Huong dan kiem ke hang hoa', 'Quy trinh kiem ke hang hoa dinh ky', '1.0', 'published', 1),
(4, 5, 'Quy trinh xu ly khieu nai khach hang', 'Huong dan xu ly cac tinh huong khieu nai', '1.2', 'published', 1);

SELECT setval('manual_documents_document_id_seq', 4);

INSERT INTO "manual_steps" ("step_id", "document_id", "step_number", "title", "content", "tips") VALUES
(1, 1, 1, 'Kiem tra an ninh', 'Kiem tra camera va he thong bao dong truoc khi mo cua', 'Luu y kiem tra tat ca cac goc camera'),
(2, 1, 2, 'Bat dien va thiet bi', 'Bat dien cho toan bo cua hang va kiem tra thiet bi', 'Kiem tra tu lanh dau tien'),
(3, 1, 3, 'Chuan bi quay thu ngan', 'Mo may tinh POS va kiem tra tien mat', 'Dam bao du tien le'),
(4, 2, 1, 'Kiem tra khach con trong cua hang', 'Thong bao gio dong cua va kiem tra khach hang', NULL),
(5, 2, 2, 'Tat thiet bi va den', 'Tat cac thiet bi khong can thiet', 'Giu lai den bao ve'),
(6, 2, 3, 'Khoa cua va bat bao dong', 'Khoa tat ca cac cua va bat he thong bao dong', NULL);

SELECT setval('manual_steps_step_id_seq', 6);

-- ============================================
-- NOTIFICATIONS DATA
-- ============================================

INSERT INTO "notifications" ("recipient_staff_id", "sender_staff_id", "notification_type", "title", "message", "is_read") VALUES
(3, 1, 'task_assigned', 'Task moi duoc gan', 'Ban da duoc gan task "Kiem ke hang hoa thang 12"', false),
(4, 1, 'task_assigned', 'Task moi duoc gan', 'Ban da duoc gan task "Ve sinh khu vuc thuc pham"', false),
(5, 1, 'task_assigned', 'Task moi duoc gan', 'Ban da duoc gan task "Chuan bi khuyen mai Tet"', true),
(1, NULL, 'system', 'Chao mung den voi Aoisora', 'Cam on ban da su dung he thong Aoisora', true),
(2, 1, 'shift_assigned', 'Ca lam viec moi', 'Ban da duoc phan cong ca sang ngay mai', false);

-- ============================================
-- STORE INFORMATION DATA (for Store Information Screen)
-- Based on mockStoreInfo.ts structure
-- ============================================

-- Add Store-related regions (matching mockStoreInfo.ts regionTabs)
INSERT INTO "regions" ("region_id", "region_name", "region_code", "description") VALUES
(10, 'SMBU (Store)', 'SMBU', 'Strategic Management Business Unit - Store Operations'),
(11, 'OCEAN', 'OCEAN', 'Ocean Park Area - Northern Vietnam'),
(12, 'HA NOI CENTER', 'HA_NOI_CENTER', 'Ha Noi Central Area'),
(13, 'ECO PARK', 'ECO_PARK', 'Eco Park Area - Hung Yen'),
(14, 'HA DONG', 'HA_DONG', 'Ha Dong District Area'),
(15, 'NGD', 'NGD', 'Nguyen Du Area');

SELECT setval('regions_region_id_seq', 15);

-- Add Stores for OCEAN region (region_id = 11)
INSERT INTO "stores" ("store_id", "store_name", "store_code", "region_id", "address", "phone", "email", "status") VALUES
-- Ocean Park stores
(100, 'Ocean Park S203', '3016', 11, 'S203 Ocean Park, Gia Lam, Ha Noi', '024-8888-3016', 'oceanpark203@aoisora.com', 'active'),
(101, 'Ocean Park S201', '3014', 11, 'S201 Ocean Park, Gia Lam, Ha Noi', '024-8888-3014', 'oceanpark201@aoisora.com', 'active'),
(102, 'Ocean Park S202', '3015', 11, 'S202 Ocean Park, Gia Lam, Ha Noi', '024-8888-3015', 'oceanpark202@aoisora.com', 'active'),
(103, 'Ocean Park S204', '3017', 11, 'S204 Ocean Park, Gia Lam, Ha Noi', '024-8888-3017', 'oceanpark204@aoisora.com', 'active'),
(104, 'Ocean Park S205', '3018', 11, 'S205 Ocean Park, Gia Lam, Ha Noi', '024-8888-3018', 'oceanpark205@aoisora.com', 'active'),
-- More Ocean stores for demo
(105, 'Vinhomes Ocean Park 1', '3019', 11, 'Vinhomes Ocean Park 1, Gia Lam', '024-8888-3019', 'vop1@aoisora.com', 'active'),
(106, 'Vinhomes Ocean Park 2', '3020', 11, 'Vinhomes Ocean Park 2, Gia Lam', '024-8888-3020', 'vop2@aoisora.com', 'active'),
(107, 'Vinhomes Ocean Park 3', '3021', 11, 'Vinhomes Ocean Park 3, Gia Lam', '024-8888-3021', 'vop3@aoisora.com', 'active');

-- Add Stores for HA NOI CENTER region (region_id = 12)
INSERT INTO "stores" ("store_id", "store_name", "store_code", "region_id", "address", "phone", "email", "status") VALUES
(110, 'Vincom Ba Trieu', '2001', 12, '191 Ba Trieu, Hai Ba Trung, Ha Noi', '024-7777-2001', 'batrieu@aoisora.com', 'active'),
(111, 'Trang Tien Plaza', '2002', 12, '24 Hai Ba Trung, Hoan Kiem, Ha Noi', '024-7777-2002', 'trangtien@aoisora.com', 'active'),
(112, 'Royal City', '2003', 12, '72A Nguyen Trai, Thanh Xuan, Ha Noi', '024-7777-2003', 'royalcity@aoisora.com', 'active'),
(113, 'Times City', '2004', 12, '458 Minh Khai, Hai Ba Trung, Ha Noi', '024-7777-2004', 'timescity@aoisora.com', 'active'),
(114, 'Lotte Center', '2005', 12, '54 Lieu Giai, Ba Dinh, Ha Noi', '024-7777-2005', 'lottecenter@aoisora.com', 'active');

-- Add Stores for ECO PARK region (region_id = 13)
INSERT INTO "stores" ("store_id", "store_name", "store_code", "region_id", "address", "phone", "email", "status") VALUES
(120, 'Ecopark Grand Park', '4001', 13, 'Grand Park, Ecopark, Hung Yen', '024-6666-4001', 'grandpark@aoisora.com', 'active'),
(121, 'Ecopark Lake View', '4002', 13, 'Lake View, Ecopark, Hung Yen', '024-6666-4002', 'lakeview@aoisora.com', 'active'),
(122, 'Ecopark Sky Oasis', '4003', 13, 'Sky Oasis, Ecopark, Hung Yen', '024-6666-4003', 'skyoasis@aoisora.com', 'active');

-- Add Stores for HA DONG region (region_id = 14)
INSERT INTO "stores" ("store_id", "store_name", "store_code", "region_id", "address", "phone", "email", "status") VALUES
(130, 'The Manor Ha Dong', '5001', 14, 'The Manor, Ha Dong, Ha Noi', '024-5555-5001', 'manor@aoisora.com', 'active'),
(131, 'Ha Dong Plaza', '5002', 14, 'Ha Dong Plaza, Ha Dong, Ha Noi', '024-5555-5002', 'hadongplaza@aoisora.com', 'active'),
(132, 'Van Phu Victoria', '5003', 14, 'Van Phu Victoria, Ha Dong, Ha Noi', '024-5555-5003', 'vanphu@aoisora.com', 'active'),
(133, 'Duong Noi New City', '5004', 14, 'Duong Noi, Ha Dong, Ha Noi', '024-5555-5004', 'duongnoi@aoisora.com', 'active');

-- Add Stores for NGD region (region_id = 15)
INSERT INTO "stores" ("store_id", "store_name", "store_code", "region_id", "address", "phone", "email", "status") VALUES
(140, 'Nguyen Du Center', '6001', 15, '16 Nguyen Du, Hai Ba Trung, Ha Noi', '024-4444-6001', 'nguyendu@aoisora.com', 'active'),
(141, 'Le Dai Hanh Store', '6002', 15, '25 Le Dai Hanh, Hai Ba Trung, Ha Noi', '024-4444-6002', 'ledaihanh@aoisora.com', 'active');

SELECT setval('stores_store_id_seq', 141);

-- Add Store Managers and Staff (for Store Information screen)
-- Store managers for Ocean region stores
INSERT INTO "staff" ("staff_id", "staff_name", "staff_code", "username", "email", "phone", "store_id", "role", "position", "job_grade", "avatar_url", "password_hash", "status", "is_active") VALUES
-- Ocean Park S203 (store_id = 100) - Manager + 15 staff
(200, 'Hoang Huong Giang', 'SM3016', 'giang.hh', 'giang.hh@aoisora.com', '0912-345-001', 100, 'STORE_MANAGER', 'Store Manager', 'G3', '/avatars/manager-1.jpg', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active', true),
(201, 'Nguyen Van Anh', 'ST3016-01', 'anh.nv01', 'anh.nv01@aoisora.com', '0912-345-002', 100, 'STAFF', 'Sales Staff', 'G2', '/avatars/staff-1.jpg', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active', true),
(202, 'Tran Thi Binh', 'ST3016-02', 'binh.tt02', 'binh.tt02@aoisora.com', '0912-345-003', 100, 'STAFF', 'Cashier', 'G1', '/avatars/staff-2.jpg', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active', true),
(203, 'Le Van Cuong', 'ST3016-03', 'cuong.lv03', 'cuong.lv03@aoisora.com', '0912-345-004', 100, 'STAFF', 'Stock Keeper', 'G1', '/avatars/staff-3.jpg', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active', true),
(204, 'Pham Thi Dung', 'ST3016-04', 'dung.pt04', 'dung.pt04@aoisora.com', '0912-345-005', 100, 'STAFF', 'Customer Service', 'G2', NULL, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active', true),
(205, 'Hoang Van Em', 'ST3016-05', 'em.hv05', 'em.hv05@aoisora.com', '0912-345-006', 100, 'STAFF', 'Sales Staff', 'G1', NULL, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active', true),
(206, 'Nguyen Thi Phuong', 'ST3016-06', 'phuong.nt06', 'phuong.nt06@aoisora.com', '0912-345-007', 100, 'STAFF', 'Cashier', 'G1', NULL, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active', true),
(207, 'Tran Van Hai', 'ST3016-07', 'hai.tv07', 'hai.tv07@aoisora.com', '0912-345-008', 100, 'STAFF', 'Perishable Staff', 'G2', NULL, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active', true),
(208, 'Le Thi Lan', 'ST3016-08', 'lan.lt08', 'lan.lt08@aoisora.com', '0912-345-009', 100, 'STAFF', 'Grocery Staff', 'G1', NULL, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active', true),
(209, 'Pham Van Minh', 'ST3016-09', 'minh.pv09', 'minh.pv09@aoisora.com', '0912-345-010', 100, 'STAFF', 'Security', 'G1', NULL, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active', true),

-- Ocean Park S201 (store_id = 101) - Manager + staff
(210, 'Vu Thi Nga', 'SM3014', 'nga.vt', 'nga.vt@aoisora.com', '0912-345-011', 101, 'STORE_MANAGER', 'Store Manager', 'G3', '/avatars/manager-2.jpg', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active', true),
(211, 'Nguyen Van Hoang', 'ST3014-01', 'hoang.nv01', 'hoang.nv01@aoisora.com', '0912-345-012', 101, 'STAFF', 'Sales Staff', 'G2', NULL, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active', true),
(212, 'Tran Thi Kim', 'ST3014-02', 'kim.tt02', 'kim.tt02@aoisora.com', '0912-345-013', 101, 'STAFF', 'Cashier', 'G1', NULL, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active', true),

-- Ha Noi Center stores managers
(220, 'Dao Van Long', 'SM2001', 'long.dv', 'long.dv@aoisora.com', '0912-345-020', 110, 'STORE_MANAGER', 'Store Manager', 'G3', '/avatars/manager-3.jpg', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active', true),
(221, 'Nguyen Van Manh', 'ST2001-01', 'manh.nv01', 'manh.nv01@aoisora.com', '0912-345-021', 110, 'STAFF', 'Sales Staff', 'G2', NULL, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active', true),
(222, 'Le Thi Oanh', 'ST2001-02', 'oanh.lt02', 'oanh.lt02@aoisora.com', '0912-345-022', 110, 'STAFF', 'Cashier', 'G1', NULL, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active', true),

(230, 'Pham Thi Quynh', 'SM2002', 'quynh.pt', 'quynh.pt@aoisora.com', '0912-345-030', 111, 'STORE_MANAGER', 'Store Manager', 'G3', NULL, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active', true),
(231, 'Hoang Van Son', 'ST2002-01', 'son.hv01', 'son.hv01@aoisora.com', '0912-345-031', 111, 'STAFF', 'Sales Staff', 'G2', NULL, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active', true),

-- Eco Park stores managers
(240, 'Vu Van Tai', 'SM4001', 'tai.vv', 'tai.vv@aoisora.com', '0912-345-040', 120, 'STORE_MANAGER', 'Store Manager', 'G3', NULL, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active', true),
(241, 'Nguyen Thi Uyen', 'ST4001-01', 'uyen.nt01', 'uyen.nt01@aoisora.com', '0912-345-041', 120, 'STAFF', 'Sales Staff', 'G2', NULL, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active', true),

-- Ha Dong stores managers
(250, 'Tran Van Vinh', 'SM5001', 'vinh.tv', 'vinh.tv@aoisora.com', '0912-345-050', 130, 'STORE_MANAGER', 'Store Manager', 'G3', NULL, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active', true),
(251, 'Le Thi Xuan', 'ST5001-01', 'xuan.lt01', 'xuan.lt01@aoisora.com', '0912-345-051', 130, 'STAFF', 'Sales Staff', 'G2', NULL, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active', true),

-- NGD stores managers
(260, 'Pham Van Yen', 'SM6001', 'yen.pv', 'yen.pv@aoisora.com', '0912-345-060', 140, 'STORE_MANAGER', 'Store Manager', 'G3', NULL, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active', true),
(261, 'Hoang Thi Zung', 'ST6001-01', 'zung.ht01', 'zung.ht01@aoisora.com', '0912-345-061', 140, 'STAFF', 'Sales Staff', 'G2', NULL, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active', true);

SELECT setval('staff_staff_id_seq', 261);

-- Update stores with manager_id references
UPDATE "stores" SET "manager_id" = 200 WHERE "store_id" = 100;
UPDATE "stores" SET "manager_id" = 210 WHERE "store_id" = 101;
UPDATE "stores" SET "manager_id" = 220 WHERE "store_id" = 110;
UPDATE "stores" SET "manager_id" = 230 WHERE "store_id" = 111;
UPDATE "stores" SET "manager_id" = 240 WHERE "store_id" = 120;
UPDATE "stores" SET "manager_id" = 250 WHERE "store_id" = 130;
UPDATE "stores" SET "manager_id" = 260 WHERE "store_id" = 140;

-- Add Store-level departments (departments that appear under stores in Store Information)
-- These are different from SMBU departments - they represent store operational areas
INSERT INTO "departments" ("department_id", "department_name", "department_code", "description", "parent_id", "sort_order", "icon", "icon_color", "icon_bg") VALUES
(200, 'ZEN PARK', 'ZENPARK', 'Zen Park Store Area', NULL, 1, 'park', '#109A4A', 'rgba(16, 154, 74, 0.1)'),
(201, 'CONTROL', 'STORE-CONTROL', 'Store Control Department', NULL, 2, 'control', '#7C3AED', 'rgba(124, 58, 237, 0.1)'),
(202, 'IMPROVEMENT', 'STORE-IMPROVEMENT', 'Store Improvement Department', NULL, 3, 'rocket', '#2563EB', 'rgba(37, 99, 235, 0.1)'),
(203, 'HR', 'STORE-HR', 'Store HR Department', NULL, 4, 'hr', '#E11D48', 'rgba(225, 29, 72, 0.1)');

SELECT setval('departments_department_id_seq', 203);

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

SELECT 'REGIONS' AS table_name, COUNT(*) AS count FROM regions
UNION ALL SELECT 'DEPARTMENTS', COUNT(*) FROM departments
UNION ALL SELECT 'STORES', COUNT(*) FROM stores
UNION ALL SELECT 'STAFF', COUNT(*) FROM staff
UNION ALL SELECT 'TASKS', COUNT(*) FROM tasks
UNION ALL SELECT 'TASK_WORKFLOW_STEPS', COUNT(*) FROM task_workflow_steps
UNION ALL SELECT 'TASK_STORE_RESULTS', COUNT(*) FROM task_store_results
UNION ALL SELECT 'TASK_STAFF_RESULTS', COUNT(*) FROM task_staff_results
UNION ALL SELECT 'TASK_IMAGES', COUNT(*) FROM task_images
UNION ALL SELECT 'TASK_COMMENTS', COUNT(*) FROM task_comments
UNION ALL SELECT 'TASK_LIKES', COUNT(*) FROM task_likes
UNION ALL SELECT 'TASK_GROUPS', COUNT(*) FROM task_groups
UNION ALL SELECT 'SHIFT_CODES', COUNT(*) FROM shift_codes
UNION ALL SELECT 'SHIFT_ASSIGNMENTS', COUNT(*) FROM shift_assignments
UNION ALL SELECT 'DAILY_SCHEDULE_TASKS', COUNT(*) FROM daily_schedule_tasks
UNION ALL SELECT 'NOTIFICATIONS', COUNT(*) FROM notifications
UNION ALL SELECT 'MANUAL_FOLDERS', COUNT(*) FROM manual_folders
UNION ALL SELECT 'MANUAL_DOCUMENTS', COUNT(*) FROM manual_documents;

-- ============================================
-- DONE
-- ============================================
