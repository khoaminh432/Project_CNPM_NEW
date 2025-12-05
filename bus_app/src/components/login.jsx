import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Assets/CSS/login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [popup, setPopup] = useState({ show: false, type: 'success', title: '', message: '' });
  const navigate = useNavigate();

  // Show popup notification
  const showPopup = (type, title, message) => {
    setPopup({ show: true, type, title, message });
    setTimeout(() => {
      setPopup({ show: false, type: 'success', title: '', message: '' });
    }, 3000);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true); 

    fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: email, password: password })
    })
    .then(res => res.json())
    .then(data => {
      setIsLoading(false);
      if (data.success) {
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/home'); 
      } else {
        showPopup('error', 'Lỗi đăng nhập', data.message);
      }
    })
    .catch(err => {
      setIsLoading(false);
      console.error(err);
      showPopup('error', 'Lỗi kết nối', 'Lỗi kết nối đến server!');
    });
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">Đăng Nhập</h1>
        <p className="login-subtitle">Smart School Bus System</p>
        <form className="login-form" onSubmit={handleLogin}>
          <div className="login-input-group">
            <label className="login-label">Tên đăng nhập</label>
            <input 
              type="text" 
              className="login-input"
              placeholder="Ví dụ: ph001, tx001, admin" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="login-input-group">
            <label className="login-label">Mật khẩu</label>
            <input 
              type="password" 
              className="login-input"
              placeholder="Nhập mật khẩu..." 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button 
            type="submit" 
            className={`login-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Đang xử lý...' : 'ĐĂNG NHẬP'}
          </button>
        </form>
        <div className="login-footer">Bạn quên mật khẩu? Liên hệ nhà trường.</div>
      </div>

      {/* Popup Notification */}
      {popup.show && (
        <div className="login-popup-overlay">
          <div className={`login-popup login-popup-${popup.type}`}>
            <h3>{popup.title}</h3>
            <p>{popup.message}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;