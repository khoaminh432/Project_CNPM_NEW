import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import đủ 4 trang quan trọng
import Login from "./Login";
import HomePH from "./HomePH";
import BusLineDetail from "./BusLineDetail";
import BusTracking from "./BusTracking";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* 1. Vào web là hiện Login đầu tiên */}
          <Route path="/" element={<Login />} />
          
          {/* 2. Đăng nhập xong thì vào Trang chủ (HomePH) */}
          {/* Đây là nơi chứa Menu, Profile, Thông báo... */}
          <Route path="/home" element={<HomePH />} />
          
          {/* 3. Khi bấm "Xem chi tiết" ở HomePH -> Nó nhảy vào đây */}
          <Route path="/line/:id" element={<BusLineDetail />} />
          
          {/* 4. Khi bấm "Xem bản đồ" ở HomePH -> Nó nhảy vào đây */}
          <Route path="/tracking/:lineId" element={<BusTracking />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;