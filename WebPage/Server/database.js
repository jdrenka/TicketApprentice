const mysql = require('mysql');

// MySQL database configuration
const pool = mysql.createPool({
  connectionLimit: 10, // Maximum number of connections in the pool
  host: '34.67.230.194',
  user: 'root',
  password: 'alphabrainsdb',
  database: 'AlphaBrainsDB'
});

module.exports = pool;