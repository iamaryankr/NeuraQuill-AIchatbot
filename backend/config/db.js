// backend/config/db.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      // these options are defaults in modern mongoose versions,
      // but you can include if you like:
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ Mongo connection error:', err.message);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
