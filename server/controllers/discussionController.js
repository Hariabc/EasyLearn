const Discussion = require('../models/Discussion');

// Get all messages
exports.getAllMessages = async (req, res) => {
  try {
    const messages = await Discussion.find()
      .sort({ timestamp: -1 }); // Sort by newest first
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Error fetching messages", error: error.message });
  }
};

// Create a new message
exports.createMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const userEmail = req.user.email; // Get email from authenticated user

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    const newMessage = new Discussion({
      message,
      userEmail
    });

    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error posting message:", error);
    res.status(500).json({ message: "Error creating message", error: error.message });
  }
}; 