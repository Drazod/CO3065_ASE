const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const roomRoutes = require('./routes/roomRoute');

const PORT = process.env.PORT || 5000;
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', roomRoutes);


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));