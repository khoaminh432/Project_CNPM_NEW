// server.js
const express = require('express');
const cors = require('cors');
const signinRoute = require('./signinRoute');
const vehicleRoutes = require('./routes/vehicleRoutes');
const thongKeRoutes = require('./routes/thongKeRoutes'); // import route thống kê
const driverRoutes = require('./route/driver.js');
const busRoutes = require('./route/bus.js');
const scheduleRoutes = require('./route/schedule.js');
const routeRoutes = require('./route/route.js');
const notificationRoutes = require('./route/notification.js');
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', signinRoute);
// http://localhost:5000/api/vehicle/routes
// http://localhost:5000/api/vehicle/route/TD1
// http://localhost:5000/api/thongke

app.use('/api/vehicle', vehicleRoutes);
app.use('/api/thongke', thongKeRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/buses', busRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/notifications', notificationRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});