import React, { useState } from "react";
import "../Assets/CSS/noti.css";
import Header from "./Header";

// Asset images from Figma
const imgRectangle22 = "https://www.figma.com/api/mcp/asset/f32f0136-18b0-4d4d-8625-20736eea1f6c";
const imgGroup23 = "https://www.figma.com/api/mcp/asset/6681faf0-5e9d-4a58-8627-9449ce6c6559";
const imgRiArrowUpSLine = "https://www.figma.com/api/mcp/asset/ff2d622c-0c19-4ba5-b1f7-f064d1218509";
const imgLine23 = "https://www.figma.com/api/mcp/asset/dc1903f6-bd20-44a8-a134-ccd166e17d44";
const imgFrame = "https://www.figma.com/api/mcp/asset/68fede06-fd8f-4374-84f8-7a2c183c2f09";
const imgEllipse1 = "https://www.figma.com/api/mcp/asset/d5b9682c-87c6-47c0-95d1-85edd88ec7aa";
const imgVector = "https://www.figma.com/api/mcp/asset/039918d8-2a2a-4c92-9162-b5c2172b4b40";
const imgVector1 = "https://www.figma.com/api/mcp/asset/d35bc3a2-045b-4f40-80f0-14a7df2a2fb5";

export default function Noti({ onNavigateToMainPage, onNavigate }) {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Tuyến xe buýt 07 tạm ngưng hoạt động do bảo trì định kỳ.",
      preview: "Kính gửi quý tài xế,\nNhằm đảm bảo chất lượng phục vụ và an toàn vận hành, hệ thống xe buýt 07 sẽ tiến hành bảo trì định kỳ trong thời ...",
      isRead: false
    },
    {
      id: 2,
      title: "Đường CMT8 ùn tắc giao thông lưu ý khi lưu thông vào.",
      preview: "Kính gửi quý tài xế,\nĐường CMT8 hiện tại đang trong kẹt xe khó lưu thông các tài xế lưu ý và tìm đường thay thế để tránh ảnh hưởng tới...",
      isRead: true
    },
    {
      id: 3,
      title: "Đường CMT8 ùn tắc giao thông lưu ý khi lưu thông vào.",
      preview: "Kính gửi quý tài xế,\nĐường CMT8 hiện tại đang trong kẹt xe khó lưu thông các tài xế lưu ý và tìm đường thay thế để tránh ảnh hưởng tới...",
      isRead: true
    },
    {
      id: 4,
      title: "Đường CMT8 ùn tắc giao thông lưu ý khi lưu thông vào.",
      preview: "Kính gửi quý tài xế,\nĐường CMT8 hiện tại đang trong kẹt xe khó lưu thông các tài xế lưu ý và tìm đường thay thế để tránh ảnh hưởng tới...",
      isRead: true
    }
  ]);

  const handleNavigate = (page) => {
    if (page === "mainpage" && onNavigateToMainPage) {
      onNavigateToMainPage();
    } else if (onNavigate) {
      onNavigate(page);
    }
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, isRead: true })));
  };

  const unreadNotifications = notifications.filter(n => !n.isRead);
  const readNotifications = notifications.filter(n => n.isRead);

  return (
    <div className="noti-root">
      {/* Header */}
      <Header 
        currentPage="notification" 
        onNavigate={handleNavigate}
        imgEllipse1={imgEllipse1}
        imgVector={imgVector}
        imgVector1={imgVector1}
      />

      {/* Main Content */}
      <div className="noti-container">
        {/* Unread Section */}
        <div className="noti-section-header">
          <h2 className="noti-section-title unread">Chưa đọc</h2>
          <button className="noti-mark-all-btn" onClick={markAllAsRead}>
            Đánh dấu tất cả đã đọc
          </button>
          <button className="noti-delete-btn">
            <img src={imgFrame} alt="delete" className="noti-delete-icon" />
          </button>
        </div>

        {/* Unread Notifications */}
        <div className="noti-list">
          {unreadNotifications.map(notif => (
            <div key={notif.id} className="noti-card unread">
              <h3 className="noti-card-title">{notif.title}</h3>
              <p className="noti-card-preview">{notif.preview}</p>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="noti-divider">
          <img src={imgLine23} alt="divider" className="noti-divider-line" />
        </div>

        {/* Read Section */}
        <h2 className="noti-section-title read">Đã đọc</h2>

        {/* Read Notifications */}
        <div className="noti-list">
          {readNotifications.map(notif => (
            <div key={notif.id} className="noti-card read">
              <h3 className="noti-card-title">{notif.title}</h3>
              <p className="noti-card-preview">{notif.preview}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
