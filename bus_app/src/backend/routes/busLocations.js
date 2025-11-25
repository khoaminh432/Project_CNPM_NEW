// Bus Locations Routes (Real-time GPS Tracking)
const express = require('express');
const router = express.Router();
const db = require('../db');

// Get latest location for a driver
router.get('/driver/:id/latest', async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await db.getConnection();
    
    const [location] = await connection.query(`
      SELECT 
        bl.*,
        r.route_name,
        r.route_code,
        s.schedule_date,
        d.full_name,
        d.driver_code
      FROM bus_locations bl
      JOIN routes r ON bl.route_id = r.route_id
      JOIN schedules s ON bl.schedule_id = s.schedule_id
      JOIN drivers d ON bl.driver_id = d.driver_id
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

// Get location history for a schedule
router.get('/schedule/:id/history', async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await db.getConnection();
    
    const [locations] = await connection.query(`
      SELECT 
        bl.location_id,
        bl.latitude,
        bl.longitude,
        bl.speed,
        bl.heading,
        bl.accuracy,
        bl.recorded_at
      FROM bus_locations bl
      WHERE bl.schedule_id = ?
      ORDER BY bl.recorded_at ASC
    `, [id]);
    
    connection.release();
    
    res.json({
      status: 'OK',
      data: locations,
      count: locations.length
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: error.message
    });
  }
});

// Record new GPS location (from driver app)
router.post('/', async (req, res) => {
  try {
    const { driver_id, route_id, schedule_id, latitude, longitude, speed, heading, accuracy } = req.body;
    
    // Validation
    if (!driver_id || !route_id || !schedule_id || !latitude || !longitude) {
      return res.status(400).json({
        status: 'ERROR',
        message: 'Missing required fields: driver_id, route_id, schedule_id, latitude, longitude'
      });
    }
    
    const connection = await db.getConnection();
    const [result] = await connection.query(`
      INSERT INTO bus_locations 
      (driver_id, route_id, schedule_id, latitude, longitude, speed, heading, accuracy, recorded_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `, [driver_id, route_id, schedule_id, latitude, longitude, speed || 0, heading || null, accuracy || null]);
    
    connection.release();
    
    res.status(201).json({
      status: 'OK',
      message: 'Location recorded successfully',
      data: {
        location_id: result.insertId,
        driver_id,
        route_id,
        schedule_id,
        latitude,
        longitude
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: error.message
    });
  }
});

// Get all active drivers locations (for admin map)
router.get('/active/all', async (req, res) => {
  try {
    const connection = await db.getConnection();
    
    const [locations] = await connection.query(`
      SELECT 
        bl.location_id,
        bl.driver_id,
        bl.latitude,
        bl.longitude,
        bl.speed,
        bl.heading,
        bl.recorded_at,
        r.route_name,
        r.route_code,
        d.full_name,
        d.driver_code,
        s.status as schedule_status
      FROM bus_locations bl
      JOIN routes r ON bl.route_id = r.route_id
      JOIN drivers d ON bl.driver_id = d.driver_id
      JOIN schedules s ON bl.schedule_id = s.schedule_id
      WHERE (bl.driver_id, bl.recorded_at) IN (
        SELECT driver_id, MAX(recorded_at)
        FROM bus_locations
        WHERE recorded_at > DATE_SUB(NOW(), INTERVAL 1 HOUR)
        GROUP BY driver_id
      )
      ORDER BY bl.recorded_at DESC
    `);
    
    connection.release();
    
    res.json({
      status: 'OK',
      data: locations,
      count: locations.length
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: error.message
    });
  }
});

module.exports = router;
