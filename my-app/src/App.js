import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import Info from "./Info";
import Tracking from "./Tracking";
import StudentManagementPage from "./pages/maincontent/Student_management/StudentManagementPage";
import MapComponent from './components/MapTracking/MapComponent';
import Clock from "./components/Time";
import DemoTk from "./components/demoTk";
import BusGif from "./assets/image/Bus Tracking.png";

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

// Gọi API thống kê khi component mount
useEffect(() => {
  const fetchStats = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/thongke");
      console.log("Fetched stats:", res.data);
      setStatsData(res.data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  fetchStats();
}, []);

const handleCardClick = (title, value) => {
setModalTitle(title);
setModalValue(value);
setShowModal(true);
};

return ( <div className="container">
{/* Sidebar */} <div className="sidebar"> <h2>ADMIN</h2> <ul>
<li onClick={() => setActivePage("TRANG CHỦ")}>Trang chủ</li>
<li onClick={() => setActivePage("THEO DÕI XE BUÝT")}>Theo dõi xe buýt</li>
<li onClick={() => setActivePage("QUẢN LÝ HỌC SINH")}>Quản lý học sinh</li>
<li onClick={() => setActivePage("QUẢN LÝ TUYẾN XE")}>Quản lý tuyến xe</li> </ul> </div>


  <div className="main">
    
    <div className="header">
      <h1>{activePage.toUpperCase()}</h1>
      <div className="profile">
        <Clock />
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


        {/* Bảng thông tin chi tiết */}
        <Info
          show={showModal}
          onClose={() => setShowModal(false)}
          title={modalTitle}
          value={modalValue}
        />

        {/* Bản đồ */}
       
<div className="thongbao">
  <DemoTk />
</div>
      </>
    )}

    {/* component Tracking */}
    {activePage === "THEO DÕI XE BUÝT" && <Tracking />}
    {activePage === "QUẢN LÝ HỌC SINH" && <StudentManagementPage />}
    {activePage === "QUẢN LÝ TUYẾN XE" && (
      <div>
        <h2>Route Management Page</h2>
      </div>
    )}
  </div>
</div>

);
}

export default App;
