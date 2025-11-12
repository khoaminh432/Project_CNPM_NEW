import React, { useEffect, useRef, useState } from "react";
import "../Assets/CSS/index.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPowerOff } from "@fortawesome/free-solid-svg-icons";

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
        

        {/* Bottom status bar */}
        
      </main>
      <div className="dm-center-control">
          <button
            className={`dm-connect-btn ${connected ? "connected" : ""}`}
            onClick={handleConnectClick}
            aria-pressed={connected}
          >
            <FontAwesomeIcon
              icon={faPowerOff}
              color="white"
              size="lg"
              style={{ marginRight: 8 }}
            />
            {connected ? "Ngắt kết nối" : "Bật kết nối"}
          </button>
        </div>
      <div className="dm-bottom-status">
          <div className="dm-status-text">
            <div className="dm-status-line1">{status}</div>
            <div className="dm-status-line2">SSB</div>
          </div>
        </div>
    </div>
  );
}
