// const express = require('express');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const connectDB = require('./config/db');
// const authRoutes = require('./routes/authRoutes');
// const userRoutes = require('./routes/userRoutes');
// const courseRoutes = require('./routes/courseRoutes');
// const topicRoutes = require('./routes/topicRoutes');
// const languageRoutes = require('./routes/languageRoutes');
// const quizRoutes = require('./routes/quizRoutes');
// const feedbackRoutes = require('./routes/feedbackRoutes');
// const streakRoutes = require('./routes/streakRoutes');

// // Load environment variables
// dotenv.config();

// // Connect to MongoDB
// connectDB();

// const app = express();

// // Middleware
// app.use(express.json());

// // CORS setup — add your frontend URL here
// app.use(cors({
//   origin: ['http://localhost:5173', 'https://easylearn-1-bt4h.onrender.com'], // Updated render.com URL
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));

// // Test route
// app.get('/api/test', (req, res) => {
//   res.json({ message: 'Server is running!' });
// });

// // Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/courses', courseRoutes);
// app.use('/api/topics', topicRoutes);
// app.use('/api/languages', languageRoutes);
// app.use('/api/quizzes', quizRoutes);
// app.use('/api/feedbacks', feedbackRoutes);
// app.use('/api/streaks', streakRoutes);

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({
//     message: 'Something went wrong!',
//     error: process.env.NODE_ENV === 'development' ? err.message : undefined
//   });
// });

// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
//   console.log(`CORS enabled for http://localhost:5173 and https://easylearn-1-bt4h.onrender.com`);
// });

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require("socket.io");
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const courseRoutes = require('./routes/courseRoutes');
const topicRoutes = require('./routes/topicRoutes');
const languageRoutes = require('./routes/languageRoutes');
const quizRoutes = require('./routes/quizRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const streakRoutes = require('./routes/streakRoutes');
const discussionRoutes = require('./routes/discussionRoutes');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:5173', 'https://easylearn-1-bt4h.onrender.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/topics', topicRoutes);
app.use('/api/languages', languageRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/feedbacks', feedbackRoutes);
app.use('/api/streaks', streakRoutes);
app.use("/api/discussions", discussionRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 🔥 Create HTTP server and attach Socket.IO
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'https://easylearn-1-bt4h.onrender.com'],
    methods: ['GET', 'POST']
  }
});

// ✅ Socket.IO Chat Logic
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("sendMessage", async (data) => {
    try {
      const saved = await Discussion.create(data);
      io.emit("newMessage", saved);
    } catch (err) {
      console.error("Failed to save message:", err.message);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
