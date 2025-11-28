// PassengerCard.jsx
import React from 'react';
import './styleComponent.css';

const PassengerCard = () => {
  return (
     <div class="container-student-card">
        <div class="card">
            <div class="card-header">
                <h2>Thông Tin Cá Nhân</h2>
                <p>ID: 001 - Đã xác thực</p>
            </div>
            <div class="card-body">
                <div class="info-item">
                    <div class="info-icon">
                        <i class="fas fa-user"></i>
                    </div>
                    <div class="info-content">
                        <div class="info-label">Họ và tên</div>
                        <div class="info-value">Nguyễn Văn A</div>
                    </div>
                </div>
                
                <div class="info-item">
                    <div class="info-icon">
                        <i class="fas fa-route"></i>
                    </div>
                    <div class="info-content">
                        <div class="info-label">Tuyến số</div>
                        <div class="info-value">Tuyến 1 - Trung tâm thành phố</div>
                    </div>
                </div>
                
                <div class="info-item">
                    <div class="info-icon">
                        <i class="fas fa-map-marker-alt"></i>
                    </div>
                    <div class="info-content">
                        <div class="info-label">Địa chỉ</div>
                        <div class="info-value">455 Hồng Bàng, P.11, Q.5, TP.HCM</div>
                    </div>
                </div>
                
                <div class="info-item">
                    <div class="info-icon">
                        <i class="fas fa-clock"></i>
                    </div>
                    <div class="info-content">
                        <div class="info-label">Thời gian</div>
                        <div class="info-value">6:55</div>
                    </div>
                </div>
                
                <div class="status">
                    <span class="pulse"></span>
                    <span>Trạng thái: Hoạt động</span>
                </div>
                
                <button class="detail-button">
                    <i class="fas fa-info-circle"></i> Xem chi tiết
                </button>
            </div>
        </div>
    </div>

  )
};

export default PassengerCard;