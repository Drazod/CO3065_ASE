const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  date: Date, // ISO format YYYY-MM-DD
  start: Date,
  end: Date,
  bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const roomSchema = new mongoose.Schema({
  name: String,
  building: String,
  location: String,
  description: String, // for editRoom or detail page
  capacity: Number,
  schedules: [scheduleSchema]
});

module.exports = mongoose.model('Room', roomSchema);
