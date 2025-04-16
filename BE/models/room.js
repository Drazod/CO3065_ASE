const mongoose = require('mongoose');

const hourSchema = new mongoose.Schema({
  hour: Number, // 0–23
  occupied: { type: Boolean, default: false },
  bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

const scheduleSchema = new mongoose.Schema({
  date: String, // 'YYYY-MM-DD'
  hours: [hourSchema]
});

const roomSchema = new mongoose.Schema({
  name: String,
  building: String,
  location: String,
  schedules: [scheduleSchema]
});

module.exports = mongoose.model('Room', roomSchema);
