-- ============================================
-- Seed Data: 300 Stores (Additional)
-- Database: MySQL 8.4
-- Created: 2026-01-21
-- Purpose: Add ~284 NEW stores across 14 areas
-- Note: All store_codes use "N_" prefix to avoid duplicates
-- ============================================

-- ============================================
-- HANOI - LONG BIEN DISTRICT (Area ID: 1)
-- Adding 20 new stores
-- ============================================
INSERT INTO `stores` (`store_name`, `store_code`, `area_id`, `address`, `status`, `is_active`, `sort_order`) VALUES
('AEON Long Bien 3', 'N_AEON_LB3', 1, '29 Co Linh Extension, Long Bien, Ha Noi', 'active', 1, 102),
('MaxValu Long Bien 2', 'N_MV_LB2', 1, 'Vincom Long Bien 2, Ha Noi', 'active', 1, 103),
('MaxValu Ngoc Lam 2', 'N_MV_NL2', 1, '125 Ngoc Lam, Long Bien', 'active', 1, 104),
('GS25 Long Bien 06', 'N_GS_LB06', 1, '100 Co Linh, Long Bien', 'active', 1, 105),
('GS25 Long Bien 07', 'N_GS_LB07', 1, '110 Ngoc Lam, Long Bien', 'active', 1, 106),
('GS25 Long Bien 08', 'N_GS_LB08', 1, '120 Nguyen Van Cu, Long Bien', 'active', 1, 107),
('GS25 Long Bien 09', 'N_GS_LB09', 1, '130 Nguyen Son, Long Bien', 'active', 1, 108),
('GS25 Long Bien 10', 'N_GS_LB10', 1, '140 Bo De, Long Bien', 'active', 1, 109),
('AEON Vinhomes Ocean Park', 'N_AEON_VOP', 1, 'Vinhomes Ocean Park, Gia Lam', 'active', 1, 110),
('MaxValu Gia Lam 2', 'N_MV_GL2', 1, 'Gia Lam New Town, Ha Noi', 'active', 1, 111),
('GS25 Gia Lam 03', 'N_GS_GL03', 1, '30 Yen Vien, Gia Lam', 'active', 1, 112),
('GS25 Gia Lam 04', 'N_GS_GL04', 1, '40 Duc Giang, Gia Lam', 'active', 1, 113),
('AEON Express Long Bien 03', 'N_AE_LB03', 1, 'Sai Dong New, Long Bien', 'active', 1, 114),
('AEON Express Long Bien 04', 'N_AE_LB04', 1, 'Viet Hung New, Long Bien', 'active', 1, 115),
('MaxValu Sai Dong 2', 'N_MV_SD2', 1, 'Sai Dong Urban 2, Long Bien', 'active', 1, 116),
('GS25 Sai Dong 03', 'N_GS_SD03', 1, 'Sai Dong Tower, Long Bien', 'active', 1, 117),
('GS25 Sai Dong 04', 'N_GS_SD04', 1, 'Sai Dong Mall, Long Bien', 'active', 1, 118),
('MaxValu Thach Ban 2', 'N_MV_TB2', 1, 'Thach Ban New, Long Bien', 'active', 1, 119),
('GS25 Thach Ban 03', 'N_GS_TB03', 1, '45 Thach Ban, Long Bien', 'active', 1, 120),
('GS25 Thach Ban 04', 'N_GS_TB04', 1, '60 Thach Ban, Long Bien', 'active', 1, 121);

-- ============================================
-- HANOI - HA DONG DISTRICT (Area ID: 2)
-- Adding 20 new stores
-- ============================================
INSERT INTO `stores` (`store_name`, `store_code`, `area_id`, `address`, `status`, `is_active`, `sort_order`) VALUES
('AEON Ha Dong 3', 'N_AEON_HD3', 2, 'Duong Noi New Extension, Ha Dong', 'active', 1, 102),
('MaxValu Ha Dong 2', 'N_MV_HD2', 2, 'Van Quan 2, Ha Dong', 'active', 1, 103),
('MaxValu Mo Lao 2', 'N_MV_ML2', 2, 'Mo Lao Tower, Ha Dong', 'active', 1, 104),
('GS25 Ha Dong 06', 'N_GS_HD06', 2, '223 Quang Trung, Ha Dong', 'active', 1, 105),
('GS25 Ha Dong 07', 'N_GS_HD07', 2, '556 Nguyen Trai, Ha Dong', 'active', 1, 106),
('GS25 Ha Dong 08', 'N_GS_HD08', 2, '889 Le Trong Tan, Ha Dong', 'active', 1, 107),
('GS25 Ha Dong 09', 'N_GS_HD09', 2, '201 Tran Phu, Ha Dong', 'active', 1, 108),
('GS25 Ha Dong 10', 'N_GS_HD10', 2, '302 Ba La, Ha Dong', 'active', 1, 109),
('AEON Express Ha Dong 03', 'N_AE_HD03', 2, 'Van Phu 2, Ha Dong', 'active', 1, 110),
('AEON Express Ha Dong 04', 'N_AE_HD04', 2, 'Phu La 2, Ha Dong', 'active', 1, 111),
('MaxValu Van Phu 2', 'N_MV_VP2', 2, 'Van Phu Urban 2, Ha Dong', 'active', 1, 112),
('GS25 Van Phu 03', 'N_GS_VP03', 2, 'Van Phu Tower 2, Ha Dong', 'active', 1, 113),
('GS25 Van Phu 04', 'N_GS_VP04', 2, 'Van Phu Center 2, Ha Dong', 'active', 1, 114),
('MaxValu Duong Noi 2', 'N_MV_DN2', 2, 'Duong Noi Center 2, Ha Dong', 'active', 1, 115),
('GS25 Duong Noi 03', 'N_GS_DN03', 2, 'An Vuong Villa 2, Ha Dong', 'active', 1, 116),
('GS25 Duong Noi 04', 'N_GS_DN04', 2, 'Duong Noi Plaza 2, Ha Dong', 'active', 1, 117),
('AEON Kien Hung 2', 'N_AEON_KH2', 2, 'Kien Hung New, Ha Dong', 'active', 1, 118),
('GS25 Kien Hung 03', 'N_GS_KH03', 2, 'The Manor 2, Ha Dong', 'active', 1, 119),
('GS25 Kien Hung 04', 'N_GS_KH04', 2, 'Green Bay 2, Ha Dong', 'active', 1, 120),
('MaxValu La Khe 2', 'N_MV_LK2', 2, 'La Khe New, Ha Dong', 'active', 1, 121);

-- ============================================
-- HANOI - CAU GIAY DISTRICT (Area ID: 3)
-- Adding 20 new stores
-- ============================================
INSERT INTO `stores` (`store_name`, `store_code`, `area_id`, `address`, `status`, `is_active`, `sort_order`) VALUES
('AEON Mall Cau Giay 2', 'N_AEON_CG2', 3, 'Dich Vong Hau 2, Cau Giay', 'active', 1, 102),
('MaxValu Cau Giay 2', 'N_MV_CG2', 3, 'Tran Duy Hung 2, Cau Giay', 'active', 1, 103),
('MaxValu Dich Vong 2', 'N_MV_DV2', 3, 'Dich Vong 2, Cau Giay', 'active', 1, 104),
('GS25 Cau Giay 06', 'N_GS_CG06', 3, '115 Xuan Thuy, Cau Giay', 'active', 1, 105),
('GS25 Cau Giay 07', 'N_GS_CG07', 3, '130 Cau Giay, Cau Giay', 'active', 1, 106),
('GS25 Cau Giay 08', 'N_GS_CG08', 3, '145 Tran Duy Hung, Cau Giay', 'active', 1, 107),
('GS25 Cau Giay 09', 'N_GS_CG09', 3, '160 Nguyen Phong Sac, Cau Giay', 'active', 1, 108),
('GS25 Cau Giay 10', 'N_GS_CG10', 3, '175 Pham Hung, Cau Giay', 'active', 1, 109),
('AEON Express Cau Giay 03', 'N_AE_CG03', 3, 'My Dinh 2, Cau Giay', 'active', 1, 110),
('AEON Express Cau Giay 04', 'N_AE_CG04', 3, 'Mai Dich 2, Cau Giay', 'active', 1, 111),
('MaxValu My Dinh 2', 'N_MV_MD2', 3, 'My Dinh Plaza 2, Cau Giay', 'active', 1, 112),
('GS25 My Dinh 04', 'N_GS_MD04', 3, 'My Dinh 3, Cau Giay', 'active', 1, 113),
('GS25 My Dinh 05', 'N_GS_MD05', 3, 'My Dinh 4, Cau Giay', 'active', 1, 114),
('GS25 My Dinh 06', 'N_GS_MD06', 3, 'Song Da Tower 2, Cau Giay', 'active', 1, 115),
('AEON Nghia Tan 2', 'N_AEON_NT2', 3, 'Nghia Tan 2, Cau Giay', 'active', 1, 116),
('MaxValu Nghia Tan 2', 'N_MV_NT2', 3, 'Nghia Tan Center 2, Cau Giay', 'active', 1, 117),
('GS25 Nghia Tan 03', 'N_GS_NT03', 3, 'Nghia Do 2, Cau Giay', 'active', 1, 118),
('GS25 Nghia Tan 04', 'N_GS_NT04', 3, 'Co Nhue 2, Cau Giay', 'active', 1, 119),
('AEON Express Trung Hoa 2', 'N_AE_TH2', 3, 'Trung Hoa Nhan Chinh 2', 'active', 1, 120),
('GS25 Trung Hoa 03', 'N_GS_TH03', 3, 'Trung Hoa 2, Cau Giay', 'active', 1, 121);

-- ============================================
-- BAC NINH CITY (Area ID: 4)
-- Adding 20 new stores
-- ============================================
INSERT INTO `stores` (`store_name`, `store_code`, `area_id`, `address`, `status`, `is_active`, `sort_order`) VALUES
('AEON Mall Bac Ninh 2', 'N_AEON_BN2', 4, 'VSIP Bac Ninh 2', 'active', 1, 102),
('MaxValu Bac Ninh 2', 'N_MV_BN2', 4, 'Bac Ninh City Center 2', 'active', 1, 103),
('MaxValu Tu Son 2', 'N_MV_TS2', 4, 'Tu Son Town 2, Bac Ninh', 'active', 1, 104),
('GS25 Bac Ninh 06', 'N_GS_BN06', 4, '110 Ly Thai To, Bac Ninh', 'active', 1, 105),
('GS25 Bac Ninh 07', 'N_GS_BN07', 4, '120 Nguyen Dang Dao, Bac Ninh', 'active', 1, 106),
('GS25 Bac Ninh 08', 'N_GS_BN08', 4, '130 Tran Hung Dao, Bac Ninh', 'active', 1, 107),
('GS25 Bac Ninh 09', 'N_GS_BN09', 4, '140 Le Thai To, Bac Ninh', 'active', 1, 108),
('GS25 Bac Ninh 10', 'N_GS_BN10', 4, '150 Ngo Gia Tu, Bac Ninh', 'active', 1, 109),
('AEON Express Bac Ninh 03', 'N_AE_BN03', 4, 'VSIP Bac Ninh 2', 'active', 1, 110),
('AEON Express Bac Ninh 04', 'N_AE_BN04', 4, 'Que Vo Industrial 2', 'active', 1, 111),
('MaxValu Yen Phong 2', 'N_MV_YP2', 4, 'Yen Phong Industrial 2', 'active', 1, 112),
('GS25 VSIP 04', 'N_GS_VSIP04', 4, 'VSIP Bac Ninh Zone D', 'active', 1, 113),
('GS25 VSIP 05', 'N_GS_VSIP05', 4, 'VSIP Bac Ninh Zone E', 'active', 1, 114),
('GS25 VSIP 06', 'N_GS_VSIP06', 4, 'VSIP Bac Ninh Zone F', 'active', 1, 115),
('AEON Tu Son 2', 'N_AEON_TS2', 4, 'Tu Son Industrial 2, Bac Ninh', 'active', 1, 116),
('MaxValu Tien Son 2', 'N_MV_TSN2', 4, 'Tien Son Industrial 2', 'active', 1, 117),
('GS25 Tu Son 03', 'N_GS_TS03', 4, 'Tu Son Center 2', 'active', 1, 118),
('GS25 Tu Son 04', 'N_GS_TS04', 4, 'Tu Son Market 2', 'active', 1, 119),
('AEON Express Que Vo 2', 'N_AE_QV2', 4, 'Que Vo 2, Bac Ninh', 'active', 1, 120),
('GS25 Que Vo 03', 'N_GS_QV03', 4, 'Que Vo Industrial Zone 2', 'active', 1, 121);

-- ============================================
-- HAI PHONG - HONG BANG (Area ID: 5)
-- Adding 20 new stores
-- ============================================
INSERT INTO `stores` (`store_name`, `store_code`, `area_id`, `address`, `status`, `is_active`, `sort_order`) VALUES
('AEON Mall Hai Phong 3', 'N_AEON_HP3', 5, 'Le Chan District 2, Hai Phong', 'active', 1, 102),
('MaxValu Hai Phong 2', 'N_MV_HP2', 5, 'Hong Bang Center 2', 'active', 1, 103),
('MaxValu Le Chan 2', 'N_MV_LC2', 5, 'Le Chan District 2', 'active', 1, 104),
('GS25 Hai Phong 06', 'N_GS_HP06', 5, '110 Tran Phu, Hong Bang', 'active', 1, 105),
('GS25 Hai Phong 07', 'N_GS_HP07', 5, '120 Dien Bien Phu, Hong Bang', 'active', 1, 106),
('GS25 Hai Phong 08', 'N_GS_HP08', 5, '130 Lac Long Quan, Hong Bang', 'active', 1, 107),
('GS25 Hai Phong 09', 'N_GS_HP09', 5, '140 Nguyen Duc Canh, Le Chan', 'active', 1, 108),
('GS25 Hai Phong 10', 'N_GS_HP10', 5, '150 To Hieu, Le Chan', 'active', 1, 109),
('AEON Express Hai Phong 03', 'N_AE_HP03', 5, 'Cat Hai 2, Hai Phong', 'active', 1, 110),
('AEON Express Hai Phong 04', 'N_AE_HP04', 5, 'Thuy Nguyen 2, Hai Phong', 'active', 1, 111),
('MaxValu Ngo Quyen 2', 'N_MV_NQ2', 5, 'Ngo Quyen District 2', 'active', 1, 112),
('GS25 Ngo Quyen 03', 'N_GS_NQ03', 5, 'Ngo Quyen Center 2', 'active', 1, 113),
('GS25 Ngo Quyen 04', 'N_GS_NQ04', 5, 'Lach Tray 2, Ngo Quyen', 'active', 1, 114),
('AEON Kien An 2', 'N_AEON_KA2', 5, 'Kien An District 2', 'active', 1, 115),
('MaxValu Kien An 2', 'N_MV_KA2', 5, 'Kien An Center 2', 'active', 1, 116),
('GS25 Kien An 03', 'N_GS_KA03', 5, 'Kien An Market 2', 'active', 1, 117),
('GS25 Kien An 04', 'N_GS_KA04', 5, 'Kien An Port 2', 'active', 1, 118),
('AEON Express Thuy Nguyen 2', 'N_AE_TN2', 5, 'Thuy Nguyen Industrial 2', 'active', 1, 119),
('GS25 Thuy Nguyen 03', 'N_GS_TN03', 5, 'Thuy Nguyen Town 2', 'active', 1, 120),
('GS25 Thuy Nguyen 04', 'N_GS_TN04', 5, 'Thuy Nguyen Industrial Zone 2', 'active', 1, 121);

-- ============================================
-- DA NANG - HAI CHAU (Area ID: 6)
-- Adding 20 new stores
-- ============================================
INSERT INTO `stores` (`store_name`, `store_code`, `area_id`, `address`, `status`, `is_active`, `sort_order`) VALUES
('AEON Mall Da Nang 2', 'N_AEON_DNG2', 6, 'Hai Chau 2, Da Nang', 'active', 1, 102),
('MaxValu Da Nang 2', 'N_MV_DNG2', 6, 'Nguyen Van Linh 2, Da Nang', 'active', 1, 103),
('MaxValu Hai Chau 2', 'N_MV_HC2', 6, 'Hai Chau Center 2', 'active', 1, 104),
('GS25 Da Nang 06', 'N_GS_DNG06', 6, '110 Bach Dang, Hai Chau', 'active', 1, 105),
('GS25 Da Nang 07', 'N_GS_DNG07', 6, '120 Nguyen Van Linh, Hai Chau', 'active', 1, 106),
('GS25 Da Nang 08', 'N_GS_DNG08', 6, '130 Le Duan, Hai Chau', 'active', 1, 107),
('GS25 Da Nang 09', 'N_GS_DNG09', 6, '140 Tran Phu, Hai Chau', 'active', 1, 108),
('GS25 Da Nang 10', 'N_GS_DNG10', 6, '150 Hung Vuong, Hai Chau', 'active', 1, 109),
('AEON Express Da Nang 03', 'N_AE_DNG03', 6, 'Son Tra 2, Da Nang', 'active', 1, 110),
('AEON Express Da Nang 04', 'N_AE_DNG04', 6, 'Ngu Hanh Son 2, Da Nang', 'active', 1, 111),
('MaxValu Son Tra 2', 'N_MV_ST2', 6, 'Son Tra District 2', 'active', 1, 112),
('GS25 Son Tra 04', 'N_GS_ST04', 6, 'An Thuong 2, Son Tra', 'active', 1, 113),
('GS25 Son Tra 05', 'N_GS_ST05', 6, 'Man Thai 2, Son Tra', 'active', 1, 114),
('GS25 Son Tra 06', 'N_GS_ST06', 6, 'Phuoc My 2, Son Tra', 'active', 1, 115),
('AEON My Khe 2', 'N_AEON_MK2', 6, 'My Khe Beach 2, Da Nang', 'active', 1, 116),
('MaxValu My Khe 2', 'N_MV_MK2', 6, 'My Khe Center 2', 'active', 1, 117),
('GS25 My Khe 03', 'N_GS_MK03', 6, 'My Khe Beach Street 2', 'active', 1, 118),
('GS25 My Khe 04', 'N_GS_MK04', 6, 'Pham Van Dong 2, My Khe', 'active', 1, 119),
('AEON Express Cam Le 3', 'N_AE_CL3', 6, 'Cam Le District 2', 'active', 1, 120),
('GS25 Cam Le 05', 'N_GS_CL05', 6, 'Hoa Xuan 2, Cam Le', 'active', 1, 121);

-- ============================================
-- DA NANG - THANH KHE (Area ID: 7)
-- Adding 20 new stores
-- ============================================
INSERT INTO `stores` (`store_name`, `store_code`, `area_id`, `address`, `status`, `is_active`, `sort_order`) VALUES
('AEON Mall Thanh Khe 2', 'N_AEON_TKE2', 7, 'Thanh Khe District 2, Da Nang', 'active', 1, 102),
('MaxValu Thanh Khe 2', 'N_MV_TKE2', 7, 'Thanh Khe Center 2', 'active', 1, 103),
('MaxValu Hoa Khanh 2', 'N_MV_HK2', 7, 'Hoa Khanh Industrial 2', 'active', 1, 104),
('GS25 Thanh Khe 06', 'N_GS_TKE06', 7, '110 Dien Bien Phu, Thanh Khe', 'active', 1, 105),
('GS25 Thanh Khe 07', 'N_GS_TKE07', 7, '120 Nguyen Tat Thanh, Thanh Khe', 'active', 1, 106),
('GS25 Thanh Khe 08', 'N_GS_TKE08', 7, '130 Le Duc Tho, Thanh Khe', 'active', 1, 107),
('GS25 Thanh Khe 09', 'N_GS_TKE09', 7, '140 Ham Nghi, Thanh Khe', 'active', 1, 108),
('GS25 Thanh Khe 10', 'N_GS_TKE10', 7, '150 Ong Ich Khiem, Thanh Khe', 'active', 1, 109),
('AEON Express Thanh Khe 03', 'N_AE_TKE03', 7, 'Tam Thuan 2, Thanh Khe', 'active', 1, 110),
('AEON Express Thanh Khe 04', 'N_AE_TKE04', 7, 'Vinh Trung 2, Thanh Khe', 'active', 1, 111),
('MaxValu Lien Chieu 2', 'N_MV_LCH2', 7, 'Lien Chieu District 2', 'active', 1, 112),
('GS25 Lien Chieu 04', 'N_GS_LCH04', 7, 'Hoa Hiep 2, Lien Chieu', 'active', 1, 113),
('GS25 Lien Chieu 05', 'N_GS_LCH05', 7, 'Hoa Minh 2, Lien Chieu', 'active', 1, 114),
('GS25 Lien Chieu 06', 'N_GS_LCH06', 7, 'Hoa Khanh Bac 2, Lien Chieu', 'active', 1, 115),
('AEON Hoa Khanh 2', 'N_AEON_HKH2', 7, 'Hoa Khanh Industrial Zone 2', 'active', 1, 116),
('MaxValu Hoa Khanh Nam 2', 'N_MV_HKN2', 7, 'Hoa Khanh Nam 2', 'active', 1, 117),
('GS25 Hoa Khanh 03', 'N_GS_HK03', 7, 'Hoa Khanh Industrial 2', 'active', 1, 118),
('GS25 Hoa Khanh 04', 'N_GS_HK04', 7, 'Hoa Khanh Bac Industrial 2', 'active', 1, 119),
('AEON Express Lien Chieu 2', 'N_AE_LCH2', 7, 'Lien Chieu Port 2', 'active', 1, 120),
('GS25 Nam O 03', 'N_GS_NO03', 7, 'Nam O Beach 2, Lien Chieu', 'active', 1, 121);

-- ============================================
-- HUE CITY (Area ID: 8)
-- Adding 20 new stores
-- ============================================
INSERT INTO `stores` (`store_name`, `store_code`, `area_id`, `address`, `status`, `is_active`, `sort_order`) VALUES
('AEON Mall Hue 3', 'N_AEON_HUE3', 8, 'Thuan An 2, Thua Thien Hue', 'active', 1, 102),
('MaxValu Hue 2', 'N_MV_HUE2', 8, 'Le Loi 2, Hue City', 'active', 1, 103),
('MaxValu Phu Hoi 2', 'N_MV_PH2', 8, 'Phu Hoi 2, Hue City', 'active', 1, 104),
('GS25 Hue 06', 'N_GS_HUE06', 8, '110 Tran Hung Dao, Hue', 'active', 1, 105),
('GS25 Hue 07', 'N_GS_HUE07', 8, '120 Le Loi, Hue', 'active', 1, 106),
('GS25 Hue 08', 'N_GS_HUE08', 8, '130 Nguyen Hue, Hue', 'active', 1, 107),
('GS25 Hue 09', 'N_GS_HUE09', 8, '140 Hung Vuong, Hue', 'active', 1, 108),
('GS25 Hue 10', 'N_GS_HUE10', 8, '150 Doi Cung, Hue', 'active', 1, 109),
('AEON Express Hue 03', 'N_AE_HUE03', 8, 'Phu Loc 2, Thua Thien Hue', 'active', 1, 110),
('AEON Express Hue 04', 'N_AE_HUE04', 8, 'Huong Thuy 2, Thua Thien Hue', 'active', 1, 111),
('MaxValu Phu Vang 2', 'N_MV_PV2', 8, 'Phu Vang District 2', 'active', 1, 112),
('GS25 Phu Vang 03', 'N_GS_PV03', 8, 'Thuan An Beach 2, Phu Vang', 'active', 1, 113),
('GS25 Phu Vang 04', 'N_GS_PV04', 8, 'Phu Da 2, Phu Vang', 'active', 1, 114),
('AEON Huong Thuy 2', 'N_AEON_HTY2', 8, 'Huong Thuy Town 2', 'active', 1, 115),
('MaxValu Huong Thuy 2', 'N_MV_HTY2', 8, 'Huong Thuy Center 2', 'active', 1, 116),
('GS25 Huong Thuy 03', 'N_GS_HTY03', 8, 'Phu Bai 2, Huong Thuy', 'active', 1, 117),
('GS25 Huong Thuy 04', 'N_GS_HTY04', 8, 'Thuy Van 2, Huong Thuy', 'active', 1, 118),
('AEON Express Phu Loc 2', 'N_AE_PL2', 8, 'Lang Co Beach 2, Phu Loc', 'active', 1, 119),
('GS25 Phu Loc 03', 'N_GS_PL03', 8, 'Lang Co 2, Phu Loc', 'active', 1, 120),
('GS25 Phu Loc 04', 'N_GS_PL04', 8, 'Chan May 2, Phu Loc', 'active', 1, 121);

-- ============================================
-- HOI AN CITY (Area ID: 9)
-- Adding 20 new stores
-- ============================================
INSERT INTO `stores` (`store_name`, `store_code`, `area_id`, `address`, `status`, `is_active`, `sort_order`) VALUES
('AEON Mall Hoi An 2', 'N_AEON_HA2', 9, 'Cam Ha 2, Hoi An', 'active', 1, 102),
('MaxValu Hoi An 2', 'N_MV_HA2', 9, 'Cua Dai 2, Hoi An', 'active', 1, 103),
('MaxValu An Bang 2', 'N_MV_AB2', 9, 'An Bang Beach 2, Hoi An', 'active', 1, 104),
('GS25 Hoi An 06', 'N_GS_HA06', 9, '110 Tran Phu, Hoi An', 'active', 1, 105),
('GS25 Hoi An 07', 'N_GS_HA07', 9, '120 Nguyen Thai Hoc, Hoi An', 'active', 1, 106),
('GS25 Hoi An 08', 'N_GS_HA08', 9, '130 Le Loi, Hoi An', 'active', 1, 107),
('GS25 Hoi An 09', 'N_GS_HA09', 9, '140 Hai Ba Trung, Hoi An', 'active', 1, 108),
('GS25 Hoi An 10', 'N_GS_HA10', 9, '150 Phan Chu Trinh, Hoi An', 'active', 1, 109),
('AEON Express Hoi An 03', 'N_AE_HA03', 9, 'Cua Dai Beach 2, Hoi An', 'active', 1, 110),
('AEON Express Hoi An 04', 'N_AE_HA04', 9, 'Cam Thanh 2, Hoi An', 'active', 1, 111),
('MaxValu Dien Ban 2', 'N_MV_DB2', 9, 'Dien Ban Town 2', 'active', 1, 112),
('GS25 Dien Ban 04', 'N_GS_DB04', 9, 'Vinh Dien 2, Dien Ban', 'active', 1, 113),
('GS25 Dien Ban 05', 'N_GS_DB05', 9, 'Dien Ngoc 2, Dien Ban', 'active', 1, 114),
('GS25 Dien Ban 06', 'N_GS_DB06', 9, 'Dien Duong 2, Dien Ban', 'active', 1, 115),
('AEON Tam Ky 2', 'N_AEON_TK2', 9, 'Tam Ky City 2, Quang Nam', 'active', 1, 116),
('MaxValu Tam Ky 2', 'N_MV_TK2', 9, 'Tam Ky Center 2', 'active', 1, 117),
('GS25 Tam Ky 03', 'N_GS_TK03', 9, 'Phan Chu Trinh 2, Tam Ky', 'active', 1, 118),
('GS25 Tam Ky 04', 'N_GS_TK04', 9, 'Hung Vuong 2, Tam Ky', 'active', 1, 119),
('AEON Express Chu Lai 2', 'N_AE_CHULAI2', 9, 'Chu Lai Economic Zone 2', 'active', 1, 120),
('GS25 Chu Lai 03', 'N_GS_CHULAI03', 9, 'Chu Lai Industrial 2', 'active', 1, 121);

-- ============================================
-- HCM - TAN PHU DISTRICT (Area ID: 10)
-- Adding 20 new stores
-- ============================================
INSERT INTO `stores` (`store_name`, `store_code`, `area_id`, `address`, `status`, `is_active`, `sort_order`) VALUES
('AEON Mall Tan Phu 3', 'N_AEON_TP3', 10, 'Celadon City Extension 2', 'active', 1, 102),
('MaxValu Tan Phu 3', 'N_MV_TP3', 10, 'Bo Bao Tan Thang 2', 'active', 1, 103),
('MaxValu Tan Quy 2', 'N_MV_TQ2', 10, 'Tan Quy Ward 2', 'active', 1, 104),
('GS25 Tan Phu 06', 'N_GS_TP06', 10, '110 Hoa Binh, Tan Phu', 'active', 1, 105),
('GS25 Tan Phu 07', 'N_GS_TP07', 10, '120 Le Trong Tan, Tan Phu', 'active', 1, 106),
('GS25 Tan Phu 08', 'N_GS_TP08', 10, '130 Phan Anh, Tan Phu', 'active', 1, 107),
('GS25 Tan Phu 09', 'N_GS_TP09', 10, '140 Truong Chinh, Tan Phu', 'active', 1, 108),
('GS25 Tan Phu 10', 'N_GS_TP10', 10, '150 Au Co, Tan Phu', 'active', 1, 109),
('AEON Express Tan Phu 03', 'N_AE_TP03', 10, 'Tan Son Nhi 2, Tan Phu', 'active', 1, 110),
('AEON Express Tan Phu 04', 'N_AE_TP04', 10, 'Tay Thanh 2, Tan Phu', 'active', 1, 111),
('MaxValu Son Ky 2', 'N_MV_SK2', 10, 'Son Ky 2, Tan Phu', 'active', 1, 112),
('GS25 Son Ky 04', 'N_GS_SK04', 10, 'Son Ky Ward 2', 'active', 1, 113),
('GS25 Son Ky 05', 'N_GS_SK05', 10, 'Dam Sen 2, Tan Phu', 'active', 1, 114),
('GS25 Son Ky 06', 'N_GS_SK06', 10, 'Tan Quy 2, Tan Phu', 'active', 1, 115),
('AEON Tan Thanh 2', 'N_AEON_TTH2', 10, 'Tan Thanh Ward 2', 'active', 1, 116),
('MaxValu Tan Thanh 2', 'N_MV_TTH2', 10, 'Tan Thanh Center 2', 'active', 1, 117),
('GS25 Tan Thanh 03', 'N_GS_TTH03', 10, 'Tan Thanh Market 2', 'active', 1, 118),
('GS25 Tan Thanh 04', 'N_GS_TTH04', 10, 'Tan Thanh Park 2', 'active', 1, 119),
('AEON Express Hoa Thanh 2', 'N_AE_HT2', 10, 'Hoa Thanh 2, Tan Phu', 'active', 1, 120),
('GS25 Hoa Thanh 02', 'N_GS_HT02', 10, 'Hoa Thanh Ward 2', 'active', 1, 121);

-- ============================================
-- HCM - BINH TAN DISTRICT (Area ID: 11)
-- Adding 20 new stores
-- ============================================
INSERT INTO `stores` (`store_name`, `store_code`, `area_id`, `address`, `status`, `is_active`, `sort_order`) VALUES
('AEON Mall Binh Tan 3', 'N_AEON_BT3', 11, 'Tan Tao Industrial 2', 'active', 1, 102),
('MaxValu Binh Tan 3', 'N_MV_BT3', 11, 'Le Van Quoi 2, Binh Tan', 'active', 1, 103),
('MaxValu Binh Tri Dong 2', 'N_MV_BTD2', 11, 'Binh Tri Dong 2', 'active', 1, 104),
('GS25 Binh Tan 06', 'N_GS_BT06', 11, '110 Kinh Duong Vuong, Binh Tan', 'active', 1, 105),
('GS25 Binh Tan 07', 'N_GS_BT07', 11, '120 Tan Hoa Dong, Binh Tan', 'active', 1, 106),
('GS25 Binh Tan 08', 'N_GS_BT08', 11, '130 Binh Tri Dong, Binh Tan', 'active', 1, 107),
('GS25 Binh Tan 09', 'N_GS_BT09', 11, '140 Tan Tao, Binh Tan', 'active', 1, 108),
('GS25 Binh Tan 10', 'N_GS_BT10', 11, '150 An Lac, Binh Tan', 'active', 1, 109),
('AEON Express Binh Tan 03', 'N_AE_BT03', 11, 'Binh Tri Dong A 2', 'active', 1, 110),
('AEON Express Binh Tan 04', 'N_AE_BT04', 11, 'Binh Tri Dong B 2', 'active', 1, 111),
('MaxValu Tan Tao 2', 'N_MV_TT2', 11, 'Tan Tao Industrial Zone 2', 'active', 1, 112),
('GS25 Tan Tao 04', 'N_GS_TT04', 11, 'Tan Tao A 2', 'active', 1, 113),
('GS25 Tan Tao 05', 'N_GS_TT05', 11, 'Tan Tao B 2', 'active', 1, 114),
('GS25 Tan Tao 06', 'N_GS_TT06', 11, 'Vinh Loc A 2', 'active', 1, 115),
('AEON An Lac 2', 'N_AEON_AL2', 11, 'An Lac Ward 2', 'active', 1, 116),
('MaxValu An Lac 2', 'N_MV_AL2', 11, 'An Lac Center 2', 'active', 1, 117),
('GS25 An Lac 03', 'N_GS_AL03', 11, 'An Lac A 2', 'active', 1, 118),
('GS25 An Lac 04', 'N_GS_AL04', 11, 'An Lac Market 2', 'active', 1, 119),
('AEON Express Binh Hung Hoa 2', 'N_AE_BHH2', 11, 'Binh Hung Hoa A 2', 'active', 1, 120),
('GS25 Binh Hung Hoa 02', 'N_GS_BHH02', 11, 'Binh Hung Hoa B 2', 'active', 1, 121);

-- ============================================
-- HCM - DISTRICT 7 (Area ID: 12)
-- Adding 20 new stores
-- ============================================
INSERT INTO `stores` (`store_name`, `store_code`, `area_id`, `address`, `status`, `is_active`, `sort_order`) VALUES
('AEON Mall District 7-2', 'N_AEON_Q72', 12, 'Phu My Hung 2, District 7', 'active', 1, 102),
('MaxValu District 7-3', 'N_MV_Q73', 12, 'Tan Phu 2, District 7', 'active', 1, 103),
('MaxValu Tan Hung 2', 'N_MV_TH2', 12, 'Tan Hung 2, District 7', 'active', 1, 104),
('GS25 District 7 06', 'N_GS_Q706', 12, '110 Nguyen Van Linh, District 7', 'active', 1, 105),
('GS25 District 7 07', 'N_GS_Q707', 12, '120 Nguyen Duc Canh, District 7', 'active', 1, 106),
('GS25 District 7 08', 'N_GS_Q708', 12, '130 Nguyen Thi Thap, District 7', 'active', 1, 107),
('GS25 District 7 09', 'N_GS_Q709', 12, '140 Pham Thai Buong, District 7', 'active', 1, 108),
('GS25 District 7 10', 'N_GS_Q710', 12, '150 Ha Huy Tap, District 7', 'active', 1, 109),
('AEON Express District 7-03', 'N_AE_Q703', 12, 'Tan Hung 2, District 7', 'active', 1, 110),
('AEON Express District 7-04', 'N_AE_Q704', 12, 'Tan Quy 2, District 7', 'active', 1, 111),
('MaxValu Phu My Hung 2', 'N_MV_PMH2', 12, 'Phu My Hung Center 2', 'active', 1, 112),
('GS25 Phu My Hung 04', 'N_GS_PMH04', 12, 'Sky Garden 2, PMH', 'active', 1, 113),
('GS25 Phu My Hung 05', 'N_GS_PMH05', 12, 'Midtown 2, PMH', 'active', 1, 114),
('GS25 Phu My Hung 06', 'N_GS_PMH06', 12, 'Happy Valley 2, PMH', 'active', 1, 115),
('AEON Tan Phong 2', 'N_AEON_TPG2', 12, 'Tan Phong Ward 2', 'active', 1, 116),
('MaxValu Tan Phong 2', 'N_MV_TPG2', 12, 'Tan Phong Center 2', 'active', 1, 117),
('GS25 Tan Phong 03', 'N_GS_TPG03', 12, 'Sunrise City 2', 'active', 1, 118),
('GS25 Tan Phong 04', 'N_GS_TPG04', 12, 'The Crescent 2', 'active', 1, 119),
('AEON Express Nha Be 2', 'N_AE_NB2', 12, 'Nha Be District 2', 'active', 1, 120),
('GS25 Nha Be 01', 'N_GS_NB01', 12, 'Nha Be Town', 'active', 1, 121);

-- ============================================
-- BINH DUONG - THUAN AN (Area ID: 13)
-- Adding 20 new stores
-- ============================================
INSERT INTO `stores` (`store_name`, `store_code`, `area_id`, `address`, `status`, `is_active`, `sort_order`) VALUES
('AEON Mall Binh Duong 3', 'N_AEON_BD3', 13, 'VSIP 2 Binh Duong 2', 'active', 1, 102),
('MaxValu Binh Duong 2', 'N_MV_BD2', 13, 'Thuan An Center 2', 'active', 1, 103),
('MaxValu Di An 2', 'N_MV_DA2', 13, 'Di An City 2', 'active', 1, 104),
('GS25 Thuan An 06', 'N_GS_TA06', 13, '110 Binh Duong Boulevard, Thuan An', 'active', 1, 105),
('GS25 Thuan An 07', 'N_GS_TA07', 13, '120 Le Hong Phong, Thuan An', 'active', 1, 106),
('GS25 Thuan An 08', 'N_GS_TA08', 13, '130 Nguyen Van Tiet, Thuan An', 'active', 1, 107),
('GS25 Thuan An 09', 'N_GS_TA09', 13, '140 Thuan Giao, Thuan An', 'active', 1, 108),
('GS25 Thuan An 10', 'N_GS_TA10', 13, '150 Binh Hoa, Thuan An', 'active', 1, 109),
('AEON Express Thuan An 03', 'N_AE_TA03', 13, 'VSIP 1 2, Thuan An', 'active', 1, 110),
('AEON Express Thuan An 04', 'N_AE_TA04', 13, 'An Phu 2, Thuan An', 'active', 1, 111),
('MaxValu VSIP 2', 'N_MV_VSIP2', 13, 'VSIP Industrial Zone 2', 'active', 1, 112),
('GS25 VSIP BD 03', 'N_GS_VSIPBD03', 13, 'VSIP 1 Zone C', 'active', 1, 113),
('GS25 VSIP BD 04', 'N_GS_VSIPBD04', 13, 'VSIP 1 Zone D', 'active', 1, 114),
('AEON Di An 2', 'N_AEON_DA2', 13, 'Di An City Center 2', 'active', 1, 115),
('MaxValu Di An 3', 'N_MV_DA3', 13, 'Di An Industrial 2', 'active', 1, 116),
('GS25 Di An 03', 'N_GS_DA03', 13, 'Di An Market 2', 'active', 1, 117),
('GS25 Di An 04', 'N_GS_DA04', 13, 'Song Than Industrial 2', 'active', 1, 118),
('AEON Express Binh Hoa 2', 'N_AE_BH2', 13, 'Binh Hoa 2, Thuan An', 'active', 1, 119),
('GS25 Binh Hoa 03', 'N_GS_BH03', 13, 'Binh Hoa Center 2', 'active', 1, 120),
('GS25 Binh Hoa 04', 'N_GS_BH04', 13, 'Binh Hoa Industrial 2', 'active', 1, 121);

-- ============================================
-- DONG NAI - BIEN HOA (Area ID: 14)
-- Adding 20 new stores
-- ============================================
INSERT INTO `stores` (`store_name`, `store_code`, `area_id`, `address`, `status`, `is_active`, `sort_order`) VALUES
('AEON Mall Bien Hoa 2', 'N_AEON_BHA2', 14, 'Long Binh Tan 2, Bien Hoa', 'active', 1, 102),
('MaxValu Bien Hoa 2', 'N_MV_BHA2', 14, 'Bien Hoa City Center 2', 'active', 1, 103),
('MaxValu Long Thanh 2', 'N_MV_LT2', 14, 'Long Thanh District 2', 'active', 1, 104),
('GS25 Bien Hoa 06', 'N_GS_BHA06', 14, '110 Phan Trung, Bien Hoa', 'active', 1, 105),
('GS25 Bien Hoa 07', 'N_GS_BHA07', 14, '120 Nguyen Ai Quoc, Bien Hoa', 'active', 1, 106),
('GS25 Bien Hoa 08', 'N_GS_BHA08', 14, '130 Vo Thi Sau, Bien Hoa', 'active', 1, 107),
('GS25 Bien Hoa 09', 'N_GS_BHA09', 14, '140 Ha Huy Giap, Bien Hoa', 'active', 1, 108),
('GS25 Bien Hoa 10', 'N_GS_BHA10', 14, '150 Dong Khoi, Bien Hoa', 'active', 1, 109),
('AEON Express Bien Hoa 03', 'N_AE_BHA03', 14, 'Tan Phong 2, Bien Hoa', 'active', 1, 110),
('AEON Express Bien Hoa 04', 'N_AE_BHA04', 14, 'Tan Hiep 2, Bien Hoa', 'active', 1, 111),
('MaxValu Amata 2', 'N_MV_AM2', 14, 'Amata Industrial Zone 2', 'active', 1, 112),
('GS25 Amata 03', 'N_GS_AM03', 14, 'Amata Zone C', 'active', 1, 113),
('GS25 Amata 04', 'N_GS_AM04', 14, 'Amata Zone D', 'active', 1, 114),
('AEON Long Thanh 2', 'N_AEON_LT2', 14, 'Long Thanh Town 2', 'active', 1, 115),
('MaxValu Long Thanh 3', 'N_MV_LT3', 14, 'Long Thanh Airport 2', 'active', 1, 116),
('GS25 Long Thanh 03', 'N_GS_LT03', 14, 'Long Thanh Market 2', 'active', 1, 117),
('GS25 Long Thanh 04', 'N_GS_LT04', 14, 'Long Thanh Industrial 2', 'active', 1, 118),
('AEON Express Nhon Trach 2', 'N_AE_NT3', 14, 'Nhon Trach District 2', 'active', 1, 119),
('GS25 Nhon Trach 03', 'N_GS_NT203', 14, 'Nhon Trach Industrial 2', 'active', 1, 120),
('GS25 Nhon Trach 04', 'N_GS_NT204', 14, 'Nhon Trach Town 2', 'active', 1, 121);

-- ============================================
-- VERIFICATION
-- ============================================
-- SELECT
--     r.region_name,
--     z.zone_name,
--     a.area_name,
--     COUNT(s.store_id) as store_count
-- FROM regions r
-- JOIN zones z ON r.region_id = z.region_id
-- JOIN areas a ON z.zone_id = a.zone_id
-- LEFT JOIN stores s ON a.area_id = s.area_id
-- WHERE r.is_active = 1 AND z.is_active = 1 AND a.is_active = 1
-- GROUP BY r.region_id, z.zone_id, a.area_id
-- ORDER BY r.sort_order, z.sort_order, a.sort_order;
