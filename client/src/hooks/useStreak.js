import { useState, useCallback } from 'react';
import api from '../axios';
import { toast } from 'react-hot-toast';

const useStreak = () => {
    const [streak, setStreak] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const fetchStreak = useCallback(async () => {
        try {
            const response = await api.get('/api/streaks/current');
            const streakCount = response?.data?.streakCount ?? 0;
            setStreak(streakCount);
        } catch (error) {
            console.error('Error fetching streak:', error?.message || error);
        }
    }, []);

    const updateStreak = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await api.post('/api/streaks/update');
            const newStreak = response?.data?.streakCount ?? streak;

            if (newStreak > streak) {
                toast.success(`🔥 Amazing! Your streak is now ${newStreak} days!`);
            }

            setStreak(newStreak);
            return newStreak;
        } catch (error) {
            console.error('Error updating streak:', error?.message || error);
            toast.error('Failed to update streak');
            return streak;
        } finally {
            setIsLoading(false);
        }
    }, [streak]);

    return {
        streak,
        isLoading,
        fetchStreak,
        updateStreak
    };
};

export default useStreak;
