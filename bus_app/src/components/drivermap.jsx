import React, { useEffect, useRef, useState } from "react";
import "../Assets/CSS/index.css";
import "../Assets/CSS/drivermap.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPowerOff } from "@fortawesome/free-solid-svg-icons";

// Import local images
import imgAvatar from "../Assets/images/imgAvatar.png";
import imgEllipse1 from "../Assets/images/imgEllipse1.svg";
import imgEllipse2 from "../Assets/images/dv_ec.svg";
import imgVector from "../Assets/images/dv_nav.svg";
import imgStar1 from "../Assets/images/imgStar1.svg";
import imgVector3 from "../Assets/images/imgVector1.svg";
import imgGroup104 from "../Assets/images/imgGroup104.svg";

const GOONG_MAPTILES_KEY = "qZzxSh57ziQQsNzf8mUcjWzglhqIjC7pnH4xRCwr"; // hiển thị bản đồ
const GOONG_API_KEY = "OMgqgM7ZbDGb4OPuPY5sbhjTUyPmq9Ime7kpjtMi"; // dùng cho dịch vụ khác (geocode, direction...)

export default function DriverMap({ onBackToMain }) {
  const [connected, setConnected] = useState(false);
  const [status, setStatus] = useState("Bạn đang offline.");
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);
  const markerRef = useRef(null);
  const watchId = useRef(null);

  // --- Khởi tạo bản đồ ---
  useEffect(() => {
    if (window.goongjs && !mapInstance.current) {
      // Key dùng để hiển thị map
      window.goongjs.accessToken = GOONG_MAPTILES_KEY;

      mapInstance.current = new window.goongjs.Map({
        container: mapContainer.current,
        style: "https://tiles.goong.io/assets/goong_map_web.json",
        center: [106.660172, 10.762622], // vị trí mặc định TPHCM
        zoom: 13,
      });

      mapInstance.current.addControl(new window.goongjs.NavigationControl());
    }
  }, []);

  // --- Khi nhấn Bật / Ngắt kết nối ---
  const handleConnectClick = async () => {
    if (!connected) {
      setStatus("Đang định vị...");
      if ("geolocation" in navigator) {
        watchId.current = navigator.geolocation.watchPosition(
          async (pos) => {
            const { latitude, longitude } = pos.coords;
            const coords = [longitude, latitude];

            // Nếu chưa có marker thì tạo mới
            if (!markerRef.current) {
              markerRef.current = new window.goongjs.Marker({
                color: "#0073FB", // màu xanh cho tài xế
              })
                .setLngLat(coords)
                .addTo(mapInstance.current);
            } else {
              markerRef.current.setLngLat(coords);
            }

            // Zoom và căn giữa bản đồ
            mapInstance.current.flyTo({ center: coords, zoom: 15 });

            // --- Ví dụ: gọi Goong API (Geocoding) ---
            try {
              const res = await fetch(
                `https://rsapi.goong.io/geocode?latlng=${latitude},${longitude}&api_key=${GOONG_API_KEY}`
              );
              const data = await res.json();
              if (data.results && data.results.length > 0) {
                console.log("📍 Địa chỉ hiện tại:", data.results[0].formatted_address);
              }
            } catch (err) {
              console.error("Lỗi Goong API:", err);
            }

            setStatus("Bạn đang online.");
          },
          (err) => {
            console.error("Lỗi GPS:", err);
            setStatus("Không thể truy cập GPS.");
          },
          { enableHighAccuracy: true }
        );
      } else {
        setStatus("Trình duyệt không hỗ trợ GPS.");
      }
    } else {
      // Khi ngắt kết nối
      setStatus("Bạn đang offline.");
      if (watchId.current) {
        navigator.geolocation.clearWatch(watchId.current);
        watchId.current = null;
      }
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
    }
    setConnected((prev) => !prev);
  };

  return (
    <div className="driver-map-root">
      {/* Header */}
      <header className="dm-header">
        <button
          className="dm-back-btn"
          aria-label="Quay lại"
          onClick={() => onBackToMain && onBackToMain()}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 6L9 12L15 18"
              stroke="#111827"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </header>

      {/* Map */}
      <main className="dm-map-container" role="region" aria-label="Bản đồ">
        <div ref={mapContainer} className="dm-map-wrapper"></div>

        {/* Center control: Connect button */}
        <div className={`dm-center-control ${connected ? 'connected-state' : ''}`}>
          <button
            className={`dm-connect-btn ${connected ? "connected" : ""}`}
            onClick={handleConnectClick}
            aria-pressed={connected}
          >
            <FontAwesomeIcon
              icon={faPowerOff}
              color="white"
              size="lg"
            />
          </button>
        </div>

        {/* Top left back button with icon */}
        <div className="dm-top-left-btn" onClick={() => onBackToMain && onBackToMain()}>
          <img src={imgGroup104} alt="menu" />
        </div>

        {/* Profile Section - Top Right (always visible) */}
        <div className="dm-profile-section">
          <div className="dm-profile-avatar">
            <img src={imgAvatar} alt="avatar" />
          </div>
          <div className="dm-profile-rating">
            <img src={imgStar1} alt="star" className="dm-star-icon" />
            <span className="dm-rating-text">5.00</span>
          </div>
        </div>

        {/* Control Panel - Shows when connected */}
        {connected && (
          <div className="dm-control-panel">
            {/* Top Bar */}
            <div className="dm-top-bar">
              <div className="dm-stop-counter">
                <div className="dm-stop-badge">
                  <img src={imgEllipse1} alt="badge" className="dm-badge-bg" />
                  <span className="dm-stop-number">12</span>
                </div>
                <p className="dm-stop-label">Trạm dừng</p>
              </div>

              <div className="dm-logo">SSB</div>

              <div className="dm-current-stop">
                <span className="dm-stop-index">1.</span>
                <span className="dm-stop-name">Tạ Uyên</span>
              </div>

              <div className="dm-navigation-btn">
                <div className="dm-nav-badge">
                  <img src={imgEllipse2} alt="badge" className="dm-badge-bg" />
                  <img src={imgVector} alt="nav" className="dm-nav-icon" />
                </div>
                <p className="dm-nav-label">Điều hướng</p>
              </div>
            </div>

            <div className="dm-divider"></div>

            {/* Info Cards */}
            <div className="dm-info-cards">
              <div className="dm-info-card">
                <p className="dm-card-label">Tuyến</p>
                <p className="dm-card-value">05</p>
              </div>

              <div className="dm-info-card">
                <p className="dm-card-label">Học sinh</p>
                <p className="dm-card-value">12</p>
              </div>

              <div className="dm-info-card dm-card-route">
                <p className="dm-route-text">Bến xe buýt Chợ Lớn</p>
                <p className="dm-route-divider">-</p>
                <p className="dm-route-text">Bến xe Biên Hòa</p>
              </div>

              <div className="dm-info-card">
                <p className="dm-card-time">04:50 - 17:45</p>
              </div>

              <div className="dm-info-card dm-card-price">
                <img src={imgVector3} alt="price" className="dm-price-icon" />
                <p className="dm-price-text">32,000 VND/người</p>
              </div>
            </div>

            <div className="dm-divider"></div>

            {/* Action Buttons */}
            <div className="dm-action-buttons">
              <button className="dm-action-btn dm-btn-primary">
                Bắt đầu
              </button>
              <button className="dm-action-btn">
                Báo cáo sự cố
              </button>
              <button className="dm-action-btn">
                Danh sách học sinh
              </button>
              <button className="dm-action-btn">
                Hỗ trợ khẩn cấp
              </button>
            </div>
          </div>
        )}

        {/* Bottom status bar */}
        {!connected && (
          <div className="dm-bottom-status">
            <div className="dm-status-text">
              <div className="dm-status-line1">{status}</div>
              <div className="dm-status-line2">SSB</div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
