const express = require('express');
const cors = require('cors');
const cron = require('node-cron');      // Thư viện tạo lịch chạy ngầm
const pool = require('./db/connect');   // Kết nối DB để Cron Job lấy dữ liệu

// 1. Import file route
const driverRoutes = require('./route/driver.js');
const busRoutes = require('./route/bus.js'); 
const scheduleRoutes = require('./route/schedule.js');
const routeRoutes = require('./route/route.js');
const notificationRoutes = require('./route/notification.js');

const app = express();
const PORT = 3001; 

app.use(cors());
app.use(express.json());

// 2. Chỉ dẫn cho server: 
app.use('/api/drivers', driverRoutes); 
app.use('/api/buses', busRoutes); 
app.use('/api/schedules', scheduleRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/notifications', notificationRoutes);

/* ==================================================================
 * CRON JOB: TỰ ĐỘNG QUÉT VÀ GỬI THÔNG BÁO (CHẠY MỖI PHÚT)
 * ================================================================== */
cron.schedule('* * * * *', async () => {
  let connection;
  try {
    // Lấy tin cần gửi
    const [pendingNotifs] = await pool.query(`
      SELECT * FROM notification 
      WHERE type = 'scheduled' AND status_sent = 'pending' AND scheduled_time <= NOW()
    `);

    if (pendingNotifs.length === 0) return;
    connection = await pool.getConnection();

    for (const notif of pendingNotifs) {
        await connection.beginTransaction();
        
        // 1. Gửi tin (Copy vào bảng recipients)
        let recipientIds = [];
        if (notif.recipient_type === 'driver') {
            const [drivers] = await connection.query("SELECT driver_id FROM bus_map_driver");
            recipientIds = drivers.map(d => d.driver_id);
        } else if (notif.recipient_type === 'parent') {
            const [parents] = await connection.query("SELECT parent_id FROM bus_map_parent");
            recipientIds = parents.map(p => p.parent_id);
        } else if (notif.recipient_type === 'bus') recipientIds = ['admin'];

        if (recipientIds.length > 0) {
            const data = recipientIds.map(id => [notif.id, id, notif.recipient_type==='bus'?'admin':notif.recipient_type, 'unread']);
            await connection.query("INSERT INTO notification_recipients (notification_id, recipient_id, recipient_type, status) VALUES ?", [data]);
        }

        // 2. TÍNH TOÁN NGÀY GỬI TIẾP THEO
        if (notif.is_recurring == 1 && notif.recurrence_days) {
            // Logic: Tìm ngày hợp lệ tiếp theo gần nhất
            const allowedDays = notif.recurrence_days.split(',').map(Number).sort((a,b)=>a-b); // VD: [1, 3, 5]
            const current = new Date(notif.scheduled_time);
            let nextDate = new Date(current);
            
            // Cộng thêm 1 ngày trước, sau đó kiểm tra xem có trùng ngày cho phép không
            // Nếu không trùng, cộng tiếp cho đến khi trùng
            let found = false;
            for (let i = 1; i <= 7; i++) { // Thử tối đa 7 ngày tới
                nextDate.setDate(nextDate.getDate() + 1);
                const dayOfWeek = nextDate.getDay(); // 0-6
                if (allowedDays.includes(dayOfWeek)) {
                    found = true;
                    break;
                }
            }
            
            if (found) {
                // Cập nhật thời gian gửi tiếp theo, giữ status 'pending'
                await connection.query(`UPDATE notification SET scheduled_time = ? WHERE id = ?`, [nextDate, notif.id]);
                console.log(`-> Đã gửi ID ${notif.id}, hẹn lại vào: ${nextDate}`);
            } else {
                // Trường hợp hiếm: ko tìm thấy ngày (dữ liệu lỗi), cho dừng luôn
                await connection.query(`UPDATE notification SET status_sent = 'sent' WHERE id = ?`, [notif.id]);
            }

        } else {
            // Nếu không lặp lại -> Đánh dấu đã xong
            await connection.query(`UPDATE notification SET status_sent = 'sent' WHERE id = ?`, [notif.id]);
        }

        await connection.commit();
    }
    connection.release();
  } catch (err) {
    if (connection) { await connection.rollback(); connection.release(); }
    console.error(err);
  }
});

// Khởi động server
app.listen(PORT, () => {
  console.log(`Backend server đang chạy tại http://localhost:${PORT}`);
});