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

  const handleCardClick = (title, value) => {
    setModalTitle(title);
    setModalValue(value);
    setShowModal(true);
  };

  fetchStats();
}, []);

const handleCardClick = (title, value) => {
setModalTitle(title);
setModalValue(value);
setShowModal(true);
};

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
              <div className="card" onClick={() => handleCardClick("Xe Buýt", 35)}>
                Xe Buýt <br /> <b>35</b>
              </div>
              <div className="card" onClick={() => handleCardClick("Tài Xế", 19)}>
                Tài Xế <br /> <b>19</b>
              </div>
              <div className="card" onClick={() => handleCardClick("Học Sinh", 4)}>
                Học Sinh <br /> <b>4</b>
              </div>
              <div className="card" onClick={() => handleCardClick("Tuyến Đường", 12)}>
                Tuyến Đường <br /> <b>12</b>
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
            <div className="map">
              map component here
            </div>
          </>
        )}

        {/* component Tracking */}
        {activePage === "THEO DÕI XE BUÝT" && <Tracking />}
        {activePage === "QUẢN LÝ HỌC SINH" && <StudentManagementPage />}
        {activePage === "QUẢN LÝ TUYẾN XE" && <RouteManagementPage/>}
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
