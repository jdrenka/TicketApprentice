const mysql = require('mysql');

// MySQL database configuration
const pool = mysql.createPool({
  connectionLimit: 10, // Maximum number of connections in the pool
  host: 'alphabrainsdb.c1i22w4g43sf.us-west-1.rds.amazonaws.com',
  user: 'admin',
  password: 'alphabrainsdb',
  database: 'AlphaBrainsDB'
});

module.exports = pool;