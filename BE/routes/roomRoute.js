const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');


router.get('/rooms', roomController.getAllRooms);
router.get('/rooms/:room_id/schedule/:date', roomController.getRoomSchedule);
router.put('/rooms/:room_id/schedule/:date', roomController.updateRoomSchedule);


// router.post('/rooms/book', roomController.bookRoom);

module.exports = router;
