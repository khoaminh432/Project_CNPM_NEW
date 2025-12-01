// ...new file...
require('dotenv').config();
const mysql = require('mysql2/promise');

class Database {
  /**
   * @param {Object} [opts]
   * @param {number} [opts.connectionLimit]
   */
  constructor(opts = {}) {
    this.pool = mysql.createPool({
      host: process.env.DB_HOST || '127.0.0.1',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '',
      database: process.env.DB_NAME || 'busapp',
      port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
      waitForConnections: true,
      connectionLimit: opts.connectionLimit || 10,
      queueLimit: 0,
      timezone: 'Z',
    });
  }

  async query(sql, params = []) {
    const [rows] = await this.pool.query(sql, params);
    return rows;
  }

  async execute(sql, params = []) {
    const [result] = await this.pool.execute(sql, params);
    return result;
  }

  /**
   * Run a function inside a transaction. The callback receives a connection object
   * which can be used for .query / .execute. Example:
   * await db.transaction(async (conn) => {
   *   await conn.query('INSERT ...', [...]);
   *   await conn.query('UPDATE ...', [...]);
   * });
   */
  async transaction(fn) {
    const conn = await this.pool.getConnection();
    try {
      await conn.beginTransaction();
      const res = await fn(conn);
      await conn.commit();
      return res;
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }

  async getConnection() {
    return this.pool.getConnection();
  }

  async close() {
    await this.pool.end();
  }
}

module.exports = Database;
// ...new file...