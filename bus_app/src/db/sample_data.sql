-- Insert sample data for testing the schedule component

-- Sample Users
INSERT INTO `users` (`username`, `password`, `email`, `user_role`) VALUES
('admin001', '$2b$10$hashed_password', 'admin@busapp.com', 'admin'),
('driver001', '$2b$10$hashed_password', 'driver1@busapp.com', 'driver'),
('driver002', '$2b$10$hashed_password', 'driver2@busapp.com', 'driver'),
('parent001', '$2b$10$hashed_password', 'parent1@busapp.com', 'parent'),
('parent002', '$2b$10$hashed_password', 'parent2@busapp.com', 'parent');

-- Sample Drivers  
INSERT INTO `drivers` (`user_id`, `driver_code`, `full_name`, `phone`, `email`, `date_of_birth`, `gender`, `license_type`, `rating`, `join_date`) VALUES
(2, 'DRV001', 'Nguyen Van A', '0901234567', 'driver1@busapp.com', '1985-03-15', 'male', 'D', 4.8, '2023-01-15'),
(3, 'DRV002', 'Tran Thi B', '0902345678', 'driver2@busapp.com', '1987-07-22', 'female', 'D', 4.9, '2023-02-10');

-- Sample Routes
INSERT INTO `routes` (`route_code`, `route_name`, `start_location`, `end_location`, `planned_start`, `planned_end`, `distance_km`) VALUES
('RT001', 'Tuyến 1 - Trung tâm', 'Bến xe miền Đông', 'Trường THPT ABC', '06:30:00', '07:30:00', 15.5),
('RT002', 'Tuyến 2 - Ngoại thành', 'Khu đô thị XYZ', 'Trường THCS DEF', '06:45:00', '07:45:00', 12.8),
('RT003', 'Tuyến 3 - Nội thành', 'Quận 1', 'Trường Tiểu học GHI', '07:00:00', '08:00:00', 8.2);

-- Sample Stops
INSERT INTO `stops` (`route_id`, `stop_name`, `stop_address`, `latitude`, `longitude`, `stop_order`, `estimated_arrival_time`) VALUES
(1, 'Bến xe miền Đông', '292 Đinh Bộ Lĩnh, Bình Thạnh', 10.8142, 106.7115, 1, '06:30:00'),
(1, 'Ngã tư Hàng Xanh', 'Giao lộ Đinh Bộ Lĩnh - Xô Viết Nghệ Tĩnh', 10.7993, 106.7081, 2, '06:45:00'),
(1, 'Trường THPT ABC', '123 Đường ABC, Quận 3', 10.7769, 106.6951, 3, '07:30:00'),
(2, 'Khu đô thị XYZ', '456 Đường XYZ, Quận 9', 10.8305, 106.7715, 1, '06:45:00'),
(2, 'Trường THCS DEF', '789 Đường DEF, Quận 2', 10.7972, 106.7436, 2, '07:45:00');

-- Sample Students
INSERT INTO `students` (`student_code`, `full_name`, `class_name`, `parent_phone`, `route_id`, `pickup_stop_id`, `dropoff_stop_id`) VALUES
('ST001', 'Le Van C', '12A1', '0903456789', 1, 1, 3),
('ST002', 'Pham Thi D', '11B2', '0904567890', 1, 2, 3),
('ST003', 'Vo Van E', '10C3', '0905678901', 2, 4, 5),
('ST004', 'Nguyen Thi F', '9A1', '0906789012', 2, 4, 5);

-- Sample Schedules for today and upcoming days
INSERT INTO `schedules` (`driver_id`, `route_id`, `schedule_date`, `day_of_week`, `status`, `total_students_expected`) VALUES
(1, 1, CURDATE(), DAYNAME(CURDATE()), 'scheduled', 2),
(2, 2, CURDATE(), DAYNAME(CURDATE()), 'in_progress', 2),
(1, 3, CURDATE(), DAYNAME(CURDATE()), 'completed', 0),
(1, 1, DATE_ADD(CURDATE(), INTERVAL 1 DAY), DAYNAME(DATE_ADD(CURDATE(), INTERVAL 1 DAY)), 'scheduled', 2),
(2, 2, DATE_ADD(CURDATE(), INTERVAL 1 DAY), DAYNAME(DATE_ADD(CURDATE(), INTERVAL 1 DAY)), 'scheduled', 2);

-- Sample Notifications
INSERT INTO `notifications` (`title`, `message`, `notification_type`, `recipient_id`) VALUES
('Lịch trình mới', 'Bạn có lịch trình mới cho ngày mai', 'schedule_update', 2),
('Cập nhật tuyến đường', 'Tuyến đường RT001 có thay đổi thời gian', 'route_update', 2),
('Thông báo học sinh', 'Học sinh ST001 vắng mặt hôm nay', 'student_absent', 2);