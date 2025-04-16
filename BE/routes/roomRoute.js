const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');

// Get all rooms (search, display, etc.)
router.get('/rooms', roomController.getAllRooms);

// Get a specific room's schedule on a date
// Example: GET /api/rooms/660123abc/schedule/2024-04-18
router.get('/rooms/:room_id/schedule/:date', roomController.getRoomSchedule);

// Update a room's schedule on a specific date (e.g., lecturer books a time slot)
router.put('/rooms/:room_id/schedule/:date', roomController.updateRoomSchedule);


// router.post('/rooms/book', roomController.bookRoom);

module.exports = router;
