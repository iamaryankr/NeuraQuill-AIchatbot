// backend/routes/chat.js
const express = require('express');
const router = express.Router();
const gemini = require('../utils/genaiClient');
const authMiddleware = require('../middleware/authMiddleware');
const Chat = require('../models/Chat'); // <— import Chat model

/**
 * @route   POST /api/chat/message
 * @desc    Accept user message, save it, forward full history to Gemini, save assistant reply, return assistant reply
 * @access  Private
 */
router.post('/message', authMiddleware, async (req, res) => {
  // Frontend sends:
  // {
  //   chatId: "<existing_chat_objectid>",
  //   message: "User’s new message content"
  // }
  const { chatId, message } = req.body;

  if (!chatId || !message) {
    return res.status(400).json({ message: 'chatId and message are required' });
  }

  try {
    const userId = req.user.id;

    // 1) Fetch the Chat thread to ensure it belongs to this user
    const chat = await Chat.findOne({ _id: chatId, user: userId });
    if (!chat) {
      return res.status(404).json({ message: 'Chat thread not found' });
    }

    // 2) Append the new user message to the Chat.messages array
    chat.messages.push({
      role: 'user',
      content: message,
      // timestamp defaults to Date.now()
    });

    // 3) Serialize ALL messages (including system, user, assistant) into one "contents" string.
    //    We rely on our previous pattern, where each message is prefixed by its role.
    const serialized = chat.messages
      .map((m) => `${m.role}: ${m.content}`)
      .join('\n');

    // 4) Call Gemini via the GenAI SDK
    const response = await gemini.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: serialized,
      // (Optionally: temperature, maxOutputTokens, etc.)
    });

    // 5) Extract assistant’s reply text
    const assistantText = response.text;

    // 6) Append assistant message to Chat.messages
    chat.messages.push({
      role: 'assistant',
      content: assistantText,
    });

    // 7) Optionally: update the chat's title if it’s still "New Chat". For example:
    if (chat.title === 'New Chat') {
      // Use the first user message (or truncate it) as a new title
      const firstUserMsg = chat.messages.find((m) => m.role === 'user');
      chat.title = firstUserMsg
        ? firstUserMsg.content.substring(0, 30) // first 30 chars
        : 'Chat';
    }

    // 8) Save the updated Chat document (with both messages)
    await chat.save();

    // 9) Return the assistant’s message to the frontend
    return res.json({
      assistant: {
        role: 'assistant',
        content: assistantText,
      },
      // Optionally: you could also return the full updated chat.messages array,
      // so the frontend can re-render the entire conversation without a separate fetch.
    });
  } catch (err) {
    console.error('Error in POST /api/chat/message:', err);
    // Extract more detailed error if possible
    const msg =
      err.details?.message ||
      err.response?.data?.error?.message ||
      err.message ||
      'Unknown error during chat';
    return res.status(500).json({ message: 'Server error in chat', details: msg });
  }
});

module.exports = router;
