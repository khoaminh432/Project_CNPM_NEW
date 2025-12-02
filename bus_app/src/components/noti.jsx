import React, { useState, useEffect } from "react";
import "../Assets/CSS/noti.css";
import Header from "./Header";
import { getNotifications, markAllAsRead, markAsRead, deleteAllReadNotifications } from '../services/notificationService';

// Import local images
import imgLine23 from "../Assets/images/imgLine23.svg";
import imgFrame from "../Assets/images/imgFrame.svg";
import imgEllipse1 from "../Assets/images/imgEllipse1.svg";
import imgVector from "../Assets/images/imgVector.svg";
import imgVector1 from "../Assets/images/imgVector1.svg";

export default function Noti({ onNavigateToMainPage, onNavigate }) {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [driverId, setDriverId] = useState(null);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedNotifications, setSelectedNotifications] = useState([]);

  // Load notifications from database
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const userStr = localStorage.getItem('user');
        if (!userStr) {
          console.error('No user found in localStorage');
          setIsLoading(false);
          return;
        }

        const user = JSON.parse(userStr);
        
        // Get driver_id if user is a driver
        if (user.role === 'driver' && user.driver_id) {
          setDriverId(user.driver_id);
        }

        const data = await getNotifications(user.user_id, user.role);

        if (data.success) {
          // Map database fields to component state
          const mappedNotifications = data.notifications.map(notif => ({
            id: notif.id,
            title: notif.title,
            preview: notif.content,
            isRead: notif.status === 'read',
            type: notif.type,
            createdAt: notif.created_at
          }));
          setNotifications(mappedNotifications);
        } else {
          console.error('Failed to load notifications:', data.message);
        }
      } catch (error) {
        console.error('Error loading notifications:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadNotifications();
  }, []);

  const handleNavigate = (page) => {
    if (page === "mainpage" && onNavigateToMainPage) {
      onNavigateToMainPage();
    } else if (onNavigate) {
      onNavigate(page);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) return;

      const user = JSON.parse(userStr);
      const data = await markAllAsRead(user.role, driverId);

      if (data.success) {
        // Update local state
        setNotifications(notifications.map(notif => ({ ...notif, isRead: true })));
      } else {
        alert('Lỗi: ' + data.message);
      }
    } catch (error) {
      console.error('Error marking all as read:', error);
      alert('Lỗi khi đánh dấu đã đọc!');
    }
  };

  const handleNotificationClick = async (notificationId, isRead) => {
    // If in delete mode, toggle selection
    if (isDeleteMode) {
      if (selectedNotifications.includes(notificationId)) {
        setSelectedNotifications(selectedNotifications.filter(id => id !== notificationId));
      } else {
        setSelectedNotifications([...selectedNotifications, notificationId]);
      }
      return;
    }

    // Only mark as read if it's currently unread
    if (isRead) return;

    try {
      const data = await markAsRead(notificationId, driverId);

      if (data.success) {
        // Update local state
        setNotifications(notifications.map(notif => 
          notif.id === notificationId ? { ...notif, isRead: true } : notif
        ));
      } else {
        console.error('Failed to mark as read:', data.message);
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleDeleteButtonClick = async () => {
    if (!isDeleteMode) {
      // Enter delete mode
      setIsDeleteMode(true);
      setSelectedNotifications([]);
    } else {
      // Execute delete
      if (selectedNotifications.length === 0) {
        alert('Vui lòng chọn thông báo để xóa!');
        return;
      }

      const confirm = window.confirm(`Bạn có chắc muốn xóa ${selectedNotifications.length} thông báo?`);
      if (!confirm) return;

      try {
        // Delete selected notifications one by one
        const deletePromises = selectedNotifications.map(id => 
          fetch(`http://localhost:5000/api/notifications/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
          }).then(res => res.json())
        );

        await Promise.all(deletePromises);

        // Remove deleted notifications from state
        setNotifications(notifications.filter(notif => !selectedNotifications.includes(notif.id)));
        setSelectedNotifications([]);
        setIsDeleteMode(false);
        alert('Xóa thành công!');
      } catch (error) {
        console.error('Error deleting notifications:', error);
        alert('Lỗi khi xóa thông báo!');
      }
    }
  };

  const handleCancelDeleteMode = () => {
    setIsDeleteMode(false);
    setSelectedNotifications([]);
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
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <p>Đang tải thông báo...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '60px 20px',
            color: '#6c757d',
            fontSize: '18px'
          }}>
          
            <p style={{ margin: '20px 0 0 0', fontWeight: '500' }}>Không có thông báo mới</p>
          </div>
        ) : (
          <>
        {/* Unread Section */}
        <div className="noti-section-header">
          <h2 className="noti-section-title unread">
            {isDeleteMode ? `Chọn thông báo để xóa (${selectedNotifications.length})` : 'Chưa đọc'}
          </h2>
          {!isDeleteMode ? (
            <>
              <button className="noti-mark-all-btn" onClick={handleMarkAllAsRead}>
                Đánh dấu tất cả đã đọc
              </button>
              <button className="noti-delete-btn" onClick={handleDeleteButtonClick} title="Chọn thông báo để xóa">
                <img src={imgFrame} alt="delete" className="noti-delete-icon" />
              </button>
            </>
          ) : (
            <>
              <button className="noti-mark-all-btn" onClick={handleCancelDeleteMode} style={{ backgroundColor: '#6c757d' }}>
                Hủy
              </button>
              <button className="noti-delete-btn" onClick={handleDeleteButtonClick} title="Xóa các thông báo đã chọn" >
                <img src={imgFrame} alt="delete" className="noti-delete-icon" />
              </button>
            </>
          )}
        </div>

        {/* Unread Notifications */}
        <div className="noti-list">
          {unreadNotifications.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '20px',
              color: '#6c757d',
              fontSize: '14px'
            }}>
              Không có thông báo chưa đọc
            </div>
          ) : (
            unreadNotifications.map(notif => (
            <div 
              key={notif.id} 
              className={`noti-card unread ${isDeleteMode && selectedNotifications.includes(notif.id) ? 'selected' : ''}`}
              onClick={() => handleNotificationClick(notif.id, notif.isRead)}
              style={{ 
                cursor: 'pointer',
                border: isDeleteMode && selectedNotifications.includes(notif.id) ? '2px solid #007bff' : '',
                backgroundColor: isDeleteMode && selectedNotifications.includes(notif.id) ? '#e7f3ff' : '',
                position: 'relative'
              }}
            >
              {isDeleteMode && (
                <input 
                  type="checkbox" 
                  checked={selectedNotifications.includes(notif.id)}
                  onChange={() => {}}
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '20px',
                    width: '20px',
                    height: '20px',
                    cursor: 'pointer'
                  }}
                />
              )}
              <h3 className="noti-card-title">{notif.title}</h3>
              <p className="noti-card-preview">{notif.preview}</p>
            </div>
          )))
          }
        </div>

        {/* Divider */}
        <div className="noti-divider">
          <img src={imgLine23} alt="divider" className="noti-divider-line" />
        </div>

        {/* Read Section */}
        <h2 className="noti-section-title read">Đã đọc</h2>

        {/* Read Notifications */}
        <div className="noti-list">
          {readNotifications.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '20px',
              color: '#6c757d',
              fontSize: '14px'
            }}>
              Không có thông báo đã đọc
            </div>
          ) : (
            readNotifications.map(notif => (
            <div 
              key={notif.id} 
              className={`noti-card read ${isDeleteMode && selectedNotifications.includes(notif.id) ? 'selected' : ''}`}
              onClick={() => isDeleteMode && handleNotificationClick(notif.id, notif.isRead)}
              style={{ 
                cursor: isDeleteMode ? 'pointer' : 'default',
                border: isDeleteMode && selectedNotifications.includes(notif.id) ? '2px solid #007bff' : '',
                backgroundColor: isDeleteMode && selectedNotifications.includes(notif.id) ? '#e7f3ff' : '',
                position: 'relative'
              }}
            >
              {isDeleteMode && (
                <input 
                  type="checkbox" 
                  checked={selectedNotifications.includes(notif.id)}
                  onChange={() => {}}
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '20px',
                    width: '20px',
                    height: '20px',
                    cursor: 'pointer'
                  }}
                />
              )}
              <h3 className="noti-card-title">{notif.title}</h3>
              <p className="noti-card-preview">{notif.preview}</p>
            </div>
          )))
          }
        </div>
          </>
        )}
      </div>
    </div>
  );
}
