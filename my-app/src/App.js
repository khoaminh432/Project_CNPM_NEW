import React, { useState } from "react";
import "./App.css";
import Info from "./Info";
import Tracking from "./Tracking";
import MapComponent from "./components/MapComponent";
import StudentManagementPage from "./pages/maincontent/Student_management/StudentManagementPage";
import RouteManagementPage from "./pages/maincontent/Route_management/RouteManagementPage";
import Signin from "./Signin";
import DriverSuccess from "./DriverSuccess";
import ParentSuccess from "./ParentSuccess";

function App() {
  // State cho authentication
  const [user, setUser] = useState(null);
  const [tenTK, setTenTK] = useState("admin");
  const [matkhau, setMatkhau] = useState("g5bus");

  // State cho modal và navigation (dùng cho Admin)
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalValue, setModalValue] = useState("");
  const [activePage, setActivePage] = useState("TRANG CHỦ");

  // Xử lý login
  const handleLogin = (userObj) => {
    setUser(userObj);
  };

  // Xử lý logout
  const handleLogout = () => {
    setUser(null);
    setTenTK("");
    setMatkhau("");
    setActivePage("TRANG CHỦ");
  };

  // Xử lý click vào card thống kê
  const handleCardClick = (title, value) => {
    setModalTitle(title);
    setModalValue(value);
    setShowModal(true);
  };

  // Nếu chưa đăng nhập -> hiển thị trang Signin
  if (!user) {
    return (
      <div className="App">
        <Signin
          tenTK={tenTK}
          setTenTK={setTenTK}
          matkhau={matkhau}
          setMatkhau={setMatkhau}
          onLogin={handleLogin}
        />
      </div>
    );
  }

  // Nếu là Driver
  if (user.role === "driver") {
    return (
      <div className="App">
        <DriverSuccess user={user} onLogout={handleLogout} />
      </div>
    );
  }

  // Nếu là Parent
  if (user.role === "parent") {
    return (
      <div className="App">
        <ParentSuccess user={user} onLogout={handleLogout} />
      </div>
    );
  }

  // Nếu là Admin -> hiển thị giao diện quản lý
  return (
    <div className="App">
      <div className="container">
        {/* Sidebar */}
        <div className="sidebar">
          <h2>ADMIN</h2>
          <ul>
            <li onClick={() => setActivePage("TRANG CHỦ")}>Trang chủ</li>
            <li onClick={() => setActivePage("THEO DÕI XE BUÝT")}>Theo dõi xe buýt</li>
            <li onClick={() => setActivePage("QUẢN LÝ HỌC SINH")}>Quản lý học sinh</li>
            <li onClick={() => setActivePage("QUẢN LÝ TUYẾN XE")}>Quản lý tuyến xe</li>
            <li onClick={handleLogout} style={{color: '#ff6b6b', marginTop: '20px'}}>
              Đăng xuất
            </li>
          </ul>
        </div>

        <div className="main">
          <div className="header">
            <h1>{activePage.toUpperCase()}</h1>
            <div className="profile">
              <button className="avatar"></button>
              <span>{user.username || "Admin"} ▼</span>
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

          {/* Các trang con */}
          {activePage === "THEO DÕI XE BUÝT" && <Tracking />}
          {activePage === "QUẢN LÝ HỌC SINH" && <StudentManagementPage />}
          {activePage === "QUẢN LÝ TUYẾN XE" && <RouteManagementPage />}
        </div>
      </div>
    </div>
  );
}


export default App;