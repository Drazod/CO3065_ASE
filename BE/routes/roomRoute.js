const express = require('express');
const router = express.Router();
const controller = require('../controllers/roomController');

router.get('/rooms', controller.getAllRooms);
router.post('/book', controller.bookRoom);

module.exports = router;
