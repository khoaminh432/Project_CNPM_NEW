import React, { useState, useEffect } from "react"; 
import {
  isSunday, isToday, isBefore, format,
  startOfDay, isSameWeek,
  startOfWeek, endOfWeek, subWeeks
} from "date-fns";
import { vi } from "date-fns/locale";
import "./QuanLyTaiXe.css";
import NextWeekScheduler from "./NextWeekScheduler";

// ===================================================================
// == 🔹 COMPONENT POPUP THÊM MỚI 
// ===================================================================
function DriverFormPopup({ isOpen, onClose, drivers }) {

  const title = "Thêm tài xế mới";
  const [formData, setFormData] = useState({ id: "", name: "", phone: "", address: "", status: "Rảnh", route: "", licenseClass: "B2" });

  useEffect(() => {
    if (isOpen) {
      const currentIds = drivers.map(d => parseInt(d.id.replace('TX', ''), 10));
      const maxId = currentIds.length > 0 ? Math.max(...currentIds) : 0;
      const newIdNumber = maxId + 1;
      const newId = `TX${String(newIdNumber).padStart(3, '0')}`;
      
      setFormData({
        id: newId, 
        name: "", 
        phone: "", 
        address: "",
        status: "Rảnh", 
        route: "", 
        licenseClass: "B2",
      });
    }
  }, [isOpen, drivers]); 


  if (!isOpen) {
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value, }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Đã lưu (giả lập - Thêm mới):\n" + JSON.stringify(formData, null, 2));
    onClose(); 
  };

  return (
    <div className="popup-overlay">
      <div className="popup driver-form-popup">
        <div className="popup-header">
          <h2>{title}</h2> 
          <button className="close-btn" onClick={onClose}>✖</button>
        </div>

        <form onSubmit={handleSubmit} className="driver-form-content">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="add-id">Mã tài xế</label>
              <input
                type="text" id="add-id" name="id"
                value={formData.id}
                readOnly 
                className="readonly-input" 
              />
            </div>
            <div className="form-group">
              <label htmlFor="add-name">Họ tên</label>
              <input
                type="text" id="add-name" name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
             <div className="form-group">
              <label htmlFor="add-phone">Số điện thoại</label>
              <input
                type="tel" id="add-phone" name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="add-address">Địa chỉ</label>
              <input
                type="text" id="add-address" name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="add-status">Trạng thái</label>
              <select
                id="add-status" name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Đang hoạt động">Đang hoạt động</option>
                <option value="Rảnh">Rảnh</option>
                <option value="Nghỉ phép">Nghỉ phép</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="add-route">Tuyến đường phụ trách</label>
              <input
                type="text" id="add-route" name="route"
                value={formData.route}
                onChange={handleChange}
              />
            </div>
            <div className="form-group full-width">
              <label htmlFor="add-license">Hạng bằng lái</label>
              <select
                id="add-license" name="licenseClass"
                value={formData.licenseClass}
                onChange={handleChange}
              >
                <option value="B1">B1 (Xe số tự động)</option>
                <option value="B2">B2 (Xe số sàn)</option>
                <option value="C">C (Xe tải)</option>
                <option value="D">D (Xe khách 10-30 chỗ)</option>
                <option value="E">E (Xe khách trên 30 chỗ)</option>
              </select>
            </div>
          </div>
          
          <div className="popup-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>Hủy</button>
            <button type="submit" className="btn-save">Lưu lại</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ===================================================================
// == 🔹 COMPONENT POPUP XEM CHI TIẾT
// ===================================================================
function DriverViewPopup({ isOpen, onClose, driverData }) {
  if (!isOpen || !driverData) return null;

  return (
    <div className="popup-overlay">
      <div className="popup driver-view-popup"> 
        <div className="popup-header">
          <h2>Thông tin tài xế: {driverData.name}</h2>
          <button className="close-btn" onClick={onClose}>✖</button>
        </div>
        
        <div className="driver-view-content">
          <div className="view-group">
            <strong>Mã tài xế:</strong>
            <span>{driverData.id}</span>
          </div>
          <div className="view-group">
            <strong>Họ tên:</strong>
            <span>{driverData.name}</span>
          </div>
          <div className="view-group">
            <strong>Số điện thoại:</strong>
            <span>{driverData.phone}</span>
          </div>
          <div className="view-group">
            <strong>Địa chỉ:</strong>
            <span>{driverData.address}</span>
          </div>
          <div className="view-group">
            <strong>Trạng thái:</strong>
            <span>{driverData.status}</span>
          </div>
          <div className="view-group">
            <strong>Tuyến đường:</strong>
            <span>{driverData.route}</span>
          </div>
          <div className="view-group">
            <strong>Hạng bằng lái:</strong>
            <span>{driverData.licenseClass}</span>
          </div>
          <div className="view-group">
            <strong>Số chuyến/tuần:</strong>
            <span>{driverData.weeklyTrips}</span>
          </div>
        </div>
        
        <div className="popup-footer">
          <button type="button" className="btn-cancel" onClick={onClose}>Đóng</button>
        </div>
      </div>
    </div>
  );
}

// ===================================================================
// == COMPONENT POPUP CHỈNH SỬA 
// ===================================================================
function DriverEditPopup({ isOpen, onClose, drivers }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [driverFound, setDriverFound] = useState(false);
  const [formData, setFormData] = useState(null); 

  useEffect(() => {
    setSearchTerm("");
    setSearchResults([]);
    setShowDropdown(false);
    setDriverFound(false);
    setFormData(null);
  }, [isOpen]);

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    setDriverFound(false);
    setFormData(null);

    if (term.trim() === "") {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    const filteredDrivers = drivers.filter(driver => 
      driver.id.toLowerCase().includes(term.toLowerCase()) ||
      driver.name.toLowerCase().includes(term.toLowerCase())
    );

    setSearchResults(filteredDrivers);
    setShowDropdown(filteredDrivers.length > 0);
  };

  const handleResultClick = (driver) => {
    setSearchTerm(driver.id); 
    setFormData({ ...driver }); 
    setDriverFound(true);       
    setSearchResults([]);       
    setShowDropdown(false);     
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!driverFound) return;
    alert("Đã lưu (giả lập - Chỉnh sửa):\n" + JSON.stringify(formData, null, 2));
    onClose();
  };

  const handleDelete = () => {
    if (!driverFound) return;
    
    if (window.confirm(`Bạn có chắc chắn muốn xóa tài xế ${formData.name} (Mã: ${formData.id}) không?`)) {
      alert(`Đã xóa (giả lập) tài xế: ${formData.id}`);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup driver-form-popup" style={{ width: '600px' }}>
        <div className="popup-header">
          <h2>Chỉnh sửa thông tin tài xế</h2>
          <button className="close-btn" onClick={onClose}>✖</button>
        </div>

        <form onSubmit={handleSubmit} className="driver-form-content">
          
          <div className="search-to-edit-group">
            <label htmlFor="search-id">Tìm tài xế (theo Mã hoặc Tên)</label>
            
            <div className="search-bar"> 
              <input
                type="text"
                id="search-id"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Nhập mã hoặc tên tài xế..."
                autoComplete="off" 
                onBlur={() => {
                  setTimeout(() => setShowDropdown(false), 200);
                }}
                onFocus={handleSearchChange} 
              />
              {showDropdown && searchResults.length > 0 && (
                <ul className="search-results-dropdown">
                  {searchResults.map(driver => (
                    <li 
                      key={driver.id} 
                      className="search-result-item"
                      onMouseDown={() => handleResultClick(driver)}
                    >
                      {/* === THÊM MỚI: ICON KÍNH LÚP === */}
                      <svg className="search-result-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                      </svg>
                      {/* Bọc text trong <span> để căn chỉnh */}
                      <span>{driver.id} - {driver.name}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          
          <hr className="form-divider" />

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="edit-name">Họ tên</label>
              <input
                type="text" id="edit-name" name="name"
                value={formData?.name || ''}
                onChange={handleChange}
                disabled={!driverFound}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="edit-phone">Số điện thoại</label>
              <input
                type="tel" id="edit-phone" name="phone"
                value={formData?.phone || ''}
                onChange={handleChange}
                disabled={!driverFound}
              />
            </div>
            <div className="form-group full-width">
              <label htmlFor="edit-address">Địa chỉ</label>
              <input
                type="text" id="edit-address" name="address"
                value={formData?.address || ''}
                onChange={handleChange}
                disabled={!driverFound}
              />
            </div>
            <div className="form-group">
              <label htmlFor="edit-status">Trạng thái</label>
              <select
                id="edit-status" name="status"
                value={formData?.status || 'Rảnh'}
                onChange={handleChange}
                disabled={!driverFound}
              >
                <option value="Đang hoạt động">Đang hoạt động</option>
                <option value="Rảnh">Rảnh</option>
                <option value="Nghỉ phép">Nghỉ phép</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="edit-route">Tuyến đường phụ trách</label>
              <input
                type="text" id="edit-route" name="route"
                value={formData?.route || ''}
                onChange={handleChange}
                disabled={!driverFound}
              />
            </div>
            <div className="form-group full-width">
              <label htmlFor="edit-license">Hạng bằng lái</label>
              <select
                id="edit-license" name="licenseClass"
                value={formData?.licenseClass || 'B2'}
                onChange={handleChange}
                disabled={!driverFound}
              >
                <option value="B1">B1 (Xe số tự động)</option>
                <option value="B2">B2 (Xe số sàn)</option>
                <option value="C">C (Xe tải)</option>
                <option value="D">D (Xe khách 10-30 chỗ)</option>
                <option value="E">E (Xe khách trên 30 chỗ)</option>
              </select>
            </div>
          </div>
          
          <div className="popup-footer space-between">
            <button 
                type="button" 
                className="btn-delete" 
                onClick={handleDelete}
                disabled={!driverFound}
            >
                Xóa tài xế
            </button>
            
            <div className="footer-right-buttons">
                <button type="button" className="btn-cancel" onClick={onClose}>Hủy</button>
                <button type="submit" className="btn-save" disabled={!driverFound}>Lưu lại</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}


// ===================================================================
// == 🔹 COMPONENT POPUP LỊCH (Không thay đổi)
// ===================================================================
function ScheduleCalendarPopup({ isOpen, onClose, title, driver, showWeekTab = true }) {
  const [activeTab, setActiveTab] = useState("month");
  const [selectedDay, setSelectedDay] = useState(null);
  const [showDayPopup, setShowDayPopup] = useState(false);
  const today = new Date();
  const todayStart = startOfDay(today);
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedWeekOffset, setSelectedWeekOffset] = useState(0);
  const monthNames = [
    "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4",
    "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8",
    "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
  ];
  const holidays = ["1-1", "30-4", "1-5", "2-9", "25-12"];
  const allWeekData = [
    { day: "Thứ 2", drivers: ["TX01 - Nguyễn Văn A", "TX03 - Phạm Văn C"] },
    { day: "Thứ 3", drivers: ["TX02 - Lê Thị B"] },
    { day: "Thứ 4", drivers: ["TX01 - Nguyễn Văn A"] },
    { day: "Thứ 5", drivers: [] },
    { day: "Thứ 6", drivers: ["TX03 - Phạm Văn C"] },
    { day: "Thứ 7", drivers: ["TX02 - Lê Thị B", "TX01 - Nguyễn Văn A"] },
    { day: "Chủ nhật", drivers: [] },
  ];
  const weekData = driver
    ? allWeekData.map(dayData => ({
      ...dayData,
      drivers: dayData.drivers.filter(driverName => driverName.includes(driver.id))
    }))
    : allWeekData;
  const displayedWeekData = selectedWeekOffset === 0
    ? weekData
    : [...weekData].reverse();
  const allDriversForDay = [
    { id: "TX01", name: "Nguyễn Văn A", vehicleId: "XE001", plate: "51B-12345", route: "Q1 - Q5" },
    { id: "TX02", name: "Lê Thị B", vehicleId: "XE002", plate: "51C-67890", route: "Q3 - Q7" },
    { id: "TX03", name: "Phạm Văn C", vehicleId: "XE003", plate: "50A-45678", route: "Q10 - Tân Bình" },
  ];
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
    if (offset === 0) {
      weekOptions.push({ value: 0, label: "Tuần hiện tại" });
    } else {
      const targetWeekStart = startOfWeek(subWeeks(today, offset), { locale: vi });
      const targetWeekEnd = endOfWeek(subWeeks(today, offset), { locale: vi });
      weekOptions.push({
        value: offset,
        label: `Tuần ${format(targetWeekStart, "dd/MM")} - ${format(targetWeekEnd, "dd/MM")}`
      });
    }
  }
  if (!isOpen) {
    return null;
  }
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
              <button
                className={`tab ${activeTab === "month" ? "active" : ""}`}
                onClick={() => setActiveTab("month")}
              >Lịch tháng</button>
              <button
                className={`tab ${activeTab === "week" ? "active" : ""}`}
                onClick={() => setActiveTab("week")}
              >Danh sách tuần</button>
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
                {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((d, i) => (
                  <div key={i} className="calendar-day-header">{d}</div>
                ))}
                {
                  (() => {
                    const allDaysForGrid = [];
                    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
                    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
                    const startDayOfWeek = firstDayOfMonth.getDay();
                    const paddingCount = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;
                    for (let i = paddingCount; i > 0; i--) {
                      allDaysForGrid.push({ date: new Date(currentYear, currentMonth, 1 - i), isCurrentMonth: false });
                    }
                    for (let d = 1; d <= lastDayOfMonth.getDate(); d++) {
                      allDaysForGrid.push({ date: new Date(currentYear, currentMonth, d), isCurrentMonth: true });
                    }
                    const endDayOfWeek = lastDayOfMonth.getDay();
                    const nextMonthDaysCount = endDayOfWeek === 0 ? 0 : 7 - endDayOfWeek;
                    for (let i = 1; i <= nextMonthDaysCount; i++) {
                      allDaysForGrid.push({ date: new Date(currentYear, currentMonth + 1, i), isCurrentMonth: false });
                    }
                    return allDaysForGrid.map((dayData, index) => {
                      const { date, isCurrentMonth } = dayData;
                      const isPastDay = isBefore(date, todayStart);
                      const isTodayDay = isToday(date);
                      const isSundayDay = isSunday(date);
                      const holidayKey = `${date.getDate()}-${date.getMonth() + 1}`;
                      const isHolidayDay = holidays.includes(holidayKey);
                      const isInCurrentWeek = isSameWeek(date, today, { locale: vi });
                      const isFutureDay = !isPastDay && !isTodayDay;
                      const registrations = isCurrentMonth
                        ? (driver ? Math.floor(Math.random() * 3) : Math.floor(Math.random() * 8))
                        : 0;
                      let cellClass = "calendar-day";
                      let hasColor = false;
                      if (isCurrentMonth) {
                        if (isHolidayDay || isSundayDay) { cellClass += " holiday"; hasColor = true; }
                        else if (isPastDay || isTodayDay) { cellClass += " past"; hasColor = true; }
                        else if (isInCurrentWeek && isFutureDay) { cellClass += " this-week"; hasColor = true; }
                      } else {
                        cellClass += " other-month";
                      }
                      const canClick = registrations > 0;
                      const shouldShowReg = isCurrentMonth && hasColor && registrations > 0;
                      return (
                        <div
                          key={index}
                          className={cellClass}
                          onClick={() => {
                            if (isCurrentMonth) {
                              if (canClick) {
                                const driversForDay = driver
                                  ? allDriversForDay.filter(d => d.id === driver.id)
                                  : allDriversForDay;
                                setSelectedDay({
                                  date: date,
                                  registrations,
                                  drivers: driversForDay.slice(0, registrations),
                                });
                                setShowDayPopup(true);
                              }
                              else if (!hasColor) {
                                alert("Ngày này chưa được sắp xếp lịch.");
                              }
                            } else {
                              const clickedMonth = date.getMonth();
                              const clickedYear = date.getFullYear();
                              if (clickedYear < currentYear || (clickedYear === currentYear && clickedMonth < currentMonth)) {
                                changeMonth(-1);
                              }
                              if (clickedYear > currentYear || (clickedYear === currentYear && clickedMonth > currentMonth)) {
                                changeMonth(+1);
                              }
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
          {showWeekTab && activeTab === "week" && (
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
                            {w.drivers.map((driverName, idx) => (
                              <li key={idx}>{driverName}</li>
                            ))}
                          </ul>
                        ) : (
                          <span className="no-registration-table">Không có đăng ký</span>
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
                  <th>Mã xe</th>
                  <th>Biển số xe</th>
                  <th>Tuyến xe</th>
                </tr>
              </thead>
              <tbody>
                {selectedDay.drivers.map((d, i) => (
                  <tr key={i}>
                    <td>{d.id}</td>
                    <td>{d.name}</td>
                    <td>{d.vehicleId}</td>
                    <td>{d.plate}</td>
                    <td>{d.route}</td>
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


// ===================================================================
// == 🔹 COMPONENT CHÍNH (QUẢN LÝ TÀI XẾ)
// ===================================================================
export default function QuanLyTaiXe() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("Tất cả");
  const [showPopup, setShowPopup] = useState(false);
  const [showDriverSchedulePopup, setShowDriverSchedulePopup] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [showDriverAddPopup, setShowDriverAddPopup] = useState(false); 
  const [showDriverViewPopup, setShowDriverViewPopup] = useState(false);
  const [viewPopupData, setViewPopupData] = useState(null);
  const [showDriverEditPopup, setShowDriverEditPopup] = useState(false);
  const [selectedDriverId, setSelectedDriverId] = useState(null); 
  const [showScheduler, setShowScheduler] = useState(false);

  const handleShowDriverSchedule = (driver) => {
    setSelectedDriver(driver);
    setShowDriverSchedulePopup(true);
  };
  const handleCloseDriverSchedule = () => {
    setShowDriverSchedulePopup(false);
    setSelectedDriver(null);
  };
  const handleAddDriver = () => {
    setShowDriverAddPopup(true); 
  };
  const handleCloseAddPopup = () => {
    setShowDriverAddPopup(false);
  }
  const handleEditDriver = () => {
    setShowDriverEditPopup(true);
  };
  const handleCloseEditPopup = () => {
    setShowDriverEditPopup(false);
  }
  const handleRowClick = (driver) => {
    setSelectedDriverId(driver.id); 
    setViewPopupData(driver);       
    setShowDriverViewPopup(true); 
  };
  const handleCloseViewPopup = () => {
    setShowDriverViewPopup(false);
  }

  // Thêm TX044 cho ví dụ tìm kiếm
  const drivers = [
    { id: "TX001", name: "Nguyễn Văn A", phone: "0909123456", address: "Quận 1, TP.HCM", weeklyTrips: 5, status: "Đang hoạt động", route: "Q1 - Q5", licenseClass: "B2" },
    { id: "TX002", name: "Lê Thị B", phone: "0912345678", address: "Quận 5, TP.HCM", weeklyTrips: 3, status: "Rảnh", route: "Q3 - Q7", licenseClass: "C" },
    { id: "TX049", name: "Phạm Văn C", phone: "0933456789", address: "Bình Tân, TP.HCM", weeklyTrips: 0, status: "Nghỉ phép", route: "Không có", licenseClass: "D" },
    { id: "TX044", name: "Trần Văn B", phone: "0944123123", address: "Quận 4, TP.HCM", weeklyTrips: 4, status: "Rảnh", route: "Q4 - Q8", licenseClass: "B2" },
  ];

  const filtered = drivers.filter((d) =>
    Object.values(d).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    ) && (filterStatus === "Tất cả" || d.status === filterStatus)
  );


  return (
    <div className="dashboard">
      <aside className="sidebar">
        <h2>DASHBOARD</h2>
      </aside>

      <main className="content">
        <header className="header">
          <h1>QUẢN LÝ TÀI XẾ</h1>
          <div className="profile">
            <span className="icon">👤</span> Profile ▼
          </div>
        </header>

        <div className="driver-container">
          <div className="toolbar">
            <input
              type="text"
              placeholder="Tìm kiếm tài xế..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="Tất cả">Tất cả</option>
              <option value="Đang hoạt động">Đang hoạt động</option>
              <option value="Rảnh">Rảnh</option>
              <option value="Nghỉ phép">Nghỉ phép</option>
            </select>
            
            <button className="btn-edit" onClick={handleEditDriver}>Chỉnh sửa</button>
            <button className="btn-add" onClick={handleAddDriver}>+ Thêm tài xế</button>
            
            <button className="btn-schedule" onClick={() => setShowPopup(true)}>📅 Lịch đăng ký</button>
            <button className="btn-match" onClick={() => setShowScheduler(true)}>Gán tài xế</button>
          </div>

          <table className="driver-table">
            <thead>
              <tr>
                <th>Mã</th>
                <th>Họ tên</th>
                <th>SĐT</th>
                <th>Địa chỉ</th>
                <th>Số chuyến/tuần</th>
                <th>Trạng thái</th>
                <th>Lịch</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((d) => (
                <tr 
                  key={d.id}
                  className={selectedDriverId === d.id ? "row-selected" : ""}
                  onClick={() => handleRowClick(d)}
                >
                  <td>{d.id}</td>
                  <td>{d.name}</td>
                  <td>{d.phone}</td>
                  <td>{d.address}</td>
                  <td>{d.weeklyTrips}</td>
                  <td>
                    <span className={`status-badge ${d.status === "Đang hoạt động"
                      ? "active"
                      : d.status === "Rảnh"
                        ? "idle"
                        : "off"
                      }`}>
                      {d.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="calendar-btn"
                      onClick={(e) => {
                        e.stopPropagation(); 
                        handleShowDriverSchedule(d);
                      }}
                    >
                      📅
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ScheduleCalendarPopup
          isOpen={showPopup}
          onClose={() => setShowPopup(false)}
          title="Lịch đăng ký tài xế (Chung)"
          driver={null}
          showWeekTab={true}
        />
        <ScheduleCalendarPopup
          isOpen={showDriverSchedulePopup}
          onClose={handleCloseDriverSchedule}
          title={`Lịch đăng ký: ${selectedDriver?.name || ''}`}
          driver={selectedDriver}
          showWeekTab={false}
        />
        
        <DriverFormPopup
          isOpen={showDriverAddPopup}
          onClose={handleCloseAddPopup}
          drivers={drivers} 
        />
        
        <DriverViewPopup
          isOpen={showDriverViewPopup}
          onClose={handleCloseViewPopup}
          driverData={viewPopupData}
        />
        <DriverEditPopup
          isOpen={showDriverEditPopup}
          onClose={handleCloseEditPopup}
          drivers={drivers} 
        />
        <NextWeekScheduler
          isOpen={showScheduler}
          onClose={() => setShowScheduler(false)}
        />

      </main>
    </div>
  );
}