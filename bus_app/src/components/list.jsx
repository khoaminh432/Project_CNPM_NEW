import React, { useState, useEffect } from "react";
import "../Assets/CSS/list.css";
import Header from "./Header";

// Import local images
import imgMaterialSymbolsMale from "../Assets/images/imgMaterialSymbolsMale.svg";
import imgMaterialSymbolsFemale from "../Assets/images/imgMaterialSymbolsFemale.svg";
import imgPhBusLight from "../Assets/images/imgPhBusLight.svg";
import imgEllipse1 from "../Assets/images/imgEllipse1.svg";
import imgVector from "../Assets/images/imgVector.svg";
import imgVector1 from "../Assets/images/imgVector1.svg";

export default function List({ onNavigateToMainPage, onNavigateToMap, onNavigate, fromDriverMap, routeId = 'TD1', scheduleId }) {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedGender, setSelectedGender] = useState("male");
  const [routeInfo, setRouteInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [popup, setPopup] = useState({ show: false, type: 'success', title: '', message: '' });

  // Show popup notification
  const showPopup = (type, title, message) => {
    setPopup({ show: true, type, title, message });
    setTimeout(() => {
      setPopup({ show: false, type: 'success', title: '', message: '' });
    }, 3000);
  };

  useEffect(() => {
    if (scheduleId) {
      fetchStudents();
    } else {
      setLoading(false);
    }
  }, [scheduleId]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      
      if (!scheduleId) {
        setError('Vui lòng chọn chuyến đi từ trang lịch trình');
        setLoading(false);
        return;
      }

      // Fetch students for this schedule
      const response = await fetch(`http://localhost:5000/api/students/schedule/${scheduleId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.status === 'OK' && data.data.length > 0) {
        // Normalize status: if null or undefined, set to 'CHO_DON'
        const normalizedData = data.data.map(student => ({
          ...student,
          pickup_status: student.pickup_status || 'CHO_DON'
        }));
        
        setStudents(normalizedData);
        setSelectedStudent(normalizedData[0]);
        
        // Set route info from first student's stops
        if (normalizedData[0]) {
          setRouteInfo({
            route_code: routeId,
            route_name: `Tuyến ${routeId}`,
            start_location: normalizedData[0].pickup_stop || 'Chưa xác định',
            end_location: normalizedData[0].dropoff_stop || 'Chưa xác định',
            planned_start: '06:00',
            planned_end: '07:30'
          });
        }
      } else {
        setStudents([]);
        setError('Không có học sinh nào cần đón');
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      setError('Không thể kết nối tới server');
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return 'N/A';
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const handleNavigate = (page) => {
    if (page === "mainpage" && onNavigateToMainPage) {
      onNavigateToMainPage();
    } else if (page === "drivermap" && onNavigateToMap) {
      onNavigateToMap();
    } else if (onNavigate) {
      onNavigate(page);
    }
  };

  const handleStatusUpdate = async (pickupId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/students/pickup/${pickupId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: newStatus,
          pickup_time: newStatus === 'DA_DON' ? new Date().toISOString() : null,
          dropoff_time: newStatus === 'DA_THA' ? new Date().toISOString() : null,
          schedule_id: scheduleId
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      const data = await response.json();

      // Update local state
      setStudents(prev => prev.map(s => 
        s.pickup_id === pickupId ? { ...s, pickup_status: newStatus } : s
      ));

      // Update selected student if it's the one being updated
      if (selectedStudent?.pickup_id === pickupId) {
        setSelectedStudent(prev => ({ ...prev, pickup_status: newStatus }));
      }

      console.log('Status updated successfully');
      
      // Check if schedule was auto-completed or cancelled
      if (data.scheduleCompleted) {
        if (data.scheduleCancelled) {
          showPopup('info', 'Chuyến đi hủy', 'Tất cả học sinh đã hủy chuyến. Chuyến đi đã được đánh dấu hủy!');
        } else {
          showPopup('success', 'Chuyến đi hoàn thành', 'Tất cả học sinh đã được thả hoặc hủy. Chuyến đi đã được đánh dấu hoàn thành!');
        }
      }
    } catch (error) {
      console.error('Error updating status:', error);
      showPopup('error', 'Lỗi cập nhật', 'Không thể cập nhật trạng thái');
    }
  };

  const handleStudentPickup = (studentId) => {
    console.log('Student picked up:', studentId);
    setStudents(prev => prev.filter(s => s.student_id !== studentId));
    // Update selected student if the picked up student was selected
    if (selectedStudent?.student_id === studentId) {
      const remainingStudents = students.filter(s => s.student_id !== studentId);
      setSelectedStudent(remainingStudents.length > 0 ? remainingStudents[0] : null);
    }
  };

  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
    // Update route info to show selected student's pickup/dropoff stops
    setRouteInfo({
      route_code: routeId,
      route_name: `Tuyến ${routeId}`,
      start_location: student.pickup_stop || 'Chưa xác định',
      end_location: student.dropoff_stop || 'Chưa xác định',
      planned_start: '06:00',
      planned_end: '07:30'
    });
  };

  return (
    <div className="list-root">
      {/* Header */}
      <Header 
        currentPage="list" 
        onNavigate={handleNavigate}
        imgEllipse1={imgEllipse1}
        imgVector={imgVector}
        imgVector1={imgVector1}
      />

      {/* Main Content */}
      <div className="list-container">
        {/* Back to DriverMap Button - Only show if navigating from DriverMap */}
        {fromDriverMap && (
          <button className="list-back-btn" onClick={() => handleNavigate('drivermap')}>
            ← Quay lại
          </button>
        )}

        {/* Title */}
        <h1 className="list-title">Thông tin học sinh cần đón</h1>

        {/* Left Panel - Student Details */}
        <div className="list-left-panel">
          
          {/* Pickup/Destination Section */}
          <h2 className="list-section-title">Điểm đón và điểm đến</h2>
          <div className="list-location-card">
            {loading ? (
              <div className="list-loading">Đang tải thông tin tuyến...</div>
            ) : routeInfo ? (
              <>
                <div className="list-location-item">
                  <img src={imgPhBusLight} alt="bus" className="list-bus-icon" />
                  <span className="list-location-text">{routeInfo.start_location}</span>
                </div>
                <div className="list-location-item">
                  <img src={imgPhBusLight} alt="bus" className="list-bus-icon" />
                  <span className="list-location-text">{routeInfo.end_location}</span>
                </div>
                {/* route info removed per request */}
              </>
            ) : (
              <div className="list-error">Không có thông tin tuyến</div>
            )}
          </div>

          {/* Student Info Section */}
          <h2 className="list-section-title">Thông tin học sinh</h2>
          
          {loading ? (
            <div className="list-loading">Đang tải thông tin học sinh...</div>
          ) : !scheduleId ? (
            <div className="list-error" style={{ 
              textAlign: 'center', 
              padding: '60px 20px', 
              fontSize: '18px',
              color: '#6c757d',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '20px'
            }}>
              <div style={{ fontSize: '64px' }}>📅</div>
              <div>Vui lòng chọn chuyến đi từ trang lịch trình để hiển thị danh sách học sinh</div>
              <button 
                onClick={() => handleNavigate('schedule')}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  marginTop: '10px'
                }}
              >
                Đi đến trang lịch trình
              </button>
            </div>
          ) : error ? (
            <div className="list-error">{error}</div>
          ) : selectedStudent ? (
            <div className="list-info-form">
              <div className="list-form-row">
                <div className="list-form-group">
                  <label className="list-label">Tên</label>
                  <div className="list-input list-input-medium">{selectedStudent.full_name}</div>
                </div>
                <div className="list-form-group">
                  <label className="list-label">Giới tính</label>
                  <div className="list-gender-selector">
                    <button 
                      className={`list-gender-btn ${selectedStudent.gender === 'Nam' || selectedStudent.gender === 'male' ? 'active' : ''}`}
                      disabled
                    >
                      <img src={imgMaterialSymbolsMale} alt="male" className="list-gender-icon" />
                    </button>
                    <button 
                      className={`list-gender-btn ${selectedStudent.gender === 'Nữ' || selectedStudent.gender === 'female' ? 'active' : ''}`}
                      disabled
                    >
                      <img src={imgMaterialSymbolsFemale} alt="female" className="list-gender-icon" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="list-form-row">
                <div className="list-form-group">
                  <label className="list-label">Trường</label>
                  <div className="list-input list-input-medium">{selectedStudent.school_name || 'Chưa xác định'}</div>
                </div>
                <div className="list-form-group">
                  <label className="list-label">Lớp</label>
                  <div className="list-input list-input-small">{selectedStudent.class_name}</div>
                </div>
              </div>

              <div className="list-form-row">
                <div className="list-form-group">
                  <label className="list-label">Phụ huynh</label>
                  <div className="list-input list-input-medium">{selectedStudent.parent_name || selectedStudent.parent_phone || 'Chưa xác định'}</div>
                </div>
                <div className="list-form-group">
                  <label className="list-label">Số điện thoại PH</label>
                  <div className="list-input list-input-medium">{selectedStudent.parent_phone}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="list-no-student">Chưa có học sinh nào được chọn</div>
          )}
        </div>

        {/* Right Panel - Student List */}
        <div className="list-right-panel">
          <h2 className="list-panel-title">Học sinh cần đón ({students.length})</h2>
          <div className="list-students-container">
            <div className="list-students-scroll">
              {loading ? (
                <div className="list-loading">Đang tải danh sách học sinh...</div>
              ) : students.length === 0 ? (
                <div className="list-no-students">{error || 'Không có học sinh nào cần đón'}</div>
              ) : (
                students.map((student) => (
                  <div 
                    key={student.student_id}
                    className={`list-student-card ${selectedStudent?.student_id === student.student_id ? 'selected' : ''}`}
                    onClick={() => handleStudentSelect(student)}
                  >
                    <div className="list-student-info">
                      <p className="list-student-name">{student.full_name}</p>
                      <p className="list-student-detail">Lớp {student.class_name}</p>
                      <p className="list-student-detail">{student.pickup_stop || 'Điểm đón chưa xác định'}</p>
                      <p className="list-student-detail">
                        Trạng thái: {student.pickup_status === 'CHO_DON' && 'Chờ đón'}
                        {student.pickup_status === 'DA_DON' && 'Đã đón'}
                        {student.pickup_status === 'DA_THA' && 'Đã thả'}
                        {student.pickup_status === 'HUY_CHUYEN' && 'Hủy chuyến'}
                        {!student.pickup_status && 'Chưa xác định'}
                      </p>
                    </div>
                    <div className="list-student-action">
                      {student.pickup_status === 'CHO_DON' && (
                        <button 
                          className="list-pickup-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusUpdate(student.pickup_id, 'DA_DON');
                          }}
                        >
                          Đã đón
                        </button>
                      )}
                      {student.pickup_status === 'DA_DON' && (
                        <button 
                          className="list-pickup-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusUpdate(student.pickup_id, 'DA_THA');
                          }}
                        >
                          Đã thả
                        </button>
                      )}
                      {(student.pickup_status === 'DA_THA' || student.pickup_status === 'HUY_CHUYEN') && (
                        <button 
                          className="list-pickup-btn"
                          style={{ opacity: 0.5, cursor: 'default' }}
                          disabled
                        >
                          {student.pickup_status === 'DA_THA' ? 'Đã hoàn thành' : 'Đã hủy'}
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          {selectedStudent && selectedStudent.pickup_status !== 'DA_THA' && selectedStudent.pickup_status !== 'HUY_CHUYEN' && (
            <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
              <button 
                className="list-picked-btn"
                style={{ flex: 1 }}
                onClick={() => {
                  const nextStatus = selectedStudent.pickup_status === 'CHO_DON' ? 'DA_DON' : 'DA_THA';
                  handleStatusUpdate(selectedStudent.pickup_id, nextStatus);
                }}
              >
                {selectedStudent.pickup_status === 'CHO_DON' ? 'Đánh dấu đã đón' : 'Đánh dấu đã thả'}: {selectedStudent.full_name}
              </button>
              <button 
                className="list-picked-btn"
                style={{ flex: 0.4, backgroundColor: '#ff6776ff', border: 'none' }}
                onClick={() => {
                  if (selectedStudent.pickup_status === 'DA_DON') {
                    showPopup('warning', 'Không thể hủy', 'Học sinh đã được đón, không thể hủy chuyến!');
                    return;
                  }
                  if (window.confirm(`Xác nhận hủy chuyến cho học sinh ${selectedStudent.full_name}?`)) {
                    handleStatusUpdate(selectedStudent.pickup_id, 'HUY_CHUYEN');
                  }
                }}
              >
                Hủy chuyến
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Popup Notification */}
      {popup.show && (
        <div className="list-popup-overlay">
          <div className={`list-popup list-popup-${popup.type}`}>
            <h3>{popup.title}</h3>
            <p>{popup.message}</p>
          </div>
        </div>
      )}
    </div>
  );
}
