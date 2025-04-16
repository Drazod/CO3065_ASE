const Room = require('../models/Room');

// GET: Retrieve room schedule for a specific date
exports.getRoomSchedule = async (req, res) => {
  const { room_id, date } = req.params;

  try {
    const room = await Room.findById(room_id);
    if (!room) return res.status(404).json({ error: 'Room not found' });

    const schedule = room.schedules.find(s => s.date === date);
    if (schedule) {
      return res.json(schedule);
    }

    // If no schedule exists, return empty default
    const defaultHours = Array.from({ length: 24 }, (_, hour) => ({
      hour,
      occupied: false,
      bookedBy: null,
    }));

    return res.json({ date, hours: defaultHours });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// PUT: Update room schedule (e.g., after booking)
exports.updateRoomSchedule = async (req, res) => {
  const { room_id, date } = req.params;
  const { hours } = req.body;

  try {
    const room = await Room.findById(room_id);
    if (!room) return res.status(404).json({ error: 'Room not found' });

    let schedule = room.schedules.find(s => s.date === date);

    if (schedule) {
      schedule.hours = hours;
    } else {
      room.schedules.push({ date, hours });
    }

    await room.save();
    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// GET: All rooms (for search/list)
exports.getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch rooms' });
  }
};


// exports.bookRoom = async (req, res) => {
//   return res.status(410).json({
//     error: 'Use schedule API to book specific times instead of whole-room flag.',
//   });
// };
