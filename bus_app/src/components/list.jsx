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

export default function List({ onNavigateToMainPage, onNavigateToMap, onNavigate, fromDriverMap, routeId = 1 }) {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedGender, setSelectedGender] = useState("male");
  const [routeInfo, setRouteInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStudents();
    fetchRouteInfo();
  }, [routeId]);

  const fetchStudents = async () => {
    try {
      console.log('Fetching students for route:', routeId);
      const response = await fetch(`http://localhost:5000/api/students/route/${routeId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Students response:', data);
      
      if (data.status === 'OK') {
        setStudents(data.data);
        if (data.data.length > 0) {
          setSelectedStudent(data.data[0]);
        }
      } else {
        console.error('API returned error:', data.message);
        setError('Failed to load students');
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const fetchRouteInfo = async () => {
    try {
      console.log('Fetching route info for:', routeId);
      const response = await fetch(`http://localhost:5000/api/routes/${routeId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Route response:', data);
      
      if (data.status === 'OK') {
        setRouteInfo(data.data);
      }
    } catch (error) {
      console.error('Error fetching route info:', error);
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

  const handleStudentPickup = (studentId) => {
    // TODO: Update student pickup status in backend
    console.log('Student picked up:', studentId);
    setStudents(prev => prev.filter(s => s.student_id !== studentId));
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
            {routeInfo ? (
              <>
                <div className="list-location-item">
                  <img src={imgPhBusLight} alt="bus" className="list-bus-icon" />
                  <span className="list-location-text">{routeInfo.start_location}</span>
                </div>
                <div className="list-location-item">
                  <img src={imgPhBusLight} alt="bus" className="list-bus-icon" />
                  <span className="list-location-text">{routeInfo.end_location}</span>
                </div>
                <div className="list-route-info">
                  <p className="list-route-label">Tuyến: {routeInfo.route_code}</p>
                  <p className="list-route-name">{routeInfo.route_name}</p>
                  <p className="list-route-time">{routeInfo.planned_start} - {routeInfo.planned_end}</p>
                </div>
              </>
            ) : (
              <div className="list-loading-route">Đang tải thông tin tuyến...</div>
            )}
          </div>

          {/* Student Info Section */}
          <h2 className="list-section-title">Thông tin học sinh</h2>
          
          {loading ? (
            <div className="list-loading">Đang tải thông tin học sinh...</div>
          ) : error ? (
            <div className="list-error">Lỗi: {error}</div>
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
                      className={`list-gender-btn ${selectedStudent.gender === 'male' ? 'active' : ''}`}
                      disabled
                    >
                      <img src={imgMaterialSymbolsMale} alt="male" className="list-gender-icon" />
                    </button>
                    <button 
                      className={`list-gender-btn ${selectedStudent.gender === 'female' ? 'active' : ''}`}
                      disabled
                    >
                      <img src={imgMaterialSymbolsFemale} alt="female" className="list-gender-icon" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="list-form-row">
                <div className="list-form-group">
                  <label className="list-label">Tuổi</label>
                  <div className="list-input list-input-small">{calculateAge(selectedStudent.date_of_birth)}</div>
                </div>
                <div className="list-form-group">
                  <label className="list-label">Lớp</label>
                  <div className="list-input list-input-medium">{selectedStudent.class_name}</div>
                </div>
              </div>

              <div className="list-form-row">
                <div className="list-form-group">
                  <label className="list-label">Điểm đón</label>
                  <div className="list-input list-input-medium">{selectedStudent.pickup_stop || 'Chưa xác định'}</div>
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
              ) : error ? (
                <div className="list-error">Lỗi: {error}</div>
              ) : students.length === 0 ? (
                <div className="list-no-students">Không có học sinh nào cần đón</div>
              ) : (
                students.map((student) => (
                  <div 
                    key={student.student_id}
                    className={`list-student-card ${selectedStudent?.student_id === student.student_id ? 'selected' : ''}`}
                    onClick={() => setSelectedStudent(student)}
                  >
                    <div className="list-student-info">
                      <p className="list-student-name">{student.full_name}</p>
                      <p className="list-student-detail">Lớp {student.class_name}</p>
                      <p className="list-student-detail">{student.pickup_stop || 'Điểm đón chưa xác định'}</p>
                      <p className="list-student-detail">Thứ tự: {student.pickup_order || 'N/A'}</p>
                    </div>
                    <div className="list-student-action">
                      <button 
                        className="list-pickup-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStudentPickup(student.student_id);
                        }}
                      >
                        Đã đón
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          {selectedStudent && (
            <button 
              className="list-picked-btn"
              onClick={() => handleStudentPickup(selectedStudent.student_id)}
            >
              Đánh dấu đã đón: {selectedStudent.full_name}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
