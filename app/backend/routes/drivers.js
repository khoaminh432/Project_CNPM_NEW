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
        d.name,
        d.phone,
        d.email,
        d.license_class,
        d.rating,
        d.status,
        d.created_at
      FROM driver d
      ORDER BY d.name
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
    
    const [driver] = await db.query(`
      SELECT 
        d.driver_id,
        d.name,
        d.phone,
        d.email,
        d.rating,
        d.status,
        d.profile_image,
        d.created_at,
        d.address,
        d.gender,
        d.license_class
      FROM driver d
      WHERE d.driver_id = ?
    `, [id]);
    
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
      FROM bus_schedule s
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
      JOIN bus_schedule s ON bl.schedule_id = s.schedule_id
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

// Create new driver
router.post('/', async (req, res) => {
  try {
    const { id, name, phone, address, status, licenseClass, work_schedule } = req.body;
    
    const connection = await db.getConnection();
    await connection.query(`
      INSERT INTO driver 
        (driver_id, name, phone, address, status, license_class, work_schedule)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [id, name, phone, address, status || 'Rảnh', licenseClass || 'B2', work_schedule]);
    
    connection.release();
    
    res.status(201).json({
      status: 'OK',
      message: 'Driver created successfully',
      data: { driver_id: id, name, phone, address, status, license_class: licenseClass, work_schedule }
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: error.message
    });
  }
});

// Update driver
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, address, status, licenseClass, work_schedule } = req.body;
    
    const connection = await db.getConnection();
    const [result] = await connection.query(`
      UPDATE driver
      SET 
        name = ?, 
        phone = ?, 
        address = ?, 
        status = ?, 
        license_class = ?,
        work_schedule = ?
      WHERE driver_id = ?
    `, [name, phone, address, status, licenseClass, work_schedule, id]);
    
    connection.release();
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: 'ERROR',
        message: 'Driver not found'
      });
    }
    
    res.json({
      status: 'OK',
      message: 'Driver updated successfully',
      data: { driver_id: id, name, phone, address, status, license_class: licenseClass, work_schedule }
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: error.message
    });
  }
});

// Delete driver
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const connection = await db.getConnection();
    const [result] = await connection.query(`
      DELETE FROM driver WHERE driver_id = ?
    `, [id]);
    
    connection.release();
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: 'ERROR',
        message: 'Driver not found'
      });
    }
    
    res.json({
      status: 'OK',
      message: 'Driver deleted successfully'
    });
  } catch (error) {
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(409).json({
        status: 'ERROR',
        message: 'Cannot delete driver: referenced in schedules'
      });
    }
    res.status(500).json({
      status: 'ERROR',
      message: error.message
    });
  }
});

// Update driver status
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Validate status values
    const validStatuses = ['Đang hoạt động', 'Tạm nghỉ', 'Nghỉ việc'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        status: 'ERROR',
        message: 'Invalid status value'
      });
    }
    
    await db.query(`
      UPDATE driver 
      SET status = ?
      WHERE driver_id = ?
    `, [status, id]);
    
    res.json({
      status: 'OK',
      message: 'Driver status updated successfully',
      data: { driver_id: id, status }
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: error.message
    });
  }
});

module.exports = router;