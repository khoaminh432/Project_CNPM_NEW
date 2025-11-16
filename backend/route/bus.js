// File: backend/route/bus.js
const express = require('express');
const router = express.Router();
// Đường dẫn này ĐÚNG với cấu trúc của bạn:
const pool = require('../db/connect.js'); 

/* ==========================================================
 * LẤY DANH SÁCH XE (GET /api/buses)
 * Thay thế cho DUMMY_VEHICLES
 * ========================================================== */
router.get('/', async (req, res) => {
  try {
    // Ghép bảng bus và route để lấy tên tuyến
    const sql = `
      SELECT 
        b.bus_id as id,
        CONCAT(r.route_name, ' - ', r.start_point, ' / ', r.end_point) as route
      FROM \`bus\` b
      LEFT JOIN \`route\` r ON b.default_route_id = r.route_id
    `;
    const [vehicles] = await pool.query(sql);
    res.json(vehicles);
  } catch (err) {
    console.error("Lỗi khi lấy danh sách xe:", err.sqlMessage || err.message);
    res.status(500).json({ error: 'Lỗi máy chủ' });
  }
});

module.exports = router;