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
        st.name as full_name,
        st.class_name,
        st.school_name,
        st.gender,
        st.parent_id,
        p.name as parent_name,
        p.phone as parent_phone,
        sp.stop_name as pickup_stop,
        sd.stop_name as dropoff_stop,
        st.stop_id as pickup_stop_id,
        st.dropoff_stop_id
      FROM student st
      LEFT JOIN parent p ON st.parent_id = p.parent_id
      LEFT JOIN bus_stop sp ON st.stop_id = sp.stop_id
      LEFT JOIN bus_stop sd ON st.dropoff_stop_id = sd.stop_id
      WHERE 1=1
    `;
    
    let params = [];
    
    if (class_name) {
      query += ` AND st.class_name = ?`;
      params.push(class_name);
    }
    
    query += ` ORDER BY st.class_name, st.name`;
    
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
      FROM student st
      LEFT JOIN routes r ON st.route_id = r.route_id
      LEFT JOIN bus_stop sp ON st.pickup_stop_id = sp.stop_id
      LEFT JOIN bus_stop sd ON st.dropoff_stop_id = sd.stop_id
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
      INSERT INTO student 
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
      UPDATE student 
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
    
    // Get student info before updating for notification
    const [studentInfo] = await db.query(`
      SELECT s.student_id, s.name as student_name, s.parent_id
      FROM student_pickup sp
      JOIN student s ON sp.student_id = s.student_id
      WHERE sp.pickup_id = ?
    `, [pickup_id]);
    
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
    
    // Send notification to parent about status change
    if (studentInfo.length > 0 && studentInfo[0].parent_id) {
      const student = studentInfo[0];
      let statusText = '';
      
      switch(status) {
        case 'CHO_DON':
          statusText = 'đang chờ đón';
          break;
        case 'DA_DON':
          statusText = 'đã được đón lên xe';
          break;
        case 'DA_THA':
          statusText = 'đã được thả xuống xe';
          break;
        case 'HUY_CHUYEN':
          statusText = 'đã hủy chuyến';
          break;
        default:
          statusText = status;
      }
      
      await db.query(`
        INSERT INTO notification 
        (recipient_type, title, content, type, status, status_sent, created_at)
        VALUES (?, ?, ?, ?, 'unread', 'sent', NOW())
      `, [
        'parent',
        'Học sinh cập nhật trạng thái',
        `Học sinh ${student.student_name} ${statusText}.`,
        'status_update'
      ]);
    }
    
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

// Get total unique stops for a schedule (start_point + end_point + pickup + dropoff)
router.get('/schedule/:schedule_id/stops', async (req, res) => {
  try {
    const { schedule_id } = req.params;
    
    // Count distinct stops from student pickup/dropoff
    const [studentStops] = await db.query(`
      SELECT COUNT(DISTINCT stop_id) as student_stops
      FROM (
        SELECT s.stop_id
        FROM student_pickup sp
        JOIN student s ON sp.student_id = s.student_id
        WHERE sp.schedule_id = ? AND s.stop_id IS NOT NULL
        UNION
        SELECT s.dropoff_stop_id as stop_id
        FROM student_pickup sp
        JOIN student s ON sp.student_id = s.student_id
        WHERE sp.schedule_id = ? AND s.dropoff_stop_id IS NOT NULL
      ) as all_stops
    `, [schedule_id, schedule_id]);
    
    // Add 2 for start_point and end_point
    const total_stops = (studentStops[0].student_stops || 0) + 2;
    
    res.json({
      status: 'OK',
      total_stops: total_stops
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: error.message
    });
  }
});

// Get detailed stop information for a schedule
router.get('/schedule/:schedule_id/stops/details', async (req, res) => {
  try {
    const { schedule_id } = req.params;
    
    // Get schedule and route info
    const [scheduleInfo] = await db.query(`
      SELECT 
        bs.start_time,
        r.start_point,
        r.end_point,
        r.route_id
      FROM bus_schedule bs
      JOIN route r ON bs.route_id = r.route_id
      WHERE bs.schedule_id = ?
    `, [schedule_id]);
    
    if (scheduleInfo.length === 0) {
      return res.json({
        status: 'ERROR',
        message: 'Schedule not found'
      });
    }
    
    const { start_time, start_point, end_point, route_id } = scheduleInfo[0];
    
    // Get all stops with student counts (pickup and dropoff)
    const [stops] = await db.query(`
      SELECT 
        stop_id,
        stop_type,
        stop_name,
        COUNT(*) as student_count
      FROM (
        SELECT 
          bs.stop_id,
          'pickup' as stop_type,
          bs.stop_name,
          sp.student_id
        FROM student_pickup sp
        JOIN student s ON sp.student_id = s.student_id
        JOIN bus_stop bs ON s.stop_id = bs.stop_id
        WHERE sp.schedule_id = ? AND s.stop_id IS NOT NULL
        
        UNION ALL
        
        SELECT 
          bs.stop_id,
          'dropoff' as stop_type,
          bs.stop_name,
          sp.student_id
        FROM student_pickup sp
        JOIN student s ON sp.student_id = s.student_id
        JOIN bus_stop bs ON s.dropoff_stop_id = bs.stop_id
        WHERE sp.schedule_id = ? AND s.dropoff_stop_id IS NOT NULL
      ) as all_stops
      GROUP BY stop_id, stop_type, stop_name
      ORDER BY stop_id, stop_type
    `, [schedule_id, schedule_id]);
    
    // Helper function to generate random coordinates in TP.HCM area
    const generateRandomCoordinates = (index, total) => {
      // TP.HCM center coordinates with random base offset for each trip
      const baseLatitude = 10.762622 + (Math.random() - 0.5) * 0.03;
      const baseLongitude = 106.660172 + (Math.random() - 0.5) * 0.03;
      
      // Create a route with random direction
      const progress = index / (total + 1);
      const angle = Math.random() * Math.PI * 2; // Random angle
      const distance = 0.08; // Max distance from center
      
      // Generate coordinates along a line with the random angle
      const latOffset = Math.cos(angle) * distance * progress;
      const lngOffset = Math.sin(angle) * distance * progress;
      
      // Add random variation (±0.015 degrees, roughly ±1.5km)
      const randomLat = (Math.random() - 0.5) * 0.03;
      const randomLng = (Math.random() - 0.5) * 0.03;
      
      return {
        latitude: baseLatitude + latOffset + randomLat,
        longitude: baseLongitude + lngOffset + randomLng
      };
    };
    
    // Build stops array with start and end points
    const stopsArray = [];
    const totalStops = stops.length + 2; // +2 for start and end
    
    // Add start point with coordinates
    const startCoords = generateRandomCoordinates(0, totalStops);
    stopsArray.push({
      stop_name: start_point,
      stop_type: 'start',
      student_count: 0,
      time_offset: 0,
      latitude: startCoords.latitude,
      longitude: startCoords.longitude
    });
    
    // Add middle stops with coordinates
    stops.forEach((stop, index) => {
      const coords = generateRandomCoordinates(index + 1, totalStops);
      stopsArray.push({
        stop_id: stop.stop_id, // Add stop_id to the response
        stop_name: stop.stop_name,
        stop_type: stop.stop_type === 'pickup' ? 'Điểm đón' : 'Điểm trả',
        student_count: stop.student_count,
        time_offset: (index + 1) * 8,
        latitude: coords.latitude,
        longitude: coords.longitude
      });
    });
    
    // Add end point with coordinates
    const endCoords = generateRandomCoordinates(totalStops - 1, totalStops);
    stopsArray.push({
      stop_name: end_point,
      stop_type: 'end',
      student_count: 0,
      time_offset: (stops.length + 1) * 8,
      latitude: endCoords.latitude,
      longitude: endCoords.longitude
    });
    
    res.json({
      status: 'OK',
      data: {
        start_time,
        start_point,
        end_point,
        stops: stopsArray
      }
    });
  } catch (error) {
    console.error('Error fetching stop details:', error);
    res.status(500).json({
      status: 'ERROR',
      message: error.message
    });
  }
});

// Get students grouped by stops for student list modal
router.get('/schedule/:schedule_id/students-by-stop', async (req, res) => {
  try {
    const { schedule_id } = req.params;

    // Get schedule info first
    const [scheduleInfo] = await db.query(`
      SELECT 
        bs.start_time,
        r.start_point,
        r.end_point
      FROM bus_schedule bs
      JOIN route r ON bs.route_id = r.route_id
      WHERE bs.schedule_id = ?
    `, [schedule_id]);

    if (scheduleInfo.length === 0) {
      return res.json({
        status: 'ERROR',
        message: 'Schedule not found'
      });
    }

    const { start_time } = scheduleInfo[0];

    // Get students grouped by pickup stops
    const [pickupStops] = await db.query(`
      SELECT 
        bs.stop_id,
        bs.stop_name,
        'Điểm đón' as stop_type,
        sp.pickup_id,
        s.student_id,
        s.name as full_name,
        s.class_name as class,
        sp.status
      FROM student_pickup sp
      JOIN student s ON sp.student_id = s.student_id
      JOIN bus_stop bs ON s.stop_id = bs.stop_id
      WHERE sp.schedule_id = ? AND s.stop_id IS NOT NULL
      ORDER BY bs.stop_id, s.name
    `, [schedule_id]);

    // Get students grouped by dropoff stops
    const [dropoffStops] = await db.query(`
      SELECT 
        bs.stop_id,
        bs.stop_name,
        'Điểm trả' as stop_type,
        sp.pickup_id,
        s.student_id,
        s.name as full_name,
        s.class_name as class,
        sp.status
      FROM student_pickup sp
      JOIN student s ON sp.student_id = s.student_id
      JOIN bus_stop bs ON s.dropoff_stop_id = bs.stop_id
      WHERE sp.schedule_id = ? AND s.dropoff_stop_id IS NOT NULL
      ORDER BY bs.stop_id, s.name
    `, [schedule_id]);

    // Combine and group by stops
    const allStudents = [...pickupStops, ...dropoffStops];
    const stopGroups = {};

    allStudents.forEach(student => {
      const key = `${student.stop_id}_${student.stop_type}`;
      if (!stopGroups[key]) {
        stopGroups[key] = {
          stop_id: student.stop_id,
          stop_name: student.stop_name,
          stop_type: student.stop_type,
          students: []
        };
      }
      stopGroups[key].students.push({
        pickup_id: student.pickup_id,
        student_id: student.student_id,
        full_name: student.full_name,
        class: student.class,
        status: student.status
      });
    });

    // Convert to array and add time offsets
    const stopsArray = Object.values(stopGroups).map((stop, index) => ({
      ...stop,
      time_offset: (index + 1) * 8 // 8 minutes between stops
    }));

    res.json({
      status: 'OK',
      data: {
        start_time,
        stops: stopsArray
      }
    });

  } catch (error) {
    console.error('Error fetching students by stop:', error);
    res.status(500).json({
      status: 'ERROR',
      message: error.message
    });
  }
});

// Check if schedule can be completed (all students must be dropped off)
router.get('/schedule/:schedule_id/check-completion', async (req, res) => {
  try {
    const { schedule_id } = req.params;

    // Count students by status
    const [statusCounts] = await db.query(`
      SELECT 
        status,
        COUNT(*) as count
      FROM student_pickup
      WHERE schedule_id = ?
      GROUP BY status
    `, [schedule_id]);

    const statusMap = {};
    statusCounts.forEach(row => {
      statusMap[row.status] = row.count;
    });

    const waiting = statusMap['CHO_DON'] || 0;
    const pickedUp = statusMap['DA_DON'] || 0;
    const droppedOff = statusMap['DA_TRA'] || 0;
    const cancelled = statusMap['HUY_CHUYEN'] || 0;

    // Can complete only if no students are waiting or picked up
    const canComplete = waiting === 0 && pickedUp === 0;

    res.json({
      status: 'OK',
      canComplete: canComplete,
      message: canComplete 
        ? 'Tất cả học sinh đã được trả' 
        : 'Còn học sinh chưa được trả',
      waiting: waiting,
      picked_up: pickedUp,
      dropped_off: droppedOff,
      cancelled: cancelled
    });

  } catch (error) {
    console.error('Error checking completion:', error);
    res.status(500).json({
      status: 'ERROR',
      message: error.message
    });
  }
});

// Check if all students at a specific stop have been picked up or dropped off
router.get('/schedule/:schedule_id/stop/:stop_id/status', async (req, res) => {
  try {
    const { schedule_id, stop_id } = req.params;
    
    console.log(`📊 Checking status for schedule ${schedule_id}, stop ${stop_id}`);
    
    // Check for pickup students at this stop
    const [pickupStudents] = await db.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN sp.status = 'DA_DON' THEN 1 ELSE 0 END) as picked_up,
        GROUP_CONCAT(CONCAT(s.name, ':', sp.status, '(', sp.student_id, ')') SEPARATOR ', ') as debug_info
      FROM student_pickup sp
      JOIN student s ON sp.student_id = s.student_id
      WHERE sp.schedule_id = ? AND s.stop_id = ?
    `, [schedule_id, stop_id]);
    
    // Check for dropoff students at this stop
    const [dropoffStudents] = await db.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN sp.status = 'DA_TRA' THEN 1 ELSE 0 END) as dropped_off,
        GROUP_CONCAT(CONCAT(s.name, ':', sp.status, '(', sp.student_id, ')') SEPARATOR ', ') as debug_info
      FROM student_pickup sp
      JOIN student s ON sp.student_id = s.student_id
      WHERE sp.schedule_id = ? AND s.dropoff_stop_id = ?
    `, [schedule_id, stop_id]);
    
    const pickupTotal = pickupStudents[0].total || 0;
    const pickupCompleted = parseInt(pickupStudents[0].picked_up) || 0;
    const dropoffTotal = dropoffStudents[0].total || 0;
    const dropoffCompleted = parseInt(dropoffStudents[0].dropped_off) || 0;
    
    // Determine which type this stop is based on which has students
    const isPickupStop = pickupTotal > 0;
    const isDropoffStop = dropoffTotal > 0;
    
    console.log(`Stop ${stop_id} - Pickup: ${pickupCompleted}/${pickupTotal}, Dropoff: ${dropoffCompleted}/${dropoffTotal}`);
    if (isPickupStop) console.log(`  Pickup students: ${pickupStudents[0].debug_info}`);
    if (isDropoffStop) console.log(`  Dropoff students: ${dropoffStudents[0].debug_info}`);
    
    // If no students found, check if there are ANY student_pickup records for this schedule
    if (pickupTotal === 0 && dropoffTotal === 0) {
      const [anyStudents] = await db.query(`
        SELECT COUNT(*) as count FROM student_pickup WHERE schedule_id = ?
      `, [schedule_id]);
      console.log(`⚠️ No students found at stop ${stop_id} for schedule ${schedule_id}. Total students in schedule: ${anyStudents[0].count}`);
    }
    
    // Calculate completion status
    const allPickedUp = pickupTotal === 0 || (pickupTotal > 0 && pickupTotal === pickupCompleted);
    const allDroppedOff = dropoffTotal === 0 || (dropoffTotal > 0 && dropoffTotal === dropoffCompleted);
    
    res.json({
      status: 'OK',
      data: {
        pickup: {
          total: pickupTotal,
          completed: pickupCompleted,
          all_picked_up: allPickedUp
        },
        dropoff: {
          total: dropoffTotal,
          completed: dropoffCompleted,
          all_dropped_off: allDroppedOff
        },
        all_picked_up: allPickedUp,
        all_dropped_off: allDroppedOff
      }
    });
    
  } catch (error) {
    console.error('❌ Error checking stop status:', error);
    res.status(500).json({
      status: 'ERROR',
      message: error.message
    });
  }
});

// TEMPORARY: Create test data for schedule LT_TX007_005
router.post('/schedule/:schedule_id/create-test-data', async (req, res) => {
  try {
    const { schedule_id } = req.params;
    
    console.log(`Creating test data for schedule ${schedule_id}`);
    
    // Insert test student_pickup records
    await db.query(`
      INSERT INTO student_pickup 
        (pickup_id, student_id, driver_id, schedule_id, stop_id, pickup_time, dropoff_time, status) 
      VALUES
        (?, 'HS101', 'TX007', ?, 'STOP1', NULL, NULL, 'CHO_DON'),
        (?, 'HS102', 'TX007', ?, 'STOP1', NULL, NULL, 'CHO_DON')
      ON DUPLICATE KEY UPDATE 
        schedule_id = VALUES(schedule_id),
        status = VALUES(status)
    `, [
      `PU_${schedule_id}_001`,
      schedule_id,
      `PU_${schedule_id}_002`,
      schedule_id
    ]);
    
    console.log(`✅ Test data created for schedule ${schedule_id}`);
    
    res.json({
      status: 'OK',
      message: 'Test data created successfully'
    });
    
  } catch (error) {
    console.error('Error creating test data:', error);
    res.status(500).json({
      status: 'ERROR',
      message: error.message
    });
  }
});

module.exports = router;