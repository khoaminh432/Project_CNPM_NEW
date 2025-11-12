import React, { useState } from "react";
import "./App.css";
import Info from "./Info";
import Tracking from "./Tracking";
import MapComponent from "./components/MapComponent";
import StudentManagementPage from "./pages/maincontent/Student_management/StudentManagementPage";
import RouteManagementPage from "./pages/maincontent/Route_management/RouteManagementPage";

import AddRoute from "./pages/maincontent/Route_management/component/AddRoute";
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
              <MapComponent />
            </div>
          </>
        )}

        {/* component Tracking */}
        {activePage === "THEO DÕI XE BUÝT" && <Tracking />}
        {activePage === "QUẢN LÝ HỌC SINH" && <StudentManagementPage />}
        {activePage === "QUẢN LÝ TUYẾN XE" && <AddRoute/>}
      </div>
    </div>
  );
}

export default App;
