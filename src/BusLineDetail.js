// BusLineDetail.js - Component chi tiết tuyến xe
import React from 'react';

const BusLineDetail = ({ bus }) => {
  const styles = {
    container: {
      padding: '20px',
      maxWidth: '600px',
      margin: '0 auto',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '20px',
      paddingBottom: '15px',
      borderBottom: '2px solid #667eea'
    },
    busNumber: {
      fontSize: '32px',
      fontWeight: 'bold',
      color: '#667eea',
      marginRight: '15px'
    },
    stationName: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: '#333'
    },
    divider: {
      height: '1px',
      backgroundColor: '#dee2e6',
      margin: '20px 0'
    },
    section: {
      marginBottom: '25px'
    },
    sectionTitle: {
      fontSize: '16px',
      fontWeight: 'bold',
      color: '#495057',
      marginBottom: '10px'
    },
    sectionContent: {
      fontSize: '14px',
      color: '#6c757d',
      lineHeight: '1.5'
    },
    schoolSection: {
      backgroundColor: '#f8f9fa',
      padding: '15px',
      borderRadius: '8px',
      borderLeft: '4px solid #28a745'
    },
    stationList: {
      marginTop: '15px'
    },
    stationItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px',
      marginBottom: '8px',
      backgroundColor: '#f8f9fa',
      borderRadius: '6px',
      borderLeft: '4px solid #dee2e6'
    },
    stationPassed: {
      borderLeftColor: '#6c757d',
      opacity: 0.7
    },
    stationCurrent: {
      borderLeftColor: '#28a745',
      backgroundColor: '#e8f5e8'
    },
    stationUpcoming: {
      borderLeftColor: '#ffc107'
    },
    stationNameText: {
      fontSize: '14px',
      color: '#333',
      fontWeight: '500'
    },
    stationStatus: {
      fontSize: '12px',
      padding: '4px 8px',
      borderRadius: '12px',
      fontWeight: '500'
    },
    statusPassed: {
      backgroundColor: '#6c757d',
      color: 'white'
    },
    statusCurrent: {
      backgroundColor: '#28a745',
      color: 'white'
    },
    statusUpcoming: {
      backgroundColor: '#ffc107',
      color: '#212529'
    },
    nextStop: {
      backgroundColor: '#e7f3ff',
      padding: '15px',
      borderRadius: '8px',
      borderLeft: '4px solid #007bff'
    },
    studentSection: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '15px',
      marginTop: '10px'
    },
    studentCard: {
      backgroundColor: '#f8f9fa',
      padding: '15px',
      borderRadius: '8px',
      border: '1px solid #e9ecef'
    },
    studentTitle: {
      fontSize: '14px',
      fontWeight: 'bold',
      color: '#495057',
      marginBottom: '10px',
      textAlign: 'center'
    },
    studentList: {
      minHeight: '100px',
      fontSize: '13px',
      color: '#6c757d'
    },
    emptyStudent: {
      textAlign: 'center',
      color: '#999',
      fontStyle: 'italic',
      padding: '20px 0'
    },
    driverInfo: {
      backgroundColor: '#fff3cd',
      padding: '15px',
      borderRadius: '8px',
      borderLeft: '4px solid #ffc107',
      marginBottom: '20px'
    }
  };

  // Dữ liệu trạm dựa trên tuyến xe được chọn
  const getStationsData = (busId) => {
    const stationsData = {
      '01': [
        {
          name: 'Trạm LHP 1 - Đường Lê Hồng Phong, Quận 5, TPHCM',
          status: 'passed',
          statusText: 'Đã qua trạm'
        },
        {
          name: 'Trạm LHP 2 - Đường Võ Văn Kiệt, Quận 1, TPHCM',
          status: 'current',
          statusText: 'Đang ở trạm'
        },
        {
          name: 'Trạm LHP 3 - Đường Nguyễn Trãi, Quận 5, TPHCM',
          status: 'upcoming',
          statusText: 'Chưa đến trạm'
        }
      ],
      '02': [
        {
          name: 'Trạm MARIE 1 - Đường Nam Kỳ Khởi Nghĩa, Quận 3, TPHCM',
          status: 'passed',
          statusText: 'Đã qua trạm'
        },
        {
          name: 'Trạm MARIE 2 - Đường Pasteur, Quận 1, TPHCM',
          status: 'current',
          statusText: 'Đang ở trạm'
        },
        {
          name: 'Trạm MARIE 3 - Đường Hai Bà Trưng, Quận 1, TPHCM',
          status: 'upcoming',
          statusText: 'Chưa đến trạm'
        }
      ],
      '03': [
        {
          name: 'Trạm PTNK 1 - Đường Nguyễn Chí Thanh, Quận 5, TPHCM',
          status: 'passed',
          statusText: 'Đã qua trạm'
        },
        {
          name: 'Trạm PTNK 2 - Đường Lý Thường Kiệt, Quận 11, TPHCM',
          status: 'current',
          statusText: 'Đang ở trạm'
        },
        {
          name: 'Trạm PTNK 3 - Đường Hùng Vương, Quận 5, TPHCM',
          status: 'upcoming',
          statusText: 'Chưa đến trạm'
        }
      ]
    };
    return stationsData[busId] || stationsData['01'];
  };

  const stations = getStationsData(bus?.id);

  const getStationStyle = (status) => {
    switch (status) {
      case 'passed':
        return { ...styles.stationItem, ...styles.stationPassed };
      case 'current':
        return { ...styles.stationItem, ...styles.stationCurrent };
      case 'upcoming':
        return { ...styles.stationItem, ...styles.stationUpcoming };
      default:
        return styles.stationItem;
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'passed':
        return { ...styles.stationStatus, ...styles.statusPassed };
      case 'current':
        return { ...styles.stationStatus, ...styles.statusCurrent };
      case 'upcoming':
        return { ...styles.stationStatus, ...styles.statusUpcoming };
      default:
        return styles.stationStatus;
    }
  };

  const getCurrentStation = () => {
    return stations.find(station => station.status === 'current') || stations[0];
  };

  const getNextStation = () => {
    return stations.find(station => station.status === 'upcoming') || stations[stations.length - 1];
  };

  const currentStation = getCurrentStation();
  const nextStation = getNextStation();

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.busNumber}>#{bus?.id}</div>
        <div style={styles.stationName}>{bus?.station}</div>
      </div>

      {/* Thông tin tài xế */}
      <div style={styles.driverInfo}>
        <div style={styles.sectionTitle}>Tài xế</div>
        <div style={styles.sectionContent}>{bus?.driver}</div>
      </div>

      {/* Vị trí hiện tại */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Vị trí hiện tại</div>
        <div style={styles.sectionContent}>{currentStation.name}</div>
      </div>

      <div style={styles.divider}></div>

      {/* Điểm dừng tiếp theo */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Điểm dừng tiếp theo</div>
        <div style={styles.sectionContent}>{nextStation.name}</div>
      </div>

      <div style={styles.divider}></div>

      {/* Trường học */}
      <div style={styles.section}>
        <div style={styles.schoolSection}>
          <div style={styles.sectionTitle}>{bus?.code}</div>
          <div style={styles.sectionContent}>{bus?.school}</div>
        </div>
      </div>

      <div style={styles.divider}></div>

      {/* Danh sách trạm */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Lộ trình</div>
        <div style={styles.stationList}>
          {stations.map((station, index) => (
            <div key={index} style={getStationStyle(station.status)}>
              <div style={styles.stationNameText}>{station.name}</div>
              <div style={getStatusStyle(station.status)}>
                {station.statusText}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={styles.divider}></div>

      {/* Thông tin học sinh */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Tình trạng học sinh</div>
        <div style={styles.studentSection}>
          <div style={styles.studentCard}>
            <div style={styles.studentTitle}>Học sinh chưa lên xe</div>
            <div style={styles.studentList}>
              <div style={styles.emptyStudent}>Không có học sinh</div>
            </div>
          </div>
          <div style={styles.studentCard}>
            <div style={styles.studentTitle}>Học sinh đã lên xe</div>
            <div style={styles.studentList}>
              <div style={styles.emptyStudent}>Không có học sinh</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusLineDetail;