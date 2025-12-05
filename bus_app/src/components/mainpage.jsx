import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import "../Assets/CSS/mainpage.css";
import Header from "./Header";

// Import local images
import imgAvatar from "../Assets/images/imgAvatar.png";
import imgImage4 from "../Assets/images/imgImage4.png";
import imgEllipse1 from "../Assets/images/imgEllipse1.svg";
import imgVector from "../Assets/images/imgVector.svg";
import imgVector1 from "../Assets/images/imgVector1.svg";
import imgStar1 from "../Assets/images/imgStar1.svg";

export default function MainPage({ onNavigateToMap, onNavigateToSchedule, onNavigate }) {
  const [driverData, setDriverData] = useState(null);
  const [stats, setStats] = useState({ completionRate: 0, onTimeRate: 0 });
  const [loading, setLoading] = useState(true);
  const [recentActivities, setRecentActivities] = useState([]);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [popup, setPopup] = useState({ show: false, type: 'success', title: '', message: '' });

  // Show popup notification
  const showPopup = (type, title, message) => {
    setPopup({ show: true, type, title, message });
    setTimeout(() => {
      setPopup({ show: false, type: 'success', title: '', message: '' });
    }, 3000);
  };

  const handleNavigate = (page) => {
    if (page === 'schedule' && onNavigateToSchedule) {
      onNavigateToSchedule();
    } else if (page === 'profile') {
      onNavigate('profile');
    } else if (page === 'changePassword') {
      setShowChangePasswordModal(true);
    } else if (onNavigate) {
      onNavigate(page);
    }
  };

  const handleClosePasswordModal = () => {
    setShowChangePasswordModal(false);
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handlePasswordFormChange = (field, value) => {
    setPasswordForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleChangePassword = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      showPopup('warning', 'Thiếu thông tin', 'Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showPopup('error', 'Mật khẩu không khớp', 'Mật khẩu mới và xác nhận mật khẩu không khớp');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      showPopup('warning', 'Mật khẩu quá ngắn', 'Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }

    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) return;

      const user = JSON.parse(userStr);

      const response = await fetch('http://localhost:5000/api/auth/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.user_id,
          role: user.role,
          current_password: passwordForm.currentPassword,
          new_password: passwordForm.newPassword
        }),
      });

      const data = await response.json();

      if (data.success) {
        showPopup('success', 'Thành công', 'Đổi mật khẩu thành công!');
        handleClosePasswordModal();
      } else {
        showPopup('error', 'Lỗi', data.message);
      }
    } catch (error) {
      console.error('Error changing password:', error);
      showPopup('error', 'Lỗi kết nối', 'Không thể đổi mật khẩu. Vui lòng thử lại.');
    }
  };
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);

  // Calculate relative time
  const getRelativeTime = (endTime) => {
    if (!endTime) return 'Chưa xác định';
    
    const now = new Date();
    const end = new Date(endTime);
    const diffMs = now - end;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 60) {
      return `${diffMins} phút trước`;
    } else if (diffHours < 24) {
      return `${diffHours} giờ trước`;
    } else {
      return `${diffDays} ngày trước`;
    }
  };

  // Fetch driver data and statistics
  useEffect(() => {
    const fetchDriverData = async () => {
      try {
        const userStr = localStorage.getItem('user');
        if (!userStr) {
          console.error('No user found');
          setLoading(false);
          return;
        }

        const user = JSON.parse(userStr);
        const driverId = user.driver_id;

        if (!driverId) {
          console.error('No driver_id found');
          setLoading(false);
          return;
        }

        // Fetch driver info
        const driverResponse = await fetch(`http://localhost:5000/api/drivers/${driverId}`);
        const driverData = await driverResponse.json();

        if (driverData.status === 'OK') {
          setDriverData(driverData.data);
        }

        // Fetch schedule statistics
        const statsResponse = await fetch(`http://localhost:5000/api/schedules/stats/${driverId}`);
        const statsData = await statsResponse.json();

        if (statsData.status === 'OK') {
          const { completed, cancelled, total } = statsData.data;
          const completionRate = total > 0 ? ((completed / total) * 100).toFixed(1) : 0;
          const cancelRate = total > 0 ? ((cancelled / total) * 100).toFixed(1) : 0;
          
          setStats({
            completionRate,
            cancelRate,
            onTimeRate: 87.2 // Placeholder for now
          });
        }

        // Fetch recent completed schedules
        const activitiesResponse = await fetch(`http://localhost:5000/api/schedules/recent/${driverId}`);
        const activitiesData = await activitiesResponse.json();

        if (activitiesData.status === 'OK') {
          setRecentActivities(activitiesData.data);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching driver data:', error);
        setLoading(false);
      }
    };

    fetchDriverData();

    // Listen for profile updates
    const handleProfileUpdate = (event) => {
      console.log('Profile updated event received in mainpage');
      fetchDriverData();
    };

    window.addEventListener('profileUpdated', handleProfileUpdate);

    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate);
    };
  }, []);
  
  return (
    <div className="mp-root">
      {/* Header */}
      <Header 
        currentPage="mainpage" 
        onNavigate={handleNavigate}
        imgEllipse1={imgEllipse1}
        imgVector={imgVector}
        imgVector1={imgVector1}
      />

      {/* Main Content */}
      <div className="mp-container">
        {/* Left Section */}
        <div className="mp-left-panel">
          {/* Driver Profile Card */}
          <div className="mp-profile-card">
          
            
            {/* Card Content - Avatar, Info, and Bank Details */}
            <div className="mp-card-content-wrapper">
              {/* Left Section - Avatar */}
              <div 
                className="mp-card-avatar"
                onClick={() => handleNavigate('profile')}
                style={{ cursor: 'pointer' }}
              >
                <img alt="driver avatar" src={driverData?.profile_image || imgAvatar} />
              </div>
              
              {/* Center Section - Driver Info */}
              <div className="mp-card-info">
                <div className="mp-card-name-section">
                  <h2 className="mp-driver-name">{driverData?.name || 'Lê Văn A'}</h2>
                  <img alt="star" src={imgStar1} className="mp-star-icon" />
                  <span className="mp-rating">{driverData?.rating || '5.00'}</span>
                </div>
                <p className="mp-join-date">
                  {driverData?.created_at 
                    ? `Gia nhập tháng ${new Date(driverData.created_at).getMonth() + 1} ${new Date(driverData.created_at).getFullYear()}` 
                    : 'Gia nhập tháng 8 2025'
                  } | {driverData?.driver_id || 'BUSDR-023'}
                </p>
              </div>

              {/* Divider Line */}
              <div className="mp-card-divider"></div>

              {/* Right Section - Bank & Payment Info */}
              <div className="mp-card-bank-section">
                <p className="mp-card-meta">VN | Mbbank</p>
                <p className="mp-card-account">**********9667</p>
                <div className="mp-card-card-image">
                  <img alt="payment" src={imgImage4} />
                </div>
              </div>
            </div>

            {/* Bottom Section - Stats */}
            <div className="mp-card-stats">
              <div className="mp-stats-header">Hàng tháng</div>
              <div className="mp-stats-container">
                <div className="mp-stat">
                  <div className="mp-stat-value">{stats.completionRate}%</div>
                  <div className="mp-stat-label">Chuyến hoàn thành</div>
                </div>
                <div className="mp-stat">
                  <div className="mp-stat-value">{stats.onTimeRate}%</div>
                  <div className="mp-stat-label">Tỉ lệ đúng giờ</div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mp-activity-card">
            <h3 className="mp-activity-title">Hoạt động gần đây</h3>
            <div className="mp-activity-list">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity, idx) => (
                  <div key={idx} className="mp-activity-item">
                    <span className="mp-activity-time">{getRelativeTime(activity.end_time)}</span>
                    <span className="mp-activity-driver">{activity.start_point}</span>
                    <span className="mp-activity-dots">...................</span>
                    <span className="mp-activity-location">{activity.end_point}</span>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '20px', color: '#6c757d' }}>
                  <p>Chưa có hoạt động gần đây</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Section - Map */}
        <div className="mp-right-panel">
          <div className="mp-map-container">
            <MapContainer 
              center={[10.762622, 106.660172]} 
              zoom={13} 
              style={{ width: '100%', height: '100%' }}
              zoomControl={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[10.762622, 106.660172]}>
                <Popup>
                  TP. Hồ Chí Minh
                </Popup>
              </Marker>
            </MapContainer>
          </div>
          <button className="mp-map-button" onClick={() => onNavigateToMap && onNavigateToMap()}>Mở bản đồ tài xế</button>
        </div>
      </div>

      {/* Change Password Modal */}
      {showChangePasswordModal && (
        <div className="mp-modal-overlay" onClick={handleClosePasswordModal}>
          <div className="mp-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="mp-modal-header">
              <h2 className="mp-modal-title">Đổi mật khẩu</h2>
              <button className="mp-modal-close" onClick={handleClosePasswordModal}>×</button>
            </div>
            
            <div className="mp-modal-body">
              <div className="mp-form-group">
                <label className="mp-form-label">Mật khẩu hiện tại</label>
                <input
                  type="password"
                  className="mp-form-input"
                  value={passwordForm.currentPassword}
                  onChange={(e) => handlePasswordFormChange('currentPassword', e.target.value)}
                  placeholder="Nhập mật khẩu hiện tại"
                />
              </div>

              <div className="mp-form-group">
                <label className="mp-form-label">Mật khẩu mới</label>
                <input
                  type="password"
                  className="mp-form-input"
                  value={passwordForm.newPassword}
                  onChange={(e) => handlePasswordFormChange('newPassword', e.target.value)}
                  placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
                />
              </div>

              <div className="mp-form-group">
                <label className="mp-form-label">Xác nhận mật khẩu mới</label>
                <input
                  type="password"
                  className="mp-form-input"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => handlePasswordFormChange('confirmPassword', e.target.value)}
                  placeholder="Nhập lại mật khẩu mới"
                />
              </div>
            </div>

            <div className="mp-modal-footer">
              <button className="mp-btn-cancel" onClick={handleClosePasswordModal}>
                Hủy
              </button>
              <button 
                className="mp-btn-confirm" 
                onClick={handleChangePassword}
                disabled={!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}
              >
                Cập nhật
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup Notification */}
      {popup.show && (
        <div className="mp-popup-overlay">
          <div className={`mp-popup mp-popup-${popup.type}`}>
            <h3>{popup.title}</h3>
            <p>{popup.message}</p>
          </div>
        </div>
      )}
    </div>
  );
}
