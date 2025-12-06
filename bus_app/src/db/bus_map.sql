-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 06, 2025 at 10:16 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.1.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `bus_map`
--

-- --------------------------------------------------------

--
-- Table structure for table `bus`
--

CREATE TABLE `bus` (
  `bus_id` varchar(20) NOT NULL,
  `license_plate` varchar(50) DEFAULT NULL,
  `capacity` int(11) DEFAULT NULL,
  `default_route_id` varchar(20) DEFAULT NULL,
  `status` varchar(100) DEFAULT 'Ngưng hoạt động',
  `departure_status` varchar(100) DEFAULT 'Chưa xuất phát',
  `registry` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bus`
--

INSERT INTO `bus` (`bus_id`, `license_plate`, `capacity`, `default_route_id`, `status`, `departure_status`, `registry`) VALUES
('XB1', '59B-99999', 25, 'TD1', 'Đang hoạt động', 'Chưa xuất phát', NULL),
('XB2', '59A-12345', 20, 'TD2', 'Đang hoạt động', 'Chưa xuất phát', NULL),
('XB3', '59C-88888', 10, NULL, 'Ngưng hoạt động', 'Chưa xuất phát', NULL),
('XE001', '59B-32167', 16, 'R01', 'Đang hoạt động', 'Đã xuất phát', '2027-11-10'),
('XE002', '59B-98012', 16, NULL, 'Đang hoạt động', 'Chưa xuất phát', '2026-11-03'),
('XE003', '59-15602', 16, NULL, 'Đang bảo trì', 'Đã kết thúc', '2029-11-15'),
('XE004', '59C-48822', 16, NULL, 'Ngưng hoạt động', 'Chưa xuất phát', '2025-11-19'),
('XE005', '59A-32512', 16, 'TD3', 'Đang hoạt động', 'Đã xuất phát', '2025-11-22'),
('XE006', '59D-11111', 18, 'R02', 'Đang hoạt động', 'Chưa xuất phát', NULL),
('XE007', '59D-22222', 18, 'R03', 'Đang hoạt động', 'Chưa xuất phát', NULL),
('XE008', '59D-33333', 22, 'TD1', 'Đang hoạt động', 'Chưa xuất phát', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `bus_location`
--

CREATE TABLE `bus_location` (
  `location_id` int(11) NOT NULL,
  `bus_id` varchar(20) DEFAULT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `vi_tri_text` varchar(255) DEFAULT NULL,
  `timestamp` datetime DEFAULT NULL,
  `is_latest` tinyint(1) DEFAULT 0,
  `nearest_stop_id` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bus_location`
--

INSERT INTO `bus_location` (`location_id`, `bus_id`, `latitude`, `longitude`, `vi_tri_text`, `timestamp`, `is_latest`, `nearest_stop_id`) VALUES
(1, 'XB1', NULL, NULL, 'Gần cổng trường THPT A', '2025-11-14 07:00:00', 1, NULL),
(2, 'XB2', NULL, NULL, 'Ngã tư Nguyễn Trãi - Lê Lợi', '2025-11-14 07:10:00', 1, NULL),
(3, 'XE006', 10.76262200, 106.66017200, 'Gần cổng trường School A', '2025-12-01 06:35:00', 1, 'STOP1'),
(4, 'XE007', 10.76300000, 106.66100000, 'Đoạn trước Công viên', '2025-12-01 06:40:00', 1, 'STOP_T1');

-- --------------------------------------------------------

--
-- Table structure for table `bus_schedule`
--

CREATE TABLE `bus_schedule` (
  `schedule_id` varchar(50) NOT NULL,
  `route_id` varchar(20) DEFAULT NULL,
  `bus_id` varchar(20) DEFAULT NULL,
  `driver_id` varchar(20) DEFAULT NULL,
  `schedule_date` date DEFAULT NULL,
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `status` enum('Chưa bắt đầu','Đang thực hiện','Hoàn thành','Đã hủy') NOT NULL DEFAULT 'Chưa bắt đầu' COMMENT 'Trạng thái lịch trình'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bus_schedule`
--

INSERT INTO `bus_schedule` (`schedule_id`, `route_id`, `bus_id`, `driver_id`, `schedule_date`, `start_time`, `end_time`, `status`) VALUES
('LT1', 'TD1', 'XB1', 'TX001', '2025-11-28', '06:15:00', '07:45:00', ''),
('LT2', 'TD2', 'XB2', 'TX002', '2025-11-27', '06:45:00', '08:15:00', ''),
('LT3', 'R02', 'XE006', 'TX006', '2025-12-01', '06:30:00', '07:40:00', 'Chưa bắt đầu'),
('LT4', 'R03', 'XE007', 'TX007', '2025-12-01', '06:20:00', '17:29:10', 'Chưa bắt đầu'),
('LT5', 'TD1', 'XE008', 'TX008', '2025-12-02', '07:15:00', '08:45:00', 'Hoàn thành'),
('LT_TX007_001', 'TD1', 'XE007', 'TX007', '2025-12-01', '06:30:00', '17:29:20', 'Chưa bắt đầu'),
('LT_TX007_002', 'TD1', 'XE007', 'TX007', '2025-12-02', '06:30:00', NULL, 'Chưa bắt đầu'),
('LT_TX007_003', 'TD1', 'XE007', 'TX007', '2025-12-03', '06:30:00', NULL, 'Chưa bắt đầu'),
('LT_TX007_004', 'TD1', 'XE007', 'TX007', '2025-12-04', '06:30:00', NULL, 'Chưa bắt đầu'),
('LT_TX007_005', 'TD1', 'XE007', 'TX007', '2025-12-06', '16:15:11', '16:11:34', 'Chưa bắt đầu'),
('LT_TX007_006', 'TD2', 'XE007', 'TX007', '2025-12-05', '03:30:34', '03:31:04', 'Hoàn thành'),
('LT_TX007_007', 'TD1', 'XE007', 'TX007', '2025-12-09', '06:30:00', NULL, 'Chưa bắt đầu'),
('LT_TX007_008', 'TD1', 'XE007', 'TX007', '2025-12-10', '06:30:00', NULL, 'Chưa bắt đầu'),
('LT_TX007_009', 'TD1', 'XE007', 'TX007', '2025-12-11', '06:30:00', NULL, 'Chưa bắt đầu'),
('LT_TX007_010', 'TD1', 'XE007', 'TX007', '2025-12-12', '06:30:00', NULL, 'Chưa bắt đầu'),
('LT_TX007_011', 'TD1', 'XE007', 'TX007', '2025-12-13', '06:30:00', NULL, 'Chưa bắt đầu'),
('LT_TX007_012', 'TD1', 'XE007', 'TX007', '2025-12-16', '06:30:00', NULL, 'Chưa bắt đầu'),
('LT_TX007_013', 'TD1', 'XE007', 'TX007', '2025-12-17', '06:30:00', NULL, 'Chưa bắt đầu'),
('LT_TX007_014', 'TD1', 'XE007', 'TX007', '2025-12-18', '06:30:00', NULL, 'Chưa bắt đầu'),
('LT_TX007_015', 'TD1', 'XE007', 'TX007', '2025-12-19', '06:30:00', NULL, 'Chưa bắt đầu'),
('LT_TX007_016', 'TD1', 'XE007', 'TX007', '2025-12-20', '06:30:00', NULL, 'Chưa bắt đầu'),
('LT_TX007_017', 'TD1', 'XE007', 'TX007', '2025-12-23', '06:30:00', NULL, 'Chưa bắt đầu'),
('LT_TX007_018', 'TD1', 'XE007', 'TX007', '2025-12-24', '06:30:00', NULL, 'Chưa bắt đầu'),
('LT_TX007_019', 'TD1', 'XE007', 'TX007', '2025-12-26', '06:30:00', NULL, 'Chưa bắt đầu'),
('LT_TX007_020', 'TD1', 'XE007', 'TX007', '2025-12-27', '06:30:00', '02:52:52', 'Đã hủy'),
('XE001-01-11-2025', 'R01', 'XE001', 'TX003', '2025-11-01', '06:00:00', '07:15:00', '');

-- --------------------------------------------------------

--
-- Table structure for table `bus_status_history`
--

CREATE TABLE `bus_status_history` (
  `id` int(11) NOT NULL,
  `bus_id` varchar(20) NOT NULL,
  `status` enum('running','stopped','inactive') NOT NULL DEFAULT 'inactive',
  `updated_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bus_status_history`
--

INSERT INTO `bus_status_history` (`id`, `bus_id`, `status`, `updated_at`) VALUES
(1, 'XB1', 'running', '2025-11-25 00:29:33'),
(2, 'XB2', 'stopped', '2025-11-25 00:29:33'),
(3, 'XB3', 'inactive', '2025-11-25 00:29:33');

-- --------------------------------------------------------

--
-- Table structure for table `bus_stop`
--

CREATE TABLE `bus_stop` (
  `stop_id` varchar(20) NOT NULL,
  `route_id` varchar(20) DEFAULT NULL,
  `stop_name` varchar(100) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `stop_order` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bus_stop`
--

INSERT INTO `bus_stop` (`stop_id`, `route_id`, `stop_name`, `address`, `stop_order`) VALUES
('STOP1', 'TD1', 'DHSG', '273 An Dương Vương', 1),
('STOP10', 'TD3', 'PT', 'Nhà thi đấu Phú Thọ', 2),
('STOP11', 'TD2', 'SVH', 'Sư Vạn Hạnh', 3),
('STOP12', 'TD1', 'BNR', 'Khu Di tích Bến Nhà Rồng', 3),
('STOP2', 'TD1', 'BVYD', 'Bệnh viện Đại học Y Dược TP.HCM', 2),
('STOP3', 'TD1', 'TCV', 'Thảo Cầm Viên', 5),
('STOP4', 'TD1', 'DHSG', '273 An Dương Vương', 6),
('STOP5', 'TD1', 'DHSG 2', 'Đại học Sài Gòn (cơ sở 2)', 4),
('STOP6', 'TD2', 'DHKHTN', 'Trường ĐH KHTN', 2),
('STOP7', 'TD3', 'Sư Vạn Hạnh', 'Sư Vạn Hạnh', 3),
('STOP8', 'TD3', 'NTP', 'Bệnh viện Nguyễn Tri Phương', 1),
('STOP_T1', 'R01', 'SGU Cổng Chính', '273 An Dương Vương', 1),
('STOP_T2', 'R01', 'Bệnh viện ĐH Y Dược', '215 Hồng Bàng', 2),
('STOP_T3', 'R01', 'SGU Cơ sở 2', 'Nguyễn Trãi', 3);

-- --------------------------------------------------------

--
-- Table structure for table `driver`
--

CREATE TABLE `driver` (
  `driver_id` varchar(20) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `gender` enum('Nam','Nữ','Khác') DEFAULT NULL,
  `id_card` varchar(20) DEFAULT NULL,
  `rating` decimal(2,1) DEFAULT 5.0,
  `status` varchar(50) DEFAULT 'Rảnh',
  `license_class` varchar(10) DEFAULT 'B2',
  `work_schedule` set('MON','TUE','WED','THU','FRI','SAT','SUN') DEFAULT NULL,
  `profile_image` varchar(500) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `driver`
--

INSERT INTO `driver` (`driver_id`, `user_id`, `name`, `phone`, `address`, `email`, `dob`, `gender`, `id_card`, `rating`, `status`, `license_class`, `work_schedule`, `profile_image`, `created_at`) VALUES
('TX001', 4, 'Nguyễn Văn Hùng', '0459276157', 'Lê Hồng Phong', 'hung.nguyen@gmail.com', '1985-03-15', 'Nam', '123456789012', 4.5, 'Rảnh', 'B2', 'MON,TUE,WED,FRI,SAT', NULL, '2025-11-01 08:00:00'),
('TX002', 5, 'Trần Văn Trí', '0745128698', 'Trần Xuân Soạn', 'tri.tran@gmail.com', '1988-07-22', 'Nam', '234567890123', 4.8, 'Rảnh', 'B2', 'MON,TUE,WED,THU,FRI', NULL, '2025-11-01 08:30:00'),
('TX003', 6, 'Lê Hùng Dũng', '0789425698', 'Võ Văn Kiệt', 'dung.le@gmail.com', '1990-12-10', 'Nam', '345678901234', 4.2, 'Rảnh', 'B2', 'TUE,WED,THU,FRI,SAT', NULL, '2025-11-01 09:00:00'),
('TX004', 7, 'Phạm Anh Đức', '0785158496', 'Nguyễn Trãi', 'duc.pham@gmail.com', '1987-05-08', 'Nam', '456789012345', 4.9, 'Đang hoạt động', 'B2', 'TUE,WED,THU,FRI', NULL, '2025-11-01 09:30:00'),
('TX005', 8, 'Ngô Thị Minh Thi', '0978425987', 'Đức Trọng', 'thi.ngo@gmail.com', '1992-09-18', 'Nữ', '567890123456', 4.7, 'Nghỉ phép', 'B2', 'MON,TUE,WED,THU,FRI,SAT,SUN', NULL, '2025-11-01 10:00:00'),
('TX006', 13, 'Hoàng Văn Long', '0912345670', 'Đường Lê Lợi', 'long.hoang@gmail.com', '1986-02-02', 'Nam', '678901234567', 4.6, 'Rảnh', 'B2', 'MON,TUE,WED,THU,FRI', NULL, '2025-12-02 07:00:00'),
('TX007', 14, 'Lý Thị Hoa', '0912345671', 'Đường Trần Hưng Đạo', 'hoa.ly@gmail.com', '1991-05-12', 'Nữ', '789012345678', 4.4, 'Đang hoạt động', 'B2', 'MON,TUE,WED,THU,FRI', NULL, '2025-12-02 07:00:00'),
('TX008', 15, 'Nguyễn Minh Tú', '0912345672', 'Đường Nguyễn Thái Học', 'tu.nguyen@gmail.com', '1989-08-21', 'Nam', '890123456789', 4.3, 'Rảnh', 'B2', 'MON,TUE,WED,THU,FRI', NULL, '2025-12-02 07:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `notification`
--

CREATE TABLE `notification` (
  `id` int(11) NOT NULL,
  `recipient_type` enum('bus','driver','parent','system') NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `type` enum('manual','scheduled') DEFAULT 'manual',
  `scheduled_time` datetime DEFAULT NULL,
  `is_recurring` tinyint(1) DEFAULT 0,
  `recurrence_days` varchar(50) DEFAULT NULL,
  `status_sent` enum('pending','sent') DEFAULT 'sent',
  `created_at` datetime DEFAULT current_timestamp(),
  `status` enum('unread','read') NOT NULL DEFAULT 'unread'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notification`
--

INSERT INTO `notification` (`id`, `recipient_type`, `title`, `content`, `type`, `scheduled_time`, `is_recurring`, `recurrence_days`, `status_sent`, `created_at`, `status`) VALUES
(1, 'driver', 'Thông báo cho tài xế', 'Ngày mai đi sớm 15 phút.', 'manual', NULL, 0, NULL, 'sent', '2025-11-17 00:35:46', 'read'),
(2, 'parent', 'Thông báo cho phụ huynh', 'Ngày mai trời mưa, chuẩn bị áo mưa cho bé.', 'manual', NULL, 0, NULL, 'sent', '2025-11-17 00:35:46', 'unread'),
(3, 'bus', 'Thông báo cho xe buýt', 'Xe BUS001 đi kiểm tra định kỳ.', 'manual', NULL, 0, NULL, 'sent', '2025-11-17 00:35:46', 'read'),
(4, 'driver', 'Nghi ngay mai', 'ngay mai mua nen nghi', 'manual', NULL, 0, NULL, 'sent', '2025-11-17 01:00:28', 'read'),
(5, 'driver', 'Dời thời gian khởi hành', 'Vì xe đang trong quá trình bảo dưỡng, giờ khởi hành sẽ bị lùi 30p.', 'manual', NULL, 0, NULL, 'sent', '2025-11-20 21:49:29', 'unread'),
(6, 'driver', 'Kiểm tra lịch làm', 'Kiểm tra lịch làm', 'scheduled', '2025-11-30 08:00:00', 1, '0', 'pending', '2025-11-20 21:51:49', 'read'),
(7, 'driver', 'Thay đổi giờ', 'Hôm nay lịch trình có thay đổi, khởi hành sớm hơn 10 phút.', 'manual', NULL, 0, NULL, 'sent', '2025-12-01 05:00:00', 'unread'),
(8, 'parent', 'Nhắc lịch', 'Nhắc phụ huynh: ngày mai có lịch họp phụ huynh lúc 17:00.', 'manual', NULL, 0, NULL, 'sent', '2025-12-01 06:00:00', 'unread');

-- --------------------------------------------------------

--
-- Table structure for table `notification_recipients`
--

CREATE TABLE `notification_recipients` (
  `id` int(11) NOT NULL,
  `notification_id` int(11) NOT NULL,
  `recipient_id` varchar(20) NOT NULL,
  `recipient_type` varchar(50) DEFAULT NULL,
  `status` enum('unread','read') DEFAULT 'unread',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notification_recipients`
--

INSERT INTO `notification_recipients` (`id`, `notification_id`, `recipient_id`, `recipient_type`, `status`, `created_at`) VALUES
(1, 5, 'TX005', 'driver', 'unread', '2025-11-20 07:49:29'),
(2, 6, 'TX001', 'driver', 'unread', '2025-11-23 08:41:00'),
(3, 7, 'TX006', 'driver', 'unread', '2025-12-01 05:00:00'),
(4, 8, 'PH005', 'parent', 'unread', '2025-12-01 06:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `parent`
--

CREATE TABLE `parent` (
  `parent_id` varchar(20) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `age` int(11) DEFAULT NULL COMMENT 'Tuổi',
  `sex` enum('Nam','Nữ','Khác') DEFAULT 'Khác',
  `email` varchar(255) DEFAULT 'Chưa nhập'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `parent`
--

INSERT INTO `parent` (`parent_id`, `user_id`, `name`, `phone`, `age`, `sex`, `email`) VALUES
('PH001', 9, 'Nguyễn Ngọc Lan', '0964123534', 30, 'Nữ', 'lannguyen@gmail.com'),
('PH002', 10, 'Trần Hữu Phát', '0987123765', 32, 'Nam', 'phattran@gmail.com'),
('PH003', 11, 'Hà Mỹ Hằng', '0901234567', 30, 'Nữ', 'hang@gmail.com'),
('PH004', 12, 'Tạ Minh Thi', '0912345678', 30, 'Nữ', 'thi@gmail.com'),
('PH005', 16, 'Nguyễn Thị Xinh', '0901122334', 34, 'Nữ', 'xinh.nguyen@gmail.com'),
('PH006', 17, 'Trần Văn Nam', '0902233445', 36, 'Nam', 'nam.tran@gmail.com'),
('PH007', NULL, 'Nguyễn Văn Hùng', '0903111111', 35, 'Nam', 'hung.nguyen@gmail.com'),
('PH008', NULL, 'Trần Thị Mai', '0903222222', 33, 'Nữ', 'mai.tran@gmail.com'),
('PH009', NULL, 'Lê Văn Tú', '0903333333', 37, 'Nam', 'tu.le@gmail.com'),
('PH010', NULL, 'Phạm Thị Hoa', '0903444444', 34, 'Nữ', 'hoa.pham@gmail.com'),
('PH011', NULL, 'Hoàng Văn Nam', '0903555555', 38, 'Nam', 'nam.hoang@gmail.com'),
('PH012', NULL, 'Võ Thị Lan', '0903666666', 36, 'Nữ', 'lan.vo@gmail.com'),
('PH013', NULL, 'Đặng Văn Minh', '0903777777', 39, 'Nam', 'minh.dang@gmail.com'),
('PH014', NULL, 'Bùi Thị Thu', '0903888888', 32, 'Nữ', 'thu.bui@gmail.com'),
('PH015', NULL, 'Dương Văn Phong', '0903999999', 40, 'Nam', 'phong.duong@gmail.com'),
('PH016', NULL, 'Phan Thị Linh', '0904111111', 31, 'Nữ', 'linh.phan@gmail.com'),
('PH017', NULL, 'Trịnh Văn Quang', '0904222222', 36, 'Nam', 'quang.trinh@gmail.com'),
('PH018', NULL, 'Cao Thị Hương', '0904333333', 33, 'Nữ', 'huong.cao@gmail.com'),
('PH019', NULL, 'Lý Văn Đức', '0904444444', 37, 'Nam', 'duc.ly@gmail.com'),
('PH020', NULL, 'Đinh Thị Nga', '0904555555', 34, 'Nữ', 'nga.dinh@gmail.com'),
('PH021', NULL, 'Ngô Văn Tân', '0904666666', 38, 'Nam', 'tan.ngo@gmail.com'),
('PH022', NULL, 'Mai Thị Thảo', '0904777777', 35, 'Nữ', 'thao.mai@gmail.com'),
('PH023', NULL, 'Vũ Văn Hải', '0904888888', 39, 'Nam', 'hai.vu@gmail.com'),
('PH024', NULL, 'Tô Thị Hồng', '0904999999', 32, 'Nữ', 'hong.to@gmail.com'),
('PH025', NULL, 'Đỗ Văn Thành', '0905111111', 36, 'Nam', 'thanh.do@gmail.com'),
('PH026', NULL, 'Hồ Thị Kim', '0905222222', 33, 'Nữ', 'kim.ho@gmail.com');

-- --------------------------------------------------------

--
-- Table structure for table `route`
--

CREATE TABLE `route` (
  `route_id` varchar(20) NOT NULL,
  `route_name` varchar(100) DEFAULT NULL,
  `start_point` varchar(150) DEFAULT NULL,
  `end_point` varchar(150) DEFAULT NULL,
  `planned_start` time DEFAULT NULL,
  `planned_end` time DEFAULT NULL,
  `total_students` int(11) DEFAULT 0,
  `status` enum('Đang hoạt động','Ngưng hoạt động','Bảo trì') DEFAULT 'Đang hoạt động',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `route`
--

INSERT INTO `route` (`route_id`, `route_name`, `start_point`, `end_point`, `planned_start`, `planned_end`, `total_students`, `status`, `created_at`) VALUES
('R01', 'SGU CSC -> SGU CS2', 'SGU_CSC', 'SGU_CS2', '06:00:00', '07:30:00', 15, 'Đang hoạt động', '2025-10-01 08:00:00'),
('R02', 'R02 - North Loop', 'School A', 'Residence B', '06:30:00', '07:45:00', 12, 'Đang hoạt động', '2025-11-15 08:00:00'),
('R03', 'R03 - East Loop', 'School C', 'Residence D', '06:20:00', '07:50:00', 14, 'Đang hoạt động', '2025-11-16 09:00:00'),
('TD1', 'Tuyến 1', 'Trường THPT A', 'Khu dân cư Hưng Phú', '06:15:00', '07:45:00', 20, 'Đang hoạt động', '2025-10-01 09:30:00'),
('TD2', 'Tuyến 2', 'Trường Tiểu học B', 'Khu phố An Lạc', '09:45:00', '13:15:00', 18, 'Đang hoạt động', '2025-10-01 10:00:00'),
('TD3', 'Tuyến 3', 'A', 'B', '07:15:00', '08:45:00', 10, 'Ngưng hoạt động', '2025-10-01 10:30:00');

-- --------------------------------------------------------

--
-- Table structure for table `student`
--

CREATE TABLE `student` (
  `student_id` varchar(20) NOT NULL,
  `parent_id` varchar(20) DEFAULT NULL,
  `stop_id` varchar(20) DEFAULT NULL,
  `dropoff_stop_id` varchar(20) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `school_name` varchar(150) DEFAULT NULL,
  `class_name` varchar(100) DEFAULT NULL,
  `gender` enum('Nam','Nữ','Khác') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student`
--

INSERT INTO `student` (`student_id`, `parent_id`, `stop_id`, `dropoff_stop_id`, `name`, `school_name`, `class_name`, `gender`) VALUES
('HS001', 'PH003', 'STOP1', 'STOP2', 'Nguyễn Văn An', 'Trường Tiểu học Nguyễn Trãi', '5A1', 'Nam'),
('HS002', 'PH004', 'STOP1', 'STOP2', 'Trần Thị Bình', 'Trường Tiểu học Lê Lợi', '4B2', 'Nữ'),
('HS003', 'PH005', 'STOP1', 'STOP2', 'Phạm Văn Khoa', 'Trường Tiểu học Nguyễn Trãi', '3C1', 'Nam'),
('HS004', 'PH006', 'STOP_T1', 'STOP_T2', 'Võ Thị Lan', 'Trường Tiểu học Lê Lợi', '2A2', 'Nữ'),
('HS101', 'PH007', 'STOP1', 'STOP2', 'Nguyễn Minh Anh', 'Trường Tiểu học Nguyễn Trãi', '5A1', 'Nam'),
('HS102', 'PH007', 'STOP3', 'STOP2', 'Nguyễn Thu Hà', 'Trường Tiểu học Nguyễn Trãi', '3B2', 'Nữ'),
('HS103', 'PH008', 'STOP1', 'STOP2', 'Trần Đức Anh', 'Trường Tiểu học Lê Lợi', '4A1', 'Nam'),
('HS104', 'PH008', 'STOP1', 'STOP2', 'Trần Ngọc Mai', 'Trường Tiểu học Lê Lợi', '2B1', 'Nữ'),
('HS105', 'PH009', 'STOP_T1', 'STOP_T2', 'Lê Văn Bình', 'Trường THCS Trần Hưng Đạo', '6A2', 'Nam'),
('HS106', 'PH009', 'STOP_T1', 'STOP_T2', 'Lê Thị Hương', 'Trường THCS Trần Hưng Đạo', '7A1', 'Nữ'),
('HS107', 'PH010', 'STOP3', 'STOP4', 'Phạm Văn Cường', 'Trường Tiểu học Nguyễn Trãi', '5B1', 'Nam'),
('HS108', 'PH010', 'STOP3', 'STOP4', 'Phạm Thị Dung', 'Trường Tiểu học Nguyễn Trãi', '4A2', 'Nữ'),
('HS109', 'PH011', 'STOP3', 'STOP4', 'Hoàng Minh Đức', 'Trường THCS Lê Quý Đôn', '8A1', 'Nam'),
('HS110', 'PH011', 'STOP3', 'STOP4', 'Hoàng Thị Nga', 'Trường THCS Lê Quý Đôn', '6B2', 'Nữ'),
('HS111', 'PH012', 'STOP5', 'STOP12', 'Võ Văn Hải', 'Trường Tiểu học Lê Lợi', '3A1', 'Nam'),
('HS112', 'PH012', 'STOP5', 'STOP12', 'Võ Thị Lan Anh', 'Trường Tiểu học Lê Lợi', '2A1', 'Nữ'),
('HS113', 'PH013', 'STOP5', 'STOP12', 'Đặng Văn Long', 'Trường THCS Nguyễn Du', '7B1', 'Nam'),
('HS114', 'PH013', 'STOP5', 'STOP12', 'Đặng Thị Nhung', 'Trường THCS Nguyễn Du', '6A1', 'Nữ'),
('HS115', 'PH014', 'STOP1', 'STOP2', 'Bùi Văn Phú', 'Trường Tiểu học Nguyễn Trãi', '4B2', 'Nam'),
('HS116', 'PH014', 'STOP1', 'STOP2', 'Bùi Thị Quỳnh', 'Trường Tiểu học Nguyễn Trãi', '5A2', 'Nữ'),
('HS117', 'PH015', 'STOP_T1', 'STOP_T2', 'Dương Văn Sơn', 'Trường THCS Trần Hưng Đạo', '8B1', 'Nam'),
('HS118', 'PH015', 'STOP_T1', 'STOP_T2', 'Dương Thị Tâm', 'Trường THCS Trần Hưng Đạo', '7A2', 'Nữ'),
('HS119', 'PH016', 'STOP3', 'STOP4', 'Phan Văn Thắng', 'Trường Tiểu học Lê Lợi', '3B1', 'Nam'),
('HS120', 'PH016', 'STOP3', 'STOP4', 'Phan Thị Thu', 'Trường Tiểu học Lê Lợi', '2B2', 'Nữ'),
('HS121', 'PH017', 'STOP5', 'STOP12', 'Trịnh Văn Tú', 'Trường THCS Lê Quý Đôn', '6A2', 'Nam'),
('HS122', 'PH017', 'STOP5', 'STOP12', 'Trịnh Thị Uyên', 'Trường THCS Lê Quý Đôn', '7B2', 'Nữ'),
('HS123', 'PH018', 'STOP1', 'STOP2', 'Cao Văn Vinh', 'Trường Tiểu học Nguyễn Trãi', '4A1', 'Nam'),
('HS124', 'PH018', 'STOP1', 'STOP2', 'Cao Thị Xuân', 'Trường Tiểu học Nguyễn Trãi', '3A2', 'Nữ'),
('HS125', 'PH019', 'STOP_T1', 'STOP_T2', 'Lý Văn Yên', 'Trường THCS Nguyễn Du', '8A2', 'Nam'),
('HS126', 'PH019', 'STOP_T1', 'STOP_T2', 'Lý Thị Ánh', 'Trường THCS Nguyễn Du', '6B1', 'Nữ'),
('HS127', 'PH020', 'STOP3', 'STOP4', 'Đinh Văn Bảo', 'Trường Tiểu học Lê Lợi', '5A1', 'Nam'),
('HS128', 'PH020', 'STOP3', 'STOP4', 'Đinh Thị Chi', 'Trường Tiểu học Lê Lợi', '4B1', 'Nữ'),
('HS129', 'PH021', 'STOP5', 'STOP12', 'Ngô Văn Đạt', 'Trường THCS Trần Hưng Đạo', '7A1', 'Nam'),
('HS130', 'PH021', 'STOP5', 'STOP12', 'Ngô Thị Em', 'Trường THCS Trần Hưng Đạo', '6A2', 'Nữ'),
('HS131', 'PH022', 'STOP1', 'STOP2', 'Mai Văn Phong', 'Trường Tiểu học Nguyễn Trãi', '3A1', 'Nam'),
('HS132', 'PH022', 'STOP1', 'STOP2', 'Mai Thị Giang', 'Trường Tiểu học Nguyễn Trãi', '2A2', 'Nữ'),
('HS133', 'PH023', 'STOP_T1', 'STOP_T2', 'Vũ Văn Hoàng', 'Trường THCS Lê Quý Đôn', '8B2', 'Nam'),
('HS134', 'PH023', 'STOP_T1', 'STOP_T2', 'Vũ Thị Huyền', 'Trường THCS Lê Quý Đôn', '7A1', 'Nữ'),
('HS135', 'PH024', 'STOP3', 'STOP4', 'Tô Văn Khoa', 'Trường Tiểu học Lê Lợi', '4A2', 'Nam'),
('HS136', 'PH024', 'STOP3', 'STOP4', 'Tô Thị Linh', 'Trường Tiểu học Lê Lợi', '5B2', 'Nữ'),
('HS137', 'PH025', 'STOP5', 'STOP12', 'Đỗ Văn Minh', 'Trường THCS Nguyễn Du', '6B2', 'Nam'),
('HS138', 'PH025', 'STOP5', 'STOP12', 'Đỗ Thị Ngọc', 'Trường THCS Nguyễn Du', '7B1', 'Nữ'),
('HS139', 'PH026', 'STOP1', 'STOP2', 'Hồ Văn Phúc', 'Trường Tiểu học Nguyễn Trãi', '2B1', 'Nam'),
('HS140', 'PH026', 'STOP1', 'STOP2', 'Hồ Thị Quế', 'Trường Tiểu học Nguyễn Trãi', '3B2', 'Nữ'),
('HS141', 'PH007', 'STOP_T1', 'STOP_T2', 'Nguyễn Văn Sang', 'Trường THCS Trần Hưng Đạo', '8A1', 'Nam'),
('HS142', 'PH008', 'STOP3', 'STOP4', 'Trần Thị Trang', 'Trường Tiểu học Lê Lợi', '4A1', 'Nữ'),
('HS143', 'PH009', 'STOP5', 'STOP12', 'Lê Văn Uy', 'Trường THCS Lê Quý Đôn', '7B2', 'Nam'),
('HS144', 'PH010', 'STOP1', 'STOP2', 'Phạm Thị Vân', 'Trường Tiểu học Nguyễn Trãi', '5A1', 'Nữ'),
('HS145', 'PH011', 'STOP_T1', 'STOP_T2', 'Hoàng Văn Xuân', 'Trường THCS Nguyễn Du', '6A1', 'Nam'),
('HS146', 'PH012', 'STOP3', 'STOP4', 'Võ Thị Yến', 'Trường Tiểu học Lê Lợi', '3A2', 'Nữ'),
('HS147', 'PH013', 'STOP5', 'STOP12', 'Đặng Văn An', 'Trường THCS Trần Hưng Đạo', '7A2', 'Nam'),
('HS148', 'PH014', 'STOP1', 'STOP2', 'Bùi Thị Bích', 'Trường Tiểu học Nguyễn Trãi', '4B2', 'Nữ'),
('HS149', 'PH015', 'STOP_T1', 'STOP_T2', 'Dương Văn Cao', 'Trường THCS Lê Quý Đôn', '8A2', 'Nam'),
('HS150', 'PH016', 'STOP3', 'STOP4', 'Phan Thị Diễm', 'Trường Tiểu học Lê Lợi', '2A1', 'Nữ'),
('HS17681', 'PH001', 'STOP_T1', 'STOP_T2', 'Nguyễn Minh Long', 'Trường THTH', '12C1', 'Nam');

-- --------------------------------------------------------

--
-- Table structure for table `student_pickup`
--

CREATE TABLE `student_pickup` (
  `pickup_id` varchar(30) NOT NULL,
  `student_id` varchar(20) DEFAULT NULL,
  `driver_id` varchar(20) DEFAULT NULL,
  `schedule_id` varchar(50) DEFAULT NULL,
  `stop_id` varchar(20) DEFAULT NULL,
  `pickup_time` datetime DEFAULT NULL,
  `dropoff_time` datetime DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student_pickup`
--

INSERT INTO `student_pickup` (`pickup_id`, `student_id`, `driver_id`, `schedule_id`, `stop_id`, `pickup_time`, `dropoff_time`, `status`) VALUES
('DT001', 'HS001', 'TX001', 'LT1', 'STOP1', '2025-11-14 06:35:00', '2025-11-14 07:25:00', 'DA_DON'),
('DT002', 'HS002', 'TX002', 'LT2', 'STOP1', NULL, NULL, 'CHO_DON'),
('DT003', 'HS003', 'TX006', 'LT3', 'STOP1', '2025-12-01 06:35:00', '2025-12-01 07:30:00', 'DA_DON'),
('DT004', 'HS004', 'TX007', 'LT4', 'STOP_T1', NULL, NULL, 'HUY_CHUYEN'),
('PU_TX007_001_001', 'HS101', 'TX007', 'LT_TX007_005', 'STOP1', '2025-12-06 09:15:18', '2025-12-06 09:11:30', 'CHO_DON'),
('PU_TX007_001_002', 'HS102', 'TX007', 'LT_TX007_005', 'STOP3', '2025-12-06 09:15:19', '2025-12-06 09:11:34', 'CHO_DON'),
('PU_TX007_001_003', 'HS103', 'TX007', 'LT_TX007_006', 'STOP1', '2025-12-05 20:30:51', '2025-12-05 20:31:04', 'CHO_DON'),
('PU_TX007_001_004', 'HS104', 'TX007', 'LT_TX007_006', 'STOP1', '2025-12-05 20:30:47', '2025-12-05 20:31:03', 'CHO_DON'),
('PU_TX007_001_005', 'HS105', 'TX007', 'LT_TX007_001', 'STOP_T1', NULL, NULL, 'HUY_CHUYEN'),
('PU_TX007_001_006', 'HS106', 'TX007', 'LT_TX007_001', 'STOP_T1', NULL, NULL, 'HUY_CHUYEN'),
('PU_TX007_001_007', 'HS107', 'TX007', 'LT_TX007_001', 'STOP3', NULL, NULL, 'HUY_CHUYEN'),
('PU_TX007_001_008', 'HS108', 'TX007', 'LT_TX007_001', 'STOP3', NULL, NULL, 'HUY_CHUYEN'),
('PU_TX007_001_009', 'HS109', 'TX007', 'LT_TX007_001', 'STOP3', NULL, NULL, 'HUY_CHUYEN'),
('PU_TX007_001_010', 'HS110', 'TX007', 'LT_TX007_001', 'STOP3', NULL, NULL, 'HUY_CHUYEN'),
('PU_TX007_001_011', 'HS111', 'TX007', 'LT_TX007_001', 'STOP5', NULL, NULL, 'HUY_CHUYEN'),
('PU_TX007_001_012', 'HS112', 'TX007', 'LT_TX007_001', 'STOP5', NULL, NULL, 'HUY_CHUYEN'),
('PU_TX007_001_013', 'HS113', 'TX007', 'LT_TX007_001', 'STOP5', NULL, NULL, 'HUY_CHUYEN'),
('PU_TX007_001_014', 'HS114', 'TX007', 'LT_TX007_001', 'STOP5', NULL, NULL, 'HUY_CHUYEN'),
('PU_TX007_001_015', 'HS115', 'TX007', 'LT_TX007_001', 'STOP1', NULL, NULL, 'HUY_CHUYEN'),
('PU_TX007_001_016', 'HS116', 'TX007', 'LT_TX007_001', 'STOP1', NULL, NULL, 'HUY_CHUYEN'),
('PU_TX007_001_017', 'HS117', 'TX007', 'LT_TX007_001', 'STOP_T1', NULL, NULL, 'HUY_CHUYEN'),
('PU_TX007_001_018', 'HS118', 'TX007', 'LT_TX007_001', 'STOP_T1', NULL, NULL, 'HUY_CHUYEN'),
('PU_TX007_001_019', 'HS119', 'TX007', 'LT_TX007_001', 'STOP3', NULL, NULL, 'HUY_CHUYEN'),
('PU_TX007_001_020', 'HS120', 'TX007', 'LT_TX007_001', 'STOP3', NULL, NULL, 'HUY_CHUYEN'),
('PU_TX007_001_021', 'HS121', 'TX007', 'LT_TX007_001', 'STOP5', NULL, NULL, 'HUY_CHUYEN'),
('PU_TX007_001_022', 'HS122', 'TX007', 'LT_TX007_001', 'STOP5', NULL, NULL, 'HUY_CHUYEN'),
('PU_TX007_001_023', 'HS123', 'TX007', 'LT_TX007_001', 'STOP1', NULL, NULL, 'HUY_CHUYEN'),
('PU_TX007_001_024', 'HS124', 'TX007', 'LT_TX007_001', 'STOP1', NULL, NULL, 'HUY_CHUYEN'),
('PU_TX007_001_025', 'HS125', 'TX007', 'LT_TX007_001', 'STOP_T1', NULL, NULL, 'HUY_CHUYEN'),
('PU_TX007_001_026', 'HS126', 'TX007', 'LT_TX007_001', 'STOP_T1', NULL, NULL, 'HUY_CHUYEN'),
('PU_TX007_001_027', 'HS127', 'TX007', 'LT_TX007_001', 'STOP3', NULL, NULL, 'HUY_CHUYEN'),
('PU_TX007_001_028', 'HS128', 'TX007', 'LT_TX007_001', 'STOP3', NULL, NULL, 'HUY_CHUYEN'),
('PU_TX007_001_029', 'HS129', 'TX007', 'LT_TX007_001', 'STOP5', NULL, NULL, 'HUY_CHUYEN'),
('PU_TX007_001_030', 'HS130', 'TX007', 'LT_TX007_001', 'STOP5', NULL, NULL, 'HUY_CHUYEN'),
('PU_TX007_001_031', 'HS131', 'TX007', 'LT_TX007_001', 'STOP1', NULL, NULL, 'HUY_CHUYEN'),
('PU_TX007_001_032', 'HS132', 'TX007', 'LT_TX007_001', 'STOP1', NULL, NULL, 'HUY_CHUYEN'),
('PU_TX007_001_033', 'HS133', 'TX007', 'LT_TX007_001', 'STOP_T1', NULL, NULL, 'HUY_CHUYEN'),
('PU_TX007_001_034', 'HS134', 'TX007', 'LT_TX007_001', 'STOP_T1', NULL, NULL, 'HUY_CHUYEN'),
('PU_TX007_001_035', 'HS135', 'TX007', 'LT_TX007_001', 'STOP3', NULL, NULL, 'HUY_CHUYEN'),
('PU_TX007_001_036', 'HS136', 'TX007', 'LT_TX007_001', 'STOP3', NULL, NULL, 'HUY_CHUYEN'),
('PU_TX007_001_037', 'HS137', 'TX007', 'LT_TX007_001', 'STOP5', NULL, NULL, 'HUY_CHUYEN'),
('PU_TX007_001_038', 'HS138', 'TX007', 'LT_TX007_001', 'STOP5', NULL, NULL, 'HUY_CHUYEN'),
('PU_TX007_001_039', 'HS139', 'TX007', 'LT_TX007_001', 'STOP1', NULL, NULL, 'HUY_CHUYEN'),
('PU_TX007_001_040', 'HS140', 'TX007', 'LT_TX007_001', 'STOP1', NULL, NULL, 'HUY_CHUYEN'),
('PU_TX007_001_041', 'HS141', 'TX007', 'LT_TX007_001', 'STOP_T1', NULL, NULL, 'HUY_CHUYEN'),
('PU_TX007_001_042', 'HS142', 'TX007', 'LT_TX007_001', 'STOP3', NULL, NULL, 'HUY_CHUYEN'),
('PU_TX007_001_043', 'HS143', 'TX007', 'LT_TX007_001', 'STOP5', NULL, NULL, 'HUY_CHUYEN'),
('PU_TX007_001_044', 'HS144', 'TX007', 'LT_TX007_001', 'STOP1', NULL, NULL, 'HUY_CHUYEN'),
('PU_TX007_001_045', 'HS145', 'TX007', 'LT_TX007_001', 'STOP_T1', NULL, NULL, 'HUY_CHUYEN'),
('PU_TX007_001_046', 'HS146', 'TX007', 'LT_TX007_001', 'STOP3', NULL, NULL, 'HUY_CHUYEN'),
('PU_TX007_001_047', 'HS147', 'TX007', 'LT_TX007_001', 'STOP5', NULL, NULL, 'HUY_CHUYEN'),
('PU_TX007_001_048', 'HS148', 'TX007', 'LT_TX007_001', 'STOP1', NULL, NULL, 'HUY_CHUYEN'),
('PU_TX007_001_049', 'HS149', 'TX007', 'LT_TX007_001', 'STOP_T1', NULL, NULL, 'HUY_CHUYEN'),
('PU_TX007_001_050', 'HS150', 'TX007', 'LT_TX007_001', 'STOP3', NULL, NULL, 'HUY_CHUYEN');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','driver','parent') NOT NULL,
  `linked_id` varchar(20) DEFAULT NULL COMMENT 'ID liên kết với driver hoặc parent',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `username`, `password`, `role`, `linked_id`, `created_at`) VALUES
(1, 'admin', 'g5bus', 'admin', NULL, '2025-10-01 08:00:00'),
(2, 'driver', 'g5bus', 'driver', NULL, '2025-10-01 08:30:00'),
(3, 'parent', 'g5bus', 'parent', NULL, '2025-10-01 09:00:00'),
(4, 'tx001', '12345', 'driver', NULL, '2025-12-02 06:53:37'),
(5, 'tx002', '12345', 'driver', NULL, '2025-12-02 06:53:37'),
(6, 'tx003', '12345', 'driver', NULL, '2025-12-02 06:53:37'),
(7, 'tx004', '12345', 'driver', NULL, '2025-12-02 06:53:37'),
(8, 'tx005', '12345', 'driver', NULL, '2025-12-02 06:53:37'),
(9, 'ph001', '12345', 'parent', NULL, '2025-12-02 06:53:37'),
(10, 'ph002', '12345', 'parent', NULL, '2025-12-02 06:53:37'),
(11, 'ph003', '12345', 'parent', NULL, '2025-12-02 06:53:37'),
(12, 'ph004', '12345', 'parent', NULL, '2025-12-02 06:53:37'),
(13, 'tx006', '12345', 'driver', NULL, '2025-12-02 07:00:00'),
(14, 'tx007', '121212', 'driver', NULL, '2025-12-02 07:00:00'),
(15, 'tx008', '12345', 'driver', NULL, '2025-12-02 07:00:00'),
(16, 'ph005', '12345', 'parent', NULL, '2025-12-02 07:05:00'),
(17, 'ph006', '12345', 'parent', NULL, '2025-12-02 07:05:00');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bus`
--
ALTER TABLE `bus`
  ADD PRIMARY KEY (`bus_id`),
  ADD KEY `default_route_id` (`default_route_id`);

--
-- Indexes for table `bus_location`
--
ALTER TABLE `bus_location`
  ADD PRIMARY KEY (`location_id`),
  ADD KEY `bus_id` (`bus_id`),
  ADD KEY `nearest_stop_id` (`nearest_stop_id`);

--
-- Indexes for table `bus_schedule`
--
ALTER TABLE `bus_schedule`
  ADD PRIMARY KEY (`schedule_id`),
  ADD KEY `route_id` (`route_id`),
  ADD KEY `bus_id` (`bus_id`),
  ADD KEY `driver_id` (`driver_id`);

--
-- Indexes for table `bus_status_history`
--
ALTER TABLE `bus_status_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `bus_id` (`bus_id`);

--
-- Indexes for table `bus_stop`
--
ALTER TABLE `bus_stop`
  ADD PRIMARY KEY (`stop_id`),
  ADD KEY `route_id` (`route_id`);

--
-- Indexes for table `driver`
--
ALTER TABLE `driver`
  ADD PRIMARY KEY (`driver_id`),
  ADD UNIQUE KEY `id_card` (`id_card`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `notification`
--
ALTER TABLE `notification`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notification_recipients`
--
ALTER TABLE `notification_recipients`
  ADD PRIMARY KEY (`id`),
  ADD KEY `notification_id` (`notification_id`);

--
-- Indexes for table `parent`
--
ALTER TABLE `parent`
  ADD PRIMARY KEY (`parent_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `route`
--
ALTER TABLE `route`
  ADD PRIMARY KEY (`route_id`);

--
-- Indexes for table `student`
--
ALTER TABLE `student`
  ADD PRIMARY KEY (`student_id`),
  ADD KEY `parent_id` (`parent_id`),
  ADD KEY `stop_id` (`stop_id`),
  ADD KEY `dropoff_stop_id` (`dropoff_stop_id`);

--
-- Indexes for table `student_pickup`
--
ALTER TABLE `student_pickup`
  ADD PRIMARY KEY (`pickup_id`),
  ADD KEY `student_id` (`student_id`),
  ADD KEY `driver_id` (`driver_id`),
  ADD KEY `schedule_id` (`schedule_id`),
  ADD KEY `stop_id` (`stop_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bus_location`
--
ALTER TABLE `bus_location`
  MODIFY `location_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `bus_status_history`
--
ALTER TABLE `bus_status_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `notification`
--
ALTER TABLE `notification`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `notification_recipients`
--
ALTER TABLE `notification_recipients`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bus`
--
ALTER TABLE `bus`
  ADD CONSTRAINT `bus_ibfk_1` FOREIGN KEY (`default_route_id`) REFERENCES `route` (`route_id`) ON DELETE SET NULL;

--
-- Constraints for table `bus_location`
--
ALTER TABLE `bus_location`
  ADD CONSTRAINT `bus_location_ibfk_1` FOREIGN KEY (`bus_id`) REFERENCES `bus` (`bus_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `bus_location_ibfk_2` FOREIGN KEY (`nearest_stop_id`) REFERENCES `bus_stop` (`stop_id`) ON DELETE SET NULL;

--
-- Constraints for table `bus_schedule`
--
ALTER TABLE `bus_schedule`
  ADD CONSTRAINT `bus_schedule_ibfk_1` FOREIGN KEY (`route_id`) REFERENCES `route` (`route_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `bus_schedule_ibfk_2` FOREIGN KEY (`bus_id`) REFERENCES `bus` (`bus_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `bus_schedule_ibfk_3` FOREIGN KEY (`driver_id`) REFERENCES `driver` (`driver_id`) ON DELETE CASCADE;

--
-- Constraints for table `bus_status_history`
--
ALTER TABLE `bus_status_history`
  ADD CONSTRAINT `bus_status_history_ibfk_1` FOREIGN KEY (`bus_id`) REFERENCES `bus` (`bus_id`) ON DELETE CASCADE;

--
-- Constraints for table `bus_stop`
--
ALTER TABLE `bus_stop`
  ADD CONSTRAINT `bus_stop_ibfk_1` FOREIGN KEY (`route_id`) REFERENCES `route` (`route_id`) ON DELETE CASCADE;

--
-- Constraints for table `driver`
--
ALTER TABLE `driver`
  ADD CONSTRAINT `driver_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL;

--
-- Constraints for table `notification_recipients`
--
ALTER TABLE `notification_recipients`
  ADD CONSTRAINT `notification_recipients_ibfk_1` FOREIGN KEY (`notification_id`) REFERENCES `notification` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `parent`
--
ALTER TABLE `parent`
  ADD CONSTRAINT `parent_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL;

--
-- Constraints for table `student`
--
ALTER TABLE `student`
  ADD CONSTRAINT `student_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `parent` (`parent_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `student_ibfk_2` FOREIGN KEY (`stop_id`) REFERENCES `bus_stop` (`stop_id`) ON DELETE SET NULL,
  ADD CONSTRAINT `student_ibfk_3` FOREIGN KEY (`dropoff_stop_id`) REFERENCES `bus_stop` (`stop_id`) ON DELETE SET NULL;

--
-- Constraints for table `student_pickup`
--
ALTER TABLE `student_pickup`
  ADD CONSTRAINT `student_pickup_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `student_pickup_ibfk_2` FOREIGN KEY (`driver_id`) REFERENCES `driver` (`driver_id`) ON DELETE SET NULL,
  ADD CONSTRAINT `student_pickup_ibfk_3` FOREIGN KEY (`schedule_id`) REFERENCES `bus_schedule` (`schedule_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `student_pickup_ibfk_4` FOREIGN KEY (`stop_id`) REFERENCES `bus_stop` (`stop_id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
