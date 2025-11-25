# Smart School Bus - Backend Setup Guide

## Prerequisites

- Node.js (v14 or higher)
- MySQL Server running on XAMPP
- npm or yarn

## Installation

### 1. Install Dependencies

```bash
cd bus_app
npm install express cors dotenv mysql2
```

### 2. Setup Database

1. Open phpMyAdmin (http://localhost/phpmyadmin)
2. Create a new database named `busapp`
3. Import the SQL file:
   ```sql
   -- Copy all content from src/db/busapp.sql and run in phpMyAdmin SQL tab
   ```

### 3. Environment Configuration

1. Copy `.env.example` to `.env`:
   ```bash
   copy .env.example .env
   ```

2. Edit `.env` with your database credentials:
   ```
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=busapp
   ```

### 4. Start the Server

```bash
node src/backend/server.js
```

You should see:
```
🚀 Server running on http://localhost:5000
📊 Database: busapp
🌍 CORS enabled for: http://localhost:3000
```

## API Endpoints

### Health Check
- `GET /api/health` - Check server status

### Database Test
- `GET /api/db-test` - Test database connection

### Drivers
- `GET /api/drivers` - Get all drivers
- `GET /api/drivers/:id` - Get driver details
- `GET /api/drivers/:id/schedules` - Get driver schedule
- `GET /api/drivers/:id/current-location` - Get current driver location

### Schedules
- `GET /api/schedules` - Get all schedules (query: ?date=2025-11-25)
- `GET /api/schedules/:id` - Get schedule details with students
- `PUT /api/schedules/:id/status` - Update schedule status

### Bus Locations (GPS Tracking)
- `GET /api/bus-locations/driver/:id/latest` - Get latest location for driver
- `GET /api/bus-locations/schedule/:id/history` - Get location history for schedule
- `POST /api/bus-locations` - Record new GPS location
- `GET /api/bus-locations/active/all` - Get all active drivers (for admin map)

## Frontend Integration

### Example: Fetch Driver List

```javascript
// In your React component
useEffect(() => {
  fetch('http://localhost:5000/api/drivers')
    .then(res => res.json())
    .then(data => {
      console.log('Drivers:', data.data);
      setDrivers(data.data);
    })
    .catch(err => console.error('Error:', err));
}, []);
```

### Example: Record GPS Location

```javascript
// When driver location updates
const recordLocation = (driverId, routeId, scheduleId, latitude, longitude, speed) => {
  fetch('http://localhost:5000/api/bus-locations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      driver_id: driverId,
      route_id: routeId,
      schedule_id: scheduleId,
      latitude,
      longitude,
      speed
    })
  })
  .then(res => res.json())
  .then(data => console.log('Location recorded:', data))
  .catch(err => console.error('Error:', err));
};
```

## Folder Structure

```
bus_app/
├── src/
│   ├── backend/
│   │   ├── db.js                 # Database connection
│   │   ├── server.js             # Express server
│   │   └── routes/
│   │       ├── drivers.js        # Driver endpoints
│   │       ├── schedules.js      # Schedule endpoints
│   │       └── busLocations.js   # GPS tracking endpoints
│   ├── components/               # React components
│   ├── Assets/                   # Static files
│   └── db/
│       └── busapp.sql            # Database schema
├── .env.example                  # Environment template
└── package.json                  # Dependencies
```

## Next Steps

1. Implement Authentication Routes (`/api/auth`)
2. Create Student Routes (`/api/students`)
3. Create Notifications Routes (`/api/notifications`)
4. Add JWT authentication middleware
5. Deploy to production server

## Common Issues

### "Database connection failed"
- Check MySQL is running on XAMPP
- Verify DB_HOST, DB_USER, DB_PASSWORD in .env
- Make sure database `busapp` exists

### "CORS error"
- Check CORS_ORIGIN in .env matches your React port
- Default is http://localhost:3000

### "Port already in use"
- Change PORT in .env to different port (e.g., 5001)
- Or kill existing process using port 5000

## Support

For issues or questions, check database schema in `src/db/busapp.sql`
