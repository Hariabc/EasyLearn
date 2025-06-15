import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../axios';

const MyCourses = () => {
  const { user, authToken } = useContext(AuthContext);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/users/enrolled-courses', {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        setEnrolledCourses(response.data.enrolledCourses);
        setTimeout(() => setLoading(false), 1000); // Fake 1s delay for smooth spinner
      } catch (error) {
        console.error('Error fetching enrolled courses:', error);
        setLoading(false);
      }
    };

    if (user) fetchEnrolledCourses();
  }, [user, authToken]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-70"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-black mb-6">My Enrolled Courses</h2>

      {enrolledCourses.length === 0 ? (
        <p className="text-gray-500">You haven’t enrolled in any courses yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrolledCourses.map((item, index) => {
            const percent = item.languages[0]?.completionPercent || 0;
            const CIRCUMFERENCE = 2 * Math.PI * 40; // ≈ 251.2
            const offset = (CIRCUMFERENCE * (100 - percent)) / 100;

            return (
              <div
                key={index}
                className="bg-white border border-blue-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition duration-200"
              >
                <h3 className="text-xl font-semibold text-black mb-2">
                  {item.course?.title || 'Untitled Course'}
                </h3>

                <p className="text-sm text-gray-500 mb-4">Progress</p>

                <div className="relative flex justify-center items-center">
                  <svg width="100" height="100" className="transform -rotate-90">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#e0e7ff"
                      strokeWidth="10"
                      fill="none"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#3B82F6"
                      strokeWidth="10"
                      fill="none"
                      strokeDasharray="251.2"
                      strokeDashoffset={offset}
                      className="transition-all duration-500 ease-in-out"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute text-lg font-bold text-blue-700">
                    {percent}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyCourses;
