// Notifications Management Routes
const express = require('express');
const router = express.Router();
const db = require('../config/database');

/**
 * GET /api/notifications
 * Get all notifications for a specific user based on their role
 */
router.get('/', async (req, res) => {
  try {
    const { user_id, role } = req.query;

    if (!user_id || !role) {
      return res.status(400).json({
        success: false,
        message: 'Missing user_id or role'
      });
    }

    // Get notifications based on recipient_type matching user role
    const [notifications] = await db.query(
      `SELECT id, recipient_type, title, content, type, scheduled_time, 
              is_recurring, status_sent, created_at, status
       FROM notification 
       WHERE recipient_type = ? OR recipient_type = 'system'
       ORDER BY created_at DESC`,
      [role]
    );

    res.json({
      success: true,
      notifications: notifications
    });

  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching notifications',
      error: error.message
    });
  }
});

/**
 * PUT /api/notifications/:id/read
 * Mark a notification as read
 */
router.put('/:id/read', async (req, res) => {
  try {
    const notificationId = req.params.id;
    const { user_id, driver_id } = req.body;

    // Update notification table
    await db.query(
      `UPDATE notification 
       SET status = 'read' 
       WHERE id = ?`,
      [notificationId]
    );

    // Update notification_recipients table if recipient info provided
    if (driver_id) {
      await db.query(
        `UPDATE notification_recipients 
         SET status = 'read' 
         WHERE notification_id = ? AND recipient_id = ?`,
        [notificationId, driver_id]
      );
    }

    res.json({
      success: true,
      message: 'Notification marked as read'
    });

  } catch (error) {
    console.error('Mark notification as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating notification',
      error: error.message
    });
  }
});

/**
 * PUT /api/notifications/mark-all-read
 * Mark all notifications as read for a user
 */
router.put('/mark-all-read', async (req, res) => {
  try {
    const { role, driver_id } = req.body;

    if (!role) {
      return res.status(400).json({
        success: false,
        message: 'Missing role'
      });
    }

    // Update notification table
    await db.query(
      `UPDATE notification 
       SET status = 'read' 
       WHERE (recipient_type = ? OR recipient_type = 'system') 
       AND status = 'unread'`,
      [role]
    );

    // Update notification_recipients table if driver_id provided
    if (driver_id) {
      await db.query(
        `UPDATE notification_recipients 
         SET status = 'read' 
         WHERE recipient_id = ? AND status = 'unread'`,
        [driver_id]
      );
    }

    res.json({
      success: true,
      message: 'All notifications marked as read'
    });

  } catch (error) {
    console.error('Mark all as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating notifications',
      error: error.message
    });
  }
});

/**
 * DELETE /api/notifications/:id
 * Delete a notification
 */
router.delete('/:id', async (req, res) => {
  try {
    const notificationId = req.params.id;

    await db.query(
      'DELETE FROM notification WHERE id = ?',
      [notificationId]
    );

    res.json({
      success: true,
      message: 'Notification deleted'
    });

  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting notification',
      error: error.message
    });
  }
});

/**
 * DELETE /api/notifications/delete-read
 * Delete all read notifications for a user
 */
router.delete('/delete-read/all', async (req, res) => {
  try {
    const { role, driver_id } = req.body;

    if (!role) {
      return res.status(400).json({
        success: false,
        message: 'Missing role'
      });
    }

    // Delete read notifications for the user's role
    await db.query(
      `DELETE FROM notification 
       WHERE (recipient_type = ? OR recipient_type = 'system') 
       AND status = 'read'`,
      [role]
    );

    // Delete from notification_recipients if driver_id provided
    if (driver_id) {
      await db.query(
        `DELETE FROM notification_recipients 
         WHERE recipient_id = ? AND status = 'read'`,
        [driver_id]
      );
    }

    res.json({
      success: true,
      message: 'All read notifications deleted'
    });

  } catch (error) {
    console.error('Delete read notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting notifications',
      error: error.message
    });
  }
});

// Legacy routes for backward compatibility
// Get notifications for a user
router.get('/user/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;
    const { limit = 20, offset = 0, is_read } = req.query;
    
    let query = `
      SELECT 
        n.notification_id,
        n.title,
        n.message,
        n.notification_type,
        n.is_read,
        n.created_at,
        u.username as sender_name
      FROM notifications n
      LEFT JOIN users u ON n.sender_id = u.user_id
      WHERE n.recipient_id = ?
    `;
    
    let params = [user_id];
    
    if (is_read !== undefined) {
      query += ` AND n.is_read = ?`;
      params.push(is_read === 'true' ? 1 : 0);
    }
    
    query += ` ORDER BY n.created_at DESC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), parseInt(offset));
    
    const connection = await db.getConnection();
    const [notifications] = await connection.query(query, params);
    
    // Get total count
    const [countResult] = await connection.query(
      `SELECT COUNT(*) as total FROM notifications WHERE recipient_id = ?`,
      [user_id]
    );
    
    connection.release();
    
    res.json({
      status: 'OK',
      data: notifications,
      count: notifications.length,
      total: countResult[0].total
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: error.message
    });
  }
});

// Get unread notifications count
router.get('/user/:user_id/unread/count', async (req, res) => {
  try {
    const { user_id } = req.params;
    const connection = await db.getConnection();
    
    const [result] = await connection.query(`
      SELECT COUNT(*) as unread_count 
      FROM notifications 
      WHERE recipient_id = ? AND is_read = FALSE
    `, [user_id]);
    
    connection.release();
    
    res.json({
      status: 'OK',
      data: {
        unread_count: result[0].unread_count
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: error.message
    });
  }
});

// Send notification to user(s)
router.post('/', async (req, res) => {
  try {
    const { title, message, notification_type, sender_id, recipient_ids } = req.body;
    
    if (!title || !message || !notification_type || !recipient_ids || !Array.isArray(recipient_ids)) {
      return res.status(400).json({
        status: 'ERROR',
        message: 'Missing required fields: title, message, notification_type, recipient_ids (array)'
      });
    }
    
    const connection = await db.getConnection();
    await connection.beginTransaction();
    
    try {
      const notifications = [];
      
      // Insert notification for each recipient
      for (const recipient_id of recipient_ids) {
        const [result] = await connection.query(`
          INSERT INTO notifications 
          (title, message, notification_type, sender_id, recipient_id, created_at)
          VALUES (?, ?, ?, ?, ?, NOW())
        `, [title, message, notification_type, sender_id || null, recipient_id]);
        
        notifications.push({
          notification_id: result.insertId,
          recipient_id: recipient_id
        });
      }
      
      await connection.commit();
      connection.release();
      
      res.status(201).json({
        status: 'OK',
        message: 'Notifications sent successfully',
        data: {
          notifications_sent: notifications.length,
          notifications: notifications
        }
      });
    } catch (error) {
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

// Mark notification as read
router.put('/:id/read', async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await db.getConnection();
    
    await connection.query(`
      UPDATE notifications 
      SET is_read = TRUE, read_at = NOW()
      WHERE notification_id = ?
    `, [id]);
    
    connection.release();
    
    res.json({
      status: 'OK',
      message: 'Notification marked as read'
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: error.message
    });
  }
});

// Mark all notifications as read for a user
router.put('/user/:user_id/read-all', async (req, res) => {
  try {
    const { user_id } = req.params;
    const connection = await db.getConnection();
    
    await connection.query(`
      UPDATE notifications 
      SET is_read = TRUE, read_at = NOW()
      WHERE recipient_id = ? AND is_read = FALSE
    `, [user_id]);
    
    connection.release();
    
    res.json({
      status: 'OK',
      message: 'All notifications marked as read'
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: error.message
    });
  }
});

// Send broadcast notification (to all users of a specific role)
router.post('/broadcast', async (req, res) => {
  try {
    const { title, message, notification_type, sender_id, target_role } = req.body;
    
    if (!title || !message || !notification_type || !target_role) {
      return res.status(400).json({
        status: 'ERROR',
        message: 'Missing required fields: title, message, notification_type, target_role'
      });
    }
    
    const connection = await db.getConnection();
    
    // Get all users with the target role
    const [users] = await connection.query(`
      SELECT user_id FROM users 
      WHERE user_role = ? AND is_active = TRUE
    `, [target_role]);
    
    if (users.length === 0) {
      connection.release();
      return res.json({
        status: 'OK',
        message: 'No active users found with the specified role',
        data: { notifications_sent: 0 }
      });
    }
    
    await connection.beginTransaction();
    
    try {
      const notifications = [];
      
      // Insert notification for each user
      for (const user of users) {
        const [result] = await connection.query(`
          INSERT INTO notifications 
          (title, message, notification_type, sender_id, recipient_id, created_at)
          VALUES (?, ?, ?, ?, ?, NOW())
        `, [title, message, notification_type, sender_id || null, user.user_id]);
        
        notifications.push({
          notification_id: result.insertId,
          recipient_id: user.user_id
        });
      }
      
      await connection.commit();
      connection.release();
      
      res.status(201).json({
        status: 'OK',
        message: `Broadcast notification sent to ${notifications.length} users`,
        data: {
          notifications_sent: notifications.length,
          target_role: target_role
        }
      });
    } catch (error) {
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

module.exports = router;