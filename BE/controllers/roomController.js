const Room = require("../models/room");
const {safeGetRoom} = require('../utils/roomCache');
const User = require('../models/user'); 
const mongoose = require("mongoose");
const {sanitizeInput} = require('../utils/sanitizeUtils');
const logger = require('../utils/logger');


const toDMY = (date) => date.toISOString().split("T")[0].split("-").reverse().join("-");
const toHM = (date) => date.toISOString().split("T")[1].split(":").slice(0, 2).join(":");

// GET: Get schedule of a room by ID and date
exports.getRoomSchedule = async (req, res) => {
  const { room_id } = req.params;
  const { date } = req.body;

  try {
    const room = await safeGetRoom(room_id);
    if (!room) return res.status(404).json({ error: "Room not found" });

    const schedule = room.schedules.find(
      (s) => toDMY(s.date) === date
    );
    logger.info(`User ${req.user.username} checked schedule for room ${room_id} on ${date}`);
    if (schedule) {
      return res.status(200).json(schedule);
    }

    return res.status(200).json({});
  } catch (err) {
    logger.error(`Failed to get room schedule: ${err.message}`);
    res.status(500).json({ error: "Server error" });
  }
};

// POST: Book new room schedule
exports.bookRoomSchedule = async (req, res) => {
  const user = req.user;
  const { room_id } = req.params;
  const { schedules } = req.body;
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const room = await Room.findById(room_id).session(session);
    if (!room) return res.status(404).json({ error: "Room not found" });
    
    // Checking if schedules is an array and not empty
    if (!Array.isArray(schedules) || schedules.length === 0) {
      return res.status(400).json({ error: 'Please provide an array of schedules.' });
    }

    // Checking the validity of each schedule
    const newSchedule = schedules.map((sch, i) => {
      
      const schDate = sanitizeInput(sch.date);
      const schStart = sanitizeInput(sch.start);
      const schEnd = sanitizeInput(sch.end);

      const _date = new Date(schDate);
      const _start = schStart ? new Date(`${schDate}T${schStart}`) : null;
      const _end = schEnd ? new Date(`${schDate}T${schEnd}`) : null;

      // const _date = new Date(sch.date);
      // const _start = sch.start ? new Date(`${sch.date}T${sch.start}`) : null;
      // const _end = sch.end ? new Date(`${sch.date}T${sch.end}`) : null;
      if (isNaN(_date) || isNaN(_start) || isNaN(_end)) {
        throw { status: 400, message: `Invalid date format in schedules[${i}].` };
      }
      if (_end <= _start) {
        throw { status: 400, message: `The end time must be after the starting time in schedules[${i}].` };
      }
      return { date: _date, start: _start, end: _end };
    });

    // Checking overlapping schedules (New vs Old)
    for (let i = 0; i < newSchedule.length; i++) {
      const { date: new_date, start: new_start, end: new_end } = newSchedule[i];
      const formattedNewDate = toDMY(new_date);

      for (const oldSchedule of room.schedules) {
        if (toDMY(oldSchedule.date) !== formattedNewDate) continue;
        if (new_start < oldSchedule.end && new_end > oldSchedule.start) {
          return res.status(400).json({
            error: `The schedule on ${formattedNewDate} at ${toHM(new_start)}-${toHM(new_end)} overlaps with an existing schedule at ${toHM(oldSchedule.start)}-${toHM(oldSchedule.end)}.`
          });
        }
      }
    }

    for (let i = 0; i < newSchedule.length; i++) {
      for (let j = i + 1; j < newSchedule.length; j++) {
        if (toDMY(newSchedule[i].date) !== toDMY(newSchedule[j].date)) continue;
        if (newSchedule[i].start < newSchedule[j].end && newSchedule[i].end > newSchedule[j].start) {
          return res.status(400).json({
            error: `The schedule on ${toDMY(newSchedule[i].date)} at ${toHM(newSchedule[i].start)}-${toHM(newSchedule[i].end)} overlaps with another schedule at ${toHM(newSchedule[j].start)}-${toHM(newSchedule[j].end)}.`
          });
        }
      }
    }


    // Push schedules into room
    newSchedule.forEach(({ date, start, end }) => {
      room.schedules.push({
        date,
        start,
        end,
        bookedBy: user._id
      });
    });

    await room.save({ session });

    // Grab the newly inserted schedules with _id
    const inserted = room.schedules.slice(-newSchedule.length);

    // Update user bookings with booking IDs
    const userDoc = await User.findById(user._id).session(session);
    if (!userDoc) return res.status(404).json({ error: "User not found" });
    inserted.forEach((booking) => {
      userDoc.bookings.push({
        room: room._id,
        date: booking.date,
        start: booking.start,
        end: booking.end,
        scheduleId: booking._id
      });
    });


    await userDoc.save({ session });
    await session.commitTransaction();
    session.endSession();

    logger.info(`User ${user.username} booked room ${room._id} with ${inserted.length} schedule(s)`);

    return res.status(201).json({
      message: 'Schedules booked successfully.',
      added: newSchedule.map(({ date, start, end }) => ({
        date: date.toISOString().split('T')[0],
        start: start.toISOString(),
        end: end.toISOString()
      }))
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    logger.error(`Booking error: ${err.message}`);
    res.status(500).json({ error: "Server error during booking" });
  }
};

// PUT: Edit a schedule
exports.updateRoomSchedule = async (req, res) => {
  const user = req.user;
  const room_id = sanitizeInput(req.params.room_id);
  const schedule_id = sanitizeInput(req.params.schedule_id);

  const { date, start, end } = req.body;
  try {
    // Checking the validity of each schedule
    
    const _date = new Date(sanitizeInput(date));
    const _start = start ? new Date(`${date}T${sanitizeInput(start)}`) : null;
    const _end = end ? new Date(`${date}T${sanitizeInput(end)}`) : null;

    // const _date = new Date(date);
    // const _start = start ? new Date(`${date}T${start}`) : null;
    // const _end = end ? new Date(`${date}T${end}`) : null;
    if (isNaN(_date) || isNaN(_start) || isNaN(_end)) {
      throw { status: 400, message: `Invalid date format.` };
    }

    if (_end <= _start) {
      throw { status: 400, message: `The end time must be after the start time.` };
    }
    
    const room = await safeGetRoom(room_id);
    if (!room) return res.status(404).json({ error: "Room not found" });

    const schedule = room.schedules.id(schedule_id);
    if (!schedule) return res.status(404).json({ error: "Schedule not found" });

    // Checking if the user is authorized (bookedBy or staff)
    if (!schedule.bookedBy.equals(user._id) && user.role !== "staff") {
      return res.status(403).json({ error: "You are not authorized to edit this schedule" });
    }

    const formattedNewDate = toDMY(_date);

    for (const oldSchedule of room.schedules) {
      if (oldSchedule._id.equals(schedule_id)) continue; // Skip the updating schedule

      if (toDMY(oldSchedule.date) !== formattedNewDate) continue; // Different dates

      if (_start < oldSchedule.end && _end > oldSchedule.start) { // Overlapping times
        return res.status(400).json({ error: `The schedule at ${toHM(_start)}-${toHM(_end)} overlaps with an existing schedule at ${toHM(oldSchedule.start)}-${toHM(oldSchedule.end)}.` });
      }
    }

    // Push changes
    schedule.date = _date;
    schedule.start = _start;
    schedule.end = _end;

    await room.save();

    
    await User.updateOne(
      { _id: user._id, "bookings.scheduleId": schedule_id },
      {
        $set: {
          "bookings.$.date": _date,
          "bookings.$.start": _start,
          "bookings.$.end": _end
        }
      }
    );
    return res.status(200).json({
      message: 'Schedules updated successfully.',
      schedule: {
        id:    schedule._id,
        date:  schedule.date,
        start: schedule.start,
        end:   schedule.end,
        bookedBy: user._id,
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.findRooms = async (req, res) => {
  const { date, start, end, minCapacity } = req.body;

  if (!date) {
    return res.status(400).json({ error: "Date is required" });
  }

  const dateTime = new Date(date);
  const startTime = start ? new Date(`${date}T${start}`) : null;
  const endTime = end ? new Date(`${date}T${end}`) : null;

  if ((start && isNaN(startTime)) || (end && isNaN(endTime))) {
    return res.status(400).json({ error: "Invalid start or end time" });
  }

  try {
    const rooms = await Room.find();

    const availableRooms = rooms.filter(room => {
      if (minCapacity && room.capacity < minCapacity) return false;

      const bookingsOnDate = room.schedules.filter(s => {
        const formatted = toDMY(s.date);
        const targetDate = toDMY(dateTime);
        return formatted === targetDate;
      });

      if (!startTime || !endTime) {
        return bookingsOnDate.length === 0;
      }

      const hasConflict = bookingsOnDate.some(s => {
        const sStart = new Date(s.start);
        const sEnd = new Date(s.end);
        return startTime < sEnd && endTime > sStart;
      });

      return !hasConflict;
    });

    res.json(availableRooms);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch available rooms" });
  }
};


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
    const { name, building, location, description, capacity} = req.body;
    
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
      { name, building, location, description, capacity},
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
    const name = sanitizeInput(req.body.name);
    const building = sanitizeInput(req.body.building);
    const location = sanitizeInput(req.body.location || "CS1");
    const description = sanitizeInput(req.body.description || "No description available");
    const capacity = req.body.capacity || 30;

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