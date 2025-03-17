-- --------------------------------------------------------
-- 호스트:                          127.0.0.1
-- 서버 버전:                        11.7.2-MariaDB - mariadb.org binary distribution
-- 서버 OS:                        Win64
-- HeidiSQL 버전:                  12.10.0.7000
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
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

-- 테이블 데이터 bbs.bbs:~18 rows (대략적) 내보내기
DELETE FROM `bbs`;
INSERT INTO `bbs` (`seq`, `id`, `ref`, `step`, `depth`, `title`, `content`, `created_at`, `del`, `read_count`) VALUES
	(1, 'test0002', '1', '0', '0', '하가다가라라자다아라랄', '거러러거아라랄\n가라가가가가', '2023-08-13 11:12:26', '0', '6'),
	(2, 'test0004', '2', '0', '0', 'adaasdasd', 'asdasdasdasd', '2023-08-18 06:30:56', '0', '1'),
	(1, 'test0002', '1', '0', '0', '하가다가라라자다아라랄', '거러러거아라랄\n가라가가가가', '2023-08-13 11:12:26', '0', '6'),
	(2, 'test0004', '2', '0', '0', 'adaasdasd', 'asdasdasdasd', '2023-08-18 06:30:56', '0', '1'),
	(1, 'test0002', '1', '0', '0', '하가다가라라자다아라랄', '거러러거아라랄\n가라가가가가', '2023-08-13 11:12:26', '0', '6'),
	(2, 'test0004', '2', '0', '0', 'adaasdasd', 'asdasdasdasd', '2023-08-18 06:30:56', '0', '1'),
	(1, 'test0002', '1', '0', '0', '하가다가라라자다아라랄', '거러러거아라랄\n가라가가가가', '2023-08-13 11:12:26', '0', '6'),
	(2, 'test0004', '2', '0', '0', 'adaasdasd', 'asdasdasdasd', '2023-08-18 06:30:56', '0', '1'),
	(1, 'test0002', '1', '0', '0', '하가다가라라자다아라랄', '거러러거아라랄\n가라가가가가', '2023-08-13 11:12:26', '0', '6'),
	(2, 'test0004', '2', '0', '0', 'adaasdasd', 'asdasdasdasd', '2023-08-18 06:30:56', '0', '1'),
	(1, 'test0002', '1', '0', '0', '하가다가라라자다아라랄', '거러러거아라랄\n가라가가가가', '2023-08-13 11:12:26', '0', '6'),
	(2, 'test0004', '2', '0', '0', 'adaasdasd', 'asdasdasdasd', '2023-08-18 06:30:56', '0', '1'),
	(1, 'test0002', '1', '0', '0', '하가다가라라자다아라랄', '거러러거아라랄\n가라가가가가', '2023-08-13 11:12:26', '0', '6'),
	(2, 'test0004', '2', '0', '0', 'adaasdasd', 'asdasdasdasd', '2023-08-18 06:30:56', '0', '1'),
	(1, 'test0002', '1', '0', '0', '하가다가라라자다아라랄', '거러러거아라랄\n가라가가가가', '2023-08-13 11:12:26', '0', '6'),
	(2, 'test0004', '2', '0', '0', 'adaasdasd', 'asdasdasdasd', '2023-08-18 06:30:56', '0', '1'),
	(1, 'test0002', '1', '0', '0', '하가다가라라자다아라랄', '거러러거아라랄\n가라가가가가', '2023-08-13 11:12:26', '0', '6'),
	(2, 'test0004', '2', '0', '0', 'adaasdasd', 'asdasdasdasd', '2023-08-18 06:30:56', '0', '1');

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

-- 테이블 데이터 bbs.booking:~15 rows (대략적) 내보내기
DELETE FROM `booking`;
INSERT INTO `booking` (`id`, `room_number`, `guest_name`, `check_in_date`, `check_out_date`, `arrival_time`, `departure_time`, `cost`, `created_at`) VALUES
	(1, '1-1', '홍길동', '2025-01-05', '2025-01-07', '15:30:00', '18:30:00', 200000, '2025-02-16 11:55:42'),
	(2, '1-1', 'Tom', '2025-01-05', '2025-01-10', '15:30:00', '18:30:00', 100000, '2025-02-16 11:55:42'),
	(3, '1-1', 'Alice', '2025-01-15', '2025-01-20', '14:00:00', '12:00:00', 300000, '2025-02-16 11:55:42'),
	(4, '1-1', 'Bob', '2025-02-01', '2025-02-05', '16:00:00', '11:00:00', 150000, '2025-02-16 11:55:42'),
	(5, '1-1', 'Eve', '2025-02-10', '2025-02-15', '17:00:00', '10:00:00', 250000, '2025-02-16 11:55:42'),
	(6, '1-2', '이고소', '2025-02-15', '2025-02-17', '15:30:00', '18:30:00', 200000, '2025-02-16 11:58:28'),
	(7, '1-2', 'Tom', '2025-01-05', '2025-01-10', '15:30:00', '18:30:00', 100000, '2025-02-16 11:58:28'),
	(8, '1-2', 'Alice', '2025-01-15', '2025-01-20', '14:00:00', '12:00:00', 300000, '2025-02-16 11:58:28'),
	(9, '1-2', 'Bob', '2025-02-01', '2025-02-05', '16:00:00', '11:00:00', 150000, '2025-02-16 11:58:28'),
	(10, '1-2', '정보람', '2025-02-10', '2025-02-15', '17:00:00', '10:00:00', 250000, '2025-02-16 11:58:28'),
	(11, '2-2', '홍길동', '2025-02-15', '2025-02-17', '15:30:00', '18:30:00', 200000, '2025-02-16 12:19:00'),
	(12, '2-2', 'Tom', '2025-02-26', '2025-02-27', '15:30:00', '18:30:00', 100000, '2025-02-16 12:19:00'),
	(13, '2-2', '찰스박', '2025-01-15', '2025-01-20', '14:00:00', '12:00:00', 300000, '2025-02-16 12:19:00'),
	(14, '2-2', 'Bob', '2025-02-11', '2025-02-12', '16:00:00', '11:00:00', 150000, '2025-02-16 12:19:00'),
	(15, '2-2', 'Eve', '2025-02-20', '2025-02-25', '17:00:00', '10:00:00', 250000, '2025-02-16 12:19:00');

-- 테이블 bbs.category 구조 내보내기
CREATE TABLE IF NOT EXISTS `category` (
  `category_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`category_id`),
  UNIQUE KEY `UK_46ccwnsi9409t36lurvtyljak` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 테이블 데이터 bbs.category:~0 rows (대략적) 내보내기
DELETE FROM `category`;

-- 테이블 bbs.checkout 구조 내보내기
CREATE TABLE IF NOT EXISTS `checkout` (
  `checkout_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `order_time` datetime(6) NOT NULL,
  `total` double NOT NULL,
  PRIMARY KEY (`checkout_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 테이블 데이터 bbs.checkout:~0 rows (대략적) 내보내기
DELETE FROM `checkout`;

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

-- 테이블 데이터 bbs.comment:~18 rows (대략적) 내보내기
DELETE FROM `comment`;
INSERT INTO `comment` (`seq`, `id`, `content`, `bbs_seq`, `created_at`, `del`) VALUES
	(1, 'test0003', '한글 테스트 입니다.', '1', '2023-08-13 15:24:59', '0'),
	(2, 'string', 'asdasdasd\nㅁㄴㅇㅁㄴㅇㅁㅇㅁㄴㅇ', '1', '2023-12-20 16:04:50', '0'),
	(1, 'test0003', '한글 테스트 입니다.', '1', '2023-08-13 15:24:59', '0'),
	(2, 'string', 'asdasdasd\nㅁㄴㅇㅁㄴㅇㅁㅇㅁㄴㅇ', '1', '2023-12-20 16:04:50', '0'),
	(1, 'test0003', '한글 테스트 입니다.', '1', '2023-08-13 15:24:59', '0'),
	(2, 'string', 'asdasdasd\nㅁㄴㅇㅁㄴㅇㅁㅇㅁㄴㅇ', '1', '2023-12-20 16:04:50', '0'),
	(1, 'test0003', '한글 테스트 입니다.', '1', '2023-08-13 15:24:59', '0'),
	(2, 'string', 'asdasdasd\nㅁㄴㅇㅁㄴㅇㅁㅇㅁㄴㅇ', '1', '2023-12-20 16:04:50', '0'),
	(1, 'test0003', '한글 테스트 입니다.', '1', '2023-08-13 15:24:59', '0'),
	(2, 'string', 'asdasdasd\nㅁㄴㅇㅁㄴㅇㅁㅇㅁㄴㅇ', '1', '2023-12-20 16:04:50', '0'),
	(1, 'test0003', '한글 테스트 입니다.', '1', '2023-08-13 15:24:59', '0'),
	(2, 'string', 'asdasdasd\nㅁㄴㅇㅁㄴㅇㅁㅇㅁㄴㅇ', '1', '2023-12-20 16:04:50', '0'),
	(1, 'test0003', '한글 테스트 입니다.', '1', '2023-08-13 15:24:59', '0'),
	(2, 'string', 'asdasdasd\nㅁㄴㅇㅁㄴㅇㅁㅇㅁㄴㅇ', '1', '2023-12-20 16:04:50', '0'),
	(1, 'test0003', '한글 테스트 입니다.', '1', '2023-08-13 15:24:59', '0'),
	(2, 'string', 'asdasdasd\nㅁㄴㅇㅁㄴㅇㅁㅇㅁㄴㅇ', '1', '2023-12-20 16:04:50', '0'),
	(1, 'test0003', '한글 테스트 입니다.', '1', '2023-08-13 15:24:59', '0'),
	(2, 'string', 'asdasdasd\nㅁㄴㅇㅁㄴㅇㅁㅇㅁㄴㅇ', '1', '2023-12-20 16:04:50', '0');

-- 테이블 bbs.dates 구조 내보내기
CREATE TABLE IF NOT EXISTS `dates` (
  `date_id` int(11) NOT NULL AUTO_INCREMENT,
  `date` date NOT NULL,
  PRIMARY KEY (`date_id`)
) ENGINE=InnoDB AUTO_INCREMENT=63 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- 테이블 데이터 bbs.dates:~61 rows (대략적) 내보내기
DELETE FROM `dates`;
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
	(58, '2025-02-12'),
	(59, '2025-02-14'),
	(60, '2025-02-07'),
	(61, '2025-02-14'),
	(62, '2025-03-12');

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

-- 테이블 데이터 bbs.employees:~11 rows (대략적) 내보내기
DELETE FROM `employees`;
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

-- 테이블 bbs.events 구조 내보내기
CREATE TABLE IF NOT EXISTS `events` (
  `event_id` varchar(50) NOT NULL DEFAULT '',
  `date_id` int(11) DEFAULT NULL,
  `time` time NOT NULL,
  `description` varchar(255) NOT NULL,
  PRIMARY KEY (`event_id`),
  KEY `date_id` (`date_id`),
  CONSTRAINT `events_ibfk_1` FOREIGN KEY (`date_id`) REFERENCES `dates` (`date_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 테이블 데이터 bbs.events:~7 rows (대략적) 내보내기
DELETE FROM `events`;
INSERT INTO `events` (`event_id`, `date_id`, `time`, `description`) VALUES
	('1000', 1, '17:00:00', '개발자 인터뷰'),
	('1111', 1, '16:30:00', '네트웍 점검'),
	('1212', 1, '16:30:00', '공공 입찰/투찰 계획안 협의'),
	('999', 1, '16:30:00', '디자인팀 회의'),
	('hQezRN7pal', 62, '08:00:00', 'test 테스트 입니다.'),
	('ms3FVtdtR2', 60, '15:30:00', 'qeqwe'),
	('nNW7WRhV50', 59, '08:00:00', 'qweqwe'),
	('TUCZ3Pfqz6', 56, '15:30:00', '테스트 당');

-- 테이블 bbs.glos 구조 내보내기
CREATE TABLE IF NOT EXISTS `glos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `en` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `ko` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `desc` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `img` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_dt` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT curdate(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=238 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- 테이블 데이터 bbs.glos:~236 rows (대략적) 내보내기
DELETE FROM `glos`;
INSERT INTO `glos` (`id`, `en`, `ko`, `desc`, `img`, `created_dt`) VALUES
	(1, 'Acoustic Fatigue', '음향 피로', '강한 음장이나 진동 음압에 장시간 노출돼 구조물이 미세 균열·파손에 이르는 현상', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(2, 'Modal Analysis', '모달 해석', '구조물의 고유진동수와 모드 형상을 파악해 동특성을 분석하는 기법', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(3, 'Vibration Isolation', '진동 절연', '기계나 구조물에 발생하는 진동을 저감·차단하기 위한 설계와 기술', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(4, 'Damping', '감쇠감쇠감쇠', '진동 시스템에서 에너지가 소실되는 현상으로 진동 폭을 줄이는 역할', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(5, 'Boundary Element Method (BEM)', '경계요소법', '해석 대상의 경계를 요소로 분할해 음향·진동 문제를 해결하는 수치해석 기법', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(6, 'Acoustic Emission (AE)', '음향 방출', '재료나 구조물 결함 발생 시 방출되는 탄성파를 감지해 이상을 진단하는 비파괴 검사 기법', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(7, 'Fourier Transform', '푸리에 변환', '시간영역 신호를 주파수영역으로 변환하여 성분을 해석하는 수학적 방법', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(8, 'Reverberation Time (RT)', '잔향 시간', '공간 내 음압이 특정 수준만큼 줄어드는 데 걸리는 시간으로 실내 음향 특성을 나타냄', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(9, 'Sound Intensity', '음성 강도', '단위 면적당 전달되는 음향 에너지 흐름의 양', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(10, 'Active Noise Control (ANC)', '능동 소음 제어', '반대 위상의 음원을 생성해 실제 소음을 상쇄함으로써 소음을 줄이는 기술', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(11, 'Passive Noise Control', '수동 소음 제어', '흡음재, 차음재, 방음벽 등을 사용해 소음을 물리적으로 저감하는 전통적 방법', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(12, 'Sound Pressure Level (SPL)', '음압 레벨', '참조 음압 대비 실제 음압의 비를 데시벨(dB)로 환산한 값', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(13, 'Decibel (dB)', '데시벨', '음압, 진동가속도 등을 로그 스케일로 표현하는 단위', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(14, 'Transfer Path Analysis (TPA)', '전달 경로 해석', '소음·진동이 발생원에서 측정점까지 전달되는 경로와 기여도를 분석하는 기법', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(15, 'Helmholtz Resonator', '헬름홀츠 공진기', '특정 주파수대의 소음을 효율적으로 흡수·감쇠하는 공진기 구조', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(16, 'Shock Spectrum', '충격 스펙트럼', '단발성 충격에 대해 시스템이 주파수별로 어떻게 응답하는지를 나타낸 그래프', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(17, 'Anti-Resonance', '반(反)공진', '시스템 주파수 응답에서 진폭이 극소가 되는 주파수', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(18, 'White Noise', '백색 잡음', '모든 주파수대에서 균일한 에너지를 갖는 랜덤 신호', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(19, 'Random Vibration', '랜덤 진동', '주파수 성분이 시간에 따라 불규칙하게 분포하는 진동으로 통계적으로 분석됨', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(20, 'Equivalent Radiated Power (ERP)', '등가 방사 파워', '구조물이 방사하는 소음을 에너지 관점에서 등가로 표현한 척도', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(21, 'Rayleigh Integral', '레이리 적분', '판이나 막 등 진동하는 면에서 방사되는 음장을 해석하기 위한 수학적 기법', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(22, 'Frequency Response Function (FRF)', '주파수 응답 함수', '시스템이 각 주파수에서 어떻게 응답하는지 나타내는 전달 특성 (H(ω))', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(23, 'Vibro-Acoustic Coupling', '진동-음향 결합', '진동과 음향 간 에너지가 상호 교환되어 복합적인 현상이 발생하는 것', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(24, 'Aeroacoustics', '공력 음향학', '유체(공기) 흐름으로 인해 발생하는 소음을 해석·제어하는 학문', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(25, 'Campbell Diagram', '캠벨 선도', '회전체의 운전속도 범위에서 공진 주파수, 배음 등을 시각화한 그래프', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(26, 'Gear Mesh Frequency', '기어 물림 주파수', '기어가 맞물릴 때 발생하는 기본 진동/소음 주파수로 기어 결합 진동 분석의 핵심', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(27, 'Operational Deflection Shape (ODS)', '운전 변형 형상', '장비가 실제 운전 중일 때 발생하는 변형·진동 형상을 시각화해 분석하는 방법', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(28, 'Turbomachinery Noise', '터보기계 소음', '팬, 펌프, 터빈 등 회전체 유체기계에서 발생하는 유동 소음', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(29, 'Water Hammer', '수격 작용', '유체 흐름이 급격히 멈추거나 변화할 때 배관 내에 충격파가 발생하는 현상', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(30, 'Random Excitation', '랜덤 가진', '랜덤 형태의 외부 힘이나 입력이 시스템에 가해져 진동·응답이 유발되는 것', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(31, 'Time-Averaging', '시간 평균 기법', '노이즈를 줄이고 안정된 스펙트럼을 얻기 위해 시간영역에서 신호를 평균화하는 방법', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(32, 'Order Tracking', '오더 트래킹', '회전체나 왕복운동계와 동기화된 주파수 성분을 추적해 진동/소음을 분석하는 기법', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(33, 'Cyclostationary Analysis', '사이클 정상이론 해석', '베어링·기어 등 주기적 확률 과정을 다루는 신호 처리 기법', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(34, 'Rotordynamics', '회전체 동역학', '회전축, 터보머신 등 회전체 시스템에서 발생하는 진동 및 동특성을 해석하는 분야', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(35, 'Bearing Stiffness', '베어링 강성', '베어링의 변형 저항 특성으로 회전체 동특성에 큰 영향을 미침', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(36, 'Constrained Layer Damping (CLD)', '구속층 감쇠', '점성층과 강성층으로 구성된 복합구조를 사용해 진동 에너지를 흡수·감쇠하는 기법', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(37, 'Lumped Parameter Model', '집중정수 모델', '질량, 스프링, 감쇠기 등을 하나의 점(요소)으로 간주해 동적 특성을 근사하는 단순화 방법', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(38, 'Vibration Transmissibility', '진동 전달율', '입력 진동 대비 출력 진동(전달된 진동)의 비율로, 진동 절연 성능을 평가하는 지표', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(39, 'Shock Response Spectrum (SRS)', '충격 응답 스펙트럼', '충격에 대해 단자유도 시스템의 최대 응답을 주파수별로 나타낸 것', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(40, 'Cut-on Frequency', '개시 주파수', '도관, 파이프 등 파동전달계에서 특정 모드가 전파되기 시작하는 임계 주파수', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(41, 'Cut-off Frequency', '차단 주파수', '특정 모드가 전파되지 못하고 감쇠되기 시작하는 임계 주파수', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(42, 'Half-Power Bandwidth', '반출력 대역폭', '공진 주파수에서 응답이 최대치의 1/√2(약 -3dB)에 해당하는 폭', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(43, 'Cavitation', '캐비테이션', '액체 흐름 중 국부압력이 증기압 이하로 떨어져 기포가 발생·붕괴하면서 소음·진동·부식을 유발', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(44, 'Muffler', '머플러', '배기 소음을 감쇠하기 위해 배기관 내에 설치되는 장치', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(45, 'Sound Transmission Loss (STL)', '음 전달 손실', '벽이나 판재를 통해 음이 전달될 때 얼마나 저감되는지 나타내는 지표', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(46, 'Insertion Loss', '삽입 손실', '소음제어장치(머플러, 흡음재 등)를 삽입했을 때 소음이 얼마나 줄었는지 평가하는 수치', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(47, 'Far Field', '원거리장', '음원으로부터 충분히 먼 거리에서 구면파로 간주되는 음향장 영역', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(48, 'Near Field', '근거리장', '음원 주변으로, 음압과 입자속도가 복잡하게 분포하는 영역', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(49, 'Reactive Silencer', '반응형 소음기', '반사·공진 원리를 이용해 특정 주파수대의 소음을 줄이는 소음기', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(50, 'Absorptive Silencer', '흡음형 소음기', '흡음재를 사용해 소음을 흡수·감쇠시키는 형태의 소음기', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(51, 'Sound Intensity Probe', '음성 강도 탐침', '음성 강도(사운드 인텐시티)를 측정하기 위한 마이크 2채널(또는 다채널) 장치', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(52, 'Transfer Matrix Method (TMM)', '전달 행렬법', '다중 자유도 시스템 해석 시 요소별 행렬을 곱해 전체 시스템 특성을 구하는 방법', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(53, 'Air-Borne Noise', '공기 전파 소음', '공기를 매질로 전파되는 소음', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(54, 'Structure-Borne Noise', '구조 전달 소음', '진동이 고체 구조물을 통해 전달된 후 음으로 방사되는 소음', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(55, 'Torsional Vibration', '비틀림 진동', '축이 비틀리는 형태로 발생하는 회전체의 진동', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(56, 'Rotational Speed', '회전 속도', '회전체가 단위 시간당 회전하는 횟수 (rpm 등)로 표현', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(57, 'Critical Speed', '임계 속도', '회전체가 공진을 일으키는 회전 속도로 진동이 크게 증폭되는 지점', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(58, 'Whirl', '월 진동', '회전체 축이 회전과 함께 공진 모드 형상으로 궤적을 그리며 이동하는 진동', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(59, 'Fluid-Structure Interaction (FSI)', '유체-구조 상호작용', '유체 흐름과 구조물 진동이 상호 영향을 주고받는 복합적인 물리 현상', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(60, 'Plane Wave', '평면파', '등위상면이 서로 평행한 형태로 전파되는 음파나 진동 모드', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(61, 'Evanescent Wave', '감쇠파', '도파관이나 구조물 경계에서 지수적으로 감쇠하면서 전파되지 않는 모드', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(62, 'Impedance Matching', '임피던스 정합', '음향이나 진동이 전파될 때 반사를 줄이기 위해 매질 간 임피던스를 맞추는 기술', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(63, 'Infinite Plate Model', '무한판 모델', '판재 해석 시 경계영향을 무시하고 넓은 면적을 가정해 근사적으로 해석하는 기법', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(64, 'Contact Resonance', '접촉 공진', '두 물체가 맞닿은 면에서 발생하는 공진 현상으로 접촉강성·마찰에 따라 달라짐', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(65, 'Acousto-Elastic Effect', '음향 탄성 효과', '음파 전파 속도가 재료에 인가된 응력 상태에 따라 달라지는 현상', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(66, 'Laser Doppler Vibrometer (LDV)', '레이저 도플러 진동계', '레이저 빔의 도플러 이동을 측정해 비접촉식으로 물체의 진동 속도를 계측하는 장치', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(67, 'Scanning Vibrometer', '스캐닝 진동계', '레이저 빔을 여러 지점으로 스캐닝하면서 구조물의 진동 분포를 측정하는 장비', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(68, 'Operational Modal Analysis (OMA)', '운전 모드 해석', '실제 운전 환경에서 계측된 진동 응답만으로 구조물의 모달 특성을 추정하는 기법', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(69, 'Beamforming', '빔포밍', '다수의 마이크 배열로 특정 방향의 소음원 위치나 세기를 추정하는 기법', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(70, 'Acoustic Camera', '음향 카메라', '마이크 배열과 영상 기술을 결합하여 소음원을 시각적으로 가시화하는 장치', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(71, 'ECH-T', 'ECH-T 기법', '엔진실험에서 크랭크각 등과 동기화된 신호를 해석하기 위한 특정 엔진 진동 분석 방법', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(72, 'Noise Vibration Harshness (NVH)', '소음 진동 불쾌감', '차량 등에서 소음과 진동이 주는 거슬리는 체감 정도를 평가·분석하는 분야', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(73, 'Acoustic Metamaterial', '음향 메타물질', '음파 제어를 위해 인공적으로 설계된 구조로, 일반 물질에 없는 음향 특성을 구현', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(74, 'Sound Quality', '음질', '소음의 물리량만이 아니라 주관적·심리음향적 특성을 함께 고려한 음의 품질 평가', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(75, 'Flow-Induced Vibration (FIV)', '유동 유발 진동', '유체 흐름이 구조물에 작용하여 진동이 발생하는 현상', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(76, 'Acoustic Holography', '음향 홀로그래피', '마이크로폰 배열을 이용해 음향장을 역산하여 소스 위치와 세기를 2D·3D로 재현하는 기술', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(77, 'Vortex Shedding', '와류 박리', '유체가 물체 주위로 흐를 때 후류에서 발생하는 교대로 분리되는 와류가 진동의 원인이 됨', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(78, 'Fluidelastic Instability', '유체탄성 불안정', '유체 흐름과 구조 탄성이 상호작용하여 동특성이 급격히 변하거나 파괴로 이어지는 현상', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(79, 'Acoustic Black Hole', '음향 블랙홀', '판이나 빔 끝에 두께 변화를 이용해 음파 에너지를 효과적으로 흡수하는 구조 기술', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(80, 'Double Glazing', '이중 창호', '두 장의 유리를 사용해 소음·열 차단 성능을 높이는 건축 음향 기법', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(81, 'Fan Noise', '팬 소음', '회전 날개(블레이드)가 공기를 가속하면서 발생하는 유동 소음', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(82, 'Tonal Noise', '음색 소음', '특정 주파수 톤이 두드러지게 들리는 소음으로 사람에게 거슬림이 큼', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(83, 'Broadband Noise', '광대역 소음', '하나의 뚜렷한 톤 대신 광범위한 주파수대에 걸쳐 에너지가 분포된 소음', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(84, 'A-Weighting', 'A-가중', '인간 청각 특성에 가까운 주파수 응답을 적용해 소음레벨을 측정하는 방법', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(85, 'C-Weighting', 'C-가중', '저주파대역을 좀 더 많이 반영하는 가중 방식으로, 저주파 소음까지 고려', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(86, 'Sound Exposure Level (SEL)', '음 노출 레벨', '특정 이벤트(예: 비행기 이착륙)의 음향 에너지를 단일 수치로 환산한 지표', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(87, 'Displacement Amplitude', '변위 진폭', '진동 시스템에서 물체가 기준 위치로부터 이동한 최대 거리', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(88, 'Velocity Amplitude', '속도 진폭', '시간에 따라 변화하는 속도의 최대 크기로, 진동해석에서 중요한 파라미터', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(89, 'Acceleration Amplitude', '가속도 진폭', '가속도 변화의 최대 크기를 나타내며 진동이 인체·구조에 미치는 영향 평가에 자주 사용', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(90, 'Compliance', '컴플라이언스', '동역학 해석에서 스프링 상수의 역수에 해당하는 값으로 변위/힘', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(91, 'Radiation Efficiency', '방사 효율', '진동하는 구조물이 소리를 얼마나 효율적으로 방사하는지를 나타내는 척도', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(92, 'Tip Clearance Flow', '팁 간극 유동', '터보기계의 블레이드 팁과 하우징 사이의 간극으로 유동이 누설되어 발생하는 소음·손실', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(93, 'Pulsation', '맥동', '펌프나 압축기 등에서 유량·압력이 주기적으로 변동해 발생하는 진동 또는 소음', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(94, 'Standing Wave', '정재파', '반사된 파동이 원래 파동과 간섭하여 마치 공간에 정지해 있는 것처럼 보이는 파형', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(95, 'Waveguide', '도파관', '파동(음향, 전자파 등)을 특정 경로로 전파시키는 구조로, 모드 전파특성이 중요', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(96, 'Resonant Frequency', '공진 주파수', '시스템이 특정 주파수에서 최대 진폭의 진동·음향 응답을 보이는 지점', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(97, 'Transient Vibration', '과도 진동', '충격, 스텝 입력 등 순간적 가진에 의해 발생하는 일시적 진동', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(98, 'Acoustic Scattering', '음향 산란', '음파가 물체나 불연속 면에 부딪혀 여러 방향으로 재분포되는 현상', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(99, 'MEMS Microphone', 'MEMS 마이크로폰', '반도체 공정을 이용해 제작된 소형 마이크로폰으로, 소음계·휴대폰 등에 활용', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(100, 'Anechoic Chamber', '무향실', '내부 벽면이 음을 완전히 흡수해 반사가 거의 없는 실험실', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(101, 'Reverberation Chamber', '잔향실', '내부 벽면이 매우 반사적이어 다중 반사가 일어나도록 설계된 음향 실험실', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(102, 'Mode Shape', '모드 형상', '고유진동수에서 구조물이 진동하는 공간적 분포 패턴', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(103, 'Finite Element Analysis (FEA)', '유한요소 해석', '연속체나 구조물을 요소로 분할해 근사해를 구하는 대표적 수치해석 기법', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(104, 'Sound Power Level (PWL)', '음향 파워 레벨', '음원 자체가 방사하는 음향 에너지를 dB 단위로 나타낸 값', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(105, 'Acoustic Impedance', '음향 임피던스', '소리의 진행에 대한 매질의 저항 특성으로 압력과 유속의 비로 정의', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(106, 'Impact Hammer Test', '충격 해머 시험', '해머로 구조물에 충격을 가해 진동 응답(주파수 응답 함수 등)을 측정하는 방법', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(107, 'Repeatability', '재현성', '측정이나 실험을 여러 번 수행했을 때 결과가 일관되게 나오는 정도', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(108, 'Resolution', '분해능', '계측 장치가 구분할 수 있는 최소 신호 차이', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(109, 'Harmonic Excitation', '조화 가진', '사인파 형태의 힘이나 변위로 시스템을 가진하여 진동 응답을 유발', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(110, 'Hysteresis Damping', '이력 감쇠', '재료 내부에서 변형-복원 과정의 이력 특성으로 에너지가 소실되는 현상', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(111, 'Tuned Mass Damper (TMD)', '동조 질량 감쇠기', '구조물의 공진 주파수에 맞춰 추가 질량-스프링-감쇠기로 진동을 크게 줄이는 장치', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(112, 'Knocking', '노킹', '엔진 실린더 내에서 이상 연소로 인해 발생하는 충격 소음 및 진동', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(113, 'Flutter', '플러터', '유동과 구조물이 상호작용하여 자율적으로 발생·증폭되는 진동 불안정 현상', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(114, 'Shock Mount', '충격 방지 마운트', '기계가 받는 충격을 완화하거나 격리시키기 위해 사용하는 방진 부품', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(115, 'Contact Stiffness', '접촉 강성', '두 물체가 맞닿은 면에서의 변형 저항으로, 베어링·기어 등에서 중요한 특성', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(116, 'Pseudo-Static Analysis', '의사정적 해석', '동적 하중을 등가 정적 하중으로 간주해 단순화하여 해석하는 방법', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(117, 'Viscoelastic Material', '점탄성 재료', '탄성 특성과 점성 특성을 동시에 가져 시간·주파수 의존적인 감쇠 성능을 보임', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(118, 'Acoustic Leak Detection', '음향 누설 탐지', '파이프나 탱크 등에서 발생하는 누설음을 감지해 위치와 크기를 추정하는 기법', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(119, 'Phononic Crystal', '포노닉 결정', '주기구조를 통해 특정 주파수의 음파를 반사·굴절·제어하는 고기능성 소재', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(120, 'Partial Discharge Noise', '부분 방전 소음', '고전압 장비 내부에서 부분방전 시 발생하는 초음파나 가청 소음', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(121, 'PVDF Sensor', 'PVDF 센서', '압전특성을 가진 폴리머로 만든 진동·충격 센서 (Polyvinylidene fluoride)', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(122, 'RMS Value', 'RMS 값', '시간신호의 에너지 등가값을 나타내는 Root Mean Square', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(123, 'Acoustic Streaming', '음향 유동', '강한 음장이 매질에 운동량을 부여해 소규모 유동이 발생하는 현상', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(124, 'Self-Excited Vibration', '자려 진동', '시스템 내부 에너지원으로 인해 스스로 발생·증폭하는 진동 (플러터, 채터 등)', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(125, 'Chatter', '채터', '절삭 공정 등에서 공구와 공작물 사이 상호작용으로 발생하는 고주파 진동', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(126, 'Thermoacoustics', '열음향학', '열원과 음향이 상호작용하여 압력진동·열전달 등이 복합적으로 일어나는 학문', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(127, 'Soundscape', '사운드스케이프', '인간이 인지하는 음환경 전체를 종합적으로 다루는 개념으로, 도시·자연의 소리 등 포함', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(128, 'Strouhal Number', '스트로할 수', '유동-진동 상관관계를 나타내는 무차원 수로, 와류 박리 등 현상 분석에 사용', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(129, 'Cremer Impedance', '크레머 임피던스', '채널 내 음의 감쇠량을 최소화하도록 설계된 이론적 최적 임피던스', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(130, 'Beat Frequency', '비트 주파수', '가까운 두 주파수 간 간섭으로 발생하는 진폭의 주기적 증감 현상', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(131, 'Sloshing', '슬로싱', '액체가 탱크 안에서 출렁거리며 발생하는 동적 거동 및 소음 진동', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(132, 'Flow Noise', '유동 소음', '액체·가스 흐름이 경계나 장애물을 만나면서 발생하는 난류 소음', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(133, 'Baffle', '배플', '소리나 흐름을 제어하기 위해 설치되는 판이나 격벽', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(134, 'Acoustic Diode', '음향 다이오드', '소리가 일방향으로만 전파되도록 설계된 비선형 음향 소자', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(135, 'Flutter Echo', '플러터 에코', '두 개의 평행면에서 소리가 반복 반사되어 갑작스러운 딜레이 음을 내는 현상', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(136, 'Creep', '크리프', '재료가 장시간 작은 응력에도 서서히 변형이 누적되는 현상으로 진동 특성에도 영향', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(137, 'Impedance Tube', '임피던스 관', '재료의 흡음율이나 전송 손실 등을 측정하기 위해 사용되는 실험 장치', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(138, 'Acoustic Resonance', '음향 공진', '폐관이나 캐비티 내에서 특정 주파수의 음파가 크게 증폭되는 현상', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(139, 'Sound Field Control', '음장 제어', '스피커 배열, 능동 제어 등을 통해 공간 내 음장의 분포를 원하는 형태로 조절', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(140, 'LMS Algorithm', 'LMS 알고리즘', '능동 소음 제어나 적응 필터에서 오차를 최소화하기 위해 사용되는 적응 알고리즘', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(141, 'Vacuum Pump Noise', '진공 펌프 소음', '펌프 내부에서 유체(기체)가 이송되며 발생하는 소음, 배출구 등에서 측정 가능', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(142, 'Convergence Ratio', '수렴 비율', '적응제어나 반복 알고리즘이 목표값에 도달하는 속도를 나타내는 지표', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(143, 'Structural Resonance', '구조 공진', '빔·판·쉘 구조물이 고유 주파수에서 큰 진폭의 진동을 일으키는 현상', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(144, 'Active Mount', '능동 마운트', '센서·액추에이터를 탑재해 실시간으로 진동을 상쇄하거나 조절하는 지지 부품', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(145, 'Transfer Function Synthesis', '전달함수 합성', '여러 경로를 통해 전달되는 진동·소음을 합성 분석해 전체 응답을 구하는 기법', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(146, 'Optical Interferometry', '광 간섭계 측정', '광 간섭 현상을 이용해 미세 변위나 진동을 정밀 계측하는 비접촉 방식', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(147, 'Strain Gage Rosette', '로제트 게이지', '여러 방향으로 배치된 변형률 게이지를 통해 2D 변형장(주응력 등)을 측정', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(148, 'Curved Beam Theory', '곡선 보 이론', '곡률이 큰 보(beam)의 응력·변형 해석을 위해 사용하는 확장된 보 해석 이론', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(149, 'Energy Method', '에너지 해법', '계의 변형 에너지·운동 에너지를 이용해 고유치 문제나 변형을 해석하는 방법', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(150, 'Spectral Density', '스펙트럼 밀도', '신호나 진동·소음의 에너지를 주파수 영역에서 분포로 나타낸 함수', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(151, 'Pseudo-Excitation Method', '의사 가진 기법', '랜덤 진동 해석에서 가상의 단일 사인 가진을 중첩해 응답을 효율적으로 구하는 방법', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(152, 'Piezoelectric Actuator', '압전 액추에이터', '압전 소재에 전압을 인가해 미세 변위를 생성, 진동 제어 등에 사용', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(153, 'Conductive Hearing Loss', '전도성 난청', '음이 외이도·중이 전달 과정에서 문제가 생겨 청각 손실이 발생하는 현상', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(154, 'ANC Headphone', '능동 소음제거 헤드폰', '착용 시 반대 위상의 음원을 삽입해 외부 소음을 상쇄하는 헤드폰', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(155, 'Anechoic Termination', '무향 종단', '도관 끝에 음이 반사되지 않도록 설계된 경계 조건으로, 측정 시 반사 파동 최소화', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(156, 'Finite Difference Method (FDM)', '유한차분법', '연속 방정식을 이산 격자로 변환해 근사해를 구하는 수치해석 기법', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(157, 'Acoustic Grating', '음향 격자', '주기적 구조로 음파의 회절·산란을 제어해 원하는 음향 효과를 얻는 배열', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(158, 'A-weighted Sound Level (dBA)', 'A-가중 음압 레벨', '인간 청각 특성을 고려한 A-가중 필터 적용 음압 레벨', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(159, 'Back-Propagation', '역전파', '신경망 훈련 등에 사용되는 알고리즘으로, 음향 패턴 인식 등에도 활용 가능', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(160, 'Digital Signal Processing (DSP)', '디지털 신호 처리', '진동·음향 등을 디지털로 샘플링해 필터링, 분석, 합성하는 전산적 방법', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(161, 'Aeroelastic Flutter', '공력 탄성 플러터', '날개나 구조물이 유동과 상호작용해 자려진동이 발생하고 공진이 증폭되는 현상', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(162, 'Tonal Pressure Fluctuation', '음조성 압력 변동', '특정 주파수대가 두드러진 톤으로 나타나는 압력 변동', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(163, 'Hybrid Silencer', '하이브리드 소음기', '반응형+흡음형을 결합하거나 능동+수동 방식을 결합해 광대역 소음을 제어하는 소음기', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(164, 'Acutance', '에큐턴스', '음향·영상에서 경계선 선예도를 나타내는 지표 (영상 분야에서 주로 사용되나, 확장 가능)', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(165, 'Vinyl Sound Barrier', '비닐 차음재', '방음 공사에 사용되는 무거운 비닐 소재로, 저주파대 차음에 효과', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(166, 'Torsional Damper', '비틀림 댐퍼', '회전체의 축 비틀림 진동을 흡수·감쇠시키는 장치', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(167, 'Creep Vibration', '크리프 진동', '고온·고응력 환경에서 재료에 크리프 변형이 누적되어 나타나는 진동 특성 변화', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(168, 'Sound Transmission Class (STC)', '음 전달 손실 등급', '건축물 벽, 문 등의 차음 성능을 등급화한 지수', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(169, 'High Cycle Fatigue (HCF)', '고사이클 피로', '응력이 상대적으로 작지만 진동 횟수가 매우 많을 때 발생하는 피로 현상', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(170, 'Low Cycle Fatigue (LCF)', '저사이클 피로', '응력이 큰 상태에서 반복 변형 횟수가 적어도 재료에 피로 손상이 누적되는 현상', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(171, 'Bending Wave', '굽힘 파', '판이나 보에서 횡방향 변형으로 전파되는 파동 형태', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(172, 'Green’s Function', '그린 함수', '편미분방정식 해석에서 점특이 가진에 대한 해를 표현해 소음·진동장 해석에 적용', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(173, 'Time Reversal Acoustics', '시간 반전 음향', '음향 신호를 시간 축에서 역으로 재생해 특정 위치에 에너지를 집중시키는 기법', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(174, 'Coriolis Force', '코리올리 힘', '회전체 내 유동·진동 해석 시, 관성계와 회전계 사이에서 나타나는 가상 힘', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(175, 'Instantaneous Frequency', '순간 주파수', '시간-주파수 해석에서 시시각각 변하는 주파수 성분', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(176, 'Shock Isolation', '충격 절연', '충격이 전달되지 않도록 시스템을 격리시키거나 방진 소재를 사용하는 기술', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(177, 'Compressive Wave', '압축 파', '길이방향으로 밀고 당기는 방식으로 전파되는 종파(음파 등)', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(178, 'Boundary Layer Noise', '경계층 소음', '유동이 물체 표면을 따라 형성되는 경계층에서 발생하는 난류 소음', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(179, 'Sensory Dissonance', '감각적 불협화음', '두 톤이 가까운 주파수에 있을 때 발생하는 귀에 거슬리는 음정 (심리음향 분야)', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(180, 'Stick-Slip', '스틱-슬립', '마찰 접촉면에서 정지-미끄럼이 반복되어 진동 또는 소음이 발생하는 현상', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(181, 'Self-Sustained Oscillation', '자가유지 진동', '시스템 내부 에너지원으로 인해 외부 가진 없이도 지속되는 진동', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(182, 'Thermal Noise', '열 잡음', '물질의 분자 운동에 의해 발생하는 전기적·음향적 무작위 신호', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(183, 'Brake Squeal', '브레이크 스퀼', '브레이크 패드와 디스크 간 마찰로 인해 발생하는 고주파 진동·소음', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(184, 'Rainflow Counting', '빗물흐름 계산', '변동 하중 신호에서 피로 손상을 계산할 때 사용되는 알고리즘', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(185, 'Low-Noise Propeller', '저소음 프로펠러', '블레이드 형상·배치를 최적화해 소음 발생을 최소화한 프로펠러', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(186, 'Sound Deflection', '음향 편향', '온도나 풍속 경도 차이 등으로 인해 음파 전파 경로가 휘어지는 현상', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(187, 'Micro-Perforated Panel (MPP)', '미세 천공 패널', '아주 작은 구멍이 무수히 뚫린 패널로, 광대역 흡음 특성을 가지는 음향재', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(188, 'Porous Absorber', '다공질 흡음재', '스폰지, 유공질 등 내부 구조로 소리 에너지를 흡수·감쇠시키는 소재', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(189, 'Smart Material', '스마트 소재', '주변 자극(전기, 자기, 온도 등)에 따라 물성(진동, 음향 특성)이 능동적으로 변하는 재료', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(190, 'Baffle Step', '배플 스텝', '스피커 등에서 배플 폭과 관련된 주파수 영역에서 음압 응답이 변화하는 현상', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(191, 'Tonotopic Organization', '음색지각 지도', '내이(달팽이관)에서 주파수별로 공간적 분포가 다르게 감지되는 생리학적 구조', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(192, 'Annoyance Level', '불쾌도', '소음이 듣는 이에게 얼마나 거슬림을 주는지 평가하는 주관적 지표', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(193, 'Airborne Ultrasound', '공기 중 초음파', '초음속(>20kHz) 대역의 음파가 공기를 매질로 전파되는 현상, 센서·검출 등 활용', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(194, 'Electronically Controlled Suspension', '전자제어 서스펜션', '차량 진동·승차감을 전자적으로 제어해 소음·진동을 줄이는 시스템', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(195, 'Structure-Borne Vibration', '구조 전달 진동', '기계나 충격이 구조물에 전달되어 다른 지점에서 재방사되는 진동', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(196, 'Acoustic Absorption Coefficient', '음향 흡음률', '재료가 입사된 음향 에너지를 얼마나 흡수하는지 나타내는 비율', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(197, 'Dipole Source', '이중극 음원', '방향성이 강한 두 개의 극성이 반대인 음원 쌍으로, 특정 방향 분포의 소음을 설명', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(198, 'Directivity Pattern', '방사 지향 특성', '음원이나 마이크가 특정 각도에서 어떻게 소리를 방사·수음하는지 나타낸 분포', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(199, 'Phase Angle', '위상각', '진동이나 파동에서 기준 시점과 실제 신호가 얼마나 어긋나 있는지를 나타내는 값', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(200, 'Loudness Level', '음의 크기 레벨', '청각학적으로 인지되는 소리의 크기를 평가하는 척도로 폰(phon) 단위 사용', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(201, 'Weber-Fechner Law', '베버-페히너 법칙', '자극의 물리적 세기가 로그 스케일로 지각된다는 심리음향 법칙', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(202, 'Ultrasonic Welding', '초음파 용접', '고주파 진동을 이용해 금속·플라스틱 등을 마찰 가열로 접합하는 공정', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(203, 'Ray Tracing', '레이 추적', '음향 또는 빛이 반사·굴절·회절되는 경로를 추적하는 시뮬레이션 방법', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(204, 'Pseudo-Noise Sequence', '의사 잡음 신호', '랜덤한 듯 보이지만 재현 가능한 수열로, TPA나 응답 식별 등에 활용', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(205, 'Isolation Forest', '아이솔레이션 포레스트', '이상치(Outlier) 탐지 알고리즘으로, 진동·소음 데이터 이상 검출에도 사용 가능', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(206, 'Adaptive Filter', '적응 필터', '실시간으로 환경 변화에 맞춰 계수를 조정해 원하는 신호만 통과 혹은 제거', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(207, 'Kalman Filter', '칼만 필터', '동적 시스템 상태 추정에 쓰이는 재귀적 알고리즘으로 잡음 신호가 있는 시스템에 적용', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(208, 'Sensor Fusion', '센서 융합', '다양한 센서에서 얻은 정보를 결합해 보다 정확한 측정·평가 결과를 도출', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(209, 'Magnetostrictive Actuator', '자왜 액추에이터', '자기장에 의해 변형을 일으키는 자성재료를 사용해 진동 제어나 구동에 활용', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(210, 'Ultrasonic Spray', '초음파 분무', '초음파 진동을 이용해 액체를 미세한 에어로졸 형태로 분무하는 기술', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(211, 'Piezoresistive Sensor', '압저항 센서', '압력·응력 변화에 따라 전기저항이 달라지는 소재를 활용한 센서', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(212, 'Vibration Criterion (VC)', '진동 기준 (VC)', '반도체·정밀가공 장비 등 민감도가 높은 설비의 진동 허용 기준', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(213, 'Seismic Mass', '관성 질량', '진동 계측이나 방진 시스템에서 기준이 되는 질량체', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(214, 'Elastomer', '엘라스토머', '탄성 특성이 우수한 고분자 재료로, 방진재·진동 절연재로 널리 사용됨', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(215, 'Exponential Window', '지수 윈도우', '신호 분석 시 과도구간 또는 끝부분 영향을 줄이기 위해 적용하는 가중 함수', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(216, 'Hanning Window', '해닝 윈도우', '스펙트럼 분석에서 누출(leakage)을 완화하기 위해 사용되는 윈도우 함수', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(217, 'Leakage', '누출', 'FFT 등 이산 변환에서 분석 구간 밖으로 에너지가 퍼지는 현상', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(218, 'Trigger Level', '트리거 레벨', '신호 계측 시 측정 시작·종료를 결정하기 위한 임계 크기', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(219, 'DAQ (Data Acquisition)', '데이터 수집', '센서나 측정 장치로부터 진동·음향 등의 아날로그 신호를 디지털화해 저장하는 과정', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(220, 'Bandpass Filter', '대역통과 필터', '특정 주파수 구간만 통과시키고 그 외는 감쇠시키는 필터', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(221, 'Bandstop Filter', '대역저지 필터', '특정 주파수 구간만 제거하고 나머지는 통과시키는 필터', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(222, 'Shock Pulse Method', '충격 펄스 기법', '베어링 등 구름접촉부 결함 진단 시, 충격성 펄스를 강조해 측정하는 방법', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(223, 'Unbalance', '불평형', '회전체 질량이 균일하지 않아 원심력이 발생해 진동이 유발되는 상태', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(224, 'Magnification Factor', '증폭 계수', '공진 근처에서 진폭이 얼마나 증폭되는지를 나타내는 지표', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(225, 'Coriolis Flow Meter', '코리올리 유량계', '관을 진동시키고 질량유량에 따른 고유 주파수 변화를 측정해 유량을 계측', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(226, 'Grating Lobe', '그레이팅 로브', '마이크 배열 빔포밍에서 배열 주기가 길 때 생기는 기생적 측방향 빔', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(227, 'Infrasonic', '초저주파', '20Hz 미만의 낮은 주파수 음파로, 지진파나 대기 중 저주파 소음 등에 해당', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(228, 'Tachometer Signal', '회전수 신호', '회전체의 rpm 등을 측정하기 위한 센서 신호', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(229, 'Impulse Response', '임펄스 응답', '시스템에 매우 짧은 충격(임펄스)를 가했을 때 나타나는 시간영역 응답', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(230, 'Time Reversal Mirror', '시간 반전 거울', '음향홀로그래피의 일종으로, 특정 지점에 음향 에너지를 집중시키는 기법', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(231, 'Polar Directivity Plot', '폴라 지향성 플롯', '음원이나 마이크가 각도별로 얼마나 음압을 방사·수음하는지 극좌표로 나타낸 그래프', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(232, 'Turbo Lag Noise', '터보 래그 소음', '터보차저가 회전속도를 올리는 과정에서 일시적인 압력 부족·유동 잡음이 발생', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(233, 'Squeak and Rattle', '스퀵 앤 래틀', '자동차 내장재나 부품 간 마찰·헐거움으로 인해 발생하는 잡음', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(234, 'Particle Velocity', '입자 속도', '음향장에서 매질 입자가 진동하는 속도의 크기와 방향', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(235, 'Noise Certification', '소음 인증 wrw', '항공기,   됴됻 차량 등이 규정된 소음 기준을 만족하는지 확인하기 위한 제도', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09'),
	(236, 'Elasto-Plastic Vibration', '탄소성 진동', '재료가 탄성 한계를 넘어 소성 범위에서도 반복하중을 받아 진동하는 현상', 'http://www.ktword.co.kr/img_data/4477_1.jpg', '2025-03-09');

-- 테이블 bbs.glos_req 구조 내보내기
CREATE TABLE IF NOT EXISTS `glos_req` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `glos_id` int(11) NOT NULL DEFAULT 0,
  `req_msg` varchar(500) NOT NULL DEFAULT '0',
  `req_date` varchar(20) NOT NULL DEFAULT curdate(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 테이블 데이터 bbs.glos_req:~9 rows (대략적) 내보내기
DELETE FROM `glos_req`;
INSERT INTO `glos_req` (`id`, `glos_id`, `req_msg`, `req_date`) VALUES
	(1, 16, '내용을 ~~ 바꿔 주세요', '2025-03-08'),
	(2, 13, '내용을 ~~ 바꿔 주세요', '2025-03-08'),
	(3, 120, '내용을 ~~ 바꿔 주세요', '2025-03-08'),
	(4, 2, '내용을 ~~ 바꿔 주세요', '2025-03-08'),
	(5, 188, '내용을 ~~ 바꿔 주세요', '2025-03-08'),
	(6, 1, '내용을 ~~ 바꿔 주세요', '2025-03-08'),
	(7, 95, '내용을 ~~ 바꿔 주세요', '2025-03-08'),
	(8, 119, '내용을 ~~ 바꿔 주세요', '2025-03-09'),
	(9, 1, '테스트 입니다.', '2025-03-09');

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
INSERT INTO `inbound_data` (`id`, `date`, `title`, `quantity`, `isbn`) VALUES
	('88632b4f-207c-46ba-a9ff-1181c178c330', '2025-01-02', 'Fahrenheit 451', 111, '978-718-76697-8'),
	('c1655f88-8206-4e31-ae2c-a75ac05ca069', '2025-01-01', 'The Great Gatsby', 136, '978-228-11889-2'),
	('c895c4af-8121-4b70-b11c-1006fa16d3f0', '2025-01-09', 'The Grapes of Wrath 111', 125, '978-257-39654-1'),
	('e76d177f-1409-4f5f-83e0-c31874f4e6c0', '2025-01-10', 'Brave New World', 111, '978-691-41538-9'),
	('f3761280-bee4-430a-84bc-15d5b9600452', '2025-01-04', 'Pride and Prejudice', 146, '978-787-82570-8'),
	('f6114592-7a33-45dc-80b3-97dabf622c1d', '2025-01-03', '123123123123123', 111, '978-498-21606-9'),
	('UHJDY77gnD', '2025-02-13', '22', 0, '11');

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

-- 테이블 bbs.lockers 구조 내보내기
CREATE TABLE IF NOT EXISTS `lockers` (
  `id` int(11) NOT NULL,
  `status` enum('사용중','사용가능','일시중지','수리중') NOT NULL,
  `assigned_user_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `assigned_user_id` (`assigned_user_id`),
  CONSTRAINT `lockers_ibfk_1` FOREIGN KEY (`assigned_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 테이블 데이터 bbs.lockers:~50 rows (대략적) 내보내기
DELETE FROM `lockers`;
INSERT INTO `lockers` (`id`, `status`, `assigned_user_id`) VALUES
	(1, '사용중', 1),
	(2, '사용가능', NULL),
	(3, '일시중지', NULL),
	(4, '수리중', NULL),
	(5, '사용가능', NULL),
	(6, '사용중', 2),
	(7, '사용가능', NULL),
	(8, '사용가능', NULL),
	(9, '수리중', NULL),
	(10, '사용가능', NULL),
	(11, '사용중', 3),
	(12, '일시중지', NULL),
	(13, '사용가능', NULL),
	(14, '수리중', NULL),
	(15, '사용중', 4),
	(16, '사용가능', NULL),
	(17, '사용중', 5),
	(18, '사용가능', NULL),
	(19, '일시중지', NULL),
	(20, '사용중', 6),
	(21, '사용가능', NULL),
	(22, '사용가능', NULL),
	(23, '사용가능', NULL),
	(24, '수리중', NULL),
	(25, '사용중', 7),
	(26, '사용가능', NULL),
	(27, '일시중지', NULL),
	(28, '사용중', 8),
	(29, '사용가능', NULL),
	(30, '사용가능', NULL),
	(31, '사용중', 9),
	(32, '사용가능', NULL),
	(33, '수리중', NULL),
	(34, '사용중', 10),
	(35, '사용가능', NULL),
	(36, '사용가능', NULL),
	(37, '사용가능', NULL),
	(38, '사용가능', NULL),
	(39, '사용중', 11),
	(40, '사용가능', NULL),
	(41, '사용가능', NULL),
	(42, '일시중지', NULL),
	(43, '사용중', 12),
	(44, '수리중', NULL),
	(45, '사용중', 13),
	(46, '사용가능', NULL),
	(47, '사용가능', NULL),
	(48, '사용중', 14),
	(49, '사용가능', NULL),
	(50, '사용가능', NULL);

-- 테이블 bbs.locker_usage_history 구조 내보내기
CREATE TABLE IF NOT EXISTS `locker_usage_history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `locker_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `usage_date` date NOT NULL,
  `remarks` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `locker_id` (`locker_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `locker_usage_history_ibfk_1` FOREIGN KEY (`locker_id`) REFERENCES `lockers` (`id`) ON DELETE CASCADE,
  CONSTRAINT `locker_usage_history_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 테이블 데이터 bbs.locker_usage_history:~19 rows (대략적) 내보내기
DELETE FROM `locker_usage_history`;
INSERT INTO `locker_usage_history` (`id`, `locker_id`, `user_id`, `usage_date`, `remarks`) VALUES
	(1, 1, 1, '2024-03-01', '배정됨'),
	(2, 1, 1, '2024-03-05', '반납됨'),
	(3, 6, 2, '2024-02-20', '배정됨'),
	(4, 6, 2, '2024-02-25', '반납됨'),
	(5, 11, 3, '2024-03-02', '배정됨'),
	(6, 11, 3, '2024-03-10', '반납됨'),
	(7, 15, 4, '2024-03-05', '배정됨'),
	(8, 15, 4, '2024-03-12', '반납됨'),
	(9, 17, 5, '2024-02-28', '배정됨'),
	(10, 17, 5, '2024-03-08', '반납됨'),
	(11, 20, 6, '2024-03-06', '배정됨'),
	(12, 25, 7, '2024-03-09', '배정됨'),
	(13, 28, 8, '2024-03-10', '배정됨'),
	(14, 31, 9, '2024-03-11', '배정됨'),
	(15, 34, 10, '2024-03-12', '배정됨'),
	(16, 39, 11, '2024-03-14', '배정됨'),
	(17, 43, 12, '2024-03-15', '배정됨'),
	(18, 45, 13, '2024-03-16', '배정됨'),
	(19, 48, 14, '2024-03-17', '배정됨');

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
INSERT INTO `member` (`id`, `pwd`, `name`, `email`) VALUES
	('aaaaaa', '$2a$10$WuAoYsZCNSPjIpSfyzA8LuI1jwWAeK4KYdqEHlOQS9hl5jAeREY12', '가나다', 'aaaaa@aa.com'),
	('aaaaaaa', '$2a$10$je84beDucImRGv4mFY6eA.wfE61GAXLFFRLCemQA9UimwLc2Yk5uq', '다가가', 'aaaaaaa@a.com'),
	('test0001', '$2a$10$jOGykkRPNa5C9.SBtswdcujhuaVgCldLPMOXZMIw1/uCY5lVbZGLW', '자더더', 'a@aa.com'),
	('test0002', '$2a$10$EAsVdOzTN3mttYSmyh1lWO8TD3H/e0hRPnWxdcWaoRJT/m1eK5aW.', '김장성', 'a@a.com'),
	('test0003', '$2a$10$eyy06XA.kAoGX/RUr4dHGOmYgphsZQqkdx8oEhcUjkTmzo4zlLmJC', '박덩그', 'pa@aa.com'),
	('test0004', '$2a$10$wXs4gYfkpaN.tV2S1hJb.OqMmj0H4LJj2.Xx8cBmfvpHguV4XrYW6', '노도가', 'aa@aa.com');

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
INSERT INTO `outbound_data` (`id`, `date`, `title`, `quantity`, `isbn`) VALUES
	('88632b4f-207c-46ba-a9ff-1181c178c330', '2025-01-15', 'Fahrenheit 451', 11, '978-718-76697-8'),
	('c1655f88-8206-4e31-ae2c-a75ac05ca069', '2025-01-01', 'The Great Gatsby', 36, '978-228-11889-2'),
	('c895c4af-8121-4b70-b11c-1006fa16d3f0', '2025-01-15', 'The Grapes of Wrath', 25, '978-257-39654-1'),
	('e76d177f-1409-4f5f-83e0-c31874f4e6c0', '2025-01-11', 'Brave New World', 11, '978-691-41538-9'),
	('f3761280-bee4-430a-84bc-15d5b9600452', '2025-01-04', 'Pride and Prejudice', 46, '978-787-82570-8'),
	('f6114592-7a33-45dc-80b3-97dabf622c1d', '2025-01-03', '123123123123123', 11, '978-498-21606-9');

-- 테이블 bbs.read_history 구조 내보내기
CREATE TABLE IF NOT EXISTS `read_history` (
  `latest_access_at` varchar(50) DEFAULT NULL,
  `bbs_seq` varchar(50) DEFAULT NULL,
  `id` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 테이블 데이터 bbs.read_history:~63 rows (대략적) 내보내기
DELETE FROM `read_history`;
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

-- 테이블 bbs.reservations 구조 내보내기
CREATE TABLE IF NOT EXISTS `reservations` (
  `id` varchar(50) NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `departmentId` int(11) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `time` time DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 테이블 데이터 bbs.reservations:~10 rows (대략적) 내보내기
DELETE FROM `reservations`;
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

-- 테이블 bbs.stock 구조 내보내기
CREATE TABLE IF NOT EXISTS `stock` (
  `stock_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `qty` int(11) DEFAULT NULL,
  PRIMARY KEY (`stock_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 테이블 데이터 bbs.stock:~0 rows (대략적) 내보내기
DELETE FROM `stock`;

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

-- 테이블 bbs.users 구조 내보내기
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 테이블 데이터 bbs.users:~20 rows (대략적) 내보내기
DELETE FROM `users`;
INSERT INTO `users` (`id`, `name`) VALUES
	(8, '강호진'),
	(13, '권태형'),
	(20, '김도윤'),
	(2, '김영희'),
	(16, '문지훈'),
	(4, '박지영'),
	(9, '배수진'),
	(12, '서민호'),
	(14, '송다은'),
	(6, '오민준'),
	(11, '유지은'),
	(17, '이서연'),
	(10, '이정환'),
	(3, '이철수'),
	(7, '정윤아'),
	(18, '조민기'),
	(19, '차수현'),
	(5, '최수민'),
	(15, '한지성'),
	(1, '홍길동');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
