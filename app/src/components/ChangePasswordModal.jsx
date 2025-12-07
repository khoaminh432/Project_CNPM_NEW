import React, { useState } from 'react';
import '../Assets/CSS/mainpage.css';

export default function ChangePasswordModal({ isOpen, onClose, onSuccess }) {
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [popup, setPopup] = useState({
    show: false,
    type: '',
    title: '',
    message: ''
  });

  const handlePasswordFormChange = (field, value) => {
    setPasswordForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const showPopup = (type, title, message) => {
    setPopup({ show: true, type, title, message });
    setTimeout(() => {
      setPopup({ show: false, type: '', title: '', message: '' });
    }, 3000);
  };

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showPopup('error', 'Lỗi', 'Mật khẩu mới không khớp!');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      showPopup('error', 'Lỗi', 'Mật khẩu mới phải có ít nhất 6 ký tự!');
      return;
    }

    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        showPopup('error', 'Lỗi', 'Không tìm thấy thông tin người dùng!');
        return;
      }

      const user = JSON.parse(userStr);
      
      const response = await fetch('http://localhost:5000/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.user_id,
          current_password: passwordForm.currentPassword,
          new_password: passwordForm.newPassword
        })
      });

      const data = await response.json();

      if (data.status === 'OK') {
        showPopup('success', 'Thành công', 'Đổi mật khẩu thành công!');
        setTimeout(() => {
          handleClose();
          if (onSuccess) onSuccess();
        }, 1500);
      } else {
        showPopup('error', 'Lỗi', data.message || 'Đổi mật khẩu thất bại!');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      showPopup('error', 'Lỗi', 'Không thể kết nối đến server!');
    }
  };

  const handleClose = () => {
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="mp-modal-overlay" onClick={handleClose}>
        <div className="mp-modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="mp-modal-header">
            <h2 className="mp-modal-title">Đổi mật khẩu</h2>
            <button className="mp-modal-close" onClick={handleClose}>×</button>
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
            <button className="mp-btn-cancel" onClick={handleClose}>
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

      {/* Popup Notification */}
      {popup.show && (
        <div className="mp-popup-overlay">
          <div className={`mp-popup mp-popup-${popup.type}`}>
            <h3>{popup.title}</h3>
            <p>{popup.message}</p>
          </div>
        </div>
      )}
    </>
  );
}
