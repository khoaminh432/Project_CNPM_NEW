const fetch = require('node-fetch');

async function initializeDatabase() {
  try {
    console.log('Initializing database with sample data...');
    
    const response = await fetch('http://localhost:5000/api/setup/init', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    
    if (data.status === 'OK') {
      console.log('✅ Database initialized successfully!');
    } else {
      console.log('❌ Database initialization failed:', data.message);
    }
    
    // Check database status
    const statusResponse = await fetch('http://localhost:5000/api/setup/status');
    const statusData = await statusResponse.json();
    
    if (statusData.status === 'OK') {
      console.log('\n📊 Database Status:');
      console.log(`Total tables: ${statusData.data.totalTables}`);
      console.log('Table counts:');
      Object.entries(statusData.data.counts).forEach(([table, count]) => {
        console.log(`  ${table}: ${count} records`);
      });
    }
    
  } catch (error) {
    console.error('Error initializing database:', error.message);
  }
}

initializeDatabase();