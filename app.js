// app.js
const express = require('express');
require('dotenv').config();

const app = express();
app.use(express.json());

// MongoDB connection
const db = require("./common/connectDb");

const calendarRoutes = require('./routes/calendarRoutes');
app.use('/api/v1', calendarRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});