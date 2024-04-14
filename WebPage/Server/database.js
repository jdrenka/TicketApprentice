
const mysql = require('mysql2/promise');
// MySQL database configuration
const pool = mysql.createPool({
  connectionLimit: process.env.DB_CONNECTION_LIMIT || 10, // Fallback to 10 if not specified
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  queueLimit: 0
});

module.exports = pool;