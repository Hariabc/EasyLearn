const express = require('express');
const router = express.Router();
const { register, login, getUser, forgotPassword, resetPassword, updateProfile, changePassword} = require('../controllers/authController');
const auth = require('../middleware/auth');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);      
router.post('/reset-password/:token', resetPassword);
router.put('/update-profile',auth, updateProfile);
router.put('/change-password',auth, changePassword);

// Protected routes
router.get('/user', auth, getUser);

module.exports = router;
