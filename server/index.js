const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'bus_map'
});

db.connect((err) => {
    if (err) console.error('Loi ket noi DB:', err.code);
    else {
        console.log('Da ket noi Database');
        initSimulation();
    }
});

// 1. CAC API HE THONG

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    db.query("SELECT * FROM users WHERE username = ? AND password = ?", [username, password], (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.length > 0) {
            const user = results[0];
            res.json({ success: true, user: { username: user.username, role: user.role, linked_id: user.linked_id } });
        } else {
             db.query("SELECT * FROM parent WHERE email = ?", [username], (errP, resP) => {
                 if(resP && resP.length > 0) res.json({ success: true, user: { username: resP[0].name, role: 'parent', linked_id: resP[0].parent_id } });
                 else res.status(401).json({ success: false, message: "Sai tai khoan hoac mat khau" });
             });
        }
    });
});

app.get('/api/profile', (req, res) => db.query("SELECT * FROM parent WHERE parent_id = ?", [req.query.id], (e, d) => res.json(d[0] || {})));
app.put('/api/profile', (req, res) => { const { name, phone, email, age, sex, parent_id } = req.body; db.query("UPDATE parent SET name=?, phone=?, email=?, age=?, sex=? WHERE parent_id=?", [name, phone, email, age, sex, parent_id], (e) => res.json({ message: "Updated" })); });
app.get('/api/students', (req, res) => db.query("SELECT * FROM student", (e, d) => res.json(d)));
app.post('/api/students', (req, res) => { const id = 'HS' + Date.now().toString().slice(-5); db.query("INSERT INTO student (student_id, parent_id, name, class) VALUES (?, ?, ?, ?)", [id, req.body.parent_id, req.body.name, req.body.studentClass], () => res.json({ message: "Added", student_id: id })); });
app.delete('/api/students/:id', (req, res) => db.query("DELETE FROM student WHERE student_id = ?", [req.params.id], () => res.json({ message: "Deleted" })));
app.get('/api/routes', (req, res) => db.query("SELECT * FROM route", (e, d) => res.json(d)));
app.get('/api/route-detail', (req, res) => { db.query("SELECT r.route_name, r.start_point, r.end_point, s.stop_name, s.address, s.stop_id, s.lat, s.lng FROM route r JOIN bus_stop s ON r.route_id = s.route_id WHERE r.route_id = ? ORDER BY s.stop_id ASC", [req.query.id], (err, data) => res.json(err || data)); });
app.get('/api/route-path', (req, res) => { db.query("SELECT lat, lng FROM bus_stop WHERE route_id = ? ORDER BY stop_id ASC", [req.query.id || 'R01'], (err, data) => res.json(err ? [] : data.map(s => [s.lat, s.lng]))); });
app.get('/api/active-buses-by-route', (req, res) => { const sql = `SELECT bus_id, license_plate FROM bus WHERE default_route_id = ? AND status = 'Đang hoạt động'`; db.query(sql, [req.query.id], (err, data) => res.json(err || data)); });
app.get('/api/bus-schedule-info', (req, res) => { const sql = `SELECT d.name, d.phone, d.driver_id, s.start_time, s.schedule_id, s.schedule_date FROM bus_schedule s JOIN driver d ON s.driver_id = d.driver_id WHERE s.bus_id = ? ORDER BY ABS(DATEDIFF(s.schedule_date, NOW())) ASC, s.start_time ASC LIMIT 1`; db.query(sql, [req.query.busId], (err, data) => res.json(err || data[0] || {})); });
app.get('/api/route-driver-info', (req, res) => { const sql = `SELECT d.name, d.phone, d.driver_id, s.start_time, s.schedule_id, s.schedule_date FROM bus_schedule s JOIN driver d ON s.driver_id = d.driver_id JOIN bus b ON s.bus_id = b.bus_id WHERE s.route_id = ? AND b.status = 'Đang hoạt động' LIMIT 1`; db.query(sql, [req.query.id], (err, data) => res.json(err || data[0] || {})); });

// 2. LAY TRANG THAI SINH VIEN
app.get('/api/route-students-status', (req, res) => {
    const routeId = req.query.id;
    const parentId = req.query.parentId;
    const scheduleId = req.query.scheduleId;

    if (!scheduleId) {
        let sql = `SELECT st.student_id, st.name, st.class, bs.stop_name, bs.stop_id, 'Chưa lên xe' as pickup_status FROM student st JOIN bus_stop bs ON st.stop_id = bs.stop_id WHERE bs.route_id = ?`;
        if (parentId) { sql += " AND st.parent_id = ?"; }
        db.query(sql, parentId ? [routeId, parentId] : [routeId], (err, data) => res.json(err || data));
        return;
    }

    let sql = `
        SELECT st.student_id, st.name, st.class, bs.stop_name, bs.stop_id, 
               COALESCE(sp.status, 'Chưa lên xe') as pickup_status,
               sp.schedule_id
        FROM student st
        JOIN bus_stop bs ON st.stop_id = bs.stop_id
        LEFT JOIN student_pickup sp ON st.student_id = sp.student_id AND sp.schedule_id = ?
        WHERE bs.route_id = ?
    `;
    
    const params = [scheduleId, routeId];
    if (parentId) {
        sql += " AND st.parent_id = ?";
        params.push(parentId);
    }
    db.query(sql, params, (err, data) => res.json(err || data));
});

// API CAP NHAT TRANG THAI
app.post('/api/update-student-status', (req, res) => {
    const { student_id, status, driver_id, stop_id, schedule_id } = req.body;
    if (!schedule_id) return res.status(400).json({ error: "Thieu schedule_id" });

    db.query("SELECT pickup_id FROM student_pickup WHERE student_id = ? AND schedule_id = ?", [student_id, schedule_id], (err, results) => {
        if (results.length > 0) {
            db.query("UPDATE student_pickup SET status = ?, stop_id = ?, driver_id = ?, pickup_time = NOW() WHERE pickup_id = ?", [status, stop_id, driver_id, results[0].pickup_id], () => res.json({message: "Updated"}));
        } else {
            const pid = 'PU' + Date.now();
            db.query(`INSERT INTO student_pickup (pickup_id, student_id, driver_id, schedule_id, pickup_time, status, stop_id) VALUES (?, ?, ?, ?, NOW(), ?, ?)`, [pid, student_id, driver_id, schedule_id, status, stop_id], () => res.json({message: "Inserted"}));
        }
    });
});

app.get('/api/bus-locations', (req, res) => {
    let sql = `SELECT bl.*, b.default_route_id FROM bus_location bl JOIN bus b ON bl.bus_id = b.bus_id WHERE b.status = 'Đang hoạt động'`;
    let params = [];
    if (req.query.busId) { sql += ` AND bl.bus_id = ?`; params.push(req.query.busId); }
    else if (req.query.routeId) { sql += ` AND b.default_route_id = ?`; params.push(req.query.routeId); }
    
    db.query(sql, params, (err, data) => {
        if(err) return res.json(err);
        const enrichedData = data.map(bus => {
            const simData = SIMULATION_CACHE[bus.bus_id];
            return simData ? { ...bus, next_stop_name: simData.nextStopName, is_moving: simData.isMoving } : bus;
        });
        res.json(enrichedData);
    });
});

app.get('/api/bus-info-by-route', (req, res) => {
    db.query(`SELECT b.license_plate, b.bus_id, b.status, r.route_name, r.route_id FROM bus b JOIN route r ON b.default_route_id = r.route_id WHERE r.route_id = ? AND b.status = 'Đang hoạt động' LIMIT 1`, [req.query.id], (err, data) => res.json(err || data[0] || {}));
});

app.get('/api/home-summary', (req, res) => {
    if (!req.query.parentId) return db.query("SELECT b.license_plate, b.status, b.bus_id, r.route_name FROM bus b LEFT JOIN route r ON b.default_route_id = r.route_id WHERE b.status = 'Đang hoạt động' LIMIT 1", (err, data) => res.json(err || data[0] || {}));
    db.query(`SELECT DISTINCT b.license_plate, b.status, b.bus_id, r.route_name, r.route_id FROM parent p JOIN student s ON p.parent_id = s.parent_id JOIN bus_stop bs ON s.stop_id = bs.stop_id JOIN route r ON bs.route_id = r.route_id LEFT JOIN bus b ON r.route_id = b.default_route_id WHERE p.parent_id = ? AND b.status = 'Đang hoạt động' LIMIT 1`, [req.query.parentId], (err, data) => res.json(data && data.length > 0 ? data[0] : {}));
});

app.get('/api/notifications', (req, res) => db.query("SELECT * FROM notification WHERE notificationFor = 'Phụ huynh' ORDER BY created_at DESC", (err, data) => res.json(err || data)));
app.put('/api/notifications/:id', (req, res) => db.query("UPDATE notification SET status = ? WHERE id = ?", [req.body.status, req.params.id], (err) => res.json(err || {msg:"ok"})));
app.put('/api/notifications-mark-all', (req, res) => db.query("UPDATE notification SET status = 'read' WHERE notificationFor = 'Phụ huynh'", (err) => res.json(err || {msg:"ok"})));
app.delete('/api/notifications/:id', (req, res) => db.query("DELETE FROM notification WHERE id = ?", [req.params.id], (err) => res.json(err || {msg:"ok"})));

// 3. HE THONG GIA LAP

let SIMULATION_CACHE = {}; 
let STOPS_CACHE = {};      

function getDistanceFromLatLonInM(lat1, lon1, lat2, lon2) {
  var R = 6371000; 
  var dLat = deg2rad(lat2-lat1);
  var dLon = deg2rad(lon2-lon1); 
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2); 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return R * c; 
}
function deg2rad(deg) { return deg * (Math.PI/180); }

async function fetchOSRMPath(coords) {
    try {
        const waypoints = coords.map(c => `${c.lng},${c.lat}`).join(';');
        const url = `http://router.project-osrm.org/route/v1/driving/${waypoints}?overview=full&geometries=geojson`;
        const response = await fetch(url);
        const data = await response.json();
        if (data.routes && data.routes.length > 0) {
            return data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
        }
    } catch (error) { console.error("OSRM Error:", error.message); }
    return [];
}

function initSimulation() {
    console.log("Khoi tao he thong gia lap...");

    db.query("SELECT route_id, stop_id, stop_name, lat, lng FROM bus_stop ORDER BY route_id, stop_id ASC", async (err, stops) => {
        if (err) return;
        
        stops.forEach(s => {
            if (!STOPS_CACHE[s.route_id]) STOPS_CACHE[s.route_id] = [];
            STOPS_CACHE[s.route_id].push(s);
        });

        const routesGrouped = {};
        stops.forEach(s => {
            if (!routesGrouped[s.route_id]) routesGrouped[s.route_id] = [];
            routesGrouped[s.route_id].push({ lat: s.lat, lng: s.lng });
        });

        db.query("SELECT bus_id, default_route_id FROM bus WHERE status = 'Đang hoạt động'", async (errB, buses) => {
            if (errB) return;

            for (const bus of buses) {
                const routeId = bus.default_route_id;
                if (!routesGrouped[routeId]) continue;

                const fullPath = await fetchOSRMPath(routesGrouped[routeId]);
                if (fullPath.length > 0) {
                    const startProgress = Math.floor(Math.random() * (fullPath.length / 2));
                    SIMULATION_CACHE[bus.bus_id] = {
                        points: fullPath,
                        routeId: routeId,
                        progress: startProgress, 
                        direction: 1,
                        speed: 2,
                        nextStopName: "",
                        isMoving: true,
                        stops: STOPS_CACHE[routeId]
                    };
                    console.log(`Đã nạp xe: ${bus.bus_id}`);
                }
            }
            startLoop();
        });
    });
}

function startLoop() {
    setInterval(() => {
        Object.keys(SIMULATION_CACHE).forEach(busId => {
            const bus = SIMULATION_CACHE[busId];
            const path = bus.points;

            bus.progress += (bus.speed * bus.direction);

            if (bus.progress >= path.length - 1) {
                bus.progress = path.length - 1;
                bus.direction = -1; 
            } else if (bus.progress <= 0) {
                bus.progress = 0;
                bus.direction = 1;  
            }

            const index = Math.floor(bus.progress);
            const point = path[index] || path[0]; 

            if (point) {
                let currentStopId = null;
                let nextStopName = "Đang cập nhật";
                let isMoving = true;

                let closestStopIndex = -1;
                let minDistance = 999999;

                bus.stops.forEach((stop, idx) => {
                    const dist = getDistanceFromLatLonInM(point[0], point[1], stop.lat, stop.lng);
                    if (dist < minDistance) {
                        minDistance = dist;
                        closestStopIndex = idx;
                    }
                });

                if (minDistance < 50) {
                    currentStopId = bus.stops[closestStopIndex].stop_id;
                    isMoving = false;
                    
                    const nextIdx = closestStopIndex + bus.direction;
                    if (nextIdx >= 0 && nextIdx < bus.stops.length) {
                        nextStopName = bus.stops[nextIdx].stop_name;
                    } else {
                        nextStopName = bus.direction === 1 ? "Hết tuyến" : "Về bến";
                    }
                } else {
                    isMoving = true;
                    const nextIdx = closestStopIndex + bus.direction;
                    if (nextIdx >= 0 && nextIdx < bus.stops.length) {
                        nextStopName = bus.stops[nextIdx].stop_name;
                    } else {
                        nextStopName = "Trạm cuối";
                    }
                }

                bus.nextStopName = nextStopName;
                bus.isMoving = isMoving;

                let sql = `UPDATE bus_location SET latitude = ?, longitude = ?, timestamp = NOW(), nearest_stop_id = ? WHERE bus_id = ?`;
                db.query(sql, [point[0], point[1], isMoving ? null : currentStopId, busId]);
            }
        });
    }, 1000);
}

const PORT = 8081;
app.listen(PORT, () => console.log(`Server dang chay tai: http://localhost:${PORT}`));