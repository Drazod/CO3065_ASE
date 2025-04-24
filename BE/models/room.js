const mongoose = require('mongoose');

const hourSchema = new mongoose.Schema({
  start: Date,
  end: Date,
  occupied: { type: Boolean, default: false },
  bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const scheduleSchema = new mongoose.Schema({
  date: Date, // Format: 'DD-MM-YYYY'
  hours: [hourSchema]
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
