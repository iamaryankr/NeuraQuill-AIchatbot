// backend/utils/genaiClient.js
const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

const gemini = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

module.exports = gemini;
