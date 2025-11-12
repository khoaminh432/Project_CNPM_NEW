// ...existing code...
import React, { useState } from 'react';
import './addRoute.css';
import StyleMain from "./../../styleMain.module.css";
import MapComponent from "./../../../../components/MapComponent"
import SearchSuggestAddress from '../../../../components/MapHandle/SearchSuggestAddress';
function AddRoute() {
  const defaultStations = [
    'Bến Thành',
    'Ba Son',
    'Nhà Hát Thành Phố',
    'Bệnh Viện Chợ Rẫy',
    'Công Viên Tao Đàn',
    'Suối Tiên',
    "Ninh Thuan",
    "Binh Thuan",
  ];

  const [startAddress, setStartAddress] = useState('');
  const [endAddress, setEndAddress] = useState('');
  const [routeName, setRouteName] = useState('');
  const [selectedStations, setSelectedStations] = useState(new Set());
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const toggleStation = (name) => {
    setSelectedStations(prev => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    const payload = {
      routeName: routeName || `${startAddress} → ${endAddress}`,
      startAddress, endAddress,
      stations: Array.from(selectedStations),
      startTime, endTime
    };
    // TODO: gọi API lưu tuyến ở đây
    console.log('Save route', payload);
    alert('Đã lưu tuyến (console.log)');
  };

  const selectedList = Array.from(selectedStations);
  const routeDisplay = routeName || "";

  return (
    <div className="add-route-wrap" >
      <header className="add-route-header">
        <h1>Chọn / Tạo tuyến đường</h1>
        <form className="search-row" onSubmit={(e) => e.preventDefault()}>
          <SearchSuggestAddress placeholderinput="nhập địa chỉ bắt đầu" className="search-input"/>
          <SearchSuggestAddress placeholderinput="nhập địa chỉ kết thúc" className="search-input"/>
          <button className="search-btn" type="button" onClick={() => alert('Chức năng tìm tuyến chưa triển khai')}>
            Tìm tuyến
          </button>
        </form>
      </header>

      <div className="add-route-main">
        <section className="left-card">
          <form className="form-card" onSubmit={handleSave} style={{width:"auto"}}>
            <h2 className="section-title">Tạo Tuyến xe mới <button>+Thêm trạm</button></h2>
              <input
                className="text-input"
                type="text"
                placeholder="Nhập tên tuyến (VD: Suối Tiên - Bến Thành)"
                value={routeName}
                onChange={e => setRouteName(e.target.value)}
              />

            <div className="divider" />

            <h3 className="sub-title">Các trạm đi qua</h3>
            <div className="stations-list">
              {defaultStations.map((s, idx) => {
                const id = `station-${idx}`;
                return (
                  <label key={s} htmlFor={id} className={`station-item ${selectedStations.has(s) ? 'active' : ''}`}>
                    <input
                      id={id}
                      type="checkbox"
                      checked={selectedStations.has(s)}
                      onChange={() => toggleStation(s)}
                    />
                    <span className="station-name">{s}</span>
                  </label>
                );
              })}

              
            </div>

            <div className="divider" />

            <h3 className="sub-title">Thời gian hoạt động</h3>
            <div className="time-row">
              <input
                className="time-input"
                type="time"
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                aria-label="Bắt đầu"
              />
              <input
                className="time-input"
                type="time"
                value={endTime}
                onChange={e => setEndTime(e.target.value)}
                aria-label="Kết thúc"
              />
            </div>

            <div className="route-preview">
              <strong>Tuyến:{routeDisplay}</strong>
              
              <div className="stations-preview">
                {selectedList.length ? selectedList.join(' → ') : <span className="muted">Chưa chọn trạm</span>}
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="save-btn">Lưu Tuyến xe</button>
              <button type="button" className="cancel-btn" onClick={() => {
                setRouteName(''); setStartAddress(''); setEndAddress(''); setSelectedStations(new Set()); setStartTime(''); setEndTime('');
              }}>Hủy</button>
            </div>
          </form>
        </section>

        <aside className="right-card" style={{height:"auto"}}>
          <div className="map-card" style={{height:"100%" ,width:"100%"}} >
            {/* Nếu có component map sẵn thì thay placeholder bằng MapComponent */}
            <MapComponent/>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default AddRoute;
// ...existing code...