import React from "react";
import "leaflet/dist/leaflet.css"; // Cho Leaflet map
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Imports từ main (sửa case và path)
import Login from "./Login";
import BusLineDetail from "./BusLineDetail"; // Sửa: BusLine (L capital)
import BusTracking from "./BusTracking"; // Giả sử tồn tại, kiểm tra tên

// Import mới từ qlxb (sửa case và path)
import QuanLyXeBuyt from "./frontend/QuanLyXeBuyt"; // Sửa: QuanLyXeBuyt

// Fallback cho Home nếu thiếu
function Home() {
  return <div style={{ padding: "20px" }}>Home Page - Chào mừng! (Tạo Home.js nếu cần chi tiết hơn)</div>;
}

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Routes từ main */}
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/busline-detail" element={<BusLineDetail />} />
          <Route path="/bus-tracking" element={<BusTracking />} />
          {/* Route mới */}
          <Route path="/quanly-xebuyt" element={<QuanLyXeBuyt />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;