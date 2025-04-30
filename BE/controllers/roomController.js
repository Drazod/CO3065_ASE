const Room = require("../models/room");

const toDMY = (date) => date.toISOString().split("T")[0].split("-").reverse().join("-");
const toHM = (date) => date.toISOString().split("T")[1].split(":").slice(0, 2).join(":");

// GET: Get schedule of a room by ID and date
exports.getRoomSchedule = async (req, res) => {
  const { room_id } = req.params;
  const { date } = req.body;

  try {
    const room = await Room.findById(room_id);
    if (!room) return res.status(404).json({ error: "Room not found" });

    const schedule = room.schedules.find(
      (s) => toDMY(s.date) === date
    );
    if (schedule) {
      return res.status(200).json(schedule);
    }

    return res.status(200).json({});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// POST: Book new room schedule
exports.bookRoomSchedule = async (req, res) => {
  const user = req.user;
  const { room_id } = req.params;
  const { schedules } = req.body;

  try {
    const room = await Room.findById(room_id);
    if (!room) return res.status(404).json({ error: "Room not found" });
    
    // Checking if schedules is an array and not empty
    if (!Array.isArray(schedules) || schedules.length === 0) {
      return res.status(400).json({ error: 'Please provide an array of schedules.' });
    }

    // Checking the validity of each schedule
    const newSchedule = schedules.map((sch, i) => {
      const _date = new Date(sch.date);
      const _start = new Date(sch.start);
      const _end = new Date(sch.end);
      if (isNaN(_date) || isNaN(_start) || isNaN(_end)) {
        throw { status: 400, message: `Invalid date format in schedules[${i}].` };
      }
      if (_end <= _start) {
        throw { status: 400, message: `The end time must be after the starting time in schedules[${i}].` };
      }
      return { date: _date, start: _start, end: _end };
    });

    // Checking overlapping schedules (New vs Old)
    for(let i = 0; i < newSchedule.length; i++) {
      const { date: new_date, start: new_start, end: new_end } = newSchedule[i];
      const formattedNewDate = toDMY(new_date);

      for (const oldSchedule of room.schedules) {
        if (toDMY(oldSchedule.date) !== formattedNewDate) continue; // Different dates

        if (new_start < oldSchedule.end && new_end > oldSchedule.start) { // Overlapping times
          return res.status(400).json({ error: `The schedule on ${formattedNewDate} at ${toHM(new_start)}-${toHM(new_end)} overlaps with an existing schedule at ${toHM(oldSchedule.start)}-${toHM(oldSchedule.end)}.` });
        }
      }
    }

    // Checking overlapping schedules (New vs New)
    for(let i = 0; i < newSchedule.length; i++) {
      for(let j = i + 1; j < newSchedule.length; j++) {
        if (toDMY(newSchedule[i].date) !== toDMY(newSchedule[j].date)) continue; // Different dates

        if (newSchedule[i].start < newSchedule[j].end && newSchedule[i].end > newSchedule[j].start) { // Overlapping times
          return res.status(400).json({ error: `The schedule on ${toDMY(newSchedule[i].date)} at ${toHM(newSchedule[i].start)}-${toHM(newSchedule[i].end)} overlaps with another schedule at ${toHM(newSchedule[j].start)}-${toHM(newSchedule[j].end)}.` });
        }
      }
    }

    newSchedule.forEach(({date, start, end}) => {
      room.schedules.push({
        date: date,
        start: start,
        end: end,
        bookedBy: user._id
      });
    });

    await room.save();
    return res.status(201).json({
      message: 'Schedules booked successfully.',
      added: newSchedule.map(({ date, start, end }) => ({
        date: date.toISOString().split('T')[0],
        start: start.toISOString(),
        end: end.toISOString()
      }))
    });
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

// PUT: Edit a room by ID
exports.editRoom = async (req, res) => {
  try {
    const { name, building, location, description, capacity, schedules } = req.body;
    
    // Check if another room with same name and building exists (excluding current room)
    const existingRoom = await Room.findOne({
      name,
      building,
      _id: { $ne: req.params.room_id }
    });
    
    if (existingRoom) {
      return res.status(400).json({ 
        error: "A room with this name already exists in the specified building" 
      });
    }
    
    // Find room and update
    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.room_id,
      { name, building, location, description, capacity, schedules },
      { new: true, runValidators: true }
    );
    
    if (!updatedRoom) {
      return res.status(404).json({ error: "Room not found" });
    }
    
    res.json({ success: true, room: updatedRoom });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update room" });
  }
};

// POST: Add a new room
exports.addRoom = async (req, res) => {
  try {
    const { name, building, location, description, capacity } = req.body;
    
    // Validate required fields
    if (!name || !building) {
      return res.status(400).json({ error: "Name and building are required fields" });
    }
    
    // Check if room with same name and building already exists
    const existingRoom = await Room.findOne({ name, building });
    if (existingRoom) {
      return res.status(400).json({ 
        error: "A room with this name already exists in the specified building" 
      });
    }
    
    // Create new room
    const newRoom = new Room({
      name,
      building,
      location: location || "CS1",
      description: description || "No description available",
      capacity: capacity || 30,
      schedules: [] // Initialize with empty schedules
    });
    
    // Save room to database
    await newRoom.save();
    
    res.status(201).json({ success: true, room: newRoom });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create room" });
  }
};