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
        
        // Navigate based on role
        if (data.user.role === 'admin') {
          navigate('/admin');
        } else if (data.user.role === 'driver') {
          navigate('/driver');
        } else {
          navigate('/driver'); // Default to driver for parent role
        }
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
    <div className="bus-login-page" style={{ 
      height: '100vh',
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      backgroundColor: '#f0f2f5',
      margin: 0,
      padding: 0
    }}>
      <div className="bus-login-card" style={{
        width: '100%',
        maxWidth: '400px',
        padding: '40px',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        position: 'relative',
        zIndex: 1
      }}>
        <h1 className="login-title" style={{ margin: '0 0 10px 0', fontSize: '28px', fontWeight: 'bold' }}>Đăng Nhập</h1>
        <p className="login-subtitle" style={{ margin: '0 0 30px 0', fontSize: '14px', color: '#666' }}>Smart School Bus System</p>
        <form className="login-form" onSubmit={handleLogin} style={{ width: '100%' }}>
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