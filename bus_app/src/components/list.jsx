import React, { useState } from "react";
import "../Assets/CSS/list.css";
import Header from "./Header";

// Asset images from Figma
const imgEllipse5 = "https://www.figma.com/api/mcp/asset/fbf4ea10-e179-43a1-a63e-c20f8b31e7a5";
const imgMaterialSymbolsMale = "https://www.figma.com/api/mcp/asset/e3dc3096-b81b-4c4b-9242-1f18b3c32f82";
const imgEllipse6 = "https://www.figma.com/api/mcp/asset/b12c9f2b-8091-4cdc-b9e3-c3c43c25c075";
const imgMaterialSymbolsFemale = "https://www.figma.com/api/mcp/asset/12248b6c-d566-4164-8ef0-757fbdf56ac5";
const imgRectangle56 = "https://www.figma.com/api/mcp/asset/da700ce8-de24-462c-973f-469c7fc31024";
const imgPhBusLight = "https://www.figma.com/api/mcp/asset/0bf13c5c-b7e6-4487-a64f-a4db5ec299b7";
const imgGroup23 = "https://www.figma.com/api/mcp/asset/685ac4c1-ac7a-4eed-8f26-278c8a3548bd";
const imgEllipse1 = "https://www.figma.com/api/mcp/asset/d5b9682c-87c6-47c0-95d1-85edd88ec7aa";
const imgVector = "https://www.figma.com/api/mcp/asset/039918d8-2a2a-4c92-9162-b5c2172b4b40";
const imgVector1 = "https://www.figma.com/api/mcp/asset/d35bc3a2-045b-4f40-80f0-14a7df2a2fb5";

export default function List({ onNavigateToMainPage, onNavigate }) {
  const [selectedStudent, setSelectedStudent] = useState("Nguyễn Văn A");
  const [selectedGender, setSelectedGender] = useState("male");

  const handleNavigate = (page) => {
    if (page === "mainpage" && onNavigateToMainPage) {
      onNavigateToMainPage();
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
            <div className="list-form-group">
              <label className="list-label">Tên</label>
              <div className="list-input">Nguyễn Văn A</div>
            </div>

            <div className="list-form-row">
              <div className="list-form-group">
                <label className="list-label">Lớp</label>
                <div className="list-input list-input-small">10A1</div>
              </div>
              <div className="list-form-group">
                <label className="list-label">Trường</label>
                <div className="list-input list-input-medium">Trường THPT ABC</div>
              </div>
            </div>

            <div className="list-form-row">
              <div className="list-form-group">
                <label className="list-label">Tuổi</label>
                <div className="list-input list-input-small">12</div>
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
