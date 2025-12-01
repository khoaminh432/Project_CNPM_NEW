// const mysql = require('mysql2/promise');
// const dotenv = require('dotenv');

// // Load .env vars
// dotenv.config();

// const pool = mysql.createPool({
//   host: process.env.MYSQL_HOST || 'localhost',
//   user: process.env.MYSQL_USER || 'root',
//   password: process.env.MYSQL_PASSWORD || '',  // Fallback rỗng nếu .env thiếu
//   database: process.env.MYSQL_DATABASE || 'bus_map_merged',  // Fallback 'bus_map' như cũ
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0
// });

// // Test connection khi load module (optional, log error nếu fail)
// pool.getConnection()
//   .then(connection => {
//     console.log('MySQL pool connected successfully');
//     connection.release();
//   })
//   .catch(err => console.error('MySQL pool connection error:', err));

// module.exports = pool;



// chay bang xampp thi o tren, con docker duoi nay
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

// Load .env vars
dotenv.config();

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  
  // Sửa lại password thành 123456 (khớp với Docker bạn vừa tạo)
  password: process.env.MYSQL_PASSWORD || '123456', 
  
  // Sửa lại tên database thành 'bus_map' (tên bạn vừa đặt trong DBeaver)
  database: process.env.MYSQL_DATABASE || 'bus_map2', 
  
  port: process.env.MYSQL_PORT || 3306, // Thêm cổng 3306 cho chắc chắn
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test connection khi load module (optional, log error nếu fail)
pool.getConnection()
  .then(connection => {
    console.log('MySQL pool connected successfully');
    connection.release();
  })
  .catch(err => {
    console.error('----------------------------------------');
    console.error('KET NOI THAT BAI! Hay kiem tra lai Docker.');
    console.error('Loi chi tiet:', err.message);
    console.error('----------------------------------------');
  });

module.exports = pool;