const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

// Load .env vars
dotenv.config();

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',  // Fallback rỗng nếu .env thiếu
  database: process.env.MYSQL_DATABASE || 'bus_map',  // Fallback 'bus_map' như cũ
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
  .catch(err => console.error('MySQL pool connection error:', err));

module.exports = pool;