// Notifications Management Routes
const express = require('express');
const router = express.Router();
const db = require('../config/database');

/**
 * POST /api/notifications/create
 * Create a new notification (e.g., report to admin)
 */
router.post('/create', async (req, res) => {
  try {
    const { title, content, recipient_type, type, sender_id, sender_name } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: title, content'
      });
    }

    // Insert notification into database with defaults
    const [result] = await db.query(
      `INSERT INTO notification 
       (recipient_type, title, content, type, status, status_sent, created_at)
       VALUES (?, ?, ?, ?, 'unread', 'sent', NOW())`,
      [recipient_type || 'system', title, content, type || 'manual']
    );

    res.status(201).json({
      success: true,
      message: 'Notification created successfully',
      notification_id: result.insertId
    });

  } catch (error) {
    console.error('Create notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating notification',
      error: error.message
    });
  }
});

/**
 * GET /api/notifications
 * Get all notifications for a specific user based on their role
 * If no user_id/role provided, return all notifications (for admin view)
 */
router.get('/', async (req, res) => {
  try {
    const { user_id, role } = req.query;

    let query = `SELECT id, recipient_type, title, content, type, scheduled_time, 
                        is_recurring, status_sent, created_at, status
                 FROM notification `;
    let params = [];
    
    // If role is provided, filter by recipient_type
    if (role) {
      query += `WHERE recipient_type = ? `;
      params.push(role);
    }
    
    query += `ORDER BY created_at DESC`;

    const [notifications] = await db.query(query, params);

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
    // Support both old format (title, message, notification_type, recipient_ids) 
    // and new format (title, content, recipient, type, specificIds)
    const { 
      title, 
      message, 
      content,
      notification_type, 
      type,
      sender_id, 
      recipient_ids,
      recipient,
      specificIds,
      scheduledTime,
      isRecurring,
      recurrenceDays
    } = req.body;
    
    // Normalize fields
    const notificationTitle = title;
    const notificationContent = content || message;
    const recipientType = recipient || notification_type;
    const notificationType = type || 'manual';
    
    if (!notificationTitle || !notificationContent || !recipientType) {
      return res.status(400).json({
        status: 'ERROR',
        message: 'Missing required fields: title, content, recipient'
      });
    }
    
    // Handle scheduled notifications
    const scheduled_time = scheduledTime ? new Date(scheduledTime).toISOString() : null;
    const is_recurring = isRecurring || false;
    const recurrence_days = recurrenceDays ? JSON.stringify(recurrenceDays) : null;
    
    // Determine if sending to specific users or all users of a role
    const sendToSpecificUsers = specificIds && specificIds.length > 0;
    const recipientIdsList = recipient_ids || specificIds || [];
    
    if (sendToSpecificUsers && recipientIdsList.length === 0) {
      return res.status(400).json({
        status: 'ERROR',
        message: 'No recipients specified'
      });
    }
    
    const connection = await db.getConnection();
    await connection.beginTransaction();
    
    try {
      if (!sendToSpecificUsers) {
        // Send to all users of the specified role (broadcast)
        const [result] = await connection.query(`
          INSERT INTO notification 
          (recipient_type, title, content, type, status, status_sent, scheduled_time, is_recurring, recurrence_days, created_at)
          VALUES (?, ?, ?, ?, 'unread', ?, ?, ?, ?, NOW())
        `, [
          recipientType, 
          notificationTitle, 
          notificationContent, 
          notificationType,
          scheduled_time ? 'pending' : 'sent',
          scheduled_time,
          is_recurring,
          recurrence_days
        ]);
        
        await connection.commit();
        connection.release();
        
        res.status(201).json({
          status: 'OK',
          message: `Notification sent to all ${recipientType}s successfully`,
          data: {
            notification_id: result.insertId
          }
        });
      } else {
        // Send to specific users (create individual notifications)
        const notifications = [];
        
        for (const recipient_id of recipientIdsList) {
          const [result] = await connection.query(`
            INSERT INTO notification 
            (recipient_type, title, content, type, status, status_sent, scheduled_time, is_recurring, recurrence_days, created_at)
            VALUES (?, ?, ?, ?, 'unread', ?, ?, ?, ?, NOW())
          `, [
            recipientType, 
            notificationTitle, 
            notificationContent, 
            notificationType,
            scheduled_time ? 'pending' : 'sent',
            scheduled_time,
            is_recurring,
            recurrence_days
          ]);
          
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
      }
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

/**
 * GET /api/notifications/users/:role
 * Get list of users by role (driver or parent) for sending notifications
 */
router.get('/users/:role', async (req, res) => {
  try {
    const { role } = req.params;
    
    if (role === 'driver') {
      // Get all drivers
      const [drivers] = await db.query(`
        SELECT driver_id as id, name, phone
        FROM driver
        WHERE status = 'active'
        ORDER BY name
      `);
      
      res.json({
        status: 'OK',
        data: drivers,
        count: drivers.length
      });
    } else if (role === 'parent') {
      // Get all parents
      const [parents] = await db.query(`
        SELECT parent_id as id, name, phone
        FROM parent
        ORDER BY name
      `);
      
      res.json({
        status: 'OK',
        data: parents,
        count: parents.length
      });
    } else {
      res.status(400).json({
        status: 'ERROR',
        message: 'Invalid role. Must be "driver" or "parent"'
      });
    }
  } catch (error) {
    console.error('Get users by role error:', error);
    res.status(500).json({
      status: 'ERROR',
      message: error.message
    });
  }
});

module.exports = router;