//UNIT TEST

// Function we are testing
function getUserRole(user) {
    if (user.isAdmin) return 'admin';
    if (user.isOrganizer) return 'organizer';
    return 'guest';
  }

  describe('getUserRole Function', () => {  // Testing user levels
    it('should return admin for users with isAdmin true', () => {
      const user = { isAdmin: true };
      expect(getUserRole(user)).toEqual('admin');
    });
  
    it('should return organizer for users with isOrganizer true', () => {
      const user = { isOrganizer: true };
      expect(getUserRole(user)).toEqual('organizer');
    });
  
    it('should return guest for users without isAdmin or isOrganizer', () => {
      const user = {};
      expect(getUserRole(user)).toEqual('guest');
    });
  });


  // INTEGRATION TEST
  const express = require('express');
  const app = express();

  //Testing if accessing the reviewEvents page is working correctly 
  app.get('/reviewEvents', (req, res) => {

    const user = req.query;  
    const role = getUserRole(user);
  
    if (role === 'admin') {
      res.status(200).send('Admin Content');
    } else {
      res.status(403).send('Access Denied');
    }
  });