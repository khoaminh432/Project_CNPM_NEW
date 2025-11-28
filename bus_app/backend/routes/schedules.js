// Schedules Routes
const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get all schedules for a date
router.get('/', async (req, res) => {
  try {
    const { date } = req.query;
    
    let query = `
      SELECT 
        s.schedule_id,
        s.driver_id,
        s.schedule_date,
        s.day_of_week,
        s.status,
        s.actual_start_time,
        s.actual_end_time,
        s.total_students_expected,
        s.total_students_actual,
        r.route_code,
        r.route_name,
        r.planned_start,
        r.planned_end,
        d.full_name,
        d.driver_code
      FROM schedules s
      JOIN routes r ON s.route_id = r.route_id
      JOIN drivers d ON s.driver_id = d.driver_id
    `;
    
    let params = [];
    
    if (date) {
      query += ` WHERE s.schedule_date = ?`;
      params.push(date);
    }
    
    query += ` ORDER BY r.planned_start, d.full_name`;
    
    const connection = await db.getConnection();
    const [schedules] = await connection.query(query, params);
    connection.release();
    
    res.json({
      status: 'OK',
      data: schedules,
      count: schedules.length
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: error.message
    });
  }
});

// Get schedule details
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await db.getConnection();
    
    const [schedule] = await connection.query(`
      SELECT 
        s.*,
        r.route_code,
        r.route_name,
        r.planned_start,
        r.planned_end,
        r.distance_km,
        d.full_name,
        d.driver_code,
        d.phone
      FROM schedules s
      JOIN routes r ON s.route_id = r.route_id
      JOIN drivers d ON s.driver_id = d.driver_id
      WHERE s.schedule_id = ?
    `, [id]);
    
    if (schedule.length === 0) {
      connection.release();
      return res.status(404).json({
        status: 'ERROR',
        message: 'Schedule not found'
      });
    }
    
    // Get students for this route
    const [students] = await connection.query(`
      SELECT 
        st.student_id,
        st.student_code,
        st.full_name,
        st.class_name,
        st.parent_phone,
        sp.stop_name as pickup_stop,
        sd.stop_name as dropoff_stop
      FROM students st
      LEFT JOIN stops sp ON st.pickup_stop_id = sp.stop_id
      LEFT JOIN stops sd ON st.dropoff_stop_id = sd.stop_id
      WHERE st.route_id = ? AND st.is_active = TRUE
      ORDER BY sp.stop_order
    `, [schedule[0].route_id]);
    
    connection.release();
    
    res.json({
      status: 'OK',
      data: {
        ...schedule[0],
        students: students
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: error.message
    });
  }
});

// Update schedule status
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, actual_start_time, actual_end_time } = req.body;
    
    const connection = await db.getConnection();
    await connection.query(`
      UPDATE schedules 
      SET 
        status = ?,
        actual_start_time = ?,
        actual_end_time = ?,
        updated_at = NOW()
      WHERE schedule_id = ?
    `, [status, actual_start_time || null, actual_end_time || null, id]);
    
    connection.release();
    
    res.json({
      status: 'OK',
      message: 'Schedule updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: error.message
    });
  }
});

module.exports = router;