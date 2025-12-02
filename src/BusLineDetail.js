import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const BusLineDetail = ({ routeId: propRouteId }) => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const routeId = propRouteId || id;

  const [stops, setStops] = useState([]);
  const [routeInfo, setRouteInfo] = useState({ name: 'Dang tai...', id: routeId });
  const [currentSchedule, setCurrentSchedule] = useState(null);
  const [students, setStudents] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  
  const [activeBuses, setActiveBuses] = useState([]);
  const [selectedBusId, setSelectedBusId] = useState(null);

  const [busStatus, setBusStatus] = useState({ stopId: null, isMoving: false, nextStop: '', hasData: false });

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) navigate('/'); 
    else setCurrentUser(JSON.parse(userStr));
  }, [navigate]);

  // 1. Lấy danh sách xe
  useEffect(() => {
      if(routeId) {
          fetch(`http://localhost:8081/api/active-buses-by-route?id=${routeId}`)
            .then(res => res.json())
            .then(data => {
                setActiveBuses(data);
                if (data.length > 0) setSelectedBusId(data[0].bus_id);
            })
            .catch(err => console.error(err));
      }
  }, [routeId]);

  // 2. Lấy vị trí xe
  useEffect(() => {
    if (!selectedBusId) return;
    const fetchBusStatus = () => {
        fetch(`http://localhost:8081/api/bus-locations?busId=${selectedBusId}`)
            .then(res => res.json())
            .then(data => {
                if (data.length > 0) {
                    const bus = data[0];
                    setBusStatus({ stopId: bus.nearest_stop_id, isMoving: bus.is_moving, nextStop: bus.next_stop_name, hasData: true });
                } else {
                    setBusStatus({ hasData: false });
                }
            });
    };
    fetchBusStatus();
    const interval = setInterval(fetchBusStatus, 2000);
    return () => clearInterval(interval);
  }, [selectedBusId]);

  // 3. Lấy thông tin tài xế & Lịch trình
  useEffect(() => {
      if(selectedBusId) {
        fetch(`http://localhost:8081/api/bus-schedule-info?busId=${selectedBusId}`)
            .then(res => res.json())
            .then(data => { 
                if (data && data.schedule_id) setCurrentSchedule(data); 
                else setCurrentSchedule(null);
            });
      }
  }, [selectedBusId]);

  // 4. Lấy danh sách học sinh
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (routeId && userStr && currentSchedule) {
        const user = JSON.parse(userStr);
        fetch(`http://localhost:8081/api/route-students-status?id=${routeId}&parentId=${user.linked_id}&scheduleId=${currentSchedule.schedule_id}`)
            .then(res => res.json())
            .then(data => setStudents(data));
    }
  }, [routeId, currentSchedule]);

  // Load thông tin tuyến
  useEffect(() => {
    if (routeId) {
        fetch(`http://localhost:8081/api/route-detail?id=${routeId}`)
            .then(res => res.json()).then(data => { setStops(data); if (data.length > 0) setRouteInfo({ name: data[0].route_name, id: routeId }); });
    }
  }, [routeId]);
  
  const getStatusLabel = (status) => {
      if (!status || status === 'CHO_DON') return 'Chưa lên xe';
      if (status === 'DA_DON') return 'Đã lên xe';
      if (status === 'DA_XUONG') return 'Đã xuống xe';
      if (status === 'DA_DEN_TRUONG') return 'Đã đến trường';
      if (status === 'DA_VE_NHA') return 'Đã về nhà';
      return 'Chưa xác định';
  };

  const isWaiting = (status) => !status || status === 'CHO_DON' || status === 'Chưa lên xe';

  const studentsWaiting = students.filter(s => isWaiting(s.pickup_status));
  const studentsOnBus = students.filter(s => !isWaiting(s.pickup_status));

  const styles = {
    container: { padding: '30px', maxWidth: '800px', margin: '0 auto', fontFamily: "'Segoe UI', sans-serif", backgroundColor: '#f9f9f9', minHeight: '100vh' },
    header: { marginBottom: '20px', paddingBottom: '15px', borderBottom: '2px solid #667eea' },
    headerTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    busNumber: { fontSize: '32px', fontWeight: 'bold', color: '#667eea', marginRight: '15px' },
    stationName: { fontSize: '22px', fontWeight: 'bold', color: '#333' },
    busSelect: { padding: '8px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '16px', fontWeight: 'bold', color: '#333', backgroundColor: '#fff', cursor: 'pointer', marginTop: '10px' },
    movingStatus: { backgroundColor: '#e3f2fd', color: '#0d47a1', padding: '10px 15px', borderRadius: '8px', marginBottom: '20px', fontWeight: '500', fontSize: '14px', borderLeft: '4px solid #2196f3' },
    stationList: { marginLeft: '10px', borderLeft: '2px solid #eee', paddingLeft: '20px' },
    stationItem: { marginBottom: '20px', position: 'relative' },
    stationDot: (isHere) => ({ position: 'absolute', left: '-27px', top: '5px', width: '12px', height: '12px', backgroundColor: isHere ? '#28a745' : '#667eea', borderRadius: '50%', border: '2px solid white', boxShadow: isHere ? '0 0 0 2px #28a745' : 'none', transition: 'background-color 0.3s ease' }),
    stationNameText: (isHere) => ({ fontWeight: 'bold', color: isHere ? '#28a745' : '#333', transition: 'color 0.3s ease' }),
    section: { marginBottom: '25px', backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' },
    sectionTitle: { fontSize: '16px', fontWeight: 'bold', color: '#495057', marginBottom: '15px', borderLeft: '4px solid #667eea', paddingLeft: '10px' },
    infoGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
    infoLabel: { fontWeight: 'bold', color: '#666', display: 'block', marginBottom: '5px' },
    infoValue: { fontSize: '15px', fontWeight: '500' },
    studentGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
    studentColumn: { backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px', border: '1px solid #eee' },
    colTitle: { fontSize: '14px', fontWeight: 'bold', marginBottom: '10px', textAlign: 'center', color: '#555' },
    studentItem: { marginBottom: '10px', padding: '10px', backgroundColor: 'white', borderRadius: '6px', border: '1px solid #e0e0e0', boxShadow: '0 1px 2px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column' },
    studentName: { fontWeight: 'bold', fontSize: '14px', color: '#333', marginBottom: '4px' },
    studentStop: { fontSize: '12px', color: '#888', marginBottom: '8px' },
    
    statusBadge: { 
        display: 'inline-block', 
        padding: '4px 8px', 
        borderRadius: '4px', 
        fontSize: '12px', 
        fontWeight: 'bold',
        textAlign: 'center',
        width: 'fit-content'
    },
    
    statusColor: (status) => { 
        if (status === 'DA_DON') return { backgroundColor: '#cce5ff', color: '#004085', border: '1px solid #b8daff' }; // Xanh dương
        if (status === 'DA_XUONG') return { backgroundColor: '#e0cffc', color: '#4a148c', border: '1px solid #d1c4e9' }; // Tím (MỚI)
        if (status === 'DA_DEN_TRUONG') return { backgroundColor: '#d4edda', color: '#155724', border: '1px solid #c3e6cb' }; // Xanh lá
        // Default (Chưa lên xe/Chờ đón)
        return { backgroundColor: '#e2e3e5', color: '#383d41', border: '1px solid #d6d8db' }; // Xám
    },
  };

  if (!routeId) return <div style={{padding: '20px', textAlign: 'center'}}>Vui lòng chọn tuyến xe...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerTop}>
            <div style={{display: 'flex', alignItems: 'center'}}>
                <div style={styles.busNumber}>#{routeInfo.id}</div>
                <div style={styles.stationName}>{routeInfo.name}</div>
            </div>
            <button style={{padding: '4px 10px', fontSize: '12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'}} onClick={() => navigate('/home', { state: { activeTab: 'theo-doi', routeId: routeId } })}>Xem vị trí xe</button>
        </div>
        
        {activeBuses.length > 0 ? (
            <div style={{marginTop: '15px'}}>
                <label style={{marginRight: '10px', fontWeight: 'bold'}}>Chọn xe:</label>
                <select style={styles.busSelect} value={selectedBusId || ''} onChange={(e) => setSelectedBusId(e.target.value)}>
                    {activeBuses.map(bus => <option key={bus.bus_id} value={bus.bus_id}>{bus.license_plate} ({bus.bus_id})</option>)}
                </select>
            </div>
        ) : (
            <div style={{marginTop: '10px', color: '#dc3545', fontStyle: 'italic'}}>Không có xe nào đang hoạt động trên tuyến này.</div>
        )}
      </div>

      {busStatus.hasData && busStatus.isMoving && (
          <div style={styles.movingStatus}>Xe đang di chuyển đến: <b>{busStatus.nextStop}</b></div>
      )}
      
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Thông tin hành trình</div>
        <div style={styles.infoGrid}>
            <div><span style={styles.infoLabel}>Tài xế phụ trách</span><div style={styles.infoValue}>{currentSchedule ? currentSchedule.name : '---'}</div></div>
            <div><span style={styles.infoLabel}>Ngày khởi hành</span><div style={styles.infoValue}>{currentSchedule ? new Date(currentSchedule.schedule_date).toLocaleDateString('vi-VN') : '---'}</div></div>
        </div>
      </div>

      <div style={styles.section}>
        <div style={styles.sectionTitle}>Các trạm dừng</div>
        <div style={styles.stationList}>
            {stops.length > 0 ? stops.map((stop, index) => {
                const isHere = busStatus.stopId === stop.stop_id;
                return (
                    <div key={index} style={styles.stationItem}>
                        <div style={styles.stationDot(isHere)}></div>
                        <div style={styles.stationNameText(isHere)}>{stop.stop_name}</div>
                        <div style={{fontSize: '13px', color: '#666'}}>{stop.address}</div>
                        {isHere && <div style={{color: '#28a745', fontSize: '12px', marginTop: '2px', fontWeight: 'bold'}}>Xe đang dừng tại đây</div>}
                    </div>
                );
            }) : <p style={{fontStyle: 'italic', color: '#999'}}>Đang cập nhật trạm...</p>}
        </div>
      </div>

      <div style={styles.section}>
        <div style={styles.sectionTitle}>Quản lý đưa đón học sinh</div>
        <div style={styles.studentGrid}>
            <div style={styles.studentColumn}>
                <div style={styles.colTitle}>Chờ đón ({studentsWaiting.length})</div>
                {studentsWaiting.map(s => (
                    <div key={s.student_id} style={styles.studentItem}>
                        <div style={styles.studentName}>{s.name}</div>
                        <div style={styles.studentStop}>Trạm: {s.stop_name}</div>
                        <div style={{...styles.statusBadge, ...styles.statusColor(s.pickup_status)}}>
                            {getStatusLabel(s.pickup_status)}
                        </div>
                    </div>
                ))}
            </div>
            <div style={styles.studentColumn}>
                <div style={styles.colTitle}>Đã lên xe / Hoàn thành ({studentsOnBus.length})</div>
                {studentsOnBus.map(s => (
                    <div key={s.student_id} style={styles.studentItem}>
                        <div style={styles.studentName}>{s.name}</div>
                        <div style={styles.studentStop}>Trạm: {s.stop_name}</div>
                        <div style={{...styles.statusBadge, ...styles.statusColor(s.pickup_status)}}>
                            {getStatusLabel(s.pickup_status)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default BusLineDetail;