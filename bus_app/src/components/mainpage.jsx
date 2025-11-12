import React, { useEffect, useRef } from "react";
import "../Assets/CSS/mainpage.css";

// Asset images from Figma
const imgAvatar = "https://www.figma.com/api/mcp/asset/0d9e691f-52c3-43ac-8e53-4843e4c7b55c";
const imgImage4 = "https://www.figma.com/api/mcp/asset/025fc4e4-cf71-41a7-9e04-8a7dad102442";
const imgRectangle22 = "https://www.figma.com/api/mcp/asset/b2de9023-09b8-4aa8-9fc9-6289f5b949e5";
const imgEllipse1 = "https://www.figma.com/api/mcp/asset/d5b9682c-87c6-47c0-95d1-85edd88ec7aa";
const imgVector = "https://www.figma.com/api/mcp/asset/039918d8-2a2a-4c92-9162-b5c2172b4b40";
const imgVector1 = "https://www.figma.com/api/mcp/asset/d35bc3a2-045b-4f40-80f0-14a7df2a2fb5";
const imgRectangle6 = "https://www.figma.com/api/mcp/asset/3a22db45-033d-4996-b104-154091547a07";
const imgStar1 = "https://www.figma.com/api/mcp/asset/6e6891ea-b6dc-4afd-aeaf-b761178bb5ba";
const imgLine25 = "https://www.figma.com/api/mcp/asset/b0c91f6b-eb3d-49b7-9745-25793414f86f";

// Goong map keys
const GOONG_MAPTILES_KEY = "qZzxSh57ziQQsNzf8mUcjWzglhqIjC7pnH4xRCwr";

export default function MainPage({ onNavigateToMap }) {
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
      <header className="mp-header">
        <div className="mp-header-logo">SSB</div>
        <div className="mp-header-nav-icon">
          <img alt="home" src={imgRectangle22} />
        </div>
        <nav className="mp-header-nav">
          <a href="#home" className="mp-nav-item">Trang chủ</a>
          <a href="#schedule" className="mp-nav-item">Lịch làm</a>
          <a href="#list" className="mp-nav-item">Danh sách</a>
          <a href="#notification" className="mp-nav-item">Thông báo</a>
        </nav>
        <div className="mp-header-profile">
          <div className="mp-profile-avatar-wrapper">
            <img alt="avatar" src={imgEllipse1} className="mp-profile-avatar" />
            <img alt="vector" src={imgVector} className="mp-profile-icon" />
          </div>
          <span className="mp-profile-text">Profile</span>
          <img alt="dropdown" src={imgVector1} className="mp-profile-dropdown" />
        </div>
      </header>

      {/* Main Content */}
      <div className="mp-container">
        {/* Left Section */}
        <div className="mp-left-panel">
          {/* Driver Profile Card */}
          <div className="mp-profile-card">
            <div className="mp-card-banner">
              <img alt="banner" src={imgRectangle6} />
              <div className="mp-card-avatar">
                <img alt="driver avatar" src={imgAvatar} />
              </div>
              <div className="mp-card-info">
                <div className="mp-card-name-section">
                  <h2 className="mp-driver-name">Lê Văn A</h2>
                  <img alt="star" src={imgStar1} className="mp-star-icon" />
                  <span className="mp-rating">5.00</span>
                </div>
                <p className="mp-join-date">Gia nhập tháng 8 2025 | BUSDR-023</p>
                <div className="mp-card-divider">
                  <img alt="divider" src={imgLine25} />
                </div>
                <p className="mp-card-meta">VN | Mbbank</p>
                <p className="mp-card-account">**********9667</p>
              </div>
            </div>

            {/* Stats */}
            <div className="mp-card-stats">
              <div className="mp-stat">
                <div className="mp-stat-value">100%</div>
                <div className="mp-stat-label">Chuyến hoàn thành</div>
              </div>
              <div className="mp-stat">
                <div className="mp-stat-value">87.2%</div>
                <div className="mp-stat-label">Tỉ lệ đúng giờ</div>
              </div>
              <div className="mp-card-card-image">
                <img alt="payment" src={imgImage4} />
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
