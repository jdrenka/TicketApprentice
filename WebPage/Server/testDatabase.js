
/*
Use this file to test the database connectivity.
Run 'node testDatabase.js' in the terminal to check if the database is connected.
*/
const pool = require('./database'); 

// Function to test database connectivity
const testDatabaseConnection = () => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to the database:', err.message);
      return;
    }

    console.log('Connected to the database');

    // Release the connection back to the pool
    connection.release();
  });
};

// Call the function to test the database connectivity
testDatabaseConnection();
