const express = require('express');
const router = express.Router();
const { createMessage, getAllMessages } = require('../controllers/discussionController');
const { protect } = require('../middleware/authMiddleware');

// Protected route - requires authentication
router.post('/', protect, createMessage);

// Public route - anyone can view messages
router.get('/', getAllMessages);

module.exports = router; 