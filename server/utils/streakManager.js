const UserStreak = require('../models/UserStreak');

/**
 * Updates or creates a user's streak record
 * @param {string} userId - The ID of the user
 * @returns {Promise<Object>} The updated streak record
 */
const updateUserStreak = async (userId) => {
    try {
        // Find or create streak record
        let streakRecord = await UserStreak.findOne({ userId });
        
        if (!streakRecord) {
            streakRecord = new UserStreak({ userId });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const lastActive = new Date(streakRecord.lastActiveDate);
        lastActive.setHours(0, 0, 0, 0);

        // Calculate days difference
        const daysDiff = Math.floor((today - lastActive) / (1000 * 60 * 60 * 24));

        if (daysDiff === 1) {
            // Consecutive day - increment streak
            streakRecord.streakCount += 1;
        } else if (daysDiff > 1) {
            // Streak broken - reset to 1
            streakRecord.streakCount = 1;
        } else {
            // Same day - no streak change
        }

        // Update last active date
        streakRecord.lastActiveDate = today;
        
        // Save the updated record
        await streakRecord.save();
        
        // return streakRecord;
    } catch (error) {
        // Optionally, log error if needed
        throw error;
    }
};

module.exports = {
    updateUserStreak
}; 