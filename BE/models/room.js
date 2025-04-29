const mongoose = require('mongoose');

/*
const hourSchema = new mongoose.Schema({
  start: Date,
  end: Date,
});
*/

const scheduleSchema = new mongoose.Schema({
  date: Date, // Format: 'DD-MM-YYYY'
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
