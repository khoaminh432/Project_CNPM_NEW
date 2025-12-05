import React, { useState, useEffect } from "react";
import "../Assets/CSS/schedule.css";
import Header from "./Header";
import { getSchedules } from '../services/scheduleService';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import imgAvatar from "../Assets/images/imgAvatar.png";
import imgLaBus from "../Assets/images/imgLaBus.svg";
import imgEllipse1 from "../Assets/images/imgEllipse1.svg";
import imgVector from "../Assets/images/imgVector.svg";
import imgVector1 from "../Assets/images/imgVector1.svg";
import imgStar1 from "../Assets/images/imgStar1.svg";

export default function Schedule({ onNavigateToMainPage, onNavigate }) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [schedules, setSchedules] = useState([]);
  const [currentDriver, setCurrentDriver] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatuses, setSelectedStatuses] = useState(['Čưa bắt đầu', 'Đang thực hiện', 'Hoàn thành', 'Đã hủy']);
  const [showAllSchedules, setShowAllSchedules] = useState(false);
  const [popup, setPopup] = useState({ show: false, type: 'success', title: '', message: '' });

  // Show popup notification
  const showPopup = (type, title, message) => {
    setPopup({ show: true, type, title, message });
    setTimeout(() => {
      setPopup({ show: false, type: 'success', title: '', message: '' });
    }, 3000);
  };

  // Load data from database
  useEffect(() => {
    loadData();
  }, [selectedDate, showAllSchedules]);

  // Listen for profile updates (separate effect to avoid re-registering)
  useEffect(() => {
    const handleProfileUpdate = (event) => {
      console.log('Profile updated event received in schedule', event && event.detail);
      // If event includes the new name, update immediately
      try {
        const userStr = localStorage.getItem('user');
        const newName = event && event.detail && event.detail.name;
        if (userStr && newName) {
          const user = JSON.parse(userStr);
          
          // Update currentDriver display name
          setCurrentDriver(prev => prev ? { ...prev, full_name: newName } : null);
          
          // Update schedules list
          setSchedules(prev => prev.map(s => {
            if (s.driver_id && user.driver_id && String(s.driver_id) === String(user.driver_id)) {
              return { ...s, driver_name: newName };
            }
            return s;
          }));
        }
      } catch (err) {
        console.error('Error applying profile update locally:', err);
      }

      // Reload from server to ensure consistency
      loadData();
    };

    window.addEventListener('profileUpdated', handleProfileUpdate);

    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate);
    };
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      
      // Get user info from localStorage
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        console.error('No user found');
        setIsLoading(false);
        return;
      }

      const user = JSON.parse(userStr);
      
      // Set current driver info
      if (user.role === 'driver') {
        setCurrentDriver({
          full_name: user.name || 'Driver',
          driver_code: user.driver_id || 'N/A',
          rating: user.rating || '5.0',
          profile_image_url: user.profile_image
        });
        
        // Fetch schedules for this driver
        const data = showAllSchedules 
          ? await getSchedules(null, user.driver_id) 
          : await getSchedules(selectedDate, user.driver_id);
        
        if (data.success) {
          setSchedules(data.schedules);
        } else {
          console.error('Failed to load schedules:', data.message);
          setSchedules([]);
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setSchedules([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Chưa bắt đầu': 
      case 'scheduled': 
        return 'sc-item-not-started';
      case 'Đang thực hiện':
      case 'in_progress': 
        return 'sc-item-in-progress';
      case 'Hoàn thành':
      case 'completed': 
        return 'sc-item-completed';
      case 'Đã hủy':
      case 'cancelled': 
        return 'sc-item-cancelled';
      default: 
        return 'sc-item-not-started';
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return '--:--';
    return timeString.substring(0, 5); // Convert HH:MM:SS to HH:MM
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const days = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    const dayName = days[date.getDay()];
    return `${dayName}, ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const handleStatusToggle = (statusText) => {
    setSelectedStatuses(prev => {
      if (prev.includes(statusText)) {
        // Remove status if already selected
        return prev.filter(s => s !== statusText);
      } else {
        // Add status if not selected
        return [...prev, statusText];
      }
    });
  };

  const normalizeStatus = (status) => {
    switch (status) {
      case 'scheduled':
      case 'Chưa bắt đầu':
        return 'Chưa bắt đầu';
      case 'in_progress':
      case 'Đang thực hiện':
        return 'Đang thực hiện';
      case 'completed':
      case 'Hoàn thành':
        return 'Hoàn thành';
      case 'cancelled':
      case 'Đã hủy':
        return 'Đã hủy';
      default:
        return 'Chưa bắt đầu';
    }
  };

  const filteredSchedules = schedules.filter(schedule => 
    selectedStatuses.includes(normalizeStatus(schedule.status))
  );

  const handleNavigate = (page) => {
    if (page === "mainpage" && onNavigateToMainPage) {
      onNavigateToMainPage();
    } else if (onNavigate) {
      onNavigate(page);
    }
  };

  const handleDateClick = () => {
    setShowDatePicker(true);
  };

  const handleDateChange = (event) => {
    const newDate = event.target.value;
    setSelectedDate(newDate);
    setShowDatePicker(false);
  };

  const handleDatePickerBlur = () => {
    setShowDatePicker(false);
  };

  const handleCancelTrip = async (e, scheduleId) => {
    e.stopPropagation(); // Prevent navigation to list page
    
    if (!window.confirm('Bạn có chắc chắn muốn hủy chuyến này? Tất cả học sinh trong chuyến sẽ được đánh dấu là hủy chuyến.')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/schedules/${scheduleId}/cancel`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.status === 'OK') {
        // Reload schedules to reflect the change
        loadData();
        showPopup('success', 'Thành công', 'Hủy chuyến thành công!');
      } else {
        showPopup('error', 'Không thể hủy', data.message);
      }
    } catch (error) {
      console.error('Error cancelling trip:', error);
      showPopup('error', 'Lỗi kết nối', 'Không thể hủy chuyến. Vui lòng thử lại.');
    }
  };

  return (
    <div className="sc-root">
      {/* Header */}
      <Header 
        currentPage="schedule" 
        onNavigate={handleNavigate}
        imgEllipse1={imgEllipse1}
        imgVector={imgVector}
        imgVector1={imgVector1}
      />

      {/* Main Container */}
      <div className="sc-container">
        {/* Left Sidebar */}
        <div className="sc-left-panel">
          {/* Driver Info Card */}
          <div className="sc-driver-card">
            <div className="sc-date-section">
              <div onClick={handleDateClick} style={{ display: 'flex', alignItems: 'center', flex: 1, cursor: 'pointer' }}>
                <FontAwesomeIcon icon={faCalendar} className="sc-calendar-icon" />
                {showDatePicker ? (
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={handleDateChange}
                    onBlur={handleDatePickerBlur}
                    className="sc-date-picker"
                    autoFocus
                  />
                ) : (
                  <span className="sc-date-text">
                    {showAllSchedules ? 'Tất cả lịch trình' : formatDate(selectedDate)}
                  </span>
                )}
              </div>
              <button
                onClick={() => setShowAllSchedules(!showAllSchedules)}
                style={{
                  padding: '6px 12px',
                  backgroundColor: showAllSchedules ? '#28a745' : '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  marginLeft: '10px',
                  whiteSpace: 'nowrap'
                }}
              >
                {showAllSchedules ? 'Theo ngày' : 'Tất cả'}
              </button>
            </div>
            <div className="sc-driver-info">
              <div className="sc-driver-avatar">
                <img alt="driver avatar" src={currentDriver?.profile_image_url || imgAvatar} />
              </div>
              <div className="sc-driver-details">
                <div className="sc-driver-name-section">
                  <h3 className="sc-driver-name">{currentDriver?.full_name || 'Driver'}</h3>
                  
                </div>
                <p className="sc-driver-id">{currentDriver?.driver_code || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Status Legend */}
          <div className="sc-status-legend">
            <h3 className="sc-legend-title">Lọc trạng thái</h3>
            <div className="sc-legend-items">
              <div 
                className={`sc-legend-item ${selectedStatuses.includes('Chưa bắt đầu') ? 'active' : 'inactive'}`}
                onClick={() => handleStatusToggle('Chưa bắt đầu')}
                style={{ cursor: 'pointer' }}
              >
                <div className="sc-legend-color sc-color-red"></div>
                <span className="sc-legend-text">Chưa bắt đầu</span>
              </div>
              <div 
                className={`sc-legend-item ${selectedStatuses.includes('Đang thực hiện') ? 'active' : 'inactive'}`}
                onClick={() => handleStatusToggle('Đang thực hiện')}
                style={{ cursor: 'pointer' }}
              >
                <div className="sc-legend-color sc-color-green"></div>
                <span className="sc-legend-text">Đang thực hiện</span>
              </div>
              <div 
                className={`sc-legend-item ${selectedStatuses.includes('Hoàn thành') ? 'active' : 'inactive'}`}
                onClick={() => handleStatusToggle('Hoàn thành')}
                style={{ cursor: 'pointer' }}
              >
                <div className="sc-legend-color sc-color-blue"></div>
                <span className="sc-legend-text">Hoàn thành</span>
              </div>
              <div 
                className={`sc-legend-item ${selectedStatuses.includes('Đã hủy') ? 'active' : 'inactive'}`}
                onClick={() => handleStatusToggle('Đã hủy')}
                style={{ cursor: 'pointer' }}
              >
                <div className="sc-legend-color sc-color-gray"></div>
                <span className="sc-legend-text">Đã hủy</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Schedule Items */}
        <div className="sc-right-panel">
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#6c757d' }}>
              <p>Đang tải lịch trình...</p>
            </div>
          ) : filteredSchedules.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#6c757d' }}>
              <p style={{ fontSize: '48px', margin: '0' }}>📅</p>
              <p style={{ marginTop: '20px', fontSize: '16px' }}>
                {schedules.length === 0 ? 'Không có lịch trình cho ngày này' : 'Không có lịch trình với trạng thái đã chọn'}
              </p>
            </div>
          ) : (
            filteredSchedules.map((schedule) => (
            <div 
              key={schedule.schedule_id} 
              className={`sc-schedule-item ${getStatusClass(schedule.status)}`}
              onClick={() => onNavigate && onNavigate('list', schedule.schedule_id)}
              style={{ cursor: 'pointer' }}
            >
                <div className="sc-item-header">
                  <div className="sc-item-driver-info">
                    <div className="sc-item-avatar">
                      <img src={imgAvatar} alt="driver" />
                    </div>
                    <div className="sc-item-driver-details">
                      <p className="sc-item-driver-name">{schedule.driver_name}</p>
                      <p className="sc-item-driver-route">{schedule.route_name}</p>
                    </div>
                  </div>
                  <img src={imgLaBus} alt="bus" className="sc-bus-icon" />
                </div>
                <div className="sc-item-body">
                  <div className="sc-item-date-row">
                    <FontAwesomeIcon icon={faCalendar} style={{ marginRight: '8px', color: '#6c757d' }} />
                    <span className="sc-item-date-text">{formatDate(schedule.schedule_date)}</span>
                  </div>
                  <div className="sc-item-time-section">
                    <div className="sc-time-group">
                      <span className="sc-time-label">Thời gian bắt đầu:</span>
                      <span className="sc-time-value">{formatTime(schedule.planned_start)}</span>
                    </div>
                    <div className="sc-time-group">
                      <span className="sc-time-label">Thời gian kết thúc:</span>
                      <span className="sc-time-value">{formatTime(schedule.planned_end)}</span>
                    </div>
                    <div className="sc-time-group">
                      <span className="sc-time-label">Số lượng học sinh:</span>
                      <span className="sc-time-value">{schedule.actual_student_count || 0}</span>
                    </div>
                  </div>
                  <div className="sc-item-location">
                    <FontAwesomeIcon icon={faLocationDot} className="sc-location-icon" />
                    <span className="sc-location-text">{schedule.start_point} → {schedule.end_point}</span>
                  </div>
                  <div className="sc-item-footer">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                      <span className="sc-item-status">
                        {(schedule.status === 'scheduled' || schedule.status === 'Chưa bắt đầu') && 'Chưa bắt đầu'}
                        {(schedule.status === 'in_progress' || schedule.status === 'Đang thực hiện') && 'Đang thực hiện'}
                        {(schedule.status === 'completed' || schedule.status === 'Hoàn thành') && 'Hoàn thành'}
                        {(schedule.status === 'cancelled' || schedule.status === 'Đã hủy') && 'Đã hủy'}
                      </span>
                      {(schedule.status === 'scheduled' || schedule.status === 'Chưa bắt đầu' || 
                        schedule.status === 'in_progress' || schedule.status === 'Đang thực hiện') && (
                        <button
                          onClick={(e) => handleCancelTrip(e, schedule.schedule_id)}
                          style={{
                            padding: '6px 22px',
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '13px',
                            cursor: 'pointer',
                            marginRight: '10px'
                          }}
                        >
                          Hủy chuyến
                        </button>
                      )}
                    </div>
                    {schedule.start_time && (schedule.status === 'in_progress' || schedule.status === 'Đang thực hiện' || schedule.status === 'completed' || schedule.status === 'Hoàn thành') && (
                      <div className="sc-actual-info">
                        <div className="sc-actual-row">
                          <span className="sc-actual-label">Bắt đầu thực tế:</span>
                          <span className="sc-actual-value">{formatTime(schedule.start_time)}</span>
                        </div>
                        {(schedule.status === 'completed' || schedule.status === 'Hoàn thành') && schedule.end_time && (
                          <>
                            <div className="sc-actual-row">
                              <span className="sc-actual-label">Kết thúc thực tế:</span>
                              <span className="sc-actual-value">{formatTime(schedule.end_time)}</span>
                            </div>
                            <div className="sc-actual-row">
                              <span className="sc-actual-label">Học sinh thực tế:</span>
                              <span className="sc-actual-value">{schedule.actual_dropped_count || 0}</span>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Popup Notification */}
      {popup.show && (
        <div className="sc-popup-overlay">
          <div className={`sc-popup sc-popup-${popup.type}`}>
            <h3>{popup.title}</h3>
            <p>{popup.message}</p>
          </div>
        </div>
      )}
    </div>
  );
}
