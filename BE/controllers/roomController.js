const Room = require("../models/Room");

// GET: Get schedule of a room by ID and date
exports.getRoomSchedule = async (req, res) => {
  const { room_id, date } = req.params;

  try {
    const room = await Room.findById(room_id);
    if (!room) return res.status(404).json({ error: "Room not found" });

    const schedule = room.schedules.find(
      (s) => s.date.toISOString().split("T")[0] === date
    );
    if (schedule) {
      return res.json(schedule);
    }

    return res.json({});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// PUT: Update room schedule
exports.updateRoomSchedule = async (req, res) => {
  const { room_id, date } = req.params;
  const { hours } = req.body;

  try {
    const room = await Room.findById(room_id);
    if (!room) return res.status(404).json({ error: "Room not found" });

    hours.for;

    // Only allow hours that start time is in the future
    const now = new Date();
    const futureHours = hours.filter((h) => new Date(h.start) > now);

    if (futureHours.length === 0) {
      return res.status(400).json({ error: "No valid future times provided." });
    }

    let schedule = room.schedules.find(
      (s) => s.date.toISOString().split("T")[0] === date
    );

    if (schedule) {
      schedule.hours = futureHours;
    } else {
      room.schedules.push({ date: new Date(date), hours: futureHours });
    }

    await room.save();
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// GET: Return all rooms
exports.getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch rooms" });
  }
};

// GET: Return one room by ID
exports.getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.room_id);
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }
    res.json(room);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch room" });
  }
};
