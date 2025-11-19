import React from "react";
import "../Assets/CSS/schedule.css";
import Header from "./Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import imgAvatar from "../Assets/images/imgAvatar.png";
import imgLaBus from "../Assets/images/imgLaBus.svg";
import imgEllipse1 from "../Assets/images/imgEllipse1.svg";
import imgVector from "../Assets/images/imgVector.svg";
import imgVector1 from "../Assets/images/imgVector1.svg";
import imgStar1 from "../Assets/images/imgStar1.svg";

export default function Schedule({ onNavigateToMainPage, onNavigate }) {
  const handleNavigate = (page) => {
    if (page === "mainpage" && onNavigateToMainPage) {
      onNavigateToMainPage();
    } else if (onNavigate) {
      onNavigate(page);
    }
  };

  return (
    <div className="sc-root">
      {/* Header */}
      <Header 
        currentPage="schedule" 
        onNavigate={handleNavigate}
        imgEllipse1={imgEllipse1}
        imgVector={imgVector}
        imgVector1={imgVector1}
      />

      {/* Main Container */}
      <div className="sc-container">
        {/* Left Sidebar */}
        <div className="sc-left-panel">
          {/* Driver Info Card */}
          <div className="sc-driver-card">
            <div className="sc-date-section">
              <FontAwesomeIcon icon={faCalendar} className="sc-calendar-icon" />
              <span className="sc-date-text">Thứ 2, 26/10/2025</span>
            </div>
            <div className="sc-driver-info">
              <div className="sc-driver-avatar">
                <img alt="driver avatar" src={imgAvatar} />
              </div>
              <div className="sc-driver-details">
                <div className="sc-driver-name-section">
                  <h3 className="sc-driver-name">Lê Văn A</h3>
                  <div className="sc-driver-rating">
                    <img src={imgStar1} alt="star" className="sc-star-icon" />
                    <span className="sc-rating-text">5.00</span>
                  </div>
                </div>
                <p className="sc-driver-id">BUSDR-023</p>
              </div>
            </div>
          </div>

          {/* Status Legend */}
          <div className="sc-status-legend">
            <h3 className="sc-legend-title">Trạng thái</h3>
            <div className="sc-legend-items">
              <div className="sc-legend-item">
                <div className="sc-legend-color sc-color-red"></div>
                <span className="sc-legend-text">Chưa bắt đầu</span>
              </div>
              <div className="sc-legend-item">
                <div className="sc-legend-color sc-color-green"></div>
                <span className="sc-legend-text">Đang thực hiện</span>
              </div>
              <div className="sc-legend-item">
                <div className="sc-legend-color sc-color-blue"></div>
                <span className="sc-legend-text">Hoàn thành</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Schedule Items */}
        <div className="sc-right-panel">
          {/* Schedule Item 1 - Not Started (Red) */}
          <div className="sc-schedule-item sc-item-not-started">
            <div className="sc-item-header">
              <div className="sc-item-driver-info">
                <div className="sc-item-avatar">
                  <img src={imgAvatar} alt="driver" />
                </div>
                <div className="sc-item-driver-details">
                  <p className="sc-item-driver-name">Lê Văn A</p>
                  <p className="sc-item-driver-route">Tuyến xe 07</p>
                </div>
              </div>
              <img src={imgLaBus} alt="bus" className="sc-bus-icon" />
            </div>
            <div className="sc-item-body">
              <div className="sc-item-time-section">
                <div className="sc-time-group">
                  <span className="sc-time-label">Thời gian bắt đầu:</span>
                  <span className="sc-time-value">06:00</span>
                </div>
                <div className="sc-time-group">
                  <span className="sc-time-label">Thời gian kết thúc:</span>
                  <span className="sc-time-value">08:00</span>
                </div>
                <div className="sc-time-group">
                  <span className="sc-time-label">Số lượng học sinh:</span>
                  <span className="sc-time-value">12</span>
                </div>
              </div>
              <div className="sc-item-location">
                <FontAwesomeIcon icon={faLocationDot} className="sc-location-icon" />
                <span className="sc-location-text">Bến xe Miền Đông - Trường THPT ABC</span>
              </div>
              <div className="sc-item-footer">
                <span className="sc-item-price">32,000đ</span>
              </div>
            </div>
          </div>

          {/* Schedule Item 2 - In Progress (Green) */}
          <div className="sc-schedule-item sc-item-in-progress">
            <div className="sc-item-header">
              <div className="sc-item-driver-info">
                <div className="sc-item-avatar">
                  <img src={imgAvatar} alt="driver" />
                </div>
                <div className="sc-item-driver-details">
                  <p className="sc-item-driver-name">Lê Văn A</p>
                  <p className="sc-item-driver-route">Tuyến xe 07</p>
                </div>
              </div>
              <img src={imgLaBus} alt="bus" className="sc-bus-icon" />
            </div>
            <div className="sc-item-body">
              <div className="sc-item-time-section">
                <div className="sc-time-group">
                  <span className="sc-time-label">Thời gian bắt đầu:</span>
                  <span className="sc-time-value">08:30</span>
                </div>
                <div className="sc-time-group">
                  <span className="sc-time-label">Thời gian kết thúc:</span>
                  <span className="sc-time-value">10:30</span>
                </div>
                <div className="sc-time-group">
                  <span className="sc-time-label">Số lượng học sinh:</span>
                  <span className="sc-time-value">12</span>
                </div>
              </div>
              <div className="sc-item-location">
                <FontAwesomeIcon icon={faLocationDot} className="sc-location-icon" />
                <span className="sc-location-text">Bến xe Miền Đông - Trường THPT ABC</span>
              </div>
              <div className="sc-item-footer">
                <span className="sc-item-price">32,000đ</span>
              </div>
            </div>
          </div>

          {/* Schedule Item 3 - Completed (Blue) */}
          <div className="sc-schedule-item sc-item-completed">
            <div className="sc-item-header">
              <div className="sc-item-driver-info">
                <div className="sc-item-avatar">
                  <img src={imgAvatar} alt="driver" />
                </div>
                <div className="sc-item-driver-details">
                  <p className="sc-item-driver-name">Lê Văn A</p>
                  <p className="sc-item-driver-route">Tuyến xe 07</p>
                </div>
              </div>
              <img src={imgLaBus} alt="bus" className="sc-bus-icon" />
            </div>
            <div className="sc-item-body">
              <div className="sc-item-time-section">
                <div className="sc-time-group">
                  <span className="sc-time-label">Thời gian bắt đầu:</span>
                  <span className="sc-time-value">11:00</span>
                </div>
                <div className="sc-time-group">
                  <span className="sc-time-label">Thời gian kết thúc:</span>
                  <span className="sc-time-value">13:00</span>
                </div>
                <div className="sc-time-group">
                  <span className="sc-time-label">Số lượng học sinh:</span>
                  <span className="sc-time-value">12</span>
                </div>
              </div>
              <div className="sc-item-location">
                <FontAwesomeIcon icon={faLocationDot} className="sc-location-icon" />
                <span className="sc-location-text">Bến xe Miền Đông - Trường THPT ABC</span>
              </div>
              <div className="sc-item-footer">
                <span className="sc-item-price">32,000đ</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
