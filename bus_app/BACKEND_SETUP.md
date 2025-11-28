# Smart School Bus - Backend Setup Guide

## Prerequisites

- Node.js (v14 or higher)
- MySQL Server running on XAMPP
- npm or yarn

## Installation

### 1. Install Dependencies

```bash
# Install frontend dependencies
cd bus_app
npm install

# Install backend dependencies
cd backend
npm install
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
   cd backend
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
# Development mode (with auto-restart)
cd backend
npm run dev

# Or production mode
npm start
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

### Routes Management
- `GET /api/routes` - Get all routes
- `GET /api/routes/:id` - Get route details with stops and students
- `POST /api/routes` - Create new route
- `PUT /api/routes/:id` - Update route

### Students Management  
- `GET /api/students` - Get all students (query: ?route_id, ?class_name, ?is_active)
- `GET /api/students/:id` - Get student details
- `GET /api/students/route/:route_id` - Get students by route
- `POST /api/students` - Create new student
- `PUT /api/students/:id` - Update student

### Notifications
- `GET /api/notifications/user/:user_id` - Get notifications for user
- `GET /api/notifications/user/:user_id/unread/count` - Get unread count
- `POST /api/notifications` - Send notification to users
- `POST /api/notifications/broadcast` - Broadcast to user role
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/user/:user_id/read-all` - Mark all as read

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
├── backend/                      # Backend API Server
│   ├── config/
│   │   └── database.js           # Database connection pool
│   ├── routes/
│   │   ├── drivers.js            # Driver endpoints
│   │   ├── schedules.js          # Schedule endpoints
│   │   ├── busLocations.js       # GPS tracking endpoints
│   │   ├── routes.js             # Routes management
│   │   ├── students.js           # Students management
│   │   └── notifications.js      # Notifications system
│   ├── server.js                 # Express server main file
│   ├── package.json              # Backend dependencies
│   └── .env.example              # Environment template
├── src/                          # React Frontend
│   ├── components/               # React components
│   ├── Assets/                   # Static files
│   ├── pages/                    # Page components
│   └── db/
│       └── busapp.sql            # Database schema
├── public/                       # Public assets
├── package.json                  # Frontend dependencies
└── README.md
```

## Next Steps

1. ✅ Complete Backend API Structure
2. ✅ All Route Endpoints Implemented
3. Implement Authentication Routes (`/api/auth`)
4. Add JWT authentication middleware
5. Complete Frontend Integration for all components
6. Deploy to production server

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
