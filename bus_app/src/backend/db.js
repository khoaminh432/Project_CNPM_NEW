// Database Connection Module
// For School Bus Driver Management System

const mysql = require('mysql2/promise');
require('dotenv').config();

// Create connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'busapp',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableDebug: process.env.DB_DEBUG === 'true',
  charset: 'utf8mb4'
});

// Test connection
pool.getConnection()
  .then(connection => {
    console.log(' Database connected successfully to busapp');
    connection.release();
  })
  .catch(err => {
    console.error(' Database connection failed:', err.message);
    process.exit(1);
  });

// Export pool for queries
module.exports = pool;
