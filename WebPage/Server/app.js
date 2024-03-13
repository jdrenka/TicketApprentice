//Requires
const express = require('express');
const path = require('path');
const pool = require('./database');
const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');
const session = require('express-session');

const app = express();
const saltRounds = 10; //For encryption
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));

app.use(session({  //Session Config
  secret: 'f595f2a9d5c84f2c7',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: !true } // Set to true if using https
}));

// Middleware to serve static files
app.use(express.static(path.join(__dirname, '../client')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Route to serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'));
});

// ---------------- Code routes below this line ----------------

// Route to browse events
app.get('/browse-events', async (req, res) => {
  try {
    // Use the pool to execute the query with async/await
    const [events] = await pool.query('SELECT * FROM eventInfo');
    res.render('browseEvents', { pageTitle: 'Browse Events', events }); // 'events' contains rows returned by the query
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred');
  }
});

// Route to create account
app.post('/create-account', async (req, res) => {
  const { username, password, email, organizer } = req.body;
  try {
      const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
      const [result] = await pool.query(
          'INSERT INTO person (username, password, email, organizer) VALUES (?, ?, ?, ?)',
          [username, hashedPassword, email, organizer === 'on']
      );
      res.send('Account created successfully');
  } catch (err) {
      console.error(err);
      res.status(500).send('Error creating account');
  }
});

// Route to login
app.post('/login', async (req, res) => {
  const { usernameOrEmail, password } = req.body;
  try {
      const [users] = await pool.query('SELECT * FROM person WHERE username = ? OR email = ?', [usernameOrEmail, usernameOrEmail]);
      if (users.length > 0) {
          const match = await bcrypt.compare(password, users[0].password);
          if (match) {
              req.session.loggedin = true;
              req.session.username = users[0].username;
              req.session.organizer = users[0].organizer;
              res.redirect('/home');
          } else {
              res.send('Incorrect username and/or password!');
          }
      } else {
          res.send('Incorrect username and/or password!');
      }
  } catch (err) {
      console.error(err);
      res.status(500).send('Error logging in');
  }
});


// Route to home
app.get('/home', (req, res) => {
  if (req.session.loggedin) {
      res.send(`Welcome back, ${req.session.username}! Organizer: ${req.session.organizer}`);
  } else {
      res.send('Please login to view this page!');
  }
});





// ---------------- Code routes above this line ----------------

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
