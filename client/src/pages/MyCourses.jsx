import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../axios';
import { ArrowRightCircle } from 'lucide-react';

const MyCourses = () => {
  const { user, authToken } = useContext(AuthContext);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
        setTimeout(() => setLoading(false), 800);
      } catch (error) {
        console.error('Error fetching enrolled courses:', error);
        setLoading(false);
      }
    };

    if (user) fetchEnrolledCourses();
  }, [user, authToken]);

  const handleCourseView = (course) => {
    if (course?.slug && course?._id) {
      navigate(`/courses/${course.slug}?id=${course._id}`);
    } else if (course?.title) {
      const formattedTitle = course.title.toLowerCase().replace(/\s+/g, '');
      navigate(`/courses/${formattedTitle}?id=${course?._id || ''}`);
    } else {
      console.error('Cannot navigate to course view, missing slug or title:', course);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-blue-500 border-opacity-70"></div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 min-h-screen py-12 px-6 sm:px-10 lg:px-20">
      <h2 className="text-4xl font-bold text-white mb-10 text-center">My Enrolled Courses</h2>

      {enrolledCourses.length === 0 ? (
        <p className="text-center text-slate-400">You haven’t enrolled in any courses yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {enrolledCourses.map((item, index) => {
            const course = item.course;
            const rawPercent = Number(item?.completionPercent || item?.languages?.[0]?.completionPercent || 0);
            const percent = Math.min(100, parseFloat(rawPercent.toFixed(1)));
            const radius = 40;
            const stroke = 8;
            const CIRCUMFERENCE = 2 * Math.PI * radius;
            const offset = percent >= 99.95 ? 0 : ((100 - percent) / 100) * CIRCUMFERENCE;

            return (
              <div
                key={index}
                className="relative bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300"
              >
                {percent === 100 && (
                  <span className="absolute top-3 right-3 bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                    Completed
                  </span>
                )}

                <h3 className="text-xl font-semibold text-white mb-3 truncate">
                  {course?.title || 'Untitled Course'}
                </h3>

                <p className="text-sm text-slate-400 mb-3">Progress</p>

                <div className="relative flex justify-center items-center mb-5">
                  <svg width="100" height="100" className="transform -rotate-90">
                    <defs>
                      <linearGradient id={`grad-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#2563EB" />
                        <stop offset="100%" stopColor="#FB923C" />
                      </linearGradient>
                    </defs>
                    <circle
                      cx="50"
                      cy="50"
                      r={radius}
                      stroke="#334155"
                      strokeWidth={stroke}
                      fill="none"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r={radius}
                      stroke={`url(#grad-${index})`}
                      strokeWidth={stroke}
                      fill="none"
                      strokeDasharray={CIRCUMFERENCE}
                      strokeDashoffset={offset}
                      strokeLinecap="butt"
                      className="transition-all duration-1000 ease-in-out"
                    />
                  </svg>
                  <div className="absolute text-lg font-semibold text-white">{percent}%</div>
                </div>

                <button
                  onClick={() => handleCourseView(course)}
                  className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white font-medium py-2 rounded-xl hover:bg-blue-700 transition duration-200"
                >
                  Continue Learning <ArrowRightCircle className="w-5 h-5" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyCourses;
