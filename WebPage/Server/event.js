//Router for event page - WIP 
const express = require('express');
const router = express.Router();
const pool = require('./database');

router.get('/',(req,res) => {
    res.send('Event');
});

router.get('/:eventID', async (req,res) => {
    try{
        const eventID = req.params.eventID;
        const [event] = await pool.query('SELECT * FROM eventInfo WHERE eventID=?',[eventID]);

        if (event.length === 0) {
            return res.status(404).send('Event not found');
        }
        res.render('event', { event: event[0] });
    }catch (error){
        console.error(error);
        res.status(500).send('An error occurred');
    }
});

module.exports=router;