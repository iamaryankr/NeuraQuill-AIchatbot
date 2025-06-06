// backend/routes/chatThreads.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Chat = require('../models/Chat');

// -----------------------------------------
// 1) Create New Chat Thread
// -----------------------------------------
// @route   POST /api/chat/new
// @desc    Create a new chat thread for the logged-in user
// @access  Private
router.post('/new', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    // Create a chat with no messages yet; title is default "New Chat"
    const newChat = new Chat({
      user: userId,
      messages: [],        // empty for now
    });

    const saved = await newChat.save();
    return res.status(201).json({ chat: saved });
  } catch (err) {
    console.error('Error creating chat thread:', err);
    return res.status(500).json({ message: 'Server error creating chat thread' });
  }
});

// -----------------------------------------
// 2) Get All Chat Threads for a User
// -----------------------------------------
// @route   GET /api/chat/threads
// @desc    Return an array of { _id, title, createdAt } for each thread belonging to user
// @access  Private
router.get('/threads', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    // Only select _id, title, createdAt so we can list threads
    const threads = await Chat.find({ user: userId })
      .sort({ createdAt: -1 })
      .select('_id title createdAt');

    return res.json({ threads });
  } catch (err) {
    console.error('Error fetching chat threads:', err);
    return res.status(500).json({ message: 'Server error fetching threads' });
  }
});

// -----------------------------------------
// 3) Get One Chat’s Messages
// -----------------------------------------
// @route   GET /api/chat/:chatId
// @desc    Return full Chat document (including messages array) for given chatId, but only if owned by user
// @access  Private
router.get('/:chatId', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { chatId } = req.params;

    const chat = await Chat.findOne({ _id: chatId, user: userId });
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }
    return res.json({ chat });
  } catch (err) {
    console.error('Error fetching chat messages:', err);
    return res.status(500).json({ message: 'Server error fetching chat' });
  }
});

// -----------------------------------------
// 4) Delete/Clear a Chat Thread
// -----------------------------------------
// @route   DELETE /api/chat/:chatId
// @desc    Delete a chat thread permanently (only if owned by user)
// @access  Private
router.delete('/:chatId', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { chatId } = req.params;

    const chat = await Chat.findOneAndDelete({ _id: chatId, user: userId });
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found or already deleted' });
    }
    return res.json({ message: 'Chat deleted successfully' });
  } catch (err) {
    console.error('Error deleting chat:', err);
    return res.status(500).json({ message: 'Server error deleting chat' });
  }
});

module.exports = router;
