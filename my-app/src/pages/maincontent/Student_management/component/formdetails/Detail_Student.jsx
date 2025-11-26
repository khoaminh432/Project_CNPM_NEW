import React, { useState } from 'react';

// model class for student
class Student {
  constructor(data = {}) {
    this.id = data.id ?? '001';
    this.name = data.name ?? 'Nguyễn Văn A';
    this.gender = data.gender ?? 'Nam';
    this.dob = data.dob ?? '15/05/2010';
    this.placeOfBirth = data.placeOfBirth ?? 'TP. Hồ Chí Minh';
    this.address = data.address ?? '455 Hồng Bàng, Phường 14, Quận 5, TP. HCM';
    this.phone = data.phone ?? '0901 234 567';
    this.email = data.email ?? 'nguyenvana@example.com';
    this.className = data.className ?? '6A1';
    this.schoolYear = data.schoolYear ?? '2023-2024';
    this.route = data.route ?? '1';
    this.pickupTime = data.pickupTime ?? '6:55';
    this.parentName = data.parentName ?? 'Nguyễn Văn B';
    this.relation = data.relation ?? 'Cha';
    this.parentPhone = data.parentPhone ?? '0909 876 543';
    this.parentEmail = data.parentEmail ?? 'nguyenvanb@example.com';
  }

  // merge updates immutably
  with(update = {}) {
    return new Student({ ...this, ...update });
  }
}

function Detail_Student({ tempStudent = null }) {
  // initialize state with Student instance (use provided tempStudent if any)
  const [student, setStudent] = useState(new Student(tempStudent || {}));

  const handleEdit = () => {
    // example: update name (demo)
    // setStudent(prev => prev.with({ name: 'Tên mới' }));
    alert('Chức năng chỉnh sửa chưa triển khai');
  };

  return (
    <div className="container-detail-student">
      <div className="header-detail-student">
        <h1>THÔNG TIN CHI TIẾT HỌC SINH</h1>
        <div className="student-id">Mã học sinh: {student.id}</div>
      </div>

      <div className="content">
        <div className="section">
          <h2 className="section-title">Thông tin cá nhân</h2>
          <div className="info-grid">
            <div className="info-item">
              <div className="info-label">Họ và tên</div>
              <div className="info-value">{student.name}</div>
            </div>
            <div className="info-item">
              <div className="info-label">Giới tính</div>
              <div className="info-value">{student.gender}</div>
            </div>
            <div className="info-item">
              <div className="info-label">Ngày sinh</div>
              <div className="info-value">{student.dob}</div>
            </div>
            <div className="info-item">
              <div className="info-label">Nơi sinh</div>
              <div className="info-value">{student.placeOfBirth}</div>
            </div>
          </div>
        </div>

        <div className="section">
          <h2 className="section-title">Thông tin liên hệ</h2>
          <div className="info-grid">
            <div className="info-item full-width">
              <div className="info-label">Địa chỉ</div>
              <div className="info-value">{student.address}</div>
            </div>
            <div className="info-item">
              <div className="info-label">Số điện thoại</div>
              <div className="info-value">{student.phone}</div>
            </div>
            <div className="info-item">
              <div className="info-label">Email</div>
              <div className="info-value">{student.email}</div>
            </div>
          </div>
        </div>

        <div className="section">
          <h2 className="section-title">Thông tin học tập</h2>
          <div className="info-grid">
            <div className="info-item">
              <div className="info-label">Lớp</div>
              <div className="info-value">{student.className}</div>
            </div>
            <div className="info-item">
              <div className="info-label">Năm học</div>
              <div className="info-value">{student.schoolYear}</div>
            </div>
            <div className="info-item">
              <div className="info-label">Tuyến số</div>
              <div className="info-value">{student.route}</div>
            </div>
            <div className="info-item">
              <div className="info-label">Giờ đón</div>
              <div className="info-value">{student.pickupTime}</div>
            </div>
          </div>
        </div>

        <div className="section">
          <h2 className="section-title">Thông tin phụ huynh</h2>
          <div className="info-grid">
            <div className="info-item">
              <div className="info-label">Họ tên phụ huynh</div>
              <div className="info-value">{student.parentName}</div>
            </div>
            <div className="info-item">
              <div className="info-label">Quan hệ</div>
              <div className="info-value">{student.relation}</div>
            </div>
            <div className="info-item">
              <div className="info-label">Số điện thoại</div>
              <div className="info-value">{student.parentPhone}</div>
            </div>
            <div className="info-item">
              <div className="info-label">Email</div>
              <div className="info-value">{student.parentEmail}</div>
            </div>
          </div>
        </div>

        <div className="btn-group">
          <button className="btn btn-secondary" onClick={() => window.print()}>In thông tin</button>
          <button className="btn btn-primary" onClick={handleEdit}>Chỉnh sửa</button>
        </div>
      </div>
    </div>
  );
}

export default Detail_Student;