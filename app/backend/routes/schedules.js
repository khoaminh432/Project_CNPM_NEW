// Schedules Routes
const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get all schedules for a date
router.get('/', async (req, res) => {
  try {
    const { date, driver_id } = req.query;
    
    let query = `
      SELECT 
        bs.schedule_id,
        bs.schedule_date,
        bs.start_time,
        bs.end_time,
        bs.status,
        d.driver_id,
        d.name as driver_name,
        d.rating,
        r.route_id,
        r.route_name,
        r.start_point,
        r.end_point,
        r.planned_start,
        r.planned_end,
        r.total_students,
        (SELECT COUNT(*) FROM student_pickup sp WHERE sp.schedule_id = bs.schedule_id) as actual_student_count,
        (SELECT COUNT(*) FROM student_pickup sp WHERE sp.schedule_id = bs.schedule_id AND sp.status = 'DA_THA') as actual_dropped_count
      FROM bus_schedule bs
      LEFT JOIN driver d ON bs.driver_id = d.driver_id
      LEFT JOIN route r ON bs.route_id = r.route_id
      WHERE 1=1
    `;
    
    let params = [];
    
    if (date) {
      query += ` AND bs.schedule_date = ?`;
      params.push(date);
    }
    
    if (driver_id) {
      query += ` AND bs.driver_id = ?`;
      params.push(driver_id);
    }
    
    query += ` ORDER BY bs.schedule_date DESC, bs.start_time ASC`;
    
    const [schedules] = await db.query(query, params);
    
    res.json({
      success: true,
      schedules: schedules,
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
      FROM bus_schedule s
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
      FROM student st
      LEFT JOIN bus_stop sp ON st.pickup_stop_id = sp.stop_id
      LEFT JOIN bus_stop sd ON st.dropoff_stop_id = sd.stop_id
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
      UPDATE bus_schedule 
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

// Get statistics for driver (completion rate, cancel rate)
router.get('/stats/:driver_id', async (req, res) => {
  try {
    const { driver_id } = req.params;
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    
    const [stats] = await db.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'Hoàn thành' THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN status = 'Đã hủy' THEN 1 ELSE 0 END) as cancelled,
        SUM(CASE WHEN status IN ('Hoàn thành', 'Đã hủy') THEN 1 ELSE 0 END) as finished
      FROM bus_schedule
      WHERE driver_id = ?
        AND MONTH(schedule_date) = ?
        AND YEAR(schedule_date) = ?
    `, [driver_id, currentMonth, currentYear]);
    
    res.json({
      status: 'OK',
      data: {
        total: stats[0].total || 0,
        completed: stats[0].completed || 0,
        cancelled: stats[0].cancelled || 0,
        finished: stats[0].finished || 0
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: error.message
    });
  }
});

// Cancel schedule and update all related student pickups
router.put('/:schedule_id/cancel', async (req, res) => {
  try {
    const { schedule_id } = req.params;
    
    // Start transaction
    const connection = await db.getConnection();
    await connection.beginTransaction();
    
    try {
      // Update schedule status to cancelled and set end_time
      await connection.query(`
        UPDATE bus_schedule 
        SET status = 'Đã hủy', end_time = NOW()
        WHERE schedule_id = ?
      `, [schedule_id]);
      
      // Update all student pickups for this schedule to cancelled status
      await connection.query(`
        UPDATE student_pickup 
        SET status = 'HUY_CHUYEN'
        WHERE schedule_id = ?
      `, [schedule_id]);
      
      // Commit transaction
      await connection.commit();
      connection.release();
      
      res.json({
        status: 'OK',
        message: 'Schedule and all related student pickups cancelled successfully'
      });
    } catch (error) {
      // Rollback on error
      await connection.rollback();
      connection.release();
      throw error;
    }
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: error.message
    });
  }
});

// Get recent completed schedules for a driver
router.get('/recent/:driver_id', async (req, res) => {
  try {
    const { driver_id } = req.params;
    
    const [schedules] = await db.query(`
      SELECT 
        bs.schedule_id,
        bs.end_time,
        r.start_point,
        r.end_point,
        r.route_name
      FROM bus_schedule bs
      LEFT JOIN route r ON bs.route_id = r.route_id
      WHERE bs.driver_id = ?
        AND bs.status = 'Hoàn thành'
        AND bs.end_time IS NOT NULL
      ORDER BY bs.end_time DESC
      LIMIT 5
    `, [driver_id]);
    
    res.json({
      status: 'OK',
      data: schedules
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: error.message
    });
  }
});

// Get earliest schedule for today
router.get('/today/earliest/:driver_id', async (req, res) => {
  try {
    const { driver_id } = req.params;
    const today = new Date();
    const todayString = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
    
    console.log('Fetching schedule for driver:', driver_id, 'on date:', todayString);
    
    const [schedules] = await db.query(`
      SELECT 
        bs.schedule_id,
        bs.schedule_date,
        bs.start_time,
        bs.end_time,
        bs.status,
        r.route_id,
        r.route_name,
        r.start_point,
        r.end_point,
        r.planned_start,
        r.planned_end,
        r.total_students
      FROM bus_schedule bs
      LEFT JOIN route r ON bs.route_id = r.route_id
      WHERE bs.driver_id = ?
        AND DATE(bs.schedule_date) = DATE(?)
        AND bs.status IN ('Chưa bắt đầu', 'Đang thực hiện')
      ORDER BY r.planned_start ASC
      LIMIT 1
    `, [driver_id, todayString]);
    
    console.log('Schedules found:', schedules.length);
    
    if (schedules.length === 0) {
      console.log('No schedule found for today');
      return res.json({
        status: 'OK',
        data: null,
        message: 'No schedule found for today'
      });
    }
    
    // Generate simulated coordinates for start and end points
    // Base coordinates: TP.HCM city center (10.762622, 106.660172)
    const baseLatitude = 10.762622;
    const baseLongitude = 106.660172;
    
    // Generate random offset within ~5km radius (approximately 0.045 degrees)
    const randomOffset = () => (Math.random() - 0.5) * 0.09;
    
    const scheduleData = {
      ...schedules[0],
      start_location_lat: baseLatitude + randomOffset(),
      start_location_lng: baseLongitude + randomOffset(),
      end_location_lat: baseLatitude + randomOffset(),
      end_location_lng: baseLongitude + randomOffset()
    };
    
    console.log('Returning schedule with coordinates:', {
      schedule_id: scheduleData.schedule_id,
      start_lat: scheduleData.start_location_lat,
      start_lng: scheduleData.start_location_lng,
      end_lat: scheduleData.end_location_lat,
      end_lng: scheduleData.end_location_lng
    });
    
    res.json({
      status: 'OK',
      data: scheduleData
    });
  } catch (error) {
    console.error('Error in /today/earliest:', error);
    res.status(500).json({
      status: 'ERROR',
      message: error.message
    });
  }
});

// Start schedule - update status to "Đang thực hiện" and set start_time
router.put('/:schedule_id/start', async (req, res) => {
  try {
    const { schedule_id } = req.params;
    
    // Update schedule status and start_time
    await db.query(`
      UPDATE bus_schedule 
      SET status = 'Đang thực hiện', 
          start_time = NOW()
      WHERE schedule_id = ?
    `, [schedule_id]);
    
    res.json({
      status: 'OK',
      message: 'Schedule started successfully'
    });
  } catch (error) {
    console.error('Error starting schedule:', error);
    res.status(500).json({
      status: 'ERROR',
      message: error.message
    });
  }
});

// End schedule - update status to "Hoàn thành" and set end_time
router.put('/:schedule_id/end', async (req, res) => {
  try {
    const { schedule_id } = req.params;
    
    // Update schedule status and end_time
    await db.query(`
      UPDATE bus_schedule 
      SET status = 'Hoàn thành', 
          end_time = NOW()
      WHERE schedule_id = ?
    `, [schedule_id]);
    
    res.json({
      status: 'OK',
      message: 'Schedule completed successfully'
    });
  } catch (error) {
    console.error('Error ending schedule:', error);
    res.status(500).json({
      status: 'ERROR',
      message: error.message
    });
  }
});

module.exports = router;