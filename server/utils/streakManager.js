const UserStreak = require('../models/UserStreak');

/**
 * Updates or creates a user's streak record
 * @param {string} userId - The ID of the user
 * @returns {Promise<Object>} The updated streak record
 */
const updateUserStreak = async (userId) => {
    try {
        console.log('Updating streak for user:', userId);
        
        // Find or create streak record
        let streakRecord = await UserStreak.findOne({ userId });
        console.log('Current streak record:', streakRecord);
        
        if (!streakRecord) {
            console.log('Creating new streak record');
            streakRecord = new UserStreak({ userId });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const lastActive = new Date(streakRecord.lastActiveDate);
        lastActive.setHours(0, 0, 0, 0);

        // Calculate days difference
        const daysDiff = Math.floor((today - lastActive) / (1000 * 60 * 60 * 24));
        console.log('Days difference:', daysDiff);
        console.log('Today:', today);
        console.log('Last active:', lastActive);

        if (daysDiff === 1) {
            // Consecutive day - increment streak
            console.log('Incrementing streak');
            streakRecord.streakCount += 1;
        } else if (daysDiff > 1) {
            // Streak broken - reset to 1
            console.log('Resetting streak to 1');
            streakRecord.streakCount = 1;
        } else {
            console.log('Same day - no streak change');
        }

        // Update last active date
        streakRecord.lastActiveDate = today;
        
        // Save the updated record
        await streakRecord.save();
        console.log('Updated streak record:', streakRecord);
        
        return streakRecord;
    } catch (error) {
        console.error('Error updating user streak:', error);
        throw error;
    }
};

module.exports = {
    updateUserStreak
}; 