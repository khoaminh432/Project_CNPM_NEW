-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th10 22, 2025 lúc 10:17 AM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `bus_map`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `bus`
--

CREATE TABLE `bus` (
  `bus_id` varchar(255) NOT NULL,
  `license_plate` varchar(255) DEFAULT NULL,
  `capacity` int(11) DEFAULT NULL,
  `default_route_id` varchar(255) DEFAULT NULL,
  `status` enum('Đang hoạt động','Đang bảo trì','Ngưng hoạt động','') NOT NULL DEFAULT 'Ngưng hoạt động',
  `departure_status` varchar(100) DEFAULT 'Chưa xuất phát',
  `registry` date DEFAULT NULL,
  `driver_id` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `bus`
--

INSERT INTO `bus` (`bus_id`, `license_plate`, `capacity`, `default_route_id`, `status`, `departure_status`, `registry`, `driver_id`) VALUES
('XE001', '59B-32167', 16, 'R01', 'Đang hoạt động', 'Đã xuất phát', '2027-11-10', NULL),
('XE002', '59B-98012', 16, 'R02', 'Đang hoạt động', 'Đã xuất phát', '2026-11-03', NULL),
('XE003', '59A-15602', 16, 'R03', 'Đang hoạt động', 'Đã xuất phát', '2029-11-15', NULL),
('XE004', '59C-48822', 16, NULL, 'Ngưng hoạt động', 'Chưa xuất phát', '2025-11-19', NULL),
('XE005', '59A-32512', 16, 'R03', 'Đang bảo trì', 'Chưa xuất phát', '2025-11-22', NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `bus_location`
--

CREATE TABLE `bus_location` (
  `location_id` int(11) NOT NULL,
  `bus_id` varchar(255) DEFAULT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `timestamp` datetime DEFAULT NULL,
  `nearest_stop_id` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `bus_location`
--

INSERT INTO `bus_location` (`location_id`, `bus_id`, `latitude`, `longitude`, `timestamp`, `nearest_stop_id`) VALUES
(1, 'XE001', 10.77362000, 106.68952100, '2025-11-22 16:15:34', NULL),
(2, 'XE002', 10.77771600, 106.69133200, '2025-11-22 16:15:34', NULL),
(3, 'XE003', 10.72850700, 106.62359300, '2025-11-22 16:15:34', NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `bus_schedule`
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
-- Đang đổ dữ liệu cho bảng `bus_schedule`
--

INSERT INTO `bus_schedule` (`schedule_id`, `route_id`, `bus_id`, `driver_id`, `schedule_date`, `start_time`, `end_time`) VALUES
('XE001-01-11-2025', 'R01', 'XE001', 'TX003', '2025-11-01', '06:00:00', '07:15:00'),
('XE001-03-11-2025', 'R01', 'XE001', 'TX001', '2025-11-03', '06:00:00', '07:15:00'),
('XE001-04-11-2025', 'R01', 'XE001', 'TX002', '2025-11-04', '06:00:00', '07:15:00'),
('XE001-05-11-2025', 'R01', 'XE001', 'TX001', '2025-11-05', '06:00:00', '07:15:00'),
('XE001-06-11-2025', 'R01', 'XE001', 'TX004', '2025-11-06', '06:00:00', '07:15:00'),
('XE001-07-11-2025', 'R01', 'XE001', 'TX004', '2025-11-07', '06:00:00', '07:15:00'),
('XE001-08-11-2025', 'R01', 'XE001', 'TX003', '2025-11-08', '06:00:00', '07:15:00'),
('XE001-10-11-2025', 'R01', 'XE001', 'TX001', '2025-11-10', '06:00:00', '07:00:00'),
('XE001-2025-11-10', 'R01', 'XE001', 'TX001', '2025-11-10', '06:00:00', '12:00:00'),
('XE001-2025-11-12', 'R01', 'XE001', 'TX002', '2025-11-12', '06:00:00', '12:00:00'),
('XE001-2025-11-17', 'R01', 'XE001', 'TX002', '2025-11-17', '06:00:00', '12:00:00'),
('XE001-2025-11-18', 'R01', 'XE001', 'TX004', '2025-11-18', '06:00:00', '12:00:00'),
('XE001-2025-11-19', 'R01', 'XE001', 'TX004', '2025-11-19', '06:00:00', '12:00:00'),
('XE001-2025-11-20', 'R01', 'XE001', 'TX003', '2025-11-20', '06:00:00', '12:00:00'),
('XE001-2025-11-21', 'R01', 'XE001', 'TX002', '2025-11-21', '06:00:00', '12:00:00'),
('XE001-2025-11-22', 'R01', 'XE001', 'TX001', '2025-11-22', '06:00:00', '12:00:00'),
('XE001-2025-11-23', 'R01', 'XE001', 'TX001', '2025-11-23', '06:00:00', '12:00:00'),
('XE001-2025-11-24', 'R01', 'XE001', 'TX002', '2025-11-24', '06:00:00', '12:00:00'),
('XE001-2025-11-25', 'R01', 'XE001', 'TX004', '2025-11-25', '06:00:00', '12:00:00'),
('XE001-2025-11-26', 'R01', 'XE001', 'TX001', '2025-11-26', '06:00:00', '12:00:00'),
('XE001-2025-11-27', 'R01', 'XE001', 'TX003', '2025-11-27', '06:00:00', '12:00:00'),
('XE001-2025-11-28', 'R01', 'XE001', 'TX002', '2025-11-28', '06:00:00', '12:00:00'),
('XE001-2025-11-29', 'R01', 'XE001', 'TX005', '2025-11-29', '07:00:00', '11:00:00'),
('XE001-2025-12-01', 'R01', 'XE001', 'TX001', '2025-12-01', '06:00:00', '12:00:00'),
('XE001-2025-12-02', 'R01', 'XE001', 'TX004', '2025-12-02', '06:00:00', '12:00:00'),
('XE001-2025-12-03', 'R01', 'XE001', 'TX002', '2025-12-03', '06:00:00', '12:00:00'),
('XE001-2025-12-04', 'R01', 'XE001', 'TX003', '2025-12-04', '06:00:00', '12:00:00'),
('XE001-2025-12-05', 'R01', 'XE001', 'TX001', '2025-12-05', '06:00:00', '12:00:00'),
('XE001-2025-12-08', 'R01', 'XE001', 'TX004', '2025-12-08', '06:00:00', '12:00:00'),
('XE001-2025-12-10', 'R01', 'XE001', 'TX002', '2025-12-10', '06:00:00', '12:00:00'),
('XE001-2025-12-15', 'R01', 'XE001', 'TX005', '2025-12-15', '06:00:00', '12:00:00'),
('XE001-27-10-2025', 'R01', 'XE001', 'TX001', '2025-10-27', '06:00:00', '07:15:00'),
('XE001-28-10-2025', 'R01', 'XE001', 'TX002', '2025-10-28', '06:00:00', '07:15:00'),
('XE001-29-10-2025', 'R01', 'XE001', 'TX001', '2025-10-29', '06:00:00', '07:15:00'),
('XE001-30-10-2025', 'R01', 'XE001', 'TX004', '2025-10-30', '06:00:00', '07:15:00'),
('XE001-31-10-2025', 'R01', 'XE001', 'TX004', '2025-10-31', '06:00:00', '07:15:00'),
('XE002-01-11-2025', 'R02', 'XE002', 'TX001', '2025-11-01', '06:00:00', '07:15:00'),
('XE002-03-11-2025', 'R02', 'XE002', 'TX002', '2025-11-03', '06:00:00', '07:15:00'),
('XE002-04-11-2025', 'R02', 'XE002', 'TX003', '2025-11-04', '06:00:00', '07:15:00'),
('XE002-05-11-2025', 'R02', 'XE002', 'TX002', '2025-11-05', '06:00:00', '07:15:00'),
('XE002-06-11-2025', 'R02', 'XE002', 'TX002', '2025-11-06', '06:00:00', '07:15:00'),
('XE002-07-11-2025', 'R02', 'XE002', 'TX001', '2025-11-07', '06:00:00', '07:15:00'),
('XE002-08-11-2025', 'R02', 'XE002', 'TX001', '2025-11-08', '06:00:00', '07:15:00'),
('XE002-11-11-2025', 'R02', 'XE002', 'TX002', '2025-11-11', '06:00:00', '07:00:00'),
('XE002-2025-11-11', 'R02', 'XE002', 'TX002', '2025-11-11', '06:00:00', '12:00:00'),
('XE002-2025-11-16', 'R02', 'XE002', 'TX002', '2025-11-16', '06:00:00', '07:00:00'),
('XE002-2025-11-17', 'R02', 'XE002', 'TX005', '2025-11-17', '06:00:00', '12:00:00'),
('XE002-2025-11-18', 'R02', 'XE002', 'TX001', '2025-11-18', '06:00:00', '12:00:00'),
('XE002-2025-11-19', 'R02', 'XE002', 'TX005', '2025-11-19', '06:00:00', '12:00:00'),
('XE002-2025-11-20', 'R02', 'XE002', 'TX004', '2025-11-20', '06:00:00', '12:00:00'),
('XE002-2025-11-21', 'R02', 'XE002', 'TX003', '2025-11-21', '06:00:00', '12:00:00'),
('XE002-2025-11-22', 'R02', 'XE002', 'TX003', '2025-11-22', '06:00:00', '12:00:00'),
('XE002-2025-11-23', 'R02', 'XE002', NULL, '2025-11-23', '06:00:00', '12:00:00'),
('XE002-2025-11-24', 'R02', 'XE002', 'TX003', '2025-11-24', '06:00:00', '12:00:00'),
('XE002-2025-11-25', 'R02', 'XE002', 'TX005', '2025-11-25', '06:00:00', '12:00:00'),
('XE002-2025-11-26', 'R02', 'XE002', 'TX002', '2025-11-26', '06:00:00', '12:00:00'),
('XE002-2025-11-27', 'R02', 'XE002', 'TX004', '2025-11-27', '06:00:00', '12:00:00'),
('XE002-2025-11-28', 'R02', 'XE002', 'TX001', '2025-11-28', '06:00:00', '12:00:00'),
('XE002-2025-11-29', 'R02', 'XE002', 'TX003', '2025-11-29', '07:00:00', '11:00:00'),
('XE002-2025-12-01', 'R02', 'XE002', 'TX002', '2025-12-01', '06:00:00', '12:00:00'),
('XE002-2025-12-02', 'R02', 'XE002', 'TX005', '2025-12-02', '06:00:00', '12:00:00'),
('XE002-2025-12-03', 'R02', 'XE002', 'TX001', '2025-12-03', '06:00:00', '12:00:00'),
('XE002-2025-12-04', 'R02', 'XE002', 'TX002', '2025-12-04', '06:00:00', '12:00:00'),
('XE002-2025-12-05', 'R02', 'XE002', 'TX003', '2025-12-05', '06:00:00', '12:00:00'),
('XE002-2025-12-08', 'R02', 'XE002', 'TX005', '2025-12-08', '06:00:00', '12:00:00'),
('XE002-2025-12-10', 'R02', 'XE002', 'TX003', '2025-12-10', '06:00:00', '12:00:00'),
('XE002-2025-12-15', 'R02', 'XE002', 'TX001', '2025-12-15', '06:00:00', '12:00:00'),
('XE002-27-10-2025', 'R02', 'XE002', 'TX002', '2025-10-27', '06:00:00', '07:15:00'),
('XE002-28-10-2025', 'R02', 'XE002', 'TX003', '2025-10-28', '06:00:00', '07:15:00'),
('XE002-29-10-2025', 'R02', 'XE002', 'TX002', '2025-10-29', '06:00:00', '07:15:00'),
('XE002-30-10-2025', 'R02', 'XE002', 'TX002', '2025-10-30', '06:00:00', '07:15:00'),
('XE002-31-10-2025', 'R02', 'XE002', 'TX001', '2025-10-31', '06:00:00', '07:15:00'),
('XE003-01-11-2025', 'R03', 'XE003', 'TX003', '2025-11-01', '06:00:00', '07:15:00'),
('XE003-03-11-2025', 'R03', 'XE003', 'TX001', '2025-11-03', '06:00:00', '07:15:00'),
('XE003-04-11-2025', 'R03', 'XE003', 'TX004', '2025-11-04', '06:00:00', '07:15:00'),
('XE003-05-11-2025', 'R03', 'XE003', 'TX003', '2025-11-05', '06:00:00', '07:15:00'),
('XE003-06-11-2025', 'R03', 'XE003', 'TX003', '2025-11-06', '06:00:00', '07:15:00'),
('XE003-07-11-2025', 'R03', 'XE003', 'TX002', '2025-11-07', '06:00:00', '07:15:00'),
('XE003-08-11-2025', 'R03', 'XE003', 'TX003', '2025-11-08', '06:00:00', '07:15:00'),
('XE003-10-11-2025', 'R03', 'XE003', 'TX002', '2025-11-10', '06:00:00', '07:00:00'),
('XE003-11-11-2025', 'R03', 'XE003', 'TX003', '2025-11-11', '06:00:00', '12:00:00'),
('XE003-2025-11-10', 'R03', 'XE003', 'TX002', '2025-11-10', '06:00:00', '12:00:00'),
('XE003-2025-11-11', 'R03', 'XE003', 'TX003', '2025-11-11', '06:00:00', '12:00:00'),
('XE003-2025-11-17', 'R03', 'XE003', 'TX003', '2025-11-17', '06:00:00', '12:00:00'),
('XE003-2025-11-18', 'R03', 'XE003', 'TX002', '2025-11-18', '06:00:00', '12:00:00'),
('XE003-2025-11-19', 'R03', 'XE003', 'TX001', '2025-11-19', '06:00:00', '12:00:00'),
('XE003-2025-11-20', 'R03', 'XE003', 'TX005', '2025-11-20', '06:00:00', '12:00:00'),
('XE003-2025-11-21', 'R03', 'XE003', 'TX004', '2025-11-21', '06:00:00', '12:00:00'),
('XE003-2025-11-22', 'R03', 'XE003', NULL, '2025-11-22', '06:00:00', '12:00:00'),
('XE003-2025-11-23', 'R03', 'XE003', NULL, '2025-11-23', '06:00:00', '12:00:00'),
('XE003-2025-11-24', 'R03', 'XE003', 'TX004', '2025-11-24', '06:00:00', '12:00:00'),
('XE003-2025-11-25', 'R03', 'XE003', 'TX001', '2025-11-25', '06:00:00', '12:00:00'),
('XE003-2025-11-26', 'R03', 'XE003', 'TX003', '2025-11-26', '06:00:00', '12:00:00'),
('XE003-2025-11-27', 'R03', 'XE003', 'TX005', '2025-11-27', '06:00:00', '12:00:00'),
('XE003-2025-11-28', 'R03', 'XE003', 'TX002', '2025-11-28', '06:00:00', '12:00:00'),
('XE003-2025-11-29', 'R03', 'XE003', 'TX004', '2025-11-29', '07:00:00', '11:00:00'),
('XE003-2025-12-01', 'R03', 'XE003', 'TX003', '2025-12-01', '06:00:00', '12:00:00'),
('XE003-2025-12-02', 'R03', 'XE003', 'TX001', '2025-12-02', '06:00:00', '12:00:00'),
('XE003-2025-12-03', 'R03', 'XE003', 'TX004', '2025-12-03', '06:00:00', '12:00:00'),
('XE003-2025-12-04', 'R03', 'XE003', 'TX005', '2025-12-04', '06:00:00', '12:00:00'),
('XE003-2025-12-05', 'R03', 'XE003', 'TX002', '2025-12-05', '06:00:00', '12:00:00'),
('XE003-2025-12-08', 'R03', 'XE003', 'TX001', '2025-12-08', '06:00:00', '12:00:00'),
('XE003-2025-12-10', 'R03', 'XE003', 'TX004', '2025-12-10', '06:00:00', '12:00:00'),
('XE003-2025-12-15', 'R03', 'XE003', 'TX002', '2025-12-15', '06:00:00', '12:00:00'),
('XE003-27-10-2025', 'R03', 'XE003', 'TX001', '2025-10-27', '06:00:00', '07:15:00'),
('XE003-28-10-2025', 'R03', 'XE003', 'TX004', '2025-10-28', '06:00:00', '07:15:00'),
('XE003-29-10-2025', 'R03', 'XE003', 'TX003', '2025-10-29', '06:00:00', '07:15:00'),
('XE003-30-10-2025', 'R03', 'XE003', 'TX003', '2025-10-30', '06:00:00', '07:15:00'),
('XE003-31-10-2025', 'R03', 'XE003', 'TX002', '2025-10-31', '06:00:00', '07:15:00'),
('XE004-2025-11-17', NULL, 'XE004', 'TX001', '2025-11-17', '06:00:00', '12:00:00'),
('XE004-2025-11-18', NULL, 'XE004', 'TX003', '2025-11-18', '06:00:00', '12:00:00'),
('XE004-2025-11-19', NULL, 'XE004', 'TX003', '2025-11-19', '06:00:00', '12:00:00'),
('XE004-2025-11-20', NULL, 'XE004', 'TX002', '2025-11-20', '06:00:00', '12:00:00'),
('XE004-2025-11-21', NULL, 'XE004', 'TX001', '2025-11-21', '06:00:00', '12:00:00'),
('XE004-2025-11-22', 'R03', 'XE003', 'TX004', '2025-11-22', '06:00:00', '12:00:00'),
('XE004-2025-11-23', NULL, 'XE004', 'TX005', '2025-11-23', '06:00:00', '12:00:00');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `bus_stop`
--

CREATE TABLE `bus_stop` (
  `stop_id` varchar(255) NOT NULL,
  `route_id` varchar(255) DEFAULT NULL,
  `stop_name` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `lat` decimal(10,8) DEFAULT NULL,
  `lng` decimal(11,8) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `bus_stop`
--

INSERT INTO `bus_stop` (`stop_id`, `route_id`, `stop_name`, `address`, `lat`, `lng`) VALUES
('stop0011', 'R01', 'SGU CS2', '04 Tôn Đức Thắng, P.Bến Nghé, Q.1', 10.78050000, 106.70580000),
('stop0012', 'R01', 'Chợ Bến Thành', 'Công trường Quách Thị Trang, Q.1', 10.77210000, 106.69830000),
('stop0013', 'R01', 'SGU CSC', '273 An Dương Vương, P.3, Q.', 10.76013700, 106.68216600),
('stop0021', 'R02', 'SGU CS2', '04 Tôn Đức Thắng, P.Bến Nghé, Q.1', 10.78050000, 106.70580000),
('stop0022', 'R02', 'Hồ Con Rùa', 'Công trường Quốc tế, Q.3', 10.78250000, 106.69600000),
('stop0023', 'R02', 'SGU CS1', '105 Bà Huyện Thanh Quan, Q.3', 10.77691500, 106.69045000),
('stop0031', 'R03', 'SGU CSC', '273 An Dương Vương, P.3, Q.5', 10.76013700, 106.68216600),
('stop0032', 'R03', 'Cầu Chánh Hưng', 'Phạm Hùng, Q.8', 10.75200000, 106.67500000),
('stop0033', 'R03', 'KTX ', '99 An Dương Vương, P.16, Q.8', 10.72853200, 106.62202700);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `driver`
--

CREATE TABLE `driver` (
  `driver_id` varchar(255) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `status` varchar(50) DEFAULT 'Rảnh',
  `license_class` varchar(10) DEFAULT 'B2',
  `work_schedule` set('MON','TUE','WED','THU','FRI','SAT','SUN') DEFAULT NULL COMMENT 'Lịch làm việc cố định theo ngày'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `driver`
--

INSERT INTO `driver` (`driver_id`, `name`, `phone`, `address`, `status`, `license_class`, `work_schedule`) VALUES
('TX001', 'Nguyễn Văn Hùng', '0459276157', 'Lê Hồng Phong', 'Đang hoạt động', 'B2', 'MON,TUE,WED,FRI,SAT'),
('TX002', 'Trần Văn Trí', '0745128698', 'Trần Xuân Soạn', 'Đang hoạt động', 'B2', 'MON,TUE,WED,THU,FRI'),
('TX003', 'Lê Hùng Dũng', '0789425698', 'Võ Văn Kiệt', 'Đang hoạt động', 'B2', 'TUE,WED,THU,FRI,SAT'),
('TX004', 'Phạm Anh Đức', '0785158496', 'Nguyễn Trãi', 'Đang hoạt động', 'B2', 'TUE,WED,THU,FRI'),
('TX005', 'Ngô Thị Minh Thi', '0978425987', 'Đức Trọng', 'Đang hoạt động', 'B2', 'MON,TUE,WED,THU,FRI,SAT,SUN');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `notification`
--

CREATE TABLE `notification` (
  `id` int(11) NOT NULL,
  `recipient_type` enum('bus','driver','parent','system') NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `status` enum('unread','read') NOT NULL DEFAULT 'unread',
  `notificationFor` enum('Tài xế','Phụ huynh','Xe buýt','Hệ thống') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `notification`
--

INSERT INTO `notification` (`id`, `recipient_type`, `title`, `content`, `created_at`, `status`, `notificationFor`) VALUES
(1, 'driver', 'Thông báo cho tài xế', 'Ngày mai đi sớm 15 phút.', '2025-11-17 00:35:46', 'read', 'Tài xế'),
(2, 'parent', 'Thông báo cho phụ huynh', 'Ngày mai trời mưa, chuẩn bị áo mưa cho bé.', '2025-11-16 00:35:46', 'read', 'Phụ huynh'),
(3, 'bus', 'Thông báo cho xe buýt', 'Xe BUS001 đi kiểm tra định kỳ.', '2025-11-17 00:35:46', 'read', 'Xe buýt'),
(4, 'driver', 'Ngày mai nghỉ', 'Ngày mai bão nên nghỉ', '2025-11-17 01:00:28', 'unread', 'Phụ huynh'),
(5, 'system', 'Bảo trì hệ thống', 'Hệ thống sẽ bảo trì từ 2:00 giờ ngày 23/11/2025 đến 4:30 giờ ngày 23/11/2025', '2025-11-22 01:31:04', 'unread', 'Phụ huynh');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `parent`
--

CREATE TABLE `parent` (
  `parent_id` varchar(255) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `sex` char(10) DEFAULT 'Khác',
  `email` varchar(256) DEFAULT NULL,
  `age` int(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `parent`
--

INSERT INTO `parent` (`parent_id`, `name`, `phone`, `sex`, `email`, `age`) VALUES
('ph001', 'Hoàng Phủ Ngọc Tường', '0123456789', 'Nam', 'ph001@gmail.com', 30),
('ph002', 'Nguyễn Hồ Minh Mẫn', '0987654321', 'Khác', 'ph002@gmail.com', 35),
('ph003', 'Nguyễn Cao Minh Thùy', '0975312468', 'Khác', 'ph003@gmail.com', 28);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `route`
--

CREATE TABLE `route` (
  `route_id` varchar(255) NOT NULL,
  `route_name` varchar(255) DEFAULT NULL,
  `start_point` varchar(255) DEFAULT NULL,
  `end_point` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `route`
--

INSERT INTO `route` (`route_id`, `route_name`, `start_point`, `end_point`) VALUES
('R01', 'CS2 SGU (Q1) -> CSC SGU (Q5)', '04 Tôn Đức Thắng, Q1', '273 An Dương Vương, Q5'),
('R02', 'CS2 SGU (Q1) -> CS1 SGU (Q3)', '04 Tôn Đức Thắng, Q1', '105 Bà Huyện Thanh Quan, Q3'),
('R03', 'CSC SGU (Q5) -> KTX SGU (Q8)', '273 An Dương Vương, Q5', '99 An Dương Vương, Phường 16, Quận 8');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `student`
--

CREATE TABLE `student` (
  `student_id` varchar(255) NOT NULL,
  `parent_id` varchar(255) DEFAULT NULL,
  `stop_id` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `class` varchar(256) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `student`
--

INSERT INTO `student` (`student_id`, `parent_id`, `stop_id`, `name`, `class`) VALUES
('hs001', 'ph001', 'stop0011', 'Hoàng Nguyễn Minh Kha', 'DCT1234'),
('hs002', 'ph002', 'stop0021', 'Nguyễn Đỗ Như Ngọc', 'DCT1233'),
('hs003', 'ph003', 'stop0031', 'Hoàng Nguyên Khang', 'DCT1235'),
('HS53775', 'ph001', 'stop0012', 'Hoàng Nguyễn Như Hoa', 'DCT1234');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `student_pickup`
--

CREATE TABLE `student_pickup` (
  `pickup_id` varchar(255) NOT NULL,
  `student_id` varchar(255) NOT NULL,
  `driver_id` varchar(255) NOT NULL,
  `schedule_id` varchar(255) NOT NULL,
  `pickup_time` datetime DEFAULT NULL,
  `dropoff_time` datetime DEFAULT NULL,
  `status` enum('Đã đến trường','Đã lên xe','Chưa lên xe','Đã về nhà') NOT NULL,
  `stop_id` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `student_pickup`
--

INSERT INTO `student_pickup` (`pickup_id`, `student_id`, `driver_id`, `schedule_id`, `pickup_time`, `dropoff_time`, `status`, `stop_id`) VALUES
('PU01', 'hs001', 'TX001', 'XE001-01-11-2025', '2025-11-01 06:15:00', '2025-11-01 06:45:00', 'Đã đến trường', 'stop0013'),
('PU02', 'hs001', 'TX003', 'XE001-08-11-2025', '2025-11-08 06:10:00', '2025-11-08 06:40:00', 'Đã đến trường', 'stop0013'),
('PU03', 'hs001', 'TX002', 'XE001-2025-11-21', '2025-11-17 06:20:00', '2025-11-21 21:20:01', 'Chưa lên xe', 'stop0011'),
('PU04', 'hs002', 'TX003', 'XE001-2025-11-20', '2025-11-21 23:25:37', '2025-11-21 21:19:53', 'Chưa lên xe', 'stop0021'),
('PU1763648301256', 'hs001', 'TX003', 'XE002-2025-11-20', '2025-11-20 21:18:21', '2025-11-21 21:19:29', 'Đã đến trường', 'stop0013'),
('PU1763741390288', 'hs001', 'TX002', 'XE001-2025-11-21', '2025-11-21 23:10:40', NULL, 'Đã lên xe', 'stop0011'),
('PU1763741392518', 'HS53775', 'TX002', 'XE001-2025-11-21', '2025-11-21 23:09:57', NULL, 'Chưa lên xe', 'stop0012'),
('PU1763748577491', 'hs001', 'TX001', 'XE001-2025-11-22', '2025-11-22 16:01:55', NULL, 'Chưa lên xe', 'stop0011'),
('PU1763748633413', 'HS53775', 'TX001', 'XE001-2025-11-22', '2025-11-22 16:01:54', NULL, 'Chưa lên xe', 'stop0012'),
('PU1763748708951', 'hs002', 'TX003', 'XE002-2025-11-22', '2025-11-22 01:11:48', NULL, 'Đã lên xe', 'stop0021'),
('PU1763748749738', 'hs003', 'TX004', 'XE003-2025-11-21', '2025-11-22 15:43:39', NULL, 'Đã về nhà', 'stop0031');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `bus`
--
ALTER TABLE `bus`
  ADD PRIMARY KEY (`bus_id`),
  ADD UNIQUE KEY `bus_id` (`bus_id`,`license_plate`,`capacity`),
  ADD KEY `default_route_id` (`default_route_id`),
  ADD KEY `fk_bus_driver` (`driver_id`);

--
-- Chỉ mục cho bảng `bus_location`
--
ALTER TABLE `bus_location`
  ADD PRIMARY KEY (`location_id`),
  ADD KEY `bus_id` (`bus_id`);

--
-- Chỉ mục cho bảng `bus_schedule`
--
ALTER TABLE `bus_schedule`
  ADD PRIMARY KEY (`schedule_id`),
  ADD KEY `route_id` (`route_id`),
  ADD KEY `bus_id` (`bus_id`),
  ADD KEY `driver_id` (`driver_id`);

--
-- Chỉ mục cho bảng `bus_stop`
--
ALTER TABLE `bus_stop`
  ADD PRIMARY KEY (`stop_id`),
  ADD KEY `route_id` (`route_id`);

--
-- Chỉ mục cho bảng `driver`
--
ALTER TABLE `driver`
  ADD PRIMARY KEY (`driver_id`);

--
-- Chỉ mục cho bảng `notification`
--
ALTER TABLE `notification`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `parent`
--
ALTER TABLE `parent`
  ADD PRIMARY KEY (`parent_id`);

--
-- Chỉ mục cho bảng `route`
--
ALTER TABLE `route`
  ADD PRIMARY KEY (`route_id`);

--
-- Chỉ mục cho bảng `student`
--
ALTER TABLE `student`
  ADD PRIMARY KEY (`student_id`),
  ADD KEY `parent_id` (`parent_id`),
  ADD KEY `stop_id` (`stop_id`);

--
-- Chỉ mục cho bảng `student_pickup`
--
ALTER TABLE `student_pickup`
  ADD PRIMARY KEY (`pickup_id`),
  ADD KEY `student_id` (`student_id`),
  ADD KEY `driver_id` (`driver_id`),
  ADD KEY `schedule_id` (`schedule_id`),
  ADD KEY `fk_pickup_stop` (`stop_id`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `bus_location`
--
ALTER TABLE `bus_location`
  MODIFY `location_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `notification`
--
ALTER TABLE `notification`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `bus`
--
ALTER TABLE `bus`
  ADD CONSTRAINT `bus_ibfk_1` FOREIGN KEY (`default_route_id`) REFERENCES `route` (`route_id`),
  ADD CONSTRAINT `fk_bus_driver` FOREIGN KEY (`driver_id`) REFERENCES `driver` (`driver_id`);

--
-- Các ràng buộc cho bảng `bus_location`
--
ALTER TABLE `bus_location`
  ADD CONSTRAINT `bus_location_ibfk_1` FOREIGN KEY (`bus_id`) REFERENCES `bus` (`bus_id`);

--
-- Các ràng buộc cho bảng `bus_schedule`
--
ALTER TABLE `bus_schedule`
  ADD CONSTRAINT `bus_schedule_ibfk_1` FOREIGN KEY (`route_id`) REFERENCES `route` (`route_id`),
  ADD CONSTRAINT `bus_schedule_ibfk_2` FOREIGN KEY (`bus_id`) REFERENCES `bus` (`bus_id`),
  ADD CONSTRAINT `bus_schedule_ibfk_3` FOREIGN KEY (`driver_id`) REFERENCES `driver` (`driver_id`);

--
-- Các ràng buộc cho bảng `bus_stop`
--
ALTER TABLE `bus_stop`
  ADD CONSTRAINT `bus_stop_ibfk_1` FOREIGN KEY (`route_id`) REFERENCES `route` (`route_id`);

--
-- Các ràng buộc cho bảng `student`
--
ALTER TABLE `student`
  ADD CONSTRAINT `student_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `parent` (`parent_id`),
  ADD CONSTRAINT `student_ibfk_2` FOREIGN KEY (`stop_id`) REFERENCES `bus_stop` (`stop_id`);

--
-- Các ràng buộc cho bảng `student_pickup`
--
ALTER TABLE `student_pickup`
  ADD CONSTRAINT `fk_pickup_stop` FOREIGN KEY (`stop_id`) REFERENCES `bus_stop` (`stop_id`),
  ADD CONSTRAINT `student_pickup_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`),
  ADD CONSTRAINT `student_pickup_ibfk_2` FOREIGN KEY (`driver_id`) REFERENCES `driver` (`driver_id`),
  ADD CONSTRAINT `student_pickup_ibfk_3` FOREIGN KEY (`schedule_id`) REFERENCES `bus_schedule` (`schedule_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
