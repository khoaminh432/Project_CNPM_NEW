import React, { useState } from "react";
import "../Assets/CSS/schedule.css";
import Header from "./Header";
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

  // Mock data for frontend preview
  const schedules = [
    {
      schedule_id: 1,
      full_name: "Nguyễn Văn A",
      route_name: "Tuyến 01 - Quận 1",
      route_code: "T01",
      planned_start: "07:00:00",
      planned_end: "08:30:00",
      total_students_expected: 25,
      status: "scheduled",
      actual_start_time: null
    },
    {
      schedule_id: 2,
      full_name: "Trần Thị B",
      route_name: "Tuyến 02 - Quận 3",
      route_code: "T02",
      planned_start: "07:30:00",
      planned_end: "09:00:00",
      total_students_expected: 30,
      status: "in_progress",
      actual_start_time: "07:32:00",
      actual_end_time: null,
      actual_students: null
    },
    {
      schedule_id: 3,
      full_name: "Lê Văn C",
      route_name: "Tuyến 03 - Quận 5",
      route_code: "T03",
      planned_start: "06:30:00",
      planned_end: "08:00:00",
      total_students_expected: 20,
      status: "completed",
      actual_start_time: "06:28:00",
      actual_end_time: "07:55:00",
      actual_students: 18
    }
  ];

  const currentDriver = {
    full_name: "Nguyễn Văn Tài Xế",
    driver_code: "TX001",
    rating: "4.85",
    profile_image_url: null
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'scheduled': return 'sc-item-not-started';
      case 'in_progress': return 'sc-item-in-progress';
      case 'completed': return 'sc-item-completed';
      case 'cancelled': return 'sc-item-cancelled';
      default: return 'sc-item-not-started';
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
            <div className="sc-date-section" onClick={handleDateClick}>
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
                <span className="sc-date-text">{formatDate(selectedDate)}</span>
              )}
            </div>
            <div className="sc-driver-info">
              <div className="sc-driver-avatar">
                <img alt="driver avatar" src={currentDriver.profile_image_url || imgAvatar} />
              </div>
              <div className="sc-driver-details">
                <div className="sc-driver-name-section">
                  <h3 className="sc-driver-name">{currentDriver.full_name}</h3>
                  <div className="sc-driver-rating">
                    <img src={imgStar1} alt="star" className="sc-star-icon" />
                    <span className="sc-rating-text">{currentDriver.rating}</span>
                  </div>
                </div>
                <p className="sc-driver-id">{currentDriver.driver_code}</p>
              </div>
            </div>
          </div>

          {/* Status Legend */}
          <div className="sc-status-legend">
            <h3 className="sc-legend-title">Trạng thái</h3>
            <div className="sc-legend-items">
              <div className="sc-legend-item">
                <div className="sc-legend-color sc-color-red"></div>
                <span className="sc-legend-text">Chưa bắt đầu</span>
              </div>
              <div className="sc-legend-item">
                <div className="sc-legend-color sc-color-green"></div>
                <span className="sc-legend-text">Đang thực hiện</span>
              </div>
              <div className="sc-legend-item">
                <div className="sc-legend-color sc-color-blue"></div>
                <span className="sc-legend-text">Hoàn thành</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Schedule Items */}
        <div className="sc-right-panel">
          {schedules.map((schedule) => (
            <div key={schedule.schedule_id} className={`sc-schedule-item ${getStatusClass(schedule.status)}`}>
                <div className="sc-item-header">
                  <div className="sc-item-driver-info">
                    <div className="sc-item-avatar">
                      <img src={imgAvatar} alt="driver" />
                    </div>
                    <div className="sc-item-driver-details">
                      <p className="sc-item-driver-name">{schedule.full_name}</p>
                      <p className="sc-item-driver-route">{schedule.route_name}</p>
                    </div>
                  </div>
                  <img src={imgLaBus} alt="bus" className="sc-bus-icon" />
                </div>
                <div className="sc-item-body">
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
                      <span className="sc-time-value">{schedule.total_students_expected}</span>
                    </div>
                  </div>
                  <div className="sc-item-location">
                    <FontAwesomeIcon icon={faLocationDot} className="sc-location-icon" />
                    <span className="sc-location-text">{schedule.route_code} - {schedule.route_name}</span>
                  </div>
                  <div className="sc-item-footer">
                    <span className="sc-item-status">
                      {schedule.status === 'scheduled' && 'Chưa bắt đầu'}
                      {schedule.status === 'in_progress' && 'Đang thực hiện'}
                      {schedule.status === 'completed' && 'Hoàn thành'}
                      {schedule.status === 'cancelled' && 'Đã hủy'}
                    </span>
                    {schedule.actual_start_time && (
                      <div className="sc-actual-info">
                        <div className="sc-actual-row">
                          <span className="sc-actual-label">Bắt đầu thực tế:</span>
                          <span className="sc-actual-value">{formatTime(schedule.actual_start_time)}</span>
                        </div>
                        {schedule.actual_end_time && (
                          <div className="sc-actual-row">
                            <span className="sc-actual-label">Kết thúc thực tế:</span>
                            <span className="sc-actual-value">{formatTime(schedule.actual_end_time)}</span>
                          </div>
                        )}
                        {schedule.actual_students !== null && schedule.actual_students !== undefined && (
                          <div className="sc-actual-row">
                            <span className="sc-actual-label">Học sinh thực tế:</span>
                            <span className="sc-actual-value">{schedule.actual_students}/{schedule.total_students_expected}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
