const express = require("express");
const router = express.Router();
const auth = require('../middleware/auth');
const { getMessages, postMessage } = require('../controllers/discussionController');

router.get('/', auth, getMessages);
router.post('/', auth, postMessage);

module.exports = router;