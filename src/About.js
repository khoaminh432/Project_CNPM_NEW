// About.js - Component giới thiệu về SSB
import React from 'react';

const About = () => {
  const styles = {
    container: {
      padding: '20px',
      maxWidth: '900px',
      margin: '0 auto',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      lineHeight: '1.6'
    },
    header: {
      color: '#333',
      fontSize: '32px',
      fontWeight: 'bold',
      marginBottom: '10px',
      textAlign: 'center'
    },
    subtitle: {
      color: '#667eea',
      fontSize: '20px',
      fontWeight: '600',
      marginBottom: '30px',
      textAlign: 'center'
    },
    section: {
      marginBottom: '30px',
      padding: '25px',
      backgroundColor: '#f8f9fa',
      borderRadius: '10px',
      borderLeft: '4px solid #667eea'
    },
    sectionTitle: {
      color: '#333',
      fontSize: '22px',
      fontWeight: 'bold',
      marginBottom: '15px',
      display: 'flex',
      alignItems: 'center'
    },
    sectionIcon: {
      marginRight: '10px',
      fontSize: '24px'
    },
    paragraph: {
      color: '#555',
      fontSize: '15px',
      marginBottom: '12px',
      textAlign: 'justify'
    },
    featureGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '20px',
      marginTop: '20px'
    },
    featureCard: {
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      border: '1px solid #e9ecef'
    },
    featureTitle: {
      color: '#333',
      fontSize: '18px',
      fontWeight: 'bold',
      marginBottom: '10px',
      display: 'flex',
      alignItems: 'center'
    },
    featureIcon: {
      marginRight: '8px',
      fontSize: '18px'
    },
    featureList: {
      paddingLeft: '20px',
      color: '#555'
    },
    featureItem: {
      marginBottom: '8px',
      fontSize: '14px'
    },
    requirementSection: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '20px',
      marginTop: '20px'
    },
    requirementCard: {
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '8px',
      border: '1px solid #e9ecef'
    },
    techSpec: {
      backgroundColor: '#e7f3ff',
      padding: '20px',
      borderRadius: '8px',
      marginTop: '20px',
      borderLeft: '4px solid #007bff'
    },
    highlight: {
      backgroundColor: '#fff3cd',
      padding: '15px',
      borderRadius: '8px',
      margin: '20px 0',
      borderLeft: '4px solid #ffc107'
    },
    statNumber: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#667eea',
      marginRight: '10px'
    },
    statItem: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '15px',
      padding: '10px',
      backgroundColor: 'white',
      borderRadius: '8px'
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Smart School Bus Tracking System</h1>
      <div style={styles.subtitle}>SSB 1.0 - Hệ thống giám sát xe đưa đón học sinh thông minh</div>

      {/* Giới thiệu tổng quan */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>
          <span style={styles.sectionIcon}></span>
          Tổng quan về SSB 1.0
        </h2>
        <p style={styles.paragraph}>
          <strong>Smart School Bus Tracking System (SSB 1.0)</strong> là giải pháp toàn diện 
          cho việc quản lý và giám sát xe đưa đón học sinh, được phát triển để giải quyết 
          các thách thức trong việc đảm bảo an toàn và minh bạch thông tin cho phụ huynh, 
          nhà trường và tài xế.
        </p>
        
        <div style={styles.highlight}>
          <strong> Vấn đề thực tế:</strong> Việc trễ giờ, lạc đường hoặc thiếu thông tin 
          về vị trí xe có thể ảnh hưởng nghiêm trọng đến sự an toàn của học sinh. Các quy trình 
          thủ công qua điện thoại, excel hoặc tin nhắn không đồng bộ dẫn đến nhiều rủi ro và 
          thiếu minh bạch.
        </div>
      </div>

      {/* Tính năng cho từng đối tượng */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>
          <span style={styles.sectionIcon}></span>
          Đối tượng sử dụng & Tính năng
        </h2>
        
        <div style={styles.featureGrid}>
          {/* Quản lý xe buýt */}
          <div style={styles.featureCard}>
            <h3 style={styles.featureTitle}>
              <span style={styles.featureIcon}></span>
              Cho Quản lý xe buýt
            </h3>
            <ul style={styles.featureList}>
              <li style={styles.featureItem}>Xem tổng quan danh sách học sinh, tài xế, xe buýt và tuyến đường</li>
              <li style={styles.featureItem}>Tạo và cập nhật lịch trình xe (tuần/tháng)</li>
              <li style={styles.featureItem}>Phân công tài xế, xe buýt cho từng tuyến đường</li>
              <li style={styles.featureItem}>Cập nhật vị trí xe theo thời gian thực (độ trễ ≤ 3 giây)</li>
              <li style={styles.featureItem}>Gửi tin nhắn cho tài xế hoặc phụ huynh</li>
            </ul>
          </div>

          {/* Tài xế */}
          <div style={styles.featureCard}>
            <h3 style={styles.featureTitle}>
              <span style={styles.featureIcon}></span>
              Cho Tài xế
            </h3>
            <ul style={styles.featureList}>
              <li style={styles.featureItem}>Xem lịch làm việc hàng ngày</li>
              <li style={styles.featureItem}>Xem danh sách học sinh cần đón và điểm đón</li>
              <li style={styles.featureItem}>Báo cáo tình trạng đã đón/trả học sinh</li>
              <li style={styles.featureItem}>Gửi cảnh báo nếu xảy ra sự cố</li>
            </ul>
          </div>

          {/* Phụ huynh */}
          <div style={styles.featureCard}>
            <h3 style={styles.featureTitle}>
              <span style={styles.featureIcon}></span>
              Cho Phụ huynh
            </h3>
            <ul style={styles.featureList}>
              <li style={styles.featureItem}>Theo dõi vị trí xe buýt con mình đang đi</li>
              <li style={styles.featureItem}>Nhận thông báo khi xe đến gần</li>
              <li style={styles.featureItem}>Nhận cảnh báo nếu xe bị trễ</li>
              <li style={styles.featureItem}>Giám sát hành trình trong thời gian thực</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Yêu cầu kỹ thuật */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>
          <span style={styles.sectionIcon}></span>
          Thông số kỹ thuật
        </h2>
        
        <div style={styles.techSpec}>
          <h3 style={{color: '#007bff', marginBottom: '15px'}}>Yêu cầu hệ thống</h3>
          
          <div style={styles.statItem}>
            <span style={styles.statNumber}>300+</span>
            <span>Hỗ trợ tối thiểu 300 xe hoạt động đồng thời</span>
          </div>
          
          <div style={styles.statItem}>
            <span style={styles.statNumber}>3s</span>
            <span>Độ trễ tối đa cho cập nhật vị trí thời gian thực</span>
          </div>
          
          <div style={styles.statItem}>
            <span style={styles.statNumber}>🌐</span>
            <span>Hỗ trợ đa nền tảng: Web Dashboard + Mobile (Android/iOS)</span>
          </div>
          
          <div style={styles.statItem}>
            <span style={styles.statNumber}>🇻🇳</span>
            <span>Giao diện tiếng Việt, có thể mở rộng sang tiếng Anh</span>
          </div>
        </div>
      </div>

      {/* Lợi ích */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>
          <span style={styles.sectionIcon}></span>
          Lợi ích mang lại
        </h2>
        
        <div style={styles.requirementSection}>
          <div style={styles.requirementCard}>
            <h4 style={{color: '#28a745', marginBottom: '10px'}}> An toàn & Minh bạch</h4>
            <p style={styles.paragraph}>
              Giảm thiểu rủi ro, tăng cường an toàn cho học sinh thông qua giám sát 
              thời gian thực và thông báo kịp thời.
            </p>
          </div>
          
          <div style={styles.requirementCard}>
            <h4 style={{color: '#28a745', marginBottom: '10px'}}> Hiệu quả vận hành</h4>
            <p style={styles.paragraph}>
              Tối ưu hóa quy trình quản lý, giảm tải công việc thủ công, nâng cao 
              hiệu suất làm việc của đội ngũ vận hành.
            </p>
          </div>
          
          <div style={styles.requirementCard}>
            <h4 style={{color: '#28a745', marginBottom: '10px'}}> Tin cậy & Ổn định</h4>
            <p style={styles.paragraph}>
              Hệ thống được thiết kế để hoạt động ổn định với khả năng mở rộng, 
              đáp ứng nhu cầu ngày càng tăng.
            </p>
          </div>
          
          <div style={styles.requirementCard}>
            <h4 style={{color: '#28a745', marginBottom: '10px'}}> Trải nghiệm người dùng</h4>
            <p style={styles.paragraph}>
              Giao diện thân thiện, dễ sử dụng cho cả quản lý, tài xế và phụ huynh, 
              hỗ trợ trên nhiều thiết bị.
            </p>
          </div>
        </div>
      </div>

      {/* Kết luận */}
      <div style={{...styles.section, backgroundColor: '#e8f5e8', borderLeftColor: '#28a745'}}>
        <h2 style={styles.sectionTitle}>
          <span style={styles.sectionIcon}></span>
          Tầm nhìn tương lai
        </h2>
        <p style={styles.paragraph}>
          <strong>SSB 1.0</strong> không chỉ là một hệ thống giám sát, mà là một giải pháp 
          tổng thể cho việc quản lý vận tải học đường thông minh. Chúng tôi hướng đến 
          việc xây dựng một cộng đồng an toàn và kết nối, nơi phụ huynh hoàn toàn yên tâm 
          về hành trình đến trường của con em mình.
        </p>
        <p style={{...styles.paragraph, fontWeight: 'bold', color: '#28a745'}}>
          "An toàn của học sinh - Sự an tâm của phụ huynh - Hiệu quả của nhà trường"
        </p>
      </div>
    </div>
  );
};

export default About;