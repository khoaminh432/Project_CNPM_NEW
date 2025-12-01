import React from "react";
import "leaflet/dist/leaflet.css"; // Cho Leaflet map từ main
import "mapbox-gl/dist/mapbox-gl.css"; // Thêm cho mapbox nếu dùng Tracking (từ TCTDADMIN)
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Imports từ main và merge khoa
import Login from "./Login";
import BusLineDetail from "./BusLineDetail"; // Case: BusLine (L capital)
import BusTracking from "./BusTracking"; // Từ khoa, kiểm tra tồn tại

// Import từ qlxb-code
import QuanLyXeBuyt from "./frontend/QuanLyXeBuyt"; // Case: QuanLyXeBuyt

// Import từ TCTDADMIN
import Tracking from "./Tracking"; // Nếu thiếu, fallback bên dưới

// Fallback cho Home nếu thiếu (từ main)
function Home() {
  return (
    <div style={{ padding: "20px", fontSize: "18px" }}>
      <h1>Trang Chủ</h1>
      <p>Chào mừng đến ứng dụng quản lý xe buýt! (Tạo Home.js để chi tiết hơn)</p>
    </div>
  );
}

// Fallback cho Tracking nếu thiếu (từ TCTDADMIN)
function TrackingFallback() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Tracking Bus</h1>
      <p>Component Tracking đang được phát triển. Sử dụng mapbox/leaflet để theo dõi vị trí xe buýt.</p>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="App min-h-screen bg-gray-100"> {/* Thêm style Tailwind nếu có */}
        <Routes>
          {/* Routes cơ bản từ main */}
          <Route path="/busline-detail" element={<BusLineDetail />} />
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          
          <Route path="/bus-tracking" element={<BusTracking />} />

          {/* Route từ qlxb-code */}
          <Route path="/quanly-xebuyt" element={<QuanLyXeBuyt />} />

          {/* Route từ TCTDADMIN */}
          <Route path="/tracking" element={Tracking ? <Tracking /> : <TrackingFallback />} />

          {/* Route fallback 404 */}
          <Route path="*" element={<div>404 - Trang không tồn tại</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;