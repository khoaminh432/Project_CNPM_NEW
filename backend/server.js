// server.js
const express = require('express');
const cors = require('cors');
const signinRoute = require('./signinRoute');
const vehicleRoutes = require('./routes/vehicleRoutes');
const thongKeRoutes = require('./routes/thongKeRoutes'); // import route thống kê
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

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});