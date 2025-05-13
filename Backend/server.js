const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth'); // student auth routes

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
const connectDB = require('./config/db');
connectDB();

// Routes
app.use('/api/auth', authRoutes);

// Optional: Home route
app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
