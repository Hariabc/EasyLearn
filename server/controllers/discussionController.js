const Discussion = require('../models/Discussion');

// GET all messages
exports.getMessages = async (req, res) => {
  try {
    const messages = await Discussion.find().sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch messages' });
  }
};

// POST a new message
exports.postMessage = async (req, res) => {
  const { senderId, senderName, content } = req.body;

  try {
    const message = await Discussion.create({ senderId, senderName, content });
    res.status(201).json({ message: 'Message sent', data: message });
  } catch (err) {
    res.status(500).json({ message: 'Failed to send message', error: err.message });
  }
};
