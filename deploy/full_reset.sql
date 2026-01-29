-- ============================================
-- AEON AOISORA DATABASE - CLEAN RESET
-- Contains: Real MAXVALU stores and employees
-- ============================================

DROP DATABASE IF EXISTS `auraorie68aa_aoisora`;
CREATE DATABASE `auraorie68aa_aoisora` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `auraorie68aa_aoisora`;

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
(9,'Delica','DELI','Delica Division',1,3,'Utensils','#f97316','#ffedd5',1,'2026-01-24 00:00:00','2026-01-24 00:00:00'),
(10,'D&D','DD','D&D Division',1,4,'Gift','#a855f7','#f3e8ff',1,'2026-01-24 00:00:00','2026-01-24 00:00:00'),
(11,'CS','CS','Customer Service Division',1,5,'Headphones','#14b8a6','#ccfbf1',1,'2026-01-24 00:00:00','2026-01-24 00:00:00'),
-- Child Divisions under Admin (3)
(12,'Admin Div','ADMINDIV','Admin Division',2,1,'Folder','#84cc16','#ecfccb',1,'2026-01-24 00:00:00','2026-01-24 00:00:00'),
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
/*!50013 SQL SECURITY DEFINER */
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
/*!50013 SQL SECURITY DEFINER */
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


-- ============================================
-- REAL EMPLOYEE DATA (MAXVALU STORES + STAFF)
-- ============================================

LOCK TABLES `stores` WRITE;
/*!40000 ALTER TABLE `stores` DISABLE KEYS */;
INSERT INTO stores (store_id, store_name, store_code, region_id, area_id, status) VALUES (1, 'MAXVALU CIPUTRA', 'MV-CIPUTRA', 1, 1, 'active');
INSERT INTO stores (store_id, store_name, store_code, region_id, area_id, status) VALUES (2, 'MAXVALU ECOPARK', 'MV-ECOPARK', 1, 1, 'active');
INSERT INTO stores (store_id, store_name, store_code, region_id, area_id, status) VALUES (3, 'MAXVALU ECOPARK 3', 'MV-ECOPARK-3', 1, 1, 'active');
INSERT INTO stores (store_id, store_name, store_code, region_id, area_id, status) VALUES (4, 'MAXVALU FIVE STAR', 'MV-FIVE-STAR', 1, 1, 'active');
INSERT INTO stores (store_id, store_name, store_code, region_id, area_id, status) VALUES (5, 'MAXVALU HAVENPARK', 'MV-HAVENPARK', 1, 1, 'active');
INSERT INTO stores (store_id, store_name, store_code, region_id, area_id, status) VALUES (6, 'MAXVALU HAWAII', 'MV-HAWAII', 1, 1, 'active');
INSERT INTO stores (store_id, store_name, store_code, region_id, area_id, status) VALUES (7, 'MAXVALU HORIZON', 'MV-HORIZON', 1, 1, 'active');
INSERT INTO stores (store_id, store_name, store_code, region_id, area_id, status) VALUES (8, 'MAXVALU HYUNDAI', 'MV-HYUNDAI', 1, 1, 'active');
INSERT INTO stores (store_id, store_name, store_code, region_id, area_id, status) VALUES (9, 'MAXVALU KOSMO', 'MV-KOSMO', 1, 1, 'active');
INSERT INTO stores (store_id, store_name, store_code, region_id, area_id, status) VALUES (10, 'MAXVALU LA CASTA', 'MV-LA-CASTA', 1, 1, 'active');
INSERT INTO stores (store_id, store_name, store_code, region_id, area_id, status) VALUES (11, 'MAXVALU LANDMARK', 'MV-LANDMARK', 1, 1, 'active');
INSERT INTO stores (store_id, store_name, store_code, region_id, area_id, status) VALUES (12, 'MAXVALU LINH DAM', 'MV-LINH-DAM', 1, 1, 'active');
INSERT INTO stores (store_id, store_name, store_code, region_id, area_id, status) VALUES (13, 'MAXVALU LINH NAM', 'MV-LINH-NAM', 1, 1, 'active');
INSERT INTO stores (store_id, store_name, store_code, region_id, area_id, status) VALUES (14, 'MAXVALU LOTUS', 'MV-LOTUS', 1, 1, 'active');
INSERT INTO stores (store_id, store_name, store_code, region_id, area_id, status) VALUES (15, 'MAXVALU MASTERI SMART CITY', 'MV-MASTERI-SMART-CITY', 1, 1, 'active');
INSERT INTO stores (store_id, store_name, store_code, region_id, area_id, status) VALUES (16, 'MAXVALU NAM TRUNG YEN', 'MV-NAM-TRUNG-YEN', 1, 1, 'active');
INSERT INTO stores (store_id, store_name, store_code, region_id, area_id, status) VALUES (17, 'MAXVALU OCEAN PARK', 'MV-OCEAN-PARK', 1, 1, 'active');
INSERT INTO stores (store_id, store_name, store_code, region_id, area_id, status) VALUES (18, 'MAXVALU OCEANPARK MASTERI', 'MV-OCEANPARK-MASTERI', 1, 1, 'active');
INSERT INTO stores (store_id, store_name, store_code, region_id, area_id, status) VALUES (19, 'MAXVALU OCEANPARK SAPPHIRE', 'MV-OCEANPARK-SAPPHIRE', 1, 1, 'active');
INSERT INTO stores (store_id, store_name, store_code, region_id, area_id, status) VALUES (20, 'MAXVALU RIVERSIDE', 'MV-RIVERSIDE', 1, 1, 'active');
INSERT INTO stores (store_id, store_name, store_code, region_id, area_id, status) VALUES (21, 'MAXVALU ROYAL CITY', 'MV-ROYAL-CITY', 1, 1, 'active');
INSERT INTO stores (store_id, store_name, store_code, region_id, area_id, status) VALUES (22, 'MAXVALU SKYOASIS', 'MV-SKYOASIS', 1, 1, 'active');
INSERT INTO stores (store_id, store_name, store_code, region_id, area_id, status) VALUES (23, 'MAXVALU SYMPHONY', 'MV-SYMPHONY', 1, 1, 'active');
INSERT INTO stores (store_id, store_name, store_code, region_id, area_id, status) VALUES (24, 'MAXVALU THANG LONG NO1', 'MV-THANG-LONG-NO1', 1, 1, 'active');
INSERT INTO stores (store_id, store_name, store_code, region_id, area_id, status) VALUES (25, 'MAXVALU THE FIVE', 'MV-THE-FIVE', 1, 1, 'active');
INSERT INTO stores (store_id, store_name, store_code, region_id, area_id, status) VALUES (26, 'MAXVALU WEST POINT', 'MV-WEST-POINT', 1, 1, 'active');
INSERT INTO stores (store_id, store_name, store_code, region_id, area_id, status) VALUES (27, 'MAXVALU WESTBAY', 'MV-WESTBAY', 1, 1, 'active');
INSERT INTO stores (store_id, store_name, store_code, region_id, area_id, status) VALUES (28, 'MAXVALU ZEN PARK', 'MV-ZEN-PARK', 1, 1, 'active');
/*!40000 ALTER TABLE `stores` ENABLE KEYS */;
UNLOCK TABLES;

LOCK TABLES `staff` WRITE;
/*!40000 ALTER TABLE `staff` DISABLE KEYS */;
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (1, '277603', 'Trịnh Thu Hằng', 'trinhthuhang', 'trinhthuhang@aeon.com.vn', NULL, NULL, 6, 'SUPERVISOR', 'Deputy Manager', 'G4', '2015-05-04', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (2, '279020', 'Nguyễn Đại Việt', 'nguyendaiviet', 'nguyendaiviet@aeon.com.vn', NULL, NULL, 7, 'MANAGER', 'Manager', 'G5', '2015-08-03', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (3, '279357', 'Nguyễn Thị Hiền', 'nguyenthihien', 'nguyenthihien@aeon.com.vn', NULL, NULL, 12, 'SUPERVISOR', 'Executive', 'G3', '2015-08-17', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (4, '280071', 'Phan Thị Hồng Nhung', 'phanthihongnhung', 'phanthihongnhung@aeon.com.vn', NULL, NULL, 6, 'SUPERVISOR', 'Executive', 'G3', '2015-09-03', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (5, '280298', 'Nguyễn Thị Nga', 'nguyenthinga', 'nguyenthinga@aeon.com.vn', NULL, NULL, 12, 'STAFF', 'Officer', 'G2', '2017-08-26', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (6, '280305', 'Nguyễn Thị Mỹ', 'nguyenthimy', 'nguyenthimy@aeon.com.vn', NULL, NULL, 11, 'SUPERVISOR', 'Executive', 'G3', '2015-09-03', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (7, '280663', 'Đoàn Thị Vân Anh', 'doanthivananh', 'doanthivananh@aeon.com.vn', NULL, NULL, 6, 'STAFF', 'Officer', 'G2', '2015-09-14', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (8, '281148', 'Vũ Thanh Tùng', 'vuthanhtung', 'vuthanhtung@aeon.com.vn', NULL, NULL, 4, 'SUPERVISOR', 'Executive', 'G3', '2015-09-29', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (9, '283407', 'Đỗ Thị Kim Duyên', 'dothikimduyen', 'dothikimduyen@aeon.com.vn', NULL, NULL, 12, 'SUPERVISOR', 'Deputy manager', 'G4', '2015-12-16', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (10, '283789', 'Lê Hoài Thu', 'lehoaithu', 'lehoaithu@aeon.com.vn', NULL, NULL, 6, 'SUPERVISOR', 'Executive', 'G3', '2015-12-26', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (11, '305765', 'Nguyễn Hồng Phượng', 'nguyenhongphuong', 'nguyenhongphuong@aeon.com.vn', NULL, NULL, 11, 'STAFF', 'Officer', 'G2', '2018-03-01', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (12, '306072', 'Lê Thị Thúy', 'lethithuy', 'lethithuy@aeon.com.vn', NULL, NULL, 8, 'SUPERVISOR', 'Executive', 'G3', '2018-03-09', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (13, '306083', 'Nguyễn Diệu Linh', 'nguyendieulinh', 'nguyendieulinh@aeon.com.vn', NULL, NULL, 7, 'STAFF', 'Officer', 'G2', '2018-03-09', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (14, '403482', 'Chu Thị Thu Hương', 'chuthithuhuong', 'chuthithuhuong@aeon.com.vn', NULL, NULL, 15, 'STAFF', 'Officer', 'G2', '2019-10-14', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (15, '403996', 'Đặng Ngọc Anh', 'dangngocanh', 'dangngocanh@aeon.com.vn', NULL, NULL, 13, 'STAFF', 'Officer', 'G2', '2019-11-08', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (16, '405998', 'Bùi Quang Nghĩa', 'buiquangnghia', 'buiquangnghia@aeon.com.vn', NULL, NULL, 3, 'SUPERVISOR', 'Deputy manager', 'G4', '2020-03-26', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (17, '405999', 'Bùi Thị Ngoan', 'buithingoan', 'buithingoan@aeon.com.vn', NULL, NULL, 3, 'SUPERVISOR', 'Executive', 'G3', '2020-03-26', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (18, '406000', 'Trịnh Phương Dung', 'trinhphuongdung', 'trinhphuongdung@aeon.com.vn', NULL, NULL, 8, 'SUPERVISOR', 'Executive', 'G3', '2020-03-26', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (19, '406266', 'Nguyễn Thị Hiền', 'nguyenthihien20', 'nguyenthihien20@aeon.com.vn', NULL, NULL, 9, 'SUPERVISOR', 'Executive', 'G3', '2020-06-10', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (20, '406509', 'Vũ Thị Thanh', 'vuthithanh', 'vuthithanh@aeon.com.vn', NULL, NULL, 15, 'STAFF', 'Officer', 'G2', '2020-09-10', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (21, '408716', 'Phan Thị Phương Thảo', 'phanthiphuongthao', 'phanthiphuongthao@aeon.com.vn', NULL, NULL, 4, 'SUPERVISOR', 'Deputy manager', 'G4', '2021-07-12', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (22, '408811', 'Lê Đức Ngọc', 'leducngoc', 'leducngoc@aeon.com.vn', NULL, NULL, 9, 'SUPERVISOR', 'Executive', 'G3', '2021-10-11', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (23, '408813', 'Đặng Việt Thắng', 'dangvietthang', 'dangvietthang@aeon.com.vn', NULL, NULL, 7, 'SUPERVISOR', 'Executive', 'G3', '2021-10-11', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (24, '408892', 'Phạm Thị Nguyệt', 'phamthinguyet', 'phamthinguyet@aeon.com.vn', NULL, NULL, 8, 'SUPERVISOR', 'Executive', 'G3', '2021-10-26', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (25, '411035', 'Phạm Thị Huyền', 'phamthihuyen', 'phamthihuyen@aeon.com.vn', NULL, NULL, 3, 'STAFF', 'Officer', 'G2', '2022-06-10', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (26, '411339', 'Nguyễn Thu Trang', 'nguyenthutrang', 'nguyenthutrang@aeon.com.vn', NULL, NULL, 14, 'STAFF', 'Officer', 'G2', '2022-07-18', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (27, '411725', 'Nguyễn Thị Thúy', 'nguyenthithuy', 'nguyenthithuy@aeon.com.vn', NULL, NULL, 12, 'STAFF', 'Officer', 'G2', '2022-08-26', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (28, '412108', 'Nguyễn Mạnh Tiến', 'nguyenmanhtien', 'nguyenmanhtien@aeon.com.vn', NULL, NULL, 8, 'STAFF', 'Officer', 'G2', '2022-10-11', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (29, '412453', 'Lê Minh Phương', 'leminhphuong', 'leminhphuong@aeon.com.vn', NULL, NULL, 14, 'STAFF', 'Officer', 'G2', '2022-11-17', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (30, '413519', 'Phạm Thị Thanh Vân', 'phamthithanhvan', 'phamthithanhvan@aeon.com.vn', NULL, NULL, 8, 'STAFF', 'Officer', 'G2', '2023-01-30', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (31, '413869', 'Lưu Thị Hằng', 'luuthihang', 'luuthihang@aeon.com.vn', NULL, NULL, 3, 'STAFF', 'Officer', 'G2', '2023-04-17', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (32, '414217', 'Trần Thị Bích', 'tranthibich', 'tranthibich@aeon.com.vn', NULL, NULL, 10, 'STAFF', 'Officer', 'G2', '2023-06-05', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (33, '414422', 'Hà Thị Khánh Huyền', 'hathikhanhhuyen', 'hathikhanhhuyen@aeon.com.vn', NULL, NULL, 6, 'SUPERVISOR', 'Executive', 'G3', '2023-07-10', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (34, '415151', 'Vũ Quỳnh Mai', 'vuquynhmai', 'vuquynhmai@aeon.com.vn', NULL, NULL, 12, 'STAFF', 'Officer', 'G2', '2024-09-09', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (35, '417226', 'Lưu Thị Thu Phương', 'luuthithuphuong', 'luuthithuphuong@aeon.com.vn', NULL, NULL, 10, 'STAFF', 'Officer', 'G2', '2024-06-07', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (36, '421108', 'Nguyễn Thị Huyền', 'nguyenthihuyen', 'nguyenthihuyen@aeon.com.vn', NULL, NULL, 8, 'STAFF', 'Officer', 'G2', '2025-03-17', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (37, '280312', 'Nguyễn Văn Trung', 'nguyenvantrung', 'nguyenvantrung@aeon.com.vn', NULL, 17, NULL, 'STAFF', 'Sales Leader', 'G2', '2015-09-03', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (38, '291508', 'Nguyễn Khánh Tâm', 'nguyenkhanhtam', 'nguyenkhanhtam@aeon.com.vn', NULL, 3, NULL, 'STAFF', 'General Staff', 'G1', '2023-09-11', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (39, '295993', 'Nguyễn Thị Quỳnh', 'nguyenthiquynh', 'nguyenthiquynh@aeon.com.vn', NULL, 3, NULL, 'STAFF', 'Sales Leader', 'G2', '2017-03-10', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (40, '304947', 'Đỗ Hương Giang', 'dohuonggiang', 'dohuonggiang@aeon.com.vn', NULL, 17, NULL, 'SUPERVISOR', 'Store Manager', 'G3', '2018-01-28', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (41, '308706', 'Trần Thị Vân Anh', 'tranthivananh', 'tranthivananh@aeon.com.vn', NULL, 17, NULL, 'STAFF', 'Sales Leader', 'G2', '2022-05-10', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (42, '308707', 'Nguyễn Thị Mai Anh', 'nguyenthimaianh', 'nguyenthimaianh@aeon.com.vn', NULL, 27, NULL, 'STAFF', 'General staff', 'G1', '2018-05-26', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (43, '309063', 'Lưu Thị Trung Anh', 'luuthitrunganh', 'luuthitrunganh@aeon.com.vn', NULL, 22, NULL, 'STAFF', 'General Staff', 'G1', '2022-02-10', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (44, '309247', 'Nguyễn Thị Thu Huyền', 'nguyenthithuhuyen', 'nguyenthithuhuyen@aeon.com.vn', NULL, 22, NULL, 'STAFF', 'Sales Leader', 'G2', '2018-06-26', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (45, '311064', 'Nguyễn Hải Nam', 'nguyenhainam', 'nguyenhainam@aeon.com.vn', NULL, 13, NULL, 'STAFF', 'General staff', 'G1', '2022-03-28', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (46, '311816', 'Nguyễn Thị Kim Lan', 'nguyenthikimlan', 'nguyenthikimlan@aeon.com.vn', NULL, 2, NULL, 'STAFF', 'General staff', 'G1', '2023-04-10', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (47, '313788', 'Nguyễn Bảo Yến', 'nguyenbaoyen', 'nguyenbaoyen@aeon.com.vn', NULL, 9, NULL, 'STAFF', 'General staff', 'G1', '2022-08-17', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (48, '400587', 'Lê Thị Thu Hà', 'lethithuha', 'lethithuha@aeon.com.vn', NULL, 23, NULL, 'STAFF', 'General Staff', 'G1', '2025-02-27', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (49, '400844', 'Nguyễn Hoàng Giang', 'nguyenhoanggiang', 'nguyenhoanggiang@aeon.com.vn', NULL, 3, NULL, 'STAFF', 'Sales Leader', 'G2', '2022-03-10', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (50, '401426', 'Nguyễn Thị Huế', 'nguyenthihue', 'nguyenthihue@aeon.com.vn', NULL, 17, NULL, 'STAFF', 'General staff', 'G1', '2019-07-26', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (51, '401433', 'Nguyễn Thị Lan Hương', 'nguyenthilanhuong', 'nguyenthilanhuong@aeon.com.vn', NULL, 2, NULL, 'STAFF', 'Support Leader', 'G2', '2020-08-03', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (52, '401935', 'Đỗ Thị Thu Hương', 'dothithuhuong', 'dothithuhuong@aeon.com.vn', NULL, NULL, 7, 'STAFF', 'Sales Leader', 'G1', '2019-04-19', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (53, '402465', 'Nguyễn Thanh Tú', 'nguyenthanhtu', 'nguyenthanhtu@aeon.com.vn', NULL, 22, NULL, 'SUPERVISOR', 'Store Manager', 'G3', '2019-07-10', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (54, '402853', 'Trần Thị Huyền', 'tranthihuyen', 'tranthihuyen@aeon.com.vn', NULL, 2, NULL, 'STAFF', 'General staff', 'G1', '2022-10-10', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (55, '403054', 'Nguyễn Thị Mai', 'nguyenthimai', 'nguyenthimai@aeon.com.vn', NULL, 21, NULL, 'SUPERVISOR', 'Store Manager', 'G3', '2019-09-10', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (56, '403402', 'Nguyễn Hữu Cường', 'nguyenhuucuong', 'nguyenhuucuong@aeon.com.vn', NULL, 8, NULL, 'SUPERVISOR', 'Store manager', 'G3', '2019-10-07', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (57, '403408', 'Bùi Văn Tình', 'buivantinh', 'buivantinh@aeon.com.vn', NULL, 19, NULL, 'STAFF', 'Sales Leader', 'G2', '2019-10-07', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (58, '403483', 'Nguyễn Thị Thúy Hằng', 'nguyenthithuyhang', 'nguyenthithuyhang@aeon.com.vn', NULL, 4, NULL, 'STAFF', 'General Staff', 'G1', '2019-10-14', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (59, '403498', 'Phạm Thị Thanh Xuân', 'phamthithanhxuan', 'phamthithanhxuan@aeon.com.vn', NULL, 20, NULL, 'STAFF', 'General staff', 'G1', '2019-10-14', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (60, '403723', 'Trương Văn Quỳnh', 'truongvanquynh', 'truongvanquynh@aeon.com.vn', NULL, 8, NULL, 'STAFF', 'General staff', 'G1', '2019-10-26', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (61, '403997', 'Nguyễn Việt Thành', 'nguyenvietthanh', 'nguyenvietthanh@aeon.com.vn', NULL, 28, NULL, 'SUPERVISOR', 'Store Manager', 'G3', '2019-11-08', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (62, '404387', 'Trần Thị Nga', 'tranthinga', 'tranthinga@aeon.com.vn', NULL, 17, NULL, 'STAFF', 'General staff', 'G1', '2019-11-18', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (63, '404516', 'Nguyễn Thùy Linh', 'nguyenthuylinh', 'nguyenthuylinh@aeon.com.vn', NULL, 27, NULL, 'STAFF', 'General staff', 'G1', '2022-08-10', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (64, '404793', 'Nguyễn Lan Linh', 'nguyenlanlinh', 'nguyenlanlinh@aeon.com.vn', NULL, 18, NULL, 'STAFF', 'Sales Leader', 'G2', '2020-07-27', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (65, '404929', 'Bùi Phương Thảo', 'buiphuongthao', 'buiphuongthao@aeon.com.vn', NULL, 12, NULL, 'STAFF', 'General staff', 'G1', '2021-12-06', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (66, '406020', 'Nguyễn Thị Thạo', 'nguyenthithao', 'nguyenthithao@aeon.com.vn', NULL, 12, NULL, 'SUPERVISOR', 'Store Manager', 'G3', '2020-04-27', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (67, '406345', 'Phạm Mỹ Anh', 'phammyanh', 'phammyanh@aeon.com.vn', NULL, 28, NULL, 'STAFF', 'General staff', 'G1', '2026-01-17', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (68, '406465', 'Hoàng Bảo Thắng', 'hoangbaothang', 'hoangbaothang@aeon.com.vn', NULL, 22, NULL, 'STAFF', 'Sales Leader', 'G2', '2020-08-03', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (69, '406491', 'Đoàn Thị Bảo Trang', 'doanthibaotrang', 'doanthibaotrang@aeon.com.vn', NULL, 8, NULL, 'STAFF', 'Support Leader', 'G2', '2021-03-10', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (70, '406603', 'Vũ Anh Tuấn', 'vuanhtuan', 'vuanhtuan@aeon.com.vn', NULL, 21, NULL, 'STAFF', 'General Staff', 'G1', '2025-02-27', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (71, '407014', 'Nguyễn Hồng Nga', 'nguyenhongnga', 'nguyenhongnga@aeon.com.vn', NULL, 2, NULL, 'STAFF', 'General staff', 'G1', '2020-11-09', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (72, '407338', 'Trần Thị Thanh Thủy', 'tranthithanhthuy', 'tranthithanhthuy@aeon.com.vn', NULL, 23, NULL, 'STAFF', 'Sales Leader', 'G2', '2022-03-10', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (73, '407579', 'Cao Thị Thanh Trà', 'caothithanhtra', 'caothithanhtra@aeon.com.vn', NULL, 28, NULL, 'STAFF', 'Sales Leader', 'G2', '2020-12-26', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (74, '408221', 'Kiều Thị Hanh', 'kieuthihanh', 'kieuthihanh@aeon.com.vn', NULL, 15, NULL, 'STAFF', 'General Staff', 'G1', '2021-09-27', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (75, '408284', 'Lê Đức Anh', 'leducanh', 'leducanh@aeon.com.vn', NULL, 27, NULL, 'STAFF', 'General staff', 'G1', '2025-05-27', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (76, '408448', 'Trần Minh Hải', 'tranminhhai', 'tranminhhai@aeon.com.vn', NULL, 11, NULL, 'STAFF', 'General Staff', 'G1', '2022-08-26', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (77, '408451', 'Nguyễn Hồng Hạnh', 'nguyenhonghanh', 'nguyenhonghanh@aeon.com.vn', NULL, 12, NULL, 'STAFF', 'Sales Leader', 'G2', '2021-04-12', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (78, '408739', 'Phạm Thị Hương', 'phamthihuong', 'phamthihuong@aeon.com.vn', NULL, 8, NULL, 'STAFF', 'General staff', 'G1', '2021-07-19', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (79, '408747', 'Đào Nhật Mỹ Linh', 'daonhatmylinh', 'daonhatmylinh@aeon.com.vn', NULL, 25, NULL, 'STAFF', 'General staff', 'G1', '2021-07-26', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (80, '408794', 'Trần Anh Tuấn', 'trananhtuan', 'trananhtuan@aeon.com.vn', NULL, 10, NULL, 'SUPERVISOR', 'Store Manager', 'G3', '2021-09-27', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (81, '408826', 'Đào Thị Hồng', 'daothihong', 'daothihong@aeon.com.vn', NULL, 2, NULL, 'STAFF', 'General staff', 'G1', '2021-10-11', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (82, '408846', 'Lê Việt Quang', 'levietquang', 'levietquang@aeon.com.vn', NULL, 20, NULL, 'STAFF', 'General staff', 'G1', '2023-05-10', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (83, '408871', 'Hoàng Thị Nga', 'hoangthinga', 'hoangthinga@aeon.com.vn', NULL, 14, NULL, 'STAFF', 'General staff', 'G1', '2021-10-18', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (84, '408872', 'Lương Thiện Phúc', 'luongthienphuc', 'luongthienphuc@aeon.com.vn', NULL, 7, NULL, 'STAFF', 'General staff', 'G1', '2025-07-28', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (85, '408885', 'Nguyễn Thị Hương', 'nguyenthihuong', 'nguyenthihuong@aeon.com.vn', NULL, 23, NULL, 'SUPERVISOR', 'Store Manager', 'G3', '2021-10-26', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (86, '408886', 'Vũ Thị Lệ Tuyết', 'vuthiletuyet', 'vuthiletuyet@aeon.com.vn', NULL, 2, NULL, 'STAFF', 'General staff', 'G1', '2021-10-26', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (87, '409032', 'Nguyễn Khánh Đạt', 'nguyenkhanhdat', 'nguyenkhanhdat@aeon.com.vn', NULL, 14, NULL, 'STAFF', 'General staff', 'G1', '2022-04-26', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (88, '409034', 'Nguyễn Thuý Huyền', 'nguyenthuyhuyen', 'nguyenthuyhuyen@aeon.com.vn', NULL, 12, NULL, 'STAFF', 'General staff', 'G1', '2021-12-27', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (89, '409310', 'Nguyễn Thế Giang', 'nguyenthegiang', 'nguyenthegiang@aeon.com.vn', NULL, 24, NULL, 'STAFF', 'General staff', 'G1', '2021-12-06', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (90, '409311', 'Đỗ Chí Thanh', 'dochithanh', 'dochithanh@aeon.com.vn', NULL, 5, NULL, 'SUPERVISOR', 'Store Manager', 'G3', '2021-12-06', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (91, '409312', 'Phạm Ngọc Nam', 'phamngocnam', 'phamngocnam@aeon.com.vn', NULL, 25, NULL, 'SUPERVISOR', 'Store Manager', 'G3', '2021-12-06', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (92, '409318', 'Lê Thu Trang', 'lethutrang', 'lethutrang@aeon.com.vn', NULL, 24, NULL, 'STAFF', 'General staff', 'G1', '2021-12-10', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (93, '409319', 'Phạm Thị Thu Hiền', 'phamthithuhien', 'phamthithuhien@aeon.com.vn', NULL, 24, NULL, 'STAFF', 'General staff', 'G1', '2021-12-10', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (94, '409369', 'Nguyễn Kiều Anh', 'nguyenkieuanh', 'nguyenkieuanh@aeon.com.vn', NULL, 17, NULL, 'STAFF', 'General staff', 'G1', '2022-03-17', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (95, '409410', 'Trần Hồng Minh', 'tranhongminh', 'tranhongminh@aeon.com.vn', NULL, 19, NULL, 'STAFF', 'Sales Leader', 'G2', '2021-12-17', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (96, '409414', 'Lưu Thúy Hồng', 'luuthuyhong', 'luuthuyhong@aeon.com.vn', NULL, 12, NULL, 'STAFF', 'General staff', 'G1', '2021-12-17', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (97, '409415', 'Giáp Xuân Phương', 'giapxuanphuong', 'giapxuanphuong@aeon.com.vn', NULL, 14, NULL, 'STAFF', 'General staff', 'G1', '2021-12-17', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (98, '409416', 'Lưu Huyền Ly', 'luuhuyenly', 'luuhuyenly@aeon.com.vn', NULL, 12, NULL, 'STAFF', 'General staff', 'G1', '2021-12-17', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (99, '409419', 'Nguyễn Thị Phương Thảo', 'nguyenthiphuongthao', 'nguyenthiphuongthao@aeon.com.vn', NULL, 12, NULL, 'STAFF', 'General staff', 'G1', '2021-12-17', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (100, '409423', 'Chu Thanh Quỳnh', 'chuthanhquynh', 'chuthanhquynh@aeon.com.vn', NULL, 3, NULL, 'STAFF', 'General Staff', 'G1', '2021-12-17', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (101, '409444', 'Đinh Thị Hải Yến', 'dinhthihaiyen', 'dinhthihaiyen@aeon.com.vn', NULL, 12, NULL, 'STAFF', 'General staff', 'G1', '2021-12-20', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (102, '409482', 'Nguyễn Thị Trang', 'nguyenthitrang', 'nguyenthitrang@aeon.com.vn', NULL, 27, NULL, 'STAFF', 'General staff', 'G1', '2021-12-27', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (103, '409496', 'Nguyễn Phan Hoài Thu', 'nguyenphanhoaithu', 'nguyenphanhoaithu@aeon.com.vn', NULL, 11, NULL, 'STAFF', 'Sales Leader', 'G2', '2021-12-27', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (104, '409535', 'Vũ Lê Phương', 'vulephuong', 'vulephuong@aeon.com.vn', NULL, 2, NULL, 'STAFF', 'General staff', 'G1', '2022-01-03', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (105, '409538', 'Nguyễn Thị Linh', 'nguyenthilinh', 'nguyenthilinh@aeon.com.vn', NULL, 22, NULL, 'STAFF', 'General Staff', 'G1', '2022-01-03', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (106, '409539', 'Hoàng Thị Nga', 'hoangthinga22', 'hoangthinga22@aeon.com.vn', NULL, 27, NULL, 'STAFF', 'General staff', 'G1', '2022-01-03', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (107, '409574', 'Chu Thanh Hải', 'chuthanhhai', 'chuthanhhai@aeon.com.vn', NULL, 13, NULL, 'STAFF', 'General staff', 'G1', '2024-01-08', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (108, '409752', 'Nguyễn Lệ Chi', 'nguyenlechi', 'nguyenlechi@aeon.com.vn', NULL, 18, NULL, 'STAFF', 'Sales Leader', 'G2', '2022-01-10', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (109, '409755', 'Đào Phương Thảo', 'daophuongthao', 'daophuongthao@aeon.com.vn', NULL, 24, NULL, 'STAFF', 'General staff', 'G1', '2022-01-10', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (110, '410040', 'Nguyễn Thị Lan Hương', 'nguyenthilanhuong22', 'nguyenthilanhuong22@aeon.com.vn', NULL, 27, NULL, 'SUPERVISOR', 'Store Manager', 'G3', '2022-01-17', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (111, '410041', 'Nguyễn Thị Hưng', 'nguyenthihung', 'nguyenthihung@aeon.com.vn', NULL, 4, NULL, 'STAFF', 'General Staff', 'G1', '2022-01-17', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (112, '410372', 'Lại Văn Long', 'laivanlong', 'laivanlong@aeon.com.vn', NULL, 14, NULL, 'SUPERVISOR', 'Store Manager', 'G3', '2022-03-10', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (113, '410375', 'Nguyễn Quỳnh Anh', 'nguyenquynhanh', 'nguyenquynhanh@aeon.com.vn', NULL, 24, NULL, 'STAFF', 'General staff', 'G1', '2023-06-10', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (114, '410397', 'Nguyễn Thị Thuý Hà', 'nguyenthithuyha', 'nguyenthithuyha@aeon.com.vn', NULL, 28, NULL, 'STAFF', 'General staff', 'G1', '2023-04-21', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (115, '410406', 'Lê Thúy Hà', 'lethuyha', 'lethuyha@aeon.com.vn', NULL, NULL, 7, 'STAFF', 'Sales Leader', 'G1', '2022-08-26', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (116, '410432', 'Hoàng Thị Giang', 'hoangthigiang', 'hoangthigiang@aeon.com.vn', NULL, 18, NULL, 'SUPERVISOR', 'Store Manager', 'G3', '2022-03-17', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (117, '410435', 'Chu Huy Hoàng', 'chuhuyhoang', 'chuhuyhoang@aeon.com.vn', NULL, 6, NULL, 'STAFF', 'Sales Leader', 'G2', '2022-03-17', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (118, '410437', 'Đặng Thị Thuý Hường', 'dangthithuyhuong', 'dangthithuyhuong@aeon.com.vn', NULL, 17, NULL, 'STAFF', 'General staff', 'G1', '2022-03-28', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (119, '410607', 'Nguyễn Thị Bích Ngà', 'nguyenthibichnga', 'nguyenthibichnga@aeon.com.vn', NULL, 27, NULL, 'STAFF', 'General staff', 'G1', '2022-04-12', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (120, '410630', 'Phùng Đình Lợi', 'phungdinhloi', 'phungdinhloi@aeon.com.vn', NULL, 28, NULL, 'STAFF', 'General staff', 'G1', '2022-06-27', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (121, '410647', 'Lê Văn Hinh', 'levanhinh', 'levanhinh@aeon.com.vn', NULL, 13, NULL, 'STAFF', 'Sales Leader', 'G2', '2022-04-12', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (122, '410707', 'Phạm Thị Yến', 'phamthiyen', 'phamthiyen@aeon.com.vn', NULL, 15, NULL, 'STAFF', 'General Staff', 'G1', '2022-04-20', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (123, '410766', 'Huỳnh Thị Hồng Loan', 'huynhthihongloan', 'huynhthihongloan@aeon.com.vn', NULL, 23, NULL, 'STAFF', 'General Staff', 'G1', '2022-04-26', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (124, '410768', 'Lưu Cẩm Ly', 'luucamly', 'luucamly@aeon.com.vn', NULL, 12, NULL, 'STAFF', 'General staff', 'G1', '2022-04-26', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (125, '410771', 'Nguyễn Tiến Đạt', 'nguyentiendat', 'nguyentiendat@aeon.com.vn', NULL, 10, NULL, 'STAFF', 'General staff', 'G1', '2023-04-21', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (126, '410815', 'Nguyễn Thúy Quỳnh', 'nguyenthuyquynh', 'nguyenthuyquynh@aeon.com.vn', NULL, 13, NULL, 'STAFF', 'General staff', 'G1', '2022-06-27', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (127, '410824', 'Trần Thị Trang', 'tranthitrang', 'tranthitrang@aeon.com.vn', NULL, 7, NULL, 'STAFF', 'Sales Leader', 'G2', '2022-05-10', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (128, '410846', 'Nguyễn Thị Lan Phương', 'nguyenthilanphuong', 'nguyenthilanphuong@aeon.com.vn', NULL, 26, NULL, 'STAFF', 'Sales Leader', 'G2', '2022-05-10', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (129, '410939', 'Đình Thu Luyến', 'dinhthuluyen', 'dinhthuluyen@aeon.com.vn', NULL, 7, NULL, 'STAFF', 'General staff', 'G1', '2022-05-27', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (130, '410944', 'Đỗ Thị Phương Anh', 'dothiphuonganh', 'dothiphuonganh@aeon.com.vn', NULL, 13, NULL, 'STAFF', 'General staff', 'G1', '2023-05-10', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (131, '410989', 'Phạm Thúy Huyền', 'phamthuyhuyen', 'phamthuyhuyen@aeon.com.vn', NULL, NULL, 7, 'STAFF', 'Sales Leader', 'G1', '2022-06-03', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (132, '411034', 'Nguyễn Thị Loan Phương', 'nguyenthiloanphuong', 'nguyenthiloanphuong@aeon.com.vn', NULL, 9, NULL, 'SUPERVISOR', 'Store Manager', 'G3', '2022-06-10', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (133, '411068', 'Cao Thị Khiêm', 'caothikhiem', 'caothikhiem@aeon.com.vn', NULL, 14, NULL, 'STAFF', 'Sales Leader', 'G2', '2022-06-10', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (134, '411076', 'Đào Thái Thu', 'daothaithu', 'daothaithu@aeon.com.vn', NULL, 2, NULL, 'STAFF', 'Sales Leader', 'G2', '2022-06-10', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (135, '411078', 'Nguyễn Như Khuyên', 'nguyennhukhuyen', 'nguyennhukhuyen@aeon.com.vn', NULL, 2, NULL, 'STAFF', 'General staff', 'G1', '2022-06-10', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (136, '411083', 'Nguyễn Phương Thanh', 'nguyenphuongthanh', 'nguyenphuongthanh@aeon.com.vn', NULL, 6, NULL, 'STAFF', 'General Staff', 'G1', '2025-09-27', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (137, '411139', 'Nguyễn Thị Thu Hiền', 'nguyenthithuhien', 'nguyenthithuhien@aeon.com.vn', NULL, 16, NULL, 'STAFF', 'Sales Leader', 'G2', '2022-06-27', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (138, '411158', 'Hoàng Đức Anh', 'hoangducanh', 'hoangducanh@aeon.com.vn', NULL, 7, NULL, 'STAFF', 'General staff', 'G1', '2022-06-27', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (139, '411173', 'Nguyễn Thanh Tâm', 'nguyenthanhtam', 'nguyenthanhtam@aeon.com.vn', NULL, 8, NULL, 'STAFF', 'General staff', 'G1', '2025-01-07', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (140, '411273', 'Nguyễn Thị Ngợi', 'nguyenthingoi', 'nguyenthingoi@aeon.com.vn', NULL, 4, NULL, 'SUPERVISOR', 'Store Manager', 'G3', '2022-07-11', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (141, '411279', 'Lê Thu Trà', 'lethutra', 'lethutra@aeon.com.vn', NULL, 24, NULL, 'STAFF', 'General staff', 'G1', '2022-07-11', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (142, '411280', 'Lê Văn Đạt', 'levandat', 'levandat@aeon.com.vn', NULL, 15, NULL, 'STAFF', 'Sales Leader', 'G2', '2022-07-11', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (143, '411420', 'Trần Hoàng Vân', 'tranhoangvan', 'tranhoangvan@aeon.com.vn', NULL, 15, NULL, 'SUPERVISOR', 'Store Manager', 'G3', '2022-07-26', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (144, '411530', 'Lê Văn Tuấn', 'levantuan', 'levantuan@aeon.com.vn', NULL, 24, NULL, 'STAFF', 'General staff', 'G1', '2024-11-19', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (145, '411576', 'Đỗ Thị Thanh Bình', 'dothithanhbinh', 'dothithanhbinh@aeon.com.vn', NULL, 19, NULL, 'STAFF', 'General Staff', 'G1', '2024-11-07', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (146, '411711', 'Vũ Hữu Phúc', 'vuhuuphuc', 'vuhuuphuc@aeon.com.vn', NULL, 28, NULL, 'STAFF', 'Sales Leader', 'G2', '2022-08-26', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (147, '411712', 'Hoàng Việt Thái', 'hoangvietthai', 'hoangvietthai@aeon.com.vn', NULL, 20, NULL, 'SUPERVISOR', 'Store manager', 'G3', '2022-08-26', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (148, '411713', 'Lê Thị Trà My', 'lethitramy', 'lethitramy@aeon.com.vn', NULL, 26, NULL, 'SUPERVISOR', 'Store Manager', 'G3', '2022-08-26', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (149, '411862', 'Nguyễn Đoàn Việt', 'nguyendoanviet', 'nguyendoanviet@aeon.com.vn', NULL, 21, NULL, 'STAFF', 'General Staff', 'G1', '2022-09-10', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (150, '411956', 'Vũ Thị Mai', 'vuthimai', 'vuthimai@aeon.com.vn', NULL, NULL, 7, 'STAFF', 'Store Manager', 'G2', '2022-09-26', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (151, '411963', 'Ma Quỳnh Hương', 'maquynhhuong', 'maquynhhuong@aeon.com.vn', NULL, 9, NULL, 'STAFF', 'General staff', 'G1', '2023-01-30', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (152, '411985', 'Nguyễn Thị Thu', 'nguyenthithu', 'nguyenthithu@aeon.com.vn', NULL, 10, NULL, 'STAFF', 'General staff', 'G1', '2022-09-26', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (153, '412034', 'Hoàng Khánh Linh', 'hoangkhanhlinh', 'hoangkhanhlinh@aeon.com.vn', NULL, 4, NULL, 'STAFF', 'Sales Leader', 'G2', '2022-10-03', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (154, '412035', 'Hoàng Thị Thu Quyên', 'hoangthithuquyen', 'hoangthithuquyen@aeon.com.vn', NULL, 10, NULL, 'STAFF', 'General staff', 'G1', '2022-10-03', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (155, '412078', 'Nguyễn Xuân Bắc', 'nguyenxuanbac', 'nguyenxuanbac@aeon.com.vn', NULL, 16, NULL, 'STAFF', 'General staff', 'G1', '2022-10-10', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (156, '412135', 'Đỗ Thị Hương Giang', 'dothihuonggiang', 'dothihuonggiang@aeon.com.vn', NULL, 7, NULL, 'SUPERVISOR', 'Store Manager', 'G3', '2022-10-17', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (157, '412136', 'Hoàng Mạnh Linh', 'hoangmanhlinh', 'hoangmanhlinh@aeon.com.vn', NULL, 10, NULL, 'STAFF', 'Sales Leader', 'G2', '2022-10-17', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (158, '412137', 'Trần Nam Thái', 'trannamthai', 'trannamthai@aeon.com.vn', NULL, 13, NULL, 'SUPERVISOR', 'Store Manager', 'G3', '2022-10-17', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (159, '412161', 'Đinh Thị Hường', 'dinhthihuong', 'dinhthihuong@aeon.com.vn', NULL, 14, NULL, 'STAFF', 'General staff', 'G1', '2022-10-26', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (160, '412325', 'Đào Thu Hiền', 'daothuhien', 'daothuhien@aeon.com.vn', NULL, 28, NULL, 'STAFF', 'General staff', 'G1', '2022-11-10', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (161, '412327', 'Nguyễn Huệ Linh', 'nguyenhuelinh', 'nguyenhuelinh@aeon.com.vn', NULL, 18, NULL, 'STAFF', 'General Staff', 'G1', '2023-06-26', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (162, '412334', 'Phó Thị Thùy Dương', 'phothithuyduong', 'phothithuyduong@aeon.com.vn', NULL, 11, NULL, 'STAFF', 'General Staff', 'G1', '2023-09-11', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (163, '412487', 'Nguyễn Thị Len', 'nguyenthilen', 'nguyenthilen@aeon.com.vn', NULL, 13, NULL, 'STAFF', 'General staff', 'G1', '2022-11-22', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (164, '412489', 'Đào Thị Xuân', 'daothixuan', 'daothixuan@aeon.com.vn', NULL, 24, NULL, 'STAFF', 'General staff', 'G1', '2024-01-27', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (165, '412534', 'Nguyễn Minh Hằng', 'nguyenminhhang', 'nguyenminhhang@aeon.com.vn', NULL, NULL, 7, 'STAFF', 'Sales Leader', 'G1', '2023-01-30', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (166, '412667', 'Nguyễn Minh Thư', 'nguyenminhthu', 'nguyenminhthu@aeon.com.vn', NULL, 26, NULL, 'STAFF', 'General staff', 'G1', '2022-12-10', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (167, '412749', 'Nguyễn Văn Trung', 'nguyenvantrung22', 'nguyenvantrung22@aeon.com.vn', NULL, 16, NULL, 'STAFF', 'General staff', 'G1', '2022-12-19', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (168, '412787', 'Trần Tuyết Mai', 'trantuyetmai', 'trantuyetmai@aeon.com.vn', NULL, 5, NULL, 'STAFF', 'General Staff', 'G1', '2023-03-10', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (169, '412851', 'Trần Quang Duy', 'tranquangduy', 'tranquangduy@aeon.com.vn', NULL, 20, NULL, 'STAFF', 'General staff', 'G1', '2024-03-19', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (170, '413545', 'Vũ Thanh Lam', 'vuthanhlam', 'vuthanhlam@aeon.com.vn', NULL, 16, NULL, 'STAFF', 'General staff', 'G1', '2023-02-10', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (171, '413547', 'Nguyễn Thanh Ngân', 'nguyenthanhngan', 'nguyenthanhngan@aeon.com.vn', NULL, 16, NULL, 'STAFF', 'General staff', 'G1', '2023-02-10', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (172, '413618', 'Cam Văn Thái', 'camvanthai', 'camvanthai@aeon.com.vn', NULL, 12, NULL, 'STAFF', 'General staff', 'G1', '2023-02-27', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (173, '413627', 'Hồ Thị Phương Hoa', 'hothiphuonghoa', 'hothiphuonghoa@aeon.com.vn', NULL, 10, NULL, 'STAFF', 'General staff', 'G1', '2023-03-27', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (174, '413714', 'Tạ Thu Thảo', 'tathuthao', 'tathuthao@aeon.com.vn', NULL, 6, NULL, 'STAFF', 'Sales Leader', 'G2', '2023-03-20', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (175, '413729', 'Bùi Thị Kim Anh', 'buithikimanh', 'buithikimanh@aeon.com.vn', NULL, 10, NULL, 'STAFF', 'General staff', 'G1', '2023-03-27', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (176, '413732', 'Nguyễn Thế Thành', 'nguyenthethanh', 'nguyenthethanh@aeon.com.vn', NULL, 2, NULL, 'STAFF', 'General staff', 'G1', '2023-03-27', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (177, '413740', 'Nguyễn Thị Lan Anh', 'nguyenthilananh', 'nguyenthilananh@aeon.com.vn', NULL, 6, NULL, 'SUPERVISOR', 'Store Manager', 'G3', '2023-03-27', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (178, '413825', 'Nguyễn Phương Anh', 'nguyenphuonganh', 'nguyenphuonganh@aeon.com.vn', NULL, 6, NULL, 'STAFF', 'General Staff', 'G1', '2023-04-10', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (179, '413882', 'Hoàng Thị Hoa', 'hoangthihoa', 'hoangthihoa@aeon.com.vn', NULL, 20, NULL, 'STAFF', 'General staff', 'G1', '2023-04-21', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (180, '413943', 'Đàm Thu Trang', 'damthutrang', 'damthutrang@aeon.com.vn', NULL, 27, NULL, 'STAFF', 'General staff', 'G1', '2023-05-10', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (181, '414028', 'Trử Thị Lan Anh', 'truthilananh', 'truthilananh@aeon.com.vn', NULL, 2, NULL, 'STAFF', 'General staff', 'G1', '2023-05-26', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (182, '414036', 'Nguyễn Hải Châu', 'nguyenhaichau', 'nguyenhaichau@aeon.com.vn', NULL, 20, NULL, 'STAFF', 'General staff', 'G1', '2023-05-26', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (183, '414357', 'Bùi Đức Lợi', 'buiducloi', 'buiducloi@aeon.com.vn', NULL, 12, NULL, 'STAFF', 'General staff', 'G1', '2023-06-26', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (184, '414438', 'Nguyễn Hoàng Khánh Linh', 'nguyenhoangkhanhlinh', 'nguyenhoangkhanhlinh@aeon.com.vn', NULL, 13, NULL, 'STAFF', 'General staff', 'G1', '2023-07-10', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (185, '414566', 'Tạ Minh Huyền', 'taminhhuyen', 'taminhhuyen@aeon.com.vn', NULL, 28, NULL, 'STAFF', 'General staff', 'G1', '2023-07-26', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (186, '414604', 'Nguyễn Công Hiếu', 'nguyenconghieu', 'nguyenconghieu@aeon.com.vn', NULL, 10, NULL, 'STAFF', 'General staff', 'G1', '2023-08-07', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (187, '414758', 'Lê Ngọc Huyền', 'lengochuyen', 'lengochuyen@aeon.com.vn', NULL, 7, NULL, 'STAFF', 'General staff', 'G1', '2023-08-26', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (188, '414766', 'Nguyễn Thùy Linh', 'nguyenthuylinh23', 'nguyenthuylinh23@aeon.com.vn', NULL, 3, NULL, 'STAFF', 'General Staff', 'G1', '2023-08-26', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (189, '414768', 'Trịnh Minh Phượng', 'trinhminhphuong', 'trinhminhphuong@aeon.com.vn', NULL, 27, NULL, 'STAFF', 'General staff', 'G1', '2023-08-26', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (190, '414882', 'Bùi Thanh Thủy', 'buithanhthuy', 'buithanhthuy@aeon.com.vn', NULL, 13, NULL, 'STAFF', 'General staff', 'G1', '2023-09-11', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (191, '414887', 'Đỗ Hữu Quang', 'dohuuquang', 'dohuuquang@aeon.com.vn', NULL, 7, NULL, 'STAFF', 'General staff', 'G1', '2023-09-11', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (192, '414892', 'Bùi Tiến Thành', 'buitienthanh', 'buitienthanh@aeon.com.vn', NULL, 25, NULL, 'STAFF', 'General staff', 'G1', '2023-09-11', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (193, '414899', 'Nguyễn Thị Tú Anh', 'nguyenthituanh', 'nguyenthituanh@aeon.com.vn', NULL, 27, NULL, 'STAFF', 'General staff', 'G1', '2023-09-11', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (194, '414995', 'Tạ Thị Huyên', 'tathihuyen', 'tathihuyen@aeon.com.vn', NULL, 8, NULL, 'STAFF', 'General staff', 'G1', '2023-09-26', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (195, '414997', 'Nguyễn Ngọc Tuấn', 'nguyenngoctuan', 'nguyenngoctuan@aeon.com.vn', NULL, 19, NULL, 'STAFF', 'General Staff', 'G1', '2023-09-26', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (196, '415071', 'Nguyễn Đức Anh', 'nguyenducanh', 'nguyenducanh@aeon.com.vn', NULL, 25, NULL, 'STAFF', 'General staff', 'G1', '2023-10-10', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (197, '415088', 'Điện Trung Hiếu', 'dientrunghieu', 'dientrunghieu@aeon.com.vn', NULL, 18, NULL, 'STAFF', 'General Staff', 'G1', '2023-10-10', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (198, '415165', 'Vũ Thị Hải Linh', 'vuthihailinh', 'vuthihailinh@aeon.com.vn', NULL, 16, NULL, 'STAFF', 'General staff', 'G1', '2023-10-26', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (199, '415229', 'Trần Đức Khánh', 'tranduckhanh', 'tranduckhanh@aeon.com.vn', NULL, 23, NULL, 'STAFF', 'General Staff', 'G1', '2024-09-27', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (200, '415231', 'Nguyễn Thị Thu Hồng', 'nguyenthithuhong', 'nguyenthithuhong@aeon.com.vn', NULL, 17, NULL, 'STAFF', 'General staff', 'G1', '2023-11-10', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (201, '415233', 'Đinh Thị Mai', 'dinhthimai', 'dinhthimai@aeon.com.vn', NULL, 17, NULL, 'STAFF', 'General staff', 'G1', '2024-10-28', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (202, '415335', 'Trương Thị Ngọc Ánh', 'truongthingocanh', 'truongthingocanh@aeon.com.vn', NULL, 28, NULL, 'STAFF', 'General staff', 'G1', '2023-11-27', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (203, '415437', 'Nguyễn Tiến Hùng', 'nguyentienhung', 'nguyentienhung@aeon.com.vn', NULL, 11, NULL, 'STAFF', 'General Staff', 'G1', '2023-12-11', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (204, '415438', 'Nguyễn Thị Thu Huyền', 'nguyenthithuhuyen23', 'nguyenthithuhuyen23@aeon.com.vn', NULL, 3, NULL, 'STAFF', 'General Staff', 'G1', '2023-12-11', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (205, '415539', 'Nguyễn Thế Gia Huy', 'nguyenthegiahuy', 'nguyenthegiahuy@aeon.com.vn', NULL, 12, NULL, 'STAFF', 'General staff', 'G1', '2024-11-27', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (206, '415542', 'Lê Thị Thu Nga', 'lethithunga', 'lethithunga@aeon.com.vn', NULL, 5, NULL, 'STAFF', 'General Staff', 'G1', '2025-11-07', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (207, '415621', 'Nguyễn Thị Hoàng Lan', 'nguyenthihoanglan', 'nguyenthihoanglan@aeon.com.vn', NULL, 26, NULL, 'STAFF', 'General staff', 'G1', '2024-01-08', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (208, '416733', 'Đỗ Mạnh Đạt', 'domanhdat', 'domanhdat@aeon.com.vn', NULL, 15, NULL, 'STAFF', 'General Staff', 'G1', '2024-03-19', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (209, '416734', 'Phạm Thị Thanh', 'phamthithanh', 'phamthithanh@aeon.com.vn', NULL, 24, NULL, 'STAFF', 'General staff', 'G1', '2024-03-19', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (210, '416735', 'Nguyễn Hải Yến', 'nguyenhaiyen', 'nguyenhaiyen@aeon.com.vn', NULL, 3, NULL, 'STAFF', 'General Staff', 'G1', '2024-07-27', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (211, '416832', 'Đỗ Quang Huy', 'doquanghuy', 'doquanghuy@aeon.com.vn', NULL, 1, NULL, 'SUPERVISOR', 'Store Manager', 'G3', '2024-04-08', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (212, '416840', 'Phạm Hương Giang', 'phamhuonggiang', 'phamhuonggiang@aeon.com.vn', NULL, 27, NULL, 'STAFF', 'General staff', 'G1', '2024-04-08', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (213, '416875', 'Nguyễn Thị Ánh Nguyệt', 'nguyenthianhnguyet', 'nguyenthianhnguyet@aeon.com.vn', NULL, 22, NULL, 'STAFF', 'General Staff', 'G1', '2024-04-12', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (214, '417158', 'Đỗ Thu Hà', 'dothuha', 'dothuha@aeon.com.vn', NULL, 14, NULL, 'STAFF', 'General staff', 'G1', '2024-05-27', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (215, '417221', 'Nguyễn Thanh Huyền', 'nguyenthanhhuyen', 'nguyenthanhhuyen@aeon.com.vn', NULL, 26, NULL, 'STAFF', 'General staff', 'G1', '2024-06-07', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (216, '417224', 'Đinh Thị Hoà', 'dinhthihoa', 'dinhthihoa@aeon.com.vn', NULL, 10, NULL, 'STAFF', 'General staff', 'G1', '2024-06-07', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (217, '417407', 'Đặng Thị Vân', 'dangthivan', 'dangthivan@aeon.com.vn', NULL, 15, NULL, 'STAFF', 'General Staff', 'G1', '2024-07-08', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (218, '417409', 'Nguyễn Thị Thuỳ', 'nguyenthithuy24', 'nguyenthithuy24@aeon.com.vn', NULL, 22, NULL, 'STAFF', 'General Staff', 'G1', '2024-07-08', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (219, '417413', 'Trịnh Thị Bảo Khanh', 'trinhthibaokhanh', 'trinhthibaokhanh@aeon.com.vn', NULL, 20, NULL, 'STAFF', 'General staff', 'G1', '2024-07-08', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (220, '417414', 'Đoàn Văn Quân', 'doanvanquan', 'doanvanquan@aeon.com.vn', NULL, 17, NULL, 'STAFF', 'General staff', 'G1', '2024-07-08', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (221, '417639', 'Nguyễn Thế Châm', 'nguyenthecham', 'nguyenthecham@aeon.com.vn', NULL, 7, NULL, 'STAFF', 'General staff', 'G1', '2024-07-19', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (222, '417642', 'Nguyễn Thị Hảo', 'nguyenthihao', 'nguyenthihao@aeon.com.vn', NULL, 23, NULL, 'STAFF', 'General Staff', 'G1', '2024-07-19', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (223, '417748', 'Nguyễn Thị Huyền', 'nguyenthihuyen24', 'nguyenthihuyen24@aeon.com.vn', NULL, 22, NULL, 'STAFF', 'General Staff', 'G1', '2024-07-27', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (224, '418045', 'Nguyễn Thị Lan Anh', 'nguyenthilananh24', 'nguyenthilananh24@aeon.com.vn', NULL, 23, NULL, 'STAFF', 'General Staff', 'G1', '2024-07-29', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (225, '418293', 'Vũ Thị Bích Quyên', 'vuthibichquyen', 'vuthibichquyen@aeon.com.vn', NULL, 24, NULL, 'SUPERVISOR', 'Store Manager', 'G3', '2024-08-07', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (226, '418337', 'Nguyễn Lan Anh', 'nguyenlananh', 'nguyenlananh@aeon.com.vn', NULL, 13, NULL, 'STAFF', 'General staff', 'G1', '2024-08-07', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (227, '418338', 'Đỗ Thị Thảo', 'dothithao', 'dothithao@aeon.com.vn', NULL, 16, NULL, 'STAFF', 'General staff', 'G1', '2024-08-07', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (228, '418340', 'Chử Khánh An', 'chukhanhan', 'chukhanhan@aeon.com.vn', NULL, 8, NULL, 'STAFF', 'General staff', 'G1', '2024-08-07', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (229, '418440', 'Nguyễn Thị Hồng Phượng', 'nguyenthihongphuong', 'nguyenthihongphuong@aeon.com.vn', NULL, 22, NULL, 'STAFF', 'General Staff', 'G1', '2024-08-19', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (230, '418452', 'Phan Trường Sơn', 'phantruongson', 'phantruongson@aeon.com.vn', NULL, 26, NULL, 'STAFF', 'General staff', 'G1', '2025-02-27', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (231, '418570', 'Phan Thị Trang', 'phanthitrang', 'phanthitrang@aeon.com.vn', NULL, 9, NULL, 'STAFF', 'General staff', 'G1', '2024-08-27', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (232, '418573', 'Bùi Thị Linh', 'buithilinh', 'buithilinh@aeon.com.vn', NULL, 4, NULL, 'STAFF', 'General Staff', 'G1', '2024-08-27', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (233, '418776', 'Nguyễn Trọng Nam', 'nguyentrongnam', 'nguyentrongnam@aeon.com.vn', NULL, 9, NULL, 'STAFF', 'General staff', 'G1', '2024-09-19', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (234, '418983', 'Trần Bích Ngọc', 'tranbichngoc', 'tranbichngoc@aeon.com.vn', NULL, 4, NULL, 'STAFF', 'General Staff', 'G1', '2024-09-27', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (235, '419112', 'Phạm Thị Quyên', 'phamthiquyen', 'phamthiquyen@aeon.com.vn', NULL, 2, NULL, 'STAFF', 'General staff', 'G1', '2024-10-07', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (236, '419113', 'Nguyễn Đức Việt', 'nguyenducviet', 'nguyenducviet@aeon.com.vn', NULL, 23, NULL, 'STAFF', 'General Staff', 'G1', '2024-10-07', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (237, '419114', 'Nguyễn Thanh Loan', 'nguyenthanhloan', 'nguyenthanhloan@aeon.com.vn', NULL, 19, NULL, 'STAFF', 'General Staff', 'G1', '2024-10-07', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (238, '419117', 'Nguyễn Thị Thu Trang', 'nguyenthithutrang', 'nguyenthithutrang@aeon.com.vn', NULL, 19, NULL, 'STAFF', 'General Staff', 'G1', '2024-10-07', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (239, '419118', 'Trần Thị Kim Linh', 'tranthikimlinh', 'tranthikimlinh@aeon.com.vn', NULL, 4, NULL, 'STAFF', 'General Staff', 'G1', '2024-10-07', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (240, '419168', 'Nguyễn Thị Hải Yến', 'nguyenthihaiyen', 'nguyenthihaiyen@aeon.com.vn', NULL, 19, NULL, 'STAFF', 'General Staff', 'G1', '2024-10-10', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (241, '419172', 'Nguyễn Thị Thanh Thủy', 'nguyenthithanhthuy', 'nguyenthithanhthuy@aeon.com.vn', NULL, 2, NULL, 'STAFF', 'General staff', 'G1', '2025-02-27', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (242, '419173', 'Nguyễn Hương Quỳnh', 'nguyenhuongquynh', 'nguyenhuongquynh@aeon.com.vn', NULL, 18, NULL, 'STAFF', 'General Staff', 'G1', '2025-02-27', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (243, '419218', 'Vũ Mai Phương', 'vumaiphuong', 'vumaiphuong@aeon.com.vn', NULL, 25, NULL, 'STAFF', 'General staff', 'G1', '2024-10-19', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (244, '419349', 'Lê Thị Thu Trang', 'lethithutrang', 'lethithutrang@aeon.com.vn', NULL, 22, NULL, 'STAFF', 'General Staff', 'G1', '2024-10-28', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (245, '419354', 'Nguyễn Thương Thảo', 'nguyenthuongthao', 'nguyenthuongthao@aeon.com.vn', NULL, 11, NULL, 'STAFF', 'General Staff', 'G1', '2024-10-28', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (246, '419355', 'Phạm Ngọc Hân', 'phamngochan', 'phamngochan@aeon.com.vn', NULL, 11, NULL, 'STAFF', 'General Staff', 'G1', '2024-10-28', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (247, '419516', 'Bùi Vũ Đức Duy', 'buivuducduy', 'buivuducduy@aeon.com.vn', NULL, 28, NULL, 'STAFF', 'General staff', 'G1', '2024-11-19', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (248, '419782', 'Nguyễn Thị Trang', 'nguyenthitrang24', 'nguyenthitrang24@aeon.com.vn', NULL, 21, NULL, 'STAFF', 'Sales Leader', 'G2', '2024-12-09', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (249, '419799', 'Ngô Thị Linh', 'ngothilinh', 'ngothilinh@aeon.com.vn', NULL, 3, NULL, 'STAFF', 'General Staff', 'G1', '2024-12-09', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (250, '420006', 'Nguyễn Thị Minh Anh', 'nguyenthiminhanh', 'nguyenthiminhanh@aeon.com.vn', NULL, 16, NULL, 'STAFF', 'General staff', 'G1', '2025-08-23', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (251, '420380', 'Nguyễn Thị Kim Phượng', 'nguyenthikimphuong', 'nguyenthikimphuong@aeon.com.vn', NULL, 16, NULL, 'SUPERVISOR', 'Store manager', 'G3', '2025-01-07', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (252, '420857', 'Nông Thị Thu Hường', 'nongthithuhuong', 'nongthithuhuong@aeon.com.vn', NULL, 20, NULL, 'STAFF', 'General staff', 'G1', '2025-11-07', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (253, '420932', 'Nguyễn Mạnh Đức', 'nguyenmanhduc', 'nguyenmanhduc@aeon.com.vn', NULL, 28, NULL, 'STAFF', 'General staff', 'G1', '2025-02-07', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (254, '420933', 'Nguyễn Thị Trang Nhung', 'nguyenthitrangnhung', 'nguyenthitrangnhung@aeon.com.vn', NULL, 27, NULL, 'STAFF', 'General staff', 'G1', '2025-02-07', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (255, '420937', 'Trần Thị Bích Ngọc', 'tranthibichngoc', 'tranthibichngoc@aeon.com.vn', NULL, 3, NULL, 'STAFF', 'General Staff', 'G1', '2025-05-27', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (256, '420950', 'Phạm Thị Thu Thảo', 'phamthithuthao', 'phamthithuthao@aeon.com.vn', NULL, 18, NULL, 'STAFF', 'General Staff', 'G1', '2025-02-17', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (257, '420953', 'Ngô Thị Thu Hà', 'ngothithuha', 'ngothithuha@aeon.com.vn', NULL, 18, NULL, 'STAFF', 'General Staff', 'G1', '2025-02-17', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (258, '420958', 'Lê Thùy Uyên', 'lethuyuyen', 'lethuyuyen@aeon.com.vn', NULL, 9, NULL, 'STAFF', 'General staff', 'G1', '2025-02-17', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (259, '420999', 'Nguyễn Thị Minh Huyền', 'nguyenthiminhhuyen', 'nguyenthiminhhuyen@aeon.com.vn', NULL, 5, NULL, 'STAFF', 'Sales Leader', 'G2', '2025-02-27', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (260, '421002', 'Đinh Thị Thăng', 'dinhthithang', 'dinhthithang@aeon.com.vn', NULL, 18, NULL, 'STAFF', 'General Staff', 'G1', '2025-02-27', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (261, '421003', 'Đào Thị Trang', 'daothitrang', 'daothitrang@aeon.com.vn', NULL, 18, NULL, 'STAFF', 'General Staff', 'G1', '2025-02-27', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (262, '421004', 'Nguyễn Thu Hà', 'nguyenthuha', 'nguyenthuha@aeon.com.vn', NULL, 22, NULL, 'STAFF', 'General Staff', 'G1', '2025-02-27', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (263, '421006', 'Nguyễn Hồng Sơn', 'nguyenhongson', 'nguyenhongson@aeon.com.vn', NULL, 11, NULL, 'STAFF', 'General Staff', 'G1', '2025-02-27', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (264, '421045', 'Mai Nguyễn Quang Anh', 'mainguyenquanganh', 'mainguyenquanganh@aeon.com.vn', NULL, 21, NULL, 'STAFF', 'General Staff', 'G1', '2025-02-28', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (265, '421048', 'Bùi Phương Thảo', 'buiphuongthao25', 'buiphuongthao25@aeon.com.vn', NULL, 21, NULL, 'STAFF', 'General Staff', 'G1', '2025-02-28', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (266, '421063', 'Nguyễn Thanh Hiền', 'nguyenthanhhien', 'nguyenthanhhien@aeon.com.vn', NULL, 22, NULL, 'STAFF', 'General Staff', 'G1', '2025-03-07', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (267, '421126', 'Tạ Minh Anh', 'taminhanh', 'taminhanh@aeon.com.vn', NULL, 8, NULL, 'STAFF', 'General staff', 'G1', '2025-03-17', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (268, '421238', 'Nguyễn Thị Huyền', 'nguyenthihuyen25', 'nguyenthihuyen25@aeon.com.vn', NULL, 25, NULL, 'STAFF', 'General staff', 'G1', '2025-04-08', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (269, '421239', 'Trịnh Thị Hương', 'trinhthihuong', 'trinhthihuong@aeon.com.vn', NULL, 25, NULL, 'STAFF', 'General staff', 'G1', '2025-04-08', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (270, '421241', 'Nhâm Thúy Quỳnh', 'nhamthuyquynh', 'nhamthuyquynh@aeon.com.vn', NULL, 4, NULL, 'STAFF', 'General staff', 'G1', '2025-04-08', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (271, '421278', 'Nguyễn Ngọc Huyền', 'nguyenngochuyen', 'nguyenngochuyen@aeon.com.vn', NULL, 5, NULL, 'STAFF', 'General Staff', 'G1', '2025-04-17', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (272, '421281', 'Đào Ngọc Mai', 'daongocmai', 'daongocmai@aeon.com.vn', NULL, 23, NULL, 'STAFF', 'General Staff', 'G1', '2025-04-17', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (273, '421282', 'Phạm Quang Toàn', 'phamquangtoan', 'phamquangtoan@aeon.com.vn', NULL, 7, NULL, 'STAFF', 'General staff', 'G1', '2025-04-17', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (274, '421283', 'Trần Lê Việt', 'tranleviet', 'tranleviet@aeon.com.vn', NULL, 3, NULL, 'SUPERVISOR', 'Store manager', 'G3', '2025-04-17', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (275, '421302', 'Nguyễn Thị Thư', 'nguyenthithu25', 'nguyenthithu25@aeon.com.vn', NULL, 15, NULL, 'STAFF', 'General Staff', 'G1', '2025-08-23', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (276, '421348', 'Kiều Xuân Huỳnh', 'kieuxuanhuynh', 'kieuxuanhuynh@aeon.com.vn', NULL, 10, NULL, 'STAFF', 'General staff', 'G1', '2025-05-07', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (277, '421352', 'Nguyễn Ngọc Vân', 'nguyenngocvan', 'nguyenngocvan@aeon.com.vn', NULL, 5, NULL, 'STAFF', 'General Staff', 'G1', '2025-05-07', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (278, '421353', 'Đỗ Thị Hồng Điệp', 'dothihongdiep', 'dothihongdiep@aeon.com.vn', NULL, 11, NULL, 'STAFF', 'General Staff', 'G1', '2025-05-07', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (279, '421359', 'Nguyễn Thị Lan Anh', 'nguyenthilananh25', 'nguyenthilananh25@aeon.com.vn', NULL, 5, NULL, 'STAFF', 'General Staff', 'G1', '2025-05-12', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (280, '421396', 'Cát Ngọc Phương', 'catngocphuong', 'catngocphuong@aeon.com.vn', NULL, 1, NULL, 'STAFF', 'Sales Leader', 'G2', '2025-05-17', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (281, '421454', 'Phạm Thúy Hạnh', 'phamthuyhanh', 'phamthuyhanh@aeon.com.vn', NULL, 5, NULL, 'STAFF', 'General Staff', 'G1', '2025-05-27', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (282, '421456', 'Nguyễn Hà Phương', 'nguyenhaphuong', 'nguyenhaphuong@aeon.com.vn', NULL, 5, NULL, 'STAFF', 'General Staff', 'G1', '2025-05-27', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (283, '421458', 'Nguyễn Thị Thanh Chúc', 'nguyenthithanhchuc', 'nguyenthithanhchuc@aeon.com.vn', NULL, 2, NULL, 'STAFF', 'General staff', 'G1', '2025-05-27', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (284, '421470', 'Nguyễn Thị Thu Thủy', 'nguyenthithuthuy', 'nguyenthithuthuy@aeon.com.vn', NULL, 14, NULL, 'STAFF', 'General staff', 'G1', '2025-05-27', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (285, '421525', 'Nguyễn Hồng Anh', 'nguyenhonganh', 'nguyenhonganh@aeon.com.vn', NULL, 1, NULL, 'STAFF', 'General Staff', 'G1', '2025-11-27', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (286, '421533', 'Nguyễn Thị Việt Chinh', 'nguyenthivietchinh', 'nguyenthivietchinh@aeon.com.vn', NULL, 9, NULL, 'STAFF', 'General staff', 'G1', '2025-06-07', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (287, '421536', 'Lê Vũ Hương', 'levuhuong', 'levuhuong@aeon.com.vn', NULL, 3, NULL, 'STAFF', 'General Staff', 'G1', '2025-06-07', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (288, '421538', 'Trần Phương Thảo', 'tranphuongthao', 'tranphuongthao@aeon.com.vn', NULL, 11, NULL, 'STAFF', 'General Staff', 'G1', '2025-06-07', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (289, '421618', 'Đàm Thị Thúy Quỳnh', 'damthithuyquynh', 'damthithuyquynh@aeon.com.vn', NULL, 17, NULL, 'STAFF', 'General staff', 'G1', '2025-06-17', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (290, '421647', 'Trang Thị Tường Vân', 'trangthituongvan', 'trangthituongvan@aeon.com.vn', NULL, 17, NULL, 'STAFF', 'General staff', 'G1', '2025-06-27', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (291, '421691', 'Nguyễn Thị Mai', 'nguyenthimai25', 'nguyenthimai25@aeon.com.vn', NULL, NULL, 7, 'STAFF', 'Sales Leader', 'G2', '2025-07-07', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (292, '421714', 'Lý Thị Hồng Hảo', 'lythihonghao', 'lythihonghao@aeon.com.vn', NULL, 4, NULL, 'STAFF', 'General Staff', 'G1', '2025-07-07', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (293, '421725', 'Nguyễn Xuân Hợp', 'nguyenxuanhop', 'nguyenxuanhop@aeon.com.vn', NULL, 14, NULL, 'STAFF', 'General staff', 'G1', '2025-07-07', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (294, '421822', 'Phạm Lê Nhật Minh', 'phamlenhatminh', 'phamlenhatminh@aeon.com.vn', NULL, 6, NULL, 'STAFF', 'General Staff', 'G1', '2025-07-17', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (295, '421824', 'Lý Văn Tú', 'lyvantu', 'lyvantu@aeon.com.vn', NULL, 3, NULL, 'STAFF', 'General Staff', 'G1', '2025-07-17', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (296, '421843', 'Trần Kim Cúc', 'trankimcuc', 'trankimcuc@aeon.com.vn', NULL, 9, NULL, 'STAFF', 'Sales Leader', 'G2', '2025-07-28', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (297, '421868', 'Dương Chấn Hưng', 'duongchanhung', 'duongchanhung@aeon.com.vn', NULL, 14, NULL, 'STAFF', 'General staff', 'G1', '2025-07-28', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (298, '421874', 'Phạm Thị Thuyên', 'phamthithuyen', 'phamthithuyen@aeon.com.vn', NULL, 6, NULL, 'STAFF', 'General Staff', 'G1', '2025-07-28', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (299, '421876', 'Nguyễn Minh Trang', 'nguyenminhtrang', 'nguyenminhtrang@aeon.com.vn', NULL, 6, NULL, 'STAFF', 'General Staff', 'G1', '2025-07-28', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (300, '422268', 'Quàng Thị Ly', 'quangthily', 'quangthily@aeon.com.vn', NULL, 6, NULL, 'STAFF', 'General Staff', 'G1', '2025-08-07', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (301, '422373', 'Phạm Thị Mến', 'phamthimen', 'phamthimen@aeon.com.vn', NULL, 4, NULL, 'STAFF', 'General Staff', 'G1', '2025-08-18', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (302, '422472', 'Đặng Nguyễn Thảo Vi', 'dangnguyenthaovi', 'dangnguyenthaovi@aeon.com.vn', NULL, 6, NULL, 'STAFF', 'General Staff', 'G1', '2025-08-23', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (303, '422476', 'Đặng Thị Ngọc Ánh', 'dangthingocanh', 'dangthingocanh@aeon.com.vn', NULL, 26, NULL, 'STAFF', 'General staff', 'G1', '2025-08-23', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (304, '422628', 'Nguyễn Thị Huyền Trang', 'nguyenthihuyentrang', 'nguyenthihuyentrang@aeon.com.vn', NULL, 19, NULL, 'STAFF', 'General Staff', 'G1', '2025-09-08', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (305, '422850', 'Nguyễn Thuỳ Trang', 'nguyenthuytrang', 'nguyenthuytrang@aeon.com.vn', NULL, 21, NULL, 'STAFF', 'General Staff', 'G1', '2025-09-17', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (306, '422883', 'Nguyễn Thị Thanh Hậu', 'nguyenthithanhhau', 'nguyenthithanhhau@aeon.com.vn', NULL, 20, NULL, 'STAFF', 'General staff', 'G1', '2025-11-07', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (307, '422969', 'Vũ Anh Đức', 'vuanhduc', 'vuanhduc@aeon.com.vn', NULL, 1, NULL, 'STAFF', 'General Staff', 'G1', '2025-11-17', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (308, '422985', 'Lê Thái Bình', 'lethaibinh', 'lethaibinh@aeon.com.vn', NULL, 14, NULL, 'STAFF', 'General staff', 'G1', '2025-09-27', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (309, '422987', 'Nguyễn Thị Nguyệt', 'nguyenthinguyet', 'nguyenthinguyet@aeon.com.vn', NULL, 24, NULL, 'STAFF', 'General staff', 'G1', '2025-09-27', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (310, '422992', 'Dương Quang Nhật', 'duongquangnhat', 'duongquangnhat@aeon.com.vn', NULL, 15, NULL, 'STAFF', 'General Staff', 'G1', '2025-09-27', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (311, '423175', 'Nguyễn Thị Xuân Mai', 'nguyenthixuanmai', 'nguyenthixuanmai@aeon.com.vn', NULL, 14, NULL, 'STAFF', 'General staff', 'G1', '2025-10-08', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (312, '423375', 'Phạm Thị Nhung', 'phamthinhung', 'phamthinhung@aeon.com.vn', NULL, NULL, 7, 'STAFF', 'Sales Leader', 'G2', '2025-11-07', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (313, '423413', 'Nguyễn Tiến Đạt', 'nguyentiendat25', 'nguyentiendat25@aeon.com.vn', NULL, 18, NULL, 'STAFF', 'General Staff', 'G1', '2025-11-07', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (314, '423557', 'Nguyễn Hồng Hạnh', 'nguyenhonghanh25', 'nguyenhonghanh25@aeon.com.vn', NULL, 22, NULL, 'STAFF', 'General Staff', 'G1', '2025-11-17', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (315, '423608', 'Nguyễn Thị Ly', 'nguyenthily', 'nguyenthily@aeon.com.vn', NULL, 1, NULL, 'STAFF', 'General Staff', 'G1', '2025-11-17', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (316, '423769', 'Phạm Thị Thanh Hồng', 'phamthithanhhong', 'phamthithanhhong@aeon.com.vn', NULL, 15, NULL, 'STAFF', 'General Staff', 'G1', '2025-12-08', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (317, '423775', 'Mai Tiến Dũng', 'maitiendung', 'maitiendung@aeon.com.vn', NULL, 1, NULL, 'STAFF', 'General Staff', 'G1', '2025-12-08', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (318, '423778', 'Phạm Thị Linh', 'phamthilinh', 'phamthilinh@aeon.com.vn', NULL, NULL, 7, 'SUPERVISOR', 'Store Manager', 'G3', '2025-12-08', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (319, '423786', 'Huỳnh Thị Hồng Nhạn', 'huynhthihongnhan', 'huynhthihongnhan@aeon.com.vn', NULL, 23, NULL, 'STAFF', 'General Staff', 'G1', '2025-12-08', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (320, '423876', 'Nguyễn Thị Ngọc Diệp', 'nguyenthingocdiep', 'nguyenthingocdiep@aeon.com.vn', NULL, 15, NULL, 'STAFF', 'General Staff', 'G1', '2025-12-17', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (321, '423881', 'Nguyễn Thế Hoàng', 'nguyenthehoang', 'nguyenthehoang@aeon.com.vn', NULL, 28, NULL, 'STAFF', 'General staff', 'G1', '2025-12-17', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (322, '423882', 'Lê Hoàng Anh', 'lehoanganh', 'lehoanganh@aeon.com.vn', NULL, 1, NULL, 'STAFF', 'General Staff', 'G1', '2025-12-17', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (323, '423884', 'Võ Thị Xuân Quỳnh', 'vothixuanquynh', 'vothixuanquynh@aeon.com.vn', NULL, 9, NULL, 'STAFF', 'General staff', 'G1', '2025-12-17', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (324, '423969', 'Nguyễn Đặng Hạnh Nguyên', 'nguyendanghanhnguyen', 'nguyendanghanhnguyen@aeon.com.vn', NULL, 26, NULL, 'STAFF', 'General Staff', 'G1', '2025-12-27', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (325, '424068', 'Nguyễn Thị Diễm Hương', 'nguyenthidiemhuong', 'nguyenthidiemhuong@aeon.com.vn', NULL, 15, NULL, 'STAFF', 'General Staff', 'G1', '2026-01-07', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (326, '424107', 'Đào Thu Hương', 'daothuhuong', 'daothuhuong@aeon.com.vn', NULL, 17, NULL, 'STAFF', 'General staff', 'G1', '2026-01-17', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (327, '424108', 'Bùi Thị Anh Thương', 'buithianhthuong', 'buithianhthuong@aeon.com.vn', NULL, 21, NULL, 'STAFF', 'General Staff', 'G1', '2026-01-17', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (328, '424109', 'Đinh Thị Ngọc Thảo', 'dinhthingocthao', 'dinhthingocthao@aeon.com.vn', NULL, 26, NULL, 'STAFF', 'General Staff', 'G1', '2026-01-17', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (329, '424560', 'Nguyễn Đức Hà Sơn', 'nguyenduchason', 'nguyenduchason@aeon.com.vn', NULL, 25, NULL, 'STAFF', 'General staff', 'G1', '2026-01-27', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (330, '424562', 'Nguyễn Thị Lê Na', 'nguyenthilena', 'nguyenthilena@aeon.com.vn', NULL, 26, NULL, 'STAFF', 'General staff', 'G1', '2026-01-27', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (331, '419890', 'Nông Thị Kim Ngọc', 'nongthikimngoc', 'nongthikimngoc@aeon.com.vn', NULL, 27, NULL, 'STAFF', 'Parttime staff', 'G1', '2026-01-17', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (332, '424111', 'Nguyễn Thu Hoài', 'nguyenthuhoai', 'nguyenthuhoai@aeon.com.vn', NULL, 13, NULL, 'STAFF', 'Parttime staff', 'G1', '2026-01-17', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (333, '424536', 'Hạ Thị Thanh', 'hathithanh', 'hathithanh@aeon.com.vn', NULL, 9, NULL, 'STAFF', 'Parttime staff', 'G1', '2026-01-27', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (334, '417638', 'Nguyễn Thu Hương', 'nguyenthuhuong', 'nguyenthuhuong@aeon.com.vn', NULL, 23, NULL, 'STAFF', 'Parttime staff', 'G1', '2024-12-27', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (335, '417745', 'Nguyễn Thị Phương Nhung', 'nguyenthiphuongnhung', 'nguyenthiphuongnhung@aeon.com.vn', NULL, 12, NULL, 'STAFF', 'Parttime staff', 'G1', '2025-08-07', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (336, '419123', 'Nguyễn Thị Hằng', 'nguyenthihang', 'nguyenthihang@aeon.com.vn', NULL, 12, NULL, 'STAFF', 'Parttime staff', 'G1', '2024-12-27', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (337, '419466', 'Bùi Thị Hồng Hạnh', 'buithihonghanh', 'buithihonghanh@aeon.com.vn', NULL, 6, NULL, 'STAFF', 'Parttime staff', 'G1', '2025-10-08', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (338, '419693', 'Dương An Huy', 'duonganhuy', 'duonganhuy@aeon.com.vn', NULL, 7, NULL, 'STAFF', 'Parttime staff', 'G1', '2025-12-17', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (339, '419786', 'Nguyễn Mai Hiên', 'nguyenmaihien', 'nguyenmaihien@aeon.com.vn', NULL, 14, NULL, 'STAFF', 'Parttime staff', 'G1', '2024-12-27', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (340, '419787', 'Bùi Thị Hải Vân', 'buithihaivan', 'buithihaivan@aeon.com.vn', NULL, 28, NULL, 'STAFF', 'Parttime staff', 'G1', '2025-01-07', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (341, '419915', 'Lưu Ngọc Anh Dương', 'luungocanhduong', 'luungocanhduong@aeon.com.vn', NULL, 9, NULL, 'STAFF', 'Parttime staff', 'G1', '2025-12-17', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (342, '420426', 'Vũ Thị Lộc', 'vuthiloc', 'vuthiloc@aeon.com.vn', NULL, 25, NULL, 'STAFF', 'Parttime staff', 'G1', '2025-09-17', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (343, '420974', 'Nguyễn Thị Hà Ly', 'nguyenthihaly', 'nguyenthihaly@aeon.com.vn', NULL, 4, NULL, 'STAFF', 'Parttime staff', 'G1', '2025-02-17', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (344, '421042', 'Vũ Thị Ngọc', 'vuthingoc', 'vuthingoc@aeon.com.vn', NULL, 18, NULL, 'STAFF', 'Parttime staff', 'G1', '2025-02-27', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (345, '421065', 'Hoàng Văn Sáng', 'hoangvansang', 'hoangvansang@aeon.com.vn', NULL, 9, NULL, 'STAFF', 'Parttime staff', 'G1', '2025-03-07', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (346, '421286', 'Phạm Lê Xuân Hương', 'phamlexuanhuong', 'phamlexuanhuong@aeon.com.vn', NULL, 14, NULL, 'STAFF', 'Parttime staff', 'G1', '2025-04-17', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (347, '421351', 'Nguyễn Thị Hải Yến', 'nguyenthihaiyen25', 'nguyenthihaiyen25@aeon.com.vn', NULL, 16, NULL, 'STAFF', 'Parttime staff', 'G1', '2025-09-17', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (348, '421619', 'Đỗ Hồng Dương', 'dohongduong', 'dohongduong@aeon.com.vn', NULL, 3, NULL, 'STAFF', 'Parttime staff', 'G1', '2025-06-17', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (349, '421731', 'Bùi Văn Việt', 'buivanviet', 'buivanviet@aeon.com.vn', NULL, 19, NULL, 'STAFF', 'Parttime staff', 'G1', '2025-07-07', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (350, '421734', 'Bùi Thị Phương Thùy', 'buithiphuongthuy', 'buithiphuongthuy@aeon.com.vn', NULL, 22, NULL, 'STAFF', 'Parttime staff', 'G1', '2025-07-07', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (351, '421818', 'Tăng Duy Anh', 'tangduyanh', 'tangduyanh@aeon.com.vn', NULL, 18, NULL, 'STAFF', 'Parttime staff', 'G1', '2025-07-17', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (352, '422375', 'Đặng Hải Linh', 'danghailinh', 'danghailinh@aeon.com.vn', NULL, 21, NULL, 'STAFF', 'Parttime staff', 'G1', '2025-08-18', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (353, '422469', 'Hoàng Văn Huy', 'hoangvanhuy', 'hoangvanhuy@aeon.com.vn', NULL, 7, NULL, 'STAFF', 'Parttime staff', 'G1', '2025-08-23', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (354, '422470', 'Nguyễn Phương Linh', 'nguyenphuonglinh', 'nguyenphuonglinh@aeon.com.vn', NULL, 7, NULL, 'STAFF', 'Parttime staff', 'G1', '2025-08-23', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (355, '422667', 'Hoàng Anh Văn', 'hoanganhvan', 'hoanganhvan@aeon.com.vn', NULL, 16, NULL, 'STAFF', 'Parttime staff', 'G1', '2025-12-27', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (356, '423256', 'Bùi Lã Mai Anh', 'builamaianh', 'builamaianh@aeon.com.vn', NULL, 8, NULL, 'STAFF', 'Parttime staff', 'G1', '2025-10-17', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (357, '423304', 'Nguyễn Thị Phương Oanh', 'nguyenthiphuongoanh', 'nguyenthiphuongoanh@aeon.com.vn', NULL, 12, NULL, 'STAFF', 'Parttime staff', 'G1', '2025-11-07', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (358, '423305', 'Nguyễn Thái Dương', 'nguyenthaiduong', 'nguyenthaiduong@aeon.com.vn', NULL, 1, NULL, 'STAFF', 'Parttime staff', 'G1', '2025-10-27', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (359, '423307', 'Vũ Thị Hà Vy', 'vuthihavy', 'vuthihavy@aeon.com.vn', NULL, 21, NULL, 'STAFF', 'Parttime staff', 'G1', '2025-10-27', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (360, '423713', 'Nguyễn Hải Yến Nhi', 'nguyenhaiyennhi', 'nguyenhaiyennhi@aeon.com.vn', NULL, 20, NULL, 'STAFF', 'Parttime staff', 'G1', '2025-11-27', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (361, '423889', 'Trần Khánh Lam', 'trankhanhlam', 'trankhanhlam@aeon.com.vn', NULL, 26, NULL, 'STAFF', 'Parttime staff', 'G1', '2025-12-17', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (362, '423890', 'Hoàng Tuấn Kiệt', 'hoangtuankiet', 'hoangtuankiet@aeon.com.vn', NULL, 24, NULL, 'STAFF', 'Parttime staff', 'G1', '2025-12-17', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (363, '423963', 'Trương Thế Lương', 'truongtheluong', 'truongtheluong@aeon.com.vn', NULL, 20, NULL, 'STAFF', 'Parttime staff', 'G1', '2026-01-17', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (364, '423965', 'Lê Minh Quân', 'leminhquan', 'leminhquan@aeon.com.vn', NULL, 15, NULL, 'STAFF', 'Parttime staff', 'G1', '2025-12-27', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (365, '423968', 'Nguyễn Thị  Kim Thoa', 'nguyenthikimthoa', 'nguyenthikimthoa@aeon.com.vn', NULL, 3, NULL, 'STAFF', 'Parttime staff', 'G1', '2025-12-27', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (366, '424110', 'Nguyễn Công Quyền', 'nguyencongquyen', 'nguyencongquyen@aeon.com.vn', NULL, 19, NULL, 'STAFF', 'Parttime staff', 'G1', '2026-01-17', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (367, '424602', 'Nguyễn Xuân Minh Phú', 'nguyenxuanminhphu', 'nguyenxuanminhphu@aeon.com.vn', NULL, 1, NULL, 'STAFF', 'Parttime staff', 'G1', '2026-01-29', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (368, 'HQ001', 'Yoshinaga Shinichi', 'yoshinaga', 'yoshinaga@aeon.com.vn', '0901234567', NULL, 7, 'MANAGER', 'Department Manager', 'G6', '2020-01-15', '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
INSERT INTO staff (staff_id, staff_code, staff_name, username, email, phone, store_id, department_id, role, position, job_grade, joining_date, password_hash, status, is_active) VALUES (369, 'SYS001', 'Admin System', 'admin', 'admin@aeon.com.vn', NULL, NULL, NULL, 'SYSTEM_ADMIN', 'System Administrator', NULL, NULL, '$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW', 'active', 1);
/*!40000 ALTER TABLE `staff` ENABLE KEYS */;
UNLOCK TABLES;
