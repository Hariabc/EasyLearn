import React, { useEffect, useState, useContext } from 'react';
import { Card, Typography } from '@material-tailwind/react';
import api from '../axios';
import { toast } from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';

const StreakDisplay = () => {
    const [streak, setStreak] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const { authToken } = useContext(AuthContext);

    const fetchStreak = async () => {
        try {
            const response = await api.get('/api/streaks/current', {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            setStreak(response.data.streakCount);
        } catch (error) {
            console.error('Error fetching streak:', error);
        }
    };

    useEffect(() => {
        if (authToken) {
            fetchStreak();
        }
    }, [authToken]);

    const handleStreakUpdate = async () => {
        try {
            const response = await api.post('/api/streaks/update', {}, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            const newStreak = response.data.streakCount;
            
            if (newStreak > streak) {
                setIsAnimating(true);
                toast.success(`🔥 Amazing! Your streak is now ${newStreak} days!`);
                setTimeout(() => setIsAnimating(false), 1000);
            }
            
            setStreak(newStreak);
        } catch (error) {
            console.error('Error updating streak:', error);
            toast.error('Failed to update streak');
        }
    };

    return (
        <Card className="p-4 bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg">
            <div className="flex items-center justify-between">
                <Typography variant="h5" className="font-bold">
                    🔥 Streak: {streak} days
                </Typography>
                <div className={`transition-transform duration-500 ${isAnimating ? 'scale-110' : 'scale-100'}`}>
                    {streak > 0 && '🔥'}
                </div>
            </div>
        </Card>
    );
};

export default StreakDisplay; 