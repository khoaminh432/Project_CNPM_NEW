// File: RouteDetailForm.jsx
import React, { useEffect, useState } from 'react';
import './style_detail_route.css';
import renderRoute from '../../../../../renderData/RenderRoute';

export const RouteDetail2 = ({ route, onClose }) => {
  const [activeTab, setActiveTab] = useState('stops');
  const [yes_route,setYesRoute] = useState(null)
  // Status configuration
  useEffect(()=>{
    const fetchData = async()=>{
      const data = await renderRoute.getRouteById(route.route_code)
      setYesRoute(data)
    }
    fetchData()
  })
  const statusConfig = {
    'Đang hoạt động': { class: 'status-active', icon: 'fa-play-circle', label: 'Đang chạy' },
    'Ngưng hoạt động': { class: 'status-inactive', icon: 'fa-stop-circle', label: 'Ngưng' },
    'Bảo trì': { class: 'status-maintenance', icon: 'fa-wrench', label: 'Bảo trì' }
  };

  // Kiểm tra dữ liệu route
  if (!yes_route) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="route-detail-modal" onClick={(e) => e.stopPropagation()}>
          <div className="form-header">
            <h2>Chi tiết tuyến đường</h2>
            <button className="close-btn" onClick={onClose} style={{color:"black"}}>
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div className="empty-state">
            <i className="fas fa-route fa-3x"></i>
            <h4>Không có dữ liệu tuyến đường</h4>
            <p>Vui lòng chọn một tuyến đường hợp lệ</p>
          </div>
        </div>
      </div>
    );
  }

  // Format time
  const formatTime = (timeString) => {
    if (!timeString) return '--:--';
    const time = new Date(`2000-01-01T${timeString}`);
    return time.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa có thông tin';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  // Render status badge
  const renderStatusBadge = (status) => {
    const config = statusConfig[status] || { class: 'status-unknown', icon: 'fa-question-circle', label: status };
    return (
      <span className={`status-badge ${config.class}`}>
        <i className={`fas ${config.icon} me-1`}></i>
        {config.label}
      </span>
    );
  };

  // Render stops tab
  const renderStopsTab = () => {
    if (!yes_route.stops || yes_route.stops.length === 0) {
      return (
        <div className="empty-tab-state">
          <i className="fas fa-map-marker-slash"></i>
          <p>Chưa có điểm dừng nào cho tuyến đường này</p>
        </div>
      );
    }

    return (
      <div className="stops-list">
        {yes_route.stops
          .sort((a, b) => a.stop_order - b.stop_order)
          .map((stop) => (
            <div key={stop.stop_id} className="stop-item">
              <div className="stop-order">
                <span>{stop.stop_order}</span>
              </div>
              <div className="stop-content">
                <div className="stop-header">
                  <h5 className="stop-name">{stop.stop_name}</h5>
                  <span className="stop-id">ID: {stop.stop_id}</span>
                </div>
                <p className="stop-address">
                  <i className="fas fa-map-marker-alt me-2"></i>
                  {stop.address || 'Chưa có địa chỉ'}
                </p>
              </div>
            </div>
          ))}
      </div>
    );
  };

  // Render buses tab
  const renderBusesTab = () => {
    if (!yes_route.buses || yes_route.buses.length === 0) {
      return (
        <div className="empty-tab-state">
          <i className="fas fa-bus-slash"></i>
          <p>Chưa có xe buýt nào được gán cho tuyến đường này</p>
        </div>
      );
    }

    return (
      <div className="buses-grid">
        {yes_route.buses.map((bus) => {
          const busStatus = bus.status || 'Ngưng hoạt động';
          const statusClass = busStatus === 'Đang hoạt động' ? 'bus-active' : 
                           busStatus === 'Đang bảo trì' ? 'bus-maintenance' : 'bus-inactive';
          
          return (
            <div key={bus.bus_id} className="bus-card">
              <div className="bus-header">
                <div className="bus-title">
                  <i className="fas fa-bus-alt me-2"></i>
                  <h4>{bus.bus_id}</h4>
                </div>
                <span className={`bus-status ${statusClass}`}>
                  {busStatus}
                </span>
              </div>
              
              <div className="bus-details">
                <div className="detail-row">
                  <i className="fas fa-car"></i>
                  <span className="label">Biển số:</span>
                  <span className="value">{bus.license_plate || 'Chưa có'}</span>
                </div>
                <div className="detail-row">
                  <i className="fas fa-users"></i>
                  <span className="label">Sức chứa:</span>
                  <span className="value">{bus.capacity || 0} chỗ</span>
                </div>
              </div>
              
              <div className="bus-actions">
                <button className="btn-action view">
                  <i className="fas fa-eye me-1"></i>
                  Xem xe
                </button>
                <button className="btn-action track">
                  <i className="fas fa-location-dot me-1"></i>
                  Theo dõi
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Render schedules tab
  const renderSchedulesTab = () => {
    if (!yes_route.schedules || yes_route.schedules.length === 0) {
      return (
        <div className="empty-tab-state">
          <i className="far fa-calendar-times"></i>
          <p>Chưa có lịch trình nào cho tuyến đường này</p>
        </div>
      );
    }

    return (
      <div className="schedules-list">
        {yes_route.schedules.map((schedule) => {
          const scheduleDate = new Date(schedule.schedule_date);
          const formattedDate = scheduleDate.toLocaleDateString('vi-VN');
          
          return (
            <div key={schedule.schedule_id} className="schedule-card">
              <div className="schedule-date">
                <div className="date-day">{scheduleDate.getDate()}</div>
                <div className="date-month">{scheduleDate.toLocaleDateString('vi-VN', { month: 'short' })}</div>
              </div>
              
              <div className="schedule-content">
                <div className="schedule-time">
                  <span className="time-start">{formatTime(schedule.start_time)}</span>
                  <i className="fas fa-arrow-right mx-2"></i>
                  <span className="time-end">{formatTime(schedule.end_time)}</span>
                </div>
                
                <div className="schedule-details">
                  <div className="detail-item">
                    <i className="fas fa-bus"></i>
                    <span>{schedule.bus_id}</span>
                  </div>
                  {schedule.driver_name && (
                    <div className="detail-item">
                      <i className="fas fa-user"></i>
                      <span>{schedule.driver_name}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="schedule-actions">
                <button className="btn-action edit">
                  <i className="fas fa-edit"></i>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Render info tab
  const renderInfoTab = () => {
    return (
      <div className="info-grid">
        <div className="info-section">
          <h5 className="info-title">
            <i className="fas fa-info-circle me-2"></i>
            Thông tin cơ bản
          </h5>
          <div className="info-list">
            <div className="info-item">
              <span className="label">Mã tuyến:</span>
              <span className="value">{yes_route.route_id}</span>
            </div>
            <div className="info-item">
              <span className="label">Tên tuyến:</span>
              <span className="value">{yes_route.route_name}</span>
            </div>
            <div className="info-item">
              <span className="label">Trạng thái:</span>
              <span className="value">{yes_route.status}</span>
            </div>
            <div className="info-item">
              <span className="label">Ngày tạo:</span>
              <span className="value">{formatDate(yes_route.created_at)}</span>
            </div>
          </div>
        </div>
        
        <div className="info-section">
          <h5 className="info-title">
            <i className="fas fa-route me-2"></i>
            Thông tin lộ trình
          </h5>
          <div className="info-list">
            <div className="info-item">
              <span className="label">Điểm bắt đầu:</span>
              <span className="value">{yes_route.start_point}</span>
            </div>
            <div className="info-item">
              <span className="label">Điểm kết thúc:</span>
              <span className="value">{yes_route.end_point}</span>
            </div>
            <div className="info-item">
              <span className="label">Giờ bắt đầu:</span>
              <span className="value">{formatTime(yes_route.planned_start)}</span>
            </div>
            <div className="info-item">
              <span className="label">Giờ kết thúc:</span>
              <span className="value">{formatTime(yes_route.planned_end)}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render active tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'stops':
        return renderStopsTab();
      case 'buses':
        return renderBusesTab();
      case 'schedules':
        return renderSchedulesTab();
      case 'info':
        return renderInfoTab();
      default:
        return renderStopsTab();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="route-detail-modal" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="header-left">
            <h2 className="modal-title">
              <i className="fas fa-route me-3"></i>
              {yes_route.route_name}
            </h2>
            <div className="modal-subtitle">
              <span className="route-id">
                <i className="fas fa-hashtag me-1"></i>
                {yes_route.route_id}
              </span>
              {renderStatusBadge(yes_route.status)}
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Main Content - Scrollable */}
        <div className="modal-content">
          {/* Route Summary */}
          <div className="route-summary">
            <div className="route-timeline">
              <div className="timeline-point start">
                <div className="point-icon">
                  <i className="fas fa-play"></i>
                </div>
                <div className="point-content">
                  <h5>Bắt đầu</h5>
                  <p className="location">{yes_route.start_point}</p>
                  <p className="time">{formatTime(yes_route.planned_start)}</p>
                </div>
              </div>
              
              <div className="timeline-connector">
                <div className="connector-line"></div>
                <div className="connector-dots">
                  <i className="fas fa-circle"></i>
                  <i className="fas fa-circle"></i>
                  <i className="fas fa-circle"></i>
                </div>
              </div>
              
              <div className="timeline-point end">
                <div className="point-icon">
                  <i className="fas fa-flag-checkered"></i>
                </div>
                <div className="point-content">
                  <h5>Kết thúc</h5>
                  <p className="location">{yes_route.end_point}</p>
                  <p className="time">{formatTime(yes_route.planned_end)}</p>
                </div>
              </div>
            </div>
            
            <div className="route-stats">
              <div className="stat-card">
                <div className="stat-icon students">
                  <i className="fas fa-user-graduate"></i>
                </div>
                <div className="stat-content">
                  <h3>{yes_route.total_students || 0}</h3>
                  <p>Học sinh</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon stops">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <div className="stat-content">
                  <h3>{yes_route.stops?.length || 0}</h3>
                  <p>Điểm dừng</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon buses">
                  <i className="fas fa-bus"></i>
                </div>
                <div className="stat-content">
                  <h3>{yes_route.buses?.length || 0}</h3>
                  <p>Xe buýt</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon schedules">
                  <i className="fas fa-calendar-alt"></i>
                </div>
                <div className="stat-content">
                  <h3>{yes_route.schedules?.length || 0}</h3>
                  <p>Lịch trình</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="tabs-container">
            <div className="tabs-header">
              <button 
                className={`tab-btn ${activeTab === 'stops' ? 'active' : ''}`}
                onClick={() => setActiveTab('stops')}
              >
                <i className="fas fa-map-marker-alt me-2"></i>
                Điểm dừng
                {yes_route.stops?.length > 0 && (
                  <span className="tab-badge">{yes_route.stops.length}</span>
                )}
              </button>
              
              <button 
                className={`tab-btn ${activeTab === 'buses' ? 'active' : ''}`}
                onClick={() => setActiveTab('buses')}
              >
                <i className="fas fa-bus me-2"></i>
                Xe buýt
                {yes_route.buses?.length > 0 && (
                  <span className="tab-badge">{yes_route.buses.length}</span>
                )}
              </button>
              
              <button 
                className={`tab-btn ${activeTab === 'schedules' ? 'active' : ''}`}
                onClick={() => setActiveTab('schedules')}
              >
                <i className="fas fa-calendar-alt me-2"></i>
                Lịch trình
                {yes_route.schedules?.length > 0 && (
                  <span className="tab-badge">{yes_route.schedules.length}</span>
                )}
              </button>
              
              <button 
                className={`tab-btn ${activeTab === 'info' ? 'active' : ''}`}
                onClick={() => setActiveTab('info')}
              >
                <i className="fas fa-info-circle me-2"></i>
                Thông tin
              </button>
            </div>
            
            <div className="tabs-content">
              {renderTabContent()}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer" style={{justifyContent:'center'}}>
         
          <div className="footer-actions">
            <button className="btn btn-outline" style={{padding:"10px",marginBottom:"20px",color:"white", background:"linear-gradient(135deg, #3498db 0%, #2980b9 100%)"}}>
              <i className="fas fa-edit me-2"></i>
              Chỉnh sửa
            </button>
            
          </div>
        </div>
      </div>
    </div>
  );
};