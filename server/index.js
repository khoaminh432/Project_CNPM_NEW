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
        console.log('Da ket noi Database thanh cong!');
        initSimulation();
    }
});

//1. CÁC API HỆ THỐNG =======================

// LOGIN
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    
    // Tìm trong bảng users trước
    const sqlUser = "SELECT * FROM users WHERE username = ? AND password = ?";
    db.query(sqlUser, [username, password], (err, results) => {
        if (err) return res.status(500).json(err);
        
        if (results.length > 0) {
            const userAccount = results[0];
            
            if (userAccount.role === 'parent') {
                const sqlParent = "SELECT parent_id, name FROM parent WHERE user_id = ?";
                db.query(sqlParent, [userAccount.user_id], (errP, resP) => {
                    if (resP && resP.length > 0) {
                        res.json({ 
                            success: true, 
                            user: { 
                                username: resP[0].name, 
                                role: 'parent', 
                                linked_id: resP[0].parent_id 
                            } 
                        });
                    } else {
                        res.json({ success: true, user: { username: userAccount.username, role: 'parent', linked_id: null } });
                    }
                });
            } else {
                res.json({ success: true, user: { username: userAccount.username, role: userAccount.role, linked_id: userAccount.linked_id } });
            }
        } else {
             res.status(401).json({ success: false, message: "Sai tài khoản hoặc mật khẩu" });
        }
    });
});

// PROFILE: Lấy thông tin
app.get('/api/profile', (req, res) => db.query("SELECT * FROM parent WHERE parent_id = ?", [req.query.id], (e, d) => res.json(d[0] || {})));

// PROFILE: Cập nhật thông tin
app.put('/api/profile', (req, res) => { 
    const { name, phone, email, age, sex, parent_id } = req.body; 
    db.query("UPDATE parent SET name=?, phone=?, email=?, age=?, sex=? WHERE parent_id=?", 
    [name, phone, email, age, sex, parent_id], 
    (e) => {
        if(e) return res.status(500).json(e);
        res.json({ message: "Cập nhật thành công" }); 
    }); 
});

// STUDENTS: Lấy danh sách (Đã thêm school_name và gender)
app.get('/api/students', (req, res) => {
    db.query("SELECT student_id, parent_id, name, class_name as class, school_name, gender FROM student", (e, d) => res.json(d));
});

// STUDENTS: Thêm học sinh (Đã thêm school_name và gender)
app.post('/api/students', (req, res) => { 
    const id = 'HS' + Date.now().toString().slice(-5); 
    const { name, studentClass, school, gender, parent_id } = req.body;

    db.query("INSERT INTO student (student_id, parent_id, name, class_name, school_name, gender) VALUES (?, ?, ?, ?, ?, ?)", 
    [id, parent_id, name, studentClass, school, gender], 
    (err) => {
        if(err) return res.status(500).json(err);
        res.json({ message: "Added", student_id: id }); 
    }); 
});

app.delete('/api/students/:id', (req, res) => db.query("DELETE FROM student WHERE student_id = ?", [req.params.id], () => res.json({ message: "Deleted" })));

// ROUTE
app.get('/api/routes', (req, res) => db.query("SELECT * FROM route", (e, d) => res.json(d)));

app.get('/api/route-detail', (req, res) => { 
    db.query("SELECT r.route_name, r.start_point, r.end_point, s.stop_name, s.address, s.stop_id FROM route r JOIN bus_stop s ON r.route_id = s.route_id WHERE r.route_id = ? ORDER BY s.stop_order ASC", 
    [req.query.id], (err, data) => res.json(err || data)); 
});

app.get('/api/route-path', (req, res) => { 
    db.query("SELECT stop_id, stop_name FROM bus_stop WHERE route_id = ? ORDER BY stop_order ASC", [req.query.id || 'R01'], (err, data) => res.json(err ? [] : data)); 
});

// ======================= 2. BUS & SCHEDULE =======================

app.get('/api/active-buses-by-route', (req, res) => { 
    const sql = `SELECT bus_id, license_plate FROM bus WHERE default_route_id = ? AND status = 'Đang hoạt động'`; 
    db.query(sql, [req.query.id], (err, data) => res.json(err || data)); 
});

app.get('/api/bus-schedule-info', (req, res) => { 
    const sql = `SELECT d.name, d.phone, d.driver_id, s.start_time, s.schedule_id, s.schedule_date 
                 FROM bus_schedule s 
                 JOIN driver d ON s.driver_id = d.driver_id 
                 WHERE s.bus_id = ? 
                 ORDER BY ABS(DATEDIFF(s.schedule_date, NOW())) ASC, s.start_time ASC LIMIT 1`; 
    db.query(sql, [req.query.busId], (err, data) => res.json(err || data[0] || {})); 
});

// ======================= 3. TRẠNG THÁI HỌC SINH =======================

app.get('/api/route-students-status', (req, res) => {
    const routeId = req.query.id;
    const parentId = req.query.parentId;
    const scheduleId = req.query.scheduleId;

    if (!scheduleId) {
        let sql = `SELECT st.student_id, st.name, st.class_name as class, bs.stop_name, bs.stop_id, 'Chưa lên xe' as pickup_status 
                   FROM student st 
                   JOIN bus_stop bs ON st.stop_id = bs.stop_id 
                   WHERE bs.route_id = ?`;
        if (parentId) { sql += " AND st.parent_id = ?"; }
        db.query(sql, parentId ? [routeId, parentId] : [routeId], (err, data) => res.json(err || data));
        return;
    }

    let sql = `
        SELECT st.student_id, st.name, st.class_name as class, bs.stop_name, bs.stop_id, 
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

app.post('/api/update-student-status', (req, res) => {
    const { student_id, status, driver_id, stop_id, schedule_id } = req.body;
    if (!schedule_id) return res.status(400).json({ error: "Thiếu schedule_id" });

    db.query("SELECT pickup_id FROM student_pickup WHERE student_id = ? AND schedule_id = ?", [student_id, schedule_id], (err, results) => {
        if (results.length > 0) {
            db.query("UPDATE student_pickup SET status = ?, stop_id = ?, driver_id = ?, pickup_time = NOW() WHERE pickup_id = ?", 
            [status, stop_id, driver_id, results[0].pickup_id], () => res.json({message: "Updated"}));
        } else {
            const pid = 'DT' + Date.now();
            db.query(`INSERT INTO student_pickup (pickup_id, student_id, driver_id, schedule_id, pickup_time, status, stop_id) VALUES (?, ?, ?, ?, NOW(), ?, ?)`, 
            [pid, student_id, driver_id, schedule_id, status, stop_id], () => res.json({message: "Inserted"}));
        }
    });
});

app.get('/api/bus-locations', (req, res) => {
    let sql = `SELECT bl.*, b.default_route_id 
               FROM bus_location bl 
               JOIN bus b ON bl.bus_id = b.bus_id 
               WHERE b.status = 'Đang hoạt động'`;
    
    let params = [];
    if (req.query.busId) { sql += ` AND bl.bus_id = ?`; params.push(req.query.busId); }
    else if (req.query.routeId) { sql += ` AND b.default_route_id = ?`; params.push(req.query.routeId); }
    
    sql += " ORDER BY bl.timestamp DESC LIMIT 10"; 

    db.query(sql, params, (err, data) => {
        if(err) return res.json(err);
        const enrichedData = data.map(bus => {
            const simData = SIMULATION_CACHE[bus.bus_id];
            return simData 
                ? { ...bus, next_stop_name: simData.nextStopName, is_moving: simData.isMoving, latitude: bus.latitude, longitude: bus.longitude } 
                : { ...bus, is_moving: false, next_stop_name: bus.vi_tri_text };
        });
        res.json(enrichedData);
    });
});

app.get('/api/home-summary', (req, res) => {
    if (!req.query.parentId) {
        return db.query("SELECT b.license_plate, b.status, b.bus_id, r.route_name, r.route_id FROM bus b LEFT JOIN route r ON b.default_route_id = r.route_id WHERE b.status = 'Đang hoạt động' LIMIT 1", (err, data) => res.json(err || data[0] || {}));
    }
    const sql = `
        SELECT DISTINCT b.license_plate, b.status, b.bus_id, r.route_name, r.route_id 
        FROM parent p 
        JOIN student s ON p.parent_id = s.parent_id 
        JOIN bus_stop bs ON s.stop_id = bs.stop_id 
        JOIN route r ON bs.route_id = r.route_id 
        LEFT JOIN bus b ON r.route_id = b.default_route_id 
        WHERE p.parent_id = ? AND b.status = 'Đang hoạt động' 
        LIMIT 1`;
        
    db.query(sql, [req.query.parentId], (err, data) => res.json(data && data.length > 0 ? data[0] : {}));
});

app.get('/api/notifications', (req, res) => {
    db.query("SELECT * FROM notification WHERE recipient_type = 'parent' OR recipient_type = 'system' ORDER BY created_at DESC", (err, data) => res.json(err || data));
});

app.put('/api/notifications/:id', (req, res) => db.query("UPDATE notification SET status = ? WHERE id = ?", [req.body.status, req.params.id], (err) => res.json(err || {msg:"ok"})));
app.put('/api/notifications-mark-all', (req, res) => db.query("UPDATE notification SET status = 'read' WHERE recipient_type = 'parent'", (err) => res.json(err || {msg:"ok"})));
app.delete('/api/notifications/:id', (req, res) => db.query("DELETE FROM notification WHERE id = ?", [req.params.id], (err) => res.json(err || {msg:"ok"})));

// ======================= HỆ THỐNG GIẢ LẬP =======================

let SIMULATION_CACHE = {}; 
let STOPS_CACHE = {};      

function initSimulation() {
    console.log("He thong gia lap da khoi dong...");
}

const PORT = 8081;
app.listen(PORT, () => console.log(`Server dang chay tai: http://localhost:${PORT}`));