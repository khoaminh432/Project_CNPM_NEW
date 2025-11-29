import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import Info from "./Info";
import Tracking from "./Tracking";
import MapComponent from "./components/MapComponent";
import StudentManagementPage from "./pages/maincontent/Student_management/StudentManagementPage";
import RouteManagementPage from "./pages/maincontent/Route_management/RouteManagementPage";

function App() {
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalValue, setModalValue] = useState("");
  const [activePage, setActivePage] = useState("TRANG CHỦ");
  const [statsData, setStatsData] = useState({
    xeBuyt: 0,
    taiXe: 0,
    hocSinh: 0,
    tuyenDuong: 0
  });

  const handleCardClick = (title, value) => {
    setModalTitle(title);
    setModalValue(value);
    setShowModal(true);
  };

  // Định nghĩa hàm fetchStats để lấy dữ liệu thống kê từ API
  const fetchStats = async () => {
    try {
      // Giả sử endpoint API là '/api/stats' - chỉnh sửa theo backend thực tế
      const response = await axios.get('/api/stats');
      setStatsData(response.data); // Giả sử response.data có cấu trúc { xeBuyt: 35, taiXe: 19, ... }
    } catch (error) {
      console.error("Error fetching stats:", error);
      // Fallback data nếu API fail
      setStatsData({
        xeBuyt: 35,
        taiXe: 19,
        hocSinh: 4,
        tuyenDuong: 12
      });
    }
  };

  // Sử dụng useEffect để gọi fetchStats khi component mount
  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="App">
      <div className="main">
        <div className="header">
          <h1>{activePage.toUpperCase()}</h1>
          <div className="profile">
            <button className="avatar"></button>
            <span>Profile ▼</span>
          </div>
        </div>

        {activePage === "TRANG CHỦ" && (
          <>
            <div className="stats">
              <div className="item" onClick={() => handleCardClick("Xe Buýt", statsData.xeBuyt)}>
                <b>{statsData.xeBuyt}</b>
                <span>Xe Buýt</span>
              </div>
              <div className="item" onClick={() => handleCardClick("Tài Xế", statsData.taiXe)}>
                <b>{statsData.taiXe}</b>
                <span>Tài Xế</span>
              </div>
              <div className="item" onClick={() => handleCardClick("Học Sinh", statsData.hocSinh)}>
                <b>{statsData.hocSinh}</b>
                <span>Học Sinh</span>
              </div>
              <div className="item" onClick={() => handleCardClick("Tuyến Đường", statsData.tuyenDuong)}>
                <b>{statsData.tuyenDuong}</b>
                <span>Tuyến Đường</span>
              </div>
            </div>

            {/* Bảng thông tin chi tiết (modal) */}
            <Info
              show={showModal}
              onClose={() => setShowModal(false)}
              title={modalTitle}
              value={modalValue}
            />

            {/* Bản đồ */}
            <div className="map">
              <MapComponent />
            </div>

            {/* Phần thông báo - nếu DemoTk là component, import nó; tạm thời comment */}
            {/* <div className="thongbao">
              <DemoTk />
            </div> */}
          </>
        )}

        {/* Các trang khác */}
        {activePage === "THEO DÕI XE BUÝT" && <Tracking />}
        {activePage === "QUẢN LÝ HỌC SINH" && <StudentManagementPage />}
        {activePage === "QUẢN LÝ TUYẾN XE" && <RouteManagementPage />}
      </div>
    </div>
  );
}

export default App;