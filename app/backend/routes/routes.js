// Routes Management Routes
const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get all routes
router.get('/', async (req, res) => {
  try {
    const connection = await db.getConnection();
    
    const [routes] = await connection.query(`
      SELECT 
        r.*,
        COUNT(st.student_id) as total_students,
        COUNT(sp.stop_id) as total_stops
      FROM route r
      LEFT JOIN student st ON r.route_id = st.route_id AND st.is_active = TRUE
      LEFT JOIN bus_stop sp ON r.route_id = sp.route_id
      GROUP BY r.route_id
      ORDER BY r.route_code
    `);
    
    connection.release();
    
    res.json({
      status: 'OK',
      data: routes,
      count: routes.length
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: error.message
    });
  }
});

// Get route details with stops
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await db.getConnection();
    
    // Get route info
    const [route] = await connection.query(`
      SELECT * FROM route WHERE route_id = ?
    `, [id]);
    
    if (route.length === 0) {
      connection.release();
      return res.status(404).json({
        status: 'ERROR',
        message: 'Route not found'
      });
    }
    
    // Get route stops
    const [stops] = await connection.query(`
      SELECT 
        stop_id,
        stop_name,
        stop_address,
        latitude,
        longitude,
        stop_order,
        estimated_arrival_time
      FROM bus_stop
      WHERE route_id = ?
      ORDER BY stop_order
    `, [id]);
    
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
    `, [id]);
    
    connection.release();
    
    res.json({
      status: 'OK',
      data: {
        ...route[0],
        stops: stops,
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

// Create new route
router.post('/', async (req, res) => {
  try {
    const { route_code, route_name, planned_start, planned_end, distance_km, description } = req.body;
    
    if (!route_code || !route_name || !planned_start || !planned_end) {
      return res.status(400).json({
        status: 'ERROR',
        message: 'Missing required fields: route_code, route_name, planned_start, planned_end'
      });
    }
    
    const connection = await db.getConnection();
    const [result] = await connection.query(`
      INSERT INTO route 
      (route_code, route_name, planned_start, planned_end, distance_km, description, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
    `, [route_code, route_name, planned_start, planned_end, distance_km || null, description || null]);
    
    connection.release();
    
    res.status(201).json({
      status: 'OK',
      message: 'Route created successfully',
      data: {
        route_id: result.insertId,
        route_code,
        route_name
      }
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(409).json({
        status: 'ERROR',
        message: 'Route code already exists'
      });
    } else {
      res.status(500).json({
        status: 'ERROR',
        message: error.message
      });
    }
  }
});

// Update route
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { route_name, planned_start, planned_end, distance_km, description } = req.body;
    
    const connection = await db.getConnection();
    await connection.query(`
      UPDATE route 
      SET 
        route_name = ?,
        planned_start = ?,
        planned_end = ?,
        distance_km = ?,
        description = ?,
        updated_at = NOW()
      WHERE route_id = ?
    `, [route_name, planned_start, planned_end, distance_km, description, id]);
    
    connection.release();
    
    res.json({
      status: 'OK',
      message: 'Route updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: error.message
    });
  }
});

module.exports = router;