const Room = require('../models/Room');

exports.getAllRooms = async (req, res) => {
  const rooms = await Room.find();
  res.json(rooms);
};

exports.bookRoom = async (req, res) => {
  const { id } = req.body;
  const room = await Room.findById(id);
  if (!room) return res.status(404).json({ error: 'Room not found' });
  if (!room.isAvailable) return res.status(400).json({ error: 'Already booked' });
  room.isAvailable = false;
  await room.save();
  res.json({ message: 'Room booked successfully' });
};
