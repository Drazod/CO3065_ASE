const Room = require('../models/room');

// Basic in-memory cache
const roomCache = new Map();
// Get room from cache or DB
async function getCachedRoom(roomId) {
  if (roomCache.has(roomId)) {
    return roomCache.get(roomId); // serve from cache
  }

  const room = await Room.findById(roomId);
  if (!room) throw new Error("Room not found");

  roomCache.set(roomId, room); // store in cache
  return room;
}
async function safeGetRoom(roomId) {
  try {
    return await getCachedRoom(roomId); // normal DB+cache logic
  } catch (err) {
    if (roomCache.has(roomId)) {
      console.warn(`[WARN] DB failed, serving cached room: ${roomId}`);
      return roomCache.get(roomId);
    } else {
      throw new Error("Room unavailable from both DB and cache");
    }
  }
}

// Optional: periodically refresh all rooms
async function refreshAllRooms() {
  const allRooms = await Room.find();
  allRooms.forEach(room => roomCache.set(room._id.toString(), room));
}

module.exports = {
  getCachedRoom,
  refreshAllRooms,
  safeGetRoom
};
