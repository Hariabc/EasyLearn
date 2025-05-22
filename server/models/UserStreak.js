const mongoose = require('mongoose');

const userStreakSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    streakCount: {
        type: Number,
        default: 0
    },
    lastActiveDate: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const UserStreak = mongoose.model('UserStreak', userStreakSchema);

module.exports = UserStreak; 