// Routes Management Routes
const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get all routes
router.get('/', async (req, res) => {
  try {
    const connection = await db.getConnection();
    
    const [routes] = await connection.query(`
      SELECT * FROM route
      ORDER BY route_id
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
    const { route_name, planned_start, planned_end, start_point, end_point } = req.body;
    
    if (!route_name || !planned_start || !planned_end) {
      return res.status(400).json({
        status: 'ERROR',
        message: 'Missing required fields: route_name, planned_start, planned_end'
      });
    }
    
    const connection = await db.getConnection();
    
    // Generate random route_id like R10, R25, etc.
    let route_id;
    let isUnique = false;
    
    while (!isUnique) {
      const randomNum = Math.floor(Math.random() * 900) + 10; // Random number from 10-909
      route_id = `R${randomNum}`;
      
      // Check if route_id already exists
      const [existing] = await connection.query(`
        SELECT route_id FROM route WHERE route_id = ?
      `, [route_id]);
      
      if (existing.length === 0) {
        isUnique = true;
      }
    }
    
    const [result] = await connection.query(`
      INSERT INTO route 
      (route_id, route_name, planned_start, planned_end, start_point, end_point)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [route_id, route_name, planned_start, planned_end, start_point || null, end_point || null]);
    
    connection.release();
    
    res.status(201).json({
      status: 'OK',
      message: 'Route created successfully',
      data: {
        route_id: route_id,
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