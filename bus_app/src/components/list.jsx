import React, { useState } from "react";
import "../Assets/CSS/list.css";
import Header from "./Header";

// Import local images
import imgMaterialSymbolsMale from "../Assets/images/imgMaterialSymbolsMale.svg";
import imgMaterialSymbolsFemale from "../Assets/images/imgMaterialSymbolsFemale.svg";
import imgPhBusLight from "../Assets/images/imgPhBusLight.svg";
import imgEllipse1 from "../Assets/images/imgEllipse1.svg";
import imgVector from "../Assets/images/imgVector.svg";
import imgVector1 from "../Assets/images/imgVector1.svg";

export default function List({ onNavigateToMainPage, onNavigateToMap, onNavigate, fromDriverMap }) {
  const [selectedStudent, setSelectedStudent] = useState("Nguyễn Văn A");
  const [selectedGender, setSelectedGender] = useState("male");

  const handleNavigate = (page) => {
    if (page === "mainpage" && onNavigateToMainPage) {
      onNavigateToMainPage();
    } else if (page === "drivermap" && onNavigateToMap) {
      onNavigateToMap();
    } else if (onNavigate) {
      onNavigate(page);
    }
  };

  const students = [
    { name: "Nguyễn Văn A", class: "10A1", school: "Trường THPT ABC", price: "32,000đ" },
    { name: "Nguyễn Văn B", class: "10A1", school: "Trường THPT ABC", price: "32,000đ" },
    { name: "Nguyễn Văn C", class: "10A1", school: "Trường THPT ABC", price: "32,000đ" },
    { name: "Nguyễn Văn D", class: "10A1", school: "Trường THPT ABC", price: "32,000đ" },
    { name: "Nguyễn Văn E", class: "10A1", school: "Trường THPT ABC", price: "32,000đ" },
  ];

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
            <div className="list-location-item">
              <img src={imgPhBusLight} alt="bus" className="list-bus-icon" />
              <span className="list-location-text">Tạ Uyên</span>
            </div>
            <div className="list-location-item">
              <img src={imgPhBusLight} alt="bus" className="list-bus-icon" />
              <span className="list-location-text">Trường THPT ABC</span>
            </div>
            <div className="list-total-price">
              <p className="list-price-label">Tổng tiền</p>
              <p className="list-price-amount">32,000đ</p>
            </div>
          </div>

          {/* Student Info Section */}
          <h2 className="list-section-title">Thông tin học sinh</h2>
          
          <div className="list-info-form">
            <div className="list-form-row">
            <div className="list-form-group">
              <label className="list-label">Tên</label>
              <div className="list-input list-input-medium">Nguyễn Văn A</div>
              
            </div>
            <div className="list-form-group">
                <label className="list-label">Giới tính</label>
                <div className="list-gender-selector">
                  <button 
                    className={`list-gender-btn ${selectedGender === 'male' ? 'active' : ''}`}
                    onClick={() => setSelectedGender('male')}
                  >
                    <img src={imgMaterialSymbolsMale} alt="male" className="list-gender-icon" />
                  </button>
                  <button 
                    className={`list-gender-btn ${selectedGender === 'female' ? 'active' : ''}`}
                    onClick={() => setSelectedGender('female')}
                  >
                    <img src={imgMaterialSymbolsFemale} alt="female" className="list-gender-icon" />
                  </button>
                </div>
              </div></div>

            <div className="list-form-row">
              <div className="list-form-group">
                <label className="list-label">Tuổi</label>
                <div className="list-input list-input-small">12</div>
              </div>
              <div className="list-form-group">
                <label className="list-label">Trường</label>
                <div className="list-input list-input-medium">Trường THPT ABC</div>
              </div>
            </div>

            <div className="list-form-row">
              
              <div className="list-form-group">
                <label className="list-label">Phụ huynh</label>
                <div className="list-input list-input-medium">Nguyễn Văn Ba</div>
              </div>
              <div className="list-form-group">
                <label className="list-label">Số điện thoại</label>
                <div className="list-input list-input-medium">0123456789</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Student List */}
        <div className="list-right-panel">
          <h2 className="list-panel-title">Học sinh cần đón</h2>
          <div className="list-students-container">
            <div className="list-students-scroll">
              {students.map((student, index) => (
                <div 
                  key={index}
                  className={`list-student-card ${selectedStudent === student.name ? 'selected' : ''}`}
                  onClick={() => setSelectedStudent(student.name)}
                >
                  <div className="list-student-info">
                    <p className="list-student-name">{student.name}</p>
                    <p className="list-student-detail">Lớp {student.class}</p>
                    <p className="list-student-detail">{student.school}</p>
                  </div>
                  <div className="list-student-price">
                    <p className="list-price-label">Tổng tiền</p>
                    <p className="list-price-value">{student.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button className="list-picked-btn">Đã đón</button>
        </div>
      </div>
    </div>
  );
}
