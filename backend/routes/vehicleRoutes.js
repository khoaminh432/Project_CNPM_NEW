const express = require('express');
const router = express.Router();
const { getRoute, getAllRoutes } = require('../controllers/vehicleController');

// API lấy tuyến theo td_id
router.get('/route/:td_id', getRoute);

// API lấy tất cả tuyến
router.get('/routes', getAllRoutes);

module.exports = router;
