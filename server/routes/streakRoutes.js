const express = require('express');
const router = express.Router();
const { updateUserStreak } = require('../utils/streakManager');
const UserStreak = require('../models/UserStreak');
const auth = require('../middleware/auth');

// Get user's current streak
router.get('/current', auth, async (req, res) => {
    try {
        console.log('Getting streak for user:', req.user.id);
        const streakRecord = await UserStreak.findOne({ userId: req.user.id });
        console.log('Found streak record:', streakRecord);
        res.json({ streakCount: streakRecord ? streakRecord.streakCount : 0 });
    } catch (error) {
        console.error('Error in /current route:', error);
        res.status(500).json({ message: 'Error fetching streak', error: error.message });
    }
});

// Update streak (called after completing a learning action)
router.post('/update', auth, async (req, res) => {
    try {
        console.log('Updating streak for user:', req.user.id);
        const streakRecord = await updateUserStreak(req.user.id);
        console.log('Updated streak record:', streakRecord);
        res.json({ 
            streakCount: streakRecord.streakCount,
            message: 'Streak updated successfully'
        });
    } catch (error) {
        console.error('Error in /update route:', error);
        res.status(500).json({ message: 'Error updating streak', error: error.message });
    }
});

module.exports = router; 