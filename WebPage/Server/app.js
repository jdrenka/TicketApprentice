//Requires
const express = require('express');
const path = require('path');
const pool = require('./database'); // Import the MySQL connection pool
const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');
const session = require('express-session');

const app = express();
const saltRounds = 10; //For encryption
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'f595f2a9d5c84f2c7',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: !true } // Set to true if using https
}));

// Middleware to serve static files
app.use(express.static(path.join(__dirname, '../client')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// =============================================================================================================================
// ========================================================= ROUTES ============================================================
// =============================================================================================================================

// Route to serve index.ejs 
app.get(['/', '/index'], (req, res) => {
  const loggedIn = req.session.loggedin;
  const userID = req.session.userID; 
  const username = req.session.username;
  const organizer = req.session.organizer;
  
  // Check if the user is logged in
  if (loggedIn) {                             
    // Redirect to browse-events if logged in
    res.redirect('/browse-events');
  } else {
    // Render index.ejs if not logged in
    res.render('index.ejs', { 
      pageTitle: 'Index', 
      loggedIn,
      userID,
      username,
      organizer  
    });
  }
});


// Route to serve signIn.ejs
app.get('/logout', (req, res) => {
  // Destroy the user's session
  req.session.destroy(err => {
    if (err) {
      console.log(err);
      res.status(500).send('Could not log out, please try again');
    } else {
      // Redirect to login page after logout
      res.redirect('/signIn.html');
    }
  });
});

// Route to serve browseEvents.ejs
app.get('/browse-events', async (req, res) => {
  try {
    const loggedIn = req.session.loggedin;
    const userID = req.session.userID; 
    const username = req.session.username;
    const organizer = req.session.organizer;

    const [events] = await pool.query('SELECT * FROM eventInfo');
    const [categories] = await pool.query('SELECT * FROM category');
    
    res.render('browseEvents', { 
      pageTitle: 'Browse Events', 
      events,
      loggedIn,
      userID,
      username,
      organizer,
      categories
     }); 
    
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred');
  }
});

// Route to serve contactUs.ejs
app.get('/contactUs', (req, res) => {
  const loggedIn = req.session.loggedin;
  const userID = req.session.userID; 
  const username = req.session.username;
  const organizer = req.session.organizer;
  res.render('contactUs.ejs', { 
    pageTitle: 'Contact Us', 
    loggedIn,
    userID,
    username,
    organizer
   }); 
});

// Route to serve createEvents.ejs
app.get('/createEvents', (req, res) => {
  const loggedIn = req.session.loggedin;
  const userID = req.session.userID; 
  const username = req.session.username;
  const organizer = req.session.organizer;
  res.render('createEvents.ejs', { 
    pageTitle: 'Create Events', 
    loggedIn,
    userID,
    username,
    organizer  
   }); 
  
});

// Route to serve contactOrganizer.ejs
app.get('/contactOrganizer', (req, res) => {
  const loggedIn = req.session.loggedin;
  const userID = req.session.userID; 
  const username = req.session.username;
  const organizer = req.session.organizer;
  res.render('contactOrganizer.ejs', { 
    pageTitle: 'Contact Organizer', 
    loggedIn,
    userID,
    username,
    organizer  
   }); 
  
});

// Route to serve contactOrganizer.ejs
app.get('/event', async (req, res) => {
  const loggedIn = req.session.loggedin;
  const userID = req.session.userID; 
  const username = req.session.username;
  const organizer = req.session.organizer;
  const eventId = req.query.eventId;
  const eventDetails = await getEventDetailsById(eventId);
  res.render('event.ejs', { 
    pageTitle: 'Event', 
    loggedIn,
    userID,
    username,
    organizer,
    event: eventDetails
   }); 
  
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
      res.redirect('signIn.html');
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
              req.session.userID = users[0].userID;
              req.session.username = users[0].username;
              req.session.organizer = users[0].organizer;
              res.redirect('/browse-events');
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

//Functions

async function getEventDetailsById(eventId) {
  try {
    const [results, fields] = await pool.query('SELECT * FROM eventInfo WHERE eventID = ?', [eventId]);
   
    return results[0]; // Directly return the first result
  } catch (error) {
    console.error('Error fetching event details:', error);
    throw error; // Rethrow or handle error as needed
  }
}

// =============================================================================================================================
// ====================================================== ROUTES ABOVE =========================================================
// =============================================================================================================================

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
