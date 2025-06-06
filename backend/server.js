const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const path = require('path');

dotenv.config();
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/chat', require('./routes/chat'));        // message routes
app.use('/api/chat', require('./routes/chatThreads')); // thread routes

// In “production”, serve frontend
// if (process.env.NODE_ENV === 'production') {
//   const distPath = path.join(__dirname, '../frontend/dist');
//   app.use(express.static(distPath));
//   app.get(/(.*)/, (req, res) => {
//     res.sendFile(path.join(distPath, 'index.html'));
//   });
// }

// 404 fallback — MUST come last
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
