const mongoose = require('mongoose');
const roomSchema = new mongoose.Schema({
  name: String,
  isAvailable: Boolean,
});
module.exports = mongoose.model('Room', roomSchema);