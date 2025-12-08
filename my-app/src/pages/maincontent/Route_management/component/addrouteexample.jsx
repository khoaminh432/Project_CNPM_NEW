import React, { useEffect, useState } from 'react';
import './addRoute.css';
import StyleMain from "./../../styleMain.module.css";
import MapComponent from "./../../../../components/MapComponent"
import SearchSuggestAddress from '../../../../components/MapHandle/SearchSuggestAddress';
import { stops } from '../../../../models/Stop';

function listToString(list) {
  if (!list || list.length === 0) return "";
  
  let stopNames = "";
  list.forEach((temp, index) => {
    if (temp && temp.stop_name) {
      stopNames += `${index + 1}. ${temp.stop_name}${index < list.length - 1 ? ' → ' : ''}`;
    }
  });
  return stopNames;
}

function AddRoute({ onClose = () => {} }) {
  const [stations, setStations] = useState([]);
  const [positions, setPosition] = useState({
    start: null,
    end: null
  });
  const [startAddress, setStartAddress] = useState('');
  const [endAddress, setEndAddress] = useState('');
  const [routeName, setRouteName] = useState('');
  const [selectedStations, setSelectedStations] = useState([]); // Thay Set thành Array để giữ thứ tự
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [newStationName, setNewStationName] = useState('');
  const [newStationAddress, setNewStationAddress] = useState('');
  const [isAddingStation, setIsAddingStation] = useState(false);
  const [selectedStationIndex, setSelectedStationIndex] = useState(null);

  useEffect(() => {
    setStations(stops || []);
  }, []);

  const handleStartLocation = (geometry, address) => {
    if (geometry) {
      setPosition(pos => ({ ...pos, start: geometry }));
    }
    if (address) {
      setStartAddress(address);
    }
  };

  const handleEndLocation = (geometry, address) => {
    if (geometry) {
      setPosition(pos => ({ ...pos, end: geometry }));
    }
    if (address) {
      setEndAddress(address);
    }
  };

  const toggleStation = (station) => {
    setSelectedStations(prev => {
      // Kiểm tra xem station đã có trong danh sách chưa
      const index = prev.findIndex(s => 
        s.id === station.id || s.stop_name === station.stop_name
      );
      
      if (index !== -1) {
        // Nếu đã có, xóa khỏi danh sách
        return prev.filter((_, i) => i !== index);
      } else {
        // Nếu chưa có, thêm vào cuối danh sách
        return [...prev, { ...station, order: prev.length + 1 }];
      }
    });
    setSelectedStationIndex(null);
  };

  const handleAddNewStation = () => {
    if (!newStationName.trim()) {
      alert("Vui lòng nhập tên trạm");
      return;
    }

    if (!newStationAddress.trim()) {
      alert("Vui lòng nhập địa chỉ trạm");
      return;
    }

    // Tạo trạm mới
    const newStation = {
      id: `new-${Date.now()}`,
      stop_name: newStationName,
      address: newStationAddress,
      latitude: positions.start?.lat || 10.7500452,
      longitude: positions.start?.lng || 106.6622499,
      isCustom: true // Đánh dấu là trạm tự thêm
    };

    // Thêm vào danh sách stations
    setStations(prev => [...prev, newStation]);
    
    // Tự động chọn trạm mới thêm
    setSelectedStations(prev => [...prev, { ...newStation, order: prev.length + 1 }]);
    
    // Reset form
    setNewStationName('');
    setNewStationAddress('');
    setIsAddingStation(false);
    
    alert(`Đã thêm trạm "${newStationName}" thành công!`);
  };

  const handleDeleteSelectedStations = () => {
    if (selectedStations.length === 0) {
      alert("Không có trạm nào để xóa");
      return;
    }

    if (window.confirm(`Bạn có chắc muốn xóa ${selectedStations.length} trạm đã chọn?`)) {
      // Nếu xóa theo index đã chọn
      if (selectedStationIndex !== null) {
        const updatedStations = [...selectedStations];
        updatedStations.splice(selectedStationIndex, 1);
        
        // Cập nhật order
        const reorderedStations = updatedStations.map((station, index) => ({
          ...station,
          order: index + 1
        }));
        
        setSelectedStations(reorderedStations);
        setSelectedStationIndex(null);
      } else {
        // Nếu không có index cụ thể, xóa tất cả
        setSelectedStations([]);
      }
    }
  };

  const handleDeleteSingleStation = (index) => {
    const stationToDelete = selectedStations[index];
    
    if (window.confirm(`Bạn có chắc muốn xóa trạm "${stationToDelete.stop_name}"?`)) {
      const updatedStations = [...selectedStations];
      updatedStations.splice(index, 1);
      
      // Cập nhật order
      const reorderedStations = updatedStations.map((station, idx) => ({
        ...station,
        order: idx + 1
      }));
      
      setSelectedStations(reorderedStations);
      if (selectedStationIndex === index) {
        setSelectedStationIndex(null);
      }
    }
  };

  const handleMoveStation = (fromIndex, toIndex) => {
    if (fromIndex === toIndex) return;
    
    const updatedStations = [...selectedStations];
    const [movedStation] = updatedStations.splice(fromIndex, 1);
    updatedStations.splice(toIndex, 0, movedStation);
    
    // Cập nhật order
    const reorderedStations = updatedStations.map((station, index) => ({
      ...station,
      order: index + 1
    }));
    
    setSelectedStations(reorderedStations);
    setSelectedStationIndex(toIndex);
  };

  const handleSave = (e) => {
    e.preventDefault();
    
    // Validate dữ liệu
    if (!startAddress || !endAddress) {
      alert("Vui lòng nhập địa chỉ bắt đầu và kết thúc");
      return;
    }

    if (selectedStations.length === 0) {
      alert("Vui lòng chọn ít nhất một trạm");
      return;
    }

    if (!startTime || !endTime) {
      alert("Vui lòng nhập thời gian hoạt động");
      return;
    }

    const payload = {
      routeName: routeName || `${startAddress} → ${endAddress}`,
      startAddress, 
      endAddress,
      stations: selectedStations.map((station, index) => ({
        ...station,
        order: index + 1
      })),
      startTime, 
      endTime,
      startPosition: positions.start,
      endPosition: positions.end,
      totalStations: selectedStations.length
    };
    
    // TODO: Gọi API lưu tuyến ở đây
    console.log('Save route', payload);
    
    // Hiển thị thông báo thành công
    alert(`Đã tạo tuyến "${payload.routeName}" với ${payload.totalStations} trạm thành công!`);
    
    // Có thể reset form sau khi lưu
    // handleCancel();
  };

  const handleCancel = () => {
    if (window.confirm("Bạn có chắc muốn hủy? Mọi thay đổi sẽ không được lưu.")) {
      setRouteName('');
      setStartAddress('');
      setEndAddress('');
      setSelectedStations([]);
      setStartTime('');
      setEndTime('');
      setNewStationName('');
      setNewStationAddress('');
      setIsAddingStation(false);
      setSelectedStationIndex(null);
      setPosition({ start: null, end: null });
    }
  };

  const routeDisplay = routeName || (startAddress && endAddress ? `${startAddress} → ${endAddress}` : "");

  return (
    <div className="add-route-wrap">
      <header className="add-route-header">
        <div className="header-top">
          <h1>Chọn / Tạo tuyến đường</h1>
          <button 
            className="btn-close-route" 
            onClick={onClose}
          >
            ✕ Đóng
          </button>
        </div>
        <form className="search-row" onSubmit={(e) => e.preventDefault()}>
          <SearchSuggestAddress 
            placeholder="Nhập địa chỉ bắt đầu" 
            className="search-input"  
            onAddressSelect={handleStartLocation}
          />
          <SearchSuggestAddress 
            placeholder="Nhập địa chỉ kết thúc" 
            className="search-input" 
            onAddressSelect={handleEndLocation}
          />
          <button 
            className="search-address-btn" 
            type="button" 
            onClick={() => alert("Tính năng tìm tuyến tự động đang phát triển...")}
          >
            Tìm tuyến
          </button>
        </form>
      </header>

      <div className="add-route-main">
        <section className="left-card">
          <form className="form-card" onSubmit={handleSave}>
            <h2 className="section-title">Tạo Tuyến xe mới</h2>
            
            <div className="button-group">
              <button 
                type="button" 
                className="add-station-btn"
                onClick={() => setIsAddingStation(!isAddingStation)}
              >
                {isAddingStation ? '✕ Hủy thêm' : '+ Thêm trạm mới'}
              </button>
              <button 
                type="button" 
                className="delete-station-btn"
                onClick={handleDeleteSelectedStations}
                disabled={selectedStations.length === 0}
              >
                🗑️ Xóa trạm đã chọn
              </button>
            </div>

            {/* Form thêm trạm mới */}
            {isAddingStation && (
              <div className="add-station-form">
                <h4>Thông tin trạm mới</h4>
                <input
                  className="text-input"
                  type="text"
                  placeholder="Tên trạm (VD: Trạm A)"
                  value={newStationName}
                  onChange={e => setNewStationName(e.target.value)}
                  style={{ marginBottom: '10px' }}
                />
                <input
                  className="text-input"
                  type="text"
                  placeholder="Địa chỉ trạm"
                  value={newStationAddress}
                  onChange={e => setNewStationAddress(e.target.value)}
                  style={{ marginBottom: '10px' }}
                />
                <button
                  type="button"
                  className="save-station-btn"
                  onClick={handleAddNewStation}
                >
                  Lưu trạm mới
                </button>
              </div>
            )}

            <input
              className="text-input"
              type="text"
              placeholder="Nhập tên tuyến (VD: Suối Tiên - Bến Thành)"
              value={routeName}
              onChange={e => setRouteName(e.target.value)}
              required
            />

            <div className="divider" />

            <h3 className="sub-title">
              Các trạm đi qua ({selectedStations.length} trạm)
              {selectedStations.length > 0 && (
                <span style={{ fontSize: '12px', marginLeft: '10px', color: '#666' }}>
                  (Click để chọn, kéo để sắp xếp)
                </span>
              )}
            </h3>
            
            {/* Danh sách trạm đã chọn */}
            {selectedStations.length > 0 && (
              <div className="selected-stations-list">
                <h4>Trạm đã chọn:</h4>
                {selectedStations.map((station, index) => (
                  <div 
                    key={station.id || index}
                    className={`selected-station-item ${selectedStationIndex === index ? 'active' : ''}`}
                    onClick={() => setSelectedStationIndex(index)}
                  >
                    <div className="station-info">
                      <span className="station-order">{index + 1}.</span>
                      <span className="station-name">{station.stop_name}</span>
                      {station.isCustom && (
                        <span className="custom-badge">(Tự thêm)</span>
                      )}
                    </div>
                    <div className="station-actions">
                      {index > 0 && (
                        <button 
                          className="move-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMoveStation(index, index - 1);
                          }}
                          title="Di chuyển lên"
                        >
                          ↑
                        </button>
                      )}
                      {index < selectedStations.length - 1 && (
                        <button 
                          className="move-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMoveStation(index, index + 1);
                          }}
                          title="Di chuyển xuống"
                        >
                          ↓
                        </button>
                      )}
                      <button 
                        className="delete-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSingleStation(index);
                        }}
                        title="Xóa trạm này"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="stations-list">
              {stations.map((station, idx) => {
                const isSelected = selectedStations.some(s => 
                  s.id === station.id || s.stop_name === station.stop_name
                );
                
                return (
                  <label 
                    key={station.id || idx} 
                    className={`station-item ${isSelected ? 'active' : ''}`}
                    onClick={() => toggleStation(station)}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}}
                      style={{ pointerEvents: 'none' }}
                    />
                    <span className="station-name">{station.stop_name}</span>
                    {station.address && (
                      <span className="station-address"> - {station.address}</span>
                    )}
                  </label>
                );
              })}
            </div>

            <div className="divider" />

            <h3 className="sub-title">Thời gian hoạt động</h3>
            <div className="time-row">
              <div className="time-group">
                <label>Giờ bắt đầu:</label>
                <input
                  className="time-input"
                  type="time"
                  value={startTime}
                  onChange={e => setStartTime(e.target.value)}
                  required
                />
              </div>
              <div className="time-group">
                <label>Giờ kết thúc:</label>
                <input
                  className="time-input"
                  type="time"
                  value={endTime}
                  onChange={e => setEndTime(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="route-preview">
              <strong>Tuyến: {routeDisplay || "Chưa đặt tên"}</strong>
              
              <div className="stations-preview">
                {selectedStations.length > 0 
                  ? (
                    <div>
                      <div><strong>Lộ trình:</strong></div>
                      <div>{listToString(selectedStations)}</div>
                      <div style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
                        Tổng số: {selectedStations.length} trạm
                      </div>
                    </div>
                  )
                  : <span className="muted">Chưa chọn trạm</span>
                }
              </div>
            </div>

            <div className="form-actions-add-route">
              <button type="submit" className="save-btn">
                Lưu Tuyến xe
              </button>
              <button 
                type="button" 
                className="cancel-btn" 
                onClick={handleCancel}
              >
                Hủy
              </button>
            </div>
          </form>
        </section>

        <aside className="right-card">
          <div className="map-card">
            <MapComponent 
              positionCurrent={positions} 
              stops={selectedStations}
              onDeletePosition={(point) => {
                // Tìm và xóa trạm khỏi selectedStations
                const updatedStations = selectedStations.filter(station => 
                  !(station.lat === point.lat && station.lng === point.lng)
                );
                setSelectedStations(updatedStations);
              }}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}

export default AddRoute;