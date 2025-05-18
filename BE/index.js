const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const roomRoutes = require("./routes/roomRoute");
const authRoutes = require("./routes/authRoute");
const { refreshAllRooms } = require('./utils/roomCache');

// Refresh every 5 minutes



const PORT = process.env.PORT || 5000;
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
setInterval(() => {
  refreshAllRooms()
    .then(() => console.log("Room cache refreshed"))
    .catch(console.error);
}, 5 * 60 * 1000);
// HEALTH-CHECK ROUTE
app.get("/", (req, res) => {
  res.send("API is running!");
});

app.use("/api", roomRoutes);
app.use("/api/auth", authRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
