import React, { useState } from 'react';
import './style.css';
import { Student } from './../../../../../models/Student';

function Detail_Student({ tempStudent = new Student() ,backToList = ()=>{} }) {
  const [student, setStudent] = useState(tempStudent);

  const handleEdit = () => {
    alert('Chức năng chỉnh sửa chưa triển khai');
  };

  const handleBack = () => {
    backToList()
  };

  return (
    <div className="container-detail-student">
      {/* Header */}
      <div className="header-detail-student">
        <button className="btn-back-icon" onClick={handleBack}>
          ← Quay lại
        </button>
        <h1>Chi tiết học sinh</h1>
        <div className="student-id">ID: {student.id}</div>
      </div>

      {/* Content */}
      <div className="content">
        {/* Personal Info Card */}
        <section className="info-card">
          <h2 className="card-title">Thông tin cá nhân</h2>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Họ và tên</span>
              <span className="info-value">{student.name}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Giới tính</span>
              <span className="info-value">{student.gender || 'N/A'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Ngày sinh</span>
              <span className="info-value">{student.dob || 'N/A'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Nơi sinh</span>
              <span className="info-value">{student.placeOfBirth || 'N/A'}</span>
            </div>
          </div>
        </section>

        {/* Contact Info Card */}
        <section className="info-card">
          <h2 className="card-title">Thông tin liên hệ</h2>
          <div className="info-grid">
            <div className="info-item full-width">
              <span className="info-label">Địa chỉ</span>
              <span className="info-value">{student.address || 'N/A'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Số điện thoại</span>
              <span className="info-value">{student.phone || 'N/A'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Email</span>
              <span className="info-value" style={{ wordBreak: 'break-word' }}>
                {student.email || 'N/A'}
              </span>
            </div>
          </div>
        </section>

        {/* Academic Info Card */}
        <section className="info-card">
          <h2 className="card-title">Thông tin học tập</h2>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Lớp</span>
              <span className="info-value">{student.className || 'N/A'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Năm học</span>
              <span className="info-value">{student.schoolYear || 'N/A'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Tuyến số</span>
              <span className="info-value">{student.route || 'N/A'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Giờ đón</span>
              <span className="info-value">{student.pickupTime || 'N/A'}</span>
            </div>
          </div>
        </section>

        {/* Parent Info Card */}
        <section className="info-card">
          <h2 className="card-title">Thông tin phụ huynh</h2>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Họ tên</span>
              <span className="info-value">{student.parentName || 'N/A'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Quan hệ</span>
              <span className="info-value">{student.relation || 'N/A'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Số điện thoại</span>
              <span className="info-value">{student.parentPhone || 'N/A'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Email</span>
              <span className="info-value" style={{ wordBreak: 'break-word' }}>
                {student.parentEmail || 'N/A'}
              </span>
            </div>
          </div>
        </section>
      </div>

      {/* Actions */}
      <div className="btn-group">
        <button className="btn btn-secondary" onClick={handleBack}>Quay lại</button>
        <button className="btn btn-primary" onClick={handleEdit}>Chỉnh sửa</button>
      </div>
    </div>
  );
}

export default Detail_Student;