// backend/server.js
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
app.use('/api/chat', require('./routes/chat'));        // existing message route
app.use('/api/chat', require('./routes/chatThreads')); // new thread routes

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// // In “production” (Render sets NODE_ENV=production), serve the React build
// if (process.env.NODE_ENV === 'production') {
//   // __dirname here = <root>/backend
//   const distPath = path.join(__dirname, '../frontend/dist');
//   app.use(express.static(distPath));
//   app.get('*', (req, res) => {
//     res.sendFile(path.join(distPath, 'index.html'));
//   });
// }

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
