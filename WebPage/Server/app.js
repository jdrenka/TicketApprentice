const express = require('express');
const path = require('path');
const pool = require('./database'); // Import the MySQL connection pool
const app = express();
const port = process.env.PORT || 3000;

// Middleware to serve static files
app.use(express.static(path.join(__dirname, '../client')));

// Route to serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'));
});

//Example of how we can query the DB through URL routes. This route returns JSON of all user data.  
app.get('/data', (req, res) => {
    pool.getConnection((err, connection) => {
      if (err) {
        console.error('Error connecting to MySQL: ', err);
        res.status(500).send('Error connecting to MySQL');
        return;
      }
  
      const query = 'SELECT * FROM users';
  
      connection.query(query, (error, results) => {
        connection.release();
  
        if (error) {
          console.error('Error executing query: ', error);
          res.status(500).send('Error executing query');
          return;
        }
  
        res.json(results);
      });
    });
  });

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
