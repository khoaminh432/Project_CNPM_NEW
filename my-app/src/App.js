// my-app/src/App.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import Info from "./Info";
import Tracking from "./Tracking";
import StudentManagementPage from "./pages/maincontent/Student_management/StudentManagementPage";
import AddRoute from "./pages/maincontent/Route_management/component/AddRoute";
import Clock from "./components/Time";
import DemoTk from "./components/demoTk";

function App() {
  const [activePage, setActivePage] = useState("TRANG CHỦ");
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalValue, setModalValue] = useState("");

  const [statsData, setStatsData] = useState({
    xeBuyt: 0,
    taiXe: 0,
    hocSinh: 0,
    tuyenDuong: 0,
  });

  // Lấy dữ liệu thống kê từ backend
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/thongke");
        setStatsData(res.data);
      } catch (err) {
        console.error("Lỗi lấy thống kê:", err);
      }
    };
    fetchStats();
  }, []);

  const handleCardClick = (title, value) => {
    setModalTitle(title);
    setModalValue(value);
    setShowModal(true);
  };

  return (
    <div className="container">
      {/* Sidebar */}
      <div className="sidebar">
        <h2>ADMIN</h2>
        <ul>
          <li onClick={() => setActivePage("TRANG CHỦ")}>Trang chủ</li>
          <li onClick={() => setActivePage("THEO DÕI XE BUÝT")}>Theo dõi xe buýt</li>
          <li onClick={() => setActivePage("QUẢN LÝ HỌC SINH")}>Quản lý học sinh</li>
          <li onClick={() => setActivePage("QUẢN LÝ TUYẾN XE")}>Quản lý tuyến xe</li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main">
        <div className="header">
          <h1>{activePage}</h1>
          <div className="profile">
            <Clock />
            <button className="avatar"></button>
            <span>Profile ▼</span>
          </div>
        </div>

        {/* Trang chủ */}
        {activePage === "TRANG CHỦ" && (
          <>
            <div className="stats">
              <div className="item" onClick={() => handleCardClick("Xe Buýt", statsData.xeBuyt)}>
                <b>{statsData.xeBuyt}</b> <span>Xe Buýt</span>
              </div>
              <div className="item" onClick={() => handleCardClick("Tài Xế", statsData.taiXe)}>
                <b>{statsData.taiXe}</b> <span>Tài Xế</span>
              </div>
              <div className="item" onClick={() => handleCardClick("Học Sinh", statsData.hocSinh)}>
                <b>{statsData.hocSinh}</b> <span>Học Sinh</span>
              </div>
              <div className="item" onClick={() => handleCardClick("Tuyến Đường", statsData.tuyenDuong)}>
                <b>{statsData.tuyenDuong}</b> <span>Tuyến Đường</span>
              </div>
            </div>

            <Info show={showModal} onClose={() => setShowModal(false)} title={modalTitle} value={modalValue} />

            <div className="thongbao">
              <DemoTk />
            </div>
          </>
        )}

        {/* Theo dõi xe buýt */}
        {activePage === "THEO DÕI XE BUÝT" && <Tracking />}

        {/* Quản lý học sinh */}
        {activePage === "QUẢN LÝ HỌC SINH" && <StudentManagementPage />}

        {/* Quản lý tuyến xe */}
        {activePage === "QUẢN LÝ TUYẾN XE" && <AddRoute />}
      </div>
    </div>
  );
}

export default App;