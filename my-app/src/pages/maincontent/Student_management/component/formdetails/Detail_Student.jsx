import React, { useState } from 'react';
import './style.css';

function formatDate(d) {
  if (!d) return 'N/A';
  const date = new Date(d);
  if (isNaN(date.getTime())) return 'N/A';
  return date.toLocaleString();
}

function Detail_Student({ tempStudent = {}, backToList = () => {} }) {

  const [editing, setEditing] = useState(false);
  const [student, setStudent] = useState(tempStudent);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudent(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setEditing(false);
    console.log("Saved:", student);
  };

  return (
    <div className="container-detail-student">
      {/* HEADER */}
      <div className="header-detail-student">
        <button className="btn-back-icon" onClick={backToList}>
          ← Quay lại
        </button>
        <h1>Chi tiết học sinh</h1>
        <div className="student-id">ID: {student.student_id}</div>
      </div>

      <div className="content">

        {/* PERSONAL INFO */}
        <section className="info-card">
          <h2 className="card-title">Thông tin cá nhân</h2>
          <div className="info-grid">

            {/* Họ và tên */}
            <div className="info-item">
              <span className="info-label">Họ và tên</span>
              {editing ? (
                <input name="name" className="info-input" value={student.name ?? ''} onChange={handleChange} />
              ) : (
                <span className="info-value">{student.name || 'N/A'}</span>
              )}
            </div>

            {/* Mã học sinh */}
            <div className="info-item">
              <span className="info-label">Mã học sinh</span>
              <span className="info-value">{student.student_id || 'N/A'}</span>
            </div>

            {/* Giới tính */}
            <div className="info-item">
              <span className="info-label">Giới tính</span>
              {editing ? (
                <select name="gender" className="info-input"
                  value={student.gender ?? ''} onChange={handleChange}>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                </select>
              ) : (
                <span className="info-value">{student.gender || 'N/A'}</span>
              )}
            </div>

            {/* Trường */}
            <div className="info-item">
              <span className="info-label">Trường</span>
              {editing ? (
                <input name="school_name" className="info-input"
                  value={student.school_name ?? ''} onChange={handleChange} />
              ) : (
                <span className="info-value">{student.school_name || 'N/A'}</span>
              )}
            </div>

            {/* Lớp */}
            <div className="info-item">
              <span className="info-label">Lớp</span>
              {editing ? (
                <input name="class_name" className="info-input"
                  value={student.class_name ?? ''} onChange={handleChange} />
              ) : (
                <span className="info-value">{student.class_name || 'N/A'}</span>
              )}
            </div>

          </div>
        </section>



        {/* PHỤ HUYNH */}
        <section className="info-card">
          <h2 className="card-title">Thông tin phụ huynh</h2>
          <div className="info-grid">

            <div className="info-item">
              <span className="info-label">Tên phụ huynh</span>
              {editing ? (
                <input name="parent_name" className="info-input"
                  value={student.parent_name ?? ''} onChange={handleChange} />
              ) : (
                <span className="info-value">{student.parent_name || 'N/A'}</span>
              )}
            </div>

            <div className="info-item">
              <span className="info-label">Số điện thoại</span>
              {editing ? (
                <input name="parent_phone" className="info-input"
                  value={student.parent_phone ?? ''} onChange={handleChange} />
              ) : (
                <span className="info-value">{student.parent_phone || 'N/A'}</span>
              )}
            </div>

            <div className="info-item">
              <span className="info-label">Email</span>
              {editing ? (
                <input name="parent_email" className="info-input"
                  value={student.parent_email ?? ''} onChange={handleChange} />
              ) : (
                <span className="info-value">{student.parent_email || 'N/A'}</span>
              )}
            </div>

          </div>
        </section>


        {/* THÔNG TIN ĐIỂM ĐÓN TRẢ */}
        <section className="info-card">
          <h2 className="card-title">Điểm đón và trả</h2>
          <div className="info-grid">

            <div className="info-item">
              <span className="info-label">Điểm đón</span>
              <span className="info-value">{student.pickup_stop_name || 'N/A'}</span>
            </div>

            <div className="info-item">
              <span className="info-label">Địa chỉ đón</span>
              <span className="info-value">{student.pickup_address || 'N/A'}</span>
            </div>

            <div className="info-item">
              <span className="info-label">Điểm trả</span>
              <span className="info-value">{student.dropoff_stop_name || 'N/A'}</span>
            </div>

            <div className="info-item">
              <span className="info-label">Địa chỉ trả</span>
              <span className="info-value">{student.dropoff_address || 'N/A'}</span>
            </div>

          </div>
        </section>


        {/* LỊCH SỬ ĐÓN TRẢ */}
        <section className="info-card">
          <h2 className="card-title">Lịch sử đón trả</h2>

          {student.pickup_history?.length > 0 ? (
            student.pickup_history.map((h, i) => (
              <div key={i} className="history-item">
                <p><b>Tài xế:</b> {h.driver_name}</p>
                <p><b>SĐT:</b> {h.driver_phone}</p>
                <p><b>Biển số:</b> {h.license_plate}</p>
                <p><b>Điểm đón:</b> {h.stop_name}</p>
                <p><b>Thời gian đón:</b> {formatDate(h.pickup_time)}</p>
                <p><b>Thời gian trả:</b> {formatDate(h.dropoff_time)}</p>
                <hr />
              </div>
            ))
          ) : (
            <p>Không có dữ liệu lịch sử</p>
          )}
        </section>

      </div>


      {/* BUTTONS */}
      <div className="btn-group">
        <button className="btn btn-secondary" onClick={backToList}>Quay lại</button>

        {!editing ? (
          <button className="btn btn-primary" onClick={() => setEditing(true)}>Chỉnh sửa</button>
        ) : (
          <>
            <button className="btn btn-primary" onClick={handleSave}>Lưu</button>
            <button className="btn btn-secondary"
              onClick={() => { setStudent(tempStudent); setEditing(false); }}>
              Hủy
            </button>
          </>
        )}
      </div>

    </div>
  );
}

export default Detail_Student;
