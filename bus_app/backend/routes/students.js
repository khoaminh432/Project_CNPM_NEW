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
    
    const [students] = await db.query(`
      SELECT 
        s.student_id,
        s.name as full_name,
        s.gender,
        s.class_name,
        s.school_name,
        p.name as parent_name,
        p.phone as parent_phone,
        pickup_stop.stop_name as pickup_stop,
        dropoff_stop.stop_name as dropoff_stop,
        pickup_stop.stop_order as pickup_order
      FROM student s
      LEFT JOIN parent p ON s.parent_id = p.parent_id
      LEFT JOIN bus_stop pickup_stop ON s.stop_id = pickup_stop.stop_id
      LEFT JOIN bus_stop dropoff_stop ON s.dropoff_stop_id = dropoff_stop.stop_id
      WHERE pickup_stop.route_id = ? OR dropoff_stop.route_id = ?
      ORDER BY pickup_stop.stop_order, s.name
    `, [route_id, route_id]);
    
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

// Get students by driver_id from student_pickup
router.get('/driver/:driver_id', async (req, res) => {
  try {
    const { driver_id } = req.params;
    const { schedule_id } = req.query;
    
    let query = `
      SELECT DISTINCT
        s.student_id,
        s.name as full_name,
        s.gender,
        s.class_name,
        s.school_name,
        p.name as parent_name,
        p.phone as parent_phone,
        pickup_stop.stop_name as pickup_stop,
        dropoff_stop.stop_name as dropoff_stop,
        pickup_stop.stop_order as pickup_order,
        sp.pickup_id,
        sp.schedule_id,
        sp.status as pickup_status
      FROM student_pickup sp
      JOIN student s ON sp.student_id = s.student_id
      LEFT JOIN parent p ON s.parent_id = p.parent_id
      LEFT JOIN bus_stop pickup_stop ON s.stop_id = pickup_stop.stop_id
      LEFT JOIN bus_stop dropoff_stop ON s.dropoff_stop_id = dropoff_stop.stop_id
      WHERE sp.driver_id = ?
    `;
    
    let params = [driver_id];
    
    if (schedule_id) {
      query += ` AND sp.schedule_id = ?`;
      params.push(schedule_id);
    }
    
    query += ` ORDER BY pickup_stop.stop_order, s.name`;
    
    const [students] = await db.query(query, params);
    
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

// Update student pickup status
router.put('/pickup/:pickup_id/status', async (req, res) => {
  try {
    const { pickup_id } = req.params;
    const { status, pickup_time, dropoff_time, schedule_id } = req.body;
    
    let updateFields = ['status = ?'];
    let updateValues = [status];
    
    if (pickup_time) {
      updateFields.push('pickup_time = ?');
      updateValues.push(pickup_time);
    }
    
    if (dropoff_time) {
      updateFields.push('dropoff_time = ?');
      updateValues.push(dropoff_time);
    }
    
    updateValues.push(pickup_id);
    
    const query = `UPDATE student_pickup SET ${updateFields.join(', ')} WHERE pickup_id = ?`;
    
    await db.query(query, updateValues);
    
    // Check if all students in this schedule are either DA_THA or HUY_CHUYEN
    if (schedule_id) {
      const [students] = await db.query(`
        SELECT status 
        FROM student_pickup 
        WHERE schedule_id = ?
      `, [schedule_id]);
      
      const allCompleted = students.every(s => 
        s.status === 'DA_THA' || s.status === 'HUY_CHUYEN'
      );
      
      const allCancelled = students.every(s => 
        s.status === 'HUY_CHUYEN'
      );
      
      if (allCancelled && students.length > 0) {
        // Update schedule status to cancelled if all students are cancelled
        await db.query(`
          UPDATE bus_schedule 
          SET status = 'Đã hủy', end_time = NOW()
          WHERE schedule_id = ?
        `, [schedule_id]);
        
        res.json({
          status: 'OK',
          message: 'Status updated successfully',
          scheduleCompleted: true,
          scheduleCancelled: true
        });
        return;
      } else if (allCompleted && students.length > 0) {
        // Update schedule status to completed if all students are either dropped off or cancelled
        await db.query(`
          UPDATE bus_schedule 
          SET status = 'Hoàn thành', end_time = NOW()
          WHERE schedule_id = ?
        `, [schedule_id]);
        
        res.json({
          status: 'OK',
          message: 'Status updated successfully',
          scheduleCompleted: true,
          scheduleCancelled: false
        });
        return;
      }
    }
    
    res.json({
      status: 'OK',
      message: 'Status updated successfully',
      scheduleCompleted: false,
      scheduleCancelled: false
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: error.message
    });
  }
});

// Get students by schedule_id from student_pickup
router.get('/schedule/:schedule_id', async (req, res) => {
  try {
    const { schedule_id } = req.params;
    
    const [students] = await db.query(`
      SELECT DISTINCT
        s.student_id,
        s.name as full_name,
        s.gender,
        s.class_name,
        s.school_name,
        p.name as parent_name,
        p.phone as parent_phone,
        pickup_stop.stop_name as pickup_stop,
        dropoff_stop.stop_name as dropoff_stop,
        pickup_stop.stop_order as pickup_order,
        sp.pickup_id,
        sp.schedule_id,
        sp.status as pickup_status
      FROM student_pickup sp
      JOIN student s ON sp.student_id = s.student_id
      LEFT JOIN parent p ON s.parent_id = p.parent_id
      LEFT JOIN bus_stop pickup_stop ON s.stop_id = pickup_stop.stop_id
      LEFT JOIN bus_stop dropoff_stop ON s.dropoff_stop_id = dropoff_stop.stop_id
      WHERE sp.schedule_id = ?
      ORDER BY pickup_stop.stop_order, s.name
    `, [schedule_id]);
    
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