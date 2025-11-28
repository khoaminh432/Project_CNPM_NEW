// Drivers Routes
const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get all drivers
router.get('/', async (req, res) => {
  try {
    const connection = await db.getConnection();
    const [drivers] = await connection.query(`
      SELECT 
        d.driver_id,
        d.driver_code,
        d.full_name,
        d.phone,
        d.email,
        d.license_type,
        d.rating,
        d.status,
        d.join_date
      FROM drivers d
      WHERE d.status = 'active'
      ORDER BY d.full_name
    `);
    connection.release();
    
    res.json({
      status: 'OK',
      data: drivers,
      count: drivers.length
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: error.message
    });
  }
});

// Get driver by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await db.getConnection();
    const [driver] = await connection.query(`
      SELECT 
        d.*,
        u.username,
        u.email as account_email,
        u.user_role
      FROM drivers d
      JOIN users u ON d.user_id = u.user_id
      WHERE d.driver_id = ?
    `, [id]);
    connection.release();
    
    if (driver.length === 0) {
      return res.status(404).json({
        status: 'ERROR',
        message: 'Driver not found'
      });
    }
    
    res.json({
      status: 'OK',
      data: driver[0]
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: error.message
    });
  }
});

// Get driver schedule
router.get('/:id/schedules', async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await db.getConnection();
    const [schedules] = await connection.query(`
      SELECT 
        s.schedule_id,
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
        r.planned_end
      FROM schedules s
      JOIN routes r ON s.route_id = r.route_id
      WHERE s.driver_id = ?
      ORDER BY s.schedule_date DESC, r.planned_start
    `, [id]);
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

// Get current location
router.get('/:id/current-location', async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await db.getConnection();
    const [location] = await connection.query(`
      SELECT 
        bl.location_id,
        bl.latitude,
        bl.longitude,
        bl.speed,
        bl.heading,
        bl.accuracy,
        bl.recorded_at,
        r.route_name,
        s.schedule_date
      FROM bus_locations bl
      JOIN routes r ON bl.route_id = r.route_id
      JOIN schedules s ON bl.schedule_id = s.schedule_id
      WHERE bl.driver_id = ?
      ORDER BY bl.recorded_at DESC
      LIMIT 1
    `, [id]);
    connection.release();
    
    if (location.length === 0) {
      return res.status(404).json({
        status: 'ERROR',
        message: 'No location data available'
      });
    }
    
    res.json({
      status: 'OK',
      data: location[0]
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: error.message
    });
  }
});

module.exports = router;