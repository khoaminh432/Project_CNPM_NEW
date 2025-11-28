const express = require('express');
const cors = require('cors');
const vehicleRoutes = require('./routes/vehicleRoutes');
const thongKeRoutes = require('./routes/thongKeRoutes'); // import route thống kê

const app = express();
app.use(cors());
app.use(express.json());

// http://localhost:5000/api/vehicle/routes
// http://localhost:5000/api/vehicle/route/TD1
// http://localhost:5000/api/thongke

app.use('/api/vehicle', vehicleRoutes);
app.use('/api/thongke', thongKeRoutes);

app.listen(5000, () => {
    console.log('Server running on port 5000');
});

