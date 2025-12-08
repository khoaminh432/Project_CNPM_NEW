// PassengerCard.jsx
import React from 'react';
import './styleComponent.css';
import renderRoute from '../../../../renderData/RenderRoute';
const defaultStudent = {
  student_id: '001',
  name: 'Nguyễn Văn A',
  pickup_stop_name: 'Tuyến số: 1',
  pickup_address: '45 Hồng Bàng',
  pickupTime: '6:55',
  avatarUrl: null,
};

const PassengerCard = ({ Tempstudent = defaultStudent, onDetails = () => {} }) => {
  const { student_id, name, pickup_stop_name, pickup_address, pickupTime="6:55", avatarUrl } = Tempstudent;

  return (
    <article className="passenger-card">
      <header className="passenger-card__header">
        <span className="passenger-card__id">ID: {student_id}</span>
      </header>

      <div className="passenger-card__avatar-wrap">
        <div className="passenger-card__avatar">
          {avatarUrl ? (
            <img src={avatarUrl} alt={`${name} avatar`} />
          ) : (
            <div className="passenger-card__avatar-fallback">
              {name ? name.charAt(0).toUpperCase() : 'A'}
            </div>
          )}
        </div>
      </div>

      <div className="passenger-card__body">
        <h2 className="passenger-card__name">{name}</h2>

        <div className="passenger-card__info">
          <div className="info-row">
            <span className="info-icon">🚌</span>
            <span className="info-text">{pickup_stop_name}</span>
          </div>

          <div className="info-row">
            <span className="info-icon">📍</span>
            <span className="info-text">{pickup_address}</span>
          </div>

          <div className="info-row">
            <span className="info-icon">⏱️</span>
            <span className="info-text">{pickupTime}</span>
          </div>
        </div>

        <div className="passenger-card__actions">
          <button className="btn btn--primary" onClick={() => {
            onDetails(Tempstudent.student_id);
          const fetchData = async()=>{
            const data = await renderRoute.getAllRoutes()
            console.log(data)
          }
          fetchData()

          }}>Xem chi tiết</button>
        </div>
      </div>
    </article>
  );
};

export default PassengerCard;