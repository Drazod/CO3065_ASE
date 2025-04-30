const express = require("express");
const router = express.Router();
const roomController = require("../controllers/roomController");
const { verifyRole } = require("../controllers/authController");

router.get("/rooms/:room_id/schedule/", roomController.getRoomSchedule);
router.post("/rooms/:room_id/schedule/", verifyRole(["lecturer"]) , roomController.bookRoomSchedule);

router.get("/rooms", roomController.getAllRooms);
router.get("/rooms/:room_id", roomController.getRoomById);
router.post("/rooms", roomController.addRoom);
router.put("/rooms/:room_id", roomController.editRoom);

module.exports = router;
