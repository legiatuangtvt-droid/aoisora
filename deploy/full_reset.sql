-- MySQL dump 10.13  Distrib 8.4.3, for Win64 (x86_64)
--
-- Host: localhost    Database: auraorie68aa_aoisora
-- ------------------------------------------------------
-- Server version	8.4.3

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `areas`
--

DROP TABLE IF EXISTS `areas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `areas` (
  `area_id` int NOT NULL AUTO_INCREMENT,
  `area_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `area_code` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `zone_id` int NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `is_active` tinyint(1) DEFAULT '1',
  `sort_order` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`area_id`),
  UNIQUE KEY `area_code` (`area_code`),
  KEY `fk_areas_zone` (`zone_id`),
  CONSTRAINT `fk_areas_zone` FOREIGN KEY (`zone_id`) REFERENCES `zones` (`zone_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `areas`
--

LOCK TABLES `areas` WRITE;
/*!40000 ALTER TABLE `areas` DISABLE KEYS */;
INSERT INTO `areas` VALUES (1,'Long Bien','HN-LB',1,'Quận Long Biên, Hà Nội',1,1,'2026-01-22 01:42:52','2026-01-22 03:02:14'),(2,'Ha Dong','HN-HD',1,'Quận Hà Đông, Hà Nội',1,2,'2026-01-22 01:42:52','2026-01-22 03:02:14'),(3,'Cau Giay','HN-CG',1,'Quận Cầu Giấy, Hà Nội',1,3,'2026-01-22 01:42:52','2026-01-22 03:02:14'),(4,'Bac Ninh','BN-TP',2,'Thành phố Bắc Ninh',1,4,'2026-01-22 01:42:52','2026-01-22 03:02:14'),(5,'Hong Bang','HP-HB',2,'Quận Hồng Bàng, Hải Phòng',1,5,'2026-01-22 01:42:52','2026-01-22 03:02:14'),(6,'Hai Chau','DN-HC',3,'Quận Hải Châu, Đà Nẵng',1,6,'2026-01-22 01:42:52','2026-01-22 03:02:14'),(7,'Thanh Khe','DN-TK',3,'Quận Thanh Khê, Đà Nẵng',1,7,'2026-01-22 01:42:52','2026-01-22 03:02:14'),(8,'Hue City','HUE-TP',4,'Thành phố Huế',1,8,'2026-01-22 01:42:52','2026-01-22 03:02:14'),(9,'Hoi An','QN-HA',4,'Thành phố Hội An, Quảng Nam',1,9,'2026-01-22 01:42:52','2026-01-22 03:02:14'),(10,'Tan Phu','HCM-TP',5,'Quận Tân Phú, TP.HCM',1,10,'2026-01-22 01:42:52','2026-01-22 03:02:14'),(11,'Binh Tan','HCM-BT',5,'Quận Bình Tân, TP.HCM',1,11,'2026-01-22 01:42:52','2026-01-22 03:02:14'),(12,'District 7','HCM-GV',5,'Quận Gò Vấp, TP.HCM',1,12,'2026-01-22 01:42:52','2026-01-22 03:02:14'),(13,'Thuan An','BD-TA',6,'Thị xã Thuận An, Bình Dương',1,13,'2026-01-22 01:42:52','2026-01-22 03:02:14'),(14,'Bien Hoa','DN-BH',6,'Thành phố Biên Hòa, Đồng Nai',1,14,'2026-01-22 01:42:52','2026-01-22 03:02:14'),(15,'Long Thanh','BD-DA',6,'Thị xã Dĩ An, Bình Dương',1,15,'2026-01-22 01:42:52','2026-01-22 03:02:14');
/*!40000 ALTER TABLE `areas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `check_lists`
--

DROP TABLE IF EXISTS `check_lists`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `check_lists` (
  `check_list_id` int NOT NULL AUTO_INCREMENT,
  `check_list_name` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`check_list_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `check_lists`
--

LOCK TABLES `check_lists` WRITE;
/*!40000 ALTER TABLE `check_lists` DISABLE KEYS */;
INSERT INTO `check_lists` VALUES (1,'Kiểm tra hàng tồn kho','Đếm và kiểm tra số lượng hàng tồn',1,'2026-01-22 01:42:52'),(2,'Vệ sinh kệ hàng','Lau dọn và sắp xếp kệ hàng',1,'2026-01-22 01:42:52'),(3,'Kiểm tra hạn sử dụng','Kiểm tra và loại bỏ hàng hết hạn',1,'2026-01-22 01:42:52'),(4,'Bổ sung hàng lên kệ','Đưa hàng từ kho lên kệ trưng bày',1,'2026-01-22 01:42:52'),(5,'Kiểm tra giá niêm yết','Đảm bảo giá niêm yết chính xác',1,'2026-01-22 01:42:52'),(6,'Kiểm tra PCCC','Kiểm tra thiết bị phòng cháy chữa cháy',1,'2026-01-22 01:42:52'),(7,'Vệ sinh khu vực POS','Dọn dẹp khu vực thu ngân',1,'2026-01-22 01:42:52'),(8,'Kiểm tra máy POS','Kiểm tra hoạt động máy POS',1,'2026-01-22 01:42:52');
/*!40000 ALTER TABLE `check_lists` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `code_master`
--

DROP TABLE IF EXISTS `code_master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `code_master` (
  `code_master_id` int NOT NULL AUTO_INCREMENT,
  `code_type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `sort_order` int DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`code_master_id`),
  UNIQUE KEY `code_master_code_type_code_key` (`code_type`,`code`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `code_master`
--

LOCK TABLES `code_master` WRITE;
/*!40000 ALTER TABLE `code_master` DISABLE KEYS */;
INSERT INTO `code_master` VALUES (1,'task_type','STATISTICS','Statistics',NULL,1,1,'2026-01-22 01:42:52'),(2,'task_type','ARRANGE','Arrange',NULL,2,1,'2026-01-22 01:42:52'),(3,'task_type','PREPARE','Prepare',NULL,3,1,'2026-01-22 01:42:52'),(4,'response_type','PICTURE','Picture',NULL,1,1,'2026-01-22 01:42:52'),(5,'response_type','CHECKLIST','Checklist',NULL,2,1,'2026-01-22 01:42:52'),(6,'response_type','YESNO','Yes/No',NULL,3,1,'2026-01-22 01:42:52'),(7,'status','NOT_YET','Not Yet',NULL,4,1,'2026-01-22 01:42:52'),(8,'status','ON_PROGRESS','On Progress',NULL,5,1,'2026-01-22 01:42:52'),(9,'status','DONE','Done',NULL,6,1,'2026-01-22 01:42:52'),(10,'status','OVERDUE','Overdue',NULL,3,1,'2026-01-22 01:42:52'),(11,'status','REJECT','Reject',NULL,7,1,'2026-01-22 01:42:52'),(12,'status','DRAFT','Draft',NULL,2,1,'2026-01-22 01:42:52'),(13,'status','APPROVE','Approve',NULL,1,1,'2026-01-22 01:42:52');
/*!40000 ALTER TABLE `code_master` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `daily_schedule_tasks`
--

DROP TABLE IF EXISTS `daily_schedule_tasks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `daily_schedule_tasks` (
  `schedule_task_id` int NOT NULL AUTO_INCREMENT,
  `staff_id` int DEFAULT NULL,
  `store_id` int DEFAULT NULL,
  `schedule_date` date NOT NULL,
  `group_id` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `task_code` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `task_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `status` int DEFAULT '1',
  `completed_at` timestamp NULL DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`schedule_task_id`),
  KEY `idx_daily_schedule_staff` (`staff_id`),
  KEY `idx_daily_schedule_date` (`schedule_date`),
  KEY `idx_daily_schedule_store` (`store_id`),
  KEY `idx_daily_schedule_group` (`group_id`),
  CONSTRAINT `fk_daily_schedule_group` FOREIGN KEY (`group_id`) REFERENCES `task_groups` (`group_id`),
  CONSTRAINT `fk_daily_schedule_staff` FOREIGN KEY (`staff_id`) REFERENCES `staff` (`staff_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_daily_schedule_store` FOREIGN KEY (`store_id`) REFERENCES `stores` (`store_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `daily_schedule_tasks`
--

LOCK TABLES `daily_schedule_tasks` WRITE;
/*!40000 ALTER TABLE `daily_schedule_tasks` DISABLE KEYS */;
/*!40000 ALTER TABLE `daily_schedule_tasks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `daily_templates`
--

DROP TABLE IF EXISTS `daily_templates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `daily_templates` (
  `template_id` int NOT NULL AUTO_INCREMENT,
  `template_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `template_data` json DEFAULT NULL,
  `applied_stores` json DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`template_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `daily_templates`
--

LOCK TABLES `daily_templates` WRITE;
/*!40000 ALTER TABLE `daily_templates` DISABLE KEYS */;
/*!40000 ALTER TABLE `daily_templates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `departments`
--

DROP TABLE IF EXISTS `departments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `departments` (
  `department_id` int NOT NULL AUTO_INCREMENT,
  `department_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `department_code` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `parent_id` int DEFAULT NULL,
  `sort_order` int DEFAULT '0',
  `icon` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `icon_color` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `icon_bg` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`department_id`),
  UNIQUE KEY `department_code` (`department_code`),
  KEY `fk_departments_parent` (`parent_id`),
  CONSTRAINT `fk_departments_parent` FOREIGN KEY (`parent_id`) REFERENCES `departments` (`department_id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `departments`
-- Structure: 6 parent departments (OP, Admin, Control, Improvement, Planning, HR)
-- with child divisions under OP (5), Admin (3), and Planning (3)
--

LOCK TABLES `departments` WRITE;
/*!40000 ALTER TABLE `departments` DISABLE KEYS */;
INSERT INTO `departments` VALUES
-- Parent Departments (6)
(1,'OP','OP','Operation Department',NULL,1,'Settings','#3b82f6','#dbeafe',1,'2026-01-24 00:00:00','2026-01-24 00:00:00'),
(2,'Admin','ADMIN','Administration Department',NULL,2,'Building','#22c55e','#dcfce7',1,'2026-01-24 00:00:00','2026-01-24 00:00:00'),
(3,'Control','CTRL','Control Department',NULL,3,'Shield','#f59e0b','#fef3c7',1,'2026-01-24 00:00:00','2026-01-24 00:00:00'),
(4,'Improvement','IMP','Improvement Department',NULL,4,'TrendingUp','#8b5cf6','#ede9fe',1,'2026-01-24 00:00:00','2026-01-24 00:00:00'),
(5,'Planning','PLAN','Planning Department',NULL,5,'Calendar','#ec4899','#fce7f3',1,'2026-01-24 00:00:00','2026-01-24 00:00:00'),
(6,'HR','HR','Human Resources Department',NULL,6,'Users','#06b6d4','#cffafe',1,'2026-01-24 00:00:00','2026-01-24 00:00:00'),
-- Child Divisions under OP (5)
(7,'Perisable','PERI','Perisable Division',1,1,'Leaf','#10b981','#d1fae5',1,'2026-01-24 00:00:00','2026-01-24 00:00:00'),
(8,'Grocery','GRO','Grocery Division',1,2,'ShoppingCart','#6366f1','#e0e7ff',1,'2026-01-24 00:00:00','2026-01-24 00:00:00'),
(9,'Delica','Delica','Delica Division',1,3,'Utensils','#f97316','#ffedd5',1,'2026-01-24 00:00:00','2026-01-24 00:00:00'),
(10,'D&D','D&D','D&D Division',1,4,'Gift','#a855f7','#f3e8ff',1,'2026-01-24 00:00:00','2026-01-24 00:00:00'),
(11,'CS','CS','Customer Service Division',1,5,'Headphones','#14b8a6','#ccfbf1',1,'2026-01-24 00:00:00','2026-01-24 00:00:00'),
-- Child Divisions under Admin (3)
(12,'Admin','ADM','Admin Division',2,1,'Folder','#84cc16','#ecfccb',1,'2026-01-24 00:00:00','2026-01-24 00:00:00'),
(13,'MMD','MMD','MMD Division',2,2,'Package','#eab308','#fef9c3',1,'2026-01-24 00:00:00','2026-01-24 00:00:00'),
(14,'ACC','ACC','Accounting Division',2,3,'Calculator','#22c55e','#dcfce7',1,'2026-01-24 00:00:00','2026-01-24 00:00:00'),
-- Child Divisions under Planning (3)
(15,'MKT','MKT','Marketing Division',5,1,'Megaphone','#ec4899','#fce7f3',1,'2026-01-24 00:00:00','2026-01-24 00:00:00'),
(16,'SPA','SPA','SPA Division',5,2,'Sparkles','#f472b6','#fce7f3',1,'2026-01-24 00:00:00','2026-01-24 00:00:00'),
(17,'ORD','ORD','Order Division',5,3,'ClipboardList','#fb923c','#fed7aa',1,'2026-01-24 00:00:00','2026-01-24 00:00:00');
/*!40000 ALTER TABLE `departments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `manual_documents`
--

DROP TABLE IF EXISTS `manual_documents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `manual_documents` (
  `document_id` int NOT NULL AUTO_INCREMENT,
  `folder_id` int DEFAULT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `version` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT '1.0',
  `status` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT 'draft',
  `tags` json DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `published_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`document_id`),
  KEY `fk_manual_documents_created_by` (`created_by`),
  KEY `fk_manual_documents_updated_by` (`updated_by`),
  KEY `idx_manual_documents_folder` (`folder_id`),
  CONSTRAINT `fk_manual_documents_created_by` FOREIGN KEY (`created_by`) REFERENCES `staff` (`staff_id`),
  CONSTRAINT `fk_manual_documents_folder` FOREIGN KEY (`folder_id`) REFERENCES `manual_folders` (`folder_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_manual_documents_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `staff` (`staff_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `manual_documents`
--

LOCK TABLES `manual_documents` WRITE;
/*!40000 ALTER TABLE `manual_documents` DISABLE KEYS */;
INSERT INTO `manual_documents` VALUES (1,1,'Quy trình mở cửa hàng','Hướng dẫn chi tiết các bước mở cửa hàng đầu ngày','1.0','published',NULL,1,NULL,NULL,'2026-01-22 01:42:52','2026-01-22 01:42:52'),(2,1,'Quy trình đóng cửa hàng','Hướng dẫn chi tiết các bước đóng cửa hàng cuối ngày','1.0','published',NULL,1,NULL,NULL,'2026-01-22 01:42:52','2026-01-22 01:42:52'),(3,2,'Sử dụng máy POS','Hướng dẫn sử dụng máy tính tiền POS','2.0','published',NULL,1,NULL,NULL,'2026-01-22 01:42:52','2026-01-22 01:42:52'),(4,3,'Quy định đồng phục','Quy định về đồng phục và trang phục làm việc','1.0','published',NULL,1,NULL,NULL,'2026-01-22 01:42:52','2026-01-22 01:42:52'),(5,4,'An toàn PCCC','Hướng dẫn phòng cháy chữa cháy','1.0','published',NULL,1,NULL,NULL,'2026-01-22 01:42:52','2026-01-22 01:42:52');
/*!40000 ALTER TABLE `manual_documents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `manual_folders`
--

DROP TABLE IF EXISTS `manual_folders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `manual_folders` (
  `folder_id` int NOT NULL AUTO_INCREMENT,
  `folder_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `parent_id` int DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `icon` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sort_order` int DEFAULT '0',
  `display_order` int DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`folder_id`),
  KEY `fk_manual_folders_parent` (`parent_id`),
  CONSTRAINT `fk_manual_folders_parent` FOREIGN KEY (`parent_id`) REFERENCES `manual_folders` (`folder_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `manual_folders`
--

LOCK TABLES `manual_folders` WRITE;
/*!40000 ALTER TABLE `manual_folders` DISABLE KEYS */;
INSERT INTO `manual_folders` VALUES (1,'Quy trình vận hành',NULL,'Hướng dẫn quy trình vận hành cửa hàng','BookOpen',1,0,1,'2026-01-22 01:42:52','2026-01-22 01:42:52'),(2,'Hướng dẫn sử dụng thiết bị',NULL,'Hướng dẫn sử dụng máy móc, thiết bị','Monitor',2,0,1,'2026-01-22 01:42:52','2026-01-22 01:42:52'),(3,'Chính sách & Quy định',NULL,'Các chính sách và quy định của công ty','FileText',3,0,1,'2026-01-22 01:42:52','2026-01-22 01:42:52'),(4,'An toàn lao động',NULL,'Hướng dẫn an toàn lao động','Shield',4,0,1,'2026-01-22 01:42:52','2026-01-22 01:42:52');
/*!40000 ALTER TABLE `manual_folders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `manual_media`
--

DROP TABLE IF EXISTS `manual_media`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `manual_media` (
  `media_id` int NOT NULL AUTO_INCREMENT,
  `step_id` int DEFAULT NULL,
  `document_id` int DEFAULT NULL,
  `media_type` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_path` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `file_size` int DEFAULT NULL,
  `mime_type` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alt_text` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sort_order` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`media_id`),
  KEY `fk_manual_media_step` (`step_id`),
  KEY `fk_manual_media_document` (`document_id`),
  CONSTRAINT `fk_manual_media_document` FOREIGN KEY (`document_id`) REFERENCES `manual_documents` (`document_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_manual_media_step` FOREIGN KEY (`step_id`) REFERENCES `manual_steps` (`step_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `manual_media`
--

LOCK TABLES `manual_media` WRITE;
/*!40000 ALTER TABLE `manual_media` DISABLE KEYS */;
/*!40000 ALTER TABLE `manual_media` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `manual_steps`
--

DROP TABLE IF EXISTS `manual_steps`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `manual_steps` (
  `step_id` int NOT NULL AUTO_INCREMENT,
  `document_id` int DEFAULT NULL,
  `step_number` int NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `content` text COLLATE utf8mb4_unicode_ci,
  `tips` text COLLATE utf8mb4_unicode_ci,
  `warnings` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`step_id`),
  KEY `idx_manual_steps_document` (`document_id`),
  CONSTRAINT `fk_manual_steps_document` FOREIGN KEY (`document_id`) REFERENCES `manual_documents` (`document_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `manual_steps`
--

LOCK TABLES `manual_steps` WRITE;
/*!40000 ALTER TABLE `manual_steps` DISABLE KEYS */;
/*!40000 ALTER TABLE `manual_steps` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `manual_view_logs`
--

DROP TABLE IF EXISTS `manual_view_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `manual_view_logs` (
  `log_id` int NOT NULL AUTO_INCREMENT,
  `document_id` int DEFAULT NULL,
  `staff_id` int DEFAULT NULL,
  `viewed_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `duration_seconds` int DEFAULT NULL,
  PRIMARY KEY (`log_id`),
  KEY `fk_manual_view_logs_staff` (`staff_id`),
  KEY `idx_manual_view_logs_document` (`document_id`),
  CONSTRAINT `fk_manual_view_logs_document` FOREIGN KEY (`document_id`) REFERENCES `manual_documents` (`document_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_manual_view_logs_staff` FOREIGN KEY (`staff_id`) REFERENCES `staff` (`staff_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `manual_view_logs`
--

LOCK TABLES `manual_view_logs` WRITE;
/*!40000 ALTER TABLE `manual_view_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `manual_view_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `manuals`
--

DROP TABLE IF EXISTS `manuals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `manuals` (
  `manual_id` int NOT NULL AUTO_INCREMENT,
  `manual_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `manual_url` text COLLATE utf8mb4_unicode_ci,
  `description` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`manual_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `manuals`
--

LOCK TABLES `manuals` WRITE;
/*!40000 ALTER TABLE `manuals` DISABLE KEYS */;
/*!40000 ALTER TABLE `manuals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `notification_id` int NOT NULL AUTO_INCREMENT,
  `recipient_staff_id` int DEFAULT NULL,
  `sender_staff_id` int DEFAULT NULL,
  `notification_type` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci,
  `link_url` text COLLATE utf8mb4_unicode_ci,
  `is_read` tinyint(1) DEFAULT '0',
  `read_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`notification_id`),
  KEY `fk_notifications_sender` (`sender_staff_id`),
  KEY `idx_notifications_recipient` (`recipient_staff_id`,`is_read`),
  CONSTRAINT `fk_notifications_recipient` FOREIGN KEY (`recipient_staff_id`) REFERENCES `staff` (`staff_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_notifications_sender` FOREIGN KEY (`sender_staff_id`) REFERENCES `staff` (`staff_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `used` tinyint(1) DEFAULT '0',
  `is_valid` tinyint(1) DEFAULT '1',
  `expires_at` timestamp NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_password_reset_tokens_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `personal_access_tokens`
--

DROP TABLE IF EXISTS `personal_access_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `personal_access_tokens` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint unsigned NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `token` (`token`),
  KEY `idx_personal_access_tokens_tokenable` (`tokenable_type`,`tokenable_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personal_access_tokens`
--

LOCK TABLES `personal_access_tokens` WRITE;
/*!40000 ALTER TABLE `personal_access_tokens` DISABLE KEYS */;
INSERT INTO `personal_access_tokens` VALUES (1,'App\\Models\\Staff',1,'access_token','8770a064210a1a7f12ec36265f2340cd7be3b2a42cc8699902c48e330c0e8016','[\"*\"]','2026-01-21 19:53:56','2026-01-21 20:05:03','2026-01-21 19:50:03','2026-01-21 19:53:56');
/*!40000 ALTER TABLE `personal_access_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `refresh_tokens`
--

DROP TABLE IF EXISTS `refresh_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `refresh_tokens` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `staff_id` int NOT NULL,
  `token_hash` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `family_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expires_at` timestamp NOT NULL,
  `revoked_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_token_hash` (`token_hash`),
  KEY `idx_staff_id` (`staff_id`),
  KEY `idx_family_id` (`family_id`),
  KEY `idx_expires_at` (`expires_at`),
  CONSTRAINT `fk_refresh_tokens_staff` FOREIGN KEY (`staff_id`) REFERENCES `staff` (`staff_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `refresh_tokens`
--

LOCK TABLES `refresh_tokens` WRITE;
/*!40000 ALTER TABLE `refresh_tokens` DISABLE KEYS */;
INSERT INTO `refresh_tokens` VALUES (1,1,'195fd0248299338040750148d0c49f77495cc924d9dc3831295213ab7a434955','cfbf82ea-6aca-4f99-b97d-728156437f95','2026-01-28 19:50:03',NULL,'2026-01-22 02:50:03');
/*!40000 ALTER TABLE `refresh_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `regions`
--

DROP TABLE IF EXISTS `regions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `regions` (
  `region_id` int NOT NULL AUTO_INCREMENT,
  `region_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `region_code` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `is_active` tinyint(1) DEFAULT '1',
  `sort_order` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`region_id`),
  UNIQUE KEY `region_code` (`region_code`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `regions`
--

LOCK TABLES `regions` WRITE;
/*!40000 ALTER TABLE `regions` DISABLE KEYS */;
INSERT INTO `regions` VALUES (1,'The North','NORTH','Khu vực phía Bắc',1,1,'2026-01-22 01:42:52','2026-01-22 03:02:14'),(2,'The Central','CENTRAL','Khu vực miền Trung',1,2,'2026-01-22 01:42:52','2026-01-22 03:02:14'),(3,'The South','SOUTH','Khu vực phía Nam',1,3,'2026-01-22 01:42:52','2026-01-22 03:02:14');
/*!40000 ALTER TABLE `regions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shift_assignments`
--

DROP TABLE IF EXISTS `shift_assignments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shift_assignments` (
  `assignment_id` int NOT NULL AUTO_INCREMENT,
  `staff_id` int DEFAULT NULL,
  `store_id` int DEFAULT NULL,
  `shift_date` date NOT NULL,
  `shift_code_id` int DEFAULT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT 'assigned',
  `notes` text COLLATE utf8mb4_unicode_ci,
  `assigned_by` int DEFAULT NULL,
  `assigned_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`assignment_id`),
  UNIQUE KEY `shift_assignments_unique` (`staff_id`,`shift_date`,`shift_code_id`),
  KEY `fk_shift_assignments_shift_code` (`shift_code_id`),
  KEY `fk_shift_assignments_assigned_by` (`assigned_by`),
  KEY `idx_shift_assignments_staff` (`staff_id`),
  KEY `idx_shift_assignments_date` (`shift_date`),
  KEY `idx_shift_assignments_store` (`store_id`),
  CONSTRAINT `fk_shift_assignments_assigned_by` FOREIGN KEY (`assigned_by`) REFERENCES `staff` (`staff_id`),
  CONSTRAINT `fk_shift_assignments_shift_code` FOREIGN KEY (`shift_code_id`) REFERENCES `shift_codes` (`shift_code_id`),
  CONSTRAINT `fk_shift_assignments_staff` FOREIGN KEY (`staff_id`) REFERENCES `staff` (`staff_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_shift_assignments_store` FOREIGN KEY (`store_id`) REFERENCES `stores` (`store_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shift_assignments`
--

LOCK TABLES `shift_assignments` WRITE;
/*!40000 ALTER TABLE `shift_assignments` DISABLE KEYS */;
/*!40000 ALTER TABLE `shift_assignments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shift_codes`
--

DROP TABLE IF EXISTS `shift_codes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shift_codes` (
  `shift_code_id` int NOT NULL AUTO_INCREMENT,
  `shift_code` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `shift_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `total_hours` decimal(4,2) DEFAULT '8.00',
  `shift_type` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT 'regular',
  `break_minutes` int DEFAULT '60',
  `color_code` varchar(7) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`shift_code_id`),
  UNIQUE KEY `shift_code` (`shift_code`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shift_codes`
--

LOCK TABLES `shift_codes` WRITE;
/*!40000 ALTER TABLE `shift_codes` DISABLE KEYS */;
INSERT INTO `shift_codes` VALUES (1,'V8.6','Ca sang 6h','06:00:00','14:00:00',8.00,'morning',60,'#FFD700',1,'2026-01-22 01:42:52','2026-01-22 01:42:52'),(2,'V8.7','Ca sang 7h','07:00:00','15:00:00',8.00,'morning',60,'#FFA500',1,'2026-01-22 01:42:52','2026-01-22 01:42:52'),(3,'V8.8','Ca sang 8h','08:00:00','16:00:00',8.00,'morning',60,'#FF8C00',1,'2026-01-22 01:42:52','2026-01-22 01:42:52'),(4,'V8.14','Ca chieu 14h','14:00:00','22:00:00',8.00,'afternoon',60,'#87CEEB',1,'2026-01-22 01:42:52','2026-01-22 01:42:52'),(5,'V8.14.5','Ca chieu 14:30','14:30:00','22:30:00',8.00,'afternoon',60,'#00BFFF',1,'2026-01-22 01:42:52','2026-01-22 01:42:52'),(6,'V8.15','Ca chieu 15h','15:00:00','23:00:00',8.00,'afternoon',60,'#1E90FF',1,'2026-01-22 01:42:52','2026-01-22 01:42:52'),(7,'OFF','Nghi','00:00:00','00:00:00',0.00,'off',0,'#D3D3D3',1,'2026-01-22 01:42:52','2026-01-22 01:42:52'),(8,'FULL','Ca toan thoi gian','08:00:00','20:00:00',12.00,'full',90,'#32CD32',1,'2026-01-22 01:42:52','2026-01-22 01:42:52');
/*!40000 ALTER TABLE `shift_codes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shift_templates`
--

DROP TABLE IF EXISTS `shift_templates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shift_templates` (
  `template_id` int NOT NULL AUTO_INCREMENT,
  `template_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `shift_pattern` json DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`template_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shift_templates`
--

LOCK TABLES `shift_templates` WRITE;
/*!40000 ALTER TABLE `shift_templates` DISABLE KEYS */;
/*!40000 ALTER TABLE `shift_templates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `staff`
--

DROP TABLE IF EXISTS `staff`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `staff` (
  `staff_id` int NOT NULL AUTO_INCREMENT,
  `staff_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `staff_code` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `username` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `google_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `store_id` int DEFAULT NULL,
  `region_id` int DEFAULT NULL,
  `zone_id` int DEFAULT NULL,
  `area_id` int DEFAULT NULL,
  `department_id` int DEFAULT NULL,
  `team_id` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'STAFF',
  `position` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `job_grade` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sap_code` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatar_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `line_manager_id` int DEFAULT NULL,
  `joining_date` date DEFAULT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT 'active',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`staff_id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `staff_code` (`staff_code`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `google_id` (`google_id`),
  KEY `fk_staff_team` (`team_id`),
  KEY `fk_staff_region` (`region_id`),
  KEY `fk_staff_zone` (`zone_id`),
  KEY `fk_staff_area` (`area_id`),
  KEY `fk_staff_line_manager` (`line_manager_id`),
  KEY `idx_staff_store` (`store_id`),
  KEY `idx_staff_department` (`department_id`),
  KEY `idx_staff_username` (`username`),
  KEY `idx_staff_status` (`status`),
  CONSTRAINT `fk_staff_area` FOREIGN KEY (`area_id`) REFERENCES `areas` (`area_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_staff_department` FOREIGN KEY (`department_id`) REFERENCES `departments` (`department_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_staff_line_manager` FOREIGN KEY (`line_manager_id`) REFERENCES `staff` (`staff_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_staff_region` FOREIGN KEY (`region_id`) REFERENCES `regions` (`region_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_staff_store` FOREIGN KEY (`store_id`) REFERENCES `stores` (`store_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_staff_team` FOREIGN KEY (`team_id`) REFERENCES `teams` (`team_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_staff_zone` FOREIGN KEY (`zone_id`) REFERENCES `zones` (`zone_id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `staff`
--

LOCK TABLES `staff` WRITE;
/*!40000 ALTER TABLE `staff` DISABLE KEYS */;
INSERT INTO `staff` VALUES (1,'Admin User','ADMIN001','admin','admin@aoisora.vn',NULL,'0901234567',NULL,NULL,NULL,NULL,1,'OPE-STORE','ADMIN','System Administrator','G9','SAP001',NULL,NULL,NULL,'$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','active',1,'2026-01-22 01:42:52','2026-01-22 01:42:52'),(2,'Trần Văn G8','G8001','g8user','g8@aoisora.vn',NULL,'0901234580',NULL,NULL,NULL,NULL,1,'OPE-QC','MANAGER','Senior Manager','G8','SAP010',NULL,1,NULL,'$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','active',1,'2026-01-22 01:42:52','2026-01-22 01:42:52'),(3,'Nguyễn Thị G7','G7001','g7user','g7@aoisora.vn',NULL,'0901234581',NULL,NULL,NULL,NULL,1,'OPE-QC','MANAGER','Area Manager','G7','SAP011',NULL,1,NULL,'$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','active',1,'2026-01-22 01:42:52','2026-01-22 01:42:52'),(4,'Nguyễn Văn Manager','MGR001','manager','manager@aoisora.vn',NULL,'0901234568',NULL,NULL,NULL,NULL,1,'OPE-STORE','MANAGER','Store Manager','G6','SAP002',NULL,1,NULL,'$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','active',1,'2026-01-22 01:42:52','2026-01-22 01:42:52'),(5,'Lê Văn G5','G5001','g5user','g5@aoisora.vn',NULL,'0901234582',NULL,NULL,NULL,NULL,1,'OPE-QC','STAFF','Team Lead','G5','SAP012',NULL,2,NULL,'$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','active',1,'2026-01-22 01:42:52','2026-01-22 01:42:52'),(6,'Phạm Văn G4','G4001','g4user','g4@aoisora.vn',NULL,'0901234583',NULL,NULL,NULL,NULL,1,'OPE-QC','STAFF','Senior Staff','G4','SAP013',NULL,2,NULL,'$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','active',1,'2026-01-22 01:42:52','2026-01-22 01:42:52'),(7,'Trần Thị Staff','STF001','staff1','staff1@aoisora.vn',NULL,'0901234569',NULL,NULL,NULL,NULL,1,'OPE-STORE','STAFF','Sales Staff','G3','SAP003',NULL,4,NULL,'$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','active',1,'2026-01-22 01:42:52','2026-01-22 01:42:52'),(8,'Hoàng Văn G2','G2001','g2user','g2@aoisora.vn',NULL,'0901234584',NULL,NULL,NULL,NULL,1,'OPE-QC','STAFF','Junior Staff','G2','SAP014',NULL,4,NULL,'$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','active',1,'2026-01-22 01:42:52','2026-01-22 01:42:52'),(9,'Lê Văn QC','QC001','qc1','qc1@aoisora.vn',NULL,'0901234570',NULL,NULL,NULL,NULL,1,'OPE-QC','STAFF','QC Staff','G3','SAP004',NULL,4,NULL,'$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','active',1,'2026-01-22 01:42:52','2026-01-22 01:42:52'),(10,'Phạm Thị Account','ACC001','acc1','acc1@aoisora.vn',NULL,'0901234571',NULL,NULL,NULL,NULL,2,'ACC-AP','STAFF','Accountant','G3','SAP005',NULL,4,NULL,'$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','active',1,'2026-01-22 01:42:52','2026-01-22 01:42:52'),(11,'Nguyễn Văn Store1','S3-001','s3store1','s3store1@aoisora.vn',NULL,'0901111001',NULL,NULL,NULL,NULL,1,'OPE-STORE','MANAGER','Store Leader','S3','SAP101',NULL,NULL,NULL,'$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','active',1,'2026-01-22 01:42:52','2026-01-22 01:42:52'),(12,'Trần Thị Store2','S3-002','s3store2','s3store2@aoisora.vn',NULL,'0901111002',NULL,NULL,NULL,NULL,1,'OPE-STORE','MANAGER','Store Leader','S3','SAP102',NULL,NULL,NULL,'$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','active',1,'2026-01-22 01:42:52','2026-01-22 01:42:52'),(13,'Lê Văn Store3','S3-003','s3store3','s3store3@aoisora.vn',NULL,'0901111003',NULL,NULL,NULL,NULL,1,'OPE-STORE','MANAGER','Store Leader','S3','SAP103',NULL,NULL,NULL,'$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','active',1,'2026-01-22 01:42:52','2026-01-22 01:42:52'),(14,'Phạm Thị Store4','S3-004','s3store4','s3store4@aoisora.vn',NULL,'0901111004',NULL,NULL,NULL,NULL,1,'OPE-STORE','MANAGER','Store Leader','S3','SAP104',NULL,NULL,NULL,'$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','active',1,'2026-01-22 01:42:52','2026-01-22 01:42:52'),(15,'Hoàng Văn Store5','S3-005','s3store5','s3store5@aoisora.vn',NULL,'0901111005',NULL,NULL,NULL,NULL,1,'OPE-STORE','MANAGER','Store Leader','S3','SAP105',NULL,NULL,NULL,'$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','active',1,'2026-01-22 01:42:52','2026-01-22 01:42:52'),(16,'Nguyễn Văn Store6','S3-006','s3store6','s3store6@aoisora.vn',NULL,'0901111006',NULL,NULL,NULL,NULL,1,'OPE-STORE','MANAGER','Store Leader','S3','SAP106',NULL,NULL,NULL,'$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','active',1,'2026-01-22 01:42:52','2026-01-22 01:42:52'),(17,'Trần Thị Store7','S3-007','s3store7','s3store7@aoisora.vn',NULL,'0901111007',NULL,NULL,NULL,NULL,1,'OPE-STORE','MANAGER','Store Leader','S3','SAP107',NULL,NULL,NULL,'$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','active',1,'2026-01-22 01:42:52','2026-01-22 01:42:52'),(18,'Lê Văn Store8','S3-008','s3store8','s3store8@aoisora.vn',NULL,'0901111008',NULL,NULL,NULL,NULL,1,'OPE-STORE','MANAGER','Store Leader','S3','SAP108',NULL,NULL,NULL,'$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','active',1,'2026-01-22 01:42:52','2026-01-22 01:42:52'),(19,'Phạm Thị Store9','S3-009','s3store9','s3store9@aoisora.vn',NULL,'0901111009',NULL,NULL,NULL,NULL,1,'OPE-STORE','MANAGER','Store Leader','S3','SAP109',NULL,NULL,NULL,'$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','active',1,'2026-01-22 01:42:52','2026-01-22 01:42:52'),(20,'Hoàng Văn Store10','S3-010','s3store10','s3store10@aoisora.vn',NULL,'0901111010',NULL,NULL,NULL,NULL,1,'OPE-STORE','MANAGER','Store Leader','S3','SAP110',NULL,NULL,NULL,'$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','active',1,'2026-01-22 01:42:52','2026-01-22 01:42:52'),(21,'Nguyễn Văn Store11','S3-011','s3store11','s3store11@aoisora.vn',NULL,'0901111011',NULL,NULL,NULL,NULL,1,'OPE-STORE','MANAGER','Store Leader','S3','SAP111',NULL,NULL,NULL,'$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','active',1,'2026-01-22 01:42:52','2026-01-22 01:42:52'),(22,'Trần Thị Store12','S3-012','s3store12','s3store12@aoisora.vn',NULL,'0901111012',NULL,NULL,NULL,NULL,1,'OPE-STORE','MANAGER','Store Leader','S3','SAP112',NULL,NULL,NULL,'$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','active',1,'2026-01-22 01:42:52','2026-01-22 01:42:52'),(23,'Lê Văn Store13','S3-013','s3store13','s3store13@aoisora.vn',NULL,'0901111013',NULL,NULL,NULL,NULL,1,'OPE-STORE','MANAGER','Store Leader','S3','SAP113',NULL,NULL,NULL,'$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','active',1,'2026-01-22 01:42:52','2026-01-22 01:42:52');
/*!40000 ALTER TABLE `staff` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `staff_assignments`
--

DROP TABLE IF EXISTS `staff_assignments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `staff_assignments` (
  `assignment_id` int NOT NULL AUTO_INCREMENT,
  `staff_id` int NOT NULL,
  `assignment_type` enum('primary','acting') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'primary',
  `scope_type` enum('region','zone','area','store') COLLATE utf8mb4_unicode_ci NOT NULL,
  `scope_id` int NOT NULL,
  `effective_grade` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  PRIMARY KEY (`assignment_id`),
  KEY `idx_staff_id` (`staff_id`),
  KEY `idx_scope` (`scope_type`,`scope_id`),
  KEY `idx_active` (`is_active`),
  KEY `idx_effective_date` (`start_date`,`end_date`),
  CONSTRAINT `staff_assignments_ibfk_1` FOREIGN KEY (`staff_id`) REFERENCES `staff` (`staff_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `staff_assignments`
--

LOCK TABLES `staff_assignments` WRITE;
/*!40000 ALTER TABLE `staff_assignments` DISABLE KEYS */;
/*!40000 ALTER TABLE `staff_assignments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stores`
--

DROP TABLE IF EXISTS `stores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stores` (
  `store_id` int NOT NULL AUTO_INCREMENT,
  `store_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `store_code` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `region_id` int DEFAULT NULL,
  `area_id` int DEFAULT NULL,
  `address` text COLLATE utf8mb4_unicode_ci,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `sort_order` int DEFAULT '0',
  `manager_id` int DEFAULT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`store_id`),
  UNIQUE KEY `store_code` (`store_code`),
  KEY `fk_stores_region` (`region_id`),
  KEY `fk_stores_area` (`area_id`),
  KEY `fk_stores_manager` (`manager_id`),
  CONSTRAINT `fk_stores_area` FOREIGN KEY (`area_id`) REFERENCES `areas` (`area_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_stores_manager` FOREIGN KEY (`manager_id`) REFERENCES `staff` (`staff_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_stores_region` FOREIGN KEY (`region_id`) REFERENCES `regions` (`region_id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=461 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stores`
--

LOCK TABLES `stores` WRITE;
/*!40000 ALTER TABLE `stores` DISABLE KEYS */;
INSERT INTO `stores` VALUES (1,'AEON Mall Long Biên','HN-LB-001',1,1,'Số 27 Cổ Linh, Long Biên, Hà Nội',NULL,NULL,1,1,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(2,'AEON MaxValu Long Biên 1','HN-LB-002',1,1,'Số 15 Nguyễn Văn Cừ, Long Biên',NULL,NULL,1,2,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(3,'AEON MaxValu Long Biên 2','HN-LB-003',1,1,'Số 88 Ngọc Lâm, Long Biên',NULL,NULL,1,3,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(4,'AEON Express Long Biên 1','HN-LB-004',1,1,'Số 45 Gia Thụy, Long Biên',NULL,NULL,1,4,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(5,'AEON Express Long Biên 2','HN-LB-005',1,1,'Số 120 Ngọc Thụy, Long Biên',NULL,NULL,1,5,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(6,'AEON Express Long Biên 3','HN-LB-006',1,1,'Số 78 Bồ Đề, Long Biên',NULL,NULL,1,6,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(7,'AEON Express Long Biên 4','HN-LB-007',1,1,'Số 200 Thạch Bàn, Long Biên',NULL,NULL,1,7,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(8,'AEON Express Long Biên 5','HN-LB-008',1,1,'Số 55 Sài Đồng, Long Biên',NULL,NULL,1,8,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(9,'AEON Express Long Biên 6','HN-LB-009',1,1,'Số 33 Việt Hưng, Long Biên',NULL,NULL,1,9,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(10,'AEON Express Long Biên 7','HN-LB-010',1,1,'Số 99 Gia Lâm, Long Biên',NULL,NULL,1,10,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(11,'AEON Express Long Biên 8','HN-LB-011',1,1,'Số 150 Long Biên, Hà Nội',NULL,NULL,1,11,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(12,'AEON Express Long Biên 9','HN-LB-012',1,1,'Số 180 Đức Giang, Long Biên',NULL,NULL,1,12,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(13,'AEON Express Long Biên 10','HN-LB-013',1,1,'Số 220 Thượng Thanh, Long Biên',NULL,NULL,1,13,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(14,'AEON Express Long Biên 11','HN-LB-014',1,1,'Số 60 Giang Biên, Long Biên',NULL,NULL,1,14,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(15,'AEON Express Long Biên 12','HN-LB-015',1,1,'Số 85 Phúc Lợi, Long Biên',NULL,NULL,1,15,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(16,'AEON Express Long Biên 13','HN-LB-016',1,1,'Số 110 Phúc Đồng, Long Biên',NULL,NULL,1,16,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(17,'AEON Express Long Biên 14','HN-LB-017',1,1,'Số 140 Cự Khối, Long Biên',NULL,NULL,1,17,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(18,'AEON Express Long Biên 15','HN-LB-018',1,1,'Số 170 Gia Quất, Long Biên',NULL,NULL,1,18,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(19,'AEON Express Long Biên 16','HN-LB-019',1,1,'Số 190 Thạch Cầu, Long Biên',NULL,NULL,1,19,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(20,'AEON Express Long Biên 17','HN-LB-020',1,1,'Số 210 Long Biên 2, Hà Nội',NULL,NULL,1,20,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(21,'AEON Express Long Biên 18','HN-LB-021',1,1,'Số 230 Long Biên 3, Hà Nội',NULL,NULL,1,21,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(22,'AEON Express Long Biên 19','HN-LB-022',1,1,'Số 250 Long Biên 4, Hà Nội',NULL,NULL,1,22,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(23,'AEON Express Long Biên 20','HN-LB-023',1,1,'Số 270 Long Biên 5, Hà Nội',NULL,NULL,1,23,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(24,'AEON Express Long Biên 21','HN-LB-024',1,1,'Số 290 Long Biên 6, Hà Nội',NULL,NULL,1,24,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(25,'AEON Express Long Biên 22','HN-LB-025',1,1,'Số 310 Long Biên 7, Hà Nội',NULL,NULL,1,25,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(26,'AEON Express Long Biên 23','HN-LB-026',1,1,'Số 330 Long Biên 8, Hà Nội',NULL,NULL,1,26,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(27,'AEON Express Long Biên 24','HN-LB-027',1,1,'Số 350 Long Biên 9, Hà Nội',NULL,NULL,1,27,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(28,'AEON Express Long Biên 25','HN-LB-028',1,1,'Số 370 Long Biên 10, Hà Nội',NULL,NULL,1,28,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(29,'AEON Express Long Biên 26','HN-LB-029',1,1,'Số 390 Long Biên 11, Hà Nội',NULL,NULL,1,29,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(30,'AEON Express Long Biên 27','HN-LB-030',1,1,'Số 400 Long Biên 12, Hà Nội',NULL,NULL,1,30,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(31,'AEON Express Long Biên 28','HN-LB-031',1,1,'Số 410 Long Biên 13, Hà Nội',NULL,NULL,1,31,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(32,'AEON Express Long Biên 29','HN-LB-032',1,1,'Số 420 Long Biên 14, Hà Nội',NULL,NULL,1,32,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(33,'AEON Express Long Biên 30','HN-LB-033',1,1,'Số 430 Long Biên 15, Hà Nội',NULL,NULL,1,33,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(34,'AEON Express Long Biên 31','HN-LB-034',1,1,'Số 440 Long Biên 16, Hà Nội',NULL,NULL,1,34,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(35,'AEON Express Long Biên 32','HN-LB-035',1,1,'Số 450 Long Biên 17, Hà Nội',NULL,NULL,1,35,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(36,'AEON Express Long Biên 33','HN-LB-036',1,1,'Số 460 Long Biên 18, Hà Nội',NULL,NULL,1,36,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(37,'AEON Express Long Biên 34','HN-LB-037',1,1,'Số 470 Long Biên 19, Hà Nội',NULL,NULL,1,37,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(38,'AEON Express Long Biên 35','HN-LB-038',1,1,'Số 480 Long Biên 20, Hà Nội',NULL,NULL,1,38,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(39,'AEON Express Long Biên 36','HN-LB-039',1,1,'Số 490 Long Biên 21, Hà Nội',NULL,NULL,1,39,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(40,'AEON Express Long Biên 37','HN-LB-040',1,1,'Số 500 Long Biên 22, Hà Nội',NULL,NULL,1,40,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(41,'AEON Mall Hà Đông','HN-HD-001',1,2,'Số 1 Trần Phú, Hà Đông, Hà Nội',NULL,NULL,1,1,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(42,'AEON MaxValu Hà Đông 1','HN-HD-002',1,2,'Số 50 Quang Trung, Hà Đông',NULL,NULL,1,2,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(43,'AEON MaxValu Hà Đông 2','HN-HD-003',1,2,'Số 100 Nguyễn Trãi, Hà Đông',NULL,NULL,1,3,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(44,'AEON Express Hà Đông 1','HN-HD-004',1,2,'Số 25 Lê Lợi, Hà Đông',NULL,NULL,1,4,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(45,'AEON Express Hà Đông 2','HN-HD-005',1,2,'Số 75 Tô Hiệu, Hà Đông',NULL,NULL,1,5,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(46,'AEON Express Hà Đông 3','HN-HD-006',1,2,'Số 125 Văn Phú, Hà Đông',NULL,NULL,1,6,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(47,'AEON Express Hà Đông 4','HN-HD-007',1,2,'Số 175 Phú La, Hà Đông',NULL,NULL,1,7,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(48,'AEON Express Hà Đông 5','HN-HD-008',1,2,'Số 200 Mộ Lao, Hà Đông',NULL,NULL,1,8,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(49,'AEON Express Hà Đông 6','HN-HD-009',1,2,'Số 225 Văn Quán, Hà Đông',NULL,NULL,1,9,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(50,'AEON Express Hà Đông 7','HN-HD-010',1,2,'Số 250 Yên Nghĩa, Hà Đông',NULL,NULL,1,10,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(51,'AEON Express Hà Đông 8','HN-HD-011',1,2,'Số 275 Dương Nội, Hà Đông',NULL,NULL,1,11,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(52,'AEON Express Hà Đông 9','HN-HD-012',1,2,'Số 300 Kiến Hưng, Hà Đông',NULL,NULL,1,12,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(53,'AEON Express Hà Đông 10','HN-HD-013',1,2,'Số 325 Phú Lương, Hà Đông',NULL,NULL,1,13,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(54,'AEON Express Hà Đông 11','HN-HD-014',1,2,'Số 350 Phúc La, Hà Đông',NULL,NULL,1,14,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(55,'AEON Express Hà Đông 12','HN-HD-015',1,2,'Số 375 Hà Cầu, Hà Đông',NULL,NULL,1,15,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(56,'AEON Express Hà Đông 13','HN-HD-016',1,2,'Số 400 Đồng Mai, Hà Đông',NULL,NULL,1,16,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(57,'AEON Express Hà Đông 14','HN-HD-017',1,2,'Số 425 Yên Phúc, Hà Đông',NULL,NULL,1,17,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(58,'AEON Express Hà Đông 15','HN-HD-018',1,2,'Số 450 Biên Giang, Hà Đông',NULL,NULL,1,18,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(59,'AEON Express Hà Đông 16','HN-HD-019',1,2,'Số 475 Vạn Phúc, Hà Đông',NULL,NULL,1,19,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(60,'AEON Express Hà Đông 17','HN-HD-020',1,2,'Số 500 Hà Đông 1, Hà Nội',NULL,NULL,1,20,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(61,'AEON Express Hà Đông 18','HN-HD-021',1,2,'Số 520 Hà Đông 2, Hà Nội',NULL,NULL,1,21,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(62,'AEON Express Hà Đông 19','HN-HD-022',1,2,'Số 540 Hà Đông 3, Hà Nội',NULL,NULL,1,22,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(63,'AEON Express Hà Đông 20','HN-HD-023',1,2,'Số 560 Hà Đông 4, Hà Nội',NULL,NULL,1,23,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(64,'AEON Express Hà Đông 21','HN-HD-024',1,2,'Số 580 Hà Đông 5, Hà Nội',NULL,NULL,1,24,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(65,'AEON Express Hà Đông 22','HN-HD-025',1,2,'Số 600 Hà Đông 6, Hà Nội',NULL,NULL,1,25,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(66,'AEON Express Hà Đông 23','HN-HD-026',1,2,'Số 620 Hà Đông 7, Hà Nội',NULL,NULL,1,26,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(67,'AEON Express Hà Đông 24','HN-HD-027',1,2,'Số 640 Hà Đông 8, Hà Nội',NULL,NULL,1,27,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(68,'AEON Express Hà Đông 25','HN-HD-028',1,2,'Số 660 Hà Đông 9, Hà Nội',NULL,NULL,1,28,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(69,'AEON Express Hà Đông 26','HN-HD-029',1,2,'Số 680 Hà Đông 10, Hà Nội',NULL,NULL,1,29,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(70,'AEON Express Hà Đông 27','HN-HD-030',1,2,'Số 700 Hà Đông 11, Hà Nội',NULL,NULL,1,30,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(71,'AEON Express Hà Đông 28','HN-HD-031',1,2,'Số 720 Hà Đông 12, Hà Nội',NULL,NULL,1,31,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(72,'AEON Express Hà Đông 29','HN-HD-032',1,2,'Số 740 Hà Đông 13, Hà Nội',NULL,NULL,1,32,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(73,'AEON Express Hà Đông 30','HN-HD-033',1,2,'Số 760 Hà Đông 14, Hà Nội',NULL,NULL,1,33,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(74,'AEON Express Hà Đông 31','HN-HD-034',1,2,'Số 780 Hà Đông 15, Hà Nội',NULL,NULL,1,34,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(75,'AEON Express Hà Đông 32','HN-HD-035',1,2,'Số 800 Hà Đông 16, Hà Nội',NULL,NULL,1,35,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(76,'AEON Express Hà Đông 33','HN-HD-036',1,2,'Số 820 Hà Đông 17, Hà Nội',NULL,NULL,1,36,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(77,'AEON Express Hà Đông 34','HN-HD-037',1,2,'Số 840 Hà Đông 18, Hà Nội',NULL,NULL,1,37,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(78,'AEON Express Hà Đông 35','HN-HD-038',1,2,'Số 860 Hà Đông 19, Hà Nội',NULL,NULL,1,38,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(79,'AEON Express Hà Đông 36','HN-HD-039',1,2,'Số 880 Hà Đông 20, Hà Nội',NULL,NULL,1,39,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(80,'AEON Express Hà Đông 37','HN-HD-040',1,2,'Số 900 Hà Đông 21, Hà Nội',NULL,NULL,1,40,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(81,'AEON Mall Cầu Giấy','HN-CG-001',1,3,'Số 79 Xuân Thủy, Cầu Giấy, Hà Nội',NULL,NULL,1,1,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(82,'AEON MaxValu Cầu Giấy 1','HN-CG-002',1,3,'Số 30 Trần Thái Tông, Cầu Giấy',NULL,NULL,1,2,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(83,'AEON MaxValu Cầu Giấy 2','HN-CG-003',1,3,'Số 60 Nguyễn Phong Sắc, Cầu Giấy',NULL,NULL,1,3,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(84,'AEON Express Cầu Giấy 1','HN-CG-004',1,3,'Số 15 Dịch Vọng, Cầu Giấy',NULL,NULL,1,4,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(85,'AEON Express Cầu Giấy 2','HN-CG-005',1,3,'Số 45 Dịch Vọng Hậu, Cầu Giấy',NULL,NULL,1,5,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(86,'AEON Express Cầu Giấy 3','HN-CG-006',1,3,'Số 75 Mai Dịch, Cầu Giấy',NULL,NULL,1,6,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(87,'AEON Express Cầu Giấy 4','HN-CG-007',1,3,'Số 105 Nghĩa Đô, Cầu Giấy',NULL,NULL,1,7,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(88,'AEON Express Cầu Giấy 5','HN-CG-008',1,3,'Số 135 Nghĩa Tân, Cầu Giấy',NULL,NULL,1,8,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(89,'AEON Express Cầu Giấy 6','HN-CG-009',1,3,'Số 165 Quan Hoa, Cầu Giấy',NULL,NULL,1,9,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(90,'AEON Express Cầu Giấy 7','HN-CG-010',1,3,'Số 195 Trung Hòa, Cầu Giấy',NULL,NULL,1,10,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(91,'AEON Express Cầu Giấy 8','HN-CG-011',1,3,'Số 225 Yên Hòa, Cầu Giấy',NULL,NULL,1,11,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(92,'AEON Express Cầu Giấy 9','HN-CG-012',1,3,'Số 255 Cầu Giấy 1, Hà Nội',NULL,NULL,1,12,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(93,'AEON Express Cầu Giấy 10','HN-CG-013',1,3,'Số 285 Cầu Giấy 2, Hà Nội',NULL,NULL,1,13,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(94,'AEON Express Cầu Giấy 11','HN-CG-014',1,3,'Số 315 Cầu Giấy 3, Hà Nội',NULL,NULL,1,14,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(95,'AEON Express Cầu Giấy 12','HN-CG-015',1,3,'Số 345 Cầu Giấy 4, Hà Nội',NULL,NULL,1,15,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(96,'AEON Express Cầu Giấy 13','HN-CG-016',1,3,'Số 375 Cầu Giấy 5, Hà Nội',NULL,NULL,1,16,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(97,'AEON Express Cầu Giấy 14','HN-CG-017',1,3,'Số 405 Cầu Giấy 6, Hà Nội',NULL,NULL,1,17,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(98,'AEON Express Cầu Giấy 15','HN-CG-018',1,3,'Số 435 Cầu Giấy 7, Hà Nội',NULL,NULL,1,18,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(99,'AEON Express Cầu Giấy 16','HN-CG-019',1,3,'Số 465 Cầu Giấy 8, Hà Nội',NULL,NULL,1,19,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(100,'AEON Express Cầu Giấy 17','HN-CG-020',1,3,'Số 495 Cầu Giấy 9, Hà Nội',NULL,NULL,1,20,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(101,'AEON Express Cầu Giấy 18','HN-CG-021',1,3,'Số 525 Cầu Giấy 10, Hà Nội',NULL,NULL,1,21,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(102,'AEON Express Cầu Giấy 19','HN-CG-022',1,3,'Số 555 Cầu Giấy 11, Hà Nội',NULL,NULL,1,22,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(103,'AEON Express Cầu Giấy 20','HN-CG-023',1,3,'Số 585 Cầu Giấy 12, Hà Nội',NULL,NULL,1,23,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(104,'AEON Express Cầu Giấy 21','HN-CG-024',1,3,'Số 615 Cầu Giấy 13, Hà Nội',NULL,NULL,1,24,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(105,'AEON Express Cầu Giấy 22','HN-CG-025',1,3,'Số 645 Cầu Giấy 14, Hà Nội',NULL,NULL,1,25,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(106,'AEON Express Cầu Giấy 23','HN-CG-026',1,3,'Số 675 Cầu Giấy 15, Hà Nội',NULL,NULL,1,26,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(107,'AEON Express Cầu Giấy 24','HN-CG-027',1,3,'Số 705 Cầu Giấy 16, Hà Nội',NULL,NULL,1,27,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(108,'AEON Express Cầu Giấy 25','HN-CG-028',1,3,'Số 735 Cầu Giấy 17, Hà Nội',NULL,NULL,1,28,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(109,'AEON Express Cầu Giấy 26','HN-CG-029',1,3,'Số 765 Cầu Giấy 18, Hà Nội',NULL,NULL,1,29,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(110,'AEON Express Cầu Giấy 27','HN-CG-030',1,3,'Số 795 Cầu Giấy 19, Hà Nội',NULL,NULL,1,30,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(111,'AEON Express Cầu Giấy 28','HN-CG-031',1,3,'Số 825 Cầu Giấy 20, Hà Nội',NULL,NULL,1,31,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(112,'AEON Express Cầu Giấy 29','HN-CG-032',1,3,'Số 855 Cầu Giấy 21, Hà Nội',NULL,NULL,1,32,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(113,'AEON Express Cầu Giấy 30','HN-CG-033',1,3,'Số 885 Cầu Giấy 22, Hà Nội',NULL,NULL,1,33,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(114,'AEON Express Cầu Giấy 31','HN-CG-034',1,3,'Số 915 Cầu Giấy 23, Hà Nội',NULL,NULL,1,34,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(115,'AEON Express Cầu Giấy 32','HN-CG-035',1,3,'Số 945 Cầu Giấy 24, Hà Nội',NULL,NULL,1,35,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(116,'AEON Express Cầu Giấy 33','HN-CG-036',1,3,'Số 975 Cầu Giấy 25, Hà Nội',NULL,NULL,1,36,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(117,'AEON Express Cầu Giấy 34','HN-CG-037',1,3,'Số 1005 Cầu Giấy 26, Hà Nội',NULL,NULL,1,37,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(118,'AEON Express Cầu Giấy 35','HN-CG-038',1,3,'Số 1035 Cầu Giấy 27, Hà Nội',NULL,NULL,1,38,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(119,'AEON Express Cầu Giấy 36','HN-CG-039',1,3,'Số 1065 Cầu Giấy 28, Hà Nội',NULL,NULL,1,39,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(120,'AEON Express Cầu Giấy 37','HN-CG-040',1,3,'Số 1095 Cầu Giấy 29, Hà Nội',NULL,NULL,1,40,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(121,'AEON Supermarket Bắc Ninh','BN-TP-001',1,4,'Số 1 Lý Thái Tổ, TP Bắc Ninh',NULL,NULL,1,1,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(122,'AEON MaxValu Bắc Ninh 1','BN-TP-002',1,4,'Số 50 Nguyễn Trãi, Bắc Ninh',NULL,NULL,1,2,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(123,'AEON Express Bắc Ninh 1','BN-TP-003',1,4,'Số 25 Lê Văn Thịnh, Bắc Ninh',NULL,NULL,1,3,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(124,'AEON Express Bắc Ninh 2','BN-TP-004',1,4,'Số 75 Trần Hưng Đạo, Bắc Ninh',NULL,NULL,1,4,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(125,'AEON Express Bắc Ninh 3','BN-TP-005',1,4,'Số 100 Bắc Ninh 1',NULL,NULL,1,5,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(126,'AEON Express Bắc Ninh 4','BN-TP-006',1,4,'Số 125 Bắc Ninh 2',NULL,NULL,1,6,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(127,'AEON Express Bắc Ninh 5','BN-TP-007',1,4,'Số 150 Bắc Ninh 3',NULL,NULL,1,7,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(128,'AEON Express Bắc Ninh 6','BN-TP-008',1,4,'Số 175 Bắc Ninh 4',NULL,NULL,1,8,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(129,'AEON Express Bắc Ninh 7','BN-TP-009',1,4,'Số 200 Bắc Ninh 5',NULL,NULL,1,9,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(130,'AEON Express Bắc Ninh 8','BN-TP-010',1,4,'Số 225 Bắc Ninh 6',NULL,NULL,1,10,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(131,'AEON Express Bắc Ninh 9','BN-TP-011',1,4,'Số 250 Bắc Ninh 7',NULL,NULL,1,11,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(132,'AEON Express Bắc Ninh 10','BN-TP-012',1,4,'Số 275 Bắc Ninh 8',NULL,NULL,1,12,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(133,'AEON Express Bắc Ninh 11','BN-TP-013',1,4,'Số 300 Bắc Ninh 9',NULL,NULL,1,13,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(134,'AEON Express Bắc Ninh 12','BN-TP-014',1,4,'Số 325 Bắc Ninh 10',NULL,NULL,1,14,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(135,'AEON Express Bắc Ninh 13','BN-TP-015',1,4,'Số 350 Bắc Ninh 11',NULL,NULL,1,15,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(136,'AEON Express Bắc Ninh 14','BN-TP-016',1,4,'Số 375 Bắc Ninh 12',NULL,NULL,1,16,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(137,'AEON Express Bắc Ninh 15','BN-TP-017',1,4,'Số 400 Bắc Ninh 13',NULL,NULL,1,17,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(138,'AEON Express Bắc Ninh 16','BN-TP-018',1,4,'Số 425 Bắc Ninh 14',NULL,NULL,1,18,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(139,'AEON Express Bắc Ninh 17','BN-TP-019',1,4,'Số 450 Bắc Ninh 15',NULL,NULL,1,19,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(140,'AEON Express Bắc Ninh 18','BN-TP-020',1,4,'Số 475 Bắc Ninh 16',NULL,NULL,1,20,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(141,'AEON Express Bắc Ninh 19','BN-TP-021',1,4,'Số 500 Bắc Ninh 17',NULL,NULL,1,21,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(142,'AEON Express Bắc Ninh 20','BN-TP-022',1,4,'Số 525 Bắc Ninh 18',NULL,NULL,1,22,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(143,'AEON Express Bắc Ninh 21','BN-TP-023',1,4,'Số 550 Bắc Ninh 19',NULL,NULL,1,23,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(144,'AEON Express Bắc Ninh 22','BN-TP-024',1,4,'Số 575 Bắc Ninh 20',NULL,NULL,1,24,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(145,'AEON Express Bắc Ninh 23','BN-TP-025',1,4,'Số 600 Bắc Ninh 21',NULL,NULL,1,25,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(146,'AEON Express Bắc Ninh 24','BN-TP-026',1,4,'Số 625 Bắc Ninh 22',NULL,NULL,1,26,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(147,'AEON Express Bắc Ninh 25','BN-TP-027',1,4,'Số 650 Bắc Ninh 23',NULL,NULL,1,27,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(148,'AEON Express Bắc Ninh 26','BN-TP-028',1,4,'Số 675 Bắc Ninh 24',NULL,NULL,1,28,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(149,'AEON Express Bắc Ninh 27','BN-TP-029',1,4,'Số 700 Bắc Ninh 25',NULL,NULL,1,29,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(150,'AEON Express Bắc Ninh 28','BN-TP-030',1,4,'Số 725 Bắc Ninh 26',NULL,NULL,1,30,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(151,'AEON Supermarket Hải Phòng','HP-HB-001',1,5,'Số 1 Lê Đại Hành, Hồng Bàng, Hải Phòng',NULL,NULL,1,1,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(152,'AEON MaxValu Hải Phòng 1','HP-HB-002',1,5,'Số 50 Trần Nguyên Hãn, Hải Phòng',NULL,NULL,1,2,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(153,'AEON Express Hải Phòng 1','HP-HB-003',1,5,'Số 25 Cầu Đất, Hải Phòng',NULL,NULL,1,3,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(154,'AEON Express Hải Phòng 2','HP-HB-004',1,5,'Số 75 Tô Hiệu, Hải Phòng',NULL,NULL,1,4,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(155,'AEON Express Hải Phòng 3','HP-HB-005',1,5,'Số 100 Hải Phòng 1',NULL,NULL,1,5,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(156,'AEON Express Hải Phòng 4','HP-HB-006',1,5,'Số 125 Hải Phòng 2',NULL,NULL,1,6,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(157,'AEON Express Hải Phòng 5','HP-HB-007',1,5,'Số 150 Hải Phòng 3',NULL,NULL,1,7,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(158,'AEON Express Hải Phòng 6','HP-HB-008',1,5,'Số 175 Hải Phòng 4',NULL,NULL,1,8,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(159,'AEON Express Hải Phòng 7','HP-HB-009',1,5,'Số 200 Hải Phòng 5',NULL,NULL,1,9,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(160,'AEON Express Hải Phòng 8','HP-HB-010',1,5,'Số 225 Hải Phòng 6',NULL,NULL,1,10,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(161,'AEON Express Hải Phòng 9','HP-HB-011',1,5,'Số 250 Hải Phòng 7',NULL,NULL,1,11,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(162,'AEON Express Hải Phòng 10','HP-HB-012',1,5,'Số 275 Hải Phòng 8',NULL,NULL,1,12,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(163,'AEON Express Hải Phòng 11','HP-HB-013',1,5,'Số 300 Hải Phòng 9',NULL,NULL,1,13,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(164,'AEON Express Hải Phòng 12','HP-HB-014',1,5,'Số 325 Hải Phòng 10',NULL,NULL,1,14,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(165,'AEON Express Hải Phòng 13','HP-HB-015',1,5,'Số 350 Hải Phòng 11',NULL,NULL,1,15,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(166,'AEON Express Hải Phòng 14','HP-HB-016',1,5,'Số 375 Hải Phòng 12',NULL,NULL,1,16,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(167,'AEON Express Hải Phòng 15','HP-HB-017',1,5,'Số 400 Hải Phòng 13',NULL,NULL,1,17,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(168,'AEON Express Hải Phòng 16','HP-HB-018',1,5,'Số 425 Hải Phòng 14',NULL,NULL,1,18,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(169,'AEON Express Hải Phòng 17','HP-HB-019',1,5,'Số 450 Hải Phòng 15',NULL,NULL,1,19,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(170,'AEON Express Hải Phòng 18','HP-HB-020',1,5,'Số 475 Hải Phòng 16',NULL,NULL,1,20,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(171,'AEON Express Hải Phòng 19','HP-HB-021',1,5,'Số 500 Hải Phòng 17',NULL,NULL,1,21,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(172,'AEON Express Hải Phòng 20','HP-HB-022',1,5,'Số 525 Hải Phòng 18',NULL,NULL,1,22,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(173,'AEON Express Hải Phòng 21','HP-HB-023',1,5,'Số 550 Hải Phòng 19',NULL,NULL,1,23,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(174,'AEON Express Hải Phòng 22','HP-HB-024',1,5,'Số 575 Hải Phòng 20',NULL,NULL,1,24,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(175,'AEON Express Hải Phòng 23','HP-HB-025',1,5,'Số 600 Hải Phòng 21',NULL,NULL,1,25,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(176,'AEON Express Hải Phòng 24','HP-HB-026',1,5,'Số 625 Hải Phòng 22',NULL,NULL,1,26,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(177,'AEON Express Hải Phòng 25','HP-HB-027',1,5,'Số 650 Hải Phòng 23',NULL,NULL,1,27,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(178,'AEON Express Hải Phòng 26','HP-HB-028',1,5,'Số 675 Hải Phòng 24',NULL,NULL,1,28,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(179,'AEON Express Hải Phòng 27','HP-HB-029',1,5,'Số 700 Hải Phòng 25',NULL,NULL,1,29,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(180,'AEON Express Hải Phòng 28','HP-HB-030',1,5,'Số 725 Hải Phòng 26',NULL,NULL,1,30,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(181,'AEON Mall Đà Nẵng','DN-HC-001',2,6,'Số 1 Lê Duẩn, Hải Châu, Đà Nẵng',NULL,NULL,1,1,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(182,'AEON MaxValu Đà Nẵng 1','DN-HC-002',2,6,'Số 50 Nguyễn Văn Linh, Đà Nẵng',NULL,NULL,1,2,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(183,'AEON Express Đà Nẵng 1','DN-HC-003',2,6,'Số 25 Trần Phú, Đà Nẵng',NULL,NULL,1,3,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(184,'AEON Express Đà Nẵng 2','DN-HC-004',2,6,'Số 75 Bạch Đằng, Đà Nẵng',NULL,NULL,1,4,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(185,'AEON Express Đà Nẵng 3','DN-HC-005',2,6,'Số 100 Đà Nẵng 1',NULL,NULL,1,5,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(186,'AEON Express Đà Nẵng 4','DN-HC-006',2,6,'Số 125 Đà Nẵng 2',NULL,NULL,1,6,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(187,'AEON Express Đà Nẵng 5','DN-HC-007',2,6,'Số 150 Đà Nẵng 3',NULL,NULL,1,7,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(188,'AEON Express Đà Nẵng 6','DN-HC-008',2,6,'Số 175 Đà Nẵng 4',NULL,NULL,1,8,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(189,'AEON Express Đà Nẵng 7','DN-HC-009',2,6,'Số 200 Đà Nẵng 5',NULL,NULL,1,9,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(190,'AEON Express Đà Nẵng 8','DN-HC-010',2,6,'Số 225 Đà Nẵng 6',NULL,NULL,1,10,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(191,'AEON Express Đà Nẵng 9','DN-HC-011',2,6,'Số 250 Đà Nẵng 7',NULL,NULL,1,11,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(192,'AEON Express Đà Nẵng 10','DN-HC-012',2,6,'Số 275 Đà Nẵng 8',NULL,NULL,1,12,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(193,'AEON Express Đà Nẵng 11','DN-HC-013',2,6,'Số 300 Đà Nẵng 9',NULL,NULL,1,13,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(194,'AEON Express Đà Nẵng 12','DN-HC-014',2,6,'Số 325 Đà Nẵng 10',NULL,NULL,1,14,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(195,'AEON Express Đà Nẵng 13','DN-HC-015',2,6,'Số 350 Đà Nẵng 11',NULL,NULL,1,15,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(196,'AEON Express Đà Nẵng 14','DN-HC-016',2,6,'Số 375 Đà Nẵng 12',NULL,NULL,1,16,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(197,'AEON Express Đà Nẵng 15','DN-HC-017',2,6,'Số 400 Đà Nẵng 13',NULL,NULL,1,17,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(198,'AEON Express Đà Nẵng 16','DN-HC-018',2,6,'Số 425 Đà Nẵng 14',NULL,NULL,1,18,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(199,'AEON Express Đà Nẵng 17','DN-HC-019',2,6,'Số 450 Đà Nẵng 15',NULL,NULL,1,19,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(200,'AEON Express Đà Nẵng 18','DN-HC-020',2,6,'Số 475 Đà Nẵng 16',NULL,NULL,1,20,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(201,'AEON Express Đà Nẵng 19','DN-HC-021',2,6,'Số 500 Đà Nẵng 17',NULL,NULL,1,21,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(202,'AEON Express Đà Nẵng 20','DN-HC-022',2,6,'Số 525 Đà Nẵng 18',NULL,NULL,1,22,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(203,'AEON Express Đà Nẵng 21','DN-HC-023',2,6,'Số 550 Đà Nẵng 19',NULL,NULL,1,23,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(204,'AEON Express Đà Nẵng 22','DN-HC-024',2,6,'Số 575 Đà Nẵng 20',NULL,NULL,1,24,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(205,'AEON Express Đà Nẵng 23','DN-HC-025',2,6,'Số 600 Đà Nẵng 21',NULL,NULL,1,25,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(206,'AEON Supermarket Thanh Khê','DN-TK-001',2,7,'Số 1 Điện Biên Phủ, Thanh Khê, Đà Nẵng',NULL,NULL,1,1,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(207,'AEON MaxValu Thanh Khê 1','DN-TK-002',2,7,'Số 50 Ông Ích Khiêm, Thanh Khê',NULL,NULL,1,2,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(208,'AEON Express Thanh Khê 1','DN-TK-003',2,7,'Số 25 Lê Đình Lý, Thanh Khê',NULL,NULL,1,3,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(209,'AEON Express Thanh Khê 2','DN-TK-004',2,7,'Số 75 Thanh Khê 1',NULL,NULL,1,4,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(210,'AEON Express Thanh Khê 3','DN-TK-005',2,7,'Số 100 Thanh Khê 2',NULL,NULL,1,5,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(211,'AEON Express Thanh Khê 4','DN-TK-006',2,7,'Số 125 Thanh Khê 3',NULL,NULL,1,6,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(212,'AEON Express Thanh Khê 5','DN-TK-007',2,7,'Số 150 Thanh Khê 4',NULL,NULL,1,7,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(213,'AEON Express Thanh Khê 6','DN-TK-008',2,7,'Số 175 Thanh Khê 5',NULL,NULL,1,8,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(214,'AEON Express Thanh Khê 7','DN-TK-009',2,7,'Số 200 Thanh Khê 6',NULL,NULL,1,9,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(215,'AEON Express Thanh Khê 8','DN-TK-010',2,7,'Số 225 Thanh Khê 7',NULL,NULL,1,10,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(216,'AEON Express Thanh Khê 9','DN-TK-011',2,7,'Số 250 Thanh Khê 8',NULL,NULL,1,11,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(217,'AEON Express Thanh Khê 10','DN-TK-012',2,7,'Số 275 Thanh Khê 9',NULL,NULL,1,12,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(218,'AEON Express Thanh Khê 11','DN-TK-013',2,7,'Số 300 Thanh Khê 10',NULL,NULL,1,13,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(219,'AEON Express Thanh Khê 12','DN-TK-014',2,7,'Số 325 Thanh Khê 11',NULL,NULL,1,14,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(220,'AEON Express Thanh Khê 13','DN-TK-015',2,7,'Số 350 Thanh Khê 12',NULL,NULL,1,15,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(221,'AEON Express Thanh Khê 14','DN-TK-016',2,7,'Số 375 Thanh Khê 13',NULL,NULL,1,16,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(222,'AEON Express Thanh Khê 15','DN-TK-017',2,7,'Số 400 Thanh Khê 14',NULL,NULL,1,17,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(223,'AEON Express Thanh Khê 16','DN-TK-018',2,7,'Số 425 Thanh Khê 15',NULL,NULL,1,18,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(224,'AEON Express Thanh Khê 17','DN-TK-019',2,7,'Số 450 Thanh Khê 16',NULL,NULL,1,19,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(225,'AEON Express Thanh Khê 18','DN-TK-020',2,7,'Số 475 Thanh Khê 17',NULL,NULL,1,20,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(226,'AEON Express Thanh Khê 19','DN-TK-021',2,7,'Số 500 Thanh Khê 18',NULL,NULL,1,21,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(227,'AEON Express Thanh Khê 20','DN-TK-022',2,7,'Số 525 Thanh Khê 19',NULL,NULL,1,22,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(228,'AEON Express Thanh Khê 21','DN-TK-023',2,7,'Số 550 Thanh Khê 20',NULL,NULL,1,23,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(229,'AEON Express Thanh Khê 22','DN-TK-024',2,7,'Số 575 Thanh Khê 21',NULL,NULL,1,24,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(230,'AEON Express Thanh Khê 23','DN-TK-025',2,7,'Số 600 Thanh Khê 22',NULL,NULL,1,25,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(231,'AEON Supermarket Huế','HUE-TP-001',2,8,'Số 1 Lê Lợi, TP Huế',NULL,NULL,1,1,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(232,'AEON MaxValu Huế 1','HUE-TP-002',2,8,'Số 50 Trần Hưng Đạo, Huế',NULL,NULL,1,2,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(233,'AEON Express Huế 1','HUE-TP-003',2,8,'Số 25 Huế 1',NULL,NULL,1,3,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(234,'AEON Express Huế 2','HUE-TP-004',2,8,'Số 75 Huế 2',NULL,NULL,1,4,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(235,'AEON Express Huế 3','HUE-TP-005',2,8,'Số 100 Huế 3',NULL,NULL,1,5,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(236,'AEON Express Huế 4','HUE-TP-006',2,8,'Số 125 Huế 4',NULL,NULL,1,6,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(237,'AEON Express Huế 5','HUE-TP-007',2,8,'Số 150 Huế 5',NULL,NULL,1,7,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(238,'AEON Express Huế 6','HUE-TP-008',2,8,'Số 175 Huế 6',NULL,NULL,1,8,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(239,'AEON Express Huế 7','HUE-TP-009',2,8,'Số 200 Huế 7',NULL,NULL,1,9,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(240,'AEON Express Huế 8','HUE-TP-010',2,8,'Số 225 Huế 8',NULL,NULL,1,10,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(241,'AEON Express Huế 9','HUE-TP-011',2,8,'Số 250 Huế 9',NULL,NULL,1,11,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(242,'AEON Express Huế 10','HUE-TP-012',2,8,'Số 275 Huế 10',NULL,NULL,1,12,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(243,'AEON Express Huế 11','HUE-TP-013',2,8,'Số 300 Huế 11',NULL,NULL,1,13,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(244,'AEON Express Huế 12','HUE-TP-014',2,8,'Số 325 Huế 12',NULL,NULL,1,14,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(245,'AEON Express Huế 13','HUE-TP-015',2,8,'Số 350 Huế 13',NULL,NULL,1,15,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(246,'AEON Supermarket Hội An','QN-HA-001',2,9,'Số 1 Trần Phú, TP Hội An',NULL,NULL,1,1,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(247,'AEON MaxValu Hội An 1','QN-HA-002',2,9,'Số 50 Nguyễn Huệ, Hội An',NULL,NULL,1,2,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(248,'AEON Express Hội An 1','QN-HA-003',2,9,'Số 25 Hội An 1',NULL,NULL,1,3,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(249,'AEON Express Hội An 2','QN-HA-004',2,9,'Số 75 Hội An 2',NULL,NULL,1,4,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(250,'AEON Express Hội An 3','QN-HA-005',2,9,'Số 100 Hội An 3',NULL,NULL,1,5,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(251,'AEON Express Hội An 4','QN-HA-006',2,9,'Số 125 Hội An 4',NULL,NULL,1,6,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(252,'AEON Express Hội An 5','QN-HA-007',2,9,'Số 150 Hội An 5',NULL,NULL,1,7,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(253,'AEON Express Hội An 6','QN-HA-008',2,9,'Số 175 Hội An 6',NULL,NULL,1,8,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(254,'AEON Express Hội An 7','QN-HA-009',2,9,'Số 200 Hội An 7',NULL,NULL,1,9,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(255,'AEON Express Hội An 8','QN-HA-010',2,9,'Số 225 Hội An 8',NULL,NULL,1,10,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(256,'AEON Express Hội An 9','QN-HA-011',2,9,'Số 250 Hội An 9',NULL,NULL,1,11,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(257,'AEON Express Hội An 10','QN-HA-012',2,9,'Số 275 Hội An 10',NULL,NULL,1,12,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(258,'AEON Express Hội An 11','QN-HA-013',2,9,'Số 300 Hội An 11',NULL,NULL,1,13,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(259,'AEON Express Hội An 12','QN-HA-014',2,9,'Số 325 Hội An 12',NULL,NULL,1,14,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(260,'AEON Express Hội An 13','QN-HA-015',2,9,'Số 350 Hội An 13',NULL,NULL,1,15,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(261,'AEON Mall Tân Phú','HCM-TP-001',3,10,'Số 30 Bờ Bao Tân Thắng, Tân Phú, TP.HCM',NULL,NULL,1,1,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(262,'AEON MaxValu Tân Phú 1','HCM-TP-002',3,10,'Số 50 Lũy Bán Bích, Tân Phú',NULL,NULL,1,2,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(263,'AEON MaxValu Tân Phú 2','HCM-TP-003',3,10,'Số 100 Âu Cơ, Tân Phú',NULL,NULL,1,3,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(264,'AEON Express Tân Phú 1','HCM-TP-004',3,10,'Số 25 Hòa Bình, Tân Phú',NULL,NULL,1,4,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(265,'AEON Express Tân Phú 2','HCM-TP-005',3,10,'Số 75 Tân Sơn Nhì, Tân Phú',NULL,NULL,1,5,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(266,'AEON Express Tân Phú 3','HCM-TP-006',3,10,'Số 125 Tân Phú 1',NULL,NULL,1,6,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(267,'AEON Express Tân Phú 4','HCM-TP-007',3,10,'Số 150 Tân Phú 2',NULL,NULL,1,7,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(268,'AEON Express Tân Phú 5','HCM-TP-008',3,10,'Số 175 Tân Phú 3',NULL,NULL,1,8,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(269,'AEON Express Tân Phú 6','HCM-TP-009',3,10,'Số 200 Tân Phú 4',NULL,NULL,1,9,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(270,'AEON Express Tân Phú 7','HCM-TP-010',3,10,'Số 225 Tân Phú 5',NULL,NULL,1,10,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(271,'AEON Express Tân Phú 8','HCM-TP-011',3,10,'Số 250 Tân Phú 6',NULL,NULL,1,11,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(272,'AEON Express Tân Phú 9','HCM-TP-012',3,10,'Số 275 Tân Phú 7',NULL,NULL,1,12,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(273,'AEON Express Tân Phú 10','HCM-TP-013',3,10,'Số 300 Tân Phú 8',NULL,NULL,1,13,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(274,'AEON Express Tân Phú 11','HCM-TP-014',3,10,'Số 325 Tân Phú 9',NULL,NULL,1,14,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(275,'AEON Express Tân Phú 12','HCM-TP-015',3,10,'Số 350 Tân Phú 10',NULL,NULL,1,15,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(276,'AEON Express Tân Phú 13','HCM-TP-016',3,10,'Số 375 Tân Phú 11',NULL,NULL,1,16,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(277,'AEON Express Tân Phú 14','HCM-TP-017',3,10,'Số 400 Tân Phú 12',NULL,NULL,1,17,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(278,'AEON Express Tân Phú 15','HCM-TP-018',3,10,'Số 425 Tân Phú 13',NULL,NULL,1,18,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(279,'AEON Express Tân Phú 16','HCM-TP-019',3,10,'Số 450 Tân Phú 14',NULL,NULL,1,19,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(280,'AEON Express Tân Phú 17','HCM-TP-020',3,10,'Số 475 Tân Phú 15',NULL,NULL,1,20,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(281,'AEON Express Tân Phú 18','HCM-TP-021',3,10,'Số 500 Tân Phú 16',NULL,NULL,1,21,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(282,'AEON Express Tân Phú 19','HCM-TP-022',3,10,'Số 525 Tân Phú 17',NULL,NULL,1,22,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(283,'AEON Express Tân Phú 20','HCM-TP-023',3,10,'Số 550 Tân Phú 18',NULL,NULL,1,23,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(284,'AEON Express Tân Phú 21','HCM-TP-024',3,10,'Số 575 Tân Phú 19',NULL,NULL,1,24,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(285,'AEON Express Tân Phú 22','HCM-TP-025',3,10,'Số 600 Tân Phú 20',NULL,NULL,1,25,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(286,'AEON Express Tân Phú 23','HCM-TP-026',3,10,'Số 625 Tân Phú 21',NULL,NULL,1,26,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(287,'AEON Express Tân Phú 24','HCM-TP-027',3,10,'Số 650 Tân Phú 22',NULL,NULL,1,27,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(288,'AEON Express Tân Phú 25','HCM-TP-028',3,10,'Số 675 Tân Phú 23',NULL,NULL,1,28,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(289,'AEON Express Tân Phú 26','HCM-TP-029',3,10,'Số 700 Tân Phú 24',NULL,NULL,1,29,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(290,'AEON Express Tân Phú 27','HCM-TP-030',3,10,'Số 725 Tân Phú 25',NULL,NULL,1,30,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(291,'AEON Express Tân Phú 28','HCM-TP-031',3,10,'Số 750 Tân Phú 26',NULL,NULL,1,31,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(292,'AEON Express Tân Phú 29','HCM-TP-032',3,10,'Số 775 Tân Phú 27',NULL,NULL,1,32,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(293,'AEON Express Tân Phú 30','HCM-TP-033',3,10,'Số 800 Tân Phú 28',NULL,NULL,1,33,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(294,'AEON Express Tân Phú 31','HCM-TP-034',3,10,'Số 825 Tân Phú 29',NULL,NULL,1,34,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(295,'AEON Express Tân Phú 32','HCM-TP-035',3,10,'Số 850 Tân Phú 30',NULL,NULL,1,35,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(296,'AEON Express Tân Phú 33','HCM-TP-036',3,10,'Số 875 Tân Phú 31',NULL,NULL,1,36,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(297,'AEON Express Tân Phú 34','HCM-TP-037',3,10,'Số 900 Tân Phú 32',NULL,NULL,1,37,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(298,'AEON Express Tân Phú 35','HCM-TP-038',3,10,'Số 925 Tân Phú 33',NULL,NULL,1,38,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(299,'AEON Express Tân Phú 36','HCM-TP-039',3,10,'Số 950 Tân Phú 34',NULL,NULL,1,39,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(300,'AEON Express Tân Phú 37','HCM-TP-040',3,10,'Số 975 Tân Phú 35',NULL,NULL,1,40,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(301,'AEON Express Tân Phú 38','HCM-TP-041',3,10,'Số 1000 Tân Phú 36',NULL,NULL,1,41,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(302,'AEON Express Tân Phú 39','HCM-TP-042',3,10,'Số 1025 Tân Phú 37',NULL,NULL,1,42,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(303,'AEON Express Tân Phú 40','HCM-TP-043',3,10,'Số 1050 Tân Phú 38',NULL,NULL,1,43,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(304,'AEON Express Tân Phú 41','HCM-TP-044',3,10,'Số 1075 Tân Phú 39',NULL,NULL,1,44,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(305,'AEON Express Tân Phú 42','HCM-TP-045',3,10,'Số 1100 Tân Phú 40',NULL,NULL,1,45,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(306,'AEON Express Tân Phú 43','HCM-TP-046',3,10,'Số 1125 Tân Phú 41',NULL,NULL,1,46,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(307,'AEON Express Tân Phú 44','HCM-TP-047',3,10,'Số 1150 Tân Phú 42',NULL,NULL,1,47,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(308,'AEON Express Tân Phú 45','HCM-TP-048',3,10,'Số 1175 Tân Phú 43',NULL,NULL,1,48,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(309,'AEON Express Tân Phú 46','HCM-TP-049',3,10,'Số 1200 Tân Phú 44',NULL,NULL,1,49,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(310,'AEON Express Tân Phú 47','HCM-TP-050',3,10,'Số 1225 Tân Phú 45',NULL,NULL,1,50,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(311,'AEON Mall Bình Tân','HCM-BT-001',3,11,'Số 1 Kinh Dương Vương, Bình Tân, TP.HCM',NULL,NULL,1,1,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(312,'AEON MaxValu Bình Tân 1','HCM-BT-002',3,11,'Số 50 Tên Lửa, Bình Tân',NULL,NULL,1,2,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(313,'AEON MaxValu Bình Tân 2','HCM-BT-003',3,11,'Số 100 Hương lộ 2, Bình Tân',NULL,NULL,1,3,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(314,'AEON Express Bình Tân 1','HCM-BT-004',3,11,'Số 25 An Dương Vương, Bình Tân',NULL,NULL,1,4,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(315,'AEON Express Bình Tân 2','HCM-BT-005',3,11,'Số 75 Bình Tân 1',NULL,NULL,1,5,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(316,'AEON Express Bình Tân 3','HCM-BT-006',3,11,'Số 125 Bình Tân 2',NULL,NULL,1,6,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(317,'AEON Express Bình Tân 4','HCM-BT-007',3,11,'Số 150 Bình Tân 3',NULL,NULL,1,7,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(318,'AEON Express Bình Tân 5','HCM-BT-008',3,11,'Số 175 Bình Tân 4',NULL,NULL,1,8,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(319,'AEON Express Bình Tân 6','HCM-BT-009',3,11,'Số 200 Bình Tân 5',NULL,NULL,1,9,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(320,'AEON Express Bình Tân 7','HCM-BT-010',3,11,'Số 225 Bình Tân 6',NULL,NULL,1,10,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(321,'AEON Express Bình Tân 8','HCM-BT-011',3,11,'Số 250 Bình Tân 7',NULL,NULL,1,11,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(322,'AEON Express Bình Tân 9','HCM-BT-012',3,11,'Số 275 Bình Tân 8',NULL,NULL,1,12,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(323,'AEON Express Bình Tân 10','HCM-BT-013',3,11,'Số 300 Bình Tân 9',NULL,NULL,1,13,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(324,'AEON Express Bình Tân 11','HCM-BT-014',3,11,'Số 325 Bình Tân 10',NULL,NULL,1,14,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(325,'AEON Express Bình Tân 12','HCM-BT-015',3,11,'Số 350 Bình Tân 11',NULL,NULL,1,15,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(326,'AEON Express Bình Tân 13','HCM-BT-016',3,11,'Số 375 Bình Tân 12',NULL,NULL,1,16,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(327,'AEON Express Bình Tân 14','HCM-BT-017',3,11,'Số 400 Bình Tân 13',NULL,NULL,1,17,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(328,'AEON Express Bình Tân 15','HCM-BT-018',3,11,'Số 425 Bình Tân 14',NULL,NULL,1,18,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(329,'AEON Express Bình Tân 16','HCM-BT-019',3,11,'Số 450 Bình Tân 15',NULL,NULL,1,19,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(330,'AEON Express Bình Tân 17','HCM-BT-020',3,11,'Số 475 Bình Tân 16',NULL,NULL,1,20,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(331,'AEON Express Bình Tân 18','HCM-BT-021',3,11,'Số 500 Bình Tân 17',NULL,NULL,1,21,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(332,'AEON Express Bình Tân 19','HCM-BT-022',3,11,'Số 525 Bình Tân 18',NULL,NULL,1,22,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(333,'AEON Express Bình Tân 20','HCM-BT-023',3,11,'Số 550 Bình Tân 19',NULL,NULL,1,23,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(334,'AEON Express Bình Tân 21','HCM-BT-024',3,11,'Số 575 Bình Tân 20',NULL,NULL,1,24,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(335,'AEON Express Bình Tân 22','HCM-BT-025',3,11,'Số 600 Bình Tân 21',NULL,NULL,1,25,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(336,'AEON Express Bình Tân 23','HCM-BT-026',3,11,'Số 625 Bình Tân 22',NULL,NULL,1,26,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(337,'AEON Express Bình Tân 24','HCM-BT-027',3,11,'Số 650 Bình Tân 23',NULL,NULL,1,27,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(338,'AEON Express Bình Tân 25','HCM-BT-028',3,11,'Số 675 Bình Tân 24',NULL,NULL,1,28,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(339,'AEON Express Bình Tân 26','HCM-BT-029',3,11,'Số 700 Bình Tân 25',NULL,NULL,1,29,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(340,'AEON Express Bình Tân 27','HCM-BT-030',3,11,'Số 725 Bình Tân 26',NULL,NULL,1,30,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(341,'AEON Express Bình Tân 28','HCM-BT-031',3,11,'Số 750 Bình Tân 27',NULL,NULL,1,31,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(342,'AEON Express Bình Tân 29','HCM-BT-032',3,11,'Số 775 Bình Tân 28',NULL,NULL,1,32,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(343,'AEON Express Bình Tân 30','HCM-BT-033',3,11,'Số 800 Bình Tân 29',NULL,NULL,1,33,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(344,'AEON Express Bình Tân 31','HCM-BT-034',3,11,'Số 825 Bình Tân 30',NULL,NULL,1,34,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(345,'AEON Express Bình Tân 32','HCM-BT-035',3,11,'Số 850 Bình Tân 31',NULL,NULL,1,35,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(346,'AEON Express Bình Tân 33','HCM-BT-036',3,11,'Số 875 Bình Tân 32',NULL,NULL,1,36,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(347,'AEON Express Bình Tân 34','HCM-BT-037',3,11,'Số 900 Bình Tân 33',NULL,NULL,1,37,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(348,'AEON Express Bình Tân 35','HCM-BT-038',3,11,'Số 925 Bình Tân 34',NULL,NULL,1,38,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(349,'AEON Express Bình Tân 36','HCM-BT-039',3,11,'Số 950 Bình Tân 35',NULL,NULL,1,39,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(350,'AEON Express Bình Tân 37','HCM-BT-040',3,11,'Số 975 Bình Tân 36',NULL,NULL,1,40,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(351,'AEON Express Bình Tân 38','HCM-BT-041',3,11,'Số 1000 Bình Tân 37',NULL,NULL,1,41,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(352,'AEON Express Bình Tân 39','HCM-BT-042',3,11,'Số 1025 Bình Tân 38',NULL,NULL,1,42,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(353,'AEON Express Bình Tân 40','HCM-BT-043',3,11,'Số 1050 Bình Tân 39',NULL,NULL,1,43,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(354,'AEON Express Bình Tân 41','HCM-BT-044',3,11,'Số 1075 Bình Tân 40',NULL,NULL,1,44,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(355,'AEON Express Bình Tân 42','HCM-BT-045',3,11,'Số 1100 Bình Tân 41',NULL,NULL,1,45,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(356,'AEON Express Bình Tân 43','HCM-BT-046',3,11,'Số 1125 Bình Tân 42',NULL,NULL,1,46,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(357,'AEON Express Bình Tân 44','HCM-BT-047',3,11,'Số 1150 Bình Tân 43',NULL,NULL,1,47,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(358,'AEON Express Bình Tân 45','HCM-BT-048',3,11,'Số 1175 Bình Tân 44',NULL,NULL,1,48,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(359,'AEON Express Bình Tân 46','HCM-BT-049',3,11,'Số 1200 Bình Tân 45',NULL,NULL,1,49,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(360,'AEON Express Bình Tân 47','HCM-BT-050',3,11,'Số 1225 Bình Tân 46',NULL,NULL,1,50,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(361,'AEON Supermarket Gò Vấp','HCM-GV-001',3,12,'Số 242 Nguyễn Văn Lượng, Gò Vấp, TP.HCM',NULL,NULL,1,1,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(362,'AEON MaxValu Gò Vấp 1','HCM-GV-002',3,12,'Số 50 Quang Trung, Gò Vấp',NULL,NULL,1,2,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(363,'AEON MaxValu Gò Vấp 2','HCM-GV-003',3,12,'Số 100 Phan Văn Trị, Gò Vấp',NULL,NULL,1,3,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(364,'AEON Express Gò Vấp 1','HCM-GV-004',3,12,'Số 25 Nguyễn Oanh, Gò Vấp',NULL,NULL,1,4,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(365,'AEON Express Gò Vấp 2','HCM-GV-005',3,12,'Số 75 Gò Vấp 1',NULL,NULL,1,5,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(366,'AEON Express Gò Vấp 3','HCM-GV-006',3,12,'Số 125 Gò Vấp 2',NULL,NULL,1,6,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(367,'AEON Express Gò Vấp 4','HCM-GV-007',3,12,'Số 150 Gò Vấp 3',NULL,NULL,1,7,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(368,'AEON Express Gò Vấp 5','HCM-GV-008',3,12,'Số 175 Gò Vấp 4',NULL,NULL,1,8,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(369,'AEON Express Gò Vấp 6','HCM-GV-009',3,12,'Số 200 Gò Vấp 5',NULL,NULL,1,9,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(370,'AEON Express Gò Vấp 7','HCM-GV-010',3,12,'Số 225 Gò Vấp 6',NULL,NULL,1,10,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(371,'AEON Express Gò Vấp 8','HCM-GV-011',3,12,'Số 250 Gò Vấp 7',NULL,NULL,1,11,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(372,'AEON Express Gò Vấp 9','HCM-GV-012',3,12,'Số 275 Gò Vấp 8',NULL,NULL,1,12,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(373,'AEON Express Gò Vấp 10','HCM-GV-013',3,12,'Số 300 Gò Vấp 9',NULL,NULL,1,13,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(374,'AEON Express Gò Vấp 11','HCM-GV-014',3,12,'Số 325 Gò Vấp 10',NULL,NULL,1,14,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(375,'AEON Express Gò Vấp 12','HCM-GV-015',3,12,'Số 350 Gò Vấp 11',NULL,NULL,1,15,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(376,'AEON Express Gò Vấp 13','HCM-GV-016',3,12,'Số 375 Gò Vấp 12',NULL,NULL,1,16,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(377,'AEON Express Gò Vấp 14','HCM-GV-017',3,12,'Số 400 Gò Vấp 13',NULL,NULL,1,17,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(378,'AEON Express Gò Vấp 15','HCM-GV-018',3,12,'Số 425 Gò Vấp 14',NULL,NULL,1,18,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(379,'AEON Express Gò Vấp 16','HCM-GV-019',3,12,'Số 450 Gò Vấp 15',NULL,NULL,1,19,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(380,'AEON Express Gò Vấp 17','HCM-GV-020',3,12,'Số 475 Gò Vấp 16',NULL,NULL,1,20,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(381,'AEON Express Gò Vấp 18','HCM-GV-021',3,12,'Số 500 Gò Vấp 17',NULL,NULL,1,21,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(382,'AEON Express Gò Vấp 19','HCM-GV-022',3,12,'Số 525 Gò Vấp 18',NULL,NULL,1,22,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(383,'AEON Express Gò Vấp 20','HCM-GV-023',3,12,'Số 550 Gò Vấp 19',NULL,NULL,1,23,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(384,'AEON Express Gò Vấp 21','HCM-GV-024',3,12,'Số 575 Gò Vấp 20',NULL,NULL,1,24,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(385,'AEON Express Gò Vấp 22','HCM-GV-025',3,12,'Số 600 Gò Vấp 21',NULL,NULL,1,25,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(386,'AEON Express Gò Vấp 23','HCM-GV-026',3,12,'Số 625 Gò Vấp 22',NULL,NULL,1,26,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(387,'AEON Express Gò Vấp 24','HCM-GV-027',3,12,'Số 650 Gò Vấp 23',NULL,NULL,1,27,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(388,'AEON Express Gò Vấp 25','HCM-GV-028',3,12,'Số 675 Gò Vấp 24',NULL,NULL,1,28,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(389,'AEON Express Gò Vấp 26','HCM-GV-029',3,12,'Số 700 Gò Vấp 25',NULL,NULL,1,29,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(390,'AEON Express Gò Vấp 27','HCM-GV-030',3,12,'Số 725 Gò Vấp 26',NULL,NULL,1,30,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(391,'AEON Express Gò Vấp 28','HCM-GV-031',3,12,'Số 750 Gò Vấp 27',NULL,NULL,1,31,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(392,'AEON Express Gò Vấp 29','HCM-GV-032',3,12,'Số 775 Gò Vấp 28',NULL,NULL,1,32,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(393,'AEON Express Gò Vấp 30','HCM-GV-033',3,12,'Số 800 Gò Vấp 29',NULL,NULL,1,33,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(394,'AEON Express Gò Vấp 31','HCM-GV-034',3,12,'Số 825 Gò Vấp 30',NULL,NULL,1,34,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(395,'AEON Express Gò Vấp 32','HCM-GV-035',3,12,'Số 850 Gò Vấp 31',NULL,NULL,1,35,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(396,'AEON Express Gò Vấp 33','HCM-GV-036',3,12,'Số 875 Gò Vấp 32',NULL,NULL,1,36,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(397,'AEON Express Gò Vấp 34','HCM-GV-037',3,12,'Số 900 Gò Vấp 33',NULL,NULL,1,37,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(398,'AEON Express Gò Vấp 35','HCM-GV-038',3,12,'Số 925 Gò Vấp 34',NULL,NULL,1,38,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(399,'AEON Express Gò Vấp 36','HCM-GV-039',3,12,'Số 950 Gò Vấp 35',NULL,NULL,1,39,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(400,'AEON Express Gò Vấp 37','HCM-GV-040',3,12,'Số 975 Gò Vấp 36',NULL,NULL,1,40,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(401,'AEON Express Gò Vấp 38','HCM-GV-041',3,12,'Số 1000 Gò Vấp 37',NULL,NULL,1,41,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(402,'AEON Express Gò Vấp 39','HCM-GV-042',3,12,'Số 1025 Gò Vấp 38',NULL,NULL,1,42,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(403,'AEON Express Gò Vấp 40','HCM-GV-043',3,12,'Số 1050 Gò Vấp 39',NULL,NULL,1,43,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(404,'AEON Express Gò Vấp 41','HCM-GV-044',3,12,'Số 1075 Gò Vấp 40',NULL,NULL,1,44,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(405,'AEON Express Gò Vấp 42','HCM-GV-045',3,12,'Số 1100 Gò Vấp 41',NULL,NULL,1,45,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(406,'AEON Express Gò Vấp 43','HCM-GV-046',3,12,'Số 1125 Gò Vấp 42',NULL,NULL,1,46,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(407,'AEON Express Gò Vấp 44','HCM-GV-047',3,12,'Số 1150 Gò Vấp 43',NULL,NULL,1,47,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(408,'AEON Express Gò Vấp 45','HCM-GV-048',3,12,'Số 1175 Gò Vấp 44',NULL,NULL,1,48,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(409,'AEON Express Gò Vấp 46','HCM-GV-049',3,12,'Số 1200 Gò Vấp 45',NULL,NULL,1,49,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(410,'AEON Express Gò Vấp 47','HCM-GV-050',3,12,'Số 1225 Gò Vấp 46',NULL,NULL,1,50,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(411,'AEON Mall Bình Dương','BD-TA-001',3,13,'Số 1 Đại lộ Bình Dương, Thuận An, Bình Dương',NULL,NULL,1,1,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(412,'AEON MaxValu Thuận An 1','BD-TA-002',3,13,'Số 50 Thuận Giao, Thuận An',NULL,NULL,1,2,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(413,'AEON Express Thuận An 1','BD-TA-003',3,13,'Số 25 Thuận An 1',NULL,NULL,1,3,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(414,'AEON Express Thuận An 2','BD-TA-004',3,13,'Số 75 Thuận An 2',NULL,NULL,1,4,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(415,'AEON Express Thuận An 3','BD-TA-005',3,13,'Số 100 Thuận An 3',NULL,NULL,1,5,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(416,'AEON Express Thuận An 4','BD-TA-006',3,13,'Số 125 Thuận An 4',NULL,NULL,1,6,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(417,'AEON Express Thuận An 5','BD-TA-007',3,13,'Số 150 Thuận An 5',NULL,NULL,1,7,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(418,'AEON Express Thuận An 6','BD-TA-008',3,13,'Số 175 Thuận An 6',NULL,NULL,1,8,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(419,'AEON Express Thuận An 7','BD-TA-009',3,13,'Số 200 Thuận An 7',NULL,NULL,1,9,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(420,'AEON Express Thuận An 8','BD-TA-010',3,13,'Số 225 Thuận An 8',NULL,NULL,1,10,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(421,'AEON Express Thuận An 9','BD-TA-011',3,13,'Số 250 Thuận An 9',NULL,NULL,1,11,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(422,'AEON Express Thuận An 10','BD-TA-012',3,13,'Số 275 Thuận An 10',NULL,NULL,1,12,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(423,'AEON Express Thuận An 11','BD-TA-013',3,13,'Số 300 Thuận An 11',NULL,NULL,1,13,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(424,'AEON Express Thuận An 12','BD-TA-014',3,13,'Số 325 Thuận An 12',NULL,NULL,1,14,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(425,'AEON Express Thuận An 13','BD-TA-015',3,13,'Số 350 Thuận An 13',NULL,NULL,1,15,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(426,'AEON Express Thuận An 14','BD-TA-016',3,13,'Số 375 Thuận An 14',NULL,NULL,1,16,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(427,'AEON Express Thuận An 15','BD-TA-017',3,13,'Số 400 Thuận An 15',NULL,NULL,1,17,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(428,'AEON Express Thuận An 16','BD-TA-018',3,13,'Số 425 Thuận An 16',NULL,NULL,1,18,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(429,'AEON Express Thuận An 17','BD-TA-019',3,13,'Số 450 Thuận An 17',NULL,NULL,1,19,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(430,'AEON Express Thuận An 18','BD-TA-020',3,13,'Số 475 Thuận An 18',NULL,NULL,1,20,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(431,'AEON Express Thuận An 19','BD-TA-021',3,13,'Số 500 Thuận An 19',NULL,NULL,1,21,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(432,'AEON Express Thuận An 20','BD-TA-022',3,13,'Số 525 Thuận An 20',NULL,NULL,1,22,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(433,'AEON Express Thuận An 21','BD-TA-023',3,13,'Số 550 Thuận An 21',NULL,NULL,1,23,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(434,'AEON Express Thuận An 22','BD-TA-024',3,13,'Số 575 Thuận An 22',NULL,NULL,1,24,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(435,'AEON Express Thuận An 23','BD-TA-025',3,13,'Số 600 Thuận An 23',NULL,NULL,1,25,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(436,'AEON Supermarket Biên Hòa','DN-BH-001',3,14,'Số 1 Võ Thị Sáu, TP Biên Hòa, Đồng Nai',NULL,NULL,1,1,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(437,'AEON MaxValu Biên Hòa 1','DN-BH-002',3,14,'Số 50 Đồng Khởi, Biên Hòa',NULL,NULL,1,2,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(438,'AEON Express Biên Hòa 1','DN-BH-003',3,14,'Số 25 Biên Hòa 1',NULL,NULL,1,3,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(439,'AEON Express Biên Hòa 2','DN-BH-004',3,14,'Số 75 Biên Hòa 2',NULL,NULL,1,4,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(440,'AEON Express Biên Hòa 3','DN-BH-005',3,14,'Số 100 Biên Hòa 3',NULL,NULL,1,5,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(441,'AEON Express Biên Hòa 4','DN-BH-006',3,14,'Số 125 Biên Hòa 4',NULL,NULL,1,6,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(442,'AEON Express Biên Hòa 5','DN-BH-007',3,14,'Số 150 Biên Hòa 5',NULL,NULL,1,7,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(443,'AEON Express Biên Hòa 6','DN-BH-008',3,14,'Số 175 Biên Hòa 6',NULL,NULL,1,8,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(444,'AEON Express Biên Hòa 7','DN-BH-009',3,14,'Số 200 Biên Hòa 7',NULL,NULL,1,9,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(445,'AEON Express Biên Hòa 8','DN-BH-010',3,14,'Số 225 Biên Hòa 8',NULL,NULL,1,10,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(446,'AEON Express Biên Hòa 9','DN-BH-011',3,14,'Số 250 Biên Hòa 9',NULL,NULL,1,11,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(447,'AEON Express Biên Hòa 10','DN-BH-012',3,14,'Số 275 Biên Hòa 10',NULL,NULL,1,12,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(448,'AEON Express Biên Hòa 11','DN-BH-013',3,14,'Số 300 Biên Hòa 11',NULL,NULL,1,13,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(449,'AEON Express Biên Hòa 12','DN-BH-014',3,14,'Số 325 Biên Hòa 12',NULL,NULL,1,14,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(450,'AEON Express Biên Hòa 13','DN-BH-015',3,14,'Số 350 Biên Hòa 13',NULL,NULL,1,15,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(451,'AEON Supermarket Dĩ An','BD-DA-001',3,15,'Số 1 Lý Thường Kiệt, TX Dĩ An, Bình Dương',NULL,NULL,1,1,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(452,'AEON MaxValu Dĩ An 1','BD-DA-002',3,15,'Số 50 Trần Quốc Toản, Dĩ An',NULL,NULL,1,2,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(453,'AEON Express Dĩ An 1','BD-DA-003',3,15,'Số 25 Dĩ An 1',NULL,NULL,1,3,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(454,'AEON Express Dĩ An 2','BD-DA-004',3,15,'Số 75 Dĩ An 2',NULL,NULL,1,4,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(455,'AEON Express Dĩ An 3','BD-DA-005',3,15,'Số 100 Dĩ An 3',NULL,NULL,1,5,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(456,'AEON Express Dĩ An 4','BD-DA-006',3,15,'Số 125 Dĩ An 4',NULL,NULL,1,6,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(457,'AEON Express Dĩ An 5','BD-DA-007',3,15,'Số 150 Dĩ An 5',NULL,NULL,1,7,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(458,'AEON Express Dĩ An 6','BD-DA-008',3,15,'Số 175 Dĩ An 6',NULL,NULL,1,8,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(459,'AEON Express Dĩ An 7','BD-DA-009',3,15,'Số 200 Dĩ An 7',NULL,NULL,1,9,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41'),(460,'AEON Express Dĩ An 8','BD-DA-010',3,15,'Số 225 Dĩ An 8',NULL,NULL,1,10,NULL,'active','2026-01-22 02:58:41','2026-01-22 02:58:41');
/*!40000 ALTER TABLE `stores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `task_check_list`
--

DROP TABLE IF EXISTS `task_check_list`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `task_check_list` (
  `id` int NOT NULL AUTO_INCREMENT,
  `task_id` int DEFAULT NULL,
  `check_list_id` int DEFAULT NULL,
  `check_status` tinyint(1) DEFAULT '0',
  `completed_at` timestamp NULL DEFAULT NULL,
  `completed_by` int DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  UNIQUE KEY `task_check_list_unique` (`task_id`,`check_list_id`),
  KEY `fk_task_check_list_checklist` (`check_list_id`),
  KEY `fk_task_check_list_completed_by` (`completed_by`),
  CONSTRAINT `fk_task_check_list_checklist` FOREIGN KEY (`check_list_id`) REFERENCES `check_lists` (`check_list_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_task_check_list_completed_by` FOREIGN KEY (`completed_by`) REFERENCES `staff` (`staff_id`),
  CONSTRAINT `fk_task_check_list_task` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`task_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `task_check_list`
--

LOCK TABLES `task_check_list` WRITE;
/*!40000 ALTER TABLE `task_check_list` DISABLE KEYS */;
/*!40000 ALTER TABLE `task_check_list` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `task_comments`
--

DROP TABLE IF EXISTS `task_comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `task_comments` (
  `comment_id` int NOT NULL AUTO_INCREMENT,
  `task_id` int DEFAULT NULL,
  `store_result_id` int DEFAULT NULL,
  `staff_result_id` int DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`comment_id`),
  KEY `fk_task_comments_task` (`task_id`),
  KEY `fk_task_comments_user` (`user_id`),
  KEY `idx_task_comments_store_result` (`store_result_id`),
  KEY `idx_task_comments_staff_result` (`staff_result_id`),
  CONSTRAINT `fk_task_comments_staff_result` FOREIGN KEY (`staff_result_id`) REFERENCES `task_staff_results` (`result_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_task_comments_store_result` FOREIGN KEY (`store_result_id`) REFERENCES `task_store_results` (`result_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_task_comments_task` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`task_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_task_comments_user` FOREIGN KEY (`user_id`) REFERENCES `staff` (`staff_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `task_comments`
--

LOCK TABLES `task_comments` WRITE;
/*!40000 ALTER TABLE `task_comments` DISABLE KEYS */;
/*!40000 ALTER TABLE `task_comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `task_groups`
--

DROP TABLE IF EXISTS `task_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `task_groups` (
  `group_id` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `group_code` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `group_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `priority` int DEFAULT '50',
  `sort_order` int DEFAULT '0',
  `color_bg` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT '#f3f4f6',
  `color_text` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT '#374151',
  `color_border` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT '#9ca3af',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`group_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `task_groups`
--

LOCK TABLES `task_groups` WRITE;
/*!40000 ALTER TABLE `task_groups` DISABLE KEYS */;
INSERT INTO `task_groups` VALUES ('DELICA','DELICA','Delicatessen',65,7,'#fce7f3','#9d174d','#ec4899',1,'2026-01-22 01:42:52','2026-01-22 01:42:52'),('DND','DND','Do Not Disturb',50,8,'#fee2e2','#991b1b','#ef4444',1,'2026-01-22 01:42:52','2026-01-22 01:42:52'),('DRY','DRY','Dry/Grocery',80,3,'#dbeafe','#1e40af','#3b82f6',1,'2026-01-22 01:42:52','2026-01-22 01:42:52'),('LEADER','LEADER','Leader Tasks',95,5,'#99f6e4','#134e4a','#2dd4bf',1,'2026-01-22 01:42:52','2026-01-22 01:42:52'),('MMD','MMD','Logistics/Receiving',75,4,'#e0e7ff','#3730a3','#6366f1',1,'2026-01-22 01:42:52','2026-01-22 01:42:52'),('OTHER','OTHER','Other Tasks',10,9,'#f3f4f6','#374151','#9ca3af',1,'2026-01-22 01:42:52','2026-01-22 01:42:52'),('PERI','PERI','Perishable',90,2,'#fef3c7','#92400e','#f59e0b',1,'2026-01-22 01:42:52','2026-01-22 01:42:52'),('POS','POS','Thu ngan',100,1,'#e2e8f0','#1e293b','#94a3b8',1,'2026-01-22 01:42:52','2026-01-22 01:42:52'),('QC-FSH','QC-FSH','Quality Control',70,6,'#dcfce7','#166534','#22c55e',1,'2026-01-22 01:42:52','2026-01-22 01:42:52');
/*!40000 ALTER TABLE `task_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `task_images`
--

DROP TABLE IF EXISTS `task_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `task_images` (
  `image_id` int NOT NULL AUTO_INCREMENT,
  `task_id` int DEFAULT NULL,
  `store_result_id` int DEFAULT NULL,
  `staff_result_id` int DEFAULT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image_url` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `thumbnail_url` text COLLATE utf8mb4_unicode_ci,
  `uploaded_by_id` int DEFAULT NULL,
  `is_completed` tinyint(1) DEFAULT '0',
  `uploaded_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`image_id`),
  KEY `fk_task_images_task` (`task_id`),
  KEY `fk_task_images_uploaded_by` (`uploaded_by_id`),
  KEY `idx_task_images_store_result` (`store_result_id`),
  KEY `idx_task_images_staff_result` (`staff_result_id`),
  CONSTRAINT `fk_task_images_staff_result` FOREIGN KEY (`staff_result_id`) REFERENCES `task_staff_results` (`result_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_task_images_store_result` FOREIGN KEY (`store_result_id`) REFERENCES `task_store_results` (`result_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_task_images_task` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`task_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_task_images_uploaded_by` FOREIGN KEY (`uploaded_by_id`) REFERENCES `staff` (`staff_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `task_images`
--

LOCK TABLES `task_images` WRITE;
/*!40000 ALTER TABLE `task_images` DISABLE KEYS */;
/*!40000 ALTER TABLE `task_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `task_library`
-- Redesigned per CLAUDE.md Section 12.0 & 12.3
-- Library stores task templates (from Task List auto-save or direct creation)
--

DROP TABLE IF EXISTS `task_library`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `task_library` (
  `task_library_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  -- Source tracking
  `source` enum('task_list','library') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'task_list' COMMENT 'task_list=auto-saved when task approved, library=created directly',
  `status` enum('draft','approve','available','cooldown') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'available' COMMENT 'draft/approve only for direct Library creation (Flow 2)',
  -- A. Information Section
  `task_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `task_description` text COLLATE utf8mb4_unicode_ci,
  `task_type_id` int DEFAULT NULL COMMENT 'FK to code_master',
  `response_type_id` int DEFAULT NULL COMMENT 'FK to code_master',
  `response_num` int DEFAULT NULL,
  `is_repeat` tinyint(1) DEFAULT '0',
  `repeat_config` json DEFAULT NULL,
  `dept_id` int DEFAULT NULL COMMENT 'FK to departments',
  -- B. Instructions Section
  `task_instruction_type` enum('image','document') COLLATE utf8mb4_unicode_ci DEFAULT 'image',
  `manual_link` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `photo_guidelines` json DEFAULT NULL,
  `manual_id` int DEFAULT NULL COMMENT 'FK to manual_documents',
  `comment` text COLLATE utf8mb4_unicode_ci,
  `attachments` json DEFAULT NULL,
  -- Creator & Approval
  `created_staff_id` int DEFAULT NULL,
  `approver_id` int DEFAULT NULL,
  `submitted_at` timestamp NULL DEFAULT NULL,
  `approved_at` timestamp NULL DEFAULT NULL,
  -- Rejection tracking
  `rejection_count` int DEFAULT '0',
  `has_changes_since_rejection` tinyint(1) DEFAULT '0',
  `last_rejection_reason` text COLLATE utf8mb4_unicode_ci,
  `last_rejected_at` timestamp NULL DEFAULT NULL,
  `last_rejected_by` int DEFAULT NULL,
  -- Dispatch tracking
  `dispatch_count` int DEFAULT '0',
  `last_dispatched_at` timestamp NULL DEFAULT NULL,
  `last_dispatched_by` int DEFAULT NULL,
  -- Cooldown mechanism
  `cooldown_until` timestamp NULL DEFAULT NULL,
  `cooldown_triggered_by` int DEFAULT NULL,
  `cooldown_triggered_at` timestamp NULL DEFAULT NULL,
  -- Issue tracking
  `had_issues` tinyint(1) DEFAULT '0',
  `issues_note` text COLLATE utf8mb4_unicode_ci,
  -- Link to original task
  `original_task_id` int DEFAULT NULL,
  -- Audit timestamps
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`task_library_id`),
  KEY `idx_library_source` (`source`),
  KEY `idx_library_status` (`status`),
  KEY `idx_library_creator` (`created_staff_id`),
  KEY `idx_library_dept` (`dept_id`),
  KEY `idx_library_status_source` (`status`,`source`),
  KEY `fk_library_task_type` (`task_type_id`),
  KEY `fk_library_response_type` (`response_type_id`),
  KEY `fk_library_manual` (`manual_id`),
  KEY `fk_library_approver` (`approver_id`),
  KEY `fk_library_rejected_by` (`last_rejected_by`),
  KEY `fk_library_dispatched_by` (`last_dispatched_by`),
  KEY `fk_library_cooldown_by` (`cooldown_triggered_by`),
  KEY `fk_library_original_task` (`original_task_id`),
  CONSTRAINT `fk_library_approver` FOREIGN KEY (`approver_id`) REFERENCES `staff` (`staff_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_library_cooldown_by` FOREIGN KEY (`cooldown_triggered_by`) REFERENCES `staff` (`staff_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_library_creator` FOREIGN KEY (`created_staff_id`) REFERENCES `staff` (`staff_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_library_dept` FOREIGN KEY (`dept_id`) REFERENCES `departments` (`department_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_library_dispatched_by` FOREIGN KEY (`last_dispatched_by`) REFERENCES `staff` (`staff_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_library_manual` FOREIGN KEY (`manual_id`) REFERENCES `manual_documents` (`document_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_library_original_task` FOREIGN KEY (`original_task_id`) REFERENCES `tasks` (`task_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_library_rejected_by` FOREIGN KEY (`last_rejected_by`) REFERENCES `staff` (`staff_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_library_response_type` FOREIGN KEY (`response_type_id`) REFERENCES `code_master` (`code_master_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_library_task_type` FOREIGN KEY (`task_type_id`) REFERENCES `code_master` (`code_master_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `task_library` (empty - templates created at runtime)
--

LOCK TABLES `task_library` WRITE;
/*!40000 ALTER TABLE `task_library` DISABLE KEYS */;
/*!40000 ALTER TABLE `task_library` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `task_likes`
--

DROP TABLE IF EXISTS `task_likes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `task_likes` (
  `like_id` int NOT NULL AUTO_INCREMENT,
  `store_result_id` int DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`like_id`),
  UNIQUE KEY `task_likes_unique` (`store_result_id`,`user_id`),
  KEY `fk_task_likes_user` (`user_id`),
  KEY `idx_task_likes_store_result` (`store_result_id`),
  CONSTRAINT `fk_task_likes_store_result` FOREIGN KEY (`store_result_id`) REFERENCES `task_store_results` (`result_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_task_likes_user` FOREIGN KEY (`user_id`) REFERENCES `staff` (`staff_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `task_likes`
--

LOCK TABLES `task_likes` WRITE;
/*!40000 ALTER TABLE `task_likes` DISABLE KEYS */;
/*!40000 ALTER TABLE `task_likes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `task_staff_results`
--

DROP TABLE IF EXISTS `task_staff_results`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `task_staff_results` (
  `result_id` int NOT NULL AUTO_INCREMENT,
  `task_id` int DEFAULT NULL,
  `staff_id` int DEFAULT NULL,
  `store_id` int DEFAULT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT 'not_started',
  `progress` int DEFAULT '0',
  `progress_text` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`result_id`),
  KEY `fk_task_staff_results_store` (`store_id`),
  KEY `idx_task_staff_results_task` (`task_id`),
  KEY `idx_task_staff_results_staff` (`staff_id`),
  CONSTRAINT `fk_task_staff_results_staff` FOREIGN KEY (`staff_id`) REFERENCES `staff` (`staff_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_task_staff_results_store` FOREIGN KEY (`store_id`) REFERENCES `stores` (`store_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_task_staff_results_task` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`task_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `task_staff_results`
--

LOCK TABLES `task_staff_results` WRITE;
/*!40000 ALTER TABLE `task_staff_results` DISABLE KEYS */;
/*!40000 ALTER TABLE `task_staff_results` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `task_store_results`
--

DROP TABLE IF EXISTS `task_store_results`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `task_store_results` (
  `result_id` int NOT NULL AUTO_INCREMENT,
  `task_id` int DEFAULT NULL,
  `store_id` int DEFAULT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT 'not_started',
  `start_time` timestamp NULL DEFAULT NULL,
  `completed_time` timestamp NULL DEFAULT NULL,
  `completed_by_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`result_id`),
  KEY `fk_task_store_results_completed_by` (`completed_by_id`),
  KEY `idx_task_store_results_task` (`task_id`),
  KEY `idx_task_store_results_store` (`store_id`),
  CONSTRAINT `fk_task_store_results_completed_by` FOREIGN KEY (`completed_by_id`) REFERENCES `staff` (`staff_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_task_store_results_store` FOREIGN KEY (`store_id`) REFERENCES `stores` (`store_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_task_store_results_task` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`task_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `task_store_results`
--

LOCK TABLES `task_store_results` WRITE;
/*!40000 ALTER TABLE `task_store_results` DISABLE KEYS */;
/*!40000 ALTER TABLE `task_store_results` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `task_workflow_steps`
--

DROP TABLE IF EXISTS `task_workflow_steps`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `task_workflow_steps` (
  `step_id` int NOT NULL AUTO_INCREMENT,
  `task_id` int DEFAULT NULL,
  `step_number` int NOT NULL,
  `step_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `assignee_id` int DEFAULT NULL,
  `skip_info` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `comment` text COLLATE utf8mb4_unicode_ci,
  `completed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`step_id`),
  KEY `fk_task_workflow_steps_assignee` (`assignee_id`),
  KEY `idx_task_workflow_steps_task` (`task_id`),
  CONSTRAINT `fk_task_workflow_steps_assignee` FOREIGN KEY (`assignee_id`) REFERENCES `staff` (`staff_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_task_workflow_steps_task` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`task_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `task_workflow_steps`
--

LOCK TABLES `task_workflow_steps` WRITE;
/*!40000 ALTER TABLE `task_workflow_steps` DISABLE KEYS */;
/*!40000 ALTER TABLE `task_workflow_steps` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tasks`
--

DROP TABLE IF EXISTS `tasks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tasks` (
  `task_id` int NOT NULL AUTO_INCREMENT,
  `parent_task_id` int DEFAULT NULL,
  `task_level` tinyint DEFAULT '1',
  `source` enum('task_list','library','todo_task') COLLATE utf8mb4_unicode_ci DEFAULT 'task_list',
  `receiver_type` enum('store','hq_user') COLLATE utf8mb4_unicode_ci DEFAULT 'store',
  `task_name` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `task_description` text COLLATE utf8mb4_unicode_ci,
  `task_instruction_type` enum('image','document') COLLATE utf8mb4_unicode_ci DEFAULT 'image' COMMENT 'Type determines required fields: image=photo_guidelines, document=note',
  `manual_link` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Direct URL link to manual/instruction document',
  `photo_guidelines` json DEFAULT NULL COMMENT 'Array of photo URLs for task instructions (when type=image)',
  `manual_id` int DEFAULT NULL,
  `task_type_id` int DEFAULT NULL,
  `response_type_id` int DEFAULT NULL,
  `response_num` int DEFAULT NULL,
  `is_repeat` tinyint(1) DEFAULT '0',
  `repeat_config` json DEFAULT NULL,
  `dept_id` int DEFAULT NULL,
  `assigned_store_id` int DEFAULT NULL,
  `assigned_staff_id` int DEFAULT NULL,
  `do_staff_id` int DEFAULT NULL,
  `status_id` int DEFAULT NULL,
  `priority` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT 'normal',
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `start_time` time DEFAULT NULL,
  `due_datetime` timestamp NULL DEFAULT NULL,
  `completed_time` timestamp NULL DEFAULT NULL,
  `comment` text COLLATE utf8mb4_unicode_ci,
  `attachments` json DEFAULT NULL,
  `created_staff_id` int DEFAULT NULL,
  `approver_id` int DEFAULT NULL,
  `rejection_count` int DEFAULT '0',
  `has_changes_since_rejection` tinyint(1) DEFAULT '0',
  `last_rejection_reason` text COLLATE utf8mb4_unicode_ci,
  `last_rejected_at` timestamp NULL DEFAULT NULL,
  `last_rejected_by` int DEFAULT NULL,
  `library_task_id` bigint unsigned DEFAULT NULL COMMENT 'FK to task_library for tasks created from templates',
  `submitted_at` timestamp NULL DEFAULT NULL,
  `approved_at` timestamp NULL DEFAULT NULL,
  `dispatched_at` timestamp NULL DEFAULT NULL COMMENT 'Timestamp when task was sent to stores after approval',
  `paused_at` timestamp NULL DEFAULT NULL COMMENT 'Timestamp when task was paused by approver',
  `paused_by` int DEFAULT NULL COMMENT 'Staff ID who paused the task (must be approver)',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`task_id`),
  KEY `fk_tasks_manual` (`manual_id`),
  KEY `fk_tasks_task_type` (`task_type_id`),
  KEY `fk_tasks_response_type` (`response_type_id`),
  KEY `fk_tasks_dept` (`dept_id`),
  KEY `fk_tasks_do_staff` (`do_staff_id`),
  KEY `fk_tasks_created_staff` (`created_staff_id`),
  KEY `fk_tasks_last_rejected_by` (`last_rejected_by`),
  KEY `idx_tasks_source_status_created` (`source`,`status_id`,`created_staff_id`),
  KEY `idx_tasks_approver_status` (`approver_id`,`status_id`),
  KEY `idx_tasks_parent` (`parent_task_id`),
  KEY `idx_tasks_level` (`task_level`),
  KEY `idx_tasks_status` (`status_id`),
  KEY `idx_tasks_assigned_staff` (`assigned_staff_id`),
  KEY `idx_tasks_assigned_store` (`assigned_store_id`),
  KEY `idx_tasks_dates` (`start_date`,`end_date`),
  KEY `idx_tasks_instruction_type` (`task_instruction_type`),
  KEY `fk_tasks_paused_by` (`paused_by`),
  KEY `idx_tasks_library` (`library_task_id`),
  KEY `idx_tasks_draft_status` (`created_staff_id`,`source`,`status_id`,`submitted_at`),
  KEY `idx_tasks_receiver_type` (`receiver_type`),
  KEY `idx_tasks_dispatched` (`dispatched_at`,`status_id`),
  CONSTRAINT `fk_tasks_approver` FOREIGN KEY (`approver_id`) REFERENCES `staff` (`staff_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_tasks_assigned_staff` FOREIGN KEY (`assigned_staff_id`) REFERENCES `staff` (`staff_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_tasks_assigned_store` FOREIGN KEY (`assigned_store_id`) REFERENCES `stores` (`store_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_tasks_created_staff` FOREIGN KEY (`created_staff_id`) REFERENCES `staff` (`staff_id`),
  CONSTRAINT `fk_tasks_dept` FOREIGN KEY (`dept_id`) REFERENCES `departments` (`department_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_tasks_do_staff` FOREIGN KEY (`do_staff_id`) REFERENCES `staff` (`staff_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_tasks_last_rejected_by` FOREIGN KEY (`last_rejected_by`) REFERENCES `staff` (`staff_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_tasks_manual` FOREIGN KEY (`manual_id`) REFERENCES `manuals` (`manual_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_tasks_parent` FOREIGN KEY (`parent_task_id`) REFERENCES `tasks` (`task_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_tasks_response_type` FOREIGN KEY (`response_type_id`) REFERENCES `code_master` (`code_master_id`),
  CONSTRAINT `fk_tasks_status` FOREIGN KEY (`status_id`) REFERENCES `code_master` (`code_master_id`),
  CONSTRAINT `fk_tasks_task_type` FOREIGN KEY (`task_type_id`) REFERENCES `code_master` (`code_master_id`),
  CONSTRAINT `fk_tasks_paused_by` FOREIGN KEY (`paused_by`) REFERENCES `staff` (`staff_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_tasks_library` FOREIGN KEY (`library_task_id`) REFERENCES `task_library` (`task_library_id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=91 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tasks`
--

LOCK TABLES `tasks` WRITE;
/*!40000 ALTER TABLE `tasks` DISABLE KEYS */;
INSERT INTO `tasks` (`task_id`,`parent_task_id`,`task_level`,`source`,`receiver_type`,`task_name`,`task_description`,`manual_id`,`task_type_id`,`response_type_id`,`response_num`,`is_repeat`,`repeat_config`,`dept_id`,`assigned_store_id`,`assigned_staff_id`,`do_staff_id`,`status_id`,`priority`,`start_date`,`end_date`,`start_time`,`due_datetime`,`completed_time`,`comment`,`attachments`,`created_staff_id`,`approver_id`,`rejection_count`,`has_changes_since_rejection`,`last_rejection_reason`,`last_rejected_at`,`last_rejected_by`,`library_task_id`,`submitted_at`,`approved_at`,`created_at`,`updated_at`) VALUES (1,NULL,1,'task_list','store','Lập kế hoạch kiểm kê Q1','Lên kế hoạch kiểm kê hàng hóa quý 1',NULL,1,5,NULL,0,NULL,1,NULL,NULL,NULL,12,'normal','2026-01-29','2026-02-05',NULL,NULL,NULL,NULL,NULL,1,1,0,0,NULL,NULL,NULL,NULL,NULL,NULL,'2026-01-22 01:42:52','2026-01-22 01:42:52'),(2,NULL,1,'task_list','store','Chuẩn bị báo cáo tài chính','Draft báo cáo tài chính cuối năm',NULL,1,6,NULL,0,NULL,2,NULL,NULL,NULL,12,'high','2026-01-27','2026-02-03',NULL,NULL,NULL,NULL,NULL,2,1,0,0,NULL,NULL,NULL,NULL,NULL,NULL,'2026-01-22 01:42:52','2026-01-22 01:42:52'),(3,NULL,1,'task_list','store','Kế hoạch training Q2','Lập kế hoạch đào tạo nhân viên Q2',NULL,3,6,NULL,0,NULL,6,NULL,NULL,NULL,12,'normal','2026-02-01','2026-02-21',NULL,NULL,NULL,NULL,NULL,1,1,0,0,NULL,NULL,NULL,NULL,NULL,NULL,'2026-01-22 01:42:52','2026-01-22 01:42:52'),(4,NULL,1,'task_list','store','Đề xuất cải tiến quy trình','Đề xuất cải tiến quy trình vận hành',NULL,1,6,NULL,0,NULL,1,NULL,NULL,NULL,12,'normal','2026-01-25','2026-02-01',NULL,NULL,NULL,NULL,NULL,4,1,0,0,NULL,NULL,NULL,NULL,NULL,NULL,'2026-01-22 01:42:52','2026-01-22 01:42:52'),(5,NULL,1,'task_list','store','Thiết kế layout mới','Thiết kế layout kệ hàng mới cho Q2',NULL,2,4,NULL,0,NULL,1,NULL,NULL,NULL,12,'normal','2026-02-06','2026-02-16',NULL,NULL,NULL,NULL,NULL,5,4,0,0,NULL,NULL,NULL,NULL,NULL,NULL,'2026-01-22 01:42:52','2026-01-22 01:42:52'),(6,NULL,1,'task_list','store','Kế hoạch khuyến mãi Tết','Lên kế hoạch chương trình khuyến mãi Tết',NULL,2,4,NULL,0,NULL,1,NULL,NULL,NULL,12,'high','2026-02-11','2026-02-26',NULL,NULL,NULL,NULL,NULL,1,1,0,0,NULL,NULL,NULL,NULL,NULL,NULL,'2026-01-22 01:42:52','2026-01-22 01:42:52'),(7,NULL,1,'task_list','store','Đánh giá nhà cung cấp','Đánh giá và xếp hạng nhà cung cấp',NULL,1,5,NULL,0,NULL,1,NULL,NULL,NULL,12,'normal','2026-01-30','2026-02-06',NULL,NULL,NULL,NULL,NULL,2,1,0,0,NULL,NULL,NULL,NULL,NULL,NULL,'2026-01-22 01:42:52','2026-01-22 01:42:52'),(8,NULL,1,'task_list','store','Kế hoạch bảo trì thiết bị','Lập kế hoạch bảo trì thiết bị định kỳ',NULL,3,5,NULL,0,NULL,4,NULL,NULL,NULL,12,'normal','2026-02-03','2026-02-11',NULL,NULL,NULL,NULL,NULL,1,1,0,0,NULL,NULL,NULL,NULL,NULL,NULL,'2026-01-22 01:42:52','2026-01-22 01:42:52'),(9,NULL,1,'library','store','Cập nhật manual POS','Cập nhật hướng dẫn sử dụng POS mới',NULL,3,6,NULL,0,NULL,4,NULL,NULL,NULL,12,'normal',NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,1,0,0,NULL,NULL,NULL,NULL,NULL,NULL,'2026-01-22 01:42:52','2026-01-22 01:42:52'),(10,NULL,1,'library','store','Template kiểm tra an toàn','Tạo template kiểm tra an toàn lao động',NULL,3,5,NULL,0,NULL,1,NULL,NULL,NULL,12,'high',NULL,NULL,NULL,NULL,NULL,NULL,NULL,4,1,0,0,NULL,NULL,NULL,NULL,NULL,NULL,'2026-01-22 01:42:52','2026-01-22 01:42:52'),(11,NULL,1,'task_list','store','Kiểm kê kho tháng 1','Kiểm kê hàng hóa trong kho tháng 1',NULL,1,5,NULL,0,NULL,1,NULL,NULL,NULL,13,'high','2026-01-24','2026-01-27',NULL,NULL,NULL,NULL,NULL,2,1,0,0,NULL,NULL,NULL,NULL,'2026-01-22 01:42:52',NULL,'2026-01-22 01:42:52','2026-01-22 01:42:52'),(12,NULL,1,'task_list','store','Sắp xếp kệ Tết','Sắp xếp kệ hàng cho mùa Tết',NULL,2,4,NULL,0,NULL,1,NULL,NULL,NULL,13,'urgent','2026-01-23','2026-01-29',NULL,NULL,NULL,NULL,NULL,7,2,0,0,NULL,NULL,NULL,NULL,'2026-01-22 01:42:52',NULL,'2026-01-22 01:42:52','2026-01-22 01:42:52'),(13,NULL,1,'task_list','store','Kiểm tra PCCC tháng 1','Kiểm tra thiết bị PCCC định kỳ',NULL,3,5,NULL,0,NULL,1,NULL,NULL,NULL,13,'high','2026-01-25','2026-01-26',NULL,NULL,NULL,NULL,NULL,6,2,0,0,NULL,NULL,NULL,NULL,'2026-01-22 01:42:52',NULL,'2026-01-22 01:42:52','2026-01-22 01:42:52'),(14,NULL,1,'task_list','store','Báo cáo hiệu suất tuần','Báo cáo hiệu suất làm việc tuần qua',NULL,1,6,NULL,0,NULL,1,NULL,NULL,NULL,13,'normal','2026-01-22','2026-01-23',NULL,NULL,NULL,NULL,NULL,5,4,0,0,NULL,NULL,NULL,NULL,'2026-01-22 01:42:52',NULL,'2026-01-22 01:42:52','2026-01-22 01:42:52'),(15,NULL,1,'task_list','store','Training POS mới','Đào tạo sử dụng hệ thống POS mới',NULL,3,6,NULL,0,NULL,4,NULL,NULL,NULL,13,'normal','2026-01-27','2026-02-01',NULL,NULL,NULL,NULL,NULL,1,1,0,0,NULL,NULL,NULL,NULL,'2026-01-22 01:42:52',NULL,'2026-01-22 01:42:52','2026-01-22 01:42:52'),(16,NULL,1,'task_list','store','Kế hoạch nhân sự Q1','Lên kế hoạch nhân sự quý 1',NULL,1,6,NULL,0,NULL,6,NULL,NULL,NULL,13,'high','2026-01-29','2026-02-12',NULL,NULL,NULL,NULL,NULL,4,1,0,0,NULL,NULL,NULL,NULL,'2026-01-22 01:42:52',NULL,'2026-01-22 01:42:52','2026-01-22 01:42:52'),(17,NULL,1,'library','store','Template vệ sinh cửa hàng','Tạo template checklist vệ sinh',NULL,3,5,NULL,0,NULL,1,NULL,NULL,NULL,13,'normal',NULL,NULL,NULL,NULL,NULL,NULL,NULL,5,4,0,0,NULL,NULL,NULL,NULL,'2026-01-22 01:42:52',NULL,'2026-01-22 01:42:52','2026-01-22 01:42:52'),(18,NULL,1,'library','store','Template kiểm tra chất lượng','Tạo template kiểm tra chất lượng SP',NULL,3,5,NULL,0,NULL,1,NULL,NULL,NULL,13,'normal',NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,1,0,0,NULL,NULL,NULL,NULL,'2026-01-22 01:42:52',NULL,'2026-01-22 01:42:52','2026-01-22 01:42:52'),(19,NULL,1,'task_list','store','Vệ sinh kệ hàng khu A','Vệ sinh và sắp xếp kệ hàng khu A',NULL,2,4,NULL,0,NULL,1,NULL,7,NULL,7,'normal','2026-01-22','2026-01-24',NULL,NULL,NULL,NULL,NULL,2,1,0,0,NULL,NULL,NULL,NULL,NULL,'2026-01-22 01:42:52','2026-01-22 01:42:52','2026-01-22 01:42:52'),(20,NULL,1,'task_list','store','Kiểm tra hạn sử dụng','Kiểm tra hạn sử dụng SP khu thực phẩm',NULL,3,5,NULL,0,NULL,1,NULL,9,NULL,7,'high','2026-01-22','2026-01-22',NULL,NULL,NULL,NULL,NULL,2,1,0,0,NULL,NULL,NULL,NULL,NULL,'2026-01-22 01:42:52','2026-01-22 01:42:52','2026-01-22 01:42:52'),(21,NULL,1,'task_list','store','Bổ sung hàng lên kệ','Bổ sung hàng từ kho lên kệ trưng bày',NULL,2,4,NULL,0,NULL,1,NULL,7,NULL,7,'normal','2026-01-22','2026-01-23',NULL,NULL,NULL,NULL,NULL,1,1,0,0,NULL,NULL,NULL,NULL,NULL,'2026-01-22 01:42:52','2026-01-22 01:42:52','2026-01-22 01:42:52'),(22,NULL,1,'task_list','store','Kiểm tra giá niêm yết','Kiểm tra và cập nhật giá niêm yết',NULL,1,5,NULL,0,NULL,1,NULL,10,NULL,7,'normal','2026-01-22','2026-01-23',NULL,NULL,NULL,NULL,NULL,2,1,0,0,NULL,NULL,NULL,NULL,NULL,'2026-01-22 01:42:52','2026-01-22 01:42:52','2026-01-22 01:42:52'),(23,NULL,1,'task_list','store','Vệ sinh khu POS','Vệ sinh khu vực thu ngân',NULL,2,4,NULL,0,NULL,1,NULL,7,NULL,7,'normal','2026-01-22','2026-01-22',NULL,NULL,NULL,NULL,NULL,1,1,0,0,NULL,NULL,NULL,NULL,NULL,'2026-01-22 01:42:52','2026-01-22 01:42:52','2026-01-22 01:42:52'),(24,NULL,1,'task_list','store','Kiểm tra máy lạnh','Kiểm tra hoạt động máy lạnh',NULL,3,5,NULL,0,NULL,4,NULL,9,NULL,7,'high','2026-01-23','2026-01-24',NULL,NULL,NULL,NULL,NULL,1,1,0,0,NULL,NULL,NULL,NULL,NULL,'2026-01-22 01:42:52','2026-01-22 01:42:52','2026-01-22 01:42:52'),(25,NULL,1,'task_list','store','Setup khuyến mãi tuần','Setup bảng giá khuyến mãi tuần',NULL,2,4,NULL,0,NULL,1,NULL,7,NULL,7,'normal','2026-01-22','2026-01-25',NULL,NULL,NULL,NULL,NULL,2,1,0,0,NULL,NULL,NULL,NULL,NULL,'2026-01-22 01:42:52','2026-01-22 01:42:52','2026-01-22 01:42:52'),(26,NULL,1,'task_list','store','Kiểm tra vệ sinh thực phẩm','Kiểm tra vệ sinh khu thực phẩm tươi',NULL,3,5,NULL,0,NULL,1,NULL,9,NULL,7,'urgent','2026-01-22','2026-01-22',NULL,NULL,NULL,NULL,NULL,1,1,0,0,NULL,NULL,NULL,NULL,NULL,'2026-01-22 01:42:52','2026-01-22 01:42:52','2026-01-22 01:42:52'),(27,NULL,1,'task_list','store','Nhận hàng nhập kho','Nhận và kiểm tra hàng nhập kho',NULL,1,5,NULL,0,NULL,1,NULL,10,NULL,7,'high','2026-01-23','2026-01-23',NULL,NULL,NULL,NULL,NULL,2,1,0,0,NULL,NULL,NULL,NULL,NULL,'2026-01-22 01:42:52','2026-01-22 01:42:52','2026-01-22 01:42:52'),(28,NULL,1,'task_list','store','Kiểm tra đèn chiếu sáng','Kiểm tra hệ thống đèn chiếu sáng',NULL,3,5,NULL,0,NULL,4,NULL,9,NULL,7,'normal','2026-01-24','2026-01-25',NULL,NULL,NULL,NULL,NULL,1,1,0,0,NULL,NULL,NULL,NULL,NULL,'2026-01-22 01:42:52','2026-01-22 01:42:52','2026-01-22 01:42:52'),(29,NULL,1,'task_list','store','Sắp xếp kho hàng','Sắp xếp và tổ chức lại kho hàng',NULL,2,4,NULL,0,NULL,1,NULL,7,NULL,7,'normal','2026-01-23','2026-01-26',NULL,NULL,NULL,NULL,NULL,2,1,0,0,NULL,NULL,NULL,NULL,NULL,'2026-01-22 01:42:52','2026-01-22 01:42:52','2026-01-22 01:42:52'),(30,NULL,1,'task_list','store','Chuẩn bị họp đầu tuần','Chuẩn bị nội dung họp đầu tuần',NULL,3,6,NULL,0,NULL,1,NULL,4,NULL,7,'normal','2026-01-25','2026-01-25',NULL,NULL,NULL,NULL,NULL,1,1,0,0,NULL,NULL,NULL,NULL,NULL,'2026-01-22 01:42:52','2026-01-22 01:42:52','2026-01-22 01:42:52'),(31,NULL,1,'task_list','store','Kiểm kê hàng tồn','Kiểm kê hàng tồn kho cuối tuần',NULL,1,5,NULL,0,NULL,1,NULL,7,7,8,'high','2026-01-20','2026-01-23',NULL,NULL,NULL,NULL,NULL,2,1,0,0,NULL,NULL,NULL,NULL,NULL,'2026-01-19 01:42:52','2026-01-22 01:42:52','2026-01-22 01:42:52'),(32,NULL,1,'task_list','store','Sắp xếp kệ khuyến mãi','Sắp xếp kệ hàng khuyến mãi tháng',NULL,2,4,NULL,0,NULL,1,NULL,7,7,8,'normal','2026-01-21','2026-01-24',NULL,NULL,NULL,NULL,NULL,1,1,0,0,NULL,NULL,NULL,NULL,NULL,'2026-01-20 01:42:52','2026-01-22 01:42:52','2026-01-22 01:42:52'),(33,NULL,1,'task_list','store','Training nhân viên mới','Đào tạo quy trình cho NV mới',NULL,3,6,NULL,0,NULL,6,NULL,4,4,8,'normal','2026-01-19','2026-01-26',NULL,NULL,NULL,NULL,NULL,1,1,0,0,NULL,NULL,NULL,NULL,NULL,'2026-01-18 01:42:52','2026-01-22 01:42:52','2026-01-22 01:42:52'),(34,NULL,1,'task_list','store','Kiểm tra chất lượng SP','Kiểm tra chất lượng sản phẩm nhập',NULL,3,5,NULL,0,NULL,1,NULL,9,9,8,'high','2026-01-22','2026-01-23',NULL,NULL,NULL,NULL,NULL,2,1,0,0,NULL,NULL,NULL,NULL,NULL,'2026-01-21 01:42:52','2026-01-22 01:42:52','2026-01-22 01:42:52'),(35,NULL,1,'task_list','store','Cập nhật bảng giá','Cập nhật bảng giá cho tuần mới',NULL,1,4,NULL,0,NULL,1,NULL,7,7,8,'normal','2026-01-21','2026-01-22',NULL,NULL,NULL,NULL,NULL,1,1,0,0,NULL,NULL,NULL,NULL,NULL,'2026-01-20 01:42:52','2026-01-22 01:42:52','2026-01-22 01:42:52'),(36,NULL,1,'task_list','store','Vệ sinh tổng thể','Vệ sinh tổng thể cửa hàng',NULL,2,4,NULL,0,NULL,1,NULL,10,10,8,'normal','2026-01-20','2026-01-22',NULL,NULL,NULL,NULL,NULL,2,1,0,0,NULL,NULL,NULL,NULL,NULL,'2026-01-19 01:42:52','2026-01-22 01:42:52','2026-01-22 01:42:52'),(37,NULL,1,'task_list','store','Kiểm tra camera','Kiểm tra hệ thống camera an ninh',NULL,3,5,NULL,0,NULL,4,NULL,9,9,8,'high','2026-01-21','2026-01-23',NULL,NULL,NULL,NULL,NULL,1,1,0,0,NULL,NULL,NULL,NULL,NULL,'2026-01-20 01:42:52','2026-01-22 01:42:52','2026-01-22 01:42:52'),(38,NULL,1,'task_list','store','Chuẩn bị event cuối tuần','Chuẩn bị cho event khuyến mãi',NULL,2,4,NULL,0,NULL,1,NULL,7,7,8,'urgent','2026-01-22','2026-01-24',NULL,NULL,NULL,NULL,NULL,2,1,0,0,NULL,NULL,NULL,NULL,NULL,'2026-01-21 01:42:52','2026-01-22 01:42:52','2026-01-22 01:42:52'),(39,NULL,1,'task_list','store','Báo cáo doanh thu ngày','Tổng hợp báo cáo doanh thu ngày',NULL,1,6,NULL,0,NULL,2,NULL,10,10,8,'normal','2026-01-21','2026-01-22',NULL,NULL,NULL,NULL,NULL,1,1,0,0,NULL,NULL,NULL,NULL,NULL,'2026-01-21 01:42:52','2026-01-22 01:42:52','2026-01-22 01:42:52'),(40,NULL,1,'task_list','store','Kiểm kê tài sản','Kiểm kê tài sản cố định',NULL,1,5,NULL,0,NULL,2,NULL,10,10,8,'normal','2026-01-18','2026-01-25',NULL,NULL,NULL,NULL,NULL,2,1,0,0,NULL,NULL,NULL,NULL,NULL,'2026-01-17 01:42:52','2026-01-22 01:42:52','2026-01-22 01:42:52'),(41,NULL,1,'task_list','store','Sắp xếp khu vực mới','Sắp xếp khu vực bán hàng mới',NULL,2,4,NULL,0,NULL,1,NULL,7,7,8,'normal','2026-01-20','2026-01-23',NULL,NULL,NULL,NULL,NULL,1,1,0,0,NULL,NULL,NULL,NULL,NULL,'2026-01-19 01:42:52','2026-01-22 01:42:52','2026-01-22 01:42:52'),(42,NULL,1,'task_list','store','Chuẩn bị tài liệu họp','Chuẩn bị tài liệu cho cuộc họp',NULL,3,6,NULL,0,NULL,1,NULL,4,4,8,'high','2026-01-21','2026-01-22',NULL,NULL,NULL,NULL,NULL,1,1,0,0,NULL,NULL,NULL,NULL,NULL,'2026-01-20 01:42:52','2026-01-22 01:42:52','2026-01-22 01:42:52'),(43,NULL,1,'task_list','store','Kiểm tra hệ thống điện','Kiểm tra an toàn hệ thống điện',NULL,3,5,NULL,0,NULL,4,NULL,9,9,8,'high','2026-01-21','2026-01-23',NULL,NULL,NULL,NULL,NULL,2,1,0,0,NULL,NULL,NULL,NULL,NULL,'2026-01-20 01:42:52','2026-01-22 01:42:52','2026-01-22 01:42:52'),(44,NULL,1,'task_list','store','Update menu display','Cập nhật menu hiển thị điện tử',NULL,2,4,NULL,0,NULL,4,NULL,9,9,8,'normal','2026-01-20','2026-01-23',NULL,NULL,NULL,NULL,NULL,1,1,0,0,NULL,NULL,NULL,NULL,NULL,'2026-01-19 01:42:52','2026-01-22 01:42:52','2026-01-22 01:42:52'),(45,NULL,1,'task_list','store','Kiểm tra máy POS','Kiểm tra hoạt động máy POS',NULL,3,5,NULL,0,NULL,4,NULL,9,9,8,'high','2026-01-22','2026-01-23',NULL,NULL,NULL,NULL,NULL,2,1,0,0,NULL,NULL,NULL,NULL,NULL,'2026-01-22 01:42:52','2026-01-22 01:42:52','2026-01-22 01:42:52'),(46,NULL,1,'task_list','store','Kiểm kê cuối tháng 12','Kiểm kê hàng hóa cuối tháng 12',NULL,1,5,NULL,0,NULL,1,NULL,7,7,9,'high','2026-01-12','2026-01-15',NULL,NULL,'2026-01-15 01:42:52',NULL,NULL,2,1,0,0,NULL,NULL,NULL,NULL,NULL,'2026-01-11 01:42:52','2026-01-22 01:42:52','2026-01-22 01:42:52'),(47,NULL,1,'task_list','store','Báo cáo doanh thu tuần 52','Báo cáo doanh thu tuần cuối năm',NULL,1,6,NULL,0,NULL,2,NULL,10,10,9,'normal','2026-01-08','2026-01-12',NULL,NULL,'2026-01-12 01:42:52',NULL,NULL,1,1,0,0,NULL,NULL,NULL,NULL,NULL,'2026-01-07 01:42:52','2026-01-22 01:42:52','2026-01-22 01:42:52'),(48,NULL,1,'task_list','store','Vệ sinh đón năm mới','Vệ sinh tổng thể đón năm mới',NULL,2,4,NULL,0,NULL,1,NULL,7,7,9,'high','2026-01-14','2026-01-17',NULL,NULL,'2026-01-17 01:42:52',NULL,NULL,2,1,0,0,NULL,NULL,NULL,NULL,NULL,'2026-01-13 01:42:52','2026-01-22 01:42:52','2026-01-22 01:42:52'),(49,NULL,1,'task_list','store','Training cuối năm','Đào tạo tổng kết cuối năm',NULL,3,6,NULL,0,NULL,6,NULL,4,4,9,'normal','2026-01-10','2026-01-14',NULL,NULL,'2026-01-14 01:42:52',NULL,NULL,1,1,0,0,NULL,NULL,NULL,NULL,NULL,'2026-01-09 01:42:52','2026-01-22 01:42:52','2026-01-22 01:42:52'),(50,NULL,1,'task_list','store','Kiểm tra PCCC tháng 12','Kiểm tra thiết bị PCCC',NULL,3,5,NULL,0,NULL,1,NULL,9,9,9,'high','2026-01-07','2026-01-10',NULL,NULL,'2026-01-10 01:42:52',NULL,NULL,2,1,0,0,NULL,NULL,NULL,NULL,NULL,'2026-01-06 01:42:52','2026-01-22 01:42:52','2026-01-22 01:42:52'),(51,NULL,1,'task_list','store','Đánh giá hiệu suất Q4','Đánh giá hiệu suất quý 4',NULL,1,6,NULL,0,NULL,6,NULL,4,4,9,'high','2026-01-02','2026-01-07',NULL,NULL,'2026-01-07 01:42:52',NULL,NULL,1,1,0,0,NULL,NULL,NULL,NULL,NULL,'2026-01-01 01:42:52','2026-01-22 01:42:52','2026-01-22 01:42:52'),(52,NULL,1,'task_list','store','Kiểm kê tài sản Q4','Kiểm kê tài sản cố định Q4',NULL,1,5,NULL,0,NULL,2,NULL,10,10,9,'normal','2026-01-04','2026-01-09',NULL,NULL,'2026-01-09 01:42:52',NULL,NULL,2,1,0,0,NULL,NULL,NULL,NULL,NULL,'2026-01-03 01:42:52','2026-01-22 01:42:52','2026-01-22 01:42:52'),(53,NULL,1,'task_list','store','Sắp xếp kho cuối năm','Tổng vệ sinh và sắp xếp kho',NULL,2,4,NULL,0,NULL,1,NULL,7,7,9,'normal','2026-01-13','2026-01-16',NULL,NULL,'2026-01-16 01:42:52',NULL,NULL,1,1,0,0,NULL,NULL,NULL,NULL,NULL,'2026-01-12 01:42:52','2026-01-22 01:42:52','2026-01-22 01:42:52'),(54,NULL,1,'task_list','store','Backup dữ liệu cuối năm','Backup toàn bộ dữ liệu',NULL,3,5,NULL,0,NULL,4,NULL,9,9,9,'urgent','2026-01-15','2026-01-17',NULL,NULL,'2026-01-17 01:42:52',NULL,NULL,1,1,0,0,NULL,NULL,NULL,NULL,NULL,'2026-01-14 01:42:52','2026-01-22 01:42:52','2026-01-22 01:42:52'),(55,NULL,1,'task_list','store','Chuẩn bị event năm mới','Chuẩn bị cho event năm mới',NULL,2,4,NULL,0,NULL,1,NULL,7,7,9,'high','2026-01-16','2026-01-19',NULL,NULL,'2026-01-19 01:42:52',NULL,NULL,2,1,0,0,NULL,NULL,NULL,NULL,NULL,'2026-01-15 01:42:52','2026-01-22 01:42:52','2026-01-22 01:42:52'),(56,NULL,1,'task_list','store','Báo cáo tồn kho quá hạn','Báo cáo tồn kho chưa hoàn thành',NULL,1,6,NULL,0,NULL,1,NULL,7,7,10,'high','2026-01-12','2026-01-17',NULL,NULL,NULL,NULL,NULL,2,1,0,0,NULL,NULL,NULL,NULL,NULL,'2026-01-11 01:42:52','2026-01-22 01:42:52','2026-01-22 01:42:52'),(57,NULL,1,'task_list','store','Kiểm tra camera quá hạn','Kiểm tra camera đã quá hạn',NULL,3,5,NULL,0,NULL,4,NULL,9,NULL,10,'urgent','2026-01-15','2026-01-19',NULL,NULL,NULL,NULL,NULL,1,1,0,0,NULL,NULL,NULL,NULL,NULL,'2026-01-14 01:42:52','2026-01-22 01:42:52','2026-01-22 01:42:52'),(58,NULL,1,'task_list','store','Vệ sinh khu B quá hạn','Vệ sinh khu B chưa hoàn thành',NULL,2,4,NULL,0,NULL,1,NULL,7,7,10,'normal','2026-01-17','2026-01-20',NULL,NULL,NULL,NULL,NULL,2,1,0,0,NULL,NULL,NULL,NULL,NULL,'2026-01-16 01:42:52','2026-01-22 01:42:52','2026-01-22 01:42:52'),(59,NULL,1,'task_list','store','Update giá quá hạn','Cập nhật giá chưa hoàn thành',NULL,1,4,NULL,0,NULL,1,NULL,10,10,10,'high','2026-01-18','2026-01-21',NULL,NULL,NULL,NULL,NULL,1,1,0,0,NULL,NULL,NULL,NULL,NULL,'2026-01-17 01:42:52','2026-01-22 01:42:52','2026-01-22 01:42:52'),(60,NULL,1,'task_list','store','Báo cáo tuần quá hạn','Báo cáo tuần chưa nộp',NULL,1,6,NULL,0,NULL,2,NULL,10,NULL,10,'normal','2026-01-16','2026-01-20',NULL,NULL,NULL,NULL,NULL,2,1,0,0,NULL,NULL,NULL,NULL,NULL,'2026-01-15 01:42:52','2026-01-22 01:42:52','2026-01-22 01:42:52'),(61,NULL,1,'task_list','store','Kiểm tra hệ thống nước','Kiểm tra hệ thống cấp nước trong store',NULL,3,5,NULL,0,NULL,1,NULL,7,NULL,7,'normal','2026-01-22','2026-01-24',NULL,NULL,NULL,NULL,NULL,1,1,0,0,NULL,NULL,NULL,NULL,NULL,'2026-01-22 01:42:52','2026-01-22 01:42:52','2026-01-22 01:42:52'),(62,NULL,1,'task_list','store','Sắp xếp khu vực C','Sắp xếp lại kệ hàng khu vực C',NULL,2,4,NULL,0,NULL,1,NULL,7,NULL,7,'normal','2026-01-22','2026-01-23',NULL,NULL,NULL,NULL,NULL,2,1,0,0,NULL,NULL,NULL,NULL,NULL,'2026-01-22 01:42:52','2026-01-22 01:42:52','2026-01-22 01:42:52'),(63,NULL,1,'task_list','store','Kiểm tra hàng tồn khu A','Kiểm tra và báo cáo hàng tồn khu A',NULL,1,5,NULL,0,NULL,1,NULL,9,NULL,7,'high','2026-01-22','2026-01-23',NULL,NULL,NULL,NULL,NULL,1,1,0,0,NULL,NULL,NULL,NULL,NULL,'2026-01-22 01:42:52','2026-01-22 01:42:52','2026-01-22 01:42:52'),(64,NULL,1,'task_list','store','Vệ sinh khu thực phẩm tươi','Vệ sinh khu vực thực phẩm tươi sống',NULL,2,4,NULL,0,NULL,1,NULL,7,NULL,7,'urgent','2026-01-22','2026-01-22',NULL,NULL,NULL,NULL,NULL,2,1,0,0,NULL,NULL,NULL,NULL,NULL,'2026-01-22 01:42:52','2026-01-22 01:42:52','2026-01-22 01:42:52'),(65,NULL,1,'task_list','store','Cập nhật bảng giá mới','Cập nhật bảng giá sản phẩm mới',NULL,1,4,NULL,0,NULL,1,NULL,10,NULL,7,'normal','2026-01-23','2026-01-24',NULL,NULL,NULL,NULL,NULL,1,1,0,0,NULL,NULL,NULL,NULL,NULL,'2026-01-22 01:42:52','2026-01-22 01:42:52','2026-01-22 01:42:52'),(66,NULL,1,'task_list','store','Kiểm tra thiết bị làm lạnh','Kiểm tra tủ đông và tủ mát',NULL,3,5,NULL,0,NULL,1,NULL,9,NULL,7,'high','2026-01-22','2026-01-23',NULL,NULL,NULL,NULL,NULL,2,1,0,0,NULL,NULL,NULL,NULL,NULL,'2026-01-22 01:42:52','2026-01-22 01:42:52','2026-01-22 01:42:52'),(67,NULL,1,'task_list','store','Nhận hàng từ kho trung tâm','Nhận và kiểm tra hàng từ kho',NULL,1,5,NULL,0,NULL,1,NULL,10,NULL,7,'normal','2026-01-23','2026-01-23',NULL,NULL,NULL,NULL,NULL,1,1,0,0,NULL,NULL,NULL,NULL,NULL,'2026-01-22 01:42:52','2026-01-22 01:42:52','2026-01-22 01:42:52'),(68,NULL,1,'task_list','store','Báo cáo tình trạng kệ hàng','Báo cáo kệ hàng cần sửa chữa',NULL,1,6,NULL,0,NULL,1,NULL,7,NULL,7,'normal','2026-01-22','2026-01-25',NULL,NULL,NULL,NULL,NULL,2,1,0,0,NULL,NULL,NULL,NULL,NULL,'2026-01-22 01:42:52','2026-01-22 01:42:52','2026-01-22 01:42:52'),(69,NULL,1,'task_list','store','Setup khu vực khuyến mãi mới','Thiết lập khu vực khuyến mãi đặc biệt',NULL,2,4,NULL,0,NULL,1,NULL,7,NULL,7,'high','2026-01-24','2026-01-26',NULL,NULL,NULL,NULL,NULL,1,1,0,0,NULL,NULL,NULL,NULL,NULL,'2026-01-22 01:42:52','2026-01-22 01:42:52','2026-01-22 01:42:52'),(70,NULL,1,'task_list','store','Kiểm tra an ninh đêm','Kiểm tra camera và thiết bị an ninh',NULL,3,5,NULL,0,NULL,1,NULL,9,NULL,7,'normal','2026-01-23','2026-01-24',NULL,NULL,NULL,NULL,NULL,2,1,0,0,NULL,NULL,NULL,NULL,NULL,'2026-01-22 01:42:52','2026-01-22 01:42:52','2026-01-22 01:42:52'),(71,NULL,1,'task_list','store','Tổng vệ sinh cuối tuần','Vệ sinh toàn bộ cửa hàng',NULL,2,4,NULL,0,NULL,1,NULL,7,7,8,'high','2026-01-21','2026-01-23',NULL,NULL,NULL,NULL,NULL,1,1,0,0,NULL,NULL,NULL,NULL,NULL,'2026-01-20 01:42:52','2026-01-22 01:42:52','2026-01-22 01:42:52'),(72,NULL,1,'task_list','store','Kiểm kê hàng nhập mới','Kiểm kê lô hàng mới nhập',NULL,1,5,NULL,0,NULL,1,NULL,9,9,8,'normal','2026-01-20','2026-01-23',NULL,NULL,NULL,NULL,NULL,2,1,0,0,NULL,NULL,NULL,NULL,NULL,'2026-01-19 01:42:52','2026-01-22 01:42:52','2026-01-22 01:42:52'),(73,NULL,1,'task_list','store','Sắp xếp hàng theo FIFO','Sắp xếp lại hàng theo nguyên tắc FIFO',NULL,2,4,NULL,0,NULL,1,NULL,10,10,8,'high','2026-01-21','2026-01-22',NULL,NULL,NULL,NULL,NULL,1,1,0,0,NULL,NULL,NULL,NULL,NULL,'2026-01-20 01:42:52','2026-01-22 01:42:52','2026-01-22 01:42:52'),(74,NULL,1,'task_list','store','Chuẩn bị khuyến mãi tuần mới','Setup chương trình KM tuần mới',NULL,2,4,NULL,0,NULL,1,NULL,7,7,8,'normal','2026-01-20','2026-01-24',NULL,NULL,NULL,NULL,NULL,2,1,0,0,NULL,NULL,NULL,NULL,NULL,'2026-01-19 01:42:52','2026-01-22 01:42:52','2026-01-22 01:42:52'),(75,NULL,1,'task_list','store','Kiểm tra chất lượng rau củ','Kiểm tra độ tươi rau củ quả',NULL,3,5,NULL,0,NULL,1,NULL,9,9,8,'urgent','2026-01-22','2026-01-22',NULL,NULL,NULL,NULL,NULL,1,1,0,0,NULL,NULL,NULL,NULL,NULL,'2026-01-22 01:42:52','2026-01-22 01:42:52','2026-01-22 01:42:52'),(76,NULL,1,'task_list','store','Báo cáo doanh số realtime','Cập nhật báo cáo doanh số',NULL,1,6,NULL,0,NULL,2,NULL,10,10,8,'normal','2026-01-21','2026-01-22',NULL,NULL,NULL,NULL,NULL,2,1,0,0,NULL,NULL,NULL,NULL,NULL,'2026-01-20 01:42:52','2026-01-22 01:42:52','2026-01-22 01:42:52'),(77,NULL,1,'task_list','store','Kiểm tra hệ thống POS','Kiểm tra và test hệ thống POS',NULL,3,5,NULL,0,NULL,4,NULL,9,9,8,'high','2026-01-21','2026-01-23',NULL,NULL,NULL,NULL,NULL,1,1,0,0,NULL,NULL,NULL,NULL,NULL,'2026-01-20 01:42:52','2026-01-22 01:42:52','2026-01-22 01:42:52'),(78,NULL,1,'task_list','store','Vệ sinh khu vực khách hàng','Vệ sinh khu ngồi và toilet',NULL,2,4,NULL,0,NULL,1,NULL,7,7,8,'normal','2026-01-20','2026-01-22',NULL,NULL,NULL,NULL,NULL,2,1,0,0,NULL,NULL,NULL,NULL,NULL,'2026-01-19 01:42:52','2026-01-22 01:42:52','2026-01-22 01:42:52'),(79,NULL,1,'task_list','store','Sắp xếp khu Delica','Sắp xếp khu bán đồ ăn sẵn',NULL,2,4,NULL,0,NULL,1,NULL,7,7,8,'normal','2026-01-21','2026-01-23',NULL,NULL,NULL,NULL,NULL,1,1,0,0,NULL,NULL,NULL,NULL,NULL,'2026-01-20 01:42:52','2026-01-22 01:42:52','2026-01-22 01:42:52'),(80,NULL,1,'task_list','store','Kiểm tra máy tính tiền','Kiểm tra hoạt động máy tính tiền',NULL,3,5,NULL,0,NULL,4,NULL,9,9,8,'high','2026-01-22','2026-01-23',NULL,NULL,NULL,NULL,NULL,2,1,0,0,NULL,NULL,NULL,NULL,NULL,'2026-01-22 01:42:52','2026-01-22 01:42:52','2026-01-22 01:42:52'),(81,NULL,1,'task_list','store','Kiểm kê hàng tháng 12 tuần 4','Kiểm kê hàng tuần 4 tháng 12',NULL,1,5,NULL,0,NULL,1,NULL,7,7,9,'high','2026-01-10','2026-01-13',NULL,NULL,'2026-01-13 01:42:52',NULL,NULL,1,1,0,0,NULL,NULL,NULL,NULL,NULL,'2026-01-09 01:42:52','2026-01-22 01:42:52','2026-01-22 01:42:52'),(82,NULL,1,'task_list','store','Vệ sinh kho cuối năm','Tổng vệ sinh kho trước năm mới',NULL,2,4,NULL,0,NULL,1,NULL,7,7,9,'normal','2026-01-14','2026-01-17',NULL,NULL,'2026-01-17 01:42:52',NULL,NULL,2,1,0,0,NULL,NULL,NULL,NULL,NULL,'2026-01-13 01:42:52','2026-01-22 01:42:52','2026-01-22 01:42:52'),(83,NULL,1,'task_list','store','Training an toàn thực phẩm','Đào tạo ATTP cho nhân viên',NULL,3,6,NULL,0,NULL,6,NULL,4,4,9,'high','2026-01-12','2026-01-15',NULL,NULL,'2026-01-15 01:42:52',NULL,NULL,1,1,0,0,NULL,NULL,NULL,NULL,NULL,'2026-01-11 01:42:52','2026-01-22 01:42:52','2026-01-22 01:42:52'),(84,NULL,1,'task_list','store','Báo cáo chi phí tháng 12','Báo cáo chi phí vận hành tháng 12',NULL,1,6,NULL,0,NULL,2,NULL,10,10,9,'normal','2026-01-08','2026-01-12',NULL,NULL,'2026-01-12 01:42:52',NULL,NULL,2,1,0,0,NULL,NULL,NULL,NULL,NULL,'2026-01-07 01:42:52','2026-01-22 01:42:52','2026-01-22 01:42:52'),(85,NULL,1,'task_list','store','Kiểm tra PCCC cuối năm','Kiểm tra thiết bị PCCC trước năm mới',NULL,3,5,NULL,0,NULL,1,NULL,9,9,9,'urgent','2026-01-16','2026-01-18',NULL,NULL,'2026-01-18 01:42:52',NULL,NULL,1,1,0,0,NULL,NULL,NULL,NULL,NULL,'2026-01-15 01:42:52','2026-01-22 01:42:52','2026-01-22 01:42:52'),(86,NULL,1,'task_list','store','Báo cáo tồn kho tuần trước','Báo cáo tồn kho chưa nộp',NULL,1,6,NULL,0,NULL,1,NULL,7,7,10,'high','2026-01-14','2026-01-18',NULL,NULL,NULL,NULL,NULL,1,1,0,0,NULL,NULL,NULL,NULL,NULL,'2026-01-13 01:42:52','2026-01-22 01:42:52','2026-01-22 01:42:52'),(87,NULL,1,'task_list','store','Kiểm tra máy lạnh khu B','Kiểm tra máy lạnh đã quá hạn',NULL,3,5,NULL,0,NULL,4,NULL,9,NULL,10,'urgent','2026-01-16','2026-01-20',NULL,NULL,NULL,NULL,NULL,2,1,0,0,NULL,NULL,NULL,NULL,NULL,'2026-01-15 01:42:52','2026-01-22 01:42:52','2026-01-22 01:42:52'),(88,NULL,1,'task_list','store','Vệ sinh khu D quá hạn','Vệ sinh khu D chưa hoàn thành',NULL,2,4,NULL,0,NULL,1,NULL,7,7,10,'normal','2026-01-17','2026-01-21',NULL,NULL,NULL,NULL,NULL,1,1,0,0,NULL,NULL,NULL,NULL,NULL,'2026-01-16 01:42:52','2026-01-22 01:42:52','2026-01-22 01:42:52'),(89,NULL,1,'task_list','store','Cập nhật giá khu Fresh','Cập nhật giá chưa hoàn thành',NULL,1,4,NULL,0,NULL,1,NULL,10,10,10,'high','2026-01-18','2026-01-21',NULL,NULL,NULL,NULL,NULL,2,1,0,0,NULL,NULL,NULL,NULL,NULL,'2026-01-17 01:42:52','2026-01-22 01:42:52','2026-01-22 01:42:52'),(90,NULL,1,'task_list','store','Báo cáo nhân sự quá hạn','Báo cáo nhân sự tuần chưa nộp',NULL,1,6,NULL,0,NULL,6,NULL,4,NULL,10,'normal','2026-01-15','2026-01-19',NULL,NULL,NULL,NULL,NULL,1,1,0,0,NULL,NULL,NULL,NULL,NULL,'2026-01-14 01:42:52','2026-01-22 01:42:52','2026-01-22 01:42:52'),(91,1,2,'task_list','store','Chuẩn bị danh sách kiểm kê','Chuẩn bị danh sách hàng hóa cần kiểm kê',NULL,1,5,NULL,0,NULL,1,NULL,NULL,NULL,12,'normal','2026-01-29','2026-02-05',NULL,NULL,NULL,NULL,NULL,1,1,0,0,NULL,NULL,NULL,NULL,NULL,NULL,'2026-01-22 01:42:52','2026-01-22 01:42:52'),(92,1,2,'task_list','store','Phân công nhân sự kiểm kê','Phân công người thực hiện kiểm kê',NULL,1,5,NULL,0,NULL,1,NULL,NULL,NULL,12,'normal','2026-01-29','2026-02-05',NULL,NULL,NULL,NULL,NULL,1,1,0,0,NULL,NULL,NULL,NULL,NULL,NULL,'2026-01-22 01:42:52','2026-01-22 01:42:52'),(93,91,3,'task_list','store','Liệt kê danh mục hàng hóa','Liệt kê chi tiết các danh mục cần kiểm kê',NULL,1,5,NULL,0,NULL,1,NULL,NULL,NULL,12,'normal','2026-01-29','2026-02-05',NULL,NULL,NULL,NULL,NULL,1,1,0,0,NULL,NULL,NULL,NULL,NULL,NULL,'2026-01-22 01:42:52','2026-01-22 01:42:52'),(94,91,3,'task_list','store','Xác định vị trí kệ hàng','Xác định vị trí kệ cần kiểm kê',NULL,1,5,NULL,0,NULL,1,NULL,NULL,NULL,12,'normal','2026-01-29','2026-02-05',NULL,NULL,NULL,NULL,NULL,1,1,0,0,NULL,NULL,NULL,NULL,NULL,NULL,'2026-01-22 01:42:52','2026-01-22 01:42:52'),(95,92,3,'task_list','store','Chia ca kiểm kê','Phân chia ca làm việc kiểm kê',NULL,1,5,NULL,0,NULL,1,NULL,NULL,NULL,12,'normal','2026-01-29','2026-02-05',NULL,NULL,NULL,NULL,NULL,1,1,0,0,NULL,NULL,NULL,NULL,NULL,NULL,'2026-01-22 01:42:52','2026-01-22 01:42:52'),(96,92,3,'task_list','store','Training nhân viên kiểm kê','Đào tạo nhân viên cách kiểm kê',NULL,1,5,NULL,0,NULL,1,NULL,NULL,NULL,12,'normal','2026-01-29','2026-02-05',NULL,NULL,NULL,NULL,NULL,1,1,0,0,NULL,NULL,NULL,NULL,NULL,NULL,'2026-01-22 01:42:52','2026-01-22 01:42:52'),(97,93,4,'task_list','store','Thu thập data từ hệ thống','Lấy dữ liệu tồn kho từ hệ thống',NULL,1,5,NULL,0,NULL,1,NULL,NULL,NULL,12,'normal','2026-01-29','2026-02-05',NULL,NULL,NULL,NULL,NULL,1,1,0,0,NULL,NULL,NULL,NULL,NULL,NULL,'2026-01-22 01:42:52','2026-01-22 01:42:52'),(98,93,4,'task_list','store','In phiếu kiểm kê','In các phiếu kiểm kê hàng hóa',NULL,1,5,NULL,0,NULL,1,NULL,NULL,NULL,12,'normal','2026-01-29','2026-02-05',NULL,NULL,NULL,NULL,NULL,1,1,0,0,NULL,NULL,NULL,NULL,NULL,NULL,'2026-01-22 01:42:52','2026-01-22 01:42:52'),(99,95,4,'task_list','store','Lập lịch theo ca','Lập lịch chi tiết cho từng ca',NULL,1,5,NULL,0,NULL,1,NULL,NULL,NULL,12,'normal','2026-01-29','2026-02-05',NULL,NULL,NULL,NULL,NULL,1,1,0,0,NULL,NULL,NULL,NULL,NULL,NULL,'2026-01-22 01:42:52','2026-01-22 01:42:52'),(100,97,5,'task_list','store','Export data từ POS','Xuất dữ liệu từ hệ thống POS',NULL,1,5,NULL,0,NULL,1,NULL,NULL,NULL,12,'normal','2026-01-29','2026-02-05',NULL,NULL,NULL,NULL,NULL,1,1,0,0,NULL,NULL,NULL,NULL,NULL,NULL,'2026-01-22 01:42:52','2026-01-22 01:42:52'),(101,11,2,'task_list','store','Kiểm kê khu thực phẩm','Kiểm kê hàng hóa khu thực phẩm',NULL,1,5,NULL,0,NULL,1,NULL,NULL,NULL,13,'high','2026-01-24','2026-01-27',NULL,NULL,NULL,NULL,NULL,2,1,0,0,NULL,NULL,NULL,NULL,'2026-01-22 01:42:52',NULL,'2026-01-22 01:42:52','2026-01-22 01:42:52'),(102,11,2,'task_list','store','Kiểm kê khu hóa mỹ phẩm','Kiểm kê hàng hóa khu hóa mỹ phẩm',NULL,1,5,NULL,0,NULL,1,NULL,NULL,NULL,13,'high','2026-01-24','2026-01-27',NULL,NULL,NULL,NULL,NULL,2,1,0,0,NULL,NULL,NULL,NULL,'2026-01-22 01:42:52',NULL,'2026-01-22 01:42:52','2026-01-22 01:42:52'),(103,11,2,'task_list','store','Kiểm kê khu đồ gia dụng','Kiểm kê hàng hóa khu đồ gia dụng',NULL,1,5,NULL,0,NULL,1,NULL,NULL,NULL,13,'high','2026-01-24','2026-01-27',NULL,NULL,NULL,NULL,NULL,2,1,0,0,NULL,NULL,NULL,NULL,'2026-01-22 01:42:52',NULL,'2026-01-22 01:42:52','2026-01-22 01:42:52'),(104,31,2,'task_list','store','Kiểm kê hàng thực phẩm tươi','Kiểm kê khu vực thực phẩm tươi sống',NULL,1,5,NULL,0,NULL,1,NULL,7,7,8,'high','2026-01-20','2026-01-23',NULL,NULL,NULL,NULL,NULL,2,1,0,0,NULL,NULL,NULL,NULL,NULL,'2026-01-19 01:42:52','2026-01-22 01:42:52','2026-01-22 01:42:52'),(105,31,2,'task_list','store','Kiểm kê hàng khô','Kiểm kê khu vực hàng khô',NULL,1,5,NULL,0,NULL,1,NULL,7,7,8,'high','2026-01-20','2026-01-23',NULL,NULL,NULL,NULL,NULL,2,1,0,0,NULL,NULL,NULL,NULL,NULL,'2026-01-19 01:42:52','2026-01-22 01:42:52','2026-01-22 01:42:52'),(106,104,3,'task_list','store','Đếm rau củ quả','Kiểm đếm số lượng rau củ quả',NULL,1,5,NULL,0,NULL,1,NULL,7,7,8,'high','2026-01-20','2026-01-23',NULL,NULL,NULL,NULL,NULL,2,1,0,0,NULL,NULL,NULL,NULL,NULL,'2026-01-19 01:42:52','2026-01-22 01:42:52','2026-01-22 01:42:52'),(107,104,3,'task_list','store','Đếm thịt cá','Kiểm đếm số lượng thịt cá',NULL,1,5,NULL,0,NULL,1,NULL,7,7,8,'high','2026-01-20','2026-01-23',NULL,NULL,NULL,NULL,NULL,2,1,0,0,NULL,NULL,NULL,NULL,NULL,'2026-01-19 01:42:52','2026-01-22 01:42:52','2026-01-22 01:42:52'),(108,105,3,'task_list','store','Đếm gạo/mì/nui','Kiểm đếm số lượng gạo mì nui',NULL,1,5,NULL,0,NULL,1,NULL,7,7,8,'high','2026-01-20','2026-01-23',NULL,NULL,NULL,NULL,NULL,2,1,0,0,NULL,NULL,NULL,NULL,NULL,'2026-01-19 01:42:52','2026-01-22 01:42:52','2026-01-22 01:42:52'),(109,105,3,'task_list','store','Đếm đồ hộp','Kiểm đếm số lượng đồ hộp',NULL,1,5,NULL,0,NULL,1,NULL,7,7,8,'high','2026-01-20','2026-01-23',NULL,NULL,NULL,NULL,NULL,2,1,0,0,NULL,NULL,NULL,NULL,NULL,'2026-01-19 01:42:52','2026-01-22 01:42:52','2026-01-22 01:42:52');
/*!40000 ALTER TABLE `tasks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `task_store_assignments`
--

DROP TABLE IF EXISTS `task_store_assignments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `task_store_assignments` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `task_id` int NOT NULL,
  `store_id` int NOT NULL,
  `status` enum('not_yet','on_progress','done_pending','done','unable') COLLATE utf8mb4_unicode_ci DEFAULT 'not_yet' COMMENT 'Store execution status',
  `assigned_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'When HQ dispatched task to store',
  `started_at` timestamp NULL DEFAULT NULL COMMENT 'When store started working on task',
  `completed_at` timestamp NULL DEFAULT NULL COMMENT 'When store marked done/unable',
  `assigned_by` int DEFAULT NULL COMMENT 'HQ staff who dispatched task to store',
  `assigned_to_staff` int DEFAULT NULL COMMENT 'Staff (S1) assigned by Store Leader',
  `assigned_to_at` timestamp NULL DEFAULT NULL COMMENT 'When Store Leader assigned to staff',
  `started_by` int DEFAULT NULL COMMENT 'Store user who started',
  `completed_by` int DEFAULT NULL COMMENT 'Store user who completed/marked unable',
  `checked_by` int DEFAULT NULL COMMENT 'HQ staff who verified completion',
  `checked_at` timestamp NULL DEFAULT NULL COMMENT 'When HQ verified completion',
  `check_notes` text COLLATE utf8mb4_unicode_ci COMMENT 'Notes from HQ checker',
  `unable_reason` text COLLATE utf8mb4_unicode_ci COMMENT 'Required reason when status=unable',
  `notes` text COLLATE utf8mb4_unicode_ci COMMENT 'General notes',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_task_store` (`task_id`,`store_id`),
  KEY `idx_task_status` (`task_id`,`status`),
  KEY `idx_store_status` (`store_id`,`status`),
  KEY `idx_assigned_staff` (`assigned_to_staff`),
  KEY `idx_status` (`status`),
  KEY `fk_tsa_assigned_by` (`assigned_by`),
  KEY `fk_tsa_started_by` (`started_by`),
  KEY `fk_tsa_completed_by` (`completed_by`),
  KEY `fk_tsa_checked_by` (`checked_by`),
  CONSTRAINT `fk_tsa_task` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`task_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_tsa_store` FOREIGN KEY (`store_id`) REFERENCES `stores` (`store_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_tsa_assigned_by` FOREIGN KEY (`assigned_by`) REFERENCES `staff` (`staff_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_tsa_assigned_to_staff` FOREIGN KEY (`assigned_to_staff`) REFERENCES `staff` (`staff_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_tsa_started_by` FOREIGN KEY (`started_by`) REFERENCES `staff` (`staff_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_tsa_completed_by` FOREIGN KEY (`completed_by`) REFERENCES `staff` (`staff_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_tsa_checked_by` FOREIGN KEY (`checked_by`) REFERENCES `staff` (`staff_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `task_store_assignments`
--

LOCK TABLES `task_store_assignments` WRITE;
/*!40000 ALTER TABLE `task_store_assignments` DISABLE KEYS */;
/*!40000 ALTER TABLE `task_store_assignments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `task_execution_logs`
-- Tracks all actions on store assignments (per CLAUDE.md Section 12.5)
--

DROP TABLE IF EXISTS `task_execution_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `task_execution_logs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `task_store_assignment_id` bigint unsigned NOT NULL COMMENT 'FK to task_store_assignments',
  `action` enum('dispatched','assigned_to_staff','reassigned','unassigned','started','completed','marked_unable','hq_checked','hq_rejected') COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Type of action performed',
  `performed_by` int NOT NULL COMMENT 'Staff ID who performed this action',
  `performed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'When action was performed',
  `old_status` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Previous status before action',
  `new_status` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'New status after action',
  `target_staff_id` int DEFAULT NULL COMMENT 'For assign/reassign: the staff being assigned',
  `notes` text COLLATE utf8mb4_unicode_ci COMMENT 'Additional notes, reasons, etc.',
  PRIMARY KEY (`id`),
  KEY `idx_log_assignment` (`task_store_assignment_id`),
  KEY `idx_log_performed_at` (`performed_at`),
  KEY `idx_log_action` (`action`),
  KEY `idx_log_performed_by` (`performed_by`),
  KEY `fk_log_target_staff` (`target_staff_id`),
  CONSTRAINT `fk_log_assignment` FOREIGN KEY (`task_store_assignment_id`) REFERENCES `task_store_assignments` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_log_performed_by` FOREIGN KEY (`performed_by`) REFERENCES `staff` (`staff_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_log_target_staff` FOREIGN KEY (`target_staff_id`) REFERENCES `staff` (`staff_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `task_execution_logs`
--

LOCK TABLES `task_execution_logs` WRITE;
/*!40000 ALTER TABLE `task_execution_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `task_execution_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `task_approval_history`
--

DROP TABLE IF EXISTS `task_approval_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `task_approval_history` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `task_id` int NOT NULL,
  `round_number` tinyint unsigned DEFAULT '1',
  `step_number` tinyint unsigned NOT NULL,
  `step_name` enum('SUBMIT','APPROVE','DO_TASK','CHECK') COLLATE utf8mb4_unicode_ci NOT NULL,
  `step_status` enum('submitted','done','in_process','rejected','pending') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `assigned_to_type` enum('user','stores','team') COLLATE utf8mb4_unicode_ci NOT NULL,
  `assigned_to_id` bigint unsigned DEFAULT NULL,
  `assigned_to_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `assigned_to_count` int unsigned DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `actual_start_at` timestamp NULL DEFAULT NULL,
  `actual_end_at` timestamp NULL DEFAULT NULL,
  `progress_done` int unsigned DEFAULT '0',
  `progress_total` int unsigned DEFAULT '0',
  `comment` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_task_round` (`task_id`,`round_number`),
  KEY `idx_task_step` (`task_id`,`step_number`),
  CONSTRAINT `fk_task_approval_history_task` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`task_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `teams`
--

DROP TABLE IF EXISTS `teams`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teams` (
  `team_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `team_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `department_id` int DEFAULT NULL,
  `icon` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `icon_color` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `icon_bg` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sort_order` int DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`team_id`),
  KEY `fk_teams_department` (`department_id`),
  CONSTRAINT `fk_teams_department` FOREIGN KEY (`department_id`) REFERENCES `departments` (`department_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teams`
--

LOCK TABLES `teams` WRITE;
/*!40000 ALTER TABLE `teams` DISABLE KEYS */;
INSERT INTO `teams` VALUES ('ACC-AP','Account Payable',2,'CreditCard','#f59e0b','#fef3c7',1,1,'2026-01-24 00:00:00','2026-01-24 00:00:00'),('ACC-AR','Account Receivable',2,'Wallet','#22c55e','#dcfce7',2,1,'2026-01-24 00:00:00','2026-01-24 00:00:00'),('HR-RECRUIT','Recruitment',6,'UserPlus','#3b82f6','#dbeafe',1,1,'2026-01-24 00:00:00','2026-01-24 00:00:00'),('IT-DEV','Development',4,'Code','#8b5cf6','#ede9fe',1,1,'2026-01-24 00:00:00','2026-01-24 00:00:00'),('IT-INFRA','Infrastructure',4,'Server','#6366f1','#e0e7ff',2,1,'2026-01-24 00:00:00','2026-01-24 00:00:00'),('OPE-QC','Quality Control',1,'CheckCircle','#22c55e','#dcfce7',2,1,'2026-01-24 00:00:00','2026-01-24 00:00:00'),('OPE-STORE','Store Operations',1,'Store','#3b82f6','#dbeafe',1,1,'2026-01-24 00:00:00','2026-01-24 00:00:00');
/*!40000 ALTER TABLE `teams` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `v_scope_managers`
--

DROP TABLE IF EXISTS `v_scope_managers`;
/*!50001 DROP VIEW IF EXISTS `v_scope_managers`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_scope_managers` AS SELECT 
 1 AS `scope_type`,
 1 AS `scope_id`,
 1 AS `staff_id`,
 1 AS `staff_name`,
 1 AS `staff_code`,
 1 AS `effective_grade`,
 1 AS `assignment_type`,
 1 AS `scope_name`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `v_staff_all_assignments`
--

DROP TABLE IF EXISTS `v_staff_all_assignments`;
/*!50001 DROP VIEW IF EXISTS `v_staff_all_assignments`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_staff_all_assignments` AS SELECT 
 1 AS `assignment_id`,
 1 AS `staff_id`,
 1 AS `staff_name`,
 1 AS `staff_code`,
 1 AS `primary_grade`,
 1 AS `effective_grade`,
 1 AS `working_grade`,
 1 AS `assignment_type`,
 1 AS `scope_type`,
 1 AS `scope_id`,
 1 AS `scope_name`,
 1 AS `start_date`,
 1 AS `end_date`,
 1 AS `is_active`,
 1 AS `notes`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `zones`
--

DROP TABLE IF EXISTS `zones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `zones` (
  `zone_id` int NOT NULL AUTO_INCREMENT,
  `zone_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `zone_code` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `region_id` int NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `is_active` tinyint(1) DEFAULT '1',
  `sort_order` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`zone_id`),
  UNIQUE KEY `zone_code` (`zone_code`),
  KEY `fk_zones_region` (`region_id`),
  CONSTRAINT `fk_zones_region` FOREIGN KEY (`region_id`) REFERENCES `regions` (`region_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `zones`
--

LOCK TABLES `zones` WRITE;
/*!40000 ALTER TABLE `zones` DISABLE KEYS */;
INSERT INTO `zones` VALUES (1,'Hanoi','HN',1,'Khu vực Hà Nội và vùng phụ cận',1,1,'2026-01-22 01:42:52','2026-01-22 03:02:14'),(2,'Bac Ninh - Hai Phong','BN-HP',1,'Khu vực Bắc Ninh, Hải Dương, Hải Phòng',1,2,'2026-01-22 01:42:52','2026-01-22 03:02:14'),(3,'Da Nang','DN',2,'Khu vực Đà Nẵng và các tỉnh lân cận',1,3,'2026-01-22 01:42:52','2026-01-22 03:02:14'),(4,'Hue - Quang Nam','HUE-QN',2,'Khu vực Huế và Quảng Nam',1,4,'2026-01-22 01:42:52','2026-01-22 03:02:14'),(5,'Ho Chi Minh City','HCM',3,'Khu vực TP. Hồ Chí Minh',1,5,'2026-01-22 01:42:52','2026-01-22 03:02:14'),(6,'Binh Duong - Dong Nai','BD-DN',3,'Khu vực Bình Dương và Đồng Nai',1,6,'2026-01-22 01:42:52','2026-01-22 03:02:14');
/*!40000 ALTER TABLE `zones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'auraorie68aa_aoisora'
--

--
-- Final view structure for view `v_scope_managers`
--

/*!50001 DROP VIEW IF EXISTS `v_scope_managers`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_scope_managers` AS select `sa`.`scope_type` AS `scope_type`,`sa`.`scope_id` AS `scope_id`,`sa`.`staff_id` AS `staff_id`,`s`.`staff_name` AS `staff_name`,`s`.`staff_code` AS `staff_code`,coalesce(`sa`.`effective_grade`,`s`.`job_grade`) AS `effective_grade`,`sa`.`assignment_type` AS `assignment_type`,(case `sa`.`scope_type` when 'region' then `r`.`region_name` when 'zone' then `z`.`zone_name` when 'area' then `a`.`area_name` when 'store' then `st`.`store_name` end) AS `scope_name` from (((((`staff_assignments` `sa` join `staff` `s` on((`sa`.`staff_id` = `s`.`staff_id`))) left join `regions` `r` on(((`sa`.`scope_type` = 'region') and (`sa`.`scope_id` = `r`.`region_id`)))) left join `zones` `z` on(((`sa`.`scope_type` = 'zone') and (`sa`.`scope_id` = `z`.`zone_id`)))) left join `areas` `a` on(((`sa`.`scope_type` = 'area') and (`sa`.`scope_id` = `a`.`area_id`)))) left join `stores` `st` on(((`sa`.`scope_type` = 'store') and (`sa`.`scope_id` = `st`.`store_id`)))) where ((`sa`.`is_active` = 1) and ((`sa`.`end_date` is null) or (`sa`.`end_date` >= curdate()))) order by `sa`.`scope_type`,`sa`.`scope_id`,(case `sa`.`assignment_type` when 'primary' then 1 else 2 end) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_staff_all_assignments`
--

/*!50001 DROP VIEW IF EXISTS `v_staff_all_assignments`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_staff_all_assignments` AS select `sa`.`assignment_id` AS `assignment_id`,`sa`.`staff_id` AS `staff_id`,`s`.`staff_name` AS `staff_name`,`s`.`staff_code` AS `staff_code`,`s`.`job_grade` AS `primary_grade`,`sa`.`effective_grade` AS `effective_grade`,coalesce(`sa`.`effective_grade`,`s`.`job_grade`) AS `working_grade`,`sa`.`assignment_type` AS `assignment_type`,`sa`.`scope_type` AS `scope_type`,`sa`.`scope_id` AS `scope_id`,(case `sa`.`scope_type` when 'region' then `r`.`region_name` when 'zone' then `z`.`zone_name` when 'area' then `a`.`area_name` when 'store' then `st`.`store_name` end) AS `scope_name`,`sa`.`start_date` AS `start_date`,`sa`.`end_date` AS `end_date`,`sa`.`is_active` AS `is_active`,`sa`.`notes` AS `notes` from (((((`staff_assignments` `sa` join `staff` `s` on((`sa`.`staff_id` = `s`.`staff_id`))) left join `regions` `r` on(((`sa`.`scope_type` = 'region') and (`sa`.`scope_id` = `r`.`region_id`)))) left join `zones` `z` on(((`sa`.`scope_type` = 'zone') and (`sa`.`scope_id` = `z`.`zone_id`)))) left join `areas` `a` on(((`sa`.`scope_type` = 'area') and (`sa`.`scope_id` = `a`.`area_id`)))) left join `stores` `st` on(((`sa`.`scope_type` = 'store') and (`sa`.`scope_id` = `st`.`store_id`)))) where ((`sa`.`is_active` = 1) and ((`sa`.`end_date` is null) or (`sa`.`end_date` >= curdate()))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-22 10:03:58
