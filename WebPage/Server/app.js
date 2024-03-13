const express = require('express');
const path = require('path');
const pool = require('./database'); // Import the MySQL connection pool
const app = express();
const port = process.env.PORT || 3000;

// Set views directory and view engine
app.set('views', path.join(__dirname, '..', 'Client'));
app.set('view engine', 'ejs');

// Middleware to serve static files
app.use(express.static(path.join(__dirname, '..', 'Client')));

// Route to serve browseEvents.ejs
app.get('/browse-events', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to MySQL: ', err);
      res.status(500).send('Error connecting to MySQL');
      return;
    }

    const query = 'SELECT * FROM eventInfo';

    connection.query(query, (error, events) => {
      connection.release();

      if (error) {
        console.error('Error executing query: ', error);
        res.status(500).send('Error executing query');
        return;
      }

      // Render the browseEvents.ejs template with real events
      res.render('browseEvents', { pageTitle: 'Browse Events', events });
    });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
