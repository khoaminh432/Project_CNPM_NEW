import React, { useEffect, useRef } from "react";
import "../Assets/CSS/mainpage.css";
import Header from "./Header";

// Import local images
import imgAvatar from "../Assets/images/imgAvatar.png";
import imgImage4 from "../Assets/images/imgImage4.png";
import imgEllipse1 from "../Assets/images/imgEllipse1.svg";
import imgVector from "../Assets/images/imgVector.svg";
import imgVector1 from "../Assets/images/imgVector1.svg";
import imgStar1 from "../Assets/images/imgStar1.svg";

// Goong map keys
const GOONG_MAPTILES_KEY = "qZzxSh57ziQQsNzf8mUcjWzglhqIjC7pnH4xRCwr";

export default function MainPage({ onNavigateToMap, onNavigateToSchedule, onNavigate }) {
  const handleNavigate = (page) => {
    if (page === 'schedule' && onNavigateToSchedule) {
      onNavigateToSchedule();
    } else if (onNavigate) {
      onNavigate(page);
    }
  };
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);

  // Initialize Goong map
  useEffect(() => {
    if (window.goongjs && !mapInstance.current && mapContainer.current) {
      window.goongjs.accessToken = GOONG_MAPTILES_KEY;

      mapInstance.current = new window.goongjs.Map({
        container: mapContainer.current,
        style: "https://tiles.goong.io/assets/goong_map_web.json",
        center: [106.660172, 10.762622], // TPHCM default
        zoom: 13,
      });

      mapInstance.current.addControl(new window.goongjs.NavigationControl());
    }
  }, []);
  
  return (
    <div className="mp-root">
      {/* Header */}
      <Header 
        currentPage="mainpage" 
        onNavigate={handleNavigate}
        imgEllipse1={imgEllipse1}
        imgVector={imgVector}
        imgVector1={imgVector1}
      />

      {/* Main Content */}
      <div className="mp-container">
        {/* Left Section */}
        <div className="mp-left-panel">
          {/* Driver Profile Card */}
          <div className="mp-profile-card">
          
            
            {/* Card Content - Avatar, Info, and Bank Details */}
            <div className="mp-card-content-wrapper">
              {/* Left Section - Avatar */}
              <div className="mp-card-avatar">
                <img alt="driver avatar" src={imgAvatar} />
              </div>
              
              {/* Center Section - Driver Info */}
              <div className="mp-card-info">
                <div className="mp-card-name-section">
                  <h2 className="mp-driver-name">Lê Văn A</h2>
                  <img alt="star" src={imgStar1} className="mp-star-icon" />
                  <span className="mp-rating">5.00</span>
                </div>
                <p className="mp-join-date">Gia nhập tháng 8 2025 | BUSDR-023</p>
              </div>

              {/* Divider Line */}
              <div className="mp-card-divider"></div>

              {/* Right Section - Bank & Payment Info */}
              <div className="mp-card-bank-section">
                <p className="mp-card-meta">VN | Mbbank</p>
                <p className="mp-card-account">**********9667</p>
                <div className="mp-card-card-image">
                  <img alt="payment" src={imgImage4} />
                </div>
              </div>
            </div>

            {/* Bottom Section - Stats */}
            <div className="mp-card-stats">
              <div className="mp-stats-header">Hàng tháng</div>
              <div className="mp-stats-container">
                <div className="mp-stat">
                  <div className="mp-stat-value">100%</div>
                  <div className="mp-stat-label">Chuyến hoàn thành</div>
                </div>
                <div className="mp-stat">
                  <div className="mp-stat-value">87.2%</div>
                  <div className="mp-stat-label">Tỉ lệ đúng giờ</div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mp-activity-card">
            <h3 className="mp-activity-title">Hoạt động gần đây</h3>
            <div className="mp-activity-list">
              {[
                { time: "3 giờ trước", driver: "Tạ Uyên", location: "Trường THPT ABC" },
                { time: "3 giờ trước", driver: "Tạ Uyên", location: "Trường THPT ABC" },
                { time: "3 giờ trước", driver: "Tạ Uyên", location: "Trường THPT ABC" },
              ].map((item, idx) => (
                <div key={idx} className="mp-activity-item">
                  <span className="mp-activity-time">{item.time}</span>
                  <span className="mp-activity-driver">{item.driver}</span>
                  <span className="mp-activity-dots">...................</span>
                  <span className="mp-activity-location">{item.location}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Section - Map */}
        <div className="mp-right-panel">
          <div ref={mapContainer} className="mp-map-container"></div>
          <button className="mp-map-button" onClick={() => onNavigateToMap && onNavigateToMap()}>Mở bản đồ tài xế</button>
        </div>
      </div>
    </div>
  );
}
