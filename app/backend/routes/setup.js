// Database Setup Routes
const express = require('express');
const router = express.Router();
const db = require('../config/database');
const fs = require('fs').promises;
const path = require('path');

// Initialize database with schema and sample data
router.post('/init', async (req, res) => {
  try {
    const connection = await db.getConnection();
    
    // Read and execute schema
    const schemaPath = path.join(__dirname, '../../src/db/busapp.sql');
    const sampleDataPath = path.join(__dirname, '../../src/db/sample_data.sql');
    
    try {
      const schema = await fs.readFile(schemaPath, 'utf8');
      const sampleData = await fs.readFile(sampleDataPath, 'utf8');
      
      // Split SQL statements and execute them
      const schemaStatements = schema.split(';').filter(stmt => stmt.trim().length > 0);
      const dataStatements = sampleData.split(';').filter(stmt => stmt.trim().length > 0);
      
      // Execute schema
      for (const statement of schemaStatements) {
        if (statement.trim()) {
          await connection.query(statement.trim());
        }
      }
      
      // Execute sample data
      for (const statement of dataStatements) {
        if (statement.trim()) {
          await connection.query(statement.trim());
        }
      }
      
      connection.release();
      
      res.json({
        status: 'OK',
        message: 'Database initialized successfully with sample data'
      });
    } catch (fileError) {
      connection.release();
      console.error('File reading error:', fileError);
      res.status(500).json({
        status: 'ERROR',
        message: 'Error reading SQL files: ' + fileError.message
      });
    }
  } catch (error) {
    console.error('Database initialization error:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Database initialization failed: ' + error.message
    });
  }
});

// Check database status
router.get('/status', async (req, res) => {
  try {
    const connection = await db.getConnection();
    
    // Check if tables exist
    const [tables] = await connection.query("SHOW TABLES");
    const tableNames = tables.map(row => Object.values(row)[0]);
    
    // Get counts from each table
    const tableCounts = {};
    for (const tableName of tableNames) {
      try {
        const [countResult] = await connection.query(`SELECT COUNT(*) as count FROM \`${tableName}\``);
        tableCounts[tableName] = countResult[0].count;
      } catch (countError) {
        tableCounts[tableName] = 'Error: ' + countError.message;
      }
    }
    
    connection.release();
    
    res.json({
      status: 'OK',
      data: {
        tables: tableNames,
        counts: tableCounts,
        totalTables: tableNames.length
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: error.message
    });
  }
});

module.exports = router;