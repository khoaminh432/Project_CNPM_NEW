

CREATE TABLE `users` (
  `user_id` INT PRIMARY KEY AUTO_INCREMENT,
  `username` VARCHAR(50) UNIQUE NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `email` VARCHAR(100) UNIQUE NOT NULL,
  `user_role` ENUM('admin', 'driver', 'parent') DEFAULT 'driver',
  `is_active` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_user_role` (`user_role`),
  INDEX `idx_is_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE `drivers` (
  `driver_id` INT PRIMARY KEY AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `driver_code` VARCHAR(20) UNIQUE NOT NULL,
  `full_name` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(15) NOT NULL,
  `email` VARCHAR(100),
  `date_of_birth` DATE,
  `id_card` VARCHAR(20) UNIQUE,
  `gender` ENUM('male', 'female', 'other'),
  `license_type` VARCHAR(10),
  `rating` DECIMAL(3, 2) DEFAULT 5.00,
  `total_trips` INT DEFAULT 0,
  `completed_trips` INT DEFAULT 0,
  `bank_account` VARCHAR(20),
  `bank_name` VARCHAR(50),
  `account_holder` VARCHAR(100),
  `status` ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
  `join_date` DATE,
  `profile_image_url` VARCHAR(255),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE,
  INDEX `idx_driver_code` (`driver_code`),
  INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE `routes` (
  `route_id` INT PRIMARY KEY AUTO_INCREMENT,
  `route_code` VARCHAR(20) UNIQUE NOT NULL,
  `route_name` VARCHAR(100) NOT NULL,
  `start_location` VARCHAR(100) NOT NULL,
  `end_location` VARCHAR(100) NOT NULL,
  `planned_start` TIME NOT NULL,
  `planned_end` TIME NOT NULL,
  `total_students` INT DEFAULT 0,
  `distance_km` DECIMAL(8, 2),
  `estimated_duration_minutes` INT,
  `status` ENUM('active', 'inactive') DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_route_code` (`route_code`),
  INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE `stops` (
  `stop_id` INT PRIMARY KEY AUTO_INCREMENT,
  `route_id` INT NOT NULL,
  `stop_code` VARCHAR(20) UNIQUE NOT NULL,
  `stop_name` VARCHAR(100) NOT NULL,
  `address` VARCHAR(200) NOT NULL,
  `latitude` DECIMAL(10, 8),
  `longitude` DECIMAL(11, 8),
  `stop_order` INT NOT NULL,
  `arrival_time` TIME NOT NULL,
  `student_count` INT DEFAULT 0,
  `stop_type` ENUM('pickup', 'dropoff', 'both') DEFAULT 'both',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`route_id`) REFERENCES `routes`(`route_id`) ON DELETE CASCADE,
  UNIQUE KEY `uk_route_stop_order` (`route_id`, `stop_order`),
  INDEX `idx_route_id` (`route_id`),
  INDEX `idx_stop_order` (`stop_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE `students` (
  `student_id` INT PRIMARY KEY AUTO_INCREMENT,
  `student_code` VARCHAR(20) UNIQUE NOT NULL,
  `full_name` VARCHAR(100) NOT NULL,
  `class_name` VARCHAR(50) NOT NULL,
  `school_name` VARCHAR(100),
  `phone` VARCHAR(15),
  `email` VARCHAR(100),
  `date_of_birth` DATE,
  `gender` ENUM('male', 'female', 'other'),
  `parent_name` VARCHAR(100),
  `parent_phone` VARCHAR(15),
  `parent_email` VARCHAR(100),
  `home_address` VARCHAR(200),
  `pickup_stop_id` INT,
  `dropoff_stop_id` INT,
  `route_id` INT,
  `is_active` BOOLEAN DEFAULT TRUE,
  `enrollment_date` DATE,
  `avatar_url` VARCHAR(255),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`pickup_stop_id`) REFERENCES `stops`(`stop_id`) ON DELETE SET NULL,
  FOREIGN KEY (`dropoff_stop_id`) REFERENCES `stops`(`stop_id`) ON DELETE SET NULL,
  FOREIGN KEY (`route_id`) REFERENCES `routes`(`route_id`) ON DELETE SET NULL,
  INDEX `idx_student_code` (`student_code`),
  INDEX `idx_route_id` (`route_id`),
  INDEX `idx_is_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `schedules` (
  `schedule_id` INT PRIMARY KEY AUTO_INCREMENT,
  `driver_id` INT NOT NULL,
  `route_id` INT NOT NULL,
  `schedule_date` DATE NOT NULL,
  `day_of_week` VARCHAR(10),
  `status` ENUM('scheduled', 'in_progress', 'completed', 'cancelled') DEFAULT 'scheduled',
  `actual_start_time` DATETIME,
  `actual_end_time` DATETIME,
  `total_students_expected` INT DEFAULT 0,
  `total_students_actual` INT DEFAULT 0,
  `notes` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`driver_id`) REFERENCES `drivers`(`driver_id`) ON DELETE CASCADE,
  FOREIGN KEY (`route_id`) REFERENCES `routes`(`route_id`) ON DELETE CASCADE,
  INDEX `idx_driver_id` (`driver_id`),
  INDEX `idx_route_id` (`route_id`),
  INDEX `idx_schedule_date` (`schedule_date`),
  INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE `notifications` (
  `notification_id` INT PRIMARY KEY AUTO_INCREMENT,
  `recipient_type` ENUM('driver', 'parent', 'admin') NOT NULL,
  `recipient_id` INT NOT NULL,
  `title` VARCHAR(200) NOT NULL,
  `message` TEXT NOT NULL,
  `notification_type` ENUM('info', 'warning', 'error', 'success') DEFAULT 'info',
  `is_read` BOOLEAN DEFAULT FALSE,
  `action_url` VARCHAR(255),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `read_at` TIMESTAMP NULL,
  INDEX `idx_recipient` (`recipient_type`, `recipient_id`),
  INDEX `idx_is_read` (`is_read`),
  INDEX `idx_created_at` (`created_at`),
  INDEX `idx_recipient_read` (`recipient_type`, `recipient_id`, `is_read`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `bus_locations` (
  `location_id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `driver_id` INT NOT NULL,
  `route_id` INT NOT NULL,
  `schedule_id` INT NOT NULL,
  `latitude` DECIMAL(10, 8) NOT NULL,
  `longitude` DECIMAL(11, 8) NOT NULL,
  `speed` DECIMAL(5, 2) DEFAULT 0,
  `heading` INT,
  `accuracy` DECIMAL(5, 2),
  `recorded_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`driver_id`) REFERENCES `drivers`(`driver_id`) ON DELETE CASCADE,
  FOREIGN KEY (`route_id`) REFERENCES `routes`(`route_id`) ON DELETE CASCADE,
  FOREIGN KEY (`schedule_id`) REFERENCES `schedules`(`schedule_id`) ON DELETE CASCADE,
  INDEX `idx_driver_id` (`driver_id`),
  INDEX `idx_route_id` (`route_id`),
  INDEX `idx_schedule_id` (`schedule_id`),
  INDEX `idx_recorded_at` (`recorded_at`),
  INDEX `idx_driver_recorded` (`driver_id`, `recorded_at`),
  INDEX `idx_schedule_recorded` (`schedule_id`, `recorded_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



INSERT INTO `users` (`username`, `password`, `email`, `user_role`, `is_active`) VALUES
('admin001', 'hashed_password_admin', 'admin@busapp.com', 'admin', TRUE),
('driver001', 'hashed_password_1', 'driver1@busapp.com', 'driver', TRUE),
('driver002', 'hashed_password_2', 'driver2@busapp.com', 'driver', TRUE),
('parent001', 'hashed_password_parent1', 'parent1@busapp.com', 'parent', TRUE),
('parent002', 'hashed_password_parent2', 'parent2@busapp.com', 'parent', TRUE);

INSERT INTO `drivers` (
  `user_id`, `driver_code`, `full_name`, `phone`, `email`, `date_of_birth`,
  `id_card`, `gender`, `license_type`, `bank_account`, `bank_name`,
  `account_holder`, `join_date`, `status`
) VALUES
(2, 'BUSDR-023', 'Lê Văn A', '0842498241', 'driver1@busapp.com', '1990-05-15',
 '123456789012', 'male', 'Bằng B1', '9667', 'Mbbank', 'Lê Văn A', '2025-08-01', 'active'),
(3, 'BUSDR-024', 'Trần Thị B', '0842498242', 'driver2@busapp.com', '1992-03-20',
 '123456789013', 'female', 'Bằng B1', '8765', 'Vietcombank', 'Trần Thị B', '2025-08-15', 'active');


INSERT INTO `routes` (
  `route_code`, `route_name`, `start_location`, `end_location`,
  `planned_start`, `planned_end`, `total_students`, `distance_km`, `estimated_duration_minutes`, `status`
) VALUES
('ROUTE-01', 'Tuyến 05', 'Bến xe buýt Chợ Lớn', 'Bến xe Biên Hòa', '04:50', '17:45', 12, 45.50, 120, 'active'),
('ROUTE-02', 'Tuyến 06', 'Bến xe Gò Vấp', 'Bến xe Long An', '05:30', '18:00', 15, 55.00, 150, 'active'),
('ROUTE-03', 'Tuyến 07', 'Bến xe Tân Bình', 'Bến xe Tây Ninh', '06:00', '18:30', 10, 60.00, 160, 'active');

INSERT INTO `stops` (
  `route_id`, `stop_code`, `stop_name`, `address`, `latitude`, `longitude`,
  `stop_order`, `arrival_time`, `student_count`, `stop_type`
) VALUES
(1, 'STOP-01', 'Tạ Uyên', '123 Tạ Uyên, Q.1, TP.HCM', '10.768854', '106.679639', 1, '07:30', 4, 'pickup'),
(1, 'STOP-02', 'Nguyễn Hữu Cảnh', '456 Nguyễn Hữu Cảnh, Q.1, TP.HCM', '10.770000', '106.685000', 2, '07:45', 3, 'pickup'),
(1, 'STOP-03', 'Lê Lợi', '789 Lê Lợi, Q.1, TP.HCM', '10.772000', '106.690000', 3, '08:00', 5, 'both'),
(2, 'STOP-04', 'Pasteur', '100 Pasteur, Q.1, TP.HCM', '10.775000', '106.695000', 1, '08:15', 6, 'pickup'),
(2, 'STOP-05', 'Công Trường Mê Linh', '200 Công Trường Mê Linh, Q.1, TP.HCM', '10.780000', '106.700000', 2, '08:30', 9, 'both'),
(3, 'STOP-06', 'Bờ Bao Tân Thắng', '300 Bờ Bao Tân Thắng, Q.Tân Bình, TP.HCM', '10.790000', '106.710000', 1, '08:45', 7, 'pickup');

INSERT INTO `students` (
  `student_code`, `full_name`, `class_name`, `school_name`, `phone`, `email`,
  `date_of_birth`, `gender`, `parent_name`, `parent_phone`, `parent_email`,
  `home_address`, `pickup_stop_id`, `dropoff_stop_id`, `route_id`, `is_active`, `enrollment_date`
) VALUES
('STU-001', 'Nguyễn Văn A', '10A1', 'Trường THPT Gia Định', '0901234567', 'student1@school.com',
 '2006-01-15', 'male', 'Nguyễn Văn X', '0911234567', 'parent1@email.com', '123 Tạ Uyên, Q.1', 1, 3, 1, TRUE, '2025-09-01'),
('STU-002', 'Trần Thị B', '10A2', 'Trường THPT Gia Định', '0902234567', 'student2@school.com',
 '2006-03-20', 'female', 'Trần Văn Y', '0912234567', 'parent2@email.com', '456 Nguyễn Hữu Cảnh, Q.1', 2, 3, 1, TRUE, '2025-09-01'),
('STU-003', 'Lê Văn C', '10B1', 'Trường THPT Gia Định', '0903234567', 'student3@school.com',
 '2006-05-10', 'male', 'Lê Văn Z', '0913234567', 'parent3@email.com', '200 Công Trường Mê Linh, Q.1', 4, 5, 2, TRUE, '2025-09-01'),
('STU-004', 'Phạm Thị D', '10C1', 'Trường THPT Gia Định', '0904234567', 'student4@school.com',
 '2006-07-25', 'female', 'Phạm Văn T', '0914234567', 'parent4@email.com', '300 Bờ Bao Tân Thắng, Q.Tân Bình', 6, 6, 3, TRUE, '2025-09-01'),
('STU-005', 'Hoàng Văn E', '10D1', 'Trường THPT Gia Định', '0905234567', 'student5@school.com',
 '2006-09-30', 'male', 'Hoàng Văn Q', '0915234567', 'parent5@email.com', '789 Lê Lợi, Q.1', 3, 3, 1, TRUE, '2025-09-01');


INSERT INTO `schedules` (
  `driver_id`, `route_id`, `schedule_date`, `day_of_week`, `status`,
  `total_students_expected`
) VALUES
(1, 1, '2025-11-25', 'Tuesday', 'scheduled', 12),
(1, 1, '2025-11-26', 'Wednesday', 'scheduled', 12),
(1, 1, '2025-11-27', 'Thursday', 'scheduled', 12),
(2, 2, '2025-11-25', 'Tuesday', 'scheduled', 15),
(2, 2, '2025-11-26', 'Wednesday', 'scheduled', 15);


INSERT INTO `notifications` (
  `recipient_type`, `recipient_id`, `title`, `message`, `notification_type`, `is_read`
) VALUES
-- Notifications for drivers
(1, 'driver', 'Lịch làm việc hôm nay', 'Bạn có 1 tuyến đi hôm nay, bắt đầu lúc 04:50', 'info', FALSE),
(1, 'driver', 'Học sinh mới', 'Có 2 học sinh mới được thêm vào tuyến của bạn', 'info', FALSE),
(2, 'driver', 'Nhắc nhở báo cáo', 'Vui lòng hoàn thành báo cáo chuyến đi hôm qua', 'warning', FALSE),
-- Notifications for parents
(1, 'parent', 'Xe của con đang trên đường', 'Xe buýt tuyến 05 sắp tới điểm đón con bạn trong 5 phút', 'info', FALSE),
(2, 'parent', 'Con được đón thành công', 'Con bạn được đón tại điểm dừng Tạ Uyên lúc 07:35', 'success', FALSE),
(3, 'parent', 'Cảnh báo', 'Xe bị chậm trễ 10 phút do tắc đường', 'warning', FALSE),
-- Notifications for admin
(1, 'admin', 'Báo cáo hàng ngày', 'Tóm tắt hoạt động: 3 tuyến, 37 học sinh đã đón', 'info', TRUE),
(1, 'admin', 'Cảnh báo hệ thống', 'Driver Lê Văn A chưa cập nhật trạng thái', 'warning', FALSE);

-- ============================================================
-- SAMPLE GPS LOCATION DATA (REAL-TIME TRACKING)
-- ============================================================
INSERT INTO `bus_locations` (
  `driver_id`, `route_id`, `schedule_id`, `latitude`, `longitude`, `speed`, `heading`, `accuracy`, `recorded_at`
) VALUES
-- Route 1 - Driver 1 tracking data
(1, 1, 1, '10.768854', '106.679639', 25.5, 180, 5.0, '2025-11-25 07:30:00'),
(1, 1, 1, '10.769500', '106.680200', 30.2, 182, 4.8, '2025-11-25 07:35:00'),
(1, 1, 1, '10.770000', '106.685000', 35.8, 185, 5.2, '2025-11-25 07:40:00'),
(1, 1, 1, '10.770500', '106.686500', 32.1, 188, 4.9, '2025-11-25 07:45:00'),
(1, 1, 1, '10.771000', '106.688000', 28.5, 190, 5.1, '2025-11-25 07:50:00'),
(1, 1, 1, '10.772000', '106.690000', 38.2, 192, 5.3, '2025-11-25 07:55:00'),
(1, 1, 1, '10.773000', '106.692000', 42.5, 195, 5.4, '2025-11-25 08:00:00'),
(1, 1, 1, '10.774000', '106.694000', 40.1, 198, 5.2, '2025-11-25 08:05:00'),
(1, 1, 1, '10.775000', '106.695000', 35.7, 200, 5.0, '2025-11-25 08:10:00'),
(1, 1, 1, '10.776000', '106.697000', 33.2, 202, 4.8, '2025-11-25 08:15:00'),

-- Route 2 - Driver 2 tracking data
(2, 2, 4, '10.775000', '106.695000', 28.5, 190, 5.1, '2025-11-25 08:15:00'),
(2, 2, 4, '10.775500', '106.696500', 32.1, 192, 4.9, '2025-11-25 08:20:00'),
(2, 2, 4, '10.776000', '106.698000', 35.8, 195, 5.2, '2025-11-25 08:25:00'),
(2, 2, 4, '10.777000', '106.700000', 38.2, 198, 5.3, '2025-11-25 08:30:00'),
(2, 2, 4, '10.778000', '106.702000', 40.5, 200, 5.4, '2025-11-25 08:35:00'),
(2, 2, 4, '10.779000', '106.704000', 42.1, 202, 5.2, '2025-11-25 08:40:00'),
(2, 2, 4, '10.780000', '106.700000', 39.5, 198, 5.1, '2025-11-25 08:45:00');


CREATE INDEX idx_driver_phone ON `drivers`(`phone`);
CREATE INDEX idx_student_route ON `students`(`route_id`);
CREATE INDEX idx_schedule_driver_date ON `schedules`(`driver_id`, `schedule_date`);
CREATE INDEX idx_bus_location_driver ON `bus_locations`(`driver_id`);
CREATE INDEX idx_bus_location_schedule ON `bus_locations`(`schedule_id`);

