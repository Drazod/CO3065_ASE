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

    const now = new Date();
    const inputDate = new Date(date); // Date from URL (example: 2025-04-27)

    const futureHours = hours.filter((h) => {
      const start = new Date(h.start);
      const end = new Date(h.end);

      // Check 1: start must be after now
      if (start <= now) return false;

      // Check 2: start and end must be on the same date as URL date
      const startDate = start.toISOString().split("T")[0];
      const endDate = end.toISOString().split("T")[0];
      const targetDate = inputDate.toISOString().split("T")[0];

      if (startDate !== targetDate || endDate !== targetDate) return false;

      return true;
    });

    if (futureHours.length === 0) {
      return res
        .status(400)
        .json({
          error:
            "No valid future times provided or times are not on the specified date.",
        });
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