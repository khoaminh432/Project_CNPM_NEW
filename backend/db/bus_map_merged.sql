-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 29, 2025 at 06:38 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `bus_map_merged`
--

-- --------------------------------------------------------

--
-- Table structure for table `bus`
--

CREATE TABLE `bus` (
  `bus_id` varchar(255) NOT NULL,
  `license_plate` varchar(255) DEFAULT NULL,
  `capacity` int(11) DEFAULT NULL,
  `default_route_id` varchar(255) DEFAULT NULL,
  `status` varchar(100) DEFAULT 'Ngưng hoạt động',
  `departure_status` varchar(100) DEFAULT 'Chưa xuất phát',
  `registry` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bus`
--

INSERT INTO `bus` (`bus_id`, `license_plate`, `capacity`, `default_route_id`, `status`, `departure_status`, `registry`) VALUES
('XB1', '59B-99999', 25, NULL, 'Đang hoạt động', 'Chưa xuất phát', NULL),
('XB2', '59A-12345', 20, NULL, 'Đang hoạt động', 'Chưa xuất phát', NULL),
('XB3', '59C-88888', 10, NULL, 'Ngưng hoạt động', 'Chưa xuất phát', NULL),
('XE001', '59B-32167', 16, 'R01', 'Đang hoạt động', 'Đã xuất phát', '2027-11-10'),
('XE002', '59B-98012', 16, 'R02', 'Đang hoạt động', 'Chưa xuất phát', '2026-11-03'),
('XE003', '59-15602', 16, 'R03', 'Đang bảo trì', 'Đã kết thúc', '2029-11-15'),
('XE004', '59C-48822', 16, NULL, 'Ngưng hoạt động', 'Chưa xuất phát', '2025-11-19'),
('XE005', '59A-32512', NULL, 'R01', 'Đang hoạt động', 'Đã xuất phát', '2025-11-22');

-- --------------------------------------------------------

--
-- Table structure for table `bus_location`
--

CREATE TABLE `bus_location` (
  `location_id` int(11) NOT NULL,
  `bus_id` varchar(255) DEFAULT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `vi_tri_text` varchar(255) DEFAULT NULL,
  `timestamp` datetime DEFAULT NULL,
  `is_latest` tinyint(1) DEFAULT 0,
  `nearest_stop_id` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bus_location`
--

INSERT INTO `bus_location` (`location_id`, `bus_id`, `latitude`, `longitude`, `vi_tri_text`, `timestamp`, `is_latest`, `nearest_stop_id`) VALUES
(1, 'XB1', NULL, NULL, 'Gần cổng trường THPT A', '2025-11-14 07:00:00', 1, NULL),
(2, 'XB2', NULL, NULL, 'Ngã tư Nguyễn Trãi - Lê Lợi', '2025-11-14 07:10:00', 1, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `bus_schedule`
--

CREATE TABLE `bus_schedule` (
  `schedule_id` varchar(255) NOT NULL,
  `route_id` varchar(255) DEFAULT NULL,
  `bus_id` varchar(255) DEFAULT NULL,
  `driver_id` varchar(255) DEFAULT NULL,
  `schedule_date` date DEFAULT NULL,
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bus_schedule`
--

INSERT INTO `bus_schedule` (`schedule_id`, `route_id`, `bus_id`, `driver_id`, `schedule_date`, `start_time`, `end_time`) VALUES
('LT1', 'TD1', 'XB1', 'TX1', '2025-11-28', '20:13:00', '19:54:00'),
('LT2', 'TD2', 'XB2', 'TX2', '2025-11-27', '03:41:00', '18:26:30'),
('XE001-01-11-2025', 'R01', 'XE001', 'TX003', '2025-11-01', '06:00:00', '07:15:00');

-- --------------------------------------------------------

--
-- Table structure for table `bus_status_history`
--

CREATE TABLE `bus_status_history` (
  `id` int(11) NOT NULL,
  `bus_id` varchar(255) NOT NULL,
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
  `stop_id` varchar(255) NOT NULL,
  `route_id` varchar(255) DEFAULT NULL,
  `stop_name` varchar(255) DEFAULT NULL,
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
  `driver_id` varchar(255) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `status` varchar(50) DEFAULT 'Rảnh',
  `license_class` varchar(10) DEFAULT 'B2',
  `work_schedule` set('MON','TUE','WED','THU','FRI','SAT','SUN') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `driver`
--

INSERT INTO `driver` (`driver_id`, `name`, `phone`, `address`, `status`, `license_class`, `work_schedule`) VALUES
('TX001', 'Nguyễn Văn Hùng', '0459276157', 'Lê Hồng Phong', 'Rảnh', 'B2', 'MON,TUE,WED,FRI,SAT'),
('TX002', 'Trần Văn Trí', '0745128698', 'Trần Xuân Soạn', 'Rảnh', 'B2', 'MON,TUE,WED,THU,FRI'),
('TX003', 'Lê Hùng Dũng', '0789425698', 'Võ Văn Kiệt', 'Rảnh', 'B2', 'TUE,WED,THU,FRI,SAT'),
('TX004', 'Phạm Anh Đức', '0785158496', 'Nguyễn Trãi', 'Đang hoạt động', 'B2', 'TUE,WED,THU,FRI'),
('TX005', 'Ngô Thị Minh Thi', '0978425987', 'Đức Trọng', 'Nghỉ phép', 'B2', 'MON,TUE,WED,THU,FRI,SAT,SUN'),
('TX1', 'Nguyễn Văn C', '0912345678', NULL, 'Rảnh', 'B2', NULL),
('TX2', 'Nguyễn Thị D', '0900000000', NULL, 'Rảnh', 'B2', NULL),
('TX3', 'Nguyễn Văn A', '0901234567', NULL, 'Rảnh', 'B2', NULL);

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
(6, 'driver', 'Kiểm tra lịch làm', 'Kiểm tra lịch làm', 'scheduled', '2025-11-30 08:00:00', 1, '0', 'pending', '2025-11-20 21:51:49', 'read');

-- --------------------------------------------------------

--
-- Table structure for table `notification_recipients`
--

CREATE TABLE `notification_recipients` (
  `id` int(11) NOT NULL,
  `notification_id` int(11) NOT NULL,
  `recipient_id` varchar(255) NOT NULL,
  `recipient_type` varchar(50) DEFAULT NULL,
  `status` enum('unread','read') DEFAULT 'unread',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notification_recipients`
--

INSERT INTO `notification_recipients` (`id`, `notification_id`, `recipient_id`, `recipient_type`, `status`, `created_at`) VALUES
(1, 5, 'TX005', 'driver', 'unread', '2025-11-20 07:49:29'),
(2, 6, 'TX001', 'driver', 'unread', '2025-11-23 08:41:00');

-- --------------------------------------------------------

--
-- Table structure for table `parent`
--

CREATE TABLE `parent` (
  `parent_id` varchar(255) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `parent`
--

INSERT INTO `parent` (`parent_id`, `name`, `phone`) VALUES
('PH001', 'Nguyễn Ngọc Lan', '0964123534'),
('PH002', 'Trần Hữu Phát', '0987123765'),
('PH1', 'Mỹ Hằng', '0901234567'),
('PH2', 'Minh Thi', '0912345678');

-- --------------------------------------------------------

--
-- Table structure for table `route`
--

CREATE TABLE `route` (
  `route_id` varchar(255) NOT NULL,
  `route_name` varchar(255) DEFAULT NULL,
  `start_point` varchar(255) DEFAULT NULL,
  `end_point` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `route`
--

INSERT INTO `route` (`route_id`, `route_name`, `start_point`, `end_point`) VALUES
('R01', 'Q1->Q5', 'SGU_csc', 'SGU_cs2'),
('R02', 'q1->q3', 'SGU_csc', 'SGU_cs1'),
('R03', 'sgu->ktx', 'SGU-csc', 'ktx-SGu'),
('TD1', 'Tuyến 1', 'Trường THPT A', 'Khu dân cư Hưng Phú'),
('TD2', 'Tuyến 2', 'Trường Tiểu học B', 'Khu phố An Lạc'),
('TD3', 'Tuyến 3', 'A', 'B');

-- --------------------------------------------------------

--
-- Table structure for table `student`
--

CREATE TABLE `student` (
  `student_id` varchar(255) NOT NULL,
  `parent_id` varchar(255) DEFAULT NULL,
  `stop_id` varchar(255) DEFAULT NULL,
  `dropoff_stop_id` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student`
--

INSERT INTO `student` (`student_id`, `parent_id`, `stop_id`, `dropoff_stop_id`, `name`) VALUES
('HS1', 'PH1', 'STOP1', 'STOP2', 'Nguyễn Văn An'),
('HS2', 'PH2', 'STOP1', 'STOP2', 'Trần Thị Bình');

-- --------------------------------------------------------

--
-- Table structure for table `student_pickup`
--

CREATE TABLE `student_pickup` (
  `pickup_id` varchar(255) NOT NULL,
  `student_id` varchar(255) DEFAULT NULL,
  `driver_id` varchar(255) DEFAULT NULL,
  `schedule_id` varchar(255) DEFAULT NULL,
  `stop_id` varchar(255) DEFAULT NULL,
  `pickup_time` datetime DEFAULT NULL,
  `dropoff_time` datetime DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student_pickup`
--

INSERT INTO `student_pickup` (`pickup_id`, `student_id`, `driver_id`, `schedule_id`, `stop_id`, `pickup_time`, `dropoff_time`, `status`) VALUES
('DT1', 'HS1', NULL, 'LT1', NULL, '2025-11-14 06:35:00', '2025-11-14 07:25:00', 'DA_DON'),
('DT2', 'HS2', NULL, 'LT2', NULL, NULL, NULL, 'CHO_DON');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','driver','parent') NOT NULL,
  `linked_id` varchar(255) DEFAULT NULL COMMENT 'ID liên kết với driver hoặc parent'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `username`, `password`, `role`, `linked_id`) VALUES
(1, 'admin', 'g5bus', 'admin', NULL),
(2, 'driver', 'g5bus', 'driver', NULL),
(3, 'parent', 'g5bus', 'parent', NULL);

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
  ADD KEY `bus_id` (`bus_id`);

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
  ADD PRIMARY KEY (`driver_id`);

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
  ADD PRIMARY KEY (`parent_id`);

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
  ADD KEY `stop_id` (`stop_id`);

--
-- Indexes for table `student_pickup`
--
ALTER TABLE `student_pickup`
  ADD PRIMARY KEY (`pickup_id`),
  ADD KEY `student_id` (`student_id`),
  ADD KEY `driver_id` (`driver_id`),
  ADD KEY `schedule_id` (`schedule_id`);

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
  MODIFY `location_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `bus_status_history`
--
ALTER TABLE `bus_status_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `notification`
--
ALTER TABLE `notification`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `notification_recipients`
--
ALTER TABLE `notification_recipients`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bus`
--
ALTER TABLE `bus`
  ADD CONSTRAINT `bus_ibfk_1` FOREIGN KEY (`default_route_id`) REFERENCES `route` (`route_id`);

--
-- Constraints for table `bus_location`
--
ALTER TABLE `bus_location`
  ADD CONSTRAINT `bus_location_ibfk_1` FOREIGN KEY (`bus_id`) REFERENCES `bus` (`bus_id`);

--
-- Constraints for table `bus_schedule`
--
ALTER TABLE `bus_schedule`
  ADD CONSTRAINT `bus_schedule_ibfk_1` FOREIGN KEY (`route_id`) REFERENCES `route` (`route_id`),
  ADD CONSTRAINT `bus_schedule_ibfk_2` FOREIGN KEY (`bus_id`) REFERENCES `bus` (`bus_id`),
  ADD CONSTRAINT `bus_schedule_ibfk_3` FOREIGN KEY (`driver_id`) REFERENCES `driver` (`driver_id`);

--
-- Constraints for table `bus_status_history`
--
ALTER TABLE `bus_status_history`
  ADD CONSTRAINT `bus_status_history_ibfk_1` FOREIGN KEY (`bus_id`) REFERENCES `bus` (`bus_id`) ON DELETE CASCADE;

--
-- Constraints for table `bus_stop`
--
ALTER TABLE `bus_stop`
  ADD CONSTRAINT `bus_stop_ibfk_1` FOREIGN KEY (`route_id`) REFERENCES `route` (`route_id`);

--
-- Constraints for table `notification_recipients`
--
ALTER TABLE `notification_recipients`
  ADD CONSTRAINT `notification_recipients_ibfk_1` FOREIGN KEY (`notification_id`) REFERENCES `notification` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `student`
--
ALTER TABLE `student`
  ADD CONSTRAINT `student_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `parent` (`parent_id`),
  ADD CONSTRAINT `student_ibfk_2` FOREIGN KEY (`stop_id`) REFERENCES `bus_stop` (`stop_id`);

--
-- Constraints for table `student_pickup`
--
ALTER TABLE `student_pickup`
  ADD CONSTRAINT `student_pickup_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`),
  ADD CONSTRAINT `student_pickup_ibfk_2` FOREIGN KEY (`driver_id`) REFERENCES `driver` (`driver_id`),
  ADD CONSTRAINT `student_pickup_ibfk_3` FOREIGN KEY (`schedule_id`) REFERENCES `bus_schedule` (`schedule_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
