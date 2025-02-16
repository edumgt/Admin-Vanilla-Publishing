-- --------------------------------------------------------
-- 호스트:                          127.0.0.1
-- 서버 버전:                        10.9.5-MariaDB - mariadb.org binary distribution
-- 서버 OS:                        Win64
-- HeidiSQL 버전:                  11.3.0.6295
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- bbs 데이터베이스 구조 내보내기
CREATE DATABASE IF NOT EXISTS `bbs` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `bbs`;

-- 테이블 bbs.bbs 구조 내보내기
CREATE TABLE IF NOT EXISTS `bbs` (
  `seq` int(11) NOT NULL AUTO_INCREMENT,
  `id` varchar(50) DEFAULT NULL,
  `ref` varchar(50) DEFAULT NULL,
  `step` varchar(50) DEFAULT NULL,
  `depth` varchar(50) DEFAULT NULL,
  `title` varchar(50) DEFAULT NULL,
  `content` varchar(50) DEFAULT NULL,
  `created_at` varchar(50) DEFAULT NULL,
  `del` varchar(50) DEFAULT NULL,
  `read_count` varchar(50) DEFAULT NULL,
  KEY `인덱스 1` (`seq`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 테이블 데이터 bbs.bbs:~6 rows (대략적) 내보내기
DELETE FROM `bbs`;
/*!40000 ALTER TABLE `bbs` DISABLE KEYS */;
INSERT INTO `bbs` (`seq`, `id`, `ref`, `step`, `depth`, `title`, `content`, `created_at`, `del`, `read_count`) VALUES
	(1, 'test0002', '1', '0', '0', '하가다가라라자다아라랄', '거러러거아라랄\n가라가가가가', '2023-08-13 11:12:26', '0', '6'),
	(2, 'test0004', '2', '0', '0', 'adaasdasd', 'asdasdasdasd', '2023-08-18 06:30:56', '0', '1'),
	(1, 'test0002', '1', '0', '0', '하가다가라라자다아라랄', '거러러거아라랄\n가라가가가가', '2023-08-13 11:12:26', '0', '6'),
	(2, 'test0004', '2', '0', '0', 'adaasdasd', 'asdasdasdasd', '2023-08-18 06:30:56', '0', '1'),
	(1, 'test0002', '1', '0', '0', '하가다가라라자다아라랄', '거러러거아라랄\n가라가가가가', '2023-08-13 11:12:26', '0', '6'),
	(2, 'test0004', '2', '0', '0', 'adaasdasd', 'asdasdasdasd', '2023-08-18 06:30:56', '0', '1');
/*!40000 ALTER TABLE `bbs` ENABLE KEYS */;

-- 테이블 bbs.booking 구조 내보내기
CREATE TABLE IF NOT EXISTS `booking` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `room_number` varchar(10) NOT NULL,
  `guest_name` varchar(100) NOT NULL,
  `check_in_date` date NOT NULL,
  `check_out_date` date NOT NULL,
  `arrival_time` time NOT NULL,
  `departure_time` time NOT NULL,
  `cost` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 테이블 데이터 bbs.booking:~10 rows (대략적) 내보내기
DELETE FROM `booking`;
/*!40000 ALTER TABLE `booking` DISABLE KEYS */;
INSERT INTO `booking` (`id`, `room_number`, `guest_name`, `check_in_date`, `check_out_date`, `arrival_time`, `departure_time`, `cost`, `created_at`) VALUES
	(1, '1-1', '홍길동', '2025-01-05', '2025-01-07', '15:30:00', '18:30:00', 200000, '2025-02-16 20:55:42'),
	(2, '1-1', 'Tom', '2025-01-05', '2025-01-10', '15:30:00', '18:30:00', 100000, '2025-02-16 20:55:42'),
	(3, '1-1', 'Alice', '2025-01-15', '2025-01-20', '14:00:00', '12:00:00', 300000, '2025-02-16 20:55:42'),
	(4, '1-1', 'Bob', '2025-02-01', '2025-02-05', '16:00:00', '11:00:00', 150000, '2025-02-16 20:55:42'),
	(5, '1-1', 'Eve', '2025-02-10', '2025-02-15', '17:00:00', '10:00:00', 250000, '2025-02-16 20:55:42'),
	(6, '1-2', '이고소', '2025-02-15', '2025-02-17', '15:30:00', '18:30:00', 200000, '2025-02-16 20:58:28'),
	(7, '1-2', 'Tom', '2025-01-05', '2025-01-10', '15:30:00', '18:30:00', 100000, '2025-02-16 20:58:28'),
	(8, '1-2', 'Alice', '2025-01-15', '2025-01-20', '14:00:00', '12:00:00', 300000, '2025-02-16 20:58:28'),
	(9, '1-2', 'Bob', '2025-02-01', '2025-02-05', '16:00:00', '11:00:00', 150000, '2025-02-16 20:58:28'),
	(10, '1-2', '정보람', '2025-02-10', '2025-02-15', '17:00:00', '10:00:00', 250000, '2025-02-16 20:58:28'),
	(11, '2-2', '홍길동', '2025-02-15', '2025-02-17', '15:30:00', '18:30:00', 200000, '2025-02-16 21:19:00'),
	(12, '2-2', 'Tom', '2025-02-26', '2025-02-27', '15:30:00', '18:30:00', 100000, '2025-02-16 21:19:00'),
	(13, '2-2', '찰스박', '2025-01-15', '2025-01-20', '14:00:00', '12:00:00', 300000, '2025-02-16 21:19:00'),
	(14, '2-2', 'Bob', '2025-02-11', '2025-02-12', '16:00:00', '11:00:00', 150000, '2025-02-16 21:19:00'),
	(15, '2-2', 'Eve', '2025-02-20', '2025-02-25', '17:00:00', '10:00:00', 250000, '2025-02-16 21:19:00');
/*!40000 ALTER TABLE `booking` ENABLE KEYS */;

-- 테이블 bbs.category 구조 내보내기
CREATE TABLE IF NOT EXISTS `category` (
  `category_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`category_id`),
  UNIQUE KEY `UK_46ccwnsi9409t36lurvtyljak` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 테이블 데이터 bbs.category:~0 rows (대략적) 내보내기
DELETE FROM `category`;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
/*!40000 ALTER TABLE `category` ENABLE KEYS */;

-- 테이블 bbs.checkout 구조 내보내기
CREATE TABLE IF NOT EXISTS `checkout` (
  `checkout_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `order_time` datetime(6) NOT NULL,
  `total` double NOT NULL,
  PRIMARY KEY (`checkout_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 테이블 데이터 bbs.checkout:~0 rows (대략적) 내보내기
DELETE FROM `checkout`;
/*!40000 ALTER TABLE `checkout` DISABLE KEYS */;
/*!40000 ALTER TABLE `checkout` ENABLE KEYS */;

-- 테이블 bbs.checkout_item 구조 내보내기
CREATE TABLE IF NOT EXISTS `checkout_item` (
  `checkout_id` bigint(20) NOT NULL,
  `item_id` bigint(20) NOT NULL,
  PRIMARY KEY (`checkout_id`,`item_id`),
  KEY `FKat68ma4h5ubdy4js0u99ftjec` (`item_id`),
  CONSTRAINT `FK3s3vgaf23cmakh2w8bn7y6st3` FOREIGN KEY (`checkout_id`) REFERENCES `checkout` (`checkout_id`),
  CONSTRAINT `FKat68ma4h5ubdy4js0u99ftjec` FOREIGN KEY (`item_id`) REFERENCES `item` (`item_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 테이블 데이터 bbs.checkout_item:~0 rows (대략적) 내보내기
DELETE FROM `checkout_item`;
/*!40000 ALTER TABLE `checkout_item` DISABLE KEYS */;
/*!40000 ALTER TABLE `checkout_item` ENABLE KEYS */;

-- 테이블 bbs.comment 구조 내보내기
CREATE TABLE IF NOT EXISTS `comment` (
  `seq` int(11) NOT NULL AUTO_INCREMENT,
  `id` varchar(50) DEFAULT NULL,
  `content` varchar(50) DEFAULT NULL,
  `bbs_seq` varchar(50) DEFAULT NULL,
  `created_at` varchar(50) DEFAULT NULL,
  `del` varchar(50) DEFAULT NULL,
  KEY `인덱스 1` (`seq`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 테이블 데이터 bbs.comment:~6 rows (대략적) 내보내기
DELETE FROM `comment`;
/*!40000 ALTER TABLE `comment` DISABLE KEYS */;
INSERT INTO `comment` (`seq`, `id`, `content`, `bbs_seq`, `created_at`, `del`) VALUES
	(1, 'test0003', '한글 테스트 입니다.', '1', '2023-08-13 15:24:59', '0'),
	(2, 'string', 'asdasdasd\nㅁㄴㅇㅁㄴㅇㅁㅇㅁㄴㅇ', '1', '2023-12-20 16:04:50', '0'),
	(1, 'test0003', '한글 테스트 입니다.', '1', '2023-08-13 15:24:59', '0'),
	(2, 'string', 'asdasdasd\nㅁㄴㅇㅁㄴㅇㅁㅇㅁㄴㅇ', '1', '2023-12-20 16:04:50', '0'),
	(1, 'test0003', '한글 테스트 입니다.', '1', '2023-08-13 15:24:59', '0'),
	(2, 'string', 'asdasdasd\nㅁㄴㅇㅁㄴㅇㅁㅇㅁㄴㅇ', '1', '2023-12-20 16:04:50', '0');
/*!40000 ALTER TABLE `comment` ENABLE KEYS */;

-- 테이블 bbs.dates 구조 내보내기
CREATE TABLE IF NOT EXISTS `dates` (
  `date_id` int(11) NOT NULL AUTO_INCREMENT,
  `date` date NOT NULL,
  PRIMARY KEY (`date_id`)
) ENGINE=InnoDB AUTO_INCREMENT=59 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- 테이블 데이터 bbs.dates:~58 rows (대략적) 내보내기
DELETE FROM `dates`;
/*!40000 ALTER TABLE `dates` DISABLE KEYS */;
INSERT INTO `dates` (`date_id`, `date`) VALUES
	(1, '2025-01-02'),
	(2, '2025-01-03'),
	(3, '2025-01-04'),
	(4, '2025-01-05'),
	(5, '2025-01-06'),
	(6, '2025-02-04'),
	(7, '2025-02-13'),
	(8, '2025-02-13'),
	(9, '2025-02-11'),
	(10, '2025-02-11'),
	(11, '2025-02-11'),
	(12, '2025-02-11'),
	(13, '2025-02-12'),
	(14, '2025-02-12'),
	(15, '2025-02-13'),
	(16, '2025-02-13'),
	(17, '2025-01-02'),
	(18, '2025-02-04'),
	(19, '2025-02-04'),
	(20, '2025-02-04'),
	(21, '2025-02-04'),
	(22, '2025-02-04'),
	(23, '2025-02-04'),
	(24, '2025-02-04'),
	(25, '2025-02-04'),
	(26, '2025-02-03'),
	(27, '2025-02-03'),
	(28, '2025-02-03'),
	(29, '2025-02-03'),
	(30, '2025-02-03'),
	(31, '2025-02-03'),
	(32, '2025-02-03'),
	(33, '2025-02-03'),
	(34, '2025-02-03'),
	(35, '2025-02-04'),
	(36, '2025-02-03'),
	(37, '2025-02-04'),
	(38, '2025-02-03'),
	(39, '2025-02-03'),
	(40, '2025-02-04'),
	(41, '2025-02-04'),
	(42, '2025-02-12'),
	(43, '2025-02-04'),
	(44, '2025-02-04'),
	(45, '2025-02-04'),
	(46, '2025-02-05'),
	(47, '2025-02-05'),
	(48, '2025-02-06'),
	(49, '2025-02-06'),
	(50, '2025-02-04'),
	(51, '2025-02-05'),
	(52, '2025-02-11'),
	(53, '2025-02-12'),
	(54, '2025-02-11'),
	(55, '2025-02-12'),
	(56, '2025-02-13'),
	(57, '2025-02-11'),
	(58, '2025-02-12');
/*!40000 ALTER TABLE `dates` ENABLE KEYS */;

-- 테이블 bbs.employees 구조 내보내기
CREATE TABLE IF NOT EXISTS `employees` (
  `name` varchar(255) NOT NULL,
  `id` char(36) NOT NULL,
  `employeeId` varchar(10) NOT NULL,
  `team` varchar(50) NOT NULL,
  `joinYear` int(11) NOT NULL,
  `address` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `employeeId` (`employeeId`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 테이블 데이터 bbs.employees:~0 rows (대략적) 내보내기
DELETE FROM `employees`;
/*!40000 ALTER TABLE `employees` DISABLE KEYS */;
INSERT INTO `employees` (`name`, `id`, `employeeId`, `team`, `joinYear`, `address`, `email`) VALUES
	('Liam', '2240b84a-709e-4b98-bcb7-dfae5ce2655d', 'A1004', 'Engineering', 2016, 'Daegu, South Korea', 'liam@example.com'),
	('Alice', '5704179e-92b9-4c7e-bd36-2c4758db4ea7', 'A1001', 'Engineering', 2015, 'Seoul, South Korea', 'alice@example.com'),
	('Bob', '6d4afc76-4454-4953-a2f5-db9ac1353aae', 'A1002', 'Engineering', 2017, 'Busan, South Korea', 'bob@example.com'),
	('Isabella', '836eb87b-16e6-4582-b514-2236920728b6', 'A1007', 'Engineering', 2021, 'Ulsan, South Korea', 'isabella@example.com'),
	('Noah', '83bc8abd-f043-4258-a81e-e64e29375f15', 'A1006', 'Engineering', 2020, 'Gwangju, South Korea', 'noah@example.com'),
	('Mr. Kim', '948c8f58-d7fc-4fa5-a1af-9f0eea656ff6', 'B2004', 'Finance', 2015, 'Suwon, South Korea', 'mrkim@example.com'),
	('David', 'a10ec08f-02cb-4cfd-adf2-1bc5eec2f3f8', 'B2002', 'Consulting', 2016, 'Busan, South Korea', 'david@example.com'),
	('Sophia', 'aeca335b-22f3-422c-b8e9-5ee5b922cde8', 'A1005', 'Engineering', 2019, 'Daejeon, South Korea', 'sophia@example.com'),
	('Emma', 'd356030d-c2e9-4e93-a392-6418ac31f32a', 'A1003', 'Engineering', 2018, 'Incheon, South Korea', 'emma@example.com'),
	('홍길동', 'f25df27c-6332-45b0-b045-86fee2ea00c3', 'B2003', 'Marketing', 2019, 'Jeonju, South Korea', 'hong@example.com'),
	('Charlie', 'f8216608-00dd-4ad4-a8d2-69e9abf101af', 'B2001', 'Consulting', 2014, 'Seoul, South Korea', 'charlie@example.com');
/*!40000 ALTER TABLE `employees` ENABLE KEYS */;

-- 테이블 bbs.events 구조 내보내기
CREATE TABLE IF NOT EXISTS `events` (
  `event_id` varchar(50) NOT NULL DEFAULT '',
  `date_id` int(11) DEFAULT NULL,
  `time` time NOT NULL,
  `description` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  PRIMARY KEY (`event_id`),
  KEY `date_id` (`date_id`),
  CONSTRAINT `events_ibfk_1` FOREIGN KEY (`date_id`) REFERENCES `dates` (`date_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 테이블 데이터 bbs.events:~5 rows (대략적) 내보내기
DELETE FROM `events`;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
INSERT INTO `events` (`event_id`, `date_id`, `time`, `description`) VALUES
	('1000', 1, '17:00:00', '개발자 인터뷰'),
	('1111', 1, '16:30:00', '네트웍 점검'),
	('1212', 1, '16:30:00', '공공 입찰/투찰 계획안 협의'),
	('999', 1, '16:30:00', '디자인팀 회의'),
	('TUCZ3Pfqz6', 56, '15:30:00', '테스트 당');
/*!40000 ALTER TABLE `events` ENABLE KEYS */;

-- 테이블 bbs.inbound_data 구조 내보내기
CREATE TABLE IF NOT EXISTS `inbound_data` (
  `id` varchar(50) NOT NULL DEFAULT '0',
  `date` varchar(20) NOT NULL DEFAULT '',
  `title` varchar(255) NOT NULL DEFAULT '''''',
  `quantity` int(10) unsigned NOT NULL DEFAULT 0,
  `isbn` varchar(20) NOT NULL DEFAULT '''''',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 테이블 데이터 bbs.inbound_data:~7 rows (대략적) 내보내기
DELETE FROM `inbound_data`;
/*!40000 ALTER TABLE `inbound_data` DISABLE KEYS */;
INSERT INTO `inbound_data` (`id`, `date`, `title`, `quantity`, `isbn`) VALUES
	('88632b4f-207c-46ba-a9ff-1181c178c330', '2025-01-14', 'Fahrenheit 451', 111, '978-718-76697-8'),
	('c1655f88-8206-4e31-ae2c-a75ac05ca069', '2025-01-01', 'The Great Gatsby', 136, '978-228-11889-2'),
	('c895c4af-8121-4b70-b11c-1006fa16d3f0', '2025-01-15', 'The Grapes of Wrath', 125, '978-257-39654-1'),
	('e76d177f-1409-4f5f-83e0-c31874f4e6c0', '2025-01-11', 'Brave New World', 111, '978-691-41538-9'),
	('f3761280-bee4-430a-84bc-15d5b9600452', '2025-01-04', 'Pride and Prejudice', 146, '978-787-82570-8'),
	('f6114592-7a33-45dc-80b3-97dabf622c1d', '2025-01-03', '123123123123123', 111, '978-498-21606-9'),
	('UHJDY77gnD', '2025-02-12', '22', 0, '11');
/*!40000 ALTER TABLE `inbound_data` ENABLE KEYS */;

-- 테이블 bbs.item 구조 내보내기
CREATE TABLE IF NOT EXISTS `item` (
  `item_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `price` double DEFAULT NULL,
  `category_id` bigint(20) DEFAULT NULL,
  `stock_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`item_id`),
  KEY `FK2n9w8d0dp4bsfra9dcg0046l4` (`category_id`),
  KEY `FKc5xnxgxbxskykxmvmb3mwiogk` (`stock_id`),
  CONSTRAINT `FK2n9w8d0dp4bsfra9dcg0046l4` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`),
  CONSTRAINT `FKc5xnxgxbxskykxmvmb3mwiogk` FOREIGN KEY (`stock_id`) REFERENCES `stock` (`stock_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 테이블 데이터 bbs.item:~0 rows (대략적) 내보내기
DELETE FROM `item`;
/*!40000 ALTER TABLE `item` DISABLE KEYS */;
/*!40000 ALTER TABLE `item` ENABLE KEYS */;

-- 테이블 bbs.member 구조 내보내기
CREATE TABLE IF NOT EXISTS `member` (
  `id` varchar(50) NOT NULL,
  `pwd` varchar(200) DEFAULT NULL,
  `name` varchar(50) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `인덱스 2` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 테이블 데이터 bbs.member:~6 rows (대략적) 내보내기
DELETE FROM `member`;
/*!40000 ALTER TABLE `member` DISABLE KEYS */;
INSERT INTO `member` (`id`, `pwd`, `name`, `email`) VALUES
	('aaaaaa', '$2a$10$WuAoYsZCNSPjIpSfyzA8LuI1jwWAeK4KYdqEHlOQS9hl5jAeREY12', '가나다', 'aaaaa@aa.com'),
	('aaaaaaa', '$2a$10$je84beDucImRGv4mFY6eA.wfE61GAXLFFRLCemQA9UimwLc2Yk5uq', '다가가', 'aaaaaaa@a.com'),
	('test0001', '$2a$10$jOGykkRPNa5C9.SBtswdcujhuaVgCldLPMOXZMIw1/uCY5lVbZGLW', '자더더', 'a@aa.com'),
	('test0002', '$2a$10$EAsVdOzTN3mttYSmyh1lWO8TD3H/e0hRPnWxdcWaoRJT/m1eK5aW.', '김장성', 'a@a.com'),
	('test0003', '$2a$10$eyy06XA.kAoGX/RUr4dHGOmYgphsZQqkdx8oEhcUjkTmzo4zlLmJC', '박덩그', 'pa@aa.com'),
	('test0004', '$2a$10$wXs4gYfkpaN.tV2S1hJb.OqMmj0H4LJj2.Xx8cBmfvpHguV4XrYW6', '노도가', 'aa@aa.com');
/*!40000 ALTER TABLE `member` ENABLE KEYS */;

-- 테이블 bbs.outbound_data 구조 내보내기
CREATE TABLE IF NOT EXISTS `outbound_data` (
  `id` char(36) NOT NULL,
  `date` date NOT NULL DEFAULT curdate(),
  `title` varchar(255) NOT NULL DEFAULT '''''',
  `quantity` int(10) unsigned NOT NULL DEFAULT 0,
  `isbn` varchar(20) NOT NULL DEFAULT '''''',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 테이블 데이터 bbs.outbound_data:~6 rows (대략적) 내보내기
DELETE FROM `outbound_data`;
/*!40000 ALTER TABLE `outbound_data` DISABLE KEYS */;
INSERT INTO `outbound_data` (`id`, `date`, `title`, `quantity`, `isbn`) VALUES
	('88632b4f-207c-46ba-a9ff-1181c178c330', '2025-01-14', 'Fahrenheit 451', 11, '978-718-76697-8'),
	('c1655f88-8206-4e31-ae2c-a75ac05ca069', '2025-01-01', 'The Great Gatsby', 36, '978-228-11889-2'),
	('c895c4af-8121-4b70-b11c-1006fa16d3f0', '2025-01-15', 'The Grapes of Wrath', 25, '978-257-39654-1'),
	('e76d177f-1409-4f5f-83e0-c31874f4e6c0', '2025-01-11', 'Brave New World', 11, '978-691-41538-9'),
	('f3761280-bee4-430a-84bc-15d5b9600452', '2025-01-04', 'Pride and Prejudice', 46, '978-787-82570-8'),
	('f6114592-7a33-45dc-80b3-97dabf622c1d', '2025-01-03', '123123123123123', 11, '978-498-21606-9');
/*!40000 ALTER TABLE `outbound_data` ENABLE KEYS */;

-- 테이블 bbs.read_history 구조 내보내기
CREATE TABLE IF NOT EXISTS `read_history` (
  `latest_access_at` varchar(50) DEFAULT NULL,
  `bbs_seq` varchar(50) DEFAULT NULL,
  `id` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 테이블 데이터 bbs.read_history:~21 rows (대략적) 내보내기
DELETE FROM `read_history`;
/*!40000 ALTER TABLE `read_history` DISABLE KEYS */;
INSERT INTO `read_history` (`latest_access_at`, `bbs_seq`, `id`) VALUES
	('2023-08-13 11:12:28', '1', 'test0002'),
	('2023-08-13 15:24:49', '1', 'test0003'),
	('2023-08-13 15:25:07', '1', 'test0003'),
	('2023-08-13 15:26:07', '1', 'test0003'),
	('2023-08-18 06:30:57', '2', 'test0004'),
	('2023-12-20 16:04:41', '1', 'string'),
	('2023-12-20 16:04:51', '1', 'string'),
	('2023-08-13 11:12:28', '1', 'test0002'),
	('2023-08-13 15:24:49', '1', 'test0003'),
	('2023-08-13 15:25:07', '1', 'test0003'),
	('2023-08-13 15:26:07', '1', 'test0003'),
	('2023-08-18 06:30:57', '2', 'test0004'),
	('2023-12-20 16:04:41', '1', 'string'),
	('2023-12-20 16:04:51', '1', 'string'),
	('2023-08-13 11:12:28', '1', 'test0002'),
	('2023-08-13 15:24:49', '1', 'test0003'),
	('2023-08-13 15:25:07', '1', 'test0003'),
	('2023-08-13 15:26:07', '1', 'test0003'),
	('2023-08-18 06:30:57', '2', 'test0004'),
	('2023-12-20 16:04:41', '1', 'string'),
	('2023-12-20 16:04:51', '1', 'string');
/*!40000 ALTER TABLE `read_history` ENABLE KEYS */;

-- 테이블 bbs.reservations 구조 내보내기
CREATE TABLE IF NOT EXISTS `reservations` (
  `id` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `name` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `departmentId` int(11) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `time` time DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 테이블 데이터 bbs.reservations:~10 rows (대략적) 내보내기
DELETE FROM `reservations`;
/*!40000 ALTER TABLE `reservations` DISABLE KEYS */;
INSERT INTO `reservations` (`id`, `name`, `departmentId`, `date`, `time`) VALUES
	('1', '최유리', 1, '2025-01-10', '09:00:00'),
	('10', '최준호', 10, '2025-01-11', '10:00:00'),
	('2', '박지훈', 2, '2025-01-10', '10:00:00'),
	('3', '이승기', 3, '2025-01-10', '11:00:00'),
	('4', '김소연', 4, '2025-01-10', '13:00:00'),
	('5', '오지연', 5, '2025-01-10', '14:00:00'),
	('6', '박성민', 6, '2025-01-10', '15:00:00'),
	('7', '김나현', 7, '2025-01-10', '16:00:00'),
	('8', '이정훈', 8, '2025-01-10', '17:00:00'),
	('9', '윤아름', 9, '2025-01-11', '09:00:00');
/*!40000 ALTER TABLE `reservations` ENABLE KEYS */;

-- 테이블 bbs.stock 구조 내보내기
CREATE TABLE IF NOT EXISTS `stock` (
  `stock_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `qty` int(11) DEFAULT NULL,
  PRIMARY KEY (`stock_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 테이블 데이터 bbs.stock:~0 rows (대략적) 내보내기
DELETE FROM `stock`;
/*!40000 ALTER TABLE `stock` DISABLE KEYS */;
/*!40000 ALTER TABLE `stock` ENABLE KEYS */;

-- 테이블 bbs.user 구조 내보내기
CREATE TABLE IF NOT EXISTS `user` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_ob8kqyqqgmefl0aco34akdtpe` (`email`),
  UNIQUE KEY `UK_sb8bbouer5wak8vyiiy4pf2bx` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 테이블 데이터 bbs.user:~0 rows (대략적) 내보내기
DELETE FROM `user`;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
/*!40000 ALTER TABLE `user` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
