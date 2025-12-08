// File: backend/route/route.js
const express = require('express');
const router = express.Router();
const pool = require('../db.js');

/* ==========================================================
 * LẤY DANH SÁCH TUYẾN (GET /api/routes)
 * Dùng cho dropdown
 * ========================================================== */
router.get('/', async (req, res) => {
  try {
    // Lấy tất cả thông tin để hiển thị dropdown rõ ràng
    const sql = `
      SELECT route_id, route_name, start_point, end_point 
      FROM route
      ORDER BY route_id ASC
    `;
    const [routes] = await pool.query(sql);
    res.json(routes);
  } catch (err) {
    console.error("Lỗi khi lấy danh sách tuyến:", err.sqlMessage || err.message);
    res.status(500).json({ error: 'Lỗi máy chủ' });
  }
});
router.get('/list', async (req, res) => {
  try {
    const sql = `
      SELECT 
        route_id AS route_code,
        route_name AS route_name,
        start_point AS start_location,
        end_point AS tramKetThuc,
        total_students AS total_students,
        planned_start AS planned_start,
        planned_end AS planned_end,
        status AS status
      FROM route
      ORDER BY route_id ASC
    `;
    const [routes] = await pool.query(sql);
    res.json(routes);
  } catch (err) {
    console.error("Lỗi khi lấy danh sách tuyến:", err.sqlMessage || err.message);
    res.status(500).json({ error: 'Lỗi máy chủsssss' });
  }
});

/* ==========================================================
 * LẤY THÔNG TIN CHI TIẾT TUYẾN (GET /api/routes/:id)
 * Dùng cho modal/xem chi tiết tuyến
 * ========================================================== */
router.get('/:id', async (req, res) => {
  try {
    const routeId = req.params.id;
    
    // Lấy thông tin cơ bản của tuyến
    const sqlRoute = `
      SELECT 
        route_id,
        route_name,
        start_point,
        end_point,
        planned_start,
        planned_end,
        total_students,
        status,
        created_at
      FROM route 
      WHERE route_id = ?
    `;
    
    // Lấy danh sách điểm dừng của tuyến
    const sqlStops = `
      SELECT 
        stop_id,
        stop_name,
        address,
        stop_order
      FROM bus_stop 
      WHERE route_id = ?
      ORDER BY stop_order ASC
    `;
    
    // Lấy danh sách xe đang chạy tuyến này
    const sqlBuses = `
      SELECT 
        b.bus_id,
        b.license_plate,
        b.capacity,
        b.status
      FROM bus b
      WHERE b.default_route_id = ?
    `;
    
    // Lấy lịch trình sắp tới
    const sqlSchedules = `
      SELECT 
        bs.schedule_id,
        bs.bus_id,
        bs.driver_id,
        bs.schedule_date,
        bs.start_time,
        bs.end_time,
        d.name AS driver_name
      FROM bus_schedule bs
      LEFT JOIN driver d ON bs.driver_id = d.driver_id
      WHERE bs.route_id = ? 
        AND bs.schedule_date >= CURDATE()
      ORDER BY bs.schedule_date ASC, bs.start_time ASC
      LIMIT 5
    `;
    
    const [[route]] = await pool.query(sqlRoute, [routeId]);
    
    if (!route) {
      return res.status(404).json({ error: 'Không tìm thấy tuyến đường' });
    }
    
    const [stops] = await pool.query(sqlStops, [routeId]);
    const [buses] = await pool.query(sqlBuses, [routeId]);
    const [schedules] = await pool.query(sqlSchedules, [routeId]);
    
    res.json({
      ...route,
      stops,
      buses,
      schedules
    });
    
  } catch (err) {
    console.error("Lỗi khi lấy chi tiết tuyến:", err.sqlMessage || err.message);
    res.status(500).json({ error: 'Lỗi máy chủ' });
  }
});


module.exports = router;