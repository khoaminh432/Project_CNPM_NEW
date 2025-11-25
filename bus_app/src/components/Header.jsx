import React, { useState } from "react";
import "../Assets/CSS/header.css";

export default function Header({ 
  currentPage = "mainpage",
  onNavigate,
  imgEllipse1,
  imgVector,
  imgVector1 
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleNavClick = (e, page) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(page);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="app-header">
      <div className="app-header-logo">SSB</div>
      
      <div className="app-header-nav-icon">
        <nav className="app-header-nav">
          <a 
            href="#home" 
            className={`app-nav-item ${currentPage === 'mainpage' ? 'active' : ''}`}
            onClick={(e) => handleNavClick(e, 'mainpage')}
          >
            Trang chủ
          </a>
          <a 
            href="#schedule" 
            className={`app-nav-item ${currentPage === 'schedule' ? 'active' : ''}`}
            onClick={(e) => handleNavClick(e, 'schedule')}
          >
            Lịch làm
          </a>
          <a 
            href="#list" 
            className={`app-nav-item ${currentPage === 'list' ? 'active' : ''}`}
            onClick={(e) => handleNavClick(e, 'list')}
          >
            Danh sách
          </a>
          <a 
            href="#notification" 
            className={`app-nav-item ${currentPage === 'notification' ? 'active' : ''}`}
            onClick={(e) => handleNavClick(e, 'notification')}
          >
            Thông báo
          </a>
        </nav>
      </div>

      <div className="app-header-profile">
        <div 
          className="app-profile-avatar-wrapper"
          onClick={() => onNavigate && onNavigate('profile')}
          style={{ cursor: 'pointer' }}
        >
          <img alt="avatar" src={imgEllipse1} className="app-profile-avatar" />
          <img alt="vector" src={imgVector} className="app-profile-icon" />
        </div>
        <span className="app-profile-text">Profile</span>
        <img 
          alt="dropdown" 
          src={imgVector1} 
          className={`app-profile-dropdown ${isDropdownOpen ? 'open' : ''}`}
          onClick={toggleDropdown}
        />
        
        {isDropdownOpen && (
          <div className="app-profile-dropdown-menu">
            <button className="app-dropdown-item">Đổi mật khẩu</button>
            <button className="app-dropdown-item">Đăng xuất</button>
          </div>
        )}
      </div>
    </header>
  );
}
