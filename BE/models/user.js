const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  username: { type: String, unique: true },
  password: String,
  role: {
    type: String,
    enum: ['student', 'lecturer', 'staff', 'guest'],
    required: true
  }
});

module.exports = mongoose.model('User', userSchema);
