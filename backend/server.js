
const express = require('express');
const cors = require('cors');

// 1. Import file route tài xế
const driverRoutes = require('./route/driver.js');
const busRoutes = require('./route/bus.js'); 
const scheduleRoutes = require('./route/schedule.js');
const routeRoutes = require('./route/route.js');

const app = express();
const PORT = 3001; 

app.use(cors());
app.use(express.json());

// 2. Chỉ dẫn cho server: 
app.use('/api/drivers', driverRoutes); 
app.use('/api/buses', busRoutes); 
app.use('/api/schedules', scheduleRoutes);
app.use('/api/routes', routeRoutes);

// Khởi động server
app.listen(PORT, () => {
  console.log(`Backend server đang chạy tại http://localhost:${PORT}`);
});