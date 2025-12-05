// vehicleModel.js
const pool = require('../db');

// Lấy stop theo td_id
async function getStopsByRoute(td_id) {
  const [rows] = await pool.query(
    `SELECT stop_id, ten_stop, dia_chi, thu_tu
     FROM diem_stop
     WHERE td_id = ?
     ORDER BY thu_tu`,
    [td_id]
  );
  return rows;
}

// Lấy lịch trình theo td_id
async function getScheduleByRoute(td_id) {
  const [rows] = await pool.query(
    `SELECT lt_id, td_id, xb_id, tx_id, ngay_xe, gio_di, gio_den
     FROM lich_trinh
     WHERE td_id = ?`,
    [td_id]
  );
  return rows;
}

// Lấy tất cả tuyến + stops + schedule
async function getAllRoutesFull() {
  const [routes] = await pool.query("SELECT * FROM tuyen_duong");
  
  const result = await Promise.all(
    routes.map(async route => {
      const stops = await getStopsByRoute(route.td_id);
      const schedule = await getScheduleByRoute(route.td_id);
      return { ...route, stops, schedule };
    })
  );

  return result;
}

module.exports = {
  getStopsByRoute,
  getScheduleByRoute,
  getAllRoutesFull,
};
