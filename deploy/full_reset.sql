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
-- Current Database: `auraorie68aa_aoisora`
--

/*!40000 DROP DATABASE IF EXISTS `auraorie68aa_aoisora`*/;

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `auraorie68aa_aoisora` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `auraorie68aa_aoisora`;

--
-- Table structure for table `areas`
--

DROP TABLE IF EXISTS `areas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `areas` (
  `area_id` int NOT NULL AUTO_INCREMENT,
  `area_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `area_code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `zone_id` int NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
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
  `check_list_name` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
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
  `code_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
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
  `group_id` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `task_code` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `task_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `status` int DEFAULT '1',
  `completed_at` timestamp NULL DEFAULT NULL,
  `notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
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
  `template_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
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
  `department_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `department_code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `parent_id` int DEFAULT NULL,
  `sort_order` int DEFAULT '0',
  `icon` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `icon_color` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `icon_bg` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`department_id`),
  UNIQUE KEY `department_code` (`department_code`),
  KEY `fk_departments_parent` (`parent_id`),
  CONSTRAINT `fk_departments_parent` FOREIGN KEY (`parent_id`) REFERENCES `departments` (`department_id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=101 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `departments`
--

LOCK TABLES `departments` WRITE;
/*!40000 ALTER TABLE `departments` DISABLE KEYS */;
INSERT INTO `departments` VALUES (1,'OP','OP','Operation Department',100,1,'Settings','#3b82f6','#dbeafe',1,'2026-01-24 00:00:00','2026-01-29 09:28:03'),(2,'Admin','ADMIN','Administration Department',100,2,'Building','#22c55e','#dcfce7',1,'2026-01-24 00:00:00','2026-01-29 09:28:03'),(3,'Control','CTRL','Control Department',100,3,'Shield','#f59e0b','#fef3c7',1,'2026-01-24 00:00:00','2026-01-29 09:28:03'),(4,'Improvement','IMP','Improvement Department',100,4,'TrendingUp','#8b5cf6','#ede9fe',1,'2026-01-24 00:00:00','2026-01-29 09:28:03'),(5,'Planning','PLAN','Planning Department',100,5,'Calendar','#ec4899','#fce7f3',1,'2026-01-24 00:00:00','2026-01-29 09:28:03'),(6,'HR','HR','Human Resources Department',100,6,'Users','#06b6d4','#cffafe',1,'2026-01-24 00:00:00','2026-01-29 09:28:03'),(7,'Perisable','PERI','Perisable Division',1,1,'Leaf','#10b981','#d1fae5',1,'2026-01-24 00:00:00','2026-01-24 00:00:00'),(8,'Grocery','GRO','Grocery Division',1,2,'ShoppingCart','#6366f1','#e0e7ff',1,'2026-01-24 00:00:00','2026-01-24 00:00:00'),(9,'Delica','DELI','Delica Division',1,3,'Utensils','#f97316','#ffedd5',1,'2026-01-24 00:00:00','2026-01-24 00:00:00'),(10,'D&D','DD','D&D Division',1,4,'Gift','#a855f7','#f3e8ff',1,'2026-01-24 00:00:00','2026-01-24 00:00:00'),(11,'CS','CS','Customer Service Division',1,5,'Headphones','#14b8a6','#ccfbf1',1,'2026-01-24 00:00:00','2026-01-24 00:00:00'),(12,'Admin Div','ADMINDIV','Admin Division',2,1,'Folder','#84cc16','#ecfccb',1,'2026-01-24 00:00:00','2026-01-24 00:00:00'),(13,'MMD','MMD','MMD Division',2,2,'Package','#eab308','#fef9c3',1,'2026-01-24 00:00:00','2026-01-24 00:00:00'),(14,'ACC','ACC','Accounting Division',2,3,'Calculator','#22c55e','#dcfce7',1,'2026-01-24 00:00:00','2026-01-24 00:00:00'),(15,'MKT','MKT','Marketing Division',5,1,'Megaphone','#ec4899','#fce7f3',1,'2026-01-24 00:00:00','2026-01-24 00:00:00'),(16,'SPA','SPA','SPA Division',5,2,'Sparkles','#f472b6','#fce7f3',1,'2026-01-24 00:00:00','2026-01-24 00:00:00'),(17,'ORD','ORD','Order Division',5,3,'ClipboardList','#fb923c','#fed7aa',1,'2026-01-24 00:00:00','2026-01-24 00:00:00'),(100,'SMBU (Head Office)','SMBU',NULL,NULL,0,NULL,NULL,NULL,1,'2026-01-29 09:28:03','2026-01-29 09:28:03');
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
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `version` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT '1.0',
  `status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'draft',
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
  `folder_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `parent_id` int DEFAULT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `icon` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
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
  `media_type` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_path` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `file_size` int DEFAULT NULL,
  `mime_type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alt_text` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
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
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `tips` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `warnings` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
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
  `manual_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `manual_url` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
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
  `notification_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `link_url` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
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
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
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
  `tokenable_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint unsigned NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `token` (`token`),
  KEY `idx_personal_access_tokens_tokenable` (`tokenable_type`,`tokenable_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personal_access_tokens`
--

LOCK TABLES `personal_access_tokens` WRITE;
/*!40000 ALTER TABLE `personal_access_tokens` DISABLE KEYS */;
INSERT INTO `personal_access_tokens` VALUES (1,'App\\Models\\Staff',1,'access_token','8770a064210a1a7f12ec36265f2340cd7be3b2a42cc8699902c48e330c0e8016','[\"*\"]','2026-01-21 19:53:56','2026-01-21 20:05:03','2026-01-21 19:50:03','2026-01-21 19:53:56'),(2,'App\\Models\\Staff',369,'access_token','10045c6513a0dcd7d9e6d4339d9e3eb09b85dddbd7a37e481c2f2daf0195e8ce','[\"*\"]','2026-01-29 02:32:06','2026-01-29 02:40:10','2026-01-29 02:25:10','2026-01-29 02:32:06');
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
  `token_hash` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `family_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `expires_at` timestamp NOT NULL,
  `revoked_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_token_hash` (`token_hash`),
  KEY `idx_staff_id` (`staff_id`),
  KEY `idx_family_id` (`family_id`),
  KEY `idx_expires_at` (`expires_at`),
  CONSTRAINT `fk_refresh_tokens_staff` FOREIGN KEY (`staff_id`) REFERENCES `staff` (`staff_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `refresh_tokens`
--

LOCK TABLES `refresh_tokens` WRITE;
/*!40000 ALTER TABLE `refresh_tokens` DISABLE KEYS */;
INSERT INTO `refresh_tokens` VALUES (1,1,'195fd0248299338040750148d0c49f77495cc924d9dc3831295213ab7a434955','cfbf82ea-6aca-4f99-b97d-728156437f95','2026-01-28 19:50:03',NULL,'2026-01-22 02:50:03'),(2,369,'1db360f1f6cf3361f76456f2eb6cb64f481ccf3024286f27033d352f69a07f93','064706f3-e8dc-427a-8684-1c7a6f73af8d','2026-02-28 02:25:10',NULL,'2026-01-29 09:25:10');
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
  `region_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `region_code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
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
  `status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'assigned',
  `notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
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
  `shift_code` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `shift_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `total_hours` decimal(4,2) DEFAULT '8.00',
  `shift_type` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'regular',
  `break_minutes` int DEFAULT '60',
  `color_code` varchar(7) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
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
  `template_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
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
  `staff_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `staff_code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `username` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `google_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `store_id` int DEFAULT NULL,
  `region_id` int DEFAULT NULL,
  `zone_id` int DEFAULT NULL,
  `area_id` int DEFAULT NULL,
  `department_id` int DEFAULT NULL,
  `team_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'STAFF',
  `position` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `job_grade` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sap_code` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatar_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `line_manager_id` int DEFAULT NULL,
  `joining_date` date DEFAULT NULL,
  `password_hash` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'active',
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
) ENGINE=InnoDB AUTO_INCREMENT=370 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `staff`
--

LOCK TABLES `staff` WRITE;
/*!40000 ALTER TABLE `staff` DISABLE KEYS */;
INSERT INTO `staff` VALUES (1,'Trịnh Thu Hằng','277603','trinhthuhang','trinhthuhang@aeon.com.vn',NULL,NULL,NULL,NULL,NULL,NULL,6,NULL,'SUPERVISOR','Deputy Manager','G4',NULL,NULL,NULL,'2015-05-04','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(2,'Nguyễn Đại Việt','279020','nguyendaiviet','nguyendaiviet@aeon.com.vn',NULL,NULL,NULL,NULL,NULL,NULL,7,NULL,'MANAGER','Manager','G5',NULL,NULL,NULL,'2015-08-03','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(3,'Nguyễn Thị Hiền','279357','nguyenthihien','nguyenthihien@aeon.com.vn',NULL,NULL,NULL,NULL,NULL,NULL,12,NULL,'SUPERVISOR','Executive','G3',NULL,NULL,NULL,'2015-08-17','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(4,'Phan Thị Hồng Nhung','280071','phanthihongnhung','phanthihongnhung@aeon.com.vn',NULL,NULL,NULL,NULL,NULL,NULL,6,NULL,'SUPERVISOR','Executive','G3',NULL,NULL,NULL,'2015-09-03','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(5,'Nguyễn Thị Nga','280298','nguyenthinga','nguyenthinga@aeon.com.vn',NULL,NULL,NULL,NULL,NULL,NULL,12,NULL,'STAFF','Officer','G2',NULL,NULL,NULL,'2017-08-26','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(6,'Nguyễn Thị Mỹ','280305','nguyenthimy','nguyenthimy@aeon.com.vn',NULL,NULL,NULL,NULL,NULL,NULL,11,NULL,'SUPERVISOR','Executive','G3',NULL,NULL,NULL,'2015-09-03','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(7,'Đoàn Thị Vân Anh','280663','doanthivananh','doanthivananh@aeon.com.vn',NULL,NULL,NULL,NULL,NULL,NULL,6,NULL,'STAFF','Officer','G2',NULL,NULL,NULL,'2015-09-14','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(8,'Vũ Thanh Tùng','281148','vuthanhtung','vuthanhtung@aeon.com.vn',NULL,NULL,NULL,NULL,NULL,NULL,4,NULL,'SUPERVISOR','Executive','G3',NULL,NULL,NULL,'2015-09-29','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(9,'Đỗ Thị Kim Duyên','283407','dothikimduyen','dothikimduyen@aeon.com.vn',NULL,NULL,NULL,NULL,NULL,NULL,12,NULL,'SUPERVISOR','Deputy manager','G4',NULL,NULL,NULL,'2015-12-16','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(10,'Lê Hoài Thu','283789','lehoaithu','lehoaithu@aeon.com.vn',NULL,NULL,NULL,NULL,NULL,NULL,6,NULL,'SUPERVISOR','Executive','G3',NULL,NULL,NULL,'2015-12-26','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(11,'Nguyễn Hồng Phượng','305765','nguyenhongphuong','nguyenhongphuong@aeon.com.vn',NULL,NULL,NULL,NULL,NULL,NULL,11,NULL,'STAFF','Officer','G2',NULL,NULL,NULL,'2018-03-01','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(12,'Lê Thị Thúy','306072','lethithuy','lethithuy@aeon.com.vn',NULL,NULL,NULL,NULL,NULL,NULL,8,NULL,'SUPERVISOR','Executive','G3',NULL,NULL,NULL,'2018-03-09','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(13,'Nguyễn Diệu Linh','306083','nguyendieulinh','nguyendieulinh@aeon.com.vn',NULL,NULL,NULL,NULL,NULL,NULL,7,NULL,'STAFF','Officer','G2',NULL,NULL,NULL,'2018-03-09','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(14,'Chu Thị Thu Hương','403482','chuthithuhuong','chuthithuhuong@aeon.com.vn',NULL,NULL,NULL,NULL,NULL,NULL,15,NULL,'STAFF','Officer','G2',NULL,NULL,NULL,'2019-10-14','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(15,'Đặng Ngọc Anh','403996','dangngocanh','dangngocanh@aeon.com.vn',NULL,NULL,NULL,NULL,NULL,NULL,13,NULL,'STAFF','Officer','G2',NULL,NULL,NULL,'2019-11-08','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(16,'Bùi Quang Nghĩa','405998','buiquangnghia','buiquangnghia@aeon.com.vn',NULL,NULL,NULL,NULL,NULL,NULL,3,NULL,'SUPERVISOR','Deputy manager','G4',NULL,NULL,NULL,'2020-03-26','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(17,'Bùi Thị Ngoan','405999','buithingoan','buithingoan@aeon.com.vn',NULL,NULL,NULL,NULL,NULL,NULL,3,NULL,'SUPERVISOR','Executive','G3',NULL,NULL,NULL,'2020-03-26','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(18,'Trịnh Phương Dung','406000','trinhphuongdung','trinhphuongdung@aeon.com.vn',NULL,NULL,NULL,NULL,NULL,NULL,8,NULL,'SUPERVISOR','Executive','G3',NULL,NULL,NULL,'2020-03-26','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(19,'Nguyễn Thị Hiền','406266','nguyenthihien20','nguyenthihien20@aeon.com.vn',NULL,NULL,NULL,NULL,NULL,NULL,9,NULL,'SUPERVISOR','Executive','G3',NULL,NULL,NULL,'2020-06-10','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(20,'Vũ Thị Thanh','406509','vuthithanh','vuthithanh@aeon.com.vn',NULL,NULL,NULL,NULL,NULL,NULL,15,NULL,'STAFF','Officer','G2',NULL,NULL,NULL,'2020-09-10','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(21,'Phan Thị Phương Thảo','408716','phanthiphuongthao','phanthiphuongthao@aeon.com.vn',NULL,NULL,NULL,NULL,NULL,NULL,4,NULL,'SUPERVISOR','Deputy manager','G4',NULL,NULL,NULL,'2021-07-12','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(22,'Lê Đức Ngọc','408811','leducngoc','leducngoc@aeon.com.vn',NULL,NULL,NULL,NULL,NULL,NULL,9,NULL,'SUPERVISOR','Executive','G3',NULL,NULL,NULL,'2021-10-11','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(23,'Đặng Việt Thắng','408813','dangvietthang','dangvietthang@aeon.com.vn',NULL,NULL,NULL,NULL,NULL,NULL,7,NULL,'SUPERVISOR','Executive','G3',NULL,NULL,NULL,'2021-10-11','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(24,'Phạm Thị Nguyệt','408892','phamthinguyet','phamthinguyet@aeon.com.vn',NULL,NULL,NULL,NULL,NULL,NULL,8,NULL,'SUPERVISOR','Executive','G3',NULL,NULL,NULL,'2021-10-26','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(25,'Phạm Thị Huyền','411035','phamthihuyen','phamthihuyen@aeon.com.vn',NULL,NULL,NULL,NULL,NULL,NULL,3,NULL,'STAFF','Officer','G2',NULL,NULL,NULL,'2022-06-10','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(26,'Nguyễn Thu Trang','411339','nguyenthutrang','nguyenthutrang@aeon.com.vn',NULL,NULL,NULL,NULL,NULL,NULL,14,NULL,'STAFF','Officer','G2',NULL,NULL,NULL,'2022-07-18','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(27,'Nguyễn Thị Thúy','411725','nguyenthithuy','nguyenthithuy@aeon.com.vn',NULL,NULL,NULL,NULL,NULL,NULL,12,NULL,'STAFF','Officer','G2',NULL,NULL,NULL,'2022-08-26','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(28,'Nguyễn Mạnh Tiến','412108','nguyenmanhtien','nguyenmanhtien@aeon.com.vn',NULL,NULL,NULL,NULL,NULL,NULL,8,NULL,'STAFF','Officer','G2',NULL,NULL,NULL,'2022-10-11','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(29,'Lê Minh Phương','412453','leminhphuong','leminhphuong@aeon.com.vn',NULL,NULL,NULL,NULL,NULL,NULL,14,NULL,'STAFF','Officer','G2',NULL,NULL,NULL,'2022-11-17','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(30,'Phạm Thị Thanh Vân','413519','phamthithanhvan','phamthithanhvan@aeon.com.vn',NULL,NULL,NULL,NULL,NULL,NULL,8,NULL,'STAFF','Officer','G2',NULL,NULL,NULL,'2023-01-30','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(31,'Lưu Thị Hằng','413869','luuthihang','luuthihang@aeon.com.vn',NULL,NULL,NULL,NULL,NULL,NULL,3,NULL,'STAFF','Officer','G2',NULL,NULL,NULL,'2023-04-17','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(32,'Trần Thị Bích','414217','tranthibich','tranthibich@aeon.com.vn',NULL,NULL,NULL,NULL,NULL,NULL,10,NULL,'STAFF','Officer','G2',NULL,NULL,NULL,'2023-06-05','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(33,'Hà Thị Khánh Huyền','414422','hathikhanhhuyen','hathikhanhhuyen@aeon.com.vn',NULL,NULL,NULL,NULL,NULL,NULL,6,NULL,'SUPERVISOR','Executive','G3',NULL,NULL,NULL,'2023-07-10','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(34,'Vũ Quỳnh Mai','415151','vuquynhmai','vuquynhmai@aeon.com.vn',NULL,NULL,NULL,NULL,NULL,NULL,12,NULL,'STAFF','Officer','G2',NULL,NULL,NULL,'2024-09-09','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(35,'Lưu Thị Thu Phương','417226','luuthithuphuong','luuthithuphuong@aeon.com.vn',NULL,NULL,NULL,NULL,NULL,NULL,10,NULL,'STAFF','Officer','G2',NULL,NULL,NULL,'2024-06-07','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(36,'Nguyễn Thị Huyền','421108','nguyenthihuyen','nguyenthihuyen@aeon.com.vn',NULL,NULL,NULL,NULL,NULL,NULL,8,NULL,'STAFF','Officer','G2',NULL,NULL,NULL,'2025-03-17','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(37,'Nguyễn Văn Trung','280312','nguyenvantrung','nguyenvantrung@aeon.com.vn',NULL,NULL,17,NULL,NULL,NULL,NULL,NULL,'STAFF','Sales Leader','G2',NULL,NULL,NULL,'2015-09-03','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(38,'Nguyễn Khánh Tâm','291508','nguyenkhanhtam','nguyenkhanhtam@aeon.com.vn',NULL,NULL,3,NULL,NULL,NULL,NULL,NULL,'STAFF','General Staff','G1',NULL,NULL,NULL,'2023-09-11','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(39,'Nguyễn Thị Quỳnh','295993','nguyenthiquynh','nguyenthiquynh@aeon.com.vn',NULL,NULL,3,NULL,NULL,NULL,NULL,NULL,'STAFF','Sales Leader','G2',NULL,NULL,NULL,'2017-03-10','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(40,'Đỗ Hương Giang','304947','dohuonggiang','dohuonggiang@aeon.com.vn',NULL,NULL,17,NULL,NULL,NULL,NULL,NULL,'SUPERVISOR','Store Manager','G3',NULL,NULL,NULL,'2018-01-28','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(41,'Trần Thị Vân Anh','308706','tranthivananh','tranthivananh@aeon.com.vn',NULL,NULL,17,NULL,NULL,NULL,NULL,NULL,'STAFF','Sales Leader','G2',NULL,NULL,NULL,'2022-05-10','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(42,'Nguyễn Thị Mai Anh','308707','nguyenthimaianh','nguyenthimaianh@aeon.com.vn',NULL,NULL,27,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2018-05-26','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(43,'Lưu Thị Trung Anh','309063','luuthitrunganh','luuthitrunganh@aeon.com.vn',NULL,NULL,22,NULL,NULL,NULL,NULL,NULL,'STAFF','General Staff','G1',NULL,NULL,NULL,'2022-02-10','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(44,'Nguyễn Thị Thu Huyền','309247','nguyenthithuhuyen','nguyenthithuhuyen@aeon.com.vn',NULL,NULL,22,NULL,NULL,NULL,NULL,NULL,'STAFF','Sales Leader','G2',NULL,NULL,NULL,'2018-06-26','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(45,'Nguyễn Hải Nam','311064','nguyenhainam','nguyenhainam@aeon.com.vn',NULL,NULL,13,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2022-03-28','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(46,'Nguyễn Thị Kim Lan','311816','nguyenthikimlan','nguyenthikimlan@aeon.com.vn',NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2023-04-10','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(47,'Nguyễn Bảo Yến','313788','nguyenbaoyen','nguyenbaoyen@aeon.com.vn',NULL,NULL,9,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2022-08-17','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(48,'Lê Thị Thu Hà','400587','lethithuha','lethithuha@aeon.com.vn',NULL,NULL,23,NULL,NULL,NULL,NULL,NULL,'STAFF','General Staff','G1',NULL,NULL,NULL,'2025-02-27','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(49,'Nguyễn Hoàng Giang','400844','nguyenhoanggiang','nguyenhoanggiang@aeon.com.vn',NULL,NULL,3,NULL,NULL,NULL,NULL,NULL,'STAFF','Sales Leader','G2',NULL,NULL,NULL,'2022-03-10','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(50,'Nguyễn Thị Huế','401426','nguyenthihue','nguyenthihue@aeon.com.vn',NULL,NULL,17,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2019-07-26','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(51,'Nguyễn Thị Lan Hương','401433','nguyenthilanhuong','nguyenthilanhuong@aeon.com.vn',NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,'STAFF','Support Leader','G2',NULL,NULL,NULL,'2020-08-03','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(52,'Đỗ Thị Thu Hương','401935','dothithuhuong','dothithuhuong@aeon.com.vn',NULL,NULL,NULL,NULL,NULL,NULL,7,NULL,'STAFF','Sales Leader','G1',NULL,NULL,NULL,'2019-04-19','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(53,'Nguyễn Thanh Tú','402465','nguyenthanhtu','nguyenthanhtu@aeon.com.vn',NULL,NULL,22,NULL,NULL,NULL,NULL,NULL,'SUPERVISOR','Store Manager','G3',NULL,NULL,NULL,'2019-07-10','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(54,'Trần Thị Huyền','402853','tranthihuyen','tranthihuyen@aeon.com.vn',NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2022-10-10','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(55,'Nguyễn Thị Mai','403054','nguyenthimai','nguyenthimai@aeon.com.vn',NULL,NULL,21,NULL,NULL,NULL,NULL,NULL,'SUPERVISOR','Store Manager','G3',NULL,NULL,NULL,'2019-09-10','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(56,'Nguyễn Hữu Cường','403402','nguyenhuucuong','nguyenhuucuong@aeon.com.vn',NULL,NULL,8,NULL,NULL,NULL,NULL,NULL,'SUPERVISOR','Store manager','G3',NULL,NULL,NULL,'2019-10-07','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(57,'Bùi Văn Tình','403408','buivantinh','buivantinh@aeon.com.vn',NULL,NULL,19,NULL,NULL,NULL,NULL,NULL,'STAFF','Sales Leader','G2',NULL,NULL,NULL,'2019-10-07','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(58,'Nguyễn Thị Thúy Hằng','403483','nguyenthithuyhang','nguyenthithuyhang@aeon.com.vn',NULL,NULL,4,NULL,NULL,NULL,NULL,NULL,'STAFF','General Staff','G1',NULL,NULL,NULL,'2019-10-14','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(59,'Phạm Thị Thanh Xuân','403498','phamthithanhxuan','phamthithanhxuan@aeon.com.vn',NULL,NULL,20,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2019-10-14','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(60,'Trương Văn Quỳnh','403723','truongvanquynh','truongvanquynh@aeon.com.vn',NULL,NULL,8,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2019-10-26','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(61,'Nguyễn Việt Thành','403997','nguyenvietthanh','nguyenvietthanh@aeon.com.vn',NULL,NULL,28,NULL,NULL,NULL,NULL,NULL,'SUPERVISOR','Store Manager','G3',NULL,NULL,NULL,'2019-11-08','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(62,'Trần Thị Nga','404387','tranthinga','tranthinga@aeon.com.vn',NULL,NULL,17,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2019-11-18','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(63,'Nguyễn Thùy Linh','404516','nguyenthuylinh','nguyenthuylinh@aeon.com.vn',NULL,NULL,27,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2022-08-10','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(64,'Nguyễn Lan Linh','404793','nguyenlanlinh','nguyenlanlinh@aeon.com.vn',NULL,NULL,18,NULL,NULL,NULL,NULL,NULL,'STAFF','Sales Leader','G2',NULL,NULL,NULL,'2020-07-27','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(65,'Bùi Phương Thảo','404929','buiphuongthao','buiphuongthao@aeon.com.vn',NULL,NULL,12,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2021-12-06','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(66,'Nguyễn Thị Thạo','406020','nguyenthithao','nguyenthithao@aeon.com.vn',NULL,NULL,12,NULL,NULL,NULL,NULL,NULL,'SUPERVISOR','Store Manager','G3',NULL,NULL,NULL,'2020-04-27','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(67,'Phạm Mỹ Anh','406345','phammyanh','phammyanh@aeon.com.vn',NULL,NULL,28,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2026-01-17','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(68,'Hoàng Bảo Thắng','406465','hoangbaothang','hoangbaothang@aeon.com.vn',NULL,NULL,22,NULL,NULL,NULL,NULL,NULL,'STAFF','Sales Leader','G2',NULL,NULL,NULL,'2020-08-03','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(69,'Đoàn Thị Bảo Trang','406491','doanthibaotrang','doanthibaotrang@aeon.com.vn',NULL,NULL,8,NULL,NULL,NULL,NULL,NULL,'STAFF','Support Leader','G2',NULL,NULL,NULL,'2021-03-10','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(70,'Vũ Anh Tuấn','406603','vuanhtuan','vuanhtuan@aeon.com.vn',NULL,NULL,21,NULL,NULL,NULL,NULL,NULL,'STAFF','General Staff','G1',NULL,NULL,NULL,'2025-02-27','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(71,'Nguyễn Hồng Nga','407014','nguyenhongnga','nguyenhongnga@aeon.com.vn',NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2020-11-09','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(72,'Trần Thị Thanh Thủy','407338','tranthithanhthuy','tranthithanhthuy@aeon.com.vn',NULL,NULL,23,NULL,NULL,NULL,NULL,NULL,'STAFF','Sales Leader','G2',NULL,NULL,NULL,'2022-03-10','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(73,'Cao Thị Thanh Trà','407579','caothithanhtra','caothithanhtra@aeon.com.vn',NULL,NULL,28,NULL,NULL,NULL,NULL,NULL,'STAFF','Sales Leader','G2',NULL,NULL,NULL,'2020-12-26','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(74,'Kiều Thị Hanh','408221','kieuthihanh','kieuthihanh@aeon.com.vn',NULL,NULL,15,NULL,NULL,NULL,NULL,NULL,'STAFF','General Staff','G1',NULL,NULL,NULL,'2021-09-27','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(75,'Lê Đức Anh','408284','leducanh','leducanh@aeon.com.vn',NULL,NULL,27,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2025-05-27','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(76,'Trần Minh Hải','408448','tranminhhai','tranminhhai@aeon.com.vn',NULL,NULL,11,NULL,NULL,NULL,NULL,NULL,'STAFF','General Staff','G1',NULL,NULL,NULL,'2022-08-26','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(77,'Nguyễn Hồng Hạnh','408451','nguyenhonghanh','nguyenhonghanh@aeon.com.vn',NULL,NULL,12,NULL,NULL,NULL,NULL,NULL,'STAFF','Sales Leader','G2',NULL,NULL,NULL,'2021-04-12','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(78,'Phạm Thị Hương','408739','phamthihuong','phamthihuong@aeon.com.vn',NULL,NULL,8,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2021-07-19','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(79,'Đào Nhật Mỹ Linh','408747','daonhatmylinh','daonhatmylinh@aeon.com.vn',NULL,NULL,25,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2021-07-26','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(80,'Trần Anh Tuấn','408794','trananhtuan','trananhtuan@aeon.com.vn',NULL,NULL,10,NULL,NULL,NULL,NULL,NULL,'SUPERVISOR','Store Manager','G3',NULL,NULL,NULL,'2021-09-27','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(81,'Đào Thị Hồng','408826','daothihong','daothihong@aeon.com.vn',NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2021-10-11','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(82,'Lê Việt Quang','408846','levietquang','levietquang@aeon.com.vn',NULL,NULL,20,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2023-05-10','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(83,'Hoàng Thị Nga','408871','hoangthinga','hoangthinga@aeon.com.vn',NULL,NULL,14,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2021-10-18','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(84,'Lương Thiện Phúc','408872','luongthienphuc','luongthienphuc@aeon.com.vn',NULL,NULL,7,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2025-07-28','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(85,'Nguyễn Thị Hương','408885','nguyenthihuong','nguyenthihuong@aeon.com.vn',NULL,NULL,23,NULL,NULL,NULL,NULL,NULL,'SUPERVISOR','Store Manager','G3',NULL,NULL,NULL,'2021-10-26','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(86,'Vũ Thị Lệ Tuyết','408886','vuthiletuyet','vuthiletuyet@aeon.com.vn',NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2021-10-26','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(87,'Nguyễn Khánh Đạt','409032','nguyenkhanhdat','nguyenkhanhdat@aeon.com.vn',NULL,NULL,14,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2022-04-26','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(88,'Nguyễn Thuý Huyền','409034','nguyenthuyhuyen','nguyenthuyhuyen@aeon.com.vn',NULL,NULL,12,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2021-12-27','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(89,'Nguyễn Thế Giang','409310','nguyenthegiang','nguyenthegiang@aeon.com.vn',NULL,NULL,24,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2021-12-06','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(90,'Đỗ Chí Thanh','409311','dochithanh','dochithanh@aeon.com.vn',NULL,NULL,5,NULL,NULL,NULL,NULL,NULL,'SUPERVISOR','Store Manager','G3',NULL,NULL,NULL,'2021-12-06','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(91,'Phạm Ngọc Nam','409312','phamngocnam','phamngocnam@aeon.com.vn',NULL,NULL,25,NULL,NULL,NULL,NULL,NULL,'SUPERVISOR','Store Manager','G3',NULL,NULL,NULL,'2021-12-06','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(92,'Lê Thu Trang','409318','lethutrang','lethutrang@aeon.com.vn',NULL,NULL,24,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2021-12-10','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(93,'Phạm Thị Thu Hiền','409319','phamthithuhien','phamthithuhien@aeon.com.vn',NULL,NULL,24,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2021-12-10','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(94,'Nguyễn Kiều Anh','409369','nguyenkieuanh','nguyenkieuanh@aeon.com.vn',NULL,NULL,17,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2022-03-17','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(95,'Trần Hồng Minh','409410','tranhongminh','tranhongminh@aeon.com.vn',NULL,NULL,19,NULL,NULL,NULL,NULL,NULL,'STAFF','Sales Leader','G2',NULL,NULL,NULL,'2021-12-17','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(96,'Lưu Thúy Hồng','409414','luuthuyhong','luuthuyhong@aeon.com.vn',NULL,NULL,12,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2021-12-17','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(97,'Giáp Xuân Phương','409415','giapxuanphuong','giapxuanphuong@aeon.com.vn',NULL,NULL,14,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2021-12-17','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(98,'Lưu Huyền Ly','409416','luuhuyenly','luuhuyenly@aeon.com.vn',NULL,NULL,12,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2021-12-17','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(99,'Nguyễn Thị Phương Thảo','409419','nguyenthiphuongthao','nguyenthiphuongthao@aeon.com.vn',NULL,NULL,12,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2021-12-17','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(100,'Chu Thanh Quỳnh','409423','chuthanhquynh','chuthanhquynh@aeon.com.vn',NULL,NULL,3,NULL,NULL,NULL,NULL,NULL,'STAFF','General Staff','G1',NULL,NULL,NULL,'2021-12-17','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(101,'Đinh Thị Hải Yến','409444','dinhthihaiyen','dinhthihaiyen@aeon.com.vn',NULL,NULL,12,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2021-12-20','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(102,'Nguyễn Thị Trang','409482','nguyenthitrang','nguyenthitrang@aeon.com.vn',NULL,NULL,27,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2021-12-27','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(103,'Nguyễn Phan Hoài Thu','409496','nguyenphanhoaithu','nguyenphanhoaithu@aeon.com.vn',NULL,NULL,11,NULL,NULL,NULL,NULL,NULL,'STAFF','Sales Leader','G2',NULL,NULL,NULL,'2021-12-27','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(104,'Vũ Lê Phương','409535','vulephuong','vulephuong@aeon.com.vn',NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2022-01-03','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(105,'Nguyễn Thị Linh','409538','nguyenthilinh','nguyenthilinh@aeon.com.vn',NULL,NULL,22,NULL,NULL,NULL,NULL,NULL,'STAFF','General Staff','G1',NULL,NULL,NULL,'2022-01-03','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(106,'Hoàng Thị Nga','409539','hoangthinga22','hoangthinga22@aeon.com.vn',NULL,NULL,27,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2022-01-03','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(107,'Chu Thanh Hải','409574','chuthanhhai','chuthanhhai@aeon.com.vn',NULL,NULL,13,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2024-01-08','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(108,'Nguyễn Lệ Chi','409752','nguyenlechi','nguyenlechi@aeon.com.vn',NULL,NULL,18,NULL,NULL,NULL,NULL,NULL,'STAFF','Sales Leader','G2',NULL,NULL,NULL,'2022-01-10','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(109,'Đào Phương Thảo','409755','daophuongthao','daophuongthao@aeon.com.vn',NULL,NULL,24,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2022-01-10','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(110,'Nguyễn Thị Lan Hương','410040','nguyenthilanhuong22','nguyenthilanhuong22@aeon.com.vn',NULL,NULL,27,NULL,NULL,NULL,NULL,NULL,'SUPERVISOR','Store Manager','G3',NULL,NULL,NULL,'2022-01-17','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(111,'Nguyễn Thị Hưng','410041','nguyenthihung','nguyenthihung@aeon.com.vn',NULL,NULL,4,NULL,NULL,NULL,NULL,NULL,'STAFF','General Staff','G1',NULL,NULL,NULL,'2022-01-17','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(112,'Lại Văn Long','410372','laivanlong','laivanlong@aeon.com.vn',NULL,NULL,14,NULL,NULL,NULL,NULL,NULL,'SUPERVISOR','Store Manager','G3',NULL,NULL,NULL,'2022-03-10','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(113,'Nguyễn Quỳnh Anh','410375','nguyenquynhanh','nguyenquynhanh@aeon.com.vn',NULL,NULL,24,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2023-06-10','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(114,'Nguyễn Thị Thuý Hà','410397','nguyenthithuyha','nguyenthithuyha@aeon.com.vn',NULL,NULL,28,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2023-04-21','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(115,'Lê Thúy Hà','410406','lethuyha','lethuyha@aeon.com.vn',NULL,NULL,NULL,NULL,NULL,NULL,7,NULL,'STAFF','Sales Leader','G1',NULL,NULL,NULL,'2022-08-26','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(116,'Hoàng Thị Giang','410432','hoangthigiang','hoangthigiang@aeon.com.vn',NULL,NULL,18,NULL,NULL,NULL,NULL,NULL,'SUPERVISOR','Store Manager','G3',NULL,NULL,NULL,'2022-03-17','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(117,'Chu Huy Hoàng','410435','chuhuyhoang','chuhuyhoang@aeon.com.vn',NULL,NULL,6,NULL,NULL,NULL,NULL,NULL,'STAFF','Sales Leader','G2',NULL,NULL,NULL,'2022-03-17','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(118,'Đặng Thị Thuý Hường','410437','dangthithuyhuong','dangthithuyhuong@aeon.com.vn',NULL,NULL,17,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2022-03-28','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(119,'Nguyễn Thị Bích Ngà','410607','nguyenthibichnga','nguyenthibichnga@aeon.com.vn',NULL,NULL,27,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2022-04-12','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(120,'Phùng Đình Lợi','410630','phungdinhloi','phungdinhloi@aeon.com.vn',NULL,NULL,28,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2022-06-27','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(121,'Lê Văn Hinh','410647','levanhinh','levanhinh@aeon.com.vn',NULL,NULL,13,NULL,NULL,NULL,NULL,NULL,'STAFF','Sales Leader','G2',NULL,NULL,NULL,'2022-04-12','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(122,'Phạm Thị Yến','410707','phamthiyen','phamthiyen@aeon.com.vn',NULL,NULL,15,NULL,NULL,NULL,NULL,NULL,'STAFF','General Staff','G1',NULL,NULL,NULL,'2022-04-20','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(123,'Huỳnh Thị Hồng Loan','410766','huynhthihongloan','huynhthihongloan@aeon.com.vn',NULL,NULL,23,NULL,NULL,NULL,NULL,NULL,'STAFF','General Staff','G1',NULL,NULL,NULL,'2022-04-26','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(124,'Lưu Cẩm Ly','410768','luucamly','luucamly@aeon.com.vn',NULL,NULL,12,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2022-04-26','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(125,'Nguyễn Tiến Đạt','410771','nguyentiendat','nguyentiendat@aeon.com.vn',NULL,NULL,10,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2023-04-21','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(126,'Nguyễn Thúy Quỳnh','410815','nguyenthuyquynh','nguyenthuyquynh@aeon.com.vn',NULL,NULL,13,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2022-06-27','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(127,'Trần Thị Trang','410824','tranthitrang','tranthitrang@aeon.com.vn',NULL,NULL,7,NULL,NULL,NULL,NULL,NULL,'STAFF','Sales Leader','G2',NULL,NULL,NULL,'2022-05-10','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(128,'Nguyễn Thị Lan Phương','410846','nguyenthilanphuong','nguyenthilanphuong@aeon.com.vn',NULL,NULL,26,NULL,NULL,NULL,NULL,NULL,'STAFF','Sales Leader','G2',NULL,NULL,NULL,'2022-05-10','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(129,'Đình Thu Luyến','410939','dinhthuluyen','dinhthuluyen@aeon.com.vn',NULL,NULL,7,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2022-05-27','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(130,'Đỗ Thị Phương Anh','410944','dothiphuonganh','dothiphuonganh@aeon.com.vn',NULL,NULL,13,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2023-05-10','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(131,'Phạm Thúy Huyền','410989','phamthuyhuyen','phamthuyhuyen@aeon.com.vn',NULL,NULL,NULL,NULL,NULL,NULL,7,NULL,'STAFF','Sales Leader','G1',NULL,NULL,NULL,'2022-06-03','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(132,'Nguyễn Thị Loan Phương','411034','nguyenthiloanphuong','nguyenthiloanphuong@aeon.com.vn',NULL,NULL,9,NULL,NULL,NULL,NULL,NULL,'SUPERVISOR','Store Manager','G3',NULL,NULL,NULL,'2022-06-10','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(133,'Cao Thị Khiêm','411068','caothikhiem','caothikhiem@aeon.com.vn',NULL,NULL,14,NULL,NULL,NULL,NULL,NULL,'STAFF','Sales Leader','G2',NULL,NULL,NULL,'2022-06-10','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(134,'Đào Thái Thu','411076','daothaithu','daothaithu@aeon.com.vn',NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,'STAFF','Sales Leader','G2',NULL,NULL,NULL,'2022-06-10','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(135,'Nguyễn Như Khuyên','411078','nguyennhukhuyen','nguyennhukhuyen@aeon.com.vn',NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2022-06-10','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(136,'Nguyễn Phương Thanh','411083','nguyenphuongthanh','nguyenphuongthanh@aeon.com.vn',NULL,NULL,6,NULL,NULL,NULL,NULL,NULL,'STAFF','General Staff','G1',NULL,NULL,NULL,'2025-09-27','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(137,'Nguyễn Thị Thu Hiền','411139','nguyenthithuhien','nguyenthithuhien@aeon.com.vn',NULL,NULL,16,NULL,NULL,NULL,NULL,NULL,'STAFF','Sales Leader','G2',NULL,NULL,NULL,'2022-06-27','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(138,'Hoàng Đức Anh','411158','hoangducanh','hoangducanh@aeon.com.vn',NULL,NULL,7,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2022-06-27','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(139,'Nguyễn Thanh Tâm','411173','nguyenthanhtam','nguyenthanhtam@aeon.com.vn',NULL,NULL,8,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2025-01-07','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(140,'Nguyễn Thị Ngợi','411273','nguyenthingoi','nguyenthingoi@aeon.com.vn',NULL,NULL,4,NULL,NULL,NULL,NULL,NULL,'SUPERVISOR','Store Manager','G3',NULL,NULL,NULL,'2022-07-11','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(141,'Lê Thu Trà','411279','lethutra','lethutra@aeon.com.vn',NULL,NULL,24,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2022-07-11','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(142,'Lê Văn Đạt','411280','levandat','levandat@aeon.com.vn',NULL,NULL,15,NULL,NULL,NULL,NULL,NULL,'STAFF','Sales Leader','G2',NULL,NULL,NULL,'2022-07-11','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(143,'Trần Hoàng Vân','411420','tranhoangvan','tranhoangvan@aeon.com.vn',NULL,NULL,15,NULL,NULL,NULL,NULL,NULL,'SUPERVISOR','Store Manager','G3',NULL,NULL,NULL,'2022-07-26','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(144,'Lê Văn Tuấn','411530','levantuan','levantuan@aeon.com.vn',NULL,NULL,24,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2024-11-19','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(145,'Đỗ Thị Thanh Bình','411576','dothithanhbinh','dothithanhbinh@aeon.com.vn',NULL,NULL,19,NULL,NULL,NULL,NULL,NULL,'STAFF','General Staff','G1',NULL,NULL,NULL,'2024-11-07','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(146,'Vũ Hữu Phúc','411711','vuhuuphuc','vuhuuphuc@aeon.com.vn',NULL,NULL,28,NULL,NULL,NULL,NULL,NULL,'STAFF','Sales Leader','G2',NULL,NULL,NULL,'2022-08-26','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(147,'Hoàng Việt Thái','411712','hoangvietthai','hoangvietthai@aeon.com.vn',NULL,NULL,20,NULL,NULL,NULL,NULL,NULL,'SUPERVISOR','Store manager','G3',NULL,NULL,NULL,'2022-08-26','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(148,'Lê Thị Trà My','411713','lethitramy','lethitramy@aeon.com.vn',NULL,NULL,26,NULL,NULL,NULL,NULL,NULL,'SUPERVISOR','Store Manager','G3',NULL,NULL,NULL,'2022-08-26','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(149,'Nguyễn Đoàn Việt','411862','nguyendoanviet','nguyendoanviet@aeon.com.vn',NULL,NULL,21,NULL,NULL,NULL,NULL,NULL,'STAFF','General Staff','G1',NULL,NULL,NULL,'2022-09-10','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(150,'Vũ Thị Mai','411956','vuthimai','vuthimai@aeon.com.vn',NULL,NULL,NULL,NULL,NULL,NULL,7,NULL,'STAFF','Store Manager','G2',NULL,NULL,NULL,'2022-09-26','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(151,'Ma Quỳnh Hương','411963','maquynhhuong','maquynhhuong@aeon.com.vn',NULL,NULL,9,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2023-01-30','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(152,'Nguyễn Thị Thu','411985','nguyenthithu','nguyenthithu@aeon.com.vn',NULL,NULL,10,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2022-09-26','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(153,'Hoàng Khánh Linh','412034','hoangkhanhlinh','hoangkhanhlinh@aeon.com.vn',NULL,NULL,4,NULL,NULL,NULL,NULL,NULL,'STAFF','Sales Leader','G2',NULL,NULL,NULL,'2022-10-03','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(154,'Hoàng Thị Thu Quyên','412035','hoangthithuquyen','hoangthithuquyen@aeon.com.vn',NULL,NULL,10,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2022-10-03','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(155,'Nguyễn Xuân Bắc','412078','nguyenxuanbac','nguyenxuanbac@aeon.com.vn',NULL,NULL,16,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2022-10-10','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(156,'Đỗ Thị Hương Giang','412135','dothihuonggiang','dothihuonggiang@aeon.com.vn',NULL,NULL,7,NULL,NULL,NULL,NULL,NULL,'SUPERVISOR','Store Manager','G3',NULL,NULL,NULL,'2022-10-17','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(157,'Hoàng Mạnh Linh','412136','hoangmanhlinh','hoangmanhlinh@aeon.com.vn',NULL,NULL,10,NULL,NULL,NULL,NULL,NULL,'STAFF','Sales Leader','G2',NULL,NULL,NULL,'2022-10-17','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(158,'Trần Nam Thái','412137','trannamthai','trannamthai@aeon.com.vn',NULL,NULL,13,NULL,NULL,NULL,NULL,NULL,'SUPERVISOR','Store Manager','G3',NULL,NULL,NULL,'2022-10-17','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(159,'Đinh Thị Hường','412161','dinhthihuong','dinhthihuong@aeon.com.vn',NULL,NULL,14,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2022-10-26','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(160,'Đào Thu Hiền','412325','daothuhien','daothuhien@aeon.com.vn',NULL,NULL,28,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2022-11-10','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(161,'Nguyễn Huệ Linh','412327','nguyenhuelinh','nguyenhuelinh@aeon.com.vn',NULL,NULL,18,NULL,NULL,NULL,NULL,NULL,'STAFF','General Staff','G1',NULL,NULL,NULL,'2023-06-26','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(162,'Phó Thị Thùy Dương','412334','phothithuyduong','phothithuyduong@aeon.com.vn',NULL,NULL,11,NULL,NULL,NULL,NULL,NULL,'STAFF','General Staff','G1',NULL,NULL,NULL,'2023-09-11','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(163,'Nguyễn Thị Len','412487','nguyenthilen','nguyenthilen@aeon.com.vn',NULL,NULL,13,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2022-11-22','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(164,'Đào Thị Xuân','412489','daothixuan','daothixuan@aeon.com.vn',NULL,NULL,24,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2024-01-27','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(165,'Nguyễn Minh Hằng','412534','nguyenminhhang','nguyenminhhang@aeon.com.vn',NULL,NULL,NULL,NULL,NULL,NULL,7,NULL,'STAFF','Sales Leader','G1',NULL,NULL,NULL,'2023-01-30','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(166,'Nguyễn Minh Thư','412667','nguyenminhthu','nguyenminhthu@aeon.com.vn',NULL,NULL,26,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2022-12-10','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(167,'Nguyễn Văn Trung','412749','nguyenvantrung22','nguyenvantrung22@aeon.com.vn',NULL,NULL,16,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2022-12-19','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(168,'Trần Tuyết Mai','412787','trantuyetmai','trantuyetmai@aeon.com.vn',NULL,NULL,5,NULL,NULL,NULL,NULL,NULL,'STAFF','General Staff','G1',NULL,NULL,NULL,'2023-03-10','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(169,'Trần Quang Duy','412851','tranquangduy','tranquangduy@aeon.com.vn',NULL,NULL,20,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2024-03-19','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(170,'Vũ Thanh Lam','413545','vuthanhlam','vuthanhlam@aeon.com.vn',NULL,NULL,16,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2023-02-10','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(171,'Nguyễn Thanh Ngân','413547','nguyenthanhngan','nguyenthanhngan@aeon.com.vn',NULL,NULL,16,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2023-02-10','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(172,'Cam Văn Thái','413618','camvanthai','camvanthai@aeon.com.vn',NULL,NULL,12,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2023-02-27','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(173,'Hồ Thị Phương Hoa','413627','hothiphuonghoa','hothiphuonghoa@aeon.com.vn',NULL,NULL,10,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2023-03-27','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(174,'Tạ Thu Thảo','413714','tathuthao','tathuthao@aeon.com.vn',NULL,NULL,6,NULL,NULL,NULL,NULL,NULL,'STAFF','Sales Leader','G2',NULL,NULL,NULL,'2023-03-20','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(175,'Bùi Thị Kim Anh','413729','buithikimanh','buithikimanh@aeon.com.vn',NULL,NULL,10,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2023-03-27','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(176,'Nguyễn Thế Thành','413732','nguyenthethanh','nguyenthethanh@aeon.com.vn',NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2023-03-27','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(177,'Nguyễn Thị Lan Anh','413740','nguyenthilananh','nguyenthilananh@aeon.com.vn',NULL,NULL,6,NULL,NULL,NULL,NULL,NULL,'SUPERVISOR','Store Manager','G3',NULL,NULL,NULL,'2023-03-27','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(178,'Nguyễn Phương Anh','413825','nguyenphuonganh','nguyenphuonganh@aeon.com.vn',NULL,NULL,6,NULL,NULL,NULL,NULL,NULL,'STAFF','General Staff','G1',NULL,NULL,NULL,'2023-04-10','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(179,'Hoàng Thị Hoa','413882','hoangthihoa','hoangthihoa@aeon.com.vn',NULL,NULL,20,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2023-04-21','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(180,'Đàm Thu Trang','413943','damthutrang','damthutrang@aeon.com.vn',NULL,NULL,27,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2023-05-10','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(181,'Trử Thị Lan Anh','414028','truthilananh','truthilananh@aeon.com.vn',NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2023-05-26','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(182,'Nguyễn Hải Châu','414036','nguyenhaichau','nguyenhaichau@aeon.com.vn',NULL,NULL,20,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2023-05-26','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(183,'Bùi Đức Lợi','414357','buiducloi','buiducloi@aeon.com.vn',NULL,NULL,12,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2023-06-26','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(184,'Nguyễn Hoàng Khánh Linh','414438','nguyenhoangkhanhlinh','nguyenhoangkhanhlinh@aeon.com.vn',NULL,NULL,13,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2023-07-10','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(185,'Tạ Minh Huyền','414566','taminhhuyen','taminhhuyen@aeon.com.vn',NULL,NULL,28,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2023-07-26','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(186,'Nguyễn Công Hiếu','414604','nguyenconghieu','nguyenconghieu@aeon.com.vn',NULL,NULL,10,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2023-08-07','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(187,'Lê Ngọc Huyền','414758','lengochuyen','lengochuyen@aeon.com.vn',NULL,NULL,7,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2023-08-26','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(188,'Nguyễn Thùy Linh','414766','nguyenthuylinh23','nguyenthuylinh23@aeon.com.vn',NULL,NULL,3,NULL,NULL,NULL,NULL,NULL,'STAFF','General Staff','G1',NULL,NULL,NULL,'2023-08-26','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(189,'Trịnh Minh Phượng','414768','trinhminhphuong','trinhminhphuong@aeon.com.vn',NULL,NULL,27,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2023-08-26','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(190,'Bùi Thanh Thủy','414882','buithanhthuy','buithanhthuy@aeon.com.vn',NULL,NULL,13,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2023-09-11','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(191,'Đỗ Hữu Quang','414887','dohuuquang','dohuuquang@aeon.com.vn',NULL,NULL,7,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2023-09-11','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(192,'Bùi Tiến Thành','414892','buitienthanh','buitienthanh@aeon.com.vn',NULL,NULL,25,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2023-09-11','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(193,'Nguyễn Thị Tú Anh','414899','nguyenthituanh','nguyenthituanh@aeon.com.vn',NULL,NULL,27,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2023-09-11','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(194,'Tạ Thị Huyên','414995','tathihuyen','tathihuyen@aeon.com.vn',NULL,NULL,8,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2023-09-26','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(195,'Nguyễn Ngọc Tuấn','414997','nguyenngoctuan','nguyenngoctuan@aeon.com.vn',NULL,NULL,19,NULL,NULL,NULL,NULL,NULL,'STAFF','General Staff','G1',NULL,NULL,NULL,'2023-09-26','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(196,'Nguyễn Đức Anh','415071','nguyenducanh','nguyenducanh@aeon.com.vn',NULL,NULL,25,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2023-10-10','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(197,'Điện Trung Hiếu','415088','dientrunghieu','dientrunghieu@aeon.com.vn',NULL,NULL,18,NULL,NULL,NULL,NULL,NULL,'STAFF','General Staff','G1',NULL,NULL,NULL,'2023-10-10','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(198,'Vũ Thị Hải Linh','415165','vuthihailinh','vuthihailinh@aeon.com.vn',NULL,NULL,16,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2023-10-26','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(199,'Trần Đức Khánh','415229','tranduckhanh','tranduckhanh@aeon.com.vn',NULL,NULL,23,NULL,NULL,NULL,NULL,NULL,'STAFF','General Staff','G1',NULL,NULL,NULL,'2024-09-27','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(200,'Nguyễn Thị Thu Hồng','415231','nguyenthithuhong','nguyenthithuhong@aeon.com.vn',NULL,NULL,17,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2023-11-10','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(201,'Đinh Thị Mai','415233','dinhthimai','dinhthimai@aeon.com.vn',NULL,NULL,17,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2024-10-28','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(202,'Trương Thị Ngọc Ánh','415335','truongthingocanh','truongthingocanh@aeon.com.vn',NULL,NULL,28,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2023-11-27','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(203,'Nguyễn Tiến Hùng','415437','nguyentienhung','nguyentienhung@aeon.com.vn',NULL,NULL,11,NULL,NULL,NULL,NULL,NULL,'STAFF','General Staff','G1',NULL,NULL,NULL,'2023-12-11','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(204,'Nguyễn Thị Thu Huyền','415438','nguyenthithuhuyen23','nguyenthithuhuyen23@aeon.com.vn',NULL,NULL,3,NULL,NULL,NULL,NULL,NULL,'STAFF','General Staff','G1',NULL,NULL,NULL,'2023-12-11','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(205,'Nguyễn Thế Gia Huy','415539','nguyenthegiahuy','nguyenthegiahuy@aeon.com.vn',NULL,NULL,12,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2024-11-27','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(206,'Lê Thị Thu Nga','415542','lethithunga','lethithunga@aeon.com.vn',NULL,NULL,5,NULL,NULL,NULL,NULL,NULL,'STAFF','General Staff','G1',NULL,NULL,NULL,'2025-11-07','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(207,'Nguyễn Thị Hoàng Lan','415621','nguyenthihoanglan','nguyenthihoanglan@aeon.com.vn',NULL,NULL,26,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2024-01-08','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(208,'Đỗ Mạnh Đạt','416733','domanhdat','domanhdat@aeon.com.vn',NULL,NULL,15,NULL,NULL,NULL,NULL,NULL,'STAFF','General Staff','G1',NULL,NULL,NULL,'2024-03-19','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(209,'Phạm Thị Thanh','416734','phamthithanh','phamthithanh@aeon.com.vn',NULL,NULL,24,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2024-03-19','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(210,'Nguyễn Hải Yến','416735','nguyenhaiyen','nguyenhaiyen@aeon.com.vn',NULL,NULL,3,NULL,NULL,NULL,NULL,NULL,'STAFF','General Staff','G1',NULL,NULL,NULL,'2024-07-27','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(211,'Đỗ Quang Huy','416832','doquanghuy','doquanghuy@aeon.com.vn',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,'SUPERVISOR','Store Manager','G3',NULL,NULL,NULL,'2024-04-08','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(212,'Phạm Hương Giang','416840','phamhuonggiang','phamhuonggiang@aeon.com.vn',NULL,NULL,27,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2024-04-08','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(213,'Nguyễn Thị Ánh Nguyệt','416875','nguyenthianhnguyet','nguyenthianhnguyet@aeon.com.vn',NULL,NULL,22,NULL,NULL,NULL,NULL,NULL,'STAFF','General Staff','G1',NULL,NULL,NULL,'2024-04-12','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(214,'Đỗ Thu Hà','417158','dothuha','dothuha@aeon.com.vn',NULL,NULL,14,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2024-05-27','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(215,'Nguyễn Thanh Huyền','417221','nguyenthanhhuyen','nguyenthanhhuyen@aeon.com.vn',NULL,NULL,26,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2024-06-07','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(216,'Đinh Thị Hoà','417224','dinhthihoa','dinhthihoa@aeon.com.vn',NULL,NULL,10,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2024-06-07','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(217,'Đặng Thị Vân','417407','dangthivan','dangthivan@aeon.com.vn',NULL,NULL,15,NULL,NULL,NULL,NULL,NULL,'STAFF','General Staff','G1',NULL,NULL,NULL,'2024-07-08','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(218,'Nguyễn Thị Thuỳ','417409','nguyenthithuy24','nguyenthithuy24@aeon.com.vn',NULL,NULL,22,NULL,NULL,NULL,NULL,NULL,'STAFF','General Staff','G1',NULL,NULL,NULL,'2024-07-08','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(219,'Trịnh Thị Bảo Khanh','417413','trinhthibaokhanh','trinhthibaokhanh@aeon.com.vn',NULL,NULL,20,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2024-07-08','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(220,'Đoàn Văn Quân','417414','doanvanquan','doanvanquan@aeon.com.vn',NULL,NULL,17,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2024-07-08','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(221,'Nguyễn Thế Châm','417639','nguyenthecham','nguyenthecham@aeon.com.vn',NULL,NULL,7,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2024-07-19','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(222,'Nguyễn Thị Hảo','417642','nguyenthihao','nguyenthihao@aeon.com.vn',NULL,NULL,23,NULL,NULL,NULL,NULL,NULL,'STAFF','General Staff','G1',NULL,NULL,NULL,'2024-07-19','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(223,'Nguyễn Thị Huyền','417748','nguyenthihuyen24','nguyenthihuyen24@aeon.com.vn',NULL,NULL,22,NULL,NULL,NULL,NULL,NULL,'STAFF','General Staff','G1',NULL,NULL,NULL,'2024-07-27','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(224,'Nguyễn Thị Lan Anh','418045','nguyenthilananh24','nguyenthilananh24@aeon.com.vn',NULL,NULL,23,NULL,NULL,NULL,NULL,NULL,'STAFF','General Staff','G1',NULL,NULL,NULL,'2024-07-29','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(225,'Vũ Thị Bích Quyên','418293','vuthibichquyen','vuthibichquyen@aeon.com.vn',NULL,NULL,24,NULL,NULL,NULL,NULL,NULL,'SUPERVISOR','Store Manager','G3',NULL,NULL,NULL,'2024-08-07','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(226,'Nguyễn Lan Anh','418337','nguyenlananh','nguyenlananh@aeon.com.vn',NULL,NULL,13,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2024-08-07','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(227,'Đỗ Thị Thảo','418338','dothithao','dothithao@aeon.com.vn',NULL,NULL,16,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2024-08-07','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(228,'Chử Khánh An','418340','chukhanhan','chukhanhan@aeon.com.vn',NULL,NULL,8,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2024-08-07','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(229,'Nguyễn Thị Hồng Phượng','418440','nguyenthihongphuong','nguyenthihongphuong@aeon.com.vn',NULL,NULL,22,NULL,NULL,NULL,NULL,NULL,'STAFF','General Staff','G1',NULL,NULL,NULL,'2024-08-19','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(230,'Phan Trường Sơn','418452','phantruongson','phantruongson@aeon.com.vn',NULL,NULL,26,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2025-02-27','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(231,'Phan Thị Trang','418570','phanthitrang','phanthitrang@aeon.com.vn',NULL,NULL,9,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2024-08-27','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(232,'Bùi Thị Linh','418573','buithilinh','buithilinh@aeon.com.vn',NULL,NULL,4,NULL,NULL,NULL,NULL,NULL,'STAFF','General Staff','G1',NULL,NULL,NULL,'2024-08-27','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(233,'Nguyễn Trọng Nam','418776','nguyentrongnam','nguyentrongnam@aeon.com.vn',NULL,NULL,9,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2024-09-19','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(234,'Trần Bích Ngọc','418983','tranbichngoc','tranbichngoc@aeon.com.vn',NULL,NULL,4,NULL,NULL,NULL,NULL,NULL,'STAFF','General Staff','G1',NULL,NULL,NULL,'2024-09-27','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(235,'Phạm Thị Quyên','419112','phamthiquyen','phamthiquyen@aeon.com.vn',NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2024-10-07','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(236,'Nguyễn Đức Việt','419113','nguyenducviet','nguyenducviet@aeon.com.vn',NULL,NULL,23,NULL,NULL,NULL,NULL,NULL,'STAFF','General Staff','G1',NULL,NULL,NULL,'2024-10-07','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(237,'Nguyễn Thanh Loan','419114','nguyenthanhloan','nguyenthanhloan@aeon.com.vn',NULL,NULL,19,NULL,NULL,NULL,NULL,NULL,'STAFF','General Staff','G1',NULL,NULL,NULL,'2024-10-07','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(238,'Nguyễn Thị Thu Trang','419117','nguyenthithutrang','nguyenthithutrang@aeon.com.vn',NULL,NULL,19,NULL,NULL,NULL,NULL,NULL,'STAFF','General Staff','G1',NULL,NULL,NULL,'2024-10-07','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(239,'Trần Thị Kim Linh','419118','tranthikimlinh','tranthikimlinh@aeon.com.vn',NULL,NULL,4,NULL,NULL,NULL,NULL,NULL,'STAFF','General Staff','G1',NULL,NULL,NULL,'2024-10-07','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(240,'Nguyễn Thị Hải Yến','419168','nguyenthihaiyen','nguyenthihaiyen@aeon.com.vn',NULL,NULL,19,NULL,NULL,NULL,NULL,NULL,'STAFF','General Staff','G1',NULL,NULL,NULL,'2024-10-10','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(241,'Nguyễn Thị Thanh Thủy','419172','nguyenthithanhthuy','nguyenthithanhthuy@aeon.com.vn',NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2025-02-27','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(242,'Nguyễn Hương Quỳnh','419173','nguyenhuongquynh','nguyenhuongquynh@aeon.com.vn',NULL,NULL,18,NULL,NULL,NULL,NULL,NULL,'STAFF','General Staff','G1',NULL,NULL,NULL,'2025-02-27','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(243,'Vũ Mai Phương','419218','vumaiphuong','vumaiphuong@aeon.com.vn',NULL,NULL,25,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2024-10-19','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(244,'Lê Thị Thu Trang','419349','lethithutrang','lethithutrang@aeon.com.vn',NULL,NULL,22,NULL,NULL,NULL,NULL,NULL,'STAFF','General Staff','G1',NULL,NULL,NULL,'2024-10-28','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(245,'Nguyễn Thương Thảo','419354','nguyenthuongthao','nguyenthuongthao@aeon.com.vn',NULL,NULL,11,NULL,NULL,NULL,NULL,NULL,'STAFF','General Staff','G1',NULL,NULL,NULL,'2024-10-28','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(246,'Phạm Ngọc Hân','419355','phamngochan','phamngochan@aeon.com.vn',NULL,NULL,11,NULL,NULL,NULL,NULL,NULL,'STAFF','General Staff','G1',NULL,NULL,NULL,'2024-10-28','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(247,'Bùi Vũ Đức Duy','419516','buivuducduy','buivuducduy@aeon.com.vn',NULL,NULL,28,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2024-11-19','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(248,'Nguyễn Thị Trang','419782','nguyenthitrang24','nguyenthitrang24@aeon.com.vn',NULL,NULL,21,NULL,NULL,NULL,NULL,NULL,'STAFF','Sales Leader','G2',NULL,NULL,NULL,'2024-12-09','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(249,'Ngô Thị Linh','419799','ngothilinh','ngothilinh@aeon.com.vn',NULL,NULL,3,NULL,NULL,NULL,NULL,NULL,'STAFF','General Staff','G1',NULL,NULL,NULL,'2024-12-09','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(250,'Nguyễn Thị Minh Anh','420006','nguyenthiminhanh','nguyenthiminhanh@aeon.com.vn',NULL,NULL,16,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2025-08-23','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(251,'Nguyễn Thị Kim Phượng','420380','nguyenthikimphuong','nguyenthikimphuong@aeon.com.vn',NULL,NULL,16,NULL,NULL,NULL,NULL,NULL,'SUPERVISOR','Store manager','G3',NULL,NULL,NULL,'2025-01-07','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(252,'Nông Thị Thu Hường','420857','nongthithuhuong','nongthithuhuong@aeon.com.vn',NULL,NULL,20,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2025-11-07','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(253,'Nguyễn Mạnh Đức','420932','nguyenmanhduc','nguyenmanhduc@aeon.com.vn',NULL,NULL,28,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2025-02-07','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(254,'Nguyễn Thị Trang Nhung','420933','nguyenthitrangnhung','nguyenthitrangnhung@aeon.com.vn',NULL,NULL,27,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2025-02-07','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(255,'Trần Thị Bích Ngọc','420937','tranthibichngoc','tranthibichngoc@aeon.com.vn',NULL,NULL,3,NULL,NULL,NULL,NULL,NULL,'STAFF','General Staff','G1',NULL,NULL,NULL,'2025-05-27','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(256,'Phạm Thị Thu Thảo','420950','phamthithuthao','phamthithuthao@aeon.com.vn',NULL,NULL,18,NULL,NULL,NULL,NULL,NULL,'STAFF','General Staff','G1',NULL,NULL,NULL,'2025-02-17','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(257,'Ngô Thị Thu Hà','420953','ngothithuha','ngothithuha@aeon.com.vn',NULL,NULL,18,NULL,NULL,NULL,NULL,NULL,'STAFF','General Staff','G1',NULL,NULL,NULL,'2025-02-17','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(258,'Lê Thùy Uyên','420958','lethuyuyen','lethuyuyen@aeon.com.vn',NULL,NULL,9,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2025-02-17','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(259,'Nguyễn Thị Minh Huyền','420999','nguyenthiminhhuyen','nguyenthiminhhuyen@aeon.com.vn',NULL,NULL,5,NULL,NULL,NULL,NULL,NULL,'STAFF','Sales Leader','G2',NULL,NULL,NULL,'2025-02-27','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(260,'Đinh Thị Thăng','421002','dinhthithang','dinhthithang@aeon.com.vn',NULL,NULL,18,NULL,NULL,NULL,NULL,NULL,'STAFF','General Staff','G1',NULL,NULL,NULL,'2025-02-27','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(261,'Đào Thị Trang','421003','daothitrang','daothitrang@aeon.com.vn',NULL,NULL,18,NULL,NULL,NULL,NULL,NULL,'STAFF','General Staff','G1',NULL,NULL,NULL,'2025-02-27','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(262,'Nguyễn Thu Hà','421004','nguyenthuha','nguyenthuha@aeon.com.vn',NULL,NULL,22,NULL,NULL,NULL,NULL,NULL,'STAFF','General Staff','G1',NULL,NULL,NULL,'2025-02-27','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(263,'Nguyễn Hồng Sơn','421006','nguyenhongson','nguyenhongson@aeon.com.vn',NULL,NULL,11,NULL,NULL,NULL,NULL,NULL,'STAFF','General Staff','G1',NULL,NULL,NULL,'2025-02-27','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(264,'Mai Nguyễn Quang Anh','421045','mainguyenquanganh','mainguyenquanganh@aeon.com.vn',NULL,NULL,21,NULL,NULL,NULL,NULL,NULL,'STAFF','General Staff','G1',NULL,NULL,NULL,'2025-02-28','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(265,'Bùi Phương Thảo','421048','buiphuongthao25','buiphuongthao25@aeon.com.vn',NULL,NULL,21,NULL,NULL,NULL,NULL,NULL,'STAFF','General Staff','G1',NULL,NULL,NULL,'2025-02-28','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(266,'Nguyễn Thanh Hiền','421063','nguyenthanhhien','nguyenthanhhien@aeon.com.vn',NULL,NULL,22,NULL,NULL,NULL,NULL,NULL,'STAFF','General Staff','G1',NULL,NULL,NULL,'2025-03-07','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(267,'Tạ Minh Anh','421126','taminhanh','taminhanh@aeon.com.vn',NULL,NULL,8,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2025-03-17','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(268,'Nguyễn Thị Huyền','421238','nguyenthihuyen25','nguyenthihuyen25@aeon.com.vn',NULL,NULL,25,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2025-04-08','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(269,'Trịnh Thị Hương','421239','trinhthihuong','trinhthihuong@aeon.com.vn',NULL,NULL,25,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2025-04-08','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(270,'Nhâm Thúy Quỳnh','421241','nhamthuyquynh','nhamthuyquynh@aeon.com.vn',NULL,NULL,4,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2025-04-08','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(271,'Nguyễn Ngọc Huyền','421278','nguyenngochuyen','nguyenngochuyen@aeon.com.vn',NULL,NULL,5,NULL,NULL,NULL,NULL,NULL,'STAFF','General Staff','G1',NULL,NULL,NULL,'2025-04-17','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(272,'Đào Ngọc Mai','421281','daongocmai','daongocmai@aeon.com.vn',NULL,NULL,23,NULL,NULL,NULL,NULL,NULL,'STAFF','General Staff','G1',NULL,NULL,NULL,'2025-04-17','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(273,'Phạm Quang Toàn','421282','phamquangtoan','phamquangtoan@aeon.com.vn',NULL,NULL,7,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2025-04-17','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(274,'Trần Lê Việt','421283','tranleviet','tranleviet@aeon.com.vn',NULL,NULL,3,NULL,NULL,NULL,NULL,NULL,'SUPERVISOR','Store manager','G3',NULL,NULL,NULL,'2025-04-17','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(275,'Nguyễn Thị Thư','421302','nguyenthithu25','nguyenthithu25@aeon.com.vn',NULL,NULL,15,NULL,NULL,NULL,NULL,NULL,'STAFF','General Staff','G1',NULL,NULL,NULL,'2025-08-23','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(276,'Kiều Xuân Huỳnh','421348','kieuxuanhuynh','kieuxuanhuynh@aeon.com.vn',NULL,NULL,10,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2025-05-07','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(277,'Nguyễn Ngọc Vân','421352','nguyenngocvan','nguyenngocvan@aeon.com.vn',NULL,NULL,5,NULL,NULL,NULL,NULL,NULL,'STAFF','General Staff','G1',NULL,NULL,NULL,'2025-05-07','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(278,'Đỗ Thị Hồng Điệp','421353','dothihongdiep','dothihongdiep@aeon.com.vn',NULL,NULL,11,NULL,NULL,NULL,NULL,NULL,'STAFF','General Staff','G1',NULL,NULL,NULL,'2025-05-07','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(279,'Nguyễn Thị Lan Anh','421359','nguyenthilananh25','nguyenthilananh25@aeon.com.vn',NULL,NULL,5,NULL,NULL,NULL,NULL,NULL,'STAFF','General Staff','G1',NULL,NULL,NULL,'2025-05-12','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(280,'Cát Ngọc Phương','421396','catngocphuong','catngocphuong@aeon.com.vn',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,'STAFF','Sales Leader','G2',NULL,NULL,NULL,'2025-05-17','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(281,'Phạm Thúy Hạnh','421454','phamthuyhanh','phamthuyhanh@aeon.com.vn',NULL,NULL,5,NULL,NULL,NULL,NULL,NULL,'STAFF','General Staff','G1',NULL,NULL,NULL,'2025-05-27','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(282,'Nguyễn Hà Phương','421456','nguyenhaphuong','nguyenhaphuong@aeon.com.vn',NULL,NULL,5,NULL,NULL,NULL,NULL,NULL,'STAFF','General Staff','G1',NULL,NULL,NULL,'2025-05-27','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(283,'Nguyễn Thị Thanh Chúc','421458','nguyenthithanhchuc','nguyenthithanhchuc@aeon.com.vn',NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2025-05-27','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(284,'Nguyễn Thị Thu Thủy','421470','nguyenthithuthuy','nguyenthithuthuy@aeon.com.vn',NULL,NULL,14,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2025-05-27','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(285,'Nguyễn Hồng Anh','421525','nguyenhonganh','nguyenhonganh@aeon.com.vn',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,'STAFF','General Staff','G1',NULL,NULL,NULL,'2025-11-27','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(286,'Nguyễn Thị Việt Chinh','421533','nguyenthivietchinh','nguyenthivietchinh@aeon.com.vn',NULL,NULL,9,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2025-06-07','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(287,'Lê Vũ Hương','421536','levuhuong','levuhuong@aeon.com.vn',NULL,NULL,3,NULL,NULL,NULL,NULL,NULL,'STAFF','General Staff','G1',NULL,NULL,NULL,'2025-06-07','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(288,'Trần Phương Thảo','421538','tranphuongthao','tranphuongthao@aeon.com.vn',NULL,NULL,11,NULL,NULL,NULL,NULL,NULL,'STAFF','General Staff','G1',NULL,NULL,NULL,'2025-06-07','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(289,'Đàm Thị Thúy Quỳnh','421618','damthithuyquynh','damthithuyquynh@aeon.com.vn',NULL,NULL,17,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2025-06-17','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(290,'Trang Thị Tường Vân','421647','trangthituongvan','trangthituongvan@aeon.com.vn',NULL,NULL,17,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2025-06-27','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(291,'Nguyễn Thị Mai','421691','nguyenthimai25','nguyenthimai25@aeon.com.vn',NULL,NULL,NULL,NULL,NULL,NULL,7,NULL,'STAFF','Sales Leader','G2',NULL,NULL,NULL,'2025-07-07','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(292,'Lý Thị Hồng Hảo','421714','lythihonghao','lythihonghao@aeon.com.vn',NULL,NULL,4,NULL,NULL,NULL,NULL,NULL,'STAFF','General Staff','G1',NULL,NULL,NULL,'2025-07-07','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(293,'Nguyễn Xuân Hợp','421725','nguyenxuanhop','nguyenxuanhop@aeon.com.vn',NULL,NULL,14,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2025-07-07','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(294,'Phạm Lê Nhật Minh','421822','phamlenhatminh','phamlenhatminh@aeon.com.vn',NULL,NULL,6,NULL,NULL,NULL,NULL,NULL,'STAFF','General Staff','G1',NULL,NULL,NULL,'2025-07-17','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(295,'Lý Văn Tú','421824','lyvantu','lyvantu@aeon.com.vn',NULL,NULL,3,NULL,NULL,NULL,NULL,NULL,'STAFF','General Staff','G1',NULL,NULL,NULL,'2025-07-17','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:37','2026-01-29 09:04:37'),(296,'Trần Kim Cúc','421843','trankimcuc','trankimcuc@aeon.com.vn',NULL,NULL,9,NULL,NULL,NULL,NULL,NULL,'STAFF','Sales Leader','G2',NULL,NULL,NULL,'2025-07-28','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:38','2026-01-29 09:04:38'),(297,'Dương Chấn Hưng','421868','duongchanhung','duongchanhung@aeon.com.vn',NULL,NULL,14,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2025-07-28','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:38','2026-01-29 09:04:38'),(298,'Phạm Thị Thuyên','421874','phamthithuyen','phamthithuyen@aeon.com.vn',NULL,NULL,6,NULL,NULL,NULL,NULL,NULL,'STAFF','General Staff','G1',NULL,NULL,NULL,'2025-07-28','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:38','2026-01-29 09:04:38'),(299,'Nguyễn Minh Trang','421876','nguyenminhtrang','nguyenminhtrang@aeon.com.vn',NULL,NULL,6,NULL,NULL,NULL,NULL,NULL,'STAFF','General Staff','G1',NULL,NULL,NULL,'2025-07-28','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:38','2026-01-29 09:04:38'),(300,'Quàng Thị Ly','422268','quangthily','quangthily@aeon.com.vn',NULL,NULL,6,NULL,NULL,NULL,NULL,NULL,'STAFF','General Staff','G1',NULL,NULL,NULL,'2025-08-07','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:38','2026-01-29 09:04:38'),(301,'Phạm Thị Mến','422373','phamthimen','phamthimen@aeon.com.vn',NULL,NULL,4,NULL,NULL,NULL,NULL,NULL,'STAFF','General Staff','G1',NULL,NULL,NULL,'2025-08-18','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:38','2026-01-29 09:04:38'),(302,'Đặng Nguyễn Thảo Vi','422472','dangnguyenthaovi','dangnguyenthaovi@aeon.com.vn',NULL,NULL,6,NULL,NULL,NULL,NULL,NULL,'STAFF','General Staff','G1',NULL,NULL,NULL,'2025-08-23','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:38','2026-01-29 09:04:38'),(303,'Đặng Thị Ngọc Ánh','422476','dangthingocanh','dangthingocanh@aeon.com.vn',NULL,NULL,26,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2025-08-23','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:38','2026-01-29 09:04:38'),(304,'Nguyễn Thị Huyền Trang','422628','nguyenthihuyentrang','nguyenthihuyentrang@aeon.com.vn',NULL,NULL,19,NULL,NULL,NULL,NULL,NULL,'STAFF','General Staff','G1',NULL,NULL,NULL,'2025-09-08','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:38','2026-01-29 09:04:38'),(305,'Nguyễn Thuỳ Trang','422850','nguyenthuytrang','nguyenthuytrang@aeon.com.vn',NULL,NULL,21,NULL,NULL,NULL,NULL,NULL,'STAFF','General Staff','G1',NULL,NULL,NULL,'2025-09-17','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:38','2026-01-29 09:04:38'),(306,'Nguyễn Thị Thanh Hậu','422883','nguyenthithanhhau','nguyenthithanhhau@aeon.com.vn',NULL,NULL,20,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2025-11-07','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:38','2026-01-29 09:04:38'),(307,'Vũ Anh Đức','422969','vuanhduc','vuanhduc@aeon.com.vn',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,'STAFF','General Staff','G1',NULL,NULL,NULL,'2025-11-17','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:38','2026-01-29 09:04:38'),(308,'Lê Thái Bình','422985','lethaibinh','lethaibinh@aeon.com.vn',NULL,NULL,14,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2025-09-27','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:38','2026-01-29 09:04:38'),(309,'Nguyễn Thị Nguyệt','422987','nguyenthinguyet','nguyenthinguyet@aeon.com.vn',NULL,NULL,24,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2025-09-27','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:38','2026-01-29 09:04:38'),(310,'Dương Quang Nhật','422992','duongquangnhat','duongquangnhat@aeon.com.vn',NULL,NULL,15,NULL,NULL,NULL,NULL,NULL,'STAFF','General Staff','G1',NULL,NULL,NULL,'2025-09-27','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:38','2026-01-29 09:04:38'),(311,'Nguyễn Thị Xuân Mai','423175','nguyenthixuanmai','nguyenthixuanmai@aeon.com.vn',NULL,NULL,14,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2025-10-08','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:38','2026-01-29 09:04:38'),(312,'Phạm Thị Nhung','423375','phamthinhung','phamthinhung@aeon.com.vn',NULL,NULL,NULL,NULL,NULL,NULL,7,NULL,'STAFF','Sales Leader','G2',NULL,NULL,NULL,'2025-11-07','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:38','2026-01-29 09:04:38'),(313,'Nguyễn Tiến Đạt','423413','nguyentiendat25','nguyentiendat25@aeon.com.vn',NULL,NULL,18,NULL,NULL,NULL,NULL,NULL,'STAFF','General Staff','G1',NULL,NULL,NULL,'2025-11-07','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:38','2026-01-29 09:04:38'),(314,'Nguyễn Hồng Hạnh','423557','nguyenhonghanh25','nguyenhonghanh25@aeon.com.vn',NULL,NULL,22,NULL,NULL,NULL,NULL,NULL,'STAFF','General Staff','G1',NULL,NULL,NULL,'2025-11-17','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:38','2026-01-29 09:04:38'),(315,'Nguyễn Thị Ly','423608','nguyenthily','nguyenthily@aeon.com.vn',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,'STAFF','General Staff','G1',NULL,NULL,NULL,'2025-11-17','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:38','2026-01-29 09:04:38'),(316,'Phạm Thị Thanh Hồng','423769','phamthithanhhong','phamthithanhhong@aeon.com.vn',NULL,NULL,15,NULL,NULL,NULL,NULL,NULL,'STAFF','General Staff','G1',NULL,NULL,NULL,'2025-12-08','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:38','2026-01-29 09:04:38'),(317,'Mai Tiến Dũng','423775','maitiendung','maitiendung@aeon.com.vn',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,'STAFF','General Staff','G1',NULL,NULL,NULL,'2025-12-08','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:38','2026-01-29 09:04:38'),(318,'Phạm Thị Linh','423778','phamthilinh','phamthilinh@aeon.com.vn',NULL,NULL,NULL,NULL,NULL,NULL,7,NULL,'SUPERVISOR','Store Manager','G3',NULL,NULL,NULL,'2025-12-08','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:38','2026-01-29 09:04:38'),(319,'Huỳnh Thị Hồng Nhạn','423786','huynhthihongnhan','huynhthihongnhan@aeon.com.vn',NULL,NULL,23,NULL,NULL,NULL,NULL,NULL,'STAFF','General Staff','G1',NULL,NULL,NULL,'2025-12-08','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:38','2026-01-29 09:04:38'),(320,'Nguyễn Thị Ngọc Diệp','423876','nguyenthingocdiep','nguyenthingocdiep@aeon.com.vn',NULL,NULL,15,NULL,NULL,NULL,NULL,NULL,'STAFF','General Staff','G1',NULL,NULL,NULL,'2025-12-17','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:38','2026-01-29 09:04:38'),(321,'Nguyễn Thế Hoàng','423881','nguyenthehoang','nguyenthehoang@aeon.com.vn',NULL,NULL,28,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2025-12-17','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:38','2026-01-29 09:04:38'),(322,'Lê Hoàng Anh','423882','lehoanganh','lehoanganh@aeon.com.vn',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,'STAFF','General Staff','G1',NULL,NULL,NULL,'2025-12-17','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:38','2026-01-29 09:04:38'),(323,'Võ Thị Xuân Quỳnh','423884','vothixuanquynh','vothixuanquynh@aeon.com.vn',NULL,NULL,9,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2025-12-17','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:38','2026-01-29 09:04:38'),(324,'Nguyễn Đặng Hạnh Nguyên','423969','nguyendanghanhnguyen','nguyendanghanhnguyen@aeon.com.vn',NULL,NULL,26,NULL,NULL,NULL,NULL,NULL,'STAFF','General Staff','G1',NULL,NULL,NULL,'2025-12-27','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:38','2026-01-29 09:04:38'),(325,'Nguyễn Thị Diễm Hương','424068','nguyenthidiemhuong','nguyenthidiemhuong@aeon.com.vn',NULL,NULL,15,NULL,NULL,NULL,NULL,NULL,'STAFF','General Staff','G1',NULL,NULL,NULL,'2026-01-07','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:38','2026-01-29 09:04:38'),(326,'Đào Thu Hương','424107','daothuhuong','daothuhuong@aeon.com.vn',NULL,NULL,17,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2026-01-17','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:38','2026-01-29 09:04:38'),(327,'Bùi Thị Anh Thương','424108','buithianhthuong','buithianhthuong@aeon.com.vn',NULL,NULL,21,NULL,NULL,NULL,NULL,NULL,'STAFF','General Staff','G1',NULL,NULL,NULL,'2026-01-17','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:38','2026-01-29 09:04:38'),(328,'Đinh Thị Ngọc Thảo','424109','dinhthingocthao','dinhthingocthao@aeon.com.vn',NULL,NULL,26,NULL,NULL,NULL,NULL,NULL,'STAFF','General Staff','G1',NULL,NULL,NULL,'2026-01-17','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:38','2026-01-29 09:04:38'),(329,'Nguyễn Đức Hà Sơn','424560','nguyenduchason','nguyenduchason@aeon.com.vn',NULL,NULL,25,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2026-01-27','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:38','2026-01-29 09:04:38'),(330,'Nguyễn Thị Lê Na','424562','nguyenthilena','nguyenthilena@aeon.com.vn',NULL,NULL,26,NULL,NULL,NULL,NULL,NULL,'STAFF','General staff','G1',NULL,NULL,NULL,'2026-01-27','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:38','2026-01-29 09:04:38'),(331,'Nông Thị Kim Ngọc','419890','nongthikimngoc','nongthikimngoc@aeon.com.vn',NULL,NULL,27,NULL,NULL,NULL,NULL,NULL,'STAFF','Parttime staff','G1',NULL,NULL,NULL,'2026-01-17','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:38','2026-01-29 09:04:38'),(332,'Nguyễn Thu Hoài','424111','nguyenthuhoai','nguyenthuhoai@aeon.com.vn',NULL,NULL,13,NULL,NULL,NULL,NULL,NULL,'STAFF','Parttime staff','G1',NULL,NULL,NULL,'2026-01-17','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:38','2026-01-29 09:04:38'),(333,'Hạ Thị Thanh','424536','hathithanh','hathithanh@aeon.com.vn',NULL,NULL,9,NULL,NULL,NULL,NULL,NULL,'STAFF','Parttime staff','G1',NULL,NULL,NULL,'2026-01-27','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:38','2026-01-29 09:04:38'),(334,'Nguyễn Thu Hương','417638','nguyenthuhuong','nguyenthuhuong@aeon.com.vn',NULL,NULL,23,NULL,NULL,NULL,NULL,NULL,'STAFF','Parttime staff','G1',NULL,NULL,NULL,'2024-12-27','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:38','2026-01-29 09:04:38'),(335,'Nguyễn Thị Phương Nhung','417745','nguyenthiphuongnhung','nguyenthiphuongnhung@aeon.com.vn',NULL,NULL,12,NULL,NULL,NULL,NULL,NULL,'STAFF','Parttime staff','G1',NULL,NULL,NULL,'2025-08-07','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:38','2026-01-29 09:04:38'),(336,'Nguyễn Thị Hằng','419123','nguyenthihang','nguyenthihang@aeon.com.vn',NULL,NULL,12,NULL,NULL,NULL,NULL,NULL,'STAFF','Parttime staff','G1',NULL,NULL,NULL,'2024-12-27','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:38','2026-01-29 09:04:38'),(337,'Bùi Thị Hồng Hạnh','419466','buithihonghanh','buithihonghanh@aeon.com.vn',NULL,NULL,6,NULL,NULL,NULL,NULL,NULL,'STAFF','Parttime staff','G1',NULL,NULL,NULL,'2025-10-08','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:38','2026-01-29 09:04:38'),(338,'Dương An Huy','419693','duonganhuy','duonganhuy@aeon.com.vn',NULL,NULL,7,NULL,NULL,NULL,NULL,NULL,'STAFF','Parttime staff','G1',NULL,NULL,NULL,'2025-12-17','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:38','2026-01-29 09:04:38'),(339,'Nguyễn Mai Hiên','419786','nguyenmaihien','nguyenmaihien@aeon.com.vn',NULL,NULL,14,NULL,NULL,NULL,NULL,NULL,'STAFF','Parttime staff','G1',NULL,NULL,NULL,'2024-12-27','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:38','2026-01-29 09:04:38'),(340,'Bùi Thị Hải Vân','419787','buithihaivan','buithihaivan@aeon.com.vn',NULL,NULL,28,NULL,NULL,NULL,NULL,NULL,'STAFF','Parttime staff','G1',NULL,NULL,NULL,'2025-01-07','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:38','2026-01-29 09:04:38'),(341,'Lưu Ngọc Anh Dương','419915','luungocanhduong','luungocanhduong@aeon.com.vn',NULL,NULL,9,NULL,NULL,NULL,NULL,NULL,'STAFF','Parttime staff','G1',NULL,NULL,NULL,'2025-12-17','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:38','2026-01-29 09:04:38'),(342,'Vũ Thị Lộc','420426','vuthiloc','vuthiloc@aeon.com.vn',NULL,NULL,25,NULL,NULL,NULL,NULL,NULL,'STAFF','Parttime staff','G1',NULL,NULL,NULL,'2025-09-17','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:38','2026-01-29 09:04:38'),(343,'Nguyễn Thị Hà Ly','420974','nguyenthihaly','nguyenthihaly@aeon.com.vn',NULL,NULL,4,NULL,NULL,NULL,NULL,NULL,'STAFF','Parttime staff','G1',NULL,NULL,NULL,'2025-02-17','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:38','2026-01-29 09:04:38'),(344,'Vũ Thị Ngọc','421042','vuthingoc','vuthingoc@aeon.com.vn',NULL,NULL,18,NULL,NULL,NULL,NULL,NULL,'STAFF','Parttime staff','G1',NULL,NULL,NULL,'2025-02-27','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:38','2026-01-29 09:04:38'),(345,'Hoàng Văn Sáng','421065','hoangvansang','hoangvansang@aeon.com.vn',NULL,NULL,9,NULL,NULL,NULL,NULL,NULL,'STAFF','Parttime staff','G1',NULL,NULL,NULL,'2025-03-07','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:38','2026-01-29 09:04:38'),(346,'Phạm Lê Xuân Hương','421286','phamlexuanhuong','phamlexuanhuong@aeon.com.vn',NULL,NULL,14,NULL,NULL,NULL,NULL,NULL,'STAFF','Parttime staff','G1',NULL,NULL,NULL,'2025-04-17','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:38','2026-01-29 09:04:38'),(347,'Nguyễn Thị Hải Yến','421351','nguyenthihaiyen25','nguyenthihaiyen25@aeon.com.vn',NULL,NULL,16,NULL,NULL,NULL,NULL,NULL,'STAFF','Parttime staff','G1',NULL,NULL,NULL,'2025-09-17','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:38','2026-01-29 09:04:38'),(348,'Đỗ Hồng Dương','421619','dohongduong','dohongduong@aeon.com.vn',NULL,NULL,3,NULL,NULL,NULL,NULL,NULL,'STAFF','Parttime staff','G1',NULL,NULL,NULL,'2025-06-17','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:38','2026-01-29 09:04:38'),(349,'Bùi Văn Việt','421731','buivanviet','buivanviet@aeon.com.vn',NULL,NULL,19,NULL,NULL,NULL,NULL,NULL,'STAFF','Parttime staff','G1',NULL,NULL,NULL,'2025-07-07','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:38','2026-01-29 09:04:38'),(350,'Bùi Thị Phương Thùy','421734','buithiphuongthuy','buithiphuongthuy@aeon.com.vn',NULL,NULL,22,NULL,NULL,NULL,NULL,NULL,'STAFF','Parttime staff','G1',NULL,NULL,NULL,'2025-07-07','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:38','2026-01-29 09:04:38'),(351,'Tăng Duy Anh','421818','tangduyanh','tangduyanh@aeon.com.vn',NULL,NULL,18,NULL,NULL,NULL,NULL,NULL,'STAFF','Parttime staff','G1',NULL,NULL,NULL,'2025-07-17','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:38','2026-01-29 09:04:38'),(352,'Đặng Hải Linh','422375','danghailinh','danghailinh@aeon.com.vn',NULL,NULL,21,NULL,NULL,NULL,NULL,NULL,'STAFF','Parttime staff','G1',NULL,NULL,NULL,'2025-08-18','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:38','2026-01-29 09:04:38'),(353,'Hoàng Văn Huy','422469','hoangvanhuy','hoangvanhuy@aeon.com.vn',NULL,NULL,7,NULL,NULL,NULL,NULL,NULL,'STAFF','Parttime staff','G1',NULL,NULL,NULL,'2025-08-23','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:38','2026-01-29 09:04:38'),(354,'Nguyễn Phương Linh','422470','nguyenphuonglinh','nguyenphuonglinh@aeon.com.vn',NULL,NULL,7,NULL,NULL,NULL,NULL,NULL,'STAFF','Parttime staff','G1',NULL,NULL,NULL,'2025-08-23','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:38','2026-01-29 09:04:38'),(355,'Hoàng Anh Văn','422667','hoanganhvan','hoanganhvan@aeon.com.vn',NULL,NULL,16,NULL,NULL,NULL,NULL,NULL,'STAFF','Parttime staff','G1',NULL,NULL,NULL,'2025-12-27','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:38','2026-01-29 09:04:38'),(356,'Bùi Lã Mai Anh','423256','builamaianh','builamaianh@aeon.com.vn',NULL,NULL,8,NULL,NULL,NULL,NULL,NULL,'STAFF','Parttime staff','G1',NULL,NULL,NULL,'2025-10-17','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:38','2026-01-29 09:04:38'),(357,'Nguyễn Thị Phương Oanh','423304','nguyenthiphuongoanh','nguyenthiphuongoanh@aeon.com.vn',NULL,NULL,12,NULL,NULL,NULL,NULL,NULL,'STAFF','Parttime staff','G1',NULL,NULL,NULL,'2025-11-07','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:38','2026-01-29 09:04:38'),(358,'Nguyễn Thái Dương','423305','nguyenthaiduong','nguyenthaiduong@aeon.com.vn',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,'STAFF','Parttime staff','G1',NULL,NULL,NULL,'2025-10-27','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:38','2026-01-29 09:04:38'),(359,'Vũ Thị Hà Vy','423307','vuthihavy','vuthihavy@aeon.com.vn',NULL,NULL,21,NULL,NULL,NULL,NULL,NULL,'STAFF','Parttime staff','G1',NULL,NULL,NULL,'2025-10-27','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:38','2026-01-29 09:04:38'),(360,'Nguyễn Hải Yến Nhi','423713','nguyenhaiyennhi','nguyenhaiyennhi@aeon.com.vn',NULL,NULL,20,NULL,NULL,NULL,NULL,NULL,'STAFF','Parttime staff','G1',NULL,NULL,NULL,'2025-11-27','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:38','2026-01-29 09:04:38'),(361,'Trần Khánh Lam','423889','trankhanhlam','trankhanhlam@aeon.com.vn',NULL,NULL,26,NULL,NULL,NULL,NULL,NULL,'STAFF','Parttime staff','G1',NULL,NULL,NULL,'2025-12-17','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:38','2026-01-29 09:04:38'),(362,'Hoàng Tuấn Kiệt','423890','hoangtuankiet','hoangtuankiet@aeon.com.vn',NULL,NULL,24,NULL,NULL,NULL,NULL,NULL,'STAFF','Parttime staff','G1',NULL,NULL,NULL,'2025-12-17','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:38','2026-01-29 09:04:38'),(363,'Trương Thế Lương','423963','truongtheluong','truongtheluong@aeon.com.vn',NULL,NULL,20,NULL,NULL,NULL,NULL,NULL,'STAFF','Parttime staff','G1',NULL,NULL,NULL,'2026-01-17','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:38','2026-01-29 09:04:38'),(364,'Lê Minh Quân','423965','leminhquan','leminhquan@aeon.com.vn',NULL,NULL,15,NULL,NULL,NULL,NULL,NULL,'STAFF','Parttime staff','G1',NULL,NULL,NULL,'2025-12-27','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:38','2026-01-29 09:04:38'),(365,'Nguyễn Thị  Kim Thoa','423968','nguyenthikimthoa','nguyenthikimthoa@aeon.com.vn',NULL,NULL,3,NULL,NULL,NULL,NULL,NULL,'STAFF','Parttime staff','G1',NULL,NULL,NULL,'2025-12-27','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:38','2026-01-29 09:04:38'),(366,'Nguyễn Công Quyền','424110','nguyencongquyen','nguyencongquyen@aeon.com.vn',NULL,NULL,19,NULL,NULL,NULL,NULL,NULL,'STAFF','Parttime staff','G1',NULL,NULL,NULL,'2026-01-17','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:38','2026-01-29 09:04:38'),(367,'Nguyễn Xuân Minh Phú','424602','nguyenxuanminhphu','nguyenxuanminhphu@aeon.com.vn',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,'STAFF','Parttime staff','G1',NULL,NULL,NULL,'2026-01-29','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:38','2026-01-29 09:04:38'),(368,'Yoshinaga Shinichi','HQ001','yoshinaga','yoshinaga@aeon.com.vn',NULL,'0901234567',NULL,NULL,NULL,NULL,100,NULL,'ADMIN','General Manager','G6',NULL,NULL,NULL,'2020-01-15','$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:38','2026-01-29 09:33:59'),(369,'Admin System','SYS001','admin','admin@aeon.com.vn',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'SYSTEM_ADMIN','System Administrator',NULL,NULL,NULL,NULL,NULL,'$2y$10$idvzmZcmOvwlHM8JgODnBO1/N.wiBpIJv/nDJKS04rlvkryp9BqsW','active',1,'2026-01-29 09:04:38','2026-01-29 09:04:38');
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
  `assignment_type` enum('primary','acting') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'primary',
  `scope_type` enum('region','zone','area','store') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `scope_id` int NOT NULL,
  `effective_grade` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
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
  `store_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `store_code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `region_id` int DEFAULT NULL,
  `area_id` int DEFAULT NULL,
  `address` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `sort_order` int DEFAULT '0',
  `manager_id` int DEFAULT NULL,
  `status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'active',
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
INSERT INTO `stores` VALUES (1,'MAXVALU CIPUTRA','MV-CIPUTRA',1,1,NULL,NULL,NULL,1,0,NULL,'active','2026-01-29 09:04:36','2026-01-29 09:04:36'),(2,'MAXVALU ECOPARK','MV-ECOPARK',1,1,NULL,NULL,NULL,1,0,NULL,'active','2026-01-29 09:04:36','2026-01-29 09:04:36'),(3,'MAXVALU ECOPARK 3','MV-ECOPARK-3',1,1,NULL,NULL,NULL,1,0,NULL,'active','2026-01-29 09:04:36','2026-01-29 09:04:36'),(4,'MAXVALU FIVE STAR','MV-FIVE-STAR',1,1,NULL,NULL,NULL,1,0,NULL,'active','2026-01-29 09:04:36','2026-01-29 09:04:36'),(5,'MAXVALU HAVENPARK','MV-HAVENPARK',1,1,NULL,NULL,NULL,1,0,NULL,'active','2026-01-29 09:04:36','2026-01-29 09:04:36'),(6,'MAXVALU HAWAII','MV-HAWAII',1,1,NULL,NULL,NULL,1,0,NULL,'active','2026-01-29 09:04:36','2026-01-29 09:04:36'),(7,'MAXVALU HORIZON','MV-HORIZON',1,1,NULL,NULL,NULL,1,0,NULL,'active','2026-01-29 09:04:36','2026-01-29 09:04:36'),(8,'MAXVALU HYUNDAI','MV-HYUNDAI',1,1,NULL,NULL,NULL,1,0,NULL,'active','2026-01-29 09:04:36','2026-01-29 09:04:36'),(9,'MAXVALU KOSMO','MV-KOSMO',1,1,NULL,NULL,NULL,1,0,NULL,'active','2026-01-29 09:04:36','2026-01-29 09:04:36'),(10,'MAXVALU LA CASTA','MV-LA-CASTA',1,1,NULL,NULL,NULL,1,0,NULL,'active','2026-01-29 09:04:36','2026-01-29 09:04:36'),(11,'MAXVALU LANDMARK','MV-LANDMARK',1,1,NULL,NULL,NULL,1,0,NULL,'active','2026-01-29 09:04:36','2026-01-29 09:04:36'),(12,'MAXVALU LINH DAM','MV-LINH-DAM',1,1,NULL,NULL,NULL,1,0,NULL,'active','2026-01-29 09:04:36','2026-01-29 09:04:36'),(13,'MAXVALU LINH NAM','MV-LINH-NAM',1,1,NULL,NULL,NULL,1,0,NULL,'active','2026-01-29 09:04:37','2026-01-29 09:04:37'),(14,'MAXVALU LOTUS','MV-LOTUS',1,1,NULL,NULL,NULL,1,0,NULL,'active','2026-01-29 09:04:37','2026-01-29 09:04:37'),(15,'MAXVALU MASTERI SMART CITY','MV-MASTERI-SMART-CITY',1,1,NULL,NULL,NULL,1,0,NULL,'active','2026-01-29 09:04:37','2026-01-29 09:04:37'),(16,'MAXVALU NAM TRUNG YEN','MV-NAM-TRUNG-YEN',1,1,NULL,NULL,NULL,1,0,NULL,'active','2026-01-29 09:04:37','2026-01-29 09:04:37'),(17,'MAXVALU OCEAN PARK','MV-OCEAN-PARK',1,1,NULL,NULL,NULL,1,0,NULL,'active','2026-01-29 09:04:37','2026-01-29 09:04:37'),(18,'MAXVALU OCEANPARK MASTERI','MV-OCEANPARK-MASTERI',1,1,NULL,NULL,NULL,1,0,NULL,'active','2026-01-29 09:04:37','2026-01-29 09:04:37'),(19,'MAXVALU OCEANPARK SAPPHIRE','MV-OCEANPARK-SAPPHIRE',1,1,NULL,NULL,NULL,1,0,NULL,'active','2026-01-29 09:04:37','2026-01-29 09:04:37'),(20,'MAXVALU RIVERSIDE','MV-RIVERSIDE',1,1,NULL,NULL,NULL,1,0,NULL,'active','2026-01-29 09:04:37','2026-01-29 09:04:37'),(21,'MAXVALU ROYAL CITY','MV-ROYAL-CITY',1,1,NULL,NULL,NULL,1,0,NULL,'active','2026-01-29 09:04:37','2026-01-29 09:04:37'),(22,'MAXVALU SKYOASIS','MV-SKYOASIS',1,1,NULL,NULL,NULL,1,0,NULL,'active','2026-01-29 09:04:37','2026-01-29 09:04:37'),(23,'MAXVALU SYMPHONY','MV-SYMPHONY',1,1,NULL,NULL,NULL,1,0,NULL,'active','2026-01-29 09:04:37','2026-01-29 09:04:37'),(24,'MAXVALU THANG LONG NO1','MV-THANG-LONG-NO1',1,1,NULL,NULL,NULL,1,0,NULL,'active','2026-01-29 09:04:37','2026-01-29 09:04:37'),(25,'MAXVALU THE FIVE','MV-THE-FIVE',1,1,NULL,NULL,NULL,1,0,NULL,'active','2026-01-29 09:04:37','2026-01-29 09:04:37'),(26,'MAXVALU WEST POINT','MV-WEST-POINT',1,1,NULL,NULL,NULL,1,0,NULL,'active','2026-01-29 09:04:37','2026-01-29 09:04:37'),(27,'MAXVALU WESTBAY','MV-WESTBAY',1,1,NULL,NULL,NULL,1,0,NULL,'active','2026-01-29 09:04:37','2026-01-29 09:04:37'),(28,'MAXVALU ZEN PARK','MV-ZEN-PARK',1,1,NULL,NULL,NULL,1,0,NULL,'active','2026-01-29 09:04:37','2026-01-29 09:04:37');
/*!40000 ALTER TABLE `stores` ENABLE KEYS */;
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
  `step_name` enum('SUBMIT','APPROVE','DO_TASK','CHECK') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `step_status` enum('submitted','done','in_process','rejected','pending') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `assigned_to_type` enum('user','stores','team') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `assigned_to_id` bigint unsigned DEFAULT NULL,
  `assigned_to_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `assigned_to_count` int unsigned DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `actual_start_at` timestamp NULL DEFAULT NULL,
  `actual_end_at` timestamp NULL DEFAULT NULL,
  `progress_done` int unsigned DEFAULT '0',
  `progress_total` int unsigned DEFAULT '0',
  `comment` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_task_round` (`task_id`,`round_number`),
  KEY `idx_task_step` (`task_id`,`step_number`),
  CONSTRAINT `fk_task_approval_history_task` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`task_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `task_approval_history`
--

LOCK TABLES `task_approval_history` WRITE;
/*!40000 ALTER TABLE `task_approval_history` DISABLE KEYS */;
/*!40000 ALTER TABLE `task_approval_history` ENABLE KEYS */;
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
  `notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
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
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
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
-- Table structure for table `task_execution_logs`
--

DROP TABLE IF EXISTS `task_execution_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `task_execution_logs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `task_store_assignment_id` bigint unsigned NOT NULL COMMENT 'FK to task_store_assignments',
  `action` enum('dispatched','assigned_to_staff','reassigned','unassigned','started','completed','marked_unable','hq_checked','hq_rejected') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Type of action performed',
  `performed_by` int NOT NULL COMMENT 'Staff ID who performed this action',
  `performed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'When action was performed',
  `old_status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Previous status before action',
  `new_status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'New status after action',
  `target_staff_id` int DEFAULT NULL COMMENT 'For assign/reassign: the staff being assigned',
  `notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT 'Additional notes, reasons, etc.',
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
-- Table structure for table `task_groups`
--

DROP TABLE IF EXISTS `task_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `task_groups` (
  `group_id` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `group_code` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `group_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `priority` int DEFAULT '50',
  `sort_order` int DEFAULT '0',
  `color_bg` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT '#f3f4f6',
  `color_text` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT '#374151',
  `color_border` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT '#9ca3af',
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
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image_url` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `thumbnail_url` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
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
--

DROP TABLE IF EXISTS `task_library`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `task_library` (
  `task_library_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `source` enum('task_list','library') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'task_list' COMMENT 'task_list=auto-saved when task approved, library=created directly',
  `status` enum('draft','approve','available','cooldown') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'available' COMMENT 'draft/approve only for direct Library creation (Flow 2)',
  `task_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `task_description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `task_type_id` int DEFAULT NULL COMMENT 'FK to code_master',
  `response_type_id` int DEFAULT NULL COMMENT 'FK to code_master',
  `response_num` int DEFAULT NULL,
  `is_repeat` tinyint(1) DEFAULT '0',
  `repeat_config` json DEFAULT NULL,
  `dept_id` int DEFAULT NULL COMMENT 'FK to departments',
  `task_instruction_type` enum('image','document') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'image',
  `manual_link` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `photo_guidelines` json DEFAULT NULL,
  `manual_id` int DEFAULT NULL COMMENT 'FK to manual_documents',
  `comment` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `attachments` json DEFAULT NULL,
  `created_staff_id` int DEFAULT NULL,
  `approver_id` int DEFAULT NULL,
  `submitted_at` timestamp NULL DEFAULT NULL,
  `approved_at` timestamp NULL DEFAULT NULL,
  `rejection_count` int DEFAULT '0',
  `has_changes_since_rejection` tinyint(1) DEFAULT '0',
  `last_rejection_reason` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `last_rejected_at` timestamp NULL DEFAULT NULL,
  `last_rejected_by` int DEFAULT NULL,
  `dispatch_count` int DEFAULT '0',
  `last_dispatched_at` timestamp NULL DEFAULT NULL,
  `last_dispatched_by` int DEFAULT NULL,
  `cooldown_until` timestamp NULL DEFAULT NULL,
  `cooldown_triggered_by` int DEFAULT NULL,
  `cooldown_triggered_at` timestamp NULL DEFAULT NULL,
  `had_issues` tinyint(1) DEFAULT '0',
  `issues_note` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `original_task_id` int DEFAULT NULL,
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
-- Dumping data for table `task_library`
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
  `status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'not_started',
  `progress` int DEFAULT '0',
  `progress_text` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
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
-- Table structure for table `task_store_assignments`
--

DROP TABLE IF EXISTS `task_store_assignments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `task_store_assignments` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `task_id` int NOT NULL,
  `store_id` int NOT NULL,
  `status` enum('not_yet','on_progress','done_pending','done','unable') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'not_yet' COMMENT 'Store execution status',
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
  `check_notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT 'Notes from HQ checker',
  `unable_reason` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT 'Required reason when status=unable',
  `notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT 'General notes',
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
  CONSTRAINT `fk_tsa_assigned_by` FOREIGN KEY (`assigned_by`) REFERENCES `staff` (`staff_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_tsa_assigned_to_staff` FOREIGN KEY (`assigned_to_staff`) REFERENCES `staff` (`staff_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_tsa_checked_by` FOREIGN KEY (`checked_by`) REFERENCES `staff` (`staff_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_tsa_completed_by` FOREIGN KEY (`completed_by`) REFERENCES `staff` (`staff_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_tsa_started_by` FOREIGN KEY (`started_by`) REFERENCES `staff` (`staff_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_tsa_store` FOREIGN KEY (`store_id`) REFERENCES `stores` (`store_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_tsa_task` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`task_id`) ON DELETE CASCADE
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
-- Table structure for table `task_store_results`
--

DROP TABLE IF EXISTS `task_store_results`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `task_store_results` (
  `result_id` int NOT NULL AUTO_INCREMENT,
  `task_id` int DEFAULT NULL,
  `store_id` int DEFAULT NULL,
  `status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'not_started',
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
  `step_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `assignee_id` int DEFAULT NULL,
  `skip_info` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `comment` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
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
  `source` enum('task_list','library','todo_task') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'task_list',
  `receiver_type` enum('store','hq_user') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'store',
  `task_name` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `task_description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `task_instruction_type` enum('image','document') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'image' COMMENT 'Type determines required fields: image=photo_guidelines, document=note',
  `manual_link` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Direct URL link to manual/instruction document',
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
  `priority` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'normal',
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `start_time` time DEFAULT NULL,
  `due_datetime` timestamp NULL DEFAULT NULL,
  `completed_time` timestamp NULL DEFAULT NULL,
  `comment` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `attachments` json DEFAULT NULL,
  `created_staff_id` int DEFAULT NULL,
  `approver_id` int DEFAULT NULL,
  `rejection_count` int DEFAULT '0',
  `has_changes_since_rejection` tinyint(1) DEFAULT '0',
  `last_rejection_reason` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
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
  CONSTRAINT `fk_tasks_library` FOREIGN KEY (`library_task_id`) REFERENCES `task_library` (`task_library_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_tasks_manual` FOREIGN KEY (`manual_id`) REFERENCES `manuals` (`manual_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_tasks_parent` FOREIGN KEY (`parent_task_id`) REFERENCES `tasks` (`task_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_tasks_paused_by` FOREIGN KEY (`paused_by`) REFERENCES `staff` (`staff_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_tasks_response_type` FOREIGN KEY (`response_type_id`) REFERENCES `code_master` (`code_master_id`),
  CONSTRAINT `fk_tasks_status` FOREIGN KEY (`status_id`) REFERENCES `code_master` (`code_master_id`),
  CONSTRAINT `fk_tasks_task_type` FOREIGN KEY (`task_type_id`) REFERENCES `code_master` (`code_master_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tasks`
--

LOCK TABLES `tasks` WRITE;
/*!40000 ALTER TABLE `tasks` DISABLE KEYS */;
/*!40000 ALTER TABLE `tasks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `teams`
--

DROP TABLE IF EXISTS `teams`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teams` (
  `team_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `team_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `department_id` int DEFAULT NULL,
  `icon` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `icon_color` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `icon_bg` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
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
  `zone_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `zone_code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `region_id` int NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
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
-- Dumping events for database 'auraorie68aa_aoisora'
--

--
-- Dumping routines for database 'auraorie68aa_aoisora'
--

--
-- Current Database: `auraorie68aa_aoisora`
--

USE `auraorie68aa_aoisora`;

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

-- Dump completed on 2026-01-29 16:34:39
