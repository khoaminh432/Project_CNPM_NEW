const express = require('express');
const router = express.Router();
const db = require('../config/database');

/**
 * POST /api/auth/login
 * Login endpoint for parent, driver, and admin users
 */
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu'
      });
    }

    // Query user from database
    const [users] = await db.query(
      'SELECT user_id, username, password, role, linked_id FROM users WHERE username = ?',
      [username]
    );

    // Check if user exists
    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Tên đăng nhập không tồn tại'
      });
    }

    const user = users[0];

    // Verify password (plain text comparison - in production, use bcrypt)
    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        message: 'Mật khẩu không đúng'
      });
    }

    // Handle different user roles
    let userData = {
      user_id: user.user_id,
      username: user.username,
      role: user.role,
      linked_id: user.linked_id
    };

    // If user is a parent, get parent details
    if (user.role === 'parent') {
      const [parents] = await db.query(
        'SELECT parent_id, name, phone, email FROM parent WHERE user_id = ?',
        [user.user_id]
      );

      if (parents.length > 0) {
        userData = {
          ...userData,
          parent_id: parents[0].parent_id,
          name: parents[0].name,
          phone: parents[0].phone,
          email: parents[0].email
        };
      }
    }

    // If user is a driver, get driver details
    if (user.role === 'driver') {
      const [drivers] = await db.query(
        'SELECT driver_id, name, phone, email, status FROM driver WHERE user_id = ?',
        [user.user_id]
      );

      if (drivers.length > 0) {
        userData = {
          ...userData,
          driver_id: drivers[0].driver_id,
          name: drivers[0].name,
          phone: drivers[0].phone,
          email: drivers[0].email,
          status: drivers[0].status
        };
      }
    }

    // Return success response
    res.json({
      success: true,
      message: 'Đăng nhập thành công',
      user: userData
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi hệ thống, vui lòng thử lại sau',
      error: error.message
    });
  }
});

/**
 * POST /api/auth/logout
 * Logout endpoint (client-side will clear localStorage)
 */
router.post('/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Đăng xuất thành công'
  });
});

/**
 * GET /api/auth/profile
 * Get current user profile with detailed information
 */
router.get('/profile', async (req, res) => {
  try {
    const userId = req.query.user_id;
    const role = req.query.role;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin user_id'
      });
    }

    // Get basic user info
    const [users] = await db.query(
      'SELECT user_id, username, role FROM users WHERE user_id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng'
      });
    }

    const user = users[0];
    let profileData = { ...user };

    // Get role-specific details
    if (user.role === 'parent' || role === 'parent') {
      const [parents] = await db.query(
        'SELECT parent_id, name, phone, email, age, sex FROM parent WHERE user_id = ?',
        [userId]
      );

      if (parents.length > 0) {
        profileData = {
          ...profileData,
          ...parents[0],
          type: 'parent'
        };
      }
    } else if (user.role === 'driver' || role === 'driver') {
      const [drivers] = await db.query(
        `SELECT driver_id, name, phone, email, dob, gender, id_card, 
         rating, status, license_class, address, profile_image 
         FROM driver WHERE user_id = ?`,
        [userId]
      );

      if (drivers.length > 0) {
        profileData = {
          ...profileData,
          ...drivers[0],
          type: 'driver'
        };
      }
    }

    res.json({
      success: true,
      profile: profileData
    });

  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi hệ thống',
      error: error.message
    });
  }
});

/**
 * PUT /api/auth/profile
 * Update user profile
 */
router.put('/profile', async (req, res) => {
  try {
    const { user_id, role, name, phone, email, dob, gender, id_card, address } = req.body;

    if (!user_id || !role) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin cần thiết'
      });
    }

    if (role === 'parent') {
      // Calculate age from dob if provided
      let age = null;
      if (dob) {
        const birthDate = new Date(dob);
        const today = new Date();
        age = today.getFullYear() - birthDate.getFullYear();
      }

      await db.query(
        `UPDATE parent 
         SET name = ?, phone = ?, email = ?, age = ?, sex = ?
         WHERE user_id = ?`,
        [name, phone, email, age, gender, user_id]
      );
    } else if (role === 'driver') {
      // Check if driver exists
      const [existingDriver] = await db.query(
        'SELECT driver_id FROM driver WHERE user_id = ?',
        [user_id]
      );

      if (existingDriver.length > 0) {
        // Update existing driver
        await db.query(
          `UPDATE driver 
           SET name = ?, phone = ?, email = ?, dob = ?, gender = ?, id_card = ?, address = ?
           WHERE user_id = ?`,
          [name, phone, email, dob, gender, id_card, address, user_id]
        );
      } else {
        // Generate new driver_id
        const [maxDriverId] = await db.query(
          'SELECT driver_id FROM driver ORDER BY driver_id DESC LIMIT 1'
        );
        
        let newDriverId;
        if (maxDriverId.length > 0) {
          // Extract number from driver_id (e.g., "TX001" -> 1)
          const lastId = maxDriverId[0].driver_id;
          const numPart = parseInt(lastId.replace(/\D/g, ''));
          newDriverId = `TX${String(numPart + 1).padStart(3, '0')}`;
        } else {
          newDriverId = 'TX001';
        }

        // Insert new driver record
        await db.query(
          `INSERT INTO driver (driver_id, user_id, name, phone, email, dob, gender, id_card, address, status, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', NOW())`,
          [newDriverId, user_id, name, phone, email, dob, gender, id_card, address]
        );
      }
    }

    res.json({
      success: true,
      message: 'Cập nhật thông tin thành công'
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật thông tin',
      error: error.message
    });
  }
});

/**
 * PUT /api/auth/change-password
 * Change user password
 */
router.put('/change-password', async (req, res) => {
  try {
    const { user_id, role, current_password, new_password } = req.body;

    // Validate input
    if (!user_id || !role || !current_password || !new_password) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin bắt buộc'
      });
    }

    // Validate new password length
    if (new_password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu mới phải có ít nhất 6 ký tự'
      });
    }

    // Get current password from database
    const [users] = await db.query(
      'SELECT password FROM users WHERE user_id = ?',
      [user_id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Người dùng không tồn tại'
      });
    }

    // Verify current password
    if (users[0].password !== current_password) {
      return res.status(401).json({
        success: false,
        message: 'Mật khẩu hiện tại không đúng'
      });
    }

    // Update password
    await db.query(
      'UPDATE users SET password = ? WHERE user_id = ?',
      [new_password, user_id]
    );

    res.json({
      success: true,
      message: 'Đổi mật khẩu thành công'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi đổi mật khẩu',
      error: error.message
    });
  }
});

module.exports = router;
