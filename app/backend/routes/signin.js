const express = require('express');
const router = express.Router();
const db = require('../db.js');

// POST /api/signin (for admin compatibility)
router.post('/', async (req, res) => {
  try {
    const { tai_khoan, matkhau } = req.body;

    // Validate input
    if (!tai_khoan || !matkhau) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu'
      });
    }

    // Query user from database
    const [users] = await db.query(
      'SELECT user_id, username, password, role, linked_id FROM users WHERE username = ?',
      [tai_khoan]
    );

    // Check if user exists
    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Tên đăng nhập không tồn tại'
      });
    }

    const user = users[0];

    // Verify password
    if (user.password !== matkhau) {
      return res.status(401).json({
        success: false,
        message: 'Mật khẩu không đúng'
      });
    }

    // Return user data
    const userData = {
      user_id: user.user_id,
      username: user.username,
      role: user.role,
      linked_id: user.linked_id
    };

    res.json({
      success: true,
      message: 'Đăng nhập thành công',
      user: userData
    });

  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi hệ thống, vui lòng thử lại sau',
      error: error.message
    });
  }
});

module.exports = router;
