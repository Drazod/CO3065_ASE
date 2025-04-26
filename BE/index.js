const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const roomRoutes = require("./routes/roomRoute");
const authRoutes = require("./routes/authRoute");

const PORT = process.env.PORT || 5000;
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// HEALTH-CHECK ROUTE
app.get("/", (req, res) => {
  res.send("API is running!");
});

app.use("/api", roomRoutes);
app.use("/api/auth", authRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
