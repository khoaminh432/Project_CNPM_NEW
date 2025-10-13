// BusLine.js - Component hiển thị tuyến xe
import React, { useState } from 'react';
import BusLineDetail from './BusLineDetail';

const BusLine = () => {
  const [selectedBus, setSelectedBus] = useState(null);

  const busLines = [
    {
      id: '01',
      startTime: '6:00',
      duration: '1h',
      endTime: '7:00',
      station: 'Trạm XXX',
      code: 'LHP',
      driver: 'Nguyễn Văn A',
      school: 'THPT chuyên Lê Hồng Phong'
    },
    {
      id: '02',
      startTime: '6:00',
      duration: '1h',
      endTime: '7:00',
      station: 'Trạm YYY',
      code: 'MARIE',
      driver: 'Trần Hoàng B',
      school: 'THPT Marie Curie'
    },
    {
      id: '03',
      startTime: '6:00',
      duration: '1h',
      endTime: '7:00',
      station: 'Trạm ZZZ',
      code: 'PTNK',
      driver: 'Ngô Nguyễn Văn C',
      school: 'THPT Năng Khiếu'
    }
  ];

  const styles = {
    container: {
      padding: '20px',
      maxWidth: '800px',
      margin: '0 auto'
    },
    header: {
      color: '#333',
      fontSize: '28px',
      fontWeight: 'bold',
      marginBottom: '30px',
      borderBottom: '2px solid #667eea',
      paddingBottom: '10px'
    },
    busLineCard: {
      backgroundColor: 'white',
      border: '1px solid #e9ecef',
      borderRadius: '10px',
      padding: '20px',
      marginBottom: '20px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    busLineCardHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 8px rgba(0,0,0,0.15)'
    },
    timeSection: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '15px',
      paddingBottom: '15px',
      borderBottom: '1px solid #f1f3f4'
    },
    busId: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#667eea',
      minWidth: '50px'
    },
    timeLine: {
      display: 'flex',
      alignItems: 'center',
      flex: 1,
      justifyContent: 'space-between',
      margin: '0 20px'
    },
    timeItem: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    },
    timeLabel: {
      fontSize: '12px',
      color: '#6c757d',
      marginBottom: '5px'
    },
    timeValue: {
      fontSize: '16px',
      fontWeight: 'bold',
      color: '#333'
    },
    duration: {
      fontSize: '14px',
      color: '#28a745',
      fontWeight: '500'
    },
    stationSection: {
      marginBottom: '15px'
    },
    stationName: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#333',
      marginBottom: '10px'
    },
    infoSection: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start'
    },
    schoolInfo: {
      flex: 1
    },
    code: {
      fontSize: '16px',
      fontWeight: 'bold',
      color: '#667eea',
      marginBottom: '5px'
    },
    label: {
      fontSize: '12px',
      color: '#6c757d',
      marginBottom: '2px'
    },
    value: {
      fontSize: '14px',
      color: '#333',
      fontWeight: '500'
    },
    driverInfo: {
      textAlign: 'right',
      flex: 1
    },
    divider: {
      height: '1px',
      backgroundColor: '#dee2e6',
      margin: '20px 0'
    },
    statusBadge: {
      display: 'inline-block',
      padding: '4px 12px',
      backgroundColor: '#28a745',
      color: 'white',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '500',
      marginLeft: '10px'
    },
    backButton: {
      padding: '10px 20px',
      backgroundColor: '#6c757d',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      marginBottom: '20px',
      fontSize: '14px'
    }
  };

  // Trong BusLine.js, phần render khi selectedBus
  if (selectedBus) {
    return (
      <div>
        <button 
          style={styles.backButton}
          onClick={() => setSelectedBus(null)}
        >
          ← Quay lại danh sách
        </button>
        <BusLineDetail bus={selectedBus} />
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>DANH SÁCH TUYẾN XE</h1>
      
      {busLines.map((bus, index) => (
        <div 
          key={bus.id} 
          style={styles.busLineCard}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
          }}
          onClick={() => setSelectedBus(bus)}
        >
          <div style={styles.timeSection}>
            <div style={styles.busId}>{bus.id}</div>
            <div style={styles.timeLine}>
              <div style={styles.timeItem}>
                <div style={styles.timeLabel}>BẮT ĐẦU</div>
                <div style={styles.timeValue}>{bus.startTime}</div>
              </div>
              <div style={styles.timeItem}>
                <div style={styles.timeLabel}>THỜI GIAN</div>
                <div style={styles.duration}>{bus.duration}</div>
              </div>
              <div style={styles.timeItem}>
                <div style={styles.timeLabel}>KẾT THÚC</div>
                <div style={styles.timeValue}>{bus.endTime}</div>
              </div>
            </div>
            <div style={styles.statusBadge}>ĐANG HOẠT ĐỘNG</div>
          </div>

          <div style={styles.stationSection}>
            <div style={styles.stationName}>{bus.station}</div>
          </div>

          <div style={styles.infoSection}>
            <div style={styles.schoolInfo}>
              <div style={styles.code}>{bus.code}</div>
              <div style={styles.label}>TRƯỜNG</div>
              <div style={styles.value}>{bus.school}</div>
            </div>
            
            <div style={styles.driverInfo}>
              <div style={styles.label}>TÀI XẾ</div>
              <div style={styles.value}>{bus.driver}</div>
            </div>
          </div>

          {index < busLines.length - 1 && <div style={styles.divider} />}
        </div>
      ))}
    </div>
  );
};

export default BusLine;