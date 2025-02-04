-- bbs 데이터베이스 구조 내보내기
CREATE DATABASE IF NOT EXISTS `bbs` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `bbs`;

-- 테이블 bbs.inbound_data 구조 내보내기
CREATE TABLE IF NOT EXISTS `inbound_data` (
  `id` char(36) NOT NULL,
  `date` date NOT NULL DEFAULT curdate(),
  `title` varchar(255) NOT NULL DEFAULT '''''',
  `quantity` int(10) unsigned NOT NULL DEFAULT 0,
  `isbn` varchar(20) NOT NULL DEFAULT '''''',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 테이블 데이터 bbs.inbound_data:~20 rows (대략적) 내보내기
DELETE FROM `inbound_data`;
/*!40000 ALTER TABLE `inbound_data` DISABLE KEYS */;
INSERT INTO `inbound_data` (`id`, `date`, `title`, `quantity`, `isbn`) VALUES
	('88632b4f-207c-46ba-a9ff-1181c178c330', '2025-01-14', 'Fahrenheit 451', 111, '978-718-76697-8'),
	('c1655f88-8206-4e31-ae2c-a75ac05ca069', '2025-01-01', 'The Great Gatsby', 136, '978-228-11889-2'),
	('c895c4af-8121-4b70-b11c-1006fa16d3f0', '2025-01-15', 'The Grapes of Wrath', 125, '978-257-39654-1'),
	('e76d177f-1409-4f5f-83e0-c31874f4e6c0', '2025-01-11', 'Brave New World', 111, '978-691-41538-9'),
	('f3761280-bee4-430a-84bc-15d5b9600452', '2025-01-04', 'Pride and Prejudice', 146, '978-787-82570-8'),
	('f6114592-7a33-45dc-80b3-97dabf622c1d', '2025-01-03', '123123123123123', 111, '978-498-21606-9');



-- 테이블 bbs.inbound_data 구조 내보내기
CREATE TABLE IF NOT EXISTS `outbound_data` (
  `id` char(36) NOT NULL,
  `date` date NOT NULL DEFAULT curdate(),
  `title` varchar(255) NOT NULL DEFAULT '''''',
  `quantity` int(10) unsigned NOT NULL DEFAULT 0,
  `isbn` varchar(20) NOT NULL DEFAULT '''''',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 테이블 데이터 bbs.inbound_data:~20 rows (대략적) 내보내기
DELETE FROM `outbound_data`;
/*!40000 ALTER TABLE `inbound_data` DISABLE KEYS */;
INSERT INTO `outbound_data` (`id`, `date`, `title`, `quantity`, `isbn`) VALUES
	('88632b4f-207c-46ba-a9ff-1181c178c330', '2025-01-14', 'Fahrenheit 451', 11, '978-718-76697-8'),
	('c1655f88-8206-4e31-ae2c-a75ac05ca069', '2025-01-01', 'The Great Gatsby', 36, '978-228-11889-2'),
	('c895c4af-8121-4b70-b11c-1006fa16d3f0', '2025-01-15', 'The Grapes of Wrath', 25, '978-257-39654-1'),
	('e76d177f-1409-4f5f-83e0-c31874f4e6c0', '2025-01-11', 'Brave New World', 11, '978-691-41538-9'),
	('f3761280-bee4-430a-84bc-15d5b9600452', '2025-01-04', 'Pride and Prejudice', 46, '978-787-82570-8'),
	('f6114592-7a33-45dc-80b3-97dabf622c1d', '2025-01-03', '123123123123123', 11, '978-498-21606-9');


-- 테이블 test.dates 구조 내보내기
CREATE TABLE IF NOT EXISTS `dates` (
  `date_id` int(11) NOT NULL AUTO_INCREMENT,
  `date` date NOT NULL,
  PRIMARY KEY (`date_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- 테이블 데이터 test.dates:~5 rows (대략적) 내보내기
INSERT IGNORE INTO `dates` (`date_id`, `date`) VALUES
	(1, '2025-01-02'),
	(2, '2025-01-03'),
	(3, '2025-01-04'),
	(4, '2025-01-05'),
	(5, '2025-01-06');

DROP TABLE IF EXISTS `events`;
CREATE TABLE IF NOT EXISTS `events` (
  `event_id` varchar(50) NOT NULL DEFAULT '',
  `date_id` int(11) DEFAULT NULL,
  `time` time NOT NULL,
  `description` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  PRIMARY KEY (`event_id`),
  KEY `date_id` (`date_id`),
  CONSTRAINT `events_ibfk_1` FOREIGN KEY (`date_id`) REFERENCES `dates` (`date_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- 테이블 데이터 test.events:~4 rows (대략적) 내보내기
INSERT IGNORE INTO `events` (`event_id`, `date_id`, `time`, `description`) VALUES
	('1000', 1, '17:00:00', '개발자 인터뷰'),
	('1111', 1, '16:30:00', '네트웍 점검'),
	('1212', 1, '16:30:00', '공공 입찰/투찰 계획안 협의'),
	('999', 1, '16:30:00', '디자인팀 회의');