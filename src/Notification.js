// Notification.js - Component hiển thị thông báo
import React, { useState } from 'react';

const Notification = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Thay đổi lịch trình tuyến 01',
      message: 'Tuyến 01 sẽ thay đổi lịch trình từ ngày 15/12. Vui lòng kiểm tra lịch trình mới.',
      time: '10:30 AM - 10/12/2024',
      read: false,
      type: 'schedule'
    },
    {
      id: 2,
      title: 'Xe buýt đến trễ',
      message: 'Xe buýt tuyến 02 sẽ đến trễ 15 phút do ùn tắc giao thông.',
      time: '09:15 AM - 10/12/2024',
      read: true,
      type: 'delay'
    },
    {
      id: 3,
      title: 'Thông báo hệ thống',
      message: 'Hệ thống sẽ bảo trì từ 02:00 AM đến 04:00 AM ngày mai.',
      time: '08:00 AM - 10/12/2024',
      read: true,
      type: 'system'
    },
    {
      id: 4,
      title: 'Cập nhật ứng dụng',
      message: 'Phiên bản mới của ứng dụng đã có sẵn. Vui lòng cập nhật để có trải nghiệm tốt nhất.',
      time: '05:30 PM - 09/12/2024',
      read: false,
      type: 'update'
    }
  ]);

  const styles = {
    container: {
      padding: '20px',
      maxWidth: '800px',
      margin: '0 auto'
    },
    header: {
      color: '#333',
      fontSize: '28px',
      fontWeight: 'bold',
      marginBottom: '30px',
      borderBottom: '2px solid #667eea',
      paddingBottom: '10px'
    },
    notificationCard: {
      backgroundColor: 'white',
      border: '1px solid #e9ecef',
      borderRadius: '10px',
      padding: '20px',
      marginBottom: '15px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    notificationUnread: {
      borderLeft: '4px solid #667eea',
      backgroundColor: '#f8f9ff'
    },
    notificationRead: {
      borderLeft: '4px solid #dee2e6',
      opacity: 0.8
    },
    notificationHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '10px'
    },
    notificationTitle: {
      fontSize: '16px',
      fontWeight: 'bold',
      color: '#333',
      margin: 0,
      flex: 1
    },
    notificationTime: {
      fontSize: '12px',
      color: '#6c757d',
      margin: 0
    },
    notificationMessage: {
      fontSize: '14px',
      color: '#6c757d',
      lineHeight: '1.5',
      margin: '0 0 10px 0'
    },
    notificationBadge: {
      display: 'inline-block',
      padding: '2px 8px',
      borderRadius: '12px',
      fontSize: '11px',
      fontWeight: '500',
      marginRight: '8px'
    },
    badgeSchedule: {
      backgroundColor: '#28a745',
      color: 'white'
    },
    badgeDelay: {
      backgroundColor: '#ffc107',
      color: '#212529'
    },
    badgeSystem: {
      backgroundColor: '#6c757d',
      color: 'white'
    },
    badgeUpdate: {
      backgroundColor: '#007bff',
      color: 'white'
    },
    badgeUnread: {
      backgroundColor: '#dc3545',
      color: 'white',
      fontSize: '10px',
      padding: '1px 6px'
    },
    emptyState: {
      textAlign: 'center',
      padding: '40px 20px',
      color: '#6c757d'
    },
    emptyIcon: {
      fontSize: '48px',
      marginBottom: '15px',
      opacity: 0.5
    },
    actionButtons: {
      display: 'flex',
      gap: '10px',
      marginBottom: '20px'
    },
    actionButton: {
      padding: '8px 16px',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500'
    },
    primaryButton: {
      backgroundColor: '#667eea',
      color: 'white'
    },
    secondaryButton: {
      backgroundColor: '#6c757d',
      color: 'white'
    }
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  const getBadgeStyle = (type) => {
    switch (type) {
      case 'schedule':
        return { ...styles.notificationBadge, ...styles.badgeSchedule };
      case 'delay':
        return { ...styles.notificationBadge, ...styles.badgeDelay };
      case 'system':
        return { ...styles.notificationBadge, ...styles.badgeSystem };
      case 'update':
        return { ...styles.notificationBadge, ...styles.badgeUpdate };
      default:
        return { ...styles.notificationBadge, ...styles.badgeSystem };
    }
  };

  const getBadgeText = (type) => {
    switch (type) {
      case 'schedule':
        return 'Lịch trình';
      case 'delay':
        return 'Trễ giờ';
      case 'system':
        return 'Hệ thống';
      case 'update':
        return 'Cập nhật';
      default:
        return 'Thông báo';
    }
  };

  const unreadCount = notifications.filter(notif => !notif.read).length;

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>THÔNG BÁO</h1>

      <div style={styles.actionButtons}>
        <button 
          style={{...styles.actionButton, ...styles.primaryButton}}
          onClick={markAllAsRead}
          disabled={unreadCount === 0}
        >
          Đánh dấu tất cả đã đọc
        </button>
        <div style={{flex: 1}}></div>
        <span style={{color: '#6c757d', fontSize: '14px'}}>
          {unreadCount} thông báo chưa đọc
        </span>
      </div>

      {notifications.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>📭</div>
          <h3>Không có thông báo</h3>
          <p>Tất cả thông báo của bạn sẽ xuất hiện ở đây</p>
        </div>
      ) : (
        notifications.map(notification => (
          <div
            key={notification.id}
            style={{
              ...styles.notificationCard,
              ...(notification.read ? styles.notificationRead : styles.notificationUnread)
            }}
            onClick={() => markAsRead(notification.id)}
          >
            <div style={styles.notificationHeader}>
              <h3 style={styles.notificationTitle}>
                <span style={getBadgeStyle(notification.type)}>
                  {getBadgeText(notification.type)}
                </span>
                {notification.title}
                {!notification.read && (
                  <span style={{...styles.badgeUnread, marginLeft: '8px'}}>MỚI</span>
                )}
              </h3>
              <span style={styles.notificationTime}>{notification.time}</span>
            </div>
            <p style={styles.notificationMessage}>{notification.message}</p>
            <button
              style={{
                ...styles.actionButton,
                backgroundColor: 'transparent',
                color: '#dc3545',
                border: '1px solid #dc3545',
                padding: '4px 12px',
                fontSize: '12px'
              }}
              onClick={(e) => {
                e.stopPropagation();
                deleteNotification(notification.id);
              }}
            >
              Xóa
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default Notification;