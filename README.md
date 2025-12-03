# Backend nodejs + express + mysql
npm install express cors mysql2 bcrypt
node server.js
# Frontend react
my-app>npm start


# Cấu trúc Sign in

React (Frontend)
 └─ App.js
     ├─ Signin.js (login form)
     ├─ Success.js (admin)
     ├─ DriverSuccess.js
     └─ ParentSuccess.js
      (Hiển thị theo loại user)
 └── package.json      <-- Quản lý thư viện frontend

NodeJS + Express (Backend)
 ├─ server.js (main server)
 ├─ signinRoute.js (route)
 ├─ signinController.js (logic xử lý)
 ├─ signinModel.js (tương tác DB)
 └─ db.js (kết nối MySQL)

MySQL (Database)
 └─ bảng tai_khoan
      ├─ id
      ├─ tenTK
      ├─ matkhau
      └─ loai (AD / DRIVER / PARENT)



# G5BUS - SQL tạo bảng và dữ liệu mẫu 
## 1. SQL tk ko mã hóa hash
-- Chọn cơ sở dữ liệu busmap
USE busmap;

CREATE TABLE IF NOT EXISTS tai_khoan (
    id VARCHAR(20) PRIMARY KEY,
    tenTK VARCHAR(50) NOT NULL UNIQUE,
    matkhau VARCHAR(255) NOT NULL,
    loai ENUM('AD', 'DRIVER', 'PARENT') NOT NULL
);

INSERT INTO tai_khoan (id, tenTK, matkhau, loai) VALUES
('1', 'admin', 'g5bus', 'AD'),
('2', 'driver', 'g5bus', 'DRIVER'),
('3', 'parent', 'g5bus', 'PARENT');
