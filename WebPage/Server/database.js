
const mysql = require('mysql2/promise');
// MySQL database configuration
const pool = mysql.createPool({
  connectionLimit: 10, // Maximum number of connections in the pool
  host: '34.67.230.194',
  user: 'root',
  password: 'alphabrainsdb',
  database: 'AlphaBrainsDB',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;