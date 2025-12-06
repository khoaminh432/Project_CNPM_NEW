// PassengerCard.jsx
import React from 'react';
import './styleComponent.css';


const PassengerCard = () => {
  return (
    <div className="passenger-card">
      <div className="avatar-section">
        <div className="avatar">
          <img 
            src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRH4dN5p1dvn_qZmC7f4PW0-4b_O8lx9g5aJQULXzcH7LYZZIihWwmA6WY&s'
            alt="Nguyễn Văn A" 
          />
        </div>
        <h1 className="passenger-name">Nguyễn Văn A</h1>
      </div>
      
      <div className="info-section">
        <div className="info-item">
          <div className="icon-wrapper">
            <svg className="icon bus-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z"/>
            </svg>
          </div>
          <span className="info-text">Tuyến số: 1</span>
        </div>
        
        <div className="info-item">
          <div className="icon-wrapper">
            <svg className="icon location-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
          </div>
          <span className="info-text">455 Hồng Bàng</span>
        </div>
        
        <div className="info-item">
          <div className="icon-wrapper">
            <svg className="icon time-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
            </svg>
          </div>
          <span className="info-text">6:55</span>
        </div>
      </div>
      
      <div className="button-section">
        <button className="detail-button">
          <svg className="button-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
          </svg>
          Xem chi tiết
        </button>
      </div>
    </div>
  )

};

export default PassengerCard;