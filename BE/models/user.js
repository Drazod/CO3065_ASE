const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  username: { type: String, unique: true },
  password: String,
  role: {
    type: String,
    enum: ['student', 'lecturer', 'staff', 'guest'],
    required: true
  },
  bookings: [
    {
      room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
      date: String,
      hour: Number
    }
  ]
});

module.exports = mongoose.model('User', userSchema);
