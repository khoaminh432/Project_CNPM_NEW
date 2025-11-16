// File: src/frontend/components/ScheduleCalendarPopup.js
import React, { useState, useEffect } from "react"; 
import {
  isSunday, isToday, isBefore, format,
  startOfDay, isSameWeek,
  startOfWeek, endOfWeek, subWeeks
} from "date-fns";
import { vi } from "date-fns/locale";
import "../QuanLyTaiXe.css"; // Dùng chung CSS
import { DAYS_OF_WEEK_MAP, DAYS_OF_WEEK_ORDER } from "./WorkScheduleCheckboxes";

export default function ScheduleCalendarPopup({ isOpen, onClose, title, driver, showWeekTab = true, drivers = [], defaultTab = "month" }) {
  
  const driverScheduleSet = new Set(driver?.work_schedule?.split(',') || []);
  
  const [activeTab, setActiveTab] = useState(defaultTab);
  useEffect(() => {
    if (isOpen) {
      setActiveTab(defaultTab);
    }
  }, [isOpen, defaultTab]);

  const [scheduleSummary, setScheduleSummary] = useState(null);

  useEffect(() => {
    if (isOpen && !driver) { 
      const summary = {
        MON: [], TUE: [], WED: [], THU: [], FRI: [], SAT: [], SUN: []
      };
      for (const d of drivers) {
        if (d.work_schedule) {
          d.work_schedule.split(',').forEach(dayKey => {
            if (summary[dayKey]) {
              summary[dayKey].push(d);
            }
          });
        }
      }
      setScheduleSummary(summary);
    } else if (!isOpen) {
      setScheduleSummary(null);
    }
  }, [isOpen, driver, drivers]); 
  
  const [selectedDay, setSelectedDay] = useState(null);
  const [showDayPopup, setShowDayPopup] = useState(false);
  const today = new Date();
  const todayStart = startOfDay(today);
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedWeekOffset, setSelectedWeekOffset] = useState(0);
  const monthNames = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];
  const holidays = ["1-1", "30-4", "1-5", "2-9", "25-12"];

  let weekData;
  if (driver) {
    weekData = DAYS_OF_WEEK_ORDER.map(dayKey => ({
        day: DAYS_OF_WEEK_MAP[dayKey],
        drivers: driverScheduleSet.has(dayKey) ? [driver] : []
    }));
  } else if (scheduleSummary) {
    weekData = DAYS_OF_WEEK_ORDER.map(dayKey => ({
      day: DAYS_OF_WEEK_MAP[dayKey],
      drivers: scheduleSummary[dayKey] || []
    }));
  } else {
    weekData = DAYS_OF_WEEK_ORDER.map(dayKey => ({ day: DAYS_OF_WEEK_MAP[dayKey], drivers: [] }));
  }

  const displayedWeekData = selectedWeekOffset === 0
      ? weekData
      : [...weekData].reverse();

  
  const changeMonth = (offset) => {
    let newMonth = currentMonth + offset;
    let newYear = currentYear;
    if (newMonth < 0) { newMonth = 11; newYear--; }
    else if (newMonth > 11) { newMonth = 0; newYear++; }
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };
  const weekOptions = [];
  const numberOfWeeksToShow = 26; 
  for (let offset = 0; offset < numberOfWeeksToShow; offset++) {
    if (offset === 0) { weekOptions.push({ value: 0, label: "Tuần hiện tại" }); }
    else {
      const targetWeekStart = startOfWeek(subWeeks(today, offset), { locale: vi });
      const targetWeekEnd = endOfWeek(subWeeks(today, offset), { locale: vi });
      weekOptions.push({ value: offset, label: `Tuần ${format(targetWeekStart, "dd/MM")} - ${format(targetWeekEnd, "dd/MM")}` });
    }
  }
  
  if (!isOpen) { return null; }
  
  return (
    <>
      <div className="popup-overlay">
        <div className="popup large-popup" style={{ width: '800px' }}>
          <div className="popup-header">
            <h2>{title}</h2>
            <button className="close-btn" onClick={onClose}>✖</button>
          </div>
          {showWeekTab && (
            <div className="tabs">
              <button className={`tab ${activeTab === "month" ? "active" : ""}`} onClick={() => setActiveTab("month")}>Lịch tháng</button>
              <button className={`tab ${activeTab === "week" ? "active" : ""}`} onClick={() => setActiveTab("week")}>Danh sách tuần</button>
            </div>
          )}
          {activeTab === "month" && (
            <div className="calendar-container">
              <div className="calendar-header">
                <button className="month-nav" onClick={() => changeMonth(-1)}>←</button>
                <h3>{monthNames[currentMonth]} {currentYear}</h3>
                <button className="month-nav" onClick={() => changeMonth(1)}>→</button>
              </div>
              <div className="calendar-grid">
                {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((d, i) => (<div key={i} className="calendar-day-header">{d}</div>))}
                {
                  (() => {
                    const allDaysForGrid = [];
                    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
                    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
                    const startDayOfWeek = firstDayOfMonth.getDay();
                    const paddingCount = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;
                    for (let i = paddingCount; i > 0; i--) { allDaysForGrid.push({ date: new Date(currentYear, currentMonth, 1 - i), isCurrentMonth: false }); }
                    for (let d = 1; d <= lastDayOfMonth.getDate(); d++) { allDaysForGrid.push({ date: new Date(currentYear, currentMonth, d), isCurrentMonth: true }); }
                    const endDayOfWeek = lastDayOfMonth.getDay();
                    const nextMonthDaysCount = endDayOfWeek === 0 ? 0 : 7 - endDayOfWeek;
                    for (let i = 1; i <= nextMonthDaysCount; i++) { allDaysForGrid.push({ date: new Date(currentYear, currentMonth + 1, i), isCurrentMonth: false }); }
                    
                    return allDaysForGrid.map((dayData, index) => {
                      const { date, isCurrentMonth } = dayData;
                      const isPastDay = isBefore(date, todayStart);
                      const isTodayDay = isToday(date);
                      const isSundayDay = isSunday(date);
                      const holidayKey = `${date.getDate()}-${date.getMonth() + 1}`;
                      const isHolidayDay = holidays.includes(holidayKey);
                      
                      const dayKey = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][date.getDay()];
                      
                      let registrations = 0;
                      let driversForThisDay = [];
                      
                      if (driver) { // Chế độ CÁ NHÂN
                        const isDriverWorking = driverScheduleSet.has(dayKey);
                        registrations = isDriverWorking ? 1 : 0;
                        driversForThisDay = isDriverWorking ? [driver] : [];
                      } else if (scheduleSummary) { // Chế độ CHUNG
                        driversForThisDay = scheduleSummary[dayKey] || [];
                        registrations = driversForThisDay.length;
                      }

                      let cellClass = "calendar-day";
                      if (isCurrentMonth) {
                        if (isPastDay || isTodayDay) {
                          cellClass += " past"; 
                        } 
                        else if (registrations > 0) {
                          cellClass += " this-week"; 
                        } 
                        else if (isHolidayDay || isSundayDay) {
                          cellClass += " holiday";
                        }
                      } else {
                        cellClass += " other-month";
                      }
                      
                      const canClick = isCurrentMonth && registrations > 0;
                      
                      // === 🔹 CẬP NHẬT LOGIC Ở ĐÂY ===
                      // Chỉ hiện số lượng khi (có đăng ký) VÀ (đang ở chế độ chung !driver)
                      const shouldShowReg = isCurrentMonth && registrations > 0 && !driver;
                      // ==============================
                      
                      return (
                        <div
                          key={index}
                          className={cellClass}
                          onClick={() => {
                            if (isCurrentMonth) {
                              if (canClick) {
                                setSelectedDay({ date: date, registrations, drivers: driversForThisDay });
                                setShowDayPopup(true);
                              }
                              else if (!canClick && !(isPastDay || isTodayDay)) { 
                                if (driver) {
                                  alert("Tài xế không có lịch làm việc cố định vào ngày này.");
                                } else {
                                  alert("Không có tài xế nào đăng ký làm việc vào ngày này.");
                                }
                              }
                            } else {
                              const clickedMonth = date.getMonth();
                              const clickedYear = date.getFullYear();
                              if (clickedYear < currentYear || (clickedYear === currentYear && clickedMonth < currentMonth)) { changeMonth(-1); }
                              if (clickedYear > currentYear || (clickedYear === currentYear && clickedMonth > currentMonth)) { changeMonth(+1); }
                            }
                          }}
                        >
                          <span className="day-number">
                            {isCurrentMonth
                              ? date.getDate()
                              : `${date.getDate()}/${date.getMonth() + 1}`
                            }
                          </span>
                          {shouldShowReg && (
                            <span className="reg-count">{registrations}</span>
                          )}
                        </div>
                      );
                    });
                  })()
                }
              </div>
            </div>
          )}
          {activeTab === "week" && (
            <div className="week-view-table">
              <div className="week-selector-bar">
                <label htmlFor="week-select">Chọn tuần:</label>
                <select
                  id="week-select"
                  className="week-select-dropdown"
                  value={selectedWeekOffset}
                  onChange={(e) => setSelectedWeekOffset(Number(e.target.value))}
                >
                  {weekOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <table className="week-schedule-table">
                <thead>
                  <tr>
                    {displayedWeekData.map((w, i) => (
                      <th key={i}>{w.day}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {displayedWeekData.map((w, i) => (
                      <td key={i}>
                        {w.drivers.length > 0 ? (
                          <ul className="driver-list-vertical">
                            {w.drivers.slice(0, 4).map((d, idx) => (
                              <li key={idx} title={`${d.id} - ${d.name}`}>{d.name}</li>
                            ))}
                            {w.drivers.length > 4 && (
                              <li style={{ fontStyle: 'italic' }}>...và {w.drivers.length - 4} người khác</li>
                            )}
                          </ul>
                        ) : (
                          <span className="no-registration-table">Không có lịch</span>
                        )}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      {showDayPopup && selectedDay && (
        <div className="popup-overlay small">
          <div className="popup small-popup">
            <div className="popup-header">
              <h3>Danh sách tài xế ({format(selectedDay.date, "dd/MM/yyyy")})</h3>
              <button className="close-btn" onClick={() => setShowDayPopup(false)}>✖</button>
            </div>
            <table className="day-table">
              <thead>
                <tr>
                  <th>Mã tài xế</th>
                  <th>Tên</th>
                  <th>SĐT</th>
                  <th>Hạng Bằng Lái</th>
                </tr>
              </thead>
              <tbody>
                {selectedDay.drivers.map((d, i) => (
                  <tr key={i}>
                    <td>{d.id}</td>
                    <td>{d.name}</td>
                    <td>{d.phone}</td>
                    <td>{d.licenseClass}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}