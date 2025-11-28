// Students Management Routes
const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get all students
router.get('/', async (req, res) => {
  try {
    const { route_id, class_name, is_active } = req.query;
    
    let query = `
      SELECT 
        st.student_id,
        st.student_code,
        st.full_name,
        st.class_name,
        st.parent_phone,
        st.is_active,
        r.route_name,
        r.route_code,
        sp.stop_name as pickup_stop,
        sd.stop_name as dropoff_stop
      FROM students st
      LEFT JOIN routes r ON st.route_id = r.route_id
      LEFT JOIN stops sp ON st.pickup_stop_id = sp.stop_id
      LEFT JOIN stops sd ON st.dropoff_stop_id = sd.stop_id
      WHERE 1=1
    `;
    
    let params = [];
    
    if (route_id) {
      query += ` AND st.route_id = ?`;
      params.push(route_id);
    }
    
    if (class_name) {
      query += ` AND st.class_name = ?`;
      params.push(class_name);
    }
    
    if (is_active !== undefined) {
      query += ` AND st.is_active = ?`;
      params.push(is_active === 'true' ? 1 : 0);
    }
    
    query += ` ORDER BY st.class_name, st.full_name`;
    
    const connection = await db.getConnection();
    const [students] = await connection.query(query, params);
    connection.release();
    
    res.json({
      status: 'OK',
      data: students,
      count: students.length
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: error.message
    });
  }
});

// Get student details
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await db.getConnection();
    
    const [student] = await connection.query(`
      SELECT 
        st.*,
        r.route_name,
        r.route_code,
        sp.stop_name as pickup_stop,
        sp.stop_address as pickup_address,
        sd.stop_name as dropoff_stop,
        sd.stop_address as dropoff_address
      FROM students st
      LEFT JOIN routes r ON st.route_id = r.route_id
      LEFT JOIN stops sp ON st.pickup_stop_id = sp.stop_id
      LEFT JOIN stops sd ON st.dropoff_stop_id = sd.stop_id
      WHERE st.student_id = ?
    `, [id]);
    
    if (student.length === 0) {
      connection.release();
      return res.status(404).json({
        status: 'ERROR',
        message: 'Student not found'
      });
    }
    
    connection.release();
    
    res.json({
      status: 'OK',
      data: student[0]
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: error.message
    });
  }
});

// Create new student
router.post('/', async (req, res) => {
  try {
    const { 
      student_code, 
      full_name, 
      class_name, 
      parent_phone, 
      route_id, 
      pickup_stop_id, 
      dropoff_stop_id 
    } = req.body;
    
    if (!student_code || !full_name || !class_name || !parent_phone) {
      return res.status(400).json({
        status: 'ERROR',
        message: 'Missing required fields: student_code, full_name, class_name, parent_phone'
      });
    }
    
    const connection = await db.getConnection();
    const [result] = await connection.query(`
      INSERT INTO students 
      (student_code, full_name, class_name, parent_phone, route_id, pickup_stop_id, dropoff_stop_id, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `, [student_code, full_name, class_name, parent_phone, route_id || null, pickup_stop_id || null, dropoff_stop_id || null]);
    
    connection.release();
    
    res.status(201).json({
      status: 'OK',
      message: 'Student created successfully',
      data: {
        student_id: result.insertId,
        student_code,
        full_name
      }
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(409).json({
        status: 'ERROR',
        message: 'Student code already exists'
      });
    } else {
      res.status(500).json({
        status: 'ERROR',
        message: error.message
      });
    }
  }
});

// Update student
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      full_name, 
      class_name, 
      parent_phone, 
      route_id, 
      pickup_stop_id, 
      dropoff_stop_id, 
      is_active 
    } = req.body;
    
    const connection = await db.getConnection();
    await connection.query(`
      UPDATE students 
      SET 
        full_name = ?,
        class_name = ?,
        parent_phone = ?,
        route_id = ?,
        pickup_stop_id = ?,
        dropoff_stop_id = ?,
        is_active = ?,
        updated_at = NOW()
      WHERE student_id = ?
    `, [full_name, class_name, parent_phone, route_id, pickup_stop_id, dropoff_stop_id, is_active, id]);
    
    connection.release();
    
    res.json({
      status: 'OK',
      message: 'Student updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: error.message
    });
  }
});

// Get students by route
router.get('/route/:route_id', async (req, res) => {
  try {
    const { route_id } = req.params;
    const connection = await db.getConnection();
    
    const [students] = await connection.query(`
      SELECT 
        st.*,
        sp.stop_name as pickup_stop,
        sd.stop_name as dropoff_stop,
        sp.stop_order as pickup_order
      FROM students st
      LEFT JOIN stops sp ON st.pickup_stop_id = sp.stop_id
      LEFT JOIN stops sd ON st.dropoff_stop_id = sd.stop_id
      WHERE st.route_id = ? AND st.is_active = TRUE
      ORDER BY sp.stop_order, st.full_name
    `, [route_id]);
    
    connection.release();
    
    res.json({
      status: 'OK',
      data: students,
      count: students.length
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: error.message
    });
  }
});

module.exports = router;