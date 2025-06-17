const express = require('express');
const router = express.Router();
const { register, login, getUser, forgotPassword, resetPassword } = require('../controllers/authController');
const auth = require('../middleware/auth');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);      
router.post('/reset-password/:token', resetPassword);

// Protected routes
router.get('/user', auth, getUser);

module.exports = router;
