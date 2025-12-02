import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { useParams } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Import hình ảnh từ thư mục icon (Đảm bảo file tồn tại)
import busImgLocal from './icon/bus.png'; 
import stopImgLocal from './icon/stop.png';

// Fix lỗi icon Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

const busIcon = new L.Icon({
    iconUrl: busImgLocal, iconSize: [40, 40], iconAnchor: [20, 20], popupAnchor: [0, -20]
});
const stopIcon = new L.Icon({
    iconUrl: stopImgLocal, iconSize: [30, 30], iconAnchor: [15, 30], popupAnchor: [0, -30]
});

const BusTracking = ({ propRouteId }) => {
  const { lineId } = useParams(); 
  const routeId = propRouteId || lineId || 'R01';

  // State
  const [activeBuses, setActiveBuses] = useState([]); 
  const [busInfo, setBusInfo] = useState(null);
  const [routePath, setRoutePath] = useState([]); // Đường đi chi tiết (từ OSRM)
  const [stops, setStops] = useState([]);         // Tọa độ các trạm

  // Animation State
  const [busPositionIndex, setBusPositionIndex] = useState(0); 
  const animationRef = useRef(null);

  // 1. Lấy thông tin & Xe hoạt động
  useEffect(() => {
    // Thông tin tuyến
    fetch(`http://localhost:8081/api/bus-info-by-route?id=${routeId}`)
      .then(res => res.json()).then(data => setBusInfo(data)).catch(console.error);

    // Danh sách xe (chỉ lấy ID, không cần tọa độ vì Frontend tự tính)
    fetch(`http://localhost:8081/api/bus-locations?routeId=${routeId}`)
        .then(res => res.json()).then(data => setActiveBuses(data)).catch(console.error);
  }, [routeId]);

  // 2. Lấy trạm & Gọi OSRM để vẽ đường
  useEffect(() => {
      fetch(`http://localhost:8081/api/route-path?id=${routeId}`)
        .then(res => res.json())
        .then(coordinates => {
            if(coordinates.length > 0) {
                setStops(coordinates);
                fetchDetailedRoute(coordinates);
            }
        });
  }, [routeId]);

  const fetchDetailedRoute = (coordinates) => {
      if(coordinates.length < 2) return;
      // Format cho OSRM: lng,lat;lng,lat
      const waypoints = coordinates.map(coord => `${coord[1]},${coord[0]}`).join(';');
      const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${waypoints}?overview=full&geometries=geojson`;

      fetch(osrmUrl)
        .then(res => res.json())
        .then(data => {
            if (data.routes && data.routes.length > 0) {
                // Leaflet cần format: [lat, lng]
                const detailedPath = data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
                setRoutePath(detailedPath);
                setBusPositionIndex(0); // Reset vị trí về đầu
            }
        })
        .catch(err => console.error("Lỗi OSRM:", err));
  };

  // 3. Animation Loop: Di chuyển index dọc theo routePath
  useEffect(() => {
      if (routePath.length === 0) return;

      const animate = () => {
          setBusPositionIndex(prev => {
              // Loop lại nếu hết đường
              if (prev >= routePath.length - 1) return 0;
              return prev + 1;
          });
          // Tốc độ: 50ms cập nhật 1 lần
          animationRef.current = setTimeout(animate, 50); 
      };
      animate();
      return () => clearTimeout(animationRef.current);
  }, [routePath]);

  // --- GIAO DIỆN GỐC ---
  const styles = {
    container: { padding: '20px', maxWidth: '800px', margin: '0 auto' },
    header: { color: '#333', fontSize: '28px', fontWeight: 'bold', marginBottom: '10px', borderBottom: '2px solid #667eea', paddingBottom: '10px' },
    description: { color: '#6c757d', fontSize: '16px', marginBottom: '25px' },
    mapContainer: { borderRadius: '15px', height: '450px', marginBottom: '25px', border: '1px solid #dee2e6', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', position: 'relative', zIndex: 0 },
    infoCard: { backgroundColor: 'white', border: '1px solid #e9ecef', borderRadius: '10px', padding: '20px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
    infoRow: { display: 'flex', marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px solid #f1f3f4' },
    infoLabel: { fontWeight: 'bold', minWidth: '150px', color: '#495057', fontSize: '14px' },
    infoValue: { color: '#333', fontSize: '14px', flex: 1 }
  };

  const centerPosition = stops.length > 0 ? stops[0] : [10.7599, 106.6822];
  
  // Vị trí cơ sở của xe (dựa trên index animation)
  const baseBusPos = routePath.length > 0 ? routePath[busPositionIndex] : null;

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Theo dõi xe buýt ({routeId})</h1>
      <p style={styles.description}></p>

      <div style={styles.mapContainer}>
        <MapContainer key={routeId} center={centerPosition} zoom={14} style={{ height: '100%', width: '100%' }}>
            <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
            
            {/* 1. Đường màu xanh */}
            {routePath.length > 0 && <Polyline positions={routePath} pathOptions={{ color: '#667eea', weight: 5, opacity: 0.8 }} />}
            
            {/* 2. Trạm dừng */}
            {stops.map((pos, idx) => (
                <Marker key={`stop-${idx}`} position={pos} icon={stopIcon}>
                    <Popup>Trạm dừng {idx + 1}</Popup>
                </Marker>
            ))}

            {/* 3. Xe buýt (Render vị trí dựa trên routePath) */}
            {activeBuses.map((bus, idx) => {
                if (baseBusPos) {
                    // Logic: Nếu có nhiều xe, cho chạy cách nhau 1 khoảng
                    // (idx * 150) là độ lệch để các xe không chồng lên nhau
                    const offsetIndex = (busPositionIndex + (idx * 150)) % routePath.length;
                    const realPos = routePath[offsetIndex];

                    return (
                        <Marker key={bus.bus_id} position={realPos} icon={busIcon}>
                            <Popup>
                                <b style={{color: '#667eea'}}>Xe {bus.bus_id}</b><br/>
                                {bus.license_plate}<br/>
                                <em style={{fontSize:'12px'}}>Đang chạy theo tuyến {routeId}</em>
                            </Popup>
                        </Marker>
                    );
                }
                return null;
            })}
        </MapContainer>
      </div>

      <div style={styles.infoCard}>
        <div style={styles.infoRow}>
          <span style={styles.infoLabel}>Biển số xe:</span>
          <span style={styles.infoValue}>{busInfo ? busInfo.license_plate : 'Đang tải...'}</span>
        </div>
        <div style={styles.infoRow}>
          <span style={styles.infoLabel}>Tuyến đường:</span>
          <span style={styles.infoValue}>{busInfo ? busInfo.route_name : 'Đang tải...'}</span>
        </div>
        <div style={styles.infoRow}>
          <span style={styles.infoLabel}>Trạng thái:</span>
          <span style={{...styles.infoValue, color: '#28a745', fontWeight: 'bold'}}>
            {busInfo ? busInfo.status : '...'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BusTracking;