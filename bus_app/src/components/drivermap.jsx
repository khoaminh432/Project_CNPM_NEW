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

export default function DriverMap({ onBackToMain, onNavigateToList }) {
  const [connected, setConnected] = useState(false);
  const [status, setStatus] = useState("Bạn đang offline.");
  const [showReportModal, setShowReportModal] = useState(false);
  const [showStopModal, setShowStopModal] = useState(false);
  const [showStudentListModal, setShowStudentListModal] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [reportFormData, setReportFormData] = useState({
    type: "",
    location: "Địa điểm hiện tại",
    notes: "",
  });
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

  // --- Handle Report Modal ---
  const handleReportClick = () => {
    setShowReportModal(true);
  };

  const handleCloseReportModal = () => {
    setShowReportModal(false);
    setReportFormData({
      type: "",
      location: "Địa điểm hiện tại",
      notes: "",
    });
  };

  const handleReportFormChange = (field, value) => {
    setReportFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmitReport = () => {
    console.log("Report submitted:", reportFormData);
    // TODO: Send report data to backend
    handleCloseReportModal();
  };

  // --- Handle Stop Counter Modal ---
  const handleStopCounterClick = () => {
    setShowStopModal(true);
  };

  const handleCloseStopModal = () => {
    setShowStopModal(false);
  };

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
              <div 
                className="dm-stop-counter" 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleStopCounterClick();
                }}
                style={{ cursor: 'pointer' }}
              >
                <div className="dm-stop-badge">
                  <img src={imgEllipse1} alt="badge" className="dm-badge-bg" />
                  <span className="dm-stop-number">12</span>
                </div>
                <p className="dm-stop-label">Trạm dừng</p>
              </div>

              <div className="dm-center-info">
                <div className="dm-current-stop">
                  <span className="dm-stop-index">1.</span>
                  <span className="dm-stop-name">Tạ Uyên</span>
                </div>
                <div className="dm-logo">SSB</div>
              </div>
            </div>

{/*
              <div className="dm-navigation-btn">
                <div className="dm-nav-badge">
                  <img src={imgEllipse2} alt="badge" className="dm-badge-bg" />
                  <img src={imgVector} alt="nav" className="dm-nav-icon" />
                </div>
                <p className="dm-nav-label">Điều hướng</p>
              </div>
            </div>
*/}
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
                <p className="dm-price-text">32,000 VND/người</p>
              </div>
            </div>
            <div className="dm-divider"></div>

            {/* Action Buttons */}
            <div className="dm-action-buttons">
              <button className="dm-action-btn dm-btn-primary">
                Bắt đầu
              </button>
              <button className="dm-action-btn" onClick={handleReportClick}>
                Báo cáo sự cố
              </button>
              <button className="dm-action-btn" onClick={() => setShowStudentListModal(true)}>
                Danh sách học sinh
              </button>
              <button className="dm-action-btn" onClick={() => setShowEmergencyModal(true)}>
                Hỗ trợ khán cấp
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

        {/* Report Issue Modal */}
        {showReportModal && (
          <div className="dm-modal-overlay" onClick={handleCloseReportModal}>
            <div className="dm-modal-content" onClick={(e) => e.stopPropagation()}>
              {/* Modal Header */}
              <div className="dm-modal-header">
                <svg
                  className="dm-modal-warning-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
                    fill="currentColor"
                  />
                </svg>
                <h2 className="dm-modal-title">Báo cáo sự cố</h2>
              </div>

              {/* Modal Body */}
              <div className="dm-modal-body">
                {/* Issue Type */}
                <div className="dm-form-group">
                  <label className="dm-form-label">Loại sự cố</label>
                  <div className="dm-form-input-wrapper">
                    <select
                      className="dm-form-input dm-form-select"
                      value={reportFormData.type}
                      onChange={(e) => handleReportFormChange("type", e.target.value)}
                    >
                      <option value="">Chọn loại sự cố</option>
                      <option value="accident">Tai nạn giao thông</option>
                      <option value="mechanical">Sự cố cơ khí</option>
                      <option value="traffic">Tắc đường</option>
                      <option value="passenger">Vấn đề hành khách</option>
                      <option value="other">Khác</option>
                    </select>
                  </div>
                </div>

                {/* Location */}
                <div className="dm-form-group">
                  <label className="dm-form-label">Địa điểm</label>
                  <div className="dm-form-input-wrapper">
                    <input
                      type="text"
                      className="dm-form-input"
                      value={reportFormData.location}
                      onChange={(e) => handleReportFormChange("location", e.target.value)}
                      readOnly
                    />
                  </div>
                </div>

                {/* Notes */}
                <div className="dm-form-group">
                  <label className="dm-form-label">Ghi chú</label>
                  <textarea
                    className="dm-form-input dm-form-textarea"
                    value={reportFormData.notes}
                    onChange={(e) => handleReportFormChange("notes", e.target.value)}
                    placeholder="Mô tả chi tiết về sự cố"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="dm-modal-footer">
                <button
                  className="dm-modal-btn dm-btn-cancel"
                  onClick={handleCloseReportModal}
                >
                  Hủy
                </button>
                <button
                  className="dm-modal-btn dm-btn-confirm"
                  onClick={handleSubmitReport}
                  disabled={!reportFormData.type}
                >
                  Xác nhận báo cáo
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stop Counter Modal */}
        {showStopModal && (
          <div className="dm-modal-overlay" onClick={handleCloseStopModal}>
            <div className="dm-figma-stop-modal" onClick={(e) => e.stopPropagation()}>
              {/* Modal Header */}
              <div className="dm-figma-header">
                <div className="dm-figma-title-wrapper">
                  <svg className="dm-figma-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                    <path d="M576 160C576 210.2 516.9 285.1 491.4 315C487.6 319.4 482 321.1 476.9 320L384 320C366.3 320 352 334.3 352 352C352 369.7 366.3 384 384 384L480 384C533 384 576 427 576 480C576 533 533 576 480 576L203.6 576C212.3 566.1 222.9 553.4 233.6 539.2C239.9 530.8 246.4 521.6 252.6 512L480 512C497.7 512 512 497.7 512 480C512 462.3 497.7 448 480 448L384 448C331 448 288 405 288 352C288 299 331 256 384 256L423.8 256C402.8 224.5 384 188.3 384 160C384 107 427 64 480 64C533 64 576 107 576 160zM181.1 553.1C177.3 557.4 173.9 561.2 171 564.4L169.2 566.4L169 566.2C163 570.8 154.4 570.2 149 564.4C123.8 537 64 466.5 64 416C64 363 107 320 160 320C213 320 256 363 256 416C256 446 234.9 483 212.5 513.9C201.8 528.6 190.8 541.9 181.7 552.4L181.1 553.1zM192 416C192 398.3 177.7 384 160 384C142.3 384 128 398.3 128 416C128 433.7 142.3 448 160 448C177.7 448 192 433.7 192 416zM480 192C497.7 192 512 177.7 512 160C512 142.3 497.7 128 480 128C462.3 128 448 142.3 448 160C448 177.7 462.3 192 480 192z"/>
                  </svg>
                  <h2 className="dm-figma-title">Các trạm cần đến</h2>
                </div>
                <button
                  className="dm-figma-close"
                  onClick={handleCloseStopModal}
                  aria-label="Đóng"
                >
                  ×
                </button>
              </div>

              {/* Stops List */}
              <div className="dm-figma-stops">
                <div className="dm-figma-stop-item">
                  <div className="dm-figma-stop-circle">1</div>
                  <div className="dm-figma-stop-content">
                    <p className="dm-figma-stop-name">Tạ Uyên</p>
                    <p className="dm-figma-stop-address">123 Tạ Uyên</p>
                    <div className="dm-figma-stop-details">
                      <span className="dm-figma-stop-time">07:30</span>
                      <span className="dm-figma-stop-badge">Điểm đón</span>
                      <span className="dm-figma-stop-count">2 học sinh</span>
                    </div>
                  </div>
                  <div className="dm-figma-stop-line"></div>
                </div>

                <div className="dm-figma-stop-item">
                  <div className="dm-figma-stop-circle">2</div>
                  <div className="dm-figma-stop-content">
                    <p className="dm-figma-stop-name">Võ Văn Kiệt</p>
                    <p className="dm-figma-stop-address">123 Võ Văn Kiệt</p>
                    <div className="dm-figma-stop-details">
                      <span className="dm-figma-stop-time">07:35</span>
                      <span className="dm-figma-stop-badge">Điểm đón</span>
                      <span className="dm-figma-stop-count">2 học sinh</span>
                    </div>
                  </div>
                  <div className="dm-figma-stop-line"></div>
                </div>

                <div className="dm-figma-stop-item">
                  <div className="dm-figma-stop-circle">3</div>
                  <div className="dm-figma-stop-content">
                    <p className="dm-figma-stop-name">Nguyễn Văn Cừ</p>
                    <p className="dm-figma-stop-address">123 Nguyễn Văn Cừ</p>
                    <div className="dm-figma-stop-details">
                      <span className="dm-figma-stop-time">07:42</span>
                      <span className="dm-figma-stop-badge">Điểm đón</span>
                      <span className="dm-figma-stop-count">3 học sinh</span>
                    </div>
                  </div>
                  <div className="dm-figma-stop-line"></div>
                </div>

                <div className="dm-figma-stop-item">
                  <div className="dm-figma-stop-circle">4</div>
                  <div className="dm-figma-stop-content">
                    <p className="dm-figma-stop-name">Trần Hưng Đạo</p>
                    <p className="dm-figma-stop-address">123 Trần Hưng Đạo</p>
                    <div className="dm-figma-stop-details">
                      <span className="dm-figma-stop-time">07:48</span>
                      <span className="dm-figma-stop-badge">Điểm đến</span>
                      <span className="dm-figma-stop-count">2 học sinh</span>
                    </div>
                  </div>
                  <div className="dm-figma-stop-line"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Student List Modal */}
        {showStudentListModal && (
          <div className="dm-modal-overlay" onClick={() => setShowStudentListModal(false)}>
            <div className="dm-student-list-panel" onClick={(e) => e.stopPropagation()}>
              {/* Header */}
              <div className="dm-student-list-header">
                <div className="dm-student-list-title-wrapper">
                  <svg className="dm-student-list-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                    <path d="M320 80C377.4 80 424 126.6 424 184C424 241.4 377.4 288 320 288C262.6 288 216 241.4 216 184C216 126.6 262.6 80 320 80zM96 152C135.8 152 168 184.2 168 224C168 263.8 135.8 296 96 296C56.2 296 24 263.8 24 224C24 184.2 56.2 152 96 152zM0 480C0 409.3 57.3 352 128 352C140.8 352 153.2 353.9 164.9 357.4C132 394.2 112 442.8 112 496L112 512C112 523.4 114.4 534.2 118.7 544L32 544C14.3 544 0 529.7 0 512L0 480zM521.3 544C525.6 534.2 528 523.4 528 512L528 496C528 442.8 508 394.2 475.1 357.4C486.8 353.9 499.2 352 512 352C582.7 352 640 409.3 640 480L640 512C640 529.7 625.7 544 608 544L521.3 544zM472 224C472 184.2 504.2 152 544 152C583.8 152 616 184.2 616 224C616 263.8 583.8 296 544 296C504.2 296 472 263.8 472 224zM160 496C160 407.6 231.6 336 320 336C408.4 336 480 407.6 480 496L480 512C480 529.7 465.7 544 448 544L192 544C174.3 544 160 529.7 160 512L160 496z"/>
                  </svg>
                  <h2 className="dm-student-list-title">Danh sách học sinh</h2>
                </div>
                <button
                  className="dm-student-list-close"
                  onClick={() => setShowStudentListModal(false)}
                  aria-label="Đóng"
                >
                  ×
                </button>
              </div>

              {/* Student List Container */}
              <div className="dm-student-list-container">
                {/* Stop 1 */}
                <div className="dm-student-stop-group">
                  <div className="dm-student-stop-info">
                    <p className="dm-student-location">123 Tạ Uyên</p>
                    <p className="dm-student-time">7:30</p>
                    <span className="dm-student-badge">Điểm đón</span>
                  </div>
                  <div className="dm-student-list-items">
                    <div className="dm-student-item">
                      <div className="dm-student-circle">X</div>
                      <div className="dm-student-info">
                        <p className="dm-student-name">Nguyễn Văn A</p>
                        <p className="dm-student-class">10A1</p>
                      </div>
                    </div>
                    <div className="dm-student-item">
                      <div className="dm-student-circle">X</div>
                      <div className="dm-student-info">
                        <p className="dm-student-name">Nguyễn Văn A</p>
                        <p className="dm-student-class">10A1</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stop 2 */}
                <div className="dm-student-stop-group">
                  <div className="dm-student-stop-info">
                    <p className="dm-student-location">123 Tạ Uyên</p>
                    <p className="dm-student-time">7:30</p>
                    <span className="dm-student-badge">Điểm đón</span>
                  </div>
                  <div className="dm-student-list-items">
                    <div className="dm-student-item">
                      <div className="dm-student-circle">X</div>
                      <div className="dm-student-info">
                        <p className="dm-student-name">Nguyễn Văn A</p>
                        <p className="dm-student-class">10A1</p>
                      </div>
                    </div>
                    <div className="dm-student-item">
                      <div className="dm-student-circle">X</div>
                      <div className="dm-student-info">
                        <p className="dm-student-name">Nguyễn Văn A</p>
                        <p className="dm-student-class">10A1</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stop 3 */}
                <div className="dm-student-stop-group">
                  <div className="dm-student-stop-info">
                    <p className="dm-student-location">123 Tạ Uyên</p>
                    <p className="dm-student-time">7:30</p>
                    <span className="dm-student-badge">Điểm đón</span>
                  </div>
                  <div className="dm-student-list-items">
                    <div className="dm-student-item">
                      <div className="dm-student-circle">X</div>
                      <div className="dm-student-info">
                        <p className="dm-student-name">Nguyễn Văn A</p>
                        <p className="dm-student-class">10A1</p>
                      </div>
                    </div>
                    <div className="dm-student-item">
                      <div className="dm-student-circle">X</div>
                      <div className="dm-student-info">
                        <p className="dm-student-name">Nguyễn Văn A</p>
                        <p className="dm-student-class">10A1</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detail Button */}
              <div className="dm-student-list-footer">
                <button 
                  className="dm-student-list-detail-btn"
                  onClick={() => onNavigateToList && onNavigateToList()}
                >
                  Chi tiết thông tin học sinh
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Emergency Support Modal */}
        {showEmergencyModal && (
          <div className="dm-modal-overlay" onClick={() => setShowEmergencyModal(false)}>
            <div className="dm-modal-content" onClick={(e) => e.stopPropagation()}>
              {/* Modal Header */}
              <div className="dm-modal-header">
                <svg
                  className="dm-modal-warning-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm0-12c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z"
                    fill="currentColor"
                  />
                </svg>
                <h2>Hỗ trợ khẩn cấp</h2>
                <button
                  className="dm-modal-close-btn"
                  onClick={() => setShowEmergencyModal(false)}
                  aria-label="Đóng"
                >
                  ×
                </button>
              </div>

              {/* Modal Body */}
              <div className="dm-modal-body">
                <p className="dm-emergency-label">Liên hệ với bộ phận hỗ trợ khẩn cấp:</p>
                <p className="dm-emergency-phone">0842498241</p>
                <button 
                  className="dm-emergency-call-btn"
                  onClick={() => window.location.href = 'tel:0842498241'}
                >
                  Gọi ngay
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
