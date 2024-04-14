//Requires
require('dotenv').config({ path: 'C:/Users/Justin Drenka/Desktop/Alpha_Brains/.env' });
const express = require('express');
const path = require('path');
const pool = require('./database'); // Import the MySQL connection pool
const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');
const session = require('express-session');
const multer = require('multer');

const app = express();
const saltRounds = 10; //For encryption
const port = process.env.PORT || 3000;

//Storage settings for multer -> for our image uploads in createEvents
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/') // Make sure this directory exists
  },
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
});

const upload = multer({ storage: storage });

app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'f595f2a9d5c84f2c7',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: !true } // Set to true if using https
}));

// Middleware to serve static files
app.use(express.static(path.join(__dirname, '../client')));
app.use('/uploads', express.static('uploads'));

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
  const admin = req.session.isAdmin;
  
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
      organizer,
      admin

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
//modified to check for searchTerm from the searchbar. If it exists, it will render searchResults.ejs containing the results
app.get('/browse-events', async (req, res) => {
  try {
    const searchTerm = req.query.searchTerm;
    // Retrieve user-related information from the session
    const loggedIn = req.session.loggedin;
    const userID = req.session.userID; 
    const username = req.session.username;
    const organizer = req.session.organizer;
    const admin = req.session.isAdmin;
    let pageTitle = 'Browse Events';

    //for clicking on categories
    const categoryID = req.query.categoryID;

    if (searchTerm){
    // Your SQL query to search events based on the search term
    const query = 'SELECT * FROM eventInfo WHERE eventTitle LIKE ? OR description like ?';
    const [searchResults] = await pool.query(query, [`%${searchTerm}%`, `%${searchTerm}%`]);
    pageTitle = "Search Results";

    // Render the SearchResults.ejs page and pass the search results to it
    res.render('searchResults', { 
      pageTitle,
      searchResults,
      loggedIn,
      userID,
      username,
      organizer,
      admin
    });
    }
    else if (categoryID) { // Check if categoryID exists
      console.log ("GOT TO CATEGORY ID BLOCK");

      const categoryQuery = 'SELECT * FROM eventInfo WHERE categoryID = ?';
      const [searchResults] = await pool.query(categoryQuery, [categoryID]);
      // Your SQL query to retrieve events belonging to the specified category
      if (searchResults && searchResults.length > 0) {
        pageTitle = searchResults[0].categoryName; // Set pageTitle to category name
      }

      res.render('searchResults', { 
        pageTitle,
        searchResults,
        loggedIn,
        userID,
        username,
        organizer,
        admin
      });
    }
    else{
      const [events] = await pool.query('SELECT * FROM eventInfo');
      const [categories] = await pool.query('SELECT * FROM category');
      
      res.render('browseEvents', { 
        pageTitle,
        events,
        loggedIn,
        userID,
        username,
        organizer,
        categories,
        admin
      }); 
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred');
  }
});


/*
app.get('/browse-events/:searchTerm', async (req, res) => {
  try {
    console.log("successfuly ran function on line 117");
    const searchTerm = req.params.searchTerm; // Extract search term from URL parameters

    // Retrieve user-related information from the session
    const loggedIn = req.session.loggedin;
    const userID = req.session.userID; 
    const username = req.session.username;
    const organizer = req.session.organizer;

    // Your SQL query to search events based on the search term
    const query = 'SELECT * FROM eventInfo WHERE eventTitle LIKE ? OR description like ?';
    const [searchResults] = await pool.query(query, [`%${searchTerm}%`, `%${searchTerm}%`]);

    // Render the SearchResults.ejs page and pass the search results to it
    res.render('searchResults', { 
      searchResults,
      loggedIn,
      userID,
      username,
      organizer
   });
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred');
  }
});
*/

// Route to serve contactUs.ejs
app.get('/contactUs', (req, res) => {
  const loggedIn = req.session.loggedin;
  const userID = req.session.userID; 
  const username = req.session.username;
  const organizer = req.session.organizer;
  const admin = req.session.isAdmin;
  res.render('contactUs.ejs', { 
    pageTitle: 'Contact Us', 
    loggedIn,
    userID,
    username,
    organizer,
    admin
   }); 
});

// Route to handle contact form submission
app.post('/submitContactForm', async (req, res) => {
  const { firstName, lastName, email, subject, message } = req.body;
  try {
    // Insert the contact form data into the database
    const [result] = await pool.query(
      'INSERT INTO message (firstName, lastName, emailAddress, subject, message) VALUES (?, ?, ?, ?, ?)',
      [firstName, lastName, email, subject, message]
    );
    res.redirect('/messageSent')
  } catch (err) {
    console.error(err);
    res.status(500).send('Error submitting contact form');
  }
});


// Route to serve createEvents.ejs
app.get('/createEvents', (req, res) => {
  const loggedIn = req.session.loggedin;
  const userID = req.session.userID; 
  const username = req.session.username;
  const organizer = req.session.organizer;
  const admin = req.session.isAdmin;
  res.render('createEvents.ejs', { 
    pageTitle: 'Create Events', 
    loggedIn,
    userID,
    username,
    organizer,
    admin
   }); 
  
});

// Route to serve contactOrganizer.ejs
app.get('/contactOrganizer', (req, res) => {
  const loggedIn = req.session.loggedin;
  const userID = req.session.userID; 
  const username = req.session.username;
  const organizer = req.session.organizer;
  const admin = req.session.isAdmin;
  res.render('contactOrganizer.ejs', { 
    pageTitle: 'Contact Organizer', 
    loggedIn,
    userID,
    username,
    organizer,
    admin
   }); 
  
});

// Route to serve reviewEvents.ejs
app.get('/review-events', async (req, res) => {
  const loggedIn = req.session.loggedin;
  const userID = req.session.userID; 
  const username = req.session.username;
  const organizer = req.session.organizer;
  const admin = req.session.isAdmin;
  
  if (!req.session.isAdmin) { // Example check, adjust according to your auth logic
    return res.status(403).send('Unauthorized access.');
  }

  try {
    const [events] = await pool.query('SELECT * FROM eventQueue');
    const [messages] = await pool.query('SELECT * FROM message');

    res.render('reviewEvents', { events, loggedIn, userID, username, organizer, messages, admin});

  } catch (error) {
    console.error('Error fetching events for review:', error);
    res.status(500).send('Error fetching events for review');
  }
});

// Route to handle deleting a message
app.post('/delete-message', async (req, res) => {
  const { messageID } = req.body; 

  try {
    await pool.query('DELETE FROM message WHERE messageID = ?', [messageID]);
    
    res.redirect('/review-events');
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).send('Error deleting message');
  }
});

// Route to serve contactOrganizer.ejs
app.get('/event', async (req, res) => {
  const loggedIn = req.session.loggedin;
  const userID = req.session.userID; 
  const username = req.session.username;
  const organizer = req.session.organizer;
  const eventId = req.query.eventId;
  const admin = req.session.isAdmin;
  const eventDetails = await getEventDetailsById(eventId);
  res.render('event.ejs', { 
    pageTitle: 'Event', 
    loggedIn,
    userID,
    username,
    organizer,
    admin,
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
              req.session.isAdmin = users[0].admin;
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

// Route to serve profile.ejs
app.get('/profile', async (req, res) => {
  const loggedIn = req.session.loggedin;
  const userID = req.session.userID; 
  const username = req.session.username;
  const organizer = req.session.organizer;
  const admin = req.session.isAdmin;
  
  try {
    const [userData] = await pool.query('SELECT * FROM person WHERE userID = ?', [userID]);
    
    if (!userData || userData.length === 0) {
      console.log('No user data found');
      return res.status(404).send('User not found');
    }

    res.render('profile.ejs', { 
      pageTitle: 'Profile', 
      loggedIn,
      userID,
      username,
      organizer,
      admin,
      userData
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).send('An error occurred');
  }
});




// Route to update user profile
app.post('/update-profile', async (req, res) => {
  const userID = req.session.userID;
  const { firstName, lastName, email, address, city, country, zipCode, province } = req.body;
  try {
    await pool.query(
      'UPDATE person SET firstName = ?, lastName = ?, email = ?, address = ?, city = ?, country = ?, zipCode = ?, province = ? WHERE userID = ?',
      [firstName, lastName, email, address, city, country, zipCode, province, userID]
    );
    res.redirect('/profile'); // Redirect to the profile page after updating
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating profile');
  }
});

// Route to serve messageSent.ejs
app.get('/messageSent', (req, res) => {
  const loggedIn = req.session.loggedin;
  const userID = req.session.userID; 
  const username = req.session.username;
  const organizer = req.session.organizer;
  const admin = req.session.isAdmin;
  res.render('messageSent.ejs', { 
    pageTitle: 'Message Sent', 
    loggedIn,
    userID,
    username,
    organizer,
    admin
   }); 
});



// Route to serve submitting event
app.post('/submit-event', upload.single('coverPhoto'), async (req, res) => {

  const { eventTitle, eventDate, address, description, ticketPrice, numTickets, categoryID } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';
  console.log(req.body);
  try {
    await pool.query(
      'INSERT INTO eventQueue (eventTitle, coverPhoto, eventDate, address, description, ticketPrice, numTickets, categoryID) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [eventTitle, imageUrl, eventDate, address, description, ticketPrice, numTickets, categoryID]
    );
    res.redirect('/browse-events');
  } catch (error) {
    console.error('Error submitting event:', error);
    res.status(500).send('Error submitting event');
  }
});

//Approve button admin page funcitonality. 
app.post('/approve-event', async (req, res) => {
  const { queueID } = req.body;

  try {
      // Fetch the event data from the eventQueue table
      const [results, fields] = await pool.query('SELECT * FROM eventQueue WHERE queueID = ?', [queueID]);

      if (results.length > 0) {
          const eventData = results[0];
          // Inserting event from the queue into real event table. 
          await pool.query(
              'INSERT INTO eventInfo (eventTitle, eventDate, address, coverPhoto, description, ticketPrice, numTickets, categoryID) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
              [eventData.eventTitle, eventData.eventDate, eventData.address, eventData.coverPhoto, eventData.description, eventData.ticketPrice, eventData.numTickets, eventData.categoryID]
          );

          //This deletes the event from the admin queue
          await pool.query('DELETE FROM eventQueue WHERE queueID = ?', [queueID]);

          // Redirect after complete
          res.redirect('/browse-events'); 
      } else {
          // Handle the case where no event data is found
          res.status(404).send('Event not found');
      }
  } catch (error) {
      console.error('Error processing approval:', error);
      res.status(500).send('Error processing approval');
  }
});
// Simply removes event from eventQueue on admin page.
app.post('/reject-event', async (req, res) => {
  const { queueID } = req.body;

  try {
      // Attempt to delete the event from the eventQueue table
      const [result] = await pool.query('DELETE FROM eventQueue WHERE queueID = ?', [queueID]);

      if (result.affectedRows > 0) {
          // If the event was successfully deleted, redirect or respond
          res.redirect('/review-events'); // Adjust the redirect path as needed
      } else {
          // If no rows were affected, it means no event was found with that queueID
          res.status(404).send('Event not found or already rejected');
      }
  } catch (error) {
      console.error('Error processing rejection:', error);
      res.status(500).send('Error processing rejection');
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
