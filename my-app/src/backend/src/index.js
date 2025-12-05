const Database = require('./db/Database');
const db = new Database(); // hoặc new Database({ connectionLimit: 20 });

(async () => {
  try {
    const rows = await db.query('SELECT 1 + 1 AS sum');
    console.log('db test', rows);
  } catch (e) {
    console.error(e);
  }
})();